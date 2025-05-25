import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  register: (userData: any) => Promise<boolean>;
  updateUserProfile: (data: any) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  login: async () => false,
  logout: () => {},
  isLoading: false,
  error: null,
  register: async () => false,
  updateUserProfile: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, check for stored user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser);
        // Basic validation to ensure it has a token (optional but good)
        if (parsedUser && parsedUser.token) {
           setUser(parsedUser);
        } else {
           // Clear incomplete user data
           localStorage.removeItem('user');
        }
      } catch (e) {
        localStorage.removeItem('user');
        console.error('Failed to parse user from localStorage:', e);
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming backend returns user object with _id, username, email, progress, and token
        const loggedInUser: User = { 
            _id: data._id, // Use _id from backend
            id: data._id, // Map _id to id for frontend consistency if needed
            username: data.username,
            email: data.email,
            progress: data.progress,
            token: data.token,
            // Include other properties from backend response if available/needed
            // skillProgress: data.progress?.skillProgress, // If skillProgress is nested under progress
            // friends: data.friends, // If friends are returned on login
            // etc.
         };

        localStorage.setItem('user', JSON.stringify(loggedInUser));
        setUser(loggedInUser);
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || 'Login failed');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError('Login failed');
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (response.ok) {
        // Assuming backend register endpoint returns the new user data and token
        // Log the user in directly after successful registration
         const registeredUser: User = { 
            _id: data._id, // Use _id from backend
            id: data._id, // Map _id to id for frontend consistency if needed
            username: data.username,
            email: data.email,
            progress: data.progress,
            token: data.token,
            // Include other properties from backend response if available/needed
            // skillProgress: data.progress?.skillProgress,
            // friends: data.friends,
            // etc.
         };

        localStorage.setItem('user', JSON.stringify(registeredUser));
        setUser(registeredUser);
        setIsLoading(false);
        return true;
      } else {
        setError(data.message || 'Registration failed');
        setIsLoading(false);
        return false;
      }
    } catch (error: any) {
      setError('Registration failed');
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUserProfile = (data: any) => {
    if (!user) return;
    
    const updatedUser = {...user, ...data};
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading, 
      error, 
      register,
      updateUserProfile
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
 