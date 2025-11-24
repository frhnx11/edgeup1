import { useState } from 'react';

interface IntegrationsProps {
  onBack: () => void;
}

const Integrations = ({ onBack }: IntegrationsProps) => {
  const [activeTab, setActiveTab] = useState<'assignments' | 'calendar' | 'library' | 'analytics' | 'curriculum'>('assignments');
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showLinkResourceModal, setShowLinkResourceModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string>('');

  // Mock data for plans
  const plans = [
    { id: '1', name: 'Introduction to Quadratic Equations', type: 'lesson', subject: 'Mathematics', grade: 'Grade 10A' },
    { id: '2', name: 'Physics - Electromagnetism Course', type: 'course', subject: 'Physics', grade: 'Grade 11' },
    { id: '3', name: 'Chemistry Lab Safety', type: 'lesson', subject: 'Chemistry', grade: 'Grade 9' }
  ];

  // Mock data for linked assignments
  const linkedAssignments = [
    {
      id: '1',
      planName: 'Introduction to Quadratic Equations',
      assignmentName: 'Quadratic Equations Practice',
      dueDate: '2024-03-25',
      grade: 'Grade 10A',
      status: 'active',
      submissions: 24,
      totalStudents: 30
    },
    {
      id: '2',
      planName: 'Physics - Electromagnetism Course',
      assignmentName: 'Electromagnetic Fields Assignment',
      dueDate: '2024-03-28',
      grade: 'Grade 11',
      status: 'active',
      submissions: 18,
      totalStudents: 25
    }
  ];

  // Mock data for scheduled lessons
  const scheduledLessons = [
    {
      id: '1',
      planName: 'Introduction to Quadratic Equations',
      date: '2024-03-22',
      time: '10:00 AM',
      duration: '1 hour',
      class: 'Grade 10A',
      room: 'Math Lab 201',
      status: 'upcoming'
    },
    {
      id: '2',
      planName: 'Chemistry Lab Safety',
      date: '2024-03-20',
      time: '2:00 PM',
      duration: '45 minutes',
      class: 'Grade 9',
      room: 'Chemistry Lab 105',
      status: 'completed'
    }
  ];

  // Mock data for linked resources
  const linkedResources = [
    {
      id: '1',
      planName: 'Introduction to Quadratic Equations',
      resources: [
        { name: 'Quadratic Formula Video Tutorial', type: 'video', size: '45 MB' },
        { name: 'Practice Worksheets PDF', type: 'pdf', size: '2.3 MB' },
        { name: 'Interactive Graphing Tool', type: 'link', size: '-' }
      ]
    },
    {
      id: '2',
      planName: 'Physics - Electromagnetism Course',
      resources: [
        { name: 'Electromagnetic Spectrum Poster', type: 'image', size: '5.2 MB' },
        { name: 'Virtual Lab Simulation', type: 'link', size: '-' }
      ]
    }
  ];

  // Mock data for performance insights
  const performanceInsights = [
    {
      planName: 'Introduction to Quadratic Equations',
      averageScore: 78,
      completionRate: 85,
      strugglingConcepts: ['Factoring', 'Complex roots'],
      strongConcepts: ['Standard form', 'Graphing'],
      recommendations: [
        'Add more practice problems for factoring',
        'Include real-world applications',
        'Schedule review session on complex numbers'
      ]
    }
  ];

  // Mock data for curriculum standards
  const curriculumMappings = [
    {
      id: '1',
      planName: 'Introduction to Quadratic Equations',
      standards: [
        { code: 'CCSS.MATH.HSA.REI.B.4', description: 'Solve quadratic equations in one variable', alignment: 'full' },
        { code: 'CCSS.MATH.HSA.SSE.A.2', description: 'Use the structure of an expression', alignment: 'partial' },
        { code: 'CCSS.MATH.HSF.IF.C.8', description: 'Write a function defined by an expression', alignment: 'full' }
      ],
      coverage: 85
    }
  ];

  const handleConvertToAssignment = () => {
    alert(`Converting plan to assignment...`);
    setShowConvertModal(false);
  };

  const handleScheduleLesson = () => {
    alert(`Lesson scheduled successfully!`);
    setShowScheduleModal(false);
  };

  const handleLinkResource = () => {
    alert(`Resources linked successfully!`);
    setShowLinkResourceModal(false);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateX(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Smart Planner
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <i className="fas fa-plug" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Integrations
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Connect your plans with assignments, calendar, resources, and analytics
            </p>
          </div>
        </div>
      </div>

      {/* Integration Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1rem'
      }}>
        {[
          { id: 'assignments', label: 'Assignments', icon: 'tasks', color: '#094d88' },
          { id: 'calendar', label: 'Calendar', icon: 'calendar-alt', color: '#10ac8b' },
          { id: 'library', label: 'Resources', icon: 'book-open', color: '#10ac8b' },
          { id: 'analytics', label: 'Analytics', icon: 'chart-line', color: '#094d88' },
          { id: 'curriculum', label: 'Curriculum', icon: 'graduation-cap', color: '#dc3545' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '1.25rem',
              background: activeTab === tab.id
                ? `linear-gradient(135deg, ${tab.color} 0%, ${tab.color}dd 100%)`
                : 'white',
              border: `2px solid ${activeTab === tab.id ? tab.color : '#e2e8f0'}`,
              borderRadius: '12px',
              color: activeTab === tab.id ? 'white' : '#2d3748',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: '0.95rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
              boxShadow: activeTab === tab.id ? `0 4px 12px ${tab.color}40` : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = tab.color;
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <i className={`fas fa-${tab.icon}`} style={{ fontSize: '1.5rem' }}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Assignments Integration */}
      {activeTab === 'assignments' && (
        <div>
          {/* Header with Action Button */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
                <i className="fas fa-tasks"></i> Assignment Integration
              </h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
                Convert lesson plans into assignments and track student progress
              </p>
            </div>
            <button
              onClick={() => setShowConvertModal(true)}
              className="sign-in-btn"
              style={{
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                padding: '1rem 2rem',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)'
              }}
            >
              <i className="fas fa-plus"></i> Convert to Assignment
            </button>
          </div>

          {/* Linked Assignments */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem'
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
              Linked Assignments ({linkedAssignments.length})
            </h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {linkedAssignments.map((assignment) => (
                <div key={assignment.id} style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '2rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.25rem'
                      }}>
                        <i className="fas fa-clipboard-check"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: 0, color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                          {assignment.assignmentName}
                        </h5>
                        <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem' }}>
                          From: {assignment.planName}
                        </div>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: '#10ac8b20',
                        color: '#10ac8b',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        <i className="fas fa-check-circle"></i> Active
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#718096', marginLeft: '3.5rem' }}>
                      <span><i className="fas fa-school"></i> {assignment.grade}</span>
                      <span><i className="fas fa-calendar"></i> Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      <span>
                        <i className="fas fa-users"></i> {assignment.submissions}/{assignment.totalStudents} submitted
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: 'white',
                        border: '2px solid #094d88',
                        borderRadius: '8px',
                        color: '#094d88',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                    <button
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-chart-bar"></i> Results
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Integration */}
      {activeTab === 'calendar' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
                <i className="fas fa-calendar-alt"></i> Calendar Integration
              </h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
                Schedule lessons and sync with your teaching calendar
              </p>
            </div>
            <button
              onClick={() => setShowScheduleModal(true)}
              className="sign-in-btn"
              style={{
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                padding: '1rem 2rem',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
              }}
            >
              <i className="fas fa-calendar-plus"></i> Schedule Lesson
            </button>
          </div>

          {/* Scheduled Lessons */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem'
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
              Scheduled Lessons ({scheduledLessons.length})
            </h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {scheduledLessons.map((lesson) => (
                <div key={lesson.id} style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '2rem',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        background: lesson.status === 'upcoming'
                          ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                          : 'linear-gradient(135deg, #718096 0%, #4a5568 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.25rem'
                      }}>
                        <i className="fas fa-chalkboard-teacher"></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ margin: 0, color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                          {lesson.planName}
                        </h5>
                        <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem' }}>
                          {lesson.class} • {lesson.room}
                        </div>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: lesson.status === 'upcoming' ? '#10ac8b20' : '#71809620',
                        color: lesson.status === 'upcoming' ? '#10ac8b' : '#718096',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600
                      }}>
                        <i className={`fas fa-${lesson.status === 'upcoming' ? 'clock' : 'check'}`}></i> {lesson.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem', color: '#718096', marginLeft: '3.5rem' }}>
                      <span><i className="fas fa-calendar"></i> {new Date(lesson.date).toLocaleDateString()}</span>
                      <span><i className="fas fa-clock"></i> {lesson.time}</span>
                      <span><i className="fas fa-hourglass-half"></i> {lesson.duration}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: 'white',
                        border: '2px solid #10ac8b',
                        borderRadius: '8px',
                        color: '#10ac8b',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    {lesson.status === 'upcoming' && (
                      <button
                        style={{
                          padding: '0.75rem 1.25rem',
                          background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-bell"></i> Remind
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Resources Library Integration */}
      {activeTab === 'library' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem',
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
                <i className="fas fa-book-open"></i> Content Library Integration
              </h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
                Link educational resources and materials to your lesson plans
              </p>
            </div>
            <button
              onClick={() => setShowLinkResourceModal(true)}
              className="sign-in-btn"
              style={{
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                padding: '1rem 2rem',
                fontSize: '1rem',
                boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)'
              }}
            >
              <i className="fas fa-link"></i> Link Resources
            </button>
          </div>

          {/* Linked Resources */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem'
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
              Plans with Linked Resources
            </h4>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              {linkedResources.map((item) => (
                <div key={item.id} style={{
                  padding: '1.5rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  border: '2px solid #e2e8f0'
                }}>
                  <h5 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                    <i className="fas fa-clipboard"></i> {item.planName}
                  </h5>
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {item.resources.map((resource, idx) => (
                      <div key={idx} style={{
                        padding: '1rem',
                        background: 'white',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem'
                      }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          background: resource.type === 'video' ? '#dc354520' :
                                     resource.type === 'pdf' ? '#094d8820' :
                                     resource.type === 'image' ? '#094d8820' : '#10ac8b20',
                          color: resource.type === 'video' ? '#dc3545' :
                                 resource.type === 'pdf' ? '#094d88' :
                                 resource.type === 'image' ? '#094d88' : '#10ac8b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.25rem'
                        }}>
                          <i className={`fas fa-${resource.type === 'video' ? 'video' :
                                                   resource.type === 'pdf' ? 'file-pdf' :
                                                   resource.type === 'image' ? 'image' : 'link'}`}></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 600, color: '#2d3748' }}>{resource.name}</div>
                          <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem' }}>
                            {resource.type.toUpperCase()} • {resource.size}
                          </div>
                        </div>
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'white',
                            border: '2px solid #10ac8b',
                            borderRadius: '8px',
                            color: '#10ac8b',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-external-link-alt"></i> Open
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Analytics Integration */}
      {activeTab === 'analytics' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-chart-line"></i> Performance Analytics
            </h3>
            <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
              Use student performance data to improve your lesson plans
            </p>
          </div>

          {/* Performance Insights */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem'
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
              Lesson Performance Insights
            </h4>
            {performanceInsights.map((insight, idx) => (
              <div key={idx} style={{
                padding: '2rem',
                background: '#f7fafc',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                marginBottom: '1.5rem'
              }}>
                <h5 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.2rem', fontWeight: 700 }}>
                  {insight.planName}
                </h5>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#094d88', marginBottom: '0.5rem' }}>
                      {insight.averageScore}%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 600 }}>
                      Average Score
                    </div>
                  </div>
                  <div style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: 700, color: '#10ac8b', marginBottom: '0.5rem' }}>
                      {insight.completionRate}%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#718096', fontWeight: 600 }}>
                      Completion Rate
                    </div>
                  </div>
                </div>

                {/* Concepts Analysis */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #dc354520',
                    borderLeftWidth: '4px',
                    borderLeftColor: '#dc3545'
                  }}>
                    <div style={{ fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-exclamation-triangle" style={{ color: '#dc3545' }}></i>
                      Struggling Concepts
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {insight.strugglingConcepts.map((concept, i) => (
                        <div key={i} style={{
                          padding: '0.5rem 1rem',
                          background: '#dc354520',
                          color: '#dc3545',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {concept}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div style={{
                    padding: '1.5rem',
                    background: 'white',
                    borderRadius: '12px',
                    border: '2px solid #10ac8b20',
                    borderLeftWidth: '4px',
                    borderLeftColor: '#10ac8b'
                  }}>
                    <div style={{ fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10ac8b' }}></i>
                      Strong Concepts
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {insight.strongConcepts.map((concept, i) => (
                        <div key={i} style={{
                          padding: '0.5rem 1rem',
                          background: '#10ac8b20',
                          color: '#10ac8b',
                          borderRadius: '8px',
                          fontSize: '0.85rem',
                          fontWeight: 600
                        }}>
                          {concept}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI Recommendations */}
                <div style={{
                  padding: '1.5rem',
                  background: 'linear-gradient(135deg, #094d8820 0%, #10ac8b20 100%)',
                  borderRadius: '12px',
                  border: '2px solid #094d8840'
                }}>
                  <div style={{ fontWeight: 700, color: '#2d3748', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '8px',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <i className="fas fa-lightbulb"></i>
                    </div>
                    AI-Powered Recommendations
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '3rem', color: '#4a5568', lineHeight: '1.8' }}>
                    {insight.recommendations.map((rec, i) => (
                      <li key={i} style={{ marginBottom: '0.5rem' }}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Curriculum Mapping */}
      {activeTab === 'curriculum' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-graduation-cap"></i> Curriculum Standards Alignment
            </h3>
            <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
              Ensure your lesson plans align with educational standards
            </p>
          </div>

          {/* Standards Mapping */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem'
          }}>
            <h4 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
              Standards Coverage
            </h4>
            {curriculumMappings.map((mapping) => (
              <div key={mapping.id} style={{
                padding: '2rem',
                background: '#f7fafc',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                marginBottom: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h5 style={{ margin: 0, color: '#2d3748', fontSize: '1.2rem', fontWeight: 700 }}>
                    {mapping.planName}
                  </h5>
                  <div style={{
                    padding: '0.75rem 1.5rem',
                    background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                    color: 'white',
                    borderRadius: '12px',
                    fontWeight: 700,
                    fontSize: '1.25rem'
                  }}>
                    {mapping.coverage}% Coverage
                  </div>
                </div>

                {/* Progress Bar */}
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: '#e2e8f0',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    width: `${mapping.coverage}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #10ac8b 0%, #10ac8b 100%)',
                    transition: 'width 0.3s'
                  }}></div>
                </div>

                {/* Standards List */}
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {mapping.standards.map((standard, idx) => (
                    <div key={idx} style={{
                      padding: '1.25rem',
                      background: 'white',
                      borderRadius: '12px',
                      border: '2px solid #e2e8f0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '8px',
                        background: standard.alignment === 'full' ? '#10ac8b20' : '#10ac8b20',
                        color: standard.alignment === 'full' ? '#10ac8b' : '#10ac8b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        <i className={`fas fa-${standard.alignment === 'full' ? 'check-circle' : 'adjust'}`}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, color: '#2d3748', marginBottom: '0.25rem' }}>
                          {standard.code}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                          {standard.description}
                        </div>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: standard.alignment === 'full' ? '#10ac8b20' : '#10ac8b20',
                        color: standard.alignment === 'full' ? '#10ac8b' : '#10ac8b',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}>
                        {standard.alignment} Alignment
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Convert to Assignment Modal */}
      {showConvertModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              <i className="fas fa-tasks"></i> Convert to Assignment
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                Select Lesson Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              >
                <option value="">Choose a plan...</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                Assignment Title
              </label>
              <input
                type="text"
                placeholder="Enter assignment title..."
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                Due Date
              </label>
              <input
                type="date"
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowConvertModal(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleConvertToAssignment}
                className="sign-in-btn"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                }}
              >
                <i className="fas fa-check"></i> Create Assignment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Lesson Modal */}
      {showScheduleModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              <i className="fas fa-calendar-plus"></i> Schedule Lesson
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                Select Lesson Plan
              </label>
              <select style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none'
              }}>
                <option value="">Choose a plan...</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                  Date
                </label>
                <input
                  type="date"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                  Time
                </label>
                <input
                  type="time"
                  style={{
                    width: '100%',
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowScheduleModal(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleLesson}
                className="sign-in-btn"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                }}
              >
                <i className="fas fa-check"></i> Schedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Link Resources Modal */}
      {showLinkResourceModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              <i className="fas fa-link"></i> Link Resources
            </h3>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                Select Lesson Plan
              </label>
              <select style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none'
              }}>
                <option value="">Choose a plan...</option>
                {plans.map(plan => (
                  <option key={plan.id} value={plan.id}>{plan.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#2d3748', marginBottom: '0.75rem' }}>
                Select Resources
              </label>
              <div style={{ maxHeight: '200px', overflowY: 'auto', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '1rem' }}>
                {['Video Tutorial - Quadratic Formula', 'PDF Worksheet - Practice Problems', 'Interactive Graph Tool', 'Reference Guide - Algebra Basics'].map((resource, i) => (
                  <label key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '0.95rem', color: '#2d3748' }}>{resource}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowLinkResourceModal(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleLinkResource}
                className="sign-in-btn"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                }}
              >
                <i className="fas fa-check"></i> Link Resources
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integrations;
