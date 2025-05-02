import React, { useState } from 'react';
import { Box, Text, IconButton, HStack, VStack, Badge, useColorModeValue, useBreakpointValue, Button, Flex, useToast } from '@chakra-ui/react';
import { DeleteIcon, ViewIcon } from '@chakra-ui/icons';
import type { Task } from '@/types';
import TaskContent from '../TaskContent/TaskContent';

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
    
    switch (frequency) {
      case 'once':
        scheduleText = 'Once';
        if (date) scheduleText += ` on ${new Date(date).toLocaleDateString()}`;
        if (time) scheduleText += ` at ${time}`;
        break;
      case 'daily':
        scheduleText = 'Daily';
        if (time) scheduleText += ` at ${time}`;
        break;
      case 'weekly':
        scheduleText = 'Weekly';
        if (day) scheduleText += ` on ${day.charAt(0).toUpperCase() + day.slice(1)}`;
        if (time) scheduleText += ` at ${time}`;
        break;
      case 'monthly':
        scheduleText = 'Monthly';
        if (date) scheduleText += ` on day ${date}`;
        if (time) scheduleText += ` at ${time}`;
        break;
      default:
        scheduleText = frequency;
    }
    return scheduleText;
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString(undefined, { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      })
    };
  };

  const formatTime = (time: string | null) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: string | null) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const getStatusText = (status: Task['status']) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
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
      borderColor={getStatusColor(task.status)}
      opacity={task.status?.toLowerCase() === 'completed' ? 0.8 : 1}
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
        
        {task.scheduledTime && (
          <Box 
            bg={useColorModeValue('gray.50', 'gray.700')} 
            p={2} 
            borderRadius="md" 
            w="100%"
          >
            <VStack align="start" spacing={1}>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.500">📅</Text>
                <Text fontSize="sm" fontWeight="medium">
                  {formatDateTime(task.scheduledTime).date}
                </Text>
              </HStack>
              <HStack spacing={2}>
                <Text fontSize="sm" color="gray.500">⏰</Text>
                <Text fontSize="sm" fontWeight="medium">
                  {formatDateTime(task.scheduledTime).time}
                </Text>
              </HStack>
            </VStack>
          </Box>
        )}

        {task.schedule && !task.scheduledTime && (
          <VStack align="start" spacing={1} w="100%">
            <Text fontSize="sm" color="gray.500">
              {formatSchedule(task.schedule)}
            </Text>
            <HStack spacing={4}>
              {task.schedule.date && (
                <Text fontSize="sm" color="gray.600">
                  📅 {formatDate(task.schedule.date)}
                </Text>
              )}
              {task.schedule.time && (
                <Text fontSize="sm" color="gray.600">
                  ⏰ {formatTime(task.schedule.time)}
                </Text>
              )}
            </HStack>
          </VStack>
        )}

        <HStack spacing={2} w="100%" justify="space-between">
          <HStack spacing={2}>
            <Badge 
              colorScheme={getStatusColor(task.status)}
              fontSize="sm"
              px={3}
              py={1}
              borderRadius="md"
              textTransform="uppercase"
              fontWeight="bold"
            >
              {getStatusText(task.status)}
            </Badge>
            {task.type && (
              <Badge 
                colorScheme="purple"
                fontSize="sm"
                px={2}
                py={1}
                borderRadius="md"
              >
                {task.type}
              </Badge>
            )}
          </HStack>
          {task.lastRunAt && (
            <Text fontSize="xs" color="gray.500">
              Last run: {formatDateTime(task.lastRunAt).time}
            </Text>
          )}
        </HStack>
        {showContent && <TaskContent task={task} onClose={() => setShowContent(false)} />}
      </VStack>
    </Box>
  );
};

export default TaskCard; 