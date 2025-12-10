import { useState } from 'react';

interface QuestionType {
  type: 'mcq' | 'short' | 'long' | 'truefalse' | 'fillblanks' | 'matching';
  label: string;
  enabled: boolean;
  quantity: number;
  marksPerQuestion: number;
}

interface FormData {
  mode: 'quick' | 'advanced';
  course: string;
  subject: string;
  topic: string;
  subtopic: string;
  totalMarks: number;
  duration: number;
  quickModeQuestions?: number;
  quickModeMarksPerQuestion?: number;
  questionTypes: QuestionType[];
  difficultyEasy: number;
  difficultyMedium: number;
  difficultyHard: number;
  specialInstructions: string;
  includeDiagrams: boolean;
  includePracticals: boolean;
  negativeMarking: boolean;
}

interface QuestionPaperGeneratorProps {
  onBack?: () => void;
}

const QuestionGenerator = ({ onBack }: QuestionPaperGeneratorProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedPaper, setGeneratedPaper] = useState<string | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);
  const [showDistributionTable, setShowDistributionTable] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    mode: 'quick',
    course: '',
    subject: '',
    topic: '',
    subtopic: '',
    totalMarks: 100,
    duration: 180,
    quickModeQuestions: 20,
    quickModeMarksPerQuestion: 5,
    questionTypes: [
      { type: 'mcq', label: 'Multiple Choice Questions (MCQ)', enabled: true, quantity: 10, marksPerQuestion: 1 },
      { type: 'short', label: 'Short Answer Questions', enabled: true, quantity: 6, marksPerQuestion: 5 },
      { type: 'long', label: 'Long Answer Questions', enabled: true, quantity: 4, marksPerQuestion: 10 },
      { type: 'truefalse', label: 'True/False', enabled: false, quantity: 5, marksPerQuestion: 1 },
      { type: 'fillblanks', label: 'Fill in the Blanks', enabled: false, quantity: 5, marksPerQuestion: 1 },
      { type: 'matching', label: 'Match the Following', enabled: false, quantity: 1, marksPerQuestion: 5 }
    ],
    difficultyEasy: 30,
    difficultyMedium: 50,
    difficultyHard: 20,
    specialInstructions: '',
    includeDiagrams: false,
    includePracticals: false,
    negativeMarking: false
  });

  const courses = ['UPSC Prelims', 'UPSC Mains', 'State PCS', 'UPSC CAPF', 'UPSC CDS', 'SSC CGL', 'SSC CHSL', 'Railway Exams', 'Banking Exams', 'Defence Exams'];
  const subjects = ['General Studies Paper 1', 'General Studies Paper 2', 'General Studies Paper 3', 'General Studies Paper 4 (Ethics)', 'CSAT (Prelims Paper 2)', 'Essay Writing', 'Current Affairs', 'Optional - History', 'Optional - Geography', 'Optional - Public Administration', 'Optional - Political Science', 'Optional - Sociology'];
  const subtopics = ['Indian History', 'World History', 'Art & Culture', 'Geography', 'Indian Polity', 'Indian Economy', 'Environment & Ecology', 'Science & Technology', 'Current Affairs', 'International Relations', 'Ethics & Integrity', 'Social Issues'];

  const calculateTotalMarks = () => {
    return formData.questionTypes
      .filter(qt => qt.enabled)
      .reduce((sum, qt) => sum + (qt.quantity * qt.marksPerQuestion), 0);
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // Validate fields before proceeding
      if (!formData.quickModeQuestions || formData.quickModeQuestions < 1) {
        alert('Please enter the number of questions (minimum 1)');
        return;
      }
      if (!formData.quickModeMarksPerQuestion || formData.quickModeMarksPerQuestion < 1) {
        alert('Please enter marks per question (minimum 1)');
        return;
      }
      setCurrentStep(4); // Skip to review
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep === 4) {
      setCurrentStep(1); // Go back to step 1 from review
    } else {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    setIsGenerating(true);
    const statuses = [
      'Analyzing curriculum requirements...',
      'Selecting questions based on difficulty...',
      'Formatting question paper...',
      'Generating answer key and marking scheme...'
    ];

    let statusIndex = 0;
    setGenerationStatus(statuses[0]);

    const statusInterval = setInterval(() => {
      statusIndex++;
      if (statusIndex < statuses.length) {
        setGenerationStatus(statuses[statusIndex]);
      }
    }, 2500);

    setTimeout(() => {
      clearInterval(statusInterval);
      setIsGenerating(false);
      const mockPaper = generateMockPaper();
      setGeneratedPaper(mockPaper);
      setShowDistributionTable(true);
    }, 10000);
  };

  const generateMockPaper = () => {
    const enabledTypes = formData.questionTypes.filter(qt => qt.enabled);
    let questionNumber = 1;
    let sections = '';

    enabledTypes.forEach((qt, index) => {
      sections += `\n## Section ${String.fromCharCode(65 + index)}: ${qt.label}\n`;
      sections += `(${qt.quantity} × ${qt.marksPerQuestion} = ${qt.quantity * qt.marksPerQuestion} marks)\n\n`;

      for (let i = 0; i < qt.quantity; i++) {
        if (qt.type === 'mcq') {
          sections += `${questionNumber}. What is the primary function of mitochondria in a cell?\n`;
          sections += `   a) Protein synthesis\n`;
          sections += `   b) Energy production\n`;
          sections += `   c) Cell division\n`;
          sections += `   d) Waste removal\n\n`;
        } else if (qt.type === 'short') {
          sections += `${questionNumber}. Explain the process of photosynthesis in plants. (${qt.marksPerQuestion} marks)\n\n`;
        } else if (qt.type === 'long') {
          sections += `${questionNumber}. Discuss the impact of climate change on global ecosystems. Support your answer with relevant examples. (${qt.marksPerQuestion} marks)\n\n`;
        } else if (qt.type === 'truefalse') {
          sections += `${questionNumber}. True or False: The Earth revolves around the Sun. (${qt.marksPerQuestion} mark)\n\n`;
        } else if (qt.type === 'fillblanks') {
          sections += `${questionNumber}. The process of converting solid directly to gas is called _______. (${qt.marksPerQuestion} mark)\n\n`;
        } else if (qt.type === 'matching') {
          sections += `${questionNumber}. Match the following:\n`;
          sections += `   Column A          Column B\n`;
          sections += `   a) Oxygen         1) H2O\n`;
          sections += `   b) Water          2) CO2\n`;
          sections += `   c) Carbon dioxide 3) O2\n\n`;
        }
        questionNumber++;
      }
    });

    return `# ${formData.course} - ${formData.subject}
## ${formData.topic} - ${formData.subtopic}

**Total Marks:** ${calculateTotalMarks()}
**Time Allowed:** ${formData.duration} minutes
**Negative Marking:** ${formData.negativeMarking ? 'Yes' : 'No'}

---

### General Instructions:
1. All questions are compulsory.
2. Read each question carefully before answering.
3. Marks are indicated against each question.
4. Write your answers in neat and legible handwriting.
${formData.specialInstructions ? `5. ${formData.specialInstructions}` : ''}

---

${sections}

---

**END OF QUESTION PAPER**
`;
  };

  const generateAnswerKey = () => {
    return `# ANSWER KEY
## ${formData.course} - ${formData.subject}

### Section A: Multiple Choice Questions
1. b) Energy production
2. b) Energy production
3. b) Energy production
4. b) Energy production
5. b) Energy production
6. b) Energy production
7. b) Energy production
8. b) Energy production
9. b) Energy production
10. b) Energy production

### Section B: Short Answer Questions
1. Photosynthesis is the process by which plants convert light energy into chemical energy, producing glucose and oxygen from carbon dioxide and water.

2. The water cycle involves evaporation, condensation, precipitation, and collection, continuously cycling water through Earth's systems.

(Answers for remaining questions...)

### Section C: Long Answer Questions
1. Climate change significantly impacts global ecosystems through rising temperatures, changing precipitation patterns, and extreme weather events. Examples include coral reef bleaching, arctic ice melting, and species migration patterns changing...

(Detailed answers for remaining questions...)
`;
  };

  const generateMarkingScheme = () => {
    return `# MARKING SCHEME
## ${formData.course} - ${formData.subject}

### Section A: MCQ (1 mark each)
- Correct answer: 1 mark
- Incorrect/No answer: 0 marks

### Section B: Short Answer (5 marks each)
- Complete answer with examples: 5 marks
- Adequate answer: 3-4 marks
- Partial answer: 1-2 marks
- No answer: 0 marks

### Section C: Long Answer (10 marks each)
**Marking Distribution:**
- Introduction & context: 2 marks
- Main content & explanations: 5 marks
- Examples & case studies: 2 marks
- Conclusion: 1 mark

**Total: ${calculateTotalMarks()} marks**
`;
  };

  const totalSteps = 2;

  // Loading Modal
  if (isGenerating) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, rgba(9, 77, 136, 0.95) 0%, rgba(16, 172, 139, 0.95) 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '4rem 3rem',
          maxWidth: '550px',
          textAlign: 'center',
          boxShadow: '0 25px 80px rgba(0,0,0,0.4)',
          animation: 'slideUp 0.5s ease-out'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 2rem',
            border: '6px solid #e0f2fe',
            borderTopColor: '#10ac8b',
            borderRightColor: '#10ac8b',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }}></div>
          <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
            Generating Question Paper
          </h2>
          <p style={{ margin: '0 0 2.5rem 0', color: '#10ac8b', fontSize: '1.2rem', fontWeight: 600 }}>
            {generationStatus}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: '#10ac8b',
                  animation: `pulse 1.5s ease-in-out ${i * 0.2}s infinite`
                }}
              ></div>
            ))}
          </div>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.95rem' }}>
            This may take 20-30 seconds...
          </p>
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.5); opacity: 0.5; }
          }
        `}</style>
      </div>
    );
  }

  // Results Page
  if (generatedPaper) {
    return (
      <div>
        <button
          onClick={() => {
            setGeneratedPaper(null);
            setShowAnswerKey(false);
            setShowMarkingScheme(false);
            setShowDistributionTable(false);
          }}
          className="sign-in-btn"
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#10ac8b',
            border: '2px solid #10ac8b'
          }}
        >
          <i className="fas fa-arrow-left"></i> Generate Another Paper
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
          {/* Main Content */}
          <div style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', padding: '3rem', overflow: 'hidden' }}>
            {/* Paper Header */}
            <div style={{
              background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
              margin: '-3rem -3rem 2.5rem',
              padding: '2.5rem 3rem',
              color: 'white'
            }}>
              <div style={{ textAlign: 'center' }}>
                <h1 style={{ margin: '0 0 1rem 0', fontSize: '2rem', fontWeight: 700 }}>
                  {formData.course} - {formData.subject}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.95rem', opacity: 0.9 }}>
                  <span><i className="fas fa-star"></i> {calculateTotalMarks()} marks</span>
                  <span><i className="fas fa-clock"></i> {formData.duration} minutes</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ marginBottom: '2rem' }}>
              {/* Primary Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  className="sign-in-btn"
                  style={{
                    fontSize: '0.95rem',
                    padding: '0.85rem 1.5rem',
                    background: 'linear-gradient(135deg, #10ac8b 0%, #059669 100%)',
                    boxShadow: '0 4px 15px rgba(16, 172, 139, 0.3)',
                    fontWeight: 600
                  }}
                >
                  <i className="fas fa-save"></i> Save
                </button>
                <button
                  className="sign-in-btn"
                  style={{
                    fontSize: '0.95rem',
                    padding: '0.85rem 1.5rem',
                    background: 'linear-gradient(135deg, #094d88 0%, #0c5ea8 100%)',
                    boxShadow: '0 4px 15px rgba(9, 77, 136, 0.3)',
                    fontWeight: 600
                  }}
                >
                  <i className="fas fa-file-pdf"></i> Download PDF
                </button>
              </div>

              {/* Secondary Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <button
                  className="sign-in-btn"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.6rem 1rem',
                    background: 'white',
                    color: '#094d88',
                    border: '2px solid #e2e8f0',
                    boxShadow: 'none',
                    fontWeight: 500
                  }}
                >
                  <i className="fas fa-edit"></i> Edit
                </button>
                <button
                  className="sign-in-btn"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.6rem 1rem',
                    background: 'white',
                    color: '#094d88',
                    border: '2px solid #e2e8f0',
                    boxShadow: 'none',
                    fontWeight: 500
                  }}
                >
                  <i className="fas fa-copy"></i> Variants
                </button>
                <button
                  className="sign-in-btn"
                  style={{
                    fontSize: '0.85rem',
                    padding: '0.6rem 1rem',
                    background: 'white',
                    color: '#10ac8b',
                    border: '2px solid #e2e8f0',
                    boxShadow: 'none',
                    fontWeight: 500
                  }}
                >
                  <i className="fas fa-sync"></i> Regenerate
                </button>
              </div>
            </div>

            {/* Toggle Views - Segmented Control */}
            <div style={{
              display: 'inline-flex',
              background: '#f7fafc',
              padding: '0.25rem',
              borderRadius: '10px',
              marginBottom: '2rem',
              border: '2px solid #e2e8f0',
              width: '100%'
            }}>
              <button
                onClick={() => {
                  setShowAnswerKey(false);
                  setShowMarkingScheme(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  background: !showAnswerKey && !showMarkingScheme ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : 'transparent',
                  color: !showAnswerKey && !showMarkingScheme ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: !showAnswerKey && !showMarkingScheme ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: !showAnswerKey && !showMarkingScheme ? '0 2px 8px rgba(9, 77, 136, 0.3)' : 'none'
                }}
              >
                <i className="fas fa-file-alt"></i> Question Paper
              </button>
              <button
                onClick={() => {
                  setShowAnswerKey(true);
                  setShowMarkingScheme(false);
                }}
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  background: showAnswerKey ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : 'transparent',
                  color: showAnswerKey ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: showAnswerKey ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: showAnswerKey ? '0 2px 8px rgba(9, 77, 136, 0.3)' : 'none'
                }}
              >
                <i className="fas fa-key"></i> Answer Key
              </button>
              <button
                onClick={() => {
                  setShowAnswerKey(false);
                  setShowMarkingScheme(true);
                }}
                style={{
                  flex: 1,
                  padding: '0.7rem 1rem',
                  background: showMarkingScheme ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : 'transparent',
                  color: showMarkingScheme ? 'white' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  fontWeight: showMarkingScheme ? 600 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: showMarkingScheme ? '0 2px 8px rgba(9, 77, 136, 0.3)' : 'none'
                }}
              >
                <i className="fas fa-clipboard-check"></i> Marking Scheme
              </button>
            </div>

            {/* Content Display */}
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', color: '#2d3748', fontSize: '1rem' }}>
              {showAnswerKey ? generateAnswerKey() : showMarkingScheme ? generateMarkingScheme() : generatedPaper}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ position: 'sticky', top: '2rem', height: 'fit-content' }}>
            {/* Distribution Table */}
            {showDistributionTable && (
              <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                padding: '2rem',
                marginBottom: '2rem'
              }}>
                <h3 style={{
                  margin: '0 0 1.5rem 0',
                  color: '#2d3748',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-table" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                  </div>
                  Distribution Table
                </h3>

                <table style={{ width: '100%', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ background: '#f7fafc' }}>
                      <th style={{ padding: '0.75rem', textAlign: 'left', color: '#2d3748', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', color: '#2d3748', fontWeight: 600 }}>Qty</th>
                      <th style={{ padding: '0.75rem', textAlign: 'center', color: '#2d3748', fontWeight: 600 }}>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.questionTypes.filter(qt => qt.enabled).map((qt, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '0.75rem', color: '#4a5568' }}>{qt.label.split(' ')[0]}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', color: '#4a5568' }}>{qt.quantity}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', color: '#4a5568' }}>
                          {qt.quantity * qt.marksPerQuestion}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: '#f7fafc', fontWeight: 700 }}>
                      <td style={{ padding: '0.75rem', color: '#2d3748' }}>Total</td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#2d3748' }}>
                        {formData.questionTypes.filter(qt => qt.enabled).reduce((sum, qt) => sum + qt.quantity, 0)}
                      </td>
                      <td style={{ padding: '0.75rem', textAlign: 'center', color: '#2d3748' }}>
                        {calculateTotalMarks()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* Paper Details */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              padding: '2rem'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                Paper Details
              </h3>
              <div style={{ display: 'grid', gap: '1rem', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Course</div>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.course}</div>
                </div>
                <div>
                  <div style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Subject</div>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.subject}</div>
                </div>
                <div>
                  <div style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Topic</div>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.topic}</div>
                </div>
                <div>
                  <div style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Subtopic</div>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.subtopic}</div>
                </div>
                <div>
                  <div style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Total Marks</div>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{calculateTotalMarks()}</div>
                </div>
                <div>
                  <div style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Duration</div>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.duration} minutes</div>
                </div>
                <div>
                  <div style={{ color: '#718096', fontSize: '0.8rem', marginBottom: '0.25rem' }}>Negative Marking</div>
                  <div style={{ color: '#2d3748', fontWeight: 600 }}>{formData.negativeMarking ? 'Enabled' : 'Disabled'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Form
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1><i className="fas fa-file-alt" style={{ marginRight: '0.75rem' }}></i>Question Paper Generator</h1>
            <p>AI-Powered Question Paper Creation - Generate professional exam papers in minutes</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="stat-info">
              <h4>Papers Generated</h4>
              <p className="stat-value">
                18 <span className="stat-total">papers</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Time Saved</h4>
              <p className="stat-value">
                36 <span className="stat-total">hours</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>This Month</h4>
              <p className="stat-value">
                6 <span className="stat-total">papers</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '2.5rem 3rem',
        marginBottom: '2.5rem'
      }}>
        <div style={{ position: 'relative' }}>
          {/* Background progress line */}
          <div style={{
            position: 'absolute',
            top: '35px',
            left: '15%',
            right: '15%',
            height: '4px',
            background: '#e2e8f0',
            borderRadius: '2px',
            zIndex: 0
          }}></div>
          {/* Active progress line */}
          <div style={{
            position: 'absolute',
            top: '35px',
            left: '15%',
            width: `${((currentStep - 1) / (totalSteps - 1)) * 70}%`,
            height: '4px',
            background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
            borderRadius: '2px',
            zIndex: 0,
            transition: 'width 0.4s ease'
          }}></div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {[1, 2, 3, 4].map((step) => {
              const isActive = step === currentStep;
              const isCompleted = step < currentStep;
              const isSkipped = formData.mode === 'quick' && step === 3;

              if (isSkipped) return null;

              return (
                <div key={step} style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{
                      width: isActive ? '70px' : '60px',
                      height: isActive ? '70px' : '60px',
                      borderRadius: '50%',
                      background: isActive || isCompleted
                        ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                        : 'white',
                      color: isActive || isCompleted ? 'white' : '#cbd5e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: isActive ? '1.5rem' : '1.25rem',
                      marginBottom: '1rem',
                      transition: 'all 0.3s ease',
                      boxShadow: isActive
                        ? '0 8px 25px rgba(9, 77, 136, 0.4)'
                        : isCompleted
                        ? '0 6px 20px rgba(16, 172, 139, 0.3)'
                        : '0 2px 8px rgba(0,0,0,0.08)',
                      border: isActive || isCompleted ? 'none' : '3px solid #e2e8f0'
                    }}>
                      {isCompleted ? <i className="fas fa-check"></i> : step}
                    </div>
                    <div style={{
                      fontSize: isActive ? '0.95rem' : '0.85rem',
                      color: isActive ? '#094d88' : isCompleted ? '#10ac8b' : '#718096',
                      fontWeight: isActive ? 700 : 600,
                      textAlign: 'center',
                      transition: 'all 0.3s',
                      whiteSpace: 'nowrap'
                    }}>
                      {step === 1 ? 'Basic Info' : step === 2 ? 'Questions' : step === 3 ? 'Settings' : 'Review'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          padding: '0.75rem 1.5rem',
          background: '#f7fafc',
          borderRadius: '12px'
        }}>
          <span style={{ color: '#10ac8b', fontSize: '0.95rem', fontWeight: 700 }}>
            Step {formData.mode === 'quick' && currentStep === 4 ? 2 : currentStep} of {totalSteps}
          </span>
          <span style={{ color: '#cbd5e0', margin: '0 0.75rem' }}>•</span>
          <span style={{ color: '#718096', fontSize: '0.9rem', fontWeight: 500 }}>
            {formData.mode === 'quick' ? 'AI Generated' : 'Self Created'}
          </span>
        </div>
      </div>

      {/* Form Content */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '3rem',
        marginBottom: '2rem'
      }}>
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="fas fa-info-circle" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Basic Information
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Let's start with the essentials for your question paper
              </p>
            </div>

            {/* Mode Toggle */}
            <div style={{ marginBottom: '3rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                <i className="fas fa-bolt"></i> Generation Mode
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                <button
                  onClick={() => setFormData({ ...formData, mode: 'quick' })}
                  style={{
                    padding: '2rem',
                    background: formData.mode === 'quick'
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : 'white',
                    border: `3px solid ${formData.mode === 'quick' ? '#10ac8b' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    color: formData.mode === 'quick' ? 'white' : '#2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    boxShadow: formData.mode === 'quick' ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
                    transform: formData.mode === 'quick' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <i className="fas fa-bolt" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>AI Generated</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Basic inputs, fast generation
                  </div>
                </button>
                <button
                  onClick={() => setFormData({ ...formData, mode: 'advanced' })}
                  style={{
                    padding: '2rem',
                    background: formData.mode === 'advanced'
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : 'white',
                    border: `3px solid ${formData.mode === 'advanced' ? '#10ac8b' : '#e2e8f0'}`,
                    borderRadius: '16px',
                    color: formData.mode === 'advanced' ? 'white' : '#2d3748',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    textAlign: 'left',
                    boxShadow: formData.mode === 'advanced' ? '0 8px 25px rgba(16, 185, 129, 0.3)' : 'none',
                    transform: formData.mode === 'advanced' ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <i className="fas fa-bullseye" style={{ fontSize: '2.5rem', marginBottom: '1rem', display: 'block' }}></i>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Self Created</div>
                  <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                    Detailed customization
                  </div>
                </button>
              </div>
            </div>

            {/* Form Fields */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Course <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-graduation-cap" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <select
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select course</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Subject <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-book" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
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

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Topic <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-bookmark" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <input
                    type="text"
                    value={formData.topic}
                    onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                    placeholder="e.g., Photosynthesis, Newton's Laws"
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Subtopic <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-sitemap" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <select
                    value={formData.subtopic}
                    onChange={(e) => setFormData({ ...formData, subtopic: e.target.value })}
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="">Select subtopic</option>
                    {subtopics.map(subtopic => (
                      <option key={subtopic} value={subtopic}>{subtopic}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Duration (minutes) <span style={{ color: '#dc3545' }}>*</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <i className="fas fa-clock" style={{
                    position: 'absolute',
                    left: '1.25rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#10ac8b',
                    fontSize: '1.1rem'
                  }}></i>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                    placeholder="180"
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
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem'
                }}>
                  Negative Marking
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => setFormData({ ...formData, negativeMarking: !formData.negativeMarking })}
                >
                  <div style={{
                    width: '50px',
                    height: '28px',
                    borderRadius: '14px',
                    background: formData.negativeMarking ? '#10ac8b' : '#cbd5e0',
                    position: 'relative',
                    transition: 'background 0.2s',
                    marginRight: '1rem'
                  }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: 'white',
                      position: 'absolute',
                      top: '2px',
                      left: formData.negativeMarking ? '24px' : '2px',
                      transition: 'left 0.2s',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                    }}></div>
                  </div>
                  <span style={{
                    fontSize: '1rem',
                    color: '#2d3748',
                    fontWeight: 500
                  }}>
                    {formData.negativeMarking ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Quick Configuration */}
              <div style={{ marginTop: '2rem' }}>
                  <h3 style={{
                    margin: '0 0 1.5rem 0',
                    color: '#2d3748',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-sliders-h" style={{ color: '#10ac8b' }}></i>
                    Quick Configuration
                  </h3>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#2d3748',
                        marginBottom: '0.75rem'
                      }}>
                        Number of Questions <span style={{ color: '#dc3545' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <i className="fas fa-list-ol" style={{
                          position: 'absolute',
                          left: '1.25rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#10ac8b',
                          fontSize: '1.1rem'
                        }}></i>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={formData.quickModeQuestions || ''}
                          onChange={(e) => setFormData({ ...formData, quickModeQuestions: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 20"
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
                            e.currentTarget.style.borderColor = '#10ac8b';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: '#2d3748',
                        marginBottom: '0.75rem'
                      }}>
                        Marks per Question <span style={{ color: '#dc3545' }}>*</span>
                      </label>
                      <div style={{ position: 'relative' }}>
                        <i className="fas fa-star" style={{
                          position: 'absolute',
                          left: '1.25rem',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          color: '#10ac8b',
                          fontSize: '1.1rem'
                        }}></i>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.quickModeMarksPerQuestion || ''}
                          onChange={(e) => setFormData({ ...formData, quickModeMarksPerQuestion: parseInt(e.target.value) || 0 })}
                          placeholder="e.g., 5"
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
                            e.currentTarget.style.borderColor = '#10ac8b';
                            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.borderColor = '#e2e8f0';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Total Marks Display */}
                  <div style={{
                    marginTop: '1.5rem',
                    padding: '1.5rem',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    borderRadius: '12px',
                    textAlign: 'center',
                    color: 'white'
                  }}>
                    <div style={{ fontSize: '0.85rem', opacity: 0.9, marginBottom: '0.25rem' }}>
                      Total Marks
                    </div>
                    <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                      {(formData.quickModeQuestions || 0) * (formData.quickModeMarksPerQuestion || 0)}
                    </div>
                  </div>
                </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {currentStep === 4 && (
          <div>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
              <div style={{
                width: '70px',
                height: '70px',
                margin: '0 auto 1.5rem',
                borderRadius: '16px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
              }}>
                <i className="fas fa-check-double" style={{ fontSize: '2rem', color: 'white' }}></i>
              </div>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                Review & Generate
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                Review your configuration before generating the question paper
              </p>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {/* Basic Info Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{
                  margin: '0 0 1.5rem 0',
                  color: '#2d3748',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-info-circle" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                  </div>
                  Paper Details
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Course
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.course}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Subject
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.subject}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Topic
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.topic}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Subtopic
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.subtopic}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Duration
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.duration} minutes
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Negative Marking
                    </div>
                    <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                      {formData.negativeMarking ? 'Enabled' : 'Disabled'}
                    </div>
                  </div>
                  {formData.mode === 'quick' && (
                    <>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                          Number of Questions
                        </div>
                        <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                          {formData.quickModeQuestions}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                          Marks per Question
                        </div>
                        <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                          {formData.quickModeMarksPerQuestion}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                          Total Marks
                        </div>
                        <div style={{ fontSize: '1.05rem', color: '#2d3748', fontWeight: 600 }}>
                          {(formData.quickModeQuestions || 0) * (formData.quickModeMarksPerQuestion || 0)}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Question Distribution Card */}
              <div style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                padding: '2rem',
                borderRadius: '16px',
                border: '2px solid #e2e8f0'
              }}>
                <h3 style={{
                  margin: '0 0 1.5rem 0',
                  color: '#2d3748',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="fas fa-list-check" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                  </div>
                  Question Distribution
                </h3>
                <table style={{ width: '100%', fontSize: '0.95rem' }}>
                  <thead>
                    <tr style={{ background: 'white', borderRadius: '8px' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', color: '#2d3748', fontWeight: 700 }}>Question Type</th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: '#2d3748', fontWeight: 700 }}>Quantity</th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: '#2d3748', fontWeight: 700 }}>Marks Each</th>
                      <th style={{ padding: '1rem', textAlign: 'center', color: '#2d3748', fontWeight: 700 }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.questionTypes.filter(qt => qt.enabled).map((qt, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem', color: '#4a5568', fontWeight: 600 }}>{qt.label}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#4a5568' }}>{qt.quantity}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#4a5568' }}>{qt.marksPerQuestion}</td>
                        <td style={{ padding: '1rem', textAlign: 'center', color: '#4a5568', fontWeight: 700 }}>
                          {qt.quantity * qt.marksPerQuestion}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: 'white', fontWeight: 700 }}>
                      <td style={{ padding: '1rem', color: '#2d3748' }}>TOTAL</td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#2d3748' }}>
                        {formData.questionTypes.filter(qt => qt.enabled).reduce((sum, qt) => sum + qt.quantity, 0)}
                      </td>
                      <td style={{ padding: '1rem' }}></td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#10ac8b', fontSize: '1.25rem' }}>
                        {calculateTotalMarks()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Advanced Settings (if in advanced mode) */}
              {formData.mode === 'advanced' && (
                <div style={{
                  background: 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
                  padding: '2rem',
                  borderRadius: '16px',
                  border: '2px solid #e2e8f0'
                }}>
                  <h3 style={{
                    margin: '0 0 1.5rem 0',
                    color: '#2d3748',
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-sliders-h" style={{ color: 'white', fontSize: '1.1rem' }}></i>
                    </div>
                    Difficulty Distribution
                  </h3>
                  <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'space-around' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#10ac8b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 700
                      }}>
                        {formData.difficultyEasy}%
                      </div>
                      <div style={{ color: '#2d3748', fontWeight: 600 }}>Easy</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#094d88',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 700
                      }}>
                        {formData.difficultyMedium}%
                      </div>
                      <div style={{ color: '#2d3748', fontWeight: 600 }}>Medium</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: '#dc3545',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 0.75rem',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 700
                      }}>
                        {formData.difficultyHard}%
                      </div>
                      <div style={{ color: '#2d3748', fontWeight: 600 }}>Hard</div>
                    </div>
                  </div>
                  {(formData.includeDiagrams || formData.includePracticals || formData.specialInstructions) && (
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '2px solid #e2e8f0' }}>
                      {formData.includeDiagrams && (
                        <div style={{ marginBottom: '0.5rem', color: '#2d3748' }}>
                          <i className="fas fa-check" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                          Diagrams included
                        </div>
                      )}
                      {formData.includePracticals && (
                        <div style={{ marginBottom: '0.5rem', color: '#2d3748' }}>
                          <i className="fas fa-check" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                          Practical questions included
                        </div>
                      )}
                      {formData.specialInstructions && (
                        <div style={{ marginTop: '1rem' }}>
                          <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                            Special Instructions
                          </div>
                          <div style={{ color: '#2d3748' }}>
                            {formData.specialInstructions}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Generation Mode Badge */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '1rem 2rem',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  color: 'white',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 25px rgba(16, 185, 129, 0.3)'
                }}>
                  <i className={`fas fa-${formData.mode === 'quick' ? 'bolt' : 'bullseye'}`}></i>
                  {formData.mode === 'quick' ? 'Quick Mode' : 'Advanced Mode'} Generation
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '2px solid #f7fafc',
          gap: '1rem'
        }}>
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            style={{
              padding: '1rem 2.5rem',
              background: currentStep === 1 ? '#f7fafc' : 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              color: currentStep === 1 ? '#cbd5e0' : '#2d3748',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: currentStep === 1 ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minWidth: '140px',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              if (currentStep !== 1) {
                e.currentTarget.style.transform = 'translateX(-5px)';
                e.currentTarget.style.borderColor = '#094d88';
                e.currentTarget.style.color = '#094d88';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateX(0)';
              e.currentTarget.style.borderColor = '#e2e8f0';
              if (currentStep !== 1) e.currentTarget.style.color = '#2d3748';
            }}
          >
            <i className="fas fa-arrow-left"></i>
            <span>Back</span>
          </button>

          {currentStep === 4 ? (
            <button
              onClick={handleGenerate}
              disabled={!formData.course || !formData.subject || !formData.topic || !formData.subtopic}
              className="sign-in-btn"
              style={{
                padding: '1rem 3rem',
                fontSize: '1.05rem',
                fontWeight: 700,
                borderRadius: '12px',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                boxShadow: (!formData.course || !formData.subject || !formData.topic || !formData.subtopic)
                  ? 'none'
                  : '0 8px 25px rgba(9, 77, 136, 0.4)',
                opacity: (!formData.course || !formData.subject || !formData.topic || !formData.subtopic) ? 0.5 : 1,
                cursor: (!formData.course || !formData.subject || !formData.topic || !formData.subtopic)
                  ? 'not-allowed'
                  : 'pointer',
                border: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '220px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (formData.course && formData.subject && formData.topic && formData.subtopic) {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
              }}
            >
              <i className="fas fa-magic"></i>
              <span>Generate Paper</span>
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!formData.course || !formData.subject || !formData.topic || !formData.subtopic}
              className="sign-in-btn"
              style={{
                padding: '1rem 2.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '12px',
                background: (!formData.course || !formData.subject || !formData.topic || !formData.subtopic)
                  ? '#e2e8f0'
                  : 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                boxShadow: (!formData.course || !formData.subject || !formData.topic || !formData.subtopic)
                  ? 'none'
                  : '0 8px 25px rgba(9, 77, 136, 0.4)',
                opacity: (!formData.course || !formData.subject || !formData.topic || !formData.subtopic) ? 0.5 : 1,
                cursor: (!formData.course || !formData.subject || !formData.topic || !formData.subtopic)
                  ? 'not-allowed'
                  : 'pointer',
                border: 'none',
                color: 'white',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                minWidth: '140px',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                if (formData.course && formData.subject && formData.topic && formData.subtopic) {
                  e.currentTarget.style.transform = 'translateX(5px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateX(0)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
              }}
            >
              <span>Next</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionGenerator;
