// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; 
import { useAuth } from './context/AuthContext';
import TodoListPage from './pages/TodoListPage';
import ProjectPage from './pages/ProjectPage';
import RegisterPage from './pages/RegisterPages';
import TaskCalendar from './pages/TaskCalendar';

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Halaman login */}
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />

        {/* Halaman register */}
        <Route path="/register" element={<RegisterPage />} />


        {/* Halaman dashboard */}
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />

        <Route path="/projects" element={user ? <ProjectPage /> : <Navigate to="/login" />} />

        <Route path="/todo-list/:projectId" element={<TodoListPage />} />

        <Route path="/task-calendar" element={<TaskCalendar />} /> {/* Route Kalender */}


        {/* Default route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
