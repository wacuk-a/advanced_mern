import React from 'react';
import SafetyAssessment from '../components/Safety/SafetyAssessment';

const SafetyAssessmentPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <SafetyAssessment />
      </div>
    </div>
  );
};

export default SafetyAssessmentPage;
