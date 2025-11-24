import { useState } from 'react';

interface SubjectPerformance {
  subject: string;
  score: number;
  totalTests: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface PerformanceData {
  month: string;
  score: number;
}

const PerformanceTracker = () => {
  const [overallPerformance] = useState({
    currentGPA: 3.8,
    averageScore: 87,
    rank: 5,
    totalStudents: 120,
    attendanceRate: 94,
    assignmentsCompleted: 42,
    totalAssignments: 45
  });

  const [subjectPerformance] = useState<SubjectPerformance[]>([
    { subject: 'Mathematics', score: 92, totalTests: 8, trend: 'up', color: '#667eea' },
    { subject: 'Physics', score: 85, totalTests: 7, trend: 'up', color: '#10ac8b' },
    { subject: 'Chemistry', score: 88, totalTests: 6, trend: 'stable', color: '#f59e0b' },
    { subject: 'Biology', score: 90, totalTests: 8, trend: 'up', color: '#ec4899' },
    { subject: 'English', score: 82, totalTests: 5, trend: 'down', color: '#06b6d4' },
    { subject: 'History', score: 86, totalTests: 6, trend: 'stable', color: '#8b5cf6' }
  ]);

  const [performanceTrend] = useState<PerformanceData[]>([
    { month: 'Jan', score: 78 },
    { month: 'Feb', score: 82 },
    { month: 'Mar', score: 80 },
    { month: 'Apr', score: 85 },
    { month: 'May', score: 87 },
    { month: 'Jun', score: 87 }
  ]);

  const [aiSuggestions] = useState([
    {
      id: '1',
      type: 'improvement',
      subject: 'English',
      title: 'Focus on English Literature',
      description: 'Your English scores have declined by 8% in the last month. Consider spending 30 minutes daily on reading comprehension exercises.',
      priority: 'high',
      icon: 'fa-exclamation-circle'
    },
    {
      id: '2',
      type: 'strength',
      subject: 'Mathematics',
      title: 'Excellent Progress in Math',
      description: 'You\'ve shown consistent improvement in Mathematics. Keep practicing advanced calculus problems to maintain this momentum.',
      priority: 'medium',
      icon: 'fa-star'
    },
    {
      id: '3',
      type: 'recommendation',
      subject: 'General',
      title: 'Optimize Study Schedule',
      description: 'Based on your performance patterns, you learn best between 9 AM - 11 AM. Schedule difficult subjects during this time.',
      priority: 'medium',
      icon: 'fa-lightbulb'
    },
    {
      id: '4',
      type: 'achievement',
      subject: 'Biology',
      title: 'Top Performer',
      description: 'Congratulations! You\'re in the top 5% for Biology. Consider participating in science competitions.',
      priority: 'low',
      icon: 'fa-trophy'
    }
  ]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'fa-arrow-up';
      case 'down': return 'fa-arrow-down';
      case 'stable': return 'fa-minus';
      default: return 'fa-minus';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10ac8b';
      case 'down': return '#ef4444';
      case 'stable': return '#f59e0b';
      default: return '#718096';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10ac8b';
      default: return '#718096';
    }
  };

  const maxScore = Math.max(...performanceTrend.map(d => d.score));

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-chart-line" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Performance Tracker
            </h1>
            <p>Monitor your academic progress with detailed analytics and insights</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Class Rank</p>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>
                #{overallPerformance.rank}
              </h3>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="stat-info">
              <h4>Average Score</h4>
              <p className="stat-value">
                {overallPerformance.averageScore}% <span className="stat-total">overall</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${overallPerformance.averageScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-info">
              <h4>Current GPA</h4>
              <p className="stat-value">
                {overallPerformance.currentGPA} <span className="stat-total">/ 4.0</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(overallPerformance.currentGPA / 4) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>Attendance Rate</h4>
              <p className="stat-value">
                {overallPerformance.attendanceRate}% <span className="stat-total">present</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${overallPerformance.attendanceRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trend Chart */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-chart-area" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Performance Trend
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Your academic performance over the last 6 months
          </p>
        </div>

        {/* Chart */}
        <div style={{ position: 'relative', height: '300px' }}>
          {/* Y-axis labels */}
          <div style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: '30px',
            width: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingRight: '0.5rem'
          }}>
            {[100, 75, 50, 25, 0].map((val) => (
              <span key={val} style={{ fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                {val}
              </span>
            ))}
          </div>

          {/* Chart area */}
          <div style={{
            position: 'absolute',
            left: '50px',
            right: 0,
            top: 0,
            bottom: '30px',
            borderLeft: '2px solid #e2e8f0',
            borderBottom: '2px solid #e2e8f0'
          }}>
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((val) => (
              <div
                key={val}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: `${val}%`,
                  borderTop: '1px dashed #e2e8f0'
                }}
              />
            ))}

            {/* Bars and line */}
            <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              display: 'flex',
              alignItems: 'flex-end',
              gap: '2%',
              padding: '0 1%'
            }}>
              {performanceTrend.map((data, index) => {
                const heightPercentage = data.score;
                return (
                  <div
                    key={data.month}
                    style={{
                      flex: 1,
                      position: 'relative',
                      height: '100%'
                    }}
                  >
                    {/* Score label */}
                    <div style={{
                      position: 'absolute',
                      bottom: `${heightPercentage}%`,
                      left: '50%',
                      transform: 'translate(-50%, -30px)',
                      background: '#2d3748',
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      zIndex: 10
                    }}>
                      {data.score}%
                    </div>

                    {/* Bar */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: `${heightPercentage}%`,
                        background: data.score === maxScore
                          ? 'linear-gradient(180deg, #10ac8b 0%, #094d88 100%)'
                          : 'linear-gradient(180deg, #667eea 0%, #094d88 100%)',
                        borderRadius: '8px 8px 0 0',
                        transition: 'all 0.3s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.opacity = '0.8';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.opacity = '1';
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* X-axis labels */}
          <div style={{
            position: 'absolute',
            left: '50px',
            right: 0,
            bottom: 0,
            height: '30px',
            display: 'flex',
            gap: '2%',
            padding: '0 1%'
          }}>
            {performanceTrend.map((data) => (
              <div
                key={data.month}
                style={{
                  flex: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '0.875rem',
                  color: '#718096',
                  fontWeight: 600
                }}
              >
                {data.month}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject-wise Performance */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-book" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Subject-wise Performance
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Detailed breakdown of your performance in each subject
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {subjectPerformance.map((subject) => (
            <div
              key={subject.subject}
              style={{
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.3s',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = subject.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${subject.color}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Trend indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '32px',
                height: '32px',
                background: getTrendColor(subject.trend),
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${getTrendColor(subject.trend)}40`
              }}>
                <i className={`fas ${getTrendIcon(subject.trend)}`} style={{ color: 'white', fontSize: '0.875rem' }}></i>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                  {subject.subject}
                </h3>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                  {subject.totalTests} tests completed
                </p>
              </div>

              {/* Score display */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: subject.color }}>
                    {subject.score}
                  </span>
                  <span style={{ fontSize: '1rem', color: '#718096', fontWeight: 600 }}>
                    / 100
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: '#e2e8f0',
                  borderRadius: '6px',
                  overflow: 'hidden'
                }}>
                  <div
                    style={{
                      width: `${subject.score}%`,
                      height: '100%',
                      background: subject.color,
                      borderRadius: '6px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>
              </div>

              {/* Grade */}
              <div style={{
                display: 'inline-block',
                background: subject.color,
                color: 'white',
                padding: '0.375rem 0.875rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 700
              }}>
                Grade: {subject.score >= 90 ? 'A+' : subject.score >= 80 ? 'A' : subject.score >= 70 ? 'B' : 'C'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Powered Suggestions */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '2rem'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-robot" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            AI-Powered Suggestions
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Personalized recommendations based on your performance data
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {aiSuggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #ffffff 100%)',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                gap: '1.5rem',
                transition: 'all 0.3s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = getPriorityColor(suggestion.priority);
                e.currentTarget.style.boxShadow = `0 8px 20px ${getPriorityColor(suggestion.priority)}20`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Priority indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: getPriorityColor(suggestion.priority),
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {suggestion.priority}
              </div>

              {/* Icon */}
              <div style={{
                width: '60px',
                height: '60px',
                background: `${getPriorityColor(suggestion.priority)}15`,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className={`fas ${suggestion.icon}`} style={{
                  fontSize: '1.5rem',
                  color: getPriorityColor(suggestion.priority)
                }}></i>
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingRight: '5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{
                    background: '#094d88',
                    color: 'white',
                    padding: '0.25rem 0.625rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}>
                    {suggestion.subject}
                  </span>
                </div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
                  {suggestion.title}
                </h3>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {suggestion.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Assignments Completion */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #667eea 0%, #094d88 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <i className="fas fa-tasks" style={{ color: 'white', fontSize: '1.5rem' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
            Assignment Completion
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#094d88' }}>
              {overallPerformance.assignmentsCompleted}
            </span>
            <span style={{ fontSize: '1.125rem', color: '#718096', fontWeight: 600 }}>
              / {overallPerformance.totalAssignments}
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#e2e8f0',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div
              style={{
                width: `${(overallPerformance.assignmentsCompleted / overallPerformance.totalAssignments) * 100}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #667eea 0%, #094d88 100%)',
                borderRadius: '4px'
              }}
            />
          </div>
        </div>

        {/* Class Rank */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #10ac8b 0%, #094d88 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <i className="fas fa-medal" style={{ color: 'white', fontSize: '1.5rem' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
            Class Ranking
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10ac8b' }}>
              #{overallPerformance.rank}
            </span>
            <span style={{ fontSize: '1.125rem', color: '#718096', fontWeight: 600 }}>
              / {overallPerformance.totalStudents}
            </span>
          </div>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
            Top {Math.round((overallPerformance.rank / overallPerformance.totalStudents) * 100)}% of class
          </p>
        </div>

        {/* Study Hours */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #094d88 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <i className="fas fa-clock" style={{ color: 'white', fontSize: '1.5rem' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
            Study Time This Week
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#f59e0b' }}>
              24.5
            </span>
            <span style={{ fontSize: '1.125rem', color: '#718096', fontWeight: 600 }}>
              hours
            </span>
          </div>
          <p style={{ margin: 0, color: '#10ac8b', fontSize: '0.875rem', fontWeight: 600 }}>
            <i className="fas fa-arrow-up" style={{ marginRight: '0.25rem' }}></i>
            12% more than last week
          </p>
        </div>
      </div>
    </>
  );
};

export default PerformanceTracker;
