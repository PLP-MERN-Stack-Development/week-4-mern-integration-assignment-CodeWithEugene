// client/src/services/authService.js
import api from './api';

const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  if (response.data.token) {
    localStorage.setItem('userInfo', JSON.stringify(response.data));
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('userInfo');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;