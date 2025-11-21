import React from 'react';

const QuickExitButton: React.FC = () => {
  const handleQuickExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <button
      onClick={handleQuickExit}
      style={{
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '50%',
        width: '50px',
        height: '50px',
        fontSize: '20px',
        cursor: 'pointer',
        zIndex: 10000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
      }}
      title="Quick Exit - Press to immediately hide this app"
    >
      🚪
    </button>
  );
};

export default QuickExitButton;
