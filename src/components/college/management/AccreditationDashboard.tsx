import { useState } from 'react';
import './AccreditationDashboard.css';

interface Criterion {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  status: 'excellent' | 'good' | 'satisfactory' | 'needs-improvement';
  criteria: SubCriterion[];
}

interface SubCriterion {
  id: string;
  name: string;
  score: number;
  maxScore: number;
  evidence: number;
  required: number;
}

interface AccreditationBody {
  id: string;
  name: string;
  fullName: string;
  status: 'accredited' | 'in-progress' | 'pending' | 'expired';
  grade?: string;
  validUntil?: string;
  lastReview?: string;
  progress?: number;
}

interface Document {
  id: string;
  title: string;
  category: string;
  uploadDate: string;
  status: 'approved' | 'pending-approval' | 'rejected';
  size: string;
}

interface GradePrediction {
  current: string;
  likelihood: number;
  pointsNeeded: number;
  recommendations: string[];
}

const AccreditationDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'naac' | 'nba' | 'documents' | 'timeline'>('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [showPredictorModal, setShowPredictorModal] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('ssr');
  const [documentFilter, setDocumentFilter] = useState('all');

  // New state variables for additional functionality
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showBodyDetailModal, setShowBodyDetailModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [selectedBody, setSelectedBody] = useState<any>(null);
  const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);
  const [uploadCategory, setUploadCategory] = useState('naac');

  const [accreditationBodies] = useState<AccreditationBody[]>([
    {
      id: 'naac',
      name: 'NAAC',
      fullName: 'National Assessment and Accreditation Council',
      status: 'accredited',
      grade: 'A+',
      validUntil: '2026-12-31',
      lastReview: '2021-12-15',
      progress: 100
    },
    {
      id: 'nba',
      name: 'NBA',
      fullName: 'National Board of Accreditation',
      status: 'in-progress',
      progress: 78,
      lastReview: '2023-06-20'
    },
    {
      id: 'nirf',
      name: 'NIRF',
      fullName: 'National Institutional Ranking Framework',
      status: 'accredited',
      grade: 'Band: 101-150',
      validUntil: '2024-12-31',
      lastReview: '2024-01-10',
      progress: 100
    },
    {
      id: 'aicte',
      name: 'AICTE',
      fullName: 'All India Council for Technical Education',
      status: 'accredited',
      validUntil: '2025-06-30',
      lastReview: '2023-07-01',
      progress: 100
    }
  ]);

  const [naacCriteria] = useState<Criterion[]>([
    {
      id: 'c1',
      name: 'Curricular Aspects',
      score: 285,
      maxScore: 300,
      status: 'excellent',
      criteria: [
        { id: 'c1.1', name: 'Curriculum Design and Development', score: 95, maxScore: 100, evidence: 12, required: 10 },
        { id: 'c1.2', name: 'Academic Flexibility', score: 90, maxScore: 100, evidence: 8, required: 8 },
        { id: 'c1.3', name: 'Curriculum Enrichment', score: 100, maxScore: 100, evidence: 15, required: 12 }
      ]
    },
    {
      id: 'c2',
      name: 'Teaching-Learning and Evaluation',
      score: 420,
      maxScore: 500,
      status: 'good',
      criteria: [
        { id: 'c2.1', name: 'Student Enrollment and Profile', score: 95, maxScore: 100, evidence: 10, required: 10 },
        { id: 'c2.2', name: 'Student-Teacher Ratio', score: 85, maxScore: 100, evidence: 5, required: 5 },
        { id: 'c2.3', name: 'Teaching-Learning Process', score: 90, maxScore: 100, evidence: 18, required: 15 },
        { id: 'c2.4', name: 'Teacher Quality', score: 80, maxScore: 100, evidence: 20, required: 20 },
        { id: 'c2.5', name: 'Evaluation Process', score: 70, maxScore: 100, evidence: 12, required: 15 }
      ]
    },
    {
      id: 'c3',
      name: 'Research, Innovations and Extension',
      score: 340,
      maxScore: 400,
      status: 'good',
      criteria: [
        { id: 'c3.1', name: 'Resource Mobilization', score: 85, maxScore: 100, evidence: 8, required: 8 },
        { id: 'c3.2', name: 'Innovation Ecosystem', score: 80, maxScore: 100, evidence: 10, required: 12 },
        { id: 'c3.3', name: 'Research Publications', score: 90, maxScore: 100, evidence: 45, required: 40 },
        { id: 'c3.4', name: 'Extension Activities', score: 85, maxScore: 100, evidence: 15, required: 15 }
      ]
    },
    {
      id: 'c4',
      name: 'Infrastructure and Learning Resources',
      score: 250,
      maxScore: 300,
      status: 'good',
      criteria: [
        { id: 'c4.1', name: 'Physical Facilities', score: 90, maxScore: 100, evidence: 20, required: 18 },
        { id: 'c4.2', name: 'Library Resources', score: 85, maxScore: 100, evidence: 12, required: 12 },
        { id: 'c4.3', name: 'IT Infrastructure', score: 75, maxScore: 100, evidence: 10, required: 12 }
      ]
    },
    {
      id: 'c5',
      name: 'Student Support and Progression',
      score: 240,
      maxScore: 300,
      status: 'satisfactory',
      criteria: [
        { id: 'c5.1', name: 'Student Support', score: 80, maxScore: 100, evidence: 15, required: 15 },
        { id: 'c5.2', name: 'Student Progression', score: 85, maxScore: 100, evidence: 18, required: 18 },
        { id: 'c5.3', name: 'Student Participation', score: 75, maxScore: 100, evidence: 10, required: 12 }
      ]
    }
  ]);

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'd1',
      title: 'Self-Study Report (SSR) 2024',
      category: 'NAAC',
      uploadDate: '2024-01-15',
      status: 'approved',
      size: '15.2 MB'
    },
    {
      id: 'd2',
      title: 'Institutional Information for Quality Assessment',
      category: 'NAAC',
      uploadDate: '2024-01-10',
      status: 'approved',
      size: '8.5 MB'
    },
    {
      id: 'd3',
      title: 'NBA Self-Assessment Report - CSE Department',
      category: 'NBA',
      uploadDate: '2024-02-01',
      status: 'pending-approval',
      size: '12.8 MB'
    },
    {
      id: 'd4',
      title: 'Faculty Qualification Documents',
      category: 'NBA',
      uploadDate: '2024-01-28',
      status: 'approved',
      size: '25.6 MB'
    }
  ]);

  const getOverallScore = (): number => {
    const total = naacCriteria.reduce((sum, c) => sum + c.score, 0);
    const max = naacCriteria.reduce((sum, c) => sum + c.maxScore, 0);
    return Math.round((total / max) * 100);
  };

  const getGrade = (percentage: number): string => {
    if (percentage >= 90) return 'A++';
    if (percentage >= 85) return 'A+';
    if (percentage >= 75) return 'A';
    if (percentage >= 65) return 'B++';
    if (percentage >= 55) return 'B+';
    return 'B';
  };

  const getCGPA = (percentage: number): number => {
    return Number((percentage / 25).toFixed(2));
  };

  const getGradePrediction = (): GradePrediction => {
    const currentScore = getOverallScore();
    const currentGrade = getGrade(currentScore);
    const targetA = 85;

    let likelihood = 0;
    if (currentScore >= targetA) {
      likelihood = 95;
    } else if (currentScore >= 82) {
      likelihood = 75;
    } else if (currentScore >= 78) {
      likelihood = 50;
    } else {
      likelihood = 25;
    }

    const pointsNeeded = Math.max(0, targetA - currentScore);

    const recommendations = [
      'Focus on C2.5 (Evaluation Process) - Currently at 70%, increase to 85% for 15 additional points',
      'Add 2 more evidence documents for C4.3 (IT Infrastructure) to improve compliance',
      'Enhance C5.3 (Student Participation) documentation with recent extracurricular achievements'
    ];

    return {
      current: currentGrade,
      likelihood,
      pointsNeeded,
      recommendations
    };
  };

  const handleGenerateReport = () => {
    // Simulate PDF generation
    const reportTypes: { [key: string]: string } = {
      ssr: 'Self-Study Report',
      sar: 'Student Achievement Report',
      'criterion-wise': 'Criterion-wise Assessment Report',
      summary: 'Executive Summary Report',
      compliance: 'Compliance Status Report'
    };

    const reportName = reportTypes[selectedReportType] || 'Accreditation Report';

    // Create a simple PDF download simulation
    const pdfContent = `
      ${reportName}
      Generated: ${new Date().toLocaleString()}

      Overall Score: ${getOverallScore()}%
      Grade: ${getGrade(getOverallScore())}

      This is a simulated PDF report. In production, this would generate a comprehensive PDF document with all accreditation data, charts, and analysis.
    `;

    const blob = new Blob([pdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${reportName.replace(/ /g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert(`Generating ${reportName}... Download started!`);
    setShowReportModal(false);
  };

  // Document Management Functions
  const handleViewDocument = (doc: any) => {
    setSelectedDocument(doc);
    setShowDocumentViewer(true);
  };

  const handleDownloadDocument = (doc: any) => {
    // Simulate download
    alert(`Downloading ${doc.title}...\nFile size: ${doc.size}\nThis would download the actual file in production.`);

    // Create download link simulation
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${doc.title.replace(/ /g, '_')}.pdf`;
    alert(`Downloaded: ${doc.title}`);
  };

  const handleDeleteDocument = (docId: string) => {
    setDocumentToDelete(docId);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteDocument = () => {
    if (documentToDelete) {
      setDocuments(documents.filter(doc => doc.id !== documentToDelete));
      alert('Document deleted successfully!');
    }
    setDocumentToDelete(null);
    setShowDeleteConfirm(false);
  };

  const handleUploadDocument = (file?: File) => {
    setShowUploadModal(true);
  };

  const handleUploadSubmit = (title: string, category: string, file: File | null) => {
    if (!title || !file) {
      alert('Please provide document title and select a file');
      return;
    }

    const newDocument: Document = {
      id: `d${documents.length + 1}`,
      title: title,
      category: category.toUpperCase(),
      uploadDate: new Date().toISOString().split('T')[0],
      status: 'pending-approval',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    };

    setDocuments([...documents, newDocument]);
    alert(`Document "${title}" uploaded successfully!`);
    setShowUploadModal(false);
  };

  // Accreditation Body Handlers
  const handleViewBodyDetails = (body: any) => {
    setSelectedBody(body);
    setShowBodyDetailModal(true);
  };

  const handleViewCertificate = () => {
    alert('Opening NBA Accreditation Certificate...\nThis would display or download the official certificate PDF.');
  };

  const handleContinueApplication = () => {
    alert('Continuing NBA application for Mechanical Engineering...\nThis would navigate to the application workflow.');
  };

  const getComplianceHealth = () => {
    const totalCriteria = naacCriteria.length;
    const atRisk = naacCriteria.filter(c => (c.score / c.maxScore) * 100 < 80).length;
    const excellent = naacCriteria.filter(c => c.status === 'excellent').length;

    return {
      readiness: getOverallScore(),
      atRisk,
      excellent,
      totalCriteria
    };
  };

  const filteredDocuments = documentFilter === 'all'
    ? documents
    : documents.filter(doc => doc.category.toLowerCase() === documentFilter.toLowerCase());

  const complianceHealth = getComplianceHealth();
  const gradePrediction = getGradePrediction();

  return (
    <div className="accreditation-dashboard-container">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-award"></i> Accreditation Dashboard</h1>
          <p>Real-time NAAC/NBA compliance tracking with documentation automation</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowReportModal(true)}>
            <i className="fas fa-file-export"></i>
            Generate Report
          </button>
          <button className="btn-secondary" onClick={() => handleUploadDocument()}>
            <i className="fas fa-upload"></i>
            Upload Document
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-certificate"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Accreditations</span>
            <span className="stat-value">4</span>
            <span className="stat-trend">
              <i className="fas fa-arrow-up"></i> All Current
            </span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">NAAC Score</span>
            <span className="stat-value">{getOverallScore()}%</span>
            <span className="stat-trend">
              <i className="fas fa-star"></i> Grade: {getGrade(getOverallScore())}
            </span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Documents Submitted</span>
            <span className="stat-value">{documents.length}</span>
            <span className="stat-trend">
              <i className="fas fa-check"></i> {documents.filter(d => d.status === 'approved').length} Approved
            </span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-tasks"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Compliance Rate</span>
            <span className="stat-value">92%</span>
            <span className="stat-trend">
              <i className="fas fa-arrow-up"></i> +3% this month
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-th-large"></i>
            Overview
          </button>
          <button
            className={`tab-button ${activeTab === 'naac' ? 'active' : ''}`}
            onClick={() => setActiveTab('naac')}
          >
            <i className="fas fa-star"></i>
            NAAC Assessment
          </button>
          <button
            className={`tab-button ${activeTab === 'nba' ? 'active' : ''}`}
            onClick={() => setActiveTab('nba')}
          >
            <i className="fas fa-graduation-cap"></i>
            NBA Accreditation
          </button>
          <button
            className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            <i className="fas fa-folder-open"></i>
            Documents
          </button>
          <button
            className={`tab-button ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <i className="fas fa-calendar-alt"></i>
            Timeline
          </button>
        </div>

        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              {/* Grade Predictor Card - NEW */}
              <div className="quick-insights" style={{ marginBottom: '24px' }}>
                <div className="insights-header">
                  <i className="fas fa-chart-pie"></i>
                  A+ Grade Prediction & Compliance Health
                </div>
                <div className="insights-grid">
                  <div className="insight-card success" onClick={() => setShowPredictorModal(true)} style={{ cursor: 'pointer' }}>
                    <div className="insight-icon">
                      <i className="fas fa-bullseye"></i>
                    </div>
                    <p className="insight-text">
                      <strong>A+ Grade Likelihood: {gradePrediction.likelihood}%</strong><br />
                      {gradePrediction.pointsNeeded === 0
                        ? 'Already at A+ level! Maintain current standards.'
                        : `Need ${gradePrediction.pointsNeeded} more points to reach A+ (85%)`}
                      <br /><small style={{ color: '#094d88', marginTop: '8px', display: 'block' }}>Click for detailed analysis →</small>
                    </p>
                  </div>
                  <div className="insight-card warning">
                    <div className="insight-icon">
                      <i className="fas fa-heart-pulse"></i>
                    </div>
                    <p className="insight-text">
                      <strong>Compliance Readiness: {complianceHealth.readiness}%</strong><br />
                      {complianceHealth.atRisk} criteria need attention. {complianceHealth.excellent} criteria at excellent level.
                    </p>
                  </div>
                  <div className="insight-card" style={{ borderLeftColor: '#3b82f6' }}>
                    <div className="insight-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <p className="insight-text">
                      <strong>Always Accreditation-Ready</strong><br />
                      Continuous tracking ensures you're prepared 24/7. Next NAAC review: Dec 2026.
                    </p>
                  </div>
                </div>
              </div>

              {/* Accreditation Bodies Grid */}
              <div className="accreditation-bodies-grid">
                {accreditationBodies.map((body) => (
                  <div key={body.id} className="accreditation-body-card">
                    <div className="body-header">
                      <div>
                        <h3 className="body-name">{body.name}</h3>
                        <p className="body-full-name">{body.fullName}</p>
                      </div>
                      <span className={`status-badge ${body.status}`}>
                        <i className={`fas fa-${body.status === 'accredited' ? 'check-circle' : body.status === 'in-progress' ? 'spinner' : 'clock'}`}></i>
                        {body.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="body-details">
                      {body.grade && (
                        <div className="detail-item">
                          <span className="detail-label">Grade</span>
                          <span className="detail-value grade">{body.grade}</span>
                        </div>
                      )}
                      {body.validUntil && (
                        <div className="detail-item">
                          <span className="detail-label">Valid Until</span>
                          <span className="detail-value">{new Date(body.validUntil).toLocaleDateString()}</span>
                        </div>
                      )}
                      {body.lastReview && (
                        <div className="detail-item">
                          <span className="detail-label">Last Review</span>
                          <span className="detail-value">{new Date(body.lastReview).toLocaleDateString()}</span>
                        </div>
                      )}
                      {body.progress !== undefined && (
                        <div className="detail-item">
                          <span className="detail-label">Progress</span>
                          <span className="detail-value">{body.progress}%</span>
                        </div>
                      )}
                    </div>

                    {body.progress !== undefined && (
                      <div className="progress-container">
                        <div className="progress-label">
                          <span>Completion</span>
                          <span>{body.progress}%</span>
                        </div>
                        <div className="progress-bar-container">
                          <div className="progress-bar" style={{ width: `${body.progress}%` }}></div>
                        </div>
                      </div>
                    )}

                    <div className="body-actions">
                      <button className="btn-view-details" onClick={() => handleViewBodyDetails(body)}>
                        <i className="fas fa-arrow-right"></i> View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Insights */}
              <div className="quick-insights" style={{ marginTop: '24px' }}>
                <div className="insights-header">
                  <i className="fas fa-lightbulb"></i>
                  AI-Powered Insights & Recommendations
                </div>
                <div className="insights-grid">
                  <div className="insight-card success">
                    <div className="insight-icon">
                      <i className="fas fa-check-circle"></i>
                    </div>
                    <p className="insight-text">
                      <strong>Strong Performance</strong><br />
                      Curricular Aspects scored 95% - Among top 10% of institutions nationwide.
                    </p>
                  </div>
                  <div className="insight-card warning">
                    <div className="insight-icon">
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>
                    <p className="insight-text">
                      <strong>Action Required</strong><br />
                      IT Infrastructure needs 2 more evidence documents for full compliance (C4.3).
                    </p>
                  </div>
                  <div className="insight-card danger">
                    <div className="insight-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <p className="insight-text">
                      <strong>Upcoming Deadline</strong><br />
                      NBA CSE Department assessment due in 45 days. Current progress: 78%.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* NAAC Assessment Tab */}
          {activeTab === 'naac' && (
            <div className="naac-overview">
              {/* Score Visualization */}
              <div className="naac-score-card">
                <h3>Overall NAAC Score</h3>
                <div className="score-circle">
                  <svg viewBox="0 0 200 200" style={{ width: '180px', height: '180px' }}>
                    <circle
                      className="score-circle-bg"
                      cx="100"
                      cy="100"
                      r="85"
                    />
                    <circle
                      className="score-circle-progress"
                      cx="100"
                      cy="100"
                      r="85"
                      strokeDasharray={`${(getOverallScore() / 100) * 534} 534`}
                    />
                  </svg>
                  <div className="score-text">
                    <span className="score-percentage">{getOverallScore()}%</span>
                    <span className="score-label">CGPA: {getCGPA(getOverallScore())}</span>
                  </div>
                </div>
                <div className="score-details">
                  <div className="score-item">
                    <span className="score-item-label">Current Grade</span>
                    <span className="score-item-value">{getGrade(getOverallScore())}</span>
                  </div>
                  <div className="score-item">
                    <span className="score-item-label">Total Score</span>
                    <span className="score-item-value">
                      {naacCriteria.reduce((sum, c) => sum + c.score, 0)} / {naacCriteria.reduce((sum, c) => sum + c.maxScore, 0)}
                    </span>
                  </div>
                  <div className="score-item">
                    <span className="score-item-label">CGPA</span>
                    <span className="score-item-value">{getCGPA(getOverallScore())} / 4.00</span>
                  </div>
                </div>
              </div>

              {/* Criteria List */}
              <div className="criteria-list">
                <h3>NAAC Criteria Assessment</h3>
                {naacCriteria.map((criterion) => {
                  const percentage = Math.round((criterion.score / criterion.maxScore) * 100);
                  return (
                    <div key={criterion.id} className="criterion-item">
                      <div className="criterion-header">
                        <h4 className="criterion-title">
                          {criterion.id.toUpperCase()}: {criterion.name}
                        </h4>
                        <div className="criterion-score">
                          <span className="score-value">{criterion.score}/{criterion.maxScore}</span>
                          <span className="score-percentage-small">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="criterion-progress">
                        <div className={`progress-bar-container criterion`}>
                          <div className={`progress-bar ${criterion.status}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                      <div className="sub-criteria">
                        {criterion.criteria.map((sub) => (
                          <div key={sub.id} className="sub-criterion">
                            <span className="sub-criterion-name">{sub.id}: {sub.name}</span>
                            <span className={`sub-criterion-evidence ${sub.evidence >= sub.required ? 'complete' : 'incomplete'}`}>
                              <i className={`fas fa-${sub.evidence >= sub.required ? 'check-circle' : 'exclamation-circle'}`}></i>
                              Evidence: {sub.evidence}/{sub.required}
                            </span>
                            <span className="sub-criterion-score">{sub.score}/{sub.maxScore}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NBA Accreditation Tab */}
          {activeTab === 'nba' && (
            <div className="nba-programs-grid">
              <div className="nba-program-card">
                <div className="program-header">
                  <h3 className="program-name">Computer Science & Engineering</h3>
                  <span className="status-badge in-progress">
                    <i className="fas fa-spinner"></i>
                    IN PROGRESS
                  </span>
                </div>
                <div className="program-info">
                  <div className="info-row">
                    <span className="info-label">Assessment Progress</span>
                    <span className="info-value">78%</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Documents Submitted</span>
                    <span className="info-value">45/58</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Expected Completion</span>
                    <span className="info-value">June 30, 2024</span>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>78%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '78%' }}></div>
                  </div>
                </div>
                <div className="program-actions">
                  <button className="btn-program-action" onClick={() => alert('Viewing CSE program details...\nThis would show comprehensive program information, faculty details, student outcomes, and accreditation history.')}>
                    <i className="fas fa-eye"></i>
                    View Details
                  </button>
                  <button className="btn-program-action secondary" onClick={() => handleUploadDocument()}>
                    <i className="fas fa-upload"></i>
                    Upload Documents
                  </button>
                </div>
              </div>

              <div className="nba-program-card">
                <div className="program-header">
                  <h3 className="program-name">Electronics & Communication</h3>
                  <span className="status-badge accredited">
                    <i className="fas fa-check-circle"></i>
                    ACCREDITED
                  </span>
                </div>
                <div className="program-info">
                  <div className="info-row">
                    <span className="info-label">Accreditation Date</span>
                    <span className="info-value">July 20, 2022</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Valid Until</span>
                    <span className="info-value">July 20, 2025</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Next Review</span>
                    <span className="info-value">January 15, 2025</span>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Status</span>
                    <span>100%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '100%' }}></div>
                  </div>
                </div>
                <div className="program-actions">
                  <button className="btn-program-action" onClick={handleViewCertificate}>
                    <i className="fas fa-certificate"></i>
                    View Certificate
                  </button>
                </div>
              </div>

              <div className="nba-program-card">
                <div className="program-header">
                  <h3 className="program-name">Mechanical Engineering</h3>
                  <span className="status-badge pending">
                    <i className="fas fa-clock"></i>
                    PENDING
                  </span>
                </div>
                <div className="program-info">
                  <div className="info-row">
                    <span className="info-label">Application Status</span>
                    <span className="info-value">Documentation Phase</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Planned Submission</span>
                    <span className="info-value">April 30, 2024</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Completion</span>
                    <span className="info-value">35%</span>
                  </div>
                </div>
                <div className="progress-container">
                  <div className="progress-label">
                    <span>Progress</span>
                    <span>35%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: '35%' }}></div>
                  </div>
                </div>
                <div className="program-actions">
                  <button className="btn-program-action" onClick={handleContinueApplication}>
                    <i className="fas fa-play"></i>
                    Continue Application
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === 'documents' && (
            <div className="documents-section">
              <div className="documents-header">
                <h3>Accreditation Documents</h3>
                <div className="documents-actions">
                  <select
                    className="filter-dropdown"
                    value={documentFilter}
                    onChange={(e) => setDocumentFilter(e.target.value)}
                  >
                    <option value="all">All Categories</option>
                    <option value="naac">NAAC</option>
                    <option value="nba">NBA</option>
                    <option value="nirf">NIRF</option>
                    <option value="aicte">AICTE</option>
                  </select>
                  <button className="btn-upload" onClick={() => handleUploadDocument()}>
                    <i className="fas fa-upload"></i>
                    Upload Document
                  </button>
                </div>
              </div>

              <table className="documents-table">
                <thead>
                  <tr>
                    <th>Document Title</th>
                    <th>Category</th>
                    <th>Upload Date</th>
                    <th>File Size</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td>
                        <div className="doc-title">
                          <i className="fas fa-file-pdf" style={{ marginRight: '8px', color: '#ef4444' }}></i>
                          {doc.title}
                        </div>
                      </td>
                      <td>
                        <span className={`doc-category ${doc.category.toLowerCase()}`}>
                          {doc.category}
                        </span>
                      </td>
                      <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                      <td>{doc.size}</td>
                      <td>
                        <span className={`status-badge ${doc.status}`}>
                          {doc.status === 'approved' && <i className="fas fa-check-circle"></i>}
                          {doc.status === 'pending-approval' && <i className="fas fa-clock"></i>}
                          {doc.status === 'rejected' && <i className="fas fa-times-circle"></i>}
                          {doc.status.replace('-', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="doc-actions">
                          <button className="doc-action-btn" title="View" onClick={() => handleViewDocument(doc)}>
                            <i className="fas fa-eye"></i>
                          </button>
                          <button className="doc-action-btn" title="Download" onClick={() => handleDownloadDocument(doc)}>
                            <i className="fas fa-download"></i>
                          </button>
                          <button className="doc-action-btn delete" title="Delete" onClick={() => handleDeleteDocument(doc.id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="timeline-container">
              <div className="timeline-line"></div>

              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <div>
                    <h4 className="timeline-title">NAAC A+ Grade Achieved</h4>
                    <p className="timeline-date">
                      <i className="fas fa-calendar"></i>
                      December 15, 2021
                    </p>
                  </div>
                  <span className="timeline-status completed">Completed</span>
                </div>
                <p className="timeline-description">
                  Successfully received A+ grade with 3.52 CGPA. Institution recognized among top-tier colleges nationwide.
                </p>
              </div>

              <div className="timeline-item completed">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <div>
                    <h4 className="timeline-title">ECE Department NBA Accredited</h4>
                    <p className="timeline-date">
                      <i className="fas fa-calendar"></i>
                      July 20, 2022
                    </p>
                  </div>
                  <span className="timeline-status completed">Completed</span>
                </div>
                <p className="timeline-description">
                  Electronics & Communication Engineering program received NBA accreditation for 3 years.
                </p>
              </div>

              <div className="timeline-item active">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <div>
                    <h4 className="timeline-title">CSE NBA Assessment In Progress</h4>
                    <p className="timeline-date">
                      <i className="fas fa-calendar"></i>
                      Ongoing - Expected June 2024
                    </p>
                  </div>
                  <span className="timeline-status active">Active</span>
                </div>
                <p className="timeline-description">
                  Computer Science Engineering department assessment at 78% completion. 13 documents pending.
                </p>
              </div>

              <div className="timeline-item upcoming">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <div>
                    <h4 className="timeline-title">Mechanical Engineering NBA Application</h4>
                    <p className="timeline-date">
                      <i className="fas fa-calendar"></i>
                      Planned - April 2024
                    </p>
                  </div>
                  <span className="timeline-status upcoming">Upcoming</span>
                </div>
                <p className="timeline-description">
                  Planned submission of NBA application for Mechanical Engineering department.
                </p>
              </div>

              <div className="timeline-item upcoming">
                <div className="timeline-dot"></div>
                <div className="timeline-header">
                  <div>
                    <h4 className="timeline-title">NAAC Re-accreditation Cycle</h4>
                    <p className="timeline-date">
                      <i className="fas fa-calendar"></i>
                      Due - December 2026
                    </p>
                  </div>
                  <span className="timeline-status upcoming">Upcoming</span>
                </div>
                <p className="timeline-description">
                  Preparation for next NAAC assessment cycle. Begin documentation 12 months prior.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Generation Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#212529' }}>
                <i className="fas fa-file-export" style={{ marginRight: '12px', color: '#094d88' }}></i>
                Generate Report
              </h2>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6c757d',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <p style={{ color: '#6c757d', marginBottom: '24px', fontSize: '14px' }}>
              Select the type of report you want to generate. The report will include all current data and will be downloaded as a PDF.
            </p>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#212529', fontSize: '14px' }}>
                Report Type
              </label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e9ecef',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#212529',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                <option value="ssr">Self-Study Report (SSR)</option>
                <option value="sar">Self-Assessment Report (SAR)</option>
                <option value="criterion">Criterion-wise Detailed Report</option>
                <option value="summary">Summary Dashboard Report</option>
                <option value="compliance">Compliance Status Report</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowReportModal(false)}
                style={{
                  padding: '10px 20px',
                  border: '2px solid #e9ecef',
                  backgroundColor: 'transparent',
                  color: '#212529',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateReport}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  color: 'white',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-download"></i>
                Generate & Download
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grade Predictor Modal */}
      {showPredictorModal && (
        <div className="modal-overlay" onClick={() => setShowPredictorModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '32px',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#212529' }}>
                <i className="fas fa-bullseye" style={{ marginRight: '12px', color: '#094d88' }}></i>
                A+ Grade Prediction Analysis
              </h2>
              <button
                onClick={() => setShowPredictorModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  color: '#6c757d',
                  cursor: 'pointer',
                  padding: '0',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '6px',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              padding: '24px',
              borderRadius: '12px',
              color: 'white',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', fontWeight: '700', marginBottom: '8px' }}>
                {gradePrediction.likelihood}%
              </div>
              <div style={{ fontSize: '16px', opacity: 0.95 }}>
                Likelihood of achieving A+ Grade
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#212529' }}>
                Current Status
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Current Grade</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#094d88' }}>{gradePrediction.current}</div>
                </div>
                <div style={{ padding: '16px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>Points Needed</div>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: gradePrediction.pointsNeeded === 0 ? '#10ac8b' : '#f59e0b' }}>
                    {gradePrediction.pointsNeeded === 0 ? '✓ Achieved' : `${gradePrediction.pointsNeeded}%`}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '12px', color: '#212529' }}>
                <i className="fas fa-lightbulb" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
                Recommendations to Reach A+
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {gradePrediction.recommendations.map((rec, index) => (
                  <div key={index} style={{
                    padding: '16px',
                    border: '2px solid #e9ecef',
                    borderRadius: '8px',
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#212529',
                    display: 'flex',
                    gap: '12px'
                  }}>
                    <div style={{
                      minWidth: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: '#094d88',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {index + 1}
                    </div>
                    <div>{rec}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#dbeafe', borderRadius: '8px', borderLeft: '4px solid #3b82f6' }}>
              <p style={{ margin: 0, fontSize: '13px', color: '#1e40af', lineHeight: '1.6' }}>
                <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                <strong>Always Accreditation-Ready:</strong> EdgeUp's continuous tracking ensures you're prepared 24/7, eliminating the traditional 6-month preparation chaos.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-upload"></i> Upload Document</h2>
              <button className="modal-close" onClick={() => setShowUploadModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const title = formData.get('title') as string;
                const category = formData.get('category') as string;
                const file = formData.get('file') as File;
                handleUploadSubmit(title, category, file);
              }}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Document Title</label>
                  <input
                    type="text"
                    name="title"
                    required
                    placeholder="Enter document title"
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Category</label>
                  <select
                    name="category"
                    required
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  >
                    <option value="naac">NAAC</option>
                    <option value="nba">NBA</option>
                    <option value="nirf">NIRF</option>
                    <option value="aicte">AICTE</option>
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Select File</label>
                  <input
                    type="file"
                    name="file"
                    required
                    accept=".pdf,.doc,.docx"
                    style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '6px' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#094d88', color: 'white', cursor: 'pointer' }}
                  >
                    Upload
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document Viewer Modal */}
      {showDocumentViewer && selectedDocument && (
        <div className="modal-overlay" onClick={() => setShowDocumentViewer(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-file-pdf"></i> {selectedDocument.title}</h2>
              <button className="modal-close" onClick={() => setShowDocumentViewer(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '20px', textAlign: 'center' }}>
                <i className="fas fa-file-pdf" style={{ fontSize: '64px', color: '#ef4444', marginBottom: '20px' }}></i>
                <h3>{selectedDocument.title}</h3>
                <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                  Category: {selectedDocument.category} | Size: {selectedDocument.size} |
                  Uploaded: {new Date(selectedDocument.uploadDate).toLocaleDateString()}
                </p>
                <div style={{ padding: '40px', background: '#f9fafb', borderRadius: '8px', marginBottom: '20px' }}>
                  <p style={{ color: '#6b7280' }}>Document preview would appear here in production.</p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>This would display the PDF content or provide an embedded viewer.</p>
                </div>
                <button
                  onClick={() => handleDownloadDocument(selectedDocument)}
                  style={{ padding: '12px 24px', background: '#094d88', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                >
                  <i className="fas fa-download"></i> Download Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-exclamation-triangle" style={{ color: '#ef4444' }}></i> Confirm Delete</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p style={{ marginBottom: '20px', color: '#6b7280' }}>
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{ padding: '10px 20px', border: '1px solid #e5e7eb', borderRadius: '6px', background: 'white', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDeleteDocument}
                  style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', background: '#ef4444', color: 'white', cursor: 'pointer' }}
                >
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accreditation Body Detail Modal */}
      {showBodyDetailModal && selectedBody && (
        <div className="modal-overlay" onClick={() => setShowBodyDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2><i className="fas fa-award"></i> {selectedBody.fullName}</h2>
              <button className="modal-close" onClick={() => setShowBodyDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div style={{ padding: '20px' }}>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: 600 }}>Status:</span>
                    <span className={`status-badge ${selectedBody.status}`}>
                      {selectedBody.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  {selectedBody.grade && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600 }}>Grade:</span>
                      <span style={{ fontSize: '20px', fontWeight: 700, color: '#094d88' }}>{selectedBody.grade}</span>
                    </div>
                  )}
                  {selectedBody.validUntil && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600 }}>Valid Until:</span>
                      <span>{new Date(selectedBody.validUntil).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedBody.lastReview && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontWeight: 600 }}>Last Review:</span>
                      <span>{new Date(selectedBody.lastReview).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedBody.progress !== undefined && (
                    <div style={{ marginTop: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 600 }}>Completion:</span>
                        <span>{selectedBody.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${selectedBody.progress}%`, background: '#094d88', borderRadius: '4px' }}></div>
                      </div>
                    </div>
                  )}
                </div>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '8px' }}>
                  <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                    <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
                    Detailed accreditation information, documentation requirements, and compliance status would be displayed here in production.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccreditationDashboard;
