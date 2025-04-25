import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import TaskDetail from '@/pages/TaskDetail';
import PrivateRoute from '@/components/PrivateRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }
      />
      <Route
        path="/tasks/:taskId"
        element={
          <PrivateRoute>
            <TaskDetail />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes; 