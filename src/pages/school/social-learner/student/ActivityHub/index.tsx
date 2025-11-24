import { useState, useEffect } from 'react';
import { activities } from '../../../../../data/activities';
import { events } from '../../../../../data/activityHubEvents';
import { leadershipPositions } from '../../../../../data/leadershipPositions';
import { showcaseOpportunities } from '../../../../../data/showcaseOpportunities';
import {
  getUserActivityData,
  enrollInActivity,
  unenrollFromActivity,
  registerForEvent,
  unregisterFromEvent,
  setEventReminder,
  submitApplication,
  registerPerformance,
  getActivityStats
} from '../../../../../services/activityHubService';
import type { UserActivityData, LeadershipApplication, Performance } from '../../../../../types/activityHub';

type Tab = 'directory' | 'events' | 'achievements' | 'leadership' | 'showcase';

const ActivityHub = () => {
  const [activeTab, setActiveTab] = useState<Tab>('directory');
  const [userData, setUserData] = useState<UserActivityData>(getUserActivityData());
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all');

  const stats = getActivityStats();

  const tabs = [
    { id: 'directory', label: 'Directory', icon: 'fa-th-large' },
    { id: 'events', label: 'Events', icon: 'fa-calendar-alt' },
    { id: 'achievements', label: 'Achievements', icon: 'fa-trophy' },
    { id: 'leadership', label: 'Leadership', icon: 'fa-crown' },
    { id: 'showcase', label: 'Showcase', icon: 'fa-star' }
  ];

  const handleEnroll = (activityId: string) => {
    if (enrollInActivity(activityId)) {
      setUserData(getUserActivityData());
    }
  };

  const handleRegisterEvent = (eventId: string) => {
    if (registerForEvent(eventId)) {
      setUserData(getUserActivityData());
    }
  };

  const handleApply = (positionId: string) => {
    const application: LeadershipApplication = {
      id: `app-${Date.now()}`,
      positionId,
      studentId: 'student-001',
      applicationDate: new Date().toISOString(),
      status: 'applied',
      motivation: 'Sample motivation',
      experience: 'Sample experience',
      skills: ['Leadership', 'Communication']
    };
    if (submitApplication(application)) {
      setUserData(getUserActivityData());
      alert('Application submitted successfully!');
    }
  };

  const handleRegisterShowcase = (showcaseId: string) => {
    const performance: Performance = {
      id: `perf-${Date.now()}`,
      showcaseId,
      studentId: 'student-001',
      performanceTitle: 'My Performance',
      description: 'Performance description',
      registrationDate: new Date().toISOString(),
      status: 'registered'
    };
    if (registerPerformance(performance)) {
      setUserData(getUserActivityData());
      alert('Registered for showcase!');
    }
  };

  const filteredActivities = categoryFilter === 'all'
    ? activities
    : activities.filter(a => a.category === categoryFilter);

  const filteredEvents = eventTypeFilter === 'all'
    ? events
    : events.filter(e => e.type === eventTypeFilter);

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-users"></i> Extracurricular Activity Hub
            </h1>
            <p>Explore, participate, and excel in activities beyond the classroom</p>
          </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <i className="fas fa-th-large"></i>
              <div className="stat-info">
                <span className="stat-value">{stats.totalActivitiesEnrolled}</span>
                <span className="stat-label">Activities Enrolled</span>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-calendar-check"></i>
              <div className="stat-info">
                <span className="stat-value">{stats.totalEventsRegistered}</span>
                <span className="stat-label">Events Registered</span>
              </div>
            </div>
            <div className="stat-card">
              <i className="fas fa-trophy"></i>
              <div className="stat-info">
                <span className="stat-value">{stats.totalAchievements}</span>
                <span className="stat-label">Achievements</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{
        background: 'white',
        borderRadius: '15px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #094d88, #10ac8b)' : '#f8f9fa',
              color: activeTab === tab.id ? 'white' : '#6c757d',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ marginRight: '8px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Directory Tab */}
      {activeTab === 'directory' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{ fontSize: '20px', color: '#094d88', marginBottom: '1rem' }}>
              <i className="fas fa-filter" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
              Filter Activities
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['all', 'sports', 'arts', 'academic', 'social', 'tech', 'cultural', 'service'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '25px',
                    border: categoryFilter === cat ? 'none' : '2px solid #e9ecef',
                    background: categoryFilter === cat ? 'linear-gradient(135deg, #094d88, #10ac8b)' : 'white',
                    color: categoryFilter === cat ? 'white' : '#6c757d',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {cat === 'all' ? 'All Activities' : cat}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {filteredActivities.map(activity => {
              const isEnrolled = userData.enrolledActivities.includes(activity.id);
              return (
                <div key={activity.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: isEnrolled ? '2px solid #10ac8b' : 'none',
                  transition: 'transform 0.3s ease'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '18px', color: '#094d88', margin: 0 }}>{activity.name}</h3>
                    {isEnrolled && (
                      <span style={{
                        background: '#10ac8b',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-check"></i> Enrolled
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '1rem' }}>{activity.description}</p>

                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0.5rem' }}>
                    <i className="fas fa-user" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    {activity.instructor}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0.5rem' }}>
                    <i className="fas fa-clock" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    {activity.schedule}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '1rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    {activity.location}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '13px', color: '#6c757d' }}>
                      {activity.currentParticipants} / {activity.maxCapacity} enrolled
                    </span>
                    <span style={{
                      background: activity.skillLevel === 'beginner' ? '#10b981' : activity.skillLevel === 'intermediate' ? '#f59e0b' : '#ef4444',
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {activity.skillLevel}
                    </span>
                  </div>

                  <button
                    onClick={() => handleEnroll(activity.id)}
                    disabled={isEnrolled || activity.enrollmentStatus === 'full'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: isEnrolled ? '#e9ecef' : activity.enrollmentStatus === 'full' ? '#6c757d' : 'linear-gradient(135deg, #094d88, #10ac8b)',
                      color: isEnrolled ? '#6c757d' : 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isEnrolled || activity.enrollmentStatus === 'full' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isEnrolled ? 'Already Enrolled' : activity.enrollmentStatus === 'full' ? 'Full' : 'Enroll Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            marginBottom: '2rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
          }}>
            <h2 style={{ fontSize: '20px', color: '#094d88', marginBottom: '1rem' }}>
              <i className="fas fa-filter" style={{ marginRight: '10px', color: '#10ac8b' }}></i>
              Filter Events
            </h2>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {['all', 'competition', 'workshop', 'seminar', 'performance', 'sports', 'cultural'].map(type => (
                <button
                  key={type}
                  onClick={() => setEventTypeFilter(type)}
                  style={{
                    padding: '0.5rem 1.25rem',
                    borderRadius: '25px',
                    border: eventTypeFilter === type ? 'none' : '2px solid #e9ecef',
                    background: eventTypeFilter === type ? 'linear-gradient(135deg, #094d88, #10ac8b)' : 'white',
                    color: eventTypeFilter === type ? 'white' : '#6c757d',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {type === 'all' ? 'All Events' : type}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {filteredEvents.map(event => {
              const isRegistered = userData.registeredEvents.includes(event.id);
              return (
                <div key={event.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: isRegistered ? '2px solid #10ac8b' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: '20px', color: '#094d88', margin: '0 0 0.5rem 0' }}>{event.title}</h3>
                      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>
                          <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                          {new Date(event.date).toLocaleDateString()}
                        </span>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>
                          <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                          {event.time}
                        </span>
                        <span style={{ fontSize: '14px', color: '#6c757d' }}>
                          <i className="fas fa-map-marker-alt" style={{ marginRight: '6px' }}></i>
                          {event.venue}
                        </span>
                      </div>
                    </div>
                    {isRegistered && (
                      <span style={{
                        background: '#10ac8b',
                        color: 'white',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '600'
                      }}>
                        <i className="fas fa-check"></i> Registered
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '1rem' }}>{event.description}</p>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <span style={{
                      background: '#e9f7f4',
                      color: '#10ac8b',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      textTransform: 'capitalize'
                    }}>
                      {event.type}
                    </span>
                    <span style={{ fontSize: '13px', color: '#6c757d' }}>
                      Deadline: {new Date(event.registrationDeadline).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRegisterEvent(event.id)}
                    disabled={isRegistered || event.registrationStatus === 'closed'}
                    style={{
                      padding: '0.75rem 2rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: isRegistered ? '#e9ecef' : event.registrationStatus === 'closed' ? '#6c757d' : 'linear-gradient(135deg, #094d88, #10ac8b)',
                      color: isRegistered ? '#6c757d' : 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: isRegistered || event.registrationStatus === 'closed' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {isRegistered ? 'Already Registered' : event.registrationStatus === 'closed' ? 'Registration Closed' : 'Register Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Achievements Tab */}
      {activeTab === 'achievements' && (
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '3rem 2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #094d88, #10ac8b)',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            color: 'white'
          }}>
            <i className="fas fa-trophy"></i>
          </div>
          <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1rem' }}>Achievements & Certificates</h2>
          <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '2rem' }}>
            Your achievements from activities and events will be displayed here
          </p>
          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '12px',
            padding: '1rem'
          }}>
            <p style={{ fontSize: '14px', color: '#856404', margin: 0 }}>
              <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
              Participate in activities and events to earn certificates and achievements!
            </p>
          </div>
        </div>
      )}

      {/* Leadership Tab */}
      {activeTab === 'leadership' && (
        <div>
          <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
            <i className="fas fa-crown" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
            Leadership Positions
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {leadershipPositions.map(position => {
              const hasApplied = userData.applications.some(app => app.positionId === position.id);
              return (
                <div key={position.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: hasApplied ? '2px solid #10ac8b' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', color: '#094d88', margin: '0 0 0.25rem 0', textTransform: 'capitalize' }}>
                        {position.positionTitle.replace('-', ' ')}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#10ac8b', margin: 0, fontWeight: '600' }}>
                        {position.activityName}
                      </p>
                    </div>
                    {hasApplied && (
                      <span style={{
                        background: '#10ac8b',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        height: 'fit-content'
                      }}>
                        Applied
                      </span>
                    )}
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <strong style={{ fontSize: '13px', color: '#094d88' }}>Responsibilities:</strong>
                    <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                      {position.responsibilities.slice(0, 3).map((resp, idx) => (
                        <li key={idx} style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0.25rem' }}>{resp}</li>
                      ))}
                    </ul>
                  </div>

                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0.5rem' }}>
                    <i className="fas fa-calendar" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    Deadline: {new Date(position.applicationDeadline).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '1rem' }}>
                    <i className="fas fa-clock" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    {position.timeCommitment}
                  </div>

                  <button
                    onClick={() => handleApply(position.id)}
                    disabled={hasApplied || position.status === 'closed'}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: hasApplied ? '#e9ecef' : position.status === 'closed' ? '#6c757d' : 'linear-gradient(135deg, #094d88, #10ac8b)',
                      color: hasApplied ? '#6c757d' : 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: hasApplied || position.status === 'closed' ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {hasApplied ? 'Application Submitted' : position.status === 'closed' ? 'Closed' : 'Apply Now'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Showcase Tab */}
      {activeTab === 'showcase' && (
        <div>
          <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
            <i className="fas fa-star" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
            Talent Showcase Opportunities
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {showcaseOpportunities.map(showcase => {
              const hasRegistered = userData.performances.some(perf => perf.showcaseId === showcase.id);
              return (
                <div key={showcase.id} style={{
                  background: 'white',
                  borderRadius: '15px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                  border: hasRegistered ? '2px solid #10ac8b' : 'none'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '18px', color: '#094d88', margin: 0 }}>{showcase.title}</h3>
                    {hasRegistered && (
                      <span style={{
                        background: '#10ac8b',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        Registered
                      </span>
                    )}
                  </div>

                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '1rem' }}>{showcase.description}</p>

                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0.5rem' }}>
                    <i className="fas fa-calendar" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    {new Date(showcase.date).toLocaleDateString()} at {showcase.time}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0.5rem' }}>
                    <i className="fas fa-map-marker-alt" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    {showcase.venue}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6c757d', marginBottom: '1rem' }}>
                    <i className="fas fa-users" style={{ marginRight: '6px', color: '#094d88' }}></i>
                    {showcase.slotsAvailable} / {showcase.totalSlots} slots available
                  </div>

                  {showcase.prizes && (
                    <div style={{
                      background: '#fff3cd',
                      border: '2px solid #ffc107',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      marginBottom: '1rem'
                    }}>
                      <strong style={{ fontSize: '13px', color: '#856404' }}>Prizes:</strong>
                      <ul style={{ marginTop: '0.25rem', paddingLeft: '1.5rem', marginBottom: 0 }}>
                        {showcase.prizes.map((prize, idx) => (
                          <li key={idx} style={{ fontSize: '12px', color: '#856404' }}>{prize}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => handleRegisterShowcase(showcase.id)}
                    disabled={hasRegistered || showcase.slotsAvailable === 0}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '10px',
                      border: 'none',
                      background: hasRegistered ? '#e9ecef' : showcase.slotsAvailable === 0 ? '#6c757d' : 'linear-gradient(135deg, #094d88, #10ac8b)',
                      color: hasRegistered ? '#6c757d' : 'white',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: hasRegistered || showcase.slotsAvailable === 0 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {hasRegistered ? 'Already Registered' : showcase.slotsAvailable === 0 ? 'Slots Full' : 'Register to Perform'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ActivityHub;
