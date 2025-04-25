import { api } from './config';
import { Task, ApiResponse } from './types';

export const taskService = {
  // Get all tasks
  getAllTasks: async (): Promise<Task[]> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks');
    return response.data.data || [];
  },

  // Create a new task
  createTask: async (prompt: string): Promise<Task> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', { prompt });
    return response.data.data!;
  },

  // Delete a task
  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete<ApiResponse<void>>(`/tasks/${taskId}`);
  },

  // Update a task
  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${taskId}`, updates);
    return response.data.data!;
  }
}; 