import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book, CheckSquare, Award, ArrowRight, BookOpen } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { motion } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import PageTransition from '../components/animations/PageTransition';
import FadeIn from '../components/FadeIn';
import { useUser } from '../context/UserContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FriendActivity {
  _id: string;
  user: { _id: string; username: string };
  type: string;
  details: any; // Use 'any' for flexibility based on activity type
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useUser();
  const { skillProgress, exercises } = useProgress();
  const [streak, setStreak] = useState(0);
  const [friendActivity, setFriendActivity] = useState<FriendActivity[]>([]);
  
  // Define daily reading goal
  const dailyReadingGoal = 2;

  // Calculate completed reading exercises
  const completedReadingExercises = exercises.filter(exercise => 
    exercise.category === 'reading' && exercise.completed
  ).length;

  // Check if daily goal is completed
  const isDailyGoalCompleted = completedReadingExercises >= dailyReadingGoal;

  // Calculate streak based on local storage
  useEffect(() => {
    if (user) {
      const lastLogin = localStorage.getItem(`user-${user.id}-last-login`);
      const today = new Date().toDateString();
      
      if (lastLogin !== today) {
        // Update last login
        localStorage.setItem(`user-${user.id}-last-login`, today);
        
        // Update streak
        const currentStreak = parseInt(localStorage.getItem(`user-${user.id}-streak`) || '0');
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastLogin === yesterday.toDateString()) {
          // Increment streak if last login was yesterday
          localStorage.setItem(`user-${user.id}-streak`, (currentStreak + 1).toString());
          setStreak(currentStreak + 1);
        } else if (!lastLogin) {
          // First login
          localStorage.setItem(`user-${user.id}-streak`, '1');
          setStreak(1);
        } else {
          // Reset streak if last login was not yesterday
          localStorage.setItem(`user-${user.id}-streak`, '1');
          setStreak(1);
        }
      } else {
        // Same day login, just get current streak
        setStreak(parseInt(localStorage.getItem(`user-${user.id}-streak`) || '0'));
      }
    }
  }, [user]);

  // Get recommended exercises that haven't been completed
  const recommendedExercises = exercises
    .filter(exercise => !exercise.completed)
    .sort(() => Math.random() - 0.5) // Randomize
    .slice(0, 3); // Take top 3

  const chartData = {
    labels: skillProgress.map(skill => skill.category),
    datasets: [
      {
        label: 'Skill Level',
        data: skillProgress.map(skill => skill.level),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderWidth: 0,
        borderRadius: 6,
      }
    ]
  };


  // Calculate total completed exercises
  const totalCompleted = exercises.filter(ex => ex.completed).length;

  // Fetch friend activity
  useEffect(() => {
    if (user && user.token) {
      const fetchFriendActivity = async () => {
        try {
          const response = await fetch('/api/friends/activity', {
            headers: {
              'Authorization': `Bearer ${user.token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setFriendActivity(data);
          } else {
            console.error('Failed to fetch friend activity:', data.message);
            setFriendActivity([]);
          }
        } catch (error) {
          console.error('Error fetching friend activity:', error);
          setFriendActivity([]);
        }
      };

      fetchFriendActivity();
    } else {
      setFriendActivity([]); // Clear activity if user logs out
    }
  }, [user]);

  return (
    <PageTransition>
      <div className="space-y-6">

        {/* Top Section: Welcome and Today's Goal */}
        <motion.div 
          className="flex flex-col lg:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          
          {/* Welcome Card */}
          <div className="card flex-1 p-6"> {/* Added card class and padding */}
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}</h2>
            <p className="text-gray-600 mb-4">Continue your learning journey to ace your Grade 10 entrance exam!</p>{/* Corrected text */}
            
            <div className="flex flex-wrap gap-3 mb-6">
              <FadeIn delay={0.2}>
                <div className="bg-indigo-50 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Daily streak: {streak} days</span>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.3}>
                <div className="bg-indigo-50 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">{totalCompleted} exercises completed</span>
                  </div>
                </div>
              </FadeIn>
              
              <FadeIn delay={0.4}>
                <div className="bg-indigo-50 px-4 py-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">
                      {Math.max(...skillProgress.map(s => s.level)) > 70 
                        ? "Advanced" 
                        : Math.max(...skillProgress.map(s => s.level)) > 40 
                          ? "Intermediate" 
                          : "Beginner"} level
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>
            
            <motion.button 
              className="btn btn-primary"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link to="/practice">Resume Learning</Link>
            </motion.button>
          </div>

          {/* Today's Goal Card */}
          <FadeIn delay={0.3}> {/* Adjusted delay */}
            <div className="card bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex-1 p-6 h-full"> {/* Added card class, padding, adjusted width to flex-1, and added h-full */}
              <div className="flex flex-col h-full"> {/* Add flex column and h-full here */}
                <h3 className="text-lg font-semibold mb-2">Today's Goal</h3>
                <p className="text-indigo-100 mb-4">Complete {dailyReadingGoal} reading exercises to improve your comprehension skills</p>{/* Use dailyReadingGoal variable */}
                
                {/* Start Exercises Button */}
                <motion.button 
                  className="mt-4 btn btn-primary w-full" // Reverted to btn-primary class
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {isDailyGoalCompleted ? "Today's Goal Completed!" : <Link to="/practice">Start Exercises</Link>} {/* Change text based on completion */}
                </motion.button>

                <div className="mt-auto"> {/* Push progress bar to bottom */}
                  <div className="flex justify-between items-center">
                    <div className="bg-white/20 rounded-full h-2 w-2/3">
                      <motion.div 
                        className="bg-white rounded-full h-2"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min((completedReadingExercises / dailyReadingGoal) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: 0.5 }} // Adjusted delay
                      />
                    </div>
                    <span className="text-sm">{Math.min(completedReadingExercises, dailyReadingGoal)}/{dailyReadingGoal}</span>{/* Use completed reading count and goal */}
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

        </motion.div>
        
        {/* Skill Progress, Friend Activity, Stats Row */}
        <motion.div 
           className="flex flex-col lg:flex-row gap-6"
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.4 }} // Adjusted delay
        >
          {/* Skill Progress */}
          <motion.div className="card flex-1" whileHover={{ y: -5 }} whileTap={{ y: 0 }}> {/* Added motion and hover */} 
            <h3 className="text-lg font-semibold mb-4">Your Skill Progress</h3>
            <div className="h-64 w-full">
              <Bar 
                data={chartData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        callback: function(value: number | string) {
                          return value + '%';
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      display: false
                    }
                  }
                }} 
              />
            </div>
          </motion.div>
          
          {/* Friend Activity */}
          <motion.div className="card flex-1" whileHover={{ y: -5 }} whileTap={{ y: 0 }}> {/* Added motion and hover */} 
             <div className="flex flex-col items-center justify-center space-y-4 p-4 h-full"> {/* Use h-full to fill flex item */}
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Friend Activity</h4>
                {friendActivity.length > 0 ? (
                  <ul className="w-full space-y-3">
                    {friendActivity.map((activity) => (
                      <li key={activity._id} className="text-sm text-gray-600 border-b border-gray-100 pb-2 last:border-b-0 last:pb-0">
                        <span className="font-medium text-indigo-600">{activity.user.username}</span>{' '}
                        {activity.type === 'completed_quiz' && (
                          <>completed a quiz with a score of {activity.details.score}%</>
                        )}
                        {activity.type === 'achieved_level' && (
                          <>reached level {activity.details.level}</>
                        )}
                        {activity.type === 'added_friend' && (
                           <>
                              added a new friend
                              {activity.details.friendUsername && ` (${activity.details.friendUsername})`}
                           </>
                        )}
                        {/* Add more activity types here */}
                         <span className="text-xs text-gray-400 ml-2">{new Date(activity.createdAt).toLocaleString()}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 text-center">No friend activity to show yet. Connect with friends to see their updates!</p>
                )}
             </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="flex-1 space-y-4">
            <motion.div className="card p-4" whileHover={{ y: -5 }} whileTap={{ y: 0 }}> {/* Added motion and hover */} 
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Award size={16} className="text-indigo-600" /> Total Points
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-indigo-600">
                  {skillProgress.reduce((sum, skill) => sum + skill.level, 0)}
                </span>
                <span className="text-sm text-gray-500">pts</span>
              </div>
            </motion.div>
            
            <motion.div className="card p-4" whileHover={{ y: -5 }} whileTap={{ y: 0 }}> {/* Added motion and hover */} 
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Book size={16} className="text-green-600" /> Highest Skill
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-green-600">
                  {Math.max(...skillProgress.map(s => s.level))}%
                </span>
                <span className="text-sm text-gray-500">
                  {skillProgress.find(s => s.level === Math.max(...skillProgress.map(s => s.level)))?.category}
                </span>
              </div>
            </motion.div>
            
            <motion.div className="card p-4" whileHover={{ y: -5 }} whileTap={{ y: 0 }}> {/* Added motion and hover */} 
              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <CheckSquare size={16} className="text-purple-600" /> Average Score
              </h4>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-purple-600">
                  {Math.round(skillProgress.reduce((sum, skill) => sum + skill.level, 0) / skillProgress.length)}%
                </span>
                <span className="text-sm text-gray-500">across all skills</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
        
        {/* Recommended Exercises */}
        <FadeIn delay={0.5}> {/* Adjusted delay */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recommended Exercises</h3>
              <Link to="/practice" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View all</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendedExercises.length > 0 ? (
                recommendedExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + (index * 0.1) }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2 rounded-md ${
                        exercise.category === 'grammar' ? 'bg-blue-100 text-blue-700' :
                        exercise.category === 'vocabulary' ? 'bg-purple-100 text-purple-700' :
                        exercise.category === 'reading' ? 'bg-green-100 text-green-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        <BookOpen size={16} />
                      </div>
                      
                      <span className={`text-xs rounded-full px-2 py-1 ${
                        exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                        exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                      </span>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{exercise.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{exercise.category}</p>
                    
                    <Link to={`/practice?exercise=${exercise.id}`} className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      Start Exercise
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  Great job! You've completed all available exercises.
                </div>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
 