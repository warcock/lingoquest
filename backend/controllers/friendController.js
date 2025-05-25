const User = require('../models/User');
const Activity = require('../models/Activity');
// Import other necessary models if needed, e.g., for activity feed

// @desc    Send a friend request
// @route   POST /api/friends/request/send/:userId
// @access  Private
const sendFriendRequest = async (req, res) => {
    try {
        const senderId = req.user._id; // Authenticated user
        const recipientId = req.params.userId;

        // Find both users
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        // Check if recipient exists
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found' });
        }

        // Check if already friends
        if (sender.friends.includes(recipientId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        // Check if request already sent by sender
        if (sender.friendRequestsSent.includes(recipientId)) {
            return res.status(400).json({ message: 'Friend request already sent to this user' });
        }

        // Check if request already received by sender (recipient has sent a request to sender)
        if (sender.friendRequestsReceived.includes(recipientId)) {
             return res.status(400).json({ message: 'This user has already sent you a friend request' });
        }

        // Add recipient to sender's sent requests
        sender.friendRequestsSent.push(recipientId);
        await sender.save();

        // Add sender to recipient's received requests
        recipient.friendRequestsReceived.push(senderId);
        console.log('Recipient friendRequestsReceived before save:', recipient.friendRequestsReceived);
        await recipient.save();

        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Accept a friend request
// @route   PUT /api/friends/request/accept/:requestId
// @access  Private
const acceptFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user._id; // Authenticated user (the one accepting)
        const senderId = req.params.requestId; // The ID of the user who sent the request

        // Find both users
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        // Check if sender exists
        if (!sender) {
            return res.status(404).json({ message: 'Sender user not found' });
        }

        // Check if there is a pending request from this sender to the receiver
        if (!receiver.friendRequestsReceived.includes(senderId)) {
            return res.status(400).json({ message: 'No pending friend request from this user' });
        }
        
        // Check if they are already friends (shouldn't happen if the above check passes, but good practice)
         if (receiver.friends.includes(senderId)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        // Add each other to friends lists
        receiver.friends.push(senderId);
        sender.friends.push(receiverId);

        // Remove the request from both users' request lists
        receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
            (id) => id.toString() !== senderId.toString()
        );
        sender.friendRequestsSent = sender.friendRequestsSent.filter(
            (id) => id.toString() !== receiverId.toString()
        );

        await receiver.save();
        await sender.save();

        // Create activity for both users when friend request is accepted
        await Activity.create({
            user: receiver._id,
            type: 'added_friend',
            details: { friendId: sender._id, friendUsername: sender.username }
        });
        
        await Activity.create({
            user: sender._id,
            type: 'added_friend',
            details: { friendId: receiver._id, friendUsername: receiver.username }
        });

        res.status(200).json({ message: 'Friend request accepted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Reject a friend request
// @route   PUT /api/friends/request/reject/:requestId
// @access  Private
const rejectFriendRequest = async (req, res) => {
    try {
        const receiverId = req.user._id; // Authenticated user (the one rejecting)
        const senderId = req.params.requestId; // The ID of the user who sent the request

        // Find both users
        const receiver = await User.findById(receiverId);
        const sender = await User.findById(senderId);

        // Check if sender exists
        if (!sender) {
            return res.status(404).json({ message: 'Sender user not found' });
        }

        // Check if there is a pending request from this sender to the receiver
        if (!receiver.friendRequestsReceived.includes(senderId)) {
            return res.status(400).json({ message: 'No pending friend request from this user' });
        }

        // Remove the request from both users' request lists
        receiver.friendRequestsReceived = receiver.friendRequestsReceived.filter(
            (id) => id.toString() !== senderId.toString()
        );
        sender.friendRequestsSent = sender.friendRequestsSent.filter(
            (id) => id.toString() !== receiverId.toString()
        );

        await receiver.save();
        await sender.save();

        res.status(200).json({ message: 'Friend request rejected successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Cancel a friend request
// @route   DELETE /api/friends/request/cancel/:requestId
// @access  Private
const cancelFriendRequest = async (req, res) => {
    try {
        const senderId = req.user._id; // Authenticated user (the one cancelling)
        const recipientId = req.params.requestId; // The ID of the user who received the request

        // Find both users
        const sender = await User.findById(senderId);
        const recipient = await User.findById(recipientId);

        // Check if recipient exists
        if (!recipient) {
            return res.status(404).json({ message: 'Recipient user not found' });
        }

        // Check if there is a pending request from the sender to the recipient
        if (!sender.friendRequestsSent.includes(recipientId)) {
            return res.status(400).json({ message: 'No pending friend request to this user' });
        }

        // Remove the request from both users' request lists
        sender.friendRequestsSent = sender.friendRequestsSent.filter(
            (id) => id.toString() !== recipientId.toString()
        );
        recipient.friendRequestsReceived = recipient.friendRequestsReceived.filter(
            (id) => id.toString() !== senderId.toString()
        );

        await sender.save();
        await recipient.save();

        res.status(200).json({ message: 'Friend request cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's friends
// @route   GET /api/friends/
// @access  Private
const getFriends = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user

        // Find the user and populate the friends field
        const user = await User.findById(userId).populate('friends', 'username'); // Only select username for friends

        if (user) {
            res.status(200).json(user.friends);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's sent friend requests
// @route   GET /api/friends/requests/sent
// @access  Private
const getFriendRequestsSent = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user

        // Find the user and populate the friendRequestsSent field
        const user = await User.findById(userId).populate('friendRequestsSent', 'username'); // Only select username

        if (user) {
            res.status(200).json(user.friendRequestsSent);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get user's received friend requests
// @route   GET /api/friends/requests/received
// @access  Private
const getFriendRequestsReceived = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user

        // Find the user and populate the friendRequestsReceived field
        const user = await User.findById(userId).populate('friendRequestsReceived', 'username'); // Only select username

        if (user) {
            res.status(200).json(user.friendRequestsReceived);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Search for users
// @route   GET /api/friends/search
// @access  Private
const searchUsers = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user
        const { query } = req.query; // Use a more general query parameter

        if (!query) {
            return res.status(400).json({ message: 'Please provide a username or email to search' });
        }

        // Search for users whose username or email matches the query (case-insensitive, partial match)
        // Exclude the currently authenticated user from results
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
            ],
            _id: { $ne: userId }
        }).select('_id username email'); // Select ID, username, and email

        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Remove a friend
// @route   DELETE /api/friends/:friendId
// @access  Private
const removeFriend = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user
        const friendId = req.params.friendId;

        // Find both users
        const user = await User.findById(userId);
        const friendToRemove = await User.findById(friendId);

        // Check if the friend exists
        if (!friendToRemove) {
            return res.status(404).json({ message: 'Friend not found' });
        }

        // Check if they are actually friends
        if (!user.friends.includes(friendId)) {
            return res.status(400).json({ message: 'User is not in your friends list' });
        }

        // Remove friend from user's friend list
        user.friends = user.friends.filter(
            (id) => id.toString() !== friendId.toString()
        );

        // Remove user from friend's friend list
        friendToRemove.friends = friendToRemove.friends.filter(
            (id) => id.toString() !== userId.toString()
        );

        await user.save();
        await friendToRemove.save();

        res.status(200).json({ message: 'Friend removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get friend activity
// @route   GET /api/friends/activity
// @access  Private
const getFriendActivity = async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user

        // Find the user and populate their friends list
        const user = await User.findById(userId).populate('friends', '_id'); // Only need friend IDs

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const friendIds = user.friends.map((friend) => friend._id);

        // Fetch recent activities of friends
        // Limit to a certain number of activities (e.g., 20)
        // Sort by createdAt in descending order
        const friendActivities = await Activity.find({
            user: { $in: friendIds } // Activities where the user is one of the friends
        })
        .populate('user', 'username') // Populate the user field to get friend's username
        .sort({ createdAt: -1 })
        .limit(20);

        // Format the activity data for the frontend if needed
        // For now, send the raw activity objects (populated with username)

        res.status(200).json(friendActivities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
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
}; 