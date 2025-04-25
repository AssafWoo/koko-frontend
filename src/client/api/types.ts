export interface Task {
  id: string;
  description: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  schedule?: {
    frequency: string;
    time?: string;
    day?: string;
    date?: string;
    interval?: number;
  };
  createdAt: string;
  lastExecution?: string;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
} 