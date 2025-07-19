// server/routes/postRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/postController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // For image uploads

const router = express.Router();

router
  .route('/')
  .get(getPosts)
  .post(
    protect,
    authorizeRoles('admin'),
    upload.single('image'), // 'image' is the field name for the file
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('content').notEmpty().withMessage('Content is required'),
      body('category').notEmpty().withMessage('Category is required'),
    ],
    createPost
  );

router
  .route('/:id')
  .get(getPostById)
  .put(
    protect,
    authorizeRoles('admin', 'user'), // Allow author to update
    upload.single('image'),
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('content').notEmpty().withMessage('Content is required'),
      body('category').notEmpty().withMessage('Category is required'),
    ],
    updatePost
  )
  .delete(protect, authorizeRoles('admin', 'user'), deletePost); // Allow author to delete

module.exports = router;