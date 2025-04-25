import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  VStack, 
  Text, 
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Heading,
  Divider,
  Badge,
  HStack
} from '@chakra-ui/react';
import { ChevronRightIcon } from '@chakra-ui/icons';
import { useTaskState } from '@/hooks/useTaskState';
import { useTaskOperations } from '@/hooks/useTaskOperations';

const TaskDetail: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();
  const { selectedTask } = useTaskState();
  const {} = useTaskOperations();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');

  useEffect(() => {
    if (!selectedTask && taskId) {
      navigate('/');
    }
  }, [selectedTask, taskId, navigate]);

  if (!selectedTask) {
    return null;
  }

  const formatSchedule = (schedule: typeof selectedTask.schedule) => {
    if (!schedule) return 'Not scheduled';
    const { frequency, interval, time, day, date } = schedule;
    let scheduleText = frequency;
    if (interval) scheduleText += ` every ${interval} minutes`;
    if (time) scheduleText += ` at ${time}`;
    if (day) scheduleText += ` on ${day}`;
    if (date) scheduleText += ` on ${date}`;
    return scheduleText;
  };

  const formatLogs = (logs: typeof selectedTask.logs) => {
    if (!logs || logs.length === 0) return 'No logs available';
    return logs.map((log, index) => (
      <Box key={index} p={2} bg="gray.50" borderRadius="md" mb={2}>
        <Text fontSize="sm" color="gray.500">
          {new Date(log.timestamp).toLocaleString()}
        </Text>
        <Text>{log.message}</Text>
      </Box>
    ));
  };

  const formatPreviewResult = (result: string) => {
    if (!result) return null;
    
    // Check if the result contains multiple topics (indicated by numbered sections or bullet points)
    const hasMultipleTopics = /^\d+\.|^[-*]\s/.test(result);
    
    if (hasMultipleTopics) {
      // Split by numbered sections or bullet points
      const sections = result.split(/\n(?=\d+\.|[-*]\s)/);
      return sections.map((section, index) => (
        <Box key={index} mb={4}>
          <Text whiteSpace="pre-wrap">{section.trim()}</Text>
          {index < sections.length - 1 && <Divider my={2} />}
        </Box>
      ));
    }
    
    // For single topic results, just wrap the text
    return <Text whiteSpace="pre-wrap">{result}</Text>;
  };

  return (
    <Box minH="100vh" bg={bgColor} py={8}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />}>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/')}>Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink>Task Details</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          <Heading size="xl">Task Details</Heading>
          
          <Box p={6} bg="white" borderRadius="lg" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <HStack spacing={4}>
                <Badge colorScheme={selectedTask.status === 'completed' ? 'green' : 'blue'} fontSize="md">
                  {selectedTask.status}
                </Badge>
                <Badge colorScheme="purple" fontSize="md">
                  {selectedTask.type}
                </Badge>
              </HStack>

              <Box>
                <Text fontWeight="bold" mb={2}>Schedule:</Text>
                <Text>{formatSchedule(selectedTask.schedule)}</Text>
              </Box>

              {selectedTask.previewResult && (
                <Box>
                  <Text fontWeight="bold" mb={2}>Preview Result:</Text>
                  <Box p={4} bg="gray.50" borderRadius="md">
                    {formatPreviewResult(selectedTask.previewResult)}
                  </Box>
                </Box>
              )}

              <Box>
                <Text fontWeight="bold" mb={2}>Logs:</Text>
                {formatLogs(selectedTask.logs)}
              </Box>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default TaskDetail; 