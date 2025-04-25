import React from 'react';
import { Box, Text, IconButton, VStack, HStack, useDisclosure } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import type { Task } from '../../types';
import './TaskContent.less';

interface TaskContentProps {
  task: Task;
  onClose: () => void;
}

const TaskContent: React.FC<TaskContentProps> = ({ task, onClose }) => {
  const getTaskTypeEmoji = (type: Task['type']) => {
    switch (type) {
      case 'summary':
        return '📝';
      case 'fetch':
        return '🔍';
      case 'reminder':
        return '⏰';
      default:
        return '';
    }
  };

  return (
    <Box className="taskContentPage">
      <VStack align="stretch" spacing={4}>
        <HStack justify="space-between" width="100%">
          <HStack>
            <IconButton
              aria-label="Go back"
              icon={<ChevronLeftIcon />}
              onClick={onClose}
              size="sm"
              variant="ghost"
            />
            <Text className="pageTitle">
              {getTaskTypeEmoji(task.type)} {task.description}
            </Text>
          </HStack>
        </HStack>

        <Box className="contentContainer">
          <Text className="contentText">
            {task.previewResult}
          </Text>
        </Box>

        {task.logs && task.logs.length > 0 && (
          <Box className="logsContainer">
            <Text className="logsTitle">Task History</Text>
            <VStack align="stretch" spacing={2}>
              {task.logs.map((log, index) => (
                <Box key={index} className="logEntry">
                  <Text className="logTime">
                    {new Date(log.timestamp).toLocaleString()}
                  </Text>
                  <Text className="logMessage">{log.message}</Text>
                </Box>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default TaskContent; 