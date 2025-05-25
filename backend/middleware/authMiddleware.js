const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    console.log('--- Auth Middleware Debug ---');
    console.log('JWT_SECRET:', process.env.JWT_SECRET);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            console.log('Received Token:', token);

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log('Decoded Token:', decoded);

            // Get user from the token
            req.user = await User.findById(decoded.id).select('-password');

            console.log('User found:', req.user ? req.user.username : 'None');

            next();
        } catch (error) {
            console.error('Auth Middleware Error:', error);
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        console.log('No token found');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect }; 