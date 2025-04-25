import React from 'react';
import { Box, Button, ButtonGroup, useColorModeValue } from '@chakra-ui/react';
import './TaskFilters.less';

interface TaskFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({ activeFilter, onFilterChange }) => {
  const buttonBg = useColorModeValue('white', 'gray.700');
  const activeButtonBg = useColorModeValue('blue.500', 'blue.400');
  const activeButtonColor = 'white';
  const hoverBg = useColorModeValue('gray.100', 'gray.600');

  return (
    <Box py={2}>
      <ButtonGroup size="sm" spacing={2} variant="outline">
        <Button
          onClick={() => onFilterChange('all')}
          bg={activeFilter === 'all' ? activeButtonBg : buttonBg}
          color={activeFilter === 'all' ? activeButtonColor : undefined}
          _hover={{ bg: activeFilter === 'all' ? activeButtonBg : hoverBg }}
          px={3}
          py={1}
          fontSize="sm"
          fontWeight="medium"
        >
          All
        </Button>
        <Button
          onClick={() => onFilterChange('active')}
          bg={activeFilter === 'active' ? activeButtonBg : buttonBg}
          color={activeFilter === 'active' ? activeButtonColor : undefined}
          _hover={{ bg: activeFilter === 'active' ? activeButtonBg : hoverBg }}
          px={3}
          py={1}
          fontSize="sm"
          fontWeight="medium"
        >
          Active
        </Button>
        <Button
          onClick={() => onFilterChange('completed')}
          bg={activeFilter === 'completed' ? activeButtonBg : buttonBg}
          color={activeFilter === 'completed' ? activeButtonColor : undefined}
          _hover={{ bg: activeFilter === 'completed' ? activeButtonBg : hoverBg }}
          px={3}
          py={1}
          fontSize="sm"
          fontWeight="medium"
        >
          Completed
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default TaskFilters; 