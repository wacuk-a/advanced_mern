import React, { useState } from 'react';

const DiscreetMode: React.FC = () => {
  const [isDiscreet, setIsDiscreet] = useState(false);

  const toggleDiscreetMode = () => {
    setIsDiscreet(!isDiscreet);
    if (!isDiscreet) {
      document.title = "Weather Forecast";
    } else {
      document.title = "SafeRoute";
    }
  };

  if (isDiscreet) {
    return (
      <div style={{ 
        padding: '20px', 
        background: 'linear-gradient(135deg, #74b9ff, #0984e3)',
        minHeight: '100vh',
        color: 'white',
        textAlign: 'center'
      }}>
        <h1>🌤️ Weather Forecast</h1>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '20px', borderRadius: '10px', margin: '20px 0' }}>
          <h3>Nairobi Weather</h3>
          <p>Temperature: 24°C</p>
          <p>Condition: Partly Cloudy</p>
          <p>Humidity: 65%</p>
        </div>
        <button 
          onClick={toggleDiscreetMode}
          style={{
            padding: '10px 20px',
            background: 'white',
            color: '#0984e3',
            border: 'none',
            borderRadius: '20px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Show Actual App
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={toggleDiscreetMode}
      style={{
        position: 'fixed',
        bottom: '100px',
        right: '20px',
        padding: '10px',
        background: '#6366f1',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        cursor: 'pointer',
        zIndex: 1000
      }}
    >
      🌤️
    </button>
  );
};

export default DiscreetMode;
