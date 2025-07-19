// client/src/components/Common/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user } = useAuth();

  if (!user) {
    toast.error('You need to be logged in to access this page.');
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !user.isAdmin) {
    toast.error('You do not have permission to access this page.');
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;