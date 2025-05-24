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

// Mock user database for auth validation
let mockUsers = [
  {
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: 'password123',
    skillProgress: [
      { category: 'Vocabulary', level: 35, totalExercises: 20, completedExercises: 7 },
      { category: 'Grammar', level: 42, totalExercises: 18, completedExercises: 8 },
      { category: 'Reading', level: 28, totalExercises: 15, completedExercises: 4 },
      { category: 'Listening', level: 15, totalExercises: 12, completedExercises: 2 },
    ],
    friends: [],
    notificationSettings: {
      email: true,
      newContent: true,
      friendActivity: true,
      achievements: true
    }
  }
];

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // On mount, check for stored user
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
    
    // Load mock users from localStorage if available
    const storedMockUsers = localStorage.getItem('mockUsers');
    if (storedMockUsers) {
      try {
        mockUsers = JSON.parse(storedMockUsers);
      } catch (e) {
        console.error('Error loading mock users:', e);
      }
    } else {
      // Initialize mock users in localStorage
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      
      // Check if user exists in our mock database
      const foundUser = mockUsers.find(u => u.email === email);
      if (!foundUser) {
        setError('No account found with this email address');
        return false;
      }
      
      // Validate password
      if (foundUser.password !== password) {
        setError('Incorrect password');
        return false;
      }
      
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = foundUser;
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);
      
      return true;
    } catch (error) {
      setError('Login failed');
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: any) => {
    try {
      setError(null);
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === userData.email)) {
        setError('An account with this email already exists');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In a real app, this would be hashed
        // Default empty data for a fresh account
        skillProgress: [
          { category: 'Vocabulary', level: 0, totalExercises: 20, completedExercises: 0 },
          { category: 'Grammar', level: 0, totalExercises: 18, completedExercises: 0 },
          { category: 'Reading', level: 0, totalExercises: 15, completedExercises: 0 },
          { category: 'Listening', level: 0, totalExercises: 12, completedExercises: 0 },
        ],
        friends: [],
        notificationSettings: {
          email: true,
          newContent: true,
          friendActivity: true,
          achievements: true
        }
      };
      
      // Add to mock database
      mockUsers.push(newUser);
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      
      // Remove password before storing user
      const { password: _, ...userWithoutPassword } = newUser;
      
      // Log the user in
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword as User);
      
      return true;
    } catch (error) {
      setError('Registration failed');
      console.error('Registration error:', error);
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
    
    // Also update in mock database
    if (user.id) {
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = {...mockUsers[userIndex], ...data};
        localStorage.setItem('mockUsers', JSON.stringify(mockUsers));
      }
    }
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
 