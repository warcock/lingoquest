import  { useState, useEffect } from 'react';
import { User, Mail, Bell, ShieldOff, Save, Lock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';
import PageTransition from '../components/animations/PageTransition';

const Settings = () => {
  const { user, logout, updateUserProfile } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    schoolName: 'Chiang Mai High School',
    gradeLevel: '9'
  });
  
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    newContent: true,
    friendActivity: true,
    achievements: true
  });
  
  const [saveStatus, setSaveStatus] = useState({ 
    profile: { saved: false, error: null }, 
    notifications: { saved: false, error: null },
    password: { saved: false, error: null }
  });
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        email: user.email || '',
        schoolName: user.schoolName || 'Chiang Mai High School',
        gradeLevel: user.gradeLevel || '9'
      });
      
      if (user.notificationSettings) {
        setNotifications(user.notificationSettings);
      }
    }
  }, [user]);
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({ ...prev, [name]: value }));
    
    // Clear saved status
    setSaveStatus(prev => ({
      ...prev,
      profile: { saved: false, error: null }
    }));
  };
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNotificationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setNotifications(prev => ({ ...prev, [name]: checked }));
    
    // Clear saved status
    setSaveStatus(prev => ({
      ...prev,
      notifications: { saved: false, error: null }
    }));
  };
  
  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateUserProfile({
        name: profileForm.name,
        email: profileForm.email,
        schoolName: profileForm.schoolName,
        gradeLevel: profileForm.gradeLevel
      });
      
      // Show success message
      setSaveStatus(prev => ({
        ...prev,
        profile: { saved: true, error: null }
      }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({
          ...prev,
          profile: { saved: false, error: null }
        }));
      }, 3000);
    } catch (error) {
      // Show error
      setSaveStatus(prev => ({
        ...prev,
        profile: { saved: false, error: 'Failed to save profile' }
      }));
    }
  };
  
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate password form
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSaveStatus(prev => ({
        ...prev,
        password: { saved: false, error: 'New passwords do not match' }
      }));
      return;
    }
    
    if (passwordForm.newPassword.length < 6) {
      setSaveStatus(prev => ({
        ...prev,
        password: { saved: false, error: 'Password must be at least 6 characters' }
      }));
      return;
    }
    
    try {
      // In a real app, this would validate the current password
      // and update with the new password in the database
      
      updateUserProfile({ passwordUpdated: new Date().toISOString() });
      
      // Show success message
      setSaveStatus(prev => ({
        ...prev,
        password: { saved: true, error: null }
      }));
      
      // Reset form
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // Clear message and close modal after 2 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({
          ...prev,
          password: { saved: false, error: null }
        }));
        setShowPasswordModal(false);
      }, 2000);
      
    } catch (error) {
      // Show error
      setSaveStatus(prev => ({
        ...prev,
        password: { saved: false, error: 'Failed to update password' }
      }));
    }
  };
  
  const handleNotificationsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      updateUserProfile({ notificationSettings: notifications });
      
      // Show success message
      setSaveStatus(prev => ({
        ...prev,
        notifications: { saved: true, error: null }
      }));
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveStatus(prev => ({
          ...prev,
          notifications: { saved: false, error: null }
        }));
      }, 3000);
    } catch (error) {
      // Show error
      setSaveStatus(prev => ({
        ...prev,
        notifications: { saved: false, error: 'Failed to save notification settings' }
      }));
    }
  };
  
  const handleDeleteAccount = () => {
    try {
      // In a real app, this would delete the user's account from the database
      logout();
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };
  
  const downloadUserData = () => {
    try {
      // Create a JSON blob of the user data
      const userData = JSON.stringify(user, null, 2);
      const blob = new Blob([userData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a temporary link and click it
      const a = document.createElement('a');
      a.href = url;
      a.download = `lingoquest-data-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      // Close modal
      setShowPrivacyModal(false);
    } catch (error) {
      console.error('Failed to download data:', error);
    }
  };

  const tabVariants = {
    active: {
      borderColor: '#4F46E5',
      color: '#4F46E5',
    },
    inactive: {
      borderColor: 'transparent',
      color: '#4B5563',
    },
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Settings</h2>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex">
              <motion.button
                onClick={() => setActiveTab('profile')}
                className={`px-4 py-4 text-sm font-medium flex items-center border-b-2 ${
                  activeTab === 'profile' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                variants={tabVariants}
                animate={activeTab === 'profile' ? 'active' : 'inactive'}
                whileHover={{ y: -2 }}
              >
                <User size={16} className="mr-2" />
                Profile
              </motion.button>
              
              <motion.button
                onClick={() => setActiveTab('notifications')}
                className={`px-4 py-4 text-sm font-medium flex items-center border-b-2 ${
                  activeTab === 'notifications' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                variants={tabVariants}
                animate={activeTab === 'notifications' ? 'active' : 'inactive'}
                whileHover={{ y: -2 }}
              >
                <Bell size={16} className="mr-2" />
                Notifications
              </motion.button>
              
              <motion.button
                onClick={() => setActiveTab('account')}
                className={`px-4 py-4 text-sm font-medium flex items-center border-b-2 ${
                  activeTab === 'account' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
                variants={tabVariants}
                animate={activeTab === 'account' ? 'active' : 'inactive'}
                whileHover={{ y: -2 }}
              >
                <ShieldOff size={16} className="mr-2" />
                Account
              </motion.button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'profile' && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleProfileSubmit}>
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={profileForm.name}
                          onChange={handleProfileChange}
                          className="input"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={profileForm.email}
                          onChange={handleProfileChange}
                          className="input"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="schoolName" className="block text-sm font-medium text-gray-700 mb-1">
                          School Name
                        </label>
                        <input
                          id="schoolName"
                          type="text"
                          name="schoolName"
                          value={profileForm.schoolName}
                          onChange={handleProfileChange}
                          className="input"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="gradeLevel" className="block text-sm font-medium text-gray-700 mb-1">
                          Current Grade
                        </label>
                        <select
                          id="gradeLevel"
                          name="gradeLevel"
                          value={profileForm.gradeLevel}
                          onChange={handleProfileChange}
                          className="input"
                        >
                          <option value="7">Grade 7</option>
                          <option value="8">Grade 8</option>
                          <option value="9">Grade 9</option>
                        </select>
                      </div>
                      
                      <motion.button 
                        type="submit" 
                        className="btn btn-primary flex items-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save size={16} className="mr-2" />
                        Save Changes
                      </motion.button>
                      
                      <AnimatePresence>
                        {saveStatus.profile.saved && (
                          <motion.div
                            className="text-green-600 mt-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            Profile saved successfully!
                          </motion.div>
                        )}
                        
                        {saveStatus.profile.error && (
                          <motion.div
                            className="text-red-600 mt-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            {saveStatus.profile.error}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <form onSubmit={handleNotificationsSubmit}>
                    <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Choose which notifications you'd like to receive
                      </p>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
                            <p className="text-sm text-gray-600">Receive email updates about your account</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="email"
                              checked={notifications.email}
                              onChange={handleNotificationChange}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">New Content Alerts</h4>
                            <p className="text-sm text-gray-600">Get notified when new lessons or quizzes are added</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="newContent"
                              checked={notifications.newContent}
                              onChange={handleNotificationChange}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Friend Activity</h4>
                            <p className="text-sm text-gray-600">Get notified about friend requests and activities</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="friendActivity"
                              checked={notifications.friendActivity}
                              onChange={handleNotificationChange}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">Achievements</h4>
                            <p className="text-sm text-gray-600">Get notified when you earn achievements or badges</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              name="achievements"
                              checked={notifications.achievements}
                              onChange={handleNotificationChange}
                              className="sr-only peer" 
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                          </label>
                        </div>
                      </div>
                      
                      <motion.button 
                        type="submit" 
                        className="btn btn-primary flex items-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Save size={16} className="mr-2" />
                        Save Preferences
                      </motion.button>
                      
                      <AnimatePresence>
                        {saveStatus.notifications.saved && (
                          <motion.div
                            className="text-green-600 mt-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            Notification preferences saved successfully!
                          </motion.div>
                        )}
                        
                        {saveStatus.notifications.error && (
                          <motion.div
                            className="text-red-600 mt-2"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                          >
                            {saveStatus.notifications.error}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </form>
                </motion.div>
              )}
              
              {activeTab === 'account' && (
                <motion.div
                  key="account-tab"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                    
                    <div className="space-y-4">
                      <div className="p-3 rounded-lg hover:bg-gray-50">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Change Password</h4>
                        <button 
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          onClick={() => setShowPasswordModal(true)}
                        >
                          Update password
                        </button>
                      </div>
                      
                      <div className="p-3 rounded-lg hover:bg-gray-50 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Data Privacy</h4>
                        <button 
                          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                          onClick={() => setShowPrivacyModal(true)}
                        >
                          Download my data
                        </button>
                      </div>
                      
                      <div className="p-3 rounded-lg hover:bg-gray-50 pt-4 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-red-600 mb-1">Danger Zone</h4>
                        <div className="space-y-2">
                          <button 
                            onClick={logout}
                            className="block text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Sign out from all devices
                          </button>
                          <button 
                            className="block text-sm text-red-600 hover:text-red-800 font-medium"
                            onClick={() => setShowDeleteModal(true)}
                          >
                            Delete account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPasswordModal(false)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Change Password</h3>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="currentPassword"
                      type="password"
                      name="currentPassword"
                      value={passwordForm.currentPassword}
                      onChange={handlePasswordChange}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      name="newPassword"
                      value={passwordForm.newPassword}
                      onChange={handlePasswordChange}
                      className="input pl-10"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      name="confirmPassword"
                      value={passwordForm.confirmPassword}
                      onChange={handlePasswordChange}
                      className="input pl-10"
                      required
                    />
                  </div>
                </div>
                
                {saveStatus.password.error && (
                  <div className="bg-red-50 p-3 rounded-lg flex items-start gap-2 text-sm text-red-600">
                    <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                    <span>{saveStatus.password.error}</span>
                  </div>
                )}
                
                {saveStatus.password.saved && (
                  <div className="bg-green-50 p-3 rounded-lg text-sm text-green-600">
                    Password updated successfully!
                  </div>
                )}
                
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saveStatus.password.saved}
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Delete Account Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center space-x-3 text-red-600 mb-4">
                <AlertCircle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Delete Account</h3>
              </div>
              
              <p className="text-gray-700 mb-4">
                Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently lost.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium"
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Data Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowPrivacyModal(false)}
          >
            <motion.div 
              className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Download Your Data</h3>
              
              <p className="text-gray-700 mb-4">
                This will download a copy of all your personal data including profile information, learning progress, and activity history in JSON format.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPrivacyModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={downloadUserData}
                >
                  Download Data
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};

export default Settings;
 