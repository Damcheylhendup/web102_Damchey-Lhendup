const getAllVideos = (req, res) => {
  res.json([{ id: 1, title: "Test Video" }]);
};

const createVideo = (req, res) => {
  res.status(201).json({ message: "Video created" });
};

const getVideoById = (req, res) => {
  res.json({ id: req.params.id, title: "Single Video" });
};

const updateVideo = (req, res) => {
  res.json({ message: `Video ${req.params.id} updated` });
};

const deleteVideo = (req, res) => {
  res.status(204).end();
};

const getVideoComments = (req, res) => {
  res.json([{ id: 1, text: "Nice video" }]);
};

const getVideoLikes = (req, res) => {
  res.json([{ id: 1, name: "User 1" }]);
};

const likeVideo = (req, res) => {
  res.status(201).json({ message: "Video liked" });
};

const unlikeVideo = (req, res) => {
  res.status(204).end();
};

module.exports = {
  getAllVideos,
  createVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  getVideoComments,
  getVideoLikes,
  likeVideo,
  unlikeVideo,
};