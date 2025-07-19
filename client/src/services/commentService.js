// client/src/services/commentService.js
import api from './api';

const addComment = async (postId, content) => {
  const response = await api.post(`/posts/${postId}/comments`, { content });
  return response.data;
};

const getCommentsByPost = async (postId) => {
  const response = await api.get(`/posts/${postId}/comments`);
  return response.data;
};

const deleteComment = async (commentId) => {
  const response = await api.delete(`/comments/${commentId}`);
  return response.data;
};

const commentService = {
  addComment,
  getCommentsByPost,
  deleteComment,
};

export default commentService;