import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import {
  ChakraProvider,
  Box,
  Center,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import Home from '@/pages/Home'
import Login from '@/pages/Login'
import TaskDetail from '@/pages/TaskDetail'
import theme from '@/styles/theme'
import PrivateRoute from '@/components/PrivateRoute'

const AppContent = () => {
  const bgColor = useColorModeValue('white', 'gray.900')
  const { isLoading: isAuthLoading } = useAuth()

  if (isAuthLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/tasks/:taskId" element={
          <PrivateRoute>
            <TaskDetail />
          </PrivateRoute>
        } />
      </Routes>
    </Box>
  );
};

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;