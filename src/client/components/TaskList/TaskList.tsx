import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import TaskCard from '../TaskCard/TaskCard';
import { 
  Box, 
  Text, 
  Heading, 
  SimpleGrid, 
  Spinner, 
  Container, 
  useBreakpointValue,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { useAtom } from 'jotai';
import { filteredTasksAtom, activeFilterAtom, isLoadingAtom, tasksAtom } from '@/atoms/tasks';
import type { Task } from '@/types';

interface TaskListProps {
  onDelete: (taskId: string) => Promise<void>;
  onTaskClick: (taskId: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ onDelete, onTaskClick }) => {
  const { isAuthenticated } = useAuth();
  const [tasks] = useAtom(filteredTasksAtom);
  const [allTasks] = useAtom(tasksAtom);
  const [isLoading] = useAtom(isLoadingAtom);
  const [, setActiveFilter] = useAtom(activeFilterAtom);
  const columns = useBreakpointValue({ base: 1, sm: 1, md: 2, lg: 3 });
  const tabBg = useColorModeValue('white', 'gray.800');
  const tabBorderColor = useColorModeValue('gray.200', 'gray.700');

  const getStatusCount = (status: string) => {
    return allTasks.filter(task => task.status?.toLowerCase() === status.toLowerCase()).length;
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };

  if (!isAuthenticated) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text textAlign="center" fontSize="lg">
          Please log in to view your tasks
        </Text>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Box display="flex" justifyContent="center" alignItems="center" minH="200px">
          <Spinner size="xl" />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Tabs 
        variant="enclosed" 
        colorScheme="blue" 
        onChange={(index) => {
          const statuses = ['all', 'pending', 'completed', 'deleted'];
          setActiveFilter(statuses[index] as any);
        }}
        defaultIndex={0}
      >
        <TabList 
          bg={tabBg} 
          borderWidth="1px" 
          borderColor={tabBorderColor}
          borderRadius="lg"
          p={1}
          mb={6}
        >
          <Tab 
            _selected={{ 
              color: 'purple.500', 
              bg: 'purple.50',
              borderColor: 'purple.200',
              borderRadius: 'md'
            }}
          >
            All
            <Badge ml={2} colorScheme="purple" variant="subtle">
              {allTasks.length}
            </Badge>
          </Tab>
          <Tab 
            _selected={{ 
              color: 'blue.500', 
              bg: 'blue.50',
              borderColor: 'blue.200',
              borderRadius: 'md'
            }}
          >
            Pending
            <Badge ml={2} colorScheme="blue" variant="subtle">
              {getStatusCount('pending')}
            </Badge>
          </Tab>
          <Tab 
            _selected={{ 
              color: 'green.500', 
              bg: 'green.50',
              borderColor: 'green.200',
              borderRadius: 'md'
            }}
          >
            Completed
            <Badge ml={2} colorScheme="green" variant="subtle">
              {getStatusCount('completed')}
            </Badge>
          </Tab>
          <Tab 
            _selected={{ 
              color: 'red.500', 
              bg: 'red.50',
              borderColor: 'red.200',
              borderRadius: 'md'
            }}
          >
            Deleted
            <Badge ml={2} colorScheme="red" variant="subtle">
              {getStatusCount('deleted')}
            </Badge>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <SimpleGrid columns={columns} spacing={6}>
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => onDelete(task.id)}
                  onClick={() => onTaskClick(task.id)}
                />
              ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel px={0}>
            <SimpleGrid columns={columns} spacing={6}>
              {tasks
                .filter(task => task.status?.toLowerCase() === 'pending')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => onDelete(task.id)}
                    onClick={() => onTaskClick(task.id)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel px={0}>
            <SimpleGrid columns={columns} spacing={6}>
              {tasks
                .filter(task => task.status?.toLowerCase() === 'completed')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => onDelete(task.id)}
                    onClick={() => onTaskClick(task.id)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
          <TabPanel px={0}>
            <SimpleGrid columns={columns} spacing={6}>
              {tasks
                .filter(task => task.status?.toLowerCase() === 'deleted')
                .map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={() => onDelete(task.id)}
                    onClick={() => onTaskClick(task.id)}
                  />
                ))}
            </SimpleGrid>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default TaskList; 