// client/src/pages/PostFormPage.jsx
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PostForm from '../components/Blog/PostForm';
import useApi from '../hooks/useApi';
import postService from '../services/postService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorDisplay from '../components/Common/ErrorDisplay';

const PostFormPage = () => {
  const { id } = useParams(); // Get post ID from URL if editing
  const isEditing = Boolean(id);

  const { data: post, loading, error, execute: fetchPost } = useApi(postService.getPostById);

  useEffect(() => {
    if (isEditing) {
      fetchPost(id);
    }
  }, [id, isEditing, fetchPost]);

  if (isEditing && loading) return <LoadingSpinner />;
  if (isEditing && error) return <ErrorDisplay message={error} />;
  // If editing and no post found (e.g., deleted), show error.
  // If creating, post will be null, which is fine.
  if (isEditing && !post) return <ErrorDisplay message="Post not found for editing." />;

  return (
    <div className="container mx-auto p-4">
      <PostForm postToEdit={post} />
    </div>
  );
};

export default PostFormPage;