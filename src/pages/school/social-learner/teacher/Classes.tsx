import { useState } from 'react';

interface Class {
  id: string;
  name: string;
  grade: string;
  subject: string;
  students: number;
  schedule: string;
  room: string;
  nextClass: string;
}

const Classes = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: '1',
      name: 'Mathematics - Grade 10A',
      grade: '10A',
      subject: 'Mathematics',
      students: 32,
      schedule: 'Mon, Wed, Fri - 10:00 AM',
      room: 'Room 204',
      nextClass: 'Today at 10:00 AM'
    },
    {
      id: '2',
      name: 'Mathematics - Grade 10B',
      grade: '10B',
      subject: 'Mathematics',
      students: 28,
      schedule: 'Tue, Thu - 11:00 AM',
      room: 'Room 204',
      nextClass: 'Tomorrow at 11:00 AM'
    },
    {
      id: '3',
      name: 'Advanced Mathematics - Grade 11',
      grade: '11',
      subject: 'Advanced Mathematics',
      students: 24,
      schedule: 'Mon, Wed - 2:00 PM',
      room: 'Room 305',
      nextClass: 'Today at 2:00 PM'
    },
    {
      id: '4',
      name: 'Calculus - Grade 12',
      grade: '12',
      subject: 'Calculus',
      students: 30,
      schedule: 'Tue, Thu, Fri - 9:00 AM',
      room: 'Room 305',
      nextClass: 'Tomorrow at 9:00 AM'
    }
  ]);

  const [currentView, setCurrentView] = useState<'list' | 'start'>('list');
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showAddClassModal, setShowAddClassModal] = useState(false);
  const [newClass, setNewClass] = useState({
    subject: '',
    grade: '',
    students: '',
    schedule: '',
    room: '',
    nextClass: ''
  });

  const handleStartClass = (classItem: Class) => {
    setSelectedClass(classItem);
    setCurrentView('start');
  };

  const handleBackToList = () => {
    setCurrentView('list');
    setSelectedClass(null);
  };

  const handleAddClass = () => {
    if (!newClass.subject || !newClass.grade || !newClass.students || !newClass.schedule || !newClass.room) {
      alert('Please fill in all required fields');
      return;
    }

    const classToAdd: Class = {
      id: (classes.length + 1).toString(),
      name: `${newClass.subject} - Grade ${newClass.grade}`,
      grade: newClass.grade,
      subject: newClass.subject,
      students: parseInt(newClass.students),
      schedule: newClass.schedule,
      room: newClass.room,
      nextClass: newClass.nextClass || 'Not scheduled'
    };

    setClasses([...classes, classToAdd]);
    setShowAddClassModal(false);
    setNewClass({
      subject: '',
      grade: '',
      students: '',
      schedule: '',
      room: '',
      nextClass: ''
    });
  };

  // Start Class Page
  if (currentView === 'start' && selectedClass) {
    // Generate a mock meeting link
    const meetingLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;

    return (
      <>
        {/* Back Button */}
        <button
          onClick={handleBackToList}
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
            gap: '0.5rem',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#094d88';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'white';
            e.currentTarget.style.color = '#094d88';
          }}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back</span>
        </button>

        {/* Main Content Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '3rem',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Class Info Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '3rem',
            paddingBottom: '2rem',
            borderBottom: '2px solid #f7fafc'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 1.5rem',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 25px rgba(9, 77, 136, 0.3)'
            }}>
              <i className="fas fa-video" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <h1 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
              {selectedClass.name}
            </h1>
            <div style={{ color: '#718096', fontSize: '1.05rem', display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <i className="fas fa-users" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                {selectedClass.students} Students
              </div>
              <div>
                <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                {selectedClass.schedule}
              </div>
              <div>
                <i className="fas fa-door-open" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                {selectedClass.room}
              </div>
            </div>
          </div>

          {/* Meeting Link Section */}
          <div style={{
            background: '#f7fafc',
            borderRadius: '12px',
            padding: '2rem',
            marginBottom: '2rem',
            border: '2px solid #e2e8f0'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
              <i className="fas fa-link" style={{ color: '#10ac8b', marginRight: '0.75rem' }}></i>
              Meeting Link
            </h3>
            <div style={{
              background: 'white',
              padding: '1rem 1.5rem',
              borderRadius: '10px',
              border: '2px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <code style={{
                color: '#094d88',
                fontSize: '0.95rem',
                fontWeight: 600,
                fontFamily: 'monospace'
              }}>
                {meetingLink}
              </code>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(meetingLink);
                  alert('Link copied to clipboard!');
                }}
                style={{
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(9, 77, 136, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-copy"></i>
                Copy
              </button>
            </div>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
              Share this link with your students to join the class
            </p>
          </div>

          {/* Join Meeting Button */}
          <button
            onClick={() => window.open(meetingLink, '_blank')}
            style={{
              width: '100%',
              padding: '1.25rem',
              background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: '0 8px 25px rgba(9, 77, 136, 0.4)',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
            }}
          >
            <i className="fas fa-video" style={{ fontSize: '1.5rem' }}></i>
            Join Meeting
          </button>
        </div>
      </>
    );
  }

  // Classes List Page (default view)
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1><i className="fas fa-chalkboard-teacher" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>My Classes</h1>
            <p>Manage your teaching schedule and track class progress</p>
          </div>
          <button
            className="sign-in-btn"
            onClick={() => setShowAddClassModal(true)}
            style={{
              height: 'fit-content',
              background: 'rgba(255, 255, 255, 0.95)',
              border: 'none',
              borderRadius: '16px',
              padding: '1.25rem 2.5rem',
              fontSize: '1.05rem',
              fontWeight: 700,
              color: '#094d88',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px) scale(1.03)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.25), inset 0 1px 2px rgba(255, 255, 255, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.95)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.8)';
            }}
          >
            <i className="fas fa-plus-circle" style={{ fontSize: '1.2rem' }}></i>
            <span>Add New Class</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chalkboard"></i>
            </div>
            <div className="stat-info">
              <h4>Active Classes</h4>
              <p className="stat-value">
                {classes.length} <span className="stat-total">classes</span>
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
              <h4>Total Students</h4>
              <p className="stat-value">
                {classes.reduce((sum, cls) => sum + cls.students, 0)}{' '}
                <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>Classes Today</h4>
              <p className="stat-value">
                2 <span className="stat-total">sessions</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '50%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <i className="fas fa-book-open"></i>
          <div className="metric-info">
            <h2>4</h2>
            <p>Subjects Teaching</p>
          </div>
          <span className="metric-change positive">+1</span>
        </div>
        <div className="metric-card">
          <i className="fas fa-clock"></i>
          <div className="metric-info">
            <h2>18</h2>
            <p>Hours/Week</p>
          </div>
        </div>
        <div className="metric-card">
          <i className="fas fa-star"></i>
          <div className="metric-info">
            <h2>4.8</h2>
            <p>Avg Rating</p>
          </div>
          <span className="metric-change positive">+0.2</span>
        </div>
        <div className="metric-card">
          <i className="fas fa-percentage"></i>
          <div className="metric-info">
            <h2>92%</h2>
            <p>Class Avg Score</p>
          </div>
          <span className="metric-change positive">+3%</span>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="dashboard-grid">
        {classes.map((classItem) => (
          <div className="dashboard-card" key={classItem.id}>
            <div className="card-header">
              <div className="card-title">
                <i className="fas fa-book"></i>
                <div>
                  <h3>{classItem.name}</h3>
                  <p>Grade {classItem.grade} • {classItem.students} students</p>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="schedule-item">
                <div className="schedule-details" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: 0, color: '#2d3748' }}>
                        <i className="fas fa-clock"></i> Next Class
                      </h4>
                      <p style={{ margin: '0.25rem 0', color: '#667eea', fontWeight: 500 }}>
                        {classItem.nextClass}
                      </p>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#2d3748' }}>
                        <i className="fas fa-door-open"></i> Room
                      </h4>
                      <p style={{ margin: '0.25rem 0', color: '#667eea', fontWeight: 500 }}>
                        {classItem.room}
                      </p>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>
                      <i className="fas fa-calendar-alt"></i> Schedule
                    </h4>
                    <p style={{ margin: 0, color: '#718096' }}>{classItem.schedule}</p>
                  </div>

                  <div style={{ marginTop: '1rem' }}>
                    <button
                      className="sign-in-btn"
                      onClick={() => handleStartClass(classItem)}
                      style={{ width: '100%', fontSize: '0.9rem', padding: '0.6rem' }}
                    >
                      <i className="fas fa-play"></i> Start Class
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Class Modal */}
      {showAddClassModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
            animation: 'slideUp 0.3s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              paddingBottom: '1.5rem',
              borderBottom: '2px solid #f7fafc'
            }}>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
                  <i className="fas fa-plus-circle" style={{ color: '#10ac8b', marginRight: '0.75rem' }}></i>
                  Add New Class
                </h2>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.95rem' }}>
                  Fill in the details to create a new class
                </p>
              </div>
              <button
                onClick={() => setShowAddClassModal(false)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  color: '#718096',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  lineHeight: 1,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#dc3545';
                  e.currentTarget.style.transform = 'rotate(90deg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#718096';
                  e.currentTarget.style.transform = 'rotate(0deg)';
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Subject */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-book" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                  Subject *
                </label>
                <input
                  type="text"
                  value={newClass.subject}
                  onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                  placeholder="e.g., Mathematics, Physics, Chemistry"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Grade */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-graduation-cap" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                  Grade *
                </label>
                <input
                  type="text"
                  value={newClass.grade}
                  onChange={(e) => setNewClass({ ...newClass, grade: e.target.value })}
                  placeholder="e.g., 10A, 11, 12B"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Number of Students */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-users" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                  Number of Students *
                </label>
                <input
                  type="number"
                  value={newClass.students}
                  onChange={(e) => setNewClass({ ...newClass, students: e.target.value })}
                  placeholder="e.g., 30"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Schedule */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                  Schedule *
                </label>
                <input
                  type="text"
                  value={newClass.schedule}
                  onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
                  placeholder="e.g., Mon, Wed, Fri - 10:00 AM"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Room */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-door-open" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                  Room *
                </label>
                <input
                  type="text"
                  value={newClass.room}
                  onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                  placeholder="e.g., Room 204"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>

              {/* Next Class (Optional) */}
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#2d3748',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: '#094d88' }}></i>
                  Next Class <span style={{ color: '#718096', fontWeight: 400, textTransform: 'none' }}>(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newClass.nextClass}
                  onChange={(e) => setNewClass({ ...newClass, nextClass: e.target.value })}
                  placeholder="e.g., Today at 10:00 AM"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    fontSize: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    outline: 'none',
                    transition: 'all 0.3s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '2px solid #f7fafc'
            }}>
              <button
                onClick={() => setShowAddClassModal(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  background: 'white',
                  color: '#2d3748',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#094d88';
                  e.currentTarget.style.color = '#094d88';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.color = '#2d3748';
                }}
              >
                <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
                Cancel
              </button>
              <button
                onClick={handleAddClass}
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '12px',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  boxShadow: '0 8px 25px rgba(9, 77, 136, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 12px 30px rgba(9, 77, 136, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 25px rgba(9, 77, 136, 0.4)';
                }}
              >
                <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>
                Add Class
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Classes;
