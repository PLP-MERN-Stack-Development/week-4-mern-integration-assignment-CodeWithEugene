// client/src/components/Common/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          MERN Blog
        </Link>
        <nav className="space-x-4">
          <Link to="/" className="hover:text-gray-300">
            Home
          </Link>
          {user && user.isAdmin && (
            <Link to="/categories" className="hover:text-gray-300">
              Categories
            </Link>
          )}
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/posts/new" className="hover:text-gray-300">
                  Create Post
                </Link>
              )}
              <span className="text-gray-300">Hello, {user.username}!</span>
              <button onClick={logout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-gray-300">
                Login
              </Link>
              <Link to="/register" className="hover:text-gray-300">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;