const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllStories,
  getStoryById,
  createStory,
  toggleLike,
  addComment
} = require('../controllers/storyController');

router.get('/', getAllStories);
router.get('/:id', getStoryById);
router.post('/', authMiddleware, createStory);
router.post('/:id/like', authMiddleware, toggleLike);
router.post('/:id/comments', authMiddleware, addComment);

module.exports = router;
