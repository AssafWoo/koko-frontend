import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@chakra-ui/react';
import type { Task } from '@/types';
import { useAtom } from 'jotai';
import { tasksAtom } from '@/atoms/tasks';

export const useTaskUpdates = () => {
  const { isAuthenticated } = useAuth();
  const toast = useToast();
  const [, setTasks] = useAtom(tasksAtom);

  useEffect(() => {
    if (!isAuthenticated) return;

    const token = localStorage.getItem('token');
    const eventSource = new EventSource(`${import.meta.env.VITE_API_URL}/api/notifications?token=${token}`);

    eventSource.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      
      switch (notification.type) {
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

        case 'task_started': {
          setTasks((old) => {
            if (!old) return [];
            return old.map((task) =>
              task.id === notification.taskId
                ? { ...task, status: 'running' }
                : task
            );
          });
          toast({
            title: 'Task Started',
            description: `Task "${notification.content.message}" is now running`,
            status: 'info',
            duration: 3000,
            isClosable: true,
          });
          break;
        }

        case 'task_completed': {
          setTasks((old) => {
            if (!old) return [];
            return old.map((task) =>
              task.id === notification.content.metadata.taskId
                ? { ...task, status: 'completed' }
                : task
            );
          });
          toast({
            title: notification.content.title,
            description: notification.content.message,
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
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
          setTasks((old) => {
            if (!old) return [];
            return old.map((task) =>
              task.id === notification.content.metadata.taskId
                ? { ...task, status: 'running' }
                : task
            );
          });
          toast({
            title: notification.content.title,
            description: notification.content.message,
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: 'top-right',
          });
          break;
        }
      }
    };

    eventSource.onerror = (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [isAuthenticated, toast, setTasks]);
}; 