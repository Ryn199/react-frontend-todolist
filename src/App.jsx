import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { useAuth } from './context/AuthContext';
import TodoListPage from './pages/TodoListPage';
import TaskPage from './pages/TaskPage';
import ProjectPage from './pages/ProjectPage';
import RegisterPage from './pages/RegisterPages';
import TaskCalendar from './pages/TaskCalendar';

const App = () => {
  const { user, loading } = useAuth();  // Ambil loading juga

  if (loading) {
    return <div>Loading...</div>;  // Menunggu hingga loading selesai
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
        <Route path="/projects" element={user ? <ProjectPage /> : <Navigate to="/login" />} />
        <Route path="/todo-list/:projectId" element={<TodoListPage />} />
        <Route path="/projects/:projectId/todoLists/:todoListId/tasks" element={<TaskPage />} />
        <Route path="/task-calendar" element={<TaskCalendar />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;
