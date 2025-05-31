import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useUser } from './UserContext';

interface Message {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  content: string;
  timestamp: string;
}

interface Chat {
  _id: string;
  participants: {
    _id: string;
    username: string;
  }[];
  messages: Message[];
  lastMessage: string;
}

interface ChatContextType {
  chats: Chat[];
  currentChat: Chat | null;
  setCurrentChat: (chat: Chat | null) => void;
  sendMessage: (content: string) => void;
  loading: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType>({
  chats: [],
  currentChat: null,
  setCurrentChat: () => {},
  sendMessage: () => {},
  loading: false,
  error: null,
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (user?.token) {
      const newSocket = io('http://localhost:5000', {
        auth: {
          token: user.token
        }
      });

      newSocket.on('connect', () => {
        console.log('Connected to chat server');
      });

      newSocket.on('new-message', (data) => {
        const { chatId, message } = data;
        setChats(prevChats => {
          return prevChats.map(chat => {
            if (chat._id === chatId) {
              return {
                ...chat,
                messages: [...chat.messages, message],
                lastMessage: message.timestamp
              };
            }
            return chat;
          });
        });

        if (currentChat?._id === chatId) {
          setCurrentChat(prev => {
            if (!prev) return null;
            return {
              ...prev,
              messages: [...prev.messages, message],
              lastMessage: message.timestamp
            };
          });
        }
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, [user?.token]);

  // Fetch user's chats
  useEffect(() => {
    const fetchChats = async () => {
      if (!user?.token) return;

      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/api/chat', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setChats(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('Failed to fetch chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user?.token]);

  // Join chat room when current chat changes
  useEffect(() => {
    if (socket && currentChat) {
      socket.emit('join-chat', currentChat._id);
    }
    return () => {
      if (socket && currentChat) {
        socket.emit('leave-chat', currentChat._id);
      }
    };
  }, [socket, currentChat]);

  const sendMessage = async (content: string) => {
    if (!currentChat || !user?.token) return;

    try {
      const response = await fetch(`http://localhost:5000/api/chat/${currentChat._id}/message`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content })
      });

      const message = await response.json();
      if (response.ok) {
        socket?.emit('send-message', {
          chatId: currentChat._id,
          message
        });
      } else {
        setError(message.message);
      }
    } catch (err) {
      setError('Failed to send message');
    }
  };

  return (
    <ChatContext.Provider value={{
      chats,
      currentChat,
      setCurrentChat,
      sendMessage,
      loading,
      error
    }}>
      {children}
    </ChatContext.Provider>
  );
}; 