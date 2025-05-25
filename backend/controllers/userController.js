const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Activity = require('../models/Activity');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/users
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                progress: user.progress,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check for user email
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                progress: user.progress,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update user progress
// @route   PUT /api/users/progress
// @access  Private
const updateProgress = async (req, res) => {
    try {
        const { quizId, score } = req.body;
        const user = await User.findById(req.user._id);

        // Add completed quiz to progress
        user.progress.completedQuizzes.push({
            quiz: quizId,
            score,
            completedAt: Date.now()
        });

        // Calculate experience gained (example: 10 points per correct answer)
        const experienceGained = score * 10;
        user.progress.experience += experienceGained;

        // Level up if enough experience (example: 100 experience per level)
        const oldLevel = user.progress.currentLevel;
        const newLevel = Math.floor(user.progress.experience / 100) + 1;
        if (newLevel > oldLevel) {
            user.progress.currentLevel = newLevel;
            // Create activity for achieving a new level
            await Activity.create({
                user: user._id,
                type: 'achieved_level',
                details: { level: newLevel }
            });
        }
        
        // Create activity for completing a quiz
        // To get quiz title, we might need to populate or send it from frontend
        // For simplicity now, just store quizId and score
        await Activity.create({
            user: user._id,
            type: 'completed_quiz',
            details: { quizId, score }
        });

        await user.save();
        res.json(user.progress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    updateProgress
}; 