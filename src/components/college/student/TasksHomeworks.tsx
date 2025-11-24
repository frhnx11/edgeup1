import { useState, useEffect } from 'react';
import TakeAssignment from './TakeAssignment';
import type { Assignment, DeliveryMode, Question } from '../../types/assignment.types';
import { hasSubmitted } from '../../../services/submissionService';

interface Task {
  id: string;
  title: string;
  subject: string;
  type: 'homework' | 'assignment' | 'project' | 'reading';
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed' | 'overdue';
  description: string;
  points: number;
  submittedDate?: string;
  deliveryMode?: DeliveryMode;
  questions?: Question[];
  duration?: number;
}

const TasksHomeworks = () => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'overdue'>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [takingAssignment, setTakingAssignment] = useState<Assignment | null>(null);
  const studentId = 'student_1'; // In real app, get from auth context
  const [tasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Calculus Problem Set - Chapter 5',
      subject: 'Mathematics',
      type: 'homework',
      dueDate: '2024-12-25',
      priority: 'high',
      status: 'pending',
      description: 'Complete exercises 1-20 from chapter 5. Show all work and explanations.',
      points: 50
    },
    {
      id: '2',
      title: 'Physics Lab Report - Pendulum Experiment',
      subject: 'Physics',
      type: 'assignment',
      dueDate: '2024-12-28',
      priority: 'high',
      status: 'pending',
      description: 'Write a comprehensive lab report including hypothesis, methodology, results, and conclusion.',
      points: 100
    },
    {
      id: '3',
      title: 'Chemistry Research Project',
      subject: 'Chemistry',
      type: 'project',
      dueDate: '2025-01-05',
      priority: 'medium',
      status: 'pending',
      description: 'Research and present on organic chemistry applications in daily life.',
      points: 150
    },
    {
      id: '4',
      title: 'Read Chapter 8 - Photosynthesis',
      subject: 'Biology',
      type: 'reading',
      dueDate: '2024-12-23',
      priority: 'low',
      status: 'pending',
      description: 'Read and take notes on chapter 8. Be prepared for quiz next class.',
      points: 20
    },
    {
      id: '5',
      title: 'English Essay - Shakespeare Analysis',
      subject: 'English',
      type: 'assignment',
      dueDate: '2024-12-20',
      priority: 'high',
      status: 'overdue',
      description: 'Write a 1500-word analysis of themes in Hamlet.',
      points: 100
    },
    {
      id: '6',
      title: 'History Timeline Project',
      subject: 'History',
      type: 'project',
      dueDate: '2024-12-15',
      priority: 'medium',
      status: 'completed',
      description: 'Create an interactive timeline of World War II events.',
      points: 80,
      submittedDate: '2024-12-14'
    },
    {
      id: '7',
      title: 'Math Practice Problems',
      subject: 'Mathematics',
      type: 'homework',
      dueDate: '2024-12-10',
      priority: 'low',
      status: 'completed',
      description: 'Practice problems on quadratic equations.',
      points: 30,
      submittedDate: '2024-12-09'
    }
  ]);

  const getFilteredTasks = () => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => task.status === filter);
  };

  const filteredTasks = getFilteredTasks();
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const overdueCount = tasks.filter(t => t.status === 'overdue').length;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'homework': return 'fa-pencil-alt';
      case 'assignment': return 'fa-file-alt';
      case 'project': return 'fa-project-diagram';
      case 'reading': return 'fa-book-open';
      default: return 'fa-tasks';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'homework': return '#667eea';
      case 'assignment': return '#10ac8b';
      case 'project': return '#f59e0b';
      case 'reading': return '#06b6d4';
      default: return '#718096';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10ac8b';
      default: return '#718096';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'completed': return '#10ac8b';
      case 'overdue': return '#ef4444';
      default: return '#718096';
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const due = new Date(dueDate);
    const today = new Date();
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setSelectedFiles([...selectedFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  const handleOpenUploadModal = (task: Task) => {
    setSelectedTask(task);
    setSelectedFiles([]);
    setShowUploadModal(true);
  };

  const handleSubmitWork = () => {
    if (selectedFiles.length === 0) {
      alert('Please select at least one file to submit.');
      return;
    }
    // Here you would handle the actual file upload to your backend
    alert(`Successfully submitted ${selectedFiles.length} file(s) for "${selectedTask?.title}"`);
    setShowUploadModal(false);
    setSelectedFiles([]);
    setSelectedTask(null);
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'fa-file-pdf';
      case 'doc':
      case 'docx': return 'fa-file-word';
      case 'xls':
      case 'xlsx': return 'fa-file-excel';
      case 'ppt':
      case 'pptx': return 'fa-file-powerpoint';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'fa-file-image';
      case 'zip':
      case 'rar': return 'fa-file-archive';
      default: return 'fa-file';
    }
  };

  const getFileColor = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return '#ef4444';
      case 'doc':
      case 'docx': return '#2563eb';
      case 'xls':
      case 'xlsx': return '#10b981';
      case 'ppt':
      case 'pptx': return '#f59e0b';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return '#8b5cf6';
      default: return '#718096';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Show TakeAssignment view if an assignment is selected
  if (takingAssignment) {
    return (
      <TakeAssignment
        assignment={takingAssignment}
        onBack={() => setTakingAssignment(null)}
        studentId={studentId}
        studentName="Student"
      />
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-tasks" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Tasks & Homeworks
            </h1>
            <p>Manage and track all your assignments and submissions</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Total Tasks</p>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>
                {tasks.length}
              </h3>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Pending Tasks</h4>
              <p className="stat-value">
                {pendingCount} <span className="stat-total">active</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(pendingCount / tasks.length) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h4>Completed</h4>
              <p className="stat-value">
                {completedCount} <span className="stat-total">done</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(completedCount / tasks.length) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h4>Overdue</h4>
              <p className="stat-value">
                {overdueCount} <span className="stat-total">late</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(overdueCount / tasks.length) * 100}%`, background: '#ef4444' }}></div>
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
              <i className="fas fa-filter"></i> Filter by Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
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
              <option value="all">All Tasks ({tasks.length})</option>
              <option value="pending">Pending ({tasks.filter(t => t.status === 'pending').length})</option>
              <option value="completed">Completed ({tasks.filter(t => t.status === 'completed').length})</option>
              <option value="overdue">Overdue ({tasks.filter(t => t.status === 'overdue').length})</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => setFilter('all')}
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

        <div style={{ marginTop: '1rem', color: '#718096', fontSize: '0.875rem', fontWeight: 600 }}>
          Showing {filteredTasks.length} of {tasks.length} tasks
        </div>
      </div>

      {/* Tasks Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {filteredTasks.map((task) => {
          const daysRemaining = getDaysRemaining(task.dueDate);
          return (
            <div
              key={task.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'all 0.2s',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: getStatusColor(task.status),
                color: 'white',
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                zIndex: 10
              }}>
                {task.status}
              </div>

              {/* Card Header */}
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                paddingTop: '3rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: '#094d88',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className={`fas ${getTypeIcon(task.type)}`} style={{ color: 'white', fontSize: '1.125rem' }}></i>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: '#2d3748', fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {task.type}
                    </p>
                    <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                      {task.subject}
                    </p>
                  </div>
                </div>

                <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.4 }}>
                  {task.title}
                </h3>
              </div>

              {/* Card Body */}
              <div style={{ padding: '1.5rem' }}>
                <p style={{ margin: '0 0 1.25rem 0', color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {task.description}
                </p>

                {/* Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.25rem'
                }}>
                  <div style={{
                    background: '#f7fafc',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Due Date
                    </p>
                    <p style={{ margin: 0, fontSize: '0.875rem', color: '#2d3748', fontWeight: 600 }}>
                      {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                    {task.status === 'pending' && (
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: daysRemaining < 3 ? '#ef4444' : '#10ac8b', fontWeight: 600 }}>
                        {daysRemaining > 0 ? `${daysRemaining} days left` : daysRemaining === 0 ? 'Due today' : `${Math.abs(daysRemaining)} days overdue`}
                      </p>
                    )}
                    {task.status === 'completed' && task.submittedDate && (
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.75rem', color: '#10ac8b', fontWeight: 600 }}>
                        Submitted {new Date(task.submittedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    )}
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '0.875rem',
                    borderRadius: '10px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.7rem', color: '#718096', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Points
                    </p>
                    <p style={{ margin: 0, fontSize: '1.5rem', color: '#094d88', fontWeight: 700 }}>
                      {task.points}
                    </p>
                  </div>
                </div>

                {/* Priority Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div style={{
                    background: `${getPriorityColor(task.priority)}15`,
                    color: getPriorityColor(task.priority),
                    padding: '0.375rem 0.875rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem'
                  }}>
                    <i className="fas fa-flag"></i>
                    {task.priority} Priority
                  </div>
                </div>

                {/* Action Buttons */}
                {task.status === 'pending' && (
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    {task.deliveryMode === 'online' ? (
                      <button
                        onClick={() => {
                          const assignment: Assignment = {
                            id: task.id,
                            title: task.title,
                            subject: task.subject,
                            className: 'TN Board - 10th Std',
                            classGrade: 'Grade 10',
                            deliveryMode: 'online',
                            type: task.type as any,
                            dueDate: task.dueDate,
                            totalMarks: task.points,
                            duration: task.duration,
                            status: 'active',
                            description: task.description,
                            questions: task.questions,
                            createdBy: 'Teacher',
                            createdAt: new Date().toISOString(),
                            totalStudents: 30,
                            submitted: 0
                          };
                          setTakingAssignment(assignment);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.875rem',
                          background: hasSubmitted(task.id, studentId)
                            ? 'linear-gradient(90deg, #10ac8b 0%, #094d88 100%)'
                            : 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                          border: 'none',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
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
                        <i className={`fas fa-${hasSubmitted(task.id, studentId) ? 'eye' : 'laptop'}`}></i>
                        {hasSubmitted(task.id, studentId) ? 'View Results' : 'Take Assignment'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenUploadModal(task)}
                        style={{
                          flex: 1,
                          padding: '0.875rem',
                          background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                          border: 'none',
                          borderRadius: '10px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
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
                        <i className="fas fa-upload"></i>
                        Submit Work
                      </button>
                    )}
                    <button
                      style={{
                        padding: '0.875rem 1.25rem',
                        background: '#f7fafc',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
                        color: '#2d3748',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#10ac8b';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                      }}
                    >
                      <i className="fas fa-info-circle"></i>
                    </button>
                  </div>
                )}

                {task.status === 'completed' && (
                  <button
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: '#f7fafc',
                      border: '2px solid #10ac8b',
                      borderRadius: '10px',
                      color: '#10ac8b',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-check-circle"></i>
                    Completed
                  </button>
                )}

                {task.status === 'overdue' && (
                  <button
                    onClick={() => handleOpenUploadModal(task)}
                    style={{
                      width: '100%',
                      padding: '0.875rem',
                      background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                    }}
                  >
                    <i className="fas fa-exclamation-circle"></i>
                    Submit Late Work
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredTasks.length === 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#f7fafc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <i className="fas fa-check-double" style={{ fontSize: '2rem', color: '#10ac8b' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            No {filter !== 'all' ? filter : ''} tasks found
          </h3>
          <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
            {filter === 'all' ? 'You have no tasks at the moment.' : `You don't have any ${filter} tasks.`}
          </p>
        </div>
      )}

      {/* File Upload Modal */}
      {showUploadModal && selectedTask && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}
          onClick={() => setShowUploadModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              width: '90%',
              maxWidth: '600px',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '2rem',
              borderBottom: '2px solid #f7fafc',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              borderRadius: '20px 20px 0 0',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: '-50px',
                right: '-50px',
                width: '200px',
                height: '200px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                filter: 'blur(40px)'
              }}></div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                  <div>
                    <h2 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.75rem', fontWeight: 700 }}>
                      <i className="fas fa-cloud-upload-alt" style={{ marginRight: '0.75rem' }}></i>
                      Submit Your Work
                    </h2>
                    <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1rem' }}>
                      {selectedTask.title}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      borderRadius: '8px',
                      color: 'white',
                      width: '36px',
                      height: '36px',
                      cursor: 'pointer',
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '0.875rem',
                    color: 'white'
                  }}>
                    <i className="fas fa-book" style={{ marginRight: '0.5rem' }}></i>
                    {selectedTask.subject}
                  </div>
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    fontSize: '0.875rem',
                    color: 'white'
                  }}>
                    <i className="fas fa-star" style={{ marginRight: '0.5rem' }}></i>
                    {selectedTask.points} Points
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem' }}>
              {/* File Upload Area */}
              <div style={{ marginBottom: '2rem' }}>
                <label
                  htmlFor="file-upload"
                  style={{
                    display: 'block',
                    padding: '3rem 2rem',
                    border: '3px dashed #e2e8f0',
                    borderRadius: '16px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    background: '#f7fafc'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#10ac8b';
                    e.currentTarget.style.background = '#f0fdf4';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f7fafc';
                  }}
                >
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <i className="fas fa-cloud-upload-alt" style={{ fontSize: '2rem', color: 'white' }}></i>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                    Click to upload files
                  </h3>
                  <p style={{ margin: '0 0 1rem 0', color: '#718096', fontSize: '0.9rem' }}>
                    or drag and drop
                  </p>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.8rem' }}>
                    PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, Images, ZIP (Max 50MB each)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.zip,.rar"
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                  />
                </label>
              </div>

              {/* Selected Files List */}
              {selectedFiles.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
                    <i className="fas fa-paperclip" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                    Selected Files ({selectedFiles.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {selectedFiles.map((file, index) => (
                      <div
                        key={index}
                        style={{
                          background: '#f7fafc',
                          border: '2px solid #e2e8f0',
                          borderRadius: '12px',
                          padding: '1rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        <div style={{
                          width: '48px',
                          height: '48px',
                          background: `${getFileColor(file.name)}15`,
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <i className={`fas ${getFileIcon(file.name)}`} style={{
                            fontSize: '1.5rem',
                            color: getFileColor(file.name)
                          }}></i>
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <h4 style={{
                            margin: '0 0 0.25rem 0',
                            color: '#2d3748',
                            fontSize: '0.95rem',
                            fontWeight: 600,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {file.name}
                          </h4>
                          <p style={{ margin: 0, color: '#718096', fontSize: '0.8rem' }}>
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFile(index)}
                          style={{
                            background: '#fee2e2',
                            border: '2px solid #fecaca',
                            borderRadius: '8px',
                            color: '#dc2626',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            transition: 'all 0.2s',
                            width: '36px',
                            height: '36px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fecaca';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={handleSubmitWork}
                  disabled={selectedFiles.length === 0}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: selectedFiles.length > 0
                      ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                      : '#e2e8f0',
                    border: 'none',
                    borderRadius: '12px',
                    color: 'white',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: selectedFiles.length > 0 ? 'pointer' : 'not-allowed',
                    transition: 'all 0.3s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: selectedFiles.length > 0 ? '0 4px 12px rgba(9, 77, 136, 0.3)' : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFiles.length > 0) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(9, 77, 136, 0.4)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = selectedFiles.length > 0 ? '0 4px 12px rgba(9, 77, 136, 0.3)' : 'none';
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                  Submit ({selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'})
                </button>
                <button
                  onClick={() => setShowUploadModal(false)}
                  style={{
                    padding: '1rem 1.5rem',
                    background: '#f7fafc',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    color: '#2d3748',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#e2e8f0';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f7fafc';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TasksHomeworks;
