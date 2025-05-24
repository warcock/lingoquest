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

const Dashboard = () => {
  const { user } = useUser();
  const { skillProgress, exercises, quizzes } = useProgress();
  const [streak, setStreak] = useState(0);
  
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

  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: number) => `${value}%`
        },
      }
    },
    plugins: {
      legend: {
        display: false,
      }
    }
  };

  // Calculate total completed exercises
  const totalCompleted = exercises.filter(ex => ex.completed).length;

  return (
    <PageTransition>
      <div className="space-y-6">
        <motion.div 
          className="flex flex-col md:flex-row gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Welcome Card */}
          <div className="card md:w-2/3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}</h2>
                <p className="text-gray-600 mb-4">Continue your learning journey to ace your Grade 10 entrance exam!</p>
                
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
              
              <img 
                src="https://images.unsplash.com/photo-1516979187457-637abb4f9353?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxzdHVkZW50JTIwbGVhcm5pbmclMjBlbmdsaXNoJTIwdGV4dGJvb2slMjBjbGFzc3Jvb218ZW58MHx8fHwxNzQ3NTYzOTgwfDA&ixlib=rb-4.1.0&fit=fillmax&h=600&w=800"
                alt="English textbooks on wooden table"
                className="hidden lg:block h-36 w-36 rounded-lg object-cover"
              />
            </div>
          </div>
          
          {/* Next Goal Card */}
          <FadeIn delay={0.5}>
            <div className="card md:w-1/3 bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
              <h3 className="text-lg font-semibold mb-2">Today's Goal</h3>
              <p className="text-indigo-100 mb-4">Complete 2 reading exercises to improve your comprehension skills</p>
              
              <div className="flex justify-between items-center">
                <div className="bg-white/20 rounded-full h-2 w-2/3">
                  <motion.div 
                    className="bg-white rounded-full h-2"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalCompleted / 3) * 100, 100)}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                  />
                </div>
                <span className="text-sm">{Math.min(totalCompleted, 3)}/3</span>
              </div>
            </div>
          </FadeIn>
        </motion.div>
        
        {/* Skill Progress */}
        <FadeIn delay={0.6}>
          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Skill Progress</h3>
            <div className="h-64">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </FadeIn>
        
        {/* Recommended Exercises */}
        <FadeIn delay={0.7}>
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
                        {exercise.difficulty}
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
 