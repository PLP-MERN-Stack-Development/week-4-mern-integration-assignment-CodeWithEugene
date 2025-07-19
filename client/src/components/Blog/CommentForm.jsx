// client/src/components/Blog/CommentForm.jsx
import React, { useState } from 'react';
import useApi from '../../hooks/useApi';
import commentService from '../../services/commentService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorDisplay from '../Common/ErrorDisplay';
import { toast } from 'react-hot-toast';

const CommentForm = ({ postId, onCommentAdded }) => {
  const [content, setContent] = useState('');
  const { loading, error, execute } = useApi(commentService.addComment);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error('Comment cannot be empty.');
      return;
    }
    try {
      const newComment = await execute(postId, content);
      toast.success('Comment added!');
      setContent('');
      if (onCommentAdded) {
        onCommentAdded(newComment);
      }
    } catch {
      // Error handled by useApi and toast
    }
  };

  return (
    <div className="mt-8 bg-gray-50 p-6 rounded-lg shadow-inner">
      <h3 className="text-xl font-semibold mb-4">Leave a Comment</h3>
      {error && <ErrorDisplay message={error} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Write your comment here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : 'Submit Comment'}
        </button>
      </form>
    </div>
  );
};

export default CommentForm;