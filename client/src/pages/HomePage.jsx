// client/src/pages/HomePage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostList from '../components/Blog/PostList';
import Pagination from '../components/Common/Pagination';
import useApi from '../hooks/useApi';
import postService from '../services/postService';
import categoryService from '../services/categoryService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorDisplay from '../components/Common/ErrorDisplay';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const [pageNumber, setPageNumber] = useState(Number(queryParams.get('page')) || 1);
  const [searchKeyword, setSearchKeyword] = useState(queryParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || '');

  const fetchPostsApi = useCallback(
    (page, search, category) => postService.getPosts(page, search, category),
    []
  );
  const fetchCategoriesApi = useCallback(() => categoryService.getCategories(), []);

  const {
    data: postsData,
    loading: postsLoading,
    error: postsError,
    execute: fetchPosts,
  } = useApi(fetchPostsApi, { posts: [], page: 1, pages: 1 });

  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    execute: fetchCategories,
  } = useApi(fetchCategoriesApi, []);

  useEffect(() => {
    fetchPosts(pageNumber, searchKeyword, selectedCategory);
  }, [pageNumber, searchKeyword, selectedCategory, fetchPosts]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handlePageChange = (page) => {
    setPageNumber(page);
    updateUrlParams(page, searchKeyword, selectedCategory);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageNumber(1);
    updateUrlParams(1, searchKeyword, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setPageNumber(1);
    updateUrlParams(1, searchKeyword, e.target.value);
  };

  const updateUrlParams = (page, search, category) => {
    const params = new URLSearchParams();
    if (page && page !== 1) params.set('page', page);
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    navigate({ search: params.toString() });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 flex flex-col items-center justify-start py-8 px-2">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-5xl font-extrabold text-center mb-10 text-blue-700 drop-shadow-lg">
          Latest Blog Posts
        </h1>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row justify-center items-center mb-10 gap-6">
          <form
            onSubmit={handleSearchSubmit}
            className="flex-grow w-full md:w-auto flex justify-center"
          >
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search posts..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full p-3 pl-5 pr-32 border-2 border-blue-200 rounded-full shadow focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-gradient-to-r from-blue-600 to-purple-500 text-white rounded-full font-semibold shadow hover:scale-105 transition"
              >
                Search
              </button>
            </div>
          </form>

          <div className="w-full md:w-auto flex justify-center">
            {categoriesLoading ? (
              <LoadingSpinner />
            ) : (
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="w-full max-w-xs p-3 border-2 border-blue-200 rounded-full shadow focus:outline-none focus:ring-4 focus:ring-purple-300 transition"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
            {categoriesError && <ErrorDisplay message={categoriesError} />}
          </div>
        </div>

        <div className="flex flex-col items-center">
          <PostList posts={postsData.posts} loading={postsLoading} error={postsError} />
          <Pagination
            pages={postsData.pages}
            page={postsData.page}
            onPageChange={handlePageChange}
            className="mt-8"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
