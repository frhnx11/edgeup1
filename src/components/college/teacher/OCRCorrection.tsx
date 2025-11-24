import { useState } from 'react';

interface QuestionResult {
  questionNumber: number;
  isCorrect: boolean;
  studentAnswer: string;
  correctAnswer: string;
  feedback: string;
  points: number;
  maxPoints: number;
}

interface GradingResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  grade: string;
  questionResults: QuestionResult[];
  overallFeedback: string;
  strengths: string[];
  improvements: string[];
}

interface OCRCorrectionProps {
  onBack?: () => void;
}

const OCRCorrection = ({ onBack }: OCRCorrectionProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);

  const [subject, setSubject] = useState('');
  const [grade, setGrade] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isGraded, setIsGraded] = useState(false);

  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);

  const [showLibrary, setShowLibrary] = useState(false);

  const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science'];
  const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnswerKeyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAnswerKeyFile(e.target.files[0]);
    }
  };

  const handleScanAndGrade = async () => {
    setIsProcessing(true);

    // ============================================================
    // TODO: REPLACE THIS SECTION WITH REAL OCR AI API INTEGRATION
    // ============================================================
    //
    // STEP 1: Prepare the form data with the uploaded image
    // const formData = new FormData();
    // formData.append('homeworkImage', uploadedFile);
    // formData.append('subject', subject);
    // formData.append('grade', grade);
    // if (answerKeyFile) {
    //   formData.append('answerKey', answerKeyFile);
    // }
    //
    // STEP 2: Call your OCR/AI API
    // try {
    //   setProcessingStep('Scanning handwritten text...');
    //
    //   const response = await fetch('YOUR_OCR_API_ENDPOINT_HERE', {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': 'Bearer YOUR_API_KEY_HERE'
    //     },
    //     body: formData
    //   });
    //
    //   if (!response.ok) {
    //     throw new Error('OCR processing failed');
    //   }
    //
    //   setProcessingStep('Analyzing answers...');
    //   const ocrResponse = await response.json();
    //
    //   setProcessingStep('Generating feedback...');
    //
    //   // STEP 3: Set the grading results
    //   setGradingResult(ocrResponse);
    //   setIsGraded(true);
    //
    // } catch (error) {
    //   console.error('Error processing homework:', error);
    //   alert('Failed to process homework. Please try again.');
    // } finally {
    //   setIsProcessing(false);
    // }
    //
    // ============================================================
    // END OF OCR AI API INTEGRATION SECTION
    // ============================================================

    // TEMPORARY: Mock OCR processing (DELETE THIS WHEN API IS READY)
    const steps = [
      'Scanning handwritten text...',
      'Extracting question answers...',
      'Analyzing correctness...',
      'Generating detailed feedback...'
    ];

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Mock grading result
    const mockResult: GradingResult = {
      totalScore: 85,
      maxScore: 100,
      percentage: 85,
      grade: 'B',
      questionResults: [
        {
          questionNumber: 1,
          isCorrect: true,
          studentAnswer: 'Photosynthesis',
          correctAnswer: 'Photosynthesis',
          feedback: 'Correct! Well done.',
          points: 10,
          maxPoints: 10
        },
        {
          questionNumber: 2,
          isCorrect: true,
          studentAnswer: '6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂',
          correctAnswer: '6CO₂ + 6H₂O + Light Energy → C₆H₁₂O₆ + 6O₂',
          feedback: 'Almost perfect! You got the main equation right, but remember to include "Light Energy" as a reactant.',
          points: 8,
          maxPoints: 10
        },
        {
          questionNumber: 3,
          isCorrect: true,
          studentAnswer: 'Chloroplast',
          correctAnswer: 'Chloroplast',
          feedback: 'Excellent! Correct answer.',
          points: 10,
          maxPoints: 10
        },
        {
          questionNumber: 4,
          isCorrect: false,
          studentAnswer: 'Oxygen and water',
          correctAnswer: 'Glucose (sugar) and oxygen',
          feedback: 'Not quite right. Photosynthesis produces glucose (sugar) and oxygen, not water. Water is actually a reactant (input) in photosynthesis, not a product.',
          points: 0,
          maxPoints: 10
        },
        {
          questionNumber: 5,
          isCorrect: true,
          studentAnswer: 'Chlorophyll',
          correctAnswer: 'Chlorophyll',
          feedback: 'Perfect! Chlorophyll is indeed the pigment that captures light energy.',
          points: 10,
          maxPoints: 10
        },
        {
          questionNumber: 6,
          isCorrect: true,
          studentAnswer: 'Light-dependent and light-independent reactions',
          correctAnswer: 'Light-dependent reactions and Calvin Cycle',
          feedback: 'Great understanding! You correctly identified both stages. Note that the light-independent reactions are also called the Calvin Cycle.',
          points: 9,
          maxPoints: 10
        },
        {
          questionNumber: 7,
          isCorrect: true,
          studentAnswer: 'Stomata',
          correctAnswer: 'Stomata',
          feedback: 'Correct! Stomata are the pores that allow gas exchange.',
          points: 10,
          maxPoints: 10
        },
        {
          questionNumber: 8,
          isCorrect: true,
          studentAnswer: 'Light intensity, CO₂ concentration, temperature',
          correctAnswer: 'Light intensity, CO₂ concentration, temperature, water availability',
          feedback: 'Very good! You listed three main factors. Water availability is also an important factor to remember.',
          points: 8,
          maxPoints: 10
        },
        {
          questionNumber: 9,
          isCorrect: true,
          studentAnswer: 'Thylakoid membrane',
          correctAnswer: 'Thylakoid membrane',
          feedback: 'Exactly right! Light-dependent reactions occur in the thylakoid membranes.',
          points: 10,
          maxPoints: 10
        },
        {
          questionNumber: 10,
          isCorrect: true,
          studentAnswer: 'Stroma',
          correctAnswer: 'Stroma',
          feedback: 'Perfect! The Calvin Cycle takes place in the stroma.',
          points: 10,
          maxPoints: 10
        }
      ],
      overallFeedback: 'Great work! You have a solid understanding of photosynthesis. Your handwriting is clear and easy to read. Focus on reviewing the products of photosynthesis and make sure to include all components in chemical equations.',
      strengths: [
        'Clear and legible handwriting',
        'Strong understanding of basic concepts',
        'Correct identification of cellular structures',
        'Good grasp of the photosynthesis process'
      ],
      improvements: [
        'Review the difference between reactants and products in photosynthesis',
        'Include all components when writing chemical equations (like "Light Energy")',
        'Remember all factors affecting photosynthesis rate',
        'Practice distinguishing between inputs and outputs of the process'
      ]
    };

    setGradingResult(mockResult);
    setIsGraded(true);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setUploadedFile(null);
    setUploadedImage(null);
    setAnswerKeyFile(null);
    setSubject('');
    setGrade('');
    setIsProcessing(false);
    setIsGraded(false);
    setGradingResult(null);
  };

  // Library view
  if (showLibrary) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem' }}>
        <div style={{
          background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
          padding: '2.5rem 3rem',
          borderRadius: '16px',
          marginBottom: '2.5rem',
          boxShadow: '0 8px 32px rgba(9, 77, 136, 0.3)'
        }}>
          <button
            onClick={() => setShowLibrary(false)}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              padding: '0.75rem 1.5rem',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '1.5rem',
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
            <i className="fas fa-arrow-left"></i> Back to Grading
          </button>

          <h1 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
            <i className="fas fa-folder-open" style={{ marginRight: '1rem' }}></i>
            My Graded Homework
          </h1>
          <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
            View all previously graded assignments
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {[
            { title: 'Photosynthesis Worksheet', subject: 'Biology', score: 85, maxScore: 100, grade: 'B', date: '2024-01-15' },
            { title: 'Quadratic Equations Test', subject: 'Mathematics', score: 92, maxScore: 100, grade: 'A', date: '2024-01-14' },
            { title: 'World War II Essay', subject: 'History', score: 78, maxScore: 100, grade: 'C+', date: '2024-01-13' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '2px solid transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(9, 77, 136, 0.15)';
                e.currentTarget.style.borderColor = '#094d88';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-file-alt" style={{ fontSize: '1.5rem', color: 'white' }}></i>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  background: item.percentage >= 90 ? '#d1fae5' : item.percentage >= 70 ? '#fef3c7' : '#fee2e2',
                  color: item.percentage >= 90 ? '#065f46' : item.percentage >= 70 ? '#92400e' : '#991b1b',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '1.25rem'
                }}>
                  {item.grade}
                </div>
              </div>

              <h3 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                {item.title}
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  background: '#f7fafc',
                  borderRadius: '6px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#094d88'
                }}>
                  {item.subject}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '2px solid #f7fafc' }}>
                <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                  <i className="fas fa-calendar"></i> {item.date}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#2d3748' }}>
                  {item.score}/{item.maxScore}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(9, 77, 136, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
              <i className="fas fa-spell-check" style={{ marginRight: '1rem' }}></i>
              OCR Homework Correction
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Scan handwritten homework and get instant grading with detailed feedback
            </p>
          </div>
          <button
            onClick={() => setShowLibrary(true)}
            className="sign-in-btn"
            style={{
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '16px',
              padding: '1.25rem 2.5rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#094d88',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)';
            }}
          >
            <i className="fas fa-folder-open"></i> My Graded Homework
          </button>
        </div>
      </div>

      {/* Main Content */}
      {!isGraded ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '3rem'
        }}>
          {!isProcessing ? (
            <>
              <h2 style={{ margin: '0 0 2rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
                Upload Homework for Grading
              </h2>

              {/* Upload Zone */}
              <div style={{
                border: uploadedFile ? '2px solid #10ac8b' : '2px dashed #e2e8f0',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                marginBottom: '2rem',
                background: uploadedFile ? '#f0fdf4' : '#f7fafc',
                transition: 'all 0.3s'
              }}>
                <input
                  type="file"
                  id="homework-upload"
                  accept="image/*,.pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />

                {!uploadedFile ? (
                  <label htmlFor="homework-upload" style={{ cursor: 'pointer' }}>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '4rem', color: '#094d88', marginBottom: '1.5rem', display: 'block' }}></i>
                    <div style={{ fontSize: '1.25rem', color: '#2d3748', fontWeight: 700, marginBottom: '0.75rem' }}>
                      Click to upload or drag and drop
                    </div>
                    <div style={{ fontSize: '1rem', color: '#718096', marginBottom: '1rem' }}>
                      Upload handwritten homework (JPG, PNG, or PDF)
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                      Maximum file size: 10MB
                    </div>
                  </label>
                ) : (
                  <div>
                    <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#10ac8b', marginBottom: '1rem', display: 'block' }}></i>
                    <div style={{ fontSize: '1.25rem', color: '#2d3748', fontWeight: 700, marginBottom: '0.5rem' }}>
                      {uploadedFile.name}
                    </div>
                    <div style={{ fontSize: '0.95rem', color: '#718096', marginBottom: '1.5rem' }}>
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </div>
                    {uploadedImage && (
                      <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
                        <img
                          src={uploadedImage}
                          alt="Homework preview"
                          style={{
                            maxWidth: '400px',
                            maxHeight: '300px',
                            borderRadius: '12px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setUploadedFile(null);
                        setUploadedImage(null);
                      }}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '12px',
                        color: '#dc3545',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#dc3545';
                        e.currentTarget.style.background = '#fee2e2';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.background = 'white';
                      }}
                    >
                      <i className="fas fa-times"></i> Remove File
                    </button>
                  </div>
                )}
              </div>

              {/* Subject and Grade Selection */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    Subject <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select Subject</option>
                    {subjects.map(subj => (
                      <option key={subj} value={subj}>{subj}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    color: '#2d3748',
                    marginBottom: '0.75rem'
                  }}>
                    Grade Level <span style={{ color: '#dc3545' }}>*</span>
                  </label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      fontSize: '1rem',
                      outline: 'none',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                  >
                    <option value="">Select Grade</option>
                    {grades.map(gr => (
                      <option key={gr} value={gr}>{gr}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Optional Answer Key */}
              <div style={{
                padding: '2rem',
                background: '#f7fafc',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                marginBottom: '2rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <i className="fas fa-key" style={{ fontSize: '1.5rem', color: '#094d88' }}></i>
                  <div>
                    <div style={{ fontWeight: 700, color: '#2d3748', fontSize: '1.1rem' }}>
                      Answer Key (Optional)
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                      Upload answer key for more accurate grading
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  id="answer-key-upload"
                  accept="image/*,.pdf,.txt"
                  onChange={handleAnswerKeyUpload}
                  style={{ display: 'none' }}
                />
                <label
                  htmlFor="answer-key-upload"
                  style={{
                    display: 'inline-block',
                    padding: '0.75rem 1.5rem',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#2d3748',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#094d88';
                    e.currentTarget.style.color = '#094d88';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#2d3748';
                  }}
                >
                  <i className="fas fa-upload"></i> {answerKeyFile ? answerKeyFile.name : 'Upload Answer Key'}
                </label>
              </div>

              {/* Scan & Grade Button */}
              <button
                onClick={handleScanAndGrade}
                disabled={!uploadedFile || !subject || !grade}
                className="sign-in-btn"
                style={{
                  width: '100%',
                  padding: '1.5rem 2rem',
                  fontSize: '1.15rem',
                  fontWeight: 700,
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  border: 'none',
                  color: 'white',
                  cursor: (!uploadedFile || !subject || !grade) ? 'not-allowed' : 'pointer',
                  opacity: (!uploadedFile || !subject || !grade) ? 0.5 : 1,
                  boxShadow: '0 8px 25px rgba(9, 77, 136, 0.4)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1rem'
                }}
                onMouseEnter={(e) => {
                  if (uploadedFile && subject && grade) {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
                }}
              >
                <i className="fas fa-search"></i>
                <span>Scan & Grade Homework</span>
              </button>
            </>
          ) : (
            // Processing View
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{
                width: '120px',
                height: '120px',
                margin: '0 auto 2rem',
                borderRadius: '50%',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s infinite'
              }}>
                <i className="fas fa-spinner fa-spin" style={{ fontSize: '3rem', color: 'white' }}></i>
              </div>

              <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
                Processing Homework...
              </h2>
              <p style={{ margin: '0 0 2rem 0', color: '#718096', fontSize: '1.1rem' }}>
                {processingStep}
              </p>

              {uploadedImage && (
                <div style={{ marginTop: '2rem' }}>
                  <img
                    src={uploadedImage}
                    alt="Processing homework"
                    style={{
                      maxWidth: '500px',
                      maxHeight: '400px',
                      borderRadius: '16px',
                      boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                      opacity: 0.7
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Results View
        <div>
          {/* Score Card */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '3rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
              {/* Score Circle */}
              <div style={{
                width: '180px',
                height: '180px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 40px rgba(9, 77, 136, 0.3)',
                flexShrink: 0
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'white' }}>
                  {gradingResult?.percentage}%
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', opacity: 0.9 }}>
                  Grade {gradingResult?.grade}
                </div>
              </div>

              {/* Summary */}
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                  Homework Graded Successfully!
                </h2>
                <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '1.1rem', lineHeight: 1.6 }}>
                  {gradingResult?.overallFeedback}
                </p>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.25rem' }}>Total Score</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#2d3748' }}>
                      {gradingResult?.totalScore}/{gradingResult?.maxScore}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.25rem' }}>Correct Answers</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10ac8b' }}>
                      {gradingResult?.questionResults.filter(q => q.isCorrect).length}/{gradingResult?.questionResults.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                  style={{
                    padding: '1rem 2rem',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#2d3748',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#094d88';
                    e.currentTarget.style.color = '#094d88';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#2d3748';
                  }}
                >
                  <i className="fas fa-download"></i>
                  Download Report
                </button>
                <button
                  onClick={handleReset}
                  style={{
                    padding: '1rem 2rem',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <i className="fas fa-plus"></i>
                  Grade New Homework
                </button>
              </div>
            </div>
          </div>

          {/* Strengths and Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
            {/* Strengths */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              padding: '2rem',
              border: '2px solid #d1fae5'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#10ac8b', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-check-circle"></i>
                Strengths
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'none' }}>
                {gradingResult?.strengths.map((strength, index) => (
                  <li key={index} style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1rem', lineHeight: 1.6, position: 'relative', paddingLeft: '1.5rem' }}>
                    <i className="fas fa-star" style={{ position: 'absolute', left: 0, top: '0.25rem', color: '#10ac8b', fontSize: '0.9rem' }}></i>
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas for Improvement */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              padding: '2rem',
              border: '2px solid #fef3c7'
            }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: '#f59e0b', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <i className="fas fa-lightbulb"></i>
                Areas for Improvement
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', listStyle: 'none' }}>
                {gradingResult?.improvements.map((improvement, index) => (
                  <li key={index} style={{ marginBottom: '1rem', color: '#2d3748', fontSize: '1rem', lineHeight: 1.6, position: 'relative', paddingLeft: '1.5rem' }}>
                    <i className="fas fa-arrow-right" style={{ position: 'absolute', left: 0, top: '0.25rem', color: '#f59e0b', fontSize: '0.9rem' }}></i>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question-by-Question Results */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2.5rem'
          }}>
            <h3 style={{ margin: '0 0 2rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              Detailed Question Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {gradingResult?.questionResults.map((question) => (
                <div
                  key={question.questionNumber}
                  style={{
                    padding: '1.5rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: `2px solid ${question.isCorrect ? '#d1fae5' : '#fee2e2'}`,
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: question.isCorrect ? '#10ac8b' : '#dc3545',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <i className={`fas fa-${question.isCorrect ? 'check' : 'times'}`} style={{ fontSize: '1.5rem', color: 'white' }}></i>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.25rem' }}>
                          Question {question.questionNumber}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                          {question.points}/{question.maxPoints} points
                        </div>
                      </div>
                    </div>
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: question.isCorrect ? '#d1fae5' : '#fee2e2',
                      color: question.isCorrect ? '#065f46' : '#991b1b',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.95rem'
                    }}>
                      {question.isCorrect ? 'Correct' : 'Incorrect'}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      Student Answer
                    </div>
                    <div style={{ fontSize: '1rem', color: '#2d3748', padding: '0.75rem 1rem', background: 'white', borderRadius: '8px' }}>
                      {question.studentAnswer}
                    </div>
                  </div>

                  {!question.isCorrect && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Correct Answer
                      </div>
                      <div style={{ fontSize: '1rem', color: '#10ac8b', fontWeight: 600, padding: '0.75rem 1rem', background: 'white', borderRadius: '8px', border: '2px solid #d1fae5' }}>
                        {question.correctAnswer}
                      </div>
                    </div>
                  )}

                  <div style={{
                    padding: '1rem',
                    background: 'white',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${question.isCorrect ? '#10ac8b' : '#f59e0b'}`
                  }}>
                    <div style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                      <i className="fas fa-comment"></i> Feedback
                    </div>
                    <div style={{ fontSize: '1rem', color: '#2d3748', lineHeight: 1.6 }}>
                      {question.feedback}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OCRCorrection;
