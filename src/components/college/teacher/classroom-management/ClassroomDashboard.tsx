interface ClassroomDashboardProps {
  onNavigate: (page: string) => void;
}

const ClassroomDashboard = ({ onNavigate }: ClassroomDashboardProps) => {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>Intelligent Classroom Management</h1>
            <p>Streamline attendance, monitor engagement, and gain actionable insights</p>
          </div>
          <div className="streak-badge">
            <i className="fas fa-chalkboard-teacher"></i>
            <div>
              <strong>6</strong>
              <span>Active Classes</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-info">
              <h4>Today's Attendance</h4>
              <p className="stat-value">
                89% <span className="stat-total">avg rate</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: '89%' }}
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
                82% <span className="stat-total">this week</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: '82%' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h4>Active Alerts</h4>
              <p className="stat-value">
                3 <span className="stat-total">require action</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: '60%' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          <div className="action-card" onClick={() => onNavigate('my-classes')}>
            <i className="fas fa-chalkboard"></i>
            <span>My Classes</span>
          </div>
          <div className="action-card" onClick={() => onNavigate('mark-attendance')}>
            <i className="fas fa-user-check"></i>
            <span>Mark Attendance</span>
          </div>
          <div className="action-card" onClick={() => onNavigate('live-engagement')}>
            <i className="fas fa-video"></i>
            <span>Live Engagement</span>
          </div>
          <div className="action-card" onClick={() => onNavigate('analytics')}>
            <i className="fas fa-chart-bar"></i>
            <span>Analytics</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Today's Classes */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fas fa-calendar-day"></i>
              <div>
                <h3>Today's Classes</h3>
                <p>Wednesday, November 19, 2025</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="schedule-item">
              <div className="schedule-time">
                <span className="time-value">9</span>
                <span className="time-period">AM</span>
              </div>
              <div className="schedule-details">
                <h4>Data Structures - CS301</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-users"></i> 45 students
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 1 hour
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> Room 301
                  </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(16, 172, 139, 0.1)',
                      color: '#10ac8b',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}
                  >
                    Attendance: 42/45 (93%)
                  </span>
                </div>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>

            <div className="schedule-item">
              <div className="schedule-time">
                <span className="time-value">11</span>
                <span className="time-period">AM</span>
              </div>
              <div className="schedule-details">
                <h4>Algorithms - CS401</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-users"></i> 38 students
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 1 hour
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> Room 405
                  </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      color: '#f59e0b',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}
                  >
                    Not marked yet
                  </span>
                </div>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>

            <div className="schedule-item">
              <div className="schedule-time">
                <span className="time-value">2</span>
                <span className="time-period">PM</span>
              </div>
              <div className="schedule-details">
                <h4>Database Systems - CS302</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-users"></i> 50 students
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 2 hours
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> Lab 2A
                  </span>
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      backgroundColor: 'rgba(108, 117, 125, 0.1)',
                      color: '#6c757d',
                      borderRadius: '4px',
                      fontWeight: '600'
                    }}
                  >
                    Upcoming
                  </span>
                </div>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>

        {/* Recent Alerts & Notifications */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fas fa-bell"></i>
              <div>
                <h3>Alerts & Notifications</h3>
                <p>Requires your attention</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="deadline-item urgent">
              <div className="deadline-icon">
                <i className="fas fa-user-times"></i>
              </div>
              <div className="deadline-details">
                <h4>Low Attendance Alert</h4>
                <div className="deadline-meta">
                  <span>Aravind Kumar - CS301</span>
                  <span className="deadline-tag" style={{ backgroundColor: '#dc3545' }}>Critical</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                  Attendance below 75% threshold (68%)
                </p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#094d88',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                View
              </button>
            </div>

            <div className="deadline-item urgent">
              <div className="deadline-icon">
                <i className="fas fa-user-shield"></i>
              </div>
              <div className="deadline-details">
                <h4>Possible Proxy Detection</h4>
                <div className="deadline-meta">
                  <span>CS401 - Today 11:00 AM</span>
                  <span className="deadline-tag" style={{ backgroundColor: '#f59e0b' }}>Warning</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                  2 students flagged for review
                </p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#094d88',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Review
              </button>
            </div>

            <div className="deadline-item">
              <div className="deadline-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="deadline-details">
                <h4>Engagement Improvement</h4>
                <div className="deadline-meta">
                  <span>CS302 - This Week</span>
                  <span className="deadline-tag" style={{ backgroundColor: '#10ac8b' }}>Good</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>
                  Class engagement up by 15%
                </p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#10ac8b',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginTop: '20px'
      }}>
        <div className="dashboard-card">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(9, 77, 136, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '24px',
              color: '#094d88'
            }}>
              <i className="fas fa-chalkboard"></i>
            </div>
            <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>6</h4>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Active Classes</p>
            <span style={{ fontSize: '12px', color: '#10ac8b', fontWeight: '600' }}>
              <i className="fas fa-arrow-up"></i> +1 this sem
            </span>
          </div>
        </div>

        <div className="dashboard-card">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(16, 172, 139, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '24px',
              color: '#10ac8b'
            }}>
              <i className="fas fa-users"></i>
            </div>
            <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>267</h4>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Total Students</p>
            <span style={{ fontSize: '12px', color: '#10ac8b', fontWeight: '600' }}>
              <i className="fas fa-arrow-up"></i> +12 this month
            </span>
          </div>
        </div>

        <div className="dashboard-card">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '24px',
              color: '#f59e0b'
            }}>
              <i className="fas fa-calendar-week"></i>
            </div>
            <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>24</h4>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>Classes This Week</p>
            <span style={{ fontSize: '12px', color: '#6c757d', fontWeight: '600' }}>
              18 completed
            </span>
          </div>
        </div>

        <div className="dashboard-card">
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              fontSize: '24px',
              color: '#ef4444'
            }}>
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>8</h4>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>At-Risk Students</p>
            <span style={{ fontSize: '12px', color: '#ef4444', fontWeight: '600' }}>
              <i className="fas fa-arrow-down"></i> -2 this week
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClassroomDashboard;
