import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Friend, SentFriendRequest } from '../types';
import { useUser } from './UserContext';

interface FriendRequest {
  id: string;
  username: string;
  email: string;
}

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  sentFriendRequests: SentFriendRequest[];
  addFriend: (email: string) => Promise<{ success: boolean; message: string }>;
  acceptFriendRequest: (id: string) => void;
  rejectFriendRequest: (id: string) => void;
  removeFriend: (id: string) => void;
  cancelFriendRequest: (id: string) => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType>({
  friends: [],
  friendRequests: [],
  sentFriendRequests: [],
  addFriend: async () => ({ success: false, message: 'Not implemented' }),
  acceptFriendRequest: () => {},
  rejectFriendRequest: () => {},
  removeFriend: () => {},
  cancelFriendRequest: async () => {},
});

// Add fetch sent friend requests function outside useEffect
const fetchSentRequests = async (userToken: string, setSentFriendRequests: (requests: SentFriendRequest[]) => void) => {
  try {
    const response = await fetch('/api/friends/requests/sent', {
      headers: {
        'Authorization': `Bearer ${userToken}`,
      },
    });
    const data = await response.json();
    console.log('Backend response for sent friend requests:', data);
    if (response.ok) {
      const formattedRequests: SentFriendRequest[] = data.map((request: any) => ({
        id: request._id,
        username: request.username,
        email: request.email || '',
      }));
      setSentFriendRequests(formattedRequests);
    } else {
      console.error('Failed to fetch sent requests:', data.message);
      setSentFriendRequests([]);
    }
  } catch (error) {
    console.error('Error fetching sent requests:', error);
    setSentFriendRequests([]);
  }
};

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateUserProfile } = useUser();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [sentFriendRequests, setSentFriendRequests] = useState<SentFriendRequest[]>([]);

  // Load friends and requests when user changes
  useEffect(() => {
    if (user && user.token) {
      // Fetch friends
      const fetchFriends = async () => {
        try {
          const response = await fetch('/api/friends', {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            // Assuming backend returns an array of friend objects with _id and username
            const formattedFriends: Friend[] = data.map((friend: any) => ({
              id: friend._id,
              username: friend.username,
              email: friend.email || '', // Backend currently doesn't return email on populate, might need adjustment
              level: friend.progress?.currentLevel || 1, // Assuming friend object has progress.currentLevel, might need backend adjustment
            }));
            setFriends(formattedFriends);
          } else {
            console.error('Failed to fetch friends:', data.message);
            setFriends([]);
          }
        } catch (error) {
          console.error('Error fetching friends:', error);
          setFriends([]);
        }
      };

      // Fetch received friend requests
      const fetchReceivedRequests = async () => {
        try {
          const response = await fetch('/api/friends/requests/received', {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
             // Assuming backend returns an array of user objects (senders) with _id and username
            const formattedRequests: FriendRequest[] = data.map((request: any) => ({
              id: request._id,
              username: request.username,
              email: request.email || '', // Backend currently doesn't return email on populate, might need adjustment
            }));
            setFriendRequests(formattedRequests);
          } else {
            console.error('Failed to fetch received requests:', data.message);
            setFriendRequests([]);
          }
        } catch (error) {
          console.error('Error fetching received requests:', error);
          setFriendRequests([]);
        }
      };

      // Call fetch sent friend requests (now defined outside)
      fetchSentRequests(user.token, setSentFriendRequests); // Pass token and setter

      fetchFriends();
      fetchReceivedRequests();

      // Remove localStorage loading as data will come from backend
      // const storedFriends = localStorage.getItem(`user-${user.id}-friends`);
      // if (storedFriends) {
      //   setFriends(JSON.parse(storedFriends));
      // } else {
      //   setFriends([]);
      // }

      // const storedRequests = localStorage.getItem(`user-${user.id}-friend-requests`);
      // if (storedRequests) {
      //   setFriendRequests(JSON.parse(storedRequests));
      // } else {
      //   setFriendRequests([]);
      // }

    } else {
      // Clear friends and requests if user logs out
      setFriends([]);
      setFriendRequests([]);
      setSentFriendRequests([]);
    }
  }, [user]);

  // Send a friend request
  const addFriend = async (email: string): Promise<{ success: boolean; message: string }> => {
    if (!user || !user.token) {
      return { success: false, message: 'You must be logged in' };
    }

    // Don't allow adding yourself (already checked in component, but good to have here too)
    if (user.email === email) {
      return { success: false, message: 'You cannot add yourself as a friend' };
    }

    // Check if already friends (can also rely on backend check, but quick frontend check)
    const isAlreadyFriend = friends.some(friend => friend.email === email);
    if (isAlreadyFriend) {
      return { success: false, message: 'You are already friends with this user' };
    }

    try {
      // 1. Search for the user by email
      const searchResponse = await fetch(`/api/friends/search?query=${encodeURIComponent(email)}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const searchData = await searchResponse.json();

      if (!searchResponse.ok) {
         // If search fails, it might be a server error or auth issue
         return { success: false, message: searchData.message || 'Failed to search for user' };
      }

      if (searchData.length === 0) {
        return { success: false, message: 'No user found with that email' };
      }

      // Assuming the search returns an array and we take the first match
      const recipient = searchData[0];
      const recipientId = recipient._id;

      // Optional: Check on frontend if request already sent or received
      // This would require fetching sent/received requests here or having them in state
      // For now, we'll rely on the backend checks

      // 2. Send the friend request using the recipient's ID
      const sendRequestResponse = await fetch(`/api/friends/request/send/${recipientId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        // Backend POST /request/send/:userId doesn't expect a body, but adding for completeness if needed later
        // body: JSON.stringify({}),
      });

      const sendRequestData = await sendRequestResponse.json();

      if (sendRequestResponse.ok) {
         // Refetch sent requests after successful send
        fetchSentRequests(user.token, setSentFriendRequests); // Call with token and setter
        return { success: true, message: sendRequestData.message || 'Friend request sent successfully' };
      } else {
        // Backend will return specific messages for already friends, already sent, etc.
        return { success: false, message: sendRequestData.message || 'Failed to send friend request' };
      }

    } catch (error: any) {
      console.error('Error sending friend request:', error);
      return { success: false, message: error.message || 'An unexpected error occurred' };
    }
  };

  // Accept a friend request
  const acceptFriendRequest = async (id: string) => {
    if (!user || !user.token) return;

    try {
      const response = await fetch(`/api/friends/request/accept/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Friend request accepted:', data.message);
        // Optimistically update UI: remove from received requests and add to friends list
        // A full refetch of friends and requests might be more robust
        setFriendRequests(prev => prev.filter(req => req.id !== id));
        // To add to friends list optimistically, we'd need the accepted friend's details (id, username, etc.)
        // If the backend doesn't return the accepted friend's object, we might need a refetch.
        // For now, rely on the useEffect refetch of both lists after a small delay
        setTimeout(() => {
           if (user && user.token) { // Check user and token again before refetch
               fetchFriends(user.token, setFriends); // Assuming fetchFriends takes token and setter
               fetchReceivedRequests(user.token, setFriendRequests); // Assuming fetchReceivedRequests takes token and setter
               fetchSentRequests(user.token, setSentFriendRequests); // Also refetch sent requests
           }
        }, 500); // Small delay to allow backend update

      } else {
        console.error('Failed to accept friend request:', data.message);
         // Maybe show an error message to the user
      }

    } catch (error) {
      console.error('Error accepting friend request:', error);
       // Maybe show an error message to the user
    }
  };

  // Reject a friend request
  const rejectFriendRequest = async (id: string) => {
     if (!user || !user.token) return;

     try {
       const response = await fetch(`/api/friends/request/reject/${id}`, {
         method: 'PUT',
         headers: {
           'Authorization': `Bearer ${user.token}`,
         },
       });
       const data = await response.json();

       if (response.ok) {
         console.log('Friend request rejected:', data.message);
         // Optimistically update UI: remove from received requests
         setFriendRequests(prev => prev.filter(req => req.id !== id));
       } else {
         console.error('Failed to reject friend request:', data.message);
          // Maybe show an error message to the user
       }
     } catch (error) {
       console.error('Error rejecting friend request:', error);
        // Maybe show an error message to the user
     }
  };

  // Remove a friend
  const removeFriend = async (id: string) => {
    if (!user || !user.token) return;

    try {
      const response = await fetch(`/api/friends/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Friend removed:', data.message);
         // Optimistically update UI: remove from friends list
        setFriends(prev => prev.filter(friend => friend.id !== id));
      } else {
        console.error('Failed to remove friend:', data.message);
         // Maybe show an error message to the user
      }

    } catch (error) {
      console.error('Error removing friend:', error);
       // Maybe show an error message to the user
    }
  };

  // Cancel a friend request
  const cancelFriendRequest = async (id: string) => {
    if (!user || !user.token) return;

    try {
      const response = await fetch(`/api/friends/request/cancel/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        console.log('Friend request cancelled:', data.message);
        // Optimistically update UI: remove from sent requests list
        setSentFriendRequests(prev => prev.filter(req => req.id !== id));
      } else {
        console.error('Failed to cancel friend request:', data.message);
         // Maybe show an error message to the user
      }

    } catch (error) {
      console.error('Error cancelling friend request:', error);
       // Maybe show an error message to the user
    }
  };

  // Helper functions for fetching data (moved outside useEffect for reusability)
  const fetchFriends = async (userToken: string, setFriends: (friends: Friend[]) => void) => {
    try {
      const response = await fetch('/api/friends', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        const formattedFriends: Friend[] = data.map((friend: any) => ({
          id: friend._id,
          username: friend.username,
          email: friend.email || '',
          level: friend.progress?.currentLevel || 1,
        }));
        setFriends(formattedFriends);
      } else {
        console.error('Failed to fetch friends:', data.message);
        setFriends([]);
      }
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    }
  };

  const fetchReceivedRequests = async (userToken: string, setFriendRequests: (requests: FriendRequest[]) => void) => {
    try {
      const response = await fetch('/api/friends/requests/received', {
        headers: {
          'Authorization': `Bearer ${userToken}`,
        },
      });
      const data = await response.json();
      console.log('Backend response for received friend requests:', data);
      if (response.ok) {
         const formattedRequests: FriendRequest[] = data.map((request: any) => ({
          id: request._id,
          username: request.username,
          email: request.email || '',
        }));
        setFriendRequests(formattedRequests);
      } else {
        console.error('Failed to fetch received requests:', data.message);
        setFriendRequests([]);
      }
    } catch (error) {
      console.error('Error fetching received requests:', error);
      setFriendRequests([]);
    }
  };

  // Load friends and requests when user changes
  useEffect(() => {
    if (user && user.token) {
      fetchFriends(user.token, setFriends);
      fetchReceivedRequests(user.token, setFriendRequests);
      fetchSentRequests(user.token, setSentFriendRequests);
    } else {
      setFriends([]);
      setFriendRequests([]);
      setSentFriendRequests([]);
    }
  }, [user]);

  return (
    <FriendsContext.Provider value={{
      friends,
      friendRequests,
      sentFriendRequests,
      addFriend,
      acceptFriendRequest,
      rejectFriendRequest,
      removeFriend,
      cancelFriendRequest,
    }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => useContext(FriendsContext);
 