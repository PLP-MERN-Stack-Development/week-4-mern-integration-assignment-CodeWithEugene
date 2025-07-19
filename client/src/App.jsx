// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Common/Header';
import HomePage from './pages/HomePage';
import PostDetailPage from './pages/PostDetailPage';
import PostFormPage from './pages/PostFormPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CategoryManagementPage from './pages/CategoryManagementPage';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Toaster position="top-right" reverseOrder={false} />
      <Header />
      <main className="flex-grow py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route path="/posts/new" element={<PostFormPage />} />
            <Route path="/posts/:id/edit" element={<PostFormPage />} />
            <Route path="/categories" element={<CategoryManagementPage />} />
          </Route>

          {/* Fallback for 404 */}
          <Route path="*" element={<h1 className="text-center text-3xl mt-10">404 - Page Not Found</h1>} />
        </Routes>
      </main>
      {/* <Footer /> Optional: Add a Footer component if desired */}
    </div>
  );
}

export default App;