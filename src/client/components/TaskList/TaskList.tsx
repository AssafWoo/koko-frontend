import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TaskCard from '../TaskCard/TaskCard';
import { Box, Text, Heading, SimpleGrid, Spinner, Container, useBreakpointValue } from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { filteredTasksAtom, activeFilterAtom, isLoadingAtom } from '@/atoms/tasks';
import type { Task } from '@/types';

interface TaskListProps {
  onDelete: (taskId: string) => Promise<void>;
  onTaskClick: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onDelete, onTaskClick }) => {
  const { isAuthenticated } = useAuth();
  const [filteredTasks] = useAtom(filteredTasksAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const columns = useBreakpointValue({ base: 1, md: 2, lg: 3 });

  if (!isAuthenticated) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Please log in to view your tasks.</Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Spinner size="xl" />
      </Container>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>No tasks found.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <SimpleGrid columns={columns} spacing={6}>
        {filteredTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onDelete={() => onDelete(task.id)}
            onClick={() => onTaskClick(task.id)}
          />
        ))}
      </SimpleGrid>
    </Container>
  );
};

export default TaskList; 