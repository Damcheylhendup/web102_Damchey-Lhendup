const dataStore = require('../models');

// GET all users
const getAllUsers = (req, res) => {
  res.status(200).json(dataStore.users);
};

// GET user by ID
const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = dataStore.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.status(200).json(user);
};

// POST create user
const createUser = (req, res) => {
  const { username, email, name } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Required fields missing' });
  }

  const usernameExists = dataStore.users.some(user => user.username === username);
  const emailExists = dataStore.users.some(user => user.email === email);

  if (usernameExists) {
    return res.status(409).json({ error: 'Username already taken' });
  }

  if (emailExists) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const newUser = {
    id: dataStore.nextIds.users++,
    username,
    email,
    name: name || username,
    followers: [],
    following: [],
    createdAt: new Date().toISOString()
  };

  dataStore.users.push(newUser);
  res.status(201).json(newUser);
};

// PUT update user
const updateUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = dataStore.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const { name, email } = req.body;

  if (name !== undefined) user.name = name;

  if (email !== undefined) {
    const emailExists = dataStore.users.some(u => u.email === email && u.id !== userId);
    if (emailExists) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    user.email = email;
  }

  user.updatedAt = new Date().toISOString();
  res.status(200).json(user);
};

// DELETE user
const deleteUser = (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = dataStore.users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  dataStore.users.splice(userIndex, 1);
  dataStore.videos = dataStore.videos.filter(v => v.userId !== userId);
  dataStore.comments = dataStore.comments.filter(c => c.userId !== userId);

  dataStore.users.forEach(user => {
    user.followers = user.followers.filter(id => id !== userId);
    user.following = user.following.filter(id => id !== userId);
  });

  res.status(204).end();
};

// GET user videos
const getUserVideos = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = dataStore.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const videos = dataStore.videos.filter(v => v.userId === userId);
  res.status(200).json(videos);
};

// GET followers
const getUserFollowers = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = dataStore.users.find(u => u.id === userId);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followers = user.followers
    .map(followerId => dataStore.users.find(u => u.id === followerId))
    .filter(Boolean);

  res.status(200).json(followers);
};

// POST follow user
const followUser = (req, res) => {
  const userToFollowId = parseInt(req.params.id);
  const { followerId } = req.body;

  if (!followerId) {
    return res.status(400).json({ error: 'followerId is required' });
  }

  const userToFollow = dataStore.users.find(u => u.id === userToFollowId);
  const follower = dataStore.users.find(u => u.id === parseInt(followerId));

  if (!userToFollow || !follower) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (userToFollowId === parseInt(followerId)) {
    return res.status(400).json({ error: 'Users cannot follow themselves' });
  }

  if (userToFollow.followers.includes(parseInt(followerId))) {
    return res.status(400).json({ error: 'Already following this user' });
  }

  userToFollow.followers.push(parseInt(followerId));
  follower.following.push(userToFollowId);

  res.status(201).json({ message: 'User followed successfully' });
};

// DELETE unfollow user
const unfollowUser = (req, res) => {
  const userToUnfollowId = parseInt(req.params.id);
  const { followerId } = req.body;

  if (!followerId) {
    return res.status(400).json({ error: 'followerId is required' });
  }

  const userToUnfollow = dataStore.users.find(u => u.id === userToUnfollowId);
  const follower = dataStore.users.find(u => u.id === parseInt(followerId));

  if (!userToUnfollow || !follower) {
    return res.status(404).json({ error: 'User not found' });
  }

  const followerIndex = userToUnfollow.followers.indexOf(parseInt(followerId));
  const followingIndex = follower.following.indexOf(userToUnfollowId);

  if (followerIndex === -1 || followingIndex === -1) {
    return res.status(404).json({ error: 'Follow relationship not found' });
  }

  userToUnfollow.followers.splice(followerIndex, 1);
  follower.following.splice(followingIndex, 1);

  res.status(204).end();
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserVideos,
  getUserFollowers,
  followUser,
  unfollowUser
};