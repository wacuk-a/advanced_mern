import React from 'react';
import './StatsSection.css';

interface StatsSectionProps {
  stats: Array<{
    number: string;
    label: string;
  }>;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <section className="stats-section">
      <div className="stats-decoration">
        <div className="stats-pattern"></div>
      </div>
      
      <div className="stats-container">
        <div className="stats-header">
          <h2 className="stats-title">SafeVoice Impact</h2>
          <p className="stats-subtitle">
            Trusted by thousands for immediate safety and support
          </p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-item">
              <span className="stat-number">{stat.number}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
