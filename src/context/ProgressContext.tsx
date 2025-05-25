import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SkillProgress, Exercise, Quiz } from '../types';
import { useUser } from './UserContext';

interface ProgressContextType {
  skillProgress: SkillProgress[];
  exercises: Exercise[];
  quizzes: Quiz[];
  updateSkillProgress: (category: string, points: number) => void;
  completeExercise: (exerciseId: string) => void;
  completeQuiz: (quizId: string, score: number) => void;
  filteredExercises: Exercise[];
  filteredQuizzes: Quiz[];
  setExerciseDifficultyFilter: (difficulty: string | null) => void;
  setQuizDifficultyFilter: (difficulty: string | null) => void;
  exerciseDifficultyFilter: string | null;
  quizDifficultyFilter: string | null;
}

const ProgressContext = createContext<ProgressContextType>({
  skillProgress: [],
  exercises: [],
  quizzes: [],
  updateSkillProgress: () => {},
  completeExercise: () => {},
  completeQuiz: () => {},
  filteredExercises: [],
  filteredQuizzes: [],
  setExerciseDifficultyFilter: () => {},
  setQuizDifficultyFilter: () => {},
  exerciseDifficultyFilter: null,
  quizDifficultyFilter: null
});

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user, updateUserProfile } = useUser();
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [exerciseDifficultyFilter, setExerciseDifficultyFilter] = useState<string | null>(null);
  const [quizDifficultyFilter, setQuizDifficultyFilter] = useState<string | null>(null);

  // Initialize state with default values
  useEffect(() => {
    // Set default skill progress
    setSkillProgress(user?.skillProgress || [
      { category: 'Vocabulary', level: 0, totalExercises: 20, completedExercises: 0 },
      { category: 'Grammar', level: 0, totalExercises: 18, completedExercises: 0 },
      { category: 'Reading', level: 0, totalExercises: 15, completedExercises: 0 },
      { category: 'Listening', level: 0, totalExercises: 12, completedExercises: 0 },
    ]);

    // Set default exercises
    setExercises([
      { 
        id: '1', 
        title: 'Reading Comprehension: Modern Literature', 
        category: 'reading', 
        difficulty: 'beginner', 
        completed: false,
        passage: `The Annual Spring Festival will take place this Saturday at Central Park. The festival gates will open at 10:00 AM, and visitors can enjoy various activities throughout the day. Food stalls will be available starting at 11:00 AM, offering a wide variety of local and international cuisines. The main stage performances will begin at 1:00 PM, featuring local artists and cultural performances. The highlight of the evening will be the spectacular fireworks display at 9:00 PM, followed by the festival's closing ceremony. The event will conclude at 10:00 PM.`,
        options: {
          q1: [
            'The festival will end at 6:00 PM',
            'The festival will end at 8:00 PM',
            'The festival will end at 10:00 PM',
            'The festival will end at midnight'
          ],
          q2: [
            'The festival starts at 10:00 AM',
            'The festival starts at 12:00 PM',
            'The festival starts at 2:00 PM',
            'The festival starts at 4:00 PM'
          ],
          q3: [
            'The main stage performances begin at 1:00 PM',
            'The main stage performances begin at 3:00 PM',
            'The main stage performances begin at 5:00 PM',
            'The main stage performances begin at 7:00 PM'
          ],
          q4: [
            'The food stalls open at 11:00 AM',
            'The food stalls open at 1:00 PM',
            'The food stalls open at 3:00 PM',
            'The food stalls open at 5:00 PM'
          ],
          q5: [
            'The fireworks display is at 9:00 PM',
            'The fireworks display is at 10:00 PM',
            'The fireworks display is at 11:00 PM',
            'The fireworks display is at midnight'
          ]
        }
      },
      { 
        id: '2', 
        title: 'Advanced Vocabulary: Academic Terms', 
        category: 'vocabulary', 
        difficulty: 'advanced', 
        completed: false 
      },
      { 
        id: '3', 
        title: 'Grammar: Complex Sentences', 
        category: 'grammar', 
        difficulty: 'beginner', 
        completed: false 
      },
      { 
        id: '4', 
        title: 'Critical Reading: Main Ideas', 
        category: 'reading', 
        difficulty: 'intermediate', 
        completed: false 
      },
      { 
        id: '5', 
        title: 'Writing: Essay Structure', 
        category: 'grammar', 
        difficulty: 'advanced', 
        completed: false 
      },
      { 
        id: '6', 
        title: 'Vocabulary: Context Clues', 
        category: 'vocabulary', 
        difficulty: 'beginner', 
        completed: false 
      },
      { 
        id: '7', 
        title: 'Reading: Inference Skills', 
        category: 'reading', 
        difficulty: 'intermediate', 
        completed: false 
      },
      { 
        id: '8', 
        title: 'Grammar: Punctuation Rules', 
        category: 'grammar', 
        difficulty: 'intermediate', 
        completed: false 
      },
      { 
        id: '9', 
        title: 'Vocabulary: Literary Devices', 
        category: 'vocabulary', 
        difficulty: 'advanced', 
        completed: false 
      }
    ]);

    // Set default quizzes
    setQuizzes([
      {
        id: 'reading-comprehension',
        title: 'Reading Comprehension Practice',
        category: 'reading',
        difficulty: 'beginner',
        completed: false,
        score: 0,
        userAnswers: [],
        questions: [
          {
            id: 'q1-reading',
            text: 'Read the following passage and answer the question:\n\n"The invention of the printing press in the 15th century revolutionized the way information was shared. Before this invention, books were handwritten, making them expensive and rare. The printing press allowed for mass production of books, making them more accessible to the general public."\n\nWhat was the main impact of the printing press?',
            options: [
              'It made books more expensive',
              'It made books more accessible to people',
              'It made books handwritten',
              'It made books rare'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2-reading',
            text: 'Based on the same passage, what was the situation before the printing press?',
            options: [
              'Books were mass-produced',
              'Books were handwritten and expensive',
              'Books were easily accessible',
              'Books were printed quickly'
            ],
            correctAnswer: 1
          },
          {
            id: 'q3-reading',
            text: 'What is the main purpose of this passage?',
            options: [
              'To describe the process of printing',
              'To explain the impact of the printing press',
              'To list different types of books',
              'To compare old and new books'
            ],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 'grammar-practice',
        title: 'Grammar and Sentence Structure',
        category: 'grammar',
        difficulty: 'beginner',
        completed: false,
        score: 0,
        userAnswers: [],
        questions: [
          {
            id: 'q1-grammar',
            text: 'Which sentence is grammatically correct?',
            options: [
              'The students was studying for their exam',
              'The students were studying for their exam',
              'The students is studying for their exam',
              'The students be studying for their exam'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2-grammar',
            text: 'Choose the correct sentence structure:',
            options: [
              'Because it was raining, the game was cancelled',
              'The game was cancelled because it was raining',
              'Both A and B are correct',
              'Neither A nor B is correct'
            ],
            correctAnswer: 2
          },
          {
            id: 'q3-grammar',
            text: 'Which sentence uses the correct punctuation?',
            options: [
              'The teacher asked "Who wants to answer the question?"',
              'The teacher asked, "Who wants to answer the question?"',
              'The teacher asked "Who wants to answer the question"?',
              'The teacher asked, "Who wants to answer the question"?'
            ],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 'vocabulary-practice',
        title: 'Vocabulary and Word Usage',
        category: 'vocabulary',
        difficulty: 'intermediate',
        completed: false,
        score: 0,
        userAnswers: [],
        questions: [
          {
            id: 'q1-vocab',
            text: 'What is the meaning of the word "ambiguous"?',
            options: [
              'Clear and definite',
              'Open to multiple interpretations',
              'Always true',
              'Never changing'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2-vocab',
            text: 'Which word is a synonym for "perseverance"?',
            options: [
              'Giving up',
              'Persistence',
              'Failure',
              'Laziness'
            ],
            correctAnswer: 1
          },
          {
            id: 'q3-vocab',
            text: 'What is the correct meaning of "to infer"?',
            options: [
              'To state directly',
              'To draw a conclusion from evidence',
              'To ignore information',
              'To make up facts'
            ],
            correctAnswer: 1
          }
        ]
      },
      {
        id: 'writing-skills',
        title: 'Writing and Composition',
        category: 'grammar',
        difficulty: 'intermediate',
        completed: false,
        score: 0,
        userAnswers: [],
        questions: [
          {
            id: 'q1-writing',
            text: 'Which is the best topic sentence for an essay about climate change?',
            options: [
              'Climate change is bad',
              'Climate change affects our planet in many ways',
              'I think climate change is important',
              'Many people talk about climate change'
            ],
            correctAnswer: 1
          },
          {
            id: 'q2-writing',
            text: 'What is the purpose of a concluding paragraph?',
            options: [
              'To introduce new topics',
              'To summarize main points and provide closure',
              'To list all references',
              'To add more questions'
            ],
            correctAnswer: 1
          },
          {
            id: 'q3-writing',
            text: 'Which is an example of a strong thesis statement?',
            options: [
              'This essay is about education',
              'Education is important',
              'The current education system needs reform to better prepare students for the future',
              'I will write about education'
            ],
            correctAnswer: 2
          }
        ]
      },
      {
        id: 'critical-thinking',
        title: 'Critical Thinking and Analysis',
        category: 'reading',
        difficulty: 'advanced',
        completed: false,
        score: 0,
        userAnswers: [],
        questions: [
          {
            id: 'q1-critical',
            text: 'Read the following argument:\n\n"All students who study hard get good grades. John got good grades. Therefore, John must have studied hard."\n\nWhat is the logical flaw in this argument?',
            options: [
              'It assumes studying hard is the only way to get good grades',
              'It provides too much evidence',
              'It uses too many examples',
              'It is too long'
            ],
            correctAnswer: 0
          },
          {
            id: 'q2-critical',
            text: 'Which statement is an example of a fact rather than an opinion?',
            options: [
              'This is the best book ever written',
              'The book was published in 2020',
              'The book is very interesting',
              'The book should be required reading'
            ],
            correctAnswer: 1
          },
          {
            id: 'q3-critical',
            text: 'What is the main purpose of a counterargument in an essay?',
            options: [
              'To confuse the reader',
              'To address opposing viewpoints and strengthen your argument',
              'To make the essay longer',
              'To show you know both sides'
            ],
            correctAnswer: 1
          }
        ]
      }
    ]);
  }, [user]);

  // Load user progress if available
  useEffect(() => {
    if (!user) return;

    // Load user exercise completion
    const storedExercises = localStorage.getItem(`user-${user.id}-exercises`);
    if (storedExercises) {
      try {
        const parsedExercises = JSON.parse(storedExercises);
        setExercises(prevExercises => {
          // Merge with defaults, keeping completion status from storage
          return prevExercises.map(defaultEx => {
            const storedEx = parsedExercises.find((ex: Exercise) => ex.id === defaultEx.id);
            return storedEx ? { ...defaultEx, ...storedEx } : defaultEx;
          });
        });
      } catch (e) {
        console.error("Error loading exercises from localStorage:", e);
      }
    }
    
    // Load user quiz completion
    const storedQuizzes = localStorage.getItem(`user-${user.id}-quizzes`);
    if (storedQuizzes) {
      try {
        const loadedQuizzes = JSON.parse(storedQuizzes);
        setQuizzes(prevQuizzes => {
          // Merge with defaults, keeping completion status from storage
          return prevQuizzes.map(defaultQuiz => {
            const storedQuiz = loadedQuizzes.find((q: Quiz) => q.id === defaultQuiz.id);
            return storedQuiz ? { ...defaultQuiz, ...storedQuiz } : defaultQuiz;
          });
        });
      } catch (e) {
        console.error("Error loading quizzes from localStorage:", e);
      }
    }
  }, [user]);

  // Compute filtered exercises and quizzes
  const filteredExercises = exercises.filter(exercise => 
    exerciseDifficultyFilter ? exercise.difficulty === exerciseDifficultyFilter : true
  );

  const filteredQuizzes = quizzes.filter(quiz => 
    quizDifficultyFilter ? quiz.difficulty === quizDifficultyFilter : true
  );

  // Update skill progress
  const updateSkillProgress = (category: string, _points: number) => {
    setSkillProgress(prev => {
      const updated = prev.map(skill => {
        if (skill.category.toLowerCase() === category.toLowerCase()) {
          // Increment level and completed exercises
          const newCompletedExercises = Math.min(skill.completedExercises + 1, skill.totalExercises);
          const newLevel = Math.min(
            Math.floor((newCompletedExercises / skill.totalExercises) * 100),
            100
          );
          
          return {
            ...skill,
            level: newLevel,
            completedExercises: newCompletedExercises
          };
        }
        return skill;
      });
      
      // Update user progress in context
      if (user) {
        updateUserProfile({ skillProgress: updated });
      }
      
      return updated;
    });
  };

  // Mark exercise as completed
  const completeExercise = (exerciseId: string) => {
    const exercise = exercises.find(ex => ex.id === exerciseId);
    if (!exercise) return;
    
    // Update the exercise
    const updatedExercises = exercises.map(ex => 
      ex.id === exerciseId ? { ...ex, completed: true } : ex
    );
    
    setExercises(updatedExercises);
    
    // Store in localStorage for persistence
    if (user) {
      localStorage.setItem(`user-${user.id}-exercises`, JSON.stringify(updatedExercises));
    }
    
    // Update skill progress based on category
    updateSkillProgress(exercise.category, 10);
  };

  // Complete a quiz
  const completeQuiz = (quizId: string, score: number) => {
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    // Update the quiz with score and completion status
    const updatedQuizzes = quizzes.map(q => 
      q.id === quizId ? { 
        ...q, 
        completed: true, 
        score: score,
        userAnswers: [] // Reset user answers for retake
      } : q
    );
    
    setQuizzes(updatedQuizzes);
    
    // Store in localStorage for persistence
    if (user) {
      localStorage.setItem(`user-${user.id}-quizzes`, JSON.stringify(updatedQuizzes));
    }
    
    // Update skill progress based on category and score
    const progressPoints = Math.round((score / 100) * 15); // Convert score to progress points
    updateSkillProgress(quiz.category, progressPoints);
  };

  return (
    <ProgressContext.Provider value={{ 
      skillProgress, 
      exercises, 
      quizzes, 
      updateSkillProgress,
      completeExercise,
      completeQuiz,
      filteredExercises,
      filteredQuizzes,
      setExerciseDifficultyFilter,
      setQuizDifficultyFilter,
      exerciseDifficultyFilter,
      quizDifficultyFilter
    }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => useContext(ProgressContext);