import { useState } from 'react';

// ==================== INTERFACES ====================

interface Teacher {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  specialization: string;
  status: 'Available' | 'On Leave' | 'Unavailable';
  maxPeriodsPerDay: number;
  maxPeriodsPerWeek: number;
}

interface TeacherAvailability {
  teacherId: string;
  teacherName: string;
  day: string;
  periods: {
    periodNumber: number;
    isAvailable: boolean;
    reason?: string;
  }[];
}

interface SubjectAssignment {
  subjectName: string;
  assignedTeachers: string[];
  requiredPeriodsPerWeek: number;
}

interface ConflictWarning {
  type: 'teacher_unavailable' | 'no_teacher_for_subject' | 'teacher_overloaded' | 'room_conflict' | 'unassigned_subject';
  severity: 'high' | 'medium' | 'low';
  message: string;
  affectedTeachers?: string[];
  affectedSubjects?: string[];
}

interface TimetableSlot {
  period: string;
  subject: string;
  teacher: string;
  room: string;
  time: string;
}

interface DaySchedule {
  day: string;
  periods: TimetableSlot[];
}

interface GeneratedTimetable {
  id: string;
  generatedDate: string;
  data: DaySchedule[];
  stats: {
    conflictsFree: string;
    teacherSatisfaction: string;
    labUtilization: string;
    generationTime: string;
  };
  configuration: {
    teachers: number;
    subjects: number;
    classrooms: number;
    labs: number;
    periodsPerDay: number;
    workingDays: number;
  };
}

// ==================== MAIN COMPONENT ====================

const AITimetable = () => {
  // Configuration State
  const [formData, setFormData] = useState({
    subjects: '10',
    classrooms: '12',
    labsAvailable: '3',
    periodsPerDay: '7',
    workingDays: '5'
  });

  // Section Navigation
  const [activeSection, setActiveSection] = useState<'config' | 'teachers' | 'availability' | 'assignments' | 'conflicts' | 'timetable' | 'history'>('config');

  // Teacher Management State
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 't1', employeeId: 'EMP001', name: 'Dr. Sarah Johnson', email: 'sarah.j@school.com',
      phone: '9876543210', subjects: ['Mathematics', 'Physics'], specialization: 'Mathematics',
      status: 'Available', maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30
    },
    {
      id: 't2', employeeId: 'EMP002', name: 'Prof. Michael Chen', email: 'michael.c@school.com',
      phone: '9876543211', subjects: ['Chemistry', 'Biology'], specialization: 'Chemistry',
      status: 'Available', maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30
    },
    {
      id: 't3', employeeId: 'EMP003', name: 'Ms. Priya Sharma', email: 'priya.s@school.com',
      phone: '9876543212', subjects: ['English', 'Hindi'], specialization: 'English Literature',
      status: 'Available', maxPeriodsPerDay: 5, maxPeriodsPerWeek: 25
    },
    {
      id: 't4', employeeId: 'EMP004', name: 'Mr. Amit Kumar', email: 'amit.k@school.com',
      phone: '9876543213', subjects: ['History', 'Geography'], specialization: 'History',
      status: 'On Leave', maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30
    },
    {
      id: 't5', employeeId: 'EMP005', name: 'Dr. Rahul Verma', email: 'rahul.v@school.com',
      phone: '9876543214', subjects: ['Computer Science'], specialization: 'Computer Science',
      status: 'Available', maxPeriodsPerDay: 7, maxPeriodsPerWeek: 35
    }
  ]);

  const [showAddTeacherModal, setShowAddTeacherModal] = useState(false);
  const [showEditTeacherModal, setShowEditTeacherModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [newTeacherForm, setNewTeacherForm] = useState({
    employeeId: '', name: '', email: '', phone: '', subjects: [] as string[],
    specialization: '', maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30
  });

  // Availability Management State
  const [teacherAvailability, setTeacherAvailability] = useState<TeacherAvailability[]>([]);
  const [selectedDayForAvailability, setSelectedDayForAvailability] = useState('Monday');

  // Subject Assignment State
  const availableSubjects = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'History', 'Geography', 'Computer Science', 'Physical Education'];
  const [subjectAssignments, setSubjectAssignments] = useState<SubjectAssignment[]>(
    availableSubjects.map(subject => ({
      subjectName: subject,
      assignedTeachers: teachers.filter(t => t.subjects.includes(subject)).map(t => t.id),
      requiredPeriodsPerWeek: 5
    }))
  );

  // Generation State
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedTimetable, setGeneratedTimetable] = useState<GeneratedTimetable | null>(null);
  const [savedTimetables, setSavedTimetables] = useState<GeneratedTimetable[]>([]);

  // Conflicts State
  const [conflicts, setConflicts] = useState<ConflictWarning[]>([]);

  // Notification State
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success');

  // ==================== HELPER FUNCTIONS ====================

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // ==================== TEACHER MANAGEMENT FUNCTIONS ====================

  const handleAddTeacher = () => {
    setNewTeacherForm({
      employeeId: '', name: '', email: '', phone: '', subjects: [],
      specialization: '', maxPeriodsPerDay: 6, maxPeriodsPerWeek: 30
    });
    setShowAddTeacherModal(true);
  };

  const handleSaveNewTeacher = () => {
    if (!newTeacherForm.name || !newTeacherForm.employeeId || newTeacherForm.subjects.length === 0) {
      showToast('Please fill all required fields and select at least one subject', 'error');
      return;
    }

    const newTeacher: Teacher = {
      id: `t${teachers.length + 1}`,
      employeeId: newTeacherForm.employeeId,
      name: newTeacherForm.name,
      email: newTeacherForm.email,
      phone: newTeacherForm.phone,
      subjects: newTeacherForm.subjects,
      specialization: newTeacherForm.specialization,
      status: 'Available',
      maxPeriodsPerDay: newTeacherForm.maxPeriodsPerDay,
      maxPeriodsPerWeek: newTeacherForm.maxPeriodsPerWeek
    };

    setTeachers([...teachers, newTeacher]);
    setShowAddTeacherModal(false);
    showToast(`${newTeacher.name} added successfully!`, 'success');
  };

  const handleEditTeacher = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setNewTeacherForm({
      employeeId: teacher.employeeId,
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone,
      subjects: teacher.subjects,
      specialization: teacher.specialization,
      maxPeriodsPerDay: teacher.maxPeriodsPerDay,
      maxPeriodsPerWeek: teacher.maxPeriodsPerWeek
    });
    setShowEditTeacherModal(true);
  };

  const handleUpdateTeacher = () => {
    if (!selectedTeacher) return;

    const updatedTeachers = teachers.map(t =>
      t.id === selectedTeacher.id
        ? { ...t, ...newTeacherForm }
        : t
    );

    setTeachers(updatedTeachers);
    setShowEditTeacherModal(false);
    setSelectedTeacher(null);
    showToast('Teacher updated successfully!', 'success');
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(teachers.filter(t => t.id !== teacherId));
      showToast('Teacher deleted successfully', 'success');
    }
  };

  const toggleTeacherStatus = (teacherId: string) => {
    setTeachers(teachers.map(t =>
      t.id === teacherId
        ? { ...t, status: t.status === 'Available' ? 'On Leave' : 'Available' }
        : t
    ));
    showToast('Teacher status updated', 'success');
  };

  const toggleSubjectForTeacher = (subject: string) => {
    const subjects = newTeacherForm.subjects.includes(subject)
      ? newTeacherForm.subjects.filter(s => s !== subject)
      : [...newTeacherForm.subjects, subject];
    setNewTeacherForm({ ...newTeacherForm, subjects });
  };

  // ==================== AVAILABILITY MANAGEMENT FUNCTIONS ====================

  const initializeAvailability = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const periodsPerDay = parseInt(formData.periodsPerDay);

    const availability: TeacherAvailability[] = teachers.flatMap(teacher =>
      days.slice(0, parseInt(formData.workingDays)).map(day => ({
        teacherId: teacher.id,
        teacherName: teacher.name,
        day,
        periods: Array.from({ length: periodsPerDay }, (_, i) => ({
          periodNumber: i + 1,
          isAvailable: teacher.status === 'Available',
          reason: teacher.status !== 'Available' ? 'On Leave' : undefined
        }))
      }))
    );

    setTeacherAvailability(availability);
  };

  const togglePeriodAvailability = (teacherId: string, day: string, periodNumber: number) => {
    setTeacherAvailability(prev => prev.map(avail => {
      if (avail.teacherId === teacherId && avail.day === day) {
        return {
          ...avail,
          periods: avail.periods.map(p =>
            p.periodNumber === periodNumber
              ? { ...p, isAvailable: !p.isAvailable, reason: p.isAvailable ? 'Unavailable' : undefined }
              : p
          )
        };
      }
      return avail;
    }));
  };

  const markTeacherDayUnavailable = (teacherId: string, day: string, reason: string) => {
    setTeacherAvailability(prev => prev.map(avail => {
      if (avail.teacherId === teacherId && avail.day === day) {
        return {
          ...avail,
          periods: avail.periods.map(p => ({ ...p, isAvailable: false, reason }))
        };
      }
      return avail;
    }));
    showToast('Teacher marked unavailable for the day', 'success');
  };

  // ==================== SUBJECT ASSIGNMENT FUNCTIONS ====================

  const toggleTeacherForSubject = (subjectName: string, teacherId: string) => {
    setSubjectAssignments(prev => prev.map(assignment => {
      if (assignment.subjectName === subjectName) {
        const assigned = assignment.assignedTeachers.includes(teacherId)
          ? assignment.assignedTeachers.filter(id => id !== teacherId)
          : [...assignment.assignedTeachers, teacherId];
        return { ...assignment, assignedTeachers: assigned };
      }
      return assignment;
    }));
  };

  const updatePeriodsRequired = (subjectName: string, periods: number) => {
    setSubjectAssignments(prev => prev.map(assignment =>
      assignment.subjectName === subjectName
        ? { ...assignment, requiredPeriodsPerWeek: periods }
        : assignment
    ));
  };

  // ==================== CONFLICT DETECTION ====================

  const detectConflicts = (): ConflictWarning[] => {
    const detectedConflicts: ConflictWarning[] = [];

    // Check for subjects without teachers
    subjectAssignments.forEach(assignment => {
      if (assignment.assignedTeachers.length === 0) {
        detectedConflicts.push({
          type: 'unassigned_subject',
          severity: 'high',
          message: `Subject "${assignment.subjectName}" has no teachers assigned`,
          affectedSubjects: [assignment.subjectName]
        });
      }
    });

    // Check for unavailable teachers
    teachers.forEach(teacher => {
      if (teacher.status !== 'Available') {
        detectedConflicts.push({
          type: 'teacher_unavailable',
          severity: 'medium',
          message: `${teacher.name} is marked as "${teacher.status}"`,
          affectedTeachers: [teacher.name]
        });
      }
    });

    // Check for teacher workload
    teachers.forEach(teacher => {
      const assignedSubjects = subjectAssignments.filter(a => a.assignedTeachers.includes(teacher.id));
      const totalPeriods = assignedSubjects.reduce((sum, a) => sum + a.requiredPeriodsPerWeek, 0);

      if (totalPeriods > teacher.maxPeriodsPerWeek) {
        detectedConflicts.push({
          type: 'teacher_overloaded',
          severity: 'high',
          message: `${teacher.name} is overloaded: ${totalPeriods} periods (max: ${teacher.maxPeriodsPerWeek})`,
          affectedTeachers: [teacher.name]
        });
      }
    });

    setConflicts(detectedConflicts);
    return detectedConflicts;
  };

  // ==================== TIMETABLE GENERATION ====================

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateTimetable = () => {
    // Detect conflicts first
    const foundConflicts = detectConflicts();
    const highSeverityConflicts = foundConflicts.filter(c => c.severity === 'high');

    if (highSeverityConflicts.length > 0) {
      showToast(`Cannot generate: ${highSeverityConflicts.length} high-severity conflicts found`, 'error');
      setActiveSection('conflicts');
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const periodsPerDay = parseInt(formData.periodsPerDay);
      const workingDays = parseInt(formData.workingDays);
      const numClassrooms = parseInt(formData.classrooms);
      const numLabs = parseInt(formData.labsAvailable);

      const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      const rooms: string[] = [];

      for (let i = 1; i <= numClassrooms; i++) {
        rooms.push(`Room ${100 + i}`);
      }
      for (let i = 1; i <= numLabs; i++) {
        rooms.push(`Lab ${String.fromCharCode(64 + i)}`);
      }

      // Use real subject assignments
      const assignedSubjects = subjectAssignments.filter(a => a.assignedTeachers.length > 0);

      // Track teacher usage
      const teacherUsage: { [key: string]: number } = {};
      teachers.forEach(t => { teacherUsage[t.id] = 0; });

      const timetable = days.slice(0, workingDays).map((day, dayIdx) => ({
        day,
        periods: Array.from({ length: periodsPerDay }, (_, periodIdx) => {
          const subject = assignedSubjects[periodIdx % assignedSubjects.length];

          // Get available teachers for this subject
          const availableTeachers = subject.assignedTeachers
            .map(tid => teachers.find(t => t.id === tid)!)
            .filter(t => t.status === 'Available');

          // Pick teacher with least usage
          availableTeachers.sort((a, b) => teacherUsage[a.id] - teacherUsage[b.id]);
          const selectedTeacher = availableTeachers[0] || { name: 'TBD' };

          if (selectedTeacher.id) {
            teacherUsage[selectedTeacher.id]++;
          }

          return {
            period: `Period ${periodIdx + 1}`,
            subject: subject.subjectName,
            teacher: selectedTeacher.name,
            room: rooms[(dayIdx * periodsPerDay + periodIdx) % rooms.length],
            time: `${8 + periodIdx}:00 - ${9 + periodIdx}:00`
          };
        })
      }));

      const newTimetable: GeneratedTimetable = {
        id: `tt${savedTimetables.length + 1}`,
        generatedDate: new Date().toISOString(),
        data: timetable,
        stats: {
          conflictsFree: foundConflicts.length === 0 ? '100%' : `${Math.max(0, 100 - foundConflicts.length * 10)}%`,
          teacherSatisfaction: '95%',
          labUtilization: `${Math.round((numLabs / (numClassrooms + numLabs)) * 100)}%`,
          generationTime: '28 seconds'
        },
        configuration: {
          teachers: teachers.length,
          subjects: assignedSubjects.length,
          classrooms: numClassrooms,
          labs: numLabs,
          periodsPerDay,
          workingDays
        }
      };

      setGeneratedTimetable(newTimetable);
      setIsGenerating(false);
      setActiveSection('timetable');
      showToast('Timetable generated successfully!', 'success');
    }, 3000);
  };

  const saveTimetable = () => {
    if (generatedTimetable) {
      setSavedTimetables([...savedTimetables, generatedTimetable]);
      showToast('Timetable saved successfully!', 'success');
    }
  };

  const loadTimetable = (timetableId: string) => {
    const timetable = savedTimetables.find(t => t.id === timetableId);
    if (timetable) {
      setGeneratedTimetable(timetable);
      setActiveSection('timetable');
      showToast('Timetable loaded!', 'success');
    }
  };

  const deleteSavedTimetable = (timetableId: string) => {
    if (window.confirm('Delete this saved timetable?')) {
      setSavedTimetables(savedTimetables.filter(t => t.id !== timetableId));
      showToast('Timetable deleted', 'success');
    }
  };

  const exportTimetable = (format: string) => {
    showToast(`Exporting as ${format}...`, 'info');
  };

  // ==================== STATS CALCULATIONS ====================

  const calculateStats = () => {
    const totalTeachers = teachers.length;
    const availableTeachers = teachers.filter(t => t.status === 'Available').length;
    const totalSubjects = availableSubjects.length;
    const assignedSubjects = subjectAssignments.filter(a => a.assignedTeachers.length > 0).length;
    const conflictCount = conflicts.length;

    return {
      totalTeachers,
      availableTeachers,
      totalSubjects,
      assignedSubjects,
      conflictCount
    };
  };

  const stats = calculateStats();

  // Initialize availability on first load
  if (teacherAvailability.length === 0 && teachers.length > 0) {
    initializeAvailability();
  }

  // ==================== RENDER ====================

  return (
    <div className="ai-timetable-page">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`notification-toast ${notificationType}`}>
          <i className={`fas ${notificationType === 'success' ? 'fa-check-circle' : notificationType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-brain"></i> AI Timetable Generator</h1>
          <p>Intelligent scheduling with teacher availability and conflict detection</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Generate Schedule functionality')}>
            <i className="fas fa-magic"></i>
            Generate Schedule
          </button>
          <button className="btn-secondary" onClick={() => alert('Export Schedule functionality')}>
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="timetable-stats-overview">
        <div className="stat-card-timetable total">
          <div className="stat-icon-timetable">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="stat-details-timetable">
            <span className="stat-label-timetable">Total Teachers</span>
            <span className="stat-value-timetable">{stats.totalTeachers}</span>
            <span className="stat-sublabel-timetable">{stats.availableTeachers} available</span>
          </div>
        </div>

        <div className="stat-card-timetable available">
          <div className="stat-icon-timetable">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-details-timetable">
            <span className="stat-label-timetable">Available Now</span>
            <span className="stat-value-timetable">{stats.availableTeachers}</span>
            <span className="stat-sublabel-timetable">{stats.totalTeachers - stats.availableTeachers} unavailable</span>
          </div>
        </div>

        <div className="stat-card-timetable subjects">
          <div className="stat-icon-timetable">
            <i className="fas fa-book"></i>
          </div>
          <div className="stat-details-timetable">
            <span className="stat-label-timetable">Total Subjects</span>
            <span className="stat-value-timetable">{stats.totalSubjects}</span>
            <span className="stat-sublabel-timetable">{stats.assignedSubjects} assigned</span>
          </div>
        </div>

        <div className={`stat-card-timetable ${stats.conflictCount > 0 ? 'conflicts' : 'no-conflicts'}`}>
          <div className="stat-icon-timetable">
            <i className={`fas ${stats.conflictCount > 0 ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
          </div>
          <div className="stat-details-timetable">
            <span className="stat-label-timetable">Conflicts</span>
            <span className="stat-value-timetable">{stats.conflictCount}</span>
            <span className="stat-sublabel-timetable">{stats.conflictCount === 0 ? 'Ready to generate' : 'Need attention'}</span>
          </div>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="timetable-section-tabs">
        <button
          className={`tab-btn-timetable ${activeSection === 'config' ? 'active' : ''}`}
          onClick={() => setActiveSection('config')}
        >
          <i className="fas fa-cog"></i>
          Configuration
        </button>
        <button
          className={`tab-btn-timetable ${activeSection === 'teachers' ? 'active' : ''}`}
          onClick={() => setActiveSection('teachers')}
        >
          <i className="fas fa-users"></i>
          Teachers ({teachers.length})
        </button>
        <button
          className={`tab-btn-timetable ${activeSection === 'availability' ? 'active' : ''}`}
          onClick={() => setActiveSection('availability')}
        >
          <i className="fas fa-calendar-check"></i>
          Availability
        </button>
        <button
          className={`tab-btn-timetable ${activeSection === 'assignments' ? 'active' : ''}`}
          onClick={() => setActiveSection('assignments')}
        >
          <i className="fas fa-th"></i>
          Subject Assignments
        </button>
        <button
          className={`tab-btn-timetable ${activeSection === 'conflicts' ? 'active' : ''}`}
          onClick={() => { detectConflicts(); setActiveSection('conflicts'); }}
        >
          <i className="fas fa-exclamation-circle"></i>
          Conflicts ({conflicts.length})
        </button>
        {generatedTimetable && (
          <button
            className={`tab-btn-timetable ${activeSection === 'timetable' ? 'active' : ''}`}
            onClick={() => setActiveSection('timetable')}
          >
            <i className="fas fa-table"></i>
            Generated Timetable
          </button>
        )}
        <button
          className={`tab-btn-timetable ${activeSection === 'history' ? 'active' : ''}`}
          onClick={() => setActiveSection('history')}
        >
          <i className="fas fa-history"></i>
          History ({savedTimetables.length})
        </button>
      </div>

      {/* SECTION 1: CONFIGURATION */}
      {activeSection === 'config' && (
        <div className="timetable-config-section">
          <div className="section-header-timetable">
            <h2>Timetable Configuration</h2>
            <p>Set basic parameters for timetable generation</p>
          </div>

          <div className="config-grid-timetable">
            <div className="config-item-timetable">
              <label>
                <i className="fas fa-book"></i>
                Number of Subjects
              </label>
              <input
                type="number"
                name="subjects"
                value={formData.subjects}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div className="config-item-timetable">
              <label>
                <i className="fas fa-door-open"></i>
                Classrooms Available
              </label>
              <input
                type="number"
                name="classrooms"
                value={formData.classrooms}
                onChange={handleInputChange}
                min="1"
              />
            </div>

            <div className="config-item-timetable">
              <label>
                <i className="fas fa-flask"></i>
                Labs Available
              </label>
              <input
                type="number"
                name="labsAvailable"
                value={formData.labsAvailable}
                onChange={handleInputChange}
                min="0"
              />
            </div>

            <div className="config-item-timetable">
              <label>
                <i className="fas fa-clock"></i>
                Periods Per Day
              </label>
              <input
                type="number"
                name="periodsPerDay"
                value={formData.periodsPerDay}
                onChange={handleInputChange}
                min="1"
                max="10"
              />
            </div>

            <div className="config-item-timetable">
              <label>
                <i className="fas fa-calendar-week"></i>
                Working Days
              </label>
              <input
                type="number"
                name="workingDays"
                value={formData.workingDays}
                onChange={handleInputChange}
                min="1"
                max="7"
              />
            </div>
          </div>

          <div className="generate-section-timetable">
            <button
              className="generate-btn-timetable"
              onClick={generateTimetable}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Generating AI Timetable...
                </>
              ) : (
                <>
                  <i className="fas fa-magic"></i>
                  Generate AI Timetable
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* SECTION 2: TEACHER MANAGEMENT */}
      {activeSection === 'teachers' && (
        <div className="teachers-section-timetable">
          <div className="section-header-timetable">
            <h2>Teacher Management</h2>
            <p>Manage teachers and their subject assignments</p>
            <button className="add-teacher-btn-timetable" onClick={handleAddTeacher}>
              <i className="fas fa-plus"></i>
              Add Teacher
            </button>
          </div>

          <div className="teachers-grid-timetable">
            {teachers.map(teacher => (
              <div key={teacher.id} className={`teacher-card-timetable ${teacher.status.toLowerCase().replace(' ', '-')}`}>
                <div className="teacher-card-header">
                  <div className="teacher-info">
                    <h3>{teacher.name}</h3>
                    <span className="employee-id">{teacher.employeeId}</span>
                  </div>
                  <span className={`status-badge-timetable ${teacher.status.toLowerCase().replace(' ', '-')}`}>
                    {teacher.status}
                  </span>
                </div>

                <div className="teacher-details">
                  <div className="detail-row">
                    <i className="fas fa-book"></i>
                    <div>
                      <span className="detail-label">Subjects:</span>
                      <span className="detail-value">{teacher.subjects.join(', ')}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <i className="fas fa-graduation-cap"></i>
                    <div>
                      <span className="detail-label">Specialization:</span>
                      <span className="detail-value">{teacher.specialization}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <i className="fas fa-envelope"></i>
                    <div>
                      <span className="detail-label">Email:</span>
                      <span className="detail-value">{teacher.email}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <i className="fas fa-phone"></i>
                    <div>
                      <span className="detail-label">Phone:</span>
                      <span className="detail-value">{teacher.phone}</span>
                    </div>
                  </div>
                  <div className="detail-row">
                    <i className="fas fa-clock"></i>
                    <div>
                      <span className="detail-label">Max Load:</span>
                      <span className="detail-value">{teacher.maxPeriodsPerDay}/day, {teacher.maxPeriodsPerWeek}/week</span>
                    </div>
                  </div>
                </div>

                <div className="teacher-actions">
                  <button className="btn-edit-timetable" onClick={() => handleEditTeacher(teacher)}>
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button
                    className={`btn-status-timetable ${teacher.status === 'Available' ? 'unavailable' : 'available'}`}
                    onClick={() => toggleTeacherStatus(teacher.id)}
                  >
                    <i className={`fas ${teacher.status === 'Available' ? 'fa-user-times' : 'fa-user-check'}`}></i>
                    {teacher.status === 'Available' ? 'Mark Unavailable' : 'Mark Available'}
                  </button>
                  <button className="btn-delete-timetable" onClick={() => handleDeleteTeacher(teacher.id)}>
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: AVAILABILITY CALENDAR */}
      {activeSection === 'availability' && (
        <div className="availability-section-timetable">
          <div className="section-header-timetable">
            <h2>Teacher Availability</h2>
            <p>Manage teacher availability by day and period</p>
            <select
              value={selectedDayForAvailability}
              onChange={(e) => setSelectedDayForAvailability(e.target.value)}
              className="day-selector-timetable"
            >
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              {parseInt(formData.workingDays) > 5 && <option value="Saturday">Saturday</option>}
              {parseInt(formData.workingDays) > 6 && <option value="Sunday">Sunday</option>}
            </select>
          </div>

          <div className="availability-grid-timetable">
            <div className="availability-header">
              <div className="teacher-name-cell">Teacher</div>
              {Array.from({ length: parseInt(formData.periodsPerDay) }, (_, i) => (
                <div key={i} className="period-header-cell">Period {i + 1}</div>
              ))}
            </div>

            {teachers.map(teacher => {
              const dayAvailability = teacherAvailability.find(
                a => a.teacherId === teacher.id && a.day === selectedDayForAvailability
              );

              return (
                <div key={teacher.id} className="availability-row">
                  <div className="teacher-name-cell">
                    <span>{teacher.name}</span>
                    <span className={`mini-status ${teacher.status.toLowerCase().replace(' ', '-')}`}>
                      {teacher.status}
                    </span>
                  </div>
                  {dayAvailability?.periods.map(period => (
                    <div
                      key={period.periodNumber}
                      className={`period-availability-cell ${period.isAvailable ? 'available' : 'unavailable'}`}
                      onClick={() => togglePeriodAvailability(teacher.id, selectedDayForAvailability, period.periodNumber)}
                      title={period.reason || (period.isAvailable ? 'Available' : 'Unavailable')}
                    >
                      <i className={`fas ${period.isAvailable ? 'fa-check' : 'fa-times'}`}></i>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="availability-legend">
            <div className="legend-item">
              <div className="legend-box available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-box unavailable"></div>
              <span>Unavailable</span>
            </div>
            <p className="legend-note">Click on any period to toggle availability</p>
          </div>
        </div>
      )}

      {/* SECTION 4: SUBJECT ASSIGNMENTS */}
      {activeSection === 'assignments' && (
        <div className="assignments-section-timetable">
          <div className="section-header-timetable">
            <h2>Subject-Teacher Assignments</h2>
            <p>Assign teachers to subjects and set required periods</p>
          </div>

          <div className="subject-assignment-matrix">
            {subjectAssignments.map(assignment => (
              <div key={assignment.subjectName} className="subject-row-timetable">
                <div className="subject-info-timetable">
                  <h3>{assignment.subjectName}</h3>
                  <div className="periods-config">
                    <label>Periods/Week:</label>
                    <input
                      type="number"
                      value={assignment.requiredPeriodsPerWeek}
                      onChange={(e) => updatePeriodsRequired(assignment.subjectName, parseInt(e.target.value))}
                      min="1"
                      max="20"
                    />
                  </div>
                </div>

                <div className="teachers-assignment">
                  {teachers.map(teacher => {
                    const isAssigned = assignment.assignedTeachers.includes(teacher.id);
                    const canTeach = teacher.subjects.includes(assignment.subjectName);

                    return (
                      <div
                        key={teacher.id}
                        className={`teacher-checkbox-timetable ${isAssigned ? 'assigned' : ''} ${!canTeach ? 'not-qualified' : ''}`}
                      >
                        <input
                          type="checkbox"
                          id={`${assignment.subjectName}-${teacher.id}`}
                          checked={isAssigned}
                          onChange={() => toggleTeacherForSubject(assignment.subjectName, teacher.id)}
                        />
                        <label htmlFor={`${assignment.subjectName}-${teacher.id}`}>
                          {teacher.name}
                          {!canTeach && <span className="not-qualified-badge">Not in profile</span>}
                        </label>
                      </div>
                    );
                  })}
                </div>

                <div className="assignment-summary">
                  <span className="assigned-count">
                    {assignment.assignedTeachers.length} teacher(s) assigned
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: CONFLICTS */}
      {activeSection === 'conflicts' && (
        <div className="conflicts-section-timetable">
          <div className="section-header-timetable">
            <h2>Conflict Detection</h2>
            <p>Review and resolve scheduling conflicts before generation</p>
            <button className="detect-btn-timetable" onClick={detectConflicts}>
              <i className="fas fa-search"></i>
              Re-check Conflicts
            </button>
          </div>

          {conflicts.length === 0 ? (
            <div className="no-conflicts-message">
              <i className="fas fa-check-circle"></i>
              <h3>No Conflicts Detected!</h3>
              <p>Your configuration is ready for timetable generation</p>
            </div>
          ) : (
            <div className="conflicts-list">
              {conflicts.filter(c => c.severity === 'high').length > 0 && (
                <div className="conflict-group">
                  <h3 className="conflict-group-title high">
                    <i className="fas fa-exclamation-circle"></i>
                    High Severity ({conflicts.filter(c => c.severity === 'high').length})
                  </h3>
                  {conflicts.filter(c => c.severity === 'high').map((conflict, idx) => (
                    <div key={idx} className="conflict-alert-timetable high">
                      <div className="conflict-icon">
                        <i className="fas fa-exclamation-triangle"></i>
                      </div>
                      <div className="conflict-details">
                        <span className="conflict-type">{conflict.type.replace(/_/g, ' ').toUpperCase()}</span>
                        <p className="conflict-message">{conflict.message}</p>
                        {conflict.affectedTeachers && (
                          <span className="affected">Teachers: {conflict.affectedTeachers.join(', ')}</span>
                        )}
                        {conflict.affectedSubjects && (
                          <span className="affected">Subjects: {conflict.affectedSubjects.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {conflicts.filter(c => c.severity === 'medium').length > 0 && (
                <div className="conflict-group">
                  <h3 className="conflict-group-title medium">
                    <i className="fas fa-exclamation-triangle"></i>
                    Medium Severity ({conflicts.filter(c => c.severity === 'medium').length})
                  </h3>
                  {conflicts.filter(c => c.severity === 'medium').map((conflict, idx) => (
                    <div key={idx} className="conflict-alert-timetable medium">
                      <div className="conflict-icon">
                        <i className="fas fa-exclamation"></i>
                      </div>
                      <div className="conflict-details">
                        <span className="conflict-type">{conflict.type.replace(/_/g, ' ').toUpperCase()}</span>
                        <p className="conflict-message">{conflict.message}</p>
                        {conflict.affectedTeachers && (
                          <span className="affected">Teachers: {conflict.affectedTeachers.join(', ')}</span>
                        )}
                        {conflict.affectedSubjects && (
                          <span className="affected">Subjects: {conflict.affectedSubjects.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {conflicts.filter(c => c.severity === 'low').length > 0 && (
                <div className="conflict-group">
                  <h3 className="conflict-group-title low">
                    <i className="fas fa-info-circle"></i>
                    Low Severity ({conflicts.filter(c => c.severity === 'low').length})
                  </h3>
                  {conflicts.filter(c => c.severity === 'low').map((conflict, idx) => (
                    <div key={idx} className="conflict-alert-timetable low">
                      <div className="conflict-icon">
                        <i className="fas fa-info"></i>
                      </div>
                      <div className="conflict-details">
                        <span className="conflict-type">{conflict.type.replace(/_/g, ' ').toUpperCase()}</span>
                        <p className="conflict-message">{conflict.message}</p>
                        {conflict.affectedTeachers && (
                          <span className="affected">Teachers: {conflict.affectedTeachers.join(', ')}</span>
                        )}
                        {conflict.affectedSubjects && (
                          <span className="affected">Subjects: {conflict.affectedSubjects.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* SECTION 6: GENERATED TIMETABLE */}
      {activeSection === 'timetable' && generatedTimetable && (
        <div className="timetable-display-section">
          <div className="section-header-timetable">
            <h2>Generated Timetable</h2>
            <p>AI-optimized schedule for your institution</p>
            <div className="timetable-actions">
              <button className="save-timetable-btn" onClick={saveTimetable}>
                <i className="fas fa-save"></i>
                Save Timetable
              </button>
            </div>
          </div>

          <div className="timetable-stats-grid">
            <div className="stat-card success-stat">
              <div className="stat-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Conflicts Free</span>
                <span className="stat-value">{generatedTimetable.stats.conflictsFree}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Teacher Satisfaction</span>
                <span className="stat-value">{generatedTimetable.stats.teacherSatisfaction}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-flask"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Lab Utilization</span>
                <span className="stat-value">{generatedTimetable.stats.labUtilization}</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <div className="stat-content">
                <span className="stat-label">Generation Time</span>
                <span className="stat-value">{generatedTimetable.stats.generationTime}</span>
              </div>
            </div>
          </div>

          <div className="export-card">
            <div className="export-header">
              <i className="fas fa-download"></i>
              <h3>Export Timetable</h3>
            </div>
            <div className="export-buttons">
              <button onClick={() => exportTimetable('PDF')} className="export-btn">
                <i className="fas fa-file-pdf"></i>
                <span>Export as PDF</span>
              </button>
              <button onClick={() => exportTimetable('Excel')} className="export-btn">
                <i className="fas fa-file-excel"></i>
                <span>Export as Excel</span>
              </button>
              <button onClick={() => exportTimetable('CSV')} className="export-btn">
                <i className="fas fa-file-csv"></i>
                <span>Export as CSV</span>
              </button>
              <button onClick={() => exportTimetable('Print')} className="export-btn">
                <i className="fas fa-print"></i>
                <span>Print</span>
              </button>
            </div>
          </div>

          <div className="timetable-display-card">
            <div className="timetable-display-header">
              <i className="fas fa-table"></i>
              <h3>Weekly Schedule</h3>
            </div>
            <div className="timetable-scroll">
              <table className="timetable-table">
                <thead>
                  <tr>
                    <th className="day-header">Day / Period</th>
                    {Array.from({ length: parseInt(formData.periodsPerDay) }, (_, i) => (
                      <th key={i}>Period {i + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {generatedTimetable.data.map((dayData, dayIdx) => (
                    <tr key={dayIdx}>
                      <td className="day-cell"><strong>{dayData.day}</strong></td>
                      {dayData.periods.map((periodData, periodIdx) => (
                        <td key={periodIdx} className="period-cell">
                          <div className="period-info">
                            <div className="period-subject">{periodData.subject}</div>
                            <div className="period-teacher">{periodData.teacher}</div>
                            <div className="period-room">{periodData.room}</div>
                            <div className="period-time">{periodData.time}</div>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 7: HISTORY */}
      {activeSection === 'history' && (
        <div className="history-section-timetable">
          <div className="section-header-timetable">
            <h2>Timetable History</h2>
            <p>View and manage previously generated timetables</p>
          </div>

          {savedTimetables.length === 0 ? (
            <div className="empty-history-message">
              <i className="fas fa-history"></i>
              <h3>No Saved Timetables</h3>
              <p>Generate and save timetables to access them here</p>
            </div>
          ) : (
            <div className="history-grid">
              {savedTimetables.map(timetable => (
                <div key={timetable.id} className="history-card-timetable">
                  <div className="history-card-header">
                    <h3>Timetable #{timetable.id}</h3>
                    <span className="generation-date">{formatDate(timetable.generatedDate)}</span>
                  </div>

                  <div className="history-card-config">
                    <div className="config-detail">
                      <i className="fas fa-users"></i>
                      <span>{timetable.configuration.teachers} Teachers</span>
                    </div>
                    <div className="config-detail">
                      <i className="fas fa-book"></i>
                      <span>{timetable.configuration.subjects} Subjects</span>
                    </div>
                    <div className="config-detail">
                      <i className="fas fa-door-open"></i>
                      <span>{timetable.configuration.classrooms} Classrooms</span>
                    </div>
                    <div className="config-detail">
                      <i className="fas fa-clock"></i>
                      <span>{timetable.configuration.periodsPerDay} Periods/Day</span>
                    </div>
                    <div className="config-detail">
                      <i className="fas fa-calendar-week"></i>
                      <span>{timetable.configuration.workingDays} Working Days</span>
                    </div>
                  </div>

                  <div className="history-card-stats">
                    <div className="mini-stat">
                      <span className="mini-stat-label">Conflicts</span>
                      <span className="mini-stat-value">{timetable.stats.conflictsFree}</span>
                    </div>
                    <div className="mini-stat">
                      <span className="mini-stat-label">Satisfaction</span>
                      <span className="mini-stat-value">{timetable.stats.teacherSatisfaction}</span>
                    </div>
                  </div>

                  <div className="history-card-actions">
                    <button className="load-btn-timetable" onClick={() => loadTimetable(timetable.id)}>
                      <i className="fas fa-eye"></i>
                      View
                    </button>
                    <button className="delete-btn-timetable" onClick={() => deleteSavedTimetable(timetable.id)}>
                      <i className="fas fa-trash"></i>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ADD TEACHER MODAL */}
      {showAddTeacherModal && (
        <div className="modal-overlay" onClick={() => setShowAddTeacherModal(false)}>
          <div className="teacher-modal-timetable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Teacher</h2>
              <button className="close-btn" onClick={() => setShowAddTeacherModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="form-grid-timetable">
                <div className="form-group-timetable">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    value={newTeacherForm.employeeId}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, employeeId: e.target.value})}
                    placeholder="EMP001"
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newTeacherForm.name}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, name: e.target.value})}
                    placeholder="Dr. John Smith"
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newTeacherForm.email}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, email: e.target.value})}
                    placeholder="john.smith@school.com"
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newTeacherForm.phone}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, phone: e.target.value})}
                    placeholder="9876543210"
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Specialization</label>
                  <input
                    type="text"
                    value={newTeacherForm.specialization}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, specialization: e.target.value})}
                    placeholder="Mathematics"
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Max Periods/Day</label>
                  <input
                    type="number"
                    value={newTeacherForm.maxPeriodsPerDay}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, maxPeriodsPerDay: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="form-group-timetable full-width">
                  <label>Max Periods/Week</label>
                  <input
                    type="number"
                    value={newTeacherForm.maxPeriodsPerWeek}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, maxPeriodsPerWeek: parseInt(e.target.value)})}
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              <div className="form-group-timetable full-width">
                <label>Subjects * (Select at least one)</label>
                <div className="subjects-checkbox-grid">
                  {availableSubjects.map(subject => (
                    <div key={subject} className="checkbox-item-timetable">
                      <input
                        type="checkbox"
                        id={`subject-${subject}`}
                        checked={newTeacherForm.subjects.includes(subject)}
                        onChange={() => toggleSubjectForTeacher(subject)}
                      />
                      <label htmlFor={`subject-${subject}`}>{subject}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn-timetable" onClick={() => setShowAddTeacherModal(false)}>
                Cancel
              </button>
              <button className="save-btn-timetable" onClick={handleSaveNewTeacher}>
                <i className="fas fa-check"></i>
                Add Teacher
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT TEACHER MODAL */}
      {showEditTeacherModal && selectedTeacher && (
        <div className="modal-overlay" onClick={() => setShowEditTeacherModal(false)}>
          <div className="teacher-modal-timetable" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Teacher</h2>
              <button className="close-btn" onClick={() => setShowEditTeacherModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="form-grid-timetable">
                <div className="form-group-timetable">
                  <label>Employee ID</label>
                  <input
                    type="text"
                    value={newTeacherForm.employeeId}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, employeeId: e.target.value})}
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={newTeacherForm.name}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, name: e.target.value})}
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Email</label>
                  <input
                    type="email"
                    value={newTeacherForm.email}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, email: e.target.value})}
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={newTeacherForm.phone}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, phone: e.target.value})}
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Specialization</label>
                  <input
                    type="text"
                    value={newTeacherForm.specialization}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, specialization: e.target.value})}
                  />
                </div>

                <div className="form-group-timetable">
                  <label>Max Periods/Day</label>
                  <input
                    type="number"
                    value={newTeacherForm.maxPeriodsPerDay}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, maxPeriodsPerDay: parseInt(e.target.value)})}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="form-group-timetable full-width">
                  <label>Max Periods/Week</label>
                  <input
                    type="number"
                    value={newTeacherForm.maxPeriodsPerWeek}
                    onChange={(e) => setNewTeacherForm({...newTeacherForm, maxPeriodsPerWeek: parseInt(e.target.value)})}
                    min="1"
                    max="50"
                  />
                </div>
              </div>

              <div className="form-group-timetable full-width">
                <label>Subjects</label>
                <div className="subjects-checkbox-grid">
                  {availableSubjects.map(subject => (
                    <div key={subject} className="checkbox-item-timetable">
                      <input
                        type="checkbox"
                        id={`edit-subject-${subject}`}
                        checked={newTeacherForm.subjects.includes(subject)}
                        onChange={() => toggleSubjectForTeacher(subject)}
                      />
                      <label htmlFor={`edit-subject-${subject}`}>{subject}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn-timetable" onClick={() => setShowEditTeacherModal(false)}>
                Cancel
              </button>
              <button className="save-btn-timetable" onClick={handleUpdateTeacher}>
                <i className="fas fa-check"></i>
                Update Teacher
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITimetable;
