const express = require('express');
const router = express.Router();
const { 
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    getFriends,
    getFriendRequestsSent,
    getFriendRequestsReceived,
    searchUsers,
    removeFriend,
    getFriendActivity
} = require('../controllers/friendController');
const { protect } = require('../middleware/authMiddleware');

// All friend routes will be protected
router.post('/request/send/:userId', protect, sendFriendRequest);
router.put('/request/accept/:requestId', protect, acceptFriendRequest);
router.put('/request/reject/:requestId', protect, rejectFriendRequest);
router.delete('/request/cancel/:requestId', protect, cancelFriendRequest);
router.get('/', protect, getFriends);
router.get('/requests/sent', protect, getFriendRequestsSent);
router.get('/requests/received', protect, getFriendRequestsReceived);
router.get('/search', protect, searchUsers);
router.delete('/:friendId', protect, removeFriend);
router.get('/activity', protect, getFriendActivity);

module.exports = router;