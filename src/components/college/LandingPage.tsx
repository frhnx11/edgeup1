import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onNavigateToColleges: () => void;
  schoolsUrl?: string;
  institutionsUrl?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToColleges,
  schoolsUrl = '#',
  institutionsUrl = '#'
}) => {

  const handleSchoolsClick = () => {
    if (schoolsUrl && schoolsUrl !== '#') {
      window.open(schoolsUrl, '_blank');
    } else {
      alert('Schools MVP link will be added soon');
    }
  };

  const handleInstitutionsClick = () => {
    if (institutionsUrl && institutionsUrl !== '#') {
      window.open(institutionsUrl, '_blank');
    } else {
      alert('Institutions MVP link will be added soon');
    }
  };

  return (
    <div className="landing-page">
      <div className="landing-background"></div>

      <div className="landing-content">
        {/* Hero Section */}
        <div className="landing-hero">
          <div className="landing-logo">
            <img src="/edgeup-logo.png" alt="EdgeUp Logo" />
          </div>
          <p className="landing-tagline">
            AI Powered Personalized Training Solutions
          </p>
        </div>

        {/* Cards Section */}
        <div className="landing-cards">
          <div className="landing-card landing-card-active" onClick={handleSchoolsClick}>
            <div className="card-badge">Active</div>
            <div className="card-icon">
              <i className="fas fa-school"></i>
            </div>
            <h2>Schools</h2>
            <p>
              Complete school management system with student tracking,
              attendance, and parent communication tools.
            </p>
            <div className="card-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>

          <div className="landing-card landing-card-active" onClick={onNavigateToColleges}>
            <div className="card-badge">Active</div>
            <div className="card-icon">
              <i className="fas fa-university"></i>
            </div>
            <h2>Colleges</h2>
            <p>
              Advanced college management platform with comprehensive
              academic and administrative features.
            </p>
            <div className="card-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>

          <div className="landing-card landing-card-active" onClick={handleInstitutionsClick}>
            <div className="card-badge">Active</div>
            <div className="card-icon">
              <i className="fas fa-building"></i>
            </div>
            <h2>Training Centres</h2>
            <p>
              Professional institution management with specialized tools
              for training centers and educational organizations.
            </p>
            <div className="card-arrow">
              <i className="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="footer-content">
            <p>&copy; 2025 EdgeUp. All rights reserved.</p>
            <div className="footer-links">
              <a href="#about">About</a>
              <a href="#contact">Contact</a>
              <a href="#privacy">Privacy Policy</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;
