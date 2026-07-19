import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import IncidentReport from './pages/IncidentReport';
import AlertsHistory from './pages/AlertsHistory';
import Architecture from './pages/Architecture';
import LiveControlConsole from './pages/LiveControlConsole';
import SafetyCopilot from './pages/SafetyCopilot';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const officer = localStorage.getItem('kawach_officer');
  if (!officer) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const officer = localStorage.getItem('kawach_officer');
  if (officer) {
    return <Navigate to="/app/dashboard" replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            marginRight: '24px',
            marginTop: '16px',
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0,0,0,0.06)',
            border: '1px solid #E5E7EB',
          }
        }}
      />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route path="/app" element={<PrivateRoute><Navigate to="/app/dashboard" replace /></PrivateRoute>} />
          <Route path="/app/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/app/reports" element={<PrivateRoute><IncidentReport /></PrivateRoute>} />
          <Route path="/app/alerts" element={<PrivateRoute><AlertsHistory /></PrivateRoute>} />
          <Route path="/app/architecture" element={<PrivateRoute><Architecture /></PrivateRoute>} />
          <Route path="/app/console" element={<PrivateRoute><LiveControlConsole /></PrivateRoute>} />
          <Route path="/app/copilot" element={<PrivateRoute><SafetyCopilot /></PrivateRoute>} />
          <Route path="/app/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />

          {/* Fallbacks */}
          <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
          <Route path="/report" element={<Navigate to="/app/reports" replace />} />
          <Route path="/alerts" element={<Navigate to="/app/alerts" replace />} />
          <Route path="/architecture" element={<Navigate to="/app/architecture" replace />} />
          <Route path="/console" element={<Navigate to="/app/console" replace />} />
          <Route path="/team" element={<Navigate to="/app/copilot" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </BrowserRouter>
  );
}

export default App;
