const dataStore = {
  nextIds: {
    users: 3,
    videos: 3,
    comments: 3
  },

  users: [
    {
      id: 1,
      username: "damchey",
      email: "damchey@example.com",
      name: "Damchey",
      followers: [2],
      following: [2],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      username: "sonam",
      email: "sonam@example.com",
      name: "Sonam",
      followers: [1],
      following: [1],
      createdAt: new Date().toISOString()
    }
  ],

  videos: [
    {
      id: 1,
      title: "Morning Vlog",
      description: "My first short video",
      url: "https://example.com/video1.mp4",
      userId: 1,
      likes: [2],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      title: "Travel Clip",
      description: "A trip video",
      url: "https://example.com/video2.mp4",
      userId: 2,
      likes: [1],
      createdAt: new Date().toISOString()
    }
  ],

  comments: [
    {
      id: 1,
      text: "Nice video!",
      userId: 2,
      videoId: 1,
      likes: [],
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      text: "Great work!",
      userId: 1,
      videoId: 2,
      likes: [],
      createdAt: new Date().toISOString()
    }
  ]
};

module.exports = dataStore;