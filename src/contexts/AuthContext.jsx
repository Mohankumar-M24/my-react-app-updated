import { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);

  // Restore login state from localStorage on page reload
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');
    const storedUserId = localStorage.getItem('userId');

    console.log(" Restoring auth from localStorage:", {
      storedToken,
      storedRole,
      storedUserId,
    });

    if (storedToken && storedRole && storedUserId) {
      setToken(storedToken);
      setRole(storedRole);
      setUserId(storedUserId);
    }
  }, []);

  // Save login info to state + localStorage
  const login = (token, role, userId) => {
    console.log(" Logging in:", { token, role, userId });
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userId', userId);
    setToken(token);
    setRole(role);
    setUserId(userId);
  };

  //  Clear everything on logout
  const logout = () => {
    console.log("🚪 Logging out...");
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUserId(null);
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, role, userId, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Export custom hook
export const useAuth = () => useContext(AuthContext);
