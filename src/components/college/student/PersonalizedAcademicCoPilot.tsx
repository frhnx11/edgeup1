import { useState } from 'react';
import './PersonalizedAcademicCoPilot.css';

interface PersonalizedAcademicCoPilotProps {
  onBack: () => void;
}

const PersonalizedAcademicCoPilot: React.FC<PersonalizedAcademicCoPilotProps> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Hardcoded mock data
  const weakAreas = [
    { subject: 'Data Structures', topic: 'Binary Trees', score: 62, improvement: '+8%' },
    { subject: 'Operating Systems', topic: 'Memory Management', score: 58, improvement: '+5%' },
    { subject: 'Database Management', topic: 'SQL Joins', score: 70, improvement: '+12%' },
    { subject: 'Computer Networks', topic: 'OSI Model', score: 65, improvement: '+7%' }
  ];

  const upcomingDeadlines = [
    { id: 1, title: 'Data Structures Assignment 3', subject: 'Data Structures', dueDate: '2025-01-25', priority: 'high', status: 'pending' },
    { id: 2, title: 'OS Lab Report', subject: 'Operating Systems', dueDate: '2025-01-27', priority: 'medium', status: 'in-progress' },
    { id: 3, title: 'DBMS Project Submission', subject: 'Database Management', dueDate: '2025-01-30', priority: 'high', status: 'pending' },
    { id: 4, title: 'Networks Mid-term Prep', subject: 'Computer Networks', dueDate: '2025-02-02', priority: 'low', status: 'pending' }
  ];

  const studyGroups = [
    { id: 1, name: 'Data Structures Study Circle', subject: 'Data Structures', members: 5, learningStyle: 'Visual', matchScore: 95 },
    { id: 2, name: 'OS Deep Dive Group', subject: 'Operating Systems', members: 4, learningStyle: 'Hands-on', matchScore: 88 },
    { id: 3, name: 'Database Masters', subject: 'Database Management', members: 6, learningStyle: 'Visual', matchScore: 92 },
    { id: 4, name: 'Network Protocol Study', subject: 'Computer Networks', members: 3, learningStyle: 'Reading', matchScore: 78 }
  ];

  const semesterPlan = [
    { week: 'Week 1-2', focus: 'Advanced Data Structures', tasks: 'Trees, Graphs, Heaps', status: 'completed' },
    { week: 'Week 3-4', focus: 'Operating Systems Fundamentals', tasks: 'Process Management, Threads', status: 'completed' },
    { week: 'Week 5-6', focus: 'Database Design', tasks: 'ER Models, Normalization', status: 'in-progress' },
    { week: 'Week 7-8', focus: 'Network Protocols', tasks: 'TCP/IP, HTTP, DNS', status: 'upcoming' },
    { week: 'Week 9-10', focus: 'Algorithm Optimization', tasks: 'Dynamic Programming, Greedy', status: 'upcoming' },
    { week: 'Week 11-12', focus: 'Mid-term Preparation', tasks: 'Revision & Mock Tests', status: 'upcoming' }
  ];

  const performanceComparison = {
    yourAverage: 78.5,
    batchAverage: 72.3,
    collegeAverage: 70.8,
    subjects: [
      { name: 'Data Structures', your: 82, batch: 75, college: 73 },
      { name: 'Operating Systems', your: 76, batch: 70, college: 68 },
      { name: 'DBMS', your: 80, batch: 74, college: 72 },
      { name: 'Networks', your: 75, batch: 70, college: 69 }
    ]
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffaa00';
      case 'low': return '#4CAF50';
      default: return '#666';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return 'status-completed';
      case 'in-progress': return 'status-progress';
      case 'upcoming': return 'status-upcoming';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };

  return (
    <div className="academic-copilot-container">
      {/* Back Button */}
      <button className="copilot-back-btn" onClick={onBack}>
        <i className="fas fa-arrow-left"></i>
        <span>Back to Academic Assistant</span>
      </button>

      {/* Header */}
      <div className="copilot-header">
        <div className="header-content">
          <div className="header-title">
            <i className="fas fa-robot"></i>
            <div>
              <h1>Personalized Academic Co-Pilot</h1>
              <p>Your AI-powered study companion for academic success</p>
            </div>
          </div>
          <button className="btn-primary">
            <i className="fas fa-sync-alt"></i>
            Refresh Analysis
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="copilot-tabs">
        <button
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-th-large"></i>
          Overview
        </button>
        <button
          className={`tab-btn ${activeTab === 'weak-areas' ? 'active' : ''}`}
          onClick={() => setActiveTab('weak-areas')}
        >
          <i className="fas fa-chart-line"></i>
          Weak Areas Analysis
        </button>
        <button
          className={`tab-btn ${activeTab === 'semester-plan' ? 'active' : ''}`}
          onClick={() => setActiveTab('semester-plan')}
        >
          <i className="fas fa-calendar-alt"></i>
          Semester Planner
        </button>
        <button
          className={`tab-btn ${activeTab === 'deadlines' ? 'active' : ''}`}
          onClick={() => setActiveTab('deadlines')}
        >
          <i className="fas fa-clock"></i>
          Deadline Tracker
        </button>
        <button
          className={`tab-btn ${activeTab === 'study-groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('study-groups')}
        >
          <i className="fas fa-users"></i>
          Study Groups
        </button>
        <button
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => setActiveTab('performance')}
        >
          <i className="fas fa-chart-bar"></i>
          Performance Comparison
        </button>
      </div>

      {/* Content Area */}
      <div className="copilot-content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-tab">
            <div className="overview-grid">
              {/* Quick Stats */}
              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#4CAF50' }}>
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="stat-info">
                  <h3>78.5%</h3>
                  <p>Overall Average</p>
                  <span className="stat-trend positive">+6.2% from batch avg</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#2196F3' }}>
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="stat-info">
                  <h3>4</h3>
                  <p>Pending Deadlines</p>
                  <span className="stat-trend warning">2 high priority</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#FF9800' }}>
                  <i className="fas fa-exclamation-triangle"></i>
                </div>
                <div className="stat-info">
                  <h3>4</h3>
                  <p>Weak Areas</p>
                  <span className="stat-trend neutral">Need focus</span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon" style={{ background: '#9C27B0' }}>
                  <i className="fas fa-users"></i>
                </div>
                <div className="stat-info">
                  <h3>4</h3>
                  <p>Matched Study Groups</p>
                  <span className="stat-trend positive">95% match score</span>
                </div>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="recommendations-section">
              <h2><i className="fas fa-lightbulb"></i> AI Recommendations</h2>
              <div className="recommendation-cards">
                <div className="recommendation-card priority-high">
                  <div className="rec-header">
                    <i className="fas fa-exclamation-circle"></i>
                    <span className="rec-badge">High Priority</span>
                  </div>
                  <h3>Focus on Operating Systems</h3>
                  <p>Your Memory Management score (58%) is below batch average. Dedicate 2 hours daily this week.</p>
                  <button className="btn-secondary">View Study Plan</button>
                </div>

                <div className="recommendation-card priority-medium">
                  <div className="rec-header">
                    <i className="fas fa-clock"></i>
                    <span className="rec-badge">Deadline Alert</span>
                  </div>
                  <h3>DBMS Project Due Soon</h3>
                  <p>Project submission in 5 days. Join "Database Masters" study group for collaboration.</p>
                  <button className="btn-secondary">Join Group</button>
                </div>

                <div className="recommendation-card priority-low">
                  <div className="rec-header">
                    <i className="fas fa-chart-line"></i>
                    <span className="rec-badge">Improvement</span>
                  </div>
                  <h3>SQL Joins Mastery</h3>
                  <p>Great progress! Your SQL Joins score improved by 12%. Keep practicing with advanced queries.</p>
                  <button className="btn-secondary">More Exercises</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Weak Areas Analysis Tab */}
        {activeTab === 'weak-areas' && (
          <div className="weak-areas-tab">
            <div className="section-header">
              <h2><i className="fas fa-chart-line"></i> Weak Areas Analysis</h2>
              <p>Based on your recent test performance and assessment scores</p>
            </div>

            <div className="weak-areas-grid">
              {weakAreas.map((area, index) => (
                <div key={index} className="weak-area-card">
                  <div className="weak-area-header">
                    <div className="subject-info">
                      <h3>{area.subject}</h3>
                      <p className="topic-name"><strong>Weak Topic:</strong> {area.topic}</p>
                    </div>
                    <span className={`score-badge ${area.score < 60 ? 'low' : area.score < 75 ? 'medium' : 'good'}`}>
                      {area.score}%
                    </span>
                  </div>
                  <div className="progress-section">
                    <div className="progress-info">
                      <span className="progress-label">Current Score</span>
                      <span className="improvement">{area.improvement} from last test</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${area.score}%` }}></div>
                    </div>
                  </div>
                  <div className="action-buttons">
                    <button className="btn-icon"><i className="fas fa-book"></i> Resources</button>
                    <button className="btn-icon"><i className="fas fa-play"></i> Practice</button>
                    <button className="btn-icon"><i className="fas fa-robot"></i> AI Help</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="ai-study-assistant">
              <h3><i className="fas fa-robot"></i> AI Study Assistant</h3>
              <div className="assistant-chat">
                <div className="chat-message assistant">
                  <i className="fas fa-robot"></i>
                  <p>I've analyzed your test performance. You need to focus on Binary Trees in Data Structures. Would you like me to create a personalized study plan?</p>
                </div>
                <div className="chat-input">
                  <input type="text" placeholder="Ask me anything about your weak areas..." />
                  <button className="btn-primary"><i className="fas fa-paper-plane"></i></button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Semester Planner Tab */}
        {activeTab === 'semester-plan' && (
          <div className="semester-plan-tab">
            <div className="section-header">
              <h2><i className="fas fa-calendar-alt"></i> Smart Semester Planner</h2>
              <p>AI-generated study plan based on your curriculum and performance</p>
              <button className="btn-primary"><i className="fas fa-download"></i> Export Plan</button>
            </div>

            <div className="semester-plan-grid">
              {semesterPlan.map((item, index) => (
                <div key={index} className={`semester-card ${item.status}`}>
                  <div className="semester-card-header">
                    <div className="week-label">
                      <i className={`fas ${item.status === 'completed' ? 'fa-check-circle' : item.status === 'in-progress' ? 'fa-clock' : 'fa-circle'}`}></i>
                      <span>{item.week}</span>
                    </div>
                    <span className={`status-badge ${getStatusBadge(item.status)}`}>
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                  <h4 className="semester-card-title">{item.focus}</h4>
                  <p className="semester-card-tasks">{item.tasks}</p>
                  <div className="semester-card-actions">
                    <button className="btn-icon"><i className="fas fa-book"></i></button>
                    <button className="btn-icon"><i className="fas fa-tasks"></i></button>
                    {item.status === 'completed' && (
                      <button className="btn-icon"><i className="fas fa-chart-bar"></i></button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deadline Tracker Tab */}
        {activeTab === 'deadlines' && (
          <div className="deadlines-tab">
            <div className="section-header">
              <h2><i className="fas fa-clock"></i> Automated Deadline Tracker</h2>
              <p>Priority-based notifications and deadline management</p>
              <button className="btn-primary"><i className="fas fa-plus"></i> Add Deadline</button>
            </div>

            <div className="deadlines-grid">
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className={`deadline-card priority-${deadline.priority}`}>
                  <div className="deadline-card-header">
                    <div className="deadline-title-section">
                      <h4>{deadline.title}</h4>
                      <p className="deadline-subject">{deadline.subject}</p>
                    </div>
                    <span className={`status-badge ${getStatusBadge(deadline.status)}`}>
                      {deadline.status.replace('-', ' ')}
                    </span>
                  </div>
                  <div className="deadline-card-body">
                    <div className="deadline-date-info">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{deadline.dueDate}</span>
                    </div>
                    <div className="days-remaining">
                      {Math.ceil((new Date(deadline.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                    </div>
                  </div>
                  <div className="deadline-card-actions">
                    <button className="btn-icon"><i className="fas fa-bell"></i></button>
                    <button className="btn-icon"><i className="fas fa-edit"></i></button>
                    <button className="btn-icon"><i className="fas fa-check"></i></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="notification-settings">
              <h3><i className="fas fa-cog"></i> Notification Settings</h3>
              <div className="settings-grid">
                <label className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <span>Email notifications</span>
                </label>
                <label className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <span>Push notifications</span>
                </label>
                <label className="setting-item">
                  <input type="checkbox" defaultChecked />
                  <span>Priority-based alerts</span>
                </label>
                <label className="setting-item">
                  <input type="checkbox" />
                  <span>Daily digest</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Study Groups Tab */}
        {activeTab === 'study-groups' && (
          <div className="study-groups-tab">
            <div className="section-header">
              <h2><i className="fas fa-users"></i> Peer Study Group Matcher</h2>
              <p>Find study groups based on subjects and learning style</p>
              <button className="btn-primary"><i className="fas fa-plus"></i> Create Group</button>
            </div>

            <div className="study-groups-grid">
              {studyGroups.map((group) => (
                <div key={group.id} className="study-group-card">
                  <div className="group-header">
                    <div className="group-icon">
                      <i className="fas fa-users"></i>
                    </div>
                    <div className="match-score">
                      <span className="score-value">{group.matchScore}%</span>
                      <span className="score-label">Match</span>
                    </div>
                  </div>
                  <h3>{group.name}</h3>
                  <p className="group-subject">{group.subject}</p>
                  <div className="group-meta">
                    <span><i className="fas fa-user"></i> {group.members} members</span>
                    <span><i className="fas fa-brain"></i> {group.learningStyle}</span>
                  </div>
                  <div className="group-actions">
                    <button className="btn-primary"><i className="fas fa-user-plus"></i> Join Group</button>
                    <button className="btn-secondary"><i className="fas fa-info-circle"></i> Details</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="learning-style-info">
              <h3><i className="fas fa-brain"></i> Your Learning Style: Visual Learner</h3>
              <p>Groups are matched based on your preferred learning style from your profile settings.</p>
              <button className="btn-secondary"><i className="fas fa-edit"></i> Update Learning Style</button>
            </div>
          </div>
        )}

        {/* Performance Comparison Tab */}
        {activeTab === 'performance' && (
          <div className="performance-tab">
            <div className="section-header">
              <h2><i className="fas fa-chart-bar"></i> Performance Comparison</h2>
              <p>Compare your performance with batch and college averages</p>
            </div>

            <div className="performance-stats-grid">
              <div className="perf-stat-card">
                <div className="perf-stat-header">
                  <i className="fas fa-user"></i>
                  <span>Your Average</span>
                </div>
                <div className="perf-stat-value">{performanceComparison.yourAverage}%</div>
                <div className="perf-stat-label positive">Above batch average</div>
              </div>

              <div className="perf-stat-card">
                <div className="perf-stat-header">
                  <i className="fas fa-users"></i>
                  <span>Batch Average</span>
                </div>
                <div className="perf-stat-value">{performanceComparison.batchAverage}%</div>
                <div className="perf-stat-label">CSE Year 3</div>
              </div>

              <div className="perf-stat-card">
                <div className="perf-stat-header">
                  <i className="fas fa-university"></i>
                  <span>College Average</span>
                </div>
                <div className="perf-stat-value">{performanceComparison.collegeAverage}%</div>
                <div className="perf-stat-label">MIT College</div>
              </div>
            </div>

            <div className="subject-comparison-section">
              <h3>Subject-wise Comparison</h3>
              <div className="subjects-grid">
                {performanceComparison.subjects.map((subject, index) => (
                  <div key={index} className="subject-perf-card">
                    <div className="subject-perf-header">
                      <h4>{subject.name}</h4>
                      <span className={`perf-diff ${subject.your > subject.batch ? 'positive' : 'negative'}`}>
                        {subject.your > subject.batch ? '+' : ''}{(subject.your - subject.batch).toFixed(1)}%
                      </span>
                    </div>
                    <div className="perf-bars">
                      <div className="perf-bar-item">
                        <span className="bar-label">You</span>
                        <div className="bar-container">
                          <div className="bar-fill" style={{ width: `${subject.your}%`, background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)' }}>
                            <span className="bar-value">{subject.your}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="perf-bar-item">
                        <span className="bar-label">Batch</span>
                        <div className="bar-container">
                          <div className="bar-fill" style={{ width: `${subject.batch}%`, background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)' }}>
                            <span className="bar-value">{subject.batch}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="perf-bar-item">
                        <span className="bar-label">College</span>
                        <div className="bar-container">
                          <div className="bar-fill" style={{ width: `${subject.college}%`, background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)' }}>
                            <span className="bar-value">{subject.college}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="performance-insights">
              <h3><i className="fas fa-lightbulb"></i> Performance Insights</h3>
              <div className="insights-cards">
                <div className="insight-card positive">
                  <i className="fas fa-check-circle"></i>
                  <p>You're performing <strong>6.2% better</strong> than your batch average</p>
                </div>
                <div className="insight-card positive">
                  <i className="fas fa-check-circle"></i>
                  <p>Your Data Structures score is <strong>7% above</strong> batch average</p>
                </div>
                <div className="insight-card neutral">
                  <i className="fas fa-info-circle"></i>
                  <p>Operating Systems needs focus - currently <strong>6% above</strong> batch but can improve</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalizedAcademicCoPilot;
