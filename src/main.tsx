import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Pages
import Dashboard from './pages/Dashboard';
import WeightTracker from './pages/WeightTracker';
import Nutrition from './pages/Nutrition';
import Exercise from './pages/Exercise';
import FertilityCycle from './pages/FertilityCycle';
import EmotionalState from './pages/EmotionalState';
import Goals from './pages/Goals';
import Achievements from './pages/Achievements';
import UserSettings from './pages/UserSettings';
import Welcome from './pages/Welcome';
import TrainingScheduleSetup from './pages/TrainingScheduleSetup';

// Create AppContent wrapper component
import { useAppContext, AppProvider } from './context/AppContext';
import { useNavigate, useLocation } from 'react-router-dom';

const AppWrapper = () => {
  const { userProfile } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirect to welcome page if no profile exists and not already on welcome page
  useEffect(() => {
    if (!userProfile && location.pathname !== '/welcome') {
      navigate('/welcome');
    }
  }, [userProfile, navigate, location.pathname]);

  return <App />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/" element={<AppWrapper />}>
            <Route index element={<Dashboard />} />
            <Route path="weight" element={<WeightTracker />} />
            <Route path="nutrition" element={<Nutrition />} />
            <Route path="exercise" element={<Exercise />} />
            <Route path="fertility" element={<FertilityCycle />} />
            <Route path="emotional" element={<EmotionalState />} />
            <Route path="goals" element={<Goals />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="settings" element={<UserSettings />} />
            <Route path="welcome" element={<Welcome />} />
            <Route path="training-setup" element={<TrainingScheduleSetup />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);