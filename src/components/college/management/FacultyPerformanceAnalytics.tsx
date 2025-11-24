import { useState } from 'react';
import './FacultyPerformanceAnalytics.css';

// Interfaces
interface FacultyMember {
  id: string;
  name: string;
  department: string;
  designation: string;
  teachingRating: number;
  studentCount: number;
  courseCompletionRate: number;
  attendanceAverage: number;
  assignmentTurnaround: number;
  feedbackCount: number;
  publications: number;
  citations: number;
  hIndex: number;
  activeProjects: number;
  grantsReceived: number;
  conferencePresentations: number;
  performanceScore: number;
  trend: 'up' | 'stable' | 'down';
  teachingImprovement?: number;
  researchImprovement?: number;
  overallImprovement?: number;
}

interface DepartmentPerformance {
  department: string;
  avgTeachingRating: number;
  avgResearchOutput: number;
  facultyCount: number;
  overallScore: number;
}

const FacultyPerformanceAnalytics = () => {
  // State management
  const [activeTab, setActiveTab] = useState<'overview' | 'teaching' | 'research' | 'trends'>('overview');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showFilterModal, setShowFilterModal] = useState<boolean>(false);
  const [ratingFilter, setRatingFilter] = useState<[number, number]>([0, 5]);

  // Mock data - Faculty members
  const facultyData: FacultyMember[] = [
    {
      id: 'F001',
      name: 'Dr. Rajesh Kumar',
      department: 'Computer Science',
      designation: 'Professor',
      teachingRating: 4.8,
      studentCount: 120,
      courseCompletionRate: 95,
      attendanceAverage: 88,
      assignmentTurnaround: 3,
      feedbackCount: 95,
      publications: 45,
      citations: 892,
      hIndex: 18,
      activeProjects: 3,
      grantsReceived: 2500000,
      conferencePresentations: 12,
      performanceScore: 94,
      trend: 'up',
      teachingImprovement: 12.5,
      researchImprovement: 18.3,
      overallImprovement: 15.2
    },
    {
      id: 'F002',
      name: 'Dr. Priya Sharma',
      department: 'Computer Science',
      designation: 'Associate Professor',
      teachingRating: 4.6,
      studentCount: 95,
      courseCompletionRate: 92,
      attendanceAverage: 85,
      assignmentTurnaround: 4,
      feedbackCount: 78,
      publications: 32,
      citations: 654,
      hIndex: 15,
      activeProjects: 2,
      grantsReceived: 1800000,
      conferencePresentations: 9,
      performanceScore: 89,
      trend: 'up',
      teachingImprovement: 8.7,
      researchImprovement: 14.2,
      overallImprovement: 11.3
    },
    {
      id: 'F003',
      name: 'Prof. Amit Patel',
      department: 'Electronics',
      designation: 'Professor',
      teachingRating: 4.5,
      studentCount: 110,
      courseCompletionRate: 90,
      attendanceAverage: 82,
      assignmentTurnaround: 5,
      feedbackCount: 88,
      publications: 38,
      citations: 721,
      hIndex: 16,
      activeProjects: 2,
      grantsReceived: 2100000,
      conferencePresentations: 10,
      performanceScore: 87,
      trend: 'stable'
    },
    {
      id: 'F004',
      name: 'Dr. Sneha Verma',
      department: 'Mechanical',
      designation: 'Assistant Professor',
      teachingRating: 4.7,
      studentCount: 85,
      courseCompletionRate: 93,
      attendanceAverage: 86,
      assignmentTurnaround: 3,
      feedbackCount: 72,
      publications: 18,
      citations: 345,
      hIndex: 10,
      activeProjects: 2,
      grantsReceived: 1200000,
      conferencePresentations: 6,
      performanceScore: 86,
      trend: 'up',
      teachingImprovement: 15.4,
      researchImprovement: 22.8,
      overallImprovement: 18.6
    },
    {
      id: 'F005',
      name: 'Dr. Vikram Singh',
      department: 'Civil',
      designation: 'Associate Professor',
      teachingRating: 4.3,
      studentCount: 100,
      courseCompletionRate: 87,
      attendanceAverage: 80,
      assignmentTurnaround: 6,
      feedbackCount: 65,
      publications: 25,
      citations: 478,
      hIndex: 12,
      activeProjects: 1,
      grantsReceived: 1500000,
      conferencePresentations: 7,
      performanceScore: 82,
      trend: 'stable'
    },
    {
      id: 'F006',
      name: 'Dr. Anita Desai',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      teachingRating: 4.9,
      studentCount: 75,
      courseCompletionRate: 96,
      attendanceAverage: 90,
      assignmentTurnaround: 2,
      feedbackCount: 68,
      publications: 15,
      citations: 289,
      hIndex: 9,
      activeProjects: 2,
      grantsReceived: 1000000,
      conferencePresentations: 5,
      performanceScore: 91,
      trend: 'up',
      teachingImprovement: 10.2,
      researchImprovement: 16.7,
      overallImprovement: 13.1
    },
    {
      id: 'F007',
      name: 'Prof. Rahul Mehta',
      department: 'Electronics',
      designation: 'Professor',
      teachingRating: 4.4,
      studentCount: 105,
      courseCompletionRate: 89,
      attendanceAverage: 83,
      assignmentTurnaround: 5,
      feedbackCount: 82,
      publications: 42,
      citations: 815,
      hIndex: 17,
      activeProjects: 3,
      grantsReceived: 2300000,
      conferencePresentations: 11,
      performanceScore: 88,
      trend: 'stable'
    },
    {
      id: 'F008',
      name: 'Dr. Kavita Joshi',
      department: 'Mechanical',
      designation: 'Associate Professor',
      teachingRating: 4.6,
      studentCount: 90,
      courseCompletionRate: 91,
      attendanceAverage: 84,
      assignmentTurnaround: 4,
      feedbackCount: 75,
      publications: 28,
      citations: 542,
      hIndex: 13,
      activeProjects: 2,
      grantsReceived: 1700000,
      conferencePresentations: 8,
      performanceScore: 85,
      trend: 'up',
      teachingImprovement: 9.8,
      researchImprovement: 11.5,
      overallImprovement: 10.4
    },
    {
      id: 'F009',
      name: 'Dr. Sanjay Gupta',
      department: 'Civil',
      designation: 'Professor',
      teachingRating: 4.2,
      studentCount: 115,
      courseCompletionRate: 86,
      attendanceAverage: 79,
      assignmentTurnaround: 7,
      feedbackCount: 70,
      publications: 35,
      citations: 667,
      hIndex: 14,
      activeProjects: 2,
      grantsReceived: 1900000,
      conferencePresentations: 9,
      performanceScore: 81,
      trend: 'down'
    },
    {
      id: 'F010',
      name: 'Dr. Meera Nair',
      department: 'Computer Science',
      designation: 'Assistant Professor',
      teachingRating: 4.7,
      studentCount: 80,
      courseCompletionRate: 94,
      attendanceAverage: 87,
      assignmentTurnaround: 3,
      feedbackCount: 71,
      publications: 12,
      citations: 234,
      hIndex: 8,
      activeProjects: 1,
      grantsReceived: 900000,
      conferencePresentations: 4,
      performanceScore: 87,
      trend: 'up',
      teachingImprovement: 13.6,
      researchImprovement: 19.4,
      overallImprovement: 16.2
    },
    {
      id: 'F011',
      name: 'Prof. Suresh Reddy',
      department: 'Electronics',
      designation: 'Associate Professor',
      teachingRating: 4.5,
      studentCount: 98,
      courseCompletionRate: 90,
      attendanceAverage: 82,
      assignmentTurnaround: 5,
      feedbackCount: 80,
      publications: 30,
      citations: 598,
      hIndex: 14,
      activeProjects: 2,
      grantsReceived: 1600000,
      conferencePresentations: 8,
      performanceScore: 86,
      trend: 'stable'
    },
    {
      id: 'F012',
      name: 'Dr. Deepa Rao',
      department: 'Mechanical',
      designation: 'Professor',
      teachingRating: 4.4,
      studentCount: 108,
      courseCompletionRate: 88,
      attendanceAverage: 81,
      assignmentTurnaround: 6,
      feedbackCount: 85,
      publications: 40,
      citations: 756,
      hIndex: 16,
      activeProjects: 3,
      grantsReceived: 2200000,
      conferencePresentations: 10,
      performanceScore: 84,
      trend: 'stable'
    },
    {
      id: 'F013',
      name: 'Dr. Arun Kumar',
      department: 'Civil',
      designation: 'Assistant Professor',
      teachingRating: 4.6,
      studentCount: 72,
      courseCompletionRate: 92,
      attendanceAverage: 85,
      assignmentTurnaround: 4,
      feedbackCount: 60,
      publications: 14,
      citations: 267,
      hIndex: 9,
      activeProjects: 1,
      grantsReceived: 1100000,
      conferencePresentations: 5,
      performanceScore: 84,
      trend: 'up',
      teachingImprovement: 11.9,
      researchImprovement: 15.8,
      overallImprovement: 13.5
    },
    {
      id: 'F014',
      name: 'Dr. Pooja Malik',
      department: 'Computer Science',
      designation: 'Associate Professor',
      teachingRating: 4.8,
      studentCount: 92,
      courseCompletionRate: 95,
      attendanceAverage: 89,
      assignmentTurnaround: 3,
      feedbackCount: 84,
      publications: 22,
      citations: 445,
      hIndex: 11,
      activeProjects: 2,
      grantsReceived: 1400000,
      conferencePresentations: 7,
      performanceScore: 90,
      trend: 'up',
      teachingImprovement: 14.3,
      researchImprovement: 20.6,
      overallImprovement: 17.1
    },
    {
      id: 'F015',
      name: 'Prof. Harish Iyer',
      department: 'Electronics',
      designation: 'Professor',
      teachingRating: 4.3,
      studentCount: 112,
      courseCompletionRate: 87,
      attendanceAverage: 80,
      assignmentTurnaround: 6,
      feedbackCount: 90,
      publications: 48,
      citations: 923,
      hIndex: 19,
      activeProjects: 4,
      grantsReceived: 2600000,
      conferencePresentations: 13,
      performanceScore: 89,
      trend: 'stable'
    }
  ];

  // Calculate department performance
  const departmentPerformance: DepartmentPerformance[] = [
    {
      department: 'Computer Science',
      avgTeachingRating: 4.75,
      avgResearchOutput: 22.8,
      facultyCount: 5,
      overallScore: 90.2
    },
    {
      department: 'Electronics',
      avgTeachingRating: 4.43,
      avgResearchOutput: 35.3,
      facultyCount: 4,
      overallScore: 87.5
    },
    {
      department: 'Mechanical',
      avgTeachingRating: 4.57,
      avgResearchOutput: 28.7,
      facultyCount: 3,
      overallScore: 85.0
    },
    {
      department: 'Civil',
      avgTeachingRating: 4.37,
      avgResearchOutput: 24.3,
      facultyCount: 3,
      overallScore: 82.3
    }
  ];

  // Get unique departments
  const departments = ['all', ...Array.from(new Set(facultyData.map(f => f.department)))];

  // Calculate KPIs
  const totalFaculty = facultyData.length;
  const avgTeachingRating = (facultyData.reduce((sum, f) => sum + f.teachingRating, 0) / totalFaculty).toFixed(2);
  const activeProjects = facultyData.reduce((sum, f) => sum + f.activeProjects, 0);
  const totalPublications = facultyData.reduce((sum, f) => sum + f.publications, 0);

  // Filter and sort faculty
  const getFilteredFaculty = (): FacultyMember[] => {
    let filtered = facultyData;

    // Department filter
    if (selectedDepartment !== 'all') {
      filtered = filtered.filter(f => f.department === selectedDepartment);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Rating filter
    filtered = filtered.filter(f =>
      f.teachingRating >= ratingFilter[0] && f.teachingRating <= ratingFilter[1]
    );

    // Sort
    filtered = [...filtered].sort((a, b) => {
      const aValue = a[sortColumn as keyof FacultyMember];
      const bValue = b[sortColumn as keyof FacultyMember];

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return filtered;
  };

  const filteredFaculty = getFilteredFaculty();

  // Handle sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Handle faculty detail view
  const handleViewDetails = (faculty: FacultyMember) => {
    setSelectedFaculty(faculty);
    setShowDetailModal(true);
  };

  // Get performance color
  const getPerformanceColor = (score: number): string => {
    if (score >= 90) return 'excellent';
    if (score >= 80) return 'good';
    if (score >= 70) return 'average';
    return 'poor';
  };

  // Get trend icon
  const getTrendIcon = (trend: string): string => {
    if (trend === 'up') return 'fa-arrow-up';
    if (trend === 'down') return 'fa-arrow-down';
    return 'fa-minus';
  };

  return (
    <div className="faculty-performance-container">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-chart-line"></i> Faculty Performance Analytics</h1>
          <p>Data-driven evaluation of teaching effectiveness and research output</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Export functionality')}>
            <i className="fas fa-download"></i>
            Export Report
          </button>
          <button className="btn-secondary" onClick={() => setShowFilterModal(true)}>
            <i className="fas fa-cog"></i>
            Settings
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="kpi-stats-grid">
        <div className="kpi-stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Total Faculty</span>
            <span className="stat-value">{totalFaculty}</span>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +3 from last semester
            </span>
          </div>
        </div>

        <div className="kpi-stat-card success">
          <div className="stat-icon">
            <i className="fas fa-star"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Avg Teaching Rating</span>
            <span className="stat-value">{avgTeachingRating}/5.0</span>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +0.2 from last semester
            </span>
          </div>
        </div>

        <div className="kpi-stat-card info">
          <div className="stat-icon">
            <i className="fas fa-project-diagram"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Research Projects</span>
            <span className="stat-value">{activeProjects}</span>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +15% growth
            </span>
          </div>
        </div>

        <div className="kpi-stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Publications This Year</span>
            <span className="stat-value">{totalPublications}</span>
            <span className="stat-trend positive">
              <i className="fas fa-arrow-up"></i> +22% vs last year
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <i className="fas fa-th-large"></i>
            Overview Dashboard
          </button>
          <button
            className={`tab-button ${activeTab === 'teaching' ? 'active' : ''}`}
            onClick={() => setActiveTab('teaching')}
          >
            <i className="fas fa-chalkboard-teacher"></i>
            Teaching Effectiveness
          </button>
          <button
            className={`tab-button ${activeTab === 'research' ? 'active' : ''}`}
            onClick={() => setActiveTab('research')}
          >
            <i className="fas fa-flask"></i>
            Research & Publications
          </button>
          <button
            className={`tab-button ${activeTab === 'trends' ? 'active' : ''}`}
            onClick={() => setActiveTab('trends')}
          >
            <i className="fas fa-chart-area"></i>
            Performance Trends
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="overview-grid">
                {/* Department Performance Chart */}
                <div className="overview-card department-chart">
                  <h3>
                    <i className="fas fa-chart-bar"></i>
                    Department-wise Performance
                  </h3>
                  <div className="department-bars">
                    {departmentPerformance.map((dept, index) => (
                      <div key={index} className="dept-bar-item">
                        <div className="dept-bar-header">
                          <span className="dept-name">{dept.department}</span>
                          <span className="dept-score">{dept.overallScore.toFixed(1)}</span>
                        </div>
                        <div className="dept-bar-container">
                          <div
                            className="dept-bar-fill"
                            style={{ width: `${dept.overallScore}%` }}
                          ></div>
                        </div>
                        <div className="dept-bar-meta">
                          <span>
                            <i className="fas fa-users"></i> {dept.facultyCount} Faculty
                          </span>
                          <span>
                            <i className="fas fa-star"></i> {dept.avgTeachingRating.toFixed(2)} Rating
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Performers */}
                <div className="overview-card top-performers">
                  <h3>
                    <i className="fas fa-trophy"></i>
                    Top Performers (Overall)
                  </h3>
                  <div className="performers-list">
                    {filteredFaculty
                      .sort((a, b) => b.performanceScore - a.performanceScore)
                      .slice(0, 5)
                      .map((faculty, index) => (
                        <div key={faculty.id} className="performer-item">
                          <div className="performer-rank">#{index + 1}</div>
                          <div className="performer-info">
                            <h4>{faculty.name}</h4>
                            <p>{faculty.department} • {faculty.designation}</p>
                          </div>
                          <div className="performer-score">
                            <span className={`score-badge ${getPerformanceColor(faculty.performanceScore)}`}>
                              {faculty.performanceScore}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Performance Distribution */}
                <div className="overview-card performance-distribution">
                  <h3>
                    <i className="fas fa-chart-pie"></i>
                    Performance Distribution
                  </h3>
                  <div className="distribution-chart-vertical">
                    <div className="vertical-bars-container">
                      <div className="vertical-bar-item">
                        <div className="bar-wrapper">
                          <div className="bar-fill excellent" style={{ height: '80%' }}>
                            <span className="bar-count">6</span>
                          </div>
                        </div>
                        <div className="bar-labels">
                          <span className="bar-category">Excellent</span>
                          <span className="bar-range">(≥90)</span>
                          <span className="bar-percentage">40%</span>
                        </div>
                      </div>
                      <div className="vertical-bar-item">
                        <div className="bar-wrapper">
                          <div className="bar-fill good" style={{ height: '70%' }}>
                            <span className="bar-count">7</span>
                          </div>
                        </div>
                        <div className="bar-labels">
                          <span className="bar-category">Good</span>
                          <span className="bar-range">(80-89)</span>
                          <span className="bar-percentage">47%</span>
                        </div>
                      </div>
                      <div className="vertical-bar-item">
                        <div className="bar-wrapper">
                          <div className="bar-fill average" style={{ height: '40%' }}>
                            <span className="bar-count">2</span>
                          </div>
                        </div>
                        <div className="bar-labels">
                          <span className="bar-category">Average</span>
                          <span className="bar-range">(70-79)</span>
                          <span className="bar-percentage">13%</span>
                        </div>
                      </div>
                      <div className="vertical-bar-item">
                        <div className="bar-wrapper">
                          <div className="bar-fill poor" style={{ height: '0%' }}>
                            <span className="bar-count bar-count-zero">0</span>
                          </div>
                        </div>
                        <div className="bar-labels">
                          <span className="bar-category">Needs Improvement</span>
                          <span className="bar-range">(&lt;70)</span>
                          <span className="bar-percentage">0%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div className="overview-card recent-activities">
                  <h3>
                    <i className="fas fa-clock"></i>
                    Recent Activities
                  </h3>
                  <div className="activities-list">
                    <div className="activity-item">
                      <div className="activity-icon publication">
                        <i className="fas fa-book"></i>
                      </div>
                      <div className="activity-content">
                        <h4>New Publication</h4>
                        <p>Dr. Rajesh Kumar published in IEEE Journal</p>
                        <span className="activity-time">2 days ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon award">
                        <i className="fas fa-award"></i>
                      </div>
                      <div className="activity-content">
                        <h4>Teaching Excellence Award</h4>
                        <p>Dr. Anita Desai received Best Teacher Award</p>
                        <span className="activity-time">5 days ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon grant">
                        <i className="fas fa-hand-holding-usd"></i>
                      </div>
                      <div className="activity-content">
                        <h4>Research Grant Approved</h4>
                        <p>Prof. Harish Iyer secured ₹26L research grant</p>
                        <span className="activity-time">1 week ago</span>
                      </div>
                    </div>
                    <div className="activity-item">
                      <div className="activity-icon conference">
                        <i className="fas fa-podium"></i>
                      </div>
                      <div className="activity-content">
                        <h4>Conference Presentation</h4>
                        <p>Dr. Priya Sharma presented at ICSE 2024</p>
                        <span className="activity-time">2 weeks ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Teaching Effectiveness Tab */}
          {activeTab === 'teaching' && (
            <div className="teaching-tab">
              {/* Filters */}
              <div className="table-filters">
                <div className="filter-group">
                  <label>
                    <i className="fas fa-building"></i>
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>
                    <i className="fas fa-search"></i>
                    Search Faculty
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name or department..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-stats">
                  <span>Showing {filteredFaculty.length} of {totalFaculty} faculty</span>
                </div>
              </div>

              {/* Teaching Table */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')}>
                        Name {sortColumn === 'name' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('department')}>
                        Department {sortColumn === 'department' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('teachingRating')}>
                        Rating {sortColumn === 'teachingRating' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('studentCount')}>
                        Students {sortColumn === 'studentCount' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('courseCompletionRate')}>
                        Completion % {sortColumn === 'courseCompletionRate' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('attendanceAverage')}>
                        Attendance % {sortColumn === 'attendanceAverage' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('assignmentTurnaround')}>
                        Response Time {sortColumn === 'assignmentTurnaround' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFaculty.map(faculty => (
                      <tr key={faculty.id}>
                        <td>
                          <div className="faculty-name-cell">
                            <strong>{faculty.name}</strong>
                            <span className="designation">{faculty.designation}</span>
                          </div>
                        </td>
                        <td>{faculty.department}</td>
                        <td>
                          <div className="rating-cell">
                            <span className="rating-value">{faculty.teachingRating.toFixed(1)}</span>
                            <div className="rating-stars">
                              {[1, 2, 3, 4, 5].map(star => (
                                <i
                                  key={star}
                                  className={`fas fa-star ${star <= Math.round(faculty.teachingRating) ? 'filled' : ''}`}
                                ></i>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td>{faculty.studentCount}</td>
                        <td>
                          <div className="progress-cell">
                            <span>{faculty.courseCompletionRate}%</span>
                            <div className="progress-bar-mini">
                              <div
                                className="progress-fill"
                                style={{ width: `${faculty.courseCompletionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="progress-cell">
                            <span>{faculty.attendanceAverage}%</span>
                            <div className="progress-bar-mini">
                              <div
                                className="progress-fill"
                                style={{ width: `${faculty.attendanceAverage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="turnaround-badge">
                            {faculty.assignmentTurnaround} days
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-view-details"
                            onClick={() => handleViewDetails(faculty)}
                          >
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
          )}

          {/* Research & Publications Tab */}
          {activeTab === 'research' && (
            <div className="research-tab">
              {/* Filters */}
              <div className="table-filters">
                <div className="filter-group">
                  <label>
                    <i className="fas fa-building"></i>
                    Department
                  </label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>
                        {dept === 'all' ? 'All Departments' : dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="filter-group">
                  <label>
                    <i className="fas fa-search"></i>
                    Search Faculty
                  </label>
                  <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-stats">
                  <span>Total Publications: {filteredFaculty.reduce((sum, f) => sum + f.publications, 0)}</span>
                </div>
              </div>

              {/* Research Table */}
              <div className="data-table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th onClick={() => handleSort('name')}>
                        Name {sortColumn === 'name' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('department')}>
                        Department {sortColumn === 'department' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('publications')}>
                        Publications {sortColumn === 'publications' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('citations')}>
                        Citations {sortColumn === 'citations' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('hIndex')}>
                        H-Index {sortColumn === 'hIndex' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('activeProjects')}>
                        Projects {sortColumn === 'activeProjects' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('grantsReceived')}>
                        Grants (₹) {sortColumn === 'grantsReceived' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th onClick={() => handleSort('conferencePresentations')}>
                        Conferences {sortColumn === 'conferencePresentations' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                      </th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFaculty.map(faculty => (
                      <tr key={faculty.id}>
                        <td>
                          <div className="faculty-name-cell">
                            <strong>{faculty.name}</strong>
                            <span className="designation">{faculty.designation}</span>
                          </div>
                        </td>
                        <td>{faculty.department}</td>
                        <td>
                          <span className="metric-badge publications">
                            <i className="fas fa-book"></i>
                            {faculty.publications}
                          </span>
                        </td>
                        <td>
                          <span className="metric-badge citations">
                            <i className="fas fa-quote-right"></i>
                            {faculty.citations}
                          </span>
                        </td>
                        <td>
                          <span className="metric-badge hindex">
                            <i className="fas fa-chart-line"></i>
                            {faculty.hIndex}
                          </span>
                        </td>
                        <td>
                          <span className="metric-badge projects">
                            <i className="fas fa-project-diagram"></i>
                            {faculty.activeProjects}
                          </span>
                        </td>
                        <td>
                          <span className="grant-amount">
                            ₹{(faculty.grantsReceived / 100000).toFixed(1)}L
                          </span>
                        </td>
                        <td>
                          <span className="metric-badge conferences">
                            <i className="fas fa-users"></i>
                            {faculty.conferencePresentations}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn-view-details"
                            onClick={() => handleViewDetails(faculty)}
                          >
                            <i className="fas fa-eye"></i>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Performance Trends Tab */}
          {activeTab === 'trends' && (
            <div className="trends-tab">
              <div className="trends-grid">
                {/* Semester Comparison */}
                <div className="trends-card semester-comparison">
                  <h3>
                    <i className="fas fa-calendar-alt"></i>
                    Semester-wise Performance Comparison
                  </h3>
                  <div className="semester-chart">
                    <div className="semester-bars">
                      {['Fall 2023', 'Spring 2024', 'Fall 2024'].map((semester, index) => {
                        const scores = [82.5, 85.2, 87.1];
                        return (
                          <div key={semester} className="semester-bar-item">
                            <div className="semester-label">{semester}</div>
                            <div className="semester-bar-wrapper">
                              <div
                                className="semester-bar-fill"
                                style={{ width: `${scores[index]}%` }}
                              >
                                <span className="bar-value">{scores[index]}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Department Trends */}
                <div className="trends-card department-trends">
                  <h3>
                    <i className="fas fa-chart-area"></i>
                    Department Performance Trends
                  </h3>
                  <div className="trends-list">
                    {departmentPerformance.map((dept, index) => (
                      <div key={index} className="trend-item">
                        <div className="trend-header">
                          <h4>{dept.department}</h4>
                          <span className={`trend-indicator positive`}>
                            <i className="fas fa-arrow-up"></i>
                            +{(Math.random() * 5 + 1).toFixed(1)}%
                          </span>
                        </div>
                        <div className="trend-metrics">
                          <div className="mini-metric">
                            <span className="metric-label">Teaching</span>
                            <span className="metric-value">{dept.avgTeachingRating.toFixed(2)}</span>
                          </div>
                          <div className="mini-metric">
                            <span className="metric-label">Research</span>
                            <span className="metric-value">{dept.avgResearchOutput.toFixed(1)}</span>
                          </div>
                          <div className="mini-metric">
                            <span className="metric-label">Overall</span>
                            <span className="metric-value">{dept.overallScore.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Improvement Tracking */}
                <div className="trends-card improvement-tracking">
                  <h3>
                    <i className="fas fa-chart-line"></i>
                    Faculty Improvement Tracking
                  </h3>
                  <div className="improvement-list">
                    {filteredFaculty
                      .filter(f => f.trend === 'up')
                      .slice(0, 6)
                      .map(faculty => (
                        <div key={faculty.id} className="improvement-item">
                          <div className="improvement-item-header">
                            <div className="improvement-info">
                              <h4>{faculty.name}</h4>
                              <p>{faculty.department}</p>
                            </div>
                            <div className="improvement-header-badges">
                              <div className="improvement-percentage-badge">
                                <i className="fas fa-arrow-up"></i>
                                {faculty.overallImprovement?.toFixed(1)}%
                              </div>
                              <div className="improvement-badge">
                                <i className="fas fa-arrow-up"></i>
                                Improving
                              </div>
                            </div>
                          </div>

                          <div className="improvement-metrics-grid">
                            <div className="metric-progress-item">
                              <div className="metric-progress-header">
                                <span className="metric-progress-label">
                                  <i className="fas fa-chalkboard-teacher"></i>
                                  Teaching Effectiveness
                                </span>
                                <span className="metric-progress-value">+{faculty.teachingImprovement?.toFixed(1)}%</span>
                              </div>
                              <div className="metric-progress-bar-container">
                                <div
                                  className="metric-progress-fill teaching"
                                  style={{ width: `${Math.min(faculty.teachingImprovement || 0, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="metric-progress-item">
                              <div className="metric-progress-header">
                                <span className="metric-progress-label">
                                  <i className="fas fa-flask"></i>
                                  Research Output
                                </span>
                                <span className="metric-progress-value">+{faculty.researchImprovement?.toFixed(1)}%</span>
                              </div>
                              <div className="metric-progress-bar-container">
                                <div
                                  className="metric-progress-fill research"
                                  style={{ width: `${Math.min(faculty.researchImprovement || 0, 100)}%` }}
                                ></div>
                              </div>
                            </div>

                            <div className="metric-progress-item">
                              <div className="metric-progress-header">
                                <span className="metric-progress-label">
                                  <i className="fas fa-chart-bar"></i>
                                  Overall Performance
                                </span>
                                <span className="metric-progress-value">+{faculty.overallImprovement?.toFixed(1)}%</span>
                              </div>
                              <div className="metric-progress-bar-container">
                                <div
                                  className="metric-progress-fill overall"
                                  style={{ width: `${Math.min(faculty.overallImprovement || 0, 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Predictive Analytics */}
                <div className="trends-card predictive-analytics">
                  <h3>
                    <i className="fas fa-brain"></i>
                    Predictive Analytics - Next Semester
                  </h3>
                  <div className="predictions-grid">
                    <div className="prediction-item">
                      <div className="prediction-icon success">
                        <i className="fas fa-arrow-trend-up"></i>
                      </div>
                      <div className="prediction-content">
                        <h4>Expected Performance Increase</h4>
                        <p className="prediction-value">+3.2%</p>
                        <span className="prediction-confidence">92% confidence</span>
                      </div>
                    </div>
                    <div className="prediction-item">
                      <div className="prediction-icon info">
                        <i className="fas fa-book-open"></i>
                      </div>
                      <div className="prediction-content">
                        <h4>Projected Publications</h4>
                        <p className="prediction-value">58-62</p>
                        <span className="prediction-confidence">85% confidence</span>
                      </div>
                    </div>
                    <div className="prediction-item">
                      <div className="prediction-icon warning">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="prediction-content">
                        <h4>Faculty Requiring Support</h4>
                        <p className="prediction-value">2 Faculty</p>
                        <span className="prediction-confidence">Recommended intervention</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Faculty Detail Modal */}
      {showDetailModal && selectedFaculty && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal faculty-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user-circle"></i>
                Faculty Performance Details
              </h2>
              <button className="modal-close" onClick={() => setShowDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="faculty-profile">
                <div className="profile-header">
                  <div className="profile-avatar">
                    <i className="fas fa-user-circle"></i>
                  </div>
                  <div className="profile-info">
                    <h3>{selectedFaculty.name}</h3>
                    <p className="profile-designation">{selectedFaculty.designation}</p>
                    <p className="profile-department">{selectedFaculty.department}</p>
                  </div>
                  <div className="profile-score">
                    <span className={`score-badge-large ${getPerformanceColor(selectedFaculty.performanceScore)}`}>
                      {selectedFaculty.performanceScore}
                    </span>
                    <span className="score-label">Overall Score</span>
                    <span className={`trend-icon ${selectedFaculty.trend}`}>
                      <i className={`fas ${getTrendIcon(selectedFaculty.trend)}`}></i>
                    </span>
                  </div>
                </div>

                <div className="performance-sections">
                  {/* Teaching Metrics */}
                  <div className="performance-section">
                    <h4>
                      <i className="fas fa-chalkboard-teacher"></i>
                      Teaching Effectiveness
                    </h4>
                    <div className="metrics-grid">
                      <div className="metric-item">
                        <span className="metric-label">Student Rating</span>
                        <span className="metric-value">{selectedFaculty.teachingRating.toFixed(1)}/5.0</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Students Taught</span>
                        <span className="metric-value">{selectedFaculty.studentCount}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Course Completion</span>
                        <span className="metric-value">{selectedFaculty.courseCompletionRate}%</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Avg Attendance</span>
                        <span className="metric-value">{selectedFaculty.attendanceAverage}%</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Response Time</span>
                        <span className="metric-value">{selectedFaculty.assignmentTurnaround} days</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Feedback Count</span>
                        <span className="metric-value">{selectedFaculty.feedbackCount}</span>
                      </div>
                    </div>
                  </div>

                  {/* Research Metrics */}
                  <div className="performance-section">
                    <h4>
                      <i className="fas fa-flask"></i>
                      Research & Publications
                    </h4>
                    <div className="metrics-grid">
                      <div className="metric-item">
                        <span className="metric-label">Publications</span>
                        <span className="metric-value">{selectedFaculty.publications}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Citations</span>
                        <span className="metric-value">{selectedFaculty.citations}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">H-Index</span>
                        <span className="metric-value">{selectedFaculty.hIndex}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Active Projects</span>
                        <span className="metric-value">{selectedFaculty.activeProjects}</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Grants Received</span>
                        <span className="metric-value">₹{(selectedFaculty.grantsReceived / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-label">Conferences</span>
                        <span className="metric-value">{selectedFaculty.conferencePresentations}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>
                Close
              </button>
              <button className="btn-primary">
                <i className="fas fa-download"></i>
                Download Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="modal-overlay" onClick={() => setShowFilterModal(false)}>
          <div className="modal filter-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-filter"></i>
                Advanced Filters
              </h2>
              <button className="modal-close" onClick={() => setShowFilterModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="filter-section">
                <label>Teaching Rating Range</label>
                <div className="range-input-group">
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={ratingFilter[0]}
                    onChange={(e) => setRatingFilter([parseFloat(e.target.value), ratingFilter[1]])}
                  />
                  <span>to</span>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={ratingFilter[1]}
                    onChange={(e) => setRatingFilter([ratingFilter[0], parseFloat(e.target.value)])}
                  />
                </div>
              </div>
              <div className="filter-section">
                <label>Department</label>
                <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept === 'all' ? 'All Departments' : dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => {
                  setRatingFilter([0, 5]);
                  setSelectedDepartment('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
              <button className="btn-primary" onClick={() => setShowFilterModal(false)}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPerformanceAnalytics;
