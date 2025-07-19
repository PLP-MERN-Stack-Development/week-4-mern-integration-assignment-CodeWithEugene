// client/src/components/Blog/CommentList.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import useApi from '../../hooks/useApi';
import commentService from '../../services/commentService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorDisplay from '../Common/ErrorDisplay';
import { toast } from 'react-hot-toast';

const CommentList = ({ comments, loading, error, onCommentDeleted }) => {
  const { user } = useAuth();
  const { loading: deleteLoading, execute: executeDelete } = useApi(commentService.deleteComment);

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await executeDelete(commentId);
        toast.success('Comment deleted successfully!');
        if (onCommentDeleted) {
          onCommentDeleted(commentId);
        }
      } catch {
        // Error handled by useApi and toast
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Comments ({comments.length})</h3>
      {comments.length === 0 ? (
        <p className="text-gray-600">No comments yet. Be the first to comment!</p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-800">{comment.author.username}</p>
                <span className="text-sm text-gray-500">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
              {(user && (user._id === comment.author._id || user.isAdmin)) && (
                <button
                  onClick={() => handleDelete(comment._id)}
                  className="mt-2 text-sm text-red-600 hover:text-red-800"
                  disabled={deleteLoading}
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentList;