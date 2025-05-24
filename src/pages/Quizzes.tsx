import { useState, useEffect } from 'react';
import { Search, BookOpen, CheckSquare, FileText, Headphones, ArrowRight, X, Star, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import PageTransition from '../components/animations/PageTransition';

const Quizzes = () => {
  const { 
    filteredQuizzes, 
    completeQuiz, 
    setQuizDifficultyFilter,
    quizDifficultyFilter 
  } = useProgress();
  const [activeQuiz, setActiveQuiz] = useState<any | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [questionFeedback, setQuestionFeedback] = useState<{isCorrect: boolean; explanation: string} | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [questionTimer, setQuestionTimer] = useState<number>(60); // 60 seconds per question
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Question timer logic
  useEffect(() => {
    if (activeQuiz && !isSubmitted && questionTimer > 0) {
      const timer = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitAnswer(); // Auto-submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeQuiz, isSubmitted, questionTimer]);

  // Reset question timer when moving to next question
  useEffect(() => {
    setQuestionTimer(60);
  }, [currentQuestionIndex]);

  // Auto-progress and feedback timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (questionFeedback && isSubmitted) {
      let timeLeft = 5; // 5 seconds countdown
      setTimeLeft(timeLeft);

      // Update countdown every second
      const countdownInterval = setInterval(() => {
        timeLeft--;
        setTimeLeft(timeLeft);
      }, 1000);

      // Progress to next question or finish quiz after feedback
      timer = setTimeout(() => {
        clearInterval(countdownInterval);
        if (currentQuestionIndex < (activeQuiz?.questions.length ?? 0) - 1) {
          nextQuestion();
        } else {
          finishQuiz();
        }
      }, 5000);

      return () => {
        clearTimeout(timer);
        clearInterval(countdownInterval);
      };
    }
  }, [questionFeedback, isSubmitted, currentQuestionIndex, activeQuiz, score]);

  const categories = [
    { id: 'vocabulary', icon: <BookOpen size={18} />, name: 'Vocabulary', color: 'bg-purple-100 text-purple-700 border-purple-200' },
    { id: 'grammar', icon: <CheckSquare size={18} />, name: 'Grammar', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    { id: 'reading', icon: <FileText size={18} />, name: 'Reading', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'listening', icon: <Headphones size={18} />, name: 'Listening', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  ];

  const difficulties = [
    { id: 'beginner', icon: <Star size={18} />, name: 'Beginner', color: 'bg-green-100 text-green-700 border-green-200' },
    { id: 'intermediate', icon: <Star size={18} />, name: 'Intermediate', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    { id: 'advanced', icon: <Star size={18} />, name: 'Advanced', color: 'bg-red-100 text-red-700 border-red-200' },
  ];

  const quizzes = filteredQuizzes
    .filter(quiz => selectedCategory ? quiz.category === selectedCategory : true)
    .filter(quiz => 
      searchQuery ? 
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      quiz.category.toLowerCase().includes(searchQuery.toLowerCase())
      : true
    );

  const getQuestionExplanation = (questionIndex: number): string => {
    const question = activeQuiz?.questions[questionIndex];
    return question?.explanation || 
      `The correct answer is "${question?.options[question?.correctAnswer]}". 
      ${question?.correctAnswer === selectedAnswer ? 'Great job!' : 'Keep practicing!'}`;
  };

  const startQuiz = (quiz: any) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setScore(0);
    setTotalScore(0);
    setShowExplanation(false);
    setQuestionFeedback(null);
    setQuestionTimer(60);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!isSubmitted) {
      setSelectedAnswer(answerIndex);
    }
  };

  const submitAnswer = () => {
    if (selectedAnswer === null || !activeQuiz) return;
    
    const question = activeQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correctAnswer;
    
    if (isCorrect) {
      setScore(score + 1);
      setTotalScore(totalScore + 100);
    }

    setQuestionFeedback({
      isCorrect,
      explanation: getQuestionExplanation(currentQuestionIndex)
    });

    setIsSubmitted(true);
    setShowExplanation(true);
  };

  const finishQuiz = () => {
    const finalScore = Math.round((score / (activeQuiz?.questions.length ?? 1)) * 100);
    completeQuiz(activeQuiz?.id ?? '', finalScore);
    setQuestionFeedback(null);
    setIsSubmitted(false);
    setActiveQuiz(null);
  };

  const nextQuestion = () => {
    if (!activeQuiz) return;
    
    if (currentQuestionIndex === activeQuiz.questions.length - 1) {
      finishQuiz();
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowExplanation(false);
    setQuestionFeedback(null);
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!activeQuiz ? (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Quiz list view */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Practice Quizzes</h2>
              </div>
              
              {/* Category filters */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Categories</h3>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      onClick={() => setSelectedCategory(null)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        selectedCategory === null ? 'bg-indigo-600 text-white' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      All Categories
                    </motion.button>
                    {categories.map(category => (
                      <motion.button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          selectedCategory === category.id ? 'bg-indigo-600 text-white' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {category.icon}
                        <span className="text-sm font-medium">{category.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Difficulty filters */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Difficulty Level</h3>
                  <div className="flex flex-wrap gap-2">
                    <motion.button
                      onClick={() => setQuizDifficultyFilter(null)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        !quizDifficultyFilter ? 'bg-indigo-600 text-white' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      All Levels
                    </motion.button>
                    {difficulties.map(difficulty => (
                      <motion.button
                        key={difficulty.id}
                        onClick={() => setQuizDifficultyFilter(difficulty.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          quizDifficultyFilter === difficulty.id ? 'bg-indigo-600 text-white' : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {difficulty.icon}
                        <span className="text-sm font-medium">{difficulty.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="mt-6 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  name="search"
                  id="search"
                  className="block w-full rounded-md border-gray-300 pl-10 pr-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Quizzes grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizzes.map((quiz, index) => (
                  <motion.div 
                    key={quiz.id} 
                    className={`card hover:shadow-md transition-shadow ${quiz.completed ? 'border-l-4 border-l-green-500' : ''}`}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                    onClick={() => startQuiz(quiz)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2 rounded-md ${
                        quiz.category === 'grammar' ? 'bg-blue-100 text-blue-700' :
                        quiz.category === 'vocabulary' ? 'bg-purple-100 text-purple-700' :
                        quiz.category === 'reading' ? 'bg-green-100 text-green-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {quiz.category === 'grammar' && <CheckSquare size={16} />}
                        {quiz.category === 'vocabulary' && <BookOpen size={16} />}
                        {quiz.category === 'reading' && <FileText size={16} />}
                        {quiz.category === 'listening' && <Headphones size={16} />}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {quiz.completed && (
                          <span className="bg-green-100 text-green-700 text-xs rounded-full px-2 py-1">
                            Completed
                          </span>
                        )}
                        
                        <span className={`text-xs rounded-full px-2 py-1 ${
                          quiz.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          quiz.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{quiz.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{quiz.category}</p>
                    <p className="text-sm text-gray-500 mb-3">{quiz.questions.length} questions</p>
                    
                    <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      {quiz.completed ? 'Retake Quiz' : 'Start Quiz'}
                      <ArrowRight size={16} className="ml-1" />
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {quizzes.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No quizzes found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                      setQuizDifficultyFilter(null);
                    }}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            // Active quiz view
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="card max-w-3xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">{activeQuiz.title}</h2>
                  <button 
                    onClick={exitQuiz}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
                
                {/* Timer moved outside the question box */}
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-green-100 bg-opacity-50 text-green-800">
                  <Clock size={20} className="text-green-700" />
                  <div className="text-sm font-medium">
                    {!isSubmitted && `Time remaining: ${Math.floor(questionTimer / 60)}:${String(questionTimer % 60).padStart(2, '0')}`}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <p className="font-medium">
                        {activeQuiz?.questions?.[currentQuestionIndex]?.text ?? 'Loading...'}
                      </p>
                    </div>
                    
                    <div className="mt-2 space-y-2">
                      {activeQuiz?.questions?.[currentQuestionIndex]?.options?.map((option: string, index: number) => (
                        <label key={index} className="flex items-center">
                          <input 
                            type="radio" 
                            name="answer"
                            className="mr-2"
                            checked={selectedAnswer === index}
                            onChange={() => handleAnswerSelect(index)}
                            disabled={isSubmitted}
                          />
                          <span className={`${
                            isSubmitted ? (
                              index === activeQuiz.questions[currentQuestionIndex].correctAnswer
                                ? 'text-green-600 font-medium'
                                : selectedAnswer === index
                                  ? 'text-red-600'
                                  : ''
                            ) : ''
                          }`}>
                            {option}
                          </span>
                        </label>
                      ))}
                    </div>

                    {/* Feedback section */}
                    {isSubmitted && questionFeedback && (
                      <motion.div 
                        className={`mt-4 p-3 rounded-lg ${
                          questionFeedback.isCorrect ? 'bg-green-50' : 'bg-red-50'
                        }`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className={`font-medium ${
                              questionFeedback.isCorrect ? 'text-green-700' : 'text-red-700'
                            }`}>
                              {questionFeedback.isCorrect ? 'Correct!' : 'Incorrect'}
                            </p>
                            <p className="text-sm mt-2">{questionFeedback.explanation}</p>
                          </div>
                          <span className="text-sm text-gray-600">Next in {timeLeft}s</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>                    <div className="flex items-center justify-between mt-8">
                  <div className="text-sm text-gray-600">
                    Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                  </div>
                  
                  <div className="flex gap-3">
                    {!isSubmitted ? (
                      <motion.button
                        className={`btn ${selectedAnswer !== null ? 'btn-primary' : 'btn-secondary'}`}
                        onClick={submitAnswer}
                        disabled={selectedAnswer === null}
                        whileHover={selectedAnswer !== null ? { scale: 1.03 } : {}}
                        whileTap={selectedAnswer !== null ? { scale: 0.97 } : {}}
                      >
                        Submit Answer
                      </motion.button>
                    ) : (
                      <motion.button
                        className="btn btn-primary"
                        onClick={nextQuestion}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {currentQuestionIndex === activeQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Quizzes;
