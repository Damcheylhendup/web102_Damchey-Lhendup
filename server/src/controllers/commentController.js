const dataStore = require('../models');

// GET all comments
const getAllComments = (req, res) => {
  res.status(200).json(dataStore.comments);
};

// GET comment by ID
const getCommentById = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  res.status(200).json(comment);
};

// POST create comment
const createComment = (req, res) => {
  const { text, userId, videoId } = req.body;

  if (!text || !userId || !videoId) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const user = dataStore.users.find(u => u.id === parseInt(userId));
  const video = dataStore.videos.find(v => v.id === parseInt(videoId));

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!video) {
    return res.status(404).json({ error: 'Video not found' });
  }

  const newComment = {
    id: dataStore.nextIds.comments++,
    text,
    userId: parseInt(userId),
    videoId: parseInt(videoId),
    likes: [],
    createdAt: new Date().toISOString()
  };

  dataStore.comments.push(newComment);
  res.status(201).json(newComment);
};

// PUT update comment
const updateComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const { text } = req.body;

  if (text !== undefined) {
    comment.text = text;
  }

  comment.updatedAt = new Date().toISOString();

  res.status(200).json(comment);
};

// DELETE comment
const deleteComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const commentIndex = dataStore.comments.findIndex(c => c.id === commentId);

  if (commentIndex === -1) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  dataStore.comments.splice(commentIndex, 1);
  res.status(204).end();
};

// GET comment likes
const getCommentLikes = (req, res) => {
  const commentId = parseInt(req.params.id);
  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const likeUsers = comment.likes
    .map(userId => dataStore.users.find(user => user.id === userId))
    .filter(Boolean);

  res.status(200).json(likeUsers);
};

// POST like comment
const likeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const comment = dataStore.comments.find(c => c.id === commentId);
  const user = dataStore.users.find(u => u.id === parseInt(userId));

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (comment.likes.includes(parseInt(userId))) {
    return res.status(400).json({ error: 'User already liked this comment' });
  }

  comment.likes.push(parseInt(userId));
  res.status(201).json({ message: 'Comment liked successfully' });
};

// DELETE unlike comment
const unlikeComment = (req, res) => {
  const commentId = parseInt(req.params.id);
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'userId is required' });
  }

  const comment = dataStore.comments.find(c => c.id === commentId);

  if (!comment) {
    return res.status(404).json({ error: 'Comment not found' });
  }

  const likeIndex = comment.likes.indexOf(parseInt(userId));

  if (likeIndex === -1) {
    return res.status(404).json({ error: 'Like not found' });
  }

  comment.likes.splice(likeIndex, 1);
  res.status(204).end();
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
  getCommentLikes,
  likeComment,
  unlikeComment
};
