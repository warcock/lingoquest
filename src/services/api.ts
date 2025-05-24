//  Using proxy server for external API calls 
const API_URL = '/api';

// Function to send requests to our backend proxy
const sendRequest = async (url: string, method = 'GET', data?: any) => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      options.body = JSON.stringify(data);
    }

    // Send request through proxy
    const proxyUrl = `https://hooks.jdoodle.net/proxy?url=${encodeURIComponent(`${API_URL}${url}`)}`;
    const response = await fetch(proxyUrl, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  register: (userData: any) => sendRequest('/auth/register', 'POST', userData),
  login: (credentials: any) => sendRequest('/auth/login', 'POST', credentials),
  getCurrentUser: () => sendRequest('/auth/me'),
};

// User API
export const userAPI = {
  updateProfile: (data: any) => sendRequest('/users/profile', 'PUT', data),
  updateSettings: (data: any) => sendRequest('/users/settings', 'PUT', data),
};

// Friends API
export const friendsAPI = {
  getFriends: () => sendRequest('/friends'),
  getFriendRequests: () => sendRequest('/friends/requests'),
  sendFriendRequest: (email: string) => sendRequest('/friends/request', 'POST', { email }),
  acceptFriendRequest: (id: string) => sendRequest(`/friends/request/${id}/accept`, 'POST'),
  rejectFriendRequest: (id: string) => sendRequest(`/friends/request/${id}/reject`, 'POST'),
  removeFriend: (id: string) => sendRequest(`/friends/${id}`, 'DELETE'),
};

// Progress API
export const progressAPI = {
  getProgress: () => sendRequest('/progress'),
  updateProgress: (data: any) => sendRequest('/progress', 'PUT', data),
};

// Exercises API
export const exercisesAPI = {
  getExercises: () => sendRequest('/exercises'),
  getExerciseById: (id: string) => sendRequest(`/exercises/${id}`),
  completeExercise: (id: string, score: number) => 
    sendRequest(`/exercises/${id}/complete`, 'POST', { score }),
};

// Quizzes API
export const quizzesAPI = {
  getQuizzes: () => sendRequest('/quizzes'),
  getQuizById: (id: string) => sendRequest(`/quizzes/${id}`),
  submitQuizResult: (id: string, score: number) => 
    sendRequest(`/quizzes/${id}/submit`, 'POST', { score }),
};
 