import { useState } from 'react';

interface StudentProfileData {
  id: string;
  name: string;
  rollNumber: string;
  class: string;
  grade: string;
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
}

interface SubjectScore {
  subject: string;
  score: number;
  grade: string;
  trend: 'up' | 'down' | 'stable';
}

interface AttendanceRecord {
  month: string;
  present: number;
  absent: number;
  percentage: number;
}

interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  submittedDate: string;
  score: number;
  maxScore: number;
  status: 'submitted' | 'pending' | 'late';
}

interface StudentProfileProps {
  student: StudentProfileData;
  onBack: () => void;
}

const StudentProfile = ({ student, onBack }: StudentProfileProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'assignments' | 'performance'>('overview');

  // Mock data for detailed view
  const subjectScores: SubjectScore[] = [
    { subject: 'Mathematics', score: 92, grade: 'A', trend: 'up' },
    { subject: 'Physics', score: 88, grade: 'A', trend: 'stable' },
    { subject: 'Chemistry', score: 85, grade: 'B+', trend: 'up' },
    { subject: 'English', score: 90, grade: 'A', trend: 'down' },
    { subject: 'History', score: 87, grade: 'B+', trend: 'stable' }
  ];

  const attendanceRecords: AttendanceRecord[] = [
    { month: 'January', present: 22, absent: 1, percentage: 96 },
    { month: 'February', present: 20, absent: 2, percentage: 91 },
    { month: 'March', present: 23, absent: 0, percentage: 100 },
    { month: 'April', present: 21, absent: 2, percentage: 91 },
    { month: 'May', present: 22, absent: 1, percentage: 96 }
  ];

  const assignments: Assignment[] = [
    { id: '1', title: 'Calculus Problem Set', dueDate: '2024-03-15', submittedDate: '2024-03-14', score: 95, maxScore: 100, status: 'submitted' },
    { id: '2', title: 'Physics Lab Report', dueDate: '2024-03-18', submittedDate: '2024-03-18', score: 88, maxScore: 100, status: 'submitted' },
    { id: '3', title: 'Chemistry Assignment', dueDate: '2024-03-20', submittedDate: '', score: 0, maxScore: 100, status: 'pending' },
    { id: '4', title: 'English Essay', dueDate: '2024-03-12', submittedDate: '2024-03-13', score: 92, maxScore: 100, status: 'late' }
  ];

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'late':
        return '#ef4444';
      default:
        return '#718096';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <i className="fas fa-arrow-up" style={{ color: '#10b981' }}></i>;
      case 'down':
        return <i className="fas fa-arrow-down" style={{ color: '#ef4444' }}></i>;
      case 'stable':
        return <i className="fas fa-minus" style={{ color: '#718096' }}></i>;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Back Button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            color: '#2d3748',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Students
        </button>
      </div>

      {/* Profile Header */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '5rem' }}>{student.avatar}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <h1 style={{ margin: 0, color: '#2d3748', fontSize: '2rem' }}>{student.name}</h1>
                <p style={{ margin: '0.5rem 0', color: '#718096', fontSize: '1rem' }}>
                  Roll No: {student.rollNumber} • {student.class}
                </p>
                <span
                  style={{
                    display: 'inline-block',
                    marginTop: '0.5rem',
                    padding: '0.375rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    background: `${getPerformanceColor(student.performance)}20`,
                    color: getPerformanceColor(student.performance)
                  }}
                >
                  {student.performance === 'excellent' ? 'Excellent Performer' : student.performance === 'good' ? 'Good Performance' : 'Needs Attention'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="sign-in-btn" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                  <i className="fas fa-envelope"></i> Message
                </button>
                <button className="sign-in-btn" style={{ fontSize: '0.9rem', padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <i className="fas fa-phone"></i> Contact Parent
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '1.5rem' }}>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Attendance</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#667eea' }}>{student.attendance}%</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Avg Score</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#10b981' }}>{student.avgScore}%</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Assignments</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f59e0b' }}>{student.assignmentsSubmitted}/{student.totalAssignments}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '1rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.5rem' }}>Class Rank</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#8b5cf6' }}>3rd</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0' }}>
          {[
            { id: 'overview', label: 'Overview', icon: 'fa-chart-pie' },
            { id: 'performance', label: 'Performance', icon: 'fa-chart-line' },
            { id: 'attendance', label: 'Attendance', icon: 'fa-calendar-check' },
            { id: 'assignments', label: 'Assignments', icon: 'fa-clipboard-check' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                flex: 1,
                padding: '1rem',
                background: activeTab === tab.id ? '#f7fafc' : 'white',
                border: 'none',
                borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent',
                color: activeTab === tab.id ? '#667eea' : '#718096',
                fontSize: '0.9rem',
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <i className={`fas ${tab.icon}`}></i> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Student Information */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-user"></i> Student Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Date of Birth</span>
                <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{student.dateOfBirth}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Enrollment Date</span>
                <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{student.enrollmentDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Class</span>
                <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{student.class}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Last Updated</span>
                <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{student.lastUpdated}</span>
              </div>
            </div>
          </div>

          {/* Parent Information */}
          <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <i className="fas fa-user-friends"></i> Parent Information
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Name</span>
                <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{student.parentName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Phone</span>
                <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{student.parentContact}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: '#f7fafc', borderRadius: '6px' }}>
                <span style={{ color: '#718096', fontSize: '0.9rem' }}>Email</span>
                <span style={{ color: '#2d3748', fontWeight: 600, fontSize: '0.9rem' }}>{student.parentEmail}</span>
              </div>
              <button className="sign-in-btn" style={{ marginTop: '0.5rem', width: '100%' }}>
                <i className="fas fa-paper-plane"></i> Send Message to Parent
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-chart-line"></i> Subject-wise Performance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {subjectScores.map((subject, index) => (
              <div key={index} style={{ padding: '1.5rem', background: '#f7fafc', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontWeight: 600, color: '#2d3748', fontSize: '1rem' }}>{subject.subject}</span>
                    <span style={{ padding: '0.25rem 0.75rem', background: '#667eea', color: 'white', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>
                      {subject.grade}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {getTrendIcon(subject.trend)}
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#667eea' }}>{subject.score}%</span>
                  </div>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${subject.score}%`,
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      transition: 'width 0.3s ease'
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-calendar-check"></i> Monthly Attendance Record
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: '#2d3748' }}>Month</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#2d3748' }}>Present</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#2d3748' }}>Absent</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#2d3748' }}>Percentage</th>
                  <th style={{ padding: '1rem', textAlign: 'center', fontWeight: 600, color: '#2d3748' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceRecords.map((record, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '1rem', color: '#2d3748', fontWeight: 500 }}>{record.month}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#10b981', fontWeight: 600 }}>{record.present}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', color: '#ef4444', fontWeight: 600 }}>{record.absent}</td>
                    <td style={{ padding: '1rem', textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: '#667eea' }}>{record.percentage}%</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <span
                        style={{
                          padding: '0.375rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          background: record.percentage >= 90 ? '#d1fae5' : record.percentage >= 75 ? '#dbeafe' : '#fee2e2',
                          color: record.percentage >= 90 ? '#065f46' : record.percentage >= 75 ? '#1e40af' : '#991b1b'
                        }}
                      >
                        {record.percentage >= 90 ? 'Excellent' : record.percentage >= 75 ? 'Good' : 'Poor'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem' }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-clipboard-check"></i> Assignment History
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {assignments.map((assignment) => (
              <div key={assignment.id} style={{ padding: '1.5rem', background: '#f7fafc', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#2d3748', fontSize: '1rem' }}>{assignment.title}</h4>
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: `${getStatusColor(assignment.status)}20`,
                        color: getStatusColor(assignment.status)
                      }}
                    >
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: '#718096' }}>
                    <span><i className="fas fa-calendar"></i> Due: {assignment.dueDate}</span>
                    {assignment.submittedDate && (
                      <span><i className="fas fa-check-circle"></i> Submitted: {assignment.submittedDate}</span>
                    )}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {assignment.status !== 'pending' ? (
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: assignment.score >= 85 ? '#10b981' : assignment.score >= 70 ? '#667eea' : '#ef4444' }}>
                        {assignment.score}/{assignment.maxScore}
                      </div>
                      <div style={{ fontSize: '0.875rem', color: '#718096' }}>
                        {Math.round((assignment.score / assignment.maxScore) * 100)}%
                      </div>
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.875rem', color: '#f59e0b', fontWeight: 600 }}>
                      <i className="fas fa-clock"></i> Pending
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default StudentProfile;
