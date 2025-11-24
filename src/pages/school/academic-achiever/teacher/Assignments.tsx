import { useState } from 'react';
import CreateAssignment from './CreateAssignment';
import type { Question, DeliveryMode } from '../../types/assignment.types';

interface Assignment {
  id: string;
  title: string;
  className: string;
  classGrade: string;
  subject?: string;
  dueDate: string;
  totalMarks: number;
  submitted: number;
  totalStudents: number;
  status: 'active' | 'upcoming' | 'closed' | 'draft';
  type: string;
  description: string;
  deliveryMode?: DeliveryMode;
  questions?: Question[];
  duration?: number;
}

const Assignments = () => {
  const [currentView, setCurrentView] = useState<'list' | 'viewGrade' | 'create'>('list');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([
    {
      id: '1',
      title: 'Calculus Integration Problems',
      className: 'Mathematics',
      classGrade: 'Grade 12',
      dueDate: '2025-01-25',
      totalMarks: 50,
      submitted: 28,
      totalStudents: 30,
      status: 'active',
      type: 'Homework',
      description: 'Complete problems 1-20 from Chapter 5'
    },
    {
      id: '2',
      title: 'Trigonometry Quiz',
      className: 'Mathematics',
      classGrade: 'Grade 10A',
      dueDate: '2025-01-22',
      totalMarks: 25,
      submitted: 32,
      totalStudents: 32,
      status: 'closed',
      type: 'Quiz',
      description: 'Online quiz on trigonometric identities'
    },
    {
      id: '3',
      title: 'Algebra Project - Real World Applications',
      className: 'Mathematics',
      classGrade: 'Grade 11',
      dueDate: '2025-01-30',
      totalMarks: 100,
      submitted: 0,
      totalStudents: 24,
      status: 'upcoming',
      type: 'Project',
      description: 'Create a presentation on real-world algebra applications'
    },
    {
      id: '4',
      title: 'Linear Equations Worksheet',
      className: 'Mathematics',
      classGrade: 'Grade 10B',
      dueDate: '2025-01-24',
      totalMarks: 30,
      submitted: 15,
      totalStudents: 28,
      status: 'active',
      type: 'Homework',
      description: 'Solve linear equations from textbook'
    },
    {
      id: '5',
      title: 'Statistics Data Analysis',
      className: 'Mathematics',
      classGrade: 'Grade 11',
      dueDate: '2025-02-05',
      totalMarks: 75,
      submitted: 0,
      totalStudents: 24,
      status: 'draft',
      type: 'Project',
      description: 'Collect and analyze real-world data'
    },
    {
      id: '6',
      title: 'Geometry Proofs Practice',
      className: 'Mathematics',
      classGrade: 'Grade 10A',
      dueDate: '2025-01-26',
      totalMarks: 40,
      submitted: 20,
      totalStudents: 32,
      status: 'active',
      type: 'Homework',
      description: 'Complete geometric proofs exercises'
    }
  ]);

  const [selectedClass, setSelectedClass] = useState('all');

  const classes = ['All Classes', 'Grade 10A', 'Grade 10B', 'Grade 11', 'Grade 12'];

  const filteredAssignments = selectedClass === 'all'
    ? assignments
    : assignments.filter(a => a.classGrade.toLowerCase() === selectedClass.toLowerCase());

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#10b981';
      case 'upcoming': return '#f59e0b';
      case 'closed': return '#6b7280';
      case 'draft': return '#8b5cf6';
      default: return '#667eea';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Active';
      case 'upcoming': return 'Upcoming';
      case 'closed': return 'Closed';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const activeCount = assignments.filter(a => a.status === 'active').length;
  const pendingSubmissions = assignments
    .filter(a => a.status === 'active')
    .reduce((sum, a) => sum + (a.totalStudents - a.submitted), 0);
  const pendingGrading = assignments
    .filter(a => a.status === 'active' || a.status === 'closed')
    .reduce((sum, a) => sum + a.submitted, 0);

  const handleSaveAssignment = (assignment: any) => {
    // Create new assignment object with proper structure
    const newAssignment: Assignment = {
      id: (assignments.length + 1).toString(),
      title: assignment.title,
      className: assignment.className || 'TN Board - 10th Std',
      classGrade: assignment.className || 'Grade 10',
      subject: assignment.subject || assignment.className,
      dueDate: assignment.dueDate,
      totalMarks: parseInt(assignment.totalMarks),
      submitted: 0,
      totalStudents: 30, // Default student count
      status: 'draft', // New assignments start as draft
      type: assignment.type,
      description: assignment.description,
      deliveryMode: assignment.deliveryMode || 'online',
      questions: assignment.questions,
      duration: assignment.duration ? parseInt(assignment.duration) : undefined
    };

    // Add to assignments list
    setAssignments([newAssignment, ...assignments]);
    console.log('New assignment created:', newAssignment);

    // Return to list view
    setCurrentView('list');
  };

  // Create Assignment Page
  if (currentView === 'create') {
    return (
      <CreateAssignment
        onBack={() => setCurrentView('list')}
        onSave={handleSaveAssignment}
      />
    );
  }

  // View & Grade Page
  if (currentView === 'viewGrade' && selectedAssignment) {
    // Mock student submissions data
    const studentSubmissions = [
      { id: 1, name: 'Aravind Kumar', submittedDate: '2025-01-20', status: 'submitted', score: '', feedback: '' },
      { id: 2, name: 'Priya Lakshmi', submittedDate: '2025-01-21', status: 'submitted', score: '', feedback: '' },
      { id: 3, name: 'Karthik Raj', submittedDate: '2025-01-22', status: 'submitted', score: '', feedback: '' },
      { id: 4, name: 'Divya Bharathi', submittedDate: '2025-01-19', status: 'graded', score: '45/50', feedback: 'Excellent work!' },
      { id: 5, name: 'Vishnu Prasad', submittedDate: '', status: 'pending', score: '', feedback: '' },
    ];

    return (
      <>
        {/* Back Button */}
        <button
          onClick={() => {
            setCurrentView('list');
            setSelectedAssignment(null);
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
          <span>Back</span>
        </button>

        {/* Assignment Details Card */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
                <i className="fas fa-file-alt" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
                {selectedAssignment.title}
              </h1>
              <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
                {selectedAssignment.className} • {selectedAssignment.classGrade}
              </p>
            </div>
            <span
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '12px',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: getStatusColor(selectedAssignment.status),
                color: 'white'
              }}
            >
              {getStatusLabel(selectedAssignment.status)}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', padding: '1.5rem', background: '#f7fafc', borderRadius: '12px', border: '2px solid #e2e8f0' }}>
            <div>
              <div style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem' }}></i>
                Due Date
              </div>
              <div style={{ color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>
                {new Date(selectedAssignment.dueDate).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <i className="fas fa-award" style={{ marginRight: '0.5rem' }}></i>
                Total Marks
              </div>
              <div style={{ color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>{selectedAssignment.totalMarks} points</div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <i className="fas fa-users" style={{ marginRight: '0.5rem' }}></i>
                Submissions
              </div>
              <div style={{ color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>
                {selectedAssignment.submitted} / {selectedAssignment.totalStudents}
              </div>
            </div>
            <div>
              <div style={{ color: '#718096', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                <i className="fas fa-tag" style={{ marginRight: '0.5rem' }}></i>
                Type
              </div>
              <div style={{ color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>{selectedAssignment.type}</div>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.75rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
              <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
              Description
            </h3>
            <p style={{ margin: 0, color: '#718096', lineHeight: 1.6 }}>{selectedAssignment.description}</p>
          </div>
        </div>

        {/* Student Submissions & Grading */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2rem'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-clipboard-list" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Student Submissions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {studentSubmissions.map((student) => (
              <div
                key={student.id}
                style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 600 }}>
                      <i className="fas fa-user" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                      {student.name}
                    </h3>
                    <div style={{ color: '#718096', fontSize: '0.9rem' }}>
                      {student.status === 'submitted' && (
                        <>
                          <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
                          Submitted on {new Date(student.submittedDate).toLocaleDateString()}
                        </>
                      )}
                      {student.status === 'graded' && (
                        <>
                          <i className="fas fa-check-circle" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                          Graded - Score: {student.score}
                        </>
                      )}
                      {student.status === 'pending' && (
                        <>
                          <i className="fas fa-hourglass-half" style={{ marginRight: '0.5rem', color: '#f59e0b' }}></i>
                          Not submitted yet
                        </>
                      )}
                    </div>
                  </div>
                  <span
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: student.status === 'graded' ? '#10ac8b' : student.status === 'submitted' ? '#3b82f6' : '#f59e0b',
                      color: 'white'
                    }}
                  >
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </span>
                </div>

                {student.status === 'submitted' && (
                  <div style={{ marginTop: '1rem', display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                        Score
                      </label>
                      <input
                        type="text"
                        placeholder={`/ ${selectedAssignment.totalMarks}`}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                        Feedback
                      </label>
                      <input
                        type="text"
                        placeholder="Enter feedback..."
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <button
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginTop: '1.5rem',
                        transition: 'all 0.3s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(9, 77, 136, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <i className="fas fa-check"></i> Submit Grade
                    </button>
                  </div>
                )}

                {student.status === 'graded' && (
                  <div style={{ marginTop: '1rem', padding: '1rem', background: 'white', borderRadius: '8px', border: '2px solid #d1fae5' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong style={{ color: '#2d3748' }}>Score: </strong>
                      <span style={{ color: '#10ac8b', fontWeight: 600 }}>{student.score}</span>
                    </div>
                    <div>
                      <strong style={{ color: '#2d3748' }}>Feedback: </strong>
                      <span style={{ color: '#718096' }}>{student.feedback}</span>
                    </div>
                  </div>
                )}
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
            <h1>Assignments 📝</h1>
            <p>Create, manage, and grade student assignments</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="stat-info">
              <h4>Active Assignments</h4>
              <p className="stat-value">
                {activeCount} <span className="stat-total">assignments</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Pending Submissions</h4>
              <p className="stat-value">
                {pendingSubmissions} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clipboard-check"></i>
            </div>
            <div className="stat-info">
              <h4>Pending Grading</h4>
              <p className="stat-value">
                {pendingGrading} <span className="stat-total">submissions</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Filters Section - Professional */}
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-filter"></i> Filter by Class
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
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
              {classes.map((cls) => (
                <option key={cls} value={cls === 'All Classes' ? 'all' : cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setSelectedClass('all')}
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
              <i className="fas fa-redo"></i> Reset Filter
            </button>
          </div>
        </div>
      </div>

      {/* Create Assignment Button Section */}
      <div style={{
        background: 'white',
        padding: '1.5rem',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        marginBottom: '2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: '0 0 0.25rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
              <i className="fas fa-plus-circle" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
              Create New Assignment
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Choose between manual creation or AI-powered generation
            </p>
          </div>
          <button
            onClick={() => setCurrentView('create')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s',
              boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(9, 77, 136, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
            }}
          >
            <i className="fas fa-plus"></i>
            Create Assignment
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-row">
        <div className="metric-card">
          <i className="fas fa-clipboard-list"></i>
          <div className="metric-info">
            <h2>{assignments.length}</h2>
            <p>Total Assignments</p>
          </div>
          <span className="metric-change positive">+3</span>
        </div>
        <div className="metric-card">
          <i className="fas fa-percentage"></i>
          <div className="metric-info">
            <h2>87%</h2>
            <p>Avg Submission Rate</p>
          </div>
          <span className="metric-change positive">+5%</span>
        </div>
        <div className="metric-card">
          <i className="fas fa-star"></i>
          <div className="metric-info">
            <h2>85%</h2>
            <p>Avg Score</p>
          </div>
          <span className="metric-change positive">+2%</span>
        </div>
        <div className="metric-card">
          <i className="fas fa-calendar-check"></i>
          <div className="metric-info">
            <h2>12</h2>
            <p>This Month</p>
          </div>
          <span className="metric-change positive">+4</span>
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="dashboard-grid">
        {filteredAssignments.map((assignment) => {
          const submissionRate = (assignment.submitted / assignment.totalStudents) * 100;

          return (
            <div className="dashboard-card" key={assignment.id}>
              <div className="card-header">
                <div className="card-title">
                  <i className="fas fa-file-alt"></i>
                  <div>
                    <h3>{assignment.title}</h3>
                    <p>{assignment.className} • {assignment.classGrade}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {assignment.deliveryMode && (
                    <span
                      style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        background: assignment.deliveryMode === 'online' ? '#dcfce7' : '#e0e7ff',
                        color: assignment.deliveryMode === 'online' ? '#15803d' : '#4338ca',
                        border: `2px solid ${assignment.deliveryMode === 'online' ? '#10ac8b' : '#667eea'}`
                      }}
                    >
                      <i className={`fas fa-${assignment.deliveryMode === 'online' ? 'laptop' : 'file-pdf'}`} style={{ marginRight: '0.25rem' }}></i>
                      {assignment.deliveryMode === 'online' ? 'Online' : 'PDF'}
                    </span>
                  )}
                  <span
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: getStatusColor(assignment.status),
                      color: 'white'
                    }}
                  >
                    {getStatusLabel(assignment.status)}
                  </span>
                </div>
              </div>
              <div className="card-content">
                <div className="schedule-item">
                  <div className="schedule-details" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                      <div>
                        <h4 style={{ margin: 0, color: '#2d3748' }}>
                          <i className="fas fa-calendar-alt"></i> Due Date
                        </h4>
                        <p style={{ margin: '0.25rem 0', color: '#667eea', fontWeight: 500 }}>
                          {new Date(assignment.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                      <div>
                        <h4 style={{ margin: 0, color: '#2d3748' }}>
                          <i className="fas fa-award"></i> Total Marks
                        </h4>
                        <p style={{ margin: '0.25rem 0', color: '#667eea', fontWeight: 500 }}>
                          {assignment.totalMarks} points
                        </p>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#2d3748' }}>
                        <i className="fas fa-users"></i> Submissions
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ color: '#718096', fontSize: '0.875rem' }}>
                          {assignment.submitted} / {assignment.totalStudents} submitted
                        </span>
                        <span style={{ color: '#667eea', fontWeight: 600, fontSize: '0.875rem' }}>
                          {Math.round(submissionRate)}%
                        </span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${submissionRate}%`,
                            height: '100%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            transition: 'width 0.3s ease'
                          }}
                        ></div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <button
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setCurrentView('viewGrade');
                        }}
                        className="sign-in-btn"
                        style={{ width: '100%', fontSize: '0.9rem', padding: '0.6rem' }}
                      >
                        <i className="fas fa-clipboard-check"></i> View & Grade
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Assignments;
