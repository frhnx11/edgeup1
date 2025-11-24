import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  engagementScore: number;
  attentionLevel: 'high' | 'medium' | 'low';
  questionsAsked: number;
  participationCount: number;
}

interface LiveEngagementProps {
  onBack?: () => void;
}

const LiveEngagement = ({ onBack }: LiveEngagementProps) => {
  const [isLive, setIsLive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(0);
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Aravind Kumar', rollNumber: 'CS301-001', engagementScore: 92, attentionLevel: 'high', questionsAsked: 3, participationCount: 5 },
    { id: '2', name: 'Priya Lakshmi', rollNumber: 'CS301-002', engagementScore: 88, attentionLevel: 'high', questionsAsked: 2, participationCount: 4 },
    { id: '3', name: 'Rajesh Kannan', rollNumber: 'CS301-003', engagementScore: 75, attentionLevel: 'medium', questionsAsked: 1, participationCount: 2 },
    { id: '4', name: 'Karthik Raj', rollNumber: 'CS301-004', engagementScore: 68, attentionLevel: 'medium', questionsAsked: 1, participationCount: 1 },
    { id: '5', name: 'Divya Bharathi', rollNumber: 'CS301-005', engagementScore: 95, attentionLevel: 'high', questionsAsked: 4, participationCount: 6 },
    { id: '6', name: 'Vishnu Prasad', rollNumber: 'CS301-006', engagementScore: 45, attentionLevel: 'low', questionsAsked: 0, participationCount: 0 },
    { id: '7', name: 'Meenakshi Sundaram', rollNumber: 'CS301-007', engagementScore: 82, attentionLevel: 'high', questionsAsked: 2, participationCount: 3 },
    { id: '8', name: 'Lakshmi Devi', rollNumber: 'CS301-008', engagementScore: 58, attentionLevel: 'low', questionsAsked: 0, participationCount: 1 },
  ]);

  useEffect(() => {
    if (isLive) {
      const timer = setInterval(() => {
        setSessionDuration(prev => prev + 1);

        // Simulate engagement score fluctuations
        setStudents(prevStudents => prevStudents.map(student => ({
          ...student,
          engagementScore: Math.max(0, Math.min(100, student.engagementScore + (Math.random() - 0.5) * 5))
        })));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isLive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getEngagementColor = (score: number) => {
    if (score >= 80) return '#10ac8b';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getAttentionColor = (level: string) => {
    if (level === 'high') return '#10ac8b';
    if (level === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  const avgEngagement = Math.round(students.reduce((sum, s) => sum + s.engagementScore, 0) / students.length);
  const highEngagement = students.filter(s => s.engagementScore >= 80).length;
  const mediumEngagement = students.filter(s => s.engagementScore >= 60 && s.engagementScore < 80).length;
  const lowEngagement = students.filter(s => s.engagementScore < 60).length;

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              {onBack && (
                <button
                  onClick={onBack}
                  style={{
                    background: 'rgba(255, 255, 255, 0.25)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '10px',
                    padding: '10px 16px',
                    color: '#ffffff',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                  }}
                >
                  <i className="fas fa-arrow-left"></i>
                  Back
                </button>
              )}
            </div>
            <h1>Live Engagement Monitor</h1>
            <p>Track real-time student engagement and participation</p>
          </div>
          <div className="streak-badge">
            <i className={isLive ? 'fas fa-circle' : 'fas fa-circle-notch'} style={{ color: isLive ? '#10ac8b' : '#ffffff' }}></i>
            <div>
              <strong>{isLive ? 'LIVE' : 'READY'}</strong>
              <span>{isLive ? formatTime(sessionDuration) : 'Not Started'}</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <h4>Avg Engagement</h4>
              <p className="stat-value">
                {avgEngagement}% <span className="stat-total">class avg</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${avgEngagement}%`, backgroundColor: getEngagementColor(avgEngagement) }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-fire"></i>
            </div>
            <div className="stat-info">
              <h4>High Engagement</h4>
              <p className="stat-value">
                {highEngagement} <span className="stat-total">/ {students.length}</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(highEngagement / students.length) * 100}%`, backgroundColor: '#10ac8b' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h4>Need Attention</h4>
              <p className="stat-value">
                {lowEngagement} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(lowEngagement / students.length) * 100}%`, backgroundColor: '#ef4444' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Button */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setIsLive(!isLive)}
            style={{
              padding: '16px 48px',
              background: isLive
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <i className={isLive ? 'fas fa-stop' : 'fas fa-play'}></i>
            {isLive ? 'Stop Monitoring' : 'Start Live Session'}
          </button>
        </div>
      </div>

      {/* Engagement Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '20px' }}>
        <div className="dashboard-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(16, 172, 139, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            color: '#10ac8b'
          }}>
            <i className="fas fa-arrow-up"></i>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#10ac8b', marginBottom: '4px' }}>{highEngagement}</h3>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>High Engagement</p>
          <p style={{ fontSize: '12px', color: '#10ac8b', fontWeight: '600', marginTop: '4px' }}>80-100%</p>
        </div>

        <div className="dashboard-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            color: '#f59e0b'
          }}>
            <i className="fas fa-minus"></i>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>{mediumEngagement}</h3>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>Medium Engagement</p>
          <p style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '600', marginTop: '4px' }}>60-79%</p>
        </div>

        <div className="dashboard-card" style={{ textAlign: 'center' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: '28px',
            color: '#ef4444'
          }}>
            <i className="fas fa-arrow-down"></i>
          </div>
          <h3 style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444', marginBottom: '4px' }}>{lowEngagement}</h3>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>Low Engagement</p>
          <p style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600', marginTop: '4px' }}>Below 60%</p>
        </div>
      </div>

      {/* Student List */}
      <div className="dashboard-card">
        <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
            <i className="fas fa-users" style={{ marginRight: '8px', color: '#094d88' }}></i>
            Student Engagement Levels
          </h3>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
            Real-time monitoring of individual student engagement
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {students.map((student) => (
            <div
              key={student.id}
              style={{
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${getEngagementColor(student.engagementScore)}`
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${getEngagementColor(student.engagementScore)} 0%, ${getEngagementColor(student.engagementScore)}cc 100%)`,
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: '700',
                flexShrink: 0
              }}>
                {student.name.charAt(0)}
              </div>

              {/* Student Info */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>
                  {student.name}
                </h4>
                <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '8px' }}>
                  {student.rollNumber}
                </p>
                {/* Progress Bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, height: '8px', backgroundColor: '#e9ecef', borderRadius: '10px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${student.engagementScore}%`,
                        height: '100%',
                        backgroundColor: getEngagementColor(student.engagementScore),
                        borderRadius: '10px',
                        transition: 'width 0.5s ease'
                      }}
                    ></div>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: getEngagementColor(student.engagementScore), minWidth: '45px', textAlign: 'right' }}>
                    {Math.round(student.engagementScore)}%
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: '16px', paddingLeft: '16px', borderLeft: '2px solid #e9ecef' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#094d88', marginBottom: '2px' }}>
                    {student.questionsAsked}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase' }}>
                    Questions
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: '700', color: '#10ac8b', marginBottom: '2px' }}>
                    {student.participationCount}
                  </div>
                  <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase' }}>
                    Responses
                  </div>
                </div>
              </div>

              {/* Attention Badge */}
              <div style={{
                padding: '8px 16px',
                backgroundColor: getAttentionColor(student.attentionLevel) + '20',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                color: getAttentionColor(student.attentionLevel),
                textTransform: 'capitalize',
                minWidth: '90px',
                textAlign: 'center'
              }}>
                {student.attentionLevel}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="dashboard-card" style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
            <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
            AI-Powered Insights
          </h3>
          <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
            Recommendations based on current engagement levels
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(16, 172, 139, 0.05)',
            borderLeft: '4px solid #10ac8b',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <i className="fas fa-check-circle" style={{ color: '#10ac8b', fontSize: '18px' }}></i>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#212529' }}>Positive Trend</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0', paddingLeft: '30px' }}>
              Overall engagement is above 80%. Students are actively participating. Continue with the current teaching pace.
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderLeft: '4px solid #f59e0b',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b', fontSize: '18px' }}></i>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#212529' }}>Attention Needed</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0', paddingLeft: '30px' }}>
              {lowEngagement} student{lowEngagement !== 1 ? 's' : ''} showing low engagement. Consider interactive activities or direct engagement to re-capture attention.
            </p>
          </div>

          <div style={{
            padding: '16px',
            backgroundColor: 'rgba(9, 77, 136, 0.05)',
            borderLeft: '4px solid #094d88',
            borderRadius: '8px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <i className="fas fa-info-circle" style={{ color: '#094d88', fontSize: '18px' }}></i>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#212529' }}>Suggestion</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0', paddingLeft: '30px' }}>
              Try asking direct questions to students with medium engagement levels to boost their participation.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LiveEngagement;
