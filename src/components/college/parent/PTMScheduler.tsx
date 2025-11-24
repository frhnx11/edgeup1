import React, { useState, useEffect } from 'react';
import '../Dashboard.css';

// TypeScript Interfaces
interface Child {
  id: string;
  name: string;
  grade: string;
  section: string;
}

interface Teacher {
  id: string;
  name: string;
  subject: string;
  designation: string;
  email: string;
  phone: string;
  avatar: string;
  availability: {
    day: string;
    slots: TimeSlot[];
  }[];
  rating: number;
  totalMeetings: number;
  preferredMode: string[];
}

interface TimeSlot {
  time: string;
  available: boolean;
  date?: string;
}

interface Meeting {
  id: string;
  teacherId: string;
  teacherName: string;
  subject: string;
  date: string;
  time: string;
  duration: number;
  mode: 'in-person' | 'video' | 'phone';
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'rescheduled';
  purpose: string;
  location?: string;
  meetingLink?: string;
  notes?: string;
  requestedBy: string;
  requestedDate: string;
  cancelReason?: string;
}

interface PTMCycle {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'booking-open' | 'booking-closed' | 'ongoing' | 'completed';
  description: string;
  currentStage: number;
  stages: {
    name: string;
    date: string;
    status: 'completed' | 'active' | 'pending';
  }[];
}

const PTMScheduler = () => {
  // Mock Data - Children
  const childrenData: Child[] = [
    { id: 'c1', name: 'Aarav Sharma', grade: '10', section: 'A' },
    { id: 'c2', name: 'Diya Sharma', grade: '7', section: 'B' },
  ];

  // Mock Data - Teachers
  const teachersData: Teacher[] = [
    {
      id: 't1',
      name: 'Dr. Rajesh Sharma',
      subject: 'Mathematics',
      designation: 'Senior Teacher',
      email: 'rajesh.sharma@school.edu',
      phone: '+91 98765 43210',
      avatar: 'RS',
      availability: [
        {
          day: 'Monday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '10:00 AM', available: false },
            { time: '02:00 PM', available: true },
          ],
        },
        {
          day: 'Wednesday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
        {
          day: 'Friday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '02:00 PM', available: false },
            { time: '04:00 PM', available: true },
          ],
        },
      ],
      rating: 4.8,
      totalMeetings: 156,
      preferredMode: ['in-person', 'video'],
    },
    {
      id: 't2',
      name: 'Mrs. Priya Desai',
      subject: 'English',
      designation: 'Head of Department',
      email: 'priya.desai@school.edu',
      phone: '+91 98765 43211',
      avatar: 'PD',
      availability: [
        {
          day: 'Tuesday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '01:00 PM', available: true },
          ],
        },
        {
          day: 'Thursday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '02:00 PM', available: true },
            { time: '04:00 PM', available: false },
          ],
        },
      ],
      rating: 4.9,
      totalMeetings: 203,
      preferredMode: ['in-person', 'video', 'phone'],
    },
    {
      id: 't3',
      name: 'Mr. Vikram Singh',
      subject: 'Physics',
      designation: 'Senior Teacher',
      email: 'vikram.singh@school.edu',
      phone: '+91 98765 43212',
      avatar: 'VS',
      availability: [
        {
          day: 'Monday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
        {
          day: 'Wednesday',
          slots: [
            { time: '09:00 AM', available: false },
            { time: '02:00 PM', available: true },
            { time: '04:00 PM', available: true },
          ],
        },
      ],
      rating: 4.7,
      totalMeetings: 134,
      preferredMode: ['video', 'in-person'],
    },
    {
      id: 't4',
      name: 'Ms. Anita Patel',
      subject: 'Chemistry',
      designation: 'Teacher',
      email: 'anita.patel@school.edu',
      phone: '+91 98765 43213',
      avatar: 'AP',
      availability: [
        {
          day: 'Tuesday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '12:00 PM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
        {
          day: 'Friday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '01:00 PM', available: true },
            { time: '04:00 PM', available: true },
          ],
        },
      ],
      rating: 4.6,
      totalMeetings: 89,
      preferredMode: ['in-person', 'video'],
    },
    {
      id: 't5',
      name: 'Dr. Suresh Reddy',
      subject: 'Biology',
      designation: 'Senior Teacher',
      email: 'suresh.reddy@school.edu',
      phone: '+91 98765 43214',
      avatar: 'SR',
      availability: [
        {
          day: 'Monday',
          slots: [
            { time: '11:00 AM', available: true },
            { time: '02:00 PM', available: true },
            { time: '04:00 PM', available: false },
          ],
        },
        {
          day: 'Thursday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
      ],
      rating: 4.8,
      totalMeetings: 178,
      preferredMode: ['in-person'],
    },
    {
      id: 't6',
      name: 'Mrs. Meena Gupta',
      subject: 'History',
      designation: 'Teacher',
      email: 'meena.gupta@school.edu',
      phone: '+91 98765 43215',
      avatar: 'MG',
      availability: [
        {
          day: 'Wednesday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '12:00 PM', available: true },
            { time: '02:00 PM', available: true },
          ],
        },
        {
          day: 'Friday',
          slots: [
            { time: '11:00 AM', available: true },
            { time: '01:00 PM', available: false },
            { time: '03:00 PM', available: true },
          ],
        },
      ],
      rating: 4.5,
      totalMeetings: 112,
      preferredMode: ['video', 'phone'],
    },
    {
      id: 't7',
      name: 'Mr. Arjun Mehta',
      subject: 'Geography',
      designation: 'Teacher',
      email: 'arjun.mehta@school.edu',
      phone: '+91 98765 43216',
      avatar: 'AM',
      availability: [
        {
          day: 'Tuesday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '02:00 PM', available: true },
          ],
        },
        {
          day: 'Thursday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '01:00 PM', available: true },
            { time: '04:00 PM', available: true },
          ],
        },
      ],
      rating: 4.4,
      totalMeetings: 95,
      preferredMode: ['in-person', 'video'],
    },
    {
      id: 't8',
      name: 'Ms. Kavita Nair',
      subject: 'Computer Science',
      designation: 'Senior Teacher',
      email: 'kavita.nair@school.edu',
      phone: '+91 98765 43217',
      avatar: 'KN',
      availability: [
        {
          day: 'Monday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '12:00 PM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
        {
          day: 'Wednesday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '01:00 PM', available: true },
            { time: '04:00 PM', available: false },
          ],
        },
      ],
      rating: 4.9,
      totalMeetings: 167,
      preferredMode: ['video', 'in-person'],
    },
    {
      id: 't9',
      name: 'Mr. Ravi Kumar',
      subject: 'Physical Education',
      designation: 'Sports Coordinator',
      email: 'ravi.kumar@school.edu',
      phone: '+91 98765 43218',
      avatar: 'RK',
      availability: [
        {
          day: 'Tuesday',
          slots: [
            { time: '08:00 AM', available: true },
            { time: '10:00 AM', available: true },
            { time: '04:00 PM', available: true },
          ],
        },
        {
          day: 'Friday',
          slots: [
            { time: '08:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
      ],
      rating: 4.7,
      totalMeetings: 143,
      preferredMode: ['in-person'],
    },
    {
      id: 't10',
      name: 'Mrs. Sunita Joshi',
      subject: 'Hindi',
      designation: 'Teacher',
      email: 'sunita.joshi@school.edu',
      phone: '+91 98765 43219',
      avatar: 'SJ',
      availability: [
        {
          day: 'Monday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '01:00 PM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
        {
          day: 'Thursday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '12:00 PM', available: true },
            { time: '02:00 PM', available: false },
          ],
        },
      ],
      rating: 4.6,
      totalMeetings: 108,
      preferredMode: ['in-person', 'phone'],
    },
    {
      id: 't11',
      name: 'Dr. Ashok Verma',
      subject: 'Sanskrit',
      designation: 'Senior Teacher',
      email: 'ashok.verma@school.edu',
      phone: '+91 98765 43220',
      avatar: 'AV',
      availability: [
        {
          day: 'Wednesday',
          slots: [
            { time: '09:00 AM', available: true },
            { time: '11:00 AM', available: true },
            { time: '02:00 PM', available: true },
          ],
        },
        {
          day: 'Friday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '12:00 PM', available: true },
            { time: '04:00 PM', available: true },
          ],
        },
      ],
      rating: 4.5,
      totalMeetings: 76,
      preferredMode: ['in-person', 'video'],
    },
    {
      id: 't12',
      name: 'Ms. Pooja Iyer',
      subject: 'Art & Craft',
      designation: 'Teacher',
      email: 'pooja.iyer@school.edu',
      phone: '+91 98765 43221',
      avatar: 'PI',
      availability: [
        {
          day: 'Tuesday',
          slots: [
            { time: '11:00 AM', available: true },
            { time: '01:00 PM', available: true },
            { time: '03:00 PM', available: true },
          ],
        },
        {
          day: 'Thursday',
          slots: [
            { time: '10:00 AM', available: true },
            { time: '12:00 PM', available: true },
            { time: '04:00 PM', available: true },
          ],
        },
      ],
      rating: 4.8,
      totalMeetings: 124,
      preferredMode: ['in-person'],
    },
  ];

  // Mock Data - Meetings
  const initialMeetingsData: Meeting[] = [
    {
      id: 'm1',
      teacherId: 't1',
      teacherName: 'Dr. Rajesh Sharma',
      subject: 'Mathematics',
      date: '2025-10-28',
      time: '09:00 AM',
      duration: 30,
      mode: 'in-person',
      status: 'confirmed',
      purpose: 'Discuss mid-term performance and areas for improvement',
      location: 'Staff Room 2',
      requestedBy: 'Parent',
      requestedDate: '2025-10-20',
    },
    {
      id: 'm2',
      teacherId: 't2',
      teacherName: 'Mrs. Priya Desai',
      subject: 'English',
      date: '2025-10-29',
      time: '11:00 AM',
      duration: 30,
      mode: 'video',
      status: 'confirmed',
      purpose: 'Review English project and presentation skills',
      meetingLink: 'https://meet.google.com/abc-defg-hij',
      requestedBy: 'Parent',
      requestedDate: '2025-10-21',
    },
    {
      id: 'm3',
      teacherId: 't8',
      teacherName: 'Ms. Kavita Nair',
      subject: 'Computer Science',
      date: '2025-10-25',
      time: '02:00 PM',
      duration: 30,
      mode: 'video',
      status: 'pending',
      purpose: 'Discuss coding project and future learning paths',
      requestedBy: 'Parent',
      requestedDate: '2025-10-23',
    },
    {
      id: 'm4',
      teacherId: 't3',
      teacherName: 'Mr. Vikram Singh',
      subject: 'Physics',
      date: '2025-10-15',
      time: '10:00 AM',
      duration: 30,
      mode: 'in-person',
      status: 'completed',
      purpose: 'Discussed lab performance and practical skills',
      location: 'Physics Lab',
      notes: 'Student showing good progress in experiments. Needs to focus on theoretical concepts.',
      requestedBy: 'Teacher',
      requestedDate: '2025-10-10',
    },
    {
      id: 'm5',
      teacherId: 't5',
      teacherName: 'Dr. Suresh Reddy',
      subject: 'Biology',
      date: '2025-10-12',
      time: '11:00 AM',
      duration: 30,
      mode: 'in-person',
      status: 'completed',
      purpose: 'Review first term performance',
      location: 'Staff Room 1',
      notes: 'Excellent participation in class. Keep up the good work!',
      requestedBy: 'Parent',
      requestedDate: '2025-10-08',
    },
  ];

  // Mock Data - PTM Cycle
  const ptmCycleData: PTMCycle = {
    id: 'ptm1',
    name: 'Mid-Term Parent-Teacher Meeting 2025',
    startDate: '2025-10-20',
    endDate: '2025-11-10',
    status: 'booking-open',
    description: 'Schedule meetings with your child\'s teachers to discuss their progress and development.',
    currentStage: 2,
    stages: [
      {
        name: 'Announcement',
        date: '2025-10-15',
        status: 'completed',
      },
      {
        name: 'Booking Open',
        date: '2025-10-20',
        status: 'active',
      },
      {
        name: 'Booking Closes',
        date: '2025-10-30',
        status: 'pending',
      },
      {
        name: 'Meetings Week',
        date: '2025-11-01 - 2025-11-05',
        status: 'pending',
      },
      {
        name: 'Feedback',
        date: '2025-11-10',
        status: 'pending',
      },
    ],
  };

  // State Management
  const [currentChild, setCurrentChild] = useState<Child>(childrenData[0]);
  const [teachers, setTeachers] = useState<Teacher[]>(teachersData);
  const [meetings, setMeetings] = useState<Meeting[]>(initialMeetingsData);
  const [ptmCycle, setPtmCycle] = useState<PTMCycle>(ptmCycleData);
  const [viewMode, setViewMode] = useState<'upcoming' | 'all' | 'past'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showMeetingDetailModal, setShowMeetingDetailModal] = useState(false);
  const [showTeacherScheduleModal, setShowTeacherScheduleModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    teacherId: '',
    date: '',
    time: '',
    duration: 30,
    mode: 'in-person' as 'in-person' | 'video' | 'phone',
    purpose: '',
  });

  // Toast Notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Get unique subjects for filter
  const subjects = ['all', ...Array.from(new Set(teachers.map(t => t.subject)))];

  // Filter teachers
  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch = teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         teacher.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubjectFilter === 'all' || teacher.subject === selectedSubjectFilter;
    return matchesSearch && matchesSubject;
  });

  // Filter meetings based on view mode
  const filteredMeetings = meetings.filter(meeting => {
    const meetingDate = new Date(meeting.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (viewMode === 'upcoming') {
      return meetingDate >= today && (meeting.status === 'confirmed' || meeting.status === 'pending');
    } else if (viewMode === 'past') {
      return meeting.status === 'completed' || meeting.status === 'cancelled';
    }
    return true;
  });

  // Calculate Quick Stats
  const stats = {
    total: meetings.length,
    pending: meetings.filter(m => m.status === 'pending').length,
    upcomingThisWeek: meetings.filter(m => {
      const meetingDate = new Date(m.date);
      const today = new Date();
      const weekFromNow = new Date();
      weekFromNow.setDate(today.getDate() + 7);
      return meetingDate >= today && meetingDate <= weekFromNow && (m.status === 'confirmed' || m.status === 'pending');
    }).length,
    completed: meetings.filter(m => m.status === 'completed').length,
  };

  // Handler Functions
  const handleBookMeeting = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setBookingForm({
      ...bookingForm,
      teacherId: teacher.id,
    });
    setBookingStep(1);
    setShowBookingModal(true);
  };

  const handleNextBookingStep = () => {
    if (bookingStep === 1 && !bookingForm.date) {
      showToastNotification('Please select a date');
      return;
    }
    if (bookingStep === 2 && !bookingForm.time) {
      showToastNotification('Please select a time slot');
      return;
    }
    if (bookingStep === 3 && !bookingForm.purpose.trim()) {
      showToastNotification('Please enter the purpose of meeting');
      return;
    }

    if (bookingStep < 4) {
      setBookingStep(bookingStep + 1);
    }
  };

  const handlePreviousBookingStep = () => {
    if (bookingStep > 1) {
      setBookingStep(bookingStep - 1);
    }
  };

  const handleConfirmBooking = () => {
    const teacher = teachers.find(t => t.id === bookingForm.teacherId);
    if (!teacher) return;

    const newMeeting: Meeting = {
      id: `m${meetings.length + 1}`,
      teacherId: bookingForm.teacherId,
      teacherName: teacher.name,
      subject: teacher.subject,
      date: bookingForm.date,
      time: bookingForm.time,
      duration: bookingForm.duration,
      mode: bookingForm.mode,
      status: 'pending',
      purpose: bookingForm.purpose,
      location: bookingForm.mode === 'in-person' ? 'To be confirmed' : undefined,
      meetingLink: bookingForm.mode === 'video' ? 'To be shared' : undefined,
      requestedBy: 'Parent',
      requestedDate: new Date().toISOString().split('T')[0],
    };

    setMeetings([...meetings, newMeeting]);
    setShowBookingModal(false);
    setBookingForm({
      teacherId: '',
      date: '',
      time: '',
      duration: 30,
      mode: 'in-person',
      purpose: '',
    });
    showToastNotification('Meeting request sent successfully! Waiting for teacher confirmation.');
  };

  const handleViewMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingDetailModal(true);
  };

  const handleViewTeacherSchedule = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setShowTeacherScheduleModal(true);
  };

  const handleRescheduleMeeting = () => {
    setShowMeetingDetailModal(false);
    setShowRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    if (!selectedMeeting || !bookingForm.date || !bookingForm.time) {
      showToastNotification('Please select new date and time');
      return;
    }

    const updatedMeetings = meetings.map(m =>
      m.id === selectedMeeting.id
        ? { ...m, date: bookingForm.date, time: bookingForm.time, status: 'pending' as const }
        : m
    );
    setMeetings(updatedMeetings);
    setShowRescheduleModal(false);
    setBookingForm({
      teacherId: '',
      date: '',
      time: '',
      duration: 30,
      mode: 'in-person',
      purpose: '',
    });
    showToastNotification('Reschedule request sent successfully!');
  };

  const handleCancelMeeting = () => {
    setShowMeetingDetailModal(false);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = () => {
    if (!selectedMeeting) return;
    if (!cancelReason.trim()) {
      showToastNotification('Please provide a reason for cancellation');
      return;
    }

    const updatedMeetings = meetings.map(m =>
      m.id === selectedMeeting.id
        ? { ...m, status: 'cancelled' as const, cancelReason: cancelReason }
        : m
    );
    setMeetings(updatedMeetings);
    setShowCancelModal(false);
    setCancelReason('');
    showToastNotification('Meeting cancelled successfully');
  };

  const handleExportSchedule = () => {
    const upcomingMeetings = meetings.filter(m =>
      m.status === 'confirmed' || m.status === 'pending'
    );

    let icsContent = 'BEGIN:VCALENDAR\r\n';
    icsContent += 'VERSION:2.0\r\n';
    icsContent += 'PRODID:-//EdgeUp//PTM Schedule//EN\r\n';
    icsContent += 'CALSCALE:GREGORIAN\r\n';
    icsContent += 'METHOD:PUBLISH\r\n';

    upcomingMeetings.forEach(meeting => {
      const [hours, minutes] = meeting.time.split(' ')[0].split(':');
      const isPM = meeting.time.includes('PM') && hours !== '12';
      const isAM = meeting.time.includes('AM') && hours === '12';
      const hour24 = isAM ? 0 : (isPM ? parseInt(hours) + 12 : parseInt(hours));

      const startDateTime = new Date(meeting.date);
      startDateTime.setHours(hour24, parseInt(minutes), 0);
      const endDateTime = new Date(startDateTime.getTime() + meeting.duration * 60000);

      const formatDateTime = (date: Date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
      };

      icsContent += 'BEGIN:VEVENT\r\n';
      icsContent += `UID:${meeting.id}@edgeup.school\r\n`;
      icsContent += `DTSTART:${formatDateTime(startDateTime)}\r\n`;
      icsContent += `DTEND:${formatDateTime(endDateTime)}\r\n`;
      icsContent += `SUMMARY:PTM - ${meeting.subject} (${meeting.teacherName})\r\n`;
      icsContent += `DESCRIPTION:${meeting.purpose}\\n\\nMode: ${meeting.mode}\\nStatus: ${meeting.status}\r\n`;

      if (meeting.location) {
        icsContent += `LOCATION:${meeting.location}\r\n`;
      }

      icsContent += `STATUS:${meeting.status === 'confirmed' ? 'CONFIRMED' : 'TENTATIVE'}\r\n`;
      icsContent += 'END:VEVENT\r\n';
    });

    icsContent += 'END:VCALENDAR\r\n';

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${currentChild.name.replace(/\s+/g, '_')}_PTM_Schedule.ics`;
    link.click();
    showToastNotification(`Schedule exported successfully! (${upcomingMeetings.length} meetings)`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return '#10ac8b';
      case 'pending': return '#f59e0b';
      case 'completed': return '#6b7280';
      case 'cancelled': return '#ef4444';
      case 'rescheduled': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'in-person': return 'fa-user';
      case 'video': return 'fa-video';
      case 'phone': return 'fa-phone';
      default: return 'fa-calendar';
    }
  };

  // Get available dates (next 30 days, excluding weekends)
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayOfWeek = date.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Exclude Sunday (0) and Saturday (6)
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  // Get day name from date
  const getDayName = (dateString: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  // Get available time slots for selected date
  const getAvailableTimeSlots = () => {
    if (!bookingForm.date || !selectedTeacher) return [];

    const dayName = getDayName(bookingForm.date);
    const dayAvailability = selectedTeacher.availability.find(a => a.day === dayName);

    if (!dayAvailability) return [];

    return dayAvailability.slots.filter(slot => slot.available);
  };

  return (
    <div className="ptm-scheduler-container">
      {/* Header */}
      <div className="ptm-scheduler-header">
        <div className="ptm-header-left">
          <div className="ptm-header-icon">
            <i className="fas fa-handshake"></i>
          </div>
          <div className="ptm-header-title-group">
            <h1>Parent-Teacher Meeting Scheduler</h1>
            <p>Schedule and manage meetings with your child's teachers</p>
          </div>
        </div>
        <div className="ptm-header-right">
          <div className="child-selector-ptm">
            <i className="fas fa-user-graduate"></i>
            <select
              value={currentChild.id}
              onChange={(e) => {
                const child = childrenData.find(c => c.id === e.target.value);
                if (child) setCurrentChild(child);
              }}
            >
              {childrenData.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - Grade {child.grade}{child.section}
                </option>
              ))}
            </select>
          </div>
          <button className="export-schedule-btn" onClick={handleExportSchedule}>
            <i className="fas fa-download"></i>
            Export Schedule
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="ptm-quick-stats">
        <div className="stat-card-ptm stat-total">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Meetings</div>
          </div>
        </div>
        <div className="stat-card-ptm stat-pending">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
        </div>
        <div className="stat-card-ptm stat-upcoming">
          <div className="stat-icon">
            <i className="fas fa-calendar-week"></i>
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.upcomingThisWeek}</div>
            <div className="stat-label">Upcoming This Week</div>
          </div>
        </div>
        <div className="stat-card-ptm stat-completed">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
      </div>

      {/* PTM Cycle Timeline */}
      <div className="ptm-cycle-timeline">
        <div className="ptm-cycle-header">
          <div className="ptm-cycle-title">
            <i className="fas fa-calendar-alt"></i>
            <div>
              <h3>{ptmCycle.name}</h3>
              <p>{ptmCycle.description}</p>
            </div>
          </div>
          <div className="ptm-cycle-status">
            <span className={`status-badge status-${ptmCycle.status}`}>
              {ptmCycle.status.replace('-', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        <div className="ptm-cycle-stages">
          {ptmCycle.stages.map((stage, index) => (
            <div key={index} className={`ptm-stage ptm-stage-${stage.status}`}>
              <div className="ptm-stage-icon">
                {stage.status === 'completed' && <i className="fas fa-check"></i>}
                {stage.status === 'active' && <i className="fas fa-circle"></i>}
                {stage.status === 'pending' && <i className="far fa-circle"></i>}
              </div>
              <div className="ptm-stage-content">
                <div className="ptm-stage-name">{stage.name}</div>
                <div className="ptm-stage-date">{stage.date}</div>
              </div>
              {index < ptmCycle.stages.length - 1 && <div className="ptm-stage-line"></div>}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="ptm-main-content">
        {/* Left Column - Teachers List */}
        <div className="ptm-teachers-section">
          <div className="ptm-teachers-header">
            <h2><i className="fas fa-chalkboard-teacher"></i> Available Teachers</h2>
            <div className="ptm-teachers-controls">
              <div className="search-box-ptm">
                <i className="fas fa-search"></i>
                <input
                  type="text"
                  placeholder="Search teachers or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button className="clear-search-btn-ptm" onClick={() => setSearchQuery('')}>
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
              <select
                className="subject-filter-ptm"
                value={selectedSubjectFilter}
                onChange={(e) => setSelectedSubjectFilter(e.target.value)}
              >
                {subjects.map(subject => (
                  <option key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="ptm-teachers-list">
            {filteredTeachers.length === 0 ? (
              <div className="no-teachers-found">
                <i className="fas fa-user-slash"></i>
                <p>No teachers found</p>
              </div>
            ) : (
              filteredTeachers.map(teacher => (
                <div key={teacher.id} className="teacher-card-ptm">
                  <div className="teacher-avatar-ptm">{teacher.avatar}</div>
                  <div className="teacher-info-ptm">
                    <div className="teacher-name-ptm">{teacher.name}</div>
                    <div className="teacher-designation-ptm">{teacher.designation}</div>
                    <div className="teacher-subject-ptm">
                      <i className="fas fa-book"></i> {teacher.subject}
                    </div>
                    <div className="teacher-meta-ptm">
                      <div className="teacher-rating-ptm">
                        <i className="fas fa-star"></i> {teacher.rating}
                      </div>
                      <div className="teacher-meetings-ptm">
                        <i className="fas fa-calendar-check"></i> {teacher.totalMeetings} meetings
                      </div>
                    </div>
                    <div className="teacher-contact-ptm">
                      <i className="fas fa-envelope"></i> {teacher.email}
                    </div>
                  </div>
                  <div className="teacher-actions-ptm">
                    <button
                      className="btn-book-ptm"
                      onClick={() => handleBookMeeting(teacher)}
                    >
                      <i className="fas fa-calendar-plus"></i> Book Meeting
                    </button>
                    <button
                      className="btn-view-schedule-ptm"
                      onClick={() => handleViewTeacherSchedule(teacher)}
                    >
                      <i className="fas fa-clock"></i> View Schedule
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Your Meetings */}
        <div className="ptm-meetings-section">
          <div className="ptm-meetings-header">
            <h2><i className="fas fa-calendar"></i> Your Meetings</h2>
            <div className="ptm-view-toggle">
              <button
                className={viewMode === 'upcoming' ? 'active' : ''}
                onClick={() => setViewMode('upcoming')}
              >
                <i className="fas fa-arrow-up"></i> Upcoming
              </button>
              <button
                className={viewMode === 'all' ? 'active' : ''}
                onClick={() => setViewMode('all')}
              >
                <i className="fas fa-list"></i> All
              </button>
              <button
                className={viewMode === 'past' ? 'active' : ''}
                onClick={() => setViewMode('past')}
              >
                <i className="fas fa-history"></i> Past
              </button>
            </div>
          </div>
          <div className="ptm-meetings-list">
            {filteredMeetings.length === 0 ? (
              <div className="no-meetings-found">
                <i className="fas fa-calendar-times"></i>
                <p>No meetings found</p>
                <span>Book a meeting with a teacher to get started</span>
              </div>
            ) : (
              filteredMeetings.map(meeting => (
                <div key={meeting.id} className="meeting-card-ptm" onClick={() => handleViewMeeting(meeting)}>
                  <div className="meeting-header-ptm">
                    <div className="meeting-teacher-info">
                      <div className="meeting-teacher-name">{meeting.teacherName}</div>
                      <div className="meeting-subject">{meeting.subject}</div>
                    </div>
                    <span
                      className="meeting-status-badge"
                      style={{ backgroundColor: getStatusColor(meeting.status) }}
                    >
                      {meeting.status}
                    </span>
                  </div>
                  <div className="meeting-details-ptm">
                    <div className="meeting-detail-item">
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(meeting.date).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}</span>
                    </div>
                    <div className="meeting-detail-item">
                      <i className="fas fa-clock"></i>
                      <span>{meeting.time} ({meeting.duration} mins)</span>
                    </div>
                    <div className="meeting-detail-item">
                      <i className={`fas ${getModeIcon(meeting.mode)}`}></i>
                      <span>{meeting.mode.replace('-', ' ')}</span>
                    </div>
                  </div>
                  <div className="meeting-purpose-ptm">
                    <i className="fas fa-comment-dots"></i>
                    <span>{meeting.purpose}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal - 4 Step Wizard */}
      {showBookingModal && selectedTeacher && (
        <>
          <div className="modal-overlay-ptm" onClick={() => setShowBookingModal(false)}></div>
          <div className="booking-modal-ptm">
            <div className="booking-modal-header">
              <h3>
                <i className="fas fa-calendar-plus"></i>
                Book Meeting with {selectedTeacher.name}
              </h3>
              <button className="modal-close-btn" onClick={() => setShowBookingModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Progress Steps */}
            <div className="booking-steps">
              <div className={`booking-step ${bookingStep >= 1 ? 'active' : ''} ${bookingStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Select Date</div>
              </div>
              <div className="step-line"></div>
              <div className={`booking-step ${bookingStep >= 2 ? 'active' : ''} ${bookingStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Select Time</div>
              </div>
              <div className="step-line"></div>
              <div className={`booking-step ${bookingStep >= 3 ? 'active' : ''} ${bookingStep > 3 ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Meeting Details</div>
              </div>
              <div className="step-line"></div>
              <div className={`booking-step ${bookingStep >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-label">Confirm</div>
              </div>
            </div>

            <div className="booking-modal-content">
              {/* Step 1: Select Date */}
              {bookingStep === 1 && (
                <div className="booking-step-content">
                  <h4><i className="fas fa-calendar-day"></i> Select Meeting Date</h4>
                  <div className="date-grid">
                    {getAvailableDates().map(date => {
                      const dateObj = new Date(date);
                      const dayName = getDayName(date);
                      const hasAvailability = selectedTeacher.availability.some(a => a.day === dayName);

                      return (
                        <button
                          key={date}
                          className={`date-option ${bookingForm.date === date ? 'selected' : ''} ${!hasAvailability ? 'unavailable' : ''}`}
                          onClick={() => hasAvailability && setBookingForm({ ...bookingForm, date })}
                          disabled={!hasAvailability}
                        >
                          <div className="date-day">{dayName.slice(0, 3)}</div>
                          <div className="date-number">{dateObj.getDate()}</div>
                          <div className="date-month">{dateObj.toLocaleString('en-US', { month: 'short' })}</div>
                          {!hasAvailability && <div className="unavailable-label">No slots</div>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Select Time */}
              {bookingStep === 2 && (
                <div className="booking-step-content">
                  <h4><i className="fas fa-clock"></i> Select Time Slot</h4>
                  <p className="selected-date-info">
                    <i className="fas fa-calendar"></i>
                    {new Date(bookingForm.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  <div className="time-slots-grid">
                    {getAvailableTimeSlots().length === 0 ? (
                      <div className="no-slots-message">
                        <i className="fas fa-info-circle"></i>
                        <p>No available slots for this date</p>
                      </div>
                    ) : (
                      getAvailableTimeSlots().map((slot, index) => (
                        <button
                          key={index}
                          className={`time-slot-option ${bookingForm.time === slot.time ? 'selected' : ''}`}
                          onClick={() => setBookingForm({ ...bookingForm, time: slot.time })}
                        >
                          <i className="fas fa-clock"></i>
                          {slot.time}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Meeting Details */}
              {bookingStep === 3 && (
                <div className="booking-step-content">
                  <h4><i className="fas fa-info-circle"></i> Meeting Details</h4>
                  <div className="form-group-ptm">
                    <label><i className="fas fa-user"></i> Meeting Mode</label>
                    <div className="mode-options">
                      {selectedTeacher.preferredMode.includes('in-person') && (
                        <button
                          className={`mode-option ${bookingForm.mode === 'in-person' ? 'selected' : ''}`}
                          onClick={() => setBookingForm({ ...bookingForm, mode: 'in-person' })}
                        >
                          <i className="fas fa-user"></i>
                          <span>In-Person</span>
                        </button>
                      )}
                      {selectedTeacher.preferredMode.includes('video') && (
                        <button
                          className={`mode-option ${bookingForm.mode === 'video' ? 'selected' : ''}`}
                          onClick={() => setBookingForm({ ...bookingForm, mode: 'video' })}
                        >
                          <i className="fas fa-video"></i>
                          <span>Video Call</span>
                        </button>
                      )}
                      {selectedTeacher.preferredMode.includes('phone') && (
                        <button
                          className={`mode-option ${bookingForm.mode === 'phone' ? 'selected' : ''}`}
                          onClick={() => setBookingForm({ ...bookingForm, mode: 'phone' })}
                        >
                          <i className="fas fa-phone"></i>
                          <span>Phone Call</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="form-group-ptm">
                    <label><i className="fas fa-hourglass-half"></i> Duration</label>
                    <select
                      value={bookingForm.duration}
                      onChange={(e) => setBookingForm({ ...bookingForm, duration: parseInt(e.target.value) })}
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={45}>45 minutes</option>
                      <option value={60}>60 minutes</option>
                    </select>
                  </div>
                  <div className="form-group-ptm">
                    <label><i className="fas fa-comment-dots"></i> Purpose of Meeting</label>
                    <textarea
                      rows={4}
                      placeholder="Please describe what you would like to discuss..."
                      value={bookingForm.purpose}
                      onChange={(e) => setBookingForm({ ...bookingForm, purpose: e.target.value })}
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {bookingStep === 4 && (
                <div className="booking-step-content">
                  <h4><i className="fas fa-check-circle"></i> Confirm Your Booking</h4>
                  <div className="booking-summary">
                    <div className="summary-section">
                      <h5><i className="fas fa-chalkboard-teacher"></i> Teacher</h5>
                      <p>{selectedTeacher.name} - {selectedTeacher.subject}</p>
                      <p className="text-muted">{selectedTeacher.email}</p>
                    </div>
                    <div className="summary-section">
                      <h5><i className="fas fa-calendar-alt"></i> Date & Time</h5>
                      <p>
                        {new Date(bookingForm.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <p>{bookingForm.time} ({bookingForm.duration} minutes)</p>
                    </div>
                    <div className="summary-section">
                      <h5><i className={`fas ${getModeIcon(bookingForm.mode)}`}></i> Mode</h5>
                      <p>{bookingForm.mode.replace('-', ' ')}</p>
                    </div>
                    <div className="summary-section">
                      <h5><i className="fas fa-comment-dots"></i> Purpose</h5>
                      <p>{bookingForm.purpose}</p>
                    </div>
                  </div>
                  <div className="booking-note">
                    <i className="fas fa-info-circle"></i>
                    <p>Your meeting request will be sent to the teacher for confirmation. You will receive a notification once it's confirmed.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="booking-modal-footer">
              {bookingStep > 1 && (
                <button className="btn-secondary-ptm" onClick={handlePreviousBookingStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}
              {bookingStep < 4 ? (
                <button className="btn-primary-ptm" onClick={handleNextBookingStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button className="btn-primary-ptm" onClick={handleConfirmBooking}>
                  <i className="fas fa-check"></i> Confirm Booking
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Meeting Detail Modal */}
      {showMeetingDetailModal && selectedMeeting && (
        <>
          <div className="modal-overlay-ptm" onClick={() => setShowMeetingDetailModal(false)}></div>
          <div className="meeting-detail-modal-ptm">
            <div className="meeting-detail-header">
              <div className="meeting-detail-title-group">
                <i className="fas fa-calendar-alt"></i>
                <h3>Meeting Details</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowMeetingDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="meeting-detail-content">
              <div className="meeting-detail-section">
                <div className="detail-row">
                  <div className="detail-label"><i className="fas fa-chalkboard-teacher"></i> Teacher</div>
                  <div className="detail-value">{selectedMeeting.teacherName}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label"><i className="fas fa-book"></i> Subject</div>
                  <div className="detail-value">{selectedMeeting.subject}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label"><i className="fas fa-calendar"></i> Date</div>
                  <div className="detail-value">
                    {new Date(selectedMeeting.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-label"><i className="fas fa-clock"></i> Time</div>
                  <div className="detail-value">{selectedMeeting.time} ({selectedMeeting.duration} mins)</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label"><i className={`fas ${getModeIcon(selectedMeeting.mode)}`}></i> Mode</div>
                  <div className="detail-value">{selectedMeeting.mode.replace('-', ' ')}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label"><i className="fas fa-flag"></i> Status</div>
                  <div className="detail-value">
                    <span
                      className="status-badge-inline"
                      style={{ backgroundColor: getStatusColor(selectedMeeting.status) }}
                    >
                      {selectedMeeting.status}
                    </span>
                  </div>
                </div>
                {selectedMeeting.location && (
                  <div className="detail-row">
                    <div className="detail-label"><i className="fas fa-map-marker-alt"></i> Location</div>
                    <div className="detail-value">{selectedMeeting.location}</div>
                  </div>
                )}
                {selectedMeeting.meetingLink && (
                  <div className="detail-row">
                    <div className="detail-label"><i className="fas fa-link"></i> Meeting Link</div>
                    <div className="detail-value">
                      <a href={selectedMeeting.meetingLink} target="_blank" rel="noopener noreferrer">
                        {selectedMeeting.meetingLink}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              <div className="meeting-detail-section">
                <div className="detail-label"><i className="fas fa-comment-dots"></i> Purpose</div>
                <div className="detail-purpose">{selectedMeeting.purpose}</div>
              </div>
              {selectedMeeting.notes && (
                <div className="meeting-detail-section">
                  <div className="detail-label"><i className="fas fa-sticky-note"></i> Notes from Teacher</div>
                  <div className="detail-notes">{selectedMeeting.notes}</div>
                </div>
              )}
              {selectedMeeting.cancelReason && (
                <div className="meeting-detail-section cancel-reason">
                  <div className="detail-label"><i className="fas fa-times-circle"></i> Cancellation Reason</div>
                  <div className="detail-notes">{selectedMeeting.cancelReason}</div>
                </div>
              )}
              <div className="meeting-detail-meta">
                <div><i className="fas fa-user"></i> Requested by: {selectedMeeting.requestedBy}</div>
                <div><i className="fas fa-calendar-plus"></i> Requested on: {new Date(selectedMeeting.requestedDate).toLocaleDateString()}</div>
              </div>
            </div>
            {(selectedMeeting.status === 'confirmed' || selectedMeeting.status === 'pending') && (
              <div className="meeting-detail-actions">
                <button className="btn-reschedule-ptm" onClick={handleRescheduleMeeting}>
                  <i className="fas fa-calendar-alt"></i> Reschedule
                </button>
                <button className="btn-cancel-ptm" onClick={handleCancelMeeting}>
                  <i className="fas fa-times"></i> Cancel Meeting
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Teacher Schedule Modal */}
      {showTeacherScheduleModal && selectedTeacher && (
        <>
          <div className="modal-overlay-ptm" onClick={() => setShowTeacherScheduleModal(false)}></div>
          <div className="teacher-schedule-modal-ptm">
            <div className="teacher-schedule-header">
              <div className="teacher-schedule-title-group">
                <i className="fas fa-clock"></i>
                <h3>{selectedTeacher.name}'s Schedule</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setShowTeacherScheduleModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="teacher-schedule-content">
              <div className="teacher-info-schedule">
                <div className="teacher-avatar-large">{selectedTeacher.avatar}</div>
                <div>
                  <h4>{selectedTeacher.name}</h4>
                  <p>{selectedTeacher.designation}</p>
                  <p className="teacher-subject-large">{selectedTeacher.subject}</p>
                </div>
              </div>
              <div className="schedule-grid">
                {selectedTeacher.availability.map((daySchedule, index) => (
                  <div key={index} className="schedule-day-card">
                    <div className="schedule-day-header">
                      <i className="fas fa-calendar-day"></i>
                      {daySchedule.day}
                    </div>
                    <div className="schedule-slots">
                      {daySchedule.slots.map((slot, slotIndex) => (
                        <div
                          key={slotIndex}
                          className={`schedule-slot ${slot.available ? 'available' : 'unavailable'}`}
                        >
                          <i className={`fas ${slot.available ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
                          <span>{slot.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="schedule-legend">
                <div className="legend-item">
                  <i className="fas fa-check-circle" style={{ color: '#10ac8b' }}></i>
                  <span>Available</span>
                </div>
                <div className="legend-item">
                  <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>
                  <span>Not Available</span>
                </div>
              </div>
            </div>
            <div className="teacher-schedule-footer">
              <button
                className="btn-primary-ptm"
                onClick={() => {
                  setShowTeacherScheduleModal(false);
                  handleBookMeeting(selectedTeacher);
                }}
              >
                <i className="fas fa-calendar-plus"></i> Book Meeting
              </button>
            </div>
          </div>
        </>
      )}

      {/* Reschedule Modal */}
      {showRescheduleModal && selectedMeeting && (
        <>
          <div className="modal-overlay-ptm" onClick={() => setShowRescheduleModal(false)}></div>
          <div className="reschedule-modal-ptm">
            <div className="reschedule-modal-header">
              <h3><i className="fas fa-calendar-alt"></i> Reschedule Meeting</h3>
              <button className="modal-close-btn" onClick={() => setShowRescheduleModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="reschedule-modal-content">
              <div className="current-meeting-info">
                <h4>Current Meeting</h4>
                <p><i className="fas fa-calendar"></i> {new Date(selectedMeeting.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                <p><i className="fas fa-clock"></i> {selectedMeeting.time}</p>
              </div>
              <div className="form-group-ptm">
                <label><i className="fas fa-calendar-day"></i> New Date</label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={bookingForm.date}
                  onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                />
              </div>
              <div className="form-group-ptm">
                <label><i className="fas fa-clock"></i> New Time</label>
                <input
                  type="time"
                  value={bookingForm.time}
                  onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                />
              </div>
            </div>
            <div className="reschedule-modal-footer">
              <button className="btn-secondary-ptm" onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </button>
              <button className="btn-primary-ptm" onClick={handleConfirmReschedule}>
                <i className="fas fa-check"></i> Confirm Reschedule
              </button>
            </div>
          </div>
        </>
      )}

      {/* Cancel Modal */}
      {showCancelModal && selectedMeeting && (
        <>
          <div className="modal-overlay-ptm" onClick={() => setShowCancelModal(false)}></div>
          <div className="cancel-modal-ptm">
            <div className="cancel-modal-header">
              <h3><i className="fas fa-times-circle"></i> Cancel Meeting</h3>
              <button className="modal-close-btn" onClick={() => setShowCancelModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cancel-modal-content">
              <div className="cancel-warning">
                <i className="fas fa-exclamation-triangle"></i>
                <p>Are you sure you want to cancel this meeting?</p>
              </div>
              <div className="cancel-meeting-info">
                <p><strong>{selectedMeeting.teacherName}</strong> - {selectedMeeting.subject}</p>
                <p>{new Date(selectedMeeting.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {selectedMeeting.time}</p>
              </div>
              <div className="form-group-ptm">
                <label><i className="fas fa-comment"></i> Reason for Cancellation *</label>
                <textarea
                  rows={4}
                  placeholder="Please provide a reason for cancellation..."
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  required
                ></textarea>
              </div>
            </div>
            <div className="cancel-modal-footer">
              <button className="btn-secondary-ptm" onClick={() => setShowCancelModal(false)}>
                Keep Meeting
              </button>
              <button className="btn-danger-ptm" onClick={handleConfirmCancel}>
                <i className="fas fa-times"></i> Cancel Meeting
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification-ptm">
          <i className="fas fa-check-circle"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default PTMScheduler;
