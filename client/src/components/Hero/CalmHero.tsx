import React from 'react';
import './CalmHero.css';

interface CalmHeroProps {
  onGetHelp?: () => void;
  onLearnMore?: () => void;
}

export const CalmHero: React.FC<CalmHeroProps> = ({ onGetHelp, onLearnMore }) => {
  return (
    <section className="calm-hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-badge">
            <span>🛡️ Trusted Safety Platform</span>
          </div>
          
          <h1 className="hero-headline">
            You're safe. Help is one tap away.
          </h1>
          <p className="hero-subhead">
            Immediate support, protection & trusted connections when you need them most.
          </p>
          
          <div className="hero-actions">
            <button 
              className="hero-help-button"
              onClick={onGetHelp}
            >
              🚨 Get Help Now
            </button>
            <button 
              className="hero-secondary-button"
              onClick={onLearnMore}
            >
              Learn More
            </button>
          </div>
          
          <div className="hero-security">
            <span className="security-icon">✓</span>
            <span className="security-text">End-to-end encrypted • 24/7 monitored • Anonymous options</span>
          </div>
        </div>
        
        {/* Enhanced decorative elements */}
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </div>
    </section>
  );
};

export default CalmHero;
