/**
 * Question Parser Service
 * Parses AI-generated assignment content into structured Question objects
 */

import type { Question, QuestionType } from '../types/assignment.types';

/**
 * Parse AI-generated text content into structured questions
 */
export const parseAssignmentContent = (content: string, assignmentType: string): Question[] => {
  const questions: Question[] = [];

  // Split content by question patterns
  const questionBlocks = extractQuestionBlocks(content);

  for (const block of questionBlocks) {
    const question = parseQuestionBlock(block, assignmentType);
    if (question) {
      questions.push(question);
    }
  }

  return questions;
};

/**
 * Extract individual question blocks from content
 */
function extractQuestionBlocks(content: string): string[] {
  const blocks: string[] = [];

  // Pattern to match "Question 1", "Question 2", "Q1", "1.", "1)", etc.
  const questionPattern = /(?:Question\s+\d+|Q\d+|\d+\.|\d+\))/gi;

  const matches = [...content.matchAll(new RegExp(questionPattern.source, 'gi'))];

  if (matches.length === 0) {
    // If no clear question markers, try splitting by double newlines
    return content.split('\n\n').filter(block => block.trim().length > 10);
  }

  for (let i = 0; i < matches.length; i++) {
    const start = matches[i].index!;
    const end = i < matches.length - 1 ? matches[i + 1].index! : content.length;
    const block = content.substring(start, end).trim();
    if (block.length > 5) {
      blocks.push(block);
    }
  }

  return blocks;
}

/**
 * Parse a single question block
 */
function parseQuestionBlock(block: string, assignmentType: string): Question | null {
  try {
    // Extract question number
    const numberMatch = block.match(/(?:Question\s+|Q)?(\d+)/i);
    const questionNumber = numberMatch ? parseInt(numberMatch[1]) : 1;

    // Extract marks
    const marksMatch = block.match(/\((\d+)\s*marks?\)/i);
    const marks = marksMatch ? parseInt(marksMatch[1]) : 1;

    // Determine question type and extract content
    const { type, text, options, correctAnswer } = extractQuestionContent(block, assignmentType);

    return {
      id: `q${questionNumber}`,
      questionNumber,
      text,
      type,
      marks,
      options,
      correctAnswer,
      explanation: extractExplanation(block)
    };
  } catch (error) {
    console.error('Error parsing question block:', error);
    return null;
  }
}

/**
 * Extract question content, type, and options
 */
function extractQuestionContent(block: string, assignmentType: string): {
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer?: string;
} {
  // Check if it's an MCQ (has options A, B, C, D)
  const optionsPattern = /^([A-D][\).\s]+)(.+?)$/gm;
  const optionMatches = [...block.matchAll(optionsPattern)];

  if (optionMatches.length >= 2) {
    // It's an MCQ
    const options = optionMatches.map(match => {
      const letter = match[1].replace(/[\).\s]/g, '');
      const text = match[2].trim();
      return `${letter}) ${text}`;
    });

    // Extract question text (everything before first option)
    const firstOptionIndex = block.indexOf(optionMatches[0][0]);
    let questionText = block.substring(0, firstOptionIndex);

    // Clean up question text
    questionText = questionText
      .replace(/^(?:Question\s+\d+|Q\d+|\d+\.|\d+\))/i, '')
      .replace(/\(\d+\s*marks?\)/i, '')
      .trim();

    // Extract correct answer
    const answerMatch = block.match(/(?:Answer|Correct Answer):\s*([A-D])/i);
    const correctAnswer = answerMatch ? answerMatch[1].toUpperCase() : undefined;

    return {
      type: 'mcq',
      text: questionText,
      options,
      correctAnswer
    };
  }

  // Check for True/False questions
  if (block.match(/(?:True|False)/gi) && block.match(/\?/)) {
    const questionText = block
      .replace(/^(?:Question\s+\d+|Q\d+|\d+\.|\d+\))/i, '')
      .replace(/\(\d+\s*marks?\)/i, '')
      .replace(/(?:Answer|Correct Answer):.*/i, '')
      .trim();

    const answerMatch = block.match(/(?:Answer|Correct Answer):\s*(True|False)/i);
    const correctAnswer = answerMatch ? answerMatch[1] : undefined;

    return {
      type: 'true-false',
      text: questionText,
      options: ['True', 'False'],
      correctAnswer
    };
  }

  // Determine type based on assignment type and content length
  let questionText = block
    .replace(/^(?:Question\s+\d+|Q\d+|\d+\.|\d+\))/i, '')
    .replace(/\(\d+\s*marks?\)/i, '')
    .replace(/(?:Expected Answer|Answer|Solution):.*/is, '')
    .trim();

  // Check if it's a numerical question
  if (block.match(/calculate|find|solve|compute/i) && assignmentType === 'Homework') {
    return {
      type: 'numerical',
      text: questionText
    };
  }

  // Determine if short or long answer based on complexity
  const wordCount = questionText.split(/\s+/).length;
  const type: QuestionType = wordCount > 15 || block.match(/explain|describe|discuss|analyze/i)
    ? 'long-answer'
    : 'short-answer';

  return {
    type,
    text: questionText
  };
}

/**
 * Extract explanation/solution from question block
 */
function extractExplanation(block: string): string | undefined {
  const explanationMatch = block.match(/(?:Expected Answer|Answer|Solution|Explanation):\s*(.+?)(?=\n\n|$)/is);
  return explanationMatch ? explanationMatch[1].trim() : undefined;
}

/**
 * Validate parsed questions
 */
export const validateQuestions = (questions: Question[]): {
  valid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];

  if (questions.length === 0) {
    errors.push('No questions were parsed from the content');
  }

  questions.forEach((q, index) => {
    if (!q.text || q.text.length < 5) {
      errors.push(`Question ${index + 1}: Question text is too short or missing`);
    }

    if (q.type === 'mcq') {
      if (!q.options || q.options.length < 2) {
        errors.push(`Question ${index + 1}: MCQ must have at least 2 options`);
      }
      if (!q.correctAnswer) {
        errors.push(`Question ${index + 1}: MCQ missing correct answer`);
      }
    }

    if (q.marks <= 0) {
      errors.push(`Question ${index + 1}: Invalid marks value`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Calculate total marks from questions
 */
export const calculateTotalMarks = (questions: Question[]): number => {
  return questions.reduce((sum, q) => sum + q.marks, 0);
};

/**
 * Get question statistics
 */
export const getQuestionStats = (questions: Question[]) => {
  const stats = {
    total: questions.length,
    byType: {
      mcq: 0,
      'short-answer': 0,
      'long-answer': 0,
      numerical: 0,
      'true-false': 0
    },
    totalMarks: 0,
    autoGradable: 0
  };

  questions.forEach(q => {
    stats.byType[q.type]++;
    stats.totalMarks += q.marks;
    if (q.type === 'mcq' || q.type === 'true-false') {
      stats.autoGradable++;
    }
  });

  return stats;
};
