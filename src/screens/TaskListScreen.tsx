import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskService } from '../client/api/taskService';
import type { Task } from '../client/api/types';
import styles from './TaskListScreen.module.css';

const TaskListScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const fetchedTasks = await taskService.getAllTasks();
      setTasks(fetchedTasks);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setLoading(false);
    }
  };

  const handleTaskPress = (task: Task) => {
    navigate(`/tasks/${task.id}`);
  };

  const handleCreateTask = () => {
    navigate('/tasks/create');
  };

  const renderTaskItem = (task: Task) => (
    <div
      className={styles.taskCard}
      onClick={() => handleTaskPress(task)}
    >
      <div className={styles.taskHeader}>
        <span className={styles.taskType}>{getTaskTypeEmoji(task.type)}</span>
        <p className={styles.taskDescription}>
          {task.description}
        </p>
      </div>
      {task.schedule && (
        <p className={styles.scheduleText}>
          {formatSchedule(task.schedule)}
        </p>
      )}
      <div 
        className={styles.statusBadge}
        style={{ backgroundColor: getStatusColor(task.status) }}
      >
        <span className={styles.statusText}>
          {getStatusText(task.status, task.schedule)}
        </span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.taskList}>
        {tasks.map(task => (
          <div key={task.id}>
            {renderTaskItem(task)}
          </div>
        ))}
      </div>
      <button
        className={styles.fab}
        onClick={handleCreateTask}
      >
        <span className={styles.fabIcon}>+</span>
      </button>
    </div>
  );
};

// Helper functions
const getTaskTypeEmoji = (type: string) => {
  switch (type) {
    case 'reminder':
      return '⏰';
    case 'fetch':
      return '🔍';
    case 'summary':
      return '📝';
    case 'learning':
      return '🧠';
    default:
      return '📋';
  }
};

const formatSchedule = (schedule: Task['schedule']) => {
  if (!schedule) return '';
  const { frequency, time, day, date } = schedule;
  let scheduleText = '';
  if (frequency === 'every_x_minutes' && schedule.interval) {
    scheduleText = `every ${schedule.interval} minutes`;
  } else {
    scheduleText = frequency;
    if (time) scheduleText += ` at ${time}`;
    if (day) scheduleText += ` on ${day}`;
    if (date) scheduleText += ` on ${date}`;
  }
  return scheduleText;
};

const getStatusText = (status: Task['status'], schedule?: Task['schedule']) => {
  if (status === 'scheduled' && schedule) {
    return `Scheduled: ${formatSchedule(schedule)}`;
  }
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'running':
      return 'Running';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return 'Pending';
  }
};

const getStatusColor = (status: Task['status']) => {
  switch (status) {
    case 'completed':
      return '#4CAF50';
    case 'failed':
      return '#F44336';
    case 'running':
      return '#2196F3';
    case 'pending':
      return '#FFC107';
    default:
      return '#9E9E9E';
  }
};

export default TaskListScreen; 