import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import QuickExitButton from './components/Safety/QuickExitButton';
import AppNavigation from './components/Navigation/AppNavigation';
import HomePage from './pages/HomePage';
import SafetyPlanPage from './pages/SafetyPlanPage';
import EmergencyContactsPage from './pages/EmergencyContactsPage';
import EvidenceRecorderPage from './pages/EvidenceRecorderPage';
import SafetyAssessmentPage from './pages/SafetyAssessmentPage';
import ResourcesPage from './pages/ResourcesPage';
import LocationSharingPage from './pages/LocationSharingPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <QuickExitButton />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/safety-plan" element={<SafetyPlanPage />} />
          <Route path="/emergency-contacts" element={<EmergencyContactsPage />} />
          <Route path="/evidence-recorder" element={<EvidenceRecorderPage />} />
          <Route path="/safety-assessment" element={<SafetyAssessmentPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
<Route path="/location-sharing" element={<LocationSharingPage />} />
        </Routes>
        <AppNavigation />
      </div>
    </Router>
  );
}

export default App;
