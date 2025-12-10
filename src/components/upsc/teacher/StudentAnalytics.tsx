import { useState } from 'react';
import StudentProfile from './StudentProfile';

interface Student {
  id: string;
  name: string;
  batch: string;
  avatar: string;
  attendance: number;
  avgScore: number;
  testsCompleted: number;
  totalTests: number;
  performance: 'excellent' | 'good' | 'needs-attention';
  guardianName: string;
  guardianContact: string;
  dateOfBirth: string;
  lastUpdated: string;
  // Career guidance data
  currentInterest: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  recommendations: {
    career: string;
    rationale: string;
    requiredSkills: string[];
    actionSteps: string[];
  }[];
}

const StudentAnalytics = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'career'>('performance');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedPerformance, setSelectedPerformance] = useState('all');
  const [careerView, setCareerView] = useState<'list' | 'swot'>('list');

  const [students] = useState<Student[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      batch: 'Prelims Batch 2025',
      avatar: '👨‍🎓',
      attendance: 95,
      avgScore: 88,
      testsCompleted: 14,
      totalTests: 15,
      performance: 'excellent',
      guardianName: 'Robert Johnson',
      guardianContact: '+1 234-567-8901',
      dateOfBirth: 'Jan 15, 2008',
      lastUpdated: 'Mar 20, 2024',
      currentInterest: 'IAS - Civil Administration',
      strengths: ['Excellent in General Studies Paper 1 (95%)', 'Strong essay writing skills', 'Current affairs awareness', 'Analytical thinking'],
      weaknesses: ['Interview skills need improvement', 'Public speaking practice required', 'Time management in exam conditions'],
      opportunities: ['Growing demand for civil servants', 'Various state services available', 'UPSC coaching support', 'Mock interview platforms'],
      threats: ['High competition (10 lakh+ aspirants)', 'Limited vacancies per year', 'Multiple attempt requirements'],
      recommendations: [
        {
          career: 'IAS Officer - District Collector',
          rationale: 'Strong analytical skills and current affairs knowledge aligns perfectly with administrative services',
          requiredSkills: ['Policy analysis', 'Public administration', 'Leadership', 'Decision making'],
          actionSteps: ['Focus on GS Papers 2 & 3', 'Practice essay writing', 'Join answer writing program', 'Improve interview skills']
        },
        {
          career: 'State Civil Services (PCS)',
          rationale: 'Strong administrative aptitude also suits state-level governance with faster career progression',
          requiredSkills: ['State administration', 'Local governance', 'Development programs', 'Public welfare'],
          actionSteps: ['Study state-specific syllabus', 'Understand state policies', 'Focus on regional development', 'Prepare for state PSC exams']
        }
      ]
    },
    {
      id: '2',
      name: 'Emily Chen',
      batch: 'Prelims Batch 2025',
      avatar: '👩‍🎓',
      attendance: 92,
      avgScore: 91,
      testsCompleted: 15,
      totalTests: 15,
      performance: 'excellent',
      guardianName: 'Linda Chen',
      guardianContact: '+1 234-567-8902',
      dateOfBirth: 'Mar 22, 2008',
      lastUpdated: 'Mar 20, 2024',
      currentInterest: 'IFS - Foreign Service',
      strengths: ['International Relations (92%) excellence', 'Multilingual abilities', 'Detail-oriented', 'Strong work ethic'],
      weaknesses: ['Stress management under pressure', 'Geography concepts need strengthening', 'Limited public speaking experience'],
      opportunities: ['Growing international diplomatic roles', 'Multiple language advantages', 'International postings', 'Policy research opportunities'],
      threats: ['Intense competition', 'Long preparation period', 'Personality test challenges'],
      recommendations: [
        {
          career: 'IFS Officer - Diplomat',
          rationale: 'Exceptional understanding of international relations and linguistic skills ideal for foreign service',
          requiredSkills: ['Diplomacy', 'International law', 'Negotiation', 'Cultural awareness', 'Protocol knowledge'],
          actionSteps: ['Study foreign policy', 'Learn additional languages', 'Follow international news', 'Practice personality development']
        },
        {
          career: 'International Organizations (UN/World Bank)',
          rationale: 'Multilingual abilities and international relations expertise ideal for global institutions',
          requiredSkills: ['International development', 'Project management', 'Cross-cultural communication', 'Policy research'],
          actionSteps: ['Study UN charter and SDGs', 'Gain expertise in international development', 'Network with international professionals', 'Consider additional certifications in international affairs']
        }
      ]
    },
    {
      id: '3',
      name: 'Michael Brown',
      batch: 'Mains Intensive Batch',
      avatar: '👨‍🎓',
      attendance: 88,
      avgScore: 82,
      testsCompleted: 13,
      totalTests: 15,
      performance: 'good',
      guardianName: 'James Brown',
      guardianContact: '+1 234-567-8903',
      dateOfBirth: 'Jul 8, 2008',
      lastUpdated: 'Mar 20, 2024',
      currentInterest: 'IPS - Police Service',
      strengths: ['Excellent in Law & Order topics (88%)', 'Physical fitness', 'Leadership qualities', 'Historical awareness'],
      weaknesses: ['GS Paper 3 needs improvement', 'Interview confidence building required', 'Time management in Mains'],
      opportunities: ['Modernization of police force', 'Specialized units growing', 'State police services', 'Central Armed Police Forces'],
      threats: ['Physical & mental demands', 'High competition', 'Multiple exam stages'],
      recommendations: [
        {
          career: 'IPS Officer - Superintendent of Police',
          rationale: 'Strong leadership skills and law awareness aligns with police administration',
          requiredSkills: ['Law enforcement', 'Crisis management', 'Public order', 'Investigation techniques'],
          actionSteps: ['Focus on GS Paper 2 (Polity)', 'Maintain physical fitness', 'Study criminal law', 'Practice leadership scenarios']
        },
        {
          career: 'Intelligence Services (IB/RAW)',
          rationale: 'Leadership qualities and analytical thinking align with national security and intelligence roles',
          requiredSkills: ['Strategic thinking', 'Information analysis', 'Discretion', 'National security awareness'],
          actionSteps: ['Study national security challenges', 'Develop strategic thinking', 'Stay updated on geopolitics', 'Focus on GS Paper 3 internal security']
        }
      ]
    },
    {
      id: '4',
      name: 'Sarah Davis',
      batch: 'Mains Intensive Batch',
      avatar: '👩‍🎓',
      attendance: 78,
      avgScore: 68,
      testsCompleted: 10,
      totalTests: 15,
      performance: 'needs-attention',
      guardianName: 'Patricia Davis',
      guardianContact: '+1 234-567-8904',
      dateOfBirth: 'Nov 12, 2008',
      lastUpdated: 'Mar 20, 2024',
      currentInterest: 'IRS - Revenue Service',
      strengths: ['GS Paper 3 - Economics (91%) excellence', 'Budget analysis skills', 'Taxation concepts understanding', 'Quantitative aptitude'],
      weaknesses: ['Answer writing speed needs improvement', 'Interview preparation lacking', 'Current affairs coverage gaps', 'Ethics paper needs focus'],
      opportunities: ['Growing importance of revenue services', 'Tax policy reforms creating opportunities', 'Financial expertise in demand', 'State revenue services also available'],
      threats: ['Limited IRS vacancies annually', 'High cut-off marks', 'Strong competition from commerce graduates', 'Multiple papers to clear'],
      recommendations: [
        {
          career: 'IRS Officer - Income Tax',
          rationale: 'Strong economics and quantitative background ideal for revenue administration and taxation',
          requiredSkills: ['Tax laws', 'Financial analysis', 'Investigation skills', 'Fiscal policy', 'Accounting standards'],
          actionSteps: ['Focus on GS Paper 3 economics section', 'Master taxation and budget topics', 'Practice answer writing daily', 'Join ethics and integrity module', 'Improve current affairs reading']
        },
        {
          career: 'Indian Economic Service (IES)',
          rationale: 'Exceptional economics and budget analysis skills perfectly suited for economic policy formulation',
          requiredSkills: ['Macroeconomics', 'Econometrics', 'Economic policy', 'Statistical analysis', 'Economic research'],
          actionSteps: ['Master advanced economics topics', 'Study econometrics and statistics', 'Follow economic surveys and budgets', 'Prepare for IES-specific papers']
        }
      ]
    }
  ]);

  const filteredStudents = students.filter((student) => {
    const batchMatch = selectedBatch === 'all' || student.batch === selectedBatch;
    const performanceMatch = selectedPerformance === 'all' || student.performance === selectedPerformance;
    return batchMatch && performanceMatch;
  });

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#667eea';
      case 'needs-attention':
        return '#ef4444';
      default:
        return '#718096';
    }
  };

  const getPerformanceLabel = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return 'Excellent';
      case 'good':
        return 'Good';
      case 'needs-attention':
        return 'Needs Attention';
      default:
        return '';
    }
  };

  const studentsNeedingAttention = students.filter(s => s.performance === 'needs-attention').length;
  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendance, 0) / students.length);

  // If viewing student profile
  if (selectedStudent && activeTab === 'performance') {
    return <StudentProfile student={selectedStudent} onBack={() => setSelectedStudent(null)} />;
  }

  // If viewing SWOT analysis in career tab
  if (activeTab === 'career' && careerView === 'swot' && selectedStudent) {
    return (
      <>
        {/* Back Button */}
        <button
          onClick={() => {
            setCareerView('list');
            setSelectedStudent(null);
          }}
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
          <span>Back to Career Guidance</span>
        </button>

        {/* Student Header */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                <i className="fas fa-user-graduate" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
                {selectedStudent.name}
              </h1>
              <p style={{ margin: 0, color: '#718096', fontSize: '1.05rem' }}>
                {selectedStudent.batch} • Current Interest: <span style={{ color: '#094d88', fontWeight: 600 }}>{selectedStudent.currentInterest}</span>
              </p>
            </div>
          </div>
        </div>

        {/* SWOT Analysis Grid */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-chart-line" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            SWOT Analysis
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {/* Strengths */}
            <div style={{
              padding: '1.5rem',
              background: '#d1fae5',
              borderRadius: '12px',
              border: '2px solid #10ac8b'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#065f46', fontSize: '1.25rem', fontWeight: 700 }}>
                <i className="fas fa-star" style={{ marginRight: '0.5rem' }}></i>
                Strengths
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#047857' }}>
                {selectedStudent.strengths.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div style={{
              padding: '1.5rem',
              background: '#fee2e2',
              borderRadius: '12px',
              border: '2px solid #ef4444'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#991b1b', fontSize: '1.25rem', fontWeight: 700 }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '0.5rem' }}></i>
                Weaknesses
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#b91c1c' }}>
                {selectedStudent.weaknesses.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div style={{
              padding: '1.5rem',
              background: '#dbeafe',
              borderRadius: '12px',
              border: '2px solid #3b82f6'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#1e40af', fontSize: '1.25rem', fontWeight: 700 }}>
                <i className="fas fa-door-open" style={{ marginRight: '0.5rem' }}></i>
                Opportunities
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#1d4ed8' }}>
                {selectedStudent.opportunities.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div style={{
              padding: '1.5rem',
              background: '#fef3c7',
              borderRadius: '12px',
              border: '2px solid #f59e0b'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', color: '#92400e', fontSize: '1.25rem', fontWeight: 700 }}>
                <i className="fas fa-shield-alt" style={{ marginRight: '0.5rem' }}></i>
                Threats
              </h3>
              <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#b45309' }}>
                {selectedStudent.threats.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Career Recommendations */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-lightbulb" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Personalized Career Recommendations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {selectedStudent.recommendations.map((rec, idx) => (
              <div key={idx} style={{
                padding: '2rem',
                background: '#f7fafc',
                borderRadius: '12px',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#094d88', fontSize: '1.5rem', fontWeight: 700 }}>
                    <i className="fas fa-briefcase" style={{ marginRight: '0.5rem' }}></i>
                    {idx + 1}. {rec.career}
                  </h3>
                  <p style={{ margin: 0, color: '#718096', fontSize: '1rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                    {rec.rationale}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>
                    <i className="fas fa-tools" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                    Required Skills:
                  </h4>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {rec.requiredSkills.map((skill, skillIdx) => (
                      <span key={skillIdx} style={{
                        padding: '0.5rem 1rem',
                        background: 'white',
                        border: '2px solid #094d88',
                        borderRadius: '8px',
                        color: '#094d88',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>
                    <i className="fas fa-tasks" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                    Action Steps:
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '1.5rem', color: '#2d3748' }}>
                    {rec.actionSteps.map((step, stepIdx) => (
                      <li key={stepIdx} style={{ marginBottom: '0.5rem', lineHeight: 1.6 }}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>Student Analytics 📊</h1>
            <p>Track performance, analyze insights, and provide career guidance</p>
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
                {students.length} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>Avg Attendance</h4>
              <p className="stat-value">
                {avgAttendance}% <span className="stat-total">overall</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${avgAttendance}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h4>Need Attention</h4>
              <p className="stat-value">
                {studentsNeedingAttention} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(studentsNeedingAttention / students.length) * 100}%`, background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0' }}>
          <button
            onClick={() => setActiveTab('performance')}
            style={{
              flex: 1,
              padding: '1rem 2rem',
              background: activeTab === 'performance' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'performance' ? 'white' : '#4a5568',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fas fa-chart-line"></i>
            Performance Analytics
          </button>
          <button
            onClick={() => setActiveTab('career')}
            style={{
              flex: 1,
              padding: '1rem 2rem',
              background: activeTab === 'career' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
              color: activeTab === 'career' ? 'white' : '#4a5568',
              border: 'none',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <i className="fas fa-lightbulb"></i>
            Career Guidance
          </button>
        </div>
      </div>

      {/* Performance Analytics Tab */}
      {activeTab === 'performance' && (
        <>
          {/* Metrics Row */}
          <div className="metrics-row">
            <div className="metric-card">
              <i className="fas fa-user-graduate"></i>
              <div className="metric-info">
                <h2>{students.filter(s => s.performance === 'excellent').length}</h2>
                <p>Excellent Performers</p>
              </div>
              <span className="metric-change positive">+2</span>
            </div>
            <div className="metric-card">
              <i className="fas fa-chart-line"></i>
              <div className="metric-info">
                <h2>{Math.round(students.reduce((sum, s) => sum + s.avgScore, 0) / students.length)}%</h2>
                <p>Batch Average</p>
              </div>
              <span className="metric-change positive">+3%</span>
            </div>
            <div className="metric-card">
              <i className="fas fa-clipboard-check"></i>
              <div className="metric-info">
                <h2>{Math.round((students.reduce((sum, s) => sum + s.testsCompleted, 0) / students.reduce((sum, s) => sum + s.totalTests, 0)) * 100)}%</h2>
                <p>Test Completion</p>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  <i className="fas fa-filter"></i> Filter by Batch
                </label>
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
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
                  <option value="all">All Batches</option>
                  <option value="Prelims Batch 2025">Prelims Batch 2025</option>
                  <option value="Mains Intensive Batch">Mains Intensive Batch</option>
                  <option value="Foundation Batch">Foundation Batch</option>
                  <option value="Weekend Batch">Weekend Batch</option>
                </select>
              </div>

              <div style={{ flex: '1', minWidth: '200px' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                  <i className="fas fa-chart-line"></i> Filter by Performance
                </label>
                <select
                  value={selectedPerformance}
                  onChange={(e) => setSelectedPerformance(e.target.value)}
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
                  <option value="all">All Performance Levels</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="needs-attention">Needs Attention</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={() => {
                    setSelectedBatch('all');
                    setSelectedPerformance('all');
                  }}
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
                  <i className="fas fa-redo"></i> Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>
                      <i className="fas fa-user"></i> Student
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem' }}>
                      <i className="fas fa-users"></i> Batch
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                      <i className="fas fa-calendar-check"></i> Attendance
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                      <i className="fas fa-chart-line"></i> Avg Score
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                      <i className="fas fa-clipboard-check"></i> Tests
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                      <i className="fas fa-star"></i> Performance
                    </th>
                    <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem' }}>
                      <i className="fas fa-cog"></i> Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student, index) => (
                    <tr
                      key={student.id}
                      style={{
                        borderBottom: '1px solid #e2e8f0',
                        background: index % 2 === 0 ? 'white' : '#f7fafc',
                        transition: 'background 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#edf2f7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#f7fafc';
                      }}
                    >
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '1.75rem' }}>{student.avatar}</span>
                          <div>
                            <div style={{ fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                              {student.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#718096' }}>
                              {student.guardianName}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem', color: '#4a5568', fontSize: '0.9rem', fontWeight: 500 }}>
                        {student.batch}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            background: student.attendance >= 90 ? '#d1fae5' : student.attendance >= 80 ? '#dbeafe' : '#fee2e2',
                            color: student.attendance >= 90 ? '#065f46' : student.attendance >= 80 ? '#1e40af' : '#991b1b'
                          }}
                        >
                          {student.attendance}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            background: student.avgScore >= 85 ? '#d1fae5' : student.avgScore >= 70 ? '#dbeafe' : '#fee2e2',
                            color: student.avgScore >= 85 ? '#065f46' : student.avgScore >= 70 ? '#1e40af' : '#991b1b'
                          }}
                        >
                          {student.avgScore}%
                        </span>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center', color: '#4a5568', fontSize: '0.9rem', fontWeight: 600 }}>
                        {student.testsCompleted}/{student.totalTests}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.375rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            background: `${getPerformanceColor(student.performance)}20`,
                            color: getPerformanceColor(student.performance)
                          }}
                        >
                          {getPerformanceLabel(student.performance)}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button
                            onClick={() => setSelectedStudent(student)}
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              border: 'none',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                          <button
                            style={{
                              padding: '0.5rem 0.75rem',
                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                              border: 'none',
                              borderRadius: '6px',
                              color: 'white',
                              fontSize: '0.75rem',
                              fontWeight: 500,
                              cursor: 'pointer',
                              transition: 'transform 0.2s',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.05)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            <i className="fas fa-phone"></i> Contact
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div style={{ padding: '1rem 1.5rem', background: '#f7fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    color: '#4a5568',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    color: '#4a5568',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Career Guidance Tab */}
      {activeTab === 'career' && careerView === 'list' && (
        <>
          {/* Students Career Grid */}
          <div className="dashboard-grid">
            {filteredStudents.map((student) => (
              <div className="dashboard-card" key={student.id}>
                <div className="card-header">
                  <div className="card-title">
                    <i className="fas fa-user-graduate"></i>
                    <div>
                      <h3>{student.name}</h3>
                      <p>{student.batch}</p>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="schedule-item">
                    <div className="schedule-details" style={{ width: '100%' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>
                          <i className="fas fa-briefcase"></i> Current Interest
                        </h4>
                        <p style={{ margin: 0, color: '#094d88', fontWeight: 600, fontSize: '1.05rem' }}>
                          {student.currentInterest}
                        </p>
                      </div>

                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '0.9rem' }}>
                          <i className="fas fa-lightbulb"></i> Recommendations
                        </h4>
                        <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                          {student.recommendations.length} career paths suggested
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedStudent(student);
                          setCareerView('swot');
                        }}
                        className="sign-in-btn"
                        style={{ width: '100%', fontSize: '0.9rem', padding: '0.75rem', marginTop: '1rem' }}
                      >
                        <i className="fas fa-eye"></i> View SWOT & Recommendations
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default StudentAnalytics;
