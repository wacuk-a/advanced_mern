import React from 'react';
import { Card, CardContent } from '../Card/Card';
import './Features.css';

interface Feature {
  icon: string;
  title: string;
  description: string;
  color?: string;
}

interface FeaturesProps {
  features: Feature[];
}

export const Features: React.FC<FeaturesProps> = ({ features }) => {
  return (
    <section className="features">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">How We Protect You</h2>
          <p className="features-subtitle">
            Comprehensive safety features designed for your peace of mind
          </p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              variant="elevated" 
              className="feature-card"
            >
              <CardContent className="feature-content">
                <div 
                  className="feature-icon"
                  style={{ 
                    background: feature.color || 'var(--primary-500)',
                    color: 'white'
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
