import React, { useState } from 'react';
import './QuickExit.css';

interface QuickExitProps {
  onQuickExit?: () => void;
}

export const QuickExit: React.FC<QuickExitProps> = ({ onQuickExit }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleQuickExit = () => {
    setIsExiting(true);
    
    // Immediate visual feedback
    document.body.style.opacity = '0';
    
    // Hide content and show neutral screen
    setTimeout(() => {
      // Clear the page content
      document.body.innerHTML = '<div style="background: #F6F7F9; height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui; color: #617085;">Safe browsing</div>';
      
      // Optional: Also clear history
      window.history.replaceState(null, '', '/');
      
      onQuickExit?.();
    }, 200);
  };

  if (isExiting) {
    return null;
  }

  return (
    <button
      className="quick-exit-button"
      onClick={handleQuickExit}
      aria-label="Quick Exit - hide app instantly"
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 01.708 0l6 6a.5.5 0 010 .708l-6 6a.5.5 0 01-.708-.708L10.293 8 4.646 2.354a.5.5 0 010-.708z" clipRule="evenodd" />
      </svg>
      Quick Exit
    </button>
  );
};

export default QuickExit;
