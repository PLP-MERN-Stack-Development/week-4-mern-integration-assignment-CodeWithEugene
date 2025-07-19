// client/src/components/Blog/PostCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const defaultImage = '/uploads/default-post-image.jpg'; // Path from server's static files
  const imageUrl = post.imageUrl ? `${import.meta.env.VITE_API_BASE_URL.replace('/api', '')}${post.imageUrl}` : defaultImage;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
      <img src={imageUrl} alt={post.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-2">
          By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}
        </p>
        <p className="text-gray-700 line-clamp-3 mb-4">{post.content}</p>
        <Link
          to={`/posts/${post._id}`}
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
        >
          Read More
        </Link>
      </div>
    </div>
  );
};

export default PostCard;