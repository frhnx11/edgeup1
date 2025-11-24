/**
 * Auto-Grading Utility
 * Handles automatic grading of MCQ and True/False questions
 */

import type { Question, StudentAnswer } from '../types/assignment.types';

/**
 * Grade a single student answer
 */
export const gradeAnswer = (question: Question, studentAnswer: string): {
  isCorrect: boolean;
  marksAwarded: number;
  feedback: string;
} => {
  if (question.type === 'mcq' || question.type === 'true-false') {
    return gradeMCQ(question, studentAnswer);
  }

  // Non-auto-gradable questions return neutral result
  return {
    isCorrect: false,
    marksAwarded: 0,
    feedback: 'Pending teacher review'
  };
};

/**
 * Grade MCQ/True-False answer
 */
function gradeMCQ(question: Question, studentAnswer: string): {
  isCorrect: boolean;
  marksAwarded: number;
  feedback: string;
} {
  if (!question.correctAnswer) {
    return {
      isCorrect: false,
      marksAwarded: 0,
      feedback: 'No correct answer defined'
    };
  }

  // Normalize answers for comparison (remove whitespace, convert to uppercase)
  const normalizedStudentAnswer = studentAnswer.trim().toUpperCase();
  const normalizedCorrectAnswer = question.correctAnswer.trim().toUpperCase();

  // Check if student answer matches correct answer
  // Handle both "A" and "A)" formats
  const studentAnswerLetter = normalizedStudentAnswer.replace(/[^A-D]/g, '');
  const correctAnswerLetter = normalizedCorrectAnswer.replace(/[^A-D]/g, '');

  const isCorrect = studentAnswerLetter === correctAnswerLetter;

  return {
    isCorrect,
    marksAwarded: isCorrect ? question.marks : 0,
    feedback: isCorrect
      ? '✓ Correct!'
      : `✗ Incorrect. The correct answer is ${question.correctAnswer}`
  };
}

/**
 * Grade all student answers for an assignment
 */
export const gradeAssignment = (questions: Question[], studentAnswers: StudentAnswer[]): {
  gradedAnswers: StudentAnswer[];
  totalScore: number;
  maxScore: number;
  autoGradedCount: number;
  pendingReviewCount: number;
} => {
  let totalScore = 0;
  let autoGradedCount = 0;
  let pendingReviewCount = 0;

  const gradedAnswers = studentAnswers.map(answer => {
    const question = questions.find(q => q.id === answer.questionId);

    if (!question) {
      return answer;
    }

    // Only auto-grade MCQ and True/False
    if (question.type === 'mcq' || question.type === 'true-false') {
      const result = gradeAnswer(question, answer.answer);
      totalScore += result.marksAwarded;
      autoGradedCount++;

      return {
        ...answer,
        isCorrect: result.isCorrect,
        marksAwarded: result.marksAwarded,
        feedback: result.feedback
      };
    }

    // Other question types need manual grading
    pendingReviewCount++;
    return {
      ...answer,
      marksAwarded: 0,
      feedback: 'Pending teacher review'
    };
  });

  const maxScore = questions.reduce((sum, q) => sum + q.marks, 0);

  return {
    gradedAnswers,
    totalScore,
    maxScore,
    autoGradedCount,
    pendingReviewCount
  };
};

/**
 * Calculate percentage score
 */
export const calculatePercentage = (score: number, maxScore: number): number => {
  if (maxScore === 0) return 0;
  return Math.round((score / maxScore) * 100);
};

/**
 * Get grade letter based on percentage
 */
export const getGradeLetter = (percentage: number): string => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

/**
 * Generate performance feedback
 */
export const generatePerformanceFeedback = (percentage: number, autoGradedOnly: boolean): string => {
  const suffix = autoGradedOnly ? ' (Based on auto-graded questions only)' : '';

  if (percentage >= 90) {
    return `Excellent work! You scored ${percentage}%${suffix}`;
  } else if (percentage >= 75) {
    return `Great job! You scored ${percentage}%${suffix}`;
  } else if (percentage >= 60) {
    return `Good effort! You scored ${percentage}%${suffix}`;
  } else if (percentage >= 40) {
    return `You scored ${percentage}%. Keep practicing!${suffix}`;
  } else {
    return `You scored ${percentage}%. Please review the material and try again${suffix}`;
  }
};

/**
 * Get question statistics from student answers
 */
export const getAnswerStatistics = (questions: Question[], studentAnswers: StudentAnswer[]) => {
  const stats = {
    totalQuestions: questions.length,
    answered: studentAnswers.filter(a => a.answer && a.answer.trim() !== '').length,
    unanswered: 0,
    correct: studentAnswers.filter(a => a.isCorrect === true).length,
    incorrect: studentAnswers.filter(a => a.isCorrect === false).length,
    pendingReview: studentAnswers.filter(a => a.isCorrect === undefined).length
  };

  stats.unanswered = stats.totalQuestions - stats.answered;

  return stats;
};
