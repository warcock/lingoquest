import { useChat } from '../../context/ChatContext';
import { useUser } from '../../context/UserContext';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

const ChatList = () => {
  const { chats, currentChat, setCurrentChat, loading } = useChat();
  const { user } = useUser();

  if (loading) {
    return <div className="p-4">Loading chats...</div>;
  }

  if (chats.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No chats yet. Start a conversation with a friend!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {chats.map((chat) => {
        const otherParticipant = chat.participants.find(
          (p) => p._id !== user?._id
        );
        
        if (!otherParticipant) return null;

        const isActive = currentChat?._id === chat._id;
        const lastMessage = chat.messages[chat.messages.length - 1];
        const lastMessageTime = lastMessage
          ? new Date(lastMessage.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        return (
          <motion.button
            key={chat._id}
            onClick={() => setCurrentChat(chat)}
            className={`w-full p-3 rounded-lg text-left transition-colors ${
              isActive
                ? 'bg-primary text-white'
                : 'hover:bg-gray-100'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <MessageSquare size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                </div>
              </div>
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className={`font-medium truncate ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {otherParticipant.username}
                  </p>
                  {lastMessageTime && (
                    <span className={`text-sm ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {lastMessageTime}
                    </span>
                  )}
                </div>
                {lastMessage && (
                  <p className={`text-sm truncate ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                    {lastMessage.content}
                  </p>
                )}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default ChatList; 