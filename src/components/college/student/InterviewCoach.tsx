import { useState } from 'react';
import './InterviewCoach.css';

interface MockInterview {
  id: string;
  company: string;
  role: string;
  type: 'technical' | 'hr' | 'behavioral' | 'case-study';
  duration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionsCount: number;
  completed: boolean;
  score?: number;
  date?: string;
}

interface InterviewQuestion {
  id: string;
  question: string;
  category: string;
  difficulty: string;
  hints: string[];
  sampleAnswer: string;
}

interface PastInterview {
  id: string;
  company: string;
  role: string;
  date: string;
  score: number;
  feedback: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

const InterviewCoach = () => {
  const [activeTab, setActiveTab] = useState<'practice' | 'history' | 'tips'>('practice');
  const [selectedInterview, setSelectedInterview] = useState<MockInterview | null>(null);
  const [showQuestion, setShowQuestion] = useState(false);

  const [mockInterviews] = useState<MockInterview[]>([
    {
      id: '1',
      company: 'Google',
      role: 'Software Engineer',
      type: 'technical',
      duration: '45 mins',
      difficulty: 'hard',
      questionsCount: 8,
      completed: false
    },
    {
      id: '2',
      company: 'Microsoft',
      role: 'SDE-1',
      type: 'technical',
      duration: '60 mins',
      difficulty: 'hard',
      questionsCount: 10,
      completed: false
    },
    {
      id: '3',
      company: 'Amazon',
      role: 'Software Developer',
      type: 'behavioral',
      duration: '30 mins',
      difficulty: 'medium',
      questionsCount: 12,
      completed: false
    },
    {
      id: '4',
      company: 'Flipkart',
      role: 'Full Stack Developer',
      type: 'technical',
      duration: '45 mins',
      difficulty: 'medium',
      questionsCount: 8,
      completed: false
    },
    {
      id: '5',
      company: 'Accenture',
      role: 'Associate Software Engineer',
      type: 'hr',
      duration: '20 mins',
      difficulty: 'easy',
      questionsCount: 10,
      completed: false
    },
    {
      id: '6',
      company: 'Consulting Firms',
      role: 'Business Analyst',
      type: 'case-study',
      duration: '40 mins',
      difficulty: 'hard',
      questionsCount: 3,
      completed: false
    }
  ]);

  const [sampleQuestions] = useState<InterviewQuestion[]>([
    {
      id: 'q1',
      question: 'Explain the difference between process and thread.',
      category: 'Operating Systems',
      difficulty: 'Medium',
      hints: [
        'Think about memory allocation',
        'Consider execution context',
        'Compare resource sharing'
      ],
      sampleAnswer: 'A process is an independent program with its own memory space, while a thread is a lightweight unit within a process that shares memory. Multiple threads can exist within a process...'
    },
    {
      id: 'q2',
      question: 'Tell me about a time when you faced a challenging problem in a project.',
      category: 'Behavioral',
      difficulty: 'Medium',
      hints: [
        'Use STAR method (Situation, Task, Action, Result)',
        'Be specific with examples',
        'Focus on your contribution'
      ],
      sampleAnswer: 'In my final year project, we faced a performance bottleneck when handling concurrent users...'
    }
  ]);

  const [pastInterviews] = useState<PastInterview[]>([
    {
      id: 'p1',
      company: 'TCS',
      role: 'System Engineer',
      date: '2024-01-15',
      score: 78,
      feedback: {
        strengths: [
          'Clear communication',
          'Good problem-solving approach',
          'Strong fundamentals in DSA'
        ],
        weaknesses: [
          'Nervous body language',
          'Could improve answer structure',
          'Need more real-world project examples'
        ],
        recommendations: [
          'Practice with video recording to improve body language',
          'Use STAR method for behavioral questions',
          'Prepare 3-4 detailed project stories'
        ]
      }
    },
    {
      id: 'p2',
      company: 'Wipro',
      role: 'Project Engineer',
      date: '2024-01-20',
      score: 85,
      feedback: {
        strengths: [
          'Confident presentation',
          'Good technical knowledge',
          'Handled pressure well'
        ],
        weaknesses: [
          'Some gaps in advanced topics',
          'Could be more concise'
        ],
        recommendations: [
          'Study system design concepts',
          'Practice 2-minute answers'
        ]
      }
    }
  ]);

  const [interviewTips] = useState([
    {
      category: 'Technical Interview Tips',
      icon: 'fa-code',
      color: '#3b82f6',
      tips: [
        'Always think aloud - explain your thought process',
        'Ask clarifying questions before jumping to solutions',
        'Start with a brute force approach, then optimize',
        'Test your code with edge cases',
        'Discuss time and space complexity'
      ]
    },
    {
      category: 'Behavioral Interview Tips',
      icon: 'fa-comments',
      color: '#10b981',
      tips: [
        'Use STAR method: Situation, Task, Action, Result',
        'Prepare stories for common questions beforehand',
        'Be honest about failures and what you learned',
        'Show enthusiasm for the company and role',
        'Ask thoughtful questions at the end'
      ]
    },
    {
      category: 'Body Language & Communication',
      icon: 'fa-user-tie',
      color: '#f59e0b',
      tips: [
        'Maintain eye contact with the interviewer',
        'Sit upright with good posture',
        'Smile and show positive energy',
        'Avoid filler words (um, like, you know)',
        'Speak clearly and at a moderate pace'
      ]
    },
    {
      category: 'Pre-Interview Preparation',
      icon: 'fa-clipboard-check',
      color: '#8b5cf6',
      tips: [
        'Research the company and role thoroughly',
        'Review your resume and be ready to discuss everything',
        'Prepare questions to ask the interviewer',
        'Test your tech setup for virtual interviews',
        'Dress professionally and arrive/join 10 mins early'
      ]
    }
  ]);

  const getDifficultyColor = (difficulty: string): string => {
    if (difficulty === 'hard') return '#ef4444';
    if (difficulty === 'medium') return '#f59e0b';
    return '#10b981';
  };

  const getTypeIcon = (type: string): string => {
    switch (type) {
      case 'technical': return 'fa-code';
      case 'hr': return 'fa-user-tie';
      case 'behavioral': return 'fa-comments';
      case 'case-study': return 'fa-briefcase';
      default: return 'fa-question';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="interview-coach-container">
      {/* Header */}
      <div className="interview-coach-header">
        <div className="header-content">
          <div className="header-left">
            <h1>
              <i className="fas fa-user-graduate"></i>
              Interview Prep AI Coach
            </h1>
            <p>Master your interview skills with AI-powered practice sessions, real-time feedback, and personalized improvement plans</p>
          </div>
          <div className="header-actions">
            <button className="schedule-btn">
              <i className="fas fa-calendar-plus"></i>
              Schedule Live Mock Interview
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">Interviews Completed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">82%</div>
            <div className="stat-label">Average Score</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            <i className="fas fa-fire"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">7</div>
            <div className="stat-label">Day Streak</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            <i className="fas fa-trophy"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">Top 15%</div>
            <div className="stat-label">Ranking</div>
          </div>
        </div>
      </div>

      {/* Content Container */}
      <div className="content-container">
        {/* Tabs */}
        <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <i className="fas fa-play-circle"></i>
          Practice Interviews
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history"></i>
          Interview History
        </button>
        <button
          className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`}
          onClick={() => setActiveTab('tips')}
        >
          <i className="fas fa-lightbulb"></i>
          Interview Tips
        </button>
      </div>

      {/* Practice Tab */}
      {activeTab === 'practice' && (
        <div className="practice-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-play-circle"></i>
              Mock Interviews
            </h2>
            <p>Choose an interview type and start practicing</p>
          </div>

          <div className="mock-interviews-grid">
            {mockInterviews.map((interview) => (
              <div key={interview.id} className="mock-interview-card">
                <div className="interview-header">
                  <div className="interview-type-icon" style={{ background: getDifficultyColor(interview.difficulty) }}>
                    <i className={`fas ${getTypeIcon(interview.type)}`}></i>
                  </div>
                  <span className="difficulty-badge" style={{ background: getDifficultyColor(interview.difficulty) }}>
                    {interview.difficulty}
                  </span>
                </div>

                <h3>{interview.company}</h3>
                <p className="interview-role">{interview.role}</p>

                <div className="interview-details">
                  <div className="detail-item">
                    <i className="fas fa-tag"></i>
                    <span>{interview.type.replace('-', ' ')}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-clock"></i>
                    <span>{interview.duration}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-question-circle"></i>
                    <span>{interview.questionsCount} questions</span>
                  </div>
                </div>

                <button
                  className="start-interview-btn"
                  onClick={() => {
                    setSelectedInterview(interview);
                    setShowQuestion(true);
                  }}
                >
                  <i className="fas fa-play"></i>
                  Start Interview
                </button>
              </div>
            ))}
          </div>

          {/* Quick Practice Section */}
          <div className="quick-practice-section">
            <h2>
              <i className="fas fa-bolt"></i>
              Quick Practice Questions
            </h2>
            <div className="questions-list">
              {sampleQuestions.map((question) => (
                <div key={question.id} className="question-card">
                  <div className="question-header">
                    <span className="question-category">{question.category}</span>
                    <span className="question-difficulty" style={{ color: getDifficultyColor(question.difficulty.toLowerCase()) }}>
                      {question.difficulty}
                    </span>
                  </div>
                  <p className="question-text">{question.question}</p>
                  <button className="practice-question-btn">
                    <i className="fas fa-microphone"></i>
                    Practice Answer
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="history-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-history"></i>
              Your Interview History
            </h2>
            <p>Review past interviews and track your improvement</p>
          </div>

          <div className="history-list">
            {pastInterviews.map((interview) => (
              <div key={interview.id} className="history-card">
                <div className="history-header">
                  <div className="history-info">
                    <h3>{interview.company}</h3>
                    <p>{interview.role}</p>
                    <span className="history-date">
                      <i className="fas fa-calendar"></i>
                      {new Date(interview.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="history-score" style={{ borderColor: getScoreColor(interview.score) }}>
                    <div className="score-value" style={{ color: getScoreColor(interview.score) }}>
                      {interview.score}%
                    </div>
                    <div className="score-label">Score</div>
                  </div>
                </div>

                <div className="feedback-section">
                  <div className="feedback-column">
                    <h4>
                      <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                      Strengths
                    </h4>
                    <ul>
                      {interview.feedback.strengths.map((strength, idx) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="feedback-column">
                    <h4>
                      <i className="fas fa-exclamation-circle" style={{ color: '#f59e0b' }}></i>
                      Areas to Improve
                    </h4>
                    <ul>
                      {interview.feedback.weaknesses.map((weakness, idx) => (
                        <li key={idx}>{weakness}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="feedback-column">
                    <h4>
                      <i className="fas fa-lightbulb" style={{ color: '#3b82f6' }}></i>
                      Recommendations
                    </h4>
                    <ul>
                      {interview.feedback.recommendations.map((rec, idx) => (
                        <li key={idx}>{rec}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button className="retake-btn">
                  <i className="fas fa-redo"></i>
                  Retake Interview
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips Tab */}
      {activeTab === 'tips' && (
        <div className="tips-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-lightbulb"></i>
              Interview Tips & Best Practices
            </h2>
            <p>Expert advice to ace your interviews</p>
          </div>

          <div className="tips-grid">
            {interviewTips.map((tipCategory, index) => (
              <div key={index} className="tip-category-card" style={{ '--card-color': tipCategory.color } as React.CSSProperties}>
                <div className="tip-header">
                  <div className="tip-icon" style={{ background: tipCategory.color }}>
                    <i className={`fas ${tipCategory.icon}`}></i>
                  </div>
                  <h3>{tipCategory.category}</h3>
                </div>
                <div className="tips-list">
                  {tipCategory.tips.map((tip, idx) => (
                    <div key={idx} className="tip-item">
                      <div className="tip-bullet">{idx + 1}</div>
                      <div className="tip-text">{tip}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Common Questions */}
          <div className="common-questions-section">
            <h2>
              <i className="fas fa-question-circle"></i>
              Common Interview Questions to Prepare
            </h2>
            <div className="questions-categories">
              <div className="category-section">
                <h3>Technical Questions</h3>
                <ul>
                  <li>Explain OOP concepts with examples</li>
                  <li>What is the difference between stack and heap memory?</li>
                  <li>How does a hash table work?</li>
                  <li>Explain database normalization</li>
                  <li>What are REST APIs?</li>
                </ul>
              </div>
              <div className="category-section">
                <h3>Behavioral Questions</h3>
                <ul>
                  <li>Tell me about yourself</li>
                  <li>Why do you want to work here?</li>
                  <li>Describe a challenging project</li>
                  <li>How do you handle conflicts in a team?</li>
                  <li>Where do you see yourself in 5 years?</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default InterviewCoach;
