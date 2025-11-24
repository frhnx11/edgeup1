import { useState } from 'react';
import {
  interestQuestions,
  logicalQuestions,
  numericalQuestions,
  verbalQuestions,
  spatialQuestions
} from '../../../data/assessmentQuestions';
import {
  calculateAssessmentResults,
  saveAssessmentResults
} from '../../../services/careerMatcher';
import type { AssessmentAnswer, AssessmentResults, AssessmentQuestion } from '../../../types/assessment';

interface Props {
  onComplete: (answers: AssessmentAnswer[], results: AssessmentResults) => void;
}

type TestType = 'welcome' | 'interest' | 'logical' | 'numerical' | 'verbal' | 'spatial' | 'submitting';

const AssessmentStage = ({ onComplete }: Props) => {
  const [currentTest, setCurrentTest] = useState<TestType>('welcome');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<AssessmentAnswer[]>([]);

  const testSequence: TestType[] = ['interest', 'logical', 'numerical', 'verbal', 'spatial'];

  const getCurrentQuestions = (): AssessmentQuestion[] => {
    switch (currentTest) {
      case 'interest': return interestQuestions;
      case 'logical': return logicalQuestions;
      case 'numerical': return numericalQuestions;
      case 'verbal': return verbalQuestions;
      case 'spatial': return spatialQuestions;
      default: return [];
    }
  };

  const getTestName = (test: TestType): string => {
    const names: Record<TestType, string> = {
      welcome: 'Welcome',
      interest: 'Career Interest Assessment',
      logical: 'Logical Reasoning',
      numerical: 'Numerical Ability',
      verbal: 'Verbal Reasoning',
      spatial: 'Spatial Reasoning',
      submitting: 'Analyzing Results'
    };
    return names[test];
  };

  const getTestIcon = (test: TestType): string => {
    const icons: Record<TestType, string> = {
      welcome: 'fa-hand-wave',
      interest: 'fa-heart',
      logical: 'fa-brain',
      numerical: 'fa-calculator',
      verbal: 'fa-book',
      spatial: 'fa-cube',
      submitting: 'fa-spinner'
    };
    return icons[test];
  };

  const questions = getCurrentQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = testSequence.reduce((sum, test) => {
    switch (test) {
      case 'interest': return sum + interestQuestions.length;
      case 'logical': return sum + logicalQuestions.length;
      case 'numerical': return sum + numericalQuestions.length;
      case 'verbal': return sum + verbalQuestions.length;
      case 'spatial': return sum + spatialQuestions.length;
      default: return sum;
    }
  }, 0);

  const handleAnswer = (optionId: string, score: number) => {
    // Save answer
    const newAnswer: AssessmentAnswer = {
      questionId: currentQuestion.id,
      optionId,
      score
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Move to next test
      const currentTestIndex = testSequence.indexOf(currentTest);
      if (currentTestIndex < testSequence.length - 1) {
        setCurrentTest(testSequence[currentTestIndex + 1]);
        setCurrentQuestionIndex(0);
      } else {
        // All tests completed - submit
        submitAssessment(updatedAnswers);
      }
    }
  };

  const submitAssessment = async (finalAnswers: AssessmentAnswer[]) => {
    setCurrentTest('submitting');

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Calculate results
    const results = calculateAssessmentResults(finalAnswers);

    // Save to localStorage
    saveAssessmentResults(finalAnswers, results);

    // Complete
    onComplete(finalAnswers, results);
  };

  const startAssessment = () => {
    setCurrentTest('interest');
    setCurrentQuestionIndex(0);
  };

  const progress = Math.round((answers.length / totalQuestions) * 100);

  if (currentTest === 'welcome') {
    return (
      <div style={{ width: '100%', margin: '0 auto' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '3rem',
          boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #094d88, #10ac8b)',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            color: 'white'
          }}>
            <i className="fas fa-compass"></i>
          </div>

          <h2 style={{ fontSize: '28px', color: '#094d88', marginBottom: '1rem' }}>
            Welcome to Career Explorer!
          </h2>

          <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '2rem', lineHeight: '1.6' }}>
            Discover your ideal career path through our comprehensive assessment.
            This evaluation will help you understand your interests, strengths, and aptitudes.
          </p>

          <div style={{
            background: '#f8f9fa',
            borderRadius: '15px',
            padding: '2rem',
            marginBottom: '2rem',
            textAlign: 'left'
          }}>
            <h3 style={{ fontSize: '20px', color: '#094d88', marginBottom: '1.5rem', textAlign: 'center' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '10px' }}></i>
              What to Expect
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #094d88, #10ac8b)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    <i className="fas fa-heart"></i>
                  </div>
                  <strong style={{ color: '#094d88' }}>Interest Assessment</strong>
                </div>
                <p style={{ fontSize: '14px', color: '#6c757d', marginLeft: '50px' }}>
                  15 questions about your interests and preferences
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    <i className="fas fa-brain"></i>
                  </div>
                  <strong style={{ color: '#094d88' }}>Aptitude Tests</strong>
                </div>
                <p style={{ fontSize: '14px', color: '#6c757d', marginLeft: '50px' }}>
                  40 questions across 4 skill areas
                </p>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.5rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #10ac8b, #f59e0b)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <strong style={{ color: '#094d88' }}>Duration</strong>
                </div>
                <p style={{ fontSize: '14px', color: '#6c757d', marginLeft: '50px' }}>
                  Approximately 20-25 minutes
                </p>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem'
          }}>
            <p style={{ fontSize: '14px', color: '#856404', margin: 0 }}>
              <i className="fas fa-lightbulb" style={{ marginRight: '8px' }}></i>
              <strong>Tip:</strong> Answer honestly based on your genuine interests and abilities. There are no right or wrong answers!
            </p>
          </div>

          <button
            onClick={startAssessment}
            style={{
              background: 'linear-gradient(135deg, #094d88, #10ac8b)',
              color: 'white',
              border: 'none',
              padding: '1rem 3rem',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: '600',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Start Assessment <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
          </button>
        </div>
      </div>
    );
  }

  if (currentTest === 'submitting') {
    return (
      <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '4rem 2rem',
          boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #094d88, #10ac8b)',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            color: 'white',
            animation: 'spin 2s linear infinite'
          }}>
            <i className="fas fa-spinner fa-spin"></i>
          </div>

          <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1rem' }}>
            Analyzing Your Responses...
          </h2>

          <p style={{ fontSize: '16px', color: '#6c757d' }}>
            We're processing your answers to generate personalized career recommendations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      {/* Progress Bar */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '18px', color: '#094d88', margin: 0 }}>
              <i className={`fas ${getTestIcon(currentTest)}`} style={{ marginRight: '10px' }}></i>
              {getTestName(currentTest)}
            </h3>
            <p style={{ fontSize: '14px', color: '#6c757d', margin: '0.25rem 0 0 0' }}>
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#094d88' }}>{progress}%</div>
            <div style={{ fontSize: '12px', color: '#6c757d' }}>Complete</div>
          </div>
        </div>

        <div style={{
          width: '100%',
          height: '8px',
          background: '#e9ecef',
          borderRadius: '10px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #094d88, #10ac8b)',
            borderRadius: '10px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
      </div>

      {/* Question Card */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '3rem',
        boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)',
        marginBottom: '2rem'
      }}>
        <h2 style={{
          fontSize: '22px',
          color: '#094d88',
          marginBottom: '2rem',
          lineHeight: '1.5'
        }}>
          {currentQuestion.question}
        </h2>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {currentQuestion.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(option.id, option.score)}
              style={{
                background: 'white',
                border: '2px solid #e9ecef',
                borderRadius: '15px',
                padding: '1.25rem 1.5rem',
                fontSize: '16px',
                color: '#212529',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#10ac8b';
                e.currentTarget.style.background = '#f0fdf9';
                e.currentTarget.style.transform = 'translateX(10px)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e9ecef';
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '2px solid #094d88',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: '600',
                color: '#094d88',
                flexShrink: 0
              }}>
                {option.id.toUpperCase()}
              </div>
              <span>{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssessmentStage;
