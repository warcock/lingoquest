import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Friend } from '../types';
import { useUser } from './UserContext';

interface FriendRequest {
  id: string;
  name: string;
  email: string;
}

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  addFriend: (email: string) => Promise<{ success: boolean; message: string }>;
  acceptFriendRequest: (id: string) => void;
  rejectFriendRequest: (id: string) => void;
  removeFriend: (id: string) => void;
}

const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  friendRequests: [],
  addFriend: async () => ({ success: false, message: 'Not implemented' }),
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
  removeFriend: () => {}
});

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateUserProfile } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  // Load friends and requests from storage when user changes
  useEffect(() => {
    if (user) {
      const storedFriends = localStorage.getItem(`user-${user.id}-friends`);
      if (storedFriends) {
        setFriends(JSON.parse(storedFriends));
      } else {
        setFriends([]); // Start with empty friends list for new users
      }

      const storedRequests = localStorage.getItem(`user-${user.id}-friend-requests`);
      if (storedRequests) {
        setFriendRequests(JSON.parse(storedRequests));
      } else {
        // Demo requests for testing - would be empty in production
        setFriendRequests([]);
      }
    } else {
      setFriends([]);
      setFriendRequests([]);
    }
  }, [user]);

  // Send a friend request (mock implementation)
  const addFriend = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return { success: false, message: 'You must be logged in' };
    }

    // Don't allow adding yourself
    if (email === user.email) {
      return { success: false, message: 'You cannot add yourself as a friend' };
    }

    // Check if already friends
    const isAlreadyFriend = friends.some(friend => friend.email === email);
    if (isAlreadyFriend) {
      return { success: false, message: 'You are already friends with this user' };
    }

    // Mock success - in a real app, this would create a friend request in the database
    // and notify the other user
    
    // For demo purposes, we'll simulate sending the request
    // In a real app, this would be handled by the backend
    const mockFriendResult = { 
      success: true, 
      message: 'Friend request sent successfully' 
    };

    return mockFriendResult;
  };

  // Accept a friend request
  const acceptFriendRequest = (id: string) => {
    if (!user) return;

    const request = friendRequests.find(req => req.id === id);
    if (!request) return;

    // Create a new friend from the request
    const newFriend: Friend = {
      id: request.id,
      name: request.name,
      email: request.email || 'unknown@mail.com', // Add a default in case email is missing
      level: Math.floor(Math.random() * 60) + 20 // Random level between 20-80
    };

    // Add to friends list
    const updatedFriends = [...friends, newFriend];
    setFriends(updatedFriends);
    
    // Remove from requests
    setFriendRequests(friendRequests.filter(req => req.id !== id));

    // Update storage
    localStorage.setItem(`user-${user.id}-friends`, JSON.stringify(updatedFriends));
    localStorage.setItem(`user-${user.id}-friend-requests`, JSON.stringify(
      friendRequests.filter(req => req.id !== id)
    ));
  };

  // Reject a friend request
  const rejectFriendRequest = (id: string) => {
    if (!user) return;
    
    setFriendRequests(friendRequests.filter(req => req.id !== id));
    
    localStorage.setItem(`user-${user.id}-friend-requests`, JSON.stringify(
      friendRequests.filter(req => req.id !== id)
    ));
  };

  // Remove a friend
  const removeFriend = (id: string) => {
    if (!user) return;
    
    const updatedFriends = friends.filter(friend => friend.id !== id);
    setFriends(updatedFriends);
    localStorage.setItem(`user-${user.id}-friends`, JSON.stringify(updatedFriends));
  };

  return (
    <FriendsContext.Provider value={{
      friends,
      friendRequests,
      addFriend,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend
    }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => useContext(FriendsContext);
 