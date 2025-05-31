import  { SkillProgress, Exercise, Quiz } from '../types';

export const mockSkillProgress: SkillProgress[] = [
  { category: 'Vocabulary', level: 75, totalExercises: 20, completedExercises: 15 },
  { category: 'Grammar', level: 60, totalExercises: 18, completedExercises: 11 },
  { category: 'Reading', level: 40, totalExercises: 15, completedExercises: 6 },
  { category: 'Listening', level: 25, totalExercises: 12, completedExercises: 3 },
];

export const mockExercises: Exercise[] = [
  { id: '1', title: 'Basic Vocabulary: Food & Drinks', category: 'vocabulary', difficulty: 'beginner', completed: true },
  { id: '2', title: 'Advanced Vocabulary: Academic Words', category: 'vocabulary', difficulty: 'advanced', completed: false },
  { id: '3', title: 'Present Tense Practice', category: 'grammar', difficulty: 'beginner', completed: true },
  { id: '4', title: 'Past Tense Mastery', category: 'grammar', difficulty: 'intermediate', completed: false },
  { id: '5', title: 'Conditional Sentences', category: 'grammar', difficulty: 'advanced', completed: false },
  { id: '6', title: 'Reading: Short Stories', category: 'reading', difficulty: 'beginner', completed: true },
  { id: '7', title: 'Reading Comprehension: Science', category: 'reading', difficulty: 'intermediate', completed: false },
  { id: '8', title: 'Listening: Basic Conversations', category: 'listening', difficulty: 'beginner', completed: false },
  { id: '9', title: 'Listening: Academic Lectures', category: 'listening', difficulty: 'advanced', completed: false },
];

export const mockQuizzes: Quiz[] = [
  {
    id: '1',
    title: 'Basic Grammar Quiz',
    category: 'grammar',
    questions: [
      {
        id: 'q1',
        text: 'Which sentence is grammatically correct?',
        options: [
          'I am go to school.',
          'I going to school.',
          'I am going to school.',
          'I goes to school.'
        ],
        correctAnswer: 2
      },
      {
        id: 'q2',
        text: 'Choose the correct past tense form of "eat".',
        options: [
          'eat',
          'eated',
          'ate',
          'eaten'
        ],
        correctAnswer: 2
      }
    ],
    completed: false,
    difficulty: '',
    userAnswers: []
  },
  {
    id: '2',
    title: 'Reading Comprehension',
    category: 'reading',
    questions: [
      {
        id: 'q1',
        text: 'Sample reading passage question',
        options: [
          'Option 1',
          'Option 2',
          'Option 3',
          'Option 4'
        ],
        correctAnswer: 0
      }
    ],
    completed: true,
    difficulty: '',
    userAnswers: []
  },
  {
    id: '3',
    title: 'Vocabulary Test',
    category: 'vocabulary',
    questions: [
      {
        id: 'q1',
        text: 'What is the meaning of "enormous"?',
        options: [
          'Very small',
          'Very large',
          'Very beautiful',
          'Very fast'
        ],
        correctAnswer: 1
      }
    ],
    completed: false,
    difficulty: '',
    userAnswers: []
  }
];
 