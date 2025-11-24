import { useState } from 'react';
import { TN_BOARD_10TH_CURRICULUM } from '../../data/tn-board-10th-curriculum';
import type { CurriculumSubject } from '../../types/curriculum.types';

const Syllabus = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [expandedUnits, setExpandedUnits] = useState<string[]>([]);

  // Use centralized curriculum data
  const subjects: CurriculumSubject[] = TN_BOARD_10TH_CURRICULUM;

  const toggleUnit = (unitId: string) => {
    if (expandedUnits.includes(unitId)) {
      setExpandedUnits(expandedUnits.filter(id => id !== unitId));
    } else {
      setExpandedUnits([...expandedUnits, unitId]);
    }
  };

  const selectedSubjectData = subjects.find(s => s.id === selectedSubject);

  const overallProgress = Math.round(
    (subjects.reduce((sum, s) => sum + s.completedTopics, 0) /
     subjects.reduce((sum, s) => sum + s.totalTopics, 0)) * 100
  );

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-book-open" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Course Syllabus
            </h1>
            <p>Track your curriculum progress across all subjects</p>
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
              <i className="fas fa-chart-line" style={{ color: 'white' }}></i>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
                {overallProgress}% Complete
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-info">
              <h4>Total Subjects</h4>
              <p className="stat-value">
                {subjects.length} <span className="stat-total">courses</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-list-ul"></i>
            </div>
            <div className="stat-info">
              <h4>Total Topics</h4>
              <p className="stat-value">
                {subjects.reduce((sum, s) => sum + s.totalTopics, 0)} <span className="stat-total">topics</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
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
                {subjects.reduce((sum, s) => sum + s.completedTopics, 0)} <span className="stat-total">topics</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${overallProgress}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Selection or Detail View */}
      {!selectedSubject ? (
        <>
          {/* Subject Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}>
            {subjects.map((subject) => (
              <div
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.2s'
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
                {/* Subject Header */}
                <div style={{
                  background: '#f7fafc',
                  padding: '1.5rem',
                  borderBottom: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'start', gap: '1rem' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: '#094d88',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className={`fas ${subject.icon}`} style={{ color: 'white', fontSize: '1.5rem' }}></i>
                    </div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ margin: '0 0 0.25rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 600 }}>
                        {subject.name}
                      </h3>
                      <p style={{ margin: '0 0 0.25rem 0', color: '#718096', fontSize: '0.8rem', fontWeight: 600 }}>
                        {subject.code}
                      </p>
                      <p style={{ margin: 0, color: '#718096', fontSize: '0.8rem' }}>
                        <i className="fas fa-chalkboard-teacher" style={{ marginRight: '0.5rem' }}></i>
                        {subject.teacher}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subject Info */}
                <div style={{ padding: '1.5rem' }}>
                  {/* Progress Bar */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <span style={{ fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>
                        Course Progress
                      </span>
                      <span style={{ fontSize: '0.875rem', color: subject.color, fontWeight: 700 }}>
                        {subject.progress}%
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '10px',
                      background: '#f7fafc',
                      borderRadius: '10px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${subject.progress}%`,
                        height: '100%',
                        background: `linear-gradient(90deg, ${subject.color} 0%, ${subject.color}dd 100%)`,
                        borderRadius: '10px',
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>

                  {/* Stats */}
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
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', color: subject.color, fontWeight: 700 }}>
                        {subject.totalTopics}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
                        Total Topics
                      </p>
                    </div>
                    <div style={{
                      background: '#f7fafc',
                      padding: '1rem',
                      borderRadius: '12px',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: '0 0 0.25rem 0', fontSize: '1.5rem', color: '#10ac8b', fontWeight: 700 }}>
                        {subject.completedTopics}
                      </p>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: '#718096', fontWeight: 600 }}>
                        Completed
                      </p>
                    </div>
                  </div>

                  {/* View Button */}
                  <button
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: `linear-gradient(90deg, ${subject.color} 0%, ${subject.color}dd 100%)`,
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s',
                      boxShadow: `0 4px 12px ${subject.color}40`
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    View Syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Back Button */}
          <button
            onClick={() => setSelectedSubject(null)}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'white',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              color: '#2d3748',
              fontSize: '0.9rem',
              fontWeight: 700,
              cursor: 'pointer',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#094d88';
              e.currentTarget.style.color = '#094d88';
              e.currentTarget.style.background = '#f7fafc';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
              e.currentTarget.style.color = '#2d3748';
              e.currentTarget.style.background = 'white';
            }}
          >
            <i className="fas fa-arrow-left"></i>
            Back to All Subjects
          </button>

          {/* Subject Detail Header */}
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            border: `3px solid ${selectedSubjectData?.color}`
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${selectedSubjectData?.color} 0%, ${selectedSubjectData?.color}dd 100%)`,
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 8px 20px ${selectedSubjectData?.color}40`
              }}>
                <i className={`fas ${selectedSubjectData?.icon}`} style={{ color: 'white', fontSize: '2.5rem' }}></i>
              </div>
              <div>
                <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '2rem', fontWeight: 700 }}>
                  {selectedSubjectData?.name}
                </h2>
                <p style={{ margin: '0 0 0.25rem 0', color: '#718096', fontSize: '1rem', fontWeight: 600 }}>
                  {selectedSubjectData?.code} • {selectedSubjectData?.teacher}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <span style={{ fontSize: '1rem', color: '#2d3748', fontWeight: 700 }}>
                  Overall Progress
                </span>
                <span style={{ fontSize: '1.25rem', color: selectedSubjectData?.color, fontWeight: 700 }}>
                  {selectedSubjectData?.completedTopics} / {selectedSubjectData?.totalTopics} Topics ({selectedSubjectData?.progress}%)
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '16px',
                background: '#f7fafc',
                borderRadius: '16px',
                overflow: 'hidden',
                border: '2px solid #e2e8f0'
              }}>
                <div style={{
                  width: `${selectedSubjectData?.progress}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${selectedSubjectData?.color} 0%, ${selectedSubjectData?.color}dd 100%)`,
                  borderRadius: '16px',
                  transition: 'width 0.3s'
                }}></div>
              </div>
            </div>
          </div>

          {/* Units and Topics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {selectedSubjectData?.units.map((unit, unitIndex) => (
              <div
                key={unit.id}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  overflow: 'hidden',
                  border: '2px solid #f7fafc'
                }}
              >
                {/* Unit Header */}
                <div
                  onClick={() => toggleUnit(unit.id)}
                  style={{
                    background: `linear-gradient(135deg, ${selectedSubjectData.color}15 0%, ${selectedSubjectData.color}05 100%)`,
                    padding: '1.5rem 2rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderBottom: expandedUnits.includes(unit.id) ? '2px solid #f7fafc' : 'none',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${selectedSubjectData.color}25 0%, ${selectedSubjectData.color}10 100%)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `linear-gradient(135deg, ${selectedSubjectData.color}15 0%, ${selectedSubjectData.color}05 100%)`;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: selectedSubjectData.color,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.25rem',
                      fontWeight: 700
                    }}>
                      {unitIndex + 1}
                    </div>
                    <div>
                      <h3 style={{ margin: '0 0 0.25rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                        {unit.title}
                      </h3>
                      <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem', fontWeight: 600 }}>
                        {unit.topics.length} topics • {unit.topics.filter(t => t.completed).length} completed
                      </p>
                    </div>
                  </div>
                  <i className={`fas fa-chevron-${expandedUnits.includes(unit.id) ? 'up' : 'down'}`}
                     style={{ color: selectedSubjectData.color, fontSize: '1.25rem', transition: 'transform 0.3s' }}></i>
                </div>

                {/* Topics List */}
                {expandedUnits.includes(unit.id) && (
                  <div style={{ padding: '1.5rem 2rem' }}>
                    {unit.topics.map((topic, topicIndex) => (
                      <div
                        key={topic.id}
                        style={{
                          padding: '1.5rem',
                          marginBottom: topicIndex < unit.topics.length - 1 ? '1rem' : 0,
                          background: topic.completed ? '#f0fdf8' : '#f7fafc',
                          borderRadius: '16px',
                          border: `2px solid ${topic.completed ? '#10ac8b' : '#e2e8f0'}`,
                          transition: 'all 0.3s'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                              <div style={{
                                width: '28px',
                                height: '28px',
                                background: topic.completed ? '#10ac8b' : '#e2e8f0',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 700
                              }}>
                                {topic.completed ? <i className="fas fa-check"></i> : topicIndex + 1}
                              </div>
                              <h4 style={{ margin: 0, color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
                                {topic.title}
                              </h4>
                            </div>
                            <p style={{ margin: '0 0 0.5rem 0', paddingLeft: '2.25rem', color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>
                              {topic.description}
                            </p>
                          </div>
                          <div style={{
                            background: 'white',
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: '2px solid #e2e8f0',
                            marginLeft: '1rem',
                            whiteSpace: 'nowrap'
                          }}>
                            <i className="fas fa-clock" style={{ marginRight: '0.5rem', color: selectedSubjectData.color }}></i>
                            <span style={{ fontSize: '0.85rem', color: '#2d3748', fontWeight: 600 }}>
                              {topic.duration}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Syllabus;
