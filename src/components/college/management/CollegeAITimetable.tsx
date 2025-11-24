import { useState, useEffect } from 'react';
import './CollegeAITimetable.css';

interface TimeSlot {
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: 'lecture' | 'lab' | 'tutorial';
  department: string;
  semester: string;
}

interface Constraint {
  id: string;
  type: 'faculty' | 'room' | 'break' | 'lab';
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface GenerationResult {
  status: 'success' | 'partial' | 'failed';
  conflicts: number;
  coverage: number;
  suggestions: string[];
}

interface GenerationParams {
  department: string;
  semester: string;
  academicYear: string;
  workingDays: string;
  startTime: string;
  endTime: string;
  lectureDuration: string;
  breakDuration: string;
  constraints: {
    avoidConsecutive: boolean;
    noLabsAfter4: boolean;
    balancedWorkload: boolean;
    lunchBreak: boolean;
    facultyUnavailable: boolean;
  };
}

interface ConflictItem {
  type: 'double_booking_faculty' | 'double_booking_room' | 'back_to_back' | 'workload_imbalance' | 'constraint_violation';
  severity: 'high' | 'medium' | 'low';
  description: string;
  affectedSlots: TimeSlot[];
  suggestion?: string;
}

interface PerformanceMetrics {
  conflicts: number;
  coverage: number;
  facultyUtilization: number;
  roomUtilization: number;
  studentSatisfaction: number;
  constraintSatisfaction?: number;
}

interface TimetableVersion {
  id: string;
  timestamp: number;
  generationParams: GenerationParams;
  performanceMetrics: PerformanceMetrics;
  fullSchedule: TimeSlot[];
  conflicts: ConflictItem[];
  status: 'active' | 'archived';
  versionNumber: number;
}

interface GenerationProgress {
  percentage: number;
  message: string;
  estimatedTime: number;
}

const CollegeAITimetable = () => {
  const [activeTab, setActiveTab] = useState<'generate' | 'view' | 'conflicts' | 'optimize' | 'reports' | 'history' | 'settings'>('generate');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('CSE');
  const [selectedSemester, setSelectedSemester] = useState<string>('3');
  const [generationStatus, setGenerationStatus] = useState<GenerationResult | null>(null);
  const [hasAnimatedOptimize, setHasAnimatedOptimize] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  // New comprehensive state management
  const [currentTimetable, setCurrentTimetable] = useState<TimetableVersion | null>(null);
  const [timetableHistory, setTimetableHistory] = useState<TimetableVersion[]>([]);
  const [previousTimetable, setPreviousTimetable] = useState<TimetableVersion | null>(null);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [generationProgress, setGenerationProgress] = useState<GenerationProgress>({
    percentage: 0,
    message: '',
    estimatedTime: 0
  });
  const [generatedDepartment, setGeneratedDepartment] = useState<string>('');
  const [generatedSemester, setGeneratedSemester] = useState<string>('');
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  // Generation Settings state
  const [academicYear, setAcademicYear] = useState<string>('2024-2025');
  const [workingDays, setWorkingDays] = useState<string>('Monday to Friday');

  // Time Preferences state
  const [startTime, setStartTime] = useState<string>('09:00');
  const [endTime, setEndTime] = useState<string>('17:00');
  const [lectureDuration, setLectureDuration] = useState<string>('50 minutes');
  const [breakDuration, setBreakDuration] = useState<string>('10 minutes');

  // Constraints state
  const [avoidConsecutive, setAvoidConsecutive] = useState<boolean>(true);
  const [noLabsAfter4, setNoLabsAfter4] = useState<boolean>(true);
  const [balancedWorkload, setBalancedWorkload] = useState<boolean>(true);
  const [lunchBreak, setLunchBreak] = useState<boolean>(true);
  const [facultyUnavailable, setFacultyUnavailable] = useState<boolean>(false);

  // Constraint modal state
  const [showConstraintModal, setShowConstraintModal] = useState<boolean>(false);
  const [editingConstraint, setEditingConstraint] = useState<Constraint | null>(null);
  const [constraintFormData, setConstraintFormData] = useState({
    type: 'faculty' as 'faculty' | 'room' | 'break' | 'lab',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low'
  });

  // App Settings state (separate from generation settings)
  const [appSettings, setAppSettings] = useState({
    defaultWorkingHours: { start: '08:00', end: '17:00', slotDuration: 60 },
    defaultWorkingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    defaultConstraints: ['noBackToBackLabs', 'lunchBreakRequired', 'maxClassesPerDay'],
    notifications: { emailOnGeneration: true, alertOnConflicts: true, weeklyReports: false }
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      try {
        setAppSettings(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }, []);

  // Trigger animation once when Optimization tab becomes active
  useEffect(() => {
    if (activeTab === 'optimize' && !hasAnimatedOptimize) {
      setHasAnimatedOptimize(true);
    }
  }, [activeTab, hasAnimatedOptimize]);

  const departments = ['CSE', 'EEE', 'MECHANICAL', 'CIVIL', 'ECE'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const [constraints, setConstraints] = useState<Constraint[]>([
    {
      id: 'c1',
      type: 'faculty',
      description: 'Dr. Smith unavailable on Monday mornings',
      priority: 'high'
    },
    {
      id: 'c2',
      type: 'room',
      description: 'Lab 3 under maintenance Thursday afternoon',
      priority: 'high'
    },
    {
      id: 'c3',
      type: 'break',
      description: 'Lunch break must be 1-2 PM',
      priority: 'high'
    },
    {
      id: 'c4',
      type: 'lab',
      description: 'Lab sessions should be minimum 2 hours',
      priority: 'medium'
    }
  ]);

  const [sampleTimetable] = useState<TimeSlot[]>([
    {
      day: 'Monday',
      time: '9:00-10:00',
      subject: 'Data Structures',
      faculty: 'Dr. Priya Sharma',
      room: 'Room 301',
      type: 'lecture',
      department: 'CSE',
      semester: '3'
    },
    {
      day: 'Monday',
      time: '10:00-11:00',
      subject: 'Database Management',
      faculty: 'Dr. Rajesh Kumar',
      room: 'Room 301',
      type: 'lecture',
      department: 'CSE',
      semester: '3'
    },
    {
      day: 'Monday',
      time: '11:00-12:00',
      subject: 'Operating Systems',
      faculty: 'Prof. Anita Desai',
      room: 'Room 301',
      type: 'lecture',
      department: 'CSE',
      semester: '3'
    },
    {
      day: 'Monday',
      time: '2:00-4:00',
      subject: 'Data Structures Lab',
      faculty: 'Dr. Priya Sharma',
      room: 'Lab 1',
      type: 'lab',
      department: 'CSE',
      semester: '3'
    }
  ]);

  // ============ CSV DOWNLOAD HELPER FUNCTIONS ============

  // Generic CSV creator and downloader
  const createCSV = (headers: string[], rows: string[][]): string => {
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    return csvContent;
  };

  const downloadCSV = (filename: string, csvContent: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Download full timetable as CSV
  const downloadTimetableCSV = (timetable: TimetableVersion) => {
    const headers = ['Day', 'Time', 'Subject', 'Faculty', 'Room', 'Type', 'Department', 'Semester'];
    const rows = timetable.fullSchedule.map(slot => [
      slot.day,
      slot.time,
      slot.subject,
      slot.faculty,
      slot.room,
      slot.type,
      slot.department,
      slot.semester
    ]);

    const csvContent = createCSV(headers, rows);
    const timestamp = new Date(timetable.timestamp).toISOString().split('T')[0];
    downloadCSV(`timetable-${timetable.generationParams.department}-sem${timetable.generationParams.semester}-${timestamp}.csv`, csvContent);
  };

  // Download faculty workload report as CSV
  const downloadFacultyWorkloadCSV = (timetable: TimetableVersion) => {
    const facultyMap = new Map<string, { hours: number; classes: number; departments: Set<string> }>();

    timetable.fullSchedule.forEach(slot => {
      if (slot.subject === 'LUNCH BREAK') return;

      if (!facultyMap.has(slot.faculty)) {
        facultyMap.set(slot.faculty, { hours: 0, classes: 0, departments: new Set() });
      }

      const data = facultyMap.get(slot.faculty)!;
      const duration = parseInt(timetable.generationParams.lectureDuration.split(' ')[0]) / 60;
      data.hours += duration;
      data.classes += 1;
      data.departments.add(slot.department);
    });

    const headers = ['Faculty Name', 'Total Hours', 'Number of Classes', 'Departments'];
    const rows = Array.from(facultyMap.entries()).map(([faculty, data]) => [
      faculty,
      data.hours.toFixed(1),
      data.classes.toString(),
      Array.from(data.departments).join('; ')
    ]);

    const csvContent = createCSV(headers, rows);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(`faculty-workload-report-${timestamp}.csv`, csvContent);
  };

  // Download room utilization report as CSV
  const downloadRoomUtilizationCSV = (timetable: TimetableVersion) => {
    const roomMap = new Map<string, { slots: number; days: Map<string, number>; times: Map<string, number> }>();

    timetable.fullSchedule.forEach(slot => {
      if (slot.subject === 'LUNCH BREAK') return;

      if (!roomMap.has(slot.room)) {
        roomMap.set(slot.room, { slots: 0, days: new Map(), times: new Map() });
      }

      const data = roomMap.get(slot.room)!;
      data.slots += 1;
      data.days.set(slot.day, (data.days.get(slot.day) || 0) + 1);
      data.times.set(slot.time, (data.times.get(slot.time) || 0) + 1);
    });

    const totalSlots = timetable.fullSchedule.filter(s => s.subject !== 'LUNCH BREAK').length / roomMap.size;
    const headers = ['Room Name', 'Total Slots', 'Utilization %', 'Peak Day', 'Peak Time'];
    const rows = Array.from(roomMap.entries()).map(([room, data]) => {
      const peakDay = Array.from(data.days.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      const peakTime = Array.from(data.times.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
      const utilization = ((data.slots / totalSlots) * 100).toFixed(1);

      return [room, data.slots.toString(), utilization, peakDay, peakTime];
    });

    const csvContent = createCSV(headers, rows);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(`room-utilization-report-${timestamp}.csv`, csvContent);
  };

  // Download department analytics report as CSV
  const downloadDepartmentAnalyticsCSV = (timetable: TimetableVersion) => {
    const deptMap = new Map<string, { total: number; lecture: number; lab: number; tutorial: number; faculty: Set<string> }>();

    timetable.fullSchedule.forEach(slot => {
      if (slot.subject === 'LUNCH BREAK') return;

      if (!deptMap.has(slot.department)) {
        deptMap.set(slot.department, { total: 0, lecture: 0, lab: 0, tutorial: 0, faculty: new Set() });
      }

      const data = deptMap.get(slot.department)!;
      data.total += 1;
      data[slot.type] += 1;
      data.faculty.add(slot.faculty);
    });

    const headers = ['Department', 'Total Classes', 'Lectures', 'Labs', 'Tutorials', 'Faculty Count'];
    const rows = Array.from(deptMap.entries()).map(([dept, data]) => [
      dept,
      data.total.toString(),
      data.lecture.toString(),
      data.lab.toString(),
      data.tutorial.toString(),
      data.faculty.size.toString()
    ]);

    const csvContent = createCSV(headers, rows);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadCSV(`department-analytics-${timestamp}.csv`, csvContent);
  };

  // ============ END CSV HELPERS ============

  // ============ CONFLICT DETECTION & ANALYSIS FUNCTIONS ============

  // Detect faculty/room double bookings
  const detectDoubleBookings = (schedule: TimeSlot[]): ConflictItem[] => {
    const conflicts: ConflictItem[] = [];
    const slotMap = new Map<string, TimeSlot[]>();

    schedule.forEach(slot => {
      const facultyKey = `faculty-${slot.faculty}-${slot.day}-${slot.time}`;
      const roomKey = `room-${slot.room}-${slot.day}-${slot.time}`;

      // Track faculty bookings
      if (!slotMap.has(facultyKey)) {
        slotMap.set(facultyKey, []);
      }
      slotMap.get(facultyKey)!.push(slot);

      // Track room bookings
      if (!slotMap.has(roomKey)) {
        slotMap.set(roomKey, []);
      }
      slotMap.get(roomKey)!.push(slot);
    });

    // Check for conflicts
    slotMap.forEach((slots, key) => {
      if (slots.length > 1) {
        const isFacultyConflict = key.startsWith('faculty');
        conflicts.push({
          type: isFacultyConflict ? 'double_booking_faculty' : 'double_booking_room',
          severity: 'high',
          description: isFacultyConflict
            ? `${slots[0].faculty} is double-booked on ${slots[0].day} at ${slots[0].time}`
            : `${slots[0].room} is double-booked on ${slots[0].day} at ${slots[0].time}`,
          affectedSlots: slots,
          suggestion: isFacultyConflict
            ? `Reassign one of the classes to a different time slot or faculty member`
            : `Move one class to an available room`
        });
      }
    });

    return conflicts;
  };

  // Detect back-to-back scheduling issues
  const detectBackToBackIssues = (schedule: TimeSlot[], params: GenerationParams): ConflictItem[] => {
    const conflicts: ConflictItem[] = [];

    if (!params.constraints.avoidConsecutive) return conflicts;

    const facultySchedule = new Map<string, Map<string, TimeSlot[]>>();

    // Organize by faculty and day
    schedule.forEach(slot => {
      if (!facultySchedule.has(slot.faculty)) {
        facultySchedule.set(slot.faculty, new Map());
      }
      const dayMap = facultySchedule.get(slot.faculty)!;
      if (!dayMap.has(slot.day)) {
        dayMap.set(slot.day, []);
      }
      dayMap.get(slot.day)!.push(slot);
    });

    // Check for consecutive slots
    facultySchedule.forEach((dayMap, faculty) => {
      dayMap.forEach((slots, day) => {
        const sortedSlots = slots.sort((a, b) => {
          const aStart = a.time.split('-')[0];
          const bStart = b.time.split('-')[0];
          return aStart.localeCompare(bStart);
        });

        for (let i = 0; i < sortedSlots.length - 1; i++) {
          const currentEnd = sortedSlots[i].time.split('-')[1];
          const nextStart = sortedSlots[i + 1].time.split('-')[0];

          if (currentEnd === nextStart) {
            conflicts.push({
              type: 'back_to_back',
              severity: 'medium',
              description: `${faculty} has back-to-back classes on ${day}: ${sortedSlots[i].subject} followed by ${sortedSlots[i + 1].subject}`,
              affectedSlots: [sortedSlots[i], sortedSlots[i + 1]],
              suggestion: `Add a break between these classes or assign to different faculty`
            });
          }
        }
      });
    });

    return conflicts;
  };

  // Analyze workload balance
  const analyzeWorkloadBalance = (schedule: TimeSlot[]): ConflictItem[] => {
    const conflicts: ConflictItem[] = [];
    const facultyHours = new Map<string, number>();
    const dayHours = new Map<string, Map<string, number>>();

    schedule.forEach(slot => {
      if (slot.subject === 'LUNCH BREAK') return;

      // Calculate faculty total hours
      const duration = parseInt(lectureDuration.split(' ')[0]) / 60; // Convert to hours
      facultyHours.set(slot.faculty, (facultyHours.get(slot.faculty) || 0) + duration);

      // Calculate hours per day
      if (!dayHours.has(slot.day)) {
        dayHours.set(slot.day, new Map());
      }
      const facultyDayMap = dayHours.get(slot.day)!;
      facultyDayMap.set(slot.faculty, (facultyDayMap.get(slot.faculty) || 0) + duration);
    });

    // Check for overloaded faculty (>6 hours/day or >24 hours/week)
    facultyHours.forEach((hours, faculty) => {
      if (hours > 24) {
        conflicts.push({
          type: 'workload_imbalance',
          severity: 'high',
          description: `${faculty} is overloaded with ${hours.toFixed(1)} hours/week (max recommended: 24)`,
          affectedSlots: schedule.filter(s => s.faculty === faculty),
          suggestion: `Distribute some classes to other faculty members`
        });
      }
    });

    // Check daily overload
    dayHours.forEach((facultyMap, day) => {
      facultyMap.forEach((hours, faculty) => {
        if (hours > 6) {
          conflicts.push({
            type: 'workload_imbalance',
            severity: 'medium',
            description: `${faculty} has ${hours.toFixed(1)} hours on ${day} (max recommended: 6)`,
            affectedSlots: schedule.filter(s => s.faculty === faculty && s.day === day),
            suggestion: `Spread classes across other days`
          });
        }
      });
    });

    return conflicts;
  };

  // Validate constraint violations
  const validateConstraints = (schedule: TimeSlot[], params: GenerationParams): ConflictItem[] => {
    const conflicts: ConflictItem[] = [];

    // Check no labs after 4 PM
    if (params.constraints.noLabsAfter4) {
      schedule.forEach(slot => {
        if (slot.type === 'lab') {
          const startHour = parseInt(slot.time.split(':')[0]);
          if (startHour >= 16) {
            conflicts.push({
              type: 'constraint_violation',
              severity: 'low',
              description: `Lab session "${slot.subject}" scheduled at ${slot.time} on ${slot.day} violates "No labs after 4 PM" constraint`,
              affectedSlots: [slot],
              suggestion: `Reschedule to morning or early afternoon`
            });
          }
        }
      });
    }

    // Check lunch break
    if (params.constraints.lunchBreak) {
      const days = [...new Set(schedule.map(s => s.day))];
      days.forEach(day => {
        const hasLunch = schedule.some(s =>
          s.day === day && s.subject === 'LUNCH BREAK' && s.time.includes('1:') && s.time.includes('2:')
        );
        if (!hasLunch) {
          conflicts.push({
            type: 'constraint_violation',
            severity: 'medium',
            description: `No lunch break scheduled on ${day}`,
            affectedSlots: [],
            suggestion: `Add lunch break from 1:00-2:00 PM`
          });
        }
      });
    }

    return conflicts;
  };

  // Main analysis function
  const analyzeGeneratedTimetable = (schedule: TimeSlot[], params: GenerationParams) => {
    const allConflicts: ConflictItem[] = [
      ...detectDoubleBookings(schedule),
      ...detectBackToBackIssues(schedule, params),
      ...analyzeWorkloadBalance(schedule),
      ...validateConstraints(schedule, params)
    ];

    // Calculate metrics
    const totalSlots = schedule.filter(s => s.subject !== 'LUNCH BREAK').length;
    const workingDays = params.workingDays === 'Monday to Saturday' ? 6 : 5;

    // Faculty utilization: percentage of teaching hours vs available hours
    const facultyHours = new Map<string, number>();
    schedule.forEach(slot => {
      if (slot.subject !== 'LUNCH BREAK') {
        const duration = parseInt(params.lectureDuration.split(' ')[0]) / 60;
        facultyHours.set(slot.faculty, (facultyHours.get(slot.faculty) || 0) + duration);
      }
    });
    const avgFacultyHours = Array.from(facultyHours.values()).reduce((a, b) => a + b, 0) / facultyHours.size;
    const maxWeeklyHours = workingDays * 8; // Assuming 8-hour workday
    const facultyUtilization = Math.min(100, Math.round((avgFacultyHours / maxWeeklyHours) * 100));

    // Room utilization
    const roomSlots = new Map<string, number>();
    schedule.forEach(slot => {
      if (slot.subject !== 'LUNCH BREAK') {
        roomSlots.set(slot.room, (roomSlots.get(slot.room) || 0) + 1);
      }
    });
    const totalRoomSlots = roomSlots.size * totalSlots / schedule.length;
    const roomUtilization = Math.min(100, Math.round((totalSlots / totalRoomSlots) * 100));

    // Student satisfaction (based on gaps and class distribution)
    const dayDistribution = new Map<string, number>();
    schedule.forEach(slot => {
      if (slot.subject !== 'LUNCH BREAK') {
        dayDistribution.set(slot.day, (dayDistribution.get(slot.day) || 0) + 1);
      }
    });
    const avgClassesPerDay = Array.from(dayDistribution.values()).reduce((a, b) => a + b, 0) / dayDistribution.size;
    const variance = Array.from(dayDistribution.values()).reduce((sum, val) => sum + Math.pow(val - avgClassesPerDay, 2), 0) / dayDistribution.size;
    const studentSatisfaction = Math.max(70, Math.min(100, Math.round(100 - (variance * 2))));

    // Coverage (percentage of required slots filled)
    const coverage = Math.min(100, Math.round((totalSlots / (workingDays * 6)) * 100)); // Assuming 6 classes/day target

    // Constraint satisfaction
    const totalConstraints = Object.values(params.constraints).filter(Boolean).length;
    const violatedConstraints = allConflicts.filter(c => c.type === 'constraint_violation').length;
    const constraintSatisfaction = totalConstraints > 0
      ? Math.round(((totalConstraints - violatedConstraints) / totalConstraints) * 100)
      : 100;

    return {
      conflicts: allConflicts,
      metrics: {
        conflicts: allConflicts.length,
        coverage,
        facultyUtilization,
        roomUtilization,
        studentSatisfaction,
        constraintSatisfaction
      }
    };
  };

  // ============ END CONFLICT DETECTION ============

  const handleGenerate = async () => {
    // Capture generation parameters from state
    const params: GenerationParams = {
      department: selectedDepartment,
      semester: selectedSemester,
      academicYear: academicYear,
      workingDays: workingDays,
      startTime: startTime,
      endTime: endTime,
      lectureDuration: lectureDuration,
      breakDuration: breakDuration,
      constraints: {
        avoidConsecutive: avoidConsecutive,
        noLabsAfter4: noLabsAfter4,
        balancedWorkload: balancedWorkload,
        lunchBreak: lunchBreak,
        facultyUnavailable: facultyUnavailable
      }
    };

    // Show loading modal
    setShowGenerationModal(true);

    // Simulate generation progress
    await simulateGenerationProgress();

    // Generate realistic timetable with settings
    const fullSchedule = generateRealisticTimetable(params);

    // Analyze generated timetable for conflicts and metrics
    const analysis = analyzeGeneratedTimetable(fullSchedule, params);
    const metrics: PerformanceMetrics = analysis.metrics;

    // Create timetable version
    const versionNumber = timetableHistory.length + 1;
    const newTimetable: TimetableVersion = {
      id: `v${versionNumber}-${Date.now()}`,
      timestamp: Date.now(),
      generationParams: params,
      performanceMetrics: metrics,
      fullSchedule,
      conflicts: analysis.conflicts,
      status: 'active',
      versionNumber
    };

    // Update history: mark previous active as archived
    const updatedHistory = timetableHistory.map(tt => ({
      ...tt,
      status: 'archived' as const
    }));

    // Add new timetable to history
    setTimetableHistory([newTimetable, ...updatedHistory]);
    setCurrentTimetable(newTimetable);
    setPreviousTimetable(currentTimetable);

    // Set generated dept/semester for auto-filter
    setGeneratedDepartment(selectedDepartment);
    setGeneratedSemester(selectedSemester);

    // Update generation status for display - use real conflict suggestions
    const topConflictSuggestions = analysis.conflicts
      .slice(0, 3)
      .map(c => c.suggestion || c.description);

    setGenerationStatus({
      status: analysis.conflicts.length === 0 ? 'success' : 'partial',
      conflicts: analysis.conflicts.length,
      coverage: metrics.coverage,
      suggestions: topConflictSuggestions
    });

    // Hide loading modal
    setShowGenerationModal(false);

    // Navigate to View tab
    setTimeout(() => {
      setActiveTab('view');
      setShowSuccessBanner(true);

      // Hide success banner after 4 seconds
      setTimeout(() => {
        setShowSuccessBanner(false);
      }, 4000);
    }, 300);
  };

  const handlePreview = () => {
    setActiveTab('view');
  };

  const handleApprove = () => {
    setShowConfirmDialog(true);
  };

  const handleConfirmApprove = () => {
    setShowConfirmDialog(false);
    setShowSuccessNotification(true);
    setGenerationStatus(null);

    // Auto-hide notification after 4 seconds
    setTimeout(() => {
      setShowSuccessNotification(false);
    }, 4000);
  };

  const handleRegenerate = async () => {
    if (!currentTimetable) return;

    // Store current as previous for comparison
    setPreviousTimetable(currentTimetable);

    // Capture current parameters
    const params = currentTimetable.generationParams;

    // Show loading modal with "Regenerating" message
    setShowGenerationModal(true);
    setIsRegenerating(true);

    // Simulate regeneration progress
    await simulateGenerationProgress();

    // Generate NEW timetable with variations
    const newSchedule = generateRealisticTimetable(params);

    // Analyze regenerated timetable for conflicts and metrics
    const analysis = analyzeGeneratedTimetable(newSchedule, params);
    const metrics: PerformanceMetrics = analysis.metrics;

    // Create new timetable version
    const versionNumber = timetableHistory.length + 1;
    const regeneratedTimetable: TimetableVersion = {
      id: `v${versionNumber}-${Date.now()}`,
      timestamp: Date.now(),
      generationParams: params,
      performanceMetrics: metrics,
      fullSchedule: newSchedule,
      conflicts: analysis.conflicts,
      status: 'active',
      versionNumber
    };

    // Update history: mark all as archived
    const updatedHistory = timetableHistory.map(tt => ({
      ...tt,
      status: 'archived' as const
    }));

    // Add regenerated timetable to history
    setTimetableHistory([regeneratedTimetable, ...updatedHistory]);
    setCurrentTimetable(regeneratedTimetable);

    // Update generation status for display - use real conflict suggestions
    const topConflictSuggestions = analysis.conflicts
      .slice(0, 3)
      .map(c => c.suggestion || c.description);

    setGenerationStatus({
      status: analysis.conflicts.length === 0 ? 'success' : 'partial',
      conflicts: analysis.conflicts.length,
      coverage: metrics.coverage,
      suggestions: topConflictSuggestions
    });

    // Hide loading modal
    setShowGenerationModal(false);
    setIsRegenerating(false);

    // Navigate to View tab with success banner
    setTimeout(() => {
      setActiveTab('view');
      setShowSuccessBanner(true);

      // Hide success banner after 4 seconds
      setTimeout(() => {
        setShowSuccessBanner(false);
      }, 4000);
    }, 300);
  };

  // Simulate generation progress with realistic steps
  const simulateGenerationProgress = async (): Promise<void> => {
    const steps = [
      { percentage: 0, message: 'Analyzing constraints and requirements...', duration: 2000, estimatedTime: 8 },
      { percentage: 25, message: 'Allocating faculty to courses...', duration: 1500, estimatedTime: 6 },
      { percentage: 45, message: 'Optimizing room assignments...', duration: 1500, estimatedTime: 4 },
      { percentage: 65, message: 'Balancing workload distribution...', duration: 1500, estimatedTime: 2 },
      { percentage: 85, message: 'Finalizing and validating schedule...', duration: 1000, estimatedTime: 1 },
      { percentage: 100, message: 'Generation complete!', duration: 500, estimatedTime: 0 }
    ];

    for (const step of steps) {
      setGenerationProgress({
        percentage: step.percentage,
        message: step.message,
        estimatedTime: step.estimatedTime
      });
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
  };

  // Generate realistic timetable data
  // Helper: Generate time slots based on settings
  const generateTimeSlots = (startTime: string, endTime: string, lectureDuration: string): string[] => {
    const slots: string[] = [];
    const durationMinutes = parseInt(lectureDuration.split(' ')[0]);

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    let currentMinutes = startMinutes;

    while (currentMinutes + durationMinutes <= endMinutes) {
      const slotStartHour = Math.floor(currentMinutes / 60);
      const slotStartMin = currentMinutes % 60;
      const slotEndMinutes = currentMinutes + durationMinutes;
      const slotEndHour = Math.floor(slotEndMinutes / 60);
      const slotEndMin = slotEndMinutes % 60;

      const startStr = `${slotStartHour}:${slotStartMin.toString().padStart(2, '0')}`;
      const endStr = `${slotEndHour}:${slotEndMin.toString().padStart(2, '0')}`;

      slots.push(`${startStr}-${endStr}`);
      currentMinutes += durationMinutes;
    }

    return slots;
  };

  const generateRealisticTimetable = (params: GenerationParams): TimeSlot[] => {
    // Generate days based on working days setting
    const days = params.workingDays === 'Monday to Saturday'
      ? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

    // Generate time slots based on settings
    const times = generateTimeSlots(params.startTime, params.endTime, params.lectureDuration);

    const subjectsByDept: { [key: string]: string[] } = {
      'CSE': ['Data Structures', 'Database Management', 'Operating Systems', 'Web Technologies', 'Computer Networks', 'Software Engineering'],
      'EEE': ['Circuit Theory', 'Power Systems', 'Control Systems', 'Electrical Machines', 'Digital Electronics', 'Signal Processing'],
      'MECHANICAL': ['Thermodynamics', 'Fluid Mechanics', 'Machine Design', 'Manufacturing Process', 'Heat Transfer', 'Mechanics of Materials'],
      'CIVIL': ['Structural Analysis', 'Concrete Technology', 'Geotechnical Eng', 'Transportation Eng', 'Environmental Eng', 'Surveying'],
      'ECE': ['Digital Communications', 'Microprocessors', 'VLSI Design', 'Embedded Systems', 'Wireless Networks', 'Antenna Theory']
    };

    const facultyByDept: { [key: string]: string[] } = {
      'CSE': ['Dr. Priya Sharma', 'Dr. Rajesh Kumar', 'Prof. Anita Desai', 'Dr. Vikram Singh', 'Dr. Neha Gupta', 'Prof. Sanjay Patel'],
      'EEE': ['Dr. Ramesh Iyer', 'Prof. Kavita Rao', 'Dr. Arun Mehta', 'Prof. Sunita Joshi', 'Dr. Prakash Nair', 'Prof. Deepa Verma'],
      'MECHANICAL': ['Dr. Suresh Reddy', 'Prof. Lakshmi Devi', 'Dr. Arvind Kumar', 'Prof. Meena Shah', 'Dr. Ravi Shankar', 'Prof. Uma Prasad'],
      'CIVIL': ['Dr. Ganesh Babu', 'Prof. Radha Krishna', 'Dr. Mohan Das', 'Prof. Sita Ram', 'Dr. Vijay Anand', 'Prof. Lalita Sharma'],
      'ECE': ['Dr. Karthik Iyer', 'Prof. Divya Nair', 'Dr. Ashok Kumar', 'Prof. Preethi Menon', 'Dr. Sunil Reddy', 'Prof. Anjali Sinha']
    };

    const rooms = ['Room 301', 'Room 302', 'Room 303', 'Room 401', 'Room 402', 'Room 501'];
    const labs = ['Lab 1', 'Lab 2', 'Lab 3', 'Lab 4'];

    const subjects = subjectsByDept[params.department] || subjectsByDept['CSE'];
    const faculty = facultyByDept[params.department] || facultyByDept['CSE'];
    const timetable: TimeSlot[] = [];

    // Track faculty assignments to avoid consecutive lectures if constraint is enabled
    const facultyLastSlot: { [key: string]: { day: string, timeIndex: number } } = {};

    days.forEach((day, dayIndex) => {
      times.forEach((time, timeIndex) => {
        // Handle lunch break constraint (1-2 PM)
        if (params.constraints.lunchBreak && time.includes('1:') && time.includes('2:')) {
          timetable.push({
            day,
            time,
            subject: 'LUNCH BREAK',
            faculty: '-',
            room: '-',
            type: 'lecture',
            department: params.department,
            semester: params.semester
          });
          return;
        }

        // Determine if this is afternoon (after 2 PM) for lab scheduling
        const slotStartHour = parseInt(time.split(':')[0]);
        const isAfternoon = slotStartHour >= 14;

        // Apply noLabsAfter4 constraint
        let isLab = isAfternoon && Math.random() > 0.4;
        if (params.constraints.noLabsAfter4 && slotStartHour >= 16) {
          isLab = false;
        }

        const subjectIndex = (dayIndex + timeIndex) % subjects.length;
        let facultyIndex = subjectIndex % faculty.length;

        // Apply avoidConsecutive constraint
        if (params.constraints.avoidConsecutive) {
          const selectedFaculty = faculty[facultyIndex];
          const lastAssignment = facultyLastSlot[selectedFaculty];

          if (lastAssignment && lastAssignment.day === day && lastAssignment.timeIndex === timeIndex - 1) {
            // Try to find alternative faculty
            facultyIndex = (facultyIndex + 1) % faculty.length;
          }

          facultyLastSlot[faculty[facultyIndex]] = { day, timeIndex };
        }

        const roomIndex = (dayIndex * 2 + timeIndex) % (isLab ? labs.length : rooms.length);

        timetable.push({
          day,
          time,
          subject: isLab ? `${subjects[subjectIndex]} Lab` : subjects[subjectIndex],
          faculty: faculty[facultyIndex],
          room: isLab ? labs[roomIndex] : rooms[roomIndex],
          type: isLab ? 'lab' : (Math.random() > 0.8 ? 'tutorial' : 'lecture'),
          department: params.department,
          semester: params.semester
        });
      });
    });

    return timetable;
  };

  // Helper: Organize schedule by time and day for grid display
  const getScheduleGrid = () => {
    if (!currentTimetable) return null;

    // Extract unique days and times from the schedule
    const daySet = new Set<string>();
    const timeSet = new Set<string>();

    currentTimetable.fullSchedule.forEach(slot => {
      daySet.add(slot.day);
      timeSet.add(slot.time);
    });

    // Define day order
    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const days = Array.from(daySet).sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

    // Sort times chronologically
    const times = Array.from(timeSet).sort((a, b) => {
      const aStart = a.split('-')[0];
      const bStart = b.split('-')[0];
      const [aHour, aMin] = aStart.split(':').map(Number);
      const [bHour, bMin] = bStart.split(':').map(Number);
      return (aHour * 60 + aMin) - (bHour * 60 + bMin);
    });

    // Organize schedule into grid structure
    const grid: { [time: string]: { [day: string]: TimeSlot } } = {};

    currentTimetable.fullSchedule.forEach(slot => {
      if (!grid[slot.time]) {
        grid[slot.time] = {};
      }
      grid[slot.time][slot.day] = slot;
    });

    return { days, times, grid };
  };

  // Helper: Check if slot has changed from previous timetable
  const isSlotChanged = (currentSlot: TimeSlot): boolean => {
    if (!previousTimetable) return false;

    const prevSlot = previousTimetable.fullSchedule.find(
      slot => slot.day === currentSlot.day && slot.time === currentSlot.time
    );

    if (!prevSlot) return true;

    return (
      prevSlot.subject !== currentSlot.subject ||
      prevSlot.faculty !== currentSlot.faculty ||
      prevSlot.room !== currentSlot.room
    );
  };

  // Helper: Get year level from semester number
  const getSemesterYearLevel = (semester: string): string => {
    const semNum = parseInt(semester);
    if (semNum >= 1 && semNum <= 2) return '1st Year';
    if (semNum >= 3 && semNum <= 4) return '2nd Year';
    if (semNum >= 5 && semNum <= 6) return '3rd Year';
    if (semNum >= 7 && semNum <= 8) return '4th Year';
    return 'Unknown Year';
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'lecture': return '#3b82f6';
      case 'lab': return '#8b5cf6';
      case 'tutorial': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  // History tab actions
  const handleViewHistory = (version: TimetableVersion) => {
    setCurrentTimetable(version);
    setActiveTab('view');
  };

  const handleRestoreHistory = (version: TimetableVersion) => {
    if (window.confirm('Are you sure you want to restore this timetable version? This will make it the active version.')) {
      // Mark all as archived
      const updatedHistory = timetableHistory.map(tt => ({
        ...tt,
        status: 'archived' as const
      }));

      // Find and mark selected version as active
      const restoredHistory = updatedHistory.map(tt =>
        tt.id === version.id ? { ...tt, status: 'active' as const } : tt
      );

      setTimetableHistory(restoredHistory);
      setCurrentTimetable({ ...version, status: 'active' });
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${month} ${day}, ${year} at ${hours}:${minutes}`;
  };

  // Constraint management handlers
  const handleAddConstraint = () => {
    setEditingConstraint(null);
    setConstraintFormData({
      type: 'faculty',
      description: '',
      priority: 'medium'
    });
    setShowConstraintModal(true);
  };

  const handleEditConstraint = (constraint: Constraint) => {
    setEditingConstraint(constraint);
    setConstraintFormData({
      type: constraint.type,
      description: constraint.description,
      priority: constraint.priority
    });
    setShowConstraintModal(true);
  };

  const handleDeleteConstraint = (constraintId: string) => {
    if (window.confirm('Are you sure you want to delete this constraint?')) {
      setConstraints(constraints.filter(c => c.id !== constraintId));
    }
  };

  const handleSaveConstraint = () => {
    if (!constraintFormData.description.trim()) {
      alert('Please enter a constraint description');
      return;
    }

    if (editingConstraint) {
      // Edit existing
      setConstraints(constraints.map(c =>
        c.id === editingConstraint.id ? { ...constraintFormData, id: c.id } : c
      ));
    } else {
      // Add new
      const newConstraint: Constraint = {
        ...constraintFormData,
        id: `c${Date.now()}`
      };
      setConstraints([...constraints, newConstraint]);
    }
    setShowConstraintModal(false);
    setEditingConstraint(null);
    setConstraintFormData({ type: 'faculty', description: '', priority: 'medium' });
  };

  const handleCancelConstraintModal = () => {
    setShowConstraintModal(false);
    setEditingConstraint(null);
    setConstraintFormData({ type: 'faculty', description: '', priority: 'medium' });
  };

  // Settings handlers
  const handleSaveSettings = () => {
    localStorage.setItem('appSettings', JSON.stringify(appSettings));
    alert('Settings saved successfully!');
  };

  const handleCancelSettings = () => {
    // Reload settings from localStorage
    const saved = localStorage.getItem('appSettings');
    if (saved) {
      setAppSettings(JSON.parse(saved));
    }
  };

  // Download handlers for various tabs
  const handleDownloadViewTimetable = () => {
    if (!currentTimetable) {
      alert('No timetable to download. Please generate a timetable first.');
      return;
    }
    downloadTimetableCSV(currentTimetable);
  };

  const handleDownloadHistoryVersion = (version: TimetableVersion) => {
    downloadTimetableCSV(version);
  };

  const handleGenerateFacultyReport = () => {
    if (!currentTimetable) {
      alert('No timetable data available. Please generate a timetable first.');
      return;
    }
    downloadFacultyWorkloadCSV(currentTimetable);
  };

  const handleGenerateRoomReport = () => {
    if (!currentTimetable) {
      alert('No timetable data available. Please generate a timetable first.');
      return;
    }
    downloadRoomUtilizationCSV(currentTimetable);
  };

  const handleGenerateDepartmentReport = () => {
    if (!currentTimetable) {
      alert('No timetable data available. Please generate a timetable first.');
      return;
    }
    downloadDepartmentAnalyticsCSV(currentTimetable);
  };

  const handleGenerateAttendanceReport = () => {
    if (!currentTimetable) {
      alert('No timetable data available. Please generate a timetable first.');
      return;
    }
    // Placeholder - attendance data not available yet
    alert('Attendance pattern analysis requires student attendance data. This feature will be available once attendance tracking is implemented.');
  };

  // Generate optimization suggestions based on conflicts and metrics
  interface OptimizationSuggestion {
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    action: string;
  }

  const generateOptimizationSuggestions = (): OptimizationSuggestion[] => {
    if (!currentTimetable) return [];

    const suggestions: OptimizationSuggestion[] = [];

    // High priority: Faculty with high workload or conflicts
    const facultyConflicts = currentTimetable.conflicts.filter(c =>
      c.type === 'workload_imbalance' || c.type === 'back_to_back'
    );

    if (facultyConflicts.length > 0) {
      const conflict = facultyConflicts[0];
      suggestions.push({
        priority: 'high',
        title: conflict.description.split(':')[0] || 'Reduce Faculty Overload',
        description: conflict.description,
        action: conflict.suggestion || 'Redistribute faculty assignments'
      });
    }

    // Medium priority: Room utilization
    if (currentTimetable.performanceMetrics.roomUtilization < 70) {
      suggestions.push({
        priority: 'medium',
        title: 'Optimize Lab Utilization',
        description: `Current room utilization is ${currentTimetable.performanceMetrics.roomUtilization}%. Some rooms are underutilized.`,
        action: 'Schedule more sessions in underutilized rooms to improve efficiency'
      });
    }

    // Low priority: Balance workload
    if (currentTimetable.performanceMetrics.studentSatisfaction < 85) {
      suggestions.push({
        priority: 'low',
        title: 'Balance Morning/Afternoon Load',
        description: 'Student satisfaction could be improved by better distributing classes throughout the day',
        action: 'Redistribute classes to create more balanced schedules'
      });
    }

    return suggestions;
  };

  const handleApplySuggestion = (suggestion: OptimizationSuggestion) => {
    alert(`Applying suggestion: ${suggestion.title}\n\n${suggestion.action}\n\nThis feature would automatically optimize the timetable based on the suggestion.`);
    // In a real implementation, this would modify the timetable and regenerate
  };

  // Calculate strokeDasharray for circular progress
  const calculateStrokeDasharray = (percentage: number): number => {
    const circumference = 283; // 2 * π * radius (2 * 3.14159 * 45)
    return (percentage / 100) * circumference;
  };

  return (
    <div className="college-ai-timetable-container">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-calendar-alt"></i> AI Timetable Generator</h1>
          <p>Automatically generate conflict-free timetables for all departments</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Generate Timetable functionality')}>
            <i className="fas fa-brain"></i>
            Generate Timetable
          </button>
          <button className="btn-secondary">
            <i className="fas fa-download"></i>
            Export All Timetables
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#3b82f6' }}>
            <i className="fas fa-university"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">5</div>
            <div className="stat-label">Departments</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#10b981' }}>
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">168</div>
            <div className="stat-label">Faculty Members</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f59e0b' }}>
            <i className="fas fa-door-open"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">45</div>
            <div className="stat-label">Classrooms</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#8b5cf6' }}>
            <i className="fas fa-flask"></i>
          </div>
          <div className="stat-content">
            <div className="stat-value">12</div>
            <div className="stat-label">Labs</div>
          </div>
        </div>
      </div>

      {/* Tabs - New Implementation */}
      <div className="timetable-tabs-wrapper">
        <button
          className={`timetable-tab-button ${activeTab === 'generate' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('generate')}
        >
          <i className="fas fa-magic"></i>
          Generate
        </button>
        <button
          className={`timetable-tab-button ${activeTab === 'view' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          <i className="fas fa-table"></i>
          View Timetables
        </button>
        <button
          className={`timetable-tab-button ${activeTab === 'conflicts' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('conflicts')}
        >
          <i className="fas fa-exclamation-triangle"></i>
          Conflicts & Constraints
        </button>
        <button
          className={`timetable-tab-button ${activeTab === 'optimize' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('optimize')}
        >
          <i className="fas fa-chart-line"></i>
          Optimization
        </button>
        <button
          className={`timetable-tab-button ${activeTab === 'reports' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <i className="fas fa-chart-bar"></i>
          Reports & Analytics
        </button>
        <button
          className={`timetable-tab-button ${activeTab === 'history' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history"></i>
          History
        </button>
        <button
          className={`timetable-tab-button ${activeTab === 'settings' ? 'is-active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <i className="fas fa-cog"></i>
          Settings
        </button>
      </div>

      {/* Generate Tab */}
      {activeTab === 'generate' && (
        <div className="generate-section">
          <div className="generation-controls">
            <div className="control-group">
              <h3>Generation Settings</h3>
              <div className="settings-grid">
                <div className="setting-item">
                  <label>Academic Year</label>
                  <select value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
                    <option>2024-2025</option>
                    <option>2025-2026</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Semester</label>
                  <select value={selectedSemester} onChange={(e) => setSelectedSemester(e.target.value)}>
                    {semesters.map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
                <div className="setting-item">
                  <label>Department</label>
                  <select value={selectedDepartment} onChange={(e) => setSelectedDepartment(e.target.value)}>
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="setting-item">
                  <label>Working Days</label>
                  <select value={workingDays} onChange={(e) => setWorkingDays(e.target.value)}>
                    <option>Monday to Friday</option>
                    <option>Monday to Saturday</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="control-group">
              <h3>Time Preferences</h3>
              <div className="time-preferences">
                <div className="time-item">
                  <label>Start Time</label>
                  <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
                <div className="time-item">
                  <label>End Time</label>
                  <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <div className="time-item">
                  <label>Lecture Duration</label>
                  <select value={lectureDuration} onChange={(e) => setLectureDuration(e.target.value)}>
                    <option>50 minutes</option>
                    <option>60 minutes</option>
                    <option>90 minutes</option>
                  </select>
                </div>
                <div className="time-item">
                  <label>Break Duration</label>
                  <select value={breakDuration} onChange={(e) => setBreakDuration(e.target.value)}>
                    <option>10 minutes</option>
                    <option>15 minutes</option>
                    <option>20 minutes</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="control-group">
              <h3>Constraints & Rules</h3>
              <div className="constraints-checklist">
                <label className="checkbox-item">
                  <input type="checkbox" checked={avoidConsecutive} onChange={(e) => setAvoidConsecutive(e.target.checked)} />
                  <span>Avoid consecutive lectures by same faculty</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked={noLabsAfter4} onChange={(e) => setNoLabsAfter4(e.target.checked)} />
                  <span>No lab sessions after 4 PM</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked={balancedWorkload} onChange={(e) => setBalancedWorkload(e.target.checked)} />
                  <span>Balanced workload across days</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked={lunchBreak} onChange={(e) => setLunchBreak(e.target.checked)} />
                  <span>Faculty lunch break 1-2 PM</span>
                </label>
                <label className="checkbox-item">
                  <input type="checkbox" checked={facultyUnavailable} onChange={(e) => setFacultyUnavailable(e.target.checked)} />
                  <span>Allow faculty to specify unavailable slots</span>
                </label>
              </div>
            </div>

            <button className="generate-btn" onClick={handleGenerate}>
              <i className="fas fa-magic"></i>
              Generate AI Timetable
            </button>
          </div>

          {generationStatus && (
            <div className="generation-result">
              <div className="result-header">
                <h3>
                  <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                  Generation Complete
                </h3>
              </div>

              <div className="result-metrics">
                <div className="timetable-metric-item coverage-metric">
                  <div className="timetable-metric-icon coverage-icon">
                    <i className="fas fa-chart-pie"></i>
                  </div>
                  <div className="timetable-metric-content">
                    <div className="timetable-metric-label">Coverage</div>
                    <div className="timetable-metric-value">
                      {generationStatus.coverage}%
                    </div>
                  </div>
                </div>
                <div className="timetable-metric-item conflicts-metric">
                  <div className="timetable-metric-icon conflicts-icon">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="timetable-metric-content">
                    <div className="timetable-metric-label">Conflicts</div>
                    <div className="timetable-metric-value">
                      {generationStatus.conflicts}
                    </div>
                  </div>
                </div>
                <div className="timetable-metric-item status-metric">
                  <div className="timetable-metric-icon status-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <div className="timetable-metric-content">
                    <div className="timetable-metric-label">Status</div>
                    <div className="timetable-metric-value">
                      {generationStatus.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>

              <div className="ai-suggestions">
                <h4>
                  <i className="fas fa-lightbulb"></i>
                  AI Suggestions
                </h4>
                <ul>
                  {generationStatus.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div className="timetable-result-actions">
                <button className="timetable-action-btn timetable-btn-secondary preview" onClick={handlePreview}>
                  <i className="fas fa-eye"></i>
                  Preview
                </button>
                <button className="timetable-action-btn timetable-btn-primary approve" onClick={handleApprove}>
                  <i className="fas fa-check"></i>
                  Approve & Publish
                </button>
                <button
                  className="timetable-action-btn timetable-btn-warning regenerate"
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                >
                  <i className={`fas fa-redo ${isRegenerating ? 'spinning' : ''}`}></i>
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="confirmation-overlay">
              <div className="confirmation-dialog">
                <div className="dialog-header">
                  <h3><i className="fas fa-exclamation-circle"></i> Confirm Approval</h3>
                </div>
                <div className="dialog-content">
                  <p>Are you sure you want to approve and publish this timetable?</p>
                  <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '8px' }}>
                    This will make the timetable active and notify all faculty members and students.
                  </p>
                </div>
                <div className="dialog-actions">
                  <button
                    className="dialog-btn cancel"
                    onClick={() => setShowConfirmDialog(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="dialog-btn confirm"
                    onClick={handleConfirmApprove}
                  >
                    <i className="fas fa-check"></i>
                    Confirm & Publish
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Success Notification */}
          {showSuccessNotification && (
            <div className="success-notification">
              <i className="fas fa-check-circle"></i>
              <div className="notification-content">
                <h4>Timetable Published Successfully!</h4>
                <p>The timetable has been saved and is now active.</p>
              </div>
              <button
                className="notification-close"
                onClick={() => setShowSuccessNotification(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Generation Loading Modal */}
          {showGenerationModal && (
            <div className="generation-modal-overlay">
              <div className="generation-modal">
                <div className="modal-icon-container">
                  <i className="fas fa-brain modal-icon-rotating"></i>
                </div>
                <h3 className="modal-title">Generating AI Timetable</h3>
                <p className="modal-status-message">{generationProgress.message}</p>

                <div className="progress-bar-container">
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${generationProgress.percentage}%` }}
                    ></div>
                  </div>
                  <span className="progress-percentage">{generationProgress.percentage}%</span>
                </div>

                {generationProgress.estimatedTime > 0 && (
                  <p className="estimated-time">
                    <i className="fas fa-clock"></i>
                    Estimated time: ~{generationProgress.estimatedTime} seconds
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* View Timetables Tab */}
      {activeTab === 'view' && (
        <div className="view-section">
          <div className="view-controls">
            <button className="download-btn" onClick={handleDownloadViewTimetable}>
              <i className="fas fa-download"></i>
              Download CSV
            </button>
          </div>

          {/* Success Banner */}
          {showSuccessBanner && currentTimetable && (
            <div className="view-success-banner">
              <i className="fas fa-check-circle"></i>
              <div className="banner-content">
                <strong>Timetable Generated Successfully!</strong>
                <span>Viewing: {currentTimetable.generationParams.department} - Semester {currentTimetable.generationParams.semester}</span>
              </div>
              <button
                className="banner-close"
                onClick={() => setShowSuccessBanner(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          {/* Timetable Info Banner */}
          {currentTimetable && (
            <div className="timetable-info-banner">
              <div className="info-item">
                <div className="info-icon-container semester-info-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Semester</span>
                  <span className="info-value">
                    Semester {currentTimetable.generationParams.semester} ({getSemesterYearLevel(currentTimetable.generationParams.semester)})
                  </span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-container department-info-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Department</span>
                  <span className="info-value">{currentTimetable.generationParams.department}</span>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon-container year-info-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="info-content">
                  <span className="info-label">Academic Year</span>
                  <span className="info-value">{currentTimetable.generationParams.academicYear}</span>
                </div>
              </div>
            </div>
          )}

          <div className="timetable-view">
            <table className="timetable-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Monday</th>
                  <th>Tuesday</th>
                  <th>Wednesday</th>
                  <th>Thursday</th>
                  <th>Friday</th>
                </tr>
              </thead>
              <tbody>
                {currentTimetable ? (
                  (() => {
                    const scheduleData = getScheduleGrid();
                    if (!scheduleData) return null;
                    const { days, times, grid } = scheduleData;

                    return times.map((time) => {
                      // Handle lunch break specially
                      if (time === '12:00-1:00') {
                        return (
                          <tr key={time}>
                            <td className="time-cell">{time}</td>
                            <td className="slot-cell break" colSpan={5}>
                              <div className="break-label">LUNCH BREAK</div>
                            </td>
                          </tr>
                        );
                      }

                      return (
                        <tr key={time}>
                          <td className="time-cell">{time}</td>
                          {days.map((day) => {
                            const slot = grid[time]?.[day];
                            if (!slot) {
                              return (
                                <td key={day} className="slot-cell empty">
                                  <div className="slot-content">
                                    <div className="slot-subject">-</div>
                                  </div>
                                </td>
                              );
                            }

                            const changedClass = isSlotChanged(slot) ? 'changed-slot' : '';

                            return (
                              <td
                                key={day}
                                className={`slot-cell ${slot.type} ${changedClass}`}
                              >
                                <div className="slot-content">
                                  <div className="slot-subject">{slot.subject}</div>
                                  <div className="slot-faculty">{slot.faculty}</div>
                                  <div className="slot-room">{slot.room}</div>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    });
                  })()
                ) : (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>
                      <i className="fas fa-calendar-times" style={{ fontSize: '48px', marginBottom: '16px', display: 'block', opacity: 0.5 }}></i>
                      <p style={{ fontSize: '18px', margin: 0 }}>No timetable generated yet</p>
                      <p style={{ fontSize: '14px', marginTop: '8px' }}>Click "Generate AI Timetable" to create a new schedule</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="timetable-legend">
            <div className="legend-header">
              <i className="fas fa-info-circle"></i>
              <h4>Class Types Legend</h4>
            </div>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-color lecture">
                  <i className="fas fa-book"></i>
                </span>
                <span className="legend-text">Lecture</span>
              </div>
              <div className="legend-item">
                <span className="legend-color lab">
                  <i className="fas fa-flask"></i>
                </span>
                <span className="legend-text">Lab</span>
              </div>
              <div className="legend-item">
                <span className="legend-color tutorial">
                  <i className="fas fa-chalkboard-teacher"></i>
                </span>
                <span className="legend-text">Tutorial</span>
              </div>
              <div className="legend-item">
                <span className="legend-color break">
                  <i className="fas fa-coffee"></i>
                </span>
                <span className="legend-text">Break</span>
              </div>
            </div>
          </div>

          {/* Cross-Tab Navigation Buttons */}
          {currentTimetable && (
            <div className="tab-navigation-buttons">
              <button className="nav-btn" onClick={() => setActiveTab('conflicts')}>
                <i className="fas fa-exclamation-triangle"></i>
                View Conflicts & Constraints
                <i className="fas fa-arrow-right"></i>
              </button>
              <button className="nav-btn" onClick={() => setActiveTab('optimize')}>
                <i className="fas fa-chart-line"></i>
                See Optimization
                <i className="fas fa-arrow-right"></i>
              </button>
              <button className="nav-btn" onClick={() => setActiveTab('history')}>
                <i className="fas fa-history"></i>
                View History
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Conflicts Tab */}
      {activeTab === 'conflicts' && (
        <div className="conflicts-section">
          <div className="section-header">
            <h2>Active Constraints & Conflicts</h2>
            <button className="add-constraint-btn" onClick={handleAddConstraint}>
              <i className="fas fa-plus"></i>
              Add Constraint
            </button>
          </div>

          <div className="conflicts-summary">
            <div className="summary-card">
              <div className="summary-icon-container conflicts-summary-icon">
                <i className="fas fa-exclamation-circle"></i>
              </div>
              <div className="summary-content">
                <div className="summary-value">{currentTimetable?.conflicts.length || 0}</div>
                <div className="summary-label">Active Conflicts</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon-container constraints-summary-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="summary-content">
                <div className="summary-value">{constraints.length}</div>
                <div className="summary-label">Active Constraints</div>
              </div>
            </div>
            <div className="summary-card">
              <div className="summary-icon-container satisfaction-summary-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <div className="summary-content">
                <div className="summary-value">{currentTimetable?.performanceMetrics.constraintSatisfaction || 0}%</div>
                <div className="summary-label">Constraint Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Detected Conflicts Section */}
          {currentTimetable && currentTimetable.conflicts.length > 0 && (
            <div className="detected-conflicts-section">
              <h3 className="section-subtitle">
                <i className="fas fa-exclamation-triangle"></i>
                Detected Conflicts
              </h3>
              <div className="conflicts-list">
                {currentTimetable.conflicts.map((conflict, index) => (
                  <div key={index} className={`conflict-card severity-${conflict.severity}`}>
                    <div className="conflict-header">
                      <div className="conflict-type-badge">
                        {conflict.type.replace(/_/g, ' ').toUpperCase()}
                      </div>
                      <span className={`severity-badge severity-${conflict.severity}`}>
                        {conflict.severity}
                      </span>
                    </div>
                    <p className="conflict-description">{conflict.description}</p>
                    {conflict.suggestion && (
                      <div className="conflict-suggestion">
                        <i className="fas fa-lightbulb"></i>
                        <span>{conflict.suggestion}</span>
                      </div>
                    )}
                    {conflict.affectedSlots.length > 0 && (
                      <div className="affected-slots">
                        <strong>Affected slots:</strong> {conflict.affectedSlots.map(slot => `${slot.day} ${slot.time} (${slot.subject})`).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="constraints-list">
            {constraints.map((constraint) => (
              <div key={constraint.id} className="constraint-card">
                <div className="constraint-header">
                  <div className="constraint-type">
                    <i className={`fas fa-${constraint.type === 'faculty' ? 'user' : constraint.type === 'room' ? 'door-open' : constraint.type === 'break' ? 'coffee' : 'flask'}`}></i>
                    {constraint.type.toUpperCase()}
                  </div>
                  <span className="priority-badge" style={{ background: getPriorityColor(constraint.priority) }}>
                    {constraint.priority}
                  </span>
                </div>
                <p className="constraint-description">{constraint.description}</p>
                <div className="constraint-actions">
                  <button className="edit-btn" onClick={() => handleEditConstraint(constraint)}>
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteConstraint(constraint.id)}>
                    <i className="fas fa-trash"></i>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optimize Tab */}
      {activeTab === 'optimize' && (
        <div className="optimize-section">
          <div className="section-header">
            <h2>Timetable Optimization</h2>
            <p>AI-powered suggestions to improve timetable efficiency</p>
          </div>

          <div className="optimization-metrics">
            <div className="optimization-metric-card">
              <div className="optimization-metric-content">
                <h3>Faculty Utilization</h3>
                <p>Average faculty utilization across departments</p>
              </div>
              <div className="optimization-metric-chart">
                <div className="circular-progress">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    <circle
                      className={hasAnimatedOptimize ? 'progress-circle-animated faculty-circle' : ''}
                      cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8"
                      strokeDasharray={`${currentTimetable ? calculateStrokeDasharray(currentTimetable.performanceMetrics.facultyUtilization) : 220} 283`}
                      transform="rotate(-90 50 50)"/>
                  </svg>
                  <div className="progress-value">{currentTimetable ? currentTimetable.performanceMetrics.facultyUtilization : 78}%</div>
                </div>
              </div>
            </div>

            <div className="optimization-metric-card">
              <div className="optimization-metric-content">
                <h3>Room Utilization</h3>
                <p>Classroom and lab space utilization</p>
              </div>
              <div className="optimization-metric-chart">
                <div className="circular-progress">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    <circle
                      className={hasAnimatedOptimize ? 'progress-circle-animated room-circle' : ''}
                      cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8"
                      strokeDasharray={`${currentTimetable ? calculateStrokeDasharray(currentTimetable.performanceMetrics.roomUtilization) : 240} 283`}
                      transform="rotate(-90 50 50)"/>
                  </svg>
                  <div className="progress-value">{currentTimetable ? currentTimetable.performanceMetrics.roomUtilization : 85}%</div>
                </div>
              </div>
            </div>

            <div className="optimization-metric-card">
              <div className="optimization-metric-content">
                <h3>Student Satisfaction</h3>
                <p>Based on preference analysis and feedback</p>
              </div>
              <div className="optimization-metric-chart">
                <div className="circular-progress">
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8"/>
                    <circle
                      className={hasAnimatedOptimize ? 'progress-circle-animated satisfaction-circle' : ''}
                      cx="50" cy="50" r="45" fill="none" stroke="#8b5cf6" strokeWidth="8"
                      strokeDasharray={`${currentTimetable ? calculateStrokeDasharray(currentTimetable.performanceMetrics.studentSatisfaction) : 255} 283`}
                      transform="rotate(-90 50 50)"/>
                  </svg>
                  <div className="progress-value">{currentTimetable ? currentTimetable.performanceMetrics.studentSatisfaction : 90}%</div>
                </div>
              </div>
            </div>
          </div>

          <div className="optimization-suggestions">
            <div className="optimization-suggestions-header">
              <div className="optimization-header-icon">
                <i className="fas fa-lightbulb"></i>
              </div>
              <div className="optimization-header-content">
                <h3>Optimization Suggestions</h3>
                <p>AI-powered recommendations to improve your timetable</p>
              </div>
            </div>
            <div className="suggestions-list">
              {generateOptimizationSuggestions().map((suggestion, index) => (
                <div key={index} className={`suggestion-item ${suggestion.priority}`}>
                  <div className="suggestion-icon">
                    <i className={`fas fa-${suggestion.priority === 'high' ? 'exclamation-circle' : suggestion.priority === 'medium' ? 'info-circle' : 'check-circle'}`}></i>
                  </div>
                  <div className="suggestion-content">
                    <h4>{suggestion.priority.charAt(0).toUpperCase() + suggestion.priority.slice(1)} Priority: {suggestion.title}</h4>
                    <p>{suggestion.description}</p>
                    <button className="apply-suggestion-btn" onClick={() => handleApplySuggestion(suggestion)}>
                      Apply Suggestion
                    </button>
                  </div>
                </div>
              ))}
              {generateOptimizationSuggestions().length === 0 && (
                <div className="no-suggestions">
                  <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#10b981', marginBottom: '16px' }}></i>
                  <p>No optimization suggestions at this time. Your timetable is already well-optimized!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reports & Analytics Tab */}
      {activeTab === 'reports' && (
        <div className="reports-section">
          <div className="section-header">
            <h2>
              <i className="fas fa-chart-bar"></i>
              Reports & Analytics
            </h2>
            <p>Comprehensive timetable reports and usage analytics</p>
          </div>

          <div className="reports-grid">
            <div className="report-card">
              <div className="report-card-icon faculty-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Faculty Workload Report</h3>
              <p>Detailed analysis of teaching hours, free periods, and workload distribution across all faculty members.</p>
              <button className="report-btn" onClick={handleGenerateFacultyReport}>
                <i className="fas fa-download"></i>
                Generate Report
              </button>
            </div>

            <div className="report-card">
              <div className="report-card-icon room-icon">
                <i className="fas fa-door-open"></i>
              </div>
              <h3>Room Utilization Report</h3>
              <p>Classroom and lab usage statistics, peak hours, and space optimization opportunities.</p>
              <button className="report-btn" onClick={handleGenerateRoomReport}>
                <i className="fas fa-download"></i>
                Generate Report
              </button>
            </div>

            <div className="report-card">
              <div className="report-card-icon dept-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h3>Department Analytics</h3>
              <p>Department-wise timetable statistics, course distribution, and resource allocation.</p>
              <button className="report-btn" onClick={handleGenerateDepartmentReport}>
                <i className="fas fa-download"></i>
                Generate Report
              </button>
            </div>

            <div className="report-card">
              <div className="report-card-icon attendance-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3>Attendance Patterns</h3>
              <p>Student and faculty attendance trends, optimal scheduling windows, and engagement metrics.</p>
              <button className="report-btn" onClick={handleGenerateAttendanceReport}>
                <i className="fas fa-download"></i>
                Generate Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="history-section">
          <div className="section-header">
            <h2><i className="fas fa-history"></i> Timetable History</h2>
            <p>View and restore previous timetable versions</p>
          </div>

          <div className="history-timeline">
            {timetableHistory.length > 0 ? (
              timetableHistory.map((version) => (
                <div
                  key={version.id}
                  className={`history-timeline-item ${version.status}`}
                >
                  <div className="history-item-header">
                    <h3>
                      <i className="fas fa-calendar"></i>
                      Version {version.versionNumber} - {version.generationParams.department} Semester {version.generationParams.semester}
                    </h3>
                    <span className={`history-status-badge ${version.status}`}>
                      {version.status === 'active' ? 'Active' : 'Archived'}
                    </span>
                  </div>

                  <div className="history-item-details">
                    <p><strong>Generated on:</strong> {formatTimestamp(version.timestamp)}</p>
                    <p><strong>Parameters:</strong> {version.generationParams.department} Department, Semester {version.generationParams.semester}, {version.generationParams.workingDays}</p>
                    <p><strong>Performance:</strong> Conflicts: {version.performanceMetrics.conflicts}, Coverage: {version.performanceMetrics.coverage}%, Faculty Util: {version.performanceMetrics.facultyUtilization}%</p>
                  </div>

                  <div className="history-item-actions">
                    <button
                      className="history-btn view"
                      onClick={() => handleViewHistory(version)}
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                    {version.status === 'archived' && (
                      <button
                        className="history-btn restore"
                        onClick={() => handleRestoreHistory(version)}
                      >
                        <i className="fas fa-undo"></i> Restore
                      </button>
                    )}
                    <button className="history-btn download" onClick={() => handleDownloadHistoryVersion(version)}>
                      <i className="fas fa-download"></i> Download
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="history-empty-state">
                <i className="fas fa-history"></i>
                <h3>No Timetable History</h3>
                <p>Generate your first timetable to see it appear here</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="settings-section">
          <div className="section-header settings-header">
            <div className="settings-header-left">
              <h2><i className="fas fa-cog"></i> Timetable Settings</h2>
            </div>
            <div className="settings-header-right">
              <p>Configure default preferences and constraints</p>
            </div>
          </div>

          <div className="settings-cards-grid">
            <div className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon time-icon">
                  <i className="fas fa-clock"></i>
                </div>
                <h3>Working Hours</h3>
              </div>
              <div className="settings-card-body">
                <div className="settings-input-group">
                  <label>Start Time</label>
                  <input type="time" defaultValue="08:00" className="settings-input" />
                </div>

                <div className="settings-input-group">
                  <label>End Time</label>
                  <input type="time" defaultValue="17:00" className="settings-input" />
                </div>

                <div className="settings-input-group">
                  <label>Slot Duration (minutes)</label>
                  <input type="number" defaultValue="60" className="settings-input" />
                </div>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon calendar-icon">
                  <i className="fas fa-calendar-day"></i>
                </div>
                <h3>Working Days</h3>
              </div>
              <div className="settings-card-body">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} className="settings-checkbox-item">
                    <input type="checkbox" defaultChecked={day !== 'Sunday'} />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon constraint-icon">
                  <i className="fas fa-ban"></i>
                </div>
                <h3>Default Constraints</h3>
              </div>
              <div className="settings-card-body">
                <label className="settings-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>No back-to-back labs</span>
                </label>
                <label className="settings-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Lunch break required</span>
                </label>
                <label className="settings-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Maximum 6 classes per day</span>
                </label>
                <label className="settings-checkbox-item">
                  <input type="checkbox" />
                  <span>Avoid Friday afternoon classes</span>
                </label>
              </div>
            </div>

            <div className="settings-card">
              <div className="settings-card-header">
                <div className="settings-card-icon notification-icon">
                  <i className="fas fa-bell"></i>
                </div>
                <h3>Notifications</h3>
              </div>
              <div className="settings-card-body">
                <label className="settings-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Email on timetable generation</span>
                </label>
                <label className="settings-checkbox-item">
                  <input type="checkbox" defaultChecked />
                  <span>Alert on conflicts detected</span>
                </label>
                <label className="settings-checkbox-item">
                  <input type="checkbox" />
                  <span>Weekly usage reports</span>
                </label>
              </div>
            </div>
          </div>

          <div className="settings-actions">
            <button onClick={handleCancelSettings} className="btn-secondary">
              <i className="fas fa-times"></i>
              Cancel
            </button>
            <button onClick={handleSaveSettings} className="btn-primary">
              <i className="fas fa-save"></i>
              Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Constraint Add/Edit Modal */}
      {showConstraintModal && (
        <div className="modal-overlay" onClick={handleCancelConstraintModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingConstraint ? 'Edit Constraint' : 'Add New Constraint'}</h2>
              <button className="modal-close" onClick={handleCancelConstraintModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label>Constraint Type</label>
                <select
                  value={constraintFormData.type}
                  onChange={(e) => setConstraintFormData({...constraintFormData, type: e.target.value as any})}
                  className="form-select"
                >
                  <option value="faculty">Faculty</option>
                  <option value="room">Room</option>
                  <option value="break">Break</option>
                  <option value="lab">Lab</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={constraintFormData.description}
                  onChange={(e) => setConstraintFormData({...constraintFormData, description: e.target.value})}
                  className="form-textarea"
                  placeholder="Enter constraint description..."
                  rows={4}
                />
              </div>

              <div className="form-group">
                <label>Priority</label>
                <select
                  value={constraintFormData.priority}
                  onChange={(e) => setConstraintFormData({...constraintFormData, priority: e.target.value as any})}
                  className="form-select"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-secondary" onClick={handleCancelConstraintModal}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveConstraint}>
                <i className="fas fa-save"></i>
                {editingConstraint ? 'Update' : 'Add'} Constraint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollegeAITimetable;
