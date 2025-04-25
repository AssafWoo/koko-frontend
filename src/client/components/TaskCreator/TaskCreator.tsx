import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Box, Button, Input, VStack, Text } from '@chakra-ui/react';

interface TaskCreatorProps {
  onCreateTask: (prompt: string) => Promise<void>;
  isLoading: boolean;
}

const TaskCreator: React.FC<TaskCreatorProps> = ({ onCreateTask, isLoading }) => {
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isAuthenticated) {
      setError('You must be logged in to create tasks');
      return;
    }

    try {
      await onCreateTask(description);
      setDescription('');
    } catch (err) {
      console.error('Failed to create task:', err);
      setError('Failed to create task. Please try again later.');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Input
            placeholder="Describe your task (e.g., 'Remind me to call John tomorrow at 2pm' or 'Summarize the latest news about AI')"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {error && <Text color="red.500">{error}</Text>}
          <Button type="submit" colorScheme="blue" isLoading={isLoading}>
            Create Task
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TaskCreator; 