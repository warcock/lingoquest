import  { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, Users, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobile, onClose }: SidebarProps) => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navigation = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Practice', path: '/practice', icon: <BookOpen size={20} /> },
    { name: 'Quizzes', path: '/quizzes', icon: <CheckSquare size={20} /> },
    { name: 'Friends', path: '/friends', icon: <Users size={20} /> },
    { name: 'Settings', path: '/settings', icon: <Settings size={20} /> }
  ];
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center h-16 px-4">
        <Link to="/dashboard" className="flex items-center space-x-2" onClick={onClose}>
          <div className="bg-indigo-600 h-8 w-8 rounded-lg flex items-center justify-center">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 text-xl">LingoQuest</span>
        </Link>
      </div>
      
      <nav className="mt-6 flex-1 overflow-y-auto">
        <ul className="space-y-1 px-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                onClick={onClose}
                className={`flex items-center group px-3 py-3 rounded-lg font-medium ${
                  isActive(item.path)
                    ? "bg-indigo-600 text-white"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
              >
                <motion.div
                  initial={{ x: 0 }}
                  whileHover={{ x: 3 }}
                  className="mr-3"
                >
                  {item.icon}
                </motion.div>
                <span>{item.name}</span>
                {isActive(item.path) && (
                  <motion.div
                    layoutId="sidebar-active-pill"
                    className="absolute right-0 w-1 h-8 bg-white rounded-l-full"
                  />
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="bg-indigo-50 rounded-lg p-4">
          <h4 className="font-medium text-sm text-indigo-900 mb-2">Exam Countdown</h4>
          <div className="text-sm text-indigo-700">
            <p>Grade 10 Entrance Exam</p>
            <p className="mt-1 font-bold">35 days left</p>
          </div>
          <div className="mt-2 h-1.5 w-full bg-white rounded-full overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: '65%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
 