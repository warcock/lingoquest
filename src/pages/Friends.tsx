import  { useState, useRef } from 'react';
import { Search, UserPlus, Users, MessageSquare, Award, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFriends } from '../context/FriendsContext';
import PageTransition from '../components/animations/PageTransition';
import { useUser } from '../context/UserContext';

const Friends = () => {
  const { user } = useUser();
  const { friends, friendRequests, addFriend, acceptFriendRequest, rejectFriendRequest, removeFriend, sentFriendRequests, cancelFriendRequest } = useFriends();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [newFriendEmail, setNewFriendEmail] = useState('');
  const [addFriendError, setAddFriendError] = useState('');
  const [addFriendSuccess, setAddFriendSuccess] = useState('');
  const [showRemoveConfirm, setShowRemoveConfirm] = useState<string | null>(null);
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  
  const filteredFriends = friends.filter(friend => 
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddFriendError('');
    setAddFriendSuccess('');
    
    if (!newFriendEmail) {
      setAddFriendError('Please enter an email address');
      return;
    }
    
    // Check if trying to add yourself
    if (user?.email === newFriendEmail) {
      setAddFriendError('You cannot add yourself as a friend');
      return;
    }
    
    const result = await addFriend(newFriendEmail);
    if (result.success) {
      setAddFriendSuccess(result.message);
      setNewFriendEmail('');
      setTimeout(() => {
        setShowAddFriend(false);
        setAddFriendSuccess('');
      }, 2000);
    } else {
      setAddFriendError(result.message);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Friends</h2>
          <motion.button 
            onClick={() => {
              setShowAddFriend(true);
              setAddFriendError('');
              setAddFriendSuccess('');
              setTimeout(() => {
                emailInputRef.current?.focus();
              }, 100);
            }}
            className="btn btn-primary flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UserPlus size={18} className="mr-2" />
            Add Friend
          </motion.button>
        </div>
        
        {/* Friend Requests */}
        <AnimatePresence>
          {friendRequests.length > 0 && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users size={18} className="mr-2 text-indigo-600" />
                Friend Requests ({friendRequests.length})
              </h3>
              
              <div className="space-y-3">
                {friendRequests.map(request => (
                  <motion.div 
                    key={request.id} 
                    className="flex justify-between items-center p-3 rounded-lg border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        {request.username.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{request.username}</h4>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button 
                        onClick={() => rejectFriendRequest(request.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={18} />
                      </motion.button>
                      <motion.button 
                        onClick={() => acceptFriendRequest(request.id)}
                        className="btn btn-primary py-1"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Accept
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Sent Friend Requests */}
        <AnimatePresence>
          {sentFriendRequests.length > 0 && (
            <motion.div 
              className="card"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Users size={18} className="mr-2 text-indigo-600" />
                Sent Friend Requests ({sentFriendRequests.length})
              </h3>
              
              <div className="space-y-3">
                {sentFriendRequests.map(request => (
                  <motion.div 
                    key={request.id} 
                    className="flex justify-between items-center p-3 rounded-lg border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                        {request.username.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{request.username}</h4>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      {/* Cancel Request Button */}
                      <motion.button 
                        onClick={() => cancelFriendRequest(request.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X size={18} />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Friends List */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Your Friends</h3>
            <div className="relative w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="input pl-10 py-1.5 text-sm"
                placeholder="Search friends..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <AnimatePresence>
            {filteredFriends.length > 0 ? (
              <motion.div className="space-y-3">
                {filteredFriends.map((friend) => (
                  <motion.div 
                    key={friend.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex justify-between items-center p-4 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                        {friend.username.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{friend.username}</h4>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Award className="h-4 w-4 mr-1 text-indigo-600" />
                          Level: {friend.level}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <motion.button 
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MessageSquare size={18} />
                      </motion.button>
                      
                      <motion.button 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                        onClick={() => setShowRemoveConfirm(friend.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Trash2 size={18} />
                      </motion.button>
                      
                      {/* Confirmation popup */}
                      <AnimatePresence>
                        {showRemoveConfirm === friend.id && (
                          <motion.div 
                            className="absolute right-20 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            <p className="text-sm font-medium mb-2">Remove friend?</p>
                            <div className="flex space-x-2">
                              <button 
                                className="text-xs px-3 py-1 bg-gray-100 rounded-md"
                                onClick={() => setShowRemoveConfirm(null)}
                              >
                                Cancel
                              </button>
                              <button 
                                className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-md"
                                onClick={() => {
                                  removeFriend(friend.id);
                                  setShowRemoveConfirm(null);
                                }}
                              >
                                Remove
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                className="text-center py-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center mb-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Users className="h-8 w-8 text-indigo-500" />
                </motion.div>
                
                {searchQuery ? (
                  <p className="text-gray-500">No friends found matching your search.</p>
                ) : (
                  <>
                    <p className="text-gray-700 font-medium">Your friends list is empty</p>
                    <p className="text-gray-500 mt-1">Add friends to connect and compare progress</p>
                    <button
                      onClick={() => setShowAddFriend(true)}
                      className="mt-4 btn btn-primary inline-flex items-center"
                    >
                      <UserPlus size={16} className="mr-1" />
                      Add Friend
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Add Friend Modal */}
        <AnimatePresence>
          {showAddFriend && (
            <motion.div 
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddFriend(false)}
            >
              <motion.div 
                className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Add a Friend</h3>
                  <motion.button 
                    onClick={() => setShowAddFriend(false)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-600"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={18} />
                  </motion.button>
                </div>
                
                <form onSubmit={handleAddFriend}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Friend's Email
                    </label>
                    <input
                      ref={emailInputRef}
                      type="email"
                      value={newFriendEmail}
                      onChange={(e) => setNewFriendEmail(e.target.value)}
                      className="input"
                      placeholder="friend@example.com"
                    />
                    
                    <AnimatePresence>
                      {addFriendError && (
                        <motion.p 
                          className="mt-2 text-sm text-red-600"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {addFriendError}
                        </motion.p>
                      )}
                      
                      {addFriendSuccess && (
                        <motion.p 
                          className="mt-2 text-sm text-green-600"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          {addFriendSuccess}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <motion.button
                      type="button"
                      onClick={() => setShowAddFriend(false)}
                      className="btn btn-secondary"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="btn btn-primary"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Send Invitation
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Friends;
 