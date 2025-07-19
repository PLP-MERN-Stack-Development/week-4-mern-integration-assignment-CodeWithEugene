// server/controllers/postController.js
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const Post = require('../models/Post');
const Comment = require('../models/Comment'); // To delete associated comments

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  const pageSize = 10; // Number of posts per page
  const page = Number(req.query.pageNumber) || 1; // Current page number

  const keyword = req.query.search
    ? {
        $or: [
          { title: { $regex: req.query.search, $options: 'i' } },
          { content: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  const categoryFilter = req.query.category
    ? { category: req.query.category }
    : {};

  const query = { ...keyword, ...categoryFilter };

  const count = await Post.countDocuments(query);
  const posts = await Post.find(query)
    .populate('author', 'username')
    .populate('category', 'name')
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });

  res.json({ posts, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Get a specific blog post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate('author', 'username')
    .populate('category', 'name')
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
        select: 'username',
      },
    });

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Private/Admin
const createPost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined; // Get image path if uploaded

  const post = new Post({
    title,
    content,
    category,
    author: req.user._id, // Author is the logged-in user
    imageUrl: imageUrl || '/uploads/default-post-image.jpg',
  });

  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Private/Admin
const updatePost = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, content, category } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  const post = await Post.findById(req.params.id);

  if (post) {
    // Check if the logged-in user is the author of the post or an admin
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to update this post');
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    if (imageUrl) {
        post.imageUrl = imageUrl;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Private/Admin
const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (post) {
    // Check if the logged-in user is the author of the post or an admin
    if (post.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
        res.status(403);
        throw new Error('Not authorized to delete this post');
    }

    // Delete associated comments first
    await Comment.deleteMany({ post: post._id });

    await post.deleteOne(); // Use deleteOne()
    res.json({ message: 'Post removed' });
  } else {
    res.status(404);
    throw new Error('Post not found');
  }
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};