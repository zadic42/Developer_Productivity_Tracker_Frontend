import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Tasks from './pages/Tasks';
import TimeTracker from './pages/TimeTracker';
import Skills from './pages/Skills';
import Goals from './pages/Goals';
import Github from './pages/Github';
import Team from './pages/Team';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Layout from './components/Layout';
import './App.css';

// Simple Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Protected Dashboard Routes */}
        <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/time" element={<TimeTracker />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/github" element={<Github />} />
          <Route path="/team" element={<Team />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/settings" element={<Settings />} />
          {/* Add more protected routes here as we implement them */}
        </Route>

        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
