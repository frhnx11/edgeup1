import { useState } from 'react';
import './AcademicCalendarPredictor.css';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'exam' | 'holiday' | 'event' | 'academic';
  startDate: string;
  endDate?: string;
  description: string;
  department?: string;
  status: 'scheduled' | 'confirmed' | 'tentative';
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  type: 'conflict' | 'optimization' | 'gap';
}

const AcademicCalendarPredictor = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'predictor' | 'events' | 'analytics'>('calendar');
  const [selectedSemester, setSelectedSemester] = useState('2025-spring');
  const [showPredictorModal, setShowPredictorModal] = useState(false);

  // Calendar View state
  const [calendarView, setCalendarView] = useState<'month' | 'week' | 'list'>('month');
  const [currentDisplayMonth, setCurrentDisplayMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDayEventsModal, setShowDayEventsModal] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'exam' | 'holiday' | 'event' | 'academic' | 'confirmed' | 'upcoming'>('all');

  // Events List state
  const [eventFilter, setEventFilter] = useState<'all' | 'exam' | 'holiday' | 'event' | 'academic'>('all');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showEditEventModal, setShowEditEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    title: '',
    type: 'academic',
    startDate: '',
    endDate: '',
    description: '',
    status: 'tentative'
  });

  // Modal configuration state
  const [modalSemester, setModalSemester] = useState('2024-spring');
  const [optimizationPriorities, setOptimizationPriorities] = useState({
    avoidConflicts: true,
    optimizeLearning: true,
    considerHolidays: true,
    balanceWorkload: false
  });

  // Loading state for calendar generation
  const [isGeneratingCalendar, setIsGeneratingCalendar] = useState(false);

  // Helper function to check if AI events exist
  const hasAIGeneratedEvents = (): boolean => {
    return calendarEvents.some(event => event.id.startsWith('ai-'));
  };

  // Helper function to get count of AI events
  const getAIEventsCount = (): number => {
    return calendarEvents.filter(event => event.id.startsWith('ai-')).length;
  };

  // Color calculation function for utilization bars based on performance
  const getBarColor = (percentage: number): string => {
    if (percentage >= 90) return '#10ac8b'; // Bright green - excellent
    if (percentage >= 80) return '#14b8a6'; // Teal - very good
    if (percentage >= 70) return '#22c55e'; // Blue-green - good
    if (percentage >= 60) return '#3b82f6'; // Light blue - moderate
    if (percentage >= 40) return '#2563eb'; // Blue - low
    return '#1e40af'; // Dark blue - very low
  };

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([
    // January 2025 Events
    {
      id: 'e1',
      title: 'New Year Holiday',
      type: 'holiday',
      startDate: '2025-01-01',
      endDate: '2025-01-01',
      description: 'New Year celebration - College closed',
      status: 'confirmed'
    },
    {
      id: 'e2',
      title: 'Semester Registration',
      type: 'academic',
      startDate: '2025-01-06',
      endDate: '2025-01-10',
      description: 'Spring 2025 semester course registration period',
      department: 'Academic Affairs',
      status: 'confirmed'
    },
    {
      id: 'e3',
      title: 'Republic Day',
      type: 'holiday',
      startDate: '2025-01-26',
      endDate: '2025-01-26',
      description: 'National holiday - Republic Day celebration',
      status: 'confirmed'
    },
    {
      id: 'e4',
      title: 'Internal Assessment 1',
      type: 'exam',
      startDate: '2025-01-20',
      endDate: '2025-01-25',
      description: 'First internal assessment for all courses',
      department: 'All Departments',
      status: 'confirmed'
    },
    // February 2025 Events
    {
      id: 'e5',
      title: 'College Foundation Day',
      type: 'event',
      startDate: '2025-02-14',
      endDate: '2025-02-14',
      description: 'Annual college foundation day celebrations',
      department: 'Student Affairs',
      status: 'confirmed'
    },
    {
      id: 'e6',
      title: 'Workshop on AI & ML',
      type: 'academic',
      startDate: '2025-02-17',
      endDate: '2025-02-19',
      description: 'Three-day intensive workshop on Artificial Intelligence and Machine Learning',
      department: 'Computer Science',
      status: 'scheduled'
    },
    {
      id: 'e7',
      title: 'Sports Week',
      type: 'event',
      startDate: '2025-02-24',
      endDate: '2025-02-28',
      description: 'Annual inter-departmental sports competitions',
      department: 'Sports Committee',
      status: 'scheduled'
    },
    // March 2025 Events
    {
      id: 'e8',
      title: 'Holi Festival',
      type: 'holiday',
      startDate: '2025-03-14',
      endDate: '2025-03-14',
      description: 'Festival of colors - Holiday',
      status: 'confirmed'
    },
    {
      id: 'e9',
      title: 'Mid-Semester Examinations',
      type: 'exam',
      startDate: '2025-03-17',
      endDate: '2025-03-22',
      description: 'Mid-semester examinations for all courses',
      department: 'All Departments',
      status: 'confirmed'
    },
    {
      id: 'e10',
      title: 'Technical Symposium',
      type: 'event',
      startDate: '2025-03-28',
      endDate: '2025-03-30',
      description: 'Annual technical fest with paper presentations and competitions',
      department: 'All Departments',
      status: 'scheduled'
    },
    {
      id: 'e11',
      title: 'Industry Expert Lecture Series',
      type: 'academic',
      startDate: '2025-03-05',
      endDate: '2025-03-07',
      description: 'Guest lectures by industry professionals',
      department: 'Career Development',
      status: 'scheduled'
    },
    // April 2025 Events
    {
      id: 'e12',
      title: 'Spring Break',
      type: 'holiday',
      startDate: '2025-04-07',
      endDate: '2025-04-13',
      description: 'Spring vacation period for students and faculty',
      status: 'confirmed'
    },
    {
      id: 'e13',
      title: 'Good Friday',
      type: 'holiday',
      startDate: '2025-04-18',
      endDate: '2025-04-18',
      description: 'Good Friday - Holiday',
      status: 'confirmed'
    },
    {
      id: 'e14',
      title: 'Cultural Fest',
      type: 'event',
      startDate: '2025-04-21',
      endDate: '2025-04-23',
      description: 'Annual cultural festival with music, dance, and drama competitions',
      department: 'Cultural Committee',
      status: 'scheduled'
    },
    {
      id: 'e15',
      title: 'Project Presentation Week',
      type: 'academic',
      startDate: '2025-04-28',
      endDate: '2025-04-30',
      description: 'Mid-semester project presentations for all departments',
      department: 'All Departments',
      status: 'tentative'
    },
    // May 2025 Events
    {
      id: 'e16',
      title: 'Labour Day',
      type: 'holiday',
      startDate: '2025-05-01',
      endDate: '2025-05-01',
      description: 'International Workers Day - Holiday',
      status: 'confirmed'
    },
    {
      id: 'e17',
      title: 'End-Semester Examinations',
      type: 'exam',
      startDate: '2025-05-12',
      endDate: '2025-05-26',
      description: 'Final examinations for Spring 2025 semester',
      department: 'All Departments',
      status: 'confirmed'
    },
    {
      id: 'e18',
      title: 'Career Fair',
      type: 'event',
      startDate: '2025-05-05',
      endDate: '2025-05-06',
      description: 'Campus placement drive and career opportunities fair',
      department: 'Placement Cell',
      status: 'scheduled'
    },
    // June 2025 Events
    {
      id: 'e19',
      title: 'Summer Vacation',
      type: 'holiday',
      startDate: '2025-06-01',
      endDate: '2025-06-30',
      description: 'Summer break for students',
      status: 'confirmed'
    },
    {
      id: 'e20',
      title: 'Faculty Development Program',
      type: 'academic',
      startDate: '2025-06-16',
      endDate: '2025-06-20',
      description: 'Professional development workshop for faculty members',
      department: 'Faculty Development',
      status: 'scheduled'
    },
    // July 2025 Events
    {
      id: 'e21',
      title: 'Semester Registration - Fall 2025',
      type: 'academic',
      startDate: '2025-07-01',
      endDate: '2025-07-05',
      description: 'Fall 2025 semester course registration',
      department: 'Academic Affairs',
      status: 'tentative'
    },
    {
      id: 'e22',
      title: 'Orientation Program',
      type: 'academic',
      startDate: '2025-07-14',
      endDate: '2025-07-16',
      description: 'Orientation for new students - Fall 2025',
      department: 'Student Affairs',
      status: 'tentative'
    },
    {
      id: 'e23',
      title: 'Independence Day Celebration',
      type: 'holiday',
      startDate: '2025-08-15',
      endDate: '2025-08-15',
      description: 'Independence Day - National holiday',
      status: 'confirmed'
    },
    // August-September 2025 Events
    {
      id: 'e24',
      title: 'Ganesh Chaturthi',
      type: 'holiday',
      startDate: '2025-08-27',
      endDate: '2025-08-27',
      description: 'Ganesh Chaturthi festival - Holiday',
      status: 'confirmed'
    },
    {
      id: 'e25',
      title: 'Internal Assessment 1 - Fall',
      type: 'exam',
      startDate: '2025-09-08',
      endDate: '2025-09-13',
      description: 'First internal assessment for Fall 2025',
      department: 'All Departments',
      status: 'tentative'
    },
    {
      id: 'e26',
      title: 'Teachers Day Celebration',
      type: 'event',
      startDate: '2025-09-05',
      endDate: '2025-09-05',
      description: 'Teachers Day special events and celebrations',
      department: 'Student Affairs',
      status: 'scheduled'
    },
    {
      id: 'e27',
      title: 'Hackathon 2025',
      type: 'event',
      startDate: '2025-09-22',
      endDate: '2025-09-24',
      description: '48-hour coding hackathon with industry mentors',
      department: 'Computer Science',
      status: 'scheduled'
    },
    // October 2025 Events
    {
      id: 'e28',
      title: 'Gandhi Jayanti',
      type: 'holiday',
      startDate: '2025-10-02',
      endDate: '2025-10-02',
      description: 'Mahatma Gandhi Birthday - National holiday',
      status: 'confirmed'
    },
    {
      id: 'e29',
      title: 'Mid-Semester Examinations - Fall',
      type: 'exam',
      startDate: '2025-10-13',
      endDate: '2025-10-18',
      description: 'Mid-semester examinations for Fall 2025',
      department: 'All Departments',
      status: 'tentative'
    },
    {
      id: 'e30',
      title: 'Dussehra Festival',
      type: 'holiday',
      startDate: '2025-10-22',
      endDate: '2025-10-24',
      description: 'Dussehra festival holidays',
      status: 'confirmed'
    },
    {
      id: 'e31',
      title: 'Alumni Meet',
      type: 'event',
      startDate: '2025-10-27',
      endDate: '2025-10-27',
      description: 'Annual alumni gathering and networking event',
      department: 'Alumni Relations',
      status: 'scheduled'
    },
    // November 2025 Events
    {
      id: 'e32',
      title: 'Diwali Celebration',
      type: 'holiday',
      startDate: '2025-11-01',
      endDate: '2025-11-05',
      description: 'Diwali festival break',
      status: 'confirmed'
    },
    {
      id: 'e33',
      title: 'Research Paper Presentation',
      type: 'academic',
      startDate: '2025-11-10',
      endDate: '2025-11-12',
      description: 'Student research paper presentation symposium',
      department: 'Research & Development',
      status: 'scheduled'
    },
    {
      id: 'e34',
      title: 'Inter-College Debate Competition',
      type: 'event',
      startDate: '2025-11-18',
      endDate: '2025-11-19',
      description: 'Regional inter-college debate championship',
      department: 'Literary Society',
      status: 'scheduled'
    },
    {
      id: 'e35',
      title: 'Industrial Visit',
      type: 'academic',
      startDate: '2025-11-24',
      endDate: '2025-11-26',
      description: 'Educational industrial visit for final year students',
      department: 'Training & Placement',
      status: 'tentative'
    },
    // December 2025 Events
    {
      id: 'e36',
      title: 'End-Semester Examinations - Fall',
      type: 'exam',
      startDate: '2025-12-08',
      endDate: '2025-12-22',
      description: 'Final examinations for Fall 2025 semester',
      department: 'All Departments',
      status: 'tentative'
    },
    {
      id: 'e37',
      title: 'Christmas Holiday',
      type: 'holiday',
      startDate: '2025-12-25',
      endDate: '2025-12-26',
      description: 'Christmas celebration - Holiday',
      status: 'confirmed'
    },
    {
      id: 'e38',
      title: 'Winter Cultural Fest',
      type: 'event',
      startDate: '2025-12-15',
      endDate: '2025-12-17',
      description: 'End of year cultural celebrations and performances',
      department: 'Cultural Committee',
      status: 'scheduled'
    },
    {
      id: 'e39',
      title: 'New Year Eve Celebration',
      type: 'event',
      startDate: '2025-12-31',
      endDate: '2025-12-31',
      description: 'New Year Eve campus celebration',
      department: 'Student Affairs',
      status: 'tentative'
    }
  ]);

  const [suggestions, setSuggestions] = useState<OptimizationSuggestion[]>([
    {
      id: 's1',
      title: 'Exam Schedule Conflict Detected',
      description: 'Technical Symposium overlaps with exam preparation period. Recommend moving symposium to April 15-17.',
      impact: 'high',
      type: 'conflict'
    },
    {
      id: 's2',
      title: 'Optimal Learning Period Available',
      description: 'Week of March 4-8 has no events. Ideal for scheduling internal assessments.',
      impact: 'medium',
      type: 'optimization'
    },
    {
      id: 's3',
      title: 'Holiday Gap Analysis',
      description: '3-week gap between Spring Break and final exams allows for revision sessions.',
      impact: 'low',
      type: 'gap'
    }
  ]);

  // Handler functions
  const handleGenerateCalendar = () => {
    // Show loading state
    setIsGeneratingCalendar(true);

    // Simulate AI processing delay
    setTimeout(() => {
      // Extract semester year and term
      const [year, term] = modalSemester.split('-');
      const semesterYear = parseInt(year);

      // Determine semester date range
      const startMonth = term === 'spring' ? 0 : 6; // Jan or July
      const endMonth = term === 'spring' ? 5 : 11;  // June or Dec

      // Generate new calendar events based on selected priorities
      const newEvents: CalendarEvent[] = [];

    // 1. Generate Exams (if avoidConflicts is enabled, space them out)
    if (optimizationPriorities.avoidConflicts) {
      // Mid-term exams - spaced appropriately
      newEvents.push({
        id: `ai-exam-mid-${Date.now()}`,
        title: 'AI-Generated Mid-Term Examinations',
        type: 'exam',
        startDate: `${semesterYear}-${String(startMonth + 2).padStart(2, '0')}-15`,
        endDate: `${semesterYear}-${String(startMonth + 2).padStart(2, '0')}-20`,
        description: 'Mid-term examination period with conflict avoidance optimization',
        status: 'tentative'
      });

      // Final exams
      newEvents.push({
        id: `ai-exam-final-${Date.now() + 1}`,
        title: 'AI-Generated Final Examinations',
        type: 'exam',
        startDate: `${semesterYear}-${String(endMonth + 1).padStart(2, '0')}-10`,
        endDate: `${semesterYear}-${String(endMonth + 1).padStart(2, '0')}-20`,
        description: 'Final examination period with optimized scheduling',
        status: 'tentative'
      });
    }

    // 2. Generate Academic Events (if optimizeLearning is enabled)
    if (optimizationPriorities.optimizeLearning) {
      newEvents.push({
        id: `ai-academic-orientation-${Date.now()}`,
        title: 'Academic Orientation Week',
        type: 'academic',
        startDate: `${semesterYear}-${String(startMonth + 1).padStart(2, '0')}-01`,
        endDate: `${semesterYear}-${String(startMonth + 1).padStart(2, '0')}-05`,
        description: 'Optimized orientation to maximize learning readiness',
        status: 'scheduled'
      });

      newEvents.push({
        id: `ai-academic-workshop-${Date.now() + 2}`,
        title: 'Study Skills Workshop',
        type: 'academic',
        startDate: `${semesterYear}-${String(startMonth + 3).padStart(2, '0')}-15`,
        description: 'Learning optimization workshop for students',
        status: 'scheduled'
      });
    }

    // 3. Consider Holidays (if enabled, add buffer periods)
    if (optimizationPriorities.considerHolidays) {
      newEvents.push({
        id: `ai-holiday-break-${Date.now() + 3}`,
        title: 'AI-Optimized Study Break',
        type: 'holiday',
        startDate: `${semesterYear}-${String(startMonth + 3).padStart(2, '0')}-20`,
        endDate: `${semesterYear}-${String(startMonth + 3).padStart(2, '0')}-22`,
        description: 'Strategic break period for optimal learning retention',
        status: 'confirmed'
      });
    }

    // 4. Balance Workload (if enabled, add review periods)
    if (optimizationPriorities.balanceWorkload) {
      newEvents.push({
        id: `ai-event-review-${Date.now() + 4}`,
        title: 'Workload Balance Review Session',
        type: 'event',
        startDate: `${semesterYear}-${String(startMonth + 2).padStart(2, '0')}-01`,
        description: 'Structured review to balance academic workload',
        status: 'scheduled'
      });
    }

      // Debug: Log generated events
      console.log('=== AI CALENDAR GENERATION DEBUG ===');
      console.log('Generated events:', newEvents);
      console.log('Event count:', newEvents.length);
      newEvents.forEach(event => {
        console.log(`- ${event.title}: ${event.startDate} to ${event.endDate || event.startDate} (type: ${event.type})`);
      });
      console.log('====================================');

      // Add all new events to existing calendar
      setCalendarEvents([...calendarEvents, ...newEvents]);

      // Show success message
      alert(`✅ Successfully generated ${newEvents.length} calendar events for ${term} ${year} with AI optimization!`);

      // Hide loading state
      setIsGeneratingCalendar(false);

      // Close modal and switch to calendar view
      setShowPredictorModal(false);
      setActiveTab('calendar');
    }, 2000); // 2 second delay for loading animation
  };

  // AI Predictor handlers
  const handleApplyAllSuggestions = () => {
    if (suggestions.length === 0) {
      alert('No suggestions to apply!');
      return;
    }
    alert(`Applied ${suggestions.length} optimization suggestions! Calendar has been optimized.`);
    setSuggestions([]);
  };

  const handleApplySuggestion = (suggestionId: string) => {
    const suggestion = suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    alert(`Applied: ${suggestion.title}`);
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  const handleDismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  // Events handlers
  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.startDate) {
      alert('Please fill in Title and Start Date');
      return;
    }

    const event: CalendarEvent = {
      id: `e${Date.now()}`,
      title: newEvent.title!,
      type: newEvent.type as CalendarEvent['type'],
      startDate: newEvent.startDate!,
      endDate: newEvent.endDate,
      description: newEvent.description || '',
      department: newEvent.department,
      status: newEvent.status as CalendarEvent['status']
    };

    setCalendarEvents(prev => [...prev, event].sort((a, b) =>
      new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    ));

    setNewEvent({
      title: '',
      type: 'academic',
      startDate: '',
      endDate: '',
      description: '',
      status: 'tentative'
    });
    setShowAddEventModal(false);
    alert('Event added successfully!');
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setShowEditEventModal(true);
  };

  const handleUpdateEvent = () => {
    if (!editingEvent) return;

    setCalendarEvents(prev =>
      prev.map(e => e.id === editingEvent.id ? editingEvent : e)
    );

    setShowEditEventModal(false);
    setEditingEvent(null);
    alert('Event updated successfully!');
  };

  const handleDeleteEvent = (eventId: string, eventTitle: string) => {
    if (!window.confirm(`Delete "${eventTitle}"? This cannot be undone.`)) {
      return;
    }

    setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
    alert('Event deleted successfully!');
  };

  // Modal configuration handlers
  const handlePriorityChange = (key: keyof typeof optimizationPriorities) => {
    setOptimizationPriorities(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Month navigation handlers
  const goToPreviousMonth = () => {
    setCurrentDisplayMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const goToNextMonth = () => {
    setCurrentDisplayMonth(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDisplayMonth(new Date());
  };

  // Semester change handler
  const handleSemesterChange = (semester: string) => {
    setSelectedSemester(semester);

    // Navigate calendar to the start of the selected semester
    const [year, term] = semester.split('-');
    const startMonth = term === 'spring' ? 0 : 6; // January (0) or July (6)
    setCurrentDisplayMonth(new Date(parseInt(year), startMonth, 1));
  };

  // Day click handler
  const handleDayClick = (day: number) => {
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();
    const clickedDate = new Date(year, month, day);
    setSelectedDate(clickedDate);
    setShowDayEventsModal(true);
  };

  // Filter events
  // Filter to show only AI-generated events
  const aiEvents = calendarEvents.filter(event => event.id.startsWith('ai-'));

  const filteredEvents = eventFilter === 'all'
    ? aiEvents
    : aiEvents.filter(event => event.type === eventFilter);

  // Calendar helper functions
  const getCalendarMonth = () => {
    return currentDisplayMonth;
  };

  const generateCalendarDays = () => {
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: (number | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add actual days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // Debug logging (only for day 15 to avoid spam)
    if (day === 15) {
      console.log(`[getEventsForDate] Checking day ${day} (${dateStr})`);
      console.log(`[getEventsForDate] Total calendar events: ${calendarEvents.length}`);
      console.log(`[getEventsForDate] AI events: ${calendarEvents.filter(e => e.id.startsWith('ai-')).length}`);
    }

    // FILTER: Only show AI-generated events
    let filteredEvents = calendarEvents.filter(event => event.id.startsWith('ai-'));

    filteredEvents = filteredEvents.filter(event => {
      const eventStart = event.startDate;
      const eventEnd = event.endDate || event.startDate;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });

    // Apply semester filter
    const [semesterYear, semesterTerm] = selectedSemester.split('-');
    const semesterStartMonth = semesterTerm === 'spring' ? 1 : 7; // January or July
    const semesterEndMonth = semesterTerm === 'spring' ? 6 : 12; // June or December

    filteredEvents = filteredEvents.filter(event => {
      const eventDate = new Date(event.startDate);
      const eventYear = eventDate.getFullYear();
      const eventMonth = eventDate.getMonth() + 1;

      return eventYear === parseInt(semesterYear) &&
             eventMonth >= semesterStartMonth &&
             eventMonth <= semesterEndMonth;
    });

    // Apply calendar filter
    let finalEvents;
    if (calendarFilter === 'all') {
      finalEvents = filteredEvents;
    } else if (calendarFilter === 'confirmed') {
      finalEvents = filteredEvents.filter(event => event.status === 'confirmed');
    } else if (calendarFilter === 'upcoming') {
      const today = new Date();
      finalEvents = filteredEvents.filter(event => new Date(event.startDate) >= today);
    } else {
      // Filter by event type
      finalEvents = filteredEvents.filter(event => event.type === calendarFilter);
    }

    // Debug logging
    if (day === 15) {
      console.log(`[getEventsForDate] Final events for ${dateStr}:`, finalEvents.length);
      console.log(`[getEventsForDate] Calendar filter: ${calendarFilter}`);
      if (finalEvents.length > 0) {
        finalEvents.forEach(e => console.log(`  - ${e.title} (${e.type})`));
      }
    }

    return finalEvents;
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    const year = currentDisplayMonth.getFullYear();
    const month = currentDisplayMonth.getMonth();
    return day === today.getDate() &&
           month === today.getMonth() &&
           year === today.getFullYear();
  };

  const getSelectedDateEvents = () => {
    if (!selectedDate) return [];
    const dateStr = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return calendarEvents.filter(event => {
      const eventStart = event.startDate;
      const eventEnd = event.endDate || event.startDate;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  return (
    <div className="calendar-predictor-container">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-calendar-alt"></i> Academic Calendar Predictor</h1>
          <p>AI-optimized semester planning with exam schedules and event management</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Add Event functionality')}>
            <i className="fas fa-plus"></i>
            Add Event
          </button>
          <button className="btn-secondary" onClick={() => alert('Export Calendar functionality')}>
            <i className="fas fa-download"></i>
            Export Calendar
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card primary">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Calendar Utilization</span>
            <span className="stat-value">92%</span>
            <span className="stat-trend">
              <i className="fas fa-arrow-up"></i> 40% better than manual
            </span>
          </div>
        </div>
        <div className="stat-card success">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Conflict-Free Days</span>
            <span className="stat-value">156</span>
            <span className="stat-trend">
              <i className="fas fa-shield-alt"></i> Zero scheduling conflicts
            </span>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Upcoming Events</span>
            <span className="stat-value">12</span>
            <span className="stat-trend">
              <i className="fas fa-calendar-day"></i> Next 30 days
            </span>
          </div>
        </div>
        <div className="stat-card info">
          <div className="stat-icon">
            <i className="fas fa-brain"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">AI Optimizations</span>
            <span className="stat-value">24</span>
            <span className="stat-trend">
              <i className="fas fa-lightbulb"></i> Suggestions applied
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <div className="tabs-header">
          <button
            className={`tab-button ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            <i className="fas fa-calendar"></i>
            Calendar View
          </button>
          <button
            className={`tab-button ${activeTab === 'predictor' ? 'active' : ''}`}
            onClick={() => setActiveTab('predictor')}
          >
            <i className="fas fa-brain"></i>
            AI Predictor
          </button>
          <button
            className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <i className="fas fa-list"></i>
            Events List
          </button>
          <button
            className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <i className="fas fa-chart-bar"></i>
            Analytics
          </button>
        </div>

        <div className="tab-content">
          {/* Calendar View Tab */}
          {activeTab === 'calendar' && (
            <div className="calendar-view">
              <div className="calendar-controls">
                <div className="calendar-filters-group">
                  <select
                    className="semester-dropdown"
                    value={selectedSemester}
                    onChange={(e) => handleSemesterChange(e.target.value)}
                  >
                    <option value="2025-spring">Spring 2025</option>
                    <option value="2025-fall">Fall 2025</option>
                  </select>
                  <select
                    className="calendar-filter-dropdown"
                    value={calendarFilter}
                    onChange={(e) => setCalendarFilter(e.target.value as any)}
                  >
                    <option value="all">All Events</option>
                    <optgroup label="By Type">
                      <option value="exam">📋 Examinations</option>
                      <option value="holiday">🏖️ Holidays</option>
                      <option value="event">⭐ Events</option>
                      <option value="academic">🎓 Academic</option>
                    </optgroup>
                    <optgroup label="By Status">
                      <option value="confirmed">✓ Confirmed Only</option>
                      <option value="upcoming">⏰ Upcoming Only</option>
                    </optgroup>
                  </select>
                </div>
                <div className="view-toggles">
                  <button
                    className={`toggle-btn ${calendarView === 'month' ? 'active' : ''}`}
                    onClick={() => setCalendarView('month')}
                  >
                    Month
                  </button>
                  <button
                    className={`toggle-btn ${calendarView === 'week' ? 'active' : ''}`}
                    onClick={() => setCalendarView('week')}
                  >
                    Week
                  </button>
                  <button
                    className={`toggle-btn ${calendarView === 'list' ? 'active' : ''}`}
                    onClick={() => setCalendarView('list')}
                  >
                    List
                  </button>
                </div>
              </div>

              {/* Month View */}
              {calendarView === 'month' && (
                <>
                {hasAIGeneratedEvents() && !isGeneratingCalendar && (
                <div className="calendar-month-view">
                  <div className="calendar-nav-header">
                    <div className="calendar-nav-controls">
                      <button className="nav-btn" onClick={goToPreviousMonth}>
                        <i className="fas fa-chevron-left"></i>
                      </button>
                      <h3 className="calendar-month-title">
                        {currentDisplayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h3>
                      <button className="nav-btn" onClick={goToNextMonth}>
                        <i className="fas fa-chevron-right"></i>
                      </button>
                    </div>
                    <div className="calendar-header-actions">
                      <button className="btn-today" onClick={goToToday}>
                        <i className="fas fa-calendar-day"></i>
                        Today
                      </button>
                      <div className="calendar-legend">
                        <div className="legend-item">
                          <i className="fas fa-clipboard-check legend-icon exam"></i>
                          <span>Exams</span>
                        </div>
                        <div className="legend-item">
                          <i className="fas fa-umbrella-beach legend-icon holiday"></i>
                          <span>Holidays</span>
                        </div>
                        <div className="legend-item">
                          <i className="fas fa-calendar-star legend-icon event"></i>
                          <span>Events</span>
                        </div>
                        <div className="legend-item">
                          <i className="fas fa-graduation-cap legend-icon academic"></i>
                          <span>Academic</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="calendar-grid">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="calendar-weekday">{day}</div>
                    ))}
                    {generateCalendarDays().map((day, index) => {
                      const dayEvents = day ? getEventsForDate(day) : [];
                      return (
                        <div
                          key={`${currentDisplayMonth.getFullYear()}-${currentDisplayMonth.getMonth()}-${day || index}`}
                          className={`calendar-day-cell ${day ? '' : 'empty'} ${day && isToday(day) ? 'today' : ''} ${day ? 'clickable' : ''}`}
                          onClick={() => day && handleDayClick(day)}
                        >
                          {day && (
                            <>
                              <div className="day-number">{day}</div>
                              <div className="day-events">
                                {dayEvents.slice(0, 2).map(event => (
                                  <div
                                    key={event.id}
                                    className={`event-indicator ${event.type}`}
                                    title={event.title}
                                  >
                                    <i className={`fas ${
                                      event.type === 'exam' ? 'fa-clipboard-check' :
                                      event.type === 'holiday' ? 'fa-umbrella-beach' :
                                      event.type === 'event' ? 'fa-calendar-star' :
                                      'fa-graduation-cap'
                                    }`}></i>
                                    <span>{event.title}</span>
                                  </div>
                                ))}
                                {dayEvents.length > 2 && (
                                  <div className="event-count-badge">
                                    +{dayEvents.length - 2} more
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
                )}

                {/* Loading Animation */}
                {isGeneratingCalendar && (
                  <div className="ai-calendar-loading">
                    <div className="loading-content">
                      <div className="calendar-loader">
                        <i className="fas fa-calendar-alt"></i>
                        <div className="loader-spinner"></div>
                      </div>
                      <h4>Generating AI Calendar...</h4>
                      <p>Analyzing academic data and optimizing schedules</p>
                      <div className="loading-progress">
                        <div className="progress-bar"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Placeholder */}
                {!hasAIGeneratedEvents() && !isGeneratingCalendar && (
                  <div className="ai-calendar-placeholder">
                    <div className="placeholder-content">
                      <i className="fas fa-calendar-alt"></i>
                      <h4>No AI-Generated Calendar Yet</h4>
                      <p>Create an optimized academic calendar with AI assistance</p>
                      <button
                        className="btn-generate-placeholder"
                        onClick={() => setShowPredictorModal(true)}
                      >
                        <i className="fas fa-calendar-plus"></i>
                        Generate AI Calendar
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}

              {/* Week View */}
              {calendarView === 'week' && (
                <>
                {hasAIGeneratedEvents() && !isGeneratingCalendar && (
                <div className="calendar-week-view">
                  <div className="week-view-header">
                    <h3>
                      <i className="fas fa-calendar-week"></i>
                      Week View
                    </h3>
                    <p className="week-range">
                      {currentDisplayMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="week-grid">
                    {(() => {
                      const startOfWeek = new Date(currentDisplayMonth);
                      startOfWeek.setDate(1);
                      const days = [];
                      for (let i = 0; i < 7; i++) {
                        const date = new Date(startOfWeek);
                        date.setDate(startOfWeek.getDate() + i);
                        days.push(date);
                      }
                      return days.map((date, index) => {
                        const dayEvents = calendarEvents.filter(event => {
                          const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                          const eventStart = event.startDate;
                          const eventEnd = event.endDate || event.startDate;
                          return dateStr >= eventStart && dateStr <= eventEnd;
                        });
                        const isTodayDate = date.toDateString() === new Date().toDateString();
                        return (
                          <div key={index} className={`week-day-column ${isTodayDate ? 'today' : ''}`}>
                            <div className="week-day-header">
                              <span className="week-day-name">
                                {date.toLocaleDateString('en-US', { weekday: 'short' })}
                              </span>
                              <span className="week-day-date">{date.getDate()}</span>
                            </div>
                            <div className="week-events-list">
                              {dayEvents.slice(0, 3).map(event => (
                                <div key={event.id} className={`week-event-item ${event.type}`}>
                                  <i className={`fas ${
                                    event.type === 'exam' ? 'fa-clipboard-check' :
                                    event.type === 'holiday' ? 'fa-umbrella-beach' :
                                    event.type === 'event' ? 'fa-calendar-star' :
                                    'fa-graduation-cap'
                                  }`}></i>
                                  <span className="week-event-title">{event.title}</span>
                                </div>
                              ))}
                              {dayEvents.length > 3 && (
                                <div className="week-event-more">
                                  +{dayEvents.length - 3} more
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
                )}

                {/* Loading Animation */}
                {isGeneratingCalendar && (
                  <div className="ai-calendar-loading">
                    <div className="loading-content">
                      <div className="calendar-loader">
                        <i className="fas fa-calendar-alt"></i>
                        <div className="loader-spinner"></div>
                      </div>
                      <h4>Generating AI Calendar...</h4>
                      <p>Analyzing academic data and optimizing schedules</p>
                      <div className="loading-progress">
                        <div className="progress-bar"></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Placeholder */}
                {!hasAIGeneratedEvents() && !isGeneratingCalendar && (
                  <div className="ai-calendar-placeholder">
                    <div className="placeholder-content">
                      <i className="fas fa-calendar-alt"></i>
                      <h4>No AI-Generated Calendar Yet</h4>
                      <p>Create an optimized academic calendar with AI assistance</p>
                      <button
                        className="btn-generate-placeholder"
                        onClick={() => setShowPredictorModal(true)}
                      >
                        <i className="fas fa-calendar-plus"></i>
                        Generate AI Calendar
                      </button>
                    </div>
                  </div>
                )}
                </>
              )}

              {/* List View */}
              {calendarView === 'list' && (
                <div className="calendar-list-view">
                  <div className="list-view-header">
                    <h3>
                      <i className="fas fa-list-ul"></i>
                      Events Timeline
                    </h3>
                    <p className="timeline-subtitle">All upcoming events in chronological order</p>
                  </div>

                  {/* Loading Animation */}
                  {isGeneratingCalendar && (
                    <div className="ai-calendar-loading">
                      <div className="loading-content">
                        <div className="calendar-loader">
                          <i className="fas fa-calendar-alt"></i>
                          <div className="loader-spinner"></div>
                        </div>
                        <h4>Generating AI Calendar...</h4>
                        <p>Analyzing academic data and optimizing schedules</p>
                        <div className="loading-progress">
                          <div className="progress-bar"></div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Placeholder when no AI events exist */}
                  {!hasAIGeneratedEvents() && !isGeneratingCalendar && (
                    <div className="ai-calendar-placeholder-list">
                      <div className="placeholder-content">
                        <i className="fas fa-wand-magic-sparkles"></i>
                        <h4>No AI-Generated Events Yet</h4>
                        <p>Generate an optimized calendar to see AI-created academic events here</p>
                        <button
                          className="btn-generate-placeholder"
                          onClick={() => setShowPredictorModal(true)}
                        >
                          <i className="fas fa-magic"></i>
                          Generate AI Calendar
                        </button>
                      </div>
                    </div>
                  )}

                  {hasAIGeneratedEvents() && !isGeneratingCalendar && (
                  <div className="list-events-container">
                    {calendarEvents.filter(event => event.id.startsWith('ai-')).map((event, index) => {
                      const eventDate = new Date(event.startDate);
                      const isEventToday = eventDate.toDateString() === new Date().toDateString();
                      return (
                        <div key={event.id} className={`list-event-item ${event.type} ${isEventToday ? 'today-event' : ''}`}>
                          <div className={`list-event-date ${isEventToday ? 'today' : ''}`}>
                            <span className="list-event-day">
                              {eventDate.getDate()}
                            </span>
                            <span className="list-event-month">
                              {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                            </span>
                            <span className="list-event-year">
                              {eventDate.getFullYear()}
                            </span>
                          </div>
                          <div className="list-event-details">
                            <div className="list-event-header">
                              <h3 className="list-event-title">{event.title}</h3>
                              <div className="list-event-badges">
                                <span className={`list-type-badge ${event.type}`}>
                                  <i className={`fas ${
                                    event.type === 'exam' ? 'fa-clipboard-check' :
                                    event.type === 'holiday' ? 'fa-umbrella-beach' :
                                    event.type === 'event' ? 'fa-calendar-star' :
                                    'fa-graduation-cap'
                                  }`}></i>
                                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                                </span>
                                <span className={`list-status-badge ${event.status}`}>
                                  <i className={`fas ${
                                    event.status === 'confirmed' ? 'fa-check-circle' :
                                    event.status === 'scheduled' ? 'fa-clock' :
                                    'fa-question-circle'
                                  }`}></i>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                              </div>
                            </div>
                            {event.description && (
                              <p className="list-event-description">{event.description}</p>
                            )}
                            <div className="list-event-meta">
                              <span>
                                <i className="fas fa-calendar"></i>
                                {event.startDate === event.endDate || !event.endDate ? (
                                  eventDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
                                ) : (
                                  `${eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                                )}
                              </span>
                              {event.department && (
                                <span>
                                  <i className="fas fa-building"></i>
                                  {event.department}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* AI Predictor Tab */}
          {activeTab === 'predictor' && (
            <div className="predictor-view">
              <div className="predictor-header">
                <h3>
                  <i className="fas fa-brain"></i>
                  AI Optimization Suggestions
                </h3>
                <button className="btn-apply-all" onClick={handleApplyAllSuggestions}>
                  <i className="fas fa-check-double"></i>
                  Apply All Suggestions
                </button>
              </div>

              <div className="suggestions-grid">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className={`suggestion-card ${suggestion.impact}`}>
                    <div className="suggestion-header">
                      <div className="suggestion-type">
                        {suggestion.type === 'conflict' && <i className="fas fa-exclamation-circle"></i>}
                        {suggestion.type === 'optimization' && <i className="fas fa-lightbulb"></i>}
                        {suggestion.type === 'gap' && <i className="fas fa-info-circle"></i>}
                        <span>{suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}</span>
                      </div>
                      <span className={`impact-badge ${suggestion.impact}`}>
                        {suggestion.impact.toUpperCase()} IMPACT
                      </span>
                    </div>
                    <h4>{suggestion.title}</h4>
                    <p>{suggestion.description}</p>
                    <div className="suggestion-actions">
                      <button className="btn-apply" onClick={() => handleApplySuggestion(suggestion.id)}>
                        <i className="fas fa-check"></i>
                        Apply
                      </button>
                      <button className="btn-dismiss" onClick={() => handleDismissSuggestion(suggestion.id)}>
                        <i className="fas fa-times"></i>
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="optimization-metrics">
                <div className="section-header">
                  <h3>
                    <i className="fas fa-chart-line"></i>
                    Optimization Metrics
                  </h3>
                  <p className="section-description">
                    Track scheduling performance and system optimization
                  </p>
                </div>
                <div className="metrics-grid">
                  <div className="metric-card excellent">
                    <div className="metric-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Scheduling Efficiency</div>
                      <div className="metric-stats">
                        <div className="metric-value">92%</div>
                        <div className="metric-trend positive">
                          <i className="fas fa-arrow-up"></i>
                          +3%
                        </div>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill excellent" style={{ width: '92%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="metric-card excellent">
                    <div className="metric-icon">
                      <i className="fas fa-shield-check"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Conflict Resolution</div>
                      <div className="metric-stats">
                        <div className="metric-value">100%</div>
                        <div className="metric-trend positive">
                          <i className="fas fa-arrow-up"></i>
                          +5%
                        </div>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill excellent" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="metric-card good">
                    <div className="metric-icon">
                      <i className="fas fa-brain"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Learning Period Optimization</div>
                      <div className="metric-stats">
                        <div className="metric-value">85%</div>
                        <div className="metric-trend positive">
                          <i className="fas fa-arrow-up"></i>
                          +2%
                        </div>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill good" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                  <div className="metric-card good">
                    <div className="metric-icon">
                      <i className="fas fa-chart-pie"></i>
                    </div>
                    <div className="metric-content">
                      <div className="metric-label">Resource Utilization</div>
                      <div className="metric-stats">
                        <div className="metric-value">88%</div>
                        <div className="metric-trend positive">
                          <i className="fas fa-arrow-up"></i>
                          +4%
                        </div>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill good" style={{ width: '88%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Events List Tab */}
          {activeTab === 'events' && (
            <div className="events-view">
              <div className="events-header">
                <h3>All Events</h3>
                <div className="events-filters">
                  <select
                    className="filter-dropdown"
                    value={eventFilter}
                    onChange={(e) => setEventFilter(e.target.value as typeof eventFilter)}
                  >
                    <option value="all">All Types</option>
                    <option value="exam">Exams</option>
                    <option value="holiday">Holidays</option>
                    <option value="event">Events</option>
                    <option value="academic">Academic</option>
                  </select>
                  <button className="btn-add-event" onClick={() => setShowAddEventModal(true)}>
                    <i className="fas fa-plus"></i>
                    Add Event
                  </button>
                </div>
              </div>

              {/* Loading Animation */}
              {isGeneratingCalendar && (
                <div className="ai-calendar-loading">
                  <div className="loading-content">
                    <div className="calendar-loader">
                      <i className="fas fa-calendar-alt"></i>
                      <div className="loader-spinner"></div>
                    </div>
                    <h4>Generating AI Calendar...</h4>
                    <p>Analyzing academic data and optimizing schedules</p>
                    <div className="loading-progress">
                      <div className="progress-bar"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder when no AI events exist */}
              {!hasAIGeneratedEvents() && !isGeneratingCalendar && (
                <div className="ai-calendar-placeholder">
                  <div className="placeholder-content">
                    <i className="fas fa-wand-magic-sparkles"></i>
                    <h4>No AI-Generated Events Yet</h4>
                    <p>Create an optimized academic calendar to see AI-generated events here</p>
                    <button
                      className="btn-generate-placeholder"
                      onClick={() => setShowPredictorModal(true)}
                    >
                      <i className="fas fa-magic"></i>
                      Generate AI Calendar
                    </button>
                  </div>
                </div>
              )}

              <div className="events-timeline">
                {filteredEvents.map((event) => (
                  <div key={event.id} className={`event-card ${event.type}`}>
                    <div className="event-date">
                      <div className="event-day">{new Date(event.startDate).getDate()}</div>
                      <div className="event-month">
                        {new Date(event.startDate).toLocaleDateString('en-US', { month: 'short' })}
                      </div>
                    </div>
                    <div className="event-details">
                      <div className="event-header-row">
                        <h4>{event.title}</h4>
                        <span className={`event-status ${event.status}`}>
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="event-description">{event.description}</p>
                      <div className="event-meta">
                        <span className={`event-type-badge ${event.type}`}>
                          {event.type === 'exam' && <i className="fas fa-file-alt"></i>}
                          {event.type === 'holiday' && <i className="fas fa-umbrella-beach"></i>}
                          {event.type === 'event' && <i className="fas fa-calendar-star"></i>}
                          {event.type === 'academic' && <i className="fas fa-graduation-cap"></i>}
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </span>
                        {event.endDate && (
                          <span className="event-duration">
                            <i className="fas fa-clock"></i>
                            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="event-actions">
                      <button className="action-btn edit" onClick={() => handleEditEvent(event)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="action-btn delete" onClick={() => handleDeleteEvent(event.id, event.title)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="analytics-view">
              {/* Loading Animation */}
              {isGeneratingCalendar && (
                <div className="ai-calendar-loading">
                  <div className="loading-content">
                    <div className="calendar-loader">
                      <i className="fas fa-calendar-alt"></i>
                      <div className="loader-spinner"></div>
                    </div>
                    <h4>Generating AI Calendar...</h4>
                    <p>Analyzing academic data and optimizing schedules</p>
                    <div className="loading-progress">
                      <div className="progress-bar"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Placeholder when no AI events exist */}
              {!hasAIGeneratedEvents() && !isGeneratingCalendar && (
                <div className="ai-calendar-placeholder">
                  <div className="placeholder-content">
                    <i className="fas fa-wand-magic-sparkles"></i>
                    <h4>No AI-Generated Analytics Yet</h4>
                    <p>Generate an optimized calendar to view analytics and insights</p>
                    <button
                      className="btn-generate-placeholder"
                      onClick={() => setShowPredictorModal(true)}
                    >
                      <i className="fas fa-magic"></i>
                      Generate AI Calendar
                    </button>
                  </div>
                </div>
              )}

              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>
                    <i className="fas fa-chart-pie"></i>
                    Event Distribution
                  </h3>
                  <div className="chart-placeholder">
                    <div className="pie-chart-visual">
                      <div className="pie-segment exams" style={{ '--percentage': '35' } as any}>
                        <span>35%</span>
                        <label>Exams</label>
                      </div>
                      <div className="pie-segment holidays" style={{ '--percentage': '20' } as any}>
                        <span>20%</span>
                        <label>Holidays</label>
                      </div>
                      <div className="pie-segment events" style={{ '--percentage': '30' } as any}>
                        <span>30%</span>
                        <label>Events</label>
                      </div>
                      <div className="pie-segment academic" style={{ '--percentage': '15' } as any}>
                        <span>15%</span>
                        <label>Academic</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>
                    <i className="fas fa-calendar-week"></i>
                    Weekly Utilization
                  </h3>
                  <div className="utilization-bars">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                      const percentage = [85, 90, 75, 88, 92, 45, 30][index];
                      return (
                        <div key={day} className="utilization-bar-item">
                          <div className="bar-label">{day}</div>
                          <div className="bar-container">
                            <div
                              className="weekly-util-bar"
                              style={{
                                height: `${percentage}%`,
                                backgroundColor: getBarColor(percentage)
                              }}
                            ></div>
                          </div>
                          <div className="bar-value">{percentage}%</div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="analytics-card full-width">
                  <h3>
                    <i className="fas fa-trophy"></i>
                    Optimization Achievements
                  </h3>
                  <div className="achievements-grid">
                    <div className="achievement-item">
                      <div className="achievement-icon">
                        <i className="fas fa-check-circle"></i>
                      </div>
                      <div className="achievement-content">
                        <h4>Zero Conflicts</h4>
                        <p>No scheduling conflicts for 3 consecutive semesters</p>
                      </div>
                    </div>
                    <div className="achievement-item">
                      <div className="achievement-icon">
                        <i className="fas fa-bolt"></i>
                      </div>
                      <div className="achievement-content">
                        <h4>Peak Efficiency</h4>
                        <p>92% calendar utilization - highest in institution history</p>
                      </div>
                    </div>
                    <div className="achievement-item">
                      <div className="achievement-icon">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="achievement-content">
                        <h4>Time Saved</h4>
                        <p>40 hours saved on manual calendar planning this semester</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Predictor Modal */}
      {showPredictorModal && (
        <div className="modal-overlay" onClick={() => setShowPredictorModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-magic"></i>
                Generate AI-Optimized Calendar
              </h2>
              <button className="modal-close" onClick={() => setShowPredictorModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-description">
                Our AI will analyze all holidays, events, and optimal learning periods to create a conflict-free academic calendar with 40% better utilization.
              </p>

              <div className="modal-options">
                <div className="option-group">
                  <label>Select Semester</label>
                  <select
                    className="modal-select"
                    value={modalSemester}
                    onChange={(e) => setModalSemester(e.target.value)}
                  >
                    <option value="2024-spring">Spring 2024</option>
                    <option value="2024-fall">Fall 2024</option>
                    <option value="2025-spring">Spring 2025</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>Optimization Priorities</label>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={optimizationPriorities.avoidConflicts}
                        onChange={() => handlePriorityChange('avoidConflicts')}
                      />
                      <span>Avoid exam conflicts</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={optimizationPriorities.optimizeLearning}
                        onChange={() => handlePriorityChange('optimizeLearning')}
                      />
                      <span>Optimize learning periods</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={optimizationPriorities.considerHolidays}
                        onChange={() => handlePriorityChange('considerHolidays')}
                      />
                      <span>Consider holidays and events</span>
                    </label>
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={optimizationPriorities.balanceWorkload}
                        onChange={() => handlePriorityChange('balanceWorkload')}
                      />
                      <span>Balance workload distribution</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowPredictorModal(false)} disabled={isGeneratingCalendar}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleGenerateCalendar} disabled={isGeneratingCalendar}>
                {isGeneratingCalendar ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Generating Calendar...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Generate Calendar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="modal-overlay" onClick={() => setShowAddEventModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-plus-circle"></i>
                Add New Event
              </h2>
              <button className="modal-close" onClick={() => setShowAddEventModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-options">
                <div className="option-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    className="modal-select"
                    placeholder="Enter event title"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Event Type *</label>
                  <select
                    className="modal-select"
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as CalendarEvent['type']})}
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    className="modal-select"
                    value={newEvent.startDate}
                    onChange={(e) => setNewEvent({...newEvent, startDate: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="modal-select"
                    value={newEvent.endDate || ''}
                    onChange={(e) => setNewEvent({...newEvent, endDate: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Description</label>
                  <input
                    type="text"
                    className="modal-select"
                    placeholder="Enter event description"
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Department</label>
                  <input
                    type="text"
                    className="modal-select"
                    placeholder="Enter department (optional)"
                    value={newEvent.department || ''}
                    onChange={(e) => setNewEvent({...newEvent, department: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Status</label>
                  <select
                    className="modal-select"
                    value={newEvent.status}
                    onChange={(e) => setNewEvent({...newEvent, status: e.target.value as CalendarEvent['status']})}
                  >
                    <option value="tentative">Tentative</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowAddEventModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleAddEvent}>
                <i className="fas fa-plus"></i>
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditEventModal && editingEvent && (
        <div className="modal-overlay" onClick={() => setShowEditEventModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-edit"></i>
                Edit Event
              </h2>
              <button className="modal-close" onClick={() => setShowEditEventModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-options">
                <div className="option-group">
                  <label>Event Title *</label>
                  <input
                    type="text"
                    className="modal-select"
                    value={editingEvent.title}
                    onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Event Type *</label>
                  <select
                    className="modal-select"
                    value={editingEvent.type}
                    onChange={(e) => setEditingEvent({...editingEvent, type: e.target.value as CalendarEvent['type']})}
                  >
                    <option value="academic">Academic</option>
                    <option value="exam">Exam</option>
                    <option value="holiday">Holiday</option>
                    <option value="event">Event</option>
                  </select>
                </div>

                <div className="option-group">
                  <label>Start Date *</label>
                  <input
                    type="date"
                    className="modal-select"
                    value={editingEvent.startDate}
                    onChange={(e) => setEditingEvent({...editingEvent, startDate: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    className="modal-select"
                    value={editingEvent.endDate || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, endDate: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Description</label>
                  <input
                    type="text"
                    className="modal-select"
                    value={editingEvent.description}
                    onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Department</label>
                  <input
                    type="text"
                    className="modal-select"
                    value={editingEvent.department || ''}
                    onChange={(e) => setEditingEvent({...editingEvent, department: e.target.value})}
                  />
                </div>

                <div className="option-group">
                  <label>Status</label>
                  <select
                    className="modal-select"
                    value={editingEvent.status}
                    onChange={(e) => setEditingEvent({...editingEvent, status: e.target.value as CalendarEvent['status']})}
                  >
                    <option value="tentative">Tentative</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="confirmed">Confirmed</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditEventModal(false)}>
                Cancel
              </button>
              <button className="btn-confirm" onClick={handleUpdateEvent}>
                <i className="fas fa-save"></i>
                Update Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Day Events Modal */}
      {showDayEventsModal && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowDayEventsModal(false)}>
          <div className="modal day-events-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <i className="fas fa-calendar-day"></i>
                <div>
                  <h2>Events on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</h2>
                  <p>{getSelectedDateEvents().length} {getSelectedDateEvents().length === 1 ? 'event' : 'events'} scheduled</p>
                </div>
              </div>
              <button className="close-btn" onClick={() => setShowDayEventsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {getSelectedDateEvents().length === 0 ? (
                <div className="no-events-message">
                  <i className="fas fa-calendar-xmark"></i>
                  <p>No events scheduled for this day</p>
                </div>
              ) : (
                <div className="day-events-list">
                  {getSelectedDateEvents().map(event => (
                    <div key={event.id} className={`day-event-card ${event.type}`}>
                      <div className="event-card-header">
                        <div className="event-type-badge">
                          <i className={`fas ${
                            event.type === 'exam' ? 'fa-clipboard-check' :
                            event.type === 'holiday' ? 'fa-umbrella-beach' :
                            event.type === 'event' ? 'fa-calendar-star' :
                            'fa-graduation-cap'
                          }`}></i>
                          <span>{event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                        </div>
                        <span className={`status-badge ${event.status}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </div>
                      <h3 className="event-title">{event.title}</h3>
                      {event.description && (
                        <p className="event-description">{event.description}</p>
                      )}
                      <div className="event-meta">
                        <span>
                          <i className="fas fa-calendar"></i>
                          {event.startDate === event.endDate || !event.endDate ? (
                            new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          ) : (
                            `${new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${new Date(event.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                          )}
                        </span>
                        {event.department && (
                          <span>
                            <i className="fas fa-building"></i>
                            {event.department}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-confirm" onClick={() => setShowDayEventsModal(false)}>
                <i className="fas fa-check"></i>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicCalendarPredictor;
