import { useState } from 'react';

interface LiveClass {
  id: string;
  subject: string;
  teacher: string;
  time: string;
  duration: string;
  meetingLink: string;
  platform: 'zoom' | 'meet';
  participantCount: number;
  status: 'live' | 'starting-soon';
}

const Classes = () => {
  const [liveClasses] = useState<LiveClass[]>([
    {
      id: '1',
      subject: 'Mathematics - Advanced Calculus',
      teacher: 'Prof. Sarah Martinez',
      time: '10:00 AM - 11:00 AM',
      duration: '60 min',
      meetingLink: 'https://zoom.us/j/123456789',
      platform: 'zoom',
      participantCount: 24,
      status: 'live'
    },
    {
      id: '2',
      subject: 'Physics - Quantum Mechanics',
      teacher: 'Dr. Vishnu Prasad',
      time: '11:30 AM - 12:30 PM',
      duration: '60 min',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      platform: 'meet',
      participantCount: 18,
      status: 'starting-soon'
    }
  ]);

  const getPlatformIcon = (platform: string) => {
    return platform === 'zoom' ? 'fa-video' : 'fa-video';
  };

  const getPlatformColor = (platform: string) => {
    return platform === 'zoom' ? '#2D8CFF' : '#00897B';
  };

  const getStatusColor = (status: string) => {
    return status === 'live' ? '#ef4444' : '#f59e0b';
  };

  const getStatusLabel = (status: string) => {
    return status === 'live' ? 'LIVE NOW' : 'STARTING SOON';
  };

  const handleJoinClass = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    alert('Meeting link copied to clipboard!');
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-book-open" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Live Classes
            </h1>
            <p>Join your ongoing and upcoming live classes</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: '#ef4444',
                borderRadius: '50%',
                animation: 'pulse 2s infinite'
              }}></div>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
                {liveClasses.filter(c => c.status === 'live').length} Live
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-video"></i>
            </div>
            <div className="stat-info">
              <h4>Active Classes</h4>
              <p className="stat-value">
                {liveClasses.length} <span className="stat-total">classes</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h4>Total Participants</h4>
              <p className="stat-value">
                {liveClasses.reduce((sum, c) => sum + c.participantCount, 0)} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Total Duration</h4>
              <p className="stat-value">
                {liveClasses.length * 60} <span className="stat-total">minutes</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Classes Grid */}
      {liveClasses.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          {liveClasses.map((liveClass) => (
            <div
              key={liveClass.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                overflow: 'hidden',
                position: 'relative',
                border: liveClass.status === 'live' ? '3px solid #ef4444' : '3px solid #f59e0b',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.18)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: getStatusColor(liveClass.status),
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 10
              }}>
                {liveClass.status === 'live' && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                )}
                {getStatusLabel(liveClass.status)}
              </div>

              {/* Class Header with Gradient */}
              <div style={{
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                padding: '2rem',
                paddingTop: '3.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '200px',
                  height: '200px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }}></div>

                <div style={{ position: 'relative', zIndex: 1 }}>
                  <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                    {liveClass.subject}
                  </h2>
                  <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-chalkboard-teacher" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}></i>
                      <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                        {liveClass.teacher}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-clock" style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}></i>
                      <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                        {liveClass.time}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Class Info */}
              <div style={{ padding: '2rem' }}>
                {/* Platform and Participants */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: getPlatformColor(liveClass.platform),
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className={`fas ${getPlatformIcon(liveClass.platform)}`} style={{ color: 'white', fontSize: '1.125rem' }}></i>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>Platform</p>
                      <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.9rem', color: '#2d3748', fontWeight: 700, textTransform: 'capitalize' }}>
                        {liveClass.platform === 'zoom' ? 'Zoom' : 'Google Meet'}
                      </p>
                    </div>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#667eea',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="fas fa-users" style={{ color: 'white', fontSize: '1.125rem' }}></i>
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>Participants</p>
                      <p style={{ margin: '0.125rem 0 0 0', fontSize: '0.9rem', color: '#2d3748', fontWeight: 700 }}>
                        {liveClass.participantCount} Students
                      </p>
                    </div>
                  </div>
                </div>

                {/* Meeting Link */}
                <div style={{
                  background: '#f7fafc',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  marginBottom: '1.5rem'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Meeting Link
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <input
                      type="text"
                      value={liveClass.meetingLink}
                      readOnly
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '0.9rem',
                        color: '#2d3748',
                        fontWeight: 500
                      }}
                    />
                    <button
                      onClick={() => handleCopyLink(liveClass.meetingLink)}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'white',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        color: '#2d3748',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#10ac8b';
                        e.currentTarget.style.color = '#10ac8b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#2d3748';
                      }}
                    >
                      <i className="fas fa-copy"></i>
                      Copy
                    </button>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={() => handleJoinClass(liveClass.meetingLink)}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 4px 16px rgba(9, 77, 136, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(9, 77, 136, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(9, 77, 136, 0.3)';
                  }}
                >
                  <i className="fas fa-video" style={{ fontSize: '1.25rem' }}></i>
                  Join Class Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#f7fafc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <i className="fas fa-video-slash" style={{ fontSize: '2rem', color: '#718096' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            No Live Classes
          </h3>
          <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
            There are no live classes at the moment. Check back later!
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }
      `}</style>
    </>
  );
};

export default Classes;
