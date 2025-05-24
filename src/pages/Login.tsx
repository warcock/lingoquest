import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, user, error: contextError } = useUser();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Update local error when context error changes
  useEffect(() => {
    if (contextError) {
      setError(contextError);
    }
  }, [contextError]);
  
  // Redirect if already logged in
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Attempt to login with provided credentials
      const success = await login(email, password);
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      className="flex min-h-screen bg-gradient-to-b from-indigo-100 to-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto">
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.div 
            className="max-w-md w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-10">
              <motion.div 
                className="flex justify-center mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center">
                  <Book className="h-7 w-7 text-white" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to LingoQuest</h1>
              <p className="text-gray-600">Prepare for your English exams with interactive lessons</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div 
                  className="bg-red-50 p-4 rounded-lg text-red-600 text-sm flex gap-2 items-start"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input pl-10"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="••••••••"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 rounded border-gray-300"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <div className="text-sm">
                  <Link to="#" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>
              
              <motion.button
                type="submit"
                className="w-full btn btn-primary py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Don't have an account? {' '}
                  <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
              
              <div className="text-center mt-6 text-sm text-gray-600">
                <p className="mb-1">Demo account:</p>
                <p>Email: test@example.com</p>
                <p>Password: password123</p>
              </div>
            </form>
          </motion.div>
        </div>
        
        <motion.div
          className="hidden md:block flex-1 bg-indigo-600 rounded-l-3xl overflow-hidden"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmclMjBlbmdsaXNoJTIwdGV4dGJvb2slMjBjbGFzc3Jvb218ZW58MHx8fHwxNzQ3NTYzOTgwfDA&ixlib=rb-4.1.0&fit=fillmax&h=600&w=800" 
            alt="English textbooks on wooden table" 
            className="h-full w-full object-cover"
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
 