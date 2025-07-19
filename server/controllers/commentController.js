// server/controllers/commentController.js
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const Post = require('../models/Post'); // To update post comments array

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { content } = req.body;
  const postId = req.params.id;
  const userId = req.user._id;

  const post = await Post.findById(postId);

  if (!post) {
    res.status(404);
    throw new Error('Post not found');
  }

  const comment = new Comment({
    content,
    author: userId,
    post: postId,
  });

  const createdComment = await comment.save();

  // Add comment ID to the post's comments array
  post.comments.push(createdComment._id);
  await post.save();

  // Populate author information before sending response
  const populatedComment = await Comment.findById(createdComment._id).populate(
    'author',
    'username'
  );

  res.status(201).json(populatedComment);
});

// @desc    Get comments for a specific post
// @route   GET /api/posts/:id/comments
// @access  Public
const getCommentsByPostId = asyncHandler(async (req, res) => {
  const postId = req.params.id;
  const comments = await Comment.find({ post: postId }).populate(
    'author',
    'username'
  );
  res.json(comments);
});

// @desc    Delete a comment (only by comment author or admin)
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    res.status(404);
    throw new Error('Comment not found');
  }

  // Check if user is the author or an admin
  if (comment.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
    res.status(403);
    throw new Error('Not authorized to delete this comment');
  }

  // Remove comment ID from the post's comments array
  const post = await Post.findById(comment.post);
  if (post) {
    post.comments = post.comments.filter(
      (c) => c.toString() !== comment._id.toString()
    );
    await post.save();
  }

  await comment.deleteOne();
  res.json({ message: 'Comment removed' });
});

module.exports = { addComment, getCommentsByPostId, deleteComment };