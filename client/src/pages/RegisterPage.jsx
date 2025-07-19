// client/src/pages/RegisterPage.jsx
import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-[calc(100vh-120px)]">
      <RegisterForm />
      <p className="mt-4 text-gray-700">
        Already have an account?{' '}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;