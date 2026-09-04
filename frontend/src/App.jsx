import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnalysisProvider, useAnalysis } from './context/AnalysisContext';

import Login from './pages/Login';
import Analyze from './pages/Analyze';
import Results from './pages/Results';
import LiveDetection from './pages/LiveDetection';

// Route guard checking operator identification
function ProtectedRoute({ children }) {
  const { userData } = useAnalysis();
  if (!userData) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <AnalysisProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/analyze"
            element={
              <ProtectedRoute>
                <Analyze />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />

          <Route
            path="/live"
            element={
              <ProtectedRoute>
                <LiveDetection />
              </ProtectedRoute>
            }
          />

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AnalysisProvider>
  );
}
