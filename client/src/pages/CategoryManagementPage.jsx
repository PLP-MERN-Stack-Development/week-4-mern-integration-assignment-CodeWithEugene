// client/src/pages/CategoryManagementPage.jsx
import React, { useState, useEffect } from 'react';
import useApi from '../hooks/useApi';
import categoryService from '../services/categoryService';
import CategoryForm from '../components/Category/CategoryForm';
import CategoryList from '../components/Category/CategoryList';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorDisplay from '../components/Common/ErrorDisplay';

const CategoryManagementPage = () => {
  const { data: categories, loading, error, execute: fetchCategories } = useApi(categoryService.getCategories, []);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryAddedOrUpdated = () => {
    fetchCategories(); // Refetch categories to update the list
    setCategoryToEdit(null); // Clear edit form after update
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Category Management</h1>

      <CategoryForm
        categoryToEdit={categoryToEdit}
        onCategoryAddedOrUpdated={handleCategoryAddedOrUpdated}
      />

      <CategoryList
        categories={categories}
        loading={loading}
        error={error}
        refetchCategories={fetchCategories}
        onEditCategory={handleEditCategory}
      />
    </div>
  );
};

export default CategoryManagementPage;