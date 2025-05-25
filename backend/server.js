const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path'); // Import path module

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware for /api/friends path
app.use('/api/friends', (req, res, next) => {
  console.log(`--- Incoming Friend Request ---`);
  console.log(`Path: ${req.path}`);
  console.log(`Method: ${req.method}`);
  // You can add more details here if needed, e.g., req.headers
  next(); // Continue to the next middleware/route handler
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
// app.use('/api/quizzes', require('./routes/quizRoutes'));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    // Assumes your frontend build output is in a 'dist' folder in the root of the project
    app.use(express.static(path.join(__dirname, '../dist')));

    // Serve index.html for all other routes
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../dist', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 