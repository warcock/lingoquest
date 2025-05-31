import { AnimatePresence } from 'framer-motion';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { ProgressProvider } from './context/ProgressContext';
import { FriendsProvider } from './context/FriendsContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Quizzes from './pages/Quizzes';
import Friends from './pages/Friends';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Chat from './pages/Chat';

function App() {
  const location = useLocation();

  return (
    <UserProvider>
      <ProgressProvider>
        <FriendsProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="practice" element={<Practice />} />
                <Route path="quizzes" element={<Quizzes />} />
                <Route path="friends" element={<Friends />} />
                <Route path="chat" element={<Chat />} />
                <Route path="settings" element={<Settings />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </FriendsProvider>
      </ProgressProvider>
    </UserProvider>
  );
}

export default App;
 