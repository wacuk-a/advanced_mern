// Safe localStorage with error handling
export const safeStorage = {
  setItem: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn('localStorage set failed, using memory fallback:', error);
      return false;
    }
  },
  
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.warn('localStorage get failed:', error);
      return null;
    }
  },
  
  removeItem: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn('localStorage remove failed:', error);
      return false;
    }
  }
};
