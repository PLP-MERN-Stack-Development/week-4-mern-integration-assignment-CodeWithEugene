// client/src/pages/PostDetailPage.jsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import postService from '../services/postService';
import CommentForm from '../components/Blog/CommentForm';
import CommentList from '../components/Blog/CommentList';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorDisplay from '../components/Common/ErrorDisplay';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: post, loading, error, execute: fetchPost, setData: setPostData } = useApi(
    postService.getPostById
  );
  const { loading: deleteLoading, execute: executeDeletePost } = useApi(postService.deletePost);

  useEffect(() => {
    fetchPost(id);
  }, [id, fetchPost]);

  const handleCommentAdded = (newComment) => {
    // Optimistically update the comments list
    setPostData((prevPost) => ({
      ...prevPost,
      comments: [...(prevPost.comments || []), newComment],
    }));
  };

  const handleCommentDeleted = (commentId) => {
    // Optimistically update the comments list
    setPostData((prevPost) => ({
      ...prevPost,
      comments: prevPost.comments.filter((comment) => comment._id !== commentId),
    }));
  };

  const handleDeletePost = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await executeDeletePost(id);
        toast.success('Post deleted successfully!');
        navigate('/');
      } catch {
        // Error handled by useApi and toast
      }
    }
  };

  if (loading || deleteLoading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;
  if (!post) return <ErrorDisplay message="Post not found." />;

  const defaultImage = '/uploads/default-post-image.jpg';
  const imageUrl = post.imageUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${post.imageUrl}` : defaultImage;

  return (
    <div className="container mx-auto p-4">
      <article className="bg-white rounded-lg shadow-md p-8">
        <img src={imageUrl} alt={post.title} className="w-full h-96 object-cover rounded-md mb-6" />
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        <div className="text-gray-600 text-sm mb-4 flex justify-between items-center">
          <div>
            By <span className="font-semibold">{post.author?.username || 'Unknown'}</span> on{' '}
            {new Date(post.createdAt).toLocaleDateString()}
          </div>
          {post.category && (
            <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {post.category.name}
            </span>
          )}
        </div>
        <div className="prose max-w-none mb-8">
          <p className="text-lg leading-relaxed">{post.content}</p>
        </div>

        {user && (user._id === post.author._id || user.isAdmin) && (
          <div className="flex space-x-4 mb-8">
            <Link
              to={`/posts/${post._id}/edit`}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
            >
              Edit Post
            </Link>
            <button
              onClick={handleDeletePost}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200"
              disabled={deleteLoading}
            >
              Delete Post
            </button>
          </div>
        )}

        {user ? (
          <CommentForm postId={post._id} onCommentAdded={handleCommentAdded} />
        ) : (
          <p className="mt-8 text-center text-gray-600">
            <Link to="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>{' '}
            to leave a comment.
          </p>
        )}

        <CommentList
          comments={post.comments}
          onCommentDeleted={handleCommentDeleted}
          // Assuming comments fetched with the post itself
          loading={false}
          error={null}
        />
      </article>
    </div>
  );
};

export default PostDetailPage;