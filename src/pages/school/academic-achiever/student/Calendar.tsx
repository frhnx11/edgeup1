import { useState } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'class' | 'test' | 'assignment' | 'event' | 'holiday';
  time?: string;
  subject?: string;
  description?: string;
}

interface DayData {
  date: number;
  events: CalendarEvent[];
}

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    type: 'class' as CalendarEvent['type'],
    time: '',
    subject: '',
    description: ''
  });

  // Sample events data (now as state for adding/deleting)
  const [eventsData, setEventsData] = useState<{ [key: number]: CalendarEvent[] }>({
    15: [
      { id: '1', title: 'Mathematics Test', type: 'test', time: '09:00 AM', subject: 'Mathematics', description: 'Chapter 5-7 Calculus' },
      { id: '2', title: 'Physics Class', type: 'class', time: '11:00 AM', subject: 'Physics' }
    ],
    18: [
      { id: '3', title: 'Chemistry Assignment Due', type: 'assignment', time: '11:59 PM', subject: 'Chemistry', description: 'Lab Report Submission' }
    ],
    21: [
      { id: '4', title: 'Science Fair', type: 'event', time: '10:00 AM', description: 'Annual Science Exhibition' },
      { id: '5', title: 'English Literature Class', type: 'class', time: '02:00 PM', subject: 'English' }
    ],
    22: [
      { id: '6', title: 'Biology Test', type: 'test', time: '09:00 AM', subject: 'Biology', description: 'Cell Biology & Genetics' }
    ],
    25: [
      { id: '7', title: 'Christmas Holiday', type: 'holiday', description: 'School Closed' }
    ],
    28: [
      { id: '8', title: 'History Assignment Due', type: 'assignment', time: '11:59 PM', subject: 'History' }
    ],
    30: [
      { id: '9', title: 'Parent-Teacher Meeting', type: 'event', time: '03:00 PM', description: 'Semester Review' }
    ]
  });

  // Open modal for a specific day
  const handleDayClick = (day: number) => {
    setSelectedDay(day);
    setShowEventModal(true);
    setEventFormData({
      title: '',
      type: 'class',
      time: '',
      subject: '',
      description: ''
    });
  };

  // Add new event
  const handleAddEvent = () => {
    if (!selectedDay || !eventFormData.title) return;

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title: eventFormData.title,
      type: eventFormData.type,
      time: eventFormData.time || undefined,
      subject: eventFormData.subject || undefined,
      description: eventFormData.description || undefined
    };

    setEventsData(prev => ({
      ...prev,
      [selectedDay]: [...(prev[selectedDay] || []), newEvent]
    }));

    setShowEventModal(false);
    setEventFormData({
      title: '',
      type: 'class',
      time: '',
      subject: '',
      description: ''
    });
  };

  // Delete event
  const handleDeleteEvent = (eventId: string) => {
    if (!selectedDay) return;

    setEventsData(prev => ({
      ...prev,
      [selectedDay]: (prev[selectedDay] || []).filter(event => event.id !== eventId)
    }));
  };

  const today = new Date().getDate();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  const actualToday = new Date();

  // Month navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date().getDate());
  };

  // Get today's events (only if viewing current month)
  const isCurrentMonth =
    currentDate.getMonth() === actualToday.getMonth() &&
    currentDate.getFullYear() === actualToday.getFullYear();
  const todayEvents = isCurrentMonth ? (eventsData[today] || []) : [];

  // Get calendar days for current month
  const daysInMonth = new Date(currentYear, currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentDate.getMonth(), 1).getDay();

  const calendarDays: (DayData | null)[] = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push({
      date: day,
      events: eventsData[day] || []
    });
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'test': return '#ef4444';
      case 'assignment': return '#f59e0b';
      case 'class': return '#10ac8b';
      case 'event': return '#667eea';
      case 'holiday': return '#ec4899';
      default: return '#718096';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'test': return 'fa-clipboard-check';
      case 'assignment': return 'fa-file-alt';
      case 'class': return 'fa-book-open';
      case 'event': return 'fa-calendar-star';
      case 'holiday': return 'fa-umbrella-beach';
      default: return 'fa-circle';
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-calendar-alt" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Academic Calendar
            </h1>
            <p>Stay organized with your schedule and upcoming events</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>Today</p>
              <h3 style={{ margin: '0.25rem 0 0 0', fontSize: '1.5rem', fontWeight: 700 }}>
                {today} {currentMonth.slice(0, 3)}
              </h3>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>This Month</h4>
              <p className="stat-value">
                {Object.values(eventsData).flat().length} <span className="stat-total">events</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clipboard-check"></i>
            </div>
            <div className="stat-info">
              <h4>Tests Scheduled</h4>
              <p className="stat-value">
                {Object.values(eventsData).flat().filter(e => e.type === 'test').length} <span className="stat-total">tests</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-tasks"></i>
            </div>
            <div className="stat-info">
              <h4>Assignments Due</h4>
              <p className="stat-value">
                {Object.values(eventsData).flat().filter(e => e.type === 'assignment').length} <span className="stat-total">pending</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Highlights */}
      {todayEvents.length > 0 && (
        <div style={{
          background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
          borderRadius: '12px',
          padding: '1rem 1.5rem',
          marginBottom: '1.5rem',
          boxShadow: '0 4px 16px rgba(9, 77, 136, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}>
              <i className="fas fa-star" style={{ fontSize: '1.125rem', color: 'white' }}></i>
            </div>
            <div>
              <h3 style={{ margin: 0, color: 'white', fontSize: '1.125rem', fontWeight: 700 }}>
                Today's Schedule
              </h3>
              <p style={{ margin: '0.125rem 0 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.875rem' }}>
                {todayEvents.length} event{todayEvents.length > 1 ? 's' : ''} planned
              </p>
            </div>
          </div>

          <div style={{
            flex: 1,
            display: 'flex',
            gap: '0.75rem',
            flexWrap: 'wrap',
            minWidth: '300px'
          }}>
            {todayEvents.map((event) => (
              <div
                key={event.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '8px',
                  padding: '0.625rem 0.875rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  transition: 'all 0.2s',
                  flex: '1 1 auto'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  background: getEventColor(event.type),
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className={`fas ${getEventIcon(event.type)}`} style={{ color: 'white', fontSize: '0.875rem' }}></i>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h4 style={{ margin: 0, color: 'white', fontSize: '0.9rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {event.title}
                  </h4>
                  {event.time && (
                    <p style={{ margin: '0.125rem 0 0 0', color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.8rem' }}>
                      <i className="fas fa-clock" style={{ marginRight: '0.375rem', fontSize: '0.7rem' }}></i>
                      {event.time}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '2rem'
      }}>
        {/* Calendar Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem',
          paddingBottom: '1.5rem',
          borderBottom: '2px solid #f7fafc'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              {currentMonth} {currentYear}
            </h2>
            <p style={{ margin: '0.25rem 0 0 0', color: '#718096', fontSize: '0.9rem' }}>
              Academic Calendar View
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={goToPreviousMonth}
              style={{
                padding: '0.75rem 1.25rem',
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                color: '#2d3748',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-chevron-left"></i>
            </button>
            <button
              onClick={goToToday}
              style={{
                padding: '0.75rem 1.25rem',
                background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              Today
            </button>
            <button
              onClick={goToNextMonth}
              style={{
                padding: '0.75rem 1.25rem',
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                color: '#2d3748',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Weekday Headers */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1rem',
          marginBottom: '1rem'
        }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day) => (
            <div
              key={day}
              style={{
                textAlign: 'center',
                padding: '1rem 0',
                color: '#718096',
                fontSize: '0.875rem',
                fontWeight: 700,
                letterSpacing: '0.05em'
              }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '1rem'
        }}>
          {calendarDays.map((day, index) => {
            const isToday = day && isCurrentMonth && day.date === today;
            return (
              <div
                key={index}
                onClick={() => {
                  if (day) {
                    setSelectedDate(day.date);
                    handleDayClick(day.date);
                  }
                }}
                style={{
                  minHeight: '120px',
                  padding: day ? '1rem' : '0',
                  background: day
                    ? isToday
                      ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                      : day.date === selectedDate
                      ? '#f7fafc'
                      : 'white'
                    : 'transparent',
                  border: day ? (isToday || day.date === selectedDate ? 'none' : '2px solid #e2e8f0') : 'none',
                  borderRadius: '12px',
                  cursor: day ? 'pointer' : 'default',
                  transition: 'all 0.3s',
                  position: 'relative',
                  boxShadow: isToday ? '0 8px 24px rgba(9, 77, 136, 0.3)' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (day && !isToday) {
                    e.currentTarget.style.background = '#f7fafc';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (day && !isToday && day.date !== selectedDate) {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {day && (
                  <>
                    <div style={{
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: isToday ? 'white' : '#2d3748',
                      marginBottom: '0.5rem'
                    }}>
                      {day.date}
                    </div>
                    {day.events.length > 0 && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            style={{
                              background: isToday ? 'rgba(255, 255, 255, 0.2)' : getEventColor(event.type),
                              color: 'white',
                              padding: '0.375rem 0.5rem',
                              borderRadius: '6px',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                              border: isToday ? '1px solid rgba(255, 255, 255, 0.3)' : 'none'
                            }}
                            title={event.title}
                          >
                            <i className={`fas ${getEventIcon(event.type)}`} style={{ marginRight: '0.25rem', fontSize: '0.7rem' }}></i>
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div style={{
                            color: isToday ? 'rgba(255, 255, 255, 0.9)' : '#718096',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            marginTop: '0.25rem'
                          }}>
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Legend */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '1.5rem 2rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '2rem',
        alignItems: 'center'
      }}>
        <h4 style={{ margin: 0, color: '#2d3748', fontSize: '0.9rem', fontWeight: 700 }}>
          <i className="fas fa-info-circle" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
          Event Types:
        </h4>
        {[
          { type: 'class', label: 'Classes' },
          { type: 'test', label: 'Tests' },
          { type: 'assignment', label: 'Assignments' },
          { type: 'event', label: 'Events' },
          { type: 'holiday', label: 'Holidays' }
        ].map((item) => (
          <div key={item.type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '16px',
              height: '16px',
              background: getEventColor(item.type),
              borderRadius: '4px'
            }}></div>
            <span style={{ color: '#718096', fontSize: '0.875rem', fontWeight: 500 }}>
              {item.label}
            </span>
          </div>
        ))}
      </div>

      {/* Event Management Modal */}
      {showEventModal && selectedDay && (
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
          onClick={() => setShowEventModal(false)}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '16px',
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
              padding: '1.5rem 2rem',
              borderBottom: '2px solid #f7fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
              borderRadius: '16px 16px 0 0'
            }}>
              <div>
                <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                  <i className="fas fa-calendar-day" style={{ marginRight: '0.75rem' }}></i>
                  {currentMonth} {selectedDay}, {currentYear}
                </h2>
                <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.9rem' }}>
                  Manage events for this day
                </p>
              </div>
              <button
                onClick={() => setShowEventModal(false)}
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

            {/* Modal Content */}
            <div style={{ padding: '2rem' }}>
              {/* Existing Events */}
              {eventsData[selectedDay] && eventsData[selectedDay].length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
                    <i className="fas fa-list" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                    Existing Events
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {eventsData[selectedDay].map((event) => (
                      <div
                        key={event.id}
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
                          width: '40px',
                          height: '40px',
                          background: getEventColor(event.type),
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <i className={`fas ${getEventIcon(event.type)}`} style={{ color: 'white', fontSize: '1.125rem' }}></i>
                        </div>
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: 0, color: '#2d3748', fontSize: '1rem', fontWeight: 600 }}>
                            {event.title}
                          </h4>
                          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                            {event.time && (
                              <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                                <i className="fas fa-clock" style={{ marginRight: '0.375rem' }}></i>
                                {event.time}
                              </p>
                            )}
                            {event.subject && (
                              <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                                <i className="fas fa-book" style={{ marginRight: '0.375rem' }}></i>
                                {event.subject}
                              </p>
                            )}
                          </div>
                          {event.description && (
                            <p style={{ margin: '0.5rem 0 0 0', color: '#718096', fontSize: '0.875rem' }}>
                              {event.description}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          style={{
                            background: '#fee2e2',
                            border: '2px solid #fecaca',
                            borderRadius: '8px',
                            color: '#dc2626',
                            padding: '0.5rem 0.75rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fecaca';
                            e.currentTarget.style.borderColor = '#fca5a5';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fee2e2';
                            e.currentTarget.style.borderColor = '#fecaca';
                          }}
                        >
                          <i className="fas fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Event Form */}
              <div>
                <h3 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
                  <i className="fas fa-plus-circle" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                  Add New Event
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Event Title */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                      Event Title *
                    </label>
                    <input
                      type="text"
                      value={eventFormData.title}
                      onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                      placeholder="Enter event title"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  {/* Event Type */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                      Event Type *
                    </label>
                    <select
                      value={eventFormData.type}
                      onChange={(e) => setEventFormData({ ...eventFormData, type: e.target.value as CalendarEvent['type'] })}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        background: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="class">Class</option>
                      <option value="test">Test</option>
                      <option value="assignment">Assignment</option>
                      <option value="event">Event</option>
                      <option value="holiday">Holiday</option>
                    </select>
                  </div>

                  {/* Time and Subject in a row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                        Time (Optional)
                      </label>
                      <input
                        type="text"
                        value={eventFormData.time}
                        onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                        placeholder="e.g., 09:00 AM"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                        Subject (Optional)
                      </label>
                      <input
                        type="text"
                        value={eventFormData.subject}
                        onChange={(e) => setEventFormData({ ...eventFormData, subject: e.target.value })}
                        placeholder="e.g., Mathematics"
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: '2px solid #e2e8f0',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          outline: 'none',
                          transition: 'border-color 0.2s'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
                      Description (Optional)
                    </label>
                    <textarea
                      value={eventFormData.description}
                      onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                      placeholder="Enter event description"
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'border-color 0.2s'
                      }}
                      onFocus={(e) => e.currentTarget.style.borderColor = '#10ac8b'}
                      onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                      onClick={handleAddEvent}
                      disabled={!eventFormData.title}
                      style={{
                        flex: 1,
                        padding: '0.875rem',
                        background: eventFormData.title
                          ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                          : '#e2e8f0',
                        border: 'none',
                        borderRadius: '10px',
                        color: 'white',
                        fontSize: '1rem',
                        fontWeight: 600,
                        cursor: eventFormData.title ? 'pointer' : 'not-allowed',
                        transition: 'all 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        boxShadow: eventFormData.title ? '0 4px 12px rgba(9, 77, 136, 0.3)' : 'none'
                      }}
                      onMouseEnter={(e) => {
                        if (eventFormData.title) {
                          e.currentTarget.style.transform = 'translateY(-2px)';
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(9, 77, 136, 0.4)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = eventFormData.title ? '0 4px 12px rgba(9, 77, 136, 0.3)' : 'none';
                      }}
                    >
                      <i className="fas fa-plus"></i>
                      Add Event
                    </button>
                    <button
                      onClick={() => setShowEventModal(false)}
                      style={{
                        padding: '0.875rem 1.5rem',
                        background: '#f7fafc',
                        border: '2px solid #e2e8f0',
                        borderRadius: '10px',
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
          </div>
        </div>
      )}
    </>
  );
};

export default Calendar;
