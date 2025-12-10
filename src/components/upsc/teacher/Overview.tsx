interface OverviewProps {
  content: {
    greeting: string;
    subtitle: string;
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
            <h1>{content.greeting} 👋</h1>
            <p>{content.subtitle}</p>
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

      {/* Metrics Row */}
      <div className="metrics-row">
        {content.metrics.map((metric, index) => (
          <div className="metric-card" key={index}>
            <i className={`fas ${metric.icon}`}></i>
            <div className="metric-info">
              <h2>{metric.value}</h2>
              <p>{metric.label}</p>
            </div>
            {metric.change && (
              <span className="metric-change positive">{metric.change}</span>
            )}
          </div>
        ))}
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
                <p>Monday, October 20</p>
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
                <h4>Constitutional Law</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-video"></i> Live Class
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 2 hours
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
                <h4>Economics Quiz</h4>
                <div className="schedule-meta">
                  <span>
                    <i className="fas fa-clipboard-check"></i> Assessment
                  </span>
                  <span>
                    <i className="fas fa-clock"></i> 1 hour
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
                <p>Teacher deadlines for UPSC Institute</p>
              </div>
            </div>
          </div>
          <div className="card-content">
            <div className="deadline-item urgent">
              <div className="deadline-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="deadline-details">
                <h4>UPSC Prelims 2025</h4>
                <div className="deadline-meta">
                  <span>May 25, 2025</span>
                  <span className="deadline-tag major-exam">Major Exam</span>
                </div>
              </div>
              <div className="deadline-days">
                <strong>185</strong>
                <span>days left</span>
              </div>
            </div>

            <div className="deadline-item">
              <div className="deadline-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <div className="deadline-details">
                <h4>Answer Sheet Grading Deadline</h4>
                <div className="deadline-meta">
                  <span>Nov 28, 2025</span>
                  <span className="deadline-tag assignment">Grading</span>
                </div>
              </div>
              <div className="deadline-days">
                <strong>7</strong>
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
