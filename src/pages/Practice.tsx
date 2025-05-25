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
      case 'q1-reading':
        return 'The correct answer is "It made books more accessible to people." This is the main impact because the passage specifically states that the printing press "allowed for mass production of books, making them more accessible to the general public." Before the printing press, books were handwritten and expensive, making them rare and only available to the wealthy. The invention of the printing press revolutionized information sharing by making books affordable and available to everyone. This historical development was crucial in spreading knowledge and education throughout society.';
      
      case 'q2-reading':
        return 'The correct answer is "Books were handwritten and expensive." This is supported by the passage which states that "Before this invention, books were handwritten, making them expensive and rare." This historical context is important because it helps us understand why the printing press was such a revolutionary invention. The process of handwriting books was time-consuming and labor-intensive, which contributed to their high cost and limited availability. This meant that only the wealthy and powerful had access to books and knowledge, creating a significant barrier to education and information sharing.';
      
      case 'q3-reading':
        return 'The correct answer is "To explain the impact of the printing press." The passage is structured to first describe the situation before the printing press (handwritten, expensive books), then introduce the invention, and finally explain its main impact (making books accessible to the public). This structure helps readers understand the significance of the printing press in changing how information was shared in society. The passage uses a cause-and-effect structure to show how this invention transformed the availability of books and, consequently, the spread of knowledge.';
      
      case 'q1-grammar':
        return 'The correct answer is "The students were studying for their exam." This is correct because "students" is a plural noun, so it requires the plural form of the verb "to be" (were). The other options are incorrect because they use singular forms (was/is) or an incorrect form (be) with a plural subject. This is a fundamental rule of subject-verb agreement in English grammar. Understanding this rule is essential for clear communication and proper sentence structure. The rule states that the verb must agree with its subject in number (singular or plural).';
      
      case 'q2-grammar':
        return 'The correct answer is "Both A and B are correct." Both sentence structures are grammatically correct. The first sentence uses a dependent clause followed by a comma and an independent clause. The second sentence uses an independent clause followed by a dependent clause. The meaning is the same in both cases, demonstrating how English allows for flexible sentence structure while maintaining clarity. This flexibility in sentence structure is one of the strengths of English, allowing writers to vary their writing style and emphasize different parts of the sentence.';
      
      case 'q3-grammar':
        return 'The correct answer is "The teacher asked, \'Who wants to answer the question?\'" This is correct because it follows the proper punctuation rules for direct speech: 1) A comma is used before the quotation marks, 2) The question mark goes inside the quotation marks, and 3) The sentence ends with a period after the closing quotation mark. This is a common punctuation pattern in English for reporting speech. Proper punctuation is crucial for clear communication and helps readers understand the relationship between different parts of the sentence.';
      
      case 'q1-vocab':
        return 'The correct answer is "Open to multiple interpretations." The word "ambiguous" means having multiple possible meanings or interpretations. This is different from being "clear and definite" (which is the opposite of ambiguous), "always true" (which is about certainty), or "never changing" (which is about stability). Understanding this word is important for reading comprehension as it helps identify when a text might have multiple valid interpretations.';
      
      case 'q2-vocab':
        return 'The correct answer is "Persistence." This is a synonym for "perseverance," which means continuing to do something despite difficulties or delays. The other options are antonyms: "Giving up" is the opposite of perseverance, "Failure" is a possible outcome of not persevering, and "Laziness" is a trait that would prevent perseverance. Understanding synonyms helps expand vocabulary and improve reading comprehension.';
      
      case 'q3-vocab':
        return 'The correct answer is "To draw a conclusion from evidence." The word "infer" means to reach a conclusion based on evidence and reasoning. It is different from "stating directly" (which is explicit rather than implicit), "ignoring information" (which is the opposite of using evidence), or "making up facts" (which is not based on evidence). This is a crucial reading skill that helps readers understand implied meanings in texts.';
      
      case 'q1-writing':
        return 'The correct answer is "Climate change affects our planet in many ways." This is the best topic sentence because it is specific, makes a clear statement, and sets up the possibility for detailed discussion. The other options are either too vague ("Climate change is bad"), too personal ("I think climate change is important"), or too general ("Many people talk about climate change"). A good topic sentence should be specific enough to guide the reader while being broad enough to allow for supporting details.';
      
      case 'q2-writing':
        return 'The correct answer is "To summarize main points and provide closure." A concluding paragraph serves several important purposes: it reminds readers of the main arguments, ties together different points, and provides a sense of completion. The other options describe inappropriate uses of a conclusion: introducing new topics would confuse readers, listing references belongs in a separate section, and adding more questions would leave the essay unresolved.';
      
      case 'q3-writing':
        return 'The correct answer is "The current education system needs reform to better prepare students for the future." This is a strong thesis statement because it is specific, makes a clear argument, and suggests a solution. The other options are weak because they are either too vague ("Education is important"), too personal ("I will write about education"), or too general ("This essay is about education"). A strong thesis statement should be specific, arguable, and provide direction for the essay.';
      
      case 'q1-critical':
        return 'The correct answer is "It assumes studying hard is the only way to get good grades." This is a logical flaw because the argument makes an incorrect assumption. The argument states that all students who study hard get good grades, and John got good grades, therefore John must have studied hard. This is a logical error because there could be other ways to get good grades (natural talent, good teaching, etc.). This is an example of the logical fallacy of affirming the consequent.';
      
      case 'q2-critical':
        return 'The correct answer is "The book was published in 2020." This is a fact because it can be verified and is not based on personal opinion. The other options are opinions because they express personal judgments ("best book ever," "very interesting," "should be required"). Understanding the difference between facts and opinions is crucial for critical thinking and evaluating the reliability of information.';
      
      case 'q3-critical':
        return 'The correct answer is "To address opposing viewpoints and strengthen your argument." Including counterarguments is an important part of persuasive writing because it shows that the writer has considered different perspectives. The other options describe inappropriate uses of counterarguments: confusing the reader would weaken the argument, making the essay longer is not a valid purpose, and showing knowledge of both sides is not the main purpose. A well-handled counterargument actually strengthens the writer\'s position by addressing potential objections.';
      
      default:
        return 'The correct answer is based on the information provided in the passage.';
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
  
  // Mock questions for exercises based on category
  const getExerciseContent = (exercise: any) => {
    // Define types for options
    type QuestionOptions = {
      [key: string]: string[];
    };

    type CategoryOptions = {
      [key: string]: QuestionOptions;
    };

    // Default options for each category
    const defaultOptions: CategoryOptions = {
      vocabulary: {
        q1: ['Very small', 'Very tasty', 'Very large', 'Very old'],
        q2: ['Very small', 'Very tasty', 'Very large', 'Very old'],
        q3: ['Very small', 'Very tasty', 'Very large', 'Very old'],
        q4: ['Very small', 'Very tasty', 'Very large', 'Very old'],
        q5: ['Very small', 'Very tasty', 'Very large', 'Very old']
      },
      grammar: {
        g1: ['I am go to school everyday', 'I go to school everyday', 'I going to school everyday', 'I goes to school everyday'],
        g2: ['She don\'t like apples', 'She doesn\'t like apples', 'She not like apples', 'She no like apples'],
        g3: ['They play football', 'They played football', 'They are playing football', 'They playing football'],
        g4: ['He have finished his homework', 'He has finished his homework', 'He finished his homework', 'He finishing his homework'],
        g5: ['We was watching TV', 'We were watching TV', 'We watching TV', 'We watch TV']
      },
      reading: {
        r1: ['Next Saturday', 'This Friday', 'Tomorrow', 'Next Sunday'],
        r2: ['At the school playground', 'At the city park', 'At the community center', 'At the sports center'],
        r3: ['School uniform', 'Casual clothes', 'Formal clothes', 'Sports clothes'],
        r4: ['Activities and food stalls', 'Only games', 'Only food stalls', 'Only performances'],
        r5: ['Parents are welcome', 'Only students', 'Only teachers', 'No visitors allowed']
      },
      listening: {
        l1: ['Sarah', 'Sandra', 'Sara', 'Susan'],
        l2: ['Teacher', 'Doctor', 'Engineer', 'Lawyer'],
        l3: ['Bangkok University', 'Chiang Mai University', 'Thammasat University', 'Mahidol University'],
        l4: ['English literature', 'Education', 'Business', 'Science'],
        l5: ['Student', 'Teacher', 'Professor', 'Researcher']
      }
    };

    // Get options based on category and question
    const getOptions = (questionId: string) => {
      const category = exercise?.category as keyof typeof defaultOptions;
      return exercise?.options?.[questionId] || defaultOptions[category]?.[questionId] || [];
    };

    if (exercise?.category === 'vocabulary') {
      return (
        <div className="space-y-6">
          <p className="text-gray-700">Match the words with their definitions:</p>
          
          <div className="space-y-4">
            {['q1', 'q2', 'q3', 'q4', 'q5'].map((questionId) => (
              <div key={questionId} className="p-3 border rounded-lg">
              <div className="flex justify-between items-center">
                  <p className="font-medium">
                    {questionId === 'q1' ? 'Enormous' :
                     questionId === 'q2' ? 'Delicious' :
                     questionId === 'q3' ? 'Brave' :
                     questionId === 'q4' ? 'Ancient' : 'Beautiful'}
                  </p>
                {exerciseComplete && (
                  <button 
                      onClick={() => toggleExplanation(questionId)}
                    className="flex items-center text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    <HelpCircle size={14} className="mr-1" />
                      {showExplanations[questionId] ? 'Hide' : 'Show'} explanation
                  </button>
                )}
              </div>
              
              <div className="mt-2 space-y-2">
                  {getOptions(questionId).map((option: string, optionIndex: number) => (
                    <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                          name={questionId} 
                    className="mr-2" 
                          checked={userAnswers[questionId] === optionIndex}
                          onChange={() => handleAnswerSelect(questionId, optionIndex)}
                    disabled={exerciseComplete}
                  />
                        <span className={`flex-1 ${
                          exerciseComplete ? (
                            optionIndex === getCorrectAnswer(questionId)
                              ? 'text-green-700 font-medium'
                              : userAnswers[questionId] === optionIndex
                                ? 'text-red-700'
                                : ''
                          ) : ''
                        }`}>
                          {option}
                  </span>
                </label>
              </div>
                  ))}
              </div>
              
              <AnimatePresence>
                  {showExplanations[questionId] && (
                  <motion.div 
                    className="mt-3 text-sm bg-indigo-50 p-3 rounded-lg"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                      {getExplanation(questionId)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            ))}
          </div>
        </div>
      );
    } else if (exercise?.category === 'grammar') {
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
                {getOptions('g1').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="g1" 
                    className="mr-2"
                        checked={userAnswers['g1'] === optionIndex}
                        onChange={() => handleAnswerSelect('g1', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('g1')
                            ? 'text-green-700 font-medium'
                            : userAnswers['g1'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('g2').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="g2" 
                    className="mr-2"
                        checked={userAnswers['g2'] === optionIndex}
                        onChange={() => handleAnswerSelect('g2', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('g2')
                            ? 'text-green-700 font-medium'
                            : userAnswers['g2'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('g3').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="g3" 
                    className="mr-2"
                        checked={userAnswers['g3'] === optionIndex}
                        onChange={() => handleAnswerSelect('g3', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('g3')
                            ? 'text-green-700 font-medium'
                            : userAnswers['g3'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('g4').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="g4" 
                    className="mr-2"
                        checked={userAnswers['g4'] === optionIndex}
                        onChange={() => handleAnswerSelect('g4', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('g4')
                            ? 'text-green-700 font-medium'
                            : userAnswers['g4'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('g5').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="g5" 
                    className="mr-2"
                        checked={userAnswers['g5'] === optionIndex}
                        onChange={() => handleAnswerSelect('g5', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('g5')
                            ? 'text-green-700 font-medium'
                            : userAnswers['g5'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
    } else if (exercise?.category === 'reading') {
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
                {getOptions('r1').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="r1" 
                    className="mr-2"
                        checked={userAnswers['r1'] === optionIndex}
                        onChange={() => handleAnswerSelect('r1', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('r1')
                            ? 'text-green-700 font-medium'
                            : userAnswers['r1'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('r2').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="r2" 
                    className="mr-2"
                        checked={userAnswers['r2'] === optionIndex}
                        onChange={() => handleAnswerSelect('r2', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('r2')
                            ? 'text-green-700 font-medium'
                            : userAnswers['r2'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('r3').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="r3" 
                    className="mr-2"
                        checked={userAnswers['r3'] === optionIndex}
                        onChange={() => handleAnswerSelect('r3', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('r3')
                            ? 'text-green-700 font-medium'
                            : userAnswers['r3'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('r4').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="r4" 
                    className="mr-2"
                        checked={userAnswers['r4'] === optionIndex}
                        onChange={() => handleAnswerSelect('r4', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('r4')
                            ? 'text-green-700 font-medium'
                            : userAnswers['r4'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('r5').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="r5" 
                    className="mr-2"
                        checked={userAnswers['r5'] === optionIndex}
                        onChange={() => handleAnswerSelect('r5', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('r5')
                            ? 'text-green-700 font-medium'
                            : userAnswers['r5'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('l1').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="l1" 
                    className="mr-2"
                        checked={userAnswers['l1'] === optionIndex}
                        onChange={() => handleAnswerSelect('l1', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('l1')
                            ? 'text-green-700 font-medium'
                            : userAnswers['l1'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('l2').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="l2" 
                    className="mr-2"
                        checked={userAnswers['l2'] === optionIndex}
                        onChange={() => handleAnswerSelect('l2', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('l2')
                            ? 'text-green-700 font-medium'
                            : userAnswers['l2'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('l3').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="l3" 
                    className="mr-2"
                        checked={userAnswers['l3'] === optionIndex}
                        onChange={() => handleAnswerSelect('l3', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('l3')
                            ? 'text-green-700 font-medium'
                            : userAnswers['l3'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('l4').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="l4" 
                    className="mr-2"
                        checked={userAnswers['l4'] === optionIndex}
                        onChange={() => handleAnswerSelect('l4', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('l4')
                            ? 'text-green-700 font-medium'
                            : userAnswers['l4'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
                {getOptions('l5').map((option: string, optionIndex: number) => (
                  <div key={optionIndex} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="l5" 
                    className="mr-2"
                        checked={userAnswers['l5'] === optionIndex}
                        onChange={() => handleAnswerSelect('l5', optionIndex)}
                    disabled={exerciseComplete}
                  />
                      <span className={`flex-1 ${
                        exerciseComplete ? (
                          optionIndex === getCorrectAnswer('l5')
                            ? 'text-green-700 font-medium'
                            : userAnswers['l5'] === optionIndex
                              ? 'text-red-700'
                              : ''
                        ) : ''
                      }`}>
                        {option}
                  </span>
                </label>
                  </div>
                ))}
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
