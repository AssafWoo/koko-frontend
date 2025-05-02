import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@chakra-ui/react';
import type { Task, NotificationContent } from '@/types';
import { useAtom } from 'jotai';
import { tasksAtom } from '@/atoms/tasks';

export const useTaskUpdates = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [, setTasks] = useAtom(tasksAtom);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/notifications?token=${token}`);

    eventSource.onmessage = (event) => {
      try {
        const notification = JSON.parse(event.data);
        console.log('Received notification:', notification); // Debug log
        
        switch (notification.type) {
          case 'connection': {
            console.log('SSE connection established');
            break;
          }

          case 'heartbeat': {
            // Keep connection alive
            break;
          }

          case 'task_created': {
            setTasks((old) => {
              if (!old) return [notification.task];
              return [...old, notification.task];
            });
            toast({
              title: 'New Task Created',
              description: notification.task.description,
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
            break;
          }

          case 'task_updated': {
            setTasks((old) => {
              if (!old) return [];
              return old.map((task) => 
                task.id === notification.task.id ? notification.task : task
              );
            });
            toast({
              title: 'Task Updated',
              description: `Task "${notification.task.description}" status: ${notification.task.status}`,
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
            break;
          }

          case 'task_deleted': {
            setTasks((old) => {
              if (!old) return [];
              return old.filter((task) => task.id !== notification.taskId);
            });
            toast({
              title: 'Task Deleted',
              status: 'info',
              duration: 3000,
              isClosable: true,
            });
            break;
          }

          case 'taskStarted': {
            const content = notification.content as NotificationContent;
            const taskId = content.metadata?.taskId;
            if (taskId) {
              setTasks((old) => {
                if (!old) return [];
                return old.map((task) =>
                  task.id === taskId
                    ? { ...task, status: 'running' }
                    : task
                );
              });
              toast({
                title: content.title,
                description: content.message,
                status: 'info',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
            }
            break;
          }

          case 'taskCompleted': {
            const content = notification.content as NotificationContent;
            const taskId = content.metadata?.taskId;
            if (taskId) {
              setTasks((old) => {
                if (!old) return [];
                return old.map((task) =>
                  task.id === taskId
                    ? { ...task, status: 'completed' }
                    : task
                );
              });
              toast({
                title: content.title,
                description: content.message,
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
            }
            break;
          }

          case 'task_failed': {
            setTasks((old) => {
              if (!old) return [];
              return old.map((task) =>
                task.id === notification.taskId
                  ? { ...task, status: 'failed' }
                  : task
              );
            });
            toast({
              title: 'Task Failed',
              description: `Task "${notification.task.description}" has failed`,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            break;
          }

          case 'task_due': {
            const content = notification.content as NotificationContent;
            const taskId = content.metadata?.taskId;
            if (taskId) {
              setTasks((old) => {
                if (!old) return [];
                return old.map((task) =>
                  task.id === taskId
                    ? { ...task, status: 'running' }
                    : task
                );
              });
              toast({
                title: content.title,
                description: content.message,
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top-right',
              });
            }
            break;
          }

          default: {
            console.warn('Unknown notification type:', notification.type);
          }
        }
      } catch (error) {
        console.error('Error processing notification:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
      
      // Attempt to reconnect after a delay
      setTimeout(() => {
        if (isAuthenticated) {
          console.log('Attempting to reconnect to SSE...');
          // The effect will re-run and create a new connection
        }
      }, 5000);
    };

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, toast, setTasks]);
}; 