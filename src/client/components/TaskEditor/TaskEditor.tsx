import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '../../types';
import './TaskEditor.less';

interface TaskEditorProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSave: (updatedTask: Task) => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ isOpen, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <motion.div 
      className="taskEditor"
      initial={{ opacity: 0 }}
      animate={{ opacity: isOpen ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="modalContent">
        <h2 className="modalHeader">Edit Task</h2>
        
        <div className="formControl">
          <label>Description</label>
          <input
            type="text"
            value={editedTask.description}
            onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
          />
        </div>

        <div className="formControl">
          <label>Schedule Type</label>
          <select
            value={editedTask.schedule?.frequency || 'once'}
            onChange={(e) => setEditedTask({
              ...editedTask,
              schedule: {
                frequency: e.target.value as 'once' | 'daily' | 'weekly' | 'monthly' | 'hourly' | 'every_x_minutes',
                time: editedTask.schedule?.time || '',
                day: undefined,
                date: undefined,
                interval: editedTask.schedule?.interval,
              },
            })}
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="hourly">Hourly</option>
            <option value="every_x_minutes">Every X Minutes</option>
          </select>
        </div>

        {editedTask.schedule?.frequency === 'every_x_minutes' && (
          <div className="formControl">
            <label>Interval (minutes)</label>
            <input
              type="number"
              min="1"
              value={editedTask.schedule?.interval || 1}
              onChange={(e) => setEditedTask({
                ...editedTask,
                schedule: {
                  ...editedTask.schedule!,
                  interval: parseInt(e.target.value),
                },
              })}
            />
          </div>
        )}

        <div className="formControl">
          <label>Time</label>
          <input
            type="time"
            value={editedTask.schedule?.time || ''}
            onChange={(e) => setEditedTask({
              ...editedTask,
              schedule: {
                ...editedTask.schedule!,
                time: e.target.value,
              },
            })}
          />
        </div>

        <button className="button" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default TaskEditor; 