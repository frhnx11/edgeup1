import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  subject: string;
  type: string;
  grade: string;
  format: string;
  downloads: number;
  rating: number;
}

const ContentLibrary = () => {
  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Introduction to Calculus - Complete Guide',
      subject: 'Mathematics',
      type: 'Textbook',
      grade: 'Grade 12',
      format: 'PDF',
      downloads: 1245,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Physics Lab Experiments Collection',
      subject: 'Physics',
      type: 'Lab Manual',
      grade: 'Grade 11',
      format: 'PDF',
      downloads: 892,
      rating: 4.6
    },
    {
      id: '3',
      title: 'Chemistry Interactive Simulations',
      subject: 'Chemistry',
      type: 'Interactive',
      grade: 'Grade 10',
      format: 'Web',
      downloads: 2103,
      rating: 4.9
    },
    {
      id: '4',
      title: 'World History Timeline Infographics',
      subject: 'History',
      type: 'Visual Aid',
      grade: 'Grade 9',
      format: 'Images',
      downloads: 654,
      rating: 4.5
    },
    {
      id: '5',
      title: 'English Literature Analysis Templates',
      subject: 'English',
      type: 'Worksheet',
      grade: 'Grade 11-12',
      format: 'DOCX',
      downloads: 987,
      rating: 4.7
    },
    {
      id: '6',
      title: 'Biology Cell Structure 3D Models',
      subject: 'Biology',
      type: '3D Model',
      grade: 'Grade 10',
      format: 'Interactive',
      downloads: 1456,
      rating: 4.9
    }
  ]);

  const [filter, setFilter] = useState('all');

  const subjects = ['All', 'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History'];

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>Open Source Content Library 📚</h1>
            <p>Access free educational resources from around the world</p>
          </div>
          <button
            className="sign-in-btn"
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
            <i className="fas fa-upload"></i> Upload Resource
          </button>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-info">
              <h4>Total Resources</h4>
              <p className="stat-value">
                12,450 <span className="stat-total">resources</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-download"></i>
            </div>
            <div className="stat-info">
              <h4>Downloads This Month</h4>
              <p className="stat-value">
                8,234 <span className="stat-total">downloads</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-info">
              <h4>Avg Rating</h4>
              <p className="stat-value">
                4.7 <span className="stat-total">/ 5.0</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '94%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Filters Section - Professional */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-filter"></i> Filter by Subject
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject.toLowerCase()}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                color: '#2d3748',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-redo"></i> Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <i className="fas fa-file-pdf"></i>
          <div className="metric-info">
            <h2>5,240</h2>
            <p>PDF Documents</p>
          </div>
        </div>
        <div className="metric-card">
          <i className="fas fa-video"></i>
          <div className="metric-info">
            <h2>3,120</h2>
            <p>Video Lectures</p>
          </div>
        </div>
        <div className="metric-card">
          <i className="fas fa-file-powerpoint"></i>
          <div className="metric-info">
            <h2>2,890</h2>
            <p>Presentations</p>
          </div>
        </div>
        <div className="metric-card">
          <i className="fas fa-cube"></i>
          <div className="metric-info">
            <h2>1,200</h2>
            <p>3D Models</p>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="dashboard-grid">
        {resources.map((resource) => (
          <div className="dashboard-card" key={resource.id}>
            <div className="card-header">
              <div className="card-title">
                <i className="fas fa-file-alt"></i>
                <div>
                  <h3>{resource.title}</h3>
                  <p>{resource.subject} • {resource.grade}</p>
                </div>
              </div>
            </div>
            <div className="card-content">
              <div className="schedule-item">
                <div className="schedule-details" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h4 style={{ margin: 0, color: '#2d3748', fontSize: '0.875rem' }}>
                        <i className="fas fa-tag"></i> Type
                      </h4>
                      <p style={{ margin: '0.25rem 0', color: '#667eea', fontWeight: 500 }}>
                        {resource.type}
                      </p>
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: '#2d3748', fontSize: '0.875rem' }}>
                        <i className="fas fa-file"></i> Format
                      </h4>
                      <p style={{ margin: '0.25rem 0', color: '#667eea', fontWeight: 500 }}>
                        {resource.format}
                      </p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-download" style={{ color: '#667eea' }}></i>
                      <span style={{ color: '#718096', fontSize: '0.875rem' }}>
                        {resource.downloads.toLocaleString()} downloads
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <i className="fas fa-star" style={{ color: '#f59e0b' }}></i>
                      <span style={{ color: '#718096', fontSize: '0.875rem', fontWeight: 600 }}>
                        {resource.rating}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="sign-in-btn" style={{ flex: 1, fontSize: '0.9rem', padding: '0.6rem' }}>
                      <i className="fas fa-eye"></i> Preview
                    </button>
                    <button className="sign-in-btn" style={{ flex: 1, fontSize: '0.9rem', padding: '0.6rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                      <i className="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ContentLibrary;
