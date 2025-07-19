// client/src/services/categoryService.js
import api from './api';

const getCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

const createCategory = async (name) => {
  const response = await api.post('/categories', { name });
  return response.data;
};

const updateCategory = async (id, name) => {
  const response = await api.put(`/categories/${id}`, { name });
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
};

const categoryService = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;