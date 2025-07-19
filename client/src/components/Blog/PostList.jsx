// client/src/components/Blog/PostList.jsx
import React from 'react';
import PostCard from './PostCard';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorDisplay from '../Common/ErrorDisplay';

const PostList = ({ posts, loading, error }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.length === 0 ? (
        <p className="col-span-full text-center text-gray-600 text-lg">No blog posts found.</p>
      ) : (
        posts.map((post) => <PostCard key={post._id} post={post} />)
      )}
    </div>
  );
};

export default PostList;