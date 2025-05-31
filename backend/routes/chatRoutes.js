const express = require('express');
const router = express.Router();
const { 
  getOrCreateChat,
  getUserChats,
  addMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes are protected
router.get('/', protect, getUserChats);
router.get('/:friendId', protect, getOrCreateChat);
router.post('/:chatId/message', protect, addMessage);

module.exports = router; 