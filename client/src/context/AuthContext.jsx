/* eslint-disable react-refresh/only-export-components */
// client/src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (userInfo) {
        setUser(userInfo);
      }
    } catch (error) {
      console.error("Failed to parse user info from localStorage", error);
      localStorage.removeItem('userInfo');
    }
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await authService.login({ email, password });
      setUser(userData);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const userData = await authService.register({ username, email, password });
      setUser(userData);
      toast.success('Registered successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error);
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Add this to expose useAuth to other components
export const useAuth = () => useContext(AuthContext);
