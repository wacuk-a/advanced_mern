import React from 'react';
import './CalmFeatures.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color: string;
}

interface CalmFeaturesProps {
  features: Feature[];
  onFeatureClick?: (feature: Feature) => void;
}

export const CalmFeatures: React.FC<CalmFeaturesProps> = ({ 
  features, 
  onFeatureClick 
}) => {
  return (
    <section className="calm-features">
      <div className="features-background">
        <div className="background-pattern"></div>
      </div>
      
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Your Safety Toolkit</h2>
          <p className="features-subtitle">
            Comprehensive features designed for your protection and peace of mind
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <button
              key={index}
              className="feature-card"
              onClick={() => onFeatureClick?.(feature)}
              aria-label={`Open ${feature.title}`}
            >
              <div 
                className="feature-icon-container"
                style={{ background: feature.color }}
              >
                <span className="feature-icon">{feature.icon}</span>
              </div>
              
              <div className="feature-content">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
              
              <div className="feature-indicator"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CalmFeatures;
