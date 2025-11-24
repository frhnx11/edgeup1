import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Question {
  id: string;
  type: 'mcq' | 'short' | 'long';
  question: string;
  marks: number;
  options?: string[];
  answer: string;
}

interface QuestionPaperData {
  subject: string;
  grade: string;
  topic: string;
  totalMarks: string;
  duration: string;
  questions: Question[];
  generatedPaper?: string;
}

/**
 * Add EdgeUp branded header to the PDF
 */
const addBrandedHeader = (doc: jsPDF, paperType: 'question' | 'answer' | 'marking'): number => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // EdgeUp logo/brand section
  doc.setFillColor(9, 77, 136); // #094d88
  doc.rect(0, 0, pageWidth, 35, 'F');

  // EdgeUp text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('EdgeUp', 20, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Empowering Education', 20, 22);

  // Paper type badge
  let badgeText = 'QUESTION PAPER';
  let badgeColor = [59, 130, 246]; // Blue

  if (paperType === 'answer') {
    badgeText = 'ANSWER KEY';
    badgeColor = [16, 185, 129]; // Green
  } else if (paperType === 'marking') {
    badgeText = 'MARKING SCHEME';
    badgeColor = [139, 92, 246]; // Purple
  }

  doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
  const badgeWidth = doc.getTextWidth(badgeText) + 20;
  doc.roundedRect(pageWidth - badgeWidth - 20, 10, badgeWidth, 12, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(badgeText, pageWidth - badgeWidth - 10, 18);

  return 35;
};

/**
 * Add paper metadata section
 */
const addMetadataSection = (doc: jsPDF, data: QuestionPaperData, yPos: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Title section
  doc.setFillColor(247, 250, 252);
  doc.rect(20, yPos, pageWidth - 40, 45, 'F');

  // Main title
  doc.setTextColor(9, 77, 136);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  const title = `${data.subject} - ${data.grade}`;
  doc.text(title, pageWidth / 2, yPos + 12, { align: 'center' });

  // Topic
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(45, 55, 72);
  doc.text(data.topic, pageWidth / 2, yPos + 22, { align: 'center' });

  // Metadata row
  doc.setFontSize(10);
  doc.setTextColor(113, 128, 150);
  const metadataY = yPos + 35;

  doc.text(`Total Marks: ${data.totalMarks}`, 30, metadataY);
  doc.text(`Duration: ${data.duration}`, pageWidth / 2, metadataY, { align: 'center' });
  doc.text(`Questions: ${data.questions.length}`, pageWidth - 30, metadataY, { align: 'right' });

  return yPos + 55;
};

/**
 * Add instructions section
 */
const addInstructions = (doc: jsPDF, yPos: number): number => {
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 77, 136);
  doc.text('Instructions:', 20, yPos);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(45, 55, 72);

  const instructions = [
    '1. Write your Name, Roll Number, and Section in the space provided on the answer sheet.',
    '2. Read each question carefully before answering.',
    '3. All questions are compulsory unless stated otherwise.',
    '4. Write answers in neat and legible handwriting.',
    '5. Marks are indicated against each question.'
  ];

  let currentY = yPos + 8;
  instructions.forEach(instruction => {
    doc.text(instruction, 25, currentY);
    currentY += 6;
  });

  return currentY + 5;
};

/**
 * Generate Question Paper PDF
 */
export const generateQuestionPaperPDF = (data: QuestionPaperData): void => {
  const doc = new jsPDF();

  // Add header
  let yPos = addBrandedHeader(doc, 'question');

  // Add metadata
  yPos = addMetadataSection(doc, data, yPos + 10);

  // Add instructions
  yPos = addInstructions(doc, yPos + 10);

  // Add questions
  yPos += 10;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 77, 136);
  doc.text('Questions:', 20, yPos);
  yPos += 10;

  data.questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage();
      yPos = addBrandedHeader(doc, 'question') + 10;
    }

    // Question number and marks
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 55, 72);
    const questionHeader = `${index + 1}. (${question.marks} ${question.marks === 1 ? 'mark' : 'marks'})`;
    doc.text(questionHeader, 20, yPos);
    yPos += 7;

    // Question text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    const questionLines = doc.splitTextToSize(question.question, 160);
    doc.text(questionLines, 25, yPos);
    yPos += questionLines.length * 6;

    // MCQ Options
    if (question.type === 'mcq' && question.options) {
      yPos += 3;
      question.options.forEach((option, optIndex) => {
        if (yPos > 270) {
          doc.addPage();
          yPos = addBrandedHeader(doc, 'question') + 10;
        }
        const optionLabel = String.fromCharCode(97 + optIndex); // a, b, c, d
        doc.text(`   ${optionLabel}) ${option}`, 30, yPos);
        yPos += 6;
      });
    }

    yPos += 8;
  });

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `QuestionPaper_${data.subject}_${data.grade}_${timestamp}.pdf`;

  doc.save(filename);
};

/**
 * Generate Answer Key PDF
 */
export const generateAnswerKeyPDF = (data: QuestionPaperData): void => {
  const doc = new jsPDF();

  // Add header
  let yPos = addBrandedHeader(doc, 'answer');

  // Add metadata
  yPos = addMetadataSection(doc, data, yPos + 10);

  // Add answers
  yPos += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(16, 185, 129);
  doc.text('Answer Key:', 20, yPos);
  yPos += 10;

  data.questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPos > 240) {
      doc.addPage();
      yPos = addBrandedHeader(doc, 'answer') + 20;
    }

    // Question number
    doc.setFillColor(16, 185, 129);
    doc.roundedRect(20, yPos - 5, 25, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`Q${index + 1}`, 32.5, yPos, { align: 'center' });

    // Question preview (truncated)
    doc.setTextColor(113, 128, 150);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const questionPreview = question.question.length > 80
      ? question.question.substring(0, 80) + '...'
      : question.question;
    doc.text(questionPreview, 50, yPos);
    yPos += 10;

    // Answer label
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text('Answer:', 25, yPos + 6);

    // Answer text
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    doc.setFontSize(9);
    const answerLines = doc.splitTextToSize(question.answer, 160);
    doc.text(answerLines, 25, yPos + 12);

    // Draw answer box with calculated height
    const answerBoxHeight = Math.max(15, answerLines.length * 5 + 10);
    doc.setDrawColor(16, 185, 129);
    doc.setFillColor(247, 250, 252);
    doc.roundedRect(20, yPos, 170, answerBoxHeight, 2, 2, 'S');

    yPos += answerBoxHeight + 12;
  });

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `AnswerKey_${data.subject}_${data.grade}_${timestamp}.pdf`;

  doc.save(filename);
};

/**
 * Generate Marking Scheme PDF
 */
export const generateMarkingSchemePDF = (data: QuestionPaperData): void => {
  const doc = new jsPDF();

  // Add header
  let yPos = addBrandedHeader(doc, 'marking');

  // Add metadata
  yPos = addMetadataSection(doc, data, yPos + 10);

  // Add marking scheme
  yPos += 15;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('Marking Scheme:', 20, yPos);
  yPos += 10;

  data.questions.forEach((question, index) => {
    // Check if we need a new page
    if (yPos > 230) {
      doc.addPage();
      yPos = addBrandedHeader(doc, 'marking') + 20;
    }

    // Question header with marks
    doc.setFillColor(139, 92, 246);
    doc.roundedRect(20, yPos - 5, 30, 8, 2, 2, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text(`Q${index + 1}`, 35, yPos, { align: 'center' });

    // Marks badge
    doc.setFillColor(237, 233, 254);
    doc.roundedRect(170, yPos - 5, 20, 8, 2, 2, 'F');
    doc.setTextColor(139, 92, 246);
    doc.text(`${question.marks}m`, 180, yPos, { align: 'center' });

    // Question preview
    doc.setTextColor(113, 128, 150);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    const questionPreview = question.question.length > 70
      ? question.question.substring(0, 70) + '...'
      : question.question;
    doc.text(questionPreview, 55, yPos);
    yPos += 10;

    // Marking criteria box
    doc.setDrawColor(139, 92, 246);
    doc.setFillColor(250, 249, 254);

    // Marking criteria
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(139, 92, 246);
    doc.text('Marking Criteria:', 25, yPos + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    doc.setFontSize(8);

    let criteriaY = yPos + 11;

    // Generate marking criteria based on marks
    const criteria = [];
    criteria.push(`• Complete and accurate answer: ${question.marks} marks`);

    if (question.marks >= 3) {
      criteria.push(`• Partially correct answer: ${Math.ceil(question.marks / 2)} marks`);
      criteria.push(`• Attempt with relevant points: ${Math.ceil(question.marks / 4)} marks`);
    }

    if (question.type === 'mcq') {
      criteria.push(`• Incorrect answer or no attempt: 0 marks`);
    }

    criteria.forEach(criterion => {
      doc.text(criterion, 30, criteriaY);
      criteriaY += 5;
    });

    const criteriaBoxHeight = criteria.length * 5 + 10;
    doc.roundedRect(20, yPos, 170, criteriaBoxHeight, 2, 2, 'S');

    yPos += criteriaBoxHeight + 12;
  });

  // Add distribution summary
  if (yPos > 200) {
    doc.addPage();
    yPos = addBrandedHeader(doc, 'marking') + 20;
  }

  yPos += 10;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(139, 92, 246);
  doc.text('Marks Distribution Summary:', 20, yPos);
  yPos += 10;

  // Calculate distribution by question type
  const distribution: Record<string, number> = {};
  data.questions.forEach(q => {
    const typeLabel = q.type === 'mcq' ? 'Multiple Choice' : q.type === 'short' ? 'Short Answer' : 'Long Answer';
    distribution[typeLabel] = (distribution[typeLabel] || 0) + q.marks;
  });

  // Create distribution table
  const tableData = Object.entries(distribution).map(([type, marks]) => [
    type,
    marks.toString(),
    `${((marks / parseInt(data.totalMarks)) * 100).toFixed(1)}%`
  ]);

  tableData.push([
    'Total',
    data.totalMarks.toString(),
    '100%'
  ]);

  autoTable(doc, {
    startY: yPos,
    head: [['Question Type', 'Marks', 'Percentage']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [139, 92, 246],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      textColor: [45, 55, 72],
      fontSize: 9
    },
    alternateRowStyles: {
      fillColor: [250, 249, 254]
    },
    margin: { left: 20, right: 20 }
  });

  // Add footer to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addFooter(doc, i, totalPages);
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `MarkingScheme_${data.subject}_${data.grade}_${timestamp}.pdf`;

  doc.save(filename);
};

/**
 * Add branded footer to the page
 */
const addFooter = (doc: jsPDF, pageNum: number, totalPages: number): void => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Footer line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

  // Footer text
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(113, 128, 150);

  // Left: Generated by EdgeUp
  doc.text('Generated with EdgeUp', 20, pageHeight - 12);

  // Center: Date
  const date = new Date().toLocaleDateString('en-IN');
  doc.text(date, pageWidth / 2, pageHeight - 12, { align: 'center' });

  // Right: Page number
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - 20, pageHeight - 12, { align: 'right' });
};
