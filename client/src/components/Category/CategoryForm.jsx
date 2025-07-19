// client/src/components/Category/CategoryForm.jsx
import React, { useState, useEffect } from 'react';
import useApi from '../../hooks/useApi';
import categoryService from '../../services/categoryService';
import LoadingSpinner from '../Common/LoadingSpinner';
import ErrorDisplay from '../Common/ErrorDisplay';
import { toast } from 'react-hot-toast';

const CategoryForm = ({ categoryToEdit, onCategoryAddedOrUpdated }) => {
  const [name, setName] = useState('');

  const {
    loading: createLoading,
    error: createError,
    execute: executeCreate,
  } = useApi(categoryService.createCategory);
  const {
    loading: updateLoading,
    error: updateError,
    execute: executeUpdate,
  } = useApi(categoryService.updateCategory);

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
    } else {
      setName('');
    }
  }, [categoryToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (categoryToEdit) {
        await executeUpdate(categoryToEdit._id, name);
        toast.success('Category updated successfully!');
      } else {
        await executeCreate(name);
        toast.success('Category created successfully!');
        setName(''); // Clear form after creation
      }
      if (onCategoryAddedOrUpdated) {
        onCategoryAddedOrUpdated();
      }
    } catch {
      // Error handled by useApi and toast
    }
  };

  const loading = createLoading || updateLoading;
  const error = createError || updateError;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold mb-4">{categoryToEdit ? 'Edit Category' : 'Create New Category'}</h2>
      {error && <ErrorDisplay message={error} />}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="categoryName" className="block text-gray-700 text-sm font-bold mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          disabled={loading}
        >
          {loading ? <LoadingSpinner /> : (categoryToEdit ? 'Update Category' : 'Create Category')}
        </button>
      </form>
    </div>
  );
};

export default CategoryForm;