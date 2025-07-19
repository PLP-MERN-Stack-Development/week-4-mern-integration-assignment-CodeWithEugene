// client/src/components/Blog/PostForm.jsx
import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import postService from '../../services/postService';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorDisplay from '../Common/ErrorDisplay';
import { toast } from 'react-hot-toast';

const PostForm = ({ postToEdit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const { data: categories, loading: categoriesLoading, error: categoriesError, execute: fetchCategories } = useApi(categoryService.getCategories, []);
  const { loading: createLoading, error: createError, execute: executeCreatePost } = useApi(postService.createPost);
  const { loading: updateLoading, error: updateError, execute: executeUpdatePost } = useApi(postService.updatePost);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (postToEdit) {
      setTitle(postToEdit.title);
      setContent(postToEdit.content);
      setCategory(postToEdit.category._id);
      setCurrentImageUrl(postToEdit.imageUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${postToEdit.imageUrl}` : '');
    } else {
      setTitle('');
      setContent('');
      setCategory('');
      setImage(null);
      setCurrentImageUrl('');
    }
  }, [postToEdit, fetchCategories]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      toast.error('Please select a category.');
      return;
    }

    const postData = {
      title,
      content,
      category,
      image,
    };

    try {
      if (postToEdit) {
        await executeUpdatePost(postToEdit._id, postData);
        toast.success('Post updated successfully!');
      } else {
        await executeCreatePost(postData);
        toast.success('Post created successfully!');
        setTitle('');
        setContent('');
        setCategory('');
        setImage(null);
        document.getElementById('image-upload').value = null; // Clear file input
      }
    } catch {
      // Errors handled by useApi and toast
    }
  };

  const loading = createLoading || updateLoading || categoriesLoading;
  const error = createError || updateError || categoriesError;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-center mb-6">
        {postToEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
      </h2>
      {error && <ErrorDisplay message={error} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-700 text-sm font-bold mb-2">
            Title
          </label>
          <input
            type="text"
            id="title"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
            Content
          </label>
          <textarea
            id="content"
            rows="10"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
            Category
          </label>
          {categoriesLoading ? (
            <LoadingSpinner />
          ) : (
            <select
              id="category"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={loading}
            >
              <option value="">Select a Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          )}
          {categoriesError && <ErrorDisplay message={categoriesError} />}
        </div>
        <div className="mb-4">
          <label htmlFor="image-upload" className="block text-gray-700 text-sm font-bold mb-2">
            Featured Image
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
            disabled={loading}
          />
          {currentImageUrl && !image && (
            <>
              <p className="mt-2 text-sm text-gray-600">Current Image:</p>
              <img src={currentImageUrl} alt="Current Featured" className="mt-2 w-32 h-32 object-cover rounded-md" />
            </>
          )}
          {image && (
            <p className="mt-2 text-sm text-gray-600">New Image Selected: {image.name}</p>
          )}
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : (postToEdit ? 'Update Post' : 'Create Post')}
        </button>
      </form>
    </div>
  );
};

export default PostForm;