import React from 'react';
import './Hero.css';

interface HeroProps {
  title: string;
  subtitle: string;
  description?: string;
  backgroundImage?: string;
}

export const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  backgroundImage
}) => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="hero-overlay"></div>
        {backgroundImage && (
          <div 
            className="hero-image"
            style={{ backgroundImage: `url(${backgroundImage})` }}
          ></div>
        )}
      </div>
      
      <div className="hero-content">
        <div className="hero-badge">
          <span>🚨 Emergency Support System</span>
        </div>
        
        <h1 className="hero-title">{title}</h1>
        <p className="hero-subtitle">{subtitle}</p>
        
        {description && (
          <p className="hero-description">{description}</p>
        )}
        
        <div className="hero-stats">
          <div className="stat">
            <span className="stat-number">24/7</span>
            <span className="stat-label">Support</span>
          </div>
          <div className="stat">
            <span className="stat-number">50+</span>
            <span className="stat-label">Safe Houses</span>
          </div>
          <div className="stat">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Users Helped</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
