/**
 * PDF Generator Service
 * Generates assignment PDFs with school branding and answer keys
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Question, Assignment } from '../types/assignment.types';

/**
 * School configuration for PDF branding
 */
const SCHOOL_CONFIG = {
  name: 'EdgeUp School',
  address: 'Tamil Nadu State Board',
  logo: null, // Can add logo URL later
  primaryColor: '#094d88',
  secondaryColor: '#10ac8b'
};

/**
 * Generate student question paper PDF
 */
export const generateQuestionPaperPDF = (
  assignment: Assignment,
  questions: Question[]
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // School Header
  yPosition = addSchoolHeader(doc, yPosition, pageWidth);

  // Assignment Title and Details
  yPosition = addAssignmentDetails(doc, assignment, yPosition, pageWidth);

  // Student Information Section
  yPosition = addStudentInfoSection(doc, yPosition, pageWidth);

  // Instructions
  yPosition = addInstructions(doc, assignment, yPosition, pageWidth);

  // Questions
  addQuestions(doc, questions, yPosition, false); // false = don't show answers

  // Save PDF
  const filename = `${sanitizeFilename(assignment.title)}_Questions.pdf`;
  doc.save(filename);
};

/**
 * Generate teacher answer key PDF
 */
export const generateAnswerKeyPDF = (
  assignment: Assignment,
  questions: Question[]
): void => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // School Header
  yPosition = addSchoolHeader(doc, yPosition, pageWidth);

  // Title
  doc.setFontSize(16);
  doc.setTextColor(200, 0, 0); // Red color for ANSWER KEY
  doc.text('ANSWER KEY - FOR TEACHER USE ONLY', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.text(assignment.title, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;

  // Questions with answers
  addQuestions(doc, questions, yPosition, true); // true = show answers

  // Marking Scheme Summary
  addMarkingScheme(doc, questions);

  // Save PDF
  const filename = `${sanitizeFilename(assignment.title)}_AnswerKey.pdf`;
  doc.save(filename);
};

/**
 * Add school header to PDF
 */
function addSchoolHeader(doc: jsPDF, yPos: number, pageWidth: number): number {
  // School name
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 77, 136); // Primary color
  doc.text(SCHOOL_CONFIG.name, pageWidth / 2, yPos, { align: 'center' });
  yPos += 8;

  // School address/board
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(SCHOOL_CONFIG.address, pageWidth / 2, yPos, { align: 'center' });
  yPos += 5;

  // Horizontal line
  doc.setDrawColor(9, 77, 136);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  doc.setTextColor(0, 0, 0); // Reset to black
  return yPos;
}

/**
 * Add assignment details section
 */
function addAssignmentDetails(doc: jsPDF, assignment: Assignment, yPos: number, pageWidth: number): number {
  // Assignment title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(assignment.title, pageWidth / 2, yPos, { align: 'center' });
  yPos += 10;

  // Details box
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const details = [
    `Subject: ${assignment.subject}`,
    `Class: ${assignment.classGrade}`,
    `Total Marks: ${assignment.totalMarks}`,
    `Duration: ${assignment.duration || 'N/A'} minutes`,
    `Date: ${new Date(assignment.dueDate).toLocaleDateString()}`
  ];

  doc.setFillColor(247, 250, 252);
  doc.rect(20, yPos, pageWidth - 40, 25, 'F');

  yPos += 5;
  details.forEach(detail => {
    doc.text(detail, 25, yPos);
    yPos += 5;
  });

  yPos += 5;
  return yPos;
}

/**
 * Add student information section
 */
function addStudentInfoSection(doc: jsPDF, yPos: number, pageWidth: number): number {
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information:', 20, yPos);
  yPos += 7;

  doc.setFont('helvetica', 'normal');
  const fields = [
    'Name: __________________________________________',
    'Roll No: ________________    Section: ________',
    'Date: __________________'
  ];

  fields.forEach(field => {
    doc.text(field, 20, yPos);
    yPos += 6;
  });

  yPos += 5;
  return yPos;
}

/**
 * Add instructions section
 */
function addInstructions(doc: jsPDF, assignment: Assignment, yPos: number, pageWidth: number): number {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Instructions:', 20, yPos);
  yPos += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');

  const instructions = [
    '1. Read all questions carefully before answering.',
    '2. Write your answers in the spaces provided.',
    '3. Show all your work for numerical/calculation problems.',
    `4. Total marks: ${assignment.totalMarks} | Duration: ${assignment.duration || 'N/A'} minutes`,
    '5. Write neatly and legibly.'
  ];

  instructions.forEach(instruction => {
    doc.text(instruction, 25, yPos);
    yPos += 5;
  });

  yPos += 10;

  // Separator line
  doc.setDrawColor(200, 200, 200);
  doc.line(20, yPos, pageWidth - 20, yPos);
  yPos += 10;

  return yPos;
}

/**
 * Add questions to PDF
 */
function addQuestions(doc: jsPDF, questions: Question[], yPos: number, showAnswers: boolean): void {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxY = pageHeight - 20;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Questions:', margin, yPos);
  yPos += 10;

  questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPos > maxY - 40) {
      doc.addPage();
      yPos = 20;
    }

    // Question number and marks
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const questionHeader = `Q${question.questionNumber}. (${question.marks} mark${question.marks > 1 ? 's' : ''})`;
    doc.text(questionHeader, margin, yPos);
    yPos += 7;

    // Question text
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const questionLines = doc.splitTextToSize(question.text, pageWidth - 2 * margin - 5);
    questionLines.forEach((line: string) => {
      if (yPos > maxY - 10) {
        doc.addPage();
        yPos = 20;
      }
      doc.text(line, margin + 5, yPos);
      yPos += 5;
    });

    yPos += 3;

    // MCQ options
    if (question.type === 'mcq' && question.options) {
      question.options.forEach((option) => {
        if (yPos > maxY - 10) {
          doc.addPage();
          yPos = 20;
        }

        // Highlight correct answer in answer key
        if (showAnswers && option.startsWith(question.correctAnswer + ')')) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(0, 128, 0); // Green
          doc.text(`✓ ${option}`, margin + 10, yPos);
          doc.setTextColor(0, 0, 0);
          doc.setFont('helvetica', 'normal');
        } else {
          doc.text(option, margin + 10, yPos);
        }
        yPos += 5;
      });
      yPos += 3;
    }

    // Show answer for teacher key
    if (showAnswers && question.correctAnswer) {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 100, 0);
      doc.text(`Answer: ${question.correctAnswer}`, margin + 5, yPos);
      doc.setTextColor(0, 0, 0);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
    }

    // Show explanation if available
    if (showAnswers && question.explanation) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(9);
      const explanationLines = doc.splitTextToSize(`Explanation: ${question.explanation}`, pageWidth - 2 * margin - 10);
      explanationLines.forEach((line: string) => {
        if (yPos > maxY - 10) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(line, margin + 5, yPos);
        yPos += 4;
      });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      yPos += 5;
    }

    // Answer space for students (not in answer key)
    if (!showAnswers && question.type !== 'mcq') {
      const lines = question.type === 'long-answer' ? 8 : 4;
      for (let i = 0; i < lines; i++) {
        if (yPos > maxY - 10) {
          doc.addPage();
          yPos = 20;
        }
        doc.setDrawColor(200, 200, 200);
        doc.line(margin + 5, yPos, pageWidth - margin, yPos);
        yPos += 7;
      }
    }

    yPos += 5;
  });
}

/**
 * Add marking scheme summary to answer key
 */
function addMarkingScheme(doc: jsPDF, questions: Question[]): void {
  doc.addPage();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPos = 20;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Marking Scheme Summary', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Create table data
  const tableData = questions.map(q => [
    `Q${q.questionNumber}`,
    q.type.toUpperCase(),
    q.marks.toString(),
    q.correctAnswer || 'Teacher graded'
  ]);

  // Add total row
  const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
  tableData.push(['TOTAL', '', totalMarks.toString(), '']);

  autoTable(doc, {
    startY: yPos,
    head: [['Question', 'Type', 'Marks', 'Answer/Note']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [9, 77, 136] },
    footStyles: { fillColor: [16, 172, 139], fontStyle: 'bold' }
  });
}

/**
 * Sanitize filename for PDF download
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase();
}

/**
 * Generate both PDFs at once
 */
export const generateAssignmentPDFs = (assignment: Assignment, questions: Question[]): void => {
  // Generate student question paper
  generateQuestionPaperPDF(assignment, questions);

  // Small delay to ensure first download starts
  setTimeout(() => {
    // Generate teacher answer key
    generateAnswerKeyPDF(assignment, questions);
  }, 500);
};
