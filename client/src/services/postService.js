// client/src/services/postService.js
import api from './api';

const getPosts = async (pageNumber = 1, search = '', category = '') => {
  const response = await api.get(
    `/posts?pageNumber=${pageNumber}&search=${search}&category=${category}`
  );
  return response.data;
};

const getPostById = async (id) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

const createPost = async (postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  formData.append('category', postData.category);
  if (postData.image) {
    formData.append('image', postData.image);
  }

  const response = await api.post('/posts', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const updatePost = async (id, postData) => {
  const formData = new FormData();
  formData.append('title', postData.title);
  formData.append('content', postData.content);
  formData.append('category', postData.category);
  if (postData.image) {
    formData.append('image', postData.image);
  }

  const response = await api.put(`/posts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

const deletePost = async (id) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};

const postService = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};

export default postService;