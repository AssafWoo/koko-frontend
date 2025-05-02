import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task } from '@/types';
import './TaskEditor.less';

interface TaskEditorProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  onSave: (task: Task) => void;
}

const TaskEditor: React.FC<TaskEditorProps> = ({ isOpen, onClose, task, onSave }) => {
  const [editedTask, setEditedTask] = useState<Task>({ ...task });

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  const handleScheduleChange = (field: string, value: string) => {
    setEditedTask(prev => {
      const newSchedule = {
        ...prev.schedule,
        [field]: value,
      } as NonNullable<Task['schedule']>;

      // Reset dependent fields when frequency changes
      if (field === 'frequency') {
        newSchedule.day = null;
        newSchedule.date = null;
        newSchedule.time = null;
        newSchedule.interval = undefined;
      }

      return {
        ...prev,
        schedule: newSchedule,
      };
    });
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
            onChange={(e) => handleScheduleChange('frequency', e.target.value)}
          >
            <option value="once">Once</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {editedTask.schedule?.frequency === 'weekly' && (
          <div className="formControl">
            <label>Day of Week</label>
            <select
              value={editedTask.schedule?.day || ''}
              onChange={(e) => handleScheduleChange('day', e.target.value)}
            >
              <option value="">Select day</option>
              <option value="monday">Monday</option>
              <option value="tuesday">Tuesday</option>
              <option value="wednesday">Wednesday</option>
              <option value="thursday">Thursday</option>
              <option value="friday">Friday</option>
              <option value="saturday">Saturday</option>
              <option value="sunday">Sunday</option>
            </select>
          </div>
        )}

        {(editedTask.schedule?.frequency === 'once' || editedTask.schedule?.frequency === 'monthly') && (
          <div className="formControl">
            <label>Date</label>
            <input
              type="date"
              value={editedTask.schedule?.date || ''}
              onChange={(e) => handleScheduleChange('date', e.target.value)}
            />
          </div>
        )}

        <div className="formControl">
          <label>Time</label>
          <input
            type="time"
            value={editedTask.schedule?.time || ''}
            onChange={(e) => handleScheduleChange('time', e.target.value)}
          />
        </div>

        <div className="buttonGroup">
          <button className="cancelButton" onClick={onClose}>Cancel</button>
          <button className="saveButton" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskEditor; 