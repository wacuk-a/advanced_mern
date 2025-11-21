import React from 'react';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = "Safe Voice",
  description = "Your safety is our priority"
}) => {
  return (
    <div className="layout">
      {/* Header */}
      <header className="layout-header">
        <div className="layout-container">
          <div className="layout-brand">
            <div className="brand-logo">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path 
                  d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2zm-2 20h-2v-8h2v8zm6 0h-2v-8h2v8z" 
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="brand-text">
              <h1 className="brand-title">{title}</h1>
              {description && <p className="brand-description">{description}</p>}
            </div>
          </div>
          
          <nav className="layout-nav">
            <button className="nav-button" aria-label="Settings">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="layout-main">
        <div className="layout-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="layout-footer">
        <div className="layout-container">
          <p>&copy; 2024 Safe Voice. Your safety matters.</p>
          <div className="footer-links">
            <button className="footer-link">Emergency Help</button>
            <button className="footer-link">Privacy</button>
            <button className="footer-link">Contact</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
