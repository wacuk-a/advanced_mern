import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { enableQuickExit, enableIncognitoMode } from './utils/safeMode';
import DiscreetPanicButton from './components/PanicButton/DiscreetPanicButton';
import QuickExit from './components/SafeMode/QuickExit';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Safehouses from './pages/Safehouses';
import Reports from './pages/Reports';
import CounselorDashboard from './pages/CounselorDashboard';
import Settings from './pages/Settings';
import './App.css';
import './styles/calm-ui.css';

function App() {
  const { loadUser, isAuthenticated, isLoading, user } = useAuthStore();

  useEffect(() => {
    // Load user on mount
    loadUser();

    // Enable safe mode features
    enableQuickExit();
    enableIncognitoMode();
  }, [loadUser]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Loading SilentVoice+...</p>
      </div>
    );
  }

  // Create anonymous session if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      useAuthStore.getState().createAnonymousSession().catch(console.error);
    }
  }, [isAuthenticated, isLoading]);

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/safehouses" element={<Safehouses />} />
          <Route path="/reports" element={<Reports />} />
          <Route 
            path="/counselor" 
            element={
              user?.role === 'counselor' || user?.role === 'admin' 
                ? <CounselorDashboard /> 
                : <Navigate to="/" replace />
            } 
          />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* Discreet Panic Button - Always visible */}
        <DiscreetPanicButton />
        
        {/* Quick Exit Button */}
        <QuickExit />
      </div>
    </BrowserRouter>
  );
}

export default App;

