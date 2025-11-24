import { useState } from 'react';
import {
  generateQuestionPaperPDF,
  generateAnswerKeyPDF,
  generateMarkingSchemePDF
} from '../../services/questionPaperPdfGenerator';

interface ManualQuestionGeneratorProps {
  onBack?: () => void;
}

interface Question {
  id: string;
  type: 'mcq' | 'short' | 'long';
  question: string;
  marks: number;
  options?: string[];
  answer: string;
}

interface FormData {
  subject: string;
  grade: string;
  topic: string;
  totalMarks: string;
  duration: string;
}

const ManualQuestionGenerator = ({ onBack }: ManualQuestionGeneratorProps) => {
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    grade: '10th Standard',
    topic: '',
    totalMarks: '100',
    duration: '3 hours'
  });

  const [questions, setQuestions] = useState<Question[]>([]);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [showMarkingScheme, setShowMarkingScheme] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
    type: 'short',
    question: '',
    marks: 2,
    options: ['', '', '', ''],
    answer: ''
  });

  const subjects = ['Tamil', 'English', 'Mathematics', 'Science', 'Social Science'];
  const totalMarksOptions = ['50', '75', '100'];
  const durationOptions = ['2 hours', '2.5 hours', '3 hours', '3.5 hours'];

  const questionTypes = [
    { value: 'mcq', label: 'Multiple Choice (MCQ)', icon: 'list-ul' },
    { value: 'short', label: 'Short Answer', icon: 'align-left' },
    { value: 'long', label: 'Long Answer', icon: 'align-justify' }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question || !newQuestion.answer) {
      alert('Please fill in question and answer fields');
      return;
    }

    const question: Question = {
      id: Date.now().toString(),
      type: newQuestion.type as 'mcq' | 'short' | 'long',
      question: newQuestion.question,
      marks: newQuestion.marks || 2,
      options: newQuestion.type === 'mcq' ? newQuestion.options : undefined,
      answer: newQuestion.answer
    };

    setQuestions([...questions, question]);
    setNewQuestion({
      type: 'short',
      question: '',
      marks: 2,
      options: ['', '', '', ''],
      answer: ''
    });
    setShowAddQuestion(false);
  };

  const handleUpdateQuestion = () => {
    if (!editingQuestion || !editingQuestion.question || !editingQuestion.answer) {
      alert('Please fill in question and answer fields');
      return;
    }

    setQuestions(questions.map(q => q.id === editingQuestion.id ? editingQuestion : q));
    setEditingQuestion(null);
  };

  const handleDeleteQuestion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const calculateTotalMarks = () => {
    return questions.reduce((sum, q) => sum + q.marks, 0);
  };

  const handleDownloadPDF = () => {
    if (questions.length === 0) {
      alert('Please add questions before downloading PDF');
      return;
    }

    const paperData = {
      subject: formData.subject,
      grade: formData.grade,
      topic: formData.topic,
      totalMarks: formData.totalMarks,
      duration: formData.duration,
      questions: questions
    };

    // Download the appropriate PDF based on current view
    if (showAnswerKey) {
      generateAnswerKeyPDF(paperData);
    } else if (showMarkingScheme) {
      generateMarkingSchemePDF(paperData);
    } else {
      generateQuestionPaperPDF(paperData);
    }
  };

  const isFormComplete = formData.subject && formData.topic;
  const currentTotalMarks = calculateTotalMarks();
  const targetMarks = parseInt(formData.totalMarks);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)'
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
          <i className="fas fa-arrow-left"></i> Back
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
            <i className="fas fa-edit" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Manual Question Generator
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Create custom question papers with full control • TN Board 10th Standard
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        {/* Left Sidebar - Form */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#1a202c', fontSize: '1.25rem', fontWeight: 700 }}>
              <i className="fas fa-info-circle" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
              Paper Details
            </h3>

            {/* Subject */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: 600 }}>
                Subject *
              </label>
              <select
                value={formData.subject}
                onChange={(e) => handleInputChange('subject', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.95rem',
                  color: '#2d3748',
                  background: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <option value="">Select Subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>

            {/* Grade */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: 600 }}>
                Grade
              </label>
              <input
                type="text"
                value={formData.grade}
                readOnly
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.95rem',
                  color: '#718096',
                  background: '#f7fafc',
                  cursor: 'not-allowed'
                }}
              />
            </div>

            {/* Topic */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: 600 }}>
                Topic/Chapter *
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={(e) => handleInputChange('topic', e.target.value)}
                placeholder="e.g., Polynomials, Photosynthesis"
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.95rem',
                  color: '#2d3748',
                  transition: 'all 0.2s'
                }}
              />
            </div>

            {/* Total Marks */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: 600 }}>
                Total Marks
              </label>
              <select
                value={formData.totalMarks}
                onChange={(e) => handleInputChange('totalMarks', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.95rem',
                  color: '#2d3748',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                {totalMarksOptions.map(marks => (
                  <option key={marks} value={marks}>{marks}</option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.95rem', fontWeight: 600 }}>
                Duration
              </label>
              <select
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  borderRadius: '10px',
                  border: '2px solid #e2e8f0',
                  fontSize: '0.95rem',
                  color: '#2d3748',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            {/* Marks Summary */}
            <div style={{
              background: currentTotalMarks === targetMarks ? '#d1fae5' : '#fef3c7',
              border: `2px solid ${currentTotalMarks === targetMarks ? '#10b981' : '#f59e0b'}`,
              borderRadius: '10px',
              padding: '1rem',
              marginTop: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>Current Total:</span>
                <span style={{ color: '#1a202c', fontSize: '1.25rem', fontWeight: 700 }}>{currentTotalMarks} marks</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>Target:</span>
                <span style={{ color: '#1a202c', fontSize: '1rem', fontWeight: 600 }}>{targetMarks} marks</span>
              </div>
              {currentTotalMarks !== targetMarks && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <span style={{ color: '#d97706', fontSize: '0.85rem', fontWeight: 600 }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '0.25rem' }}></i>
                    {currentTotalMarks < targetMarks
                      ? `Add ${targetMarks - currentTotalMarks} more marks`
                      : `Remove ${currentTotalMarks - targetMarks} marks`}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Content - Questions */}
        <div>
          {/* Action Buttons */}
          {questions.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '1rem',
              marginBottom: '2rem'
            }}>
              {[
                { icon: 'file-alt', label: 'Question Paper', color: '#10b981', active: !showAnswerKey && !showMarkingScheme, onClick: () => { setShowAnswerKey(false); setShowMarkingScheme(false); } },
                { icon: 'key', label: 'Answer Key', color: '#3b82f6', active: showAnswerKey, onClick: () => { setShowAnswerKey(true); setShowMarkingScheme(false); } },
                { icon: 'clipboard-check', label: 'Marking Scheme', color: '#8b5cf6', active: showMarkingScheme, onClick: () => { setShowAnswerKey(false); setShowMarkingScheme(true); } },
                { icon: 'download', label: 'Download PDF', color: '#094d88', onClick: handleDownloadPDF },
                { icon: 'save', label: 'Save', color: '#10ac8b', onClick: () => alert('Save functionality coming soon!') }
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
                    gap: '0.75rem'
                  }}
                  onMouseEnter={(e) => {
                    if (!action.active) {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = `0 8px 25px ${action.color}40`;
                      e.currentTarget.style.borderColor = action.color;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!action.active) {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                    }
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
                    <i className={`fas fa-${action.icon}`} style={{ fontSize: '1.5rem', color: action.color }}></i>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#2d3748' }}>
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Questions List / Preview */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            minHeight: '500px'
          }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ margin: 0, color: '#1a202c', fontSize: '1.25rem', fontWeight: 700 }}>
                <i className="fas fa-list" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                {showAnswerKey ? 'Answer Key' : showMarkingScheme ? 'Marking Scheme' : 'Questions'}
                <span style={{
                  marginLeft: '0.75rem',
                  fontSize: '0.9rem',
                  color: '#718096',
                  fontWeight: 500
                }}>
                  ({questions.length} {questions.length === 1 ? 'question' : 'questions'})
                </span>
              </h3>

              {!showAnswerKey && !showMarkingScheme && (
                <button
                  onClick={() => setShowAddQuestion(true)}
                  disabled={!isFormComplete}
                  style={{
                    background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 1.75rem',
                    borderRadius: '10px',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    cursor: isFormComplete ? 'pointer' : 'not-allowed',
                    opacity: isFormComplete ? 1 : 0.5,
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => {
                    if (isFormComplete) {
                      e.currentTarget.style.transform = 'scale(1.05)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  <i className="fas fa-plus"></i>
                  Add Question
                </button>
              )}
            </div>

            {/* Empty State */}
            {questions.length === 0 && !showAddQuestion && (
              <div style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: '#718096'
              }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  margin: '0 auto 1.5rem',
                  borderRadius: '50%',
                  background: '#f7fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <i className="fas fa-question-circle" style={{ fontSize: '4rem', color: '#cbd5e0' }}></i>
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                  No Questions Yet
                </h3>
                <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '0.95rem' }}>
                  {!isFormComplete
                    ? 'Fill in the paper details to start adding questions'
                    : 'Click "Add Question" to create your first question'}
                </p>
                {isFormComplete && (
                  <button
                    onClick={() => setShowAddQuestion(true)}
                    style={{
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.875rem 1.75rem',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                  >
                    <i className="fas fa-plus" style={{ marginRight: '0.5rem' }}></i>
                    Add Your First Question
                  </button>
                )}
              </div>
            )}

            {/* Add/Edit Question Form */}
            {(showAddQuestion || editingQuestion) && (
              <div style={{
                background: '#f7fafc',
                borderRadius: '12px',
                padding: '2rem',
                marginBottom: '2rem',
                border: '2px solid #e2e8f0'
              }}>
                <h4 style={{ margin: '0 0 1.5rem 0', color: '#1a202c', fontSize: '1.1rem', fontWeight: 700 }}>
                  <i className="fas fa-plus-circle" style={{ color: '#10b981', marginRight: '0.5rem' }}></i>
                  {editingQuestion ? 'Edit Question' : 'Add New Question'}
                </h4>

                {/* Question Type */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>
                    Question Type
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                    {questionTypes.map(type => (
                      <button
                        key={type.value}
                        onClick={() => {
                          if (editingQuestion) {
                            setEditingQuestion({
                              ...editingQuestion,
                              type: type.value as 'mcq' | 'short' | 'long',
                              options: type.value === 'mcq' ? ['', '', '', ''] : undefined
                            });
                          } else {
                            setNewQuestion({
                              ...newQuestion,
                              type: type.value as 'mcq' | 'short' | 'long',
                              options: type.value === 'mcq' ? ['', '', '', ''] : undefined
                            });
                          }
                        }}
                        style={{
                          background: (editingQuestion?.type || newQuestion.type) === type.value ? '#10b98115' : 'white',
                          border: `2px solid ${(editingQuestion?.type || newQuestion.type) === type.value ? '#10b981' : '#e2e8f0'}`,
                          borderRadius: '8px',
                          padding: '0.75rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <i className={`fas fa-${type.icon}`} style={{
                          color: (editingQuestion?.type || newQuestion.type) === type.value ? '#10b981' : '#718096'
                        }}></i>
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          color: (editingQuestion?.type || newQuestion.type) === type.value ? '#10b981' : '#4a5568'
                        }}>
                          {type.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question Text */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>
                    Question *
                  </label>
                  <textarea
                    value={editingQuestion?.question || newQuestion.question}
                    onChange={(e) => {
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, question: e.target.value });
                      } else {
                        setNewQuestion({ ...newQuestion, question: e.target.value });
                      }
                    }}
                    placeholder="Enter your question here..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* MCQ Options */}
                {(editingQuestion?.type === 'mcq' || newQuestion.type === 'mcq') && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>
                      Options (for MCQ)
                    </label>
                    {(editingQuestion?.options || newQuestion.options || []).map((option, index) => (
                      <input
                        key={index}
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(editingQuestion?.options || newQuestion.options || [])];
                          newOptions[index] = e.target.value;
                          if (editingQuestion) {
                            setEditingQuestion({ ...editingQuestion, options: newOptions });
                          } else {
                            setNewQuestion({ ...newQuestion, options: newOptions });
                          }
                        }}
                        placeholder={`Option ${index + 1}`}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '2px solid #e2e8f0',
                          fontSize: '0.9rem',
                          color: '#2d3748',
                          marginBottom: '0.5rem'
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Marks */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>
                    Marks *
                  </label>
                  <input
                    type="number"
                    value={editingQuestion?.marks || newQuestion.marks}
                    onChange={(e) => {
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, marks: parseInt(e.target.value) || 0 });
                      } else {
                        setNewQuestion({ ...newQuestion, marks: parseInt(e.target.value) || 0 });
                      }
                    }}
                    min="1"
                    max="20"
                    style={{
                      width: '150px',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                      fontSize: '0.95rem',
                      color: '#2d3748'
                    }}
                  />
                </div>

                {/* Answer */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>
                    Answer *
                  </label>
                  <textarea
                    value={editingQuestion?.answer || newQuestion.answer}
                    onChange={(e) => {
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, answer: e.target.value });
                      } else {
                        setNewQuestion({ ...newQuestion, answer: e.target.value });
                      }
                    }}
                    placeholder="Enter the answer or answer key..."
                    rows={2}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      borderRadius: '8px',
                      border: '2px solid #e2e8f0',
                      fontSize: '0.95rem',
                      color: '#2d3748',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={editingQuestion ? handleUpdateQuestion : handleAddQuestion}
                    style={{
                      background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.875rem 1.75rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      flex: 1
                    }}
                  >
                    <i className={`fas fa-${editingQuestion ? 'check' : 'plus'}`} style={{ marginRight: '0.5rem' }}></i>
                    {editingQuestion ? 'Update Question' : 'Add Question'}
                  </button>
                  <button
                    onClick={() => {
                      setShowAddQuestion(false);
                      setEditingQuestion(null);
                      setNewQuestion({
                        type: 'short',
                        question: '',
                        marks: 2,
                        options: ['', '', '', ''],
                        answer: ''
                      });
                    }}
                    style={{
                      background: 'white',
                      color: '#718096',
                      border: '2px solid #e2e8f0',
                      padding: '0.875rem 1.75rem',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Questions List */}
            {questions.length > 0 && !showAnswerKey && !showMarkingScheme && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    style={{
                      background: '#f7fafc',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '2px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{
                            background: '#10b981',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700
                          }}>
                            Q{index + 1}
                          </span>
                          <span style={{
                            background: 'white',
                            color: '#718096',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            border: '1px solid #e2e8f0'
                          }}>
                            {questionTypes.find(t => t.value === question.type)?.label}
                          </span>
                          <span style={{
                            background: '#10b98115',
                            color: '#10b981',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700
                          }}>
                            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                          </span>
                        </div>
                        <p style={{ margin: '0', color: '#2d3748', fontSize: '0.95rem', lineHeight: 1.6, fontWeight: 500 }}>
                          {question.question}
                        </p>
                        {question.type === 'mcq' && question.options && (
                          <div style={{ marginTop: '0.75rem', paddingLeft: '1rem' }}>
                            {question.options.map((option, i) => (
                              <div key={i} style={{ color: '#4a5568', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                {String.fromCharCode(97 + i)}) {option}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                        <button
                          onClick={() => setEditingQuestion(question)}
                          style={{
                            background: 'white',
                            border: '2px solid #3b82f6',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            color: '#3b82f6',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#3b82f615';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question.id)}
                          style={{
                            background: 'white',
                            border: '2px solid #ef4444',
                            borderRadius: '8px',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            color: '#ef4444',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ef444415';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Key View */}
            {showAnswerKey && questions.length > 0 && (
              <div>
                <div style={{
                  background: '#dbeafe',
                  border: '2px solid #3b82f6',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#1e40af', fontSize: '1.1rem', fontWeight: 700 }}>
                    <i className="fas fa-key" style={{ marginRight: '0.5rem' }}></i>
                    Answer Key
                  </h4>
                  <p style={{ margin: 0, color: '#1e40af', fontSize: '0.9rem' }}>
                    {formData.subject} • {formData.grade} • {formData.topic}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      style={{
                        background: '#f7fafc',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '2px solid #e2e8f0'
                      }}
                    >
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{
                          background: '#3b82f6',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          marginRight: '0.5rem'
                        }}>
                          Q{index + 1}
                        </span>
                        <span style={{ color: '#2d3748', fontSize: '0.9rem', fontWeight: 500 }}>
                          {question.question.substring(0, 100)}{question.question.length > 100 ? '...' : ''}
                        </span>
                      </div>
                      <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '1rem',
                        borderLeft: '4px solid #3b82f6'
                      }}>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <span style={{ color: '#718096', fontSize: '0.85rem', fontWeight: 600 }}>Answer:</span>
                        </div>
                        <p style={{ margin: 0, color: '#2d3748', fontSize: '0.95rem', lineHeight: 1.6 }}>
                          {question.answer}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Marking Scheme View */}
            {showMarkingScheme && questions.length > 0 && (
              <div>
                <div style={{
                  background: '#ede9fe',
                  border: '2px solid #8b5cf6',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem'
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#6b21a8', fontSize: '1.1rem', fontWeight: 700 }}>
                    <i className="fas fa-clipboard-check" style={{ marginRight: '0.5rem' }}></i>
                    Marking Scheme
                  </h4>
                  <p style={{ margin: 0, color: '#6b21a8', fontSize: '0.9rem' }}>
                    {formData.subject} • {formData.grade} • Total: {currentTotalMarks} marks
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      style={{
                        background: '#f7fafc',
                        borderRadius: '12px',
                        padding: '1.5rem',
                        border: '2px solid #e2e8f0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                        <div>
                          <span style={{
                            background: '#8b5cf6',
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            marginRight: '0.5rem'
                          }}>
                            Q{index + 1}
                          </span>
                          <span style={{ color: '#2d3748', fontSize: '0.9rem', fontWeight: 500 }}>
                            {question.question.substring(0, 100)}{question.question.length > 100 ? '...' : ''}
                          </span>
                        </div>
                        <span style={{
                          background: '#8b5cf615',
                          color: '#8b5cf6',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 700,
                          whiteSpace: 'nowrap'
                        }}>
                          {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                        </span>
                      </div>
                      <div style={{
                        background: 'white',
                        borderRadius: '8px',
                        padding: '1rem',
                        borderLeft: '4px solid #8b5cf6'
                      }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <span style={{ color: '#718096', fontSize: '0.85rem', fontWeight: 600 }}>Marking Criteria:</span>
                        </div>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#4a5568', fontSize: '0.9rem', lineHeight: 1.8 }}>
                          <li>Complete and accurate answer: {question.marks} marks</li>
                          {question.marks >= 3 && (
                            <>
                              <li>Partially correct answer: {Math.ceil(question.marks / 2)} marks</li>
                              <li>Attempt with relevant points: {Math.ceil(question.marks / 4)} marks</li>
                            </>
                          )}
                          {question.type === 'mcq' && <li>Incorrect answer or no attempt: 0 marks</li>}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary */}
                <div style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginTop: '1.5rem',
                  border: '2px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1rem', fontWeight: 700 }}>
                    Distribution Summary
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    {Object.entries(
                      questions.reduce((acc, q) => {
                        const label = questionTypes.find(t => t.value === q.type)?.label || q.type;
                        acc[label] = (acc[label] || 0) + q.marks;
                        return acc;
                      }, {} as Record<string, number>)
                    ).map(([type, marks]) => (
                      <div
                        key={type}
                        style={{
                          background: '#f7fafc',
                          borderRadius: '8px',
                          padding: '1rem',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ color: '#718096', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                          {type}
                        </div>
                        <div style={{ color: '#8b5cf6', fontSize: '1.5rem', fontWeight: 700 }}>
                          {marks}
                        </div>
                        <div style={{ color: '#718096', fontSize: '0.8rem' }}>marks</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualQuestionGenerator;
