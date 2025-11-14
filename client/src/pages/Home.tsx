import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import './Home.css';

const Home = () => {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>SilentVoice+</h1>
        <p className="tagline">Your Safety, Your Voice, Your Support</p>
        <p className="description">
          A comprehensive AI-powered platform for gender-based violence prevention, 
          reporting, and support management with advanced safety features.
        </p>
      </div>

      <div className="home-features">
        <div className="feature-card">
          <div className="feature-icon">🚨</div>
          <h3>Panic Button</h3>
          <p>One-touch emergency activation with real-time location sharing and automatic emergency contact notifications.</p>
          <Link to="/dashboard" className="feature-link">Get Started</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🏠</div>
          <h3>Safehouse Network</h3>
          <p>Find available safehouses in your area with real-time availability tracking and secure booking.</p>
          <Link to="/safehouses" className="feature-link">Find Safehouses</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">📝</div>
          <h3>Report Incidents</h3>
          <p>AI-powered reporting system with multi-modal analysis and risk assessment for your safety.</p>
          <Link to="/reports" className="feature-link">Make a Report</Link>
        </div>

        <div className="feature-card">
          <div className="feature-icon">🛡️</div>
          <h3>Safe Mode</h3>
          <p>Quick exit, app disguise, and digital safety features to protect your privacy and security.</p>
          <Link to="/settings" className="feature-link">Configure Safety</Link>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="home-anonymous">
          <p>You're using SilentVoice+ anonymously. Your privacy is protected.</p>
          <p className="small-text">All data is encrypted and can be wiped instantly if needed.</p>
        </div>
      )}

      <div className="home-safety-tips">
        <h2>Safety Tips</h2>
        <ul>
          <li>Keep your emergency contacts updated</li>
          <li>Test the panic button in a safe environment</li>
          <li>Familiarize yourself with the quick exit feature</li>
          <li>Know your nearest safehouse locations</li>
          <li>Use incognito mode when sharing your device</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;

