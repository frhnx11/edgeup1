import { useState } from 'react';
import './InteractiveLearningHub.css';

interface InteractiveLearningHubProps {
  onBack: () => void;
}

const InteractiveLearningHub: React.FC<InteractiveLearningHubProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('library');

  // Mock data for digital library
  const subjects = [
    { id: 1, name: 'Data Structures', code: 'CS301', resources: 45, papers: 12, videos: 28 },
    { id: 2, name: 'Operating Systems', code: 'CS302', resources: 38, papers: 10, videos: 22 },
    { id: 3, name: 'Database Management', code: 'CS303', resources: 42, papers: 15, videos: 25 },
    { id: 4, name: 'Computer Networks', code: 'CS304', resources: 36, papers: 11, videos: 20 },
    { id: 5, name: 'Software Engineering', code: 'CS305', resources: 40, papers: 13, videos: 24 },
    { id: 6, name: 'Web Technologies', code: 'CS306', resources: 35, papers: 9, videos: 30 }
  ];

  // Mock data for doubt forum
  const recentDoubts = [
    { id: 1, question: 'How to implement AVL tree rotations?', subject: 'Data Structures', askedBy: 'Priya S.', time: '5 mins ago', replies: 3, status: 'answered' },
    { id: 2, question: 'Difference between process and thread?', subject: 'Operating Systems', askedBy: 'Rahul K.', time: '15 mins ago', replies: 2, status: 'active' },
    { id: 3, question: 'Normalization in DBMS - 3NF vs BCNF', subject: 'Database Management', askedBy: 'Anjali M.', time: '1 hour ago', replies: 5, status: 'answered' },
    { id: 4, question: 'TCP vs UDP protocols explained', subject: 'Computer Networks', askedBy: 'Amit P.', time: '2 hours ago', replies: 4, status: 'answered' }
  ];

  // Mock data for practice tests
  const availableTests = [
    { id: 1, subject: 'Data Structures', topic: 'Trees & Graphs', difficulty: 'Medium', questions: 25, duration: 45, attempts: 2 },
    { id: 2, subject: 'Operating Systems', topic: 'Process Scheduling', difficulty: 'Hard', questions: 20, duration: 40, attempts: 0 },
    { id: 3, subject: 'Database Management', topic: 'SQL Queries', difficulty: 'Easy', questions: 30, duration: 30, attempts: 1 },
    { id: 4, subject: 'Computer Networks', topic: 'Network Layer', difficulty: 'Medium', questions: 22, duration: 35, attempts: 3 }
  ];

  const getDifficultyBadge = (difficulty: string) => {
    const badges: Record<string, string> = {
      'Easy': 'difficulty-easy',
      'Medium': 'difficulty-medium',
      'Hard': 'difficulty-hard'
    };
    return badges[difficulty] || 'difficulty-medium';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      'answered': 'status-answered',
      'active': 'status-active',
      'pending': 'status-pending'
    };
    return badges[status] || 'status-active';
  };

  return (
    <div className="learning-hub-container">
      <div className="lh-header">
        <button className="lh-back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Academic Assistant</span>
        </button>
        <h1><i className="fas fa-book-open"></i> Interactive Learning Hub</h1>
        <p>Comprehensive digital library and practice platform with 24/7 support</p>
      </div>

      <div className="lh-tabs">
        <button
          className={`lh-tab ${activeTab === 'library' ? 'active' : ''}`}
          onClick={() => setActiveTab('library')}
        >
          <i className="fas fa-books"></i>
          <span>Digital Library</span>
        </button>
        <button
          className={`lh-tab ${activeTab === 'doubts' ? 'active' : ''}`}
          onClick={() => setActiveTab('doubts')}
        >
          <i className="fas fa-comments"></i>
          <span>Doubt Forum</span>
        </button>
        <button
          className={`lh-tab ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <i className="fas fa-flask"></i>
          <span>Practice Tests</span>
        </button>
      </div>

      <div className="lh-content">
        {/* Digital Library Tab */}
        {activeTab === 'library' && (
          <div className="library-tab">
            <div className="lh-section-header">
              <h2><i className="fas fa-books"></i> Subject-wise Digital Library</h2>
              <div className="lh-search-bar">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search for subjects, topics, or resources..." />
              </div>
            </div>

            <div className="subjects-grid">
              {subjects.map((subject) => (
                <div key={subject.id} className="subject-library-card">
                  <div className="subject-card-header">
                    <div className="subject-icon">
                      <i className="fas fa-book"></i>
                    </div>
                    <div className="subject-info">
                      <h3>{subject.name}</h3>
                      <p className="subject-code">{subject.code}</p>
                    </div>
                  </div>
                  <div className="subject-card-body">
                    <div className="resource-stats">
                      <div className="resource-stat">
                        <i className="fas fa-file-alt"></i>
                        <span>{subject.resources} Notes</span>
                      </div>
                      <div className="resource-stat">
                        <i className="fas fa-video"></i>
                        <span>{subject.videos} Videos</span>
                      </div>
                      <div className="resource-stat">
                        <i className="fas fa-clipboard"></i>
                        <span>{subject.papers} Papers</span>
                      </div>
                    </div>
                  </div>
                  <div className="subject-card-actions">
                    <button className="lh-btn-secondary"><i className="fas fa-eye"></i> Browse</button>
                    <button className="lh-btn-primary"><i className="fas fa-download"></i> Download All</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Doubt Forum Tab */}
        {activeTab === 'doubts' && (
          <div className="doubts-tab">
            <div className="lh-section-header">
              <div>
                <h2><i className="fas fa-comments"></i> Live Doubt Resolution Forum</h2>
                <p className="lh-subheading">24/7 assistance from Faculty, Peers & AI (e-Ustad)</p>
              </div>
              <button className="lh-btn-primary"><i className="fas fa-plus"></i> Ask a Question</button>
            </div>

            <div className="doubt-stats-bar">
              <div className="doubt-stat">
                <i className="fas fa-clock"></i>
                <div>
                  <span className="stat-value">~15 mins</span>
                  <span className="stat-label">Avg. Response Time</span>
                </div>
              </div>
              <div className="doubt-stat">
                <i className="fas fa-check-circle"></i>
                <div>
                  <span className="stat-value">95%</span>
                  <span className="stat-label">Resolution Rate</span>
                </div>
              </div>
              <div className="doubt-stat">
                <i className="fas fa-users"></i>
                <div>
                  <span className="stat-value">250+</span>
                  <span className="stat-label">Active Now</span>
                </div>
              </div>
            </div>

            <div className="doubts-list">
              {recentDoubts.map((doubt) => (
                <div key={doubt.id} className="doubt-card">
                  <div className="doubt-card-header">
                    <div className="doubt-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="doubt-info">
                      <h4>{doubt.question}</h4>
                      <div className="doubt-meta">
                        <span className="doubt-subject">{doubt.subject}</span>
                        <span className="doubt-author">Asked by {doubt.askedBy}</span>
                        <span className="doubt-time">{doubt.time}</span>
                      </div>
                    </div>
                    <span className={`doubt-status-badge ${getStatusBadge(doubt.status)}`}>
                      {doubt.status}
                    </span>
                  </div>
                  <div className="doubt-card-footer">
                    <div className="doubt-replies">
                      <i className="fas fa-reply"></i>
                      <span>{doubt.replies} replies</span>
                    </div>
                    <button className="lh-btn-text">View Discussion <i className="fas fa-arrow-right"></i></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="eustad-banner">
              <div className="eustad-icon">
                <i className="fas fa-robot"></i>
              </div>
              <div className="eustad-content">
                <h3>AI Assistant - e-Ustad</h3>
                <p>Get instant answers to your doubts 24/7 with our AI-powered assistant</p>
              </div>
              <button className="lh-btn-primary"><i className="fas fa-message"></i> Chat with e-Ustad</button>
            </div>
          </div>
        )}

        {/* Practice Tests Tab */}
        {activeTab === 'practice' && (
          <div className="practice-tab">
            <div className="lh-section-header">
              <div>
                <h2><i className="fas fa-flask"></i> Adaptive Practice Test Generator</h2>
                <p className="lh-subheading">AI-powered tests that adapt to your skill level</p>
              </div>
              <button className="lh-btn-primary"><i className="fas fa-plus"></i> Create Custom Test</button>
            </div>

            <div className="practice-tests-grid">
              {availableTests.map((test) => (
                <div key={test.id} className="practice-test-card">
                  <div className="test-card-header">
                    <span className={`difficulty-badge ${getDifficultyBadge(test.difficulty)}`}>
                      {test.difficulty}
                    </span>
                    {test.attempts > 0 && (
                      <span className="attempts-badge">
                        <i className="fas fa-redo"></i> {test.attempts} attempts
                      </span>
                    )}
                  </div>
                  <div className="test-card-body">
                    <h3>{test.subject}</h3>
                    <p className="test-topic">{test.topic}</p>
                    <div className="test-stats">
                      <div className="test-stat">
                        <i className="fas fa-question-circle"></i>
                        <span>{test.questions} questions</span>
                      </div>
                      <div className="test-stat">
                        <i className="fas fa-clock"></i>
                        <span>{test.duration} mins</span>
                      </div>
                    </div>
                  </div>
                  <div className="test-card-actions">
                    {test.attempts > 0 && (
                      <button className="lh-btn-secondary"><i className="fas fa-chart-line"></i> View Results</button>
                    )}
                    <button className="lh-btn-primary">
                      <i className="fas fa-play"></i> {test.attempts > 0 ? 'Retake Test' : 'Start Test'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="adaptive-feature-info">
              <div className="adaptive-icon">
                <i className="fas fa-brain"></i>
              </div>
              <div className="adaptive-content">
                <h3>Adaptive Difficulty</h3>
                <p>Our AI analyzes your performance and automatically adjusts question difficulty to optimize your learning.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveLearningHub;
