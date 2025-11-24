import { useState } from 'react';
import './StudentRetentionPredictor.css';

// Interfaces
interface AtRiskStudent {
  id: string;
  name: string;
  studentId: string;
  department: string;
  semester: number;
  riskLevel: 'high' | 'medium' | 'low';
  riskScore: number;
  riskFactors: string[];
  lastIntervention: string | null;
  attendanceRate: number;
  assignmentCompletion: number;
  testScoresTrend: string;
  classParticipation: number;
  libraryUsage: number;
  financialAidStatus: string;
  avatar?: string;
}

interface RiskFactorDistribution {
  factor: string;
  count: number;
  percentage: number;
  color: string;
}

interface ModelIndicator {
  name: string;
  importance: number;
}

interface Intervention {
  id: string;
  studentName: string;
  type: string;
  date: string;
  status: 'scheduled' | 'completed' | 'follow-up';
  outcome?: string;
}

const StudentRetentionPredictor = () => {
  // State management
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('all');
  const [selectedSemester, setSelectedSemester] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('riskScore');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedStudent, setSelectedStudent] = useState<AtRiskStudent | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  // Mock data - At-Risk Students
  const atRiskStudents: AtRiskStudent[] = [
    {
      id: 'S001',
      name: 'Rahul Sharma',
      studentId: 'CS2021001',
      department: 'Computer Science',
      semester: 6,
      riskLevel: 'high',
      riskScore: 85,
      riskFactors: ['Attendance', 'Performance', 'Engagement'],
      lastIntervention: '2025-10-15',
      attendanceRate: 62,
      assignmentCompletion: 58,
      testScoresTrend: 'declining',
      classParticipation: 45,
      libraryUsage: 30,
      financialAidStatus: 'pending'
    },
    {
      id: 'S002',
      name: 'Priya Patel',
      studentId: 'EC2021045',
      department: 'Electronics',
      semester: 4,
      riskLevel: 'high',
      riskScore: 78,
      riskFactors: ['Financial', 'Attendance'],
      lastIntervention: null,
      attendanceRate: 68,
      assignmentCompletion: 72,
      testScoresTrend: 'stable',
      classParticipation: 55,
      libraryUsage: 40,
      financialAidStatus: 'critical'
    },
    {
      id: 'S003',
      name: 'Amit Kumar',
      studentId: 'ME2022012',
      department: 'Mechanical',
      semester: 3,
      riskLevel: 'medium',
      riskScore: 58,
      riskFactors: ['Engagement', 'Performance'],
      lastIntervention: '2025-10-28',
      attendanceRate: 75,
      assignmentCompletion: 68,
      testScoresTrend: 'stable',
      classParticipation: 50,
      libraryUsage: 45,
      financialAidStatus: 'approved'
    },
    {
      id: 'S004',
      name: 'Sneha Verma',
      studentId: 'CS2021089',
      department: 'Computer Science',
      semester: 5,
      riskLevel: 'high',
      riskScore: 82,
      riskFactors: ['Performance', 'Personal', 'Engagement'],
      lastIntervention: '2025-11-01',
      attendanceRate: 70,
      assignmentCompletion: 55,
      testScoresTrend: 'declining',
      classParticipation: 40,
      libraryUsage: 35,
      financialAidStatus: 'approved'
    },
    {
      id: 'S005',
      name: 'Vikram Singh',
      studentId: 'CV2021023',
      department: 'Civil',
      semester: 6,
      riskLevel: 'medium',
      riskScore: 62,
      riskFactors: ['Attendance', 'Engagement'],
      lastIntervention: '2025-10-20',
      attendanceRate: 72,
      assignmentCompletion: 70,
      testScoresTrend: 'stable',
      classParticipation: 60,
      libraryUsage: 50,
      financialAidStatus: 'approved'
    },
    {
      id: 'S006',
      name: 'Anita Desai',
      studentId: 'EC2022034',
      department: 'Electronics',
      semester: 2,
      riskLevel: 'low',
      riskScore: 35,
      riskFactors: ['Engagement'],
      lastIntervention: null,
      attendanceRate: 85,
      assignmentCompletion: 82,
      testScoresTrend: 'improving',
      classParticipation: 70,
      libraryUsage: 65,
      financialAidStatus: 'approved'
    },
    {
      id: 'S007',
      name: 'Rajesh Mehta',
      studentId: 'ME2021056',
      department: 'Mechanical',
      semester: 7,
      riskLevel: 'high',
      riskScore: 75,
      riskFactors: ['Performance', 'Financial'],
      lastIntervention: '2025-10-25',
      attendanceRate: 68,
      assignmentCompletion: 60,
      testScoresTrend: 'declining',
      classParticipation: 48,
      libraryUsage: 38,
      financialAidStatus: 'pending'
    },
    {
      id: 'S008',
      name: 'Kavita Joshi',
      studentId: 'CS2022078',
      department: 'Computer Science',
      semester: 3,
      riskLevel: 'medium',
      riskScore: 55,
      riskFactors: ['Attendance', 'Engagement'],
      lastIntervention: '2025-11-02',
      attendanceRate: 73,
      assignmentCompletion: 72,
      testScoresTrend: 'stable',
      classParticipation: 58,
      libraryUsage: 48,
      financialAidStatus: 'approved'
    },
    {
      id: 'S009',
      name: 'Sanjay Gupta',
      studentId: 'CV2021067',
      department: 'Civil',
      semester: 5,
      riskLevel: 'low',
      riskScore: 38,
      riskFactors: ['Engagement'],
      lastIntervention: null,
      attendanceRate: 82,
      assignmentCompletion: 80,
      testScoresTrend: 'stable',
      classParticipation: 68,
      libraryUsage: 60,
      financialAidStatus: 'approved'
    },
    {
      id: 'S010',
      name: 'Meera Nair',
      studentId: 'EC2021098',
      department: 'Electronics',
      semester: 6,
      riskLevel: 'medium',
      riskScore: 60,
      riskFactors: ['Performance', 'Attendance'],
      lastIntervention: '2025-10-18',
      attendanceRate: 74,
      assignmentCompletion: 68,
      testScoresTrend: 'stable',
      classParticipation: 55,
      libraryUsage: 45,
      financialAidStatus: 'approved'
    },
    {
      id: 'S011',
      name: 'Arun Kumar',
      studentId: 'ME2022089',
      department: 'Mechanical',
      semester: 2,
      riskLevel: 'low',
      riskScore: 32,
      riskFactors: [],
      lastIntervention: null,
      attendanceRate: 88,
      assignmentCompletion: 85,
      testScoresTrend: 'improving',
      classParticipation: 75,
      libraryUsage: 68,
      financialAidStatus: 'approved'
    },
    {
      id: 'S012',
      name: 'Pooja Malik',
      studentId: 'CS2021123',
      department: 'Computer Science',
      semester: 6,
      riskLevel: 'high',
      riskScore: 80,
      riskFactors: ['Attendance', 'Financial', 'Performance'],
      lastIntervention: '2025-10-30',
      attendanceRate: 65,
      assignmentCompletion: 58,
      testScoresTrend: 'declining',
      classParticipation: 42,
      libraryUsage: 32,
      financialAidStatus: 'critical'
    }
  ];

  // Risk factor distribution data
  const riskFactorDistribution: RiskFactorDistribution[] = [
    { factor: 'Attendance', count: 12, percentage: 28, color: '#ef4444' },
    { factor: 'Performance', count: 10, percentage: 24, color: '#f59e0b' },
    { factor: 'Engagement', count: 9, percentage: 21, color: '#3b82f6' },
    { factor: 'Financial', count: 7, percentage: 16, color: '#8b5cf6' },
    { factor: 'Personal', count: 5, percentage: 11, color: '#ec4899' }
  ];

  // Model indicators
  const modelIndicators: ModelIndicator[] = [
    { name: 'Attendance Rate', importance: 90 },
    { name: 'Assignment Completion', importance: 85 },
    { name: 'Test Scores Trend', importance: 80 },
    { name: 'Class Participation', importance: 70 },
    { name: 'Library/Resource Usage', importance: 60 },
    { name: 'Financial Aid Status', importance: 55 }
  ];

  // Recent interventions
  const recentInterventions: Intervention[] = [
    {
      id: 'I001',
      studentName: 'Kavita Joshi',
      type: 'Counseling',
      date: '2025-11-02',
      status: 'completed',
      outcome: 'Student showed improvement in engagement'
    },
    {
      id: 'I002',
      studentName: 'Sneha Verma',
      type: 'Academic Support',
      date: '2025-11-01',
      status: 'follow-up',
      outcome: 'Requires additional tutoring sessions'
    },
    {
      id: 'I003',
      studentName: 'Pooja Malik',
      type: 'Financial Aid',
      date: '2025-10-30',
      status: 'completed',
      outcome: 'Emergency fund disbursed'
    },
    {
      id: 'I004',
      studentName: 'Vikram Singh',
      type: 'Mentorship',
      date: '2025-10-28',
      status: 'scheduled'
    },
    {
      id: 'I005',
      studentName: 'Rajesh Mehta',
      type: 'Counseling',
      date: '2025-10-25',
      status: 'completed',
      outcome: 'Personal issues being addressed'
    }
  ];

  // Get unique departments
  const departments = ['all', ...Array.from(new Set(atRiskStudents.map(s => s.department)))];

  // Calculate metrics
  const highRiskCount = atRiskStudents.filter(s => s.riskLevel === 'high').length;
  const mediumRiskCount = atRiskStudents.filter(s => s.riskLevel === 'medium').length;
  const lowRiskCount = atRiskStudents.filter(s => s.riskLevel === 'low').length;
  const totalStudents = atRiskStudents.length;
  const interventionSuccessRate = 78;

  // Filter and sort students
  const getFilteredStudents = (): AtRiskStudent[] => {
    let filtered = atRiskStudents;

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(s => s.department === selectedDepartment);
    }

    // Risk level filter
    if (selectedRiskLevel !== 'all') {
      filtered = filtered.filter(s => s.riskLevel === selectedRiskLevel);
    }

    // Semester filter
    if (selectedSemester !== 'all') {
      filtered = filtered.filter(s => s.semester.toString() === selectedSemester);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      let aVal: any = a[sortColumn as keyof AtRiskStudent];
      let bVal: any = b[sortColumn as keyof AtRiskStudent];

      if (sortColumn === 'name' || sortColumn === 'studentId' || sortColumn === 'department') {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  };

  const filteredStudents = getFilteredStudents();

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  // Get risk level badge class
  const getRiskBadgeClass = (level: string): string => {
    switch (level) {
      case 'high': return 'risk-badge-high';
      case 'medium': return 'risk-badge-medium';
      case 'low': return 'risk-badge-low';
      default: return '';
    }
  };

  // Get risk level color
  const getRiskColor = (level: string): string => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // View student details
  const viewStudentDetails = (student: AtRiskStudent) => {
    setSelectedStudent(student);
    setShowDetailModal(true);
  };

  // Handle export
  const handleExport = () => {
    alert('Exporting data... (Feature will be implemented with backend)');
  };

  // Handle generate report
  const handleGenerateReport = () => {
    alert('Generating comprehensive report... (Feature will be implemented with backend)');
  };

  return (
    <div className="retention-predictor-container">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-user-graduate"></i> Student Retention Predictor</h1>
          <p>ML-powered early warning system to identify and support at-risk students</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={handleGenerateReport}>
            <i className="fas fa-file-alt"></i>
            Generate Report
          </button>
          <button className="btn-secondary" onClick={handleExport}>
            <i className="fas fa-download"></i>
            Export Data
          </button>
        </div>
      </div>

      {/* Risk Overview Dashboard */}
      <div className="risk-overview-grid">
        <div className="risk-metric-card high-risk">
          <div className="metric-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">High Risk Students</span>
            <span className="metric-value">{highRiskCount}</span>
            <span className="metric-percentage">{((highRiskCount / totalStudents) * 100).toFixed(1)}% of total</span>
          </div>
        </div>

        <div className="risk-metric-card medium-risk">
          <div className="metric-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">Medium Risk Students</span>
            <span className="metric-value">{mediumRiskCount}</span>
            <span className="metric-percentage">{((mediumRiskCount / totalStudents) * 100).toFixed(1)}% of total</span>
          </div>
        </div>

        <div className="risk-metric-card low-risk">
          <div className="metric-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">Low Risk Students</span>
            <span className="metric-value">{lowRiskCount}</span>
            <span className="metric-percentage">{((lowRiskCount / totalStudents) * 100).toFixed(1)}% of total</span>
          </div>
        </div>

        <div className="risk-metric-card intervention-success">
          <div className="metric-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="metric-content">
            <span className="metric-label">Intervention Success Rate</span>
            <span className="metric-value">{interventionSuccessRate}%</span>
            <span className="metric-percentage"><i className="fas fa-arrow-up"></i> +5% from last month</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="retention-main-layout">
        {/* Left Column - Main Content */}
        <div className="retention-main-content">
          {/* Filter and Search Section */}
          <div className="filter-search-section">
            <div className="filters-row">
              <div className="filter-group">
                <label>Department</label>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                  <option value="all">All Departments</option>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Risk Level</label>
                <select value={selectedRiskLevel} onChange={(e) => setSelectedRiskLevel(e.target.value)}>
                  <option value="all">All Levels</option>
                  <option value="high">High Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="low">Low Risk</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Semester</label>
                <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                  <option value="all">All Semesters</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <option key={sem} value={sem.toString()}>Semester {sem}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group search-group">
                <label>Search</label>
                <div className="search-input-wrapper">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search by name or student ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="result-count">
              Showing {filteredStudents.length} of {totalStudents} students
            </div>
          </div>

          {/* At-Risk Students Table */}
          <div className="students-table-card">
            <h3>
              <i className="fas fa-users"></i>
              At-Risk Students
            </h3>
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th onClick={() => handleSort('name')}>
                      Student Name {sortColumn === 'name' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                    </th>
                    <th onClick={() => handleSort('studentId')}>
                      Student ID {sortColumn === 'studentId' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                    </th>
                    <th onClick={() => handleSort('department')}>
                      Department {sortColumn === 'department' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                    </th>
                    <th onClick={() => handleSort('semester')}>
                      Semester {sortColumn === 'semester' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                    </th>
                    <th onClick={() => handleSort('riskLevel')}>
                      Risk Level {sortColumn === 'riskLevel' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                    </th>
                    <th onClick={() => handleSort('riskScore')}>
                      Risk Score {sortColumn === 'riskScore' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                    </th>
                    <th>Primary Risk Factors</th>
                    <th>Last Intervention</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map(student => (
                    <tr key={student.id}>
                      <td>
                        <div className="student-name-cell">
                          <div className="student-avatar">
                            {student.name.charAt(0)}
                          </div>
                          <span>{student.name}</span>
                        </div>
                      </td>
                      <td>{student.studentId}</td>
                      <td>{student.department}</td>
                      <td>Semester {student.semester}</td>
                      <td>
                        <span className={`risk-badge ${getRiskBadgeClass(student.riskLevel)}`}>
                          {student.riskLevel.charAt(0).toUpperCase() + student.riskLevel.slice(1)} Risk
                        </span>
                      </td>
                      <td>
                        <div className="risk-score-cell">
                          <span className="score-value">{student.riskScore}</span>
                          <div className="score-bar-container">
                            <div
                              className="score-bar-fill"
                              style={{
                                width: `${student.riskScore}%`,
                                backgroundColor: getRiskColor(student.riskLevel)
                              }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="risk-factors-tags">
                          {student.riskFactors.slice(0, 3).map((factor, index) => (
                            <span key={index} className="risk-factor-tag">{factor}</span>
                          ))}
                        </div>
                      </td>
                      <td>{student.lastIntervention || 'No intervention'}</td>
                      <td>
                        <button className="btn-view-details" onClick={() => viewStudentDetails(student)}>
                          <i className="fas fa-eye"></i>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="retention-sidebar">
          {/* Risk Factor Analysis */}
          <div className="sidebar-card risk-factors-card">
            <h3>
              <i className="fas fa-chart-pie"></i>
              Risk Factor Distribution
            </h3>
            <div className="risk-factors-chart">
              {riskFactorDistribution.map((factor, index) => (
                <div key={index} className="factor-item">
                  <div className="factor-bar-wrapper">
                    <div className="factor-info">
                      <span className="factor-name">{factor.factor}</span>
                      <span className="factor-count">{factor.count} students</span>
                    </div>
                    <div className="factor-bar-container">
                      <div
                        className="factor-bar-fill"
                        style={{
                          width: `${factor.percentage}%`,
                          backgroundColor: factor.color
                        }}
                      ></div>
                    </div>
                    <span className="factor-percentage">{factor.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Interventions */}
          <div className="sidebar-card interventions-card">
            <h3>
              <i className="fas fa-history"></i>
              Recent Interventions
            </h3>
            <div className="interventions-timeline">
              {recentInterventions.map(intervention => (
                <div key={intervention.id} className="intervention-item">
                  <div className="intervention-icon">
                    <i className="fas fa-circle"></i>
                  </div>
                  <div className="intervention-content">
                    <div className="intervention-header">
                      <span className="intervention-student">{intervention.studentName}</span>
                      <span className={`intervention-status status-${intervention.status}`}>
                        {intervention.status === 'scheduled' ? 'Scheduled' :
                         intervention.status === 'completed' ? 'Completed' : 'Follow-up'}
                      </span>
                    </div>
                    <div className="intervention-details">
                      <span className="intervention-type">
                        <i className="fas fa-tag"></i>
                        {intervention.type}
                      </span>
                      <span className="intervention-date">
                        <i className="fas fa-calendar"></i>
                        {intervention.date}
                      </span>
                    </div>
                    {intervention.outcome && (
                      <div className="intervention-outcome">{intervention.outcome}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="sidebar-card actions-card">
            <h3>
              <i className="fas fa-lightbulb"></i>
              Recommended Actions
            </h3>
            <div className="actions-list">
              <div className="action-item">
                <div className="action-content">
                  <i className="fas fa-user-md"></i>
                  <span>Schedule counseling sessions for {highRiskCount} high-risk students</span>
                </div>
                <button className="btn-action">Take Action</button>
              </div>
              <div className="action-item">
                <div className="action-content">
                  <i className="fas fa-chart-bar"></i>
                  <span>Review attendance patterns in Computer Science department</span>
                </div>
                <button className="btn-action">Take Action</button>
              </div>
              <div className="action-item">
                <div className="action-content">
                  <i className="fas fa-book"></i>
                  <span>{mediumRiskCount + highRiskCount} students need academic support intervention</span>
                </div>
                <button className="btn-action">Take Action</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prediction Model Insights */}
      <div className="model-insights-card-fullwidth">
        <div className="insights-header-static">
          <h3>
            <i className="fas fa-brain"></i>
            Prediction Model Insights
          </h3>
        </div>

        <div className="insights-content">
          <div className="model-stats">
            <div className="model-stat">
              <span className="stat-label">Model Accuracy</span>
              <span className="stat-value">92.5%</span>
              <span className="stat-indicator"><i className="fas fa-check-circle"></i> High Confidence</span>
            </div>
            <div className="model-stat">
              <span className="stat-label">Last Updated</span>
              <span className="stat-value">Nov 3, 2025</span>
              <span className="stat-indicator">2 days ago</span>
            </div>
          </div>

          <div className="key-indicators">
            <h4>Key Indicators Tracked</h4>
            <div className="indicators-list">
              {modelIndicators.map((indicator, index) => (
                <div key={index} className="indicator-item">
                  <div className="indicator-header">
                    <span className="indicator-name">{indicator.name}</span>
                    <span className="indicator-percentage">{indicator.importance}%</span>
                  </div>
                  <div className="indicator-bar-container">
                    <div
                      className="indicator-bar-fill"
                      style={{ width: `${indicator.importance}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="success-metrics-bar">
        <div className="success-metric">
          <i className="fas fa-users"></i>
          <span className="metric-label">Students Supported This Semester:</span>
          <span className="metric-value">47</span>
        </div>
        <div className="success-metric">
          <i className="fas fa-check-circle"></i>
          <span className="metric-label">Successful Interventions:</span>
          <span className="metric-value">{interventionSuccessRate}%</span>
        </div>
        <div className="success-metric">
          <i className="fas fa-arrow-down"></i>
          <span className="metric-label">Average Risk Reduction:</span>
          <span className="metric-value">18 points</span>
        </div>
      </div>

      {/* Student Detail Modal */}
      {showDetailModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content student-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user-circle"></i>
                Student Risk Profile
              </h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Student Info Header */}
              <div className="student-info-header">
                <div className="student-avatar-large">
                  {selectedStudent.name.charAt(0)}
                </div>
                <div className="student-info-details">
                  <h3>{selectedStudent.name}</h3>
                  <p>{selectedStudent.studentId} • {selectedStudent.department} • Semester {selectedStudent.semester}</p>
                </div>
                <span className={`risk-badge-large ${getRiskBadgeClass(selectedStudent.riskLevel)}`}>
                  {selectedStudent.riskLevel.toUpperCase()} RISK
                </span>
              </div>

              {/* Risk Score Overview */}
              <div className="risk-score-overview">
                <div className="score-display">
                  <span className="score-label">Overall Risk Score</span>
                  <span className="score-value-large">{selectedStudent.riskScore}</span>
                  <div className="score-bar-large">
                    <div
                      className="score-fill-large"
                      style={{
                        width: `${selectedStudent.riskScore}%`,
                        backgroundColor: getRiskColor(selectedStudent.riskLevel)
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Risk Factors Breakdown */}
              <div className="risk-factors-breakdown">
                <h4>Risk Factors Breakdown</h4>
                <div className="factors-grid">
                  <div className="factor-detail-card">
                    <span className="factor-title">Attendance Rate</span>
                    <span className="factor-value">{selectedStudent.attendanceRate}%</span>
                    <div className="factor-bar">
                      <div className="factor-fill" style={{ width: `${selectedStudent.attendanceRate}%` }}></div>
                    </div>
                  </div>
                  <div className="factor-detail-card">
                    <span className="factor-title">Assignment Completion</span>
                    <span className="factor-value">{selectedStudent.assignmentCompletion}%</span>
                    <div className="factor-bar">
                      <div className="factor-fill" style={{ width: `${selectedStudent.assignmentCompletion}%` }}></div>
                    </div>
                  </div>
                  <div className="factor-detail-card">
                    <span className="factor-title">Class Participation</span>
                    <span className="factor-value">{selectedStudent.classParticipation}%</span>
                    <div className="factor-bar">
                      <div className="factor-fill" style={{ width: `${selectedStudent.classParticipation}%` }}></div>
                    </div>
                  </div>
                  <div className="factor-detail-card">
                    <span className="factor-title">Library Usage</span>
                    <span className="factor-value">{selectedStudent.libraryUsage}%</span>
                    <div className="factor-bar">
                      <div className="factor-fill" style={{ width: `${selectedStudent.libraryUsage}%` }}></div>
                    </div>
                  </div>
                  <div className="factor-detail-card">
                    <span className="factor-title">Test Scores Trend</span>
                    <span className="factor-value">{selectedStudent.testScoresTrend}</span>
                  </div>
                  <div className="factor-detail-card">
                    <span className="factor-title">Financial Aid Status</span>
                    <span className="factor-value">{selectedStudent.financialAidStatus}</span>
                  </div>
                </div>
              </div>

              {/* Recommended Interventions */}
              <div className="recommended-interventions">
                <h4>Recommended Intervention Strategies</h4>
                <ul className="intervention-strategies">
                  <li><i className="fas fa-check-circle"></i> Schedule one-on-one counseling session</li>
                  <li><i className="fas fa-check-circle"></i> Assign peer mentor for academic support</li>
                  <li><i className="fas fa-check-circle"></i> Provide access to additional tutoring resources</li>
                  <li><i className="fas fa-check-circle"></i> Monitor attendance weekly with alerts</li>
                  {selectedStudent.financialAidStatus === 'pending' || selectedStudent.financialAidStatus === 'critical' ? (
                    <li><i className="fas fa-check-circle"></i> Review financial aid status urgently</li>
                  ) : null}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
              <button className="btn-primary" onClick={() => alert('Schedule intervention functionality')}>
                <i className="fas fa-calendar-plus"></i>
                Schedule Intervention
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentRetentionPredictor;
