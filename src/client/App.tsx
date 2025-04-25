import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { AuthProvider } from '@/contexts/AuthContext';
import AppRoutes from './routes';
import theme from './theme';

const queryClient = new QueryClient();

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <JotaiProvider>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </JotaiProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

export default App; 