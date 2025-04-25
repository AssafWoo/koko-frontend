import React, { useState } from 'react';
import { Box, Text, IconButton, HStack, VStack, Badge, useColorModeValue, useBreakpointValue, Button, Flex, useToast } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import type { Task } from '@/types';
import TaskContent from '../TaskContent/TaskContent';
import { TaskStatus } from '../../../server/types';
import { formatTime } from '../../../server/utils/timeUtils';

interface TaskCardProps {
  task: Task;
  onDelete: () => Promise<void>;
  onClick: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onDelete,
  onClick
}) => {
  const [showContent, setShowContent] = useState(false);
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const buttonSize = useBreakpointValue({ base: 'xs', sm: 'sm', md: 'sm' });
  const fontSize = useBreakpointValue({ base: 'md', sm: 'lg', md: 'xl' });
  const descriptionSize = useBreakpointValue({ base: 'sm', sm: 'md', md: 'md' });
  const toast = useToast();

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

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

  const getStatusText = (status: TaskStatus, schedule?: Task['schedule']) => {
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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'green';
      case 'failed':
        return 'red';
      case 'running':
        return 'blue';
      case 'pending':
        return 'yellow';
      default:
        return 'gray';
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete task',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      p={{ base: 3, sm: 4 }}
      borderWidth="1px"
      borderRadius="lg"
      onClick={onClick}
      cursor="pointer"
      _hover={{ bg: hoverBg }}
      w="100%"
      position="relative"
      transition="all 0.2s"
      borderColor={getStatusColor(task.status || 'pending')}
      opacity={task.status === 'completed' ? 0.8 : 1}
    >
      <VStack align="start" spacing={{ base: 2, sm: 3 }}>
        <HStack justify="space-between" w="100%" spacing={2}>
          <HStack spacing={2} maxW="70%">
            <Text fontSize={fontSize}>{getTaskTypeEmoji(task.type)}</Text>
            <Text 
              fontWeight="bold" 
              fontSize={descriptionSize}
              noOfLines={2}
              wordBreak="break-word"
            >
              {task.description}
            </Text>
          </HStack>
          <HStack spacing={1}>
            <IconButton
              aria-label="View task"
              icon={<ViewIcon />}
              size={buttonSize}
              onClick={(e) => handleActionClick(e, () => setShowContent(!showContent))}
            />
            <IconButton
              aria-label="Delete task"
              icon={<DeleteIcon />}
              size={buttonSize}
              onClick={(e) => handleActionClick(e, handleDelete)}
            />
          </HStack>
        </HStack>
        {task.schedule && (
          <Text fontSize="sm" color="gray.500" noOfLines={1}>
            {formatSchedule(task.schedule)}
          </Text>
        )}
        <Badge 
          colorScheme={getStatusColor(task.status || 'pending')}
          fontSize="sm"
          px={2}
          py={1}
          borderRadius="md"
        >
          {getStatusText(task.status || 'pending', task.schedule)}
        </Badge>
        {showContent && <TaskContent task={task} onClose={() => setShowContent(false)} />}
      </VStack>
    </Box>
  );
};

export default TaskCard; 