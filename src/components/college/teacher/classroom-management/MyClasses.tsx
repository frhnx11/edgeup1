import { useState } from 'react';

interface Class {
  id: string;
  name: string;
  code: string;
  semester: string;
  students: number;
  schedule: string;
  room: string;
  nextClass: string;
  attendanceRate: number;
  avgEngagement: number;
}

interface MyClassesProps {
  onMarkAttendance?: (classData: Class) => void;
}

const MyClasses = ({ onMarkAttendance }: MyClassesProps) => {
  const [activeOnlineClass, setActiveOnlineClass] = useState<Class | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const [classes] = useState<Class[]>([
    {
      id: '1',
      name: 'Data Structures',
      code: 'CS301',
      semester: 'Fall 2025',
      students: 45,
      schedule: 'Mon, Wed, Fri - 9:00 AM',
      room: 'Room 301',
      nextClass: 'Today at 9:00 AM',
      attendanceRate: 93,
      avgEngagement: 88
    },
    {
      id: '2',
      name: 'Algorithms',
      code: 'CS401',
      semester: 'Fall 2025',
      students: 38,
      schedule: 'Tue, Thu - 11:00 AM',
      room: 'Room 405',
      nextClass: 'Today at 11:00 AM',
      attendanceRate: 89,
      avgEngagement: 85
    },
    {
      id: '3',
      name: 'Database Systems',
      code: 'CS302',
      semester: 'Fall 2025',
      students: 50,
      schedule: 'Mon, Wed - 2:00 PM',
      room: 'Lab 2A',
      nextClass: 'Today at 2:00 PM',
      attendanceRate: 91,
      avgEngagement: 92
    },
    {
      id: '4',
      name: 'Operating Systems',
      code: 'CS303',
      semester: 'Fall 2025',
      students: 42,
      schedule: 'Tue, Thu, Fri - 3:00 PM',
      room: 'Room 302',
      nextClass: 'Tomorrow at 3:00 PM',
      attendanceRate: 87,
      avgEngagement: 80
    },
    {
      id: '5',
      name: 'Computer Networks',
      code: 'CS304',
      semester: 'Fall 2025',
      students: 46,
      schedule: 'Mon, Wed, Fri - 1:00 PM',
      room: 'Lab 3B',
      nextClass: 'Tomorrow at 1:00 PM',
      attendanceRate: 95,
      avgEngagement: 94
    },
    {
      id: '6',
      name: 'Software Engineering',
      code: 'CS402',
      semester: 'Fall 2025',
      students: 46,
      schedule: 'Tue, Thu - 4:00 PM',
      room: 'Room 406',
      nextClass: 'Tomorrow at 4:00 PM',
      attendanceRate: 90,
      avgEngagement: 87
    }
  ]);

  const getEngagementColor = (engagement: number): string => {
    if (engagement >= 85) return '#10ac8b';
    if (engagement >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getAttendanceColor = (rate: number): string => {
    if (rate >= 90) return '#10ac8b';
    if (rate >= 75) return '#f59e0b';
    return '#ef4444';
  };

  // If online class is active, show video meeting interface
  if (activeOnlineClass) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#1a1a1a' }}>
        {/* Top Bar */}
        <div style={{
          padding: '16px 24px',
          background: '#2d2d2d',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #404040'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ color: 'white', margin: 0, fontSize: '18px', fontWeight: '600' }}>
              {activeOnlineClass.name} ({activeOnlineClass.code})
            </h3>
            <div style={{
              padding: '6px 14px',
              background: isRecording ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              fontSize: '13px',
              color: 'white',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {isRecording && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'white', animation: 'pulse 1.5s infinite' }}></div>}
              {isRecording ? `REC ${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, '0')}` : 'Not Recording'}
            </div>
          </div>

          <button
            onClick={() => setActiveOnlineClass(null)}
            style={{
              padding: '10px 24px',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              borderRadius: '8px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
            }}
          >
            <i className="fas fa-phone-slash" style={{ marginRight: '8px' }}></i>
            End Class
          </button>
        </div>

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Video Grid Area */}
          <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
            {/* Teacher Video (Main) */}
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              borderRadius: '16px',
              marginBottom: '20px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
              {/* Simulated teacher video */}
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px',
                color: 'white',
                fontWeight: '700'
              }}>
                <i className="fas fa-user-circle"></i>
              </div>

              {/* Video overlay info */}
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '16px',
                background: 'rgba(0, 0, 0, 0.7)',
                padding: '10px 16px',
                borderRadius: '8px',
                color: 'white',
                fontSize: '14px',
                fontWeight: '600',
                backdropFilter: 'blur(10px)'
              }}>
                <i className="fas fa-chalkboard-teacher" style={{ marginRight: '8px' }}></i>
                You (Teacher)
              </div>

              {/* Camera/Mic status */}
              <div style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                display: 'flex',
                gap: '8px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isCameraOn ? 'rgba(16, 172, 139, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <i className={isCameraOn ? 'fas fa-video' : 'fas fa-video-slash'}></i>
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: isMicOn ? 'rgba(16, 172, 139, 0.9)' : 'rgba(239, 68, 68, 0.9)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  <i className={isMicOn ? 'fas fa-microphone' : 'fas fa-microphone-slash'}></i>
                </div>
              </div>
            </div>

            {/* Student Grid */}
            <div>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>
                <i className="fas fa-users" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
                Students ({activeOnlineClass.students} joined)
              </h4>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px'
              }}>
                {Array.from({ length: Math.min(12, activeOnlineClass.students) }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      aspectRatio: '16/9',
                      background: 'linear-gradient(135deg, #2d2d2d 0%, #404040 100%)',
                      borderRadius: '12px',
                      position: 'relative',
                      overflow: 'hidden',
                      border: '2px solid #404040',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#10ac8b';
                      e.currentTarget.style.transform = 'scale(1.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#404040';
                      e.currentTarget.style.transform = 'scale(1)';
                    }}
                  >
                    <div style={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '48px',
                      color: '#666'
                    }}>
                      <i className="fas fa-user-circle"></i>
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '8px',
                      left: '8px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      color: 'white',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      Student {idx + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar - Participants/Chat */}
          {(showParticipants || showChat) && (
            <div style={{
              width: '350px',
              background: '#2d2d2d',
              borderLeft: '1px solid #404040',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #404040' }}>
                <button
                  onClick={() => { setShowParticipants(true); setShowChat(false); }}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: showParticipants ? '#1a1a1a' : 'transparent',
                    border: 'none',
                    color: showParticipants ? '#10ac8b' : '#999',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderBottom: showParticipants ? '2px solid #10ac8b' : 'none'
                  }}
                >
                  <i className="fas fa-users" style={{ marginRight: '8px' }}></i>
                  Participants ({activeOnlineClass.students})
                </button>
                <button
                  onClick={() => { setShowChat(true); setShowParticipants(false); }}
                  style={{
                    flex: 1,
                    padding: '16px',
                    background: showChat ? '#1a1a1a' : 'transparent',
                    border: 'none',
                    color: showChat ? '#10ac8b' : '#999',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    borderBottom: showChat ? '2px solid #10ac8b' : 'none'
                  }}
                >
                  <i className="fas fa-comments" style={{ marginRight: '8px' }}></i>
                  Chat
                </button>
              </div>

              {/* Content */}
              <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
                {showParticipants && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Array.from({ length: Math.min(15, activeOnlineClass.students) }).map((_, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '12px',
                          background: '#1a1a1a',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          border: '1px solid #404040'
                        }}
                      >
                        <div style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}>
                          S{idx + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: 'white', fontSize: '14px', fontWeight: '600' }}>
                            Student {idx + 1}
                          </div>
                          <div style={{ color: '#999', fontSize: '12px' }}>
                            <i className="fas fa-circle" style={{ fontSize: '6px', marginRight: '6px', color: '#10ac8b' }}></i>
                            Active
                          </div>
                        </div>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: Math.random() > 0.5 ? 'rgba(16, 172, 139, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: Math.random() > 0.5 ? '#10ac8b' : '#ef4444',
                          fontSize: '12px'
                        }}>
                          <i className={Math.random() > 0.5 ? 'fas fa-microphone' : 'fas fa-microphone-slash'}></i>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {showChat && (
                  <div style={{ color: '#999', textAlign: 'center', padding: '40px 20px' }}>
                    <i className="fas fa-comments" style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.3 }}></i>
                    <p>Chat messages will appear here</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div style={{
          padding: '20px 24px',
          background: '#2d2d2d',
          borderTop: '1px solid #404040',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}>
          <button
            onClick={() => setIsMicOn(!isMicOn)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: isMicOn ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className={isMicOn ? 'fas fa-microphone' : 'fas fa-microphone-slash'}></i>
          </button>

          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: isCameraOn ? 'rgba(255, 255, 255, 0.1)' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className={isCameraOn ? 'fas fa-video' : 'fas fa-video-slash'}></i>
          </button>

          <button
            onClick={() => setIsScreenSharing(!isScreenSharing)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: isScreenSharing ? 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className="fas fa-desktop"></i>
          </button>

          <button
            onClick={() => setIsRecording(!isRecording)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: isRecording ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className={isRecording ? 'fas fa-stop-circle' : 'fas fa-record-vinyl'}></i>
          </button>

          <div style={{ width: '2px', height: '40px', background: '#404040', margin: '0 8px' }}></div>

          <button
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className="fas fa-chalkboard"></i>
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: showChat ? 'linear-gradient(135deg, #094d88 0%, #0a5699 100%)' : 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className="fas fa-comment-alt"></i>
          </button>

          <button
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: 'white',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className="fas fa-cog"></i>
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>My Classes</h1>
            <p>Manage your classes and track student participation</p>
          </div>
          <div className="streak-badge">
            <i className="fas fa-chalkboard"></i>
            <div>
              <strong>{classes.length}</strong>
              <span>Active Classes</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h4>Total Students</h4>
              <p className="stat-value">
                {classes.reduce((sum, c) => sum + c.students, 0)} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: '100%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-info">
              <h4>Avg Attendance</h4>
              <p className="stat-value">
                {Math.round(classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length)}% <span className="stat-total">overall</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${Math.round(classes.reduce((sum, c) => sum + c.attendanceRate, 0) / classes.length)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <h4>Avg Engagement</h4>
              <p className="stat-value">
                {Math.round(classes.reduce((sum, c) => sum + c.avgEngagement, 0) / classes.length)}% <span className="stat-total">this week</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${Math.round(classes.reduce((sum, c) => sum + c.avgEngagement, 0) / classes.length)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Classes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {classes.map((classItem) => (
          <div
            key={classItem.id}
            className="dashboard-card"
            style={{
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }}
          >
            {/* Class Header */}
            <div style={{ marginBottom: '16px', borderBottom: '1px solid #e9ecef', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                    {classItem.name}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                    {classItem.code} • {classItem.semester}
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  backgroundColor: 'rgba(9, 77, 136, 0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#094d88'
                }}>
                  {classItem.students} students
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6c757d' }}>
                  <i className="fas fa-clock" style={{ fontSize: '12px' }}></i>
                  {classItem.schedule}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#6c757d' }}>
                  <i className="fas fa-map-marker-alt" style={{ fontSize: '12px' }}></i>
                  {classItem.room}
                </div>
              </div>
            </div>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <i className="fas fa-user-check" style={{ fontSize: '14px', color: getAttendanceColor(classItem.attendanceRate) }}></i>
                  <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Attendance Rate</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: getAttendanceColor(classItem.attendanceRate) }}>
                  {classItem.attendanceRate}%
                </div>
              </div>

              <div style={{
                padding: '12px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <i className="fas fa-chart-line" style={{ fontSize: '14px', color: getEngagementColor(classItem.avgEngagement) }}></i>
                  <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>Engagement</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: getEngagementColor(classItem.avgEngagement) }}>
                  {classItem.avgEngagement}%
                </div>
              </div>
            </div>

            {/* Next Class Info */}
            <div style={{
              padding: '12px',
              backgroundColor: 'rgba(16, 172, 139, 0.05)',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-calendar-alt" style={{ fontSize: '14px', color: '#10ac8b' }}></i>
                <span style={{ fontSize: '13px', color: '#212529', fontWeight: '600' }}>Next Class:</span>
                <span style={{ fontSize: '13px', color: '#6c757d' }}>{classItem.nextClass}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '10px' }}>
              <button
                onClick={() => setActiveOnlineClass(classItem)}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(139, 92, 246, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-video"></i>
                Start Online Class
              </button>

              <button
                onClick={() => onMarkAttendance && onMarkAttendance(classItem)}
                style={{
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-user-check"></i>
                Mark Attendance
              </button>

              <button
                style={{
                  padding: '12px 20px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  color: '#094d88',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.borderColor = '#094d88';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#e9ecef';
                }}
              >
                <i className="fas fa-ellipsis-h"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default MyClasses;
