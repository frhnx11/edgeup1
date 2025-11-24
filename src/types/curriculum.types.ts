// TN Board 10th Standard Curriculum Type Definitions

export type QuestionType = 'mcq' | 'short-answer' | 'long-answer' | 'practical' | 'theory';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';
export type BloomLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

export interface CurriculumTopic {
  id: string;
  title: string;
  description: string;
  duration: string; // e.g., "1 week", "2 weeks"
  difficulty: DifficultyLevel;
  questionTypes: QuestionType[]; // Suitable question types for this topic
  learningObjectives: string[];
  keyTerms: string[];
  bloomLevels: BloomLevel[]; // Cognitive levels this topic addresses
  completed?: boolean; // For student progress tracking
}

export interface CurriculumUnit {
  id: string;
  title: string;
  topics: CurriculumTopic[];
}

export interface CurriculumSubject {
  id: string;
  name: string;
  code: string; // e.g., "TN Board - 10th Std"
  teacher: string;
  color: string;
  icon: string;
  units: CurriculumUnit[];
  totalTopics: number;
  completedTopics?: number;
  progress?: number;
}

// Study Resources
export interface StudyResource {
  id: string;
  title: string;
  subject: string;
  subjectId: string; // Links to CurriculumSubject.id
  unitIds?: string[]; // Links to specific units
  topicIds?: string[]; // Links to specific topics
  type: 'pdf' | 'video' | 'document' | 'link' | 'notes';
  size: string;
  uploadedBy: string;
  uploadDate: string;
  downloads: number;
  description: string;
  thumbnail?: string;
  url?: string;
}

// Test/Assessment Types
export interface TestTemplate {
  id: string;
  title: string;
  subject: string;
  subjectId: string; // Links to CurriculumSubject.id
  unitIds?: string[]; // Covers these units
  topicIds?: string[]; // Covers these topics
  type: 'quiz' | 'midterm' | 'final' | 'assignment' | 'practice';
  status: 'upcoming' | 'live' | 'completed' | 'missed';
  date: string;
  time: string;
  duration: string;
  totalMarks: number;
  obtainedMarks?: number;
  questions: number;
  teacher: string;
  description: string;
  passingMarks: number;
  questionDistribution?: {
    mcq?: number;
    shortAnswer?: number;
    longAnswer?: number;
    practical?: number;
  };
}

// Assignment Creation Types
export interface AssignmentConfig {
  // Basic Info
  title: string;
  subject: string;
  subjectId: string;
  className: string;
  classGrade: string;

  // Curriculum Selection
  unitIds: string[];
  topicIds: string[];

  // Assignment Details
  type: 'homework' | 'practice' | 'quiz' | 'unit-test' | 'project' | 'worksheet';
  totalMarks: number;
  dueDate: string;
  duration: number; // in minutes
  difficulty: DifficultyLevel | 'mixed';

  // Question Configuration
  totalQuestions: number;
  questionDistribution: {
    mcq: number; // percentage 0-100
    shortAnswer: number; // percentage 0-100
    longAnswer: number; // percentage 0-100
    practical: number; // percentage 0-100
  };

  // AI Generation Settings
  includeDiagrams: boolean;
  includeRealWorld: boolean;
  bloomLevel: BloomLevel;

  // Additional Settings
  instructions?: string;
  submissionGuidelines?: string;
  allowLateSubmission: boolean;
  showAnswersAfterSubmission: boolean;
}

export interface AssignmentQuestion {
  id: string;
  questionNumber: number;
  type: QuestionType;
  difficulty: DifficultyLevel;
  marks: number;
  question: string;
  topicId: string;
  topicTitle: string;
  bloomLevel: BloomLevel;

  // For MCQ
  options?: string[];
  correctOption?: number;

  // Answer/Solution
  answer: string;
  explanation?: string;

  // Grading
  rubric?: string[];
  keywords?: string[];
}

export interface GeneratedAssignment {
  config: AssignmentConfig;
  questions: AssignmentQuestion[];
  rubric: GradingRubric;
  estimatedTime: number; // minutes
  coverageMap: {
    unitId: string;
    unitTitle: string;
    topicsCovered: string[];
  }[];
}

export interface GradingRubric {
  totalMarks: number;
  breakdown: {
    questionType: QuestionType;
    marks: number;
    percentage: number;
  }[];
  passingMarks: number;
  gradingCriteria: {
    range: string; // e.g., "90-100"
    grade: string; // e.g., "A+"
    description: string;
  }[];
}

// Career Path Education References
export interface EducationPath {
  steps: string[];
  streamRequired?: string; // e.g., "Science (Maths)", "Commerce", "Any"
  entranceExams: string[];
  duration: string;
  subjects?: string[]; // Relevant subjects from TN Board curriculum
}
