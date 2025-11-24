import { useState, useEffect } from 'react';

interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
  grade: number;
}

interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  category: 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday';
  location: string;
  organizer: string;
  importance: 'mandatory' | 'recommended' | 'optional';
  rsvpRequired: boolean;
  rsvpStatus?: 'yes' | 'no' | 'maybe' | 'pending';
  attendanceRequired: boolean;
  relatedDocuments?: string[];
  targetGrades?: number[];
}

interface AIEventInsight {
  type: 'recommendation' | 'conflict' | 'preparation' | 'importance';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
  icon: string;
  color: string;
  relatedEventId?: string;
}

interface MonthlyStats {
  totalEvents: number;
  upcomingIn7Days: number;
  confirmedRSVPs: number;
  pendingRSVPs: number;
  pastAttendanceRate: number;
  byCategory: {
    academic: number;
    sports: number;
    cultural: number;
    meeting: number;
    holiday: number;
  };
}

type ViewMode = 'month' | 'week' | 'list' | 'agenda';
type FilterCategory = 'all' | 'academic' | 'sports' | 'cultural' | 'meeting' | 'holiday';

const EventCalendar = () => {
  const [selectedChild, setSelectedChild] = useState<string>('1');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showReminderModal, setShowReminderModal] = useState(false);

  // Mock data - Children
  const children: Child[] = [
    { id: '1', name: 'Aarav Sharma', class: '10', section: 'A', grade: 10 },
    { id: '2', name: 'Diya Sharma', class: '7', section: 'B', grade: 7 }
  ];

  const currentChild = children.find(c => c.id === selectedChild) || children[0];

  // Get current month details
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const today = new Date();

  // Mock data - School Events
  const generateMockEvents = (): SchoolEvent[] => {
    const events: SchoolEvent[] = [
      {
        id: '1',
        title: 'Parent-Teacher Meeting',
        description: 'Quarterly review of student performance and discussion about academic progress.',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15`,
        startTime: '16:00',
        endTime: '18:00',
        category: 'meeting',
        location: 'School Auditorium',
        organizer: 'Academic Department',
        importance: 'mandatory',
        rsvpRequired: true,
        rsvpStatus: 'pending',
        attendanceRequired: true,
        targetGrades: [10]
      },
      {
        id: '2',
        title: 'Annual Sports Day',
        description: 'Inter-house sports competition with various athletic events.',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-20`,
        startTime: '08:00',
        endTime: '16:00',
        category: 'sports',
        location: 'Sports Ground',
        organizer: 'Physical Education Dept',
        importance: 'recommended',
        rsvpRequired: false,
        attendanceRequired: false,
        targetGrades: [7, 8, 9, 10, 11, 12]
      },
      {
        id: '3',
        title: 'Science Exhibition',
        description: 'Student-led science projects and experiments showcase.',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-22`,
        startTime: '10:00',
        endTime: '14:00',
        category: 'academic',
        location: 'Science Labs',
        organizer: 'Science Department',
        importance: 'recommended',
        rsvpRequired: false,
        rsvpStatus: 'yes',
        attendanceRequired: false,
        targetGrades: [9, 10, 11, 12]
      },
      {
        id: '4',
        title: 'Diwali Celebration',
        description: 'Cultural program with traditional performances, rangoli competition, and festivities.',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-25`,
        startTime: '11:00',
        endTime: '15:00',
        category: 'cultural',
        location: 'School Ground',
        organizer: 'Cultural Committee',
        importance: 'optional',
        rsvpRequired: false,
        attendanceRequired: false,
        targetGrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      {
        id: '5',
        title: 'Mid-Term Examinations',
        description: 'First semester mid-term examinations for all grades.',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-28`,
        startTime: '09:00',
        endTime: '12:00',
        category: 'academic',
        location: 'Classrooms',
        organizer: 'Examination Cell',
        importance: 'mandatory',
        rsvpRequired: false,
        attendanceRequired: true,
        targetGrades: [10]
      },
      {
        id: '6',
        title: 'Winter Break Begins',
        description: 'School closes for winter vacation.',
        date: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-30`,
        startTime: '12:00',
        endTime: '12:00',
        category: 'holiday',
        location: 'N/A',
        organizer: 'Administration',
        importance: 'optional',
        rsvpRequired: false,
        attendanceRequired: false,
        targetGrades: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
      },
      // Next month events
      {
        id: '7',
        title: 'Basketball Tournament',
        description: 'Inter-school basketball championship finals.',
        date: `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-05`,
        startTime: '14:00',
        endTime: '17:00',
        category: 'sports',
        location: 'Indoor Stadium',
        organizer: 'Sports Department',
        importance: 'optional',
        rsvpRequired: false,
        attendanceRequired: false,
        targetGrades: [9, 10, 11, 12]
      },
      {
        id: '8',
        title: 'Career Guidance Workshop',
        description: 'Professional counseling session for high school students about career options.',
        date: `${currentYear}-${String(currentMonth + 2).padStart(2, '0')}-10`,
        startTime: '10:00',
        endTime: '13:00',
        category: 'academic',
        location: 'Seminar Hall',
        organizer: 'Counseling Department',
        importance: 'recommended',
        rsvpRequired: true,
        rsvpStatus: 'maybe',
        attendanceRequired: false,
        targetGrades: [10, 11, 12]
      }
    ];

    return events.filter(event =>
      !event.targetGrades || event.targetGrades.includes(currentChild.grade)
    );
  };

  const [events, setEvents] = useState<SchoolEvent[]>(generateMockEvents());

  // Generate AI insights
  const generateAIInsights = (): AIEventInsight[] => {
    const insights: AIEventInsight[] = [];
    const upcomingEvents = events.filter(e => new Date(e.date) >= today).slice(0, 5);

    // Conflict detection
    const eventsByDate: { [key: string]: SchoolEvent[] } = {};
    upcomingEvents.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });

    Object.entries(eventsByDate).forEach(([date, dayEvents]) => {
      if (dayEvents.length > 2) {
        insights.push({
          type: 'conflict',
          title: 'Multiple Events Detected',
          description: `${dayEvents.length} events scheduled on ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}. Consider prioritizing based on importance.`,
          severity: 'warning',
          icon: 'fa-exclamation-triangle',
          color: '#f59e0b'
        });
      }
    });

    // Preparation reminders
    const upcomingMandatory = upcomingEvents.filter(e => e.importance === 'mandatory');
    if (upcomingMandatory.length > 0) {
      const nextMandatory = upcomingMandatory[0];
      const daysUntil = Math.ceil((new Date(nextMandatory.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      if (daysUntil <= 3 && daysUntil > 0) {
        insights.push({
          type: 'preparation',
          title: 'Upcoming Mandatory Event',
          description: `${nextMandatory.title} in ${daysUntil} day${daysUntil > 1 ? 's' : ''}. Ensure ${currentChild.name} is prepared.`,
          severity: 'warning',
          icon: 'fa-bell',
          color: '#f59e0b',
          relatedEventId: nextMandatory.id
        });
      }
    }

    // Recommendation based on category
    const scienceEvent = events.find(e => e.category === 'academic' && e.title.toLowerCase().includes('science'));
    if (scienceEvent && currentChild.grade >= 9) {
      insights.push({
        type: 'recommendation',
        title: 'Recommended Event',
        description: `Based on ${currentChild.name}'s grade, the ${scienceEvent.title} would be beneficial for academic development.`,
        severity: 'success',
        icon: 'fa-lightbulb',
        color: '#10ac8b',
        relatedEventId: scienceEvent.id
      });
    }

    // RSVP reminders
    const pendingRSVPs = events.filter(e => e.rsvpRequired && e.rsvpStatus === 'pending');
    if (pendingRSVPs.length > 0) {
      insights.push({
        type: 'importance',
        title: `${pendingRSVPs.length} Pending RSVP${pendingRSVPs.length > 1 ? 's' : ''}`,
        description: 'Please confirm your attendance for events requiring RSVP.',
        severity: 'info',
        icon: 'fa-clipboard-check',
        color: '#094d88'
      });
    }

    return insights;
  };

  const [aiInsights, setAIInsights] = useState<AIEventInsight[]>(generateAIInsights());

  // Calculate monthly stats
  const calculateMonthlyStats = (): MonthlyStats => {
    const thisMonthEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });

    const upcoming7Days = events.filter(e => {
      const eventDate = new Date(e.date);
      const diff = (eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 7;
    });

    return {
      totalEvents: thisMonthEvents.length,
      upcomingIn7Days: upcoming7Days.length,
      confirmedRSVPs: events.filter(e => e.rsvpStatus === 'yes').length,
      pendingRSVPs: events.filter(e => e.rsvpRequired && e.rsvpStatus === 'pending').length,
      pastAttendanceRate: 85, // Mock value
      byCategory: {
        academic: events.filter(e => e.category === 'academic').length,
        sports: events.filter(e => e.category === 'sports').length,
        cultural: events.filter(e => e.category === 'cultural').length,
        meeting: events.filter(e => e.category === 'meeting').length,
        holiday: events.filter(e => e.category === 'holiday').length
      }
    };
  };

  const [stats, setStats] = useState<MonthlyStats>(calculateMonthlyStats());

  // Filter events
  const getFilteredEvents = () => {
    let filtered = events;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(e => e.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(e =>
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  // Get events for a specific day
  const getEventsForDay = (day: number): SchoolEvent[] => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return getFilteredEvents().filter(e => e.date === dateStr);
  };

  // Handle event click
  const handleEventClick = (event: SchoolEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  // Handle RSVP
  const handleRSVP = (status: 'yes' | 'no' | 'maybe') => {
    if (selectedEvent) {
      const updatedEvents = events.map(e =>
        e.id === selectedEvent.id ? { ...e, rsvpStatus: status } : e
      );
      setEvents(updatedEvents);
      setSelectedEvent({ ...selectedEvent, rsvpStatus: status });
    }
  };

  // Get category color
  const getCategoryColor = (category: string): string => {
    const colors: { [key: string]: string } = {
      academic: '#094d88',
      sports: '#10ac8b',
      cultural: '#8b5cf6',
      meeting: '#f59e0b',
      holiday: '#6b7280'
    };
    return colors[category] || '#6b7280';
  };

  // Get category icon
  const getCategoryIcon = (category: string): string => {
    const icons: { [key: string]: string } = {
      academic: 'fa-graduation-cap',
      sports: 'fa-futbol',
      cultural: 'fa-theater-masks',
      meeting: 'fa-users',
      holiday: 'fa-umbrella-beach'
    };
    return icons[category] || 'fa-calendar';
  };

  // Show toast notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  // Export calendar to ICS file
  const handleExportCalendar = () => {
    const filtered = getFilteredEvents();

    // Generate ICS file content
    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//EdgeUp//School Calendar//EN\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';
    icsContent += 'METHOD:PUBLISH\r\n';
    icsContent += `X-WR-CALNAME:${currentChild.name} - School Events\r\n`;
    icsContent += 'X-WR-TIMEZONE:Asia/Kolkata\r\n';

    filtered.forEach(event => {
      const eventDate = new Date(event.date);
      const startTime = event.startTime.split(':');
      const endTime = event.endTime.split(':');

      const startDateTime = new Date(eventDate);
      startDateTime.setHours(parseInt(startTime[0]), parseInt(startTime[1]));

      const endDateTime = new Date(eventDate);
      endDateTime.setHours(parseInt(endTime[0]), parseInt(endTime[1]));

      const formatDateTime = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += 'BEGIN:VEVENT\r\n';
      icsContent += `UID:${event.id}@edgeup.school\r\n`;
      icsContent += `DTSTAMP:${formatDateTime(new Date())}\r\n`;
      icsContent += `DTSTART:${formatDateTime(startDateTime)}\r\n`;
      icsContent += `DTEND:${formatDateTime(endDateTime)}\r\n`;
      icsContent += `SUMMARY:${event.title}\r\n`;
      icsContent += `DESCRIPTION:${event.description}\\n\\nOrganizer: ${event.organizer}\\nImportance: ${event.importance}\r\n`;
      icsContent += `LOCATION:${event.location}\r\n`;
      icsContent += `CATEGORIES:${event.category.toUpperCase()}\r\n`;
      icsContent += `STATUS:CONFIRMED\r\n`;
      icsContent += 'END:VEVENT\r\n';
    });

    icsContent += 'END:VCALENDAR\r\n';

    // Create and download file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${currentChild.name.replace(/\s+/g, '_')}_School_Calendar_${currentYear}_${monthNames[currentMonth]}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToastNotification(`Calendar exported successfully! (${filtered.length} events)`);
  };

  // Add single event to calendar
  const handleAddToCalendar = () => {
    if (!selectedEvent) return;

    const eventDate = new Date(selectedEvent.date);
    const startTime = selectedEvent.startTime.split(':');
    const endTime = selectedEvent.endTime.split(':');

    const startDateTime = new Date(eventDate);
    startDateTime.setHours(parseInt(startTime[0]), parseInt(startTime[1]));

    const endDateTime = new Date(eventDate);
    endDateTime.setHours(parseInt(endTime[0]), parseInt(endTime[1]));

    const formatDateTime = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//EdgeUp//School Event//EN\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';
    icsContent += 'METHOD:PUBLISH\r\n';
    icsContent += 'BEGIN:VEVENT\r\n';
    icsContent += `UID:${selectedEvent.id}@edgeup.school\r\n`;
    icsContent += `DTSTAMP:${formatDateTime(new Date())}\r\n`;
    icsContent += `DTSTART:${formatDateTime(startDateTime)}\r\n`;
    icsContent += `DTEND:${formatDateTime(endDateTime)}\r\n`;
    icsContent += `SUMMARY:${selectedEvent.title}\r\n`;
    icsContent += `DESCRIPTION:${selectedEvent.description}\\n\\nOrganizer: ${selectedEvent.organizer}\\nImportance: ${selectedEvent.importance}\r\n`;
    icsContent += `LOCATION:${selectedEvent.location}\r\n`;
    icsContent += `CATEGORIES:${selectedEvent.category.toUpperCase()}\r\n`;
    icsContent += `STATUS:CONFIRMED\r\n`;

    // Add alarm/reminder if it's a mandatory event
    if (selectedEvent.importance === 'mandatory') {
      icsContent += 'BEGIN:VALARM\r\n';
      icsContent += 'TRIGGER:-P1D\r\n';
      icsContent += 'ACTION:DISPLAY\r\n';
      icsContent += `DESCRIPTION:Reminder: ${selectedEvent.title} tomorrow\r\n`;
      icsContent += 'END:VALARM\r\n';
    }

    icsContent += 'END:VEVENT\r\n';
    icsContent += 'END:VCALENDAR\r\n';

    // Create and download file
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${selectedEvent.title.replace(/\s+/g, '_')}_${selectedEvent.date}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToastNotification('Event added to your calendar!');
  };

  // Handle set reminder
  const handleSetReminder = () => {
    setShowReminderModal(true);
  };

  const handleReminderOption = (days: number) => {
    if (!selectedEvent) return;

    const eventDate = new Date(selectedEvent.date);
    const reminderDate = new Date(eventDate);
    reminderDate.setDate(reminderDate.getDate() - days);

    const message = days === 0
      ? `Reminder set for event day!`
      : `Reminder set for ${days} day${days > 1 ? 's' : ''} before the event!`;

    showToastNotification(message);
    setShowReminderModal(false);
  };

  // Handle AI insight click
  const handleInsightClick = (insight: AIEventInsight) => {
    if (insight.relatedEventId) {
      const relatedEvent = events.find(e => e.id === insight.relatedEventId);
      if (relatedEvent) {
        handleEventClick(relatedEvent);
      }
    }
  };

  // Update stats when events change
  useEffect(() => {
    setStats(calculateMonthlyStats());
    setAIInsights(generateAIInsights());
  }, [events, currentDate]);

  const calendarDays = generateCalendarDays();
  const filteredEvents = getFilteredEvents();
  const upcomingEvents = filteredEvents
    .filter(e => new Date(e.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="parent-event-calendar-page">
      {/* Header Section */}
      <div className="calendar-header">
        <div className="header-top-row">
          <div className="child-selector-calendar">
            <i className="fas fa-user-graduate"></i>
            <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - Class {child.class}{child.section}
                </option>
              ))}
            </select>
          </div>

          <div className="calendar-navigation">
            <button className="nav-btn" onClick={goToPreviousMonth}>
              <i className="fas fa-chevron-left"></i>
            </button>
            <div className="current-month-year">
              <h2>{monthNames[currentMonth]} {currentYear}</h2>
            </div>
            <button className="nav-btn" onClick={goToNextMonth}>
              <i className="fas fa-chevron-right"></i>
            </button>
            <button className="today-btn" onClick={goToToday}>
              <i className="fas fa-calendar-day"></i>
              Today
            </button>
          </div>

          <div className="view-mode-toggle">
            <button
              className={`mode-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              <i className="fas fa-calendar"></i>
              Month
            </button>
            <button
              className={`mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              <i className="fas fa-list"></i>
              List
            </button>
          </div>
        </div>

        <div className="header-bottom-row">
          <div className="category-filters">
            {(['all', 'academic', 'sports', 'cultural', 'meeting', 'holiday'] as FilterCategory[]).map(cat => (
              <button
                key={cat}
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
                style={selectedCategory === cat ? { borderColor: getCategoryColor(cat), color: getCategoryColor(cat) } : {}}
              >
                <i className={`fas ${cat === 'all' ? 'fa-globe' : getCategoryIcon(cat)}`}></i>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          <div className="search-export-group">
            <div className="search-box-wrapper">
              <div className="search-box-calendar">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              {searchQuery && (
                <div className="search-results-counter">
                  {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
                </div>
              )}
            </div>
            <button className="export-btn" onClick={handleExportCalendar}>
              <i className="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="calendar-stats-grid">
        <div className="stat-card-calendar total">
          <div className="stat-icon-calendar">
            <i className="fas fa-calendar-alt"></i>
          </div>
          <div className="stat-content-calendar">
            <span className="stat-label-calendar">Events This Month</span>
            <span className="stat-value-calendar">{stats.totalEvents}</span>
          </div>
        </div>

        <div className="stat-card-calendar upcoming">
          <div className="stat-icon-calendar">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content-calendar">
            <span className="stat-label-calendar">Upcoming (7 Days)</span>
            <span className="stat-value-calendar">{stats.upcomingIn7Days}</span>
          </div>
        </div>

        <div className="stat-card-calendar rsvp">
          <div className="stat-icon-calendar">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className="stat-content-calendar">
            <span className="stat-label-calendar">Confirmed / Pending</span>
            <span className="stat-value-calendar">{stats.confirmedRSVPs} / {stats.pendingRSVPs}</span>
          </div>
        </div>

        <div className="stat-card-calendar attendance">
          <div className="stat-icon-calendar">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content-calendar">
            <span className="stat-label-calendar">Attendance Rate</span>
            <span className="stat-value-calendar">{stats.pastAttendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="calendar-main-section">
          {viewMode === 'month' && (
            <div className="month-calendar-view">
              {filteredEvents.length === 0 && searchQuery ? (
                <div className="no-events-message">
                  <i className="fas fa-search"></i>
                  <h3>No Events Found</h3>
                  <p>No events match your search "{searchQuery}"</p>
                  <button className="clear-filters-btn" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </button>
                </div>
              ) : (
                <>
                  <div className="calendar-weekdays">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="weekday-label">{day}</div>
                    ))}
                  </div>

                  <div className="calendar-days-grid">
                {calendarDays.map((day, index) => {
                  if (day === null) {
                    return <div key={`empty-${index}`} className="calendar-day empty"></div>;
                  }

                  const dayEvents = getEventsForDay(day);
                  const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
                  const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const isPast = new Date(dateStr) < new Date(today.toDateString());

                  return (
                    <div
                      key={day}
                      className={`calendar-day ${isToday ? 'today' : ''} ${isPast ? 'past' : ''} ${dayEvents.length > 0 ? 'has-events' : ''}`}
                    >
                      <div className="day-number">{day}</div>
                      <div className="day-events">
                        {dayEvents.slice(0, 3).map(event => (
                          <div
                            key={event.id}
                            className="event-dot"
                            style={{ backgroundColor: getCategoryColor(event.category) }}
                            onClick={() => handleEventClick(event)}
                            title={event.title}
                          >
                            <span className="event-dot-text">{event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 3 && (
                          <div className="more-events">+{dayEvents.length - 3} more</div>
                        )}
                      </div>
                    </div>
                  );
                })}
                  </div>
                </>
              )}
            </div>
          )}

          {viewMode === 'list' && (
            <div className="list-calendar-view">
              {filteredEvents.length === 0 ? (
                <div className="no-events-message">
                  <i className="fas fa-calendar-times"></i>
                  <h3>No Events Found</h3>
                  <p>Try adjusting your filters or search query.</p>
                </div>
              ) : (
                filteredEvents
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .map(event => {
                    const eventDate = new Date(event.date);
                    const isPast = eventDate < new Date(today.toDateString());

                    return (
                      <div
                        key={event.id}
                        className={`list-event-card ${isPast ? 'past' : ''}`}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="event-date-sidebar" style={{ backgroundColor: getCategoryColor(event.category) }}>
                          <span className="event-month">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                          <span className="event-day">{eventDate.getDate()}</span>
                        </div>
                        <div className="event-details-list">
                          <div className="event-header-list">
                            <h3>{event.title}</h3>
                            <div className="event-badges">
                              {event.importance === 'mandatory' && (
                                <span className="badge mandatory">Mandatory</span>
                              )}
                              {event.rsvpRequired && event.rsvpStatus === 'pending' && (
                                <span className="badge rsvp-pending">RSVP Pending</span>
                              )}
                              {event.rsvpStatus === 'yes' && (
                                <span className="badge rsvp-confirmed">Confirmed</span>
                              )}
                            </div>
                          </div>
                          <p className="event-description-list">{event.description}</p>
                          <div className="event-meta-list">
                            <span><i className="fas fa-clock"></i> {event.startTime} - {event.endTime}</span>
                            <span><i className="fas fa-map-marker-alt"></i> {event.location}</span>
                            <span><i className="fas fa-user"></i> {event.organizer}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          )}
      </div>

      {/* AI Insights and Upcoming Events Section */}
      <div className="calendar-insights-section">
        {/* AI Insights */}
        <div className="ai-calendar-insights">
            <h3>
              <i className="fas fa-brain"></i>
              Smart Event Assistant
            </h3>
            <div className="insights-list-calendar">
              {aiInsights.length === 0 ? (
                <div className="no-insights">
                  <i className="fas fa-check-circle"></i>
                  <p>All set! No conflicts or urgent items.</p>
                </div>
              ) : (
                aiInsights.map((insight, index) => (
                  <div
                    key={index}
                    className={`insight-item-calendar ${insight.severity} ${insight.relatedEventId ? 'clickable' : ''}`}
                    onClick={() => handleInsightClick(insight)}
                    style={{ cursor: insight.relatedEventId ? 'pointer' : 'default' }}
                  >
                    <div className="insight-icon-calendar" style={{ color: insight.color }}>
                      <i className={`fas ${insight.icon}`}></i>
                    </div>
                    <div className="insight-content-calendar">
                      <h4>{insight.title}</h4>
                      <p>{insight.description}</p>
                    </div>
                    {insight.relatedEventId && (
                      <i className="fas fa-arrow-right" style={{ marginLeft: 'auto', color: insight.color, opacity: 0.6 }}></i>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="upcoming-events-card">
            <h3>
              <i className="fas fa-clock"></i>
              Upcoming Events
            </h3>
            <div className="upcoming-events-timeline">
              {upcomingEvents.length === 0 ? (
                <div className="no-upcoming">
                  <i className="fas fa-calendar-check"></i>
                  <p>No upcoming events</p>
                </div>
              ) : (
                upcomingEvents.map(event => {
                  const eventDate = new Date(event.date);
                  const daysUntil = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

                  return (
                    <div key={event.id} className="upcoming-event-item" onClick={() => handleEventClick(event)}>
                      <div className="upcoming-event-marker" style={{ backgroundColor: getCategoryColor(event.category) }}>
                        <i className={`fas ${getCategoryIcon(event.category)}`}></i>
                      </div>
                      <div className="upcoming-event-details">
                        <h4>{event.title}</h4>
                        <div className="upcoming-event-meta">
                          <span className="event-date-text">
                            {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="event-time-text">{event.startTime}</span>
                        </div>
                        {daysUntil === 0 && <span className="countdown-badge today">Today</span>}
                        {daysUntil === 1 && <span className="countdown-badge tomorrow">Tomorrow</span>}
                        {daysUntil > 1 && daysUntil <= 7 && <span className="countdown-badge">In {daysUntil} days</span>}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
      </div>

      {/* Event Details Modal */}
      {showEventModal && selectedEvent && (
        <>
          <div className="modal-overlay-calendar" onClick={() => setShowEventModal(false)}></div>
          <div className="event-modal-calendar">
            <div className="modal-header-calendar" style={{ borderTopColor: getCategoryColor(selectedEvent.category) }}>
              <div className="modal-title-group">
                <i className={`fas ${getCategoryIcon(selectedEvent.category)}`} style={{ color: getCategoryColor(selectedEvent.category) }}></i>
                <h2>{selectedEvent.title}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setShowEventModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body-calendar">
              <div className="event-detail-section">
                <h3>Description</h3>
                <p>{selectedEvent.description}</p>
              </div>

              <div className="event-detail-grid">
                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <div>
                    <span className="detail-label">Date</span>
                    <span className="detail-value">
                      {new Date(selectedEvent.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <div>
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{selectedEvent.startTime} - {selectedEvent.endTime}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <div>
                    <span className="detail-label">Location</span>
                    <span className="detail-value">{selectedEvent.location}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="fas fa-user"></i>
                  <div>
                    <span className="detail-label">Organizer</span>
                    <span className="detail-value">{selectedEvent.organizer}</span>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="fas fa-exclamation-circle"></i>
                  <div>
                    <span className="detail-label">Importance</span>
                    <span className={`detail-value importance ${selectedEvent.importance}`}>
                      {selectedEvent.importance.charAt(0).toUpperCase() + selectedEvent.importance.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="detail-item">
                  <i className="fas fa-tag"></i>
                  <div>
                    <span className="detail-label">Category</span>
                    <span className="detail-value" style={{ color: getCategoryColor(selectedEvent.category) }}>
                      {selectedEvent.category.charAt(0).toUpperCase() + selectedEvent.category.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              {selectedEvent.rsvpRequired && (
                <div className="event-detail-section">
                  <h3>RSVP Status</h3>
                  <div className="rsvp-buttons">
                    <button
                      className={`rsvp-btn yes ${selectedEvent.rsvpStatus === 'yes' ? 'active' : ''}`}
                      onClick={() => handleRSVP('yes')}
                    >
                      <i className="fas fa-check"></i>
                      Attending
                    </button>
                    <button
                      className={`rsvp-btn maybe ${selectedEvent.rsvpStatus === 'maybe' ? 'active' : ''}`}
                      onClick={() => handleRSVP('maybe')}
                    >
                      <i className="fas fa-question"></i>
                      Maybe
                    </button>
                    <button
                      className={`rsvp-btn no ${selectedEvent.rsvpStatus === 'no' ? 'active' : ''}`}
                      onClick={() => handleRSVP('no')}
                    >
                      <i className="fas fa-times"></i>
                      Not Attending
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="modal-footer-calendar">
              <button className="action-btn-modal secondary" onClick={handleSetReminder}>
                <i className="fas fa-bell"></i>
                Set Reminder
              </button>
              <button className="action-btn-modal secondary" onClick={handleAddToCalendar}>
                <i className="fas fa-calendar-plus"></i>
                Add to Calendar
              </button>
              <button className="action-btn-modal primary" onClick={() => setShowEventModal(false)}>
                Close
              </button>
            </div>
          </div>
        </>
      )}

      {/* Reminder Modal */}
      {showReminderModal && selectedEvent && (
        <>
          <div className="modal-overlay-calendar" onClick={() => setShowReminderModal(false)}></div>
          <div className="reminder-modal-calendar">
            <div className="reminder-modal-header">
              <h3>
                <i className="fas fa-bell"></i>
                Set Reminder for {selectedEvent.title}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowReminderModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="reminder-options">
              <button className="reminder-option-btn" onClick={() => handleReminderOption(0)}>
                <i className="fas fa-calendar-day"></i>
                <span>On event day</span>
              </button>
              <button className="reminder-option-btn" onClick={() => handleReminderOption(1)}>
                <i className="fas fa-clock"></i>
                <span>1 day before</span>
              </button>
              <button className="reminder-option-btn" onClick={() => handleReminderOption(3)}>
                <i className="fas fa-calendar-minus"></i>
                <span>3 days before</span>
              </button>
              <button className="reminder-option-btn" onClick={() => handleReminderOption(7)}>
                <i className="fas fa-calendar-week"></i>
                <span>1 week before</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification">
          <i className="fas fa-check-circle"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
