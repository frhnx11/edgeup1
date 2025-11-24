import { useState } from 'react';
import './SelfServicePortal.css';

interface SelfServicePortalProps {
  onBack: () => void;
}

const SelfServicePortal: React.FC<SelfServicePortalProps> = ({ onBack }) => {
  const [selectedView, setSelectedView] = useState<string>('dashboard');

  // Mock data
  const attendanceData = {
    overall: 87,
    subjects: [
      { name: 'Data Structures', attended: 42, total: 48, percentage: 87.5 },
      { name: 'Operating Systems', attended: 39, total: 45, percentage: 86.7 },
      { name: 'Database Management', attended: 44, total: 50, percentage: 88 },
      { name: 'Computer Networks', attended: 38, total: 42, percentage: 90.5 }
    ]
  };

  const gradesData = {
    cgpa: 8.5,
    sgpa: 8.7,
    recentResults: [
      { subject: 'Data Structures', marks: 85, grade: 'A', credits: 4 },
      { subject: 'Operating Systems', marks: 88, grade: 'A+', credits: 4 },
      { subject: 'Database Management', marks: 82, grade: 'A', credits: 3 },
      { subject: 'Computer Networks', marks: 90, grade: 'A+', credits: 3 }
    ]
  };

  const timetableData = [
    { day: 'Monday', slots: [
      { time: '9:00 AM', subject: 'Data Structures', room: 'Lab 201', faculty: 'Dr. Sharma' },
      { time: '11:00 AM', subject: 'Operating Systems', room: 'Room 305', faculty: 'Prof. Kumar' },
      { time: '2:00 PM', subject: 'Database Management', room: 'Lab 102', faculty: 'Dr. Patel' }
    ]},
    { day: 'Tuesday', slots: [
      { time: '10:00 AM', subject: 'Computer Networks', room: 'Room 401', faculty: 'Prof. Singh' },
      { time: '1:00 PM', subject: 'Data Structures Lab', room: 'Lab 201', faculty: 'Dr. Sharma' }
    ]},
    { day: 'Wednesday', slots: [
      { time: '9:00 AM', subject: 'Database Management', room: 'Room 305', faculty: 'Dr. Patel' },
      { time: '11:00 AM', subject: 'Operating Systems Lab', room: 'Lab 301', faculty: 'Prof. Kumar' }
    ]}
  ];

  const assignmentsData = [
    { id: 1, title: 'Binary Search Tree Implementation', subject: 'Data Structures', dueDate: '2025-01-25', status: 'pending', marks: null },
    { id: 2, title: 'Process Scheduling Algorithm', subject: 'Operating Systems', dueDate: '2025-01-20', status: 'submitted', marks: 'Pending' },
    { id: 3, title: 'Database Normalization Project', subject: 'Database Management', dueDate: '2025-01-15', status: 'graded', marks: 18 },
    { id: 4, title: 'Network Protocol Analysis', subject: 'Computer Networks', dueDate: '2025-01-30', status: 'pending', marks: null }
  ];

  const announcements = [
    { id: 1, title: 'Mid-term Exam Schedule Released', category: 'Exams', date: '2 hours ago', important: true },
    { id: 2, title: 'Guest Lecture on Cloud Computing', category: 'Events', date: '5 hours ago', important: false },
    { id: 3, title: 'Library Holiday Notice', category: 'General', date: '1 day ago', important: false },
    { id: 4, title: 'Fee Payment Deadline Extended', category: 'Important', date: '2 days ago', important: true }
  ];

  const getAttendanceStatus = (percentage: number) => {
    if (percentage >= 85) return 'attendance-good';
    if (percentage >= 75) return 'attendance-warning';
    return 'attendance-danger';
  };

  const getAssignmentStatus = (status: string) => {
    const badges: Record<string, string> = {
      'pending': 'assignment-pending',
      'submitted': 'assignment-submitted',
      'graded': 'assignment-graded'
    };
    return badges[status] || 'assignment-pending';
  };

  return (
    <div className="self-service-container">
      <div className="ssp-header">
        <button className="ssp-back-btn" onClick={onBack}>
          <i className="fas fa-arrow-left"></i>
          <span>Back to Academic Assistant</span>
        </button>
        <h1><i className="fas fa-tachometer-alt"></i> Self-Service Portal</h1>
        <p>One-stop dashboard for all your academic information</p>
      </div>

      <div className="ssp-nav">
        <button
          className={`ssp-nav-btn ${selectedView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setSelectedView('dashboard')}
        >
          <i className="fas fa-th-large"></i>
          <span>Dashboard</span>
        </button>
        <button
          className={`ssp-nav-btn ${selectedView === 'attendance' ? 'active' : ''}`}
          onClick={() => setSelectedView('attendance')}
        >
          <i className="fas fa-calendar-check"></i>
          <span>Attendance</span>
        </button>
        <button
          className={`ssp-nav-btn ${selectedView === 'grades' ? 'active' : ''}`}
          onClick={() => setSelectedView('grades')}
        >
          <i className="fas fa-award"></i>
          <span>Grades</span>
        </button>
        <button
          className={`ssp-nav-btn ${selectedView === 'timetable' ? 'active' : ''}`}
          onClick={() => setSelectedView('timetable')}
        >
          <i className="fas fa-clock"></i>
          <span>Timetable</span>
        </button>
        <button
          className={`ssp-nav-btn ${selectedView === 'assignments' ? 'active' : ''}`}
          onClick={() => setSelectedView('assignments')}
        >
          <i className="fas fa-tasks"></i>
          <span>Assignments</span>
        </button>
        <button
          className={`ssp-nav-btn ${selectedView === 'announcements' ? 'active' : ''}`}
          onClick={() => setSelectedView('announcements')}
        >
          <i className="fas fa-bullhorn"></i>
          <span>Announcements</span>
        </button>
      </div>

      <div className="ssp-content">
        {/* Dashboard View */}
        {selectedView === 'dashboard' && (
          <div className="dashboard-view">
            <div className="ssp-quick-stats">
              <div className="quick-stat-card attendance-card">
                <div className="stat-icon">
                  <i className="fas fa-calendar-check"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{attendanceData.overall}%</span>
                  <span className="stat-label">Overall Attendance</span>
                </div>
              </div>
              <div className="quick-stat-card grades-card">
                <div className="stat-icon">
                  <i className="fas fa-award"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{gradesData.cgpa}</span>
                  <span className="stat-label">Current CGPA</span>
                </div>
              </div>
              <div className="quick-stat-card assignments-card">
                <div className="stat-icon">
                  <i className="fas fa-tasks"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{assignmentsData.filter(a => a.status === 'pending').length}</span>
                  <span className="stat-label">Pending Assignments</span>
                </div>
              </div>
              <div className="quick-stat-card announcements-card">
                <div className="stat-icon">
                  <i className="fas fa-bullhorn"></i>
                </div>
                <div className="stat-content">
                  <span className="stat-value">{announcements.filter(a => a.important).length}</span>
                  <span className="stat-label">Important Notices</span>
                </div>
              </div>
            </div>

            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="fas fa-calendar-check"></i> Today's Attendance</h3>
                  <button className="ssp-btn-text" onClick={() => setSelectedView('attendance')}>View All</button>
                </div>
                <div className="attendance-preview">
                  {attendanceData.subjects.slice(0, 3).map((subject, index) => (
                    <div key={index} className="attendance-preview-item">
                      <div className="attendance-preview-info">
                        <span className="subject-name">{subject.name}</span>
                        <span className="attendance-count">{subject.attended}/{subject.total}</span>
                      </div>
                      <div className="attendance-preview-bar">
                        <div
                          className={`attendance-fill ${getAttendanceStatus(subject.percentage)}`}
                          style={{ width: `${subject.percentage}%` }}
                        >
                          <span>{subject.percentage}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="fas fa-tasks"></i> Upcoming Assignments</h3>
                  <button className="ssp-btn-text" onClick={() => setSelectedView('assignments')}>View All</button>
                </div>
                <div className="assignments-preview">
                  {assignmentsData.filter(a => a.status === 'pending').slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="assignment-preview-item">
                      <div className="assignment-preview-content">
                        <h4>{assignment.title}</h4>
                        <p>{assignment.subject}</p>
                      </div>
                      <div className="assignment-preview-date">
                        <i className="fas fa-calendar"></i>
                        <span>{assignment.dueDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="dashboard-card">
                <div className="card-header">
                  <h3><i className="fas fa-bullhorn"></i> Recent Announcements</h3>
                  <button className="ssp-btn-text" onClick={() => setSelectedView('announcements')}>View All</button>
                </div>
                <div className="announcements-preview">
                  {announcements.slice(0, 3).map((announcement) => (
                    <div key={announcement.id} className="announcement-preview-item">
                      {announcement.important && <div className="important-badge">Important</div>}
                      <h4>{announcement.title}</h4>
                      <div className="announcement-preview-meta">
                        <span className="category-badge">{announcement.category}</span>
                        <span className="time">{announcement.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Attendance View */}
        {selectedView === 'attendance' && (
          <div className="attendance-view">
            <div className="ssp-section-header">
              <h2><i className="fas fa-calendar-check"></i> Attendance Tracking</h2>
              <div className="attendance-overall">
                <span className="overall-label">Overall Attendance:</span>
                <span className={`overall-value ${getAttendanceStatus(attendanceData.overall)}`}>
                  {attendanceData.overall}%
                </span>
              </div>
            </div>

            <div className="attendance-grid">
              {attendanceData.subjects.map((subject, index) => (
                <div key={index} className="attendance-card">
                  <h3>{subject.name}</h3>
                  <div className="attendance-stats">
                    <div className="attendance-numbers">
                      <span className="attended">{subject.attended}</span>
                      <span className="separator">/</span>
                      <span className="total">{subject.total}</span>
                    </div>
                    <span className={`attendance-percentage ${getAttendanceStatus(subject.percentage)}`}>
                      {subject.percentage}%
                    </span>
                  </div>
                  <div className="attendance-bar">
                    <div
                      className={`attendance-fill ${getAttendanceStatus(subject.percentage)}`}
                      style={{ width: `${subject.percentage}%` }}
                    ></div>
                  </div>
                  <div className="attendance-actions">
                    <button className="ssp-btn-secondary"><i className="fas fa-history"></i> View History</button>
                    <button className="ssp-btn-primary"><i className="fas fa-download"></i> Download Report</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Grades View */}
        {selectedView === 'grades' && (
          <div className="grades-view">
            <div className="ssp-section-header">
              <h2><i className="fas fa-award"></i> Grades & Results</h2>
              <div className="gpa-stats">
                <div className="gpa-item">
                  <span className="gpa-label">CGPA:</span>
                  <span className="gpa-value">{gradesData.cgpa}</span>
                </div>
                <div className="gpa-item">
                  <span className="gpa-label">SGPA:</span>
                  <span className="gpa-value">{gradesData.sgpa}</span>
                </div>
              </div>
            </div>

            <div className="grades-table">
              <table>
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                    <th>Grade</th>
                    <th>Credits</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gradesData.recentResults.map((result, index) => (
                    <tr key={index}>
                      <td>{result.subject}</td>
                      <td><span className="marks-badge">{result.marks}/100</span></td>
                      <td><span className={`grade-badge grade-${result.grade.replace('+', 'plus')}`}>{result.grade}</span></td>
                      <td>{result.credits}</td>
                      <td>
                        <button className="ssp-btn-icon"><i className="fas fa-eye"></i></button>
                        <button className="ssp-btn-icon"><i className="fas fa-download"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="grades-actions-bar">
              <button className="ssp-btn-primary"><i className="fas fa-download"></i> Download Marksheet</button>
              <button className="ssp-btn-secondary"><i className="fas fa-chart-line"></i> View Analytics</button>
            </div>
          </div>
        )}

        {/* Timetable View */}
        {selectedView === 'timetable' && (
          <div className="timetable-view">
            <div className="ssp-section-header">
              <h2><i className="fas fa-clock"></i> Interactive Timetable</h2>
              <button className="ssp-btn-primary"><i className="fas fa-download"></i> Download Timetable</button>
            </div>

            <div className="timetable-container">
              {timetableData.map((day, index) => (
                <div key={index} className="timetable-day">
                  <h3 className="day-header">{day.day}</h3>
                  <div className="day-slots">
                    {day.slots.map((slot, slotIndex) => (
                      <div key={slotIndex} className="time-slot">
                        <div className="slot-time">{slot.time}</div>
                        <div className="slot-details">
                          <h4>{slot.subject}</h4>
                          <p><i className="fas fa-door-open"></i> {slot.room}</p>
                          <p><i className="fas fa-user"></i> {slot.faculty}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignments View */}
        {selectedView === 'assignments' && (
          <div className="assignments-view">
            <div className="ssp-section-header">
              <h2><i className="fas fa-tasks"></i> Assignments & Submissions</h2>
              <div className="assignment-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Pending</button>
                <button className="filter-btn">Submitted</button>
                <button className="filter-btn">Graded</button>
              </div>
            </div>

            <div className="assignments-grid">
              {assignmentsData.map((assignment) => (
                <div key={assignment.id} className={`assignment-card ${getAssignmentStatus(assignment.status)}`}>
                  <div className="assignment-card-header">
                    <h3>{assignment.title}</h3>
                    <span className={`assignment-status-badge ${getAssignmentStatus(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="assignment-subject">{assignment.subject}</p>
                  <div className="assignment-card-meta">
                    <div className="meta-item">
                      <i className="fas fa-calendar"></i>
                      <span>Due: {assignment.dueDate}</span>
                    </div>
                    {assignment.marks !== null && (
                      <div className="meta-item">
                        <i className="fas fa-check-circle"></i>
                        <span>Marks: {assignment.marks}/20</span>
                      </div>
                    )}
                  </div>
                  <div className="assignment-card-actions">
                    {assignment.status === 'pending' && (
                      <button className="ssp-btn-primary"><i className="fas fa-upload"></i> Submit</button>
                    )}
                    {assignment.status === 'submitted' && (
                      <button className="ssp-btn-secondary"><i className="fas fa-eye"></i> View Submission</button>
                    )}
                    {assignment.status === 'graded' && (
                      <button className="ssp-btn-secondary"><i className="fas fa-download"></i> Download Feedback</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Announcements View */}
        {selectedView === 'announcements' && (
          <div className="announcements-view">
            <div className="ssp-section-header">
              <h2><i className="fas fa-bullhorn"></i> Announcements & Notifications</h2>
              <div className="announcement-filters">
                <button className="filter-btn active">All</button>
                <button className="filter-btn">Important</button>
                <button className="filter-btn">Exams</button>
                <button className="filter-btn">Events</button>
              </div>
            </div>

            <div className="announcements-list">
              {announcements.map((announcement) => (
                <div key={announcement.id} className={`announcement-card ${announcement.important ? 'important' : ''}`}>
                  {announcement.important && <div className="important-marker"></div>}
                  <div className="announcement-content">
                    <h3>{announcement.title}</h3>
                    <div className="announcement-meta">
                      <span className="category-badge">{announcement.category}</span>
                      <span className="announcement-time">
                        <i className="fas fa-clock"></i> {announcement.date}
                      </span>
                    </div>
                  </div>
                  <button className="ssp-btn-icon"><i className="fas fa-chevron-right"></i></button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelfServicePortal;
