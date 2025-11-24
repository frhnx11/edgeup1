import { useState, useEffect } from 'react';
import { getAIStudyPlanData } from '../../services/data/studentData';
import type { AIStudyPlanData, StudyPlanMode, TimeView } from '../../types';
import '../Dashboard.css';

const AIStudyPlan = () => {
  const [data, setData] = useState<AIStudyPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<StudyPlanMode>('daily');
  const [timeView, setTimeView] = useState<TimeView>('daily');
  const [showSuggestForm, setShowSuggestForm] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const studyPlanData = getAIStudyPlanData();
        setData(studyPlanData);
      } catch (error) {
        console.error('Error loading AI Study Plan data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '400px',
        fontSize: '1.2rem',
        color: '#718096'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: '1rem' }}></i>
        Loading AI Study Plan...
      </div>
    );
  }

  // Calculate quick stats
  const totalTasksToday = data.dailyTasks.length;
  const completedTasksToday = data.dailyTasks.filter(t => t.completed).length;
  const totalStudyTimeToday = data.dailyTasks.reduce((sum, task) => sum + task.duration, 0);
  const highPriorityTasks = data.dailyTasks.filter(t => t.priority === 'high').length;

  const getModeIcon = (mode: StudyPlanMode) => {
    switch (mode) {
      case 'daily': return 'fa-calendar-day';
      case 'weekly': return 'fa-calendar-week';
      case 'exam-prep': return 'fa-graduation-cap';
      case 'performance': return 'fa-chart-line';
      default: return 'fa-calendar';
    }
  };

  const getModeLabel = (mode: StudyPlanMode) => {
    switch (mode) {
      case 'daily': return 'Daily Tasks';
      case 'weekly': return 'Weekly Schedule';
      case 'exam-prep': return 'Exam Prep';
      case 'performance': return 'Performance Goals';
      default: return mode;
    }
  };

  const getPriorityBadgeColor = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high': return { bg: '#fee2e2', color: '#991b1b' };
      case 'medium': return { bg: '#fef3c7', color: '#92400e' };
      case 'low': return { bg: '#dbeafe', color: '#1e3a8a' };
    }
  };

  const getDifficultyBadgeColor = (difficulty: 'easy' | 'medium' | 'hard') => {
    switch (difficulty) {
      case 'easy': return { bg: '#d1fae5', color: '#065f46' };
      case 'medium': return { bg: '#fef3c7', color: '#92400e' };
      case 'hard': return { bg: '#fee2e2', color: '#991b1b' };
    }
  };

  // Handler: Toggle task completion
  const toggleTaskCompletion = (taskId: string) => {
    if (!data) return;

    setData({
      ...data,
      dailyTasks: data.dailyTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
      weeklySchedule: data.weeklySchedule.map(schedule => ({
        ...schedule,
        tasks: schedule.tasks.map(task =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      }))
    });
  };

  // Handler: Submit AI suggestion
  const handleSuggestionSubmit = () => {
    if (!data || !suggestionText.trim()) return;

    setData({
      ...data,
      suggestedChanges: [...data.suggestedChanges, suggestionText.trim()]
    });

    setSuggestionText('');
    setShowSuggestForm(false);

    // Show success message (you can make this fancier)
    alert('Your suggestion has been submitted to AI for plan optimization!');
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-brain" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              AI Study Plan
            </h1>
            <p>Personalized study plan powered by AI to optimize your learning</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Study Hours/Week</p>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>
                {data.studentProfile.studyHoursPerWeek}h
              </h3>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="stat-info">
              <h4>Today's Tasks</h4>
              <p className="stat-value">
                {completedTasksToday} <span className="stat-total">/ {totalTasksToday}</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${totalTasksToday > 0 ? (completedTasksToday / totalTasksToday) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Study Time Today</h4>
              <p className="stat-value">
                {Math.floor(totalStudyTimeToday / 60)}h {totalStudyTimeToday % 60}m
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(totalStudyTimeToday / 300) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <div className="stat-info">
              <h4>High Priority Tasks</h4>
              <p className="stat-value">
                {highPriorityTasks} <span className="stat-total">tasks</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(highPriorityTasks / totalTasksToday) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '1.5rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem'
        }}>
          {(['daily', 'weekly', 'exam-prep', 'performance'] as StudyPlanMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setSelectedMode(mode)}
              style={{
                background: selectedMode === mode
                  ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                  : '#f7fafc',
                color: selectedMode === mode ? 'white' : '#2d3748',
                border: selectedMode === mode ? 'none' : '2px solid #e2e8f0',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '1rem',
                fontWeight: 600,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                if (selectedMode !== mode) {
                  e.currentTarget.style.borderColor = '#094d88';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedMode !== mode) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }
              }}
            >
              <i className={`fas ${getModeIcon(mode)}`} style={{ fontSize: '1.5rem' }}></i>
              <span>{getModeLabel(mode)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Time View Tabs (for Daily and Weekly modes) */}
      {(selectedMode === 'daily' || selectedMode === 'weekly') && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '1rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {(['daily', 'weekly', 'monthly'] as TimeView[]).map((view) => (
              <button
                key={view}
                onClick={() => setTimeView(view)}
                style={{
                  background: timeView === view ? '#094d88' : 'transparent',
                  color: timeView === view ? 'white' : '#718096',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  textTransform: 'capitalize'
                }}
                onMouseEnter={(e) => {
                  if (timeView !== view) {
                    e.currentTarget.style.background = '#f7fafc';
                  }
                }}
                onMouseLeave={(e) => {
                  if (timeView !== view) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dynamic Content Area */}
      {selectedMode === 'daily' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-calendar-day" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
              Today's Study Tasks
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Complete these tasks to stay on track with your study goals
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {data.dailyTasks.map((task) => {
              const priorityColors = getPriorityBadgeColor(task.priority);
              const difficultyColors = getDifficultyBadgeColor(task.difficulty);

              return (
                <div
                  key={task.id}
                  style={{
                    background: '#f7fafc',
                    border: `2px solid ${task.subjectColor}20`,
                    borderLeft: `6px solid ${task.subjectColor}`,
                    borderRadius: '12px',
                    padding: '1.5rem',
                    transition: 'all 0.3s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(4px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${task.subjectColor}30`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <div
                          onClick={() => toggleTaskCompletion(task.id)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            border: `3px solid ${task.subjectColor}`,
                            background: task.completed ? task.subjectColor : 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          {task.completed && (
                            <i className="fas fa-check" style={{ color: 'white', fontSize: '0.75rem' }}></i>
                          )}
                        </div>
                        <h3 style={{
                          margin: 0,
                          color: '#2d3748',
                          fontSize: '1.1rem',
                          fontWeight: 700,
                          textDecoration: task.completed ? 'line-through' : 'none',
                          opacity: task.completed ? 0.6 : 1,
                          transition: 'all 0.3s'
                        }}>
                          {task.title}
                        </h3>
                      </div>

                      <div style={{ marginLeft: '2.5rem' }}>
                        <p style={{ margin: '0 0 0.75rem 0', color: '#718096', fontSize: '0.9rem' }}>
                          {task.description}
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                          <span style={{
                            background: task.subjectColor,
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            {task.subject}
                          </span>
                          <span style={{
                            background: priorityColors.bg,
                            color: priorityColors.color,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>
                            {task.priority} Priority
                          </span>
                          <span style={{
                            background: difficultyColors.bg,
                            color: difficultyColors.color,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>
                            {task.difficulty}
                          </span>
                          <span style={{
                            background: '#e0e7ff',
                            color: '#3730a3',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            <i className="fas fa-clock" style={{ marginRight: '0.25rem' }}></i>
                            {task.duration} mins
                          </span>
                          {task.time && (
                            <span style={{
                              background: '#e0e7ff',
                              color: '#3730a3',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}>
                              <i className="fas fa-calendar" style={{ marginRight: '0.25rem' }}></i>
                              {task.time}
                            </span>
                          )}
                        </div>

                        {task.tags && task.tags.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                            {task.tags.map((tag, idx) => (
                              <span
                                key={idx}
                                style={{
                                  background: '#f7fafc',
                                  color: '#718096',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  border: '1px solid #e2e8f0'
                                }}
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      style={{
                        background: task.completed ? '#10ac8b' : '#094d88',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '0.5rem 1rem',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        transition: 'all 0.2s',
                        whiteSpace: 'nowrap'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                      }}
                    >
                      {task.completed ? (
                        <>
                          <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                          Completed
                        </>
                      ) : (
                        <>
                          <i className="fas fa-play" style={{ marginRight: '0.5rem' }}></i>
                          Start Task
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {selectedMode === 'weekly' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-calendar-week" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
              Weekly Study Schedule
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Your personalized weekly study timetable
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {data.weeklySchedule.slice(0, 2).map((daySchedule) => (
              <div key={daySchedule.day}>
                <div style={{
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  color: 'white',
                  borderRadius: '12px 12px 0 0',
                  padding: '1rem 1.5rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
                      {daySchedule.day}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}>
                      {new Date(daySchedule.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Total Study Time</p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '1.25rem', fontWeight: 700 }}>
                      {Math.floor(daySchedule.totalStudyTime / 60)}h {daySchedule.totalStudyTime % 60}m
                    </p>
                  </div>
                </div>

                <div style={{
                  background: '#f7fafc',
                  border: '2px solid #e2e8f0',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  padding: '1rem'
                }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {daySchedule.tasks.map((task) => (
                      <div
                        key={task.id}
                        style={{
                          background: 'white',
                          borderLeft: `4px solid ${task.subjectColor}`,
                          borderRadius: '8px',
                          padding: '1rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = `0 2px 8px ${task.subjectColor}30`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                          <div
                            onClick={() => toggleTaskCompletion(task.id)}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: `3px solid ${task.subjectColor}`,
                              background: task.completed ? task.subjectColor : 'white',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'scale(1.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                          >
                            {task.completed && (
                              <i className="fas fa-check" style={{ color: 'white', fontSize: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}></i>
                            )}
                          </div>
                          <div>
                            <h4 style={{
                              margin: '0 0 0.25rem 0',
                              color: '#2d3748',
                              fontSize: '1rem',
                              fontWeight: 600,
                              textDecoration: task.completed ? 'line-through' : 'none',
                              opacity: task.completed ? 0.6 : 1,
                              transition: 'all 0.3s'
                            }}>
                              {task.title}
                            </h4>
                            <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                              {task.chapter} • {task.duration} mins
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{
                            background: task.subjectColor,
                            color: 'white',
                            padding: '0.25rem 0.75rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem',
                            fontWeight: 600
                          }}>
                            {task.subject}
                          </span>
                          {task.time && (
                            <span style={{
                              background: '#e0e7ff',
                              color: '#3730a3',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '6px',
                              fontSize: '0.875rem',
                              fontWeight: 600
                            }}>
                              {task.time}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedMode === 'exam-prep' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {data.examPrep.map((exam) => (
            <div
              key={exam.subject}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
              }}
            >
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div>
                  <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
                    <span style={{
                      display: 'inline-block',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: exam.subjectColor,
                      marginRight: '0.75rem'
                    }}></span>
                    {exam.subject} - {exam.exam}
                  </h2>
                  <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                    Exam Date: {new Date(exam.examDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })} • {exam.daysRemaining} days remaining
                  </p>
                </div>
                <div style={{
                  background: exam.preparedness >= 80 ? '#d1fae5' : exam.preparedness >= 60 ? '#fef3c7' : '#fee2e2',
                  color: exam.preparedness >= 80 ? '#065f46' : exam.preparedness >= 60 ? '#92400e' : '#991b1b',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  fontSize: '1.25rem',
                  fontWeight: 700
                }}>
                  {exam.preparedness}% Ready
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                  Chapter-wise Preparation
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
                  {exam.chapters.map((chapter, idx) => {
                    const priorityColors = getPriorityBadgeColor(chapter.priority);
                    return (
                      <div
                        key={idx}
                        style={{
                          background: '#f7fafc',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          padding: '1rem'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                          <h4 style={{ margin: 0, color: '#2d3748', fontSize: '0.95rem', fontWeight: 600, flex: 1 }}>
                            {chapter.name}
                          </h4>
                          <span style={{
                            background: priorityColors.bg,
                            color: priorityColors.color,
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'capitalize'
                          }}>
                            {chapter.priority}
                          </span>
                        </div>
                        <div style={{ marginBottom: '0.5rem' }}>
                          <div style={{
                            width: '100%',
                            height: '8px',
                            background: '#e2e8f0',
                            borderRadius: '4px',
                            overflow: 'hidden'
                          }}>
                            <div
                              style={{
                                width: `${chapter.mastery}%`,
                                height: '100%',
                                background: exam.subjectColor,
                                borderRadius: '4px',
                                transition: 'width 0.3s'
                              }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#718096', fontSize: '0.875rem' }}>
                            Mastery: {chapter.mastery}%
                          </span>
                          <span style={{ color: '#718096', fontSize: '0.875rem' }}>
                            ~{chapter.estimatedTime} mins
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                  Mock Tests Schedule
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {exam.mockTests.map((test, idx) => (
                    <div
                      key={idx}
                      style={{
                        flex: 1,
                        background: test.completed ? '#d1fae5' : '#f7fafc',
                        border: `2px solid ${test.completed ? '#10ac8b' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        padding: '1rem',
                        textAlign: 'center'
                      }}
                    >
                      <p style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '0.95rem', fontWeight: 600 }}>
                        {test.name}
                      </p>
                      <p style={{ margin: '0 0 0.5rem 0', color: '#718096', fontSize: '0.875rem' }}>
                        {new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      {test.completed ? (
                        <span style={{
                          display: 'inline-block',
                          background: '#10ac8b',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
                          Completed {test.score && `(${test.score}%)`}
                        </span>
                      ) : (
                        <span style={{
                          display: 'inline-block',
                          background: '#e0e7ff',
                          color: '#3730a3',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '6px',
                          fontSize: '0.875rem',
                          fontWeight: 600
                        }}>
                          <i className="fas fa-clock" style={{ marginRight: '0.5rem' }}></i>
                          Upcoming
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedMode === 'performance' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-chart-line" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
              Performance Goals
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Track your progress toward achieving your target scores
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {data.performanceGoals.map((goal) => (
              <div
                key={goal.subject}
                style={{
                  background: '#f7fafc',
                  border: `2px solid ${goal.subjectColor}20`,
                  borderLeft: `6px solid ${goal.subjectColor}`,
                  borderRadius: '12px',
                  padding: '1.5rem',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = `0 4px 12px ${goal.subjectColor}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ marginBottom: '1rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                    {goal.subject}
                  </h3>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'baseline' }}>
                    <div>
                      <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>Current</p>
                      <p style={{ margin: '0.25rem 0 0 0', color: goal.subjectColor, fontSize: '1.5rem', fontWeight: 700 }}>
                        {goal.currentScore}%
                      </p>
                    </div>
                    <i className="fas fa-arrow-right" style={{ color: '#718096', fontSize: '1.25rem' }}></i>
                    <div>
                      <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>Target</p>
                      <p style={{ margin: '0.25rem 0 0 0', color: '#10ac8b', fontSize: '1.5rem', fontWeight: 700 }}>
                        {goal.targetScore}%
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: '#718096', fontSize: '0.875rem', fontWeight: 600 }}>Progress</span>
                    <span style={{ color: '#2d3748', fontSize: '0.875rem', fontWeight: 700 }}>{goal.progress}%</span>
                  </div>
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: '#e2e8f0',
                    borderRadius: '6px',
                    overflow: 'hidden'
                  }}>
                    <div
                      style={{
                        width: `${goal.progress}%`,
                        height: '100%',
                        background: goal.subjectColor,
                        borderRadius: '6px',
                        transition: 'width 0.5s ease'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>Tasks Completed</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                      {goal.completedTasks} / {goal.weeklyTasks}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>Est. Achievement</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                      {new Date(goal.estimatedAchievementDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <button
                  style={{
                    width: '100%',
                    background: goal.subjectColor,
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = `0 4px 12px ${goal.subjectColor}60`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  View Detailed Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Floating "Suggest Changes" Button */}
      <button
        onClick={() => setShowSuggestForm(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '1rem 2rem',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: 600,
          boxShadow: '0 8px 24px rgba(9, 77, 136, 0.4)',
          transition: 'all 0.3s',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px) scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(9, 77, 136, 0.5)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(9, 77, 136, 0.4)';
        }}
      >
        <i className="fas fa-lightbulb"></i>
        Suggest Changes to AI
      </button>

      {/* Suggest Changes Modal */}
      {showSuggestForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setShowSuggestForm(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '20px',
              padding: '2rem',
              maxWidth: '600px',
              width: '90%',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
              animation: 'fadeInScale 0.3s ease-out'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
                <i className="fas fa-brain" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
                Suggest Changes to AI
              </h2>
              <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
                Share your feedback to help AI optimize your study plan
              </p>
            </div>

            <textarea
              value={suggestionText}
              onChange={(e) => setSuggestionText(e.target.value)}
              placeholder="E.g., I need more time for Mathematics practice, reduce Science study time on weekdays, add more English poetry practice..."
              style={{
                width: '100%',
                minHeight: '150px',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#094d88';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <button
                onClick={handleSuggestionSubmit}
                disabled={!suggestionText.trim()}
                style={{
                  flex: 1,
                  background: suggestionText.trim()
                    ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                    : '#cbd5e0',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '0.875rem',
                  cursor: suggestionText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (suggestionText.trim()) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(9, 77, 136, 0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                Submit Suggestion
              </button>
              <button
                onClick={() => {
                  setShowSuggestForm(false);
                  setSuggestionText('');
                }}
                style={{
                  background: '#f7fafc',
                  color: '#718096',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  padding: '0.875rem 1.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e0';
                  e.currentTarget.style.background = '#edf2f7';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.background = '#f7fafc';
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS Animation */}
      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </>
  );
};

export default AIStudyPlan;
