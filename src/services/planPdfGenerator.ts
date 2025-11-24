import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PlanData {
  type: 'lesson' | 'course' | 'sow';
  subject: string;
  grade: string;
  title: string;
  duration: string;
  curriculum: string;
  content: string;
  teacherName?: string;
  schoolName?: string;
}

// Add branding header with EdgeUp logo
const addBrandedHeader = (doc: jsPDF, planData: PlanData) => {
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header background with gradient effect (simulated with rectangles)
  doc.setFillColor(9, 77, 136); // #094d88
  doc.rect(0, 0, pageWidth, 35, 'F');

  // EdgeUp Logo text (since we can't embed actual images easily)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('EdgeUp', 15, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Schools Management Platform', 15, 22);

  // Plan type badge
  const planTypeLabel = planData.type === 'lesson' ? 'LESSON PLAN' :
                        planData.type === 'course' ? 'COURSE PLAN' :
                        'SCHEME OF WORK';

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const textWidth = doc.getTextWidth(planTypeLabel);
  doc.setFillColor(16, 172, 139); // #10ac8b
  doc.roundedRect(pageWidth - textWidth - 25, 12, textWidth + 10, 8, 2, 2, 'F');
  doc.text(planTypeLabel, pageWidth - textWidth - 20, 18);

  // Bottom border line
  doc.setDrawColor(16, 172, 139);
  doc.setLineWidth(1);
  doc.line(0, 35, pageWidth, 35);
};

// Add footer with page numbers and branding
const addBrandedFooter = (doc: jsPDF, pageNumber: number, totalPages: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Footer line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, pageHeight - 20, pageWidth - 15, pageHeight - 20);

  // Footer text
  doc.setTextColor(113, 128, 150);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('Generated with EdgeUp Schools Platform', 15, pageHeight - 12);
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 40, pageHeight - 12);

  // Date generated
  const dateStr = new Date().toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.text(`Generated on: ${dateStr}`, 15, pageHeight - 7);
};

// Add plan metadata section
const addMetadataSection = (doc: jsPDF, planData: PlanData, startY: number): number => {
  let yPos = startY;

  // Title
  doc.setTextColor(26, 32, 44);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(planData.title, 15, yPos);
  yPos += 10;

  // Metadata grid
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const metadata = [
    { label: 'Subject:', value: planData.subject },
    { label: 'Grade:', value: planData.grade },
    { label: 'Duration:', value: planData.duration },
    { label: 'Curriculum:', value: planData.curriculum }
  ];

  metadata.forEach(item => {
    doc.setTextColor(113, 128, 150);
    doc.text(item.label, 15, yPos);
    doc.setTextColor(26, 32, 44);
    doc.setFont('helvetica', 'bold');
    doc.text(item.value, 45, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
  });

  // Teacher and school info if provided
  if (planData.teacherName) {
    doc.setTextColor(113, 128, 150);
    doc.text('Teacher:', 15, yPos);
    doc.setTextColor(26, 32, 44);
    doc.setFont('helvetica', 'bold');
    doc.text(planData.teacherName, 45, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
  }

  if (planData.schoolName) {
    doc.setTextColor(113, 128, 150);
    doc.text('School:', 15, yPos);
    doc.setTextColor(26, 32, 44);
    doc.setFont('helvetica', 'bold');
    doc.text(planData.schoolName, 45, yPos);
    doc.setFont('helvetica', 'normal');
    yPos += 7;
  }

  // Separator line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(15, yPos + 3, doc.internal.pageSize.getWidth() - 15, yPos + 3);

  return yPos + 10;
};

// Add content section with proper formatting
const addContentSection = (doc: jsPDF, content: string, startY: number): number => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = pageWidth - 30;
  let yPos = startY;

  // Split content by lines
  const lines = content.split('\n');

  doc.setTextColor(26, 32, 44);
  doc.setFontSize(10);

  lines.forEach(line => {
    // Check if line is a heading (starts with ##, ###, or is all caps)
    const isMainHeading = line.startsWith('##') || line.startsWith('# ');
    const isSubHeading = line.startsWith('###') || (line === line.toUpperCase() && line.trim().length > 0 && line.trim().length < 50);
    const isBullet = line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*');

    if (isMainHeading) {
      // Main heading styling
      yPos += 8;
      if (yPos > pageHeight - 40) {
        doc.addPage();
        addBrandedHeader(doc, {
          type: 'lesson' as const,
          subject: '',
          grade: '',
          title: '',
          duration: '',
          curriculum: '',
          content: ''
        });
        yPos = 45;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(9, 77, 136);
      const headingText = line.replace(/^#+\s*/, '').trim();
      doc.text(headingText, 15, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setTextColor(26, 32, 44);

    } else if (isSubHeading) {
      // Sub heading styling
      yPos += 6;
      if (yPos > pageHeight - 40) {
        doc.addPage();
        addBrandedHeader(doc, {
          type: 'lesson' as const,
          subject: '',
          grade: '',
          title: '',
          duration: '',
          curriculum: '',
          content: ''
        });
        yPos = 45;
      }

      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 172, 139);
      const subHeadingText = line.replace(/^#+\s*/, '').trim();
      doc.text(subHeadingText, 15, yPos);
      yPos += 6;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(26, 32, 44);

    } else if (isBullet) {
      // Bullet point styling
      if (yPos > pageHeight - 40) {
        doc.addPage();
        addBrandedHeader(doc, {
          type: 'lesson' as const,
          subject: '',
          grade: '',
          title: '',
          duration: '',
          curriculum: '',
          content: ''
        });
        yPos = 45;
      }

      doc.setFont('helvetica', 'normal');
      const bulletText = line.trim().replace(/^[•\-*]\s*/, '');
      const wrappedLines = doc.splitTextToSize('• ' + bulletText, maxWidth - 10);
      wrappedLines.forEach((wrappedLine: string, index: number) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          addBrandedHeader(doc, {
            type: 'lesson' as const,
            subject: '',
            grade: '',
            title: '',
            duration: '',
            curriculum: '',
            content: ''
          });
          yPos = 45;
        }
        doc.text(wrappedLine, index === 0 ? 20 : 25, yPos);
        yPos += 5;
      });

    } else if (line.trim().length > 0) {
      // Regular paragraph text
      if (yPos > pageHeight - 40) {
        doc.addPage();
        addBrandedHeader(doc, {
          type: 'lesson' as const,
          subject: '',
          grade: '',
          title: '',
          duration: '',
          curriculum: '',
          content: ''
        });
        yPos = 45;
      }

      doc.setFont('helvetica', 'normal');
      const wrappedLines = doc.splitTextToSize(line.trim(), maxWidth);
      wrappedLines.forEach((wrappedLine: string) => {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          addBrandedHeader(doc, {
            type: 'lesson' as const,
            subject: '',
            grade: '',
            title: '',
            duration: '',
            curriculum: '',
            content: ''
          });
          yPos = 45;
        }
        doc.text(wrappedLine, 15, yPos);
        yPos += 5;
      });
      yPos += 2; // Extra spacing after paragraphs

    } else {
      // Empty line - add spacing
      yPos += 3;
    }
  });

  return yPos;
};

// Add editable notes section
const addNotesSection = (doc: jsPDF, startY: number) => {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = startY;

  // Check if we need a new page
  if (yPos > pageHeight - 100) {
    doc.addPage();
    addBrandedHeader(doc, {
      type: 'lesson' as const,
      subject: '',
      grade: '',
      title: '',
      duration: '',
      curriculum: '',
      content: ''
    });
    yPos = 45;
  }

  yPos += 15;

  // Notes heading
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(9, 77, 136);
  doc.text('Teacher Notes & Reflections', 15, yPos);
  yPos += 10;

  // Notes area with lines
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);

  const linesCount = 8;
  for (let i = 0; i < linesCount; i++) {
    if (yPos > pageHeight - 30) break;
    doc.line(15, yPos, pageWidth - 15, yPos);
    yPos += 8;
  }

  // Instructions
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(113, 128, 150);
  doc.text('Use this space to add your personal notes, observations, or modifications to the plan.', 15, yPos + 5);
};

// Main function to generate PDF
export const generatePlanPDF = (planData: PlanData): void => {
  const doc = new jsPDF();

  // Add header
  addBrandedHeader(doc, planData);

  // Add metadata section
  let yPos = addMetadataSection(doc, planData, 45);

  // Add content section
  yPos = addContentSection(doc, planData.content, yPos);

  // Add notes section
  addNotesSection(doc, yPos);

  // Add footers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addBrandedFooter(doc, i, totalPages);

    // Add header to pages after the first
    if (i > 1) {
      addBrandedHeader(doc, planData);
    }
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const filename = `${planData.type}_${planData.subject}_${planData.grade}_${timestamp}.pdf`;

  // Save the PDF
  doc.save(filename);
};

export default generatePlanPDF;
