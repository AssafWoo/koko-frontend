import { useAtom } from 'jotai';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@chakra-ui/react';
import { TaskService } from '@/services/taskService';
import { 
  tasksAtom, 
  isLoadingAtom, 
  activeFilterAtom,
  filteredTasksAtom,
  selectedTaskAtom,
  fetchTasks
} from '@/atoms/tasks';
import type { Task } from '@/types';

export const useTaskState = () => {
  const [tasks, setTasks] = useAtom(tasksAtom);
  const [, setIsLoading] = useAtom(isLoadingAtom);
  const [activeFilter, setActiveFilter] = useAtom(activeFilterAtom);
  const [filteredTasks] = useAtom(filteredTasksAtom);
  const [selectedTask] = useAtom(selectedTaskAtom);
  const { isAuthenticated } = useAuth();
  const toast = useToast();

  const createTask = async (prompt: string): Promise<Task> => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }
    
    setIsLoading(true);
    try {
      const result = await TaskService.createTask(prompt);
      // Fetch updated tasks list
      await fetchTasks(setTasks);
      toast({
        title: 'Task Created',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      return result;
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
  };

  const deleteTask = async (taskId: string): Promise<void> => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }
    
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
  };

  return {
    tasks,
    isLoading: false,
    activeFilter,
    selectedTask,
    createTask,
    deleteTask,
    setActiveFilter,
  };
}; 