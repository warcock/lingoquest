const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, updateProgress } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/', registerUser);
router.post('/login', loginUser);

// Protected routes
router.get('/profile', protect, getUserProfile);
router.put('/progress', protect, updateProgress);

module.exports = router; 