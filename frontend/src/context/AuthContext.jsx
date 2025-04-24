import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import props from 'prop-types';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(localStorage.getItem('admin'));
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists on initial load
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setUser(localStorage.getItem('admin'));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken, email) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('admin', email);
    setToken(newToken);
    setUser(email);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: props.node.isRequired,
};
