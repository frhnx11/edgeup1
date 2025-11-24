/**
 * Submission Service
 * Handles student assignment submissions and grading
 */

import type { Assignment, AssignmentSubmission, StudentAnswer, Question } from '../types/assignment.types';
import { gradeAssignment } from '../utils/autoGrading';

// LocalStorage keys
const SUBMISSIONS_KEY = 'assignment_submissions';
const DRAFT_ANSWERS_KEY = 'draft_answers_';

/**
 * Save draft answers (auto-save while student is working)
 */
export const saveDraftAnswers = (assignmentId: string, answers: StudentAnswer[]): void => {
  try {
    const key = `${DRAFT_ANSWERS_KEY}${assignmentId}`;
    localStorage.setItem(key, JSON.stringify(answers));
  } catch (error) {
    console.error('Error saving draft answers:', error);
  }
};

/**
 * Load draft answers
 */
export const loadDraftAnswers = (assignmentId: string): StudentAnswer[] | null => {
  try {
    const key = `${DRAFT_ANSWERS_KEY}${assignmentId}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading draft answers:', error);
    return null;
  }
};

/**
 * Clear draft answers (after submission)
 */
export const clearDraftAnswers = (assignmentId: string): void => {
  try {
    const key = `${DRAFT_ANSWERS_KEY}${assignmentId}`;
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error clearing draft answers:', error);
  }
};

/**
 * Submit assignment
 */
export const submitAssignment = (
  assignment: Assignment,
  studentId: string,
  studentName: string,
  answers: StudentAnswer[]
): AssignmentSubmission => {
  // Auto-grade if questions are available
  let gradedAnswers = answers;
  let totalScore: number | undefined = undefined;

  if (assignment.questions && assignment.questions.length > 0) {
    const gradingResult = gradeAssignment(assignment.questions, answers);
    gradedAnswers = gradingResult.gradedAnswers;

    // Only set total score if all questions are auto-graded
    if (gradingResult.pendingReviewCount === 0) {
      totalScore = gradingResult.totalScore;
    }
  }

  // Create submission
  const submission: AssignmentSubmission = {
    id: `sub_${Date.now()}_${studentId}`,
    assignmentId: assignment.id,
    studentId,
    studentName,
    submittedAt: new Date().toISOString(),
    status: totalScore !== undefined ? 'graded' : 'submitted',
    answers: gradedAnswers,
    totalScore,
    gradedAt: totalScore !== undefined ? new Date().toISOString() : undefined,
    gradedBy: totalScore !== undefined ? 'Auto-graded' : undefined
  };

  // Save submission
  saveSubmission(submission);

  // Clear draft
  clearDraftAnswers(assignment.id);

  return submission;
};

/**
 * Save submission to storage
 */
function saveSubmission(submission: AssignmentSubmission): void {
  try {
    const submissions = getAllSubmissions();
    submissions.push(submission);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
  } catch (error) {
    console.error('Error saving submission:', error);
  }
}

/**
 * Get all submissions
 */
export const getAllSubmissions = (): AssignmentSubmission[] => {
  try {
    const data = localStorage.getItem(SUBMISSIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading submissions:', error);
    return [];
  }
};

/**
 * Get submissions for a specific assignment
 */
export const getSubmissionsByAssignment = (assignmentId: string): AssignmentSubmission[] => {
  const allSubmissions = getAllSubmissions();
  return allSubmissions.filter(sub => sub.assignmentId === assignmentId);
};

/**
 * Get submission for a specific student and assignment
 */
export const getStudentSubmission = (assignmentId: string, studentId: string): AssignmentSubmission | null => {
  const submissions = getSubmissionsByAssignment(assignmentId);
  return submissions.find(sub => sub.studentId === studentId) || null;
};

/**
 * Check if student has submitted an assignment
 */
export const hasSubmitted = (assignmentId: string, studentId: string): boolean => {
  return getStudentSubmission(assignmentId, studentId) !== null;
};

/**
 * Update submission (for teacher grading)
 */
export const updateSubmission = (submissionId: string, updates: Partial<AssignmentSubmission>): void => {
  try {
    const submissions = getAllSubmissions();
    const index = submissions.findIndex(sub => sub.id === submissionId);

    if (index !== -1) {
      submissions[index] = {
        ...submissions[index],
        ...updates,
        gradedAt: new Date().toISOString()
      };
      localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
    }
  } catch (error) {
    console.error('Error updating submission:', error);
  }
};

/**
 * Grade a single answer (for teacher manual grading)
 */
export const gradeStudentAnswer = (
  submissionId: string,
  questionId: string,
  marksAwarded: number,
  feedback?: string
): void => {
  try {
    const submissions = getAllSubmissions();
    const submission = submissions.find(sub => sub.id === submissionId);

    if (submission) {
      const answerIndex = submission.answers.findIndex(ans => ans.questionId === questionId);

      if (answerIndex !== -1) {
        submission.answers[answerIndex].marksAwarded = marksAwarded;
        if (feedback) {
          submission.answers[answerIndex].feedback = feedback;
        }

        // Recalculate total score
        submission.totalScore = submission.answers.reduce(
          (sum, ans) => sum + (ans.marksAwarded || 0),
          0
        );

        submission.status = 'graded';
        submission.gradedAt = new Date().toISOString();

        localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(submissions));
      }
    }
  } catch (error) {
    console.error('Error grading answer:', error);
  }
};

/**
 * Get submission statistics for teacher
 */
export const getSubmissionStatistics = (assignmentId: string) => {
  const submissions = getSubmissionsByAssignment(assignmentId);

  const stats = {
    total: submissions.length,
    graded: submissions.filter(sub => sub.status === 'graded').length,
    pending: submissions.filter(sub => sub.status === 'submitted').length,
    averageScore: 0,
    highestScore: 0,
    lowestScore: 0
  };

  const scores = submissions
    .filter(sub => sub.totalScore !== undefined)
    .map(sub => sub.totalScore as number);

  if (scores.length > 0) {
    stats.averageScore = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    stats.highestScore = Math.max(...scores);
    stats.lowestScore = Math.min(...scores);
  }

  return stats;
};

/**
 * Delete a submission
 */
export const deleteSubmission = (submissionId: string): void => {
  try {
    const submissions = getAllSubmissions();
    const filtered = submissions.filter(sub => sub.id !== submissionId);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting submission:', error);
  }
};

/**
 * Get student's assignment history
 */
export const getStudentAssignmentHistory = (studentId: string): AssignmentSubmission[] => {
  const allSubmissions = getAllSubmissions();
  return allSubmissions.filter(sub => sub.studentId === studentId);
};
