import  { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Book, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../context/UserContext';

interface HeaderProps {
  children?: ReactNode;
}

const Header = ({ children }: HeaderProps) => {
  const { user, logout } = useUser();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const notifications = [
    {
      id: '1',
      title: 'New quiz available',
      message: 'Check out the new reading comprehension quiz!',
      time: '2 hours ago',
      read: false
    },
    {
      id: '2',
      title: 'Achievement unlocked',
      message: 'You completed 5 vocabulary exercises!',
      time: 'Yesterday',
      read: true
    }
  ];

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center">
        {children}
        <div className="ml-3">
          <Link to="/dashboard" className="flex items-center">
            <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2">
              <Book className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-gray-900">LingoQuest</span>
          </Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-gray-700 hover:bg-gray-100"
          >
            <Bell className="h-6 w-6" />
            {notifications.some(n => !n.read) && (
              <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-red-500"></span>
            )}
          </button>
          
          {/* Notifications dropdown */}
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="py-2 px-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                  <button className="text-xs text-indigo-600 hover:text-indigo-800">Mark all as read</button>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length > 0 ? (
                    <div className="py-2">
                      {notifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 hover:bg-gray-50 ${notification.read ? '' : 'bg-indigo-50'}`}
                        >
                          <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center">
                      <p className="text-sm text-gray-500">No notifications yet</p>
                    </div>
                  )}
                </div>
                <div className="py-2 px-4 border-t border-gray-100 text-center">
                  <button className="text-xs text-indigo-600 hover:text-indigo-800">View all notifications</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* User menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center space-x-2 focus:outline-none"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-600 font-medium">
              {user?.username?.[0] || 'U'}
            </div>
            <span className="hidden md:block text-sm font-medium text-gray-700">
              {user?.username || 'User'}
            </span>
          </button>
          
          {/* User dropdown */}
          <AnimatePresence>
            {showUserMenu && (
              <motion.div 
                className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10"
                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                <div className="py-1">
                  <Link 
                    to="/settings"
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User className="h-4 w-4 mr-2 text-gray-500" />
                    Settings
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                    }}
                    className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                    Sign out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Header;
 