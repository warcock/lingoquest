import { ReactNode } from "react";

export  interface User {
  id: string;
  name: string;
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
}

export interface SkillProgress {
  category: string;
  level: number;
  totalExercises: number;
  completedExercises: number;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  level: number;
}

export interface FriendRequest {
  id: string;
  name: string;
  email: string;
}

export interface Exercise {
  [x: string]: ReactNode;
  id: string;
  title: string;
  category: string; // vocabulary, grammar, reading, listening
  difficulty: string; // beginner, intermediate, advanced
  completed: boolean;
  score?: number;
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
 