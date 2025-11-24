import { useState, useEffect } from 'react';
import { getStudentPerformanceData } from '../../../../../services/data/studentData';
import type { PerformanceData } from '../../../../../types';
import AcademicOverview from './AcademicOverview';
import SubjectDeepDive from './SubjectDeepDive';
import ComparativeAnalysis from './ComparativeAnalysis';
import TimeProductivity from './TimeProductivity';
import AIPredictions from './AIPredictions';
import ActionableInsights from './ActionableInsights';

const PerformanceTracker = () => {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading from API
    const loadData = async () => {
      try {
        setLoading(true);
        // In future, this will be an actual API call
        const performanceData = getStudentPerformanceData();
        setData(performanceData);
      } catch (error) {
        console.error('Error loading performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '1.2rem',
        color: '#718096'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '1rem' }}></i>
        Loading Performance Data...
      </div>
    );
  }

  return (
    <>
      {/* Hero Section - Keep existing design */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-chart-line" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Performance Tracker
            </h1>
            <p>Monitor your academic progress with detailed analytics and insights</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Class Rank</p>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>
                #{data.overall.classRank}
              </h3>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="stat-info">
              <h4>Total Marks</h4>
              <p className="stat-value">
                {Math.round((data.overall.averageScore / 100) * 500)} <span className="stat-total">/ 500</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${data.overall.averageScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <div className="stat-info">
              <h4>Overall Percentage</h4>
              <p className="stat-value">
                {data.overall.averageScore}% <span className="stat-total">out of 100</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${data.overall.averageScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>Attendance Rate</h4>
              <p className="stat-value">
                {data.overall.attendanceRate}% <span className="stat-total">present</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${data.overall.attendanceRate}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Flexible Grid Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '1.5rem',
        marginBottom: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Left Column Top: Academic Performance Overview */}
        <div style={{ gridColumn: '1', gridRow: 'span 2' }}>
          <AcademicOverview
            performanceTrend={data.performanceTrend}
            subjects={data.subjects}
            comparison={data.comparison}
          />
        </div>

        {/* Right Column Top: Subject Deep Dive */}
        <div style={{ gridColumn: '2', gridRow: 'span 3' }}>
          <SubjectDeepDive
            subjects={data.subjects}
          />
        </div>

        {/* Left Column Middle: Rank Progression */}
        <div style={{ gridColumn: '1' }}>
          <ComparativeAnalysis
            rankHistory={data.rankHistory}
            overall={data.overall}
          />
        </div>
      </div>

      {/* Time & Productivity - Full width */}
      <div style={{ marginBottom: '1.5rem' }}>
        <TimeProductivity
          studyTime={data.studyTime}
          studyCorrelation={data.studyCorrelation}
        />
      </div>

      {/* AI Predictions - Full width */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AIPredictions
          predictions={data.predictions}
        />
      </div>

      {/* Section 6: Actionable Insights - Full width with side-by-side layout */}
      <ActionableInsights
        recommendations={data.recommendations}
        quickActions={data.quickActions}
      />
    </>
  );
};

export default PerformanceTracker;
