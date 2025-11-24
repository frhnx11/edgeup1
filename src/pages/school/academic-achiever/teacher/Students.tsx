import { useState } from 'react';
import StudentPerformance from './StudentPerformance';
import SubjectHeatmap from './SubjectHeatmap';

type ViewMode = 'classes' | 'students' | 'performance';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  avatar: string;
  attendance: number;
  avgScore: number;
  assignmentsSubmitted: number;
  totalAssignments: number;
  performance: 'excellent' | 'good' | 'needs-attention';
  parentName: string;
  parentContact: string;
  parentEmail: string;
  dateOfBirth: string;
  enrollmentDate: string;
  lastUpdated: string;
  subjectScores: {
    Mathematics: number;
    Science: number;
    English: number;
    'Social Science': number;
    Tamil: number;
  };
}

interface TeacherClass {
  id: string;
  name: string;
  grade: string;
  subjects: string[];
  totalStudents: number;
  avgAttendance: number;
  avgScore: number;
  excellentPerformers: number;
  needsAttention: number;
  schedule: string;
}

const Students = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('classes');
  const [selectedClass, setSelectedClass] = useState<TeacherClass | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Teacher's classes data
  const teacherClasses: TeacherClass[] = [
    {
      id: '10A',
      name: 'Grade 10A',
      grade: '10',
      subjects: ['Mathematics', 'Science'],
      totalStudents: 35,
      avgAttendance: 92,
      avgScore: 85,
      excellentPerformers: 12,
      needsAttention: 3,
      schedule: 'Mon, Wed, Fri - 9:00 AM'
    },
    {
      id: '10B',
      name: 'Grade 10B',
      grade: '10',
      subjects: ['Mathematics'],
      totalStudents: 32,
      avgAttendance: 88,
      avgScore: 80,
      excellentPerformers: 8,
      needsAttention: 5,
      schedule: 'Tue, Thu - 10:30 AM'
    },
    {
      id: '11',
      name: 'Grade 11',
      grade: '11',
      subjects: ['Mathematics', 'Science'],
      totalStudents: 28,
      avgAttendance: 90,
      avgScore: 83,
      excellentPerformers: 10,
      needsAttention: 2,
      schedule: 'Mon, Wed - 2:00 PM'
    }
  ];

  // Students data (filtered by selected class when viewing students)
  const allStudents: Student[] = [
    {
      id: '1',
      name: 'Aravind Kumar',
      rollNumber: '10A-001',
      avatar: '👨‍🎓',
      attendance: 95,
      avgScore: 88,
      assignmentsSubmitted: 14,
      totalAssignments: 15,
      performance: 'excellent',
      parentName: 'Kumar Swamy',
      parentContact: '+91 98765-43210',
      parentEmail: 'kumar.swamy@email.com',
      dateOfBirth: 'Jan 15, 2008',
      enrollmentDate: 'Jun 1, 2022',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 92,
        Science: 89,
        English: 85,
        'Social Science': 87,
        Tamil: 87
      }
    },
    {
      id: '2',
      name: 'Priya Lakshmi',
      rollNumber: '10A-002',
      avatar: '👩‍🎓',
      attendance: 92,
      avgScore: 91,
      assignmentsSubmitted: 15,
      totalAssignments: 15,
      performance: 'excellent',
      parentName: 'Lakshmi Devi',
      parentContact: '+91 98765-43211',
      parentEmail: 'lakshmi.devi@email.com',
      dateOfBirth: 'Mar 22, 2008',
      enrollmentDate: 'Jun 1, 2022',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 94,
        Science: 92,
        English: 93,
        'Social Science': 89,
        Tamil: 87
      }
    },
    {
      id: '3',
      name: 'Rajesh Kannan',
      rollNumber: '10A-003',
      avatar: '👨‍🎓',
      attendance: 89,
      avgScore: 86,
      assignmentsSubmitted: 14,
      totalAssignments: 15,
      performance: 'excellent',
      parentName: 'Kannan Moorthy',
      parentContact: '+91 98765-43218',
      parentEmail: 'kannan.moorthy@email.com',
      dateOfBirth: 'Jun 10, 2008',
      enrollmentDate: 'Jun 1, 2022',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 88,
        Science: 90,
        English: 82,
        'Social Science': 84,
        Tamil: 86
      }
    },
    {
      id: '4',
      name: 'Karthik Raj',
      rollNumber: '10B-001',
      avatar: '👨‍🎓',
      attendance: 88,
      avgScore: 82,
      assignmentsSubmitted: 13,
      totalAssignments: 15,
      performance: 'good',
      parentName: 'Rajendran',
      parentContact: '+91 98765-43212',
      parentEmail: 'rajendran@email.com',
      dateOfBirth: 'Jul 8, 2008',
      enrollmentDate: 'Jun 1, 2022',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 85,
        Science: 83,
        English: 78,
        'Social Science': 81,
        Tamil: 83
      }
    },
    {
      id: '5',
      name: 'Divya Bharathi',
      rollNumber: '10B-002',
      avatar: '👩‍🎓',
      attendance: 78,
      avgScore: 68,
      assignmentsSubmitted: 10,
      totalAssignments: 15,
      performance: 'needs-attention',
      parentName: 'Bharathi Ammal',
      parentContact: '+91 98765-43213',
      parentEmail: 'bharathi.ammal@email.com',
      dateOfBirth: 'Nov 12, 2008',
      enrollmentDate: 'Jun 1, 2022',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 62,
        Science: 65,
        English: 75,
        'Social Science': 68,
        Tamil: 70
      }
    },
    {
      id: '6',
      name: 'Vishnu Prasad',
      rollNumber: '11-001',
      avatar: '👨‍🎓',
      attendance: 94,
      avgScore: 89,
      assignmentsSubmitted: 12,
      totalAssignments: 13,
      performance: 'excellent',
      parentName: 'Prasad Rajan',
      parentContact: '+91 98765-43214',
      parentEmail: 'prasad.rajan@email.com',
      dateOfBirth: 'Feb 3, 2007',
      enrollmentDate: 'Jun 1, 2021',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 91,
        Science: 93,
        English: 86,
        'Social Science': 88,
        Tamil: 87
      }
    },
    {
      id: '7',
      name: 'Meenakshi Sundaram',
      rollNumber: '11-002',
      avatar: '👩‍🎓',
      attendance: 90,
      avgScore: 85,
      assignmentsSubmitted: 12,
      totalAssignments: 13,
      performance: 'good',
      parentName: 'Sundaram Pillai',
      parentContact: '+91 98765-43215',
      parentEmail: 'sundaram.pillai@email.com',
      dateOfBirth: 'May 17, 2007',
      enrollmentDate: 'Jun 1, 2021',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 87,
        Science: 86,
        English: 88,
        'Social Science': 82,
        Tamil: 82
      }
    },
    {
      id: '8',
      name: 'Lakshmi Devi',
      rollNumber: '10A-004',
      avatar: '👩‍🎓',
      attendance: 76,
      avgScore: 65,
      assignmentsSubmitted: 11,
      totalAssignments: 15,
      performance: 'needs-attention',
      parentName: 'Devi Karuppiah',
      parentContact: '+91 98765-43219',
      parentEmail: 'devi.karuppiah@email.com',
      dateOfBirth: 'Aug 5, 2008',
      enrollmentDate: 'Jun 1, 2022',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 58,
        Science: 62,
        English: 72,
        'Social Science': 65,
        Tamil: 68
      }
    },
    {
      id: '9',
      name: 'Murugan Selvam',
      rollNumber: '10B-003',
      avatar: '👨‍🎓',
      attendance: 85,
      avgScore: 75,
      assignmentsSubmitted: 12,
      totalAssignments: 15,
      performance: 'good',
      parentName: 'Selvam Ramasamy',
      parentContact: '+91 98765-43220',
      parentEmail: 'selvam.ramasamy@email.com',
      dateOfBirth: 'Apr 20, 2008',
      enrollmentDate: 'Jun 1, 2022',
      lastUpdated: 'Mar 20, 2024',
      subjectScores: {
        Mathematics: 78,
        Science: 76,
        English: 72,
        'Social Science': 74,
        Tamil: 75
      }
    }
  ];

  // Filter students by selected class
  const classStudents = selectedClass
    ? allStudents.filter(student => student.rollNumber.startsWith(selectedClass.id))
    : [];

  // Get top 3 students
  const topStudents = [...classStudents]
    .sort((a, b) => b.avgScore - a.avgScore)
    .slice(0, 3);

  // Get at-risk students
  const atRiskStudents = classStudents.filter(s => s.performance === 'needs-attention');

  const handleViewPerformance = (student: Student) => {
    setSelectedStudent(student);
    setViewMode('performance');
  };

  const handleBackToStudents = () => {
    setViewMode('students');
    setSelectedStudent(null);
  };

  const handleBackToClasses = () => {
    setViewMode('classes');
    setSelectedClass(null);
  };

  const handleSelectClass = (classData: TeacherClass) => {
    setSelectedClass(classData);
    setViewMode('students');
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent':
        return '#10b981';
      case 'good':
        return '#3b82f6';
      case 'needs-attention':
        return '#ef4444';
      default:
        return '#718096';
    }
  };

  // If viewing student performance
  if (viewMode === 'performance' && selectedStudent) {
    return <StudentPerformance student={selectedStudent} onBack={handleBackToStudents} />;
  }

  // If viewing students list
  if (viewMode === 'students' && selectedClass) {
    return (
      <>
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content-wrapper">
            <div className="hero-text">
              <button
                onClick={handleBackToClasses}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid rgba(255, 255, 255, 0.4)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginBottom: '1rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <i className="fas fa-arrow-left"></i> Back to Classes
              </button>
              <h1>
                <i className="fas fa-users" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
                {selectedClass.name}
              </h1>
              <p>{selectedClass.subjects.join(', ')} • {selectedClass.schedule}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-user-graduate"></i>
              </div>
              <div className="stat-info">
                <h4>Total Students</h4>
                <p className="stat-value">
                  {classStudents.length} <span className="stat-total">students</span>
                </p>
                <div className="stat-progress">
                  <div className="stat-progress-fill" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="stat-info">
                <h4>Class Average</h4>
                <p className="stat-value">
                  {selectedClass.avgScore}% <span className="stat-total">score</span>
                </p>
                <div className="stat-progress">
                  <div className="stat-progress-fill" style={{ width: `${selectedClass.avgScore}%` }}></div>
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
                  {selectedClass.avgAttendance}% <span className="stat-total">overall</span>
                </p>
                <div className="stat-progress">
                  <div className="stat-progress-fill" style={{ width: `${selectedClass.avgAttendance}%` }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderLeft: '4px solid #10b981'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
              Top Performers
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.5rem' }}>
              {selectedClass.excellentPerformers}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#10b981' }}>
              <i className="fas fa-arrow-up"></i> Excellent performance
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderLeft: '4px solid #3b82f6'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
              Average Attendance
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.5rem' }}>
              {selectedClass.avgAttendance}%
            </div>
            <div style={{ fontSize: '0.875rem', color: '#3b82f6' }}>
              <i className="fas fa-check"></i> Good attendance rate
            </div>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            borderLeft: '4px solid #ef4444'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
              Need Attention
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c', marginBottom: '0.5rem' }}>
              {selectedClass.needsAttention}
            </div>
            <div style={{ fontSize: '0.875rem', color: '#ef4444' }}>
              <i className="fas fa-exclamation-circle"></i> Requires intervention
            </div>
          </div>
        </div>

        {/* Subject Performance Heatmap */}
        <SubjectHeatmap
          classId={selectedClass.id}
          className={selectedClass.name}
          students={classStudents.map(student => ({
            studentId: student.id,
            studentName: student.name,
            scores: student.subjectScores
          }))}
        />

        {/* Professional Students Table */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '1.5rem 2rem',
            borderBottom: '1px solid #e2e8f0'
          }}>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, color: '#1a202c' }}>
              Students List
            </h2>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Student
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'left', fontWeight: 600, fontSize: '0.875rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Roll Number
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Attendance
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Avg Score
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Assignments
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Performance
                  </th>
                  <th style={{ padding: '1rem 1.5rem', textAlign: 'center', fontWeight: 600, fontSize: '0.875rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: index % 2 === 0 ? 'white' : '#fafbfc',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f7fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc';
                    }}
                  >
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          background: '#f7fafc',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem'
                        }}>
                          {student.avatar}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#1a202c', fontSize: '0.9375rem' }}>
                            {student.name}
                          </div>
                          <div style={{ fontSize: '0.8125rem', color: '#718096' }}>
                            {student.parentName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#4a5568', fontSize: '0.9375rem', fontWeight: 500 }}>
                      {student.rollNumber}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: student.attendance >= 90 ? '#d1fae5' : student.attendance >= 75 ? '#fef3c7' : '#fee2e2',
                        color: student.attendance >= 90 ? '#065f46' : student.attendance >= 75 ? '#92400e' : '#991b1b'
                      }}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        background: student.avgScore >= 85 ? '#d1fae5' : student.avgScore >= 70 ? '#dbeafe' : '#fee2e2',
                        color: student.avgScore >= 85 ? '#065f46' : student.avgScore >= 70 ? '#1e40af' : '#991b1b'
                      }}>
                        {student.avgScore}%
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#4a5568', fontSize: '0.9375rem', fontWeight: 600 }}>
                      {student.assignmentsSubmitted}/{student.totalAssignments}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '6px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        background: `${getPerformanceColor(student.performance)}15`,
                        color: getPerformanceColor(student.performance)
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: getPerformanceColor(student.performance)
                        }}></div>
                        {student.performance === 'excellent' ? 'Excellent' : student.performance === 'good' ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button
                        onClick={() => handleViewPerformance(student)}
                        style={{
                          padding: '0.5rem 1.25rem',
                          background: '#1a202c',
                          border: 'none',
                          borderRadius: '6px',
                          color: 'white',
                          fontSize: '0.875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2d3748';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#1a202c';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <i className="fas fa-eye"></i> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div style={{
            padding: '1rem 1.5rem',
            background: '#f7fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ fontSize: '0.875rem', color: '#718096' }}>
              Showing <strong style={{ color: '#1a202c' }}>{classStudents.length}</strong> students
            </div>
          </div>
        </div>
      </>
    );
  }

  // Default: Classes View
  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-chalkboard-teacher" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              My Classes
            </h1>
            <p>Select a class to view and manage students</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-school"></i>
            </div>
            <div className="stat-info">
              <h4>Total Classes</h4>
              <p className="stat-value">
                {teacherClasses.length} <span className="stat-total">classes</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-info">
              <h4>Total Students</h4>
              <p className="stat-value">
                {teacherClasses.reduce((sum, c) => sum + c.totalStudents, 0)} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-info">
              <h4>Excellent Performers</h4>
              <p className="stat-value">
                {teacherClasses.reduce((sum, c) => sum + c.excellentPerformers, 0)} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Classes Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '1.5rem'
      }}>
        {teacherClasses.map((classData) => (
          <div
            key={classData.id}
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '2rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
              border: '2px solid #e2e8f0',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onClick={() => handleSelectClass(classData)}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#cbd5e0';
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.12)';
              e.currentTarget.style.transform = 'translateY(-4px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Class Header */}
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700 }}>
                {classData.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                {classData.subjects.map((subject, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.375rem 0.875rem',
                      borderRadius: '6px',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      background: '#f7fafc',
                      color: '#4a5568',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    {subject}
                  </span>
                ))}
              </div>
              <div style={{ fontSize: '0.875rem', color: '#718096', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <i className="fas fa-clock"></i>
                {classData.schedule}
              </div>
            </div>

            {/* Class Stats Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.375rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Students
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>
                  {classData.totalStudents}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.375rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Avg Score
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>
                  {classData.avgScore}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.375rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Attendance
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>
                  {classData.avgAttendance}%
                </div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: '#718096', marginBottom: '0.375rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  At Risk
                </div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: classData.needsAttention > 0 ? '#ef4444' : '#10b981' }}>
                  {classData.needsAttention}
                </div>
              </div>
            </div>

            {/* Performance Bar */}
            <div style={{
              padding: '1rem',
              background: '#f7fafc',
              borderRadius: '8px',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.8125rem' }}>
                <span style={{ color: '#10b981', fontWeight: 600 }}>
                  <i className="fas fa-star"></i> Excellent: {classData.excellentPerformers}
                </span>
                <span style={{ color: '#ef4444', fontWeight: 600 }}>
                  <i className="fas fa-exclamation-circle"></i> Need Attention: {classData.needsAttention}
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(classData.excellentPerformers / classData.totalStudents) * 100}%`,
                  height: '100%',
                  background: '#10b981'
                }}></div>
              </div>
            </div>

            {/* View Button */}
            <button
              style={{
                width: '100%',
                padding: '0.875rem',
                background: '#1a202c',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontSize: '0.9375rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'background 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2d3748';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#1a202c';
              }}
            >
              <i className="fas fa-users"></i>
              View Students
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Students;
