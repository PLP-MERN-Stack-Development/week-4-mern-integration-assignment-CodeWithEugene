// client/src/components/Category/CategoryList.jsx
import React from 'react';
import useApi from '../../hooks/useApi';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorDisplay from '../Common/ErrorDisplay';
import { toast } from 'react-hot-toast';

const CategoryList = ({ categories, loading, error, refetchCategories, onEditCategory }) => {
  const {
    loading: deleteLoading,
    error: deleteError,
    execute: executeDelete,
  } = useApi(categoryService.deleteCategory);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await executeDelete(id);
        toast.success('Category deleted successfully!');
        refetchCategories(); // Refresh list after deletion
      } catch {
        // Error handled by useApi and toast
      }
    }
  };

  if (loading || deleteLoading) return <LoadingSpinner />;
  if (error || deleteError) return <ErrorDisplay message={error || deleteError} />;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manage Categories</h2>
      {categories.length === 0 ? (
        <p className="text-gray-600">No categories found. Create one above!</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category._id} className="py-3 flex justify-between items-center">
              <span className="text-lg">{category.name}</span>
              <div>
                <button
                  onClick={() => onEditCategory(category)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;