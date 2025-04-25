import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Container, Heading, VStack, useColorModeValue, useBreakpointValue } from '@chakra-ui/react';
import TaskCreator from '@/components/TaskCreator/TaskCreator';
import TaskList from '@/components/TaskList/TaskList';
import TaskFilters from '@/components/TaskFilters/TaskFilters';
import { useAtom } from 'jotai';
import { activeFilterAtom, tasksAtom, fetchTasks } from '@/atoms/tasks';
import { useTaskOperations } from '@/hooks/useTaskOperations';
import { useTaskUpdates } from '@/hooks/useTaskUpdates';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const spacing = useBreakpointValue({ base: 4, sm: 6, md: 8 });
  const headingSize = useBreakpointValue({ base: 'xl', sm: '2xl', md: '3xl' });

  const [activeFilter, setActiveFilter] = useAtom(activeFilterAtom);
  const [, setTasks] = useAtom(tasksAtom);
  const { createTask, selectTask, deleteTask } = useTaskOperations();

  // Initialize real-time task updates
  useTaskUpdates();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      // Fetch tasks on mount
      fetchTasks(setTasks);
    }
  }, [isAuthenticated, navigate, setTasks]);

  const handleTaskClick = (taskId: string) => {
    selectTask(taskId);
    navigate(`/tasks/${taskId}`);
  };

  const handleCreateTask = async (prompt: string) => {
    if (!isAuthenticated) return;
    await createTask(prompt);
  };

  const handleDeleteTask = async (taskId: string) => {
    await deleteTask(taskId);
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter as 'all' | 'active' | 'completed' | 'failed');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box minH="100vh" w="100vw" bg={bgColor}>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        zIndex={2}
        bg={bgColor}
        boxShadow="sm"
      >
        <Container maxW="container.xl">
          <Heading
            as="h1"
            size={headingSize}
            textAlign="center"
            bgGradient="linear(to-r, blue.400, blue.600)"
            bgClip="text"
            fontWeight="extrabold"
            py={4}
          >
            Koko
          </Heading>
        </Container>
      </Box>
      
      <Container maxW="container.xl" pt={{ base: 24, sm: 28, md: 32 }} pb={{ base: 4, sm: 6, md: 8 }}>
        <VStack spacing={spacing} align="stretch">
          <TaskCreator
            onCreateTask={handleCreateTask}
            isLoading={false}
          />
          
          <TaskFilters 
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
          />
          
          <TaskList
            onTaskClick={handleTaskClick}
            onDelete={handleDeleteTask}
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default Home; 