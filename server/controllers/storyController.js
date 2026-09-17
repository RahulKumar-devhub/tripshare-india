const TravelStory = require('../models/TravelStory');
const Notification = require('../models/Notification');

// GET /api/stories - public - fetch stories with filters
const getAllStories = async (req, res) => {
  try {
    const { destination, tag, search } = req.query;
    const query = {};

    if (destination) {
      query.destination = { $regex: destination.trim(), $options: 'i' };
    }
    if (tag) {
      query.tags = tag;
    }
    if (search) {
      const searchRe = { $regex: search.trim(), $options: 'i' };
      query.$or = [{ title: searchRe }, { destination: searchRe }, { content: searchRe }, { excerpt: searchRe }];
    }

    const stories = await TravelStory.find(query)
      .populate('author', 'fullName city profileImage travelStyle verified')
      .populate('comments.user', 'fullName city profileImage')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: stories.length, stories });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch stories.', error: err.message });
  }
};

// GET /api/stories/:id - public - get single story
const getStoryById = async (req, res) => {
  try {
    const story = await TravelStory.findById(req.params.id)
      .populate('author', 'fullName city bio profileImage travelStyle verified')
      .populate('comments.user', 'fullName city profileImage travelStyle');

    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' });

    res.json({ success: true, story });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not fetch story.', error: err.message });
  }
};

// POST /api/stories - protected - create new story
const createStory = async (req, res) => {
  try {
    const { title, destination, coverImage, excerpt, content, tripDuration, budgetSpent, travelStyle, tags } = req.body;

    if (!title || !destination || !content) {
      return res.status(400).json({ success: false, message: 'Title, destination, and content are required.' });
    }

    const defaultImage = 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80';

    const story = await TravelStory.create({
      author: req.user._id,
      title: title.trim(),
      destination: destination.trim(),
      coverImage: coverImage || defaultImage,
      excerpt: excerpt || content.slice(0, 180) + '...',
      content,
      tripDuration: tripDuration || '4 Days',
      budgetSpent: budgetSpent ? Number(budgetSpent) : 10000,
      travelStyle: travelStyle || 'Adventure',
      tags: Array.isArray(tags) ? tags : []
    });

    const populated = await TravelStory.findById(story._id).populate('author', 'fullName city profileImage travelStyle verified');

    res.status(201).json({ success: true, message: 'Story published successfully!', story: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not publish story.', error: err.message });
  }
};

// POST /api/stories/:id/like - protected - toggle like
const toggleLike = async (req, res) => {
  try {
    const story = await TravelStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' });

    const userId = req.user._id;
    const index = story.likes.findIndex((id) => String(id) === String(userId));
    let liked = false;

    if (index > -1) {
      story.likes.splice(index, 1);
    } else {
      story.likes.push(userId);
      liked = true;

      // Notify author if not self
      if (String(story.author) !== String(userId)) {
        await Notification.create({
          user: story.author,
          sender: userId,
          type: 'story_like',
          title: 'Someone liked your story!',
          message: `${req.user.fullName} liked your story "${story.title}".`,
          link: `/community/${story._id}`
        });
      }
    }

    await story.save();
    res.json({ success: true, liked, likesCount: story.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not update like.', error: err.message });
  }
};

// POST /api/stories/:id/comments - protected - add comment
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ success: false, message: 'Comment text cannot be empty.' });
    }

    const story = await TravelStory.findById(req.params.id);
    if (!story) return res.status(404).json({ success: false, message: 'Story not found.' });

    story.comments.push({
      user: req.user._id,
      text: text.trim(),
      createdAt: new Date()
    });

    await story.save();

    const updated = await TravelStory.findById(story._id)
      .populate('comments.user', 'fullName city profileImage travelStyle');

    res.status(201).json({
      success: true,
      message: 'Comment posted.',
      comments: updated.comments
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Could not post comment.', error: err.message });
  }
};

module.exports = { getAllStories, getStoryById, createStory, toggleLike, addComment };
