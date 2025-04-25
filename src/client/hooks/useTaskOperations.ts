import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@chakra-ui/react';
import { TaskService } from '@/services/taskService';
import { isLoadingAtom, selectedTaskIdAtom, tasksAtom, fetchTasks } from '@/atoms/tasks';
import type { Task } from '@/types';

export const useTaskOperations = () => {
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [, setSelectedTaskId] = useAtom(selectedTaskIdAtom);
  const [, setTasks] = useAtom(tasksAtom);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const createTask = useCallback(async (prompt: string) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const newTask = await TaskService.createTask(prompt);
      // Fetch updated tasks list
      await fetchTasks(setTasks);
      toast({
        title: 'Task Created',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      return newTask;
    } catch (error) {
      console.error('Error creating task:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, setIsLoading, setTasks, toast]);

  const deleteTask = useCallback(async (taskId: string) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      await TaskService.deleteTask(taskId);
      // Fetch updated tasks list
      await fetchTasks(setTasks);
      toast({
        title: 'Task Deleted',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, setIsLoading, setTasks, toast]);

  const selectTask = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
  }, [setSelectedTaskId]);

  return {
    createTask,
    deleteTask,
    selectTask
  };
}; 