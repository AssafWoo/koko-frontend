import { atom } from 'jotai';
import { TaskService } from '@/services/taskService';
import type { Task } from '@/types';

// Base tasks atom
export const tasksAtom = atom<Task[]>([]);

// Selected task ID atom
export const selectedTaskIdAtom = atom<string | null>(null);

// Atom for selected task
export const selectedTaskAtom = atom((get) => {
  const tasks = get(tasksAtom);
  const selectedId = get(selectedTaskIdAtom);
  return tasks.find(task => task.id === selectedId) || null;
});

// Loading state atom
export const isLoadingAtom = atom(false);

// Filter state atom
export const activeFilterAtom = atom<'all' | 'pending' | 'completed' | 'deleted'>('all');

// Filtered tasks atom
export const filteredTasksAtom = atom((get) => {
  const tasks = get(tasksAtom);
  const filter = get(activeFilterAtom);
  
  switch (filter) {
    case 'pending':
      return tasks.filter(task => task.status?.toLowerCase() === 'pending');
    case 'completed':
      return tasks.filter(task => task.status?.toLowerCase() === 'completed');
    case 'deleted':
      return tasks.filter(task => task.status?.toLowerCase() === 'deleted');
    default:
      return tasks;
  }
});

// Function to fetch tasks
export const fetchTasks = async (setTasks: (tasks: Task[]) => void) => {
  try {
    const tasks = await TaskService.getTasks();
    setTasks(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    setTasks([]);
  }
}; 