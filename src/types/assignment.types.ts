/**
 * Assignment Types
 * Defines data structures for online and offline assignments
 */

export type DeliveryMode = 'online' | 'offline';
export type AssignmentType = 'Quiz' | 'Homework' | 'Project' | 'Essay' | 'Lab Report' | 'Research Paper';
export type QuestionType = 'mcq' | 'short-answer' | 'long-answer' | 'numerical' | 'true-false';
export type AssignmentStatus = 'active' | 'upcoming' | 'closed' | 'draft';
export type SubmissionStatus = 'not-started' | 'in-progress' | 'submitted' | 'graded';

/**
 * Question structure for online assignments
 */
export interface Question {
  id: string;
  questionNumber: number;
  text: string;
  type: QuestionType;
  marks: number;
  options?: string[];  // For MCQ: ['A) Option 1', 'B) Option 2', 'C) Option 3', 'D) Option 4']
  correctAnswer?: string;  // For auto-grading: 'A', 'B', 'C', or 'D' for MCQ
  explanation?: string;  // Teacher's explanation/solution
}

/**
 * Student's answer to a question
 */
export interface StudentAnswer {
  questionId: string;
  answer: string;  // Student's response (selected option or typed text)
  isCorrect?: boolean;  // Auto-determined for MCQs
  marksAwarded?: number;  // Set by teacher or auto-grading
  feedback?: string;  // Teacher's feedback
}

/**
 * Student submission for an assignment
 */
export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  submittedAt: string;  // ISO date string
  status: SubmissionStatus;
  answers: StudentAnswer[];  // For online assignments
  fileUrl?: string;  // For offline assignment photo/scan uploads
  totalScore?: number;
  feedback?: string;
  gradedAt?: string;
  gradedBy?: string;
}

/**
 * Complete assignment structure
 */
export interface Assignment {
  id: string;
  title: string;
  subject: string;
  classGrade: string;
  className: string;
  deliveryMode: DeliveryMode;
  type: AssignmentType;
  dueDate: string;
  totalMarks: number;
  duration?: number;  // Duration in minutes (for timed assignments)
  status: AssignmentStatus;
  description: string;

  // For online assignments
  questions?: Question[];

  // For offline assignments
  pdfUrl?: string;  // Student question paper PDF
  answerKeyUrl?: string;  // Teacher answer key PDF

  // Metadata
  createdBy: string;
  createdAt: string;

  // Submission tracking
  totalStudents: number;
  submitted: number;
  submissions?: AssignmentSubmission[];
}

/**
 * Assignment creation data (from teacher)
 */
export interface CreateAssignmentData {
  title: string;
  subject: string;
  className: string;
  deliveryMode: DeliveryMode;
  type: AssignmentType;
  totalMarks: string | number;
  dueDate: string;
  duration?: string | number;
  description: string;
  questions?: Question[];  // For online mode
  rawContent?: string;  // AI-generated or manual content to be parsed
}
