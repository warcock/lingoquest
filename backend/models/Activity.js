const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['completed_exercise', 'completed_quiz', 'achieved_level', 'added_friend'] // Define possible activity types
    },
    details: {
        // Flexible field to store details specific to the activity type
        // e.g., { exerciseId: 'abc', title: 'Exercise Title' }
        // e.g., { quizId: 'xyz', score: 85 }
        // e.g., { level: 5 }
        // e.g., { friendId: '123', friendUsername: 'newfriend' }
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Activity', activitySchema); 