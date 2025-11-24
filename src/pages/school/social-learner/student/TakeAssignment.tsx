/**
 * TakeAssignment Component
 * Student interface for taking online assignments
 */

import { useState, useEffect } from 'react';
import type { Assignment, Question, StudentAnswer } from '../../../../types/assignment.types';
import { submitAssignment, saveDraftAnswers, loadDraftAnswers, hasSubmitted, getStudentSubmission } from '../../../../services/submissionService';
import { calculatePercentage, getGradeLetter, generatePerformanceFeedback, getAnswerStatistics } from '../../../../utils/autoGrading';

interface TakeAssignmentProps {
  assignment: Assignment;
  onBack: () => void;
  studentId?: string;
  studentName?: string;
}

const TakeAssignment = ({ assignment, onBack, studentId = 'student_1', studentName = 'Student' }: TakeAssignmentProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showAllQuestions, setShowAllQuestions] = useState(false);

  const questions = assignment.questions || [];

  useEffect(() => {
    // Check if already submitted
    if (hasSubmitted(assignment.id, studentId)) {
      const submission = getStudentSubmission(assignment.id, studentId);
      setIsSubmitted(true);
      setSubmissionResult(submission);
      setAnswers(submission?.answers || []);
      return;
    }

    // Load draft answers
    const draft = loadDraftAnswers(assignment.id);
    if (draft && draft.length > 0) {
      setAnswers(draft);
    } else {
      // Initialize empty answers
      const initialAnswers: StudentAnswer[] = questions.map(q => ({
        questionId: q.id,
        answer: ''
      }));
      setAnswers(initialAnswers);
    }

    // Setup timer if duration is specified
    if (assignment.duration) {
      setTimeRemaining(assignment.duration * 60); // Convert to seconds
    }
  }, [assignment.id, assignment.duration, questions, studentId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0 || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          // Time's up - auto submit
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, isSubmitted]);

  // Auto-save draft answers
  useEffect(() => {
    if (!isSubmitted && answers.length > 0) {
      const debounce = setTimeout(() => {
        saveDraftAnswers(assignment.id, answers);
      }, 1000);

      return () => clearTimeout(debounce);
    }
  }, [answers, assignment.id, isSubmitted]);

  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers(prev => {
      const index = prev.findIndex(a => a.questionId === questionId);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = { ...updated[index], answer };
        return updated;
      }
      return [...prev, { questionId, answer }];
    });
  };

  const handleSubmit = () => {
    if (window.confirm('Are you sure you want to submit? You cannot change your answers after submission.')) {
      const submission = submitAssignment(assignment, studentId, studentName, answers);
      setIsSubmitted(true);
      setSubmissionResult(submission);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.questionId === currentQuestion?.id);

  // Submitted View
  if (isSubmitted && submissionResult) {
    const stats = getAnswerStatistics(questions, submissionResult.answers);
    const percentage = submissionResult.totalScore !== undefined
      ? calculatePercentage(submissionResult.totalScore, assignment.totalMarks)
      : 0;

    return (
      <>
        <button
          onClick={onBack}
          style={{
            marginBottom: '2rem',
            background: 'white',
            color: '#094d88',
            border: '2px solid #094d88',
            borderRadius: '10px',
            padding: '0.75rem 1.25rem',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <i className="fas fa-arrow-left"></i>
          Back to Assignments
        </button>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          maxWidth: '900px',
          margin: '0 auto'
        }}>
          {/* Success Header */}
          <div style={{
            background: submissionResult.totalScore !== undefined ? 'linear-gradient(135deg, #10ac8b 0%, #094d88 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            borderRadius: '12px',
            marginBottom: '2rem',
            color: 'white',
            textAlign: 'center'
          }}>
            <i className="fas fa-check-circle" style={{ fontSize: '3rem', marginBottom: '1rem' }}></i>
            <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.75rem' }}>Assignment Submitted!</h2>
            <p style={{ margin: 0, opacity: 0.9 }}>
              Submitted on {new Date(submissionResult.submittedAt).toLocaleString()}
            </p>
          </div>

          {/* Score Display */}
          {submissionResult.totalScore !== undefined ? (
            <div style={{
              background: '#f7fafc',
              padding: '2rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Your Score</h3>
              <div style={{ fontSize: '3rem', fontWeight: 700, color: '#10ac8b', marginBottom: '0.5rem' }}>
                {submissionResult.totalScore} / {assignment.totalMarks}
              </div>
              <div style={{ fontSize: '1.5rem', color: '#667eea', marginBottom: '1rem' }}>
                {percentage}% - Grade: {getGradeLetter(percentage)}
              </div>
              <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
                {generatePerformanceFeedback(percentage, submissionResult.status === 'graded')}
              </p>
            </div>
          ) : (
            <div style={{
              background: '#fef3c7',
              padding: '1.5rem',
              borderRadius: '12px',
              marginBottom: '2rem',
              textAlign: 'center',
              border: '2px solid #f59e0b'
            }}>
              <i className="fas fa-clock" style={{ fontSize: '2rem', color: '#f59e0b', marginBottom: '0.5rem' }}></i>
              <p style={{ margin: 0, color: '#78350f', fontWeight: 600 }}>
                Pending Teacher Review
              </p>
              <p style={{ margin: '0.5rem 0 0 0', color: '#92400e', fontSize: '0.9rem' }}>
                Your teacher will grade this assignment manually
              </p>
            </div>
          )}

          {/* Statistics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
            <div style={{ background: '#dcfce7', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#15803d' }}>{stats.correct}</div>
              <div style={{ fontSize: '0.9rem', color: '#166534' }}>Correct</div>
            </div>
            <div style={{ background: '#fee2e2', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#b91c1c' }}>{stats.incorrect}</div>
              <div style={{ fontSize: '0.9rem', color: '#991b1b' }}>Incorrect</div>
            </div>
            <div style={{ background: '#e0e7ff', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4338ca' }}>{stats.pendingReview}</div>
              <div style={{ fontSize: '0.9rem', color: '#3730a3' }}>Pending Review</div>
            </div>
          </div>

          {/* Review Answers */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748' }}>Review Your Answers</h3>
            {questions.map((question, index) => {
              const answer = submissionResult.answers.find((a: StudentAnswer) => a.questionId === question.id);
              return (
                <div
                  key={question.id}
                  style={{
                    marginBottom: '1.5rem',
                    padding: '1.5rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: `2px solid ${answer?.isCorrect === true ? '#10ac8b' : answer?.isCorrect === false ? '#ef4444' : '#e2e8f0'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 600, color: '#2d3748' }}>
                      Question {index + 1} ({question.marks} marks)
                    </div>
                    {answer?.isCorrect !== undefined && (
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: answer.isCorrect ? '#dcfce7' : '#fee2e2',
                        color: answer.isCorrect ? '#15803d' : '#b91c1c'
                      }}>
                        {answer.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: '0.5rem 0', color: '#2d3748' }}>{question.text}</p>

                  {question.options && (
                    <div style={{ margin: '0.75rem 0' }}>
                      {question.options.map(opt => (
                        <div
                          key={opt}
                          style={{
                            padding: '0.5rem',
                            margin: '0.25rem 0',
                            borderRadius: '6px',
                            background: answer?.answer === opt.charAt(0) ? '#e0f2fe' : 'white',
                            border: question.correctAnswer && opt.startsWith(question.correctAnswer) ? '2px solid #10ac8b' : '1px solid #e2e8f0'
                          }}
                        >
                          {opt}
                          {question.correctAnswer && opt.startsWith(question.correctAnswer) && (
                            <span style={{ marginLeft: '0.5rem', color: '#10ac8b', fontWeight: 600 }}>✓ Correct Answer</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '0.25rem' }}>Your Answer:</div>
                    <div style={{ fontWeight: 600, color: '#2d3748' }}>{answer?.answer || '(No answer)'}</div>
                  </div>

                  {answer?.feedback && (
                    <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#667eea', fontWeight: 500 }}>
                      <i className="fas fa-comment" style={{ marginRight: '0.5rem' }}></i>
                      {answer.feedback}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  // Taking Assignment View
  return (
    <>
      <button
        onClick={onBack}
        style={{
          marginBottom: '2rem',
          background: 'white',
          color: '#094d88',
          border: '2px solid #094d88',
          borderRadius: '10px',
          padding: '0.75rem 1.25rem',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <i className="fas fa-arrow-left"></i>
        Back to Assignments
      </button>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '2rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
          padding: '1.5rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          color: 'white'
        }}>
          <h1 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem' }}>{assignment.title}</h1>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', opacity: 0.9, flexWrap: 'wrap' }}>
            <span><i className="fas fa-book" style={{ marginRight: '0.5rem' }}></i>{assignment.subject}</span>
            <span><i className="fas fa-award" style={{ marginRight: '0.5rem' }}></i>{assignment.totalMarks} marks</span>
            {assignment.duration && (
              <span><i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>{assignment.duration} minutes</span>
            )}
            <span><i className="fas fa-list" style={{ marginRight: '0.5rem' }}></i>{questions.length} questions</span>
          </div>
        </div>

        {/* Timer */}
        {timeRemaining !== null && (
          <div style={{
            background: timeRemaining < 300 ? '#fee2e2' : '#dcfce7',
            padding: '1rem',
            borderRadius: '12px',
            marginBottom: '1.5rem',
            textAlign: 'center',
            border: `2px solid ${timeRemaining < 300 ? '#ef4444' : '#10ac8b'}`
          }}>
            <i className="fas fa-clock" style={{ marginRight: '0.5rem', fontSize: '1.2rem' }}></i>
            <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>
              Time Remaining: {formatTime(timeRemaining)}
            </span>
          </div>
        )}

        {/* Progress */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#718096' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span style={{ fontSize: '0.9rem', color: '#718096' }}>
              {answers.filter(a => a.answer && a.answer.trim() !== '').length} / {questions.length} answered
            </span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                transition: 'width 0.3s'
              }}
            ></div>
          </div>
        </div>

        {/* View Toggle */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <button
            onClick={() => setShowAllQuestions(!showAllQuestions)}
            style={{
              padding: '0.5rem 1rem',
              background: '#f7fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.9rem',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#2d3748'
            }}
          >
            <i className={`fas fa-${showAllQuestions ? 'list' : 'th'}`} style={{ marginRight: '0.5rem' }}></i>
            {showAllQuestions ? 'One at a Time' : 'Show All Questions'}
          </button>
        </div>

        {/* Questions */}
        {showAllQuestions ? (
          // All Questions View
          <div>
            {questions.map((question, index) => {
              const answer = answers.find(a => a.questionId === question.id);
              return (
                <div
                  key={question.id}
                  style={{
                    marginBottom: '2rem',
                    padding: '1.5rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d3748', marginBottom: '1rem' }}>
                    Question {index + 1} ({question.marks} marks)
                  </div>
                  <p style={{ margin: '0 0 1rem 0', color: '#2d3748', lineHeight: 1.6 }}>{question.text}</p>

                  {renderAnswerInput(question, answer)}
                </div>
              );
            })}
          </div>
        ) : (
          // Single Question View
          currentQuestion && (
            <div style={{
              padding: '2rem',
              background: '#f7fafc',
              borderRadius: '12px',
              border: '2px solid #e2e8f0',
              marginBottom: '2rem'
            }}>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d3748', marginBottom: '1rem' }}>
                Question {currentQuestionIndex + 1} ({currentQuestion.marks} marks)
              </div>
              <p style={{ margin: '0 0 1.5rem 0', color: '#2d3748', lineHeight: 1.6, fontSize: '1.05rem' }}>
                {currentQuestion.text}
              </p>

              {renderAnswerInput(currentQuestion, currentAnswer)}
            </div>
          )
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0 || showAllQuestions}
            style={{
              padding: '0.75rem 1.5rem',
              background: currentQuestionIndex === 0 || showAllQuestions ? '#e2e8f0' : 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: currentQuestionIndex === 0 || showAllQuestions ? 'not-allowed' : 'pointer',
              color: '#2d3748'
            }}
          >
            <i className="fas fa-chevron-left" style={{ marginRight: '0.5rem' }}></i>
            Previous
          </button>

          {currentQuestionIndex < questions.length - 1 && !showAllQuestions ? (
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              style={{
                padding: '0.75rem 1.5rem',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'white'
              }}
            >
              Next
              <i className="fas fa-chevron-right" style={{ marginLeft: '0.5rem' }}></i>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              style={{
                padding: '0.75rem 2rem',
                background: 'linear-gradient(90deg, #10ac8b 0%, #094d88 100%)',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                color: 'white'
              }}
            >
              <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
              Submit Assignment
            </button>
          )}
        </div>

        {/* Auto-save indicator */}
        <div style={{ marginTop: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#718096' }}>
          <i className="fas fa-save" style={{ marginRight: '0.5rem' }}></i>
          Your answers are automatically saved
        </div>
      </div>
    </>
  );

  function renderAnswerInput(question: Question, answer?: StudentAnswer) {
    if (question.type === 'mcq' && question.options) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {question.options.map(option => {
            const optionLetter = option.charAt(0);
            const isSelected = answer?.answer === optionLetter;

            return (
              <label
                key={option}
                style={{
                  padding: '1rem',
                  background: isSelected ? '#e0f2fe' : 'white',
                  border: `2px solid ${isSelected ? '#094d88' : '#e2e8f0'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  transition: 'all 0.2s'
                }}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={optionLetter}
                  checked={isSelected}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ flex: 1, color: '#2d3748', fontSize: '0.95rem' }}>{option}</span>
              </label>
            );
          })}
        </div>
      );
    }

    if (question.type === 'short-answer' || question.type === 'numerical') {
      return (
        <input
          type={question.type === 'numerical' ? 'number' : 'text'}
          value={answer?.answer || ''}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          placeholder="Type your answer here..."
          style={{
            width: '100%',
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'inherit'
          }}
        />
      );
    }

    if (question.type === 'long-answer') {
      return (
        <textarea
          value={answer?.answer || ''}
          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
          placeholder="Type your detailed answer here..."
          rows={8}
          style={{
            width: '100%',
            padding: '1rem',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            resize: 'vertical'
          }}
        />
      );
    }

    return null;
  }
};

export default TakeAssignment;
