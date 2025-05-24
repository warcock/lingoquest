import  { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, BookOpen, CheckSquare, FileText, Headphones, ArrowRight, X, Check, HelpCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProgress } from '../context/ProgressContext';
import PageTransition from '../components/animations/PageTransition';

const Practice = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { 
    filteredExercises, 
    completeExercise,
    setExerciseDifficultyFilter,
    exerciseDifficultyFilter 
  } = useProgress();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>(null);
  const [exerciseComplete, setExerciseComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<string, boolean>>({});
  
  const exerciseId = searchParams.get('exercise');
  
  // Set active exercise from URL parameter if provided
  useEffect(() => {
    if (exerciseId) {
      setActiveExerciseId(exerciseId);
    }
  }, [exerciseId]);
  
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
  
  const exercises = filteredExercises
    .filter(exercise => selectedCategory ? exercise.category === selectedCategory : true)
    .filter(exercise => 
      searchQuery ? 
      exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) : 
      true
    );
  
  const activeExercise = exercises.find(ex => ex.id === activeExerciseId);
  
  // Reset user answers when active exercise changes
  useEffect(() => {
    if (activeExerciseId) {
      setUserAnswers({});
      setShowExplanations({});
      setExerciseComplete(false);
      setScore(0);
    }
  }, [activeExerciseId]);
  
  // Handle selecting an answer
  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    if (exerciseComplete) return;
    
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  // Toggle explanation for a question
  const toggleExplanation = (questionId: string) => {
    setShowExplanations(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };
  
  // Handle completing an exercise
  const handleCompleteExercise = () => {
    if (!activeExerciseId || !activeExercise) return;
    
    let correctAnswers = 0;
    let totalQuestions = 0;
    
    // For vocabulary exercise
    if (activeExercise.category === 'vocabulary') {
      totalQuestions = 5;
      if (userAnswers['q1'] === 2) correctAnswers++; // "enormous" - "Very large"
      if (userAnswers['q2'] === 1) correctAnswers++; // "delicious" - "Very tasty"
      if (userAnswers['q3'] === 0) correctAnswers++; // "brave" - "Very courageous"
      if (userAnswers['q4'] === 2) correctAnswers++; // "ancient" - "Very old"
      if (userAnswers['q5'] === 1) correctAnswers++; // "beautiful" - "Very attractive"
    } 
    // For grammar exercise
    else if (activeExercise.category === 'grammar') {
      totalQuestions = 5;
      if (userAnswers['g1'] === 1) correctAnswers++; // "I go to school everyday"
      if (userAnswers['g2'] === 1) correctAnswers++; // "She doesn't like apples"
      if (userAnswers['g3'] === 2) correctAnswers++; // "They are playing football"
      if (userAnswers['g4'] === 0) correctAnswers++; // "He has finished his homework"
      if (userAnswers['g5'] === 1) correctAnswers++; // "We were watching TV"
    } 
    // For reading exercise
    else if (activeExercise.category === 'reading') {
      totalQuestions = 5;
      if (userAnswers['r1'] === 0) correctAnswers++; // "Next Saturday"
      if (userAnswers['r2'] === 1) correctAnswers++; // "3 PM"
      if (userAnswers['r3'] === 2) correctAnswers++; // "School uniform"
      if (userAnswers['r4'] === 1) correctAnswers++; // "Activities and food stalls"
      if (userAnswers['r5'] === 0) correctAnswers++; // "Parents are welcome"
    } 
    // For listening exercise
    else if (activeExercise.category === 'listening') {
      totalQuestions = 5;
      if (userAnswers['l1'] === 0) correctAnswers++; // "Sarah"
      if (userAnswers['l2'] === 1) correctAnswers++; // "Teacher"
      if (userAnswers['l3'] === 2) correctAnswers++; // "Bangkok University"
      if (userAnswers['l4'] === 1) correctAnswers++; // "English literature"
      if (userAnswers['l5'] === 0) correctAnswers++; // "Student"
    }
    
    // Calculate score
    const calculatedScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    setScore(calculatedScore);
    
    // Mark exercise as completed
    completeExercise(activeExerciseId);
    setExerciseComplete(true);
  };
  
  // Return to exercise list
  const closeExercise = () => {
    setActiveExerciseId(null);
    setExerciseComplete(false);
    setUserAnswers({});
    setShowExplanations({});
    navigate('/practice');
  };
  
  // Get explanations for a specific question
  const getExplanation = (questionId: string) => {
    switch (questionId) {
      case 'q1-reading': // Reading Comprehension
        return "The main impact of the printing press was making books more accessible to people. This is evident from the passage which states that the printing press 'allowed for mass production of books, making them more accessible to the general public.'";
      case 'q2-reading': // Reading Comprehension
        return 'Based on the passage, before the printing press, books were handwritten, making them expensive and rare.';
      case 'q3-reading': // Reading Comprehension
        return 'The main purpose of this passage is to explain the impact of the printing press on the accessibility of books.';
      case 'q1-grammar': // Grammar
        return "The correct sentence is 'The students were studying for their exam.' When the subject is plural (students), we use the plural form of the verb (were).";
      case 'q2-grammar': // Grammar
        return "Both sentence structures are correct. The first uses a dependent clause followed by an independent clause, while the second uses an independent clause followed by a dependent clause.";
      case 'q3-grammar': // Grammar
        return 'The correct punctuation for a sentence with a quote at the end is a comma before the opening quote and the punctuation inside the closing quote if it is part of the quote.';
      case 'q1-vocab': // Vocabulary
        return "The word 'ambiguous' means open to multiple interpretations. It comes from the Latin word 'ambiguus' meaning 'having double meaning'.";
      case 'q2-vocab': // Vocabulary
        return "The word 'perseverance' means persistence in doing something despite difficulty. It's a key trait for academic success.";
      case 'q3-vocab': // Vocabulary
        return "To infer means to draw a conclusion from evidence and reasoning rather than explicit statements.";
      case 'q1-writing': // Writing
        return "A good topic sentence introduces the main idea of a paragraph and should be clear and concise.";
      case 'q2-writing': // Writing
        return "A concluding paragraph summarizes the main points of the essay and provides a sense of closure, often by restating the thesis in different words or offering a final thought.";
      case 'q3-writing': // Writing
        return "A strong thesis statement is specific, debatable, and outlines the main points of the essay. The option 'The current education system needs reform to better prepare students for the future' presents a clear argument that can be supported with evidence.";
      case 'q1-critical': // Critical Thinking
        return "This is an example of a logical fallacy called Affirming the Consequent. Just because studying hard can lead to good grades doesn't mean it's the only cause, or that getting good grades definitively proves someone studied hard.";
      case 'q2-critical': // Critical Thinking
        return "A fact is a statement that can be verified and proven true, while an opinion is a personal belief or judgment. The publication date of a book is a verifiable fact.";
      case 'q3-critical': // Critical Thinking
        return "A counterargument is used to acknowledge and address opposing viewpoints, which strengthens your own argument by showing you've considered other perspectives and can respond to them.";
      default:
        return "No explanation available for this question.";
    }
  };
  
  // Get correct answer index for a specific question
  const getCorrectAnswer = (questionId: string) => {
    switch (questionId) {
      // Vocabulary questions (q1-q5)
      case 'q1': return 2; // "Enormous" - "Very large"
      case 'q2': return 1; // "Delicious" - "Very tasty"
      case 'q3': return 0; // "Brave" - "Very courageous"
      case 'q4': return 2; // "Ancient" - "Very old"
      case 'q5': return 1; // "Beautiful" - "Very attractive"
      // Grammar questions (g1-g5)
      case 'g1': return 1; // "I go to school everyday"
      case 'g2': return 1; // "She doesn't like apples"
      case 'g3': return 2; // "They are playing football"
      case 'g4': return 0; // "He has finished his homework"
      case 'g5': return 1; // "We were watching TV"
      // Reading questions (r1-r5)
      case 'r1': return 0; // "Next Saturday"
      case 'r2': return 1; // "3 PM"
      case 'r3': return 2; // "School uniform"
      case 'r4': return 1; // "Activities and food stalls"
      case 'r5': return 0; // "Parents are welcome"
      // Listening questions (l1-l5)
      case 'l1': return 0; // "Sarah"
      case 'l2': return 1; // "Teacher"
      case 'l3': return 2; // "Bangkok University"
      case 'l4': return 1; // "English literature"
      case 'l5': return 0; // "Student"
      default: return 0;
    }
  };
  
  // Check if an answer is correct
  const isAnswerCorrect = (questionId: string) => {
    const correctAnswer = getCorrectAnswer(questionId);
    const userAnswer = userAnswers[questionId];
    return userAnswer === correctAnswer;
  };

  // Get the feedback class for an answer
  const getAnswerFeedbackClass = (questionId: string, answerIndex: number) => {
    if (!exerciseComplete || userAnswers[questionId] !== answerIndex) return '';
    
    const isCorrect = answerIndex === getCorrectAnswer(questionId);
    return isCorrect ? 'text-green-700 font-medium' : 'text-red-700';
  };
  
  // Mock questions for exercises based on category
  const getExerciseContent = (exercise: any) => {
    if (exercise.category === 'vocabulary') {
      return (
        <div className="space-y-6">
          <p className="text-gray-700">Match the words with their definitions:</p>
          
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Enormous</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('q1')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['q1'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q1" 
                    className="mr-2" 
                    checked={userAnswers['q1'] === 0}
                    onChange={() => handleAnswerSelect('q1', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={getAnswerFeedbackClass('q1', 0)}>
                    Very small
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q1" 
                    className="mr-2"
                    checked={userAnswers['q1'] === 1}
                    onChange={() => handleAnswerSelect('q1', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={getAnswerFeedbackClass('q1', 1)}>
                    Very fast
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q1" 
                    className="mr-2"
                    checked={userAnswers['q1'] === 2}
                    onChange={() => handleAnswerSelect('q1', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q1'] === 2 ? (isAnswerCorrect('q1') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very large
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['q1'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('q1')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Delicious</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('q2')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['q2'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q2" 
                    className="mr-2"
                    checked={userAnswers['q2'] === 0}
                    onChange={() => handleAnswerSelect('q2', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q2'] === 0 ? (isAnswerCorrect('q2') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very quiet
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q2" 
                    className="mr-2"
                    checked={userAnswers['q2'] === 1}
                    onChange={() => handleAnswerSelect('q2', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q2'] === 1 ? (isAnswerCorrect('q2') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very tasty
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q2" 
                    className="mr-2"
                    checked={userAnswers['q2'] === 2}
                    onChange={() => handleAnswerSelect('q2', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q2'] === 2 ? (isAnswerCorrect('q2') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very colorful
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['q2'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('q2')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Brave</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('q3')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['q3'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q3" 
                    className="mr-2"
                    checked={userAnswers['q3'] === 0}
                    onChange={() => handleAnswerSelect('q3', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q3'] === 0 ? (isAnswerCorrect('q3') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very courageous
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q3" 
                    className="mr-2"
                    checked={userAnswers['q3'] === 1}
                    onChange={() => handleAnswerSelect('q3', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q3'] === 1 ? (isAnswerCorrect('q3') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very strong
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q3" 
                    className="mr-2"
                    checked={userAnswers['q3'] === 2}
                    onChange={() => handleAnswerSelect('q3', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q3'] === 2 ? (isAnswerCorrect('q3') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very smart
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['q3'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('q3')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Ancient</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('q4')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['q4'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q4" 
                    className="mr-2"
                    checked={userAnswers['q4'] === 0}
                    onChange={() => handleAnswerSelect('q4', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q4'] === 0 ? (isAnswerCorrect('q4') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very new
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q4" 
                    className="mr-2"
                    checked={userAnswers['q4'] === 1}
                    onChange={() => handleAnswerSelect('q4', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q4'] === 1 ? (isAnswerCorrect('q4') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very rare
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q4" 
                    className="mr-2"
                    checked={userAnswers['q4'] === 2}
                    onChange={() => handleAnswerSelect('q4', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q4'] === 2 ? (isAnswerCorrect('q4') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very old
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['q4'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('q4')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Beautiful</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('q5')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['q5'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q5" 
                    className="mr-2"
                    checked={userAnswers['q5'] === 0}
                    onChange={() => handleAnswerSelect('q5', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q5'] === 0 ? (isAnswerCorrect('q5') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very expensive
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q5" 
                    className="mr-2"
                    checked={userAnswers['q5'] === 1}
                    onChange={() => handleAnswerSelect('q5', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q5'] === 1 ? (isAnswerCorrect('q5') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very attractive
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="q5" 
                    className="mr-2"
                    checked={userAnswers['q5'] === 2}
                    onChange={() => handleAnswerSelect('q5', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['q5'] === 2 ? (isAnswerCorrect('q5') ? 'text-green-700' : 'text-red-700') : ''}>
                    Very colorful
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['q5'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('q5')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    } else if (exercise.category === 'grammar') {
      return (
        <div className="space-y-6">
          <p className="text-gray-700">Select the correct sentence in each group:</p>
          
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Question 1</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('g1')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['g1'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g1" 
                    className="mr-2"
                    checked={userAnswers['g1'] === 0}
                    onChange={() => handleAnswerSelect('g1', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g1'] === 0 ? (isAnswerCorrect('g1') ? 'text-green-700' : 'text-red-700') : ''}>
                    I am go to school everyday.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g1" 
                    className="mr-2"
                    checked={userAnswers['g1'] === 1}
                    onChange={() => handleAnswerSelect('g1', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g1'] === 1 ? (isAnswerCorrect('g1') ? 'text-green-700' : 'text-red-700') : ''}>
                    I go to school everyday.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g1" 
                    className="mr-2"
                    checked={userAnswers['g1'] === 2}
                    onChange={() => handleAnswerSelect('g1', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g1'] === 2 ? (isAnswerCorrect('g1') ? 'text-green-700' : 'text-red-700') : ''}>
                    I going to school everyday.
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['g1'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('g1')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Question 2</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('g2')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['g2'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g2" 
                    className="mr-2"
                    checked={userAnswers['g2'] === 0}
                    onChange={() => handleAnswerSelect('g2', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g2'] === 0 ? (isAnswerCorrect('g2') ? 'text-green-700' : 'text-red-700') : ''}>
                    She don't like apples.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g2" 
                    className="mr-2"
                    checked={userAnswers['g2'] === 1}
                    onChange={() => handleAnswerSelect('g2', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g2'] === 1 ? (isAnswerCorrect('g2') ? 'text-green-700' : 'text-red-700') : ''}>
                    She doesn't like apples.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g2" 
                    className="mr-2"
                    checked={userAnswers['g2'] === 2}
                    onChange={() => handleAnswerSelect('g2', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g2'] === 2 ? (isAnswerCorrect('g2') ? 'text-green-700' : 'text-red-700') : ''}>
                    She not like apples.
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['g2'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('g2')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Question 3</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('g3')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['g3'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g3" 
                    className="mr-2"
                    checked={userAnswers['g3'] === 0}
                    onChange={() => handleAnswerSelect('g3', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g3'] === 0 ? (isAnswerCorrect('g3') ? 'text-green-700' : 'text-red-700') : ''}>
                    They play football.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g3" 
                    className="mr-2"
                    checked={userAnswers['g3'] === 1}
                    onChange={() => handleAnswerSelect('g3', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g3'] === 1 ? (isAnswerCorrect('g3') ? 'text-green-700' : 'text-red-700') : ''}>
                    They played football.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g3" 
                    className="mr-2"
                    checked={userAnswers['g3'] === 2}
                    onChange={() => handleAnswerSelect('g3', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g3'] === 2 ? (isAnswerCorrect('g3') ? 'text-green-700' : 'text-red-700') : ''}>
                    They are playing football.
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['g3'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('g3')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Question 4</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('g4')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['g4'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g4" 
                    className="mr-2"
                    checked={userAnswers['g4'] === 0}
                    onChange={() => handleAnswerSelect('g4', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g4'] === 0 ? (isAnswerCorrect('g4') ? 'text-green-700' : 'text-red-700') : ''}>
                    He has finished his homework.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g4" 
                    className="mr-2"
                    checked={userAnswers['g4'] === 1}
                    onChange={() => handleAnswerSelect('g4', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g4'] === 1 ? (isAnswerCorrect('g4') ? 'text-green-700' : 'text-red-700') : ''}>
                    He have finished his homework.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g4" 
                    className="mr-2"
                    checked={userAnswers['g4'] === 2}
                    onChange={() => handleAnswerSelect('g4', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g4'] === 2 ? (isAnswerCorrect('g4') ? 'text-green-700' : 'text-red-700') : ''}>
                    He is finish his homework.
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['g4'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('g4')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Question 5</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('g5')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['g5'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g5" 
                    className="mr-2"
                    checked={userAnswers['g5'] === 0}
                    onChange={() => handleAnswerSelect('g5', 0)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g5'] === 0 ? (isAnswerCorrect('g5') ? 'text-green-700' : 'text-red-700') : ''}>
                    We was watching TV.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g5" 
                    className="mr-2"
                    checked={userAnswers['g5'] === 1}
                    onChange={() => handleAnswerSelect('g5', 1)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g5'] === 1 ? (isAnswerCorrect('g5') ? 'text-green-700' : 'text-red-700') : ''}>
                    We were watching TV.
                  </span>
                </label>
                <label className="flex items-center">
                  <input 
                    type="radio" 
                    name="g5" 
                    className="mr-2"
                    checked={userAnswers['g5'] === 2}
                    onChange={() => handleAnswerSelect('g5', 2)}
                    disabled={exerciseComplete}
                  />
                  <span className={exerciseComplete && userAnswers['g5'] === 2 ? (isAnswerCorrect('g5') ? 'text-green-700' : 'text-red-700') : ''}>
                    We are watching TV.
                  </span>
                </label>
              </div>
              
              <AnimatePresence>
                {showExplanations['g5'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('g5')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    } else if (exercise.category === 'reading') {
      return (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-700">
              The invention of the printing press in the 15th century revolutionized the way information was shared. Before this invention, books were handwritten, making them expensive and rare. The printing press allowed for mass production of books, making them more accessible to the general public." What was the main impact of the printing press?
            </p>
          </div>

          <p className="font-medium">Answer the following questions:</p>

          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">When will the festival be held?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('r1')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['r1'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r1" 
                      className="mr-2"
                      checked={userAnswers['r1'] === 0}
                      onChange={() => handleAnswerSelect('r1', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r1'] === 0 ? (isAnswerCorrect('r1') ? 'text-green-700' : 'text-red-700') : ''}>
                      Next Saturday
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r1" 
                      className="mr-2"
                      checked={userAnswers['r1'] === 1}
                      onChange={() => handleAnswerSelect('r1', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r1'] === 1 ? (isAnswerCorrect('r1') ? 'text-green-700' : 'text-red-700') : ''}>
                      This Friday
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r1" 
                      className="mr-2"
                      checked={userAnswers['r1'] === 2}
                      onChange={() => handleAnswerSelect('r1', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r1'] === 2 ? (isAnswerCorrect('r1') ? 'text-green-700' : 'text-red-700') : ''}>
                      Tomorrow
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['r1'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('r1')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">What time will the festival end?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('r2')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['r2'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r2" 
                      className="mr-2"
                      checked={userAnswers['r2'] === 0}
                      onChange={() => handleAnswerSelect('r2', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r2'] === 0 ? (isAnswerCorrect('r2') ? 'text-green-700' : 'text-red-700') : ''}>
                      9 AM
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r2" 
                      className="mr-2"
                      checked={userAnswers['r2'] === 1}
                      onChange={() => handleAnswerSelect('r2', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r2'] === 1 ? (isAnswerCorrect('r2') ? 'text-green-700' : 'text-red-700') : ''}>
                      3 PM
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r2" 
                      className="mr-2"
                      checked={userAnswers['r2'] === 2}
                      onChange={() => handleAnswerSelect('r2', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r2'] === 2 ? (isAnswerCorrect('r2') ? 'text-green-700' : 'text-red-700') : ''}>
                      5 PM
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['r2'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('r2')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">What should students wear?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('r3')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['r3'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r3" 
                      className="mr-2"
                      checked={userAnswers['r3'] === 0}
                      onChange={() => handleAnswerSelect('r3', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r3'] === 0 ? (isAnswerCorrect('r3') ? 'text-green-700' : 'text-red-700') : ''}>
                      Casual clothes
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r3" 
                      className="mr-2"
                      checked={userAnswers['r3'] === 1}
                      onChange={() => handleAnswerSelect('r3', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r3'] === 1 ? (isAnswerCorrect('r3') ? 'text-green-700' : 'text-red-700') : ''}>
                      Formal clothes
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r3" 
                      className="mr-2"
                      checked={userAnswers['r3'] === 2}
                      onChange={() => handleAnswerSelect('r3', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r3'] === 2 ? (isAnswerCorrect('r3') ? 'text-green-700' : 'text-red-700') : ''}>
                      School uniform
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['r3'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('r3')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">What will be at the festival?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('r4')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['r4'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r4" 
                      className="mr-2"
                      checked={userAnswers['r4'] === 0}
                      onChange={() => handleAnswerSelect('r4', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r4'] === 0 ? (isAnswerCorrect('r4') ? 'text-green-700' : 'text-red-700') : ''}>
                      Only games
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r4" 
                      className="mr-2"
                      checked={userAnswers['r4'] === 1}
                      onChange={() => handleAnswerSelect('r4', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r4'] === 1 ? (isAnswerCorrect('r4') ? 'text-green-700' : 'text-red-700') : ''}>
                      Activities and food stalls
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r4" 
                      className="mr-2"
                      checked={userAnswers['r4'] === 2}
                      onChange={() => handleAnswerSelect('r4', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r4'] === 2 ? (isAnswerCorrect('r4') ? 'text-green-700' : 'text-red-700') : ''}>
                      Only food stalls
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['r4'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('r4')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Are parents allowed to attend?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('r5')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['r5'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r5" 
                      className="mr-2"
                      checked={userAnswers['r5'] === 0}
                      onChange={() => handleAnswerSelect('r5', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r5'] === 0 ? (isAnswerCorrect('r5') ? 'text-green-700' : 'text-red-700') : ''}>
                      Parents are welcome
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r5" 
                      className="mr-2"
                      checked={userAnswers['r5'] === 1}
                      onChange={() => handleAnswerSelect('r5', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r5'] === 1 ? (isAnswerCorrect('r5') ? 'text-green-700' : 'text-red-700') : ''}>
                      Only students
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="r5" 
                      className="mr-2"
                      checked={userAnswers['r5'] === 2}
                      onChange={() => handleAnswerSelect('r5', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['r5'] === 2 ? (isAnswerCorrect('r5') ? 'text-green-700' : 'text-red-700') : ''}>
                      Only teachers
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['r5'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('r5')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    } else { // listening
      return (
        <div className="space-y-6">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="italic text-gray-500">[Audio content would play here in a real app]</p>
            <p className="mt-2 text-gray-700">
              "Hello, my name is Sarah. I am a student at Bangkok University. 
              I study English literature. I want to be a teacher in the future."
            </p>
          </div>
          
          <p className="font-medium">Answer the following questions based on the audio:</p>
          
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p>What is the speaker's name?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('l1')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['l1'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l1" 
                      className="mr-2"
                      checked={userAnswers['l1'] === 0}
                      onChange={() => handleAnswerSelect('l1', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l1'] === 0 ? (isAnswerCorrect('l1') ? 'text-green-700' : 'text-red-700') : ''}>
                      Sarah
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l1" 
                      className="mr-2"
                      checked={userAnswers['l1'] === 1}
                      onChange={() => handleAnswerSelect('l1', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l1'] === 1 ? (isAnswerCorrect('l1') ? 'text-green-700' : 'text-red-700') : ''}>
                      Sandra
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l1" 
                      className="mr-2"
                      checked={userAnswers['l1'] === 2}
                      onChange={() => handleAnswerSelect('l1', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l1'] === 2 ? (isAnswerCorrect('l1') ? 'text-green-700' : 'text-red-700') : ''}>
                      Samantha
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['l1'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('l1')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p>What does she want to be in the future?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('l2')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['l2'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l2" 
                      className="mr-2"
                      checked={userAnswers['l2'] === 0}
                      onChange={() => handleAnswerSelect('l2', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l2'] === 0 ? (isAnswerCorrect('l2') ? 'text-green-700' : 'text-red-700') : ''}>
                      Doctor
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l2" 
                      className="mr-2"
                      checked={userAnswers['l2'] === 1}
                      onChange={() => handleAnswerSelect('l2', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l2'] === 1 ? (isAnswerCorrect('l2') ? 'text-green-700' : 'text-red-700') : ''}>
                      Teacher
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l2" 
                      className="mr-2"
                      checked={userAnswers['l2'] === 2}
                      onChange={() => handleAnswerSelect('l2', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l2'] === 2 ? (isAnswerCorrect('l2') ? 'text-green-700' : 'text-red-700') : ''}>
                      Engineer
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['l2'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('l2')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p>Which university does she attend?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('l3')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['l3'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l3" 
                      className="mr-2"
                      checked={userAnswers['l3'] === 0}
                      onChange={() => handleAnswerSelect('l3', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l3'] === 0 ? (isAnswerCorrect('l3') ? 'text-green-700' : 'text-red-700') : ''}>
                      Chiang Mai University
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l3" 
                      className="mr-2"
                      checked={userAnswers['l3'] === 1}
                      onChange={() => handleAnswerSelect('l3', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l3'] === 1 ? (isAnswerCorrect('l3') ? 'text-green-700' : 'text-red-700') : ''}>
                      Thammasat University
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l3" 
                      className="mr-2"
                      checked={userAnswers['l3'] === 2}
                      onChange={() => handleAnswerSelect('l3', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l3'] === 2 ? (isAnswerCorrect('l3') ? 'text-green-700' : 'text-red-700') : ''}>
                      Bangkok University
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['l3'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('l3')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p>What is she studying?</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('l4')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['l4'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l4" 
                      className="mr-2"
                      checked={userAnswers['l4'] === 0}
                      onChange={() => handleAnswerSelect('l4', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l4'] === 0 ? (isAnswerCorrect('l4') ? 'text-green-700' : 'text-red-700') : ''}>
                      Education
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l4" 
                      className="mr-2"
                      checked={userAnswers['l4'] === 1}
                      onChange={() => handleAnswerSelect('l4', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l4'] === 1 ? (isAnswerCorrect('l4') ? 'text-green-700' : 'text-red-700') : ''}>
                      English literature
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l4" 
                      className="mr-2"
                      checked={userAnswers['l4'] === 2}
                      onChange={() => handleAnswerSelect('l4', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l4'] === 2 ? (isAnswerCorrect('l4') ? 'text-green-700' : 'text-red-700') : ''}>
                      Business
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['l4'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('l4')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                <p className="font-medium">Question 5</p>
                {exerciseComplete && (
                  <button 
                    onClick={() => toggleExplanation('l5')}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                    {showExplanations['l5'] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l5" 
                      className="mr-2"
                      checked={userAnswers['l5'] === 0}
                      onChange={() => handleAnswerSelect('l5', 0)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l5'] === 0 ? (isAnswerCorrect('l5') ? 'text-green-700' : 'text-red-700') : ''}>
                      Student
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l5" 
                      className="mr-2"
                      checked={userAnswers['l5'] === 1}
                      onChange={() => handleAnswerSelect('l5', 1)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l5'] === 1 ? (isAnswerCorrect('l5') ? 'text-green-700' : 'text-red-700') : ''}>
                      Teacher
                    </span>
                  </label>
                </div>
                <div className="p-3 border rounded-lg">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="l5" 
                      className="mr-2"
                      checked={userAnswers['l5'] === 2}
                      onChange={() => handleAnswerSelect('l5', 2)}
                      disabled={exerciseComplete}
                    />
                    <span className={exerciseComplete && userAnswers['l5'] === 2 ? (isAnswerCorrect('l5') ? 'text-green-700' : 'text-red-700') : ''}>
                      Professor
                    </span>
                  </label>
                </div>
              </div>
              
              <AnimatePresence>
                {showExplanations['l5'] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    {getExplanation('l5')}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      );
    }
  };

  // Count answered questions
  const answeredQuestions = Object.keys(userAnswers).length;
  const totalQuestions = activeExercise?.category === 'vocabulary' || activeExercise?.category === 'grammar' || 
                          activeExercise?.category === 'reading' || activeExercise?.category === 'listening' ? 5 : 0;
  
  // Check if all questions are answered
  const allQuestionsAnswered = totalQuestions > 0 && answeredQuestions >= totalQuestions;

  return (
    <PageTransition>
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {!activeExerciseId ? (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Practice Exercises</h2>
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
                      onClick={() => setExerciseDifficultyFilter(null)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        !exerciseDifficultyFilter ? 'bg-indigo-600 text-white' : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      All Levels
                    </motion.button>
                    {difficulties.map(difficulty => (
                      <motion.button
                        key={difficulty.id}
                        onClick={() => setExerciseDifficultyFilter(difficulty.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                          exerciseDifficultyFilter === difficulty.id ? 'bg-indigo-600 text-white' : 'border-gray-200 hover:bg-gray-50'
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
                  placeholder="Search exercises..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {/* Exercises grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {exercises.map((exercise, index) => (
                  <motion.div 
                    key={exercise.id} 
                    className={`card hover:shadow-md transition-shadow ${exercise.completed ? 'border-l-4 border-l-green-500' : ''}`}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (index * 0.05) }}
                    onClick={() => setActiveExerciseId(exercise.id)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className={`p-2 rounded-md ${
                        exercise.category === 'grammar' ? 'bg-blue-100 text-blue-700' :
                        exercise.category === 'vocabulary' ? 'bg-purple-100 text-purple-700' :
                        exercise.category === 'reading' ? 'bg-green-100 text-green-700' : 
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {exercise.category === 'grammar' && <CheckSquare size={16} />}
                        {exercise.category === 'vocabulary' && <BookOpen size={16} />}
                        {exercise.category === 'reading' && <FileText size={16} />}
                        {exercise.category === 'listening' && <Headphones size={16} />}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {exercise.completed && (
                          <span className="bg-green-100 text-green-700 text-xs rounded-full px-2 py-1">
                            Completed
                          </span>
                        )}
                        
                        <span className={`text-xs rounded-full px-2 py-1 ${
                          exercise.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                          exercise.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <h4 className="font-medium text-gray-900 mb-2">{exercise.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 capitalize">{exercise.category}</p>
                    <p className="text-sm text-gray-500 mb-3">5 questions</p>
                    
                    <button className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      {exercise.completed ? 'Practice Again' : 'Start Exercise'}
                      <ArrowRight size={16} className="ml-1" />
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {filteredExercises.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600">No exercises found matching your criteria.</p>
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSearchQuery('');
                    }}
                    className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </motion.div>
          ) : (
            // Active exercise view
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {!exerciseComplete ? (
                <div className="card max-w-3xl mx-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">{activeExercise?.title}</h2>
                    <button 
                      onClick={closeExercise}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <X size={20} className="text-gray-500" />
                    </button>
                  </div>
                  
                  {activeExercise && getExerciseContent(activeExercise)}
                  
                  <div className="flex items-center justify-between mt-8">
                    <div className="text-sm text-gray-600">
                      {answeredQuestions} of {totalQuestions} questions answered
                    </div>
                    
                    <motion.button
                      className={`btn ${allQuestionsAnswered ? 'btn-primary' : 'btn-secondary'}`}
                      onClick={handleCompleteExercise}
                      disabled={!allQuestionsAnswered}
                      whileHover={allQuestionsAnswered ? { scale: 1.03 } : {}}
                      whileTap={allQuestionsAnswered ? { scale: 0.97 } : {}}
                    >
                      Submit Answers
                    </motion.button>
                  </div>
                </div>
              ) : (
                // Exercise completion view
                <motion.div 
                  className="card max-w-2xl mx-auto"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                >
                  <div className="py-6">
                    <motion.div 
                      className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      <Check className="h-8 w-8 text-green-600" />
                    </motion.div>
                    
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Exercise Completed!</h2>
                    <p className="text-gray-600 mb-4 text-center">You scored {score}% on this exercise</p>
                    
                    {/* Results summary */}
                    <div className="border rounded-lg p-4 mb-6">
                      <h3 className="font-medium text-lg mb-3">Your Results</h3>
                      <div className="space-y-2">
                        {Object.keys(userAnswers).map(questionId => (
                          <div key={questionId} className="flex items-center justify-between">
                            <span className="text-sm">Question {questionId}</span>
                            <span className={`text-sm font-medium ${isAnswerCorrect(questionId) ? 'text-green-600' : 'text-red-600'}`}>
                              {isAnswerCorrect(questionId) ? 'Correct' : 'Incorrect'}
                            </span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="h-1 w-full bg-gray-200 rounded-full mt-4">
                        <div 
                          className="h-1 bg-indigo-600 rounded-full" 
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center space-x-4">
                      <motion.button
                        className="btn btn-secondary"
                        onClick={closeExercise}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Back to Exercises
                      </motion.button>
                      <motion.button
                        className="btn btn-primary"
                        onClick={() => {
                          // Find next uncompleted exercise
                          const uncompleted = exercises.filter(ex => !ex.completed);
                          if (uncompleted.length > 0) {
                            setActiveExerciseId(uncompleted[0].id);
                            setExerciseComplete(false);
                            setUserAnswers({});
                            setShowExplanations({});
                          } else {
                            closeExercise();
                          }
                        }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Next Exercise
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default Practice;
