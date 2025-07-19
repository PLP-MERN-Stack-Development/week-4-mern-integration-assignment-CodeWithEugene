// client/src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <LoginForm />
      <p className="mt-4 text-gray-700">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 hover:underline">
          Register
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;