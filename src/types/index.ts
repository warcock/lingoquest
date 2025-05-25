export  interface User {
  id: any;
  _id: string;
  username: string;
  email: string;
  skillProgress?: SkillProgress[];
  friends?: Friend[];
  schoolName?: string;
  gradeLevel?: string;
  notificationSettings?: {
    email: boolean;
    newContent: boolean;
    friendActivity: boolean;
    achievements: boolean;
  };
  passwordUpdated?: string;
  token: string;
}

export interface SkillProgress {
  category: string;
  level: number;
  totalExercises: number;
  completedExercises: number;
}

export interface Friend {
  id: string;
  username: string;
  email: string;
  level: number;
}

export interface FriendRequest {
  id: string;
  username: string;
  email: string;
}

export interface SentFriendRequest {
  id: string;
  username: string;
  email: string;
}

export interface Exercise {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  completed: boolean;
  passage?: string;
  options?: {
    [key: string]: string[];
  };
}

export interface Quiz {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  completed: boolean;
  score?: number;
  questions: Question[];
  userAnswers: number[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}
 