import type { Task } from '@/types';

const API_URL = import.meta.env.VITE_API_URL;

export class TaskService {
  private static getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  static async createTask(prompt: string): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error('Failed to create task');
    }

    const data = await response.json();
    if (!data.task) {
      throw new Error('Invalid response format');
    }
    return data.task;
  }

  static async getTasks(): Promise<Task[]> {
    const response = await fetch(`${API_URL}/api/tasks`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    const data = await response.json();
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format');
    }
    return data;
  }

  static async deleteTask(taskId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to delete task');
    }
  }

  static async reactivateTask(taskId: string): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}/reactivate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to reactivate task');
    }

    const data = await response.json();
    if (!data.task) {
      throw new Error('Invalid response format');
    }
    return data.task;
  }

  static async getTask(taskId: string): Promise<Task> {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to get task');
    }

    const data = await response.json();
    if (!data.task) {
      throw new Error('Invalid response format');
    }
    return data.task;
  }
}