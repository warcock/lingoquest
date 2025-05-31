const Chat = require('../models/Chat');
const User = require('../models/User');

// @desc    Get or create a chat between two users
// @route   GET /api/chat/:friendId
// @access  Private
const getOrCreateChat = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendId = req.params.friendId;

    // Check if users are friends
    const user = await User.findById(userId);
    if (!user.friends.includes(friendId)) {
      return res.status(403).json({ message: 'You can only chat with friends' });
    }

    // Find existing chat
    let chat = await Chat.findOne({
      participants: { $all: [userId, friendId] }
    }).populate('participants', 'username')
      .populate('messages.sender', 'username');

    // If no chat exists, create one
    if (!chat) {
      chat = await Chat.create({
        participants: [userId, friendId],
        messages: []
      });
      chat = await chat.populate('participants', 'username');
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all chats for a user
// @route   GET /api/chat
// @access  Private
const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId
    })
    .populate('participants', 'username')
    .sort({ lastMessage: -1 });

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a message to a chat
// @route   POST /api/chat/:chatId/message
// @access  Private
const addMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const chatId = req.params.chatId;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Verify user is a participant
    if (!chat.participants.includes(userId)) {
      return res.status(403).json({ message: 'Not authorized to send messages in this chat' });
    }

    // Add message
    chat.messages.push({
      sender: userId,
      content
    });
    chat.lastMessage = Date.now();
    await chat.save();

    // Populate sender info
    await chat.populate('messages.sender', 'username');

    // Get the last message
    const lastMessage = chat.messages[chat.messages.length - 1];

    res.status(200).json(lastMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getOrCreateChat,
  getUserChats,
  addMessage
}; 