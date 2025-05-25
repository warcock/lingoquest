const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

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

// Basic route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/friends', require('./routes/friendRoutes'));
// app.use('/api/quizzes', require('./routes/quizRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 