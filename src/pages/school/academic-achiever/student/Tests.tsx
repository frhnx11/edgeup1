import { useState } from 'react';
import { TN_BOARD_10TH_TEST_TEMPLATES } from '../../data/tn-board-10th-resources';
import type { TestTemplate } from '../../types/curriculum.types';

const Tests = () => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'upcoming' | 'live' | 'completed' | 'missed'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  // Use centralized test data
  const tests: TestTemplate[] = TN_BOARD_10TH_TEST_TEMPLATES;

  const statusColors = {
    upcoming: { bg: '#f59e0b', text: 'Upcoming' },
    live: { bg: '#ef4444', text: 'Live Now' },
    completed: { bg: '#10ac8b', text: 'Completed' },
    missed: { bg: '#718096', text: 'Missed' }
  };

  const typeColors = {
    quiz: '#06b6d4',
    midterm: '#8b5cf6',
    final: '#ef4444',
    assignment: '#10ac8b',
    practice: '#f59e0b'
  };

  const typeIcons = {
    quiz: 'fa-question-circle',
    midterm: 'fa-file-alt',
    final: 'fa-trophy',
    assignment: 'fa-tasks',
    practice: 'fa-dumbbell'
  };

  const filteredTests = tests.filter(test => {
    const matchesStatus = selectedFilter === 'all' || test.status === selectedFilter;
    const matchesType = selectedType === 'all' || test.type === selectedType;
    return matchesStatus && matchesType;
  });

  const getStatusCount = (status: string) => {
    return tests.filter(t => t.status === status).length;
  };

  const handleStartTest = (test: Test) => {
    alert(`Starting test: ${test.title}`);
  };

  const completedTests = tests.filter(t => t.status === 'completed');
  const averageScore = completedTests.length > 0
    ? Math.round(
        completedTests.reduce((sum, t) => sum + ((t.obtainedMarks || 0) / t.totalMarks) * 100, 0) /
        completedTests.length
      )
    : 0;

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-clipboard-check" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Tests & Assessments
            </h1>
            <p>Track and manage all your tests, quizzes, and assignments</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-star" style={{ color: 'white' }}></i>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
                Average: {averageScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="stat-info">
              <h4>Upcoming Tests</h4>
              <p className="stat-value">
                {getStatusCount('upcoming')} <span className="stat-total">scheduled</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '70%' }}></div>
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
                {getStatusCount('completed')} <span className="stat-total">tests</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <h4>Success Rate</h4>
              <p className="stat-value">
                {averageScore} <span className="stat-total">percent</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${averageScore}%` }}></div>
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
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value as any)}
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
              <option value="all">All Tests ({tests.length})</option>
              <option value="upcoming">Upcoming ({getStatusCount('upcoming')})</option>
              <option value="live">Live ({getStatusCount('live')})</option>
              <option value="completed">Completed ({getStatusCount('completed')})</option>
              <option value="missed">Missed ({getStatusCount('missed')})</option>
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-layer-group"></i> Filter by Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
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
              <option value="all">All Types</option>
              <option value="quiz">Quiz</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="assignment">Assignment</option>
              <option value="practice">Practice</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setSelectedFilter('all');
                setSelectedType('all');
              }}
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
              <i className="fas fa-redo"></i> Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, color: '#718096', fontSize: '1rem', fontWeight: 600 }}>
          Showing <span style={{ color: '#10ac8b', fontWeight: 700 }}>{filteredTests.length}</span> of {tests.length} tests
        </p>
      </div>

      {/* Tests Grid */}
      {filteredTests.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredTests.map((test) => (
            <div
              key={test.id}
              style={{
                background: 'white',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                border: '2px solid #f7fafc',
                transition: 'all 0.3s',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.borderColor = typeColors[test.type];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
                e.currentTarget.style.borderColor = '#f7fafc';
              }}
            >
              {/* Status Badge */}
              <div style={{
                position: 'absolute',
                top: '1.5rem',
                right: '1.5rem',
                background: statusColors[test.status].bg,
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                zIndex: 10
              }}>
                {test.status === 'live' && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'white',
                    borderRadius: '50%',
                    animation: 'pulse 2s infinite'
                  }}></div>
                )}
                {statusColors[test.status].text}
              </div>

              {/* Test Header */}
              <div style={{
                background: `linear-gradient(135deg, ${typeColors[test.type]} 0%, ${typeColors[test.type]}dd 100%)`,
                padding: '2rem',
                paddingTop: '3.5rem',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-40px',
                  right: '-40px',
                  width: '180px',
                  height: '180px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%',
                  filter: 'blur(40px)'
                }}></div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '18px',
                    border: '3px solid rgba(255, 255, 255, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
                  }}>
                    <i className={`fas ${typeIcons[test.type]}`} style={{ color: 'white', fontSize: '2rem' }}></i>
                  </div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 }}>
                    {test.title}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 600
                    }}>
                      {test.subject}
                    </span>
                    <span style={{
                      background: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      padding: '0.375rem 0.75rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {test.type}
                    </span>
                  </div>
                </div>
              </div>

              {/* Test Content */}
              <div style={{ padding: '1.5rem' }}>
                <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  {test.description}
                </p>

                {/* Test Info Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}>
                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Date & Time
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#2d3748', fontWeight: 700 }}>
                      <i className="fas fa-calendar" style={{ marginRight: '0.5rem', color: typeColors[test.type] }}></i>
                      {new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.85rem', color: '#2d3748', fontWeight: 700 }}>
                      <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: typeColors[test.type] }}></i>
                      {test.time}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Duration
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#2d3748', fontWeight: 700 }}>
                      <i className="fas fa-hourglass-half" style={{ marginRight: '0.5rem', color: typeColors[test.type] }}></i>
                      {test.duration}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Total Marks
                    </p>
                    <p style={{ margin: 0, fontSize: '1.25rem', color: typeColors[test.type], fontWeight: 700 }}>
                      {test.totalMarks}
                    </p>
                  </div>

                  <div style={{
                    background: '#f7fafc',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Questions
                    </p>
                    <p style={{ margin: 0, fontSize: '1.25rem', color: typeColors[test.type], fontWeight: 700 }}>
                      {test.questions}
                    </p>
                  </div>
                </div>


                {/* Teacher Info */}
                <div style={{
                  background: '#f7fafc',
                  padding: '0.75rem 1rem',
                  borderRadius: '12px',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-chalkboard-teacher" style={{ color: '#094d88', fontSize: '1rem' }}></i>
                  <span style={{ fontSize: '0.85rem', color: '#2d3748', fontWeight: 600 }}>
                    {test.teacher}
                  </span>
                </div>

                {/* Action Button */}
                {test.status === 'upcoming' && (
                  <button
                    onClick={() => handleStartTest(test)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: `linear-gradient(90deg, ${typeColors[test.type]} 0%, ${typeColors[test.type]}dd 100%)`,
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: `0 4px 12px ${typeColors[test.type]}40`
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = `0 6px 16px ${typeColors[test.type]}50`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = `0 4px 12px ${typeColors[test.type]}40`;
                    }}
                  >
                    <i className="fas fa-calendar-check"></i>
                    Scheduled for {new Date(test.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </button>
                )}

                {test.status === 'live' && (
                  <button
                    onClick={() => handleStartTest(test)}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'linear-gradient(90deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                      animation: 'pulse-button 2s infinite'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(239, 68, 68, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                    }}
                  >
                    <i className="fas fa-play-circle"></i>
                    Start Test Now
                  </button>
                )}

                {test.status === 'completed' && (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#10ac8b',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      opacity: 0.7
                    }}
                  >
                    <i className="fas fa-check-circle"></i>
                    Test Completed
                  </button>
                )}

                {test.status === 'missed' && (
                  <button
                    disabled
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: '#e2e8f0',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#718096',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <i className="fas fa-times-circle"></i>
                    Test Missed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
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
            <i className="fas fa-inbox" style={{ fontSize: '2rem', color: '#718096' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            No Tests Found
          </h3>
          <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
            Try adjusting your filters to see more tests
          </p>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-dot {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes pulse-button {
          0%, 100% {
            box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
          }
          50% {
            box-shadow: 0 4px 20px rgba(239, 68, 68, 0.6);
          }
        }
      `}</style>
    </>
  );
};

export default Tests;
