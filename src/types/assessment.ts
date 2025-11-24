// Types for Career Assessment System

export interface AssessmentQuestion {
  id: string;
  question: string;
  options: AssessmentOption[];
  category: InterestCategory | AptitudeCategory;
}

export interface AssessmentOption {
  id: string;
  text: string;
  score: number;
  careerWeights?: {
    [careerId: string]: number; // Weight contribution to specific careers
  };
}

export type InterestCategory =
  | 'problem-solving'
  | 'creativity'
  | 'people'
  | 'data'
  | 'technical'
  | 'research'
  | 'business'
  | 'helping';

export type AptitudeCategory =
  | 'logical'
  | 'numerical'
  | 'verbal'
  | 'spatial';

export interface AssessmentAnswer {
  questionId: string;
  optionId: string;
  score: number;
}

export interface AssessmentResults {
  interestScores: {
    [key in InterestCategory]: number;
  };
  aptitudeScores: {
    [key in AptitudeCategory]: number;
  };
  overallScore: number;
  completedAt: string;
}

export interface CareerMatch {
  careerId: string;
  careerName: string;
  matchPercentage: number;
  icon: string;
  color: string;
  tagline: string;
  recommendedStream: 'Science' | 'Commerce' | 'Arts';
  strengths: string[];
  areasToImprove: string[];
}

export interface StreamRecommendation {
  stream: 'Science' | 'Commerce' | 'Arts';
  matchPercentage: number;
  reasoning: string[];
  suitableCareers: string[];
  requiredSubjects: string[];
}
