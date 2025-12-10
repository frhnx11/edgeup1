import { useState } from 'react';

type CorrectionMode = 'MCQ' | 'Descriptive';

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

const AnswerCorrection = () => {
  const [activeMode, setActiveMode] = useState<CorrectionMode>('MCQ');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [answerKeyFile, setAnswerKeyFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [examName, setExamName] = useState('');
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');
  const [isGraded, setIsGraded] = useState(false);
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);

  const subjects = ['General Studies Paper 1', 'General Studies Paper 2', 'General Studies Paper 3', 'General Studies Paper 4 (Ethics)', 'CSAT (Prelims Paper 2)', 'Essay Writing', 'Current Affairs', 'Optional - History', 'Optional - Geography', 'Optional - Public Administration', 'Optional - Political Science', 'Optional - Sociology'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
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

    // Simulation of processing steps based on mode
    const steps = getProcessingSteps(activeMode);

    for (let i = 0; i < steps.length; i++) {
      setProcessingStep(steps[i]);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }

    // Mock result based on mode
    const mockResult = getMockResult(activeMode);
    setGradingResult(mockResult);
    setIsGraded(true);
    setIsProcessing(false);
  };

  const getProcessingSteps = (mode: CorrectionMode): string[] => {
    switch (mode) {
      case 'MCQ':
        return [
          'Extracting multiple choice answers...',
          'Cross-checking with answer key...',
          'Calculating correct responses...',
          'Generating performance report...'
        ];
      case 'Descriptive':
        return [
          'Analyzing descriptive answers...',
          'Evaluating content quality...',
          'Checking key points coverage...',
          'Generating AI feedback...'
        ];
    }
  };

  const getMockResult = (mode: CorrectionMode): GradingResult => {
    const baseResult = {
      totalScore: 85,
      maxScore: 100,
      percentage: 85,
      grade: 'B',
      overallFeedback: `Good performance on ${mode} test. Keep up the excellent work!`,
      strengths: ['Strong conceptual understanding', 'Clear presentation'],
      improvements: ['Work on time management', 'Practice more complex problems']
    };

    let questionResults: QuestionResult[] = [];

    switch (mode) {
      case 'MCQ':
        questionResults = [
          { questionNumber: 1, isCorrect: true, studentAnswer: 'Option B', correctAnswer: 'Option B', feedback: 'Excellent! Correct answer.', points: 5, maxPoints: 5 },
          { questionNumber: 2, isCorrect: false, studentAnswer: 'Option A', correctAnswer: 'Option C', feedback: 'Incorrect. Review the concept of cellular respiration.', points: 0, maxPoints: 5 }
        ];
        break;

      case 'Descriptive':
        questionResults = [
          {
            questionNumber: 1,
            isCorrect: true,
            studentAnswer: 'Climate change affects ecosystems through temperature rise, habitat loss, and species extinction...',
            correctAnswer: 'Expected key points: temperature increase, ecosystem disruption, biodiversity loss',
            feedback: 'Excellent answer! You covered all key points with good examples and clear explanation. Well-structured response.',
            points: 18,
            maxPoints: 20
          },
          {
            questionNumber: 2,
            isCorrect: false,
            studentAnswer: 'Renewable energy is good for environment.',
            correctAnswer: 'Expected detailed explanation of types, benefits, and implementation',
            feedback: 'Your answer is too brief. Please provide more detail about types of renewable energy, their specific benefits, and how they can be implemented. Include examples.',
            points: 5,
            maxPoints: 20
          }
        ];
        break;
    }

    return { ...baseResult, questionResults };
  };

  const resetForm = () => {
    setUploadedFile(null);
    setUploadedImage(null);
    setAnswerKeyFile(null);
    setSubject('');
    setExamName('');
    setTopic('');
    setIsGraded(false);
    setGradingResult(null);
    setIsProcessing(false);
    setProcessingStep('');
  };

  const getModeDescription = (mode: CorrectionMode): string => {
    switch (mode) {
      case 'MCQ':
        return 'Auto-evaluate multiple choice questions with instant feedback and analysis';
      case 'Descriptive':
        return 'AI-powered evaluation of descriptive/essay-type answers with detailed feedback';
    }
  };

  const getModeIcon = (mode: CorrectionMode): string => {
    switch (mode) {
      case 'MCQ':
        return 'fa-list-ul';
      case 'Descriptive':
        return 'fa-align-left';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>Answer Correction 📝</h1>
            <p>Automated grading with AI-powered feedback for all answer types</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clipboard-check"></i>
            </div>
            <div className="stat-info">
              <h4>Tests Graded</h4>
              <p className="stat-value">
                124 <span className="stat-total">this month</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '75%' }}></div>
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
                ~45 <span className="stat-total">hours</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-info">
              <h4>Avg Accuracy</h4>
              <p className="stat-value">
                98% <span className="stat-total">success rate</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '98%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selection */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', borderBottom: '2px solid #e2e8f0' }}>
          {(['MCQ', 'Descriptive'] as CorrectionMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => {
                setActiveMode(mode);
                resetForm();
              }}
              style={{
                padding: '1.5rem',
                background: activeMode === mode ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                color: activeMode === mode ? 'white' : '#4a5568',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className={`fas ${getModeIcon(mode)}`} style={{ fontSize: '1.5rem' }}></i>
              {mode}
            </button>
          ))}
        </div>

        {/* Mode Description */}
        <div style={{ padding: '1rem 1.5rem', background: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
          <p style={{ margin: 0, color: '#4a5568', fontSize: '0.9rem', textAlign: 'center' }}>
            <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
            {getModeDescription(activeMode)}
          </p>
        </div>
      </div>

      {/* Upload Section */}
      {!isGraded && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-upload" style={{ marginRight: '0.75rem', color: '#667eea' }}></i>
            Upload {activeMode} Answer Sheet
          </h2>

          {/* Subject Selection */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-book"></i> Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer'
              }}
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Exam Name */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-graduation-cap"></i> Exam Name
            </label>
            <input
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              placeholder="e.g., UPSC Prelims 2025"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                outline: 'none'
              }}
            />
          </div>

          {/* Topic */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-tags"></i> Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Indian History"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                outline: 'none'
              }}
            />
          </div>

          {/* File Upload */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-file-upload"></i> Upload Answer Sheet
            </label>
            <div style={{
              border: '2px dashed #cbd5e0',
              borderRadius: '8px',
              padding: '2rem',
              textAlign: 'center',
              background: '#f7fafc',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                const file = e.dataTransfer.files[0];
                setUploadedFile(file);
                const reader = new FileReader();
                reader.onloadend = () => setUploadedImage(reader.result as string);
                reader.readAsDataURL(file);
              }
            }}
            >
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                {uploadedFile ? (
                  <>
                    <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: '#10b981', marginBottom: '1rem' }}></i>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontWeight: 600 }}>
                      {uploadedFile.name}
                    </p>
                    <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                      Click to change file
                    </p>
                  </>
                ) : (
                  <>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '3rem', color: '#667eea', marginBottom: '1rem' }}></i>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontWeight: 600 }}>
                      Drag and drop your file here
                    </p>
                    <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                      or click to browse (JPG, PNG, PDF)
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Answer Key Upload (for MCQ mode) */}
          {activeMode === 'MCQ' && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                <i className="fas fa-key"></i> Upload Answer Key (Optional)
              </label>
              <input
                type="file"
                accept=".pdf,.txt,.csv"
                onChange={handleAnswerKeyUpload}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              />
              {answerKeyFile && (
                <p style={{ margin: '0.5rem 0 0 0', color: '#10b981', fontSize: '0.875rem' }}>
                  <i className="fas fa-check"></i> {answerKeyFile.name}
                </p>
              )}
            </div>
          )}

          {/* Preview uploaded image */}
          {uploadedImage && (
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                <i className="fas fa-eye"></i> Preview
              </label>
              <div style={{ maxHeight: '300px', overflow: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <img src={uploadedImage} alt="Uploaded answer sheet" style={{ width: '100%', display: 'block' }} />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={handleScanAndGrade}
              disabled={!uploadedFile || !subject || !examName || !topic || isProcessing}
              style={{
                flex: 1,
                padding: '1rem',
                background: (!uploadedFile || !subject || !examName || !topic || isProcessing) ? '#cbd5e0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: (!uploadedFile || !subject || !examName || !topic || isProcessing) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {isProcessing ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  {processingStep}
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i>
                  Scan & Grade with AI
                </>
              )}
            </button>

            <button
              onClick={resetForm}
              style={{
                padding: '1rem 2rem',
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                color: '#4a5568',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <i className="fas fa-redo"></i> Reset
            </button>
          </div>
        </div>
      )}

      {/* Grading Results */}
      {isGraded && gradingResult && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-chart-bar" style={{ marginRight: '0.75rem', color: '#667eea' }}></i>
              Grading Results - {activeMode} Mode
            </h2>
            <button
              onClick={resetForm}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              <i className="fas fa-plus"></i> Grade Another
            </button>
          </div>

          {/* Score Summary */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            padding: '2rem',
            color: 'white',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              {gradingResult.percentage}%
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Grade: {gradingResult.grade}
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>
              Score: {gradingResult.totalScore} / {gradingResult.maxScore} points
            </div>
          </div>

          {/* Overall Feedback */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.2rem', fontWeight: 600 }}>
              <i className="fas fa-comment-alt" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
              Overall Feedback
            </h3>
            <p style={{ margin: 0, color: '#4a5568', lineHeight: 1.6 }}>
              {gradingResult.overallFeedback}
            </p>
          </div>

          {/* Strengths & Improvements */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ padding: '1.5rem', background: '#d1fae5', borderRadius: '12px', border: '2px solid #10b981' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#065f46', fontSize: '1.1rem', fontWeight: 600 }}>
                <i className="fas fa-star" style={{ marginRight: '0.5rem' }}></i>
                Strengths
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#047857' }}>
                {gradingResult.strengths.map((strength, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{strength}</li>
                ))}
              </ul>
            </div>
            <div style={{ padding: '1.5rem', background: '#fef3c7', borderRadius: '12px', border: '2px solid #f59e0b' }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#92400e', fontSize: '1.1rem', fontWeight: 600 }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '0.5rem' }}></i>
                Areas for Improvement
              </h4>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#b45309' }}>
                {gradingResult.improvements.map((improvement, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem' }}>{improvement}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Question by Question Results */}
          <div>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.2rem', fontWeight: 600 }}>
              <i className="fas fa-list-ol" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
              Question-by-Question Analysis
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {gradingResult.questionResults.map((result) => (
                <div
                  key={result.questionNumber}
                  style={{
                    padding: '1.5rem',
                    background: result.isCorrect ? '#f0fdf4' : '#fef2f2',
                    border: `2px solid ${result.isCorrect ? '#10b981' : '#ef4444'}`,
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h4 style={{ margin: 0, color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>
                      Question {result.questionNumber}
                    </h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{
                        padding: '0.375rem 0.75rem',
                        background: result.isCorrect ? '#10b981' : '#ef4444',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        {result.points} / {result.maxPoints} pts
                      </span>
                      <i className={`fas ${result.isCorrect ? 'fa-check-circle' : 'fa-times-circle'}`}
                        style={{ fontSize: '1.5rem', color: result.isCorrect ? '#10b981' : '#ef4444' }}
                      ></i>
                    </div>
                  </div>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: '#4a5568' }}>Your Answer:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#2d3748' }}>{result.studentAnswer}</p>
                  </div>
                  {!result.isCorrect && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <strong style={{ color: '#4a5568' }}>Correct Answer:</strong>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#2d3748' }}>{result.correctAnswer}</p>
                    </div>
                  )}
                  <div>
                    <strong style={{ color: '#4a5568' }}>Feedback:</strong>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#2d3748', lineHeight: 1.6 }}>{result.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnswerCorrection;
