// server/routes/categoryRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(getCategories)
  .post(
    protect,
    authorizeRoles('admin'),
    [body('name').notEmpty().withMessage('Category name is required')],
    createCategory
  );

router
  .route('/:id')
  .put(
    protect,
    authorizeRoles('admin'),
    [body('name').notEmpty().withMessage('Category name is required')],
    updateCategory
  )
  .delete(protect, authorizeRoles('admin'), deleteCategory);

module.exports = router;