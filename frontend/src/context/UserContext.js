// UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext({
  user: null,
  setUser: () => {},
  isAuthenticated: false,
  setIsAuthenticated: () => {}
});

export const UserProvider = ({ children }) => {
  // Initialize authentication state from localStorage
  // But keep user data only in memory
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('tenantId'));
  });

  const [user, setUser] = useState({});

  // Check authentication status on page load
  useEffect(() => {
    const tenantId = localStorage.getItem('tenantId');
    
    // If we have auth tokens but no user data, we should fetch user data
    if ( !tenantId && !user) {
      // You can optionally add an API call here to refresh user data
      // fetchUserData();
    } else if ( !tenantId) {
      // Clear everything if authentication data is missing
      setIsAuthenticated(false);
      setUser(null);
      localStorage.clear();
    }
  }, [user]);

  return (
    <UserContext.Provider value={{ 
      user, 
      setUser,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for easier context usage
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

