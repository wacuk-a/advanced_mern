// Safe Mode utilities for quick exit and app disguise

export function enableQuickExit() {
  // Add keyboard shortcut listener
  if (typeof window !== 'undefined') {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Press 'Escape' key multiple times quickly to exit
      if (e.key === 'Escape') {
        const now = Date.now();
        const lastPress = (window as any).lastEscapePress || 0;
        
        if (now - lastPress < 1000) {
          // Double escape within 1 second
          exitApp();
        }
        
        (window as any).lastEscapePress = now;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
  }
}

export function exitApp() {
  // Clear sensitive data
  if (typeof window !== 'undefined') {
    // Clear localStorage except for essential data
    const essentialKeys = ['token', 'anonymousSessionId'];
    const essentialData: Record<string, string> = {};
    
    essentialKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) essentialData[key] = value;
    });
    
    localStorage.clear();
    
    essentialKeys.forEach(key => {
      if (essentialData[key]) {
        localStorage.setItem(key, essentialData[key]);
      }
    });
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear browser history (redirect to a neutral page)
    window.location.href = 'https://www.google.com';
  }
}

export function disguiseApp() {
  // Change page title and favicon to look like a calculator or shopping app
  if (typeof window !== 'undefined') {
    document.title = 'Calculator';
    
    // Change favicon
    const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23f0f0f0"/><text x="50" y="50" font-size="40" text-anchor="middle" fill="%23333">123</text></svg>';
    document.getElementsByTagName('head')[0].appendChild(link);
  }
}

export function preventScreenshot() {
  // Add CSS to prevent screenshots (limited effectiveness)
  if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
      * {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    `;
    document.head.appendChild(style);
  }
}

export function clearBrowserHistory() {
  // Clear browser history (limited - browsers don't allow full history clearing)
  if (typeof window !== 'undefined' && window.history) {
    // Redirect to clear recent history
    window.location.replace(window.location.href);
  }
}

export function enableIncognitoMode() {
  // Hide sensitive content when device is shared
  if (typeof window !== 'undefined') {
    let lastActivity = Date.now();
    
    const resetTimer = () => {
      lastActivity = Date.now();
    };
    
    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivity;
      // If inactive for 30 seconds, hide sensitive content
      if (inactiveTime > 30000) {
        document.body.style.filter = 'blur(10px)';
        document.body.style.pointerEvents = 'none';
      } else {
        document.body.style.filter = '';
        document.body.style.pointerEvents = '';
      }
    };
    
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      window.addEventListener(event, resetTimer);
    });
    
    setInterval(checkInactivity, 1000);
  }
}

