import { useState, useEffect } from 'react';
import CoursePlanGenerator from '../CoursePlanGenerator';
import LessonPlanGenerator from '../LessonPlanGenerator';
import ContentLibrary from '../ContentLibrary';

type MainTab = 'dashboard' | 'curriculum-planning' | 'lesson-planner' | 'content-repository' | 'digital-library' | 'lecture-recordings' | 'doubt-management' | 'compliance';

interface LessonPlan {
  id: string;
  subject: string;
  topic: string;
  date: string;
  time: string;
  duration: number;
  objectives: string[];
  courseOutcomes: string[];
  status: 'Planned' | 'Completed' | 'Cancelled';
  contentIds: string[];
}

interface ContentItem {
  id: string;
  title: string;
  description: string;
  type: 'Note' | 'Presentation' | 'Video' | 'Document';
  subject: string;
  topic: string;
  fileUrl: string;
  fileSize: string;
  uploadDate: string;
  author: string;
  shareStatus: 'Private' | 'Department' | 'Public';
  views: number;
  downloads: number;
}

interface Recording {
  id: string;
  title: string;
  subject: string;
  topic: string;
  videoUrl: string;
  duration: string;
  thumbnail: string;
  uploadDate: string;
  lectureDate: string;
  views: number;
  absentStudents: string[];
}

interface Doubt {
  id: string;
  studentName: string;
  studentId: string;
  subject: string;
  topic: string;
  question: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  upvotes: number;
  timestamp: string;
  response?: string;
}

const DigitalContentCurriculum = () => {
  const [activeTab, setActiveTab] = useState<MainTab>('dashboard');
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null);
  const [selectedDoubt, setSelectedDoubt] = useState<Doubt | null>(null);

  // Mock Data
  const subjects = ['Data Structures', 'Operating Systems', 'Database Systems', 'Computer Networks'];

  const courseOutcomes = [
    { id: 'CO1', name: 'Understand fundamental concepts', attainment: 78, mapped: 12 },
    { id: 'CO2', name: 'Apply knowledge to solve problems', attainment: 72, mapped: 10 },
    { id: 'CO3', name: 'Analyze complex scenarios', attainment: 65, mapped: 8 },
    { id: 'CO4', name: 'Design solutions', attainment: 70, mapped: 9 },
    { id: 'CO5', name: 'Evaluate and critique', attainment: 68, mapped: 7 }
  ];

  const lessonPlans: LessonPlan[] = [
    {
      id: '1',
      subject: 'Data Structures',
      topic: 'Binary Search Trees',
      date: '2025-11-25',
      time: '09:00',
      duration: 60,
      objectives: ['Understand BST properties', 'Implement insertion and deletion'],
      courseOutcomes: ['CO1', 'CO2'],
      status: 'Planned',
      contentIds: ['c1', 'c2']
    },
    {
      id: '2',
      subject: 'Operating Systems',
      topic: 'Process Synchronization',
      date: '2025-11-26',
      time: '11:00',
      duration: 60,
      objectives: ['Learn semaphores', 'Solve classic problems'],
      courseOutcomes: ['CO2', 'CO3'],
      status: 'Completed',
      contentIds: ['c3']
    }
  ];

  const contentItems: ContentItem[] = [
    {
      id: 'c1',
      title: 'Binary Search Trees - Complete Notes',
      description: 'Comprehensive notes covering BST operations, properties, and applications',
      type: 'Note',
      subject: 'Data Structures',
      topic: 'Trees',
      fileUrl: '/files/bst-notes.pdf',
      fileSize: '2.4 MB',
      uploadDate: '2025-11-15',
      author: 'Prof. Sarah Martinez',
      shareStatus: 'Department',
      views: 145,
      downloads: 67
    },
    {
      id: 'c2',
      title: 'BST Implementation in C++',
      description: 'Code examples and explanations for BST implementation',
      type: 'Presentation',
      subject: 'Data Structures',
      topic: 'Trees',
      fileUrl: '/files/bst-presentation.pptx',
      fileSize: '5.1 MB',
      uploadDate: '2025-11-18',
      author: 'Prof. Sarah Martinez',
      shareStatus: 'Public',
      views: 198,
      downloads: 89
    },
    {
      id: 'c3',
      title: 'Semaphores Explained',
      description: 'Video tutorial on semaphores and synchronization',
      type: 'Video',
      subject: 'Operating Systems',
      topic: 'Synchronization',
      fileUrl: '/videos/semaphores.mp4',
      fileSize: '85 MB',
      uploadDate: '2025-11-10',
      author: 'Prof. John Doe',
      shareStatus: 'Department',
      views: 234,
      downloads: 45
    },
    {
      id: 'c4',
      title: 'Database Normalization Guide',
      description: 'Step-by-step guide to normalization with examples',
      type: 'Document',
      subject: 'Database Systems',
      topic: 'Normalization',
      fileUrl: '/files/normalization.pdf',
      fileSize: '1.8 MB',
      uploadDate: '2025-11-12',
      author: 'Prof. Sarah Martinez',
      shareStatus: 'Private',
      views: 78,
      downloads: 34
    }
  ];

  const recordings: Recording[] = [
    {
      id: 'r1',
      title: 'Process Synchronization - Lecture 15',
      subject: 'Operating Systems',
      topic: 'Synchronization',
      videoUrl: '/recordings/os-lecture-15.mp4',
      duration: '58:32',
      thumbnail: '/thumbnails/os-15.jpg',
      uploadDate: '2025-11-20',
      lectureDate: '2025-11-20',
      views: 42,
      absentStudents: ['CS21005', 'CS21012', 'CS21028']
    },
    {
      id: 'r2',
      title: 'Binary Trees - Complete Explanation',
      subject: 'Data Structures',
      topic: 'Trees',
      videoUrl: '/recordings/ds-trees.mp4',
      duration: '1:12:45',
      thumbnail: '/thumbnails/ds-trees.jpg',
      uploadDate: '2025-11-18',
      lectureDate: '2025-11-18',
      views: 68,
      absentStudents: ['CS21003', 'CS21019']
    }
  ];

  const doubts: Doubt[] = [
    {
      id: 'd1',
      studentName: 'Aravind Kumar',
      studentId: 'CS21001',
      subject: 'Data Structures',
      topic: 'Binary Search Trees',
      question: 'How do we handle duplicate values in BST? Should they go to left or right subtree?',
      status: 'Pending',
      priority: 'High',
      upvotes: 5,
      timestamp: '2025-11-20 14:30'
    },
    {
      id: 'd2',
      studentName: 'Priya Sharma',
      studentId: 'CS21002',
      subject: 'Operating Systems',
      topic: 'Deadlocks',
      question: 'Can you explain the difference between deadlock prevention and avoidance with examples?',
      status: 'In Progress',
      priority: 'Medium',
      upvotes: 8,
      timestamp: '2025-11-19 10:15'
    },
    {
      id: 'd3',
      studentName: 'Rahul Mehta',
      studentId: 'CS21003',
      subject: 'Database Systems',
      topic: 'SQL Queries',
      question: 'What is the difference between HAVING and WHERE clause?',
      status: 'Resolved',
      priority: 'Low',
      upvotes: 3,
      timestamp: '2025-11-18 16:45',
      response: 'WHERE filters rows before grouping, HAVING filters groups after GROUP BY operation.'
    }
  ];

  const syllabusCompletion = [
    { subject: 'Data Structures', completed: 18, total: 24, percentage: 75 },
    { subject: 'Operating Systems', completed: 15, total: 20, percentage: 75 },
    { subject: 'Database Systems', completed: 12, total: 18, percentage: 67 },
    { subject: 'Computer Networks', completed: 10, total: 16, percentage: 62 }
  ];


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': case 'Resolved': return '#10ac8b';
      case 'Planned': case 'In Progress': return '#ff9800';
      case 'Cancelled': case 'Pending': return '#f44336';
      default: return '#666';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Note': return 'fa-file-alt';
      case 'Presentation': return 'fa-file-powerpoint';
      case 'Video': return 'fa-file-video';
      case 'Document': return 'fa-file-word';
      default: return 'fa-file';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return '#f44336';
      case 'Medium': return '#ff9800';
      case 'Low': return '#10ac8b';
      default: return '#666';
    }
  };

  // Dashboard Tab
  const renderDashboard = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          { icon: 'fa-chart-line', label: 'Avg Syllabus Completion', value: '70%', color: '#094d88' },
          { icon: 'fa-folder-open', label: 'Content Items', value: contentItems.length, color: '#10ac8b' },
          { icon: 'fa-question-circle', label: 'Pending Doubts', value: doubts.filter(d => d.status === 'Pending').length, color: '#ff9800' },
          { icon: 'fa-video', label: 'Lecture Recordings', value: recordings.length, color: '#9c27b0' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: `${stat.color}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stat.color
            }}>
              <i className={`fas ${stat.icon}`} style={{ fontSize: '24px' }}></i>
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#2c3e50' }}>{stat.value}</div>
              <div style={{ fontSize: '14px', color: '#666' }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        {/* Syllabus Completion */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-book-open" style={{ marginRight: '8px', color: '#094d88' }}></i>
            Syllabus Completion Tracker
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {syllabusCompletion.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#2c3e50', fontSize: '15px' }}>{item.subject}</span>
                  <span style={{ fontSize: '14px', color: '#666' }}>
                    {item.completed}/{item.total} topics ({item.percentage}%)
                  </span>
                </div>
                <div style={{
                  height: '10px',
                  background: '#e0e0e0',
                  borderRadius: '5px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.percentage}%`,
                    height: '100%',
                    background: item.percentage >= 75 ? '#10ac8b' : item.percentage >= 60 ? '#ff9800' : '#f44336',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
            <i className="fas fa-bolt" style={{ marginRight: '8px', color: '#ff9800' }}></i>
            Quick Actions
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { icon: 'fa-calendar-plus', label: 'Create Lesson Plan', tab: 'lesson-planner' as MainTab, color: '#094d88' },
              { icon: 'fa-upload', label: 'Upload Content', tab: 'content-repository' as MainTab, color: '#10ac8b' },
              { icon: 'fa-reply', label: 'Answer Doubts', tab: 'doubt-management' as MainTab, color: '#ff9800' }
            ].map((action, idx) => (
              <button key={idx} onClick={() => setActiveTab(action.tab)} style={{
                background: '#f8f9fa',
                border: 'none',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.3s ease',
                fontSize: '14px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${action.color}15`;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f8f9fa';
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <i className={`fas ${action.icon}`} style={{ color: action.color, fontSize: '18px' }}></i>
                <span style={{ color: '#2c3e50', fontWeight: '500' }}>{action.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', color: '#2c3e50' }}>
          <i className="fas fa-history" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
          Recent Activity
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: 'fa-upload', text: 'Uploaded "Binary Search Trees - Complete Notes"', time: '2 hours ago', color: '#10ac8b' },
            { icon: 'fa-video', text: 'New recording: Process Synchronization - Lecture 15', time: '5 hours ago', color: '#9c27b0' },
            { icon: 'fa-question-circle', text: '5 students upvoted doubt on BST duplicates', time: '1 day ago', color: '#ff9800' },
            { icon: 'fa-check-circle', text: 'Completed lesson: Process Synchronization', time: '2 days ago', color: '#094d88' }
          ].map((activity, idx) => (
            <div key={idx} style={{
              padding: '14px',
              background: '#f8f9fa',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: `${activity.color}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: activity.color
              }}>
                <i className={`fas ${activity.icon}`}></i>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500' }}>{activity.text}</div>
                <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Lesson Planner Tab
  const renderLessonPlanner = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
      {/* Lesson Plan Form */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#2c3e50' }}>
          <i className="fas fa-calendar-plus" style={{ marginRight: '10px', color: '#094d88' }}></i>
          Create Lesson Plan
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Subject & Topic */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Subject *
              </label>
              <select style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                cursor: 'pointer'
              }}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Topic *
              </label>
              <input
                type="text"
                placeholder="e.g., Binary Search Trees"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Date & Time */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Date *
              </label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Time *
              </label>
              <input
                type="time"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Duration (min)
              </label>
              <input
                type="number"
                defaultValue={60}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          {/* Learning Objectives */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
              Learning Objectives
            </label>
            <textarea
              placeholder="Enter learning objectives (one per line)"
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          {/* Course Outcomes Mapping */}
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
              Map to Course Outcomes
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {courseOutcomes.map((co) => (
                <button key={co.id} style={{
                  padding: '8px 16px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '20px',
                  background: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#666',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#10ac8b';
                  e.currentTarget.style.background = '#10ac8b15';
                  e.currentTarget.style.color = '#10ac8b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e0e0e0';
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.color = '#666';
                }}>
                  {co.id}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button style={{
              flex: 1,
              padding: '14px',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
              Save Lesson Plan
            </button>
            <button style={{
              padding: '14px 24px',
              background: '#f8f9fa',
              color: '#666',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer'
            }}>
              <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
              Cancel
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming Lessons */}
      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        height: 'fit-content'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', color: '#2c3e50' }}>
          <i className="fas fa-calendar-alt" style={{ marginRight: '8px', color: '#9c27b0' }}></i>
          Upcoming Lessons
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {lessonPlans.map((lesson) => (
            <div key={lesson.id} style={{
              padding: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '8px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#094d88'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>{lesson.topic}</div>
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '10px',
                  background: `${getStatusColor(lesson.status)}15`,
                  color: getStatusColor(lesson.status),
                  fontSize: '11px',
                  fontWeight: '600'
                }}>
                  {lesson.status}
                </span>
              </div>
              <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>
                {lesson.subject}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                {lesson.date} at {lesson.time}
              </div>
              <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                {lesson.courseOutcomes.map(co => (
                  <span key={co} style={{
                    padding: '2px 8px',
                    background: '#10ac8b15',
                    color: '#10ac8b',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}>{co}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Content Repository Tab
  const renderContentRepository = () => (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
          <i className="fas fa-folder-open" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
          Content Repository
        </h3>
        <button style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
          Upload Content
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <select style={{
          padding: '10px 16px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          <option value="">All Types</option>
          <option value="Note">Notes</option>
          <option value="Presentation">Presentations</option>
          <option value="Video">Videos</option>
          <option value="Document">Documents</option>
        </select>
        <select style={{
          padding: '10px 16px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          <option value="">All Subjects</option>
          {subjects.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select style={{
          padding: '10px 16px',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          fontSize: '14px',
          cursor: 'pointer'
        }}>
          <option value="">All Share Status</option>
          <option value="Private">Private</option>
          <option value="Department">Department</option>
          <option value="Public">Public</option>
        </select>
      </div>

      {/* Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {contentItems.map((item) => (
          <div key={item.id} style={{
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            padding: '20px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedContent(item)}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10ac8b';
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e0e0e0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}>
            {/* Icon */}
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              background: '#094d8815',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '16px',
              color: '#094d88'
            }}>
              <i className={`fas ${getTypeIcon(item.type)}`} style={{ fontSize: '28px' }}></i>
            </div>

            {/* Title */}
            <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#2c3e50', fontWeight: '600' }}>
              {item.title}
            </h4>

            {/* Description */}
            <p style={{ margin: '0 0 12px 0', fontSize: '13px', color: '#666', lineHeight: '1.5' }}>
              {item.description.length > 80 ? item.description.substring(0, 80) + '...' : item.description}
            </p>

            {/* Metadata */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#999' }}>
                <i className="fas fa-book" style={{ marginRight: '6px' }}></i>
                {item.subject}
              </div>
              <div style={{ fontSize: '12px', color: '#999' }}>
                <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                {item.uploadDate}
              </div>
            </div>

            {/* Stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <i className="fas fa-eye" style={{ marginRight: '4px' }}></i>
                {item.views}
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                <i className="fas fa-download" style={{ marginRight: '4px' }}></i>
                {item.downloads}
              </div>
              <div style={{
                padding: '2px 8px',
                borderRadius: '10px',
                background: item.shareStatus === 'Public' ? '#10ac8b15' : item.shareStatus === 'Department' ? '#ff980015' : '#66666615',
                color: item.shareStatus === 'Public' ? '#10ac8b' : item.shareStatus === 'Department' ? '#ff9800' : '#666',
                fontSize: '11px',
                fontWeight: '600'
              }}>
                {item.shareStatus}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Lecture Recordings Tab
  const renderLectureRecordings = () => (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
          <i className="fas fa-video" style={{ marginRight: '10px', color: '#9c27b0' }}></i>
          Lecture Recordings
        </h3>
        <button style={{
          padding: '10px 20px',
          background: 'linear-gradient(135deg, #9c27b0 0%, #e91e63 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '600'
        }}>
          <i className="fas fa-upload" style={{ marginRight: '8px' }}></i>
          Upload Recording
        </button>
      </div>

      {/* Recordings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {recordings.map((recording) => (
          <div key={recording.id} style={{
            padding: '20px',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#9c27b0'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
            <div style={{ display: 'flex', gap: '20px' }}>
              {/* Thumbnail */}
              <div style={{
                width: '200px',
                height: '112px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0
              }}>
                <i className="fas fa-play-circle" style={{ fontSize: '48px', opacity: 0.8 }}></i>
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#2c3e50' }}>
                  {recording.title}
                </h4>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                  {recording.subject} • {recording.topic}
                </div>
                <div style={{ display: 'flex', gap: '20px', fontSize: '13px', color: '#999', marginBottom: '12px' }}>
                  <span>
                    <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                    {recording.duration}
                  </span>
                  <span>
                    <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                    {recording.lectureDate}
                  </span>
                  <span>
                    <i className="fas fa-eye" style={{ marginRight: '6px' }}></i>
                    {recording.views} views
                  </span>
                </div>
                {recording.absentStudents.length > 0 && (
                  <div style={{
                    padding: '8px 12px',
                    background: '#ff980015',
                    borderRadius: '6px',
                    fontSize: '13px',
                    color: '#ff9800',
                    display: 'inline-block'
                  }}>
                    <i className="fas fa-user-times" style={{ marginRight: '6px' }}></i>
                    {recording.absentStudents.length} absent students notified
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', justifyContent: 'center' }}>
                <button
                  onClick={() => setSelectedRecording(recording)}
                  style={{
                  padding: '10px 20px',
                  background: '#9c27b0',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-play" style={{ marginRight: '8px' }}></i>
                  Play
                </button>
                <button style={{
                  padding: '10px 20px',
                  background: '#ffffff',
                  color: '#666',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
                  Download
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Video Player Modal */}
      {selectedRecording && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setSelectedRecording(null)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '900px',
            width: '90%'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>{selectedRecording.title}</h3>
              <button
                onClick={() => setSelectedRecording(null)}
                style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div style={{
              width: '100%',
              height: '500px',
              background: '#000000',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '18px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fas fa-play-circle" style={{ fontSize: '64px', marginBottom: '16px', display: 'block' }}></i>
                Video Player
                <div style={{ fontSize: '14px', marginTop: '8px', opacity: 0.7 }}>
                  {selectedRecording.duration} • {selectedRecording.views} views
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderDoubtManagement = () => (
    <div style={{
      background: '#ffffff',
      borderRadius: '12px',
      padding: '28px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
          <i className="fas fa-question-circle" style={{ marginRight: '10px', color: '#ff9800' }}></i>
          Student Doubt Management
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <select style={{
            padding: '10px 16px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
          <select style={{
            padding: '10px 16px',
            border: '2px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            cursor: 'pointer'
          }}>
            <option value="">All Subjects</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Pending', value: doubts.filter(d => d.status === 'Pending').length, color: '#f44336' },
          { label: 'In Progress', value: doubts.filter(d => d.status === 'In Progress').length, color: '#ff9800' },
          { label: 'Resolved', value: doubts.filter(d => d.status === 'Resolved').length, color: '#10ac8b' }
        ].map((stat, idx) => (
          <div key={idx} style={{
            padding: '20px',
            background: `${stat.color}10`,
            borderRadius: '12px',
            border: `2px solid ${stat.color}30`,
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color, marginBottom: '4px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '14px', color: '#666' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Doubts List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {doubts.map((doubt) => (
          <div key={doubt.id} style={{
            padding: '20px',
            border: '2px solid #e0e0e0',
            borderRadius: '12px',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedDoubt(doubt)}
          onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff9800'}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#e0e0e0'}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}>
                    {doubt.studentName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '15px', color: '#2c3e50' }}>
                      {doubt.studentName} ({doubt.studentId})
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>{doubt.timestamp}</div>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '4px' }}>
                  <i className="fas fa-book" style={{ marginRight: '6px', color: '#094d88' }}></i>
                  {doubt.subject} - {doubt.topic}
                </div>
                <div style={{ fontSize: '15px', color: '#2c3e50', marginTop: '8px', lineHeight: '1.6' }}>
                  {doubt.question}
                </div>
                {doubt.response && (
                  <div style={{
                    marginTop: '12px',
                    padding: '12px',
                    background: '#10ac8b15',
                    borderLeft: '3px solid #10ac8b',
                    borderRadius: '6px',
                    fontSize: '14px',
                    color: '#2c3e50'
                  }}>
                    <strong>Your Response:</strong> {doubt.response}
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: `${getStatusColor(doubt.status)}15`,
                  color: getStatusColor(doubt.status),
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {doubt.status}
                </div>
                <div style={{
                  padding: '4px 12px',
                  borderRadius: '12px',
                  background: `${getPriorityColor(doubt.priority)}15`,
                  color: getPriorityColor(doubt.priority),
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {doubt.priority} Priority
                </div>
                <div style={{ fontSize: '13px', color: '#666', marginTop: '4px' }}>
                  <i className="fas fa-thumbs-up" style={{ marginRight: '4px' }}></i>
                  {doubt.upvotes} upvotes
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Doubt Detail Modal */}
      {selectedDoubt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}
        onClick={() => setSelectedDoubt(null)}>
          <div style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '28px',
            maxWidth: '700px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>Respond to Doubt</h3>
              <button
                onClick={() => setSelectedDoubt(null)}
                style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666'
              }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ marginBottom: '20px', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
              <div style={{ fontWeight: '600', fontSize: '16px', color: '#2c3e50', marginBottom: '8px' }}>
                {selectedDoubt.studentName}'s Question:
              </div>
              <div style={{ fontSize: '15px', color: '#666', lineHeight: '1.6' }}>
                {selectedDoubt.question}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                Your Response
              </label>
              <textarea
                defaultValue={selectedDoubt.response || ''}
                placeholder="Type your detailed explanation here..."
                rows={8}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              <button style={{
                flex: 1,
                padding: '14px',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                <i className="fas fa-check" style={{ marginRight: '8px' }}></i>
                Submit & Mark Resolved
              </button>
              <button style={{
                padding: '14px 24px',
                background: '#f8f9fa',
                color: '#666',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Save Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Curriculum Compliance Tab
  const renderCompliance = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Compliance Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
        {[
          {
            icon: 'fa-clipboard-check',
            label: 'Overall Compliance',
            value: '85%',
            subValue: 'NBA/NAAC Standards',
            color: '#10ac8b',
            bgColor: '#10ac8b15'
          },
          {
            icon: 'fa-bullseye',
            label: 'CO Attainment',
            value: '71%',
            subValue: 'Average across all COs',
            color: '#094d88',
            bgColor: '#094d8815'
          },
          {
            icon: 'fa-book-reader',
            label: 'Syllabus Coverage',
            value: '78%',
            subValue: '14 of 18 units covered',
            color: '#8b5cf6',
            bgColor: '#8b5cf615'
          },
          {
            icon: 'fa-file-alt',
            label: 'Documentation',
            value: '92%',
            subValue: 'All criteria documented',
            color: '#f59e0b',
            bgColor: '#f59e0b15'
          }
        ].map((stat, idx) => (
          <div key={idx} style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '2px solid #f0f0f0',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: stat.color
            }}></div>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: stat.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={`fas ${stat.icon}`} style={{ fontSize: '26px', color: stat.color }}></i>
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#2c3e50', marginBottom: '6px' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '14px', color: '#666', fontWeight: '600', marginBottom: '6px' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '12px', color: '#999', fontWeight: '500' }}>
              {stat.subValue}
            </div>
          </div>
        ))}
      </div>

      {/* Accreditation Status & Action Items */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px' }}>
        {/* Accreditation Timeline */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '2px solid #f0f0f0'
        }}>
          <h3 style={{ margin: '0 0 24px 0', fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-award" style={{ marginRight: '10px', color: '#094d88' }}></i>
            Accreditation Timeline & Milestones
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { milestone: 'NAAC Self-Assessment Report (SAR) Submission', date: 'Dec 2025', status: 'In Progress', progress: 65, color: '#ff9800' },
              { milestone: 'NBA Program Assessment Submission', date: 'Jan 2026', status: 'Upcoming', progress: 30, color: '#666' },
              { milestone: 'Student Satisfaction Survey Completion', date: 'Feb 2026', status: 'Upcoming', progress: 0, color: '#666' },
              { milestone: 'Peer Team Visit Preparation', date: 'Mar 2026', status: 'Pending', progress: 0, color: '#666' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '18px',
                border: '2px solid #f0f0f0',
                borderRadius: '12px',
                borderLeft: `4px solid ${item.color}`,
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#2c3e50', fontSize: '15px', marginBottom: '6px' }}>
                      {item.milestone}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                      Target: {item.date}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: `${item.color}15`,
                    color: item.color
                  }}>
                    {item.status}
                  </span>
                </div>
                <div style={{ marginTop: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#666' }}>Completion Progress</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#2c3e50' }}>
                      {item.progress}%
                    </span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: '#f0f0f0',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${item.progress}%`,
                      height: '100%',
                      background: item.color,
                      borderRadius: '4px',
                      transition: 'width 0.5s ease'
                    }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Action Items */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          border: '2px solid #f0f0f0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px', color: '#ff9800' }}></i>
            Action Required
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { action: 'Complete CO mapping for 2 courses', priority: 'High', dueIn: '3 days', color: '#f44336' },
              { action: 'Upload lab assessment records', priority: 'High', dueIn: '5 days', color: '#f44336' },
              { action: 'Update curriculum documentation', priority: 'Medium', dueIn: '1 week', color: '#ff9800' },
              { action: 'Collect student feedback forms', priority: 'Medium', dueIn: '2 weeks', color: '#ff9800' },
              { action: 'Review accreditation checklist', priority: 'Low', dueIn: '3 weeks', color: '#10ac8b' }
            ].map((item, idx) => (
              <div key={idx} style={{
                padding: '14px',
                border: `2px solid ${item.color}30`,
                borderRadius: '10px',
                background: `${item.color}08`,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${item.color}15`;
                e.currentTarget.style.transform = 'translateX(4px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${item.color}08`;
                e.currentTarget.style.transform = 'translateX(0)';
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '600' }}>
                      {item.action}
                    </span>
                    <span style={{
                      padding: '3px 10px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: '700',
                      background: item.color,
                      color: 'white'
                    }}>
                      {item.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                    Due in {item.dueIn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NBA/NAAC Compliance Checklist */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '2px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-clipboard-list" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
            NBA/NAAC Compliance Criteria
          </h3>
          <button style={{
            padding: '10px 24px',
            background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(9, 77, 136, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
          }}>
            <i className="fas fa-file-export" style={{ marginRight: '8px' }}></i>
            Generate Compliance Report
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
          {[
            { category: 'Curriculum Design', criteria: 'All COs mapped to lesson plans', status: true, completion: 100 },
            { category: 'Assessment', criteria: 'Assessment tools aligned with COs', status: true, completion: 100 },
            { category: 'Attainment', criteria: 'Minimum 60% CO attainment achieved', status: true, completion: 85 },
            { category: 'Syllabus', criteria: 'Syllabus completion above 75%', status: false, completion: 68 },
            { category: 'Student Feedback', criteria: 'Feedback collected and analyzed', status: true, completion: 90 },
            { category: 'Documentation', criteria: 'All supporting documents uploaded', status: true, completion: 92 },
            { category: 'Continuous Improvement', criteria: 'Action plans for low-performing COs', status: false, completion: 40 },
            { category: 'Industry Interaction', criteria: 'Guest lectures and industry visits documented', status: true, completion: 80 }
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: '18px',
              background: item.status ? '#10ac8b08' : '#f4433608',
              borderLeft: `4px solid ${item.status ? '#10ac8b' : '#f44336'}`,
              borderRadius: '10px',
              border: `2px solid ${item.status ? '#10ac8b30' : '#f4433630'}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateX(4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateX(0)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', color: '#666', fontWeight: '600', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {item.category}
                  </div>
                  <div style={{ fontSize: '14px', color: '#2c3e50', fontWeight: '500', lineHeight: '1.4' }}>
                    {item.criteria}
                  </div>
                </div>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: item.status ? '#10ac8b' : '#f44336',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {item.status ? (
                    <i className="fas fa-check" style={{ fontSize: '16px', color: 'white' }}></i>
                  ) : (
                    <i className="fas fa-times" style={{ fontSize: '16px', color: 'white' }}></i>
                  )}
                </div>
              </div>
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: '#666' }}>Completion</span>
                  <span style={{ fontSize: '12px', fontWeight: '600', color: item.status ? '#10ac8b' : '#f44336' }}>
                    {item.completion}%
                  </span>
                </div>
                <div style={{
                  height: '6px',
                  background: '#e0e0e0',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.completion}%`,
                    height: '100%',
                    background: item.status ? 'linear-gradient(90deg, #10ac8b 0%, #4caf50 100%)' : 'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                    borderRadius: '3px',
                    transition: 'width 0.5s ease'
                  }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Outcome Attainment Details */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '28px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        border: '2px solid #f0f0f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h3 style={{ margin: 0, fontSize: '20px', color: '#2c3e50' }}>
            <i className="fas fa-bullseye" style={{ marginRight: '10px', color: '#094d88' }}></i>
            Course Outcome Attainment Analysis
          </h3>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ fontSize: '14px', color: '#666' }}>
              Target: <strong style={{ color: '#094d88' }}>60%</strong> minimum
            </div>
            <button style={{
              padding: '8px 16px',
              background: '#f7fafc',
              color: '#2d3748',
              border: '2px solid #e2e8f0',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}>
              <i className="fas fa-download" style={{ marginRight: '8px' }}></i>
              Export CO Report
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {courseOutcomes.map((co) => (
            <div key={co.id} style={{
              padding: '20px',
              border: '2px solid #f0f0f0',
              borderRadius: '12px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                    <span style={{
                      fontWeight: '700',
                      color: '#2c3e50',
                      fontSize: '18px',
                      padding: '4px 12px',
                      background: '#094d8815',
                      borderRadius: '8px',
                      border: '2px solid #094d8830'
                    }}>
                      {co.id}
                    </span>
                    <span style={{ color: '#666', fontSize: '15px', fontWeight: '500' }}>{co.name}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#999', marginLeft: '12px' }}>
                    <i className="fas fa-link" style={{ marginRight: '6px' }}></i>
                    {co.mapped} lessons mapped • {Math.floor(co.mapped * 1.5)} assessments linked
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{
                    fontSize: '28px',
                    fontWeight: 'bold',
                    color: co.attainment >= 75 ? '#10ac8b' : co.attainment >= 60 ? '#ff9800' : '#f44336'
                  }}>
                    {co.attainment}%
                  </span>
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: co.attainment >= 60 ? '#10ac8b20' : '#f4433620',
                    color: co.attainment >= 60 ? '#10ac8b' : '#f44336'
                  }}>
                    {co.attainment >= 60 ? '✓ Target Achieved' : `${60 - co.attainment}% Gap`}
                  </span>
                </div>
              </div>
              <div style={{
                height: '14px',
                background: '#e0e0e0',
                borderRadius: '7px',
                overflow: 'hidden',
                position: 'relative'
              }}>
                <div style={{
                  width: `${co.attainment}%`,
                  height: '100%',
                  background: co.attainment >= 75 ? 'linear-gradient(90deg, #10ac8b 0%, #4caf50 100%)' :
                              co.attainment >= 60 ? 'linear-gradient(90deg, #ff9800 0%, #ffc107 100%)' :
                              'linear-gradient(90deg, #f44336 0%, #e91e63 100%)',
                  transition: 'width 0.5s ease',
                  boxShadow: `0 0 10px ${co.attainment >= 75 ? '#10ac8b' : co.attainment >= 60 ? '#ff9800' : '#f44336'}50`
                }}></div>
                {/* Target Line */}
                <div style={{
                  position: 'absolute',
                  left: '60%',
                  top: 0,
                  bottom: 0,
                  width: '2px',
                  background: '#2c3e50',
                  opacity: 0.5
                }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f5f7fa' }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(9, 77, 136, 0.2)',
        color: '#ffffff'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: 'bold' }}>
              Digital Content & Curriculum Management
            </h1>
            <p style={{ margin: 0, fontSize: '16px', opacity: 0.9 }}>
              Plan lessons, manage content, and track curriculum completion
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <i className="fas fa-book-open" style={{ fontSize: '32px' }}></i>
            <div>
              <div style={{ fontSize: '28px', fontWeight: 'bold' }}>70%</div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>Avg Completion</div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { icon: 'fa-folder-open', label: 'Content Items', value: contentItems.length },
            { icon: 'fa-question-circle', label: 'Pending Doubts', value: doubts.filter(d => d.status === 'Pending').length },
            { icon: 'fa-bullseye', label: 'CO Attainment', value: '71%' }
          ].map((stat, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <i className={`fas ${stat.icon}`} style={{ fontSize: '24px' }}></i>
              <div>
                <div style={{ fontSize: '22px', fontWeight: 'bold' }}>{stat.value}</div>
                <div style={{ fontSize: '13px', opacity: 0.9 }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '12px' }}>
        {[
          { id: 'dashboard', icon: 'fa-th-large', label: 'Dashboard' },
          { id: 'curriculum-planning', icon: 'fa-sitemap', label: 'Curriculum Planning' },
          { id: 'lesson-planner', icon: 'fa-calendar-plus', label: 'Lesson Planner' },
          { id: 'content-repository', icon: 'fa-folder-open', label: 'Content Repository' },
          { id: 'digital-library', icon: 'fa-book', label: 'Digital Library' },
          { id: 'lecture-recordings', icon: 'fa-video', label: 'Lecture Recordings' },
          { id: 'doubt-management', icon: 'fa-question-circle', label: 'Doubt Management' },
          { id: 'compliance', icon: 'fa-clipboard-check', label: 'Compliance' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as MainTab)}
            style={{
              background: activeTab === tab.id
                ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                : '#ffffff',
              color: activeTab === tab.id ? '#ffffff' : '#666',
              border: 'none',
              padding: '16px',
              borderRadius: '12px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(9, 77, 136, 0.3)' : '0 2px 8px rgba(0,0,0,0.1)',
              fontWeight: activeTab === tab.id ? '600' : '500',
              fontSize: '13px'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ fontSize: '20px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'curriculum-planning' && <CoursePlanGenerator />}
      {activeTab === 'lesson-planner' && <LessonPlanGenerator />}
      {activeTab === 'content-repository' && renderContentRepository()}
      {activeTab === 'digital-library' && <ContentLibrary />}
      {activeTab === 'lecture-recordings' && renderLectureRecordings()}
      {activeTab === 'doubt-management' && renderDoubtManagement()}
      {activeTab === 'compliance' && renderCompliance()}
    </div>
  );
};

export default DigitalContentCurriculum;
