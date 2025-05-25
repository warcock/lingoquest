import  { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, User, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useUser } from '../context/UserContext';
import { motion } from 'framer-motion';

const Register = () => {
  const { register, user, error: contextError } = useUser();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setIsLoading(true);
      // Register the user with the provided details
      const success = await register({
        username: name,
        email,
        password
      });
      
      if (success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
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
        <motion.div
          className="hidden md:block flex-1 bg-indigo-600 rounded-r-3xl overflow-hidden"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1610500796385-3ffc1ae2f046?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHx0aGFpJTIwc3R1ZGVudHMlMjBjbGFzc3Jvb20lMjBsZWFybmluZ3xlbnwwfHx8fDE3NDc1NjMxNTh8MA&ixlib=rb-4.1.0&fit=fillmax&h=600&w=800" 
            alt="Thai classroom with students" 
            className="h-full w-full object-cover"
          />
        </motion.div>
        
        <div className="flex-1 p-8 flex items-center justify-center">
          <motion.div 
            className="max-w-md w-full"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center mb-8">
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
              <p className="text-gray-600">Join LingoQuest and prepare for your exams</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-5">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input pl-10"
                    placeholder="Your full name"
                    required
                  />
                </div>
              </div>
              
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
                    required
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
                    minLength={6}
                    required
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
                <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters long</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="input pl-10"
                    placeholder="••••••••"
                    minLength={6}
                    required
                  />
                </div>
              </div>
              
              <motion.button
                type="submit"
                className="w-full btn btn-primary py-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </motion.button>
              
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                  Already have an account? {' '}
                  <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Register;
 