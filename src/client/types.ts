export interface Schedule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'once';
  day?: string;  // For weekly: 'Monday', 'Tuesday', etc.
  time?: string; // Format: 'HH:mm'
  date?: string; // For once: 'YYYY-MM-DD'
}

export interface NotificationContent {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  icon?: string;
  actions?: Array<{
    label: string;
    url?: string;
    callback?: string;
  }>;
  metadata?: {
    taskId: string;
    taskType: string;
    timestamp: string;
    [key: string]: any;
  };
}

export interface Task {
  id: string;
  createdAt: string;
  prompt: string;
  type: 'reminder' | 'summary' | 'fetch' | 'learning';
  source: string | null;
  schedule: {
    frequency: 'once' | 'daily' | 'weekly' | 'monthly' | 'hourly' | 'every_x_minutes' | 'continuous';
    interval?: number;
    time: string | null;
    day: string | null;
    date: string | null;
  } | null;
  action: string;
  parameters: {
    type: 'reminder' | 'summary' | 'fetch' | 'learning';
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    tags?: string[];
    sources?: string[];
    format?: 'bullet' | 'paragraph';
    length?: 'short' | 'medium' | 'long';
    url?: string;
    selector?: string;
    topic?: string;
    level?: 'beginner' | 'intermediate' | 'advanced';
    [key: string]: any;
  };
  previewResult: string;
  deliveryMethod: 'in-app' | 'email' | 'slack';
  description: string;
  logs: Array<{
    timestamp: string;
    message: string;
  }>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  lastExecution: number | null;
  isActive: boolean;
} 