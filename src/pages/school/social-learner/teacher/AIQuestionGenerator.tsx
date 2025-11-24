import { useState } from 'react';
import { callOpenAI } from '../../../../services/openai';
import jsPDF from 'jspdf';

interface FormData {
  subject: string;
  grade: string;
  topic: string;
  totalMarks: string;
  duration: string;
  questionTypes: {
    mcq: boolean;
    shortAnswer: boolean;
    longAnswer: boolean;
  };
  difficulty: string;
}

interface AIQuestionGeneratorProps {
  onBack: () => void;
}

const AIQuestionGenerator = ({ onBack }: AIQuestionGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);
  const [generatedAnswerKey, setGeneratedAnswerKey] = useState<string | null>(null);
  const [generatedMarkingScheme, setGeneratedMarkingScheme] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);
  const [isGeneratingAnswerKey, setIsGeneratingAnswerKey] = useState(false);
  const [isGeneratingMarkingScheme, setIsGeneratingMarkingScheme] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    subject: '',
    grade: '10th Standard',
    topic: '',
    totalMarks: '100',
    duration: '3 hours',
    questionTypes: {
      mcq: true,
      shortAnswer: true,
      longAnswer: true
    },
    difficulty: 'balanced'
  });

  // TN Board 10th Standard subjects
  const subjects = ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'];
  const totalMarksOptions = ['50', '75', '100'];
  const durationOptions = ['2 hours', '2.5 hours', '3 hours', '3.5 hours'];
  const difficultyOptions = [
    { value: 'easy', label: 'Easy (70% Easy, 20% Medium, 10% Hard)' },
    { value: 'balanced', label: 'Balanced (30% Easy, 50% Medium, 20% Hard)' },
    { value: 'challenging', label: 'Challenging (20% Easy, 40% Medium, 40% Hard)' }
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);

    try {
      const selectedTypes = [];
      if (formData.questionTypes.mcq) selectedTypes.push('Multiple Choice Questions (MCQ)');
      if (formData.questionTypes.shortAnswer) selectedTypes.push('Short Answer Questions');
      if (formData.questionTypes.longAnswer) selectedTypes.push('Long Answer Questions');

      const prompt = `Create a complete question paper for Tamil Nadu State Board 10th Standard examination:

Subject: ${formData.subject}
Grade: ${formData.grade}
Topic: ${formData.topic}
Total Marks: ${formData.totalMarks}
Duration: ${formData.duration}
Question Types to Include: ${selectedTypes.join(', ')}
Difficulty Level: ${formData.difficulty}

Please structure the question paper following TN Board examination pattern:

## QUESTION PAPER HEADER
[School Name]
${formData.subject} - ${formData.grade}
Time: ${formData.duration}                    Maximum Marks: ${formData.totalMarks}

## GENERAL INSTRUCTIONS
1. All questions are compulsory
2. Read questions carefully before answering
3. Marks are indicated against each question
4. Write answers in neat handwriting

## SECTION-WISE BREAKDOWN
${formData.questionTypes.mcq ? `
### Section A: Multiple Choice Questions (1 mark each)
- 10-15 MCQ questions covering all units
- Four options (a, b, c, d) for each question
- Test basic concepts and definitions
` : ''}

${formData.questionTypes.shortAnswer ? `
### Section B: Short Answer Questions (3-5 marks each)
- 6-8 questions requiring brief explanations
- Test understanding and application
- Include diagrams where applicable
` : ''}

${formData.questionTypes.longAnswer ? `
### Section C: Long Answer Questions (8-10 marks each)
- 4-5 questions requiring detailed answers
- Test in-depth knowledge and problem-solving
- Include real-world applications
` : ''}

Important Guidelines:
- Align all questions with TN Board ${formData.subject} syllabus for 10th Standard
- Ensure questions cover different units/chapters
- Include variety in question difficulty as per selected level
- Format questions professionally with clear numbering
- Ensure total marks add up to ${formData.totalMarks}
- Make questions relevant to ${formData.topic}

Generate the complete question paper with proper formatting, section headers, and clear instructions.`;

      const systemPrompt = `You are an expert question paper creator specializing in Tamil Nadu State Board (TN Board) 10th Standard examinations. Create professional, exam-ready question papers that:
- Follow TN Board examination patterns and marking schemes
- Include proper formatting with sections and subsections
- Ensure questions test different cognitive levels (Knowledge, Understanding, Application, Analysis)
- Are grammatically correct and unambiguous
- Include proper mark distribution
- Cover the complete syllabus comprehensively

Your question papers should be ready to print and use for actual examinations.`;

      const aiGeneratedPaper = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.7,
        max_tokens: 3000
      });

      setIsGenerating(false);
      setGeneratedPaper(aiGeneratedPaper);
    } catch (error) {
      setIsGenerating(false);
      console.error('Error generating question paper:', error);
      setGeneratedPaper('Error generating question paper. Please try again.');
    }
  };

  const handleDownloadPDF = () => {
    if (!generatedPaper) return;

    // Check if trying to download answer key or marking scheme that hasn't been generated yet
    if (showAnswerKey && !generatedAnswerKey) {
      alert('Please generate the answer key first by clicking the Answer Key button.');
      return;
    }
    if (showMarkingScheme && !generatedMarkingScheme) {
      alert('Please generate the marking scheme first by clicking the Marking Scheme button.');
      return;
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add EdgeUp branded header
    doc.setFillColor(9, 77, 136); // #094d88
    doc.rect(0, 0, pageWidth, 35, 'F');

    // EdgeUp logo text
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('EdgeUp', 20, 15);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Empowering Education', 20, 22);

    // Paper type badge - different colors for different types
    let badgeColor = [59, 130, 246]; // Blue for question paper
    if (showAnswerKey) badgeColor = [16, 185, 129]; // Green for answer key
    if (showMarkingScheme) badgeColor = [139, 92, 246]; // Purple for marking scheme

    doc.setFillColor(badgeColor[0], badgeColor[1], badgeColor[2]);
    const badgeText = showAnswerKey ? 'ANSWER KEY' : showMarkingScheme ? 'MARKING SCHEME' : 'QUESTION PAPER';
    const badgeWidth = doc.getTextWidth(badgeText) + 20;
    doc.roundedRect(pageWidth - badgeWidth - 20, 10, badgeWidth, 12, 3, 3, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(badgeText, pageWidth - badgeWidth - 10, 18);

    // Content section
    let yPos = 45;

    // Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(9, 77, 136);
    doc.text(`${formData.subject} - ${formData.grade}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 10;

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);
    doc.text(formData.topic, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Metadata
    doc.setFontSize(9);
    doc.setTextColor(113, 128, 150);
    doc.text(`Total Marks: ${formData.totalMarks}`, 20, yPos);
    doc.text(`Duration: ${formData.duration}`, pageWidth / 2, yPos, { align: 'center' });
    yPos += 15;

    // Content - use the appropriate content based on view
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(45, 55, 72);

    const content = showAnswerKey ? generatedAnswerKey : showMarkingScheme ? generatedMarkingScheme : generatedPaper;
    const lines = (content || '').split('\n');

    lines.forEach(line => {
      // Check if we need a new page
      if (yPos > pageHeight - 30) {
        doc.addPage();
        // Add header on new page
        doc.setFillColor(9, 77, 136);
        doc.rect(0, 0, pageWidth, 20, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('EdgeUp', 20, 13);
        yPos = 30;
        doc.setTextColor(45, 55, 72);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
      }

      // Handle different line types
      if (line.startsWith('##')) {
        // Section header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(9, 77, 136);
        const textLines = doc.splitTextToSize(line.replace(/^##\s*/, ''), 170);
        doc.text(textLines, 20, yPos);
        yPos += textLines.length * 7 + 5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(45, 55, 72);
      } else if (line.startsWith('###')) {
        // Subsection header
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(16, 172, 139);
        const textLines = doc.splitTextToSize(line.replace(/^###\s*/, ''), 170);
        doc.text(textLines, 20, yPos);
        yPos += textLines.length * 6 + 3;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(45, 55, 72);
      } else if (line.trim()) {
        // Regular text
        const textLines = doc.splitTextToSize(line, 170);
        doc.text(textLines, 20, yPos);
        yPos += textLines.length * 6 + 2;
      } else {
        // Empty line
        yPos += 5;
      }
    });

    // Add footer to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.5);
      doc.line(20, pageHeight - 20, pageWidth - 20, pageHeight - 20);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(113, 128, 150);

      doc.text('Generated with EdgeUp', 20, pageHeight - 12);
      const date = new Date().toLocaleDateString('en-IN');
      doc.text(date, pageWidth / 2, pageHeight - 12, { align: 'center' });
      doc.text(`Page ${i} of ${totalPages}`, pageWidth - 20, pageHeight - 12, { align: 'right' });
    }

    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const docType = showAnswerKey ? 'AnswerKey' : showMarkingScheme ? 'MarkingScheme' : 'QuestionPaper';
    const filename = `${docType}_${formData.subject}_${formData.grade}_${timestamp}.pdf`;

    doc.save(filename);
  };

  const handleGenerateAnswerKey = async () => {
    if (!generatedPaper || generatedAnswerKey) return;

    setIsGeneratingAnswerKey(true);
    setShowAnswerKey(true);
    setShowMarkingScheme(false);

    try {
      const prompt = `Based on this question paper, generate a complete answer key with detailed answers for all questions:

${generatedPaper}

Provide:
1. Clear, accurate answers for each question
2. For MCQs, provide the correct option (a/b/c/d) with brief explanation
3. For short answers, provide concise 3-5 line answers
4. For long answers, provide detailed comprehensive answers

Format the answer key clearly with question numbers and organized sections.`;

      const systemPrompt = `You are an expert teacher creating answer keys for TN Board 10th Standard examinations. Provide accurate, comprehensive answers that would help students understand the concepts.`;

      const answerKey = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.7,
        max_tokens: 3000
      });

      setGeneratedAnswerKey(answerKey);
    } catch (error) {
      console.error('Error generating answer key:', error);
      alert('Error generating answer key. Please try again.');
      // Switch back to question paper view on error
      setShowAnswerKey(false);
    } finally {
      setIsGeneratingAnswerKey(false);
    }
  };

  const handleGenerateMarkingScheme = async () => {
    if (!generatedPaper || generatedMarkingScheme) return;

    setIsGeneratingMarkingScheme(true);
    setShowMarkingScheme(true);
    setShowAnswerKey(false);

    try {
      const prompt = `Based on this question paper, generate a detailed marking scheme:

${generatedPaper}

Provide:
1. Marks breakdown for each question
2. Marking criteria (what earns full marks, partial marks, etc.)
3. Key points that must be included for full credit
4. Common mistakes to watch for
5. Distribution summary by question type

Format the marking scheme professionally for teacher use.`;

      const systemPrompt = `You are an expert examiner creating marking schemes for TN Board 10th Standard examinations. Provide clear, fair marking criteria that ensures consistent evaluation.`;

      const markingScheme = await callOpenAI(prompt, systemPrompt, {
        temperature: 0.7,
        max_tokens: 3000
      });

      setGeneratedMarkingScheme(markingScheme);
    } catch (error) {
      console.error('Error generating marking scheme:', error);
      alert('Error generating marking scheme. Please try again.');
      // Switch back to question paper view on error
      setShowMarkingScheme(false);
    } finally {
      setIsGeneratingMarkingScheme(false);
    }
  };

  // Results Page
  if (generatedPaper) {
    return (
      <div>
        <button
          onClick={() => {
            setGeneratedPaper(null);
            setShowAnswerKey(false);
            setShowMarkingScheme(false);
          }}
          className="sign-in-btn"
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#3b82f6',
            border: '2px solid #3b82f6'
          }}
        >
          <i className="fas fa-arrow-left"></i> Generate Another Paper
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '3rem' }}>
            {/* Paper Header */}
            <div style={{
              background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
              margin: '-3rem -3rem 2.5rem',
              padding: '2.5rem 3rem',
              color: 'white'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <i className="fas fa-file-alt" style={{ fontSize: '1.75rem' }}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '2rem', fontWeight: 700 }}>{formData.subject} - Question Paper</h1>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', opacity: 0.95 }}>
                    <span><i className="fas fa-school"></i> {formData.grade}</span>
                    <span><i className="fas fa-clock"></i> {formData.duration}</span>
                    <span><i className="fas fa-calculator"></i> {formData.totalMarks} Marks</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Card Style */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1rem',
              marginBottom: '3rem'
            }}>
              {[
                { icon: 'file-alt', label: 'Question Paper', color: '#3b82f6', active: !showAnswerKey && !showMarkingScheme, onClick: () => { setShowAnswerKey(false); setShowMarkingScheme(false); } },
                { icon: 'key', label: 'Answer Key', color: '#10b981', active: showAnswerKey, onClick: () => { if (!generatedAnswerKey) { handleGenerateAnswerKey(); } else { setShowAnswerKey(true); setShowMarkingScheme(false); } } },
                { icon: 'clipboard-check', label: 'Marking Scheme', color: '#8b5cf6', active: showMarkingScheme, onClick: () => { if (!generatedMarkingScheme) { handleGenerateMarkingScheme(); } else { setShowAnswerKey(false); setShowMarkingScheme(true); } } },
                { icon: 'download', label: 'Download PDF', color: '#094d88', onClick: handleDownloadPDF },
                { icon: 'sync-alt', label: 'Regenerate', color: '#10ac8b', onClick: handleGenerate }
              ].map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  style={{
                    background: action.active ? `${action.color}15` : 'white',
                    border: `2px solid ${action.active ? action.color : '#e2e8f0'}`,
                    borderRadius: '12px',
                    padding: '1.5rem 1rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: action.active ? `0 4px 12px ${action.color}30` : '0 2px 8px rgba(0,0,0,0.05)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 8px 20px ${action.color}30`;
                    e.currentTarget.style.borderColor = action.color;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = action.active ? `0 4px 12px ${action.color}30` : '0 2px 8px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = action.active ? action.color : '#e2e8f0';
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: `${action.color}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className={`fas fa-${action.icon}`} style={{
                      fontSize: '1.5rem',
                      color: action.color
                    }}></i>
                  </div>
                  <span style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: '#2d3748',
                    textAlign: 'center'
                  }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Content Display */}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', color: '#2d3748', fontSize: '1rem' }}>
              {!showAnswerKey && !showMarkingScheme && generatedPaper}
              {showAnswerKey && (
                <div>
                  <div style={{
                    background: '#d1fae5',
                    border: '2px solid #10b981',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    <h2 style={{ margin: '0 0 0.5rem 0', color: '#10b981', fontSize: '1.5rem', fontWeight: 700 }}>
                      <i className="fas fa-key" style={{ marginRight: '0.75rem' }}></i>
                      Answer Key
                    </h2>
                    <p style={{ margin: 0, color: '#059669', fontSize: '0.95rem' }}>
                      Comprehensive answers for all questions
                    </p>
                  </div>
                  {isGeneratingAnswerKey ? (
                    <div style={{
                      padding: '3rem',
                      textAlign: 'center',
                      background: '#f7fafc',
                      borderRadius: '12px',
                      border: '2px dashed #10b981'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #d1fae5',
                        borderTopColor: '#10b981',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                      }}></div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981' }}>
                        Generating Answer Key with AI...
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                        This may take a few moments
                      </div>
                    </div>
                  ) : generatedAnswerKey ? (
                    <div>{generatedAnswerKey}</div>
                  ) : null}
                </div>
              )}
              {showMarkingScheme && (
                <div>
                  <div style={{
                    background: '#ede9fe',
                    border: '2px solid #8b5cf6',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    marginBottom: '2rem'
                  }}>
                    <h2 style={{ margin: '0 0 0.5rem 0', color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>
                      <i className="fas fa-clipboard-check" style={{ marginRight: '0.75rem' }}></i>
                      Marking Scheme
                    </h2>
                    <p style={{ margin: 0, color: '#6b21a8', fontSize: '0.95rem' }}>
                      Detailed marking criteria and point distribution
                    </p>
                  </div>
                  {isGeneratingMarkingScheme ? (
                    <div style={{
                      padding: '3rem',
                      textAlign: 'center',
                      background: '#f7fafc',
                      borderRadius: '12px',
                      border: '2px dashed #8b5cf6'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #ede9fe',
                        borderTopColor: '#8b5cf6',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                      }}></div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#8b5cf6' }}>
                        Generating Marking Scheme with AI...
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#718096', marginTop: '0.5rem' }}>
                        This may take a few moments
                      </div>
                    </div>
                  ) : generatedMarkingScheme ? (
                    <div>{generatedMarkingScheme}</div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Form Page
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateX(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Generator Options
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <i className="fas fa-magic" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              AI Question Generator
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Generate TN Board 10th Standard question papers with AI
            </p>
          </div>
        </div>
      </div>

      {/* Form Card */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '3rem',
        marginBottom: '2rem'
      }}>
        {/* Form Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div style={{
            width: '70px',
            height: '70px',
            margin: '0 auto 1.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)'
          }}>
            <i className="fas fa-magic" style={{ fontSize: '2rem', color: 'white' }}></i>
          </div>
          <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
            Question Paper Details
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
            Fill in the details and let AI generate your question paper
          </p>
        </div>

        {/* Form Fields */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
          {/* Subject */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
              Subject <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-book" style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#3b82f6',
                fontSize: '1.1rem'
              }}></i>
              <select
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#2d3748',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <option value="">Select subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Topic */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
              Topic/Chapter <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-lightbulb" style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#3b82f6',
                fontSize: '1.1rem'
              }}></i>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g., Quadratic Equations"
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#2d3748',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Total Marks */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
              Total Marks <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-calculator" style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#3b82f6',
                fontSize: '1.1rem'
              }}></i>
              <select
                value={formData.totalMarks}
                onChange={(e) => setFormData({ ...formData, totalMarks: e.target.value })}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#2d3748',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {totalMarksOptions.map(marks => (
                  <option key={marks} value={marks}>{marks} Marks</option>
                ))}
              </select>
            </div>
          </div>

          {/* Duration */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
              Duration <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-clock" style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#3b82f6',
                fontSize: '1.1rem'
              }}></i>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#2d3748',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Question Types */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
              Question Types to Include <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {[
                { key: 'mcq', label: 'Multiple Choice Questions', icon: 'check-circle' },
                { key: 'shortAnswer', label: 'Short Answer Questions', icon: 'align-left' },
                { key: 'longAnswer', label: 'Long Answer Questions', icon: 'align-justify' }
              ].map((type) => (
                <div
                  key={type.key}
                  onClick={() => setFormData({
                    ...formData,
                    questionTypes: { ...formData.questionTypes, [type.key]: !formData.questionTypes[type.key as keyof typeof formData.questionTypes] }
                  })}
                  style={{
                    padding: '1rem',
                    border: `2px solid ${formData.questionTypes[type.key as keyof typeof formData.questionTypes] ? '#3b82f6' : '#e2e8f0'}`,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: formData.questionTypes[type.key as keyof typeof formData.questionTypes] ? '#3b82f615' : 'white',
                    textAlign: 'center'
                  }}
                >
                  <i className={`fas fa-${type.icon}`} style={{
                    fontSize: '1.5rem',
                    color: formData.questionTypes[type.key as keyof typeof formData.questionTypes] ? '#3b82f6' : '#cbd5e0',
                    marginBottom: '0.5rem'
                  }}></i>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: formData.questionTypes[type.key as keyof typeof formData.questionTypes] ? '#3b82f6' : '#718096'
                  }}>
                    {type.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty Level */}
          <div style={{ gridColumn: 'span 2' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
              Difficulty Level <span style={{ color: '#dc3545' }}>*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <i className="fas fa-chart-bar" style={{
                position: 'absolute',
                left: '1.25rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#3b82f6',
                fontSize: '1.1rem'
              }}></i>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                style={{
                  width: '100%',
                  padding: '1rem 1rem 1rem 3.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#2d3748',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none',
                  transition: 'all 0.2s',
                  fontWeight: 500
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {difficultyOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div style={{ marginTop: '3rem', textAlign: 'center' }}>
          {isGenerating ? (
            <div style={{
              padding: '2rem',
              background: '#f7fafc',
              borderRadius: '12px',
              border: '2px dashed #3b82f6',
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem',
              minWidth: '400px'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                border: '4px solid #dbeafe',
                borderTopColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3b82f6', marginBottom: '0.5rem' }}>
                  Generating Your Question Paper
                </div>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                  This may take 30-60 seconds...
                </div>
              </div>
              <style>{`
                @keyframes spin {
                  to { transform: rotate(360deg); }
                }
              `}</style>
            </div>
          ) : (
            <button
              onClick={handleGenerate}
              disabled={!formData.subject || !formData.topic}
              className="sign-in-btn"
              style={{
                padding: '1.25rem 3rem',
                fontSize: '1.1rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: (!formData.subject || !formData.topic)
                  ? '#e2e8f0'
                  : 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: (!formData.subject || !formData.topic)
                  ? 'none'
                  : '0 8px 25px rgba(59, 130, 246, 0.4)',
                opacity: (!formData.subject || !formData.topic) ? 0.5 : 1,
                cursor: (!formData.subject || !formData.topic) ? 'not-allowed' : 'pointer',
                border: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem'
              }}
              onMouseEnter={(e) => {
                if (formData.subject && formData.topic) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(59, 130, 246, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
              }}
            >
              <i className="fas fa-magic"></i>
              <span>Generate Question Paper with AI</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIQuestionGenerator;
