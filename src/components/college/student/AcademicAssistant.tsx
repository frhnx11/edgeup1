import React, { useState } from 'react';
import './AcademicAssistant.css';
import PersonalizedAcademicCoPilot from './PersonalizedAcademicCoPilot';
import InteractiveLearningHub from './InteractiveLearningHub';
import SelfServicePortal from './SelfServicePortal';

const AcademicAssistant: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  if (selectedFeature === 'copilot') {
    return <PersonalizedAcademicCoPilot onBack={() => setSelectedFeature(null)} />;
  }

  if (selectedFeature === 'learning-hub') {
    return <InteractiveLearningHub onBack={() => setSelectedFeature(null)} />;
  }

  if (selectedFeature === 'self-service') {
    return <SelfServicePortal onBack={() => setSelectedFeature(null)} />;
  }

  return (
    <div className="academic-assistant-container">
      <div className="aa-header">
        <div className="aa-header-content">
          <h1><i className="fas fa-graduation-cap"></i> Academic Assistant</h1>
          <p>Your comprehensive academic support system powered by AI</p>
        </div>
      </div>

      <div className="aa-features-grid">
        {/* Feature 1: Personalized Academic Co-Pilot */}
        <div className="aa-feature-card copilot" onClick={() => setSelectedFeature('copilot')}>
          <div className="aa-card-icon">
            <i className="fas fa-robot"></i>
          </div>
          <div className="aa-card-content">
            <h2>Personalized Academic Co-Pilot</h2>
            <p>AI-powered study assistant that analyzes your performance and creates personalized learning plans</p>
            <ul className="aa-feature-list">
              <li><i className="fas fa-check"></i> AI Study Assistant & Weak Areas Analysis</li>
              <li><i className="fas fa-check"></i> Smart Semester Planner</li>
              <li><i className="fas fa-check"></i> Automated Deadline Tracker</li>
              <li><i className="fas fa-check"></i> Peer Study Group Matcher</li>
              <li><i className="fas fa-check"></i> Performance Comparison Analytics</li>
            </ul>
          </div>
          <div className="aa-card-footer">
            <button className="aa-btn-primary">
              <span>Get Started</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Feature 2: Interactive Learning Hub */}
        <div className="aa-feature-card learning-hub" onClick={() => setSelectedFeature('learning-hub')}>
          <div className="aa-card-icon">
            <i className="fas fa-book-open"></i>
          </div>
          <div className="aa-card-content">
            <h2>Interactive Learning Hub</h2>
            <p>Comprehensive digital library and practice platform with 24/7 doubt resolution support</p>
            <ul className="aa-feature-list">
              <li><i className="fas fa-check"></i> Subject-wise Digital Library</li>
              <li><i className="fas fa-check"></i> Notes, Videos & Previous Year Papers</li>
              <li><i className="fas fa-check"></i> Live Doubt Resolution Forum (24/7)</li>
              <li><i className="fas fa-check"></i> Faculty, Peer & AI Assistance</li>
              <li><i className="fas fa-check"></i> Adaptive Practice Test Generator</li>
            </ul>
          </div>
          <div className="aa-card-footer">
            <button className="aa-btn-primary">
              <span>Explore Library</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>

        {/* Feature 3: Self-Service Portal */}
        <div className="aa-feature-card self-service" onClick={() => setSelectedFeature('self-service')}>
          <div className="aa-card-icon">
            <i className="fas fa-tachometer-alt"></i>
          </div>
          <div className="aa-card-content">
            <h2>Self-Service Portal</h2>
            <p>One-stop dashboard for all your academic information and activities</p>
            <ul className="aa-feature-list">
              <li><i className="fas fa-check"></i> Real-time Attendance Tracking</li>
              <li><i className="fas fa-check"></i> Grades & Results Dashboard</li>
              <li><i className="fas fa-check"></i> Interactive Timetable</li>
              <li><i className="fas fa-check"></i> Assignments & Submissions</li>
              <li><i className="fas fa-check"></i> Announcements & Notifications</li>
            </ul>
          </div>
          <div className="aa-card-footer">
            <button className="aa-btn-primary">
              <span>View Dashboard</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div className="aa-stats-bar">
        <div className="aa-stat-item">
          <i className="fas fa-users"></i>
          <div className="aa-stat-content">
            <span className="aa-stat-value">2,500+</span>
            <span className="aa-stat-label">Active Students</span>
          </div>
        </div>
        <div className="aa-stat-item">
          <i className="fas fa-book"></i>
          <div className="aa-stat-content">
            <span className="aa-stat-value">10,000+</span>
            <span className="aa-stat-label">Study Resources</span>
          </div>
        </div>
        <div className="aa-stat-item">
          <i className="fas fa-question-circle"></i>
          <div className="aa-stat-content">
            <span className="aa-stat-value">5,000+</span>
            <span className="aa-stat-label">Doubts Resolved</span>
          </div>
        </div>
        <div className="aa-stat-item">
          <i className="fas fa-chart-line"></i>
          <div className="aa-stat-content">
            <span className="aa-stat-value">95%</span>
            <span className="aa-stat-label">Success Rate</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicAssistant;
