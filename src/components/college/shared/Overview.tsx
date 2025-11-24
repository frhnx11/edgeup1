interface OverviewProps {
  content: {
    greeting: string;
    subtitle: string;
    userTitle?: string;
    userSubtitle?: string;
    userSchool?: string;
    stats: Array<{
      icon: string;
      title: string;
      value: string;
      total: string;
      progress: number;
    }>; 
    actions: Array<{
      icon: string;
      title: string;
      id?: string;
    }>;
    metrics: Array<{
      icon: string;
      value: string;
      label: string;
      change: string;
    }>;
  };
  onActionClick?: (actionId: string) => void;
}

const Overview = ({ content, onActionClick }: OverviewProps) => {
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>{content.greeting}</h1>
            <p>{content.subtitle}</p>
            {/* Student Info for Parents */}
            {content.userTitle && (
              <div className="student-info-badge">
                <i className="fas fa-user-graduate"></i>
                <div className="student-details">
                  <span className="student-name">{content.userTitle}</span>
                  {content.userSubtitle && (
                    <span className="student-class">{content.userSubtitle}</span>
                  )}
                  {content.userSchool && (
                    <span className="student-school">{content.userSchool}</span>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="streak-badge">
            <i className="fas fa-fire"></i>
            <div>
              <strong>7</strong>
              <span>Day Streak</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          {content.stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon">
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-info">
                <h4>{stat.title}</h4>
                <p className="stat-value">
                  {stat.value} <span className="stat-total">{stat.total}</span>
                </p>
                <div className="stat-progress">
                  <div
                    className="stat-progress-fill"
                    style={{ width: `${stat.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Cards */}
        <div className="action-cards">
          {content.actions.map((action, index) => (
            <div
              className="action-card"
              key={index}
              onClick={() => action.id && onActionClick && onActionClick(action.id)}
              style={{ cursor: action.id ? 'pointer' : 'default' }}
            >
              <i className={`fas ${action.icon}`}></i>
              <span>{action.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="dashboard-grid">
        {/* Today's Schedule */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fas fa-calendar"></i>
              <div>
                <h3>Today's Schedule</h3>
                <p>Monday, November 06, 2025</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="schedule-item">
              <div className="schedule-time">
                <span className="time-value">10</span>
                <span className="time-period">AM</span>
              </div>
              <div className="schedule-details">
                <h4>Faculty Meeting - Department Heads</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-users"></i> Meeting
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 1 hour
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> Conference Room A
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
                <h4>Semester End Exam Schedule Review</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-clipboard-list"></i> Planning
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 2 hours
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> Admin Office
                  </span>
                </div>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>

            <div className="schedule-item">
              <div className="schedule-time">
                <span className="time-value">4</span>
                <span className="time-period">PM</span>
              </div>
              <div className="schedule-details">
                <h4>Student Council Presentation</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-microphone"></i> Event
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 45 minutes
                  </span>
                  <span>
                    <i className="fas fa-map-marker-alt"></i> Main Auditorium
                  </span>
                </div>
              </div>
              <i className="fas fa-chevron-right"></i>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <i className="fas fa-bell"></i>
              <div>
                <h3>Upcoming Deadlines</h3>
                <p>Stay on track with institutional goals</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="deadline-item urgent">
              <div className="deadline-icon">
                <i className="fas fa-pencil-alt"></i>
              </div>
              <div className="deadline-details">
                <h4>Semester End Examinations 2025</h4>
                <div className="deadline-meta">
                  <span>March 15, 2025</span>
                  <span className="deadline-tag academic">Academic</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>Final exams for all departments</p>
              </div>
              <div className="deadline-days">
                <strong>145</strong>
                <span>days left</span>
              </div>
            </div>

            <div className="deadline-item urgent">
              <div className="deadline-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <div className="deadline-details">
                <h4>Faculty Appraisal Submissions</h4>
                <div className="deadline-meta">
                  <span>December 20, 2024</span>
                  <span className="deadline-tag hr">HR</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>Annual performance reviews due</p>
              </div>
              <div className="deadline-days">
                <strong>5</strong>
                <span>days left</span>
              </div>
            </div>

            <div className="deadline-item">
              <div className="deadline-icon">
                <i className="fas fa-file-contract"></i>
              </div>
              <div className="deadline-details">
                <h4>Accreditation Document Submission</h4>
                <div className="deadline-meta">
                  <span>January 30, 2025</span>
                  <span className="deadline-tag compliance">Compliance</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>NAAC documentation deadline</p>
              </div>
              <div className="deadline-days">
                <strong>46</strong>
                <span>days left</span>
              </div>
            </div>

            <div className="deadline-item">
              <div className="deadline-icon">
                <i className="fas fa-flask"></i>
              </div>
              <div className="deadline-details">
                <h4>Research Paper Publication Review</h4>
                <div className="deadline-meta">
                  <span>December 15, 2024</span>
                  <span className="deadline-tag research">Academic</span>
                </div>
                <p style={{ fontSize: '13px', color: '#6c757d', marginTop: '4px' }}>Faculty research contributions</p>
              </div>
              <div className="deadline-days">
                <strong>10</strong>
                <span>days left</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;
