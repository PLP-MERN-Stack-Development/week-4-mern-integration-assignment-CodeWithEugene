// server/routes/commentRoutes.js
const express = require('express');
const { body } = require('express-validator');
const {
  addComment,
  getCommentsByPostId,
  deleteComment,
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route for adding a comment to a specific post
router.post(
  '/posts/:id/comments',
  protect,
  [body('content').notEmpty().withMessage('Comment content cannot be empty')],
  addComment
);

// Route for getting comments for a specific post
router.get('/posts/:id/comments', getCommentsByPostId);

// Route for deleting a specific comment
router.delete('/comments/:id', protect, deleteComment);

module.exports = router;