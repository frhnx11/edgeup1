import { useState, useEffect } from 'react';

interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
}

interface AttendanceRecord {
  date: string;
  dayOfWeek: string;
  status: 'present' | 'absent' | 'half-day' | 'holiday';
  checkInTime?: string;
  checkOutTime?: string;
  duration?: string;
  reason?: string;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  markedBy?: string;
  remarks?: string;
}

interface AttendanceStats {
  totalDays: number;
  daysPresent: number;
  daysAbsent: number;
  halfDays: number;
  holidays: number;
  percentage: number;
  classAverage: number;
  rank: number;
  totalStudents: number;
}

interface SubjectAttendance {
  subject: string;
  classesHeld: number;
  classesAttended: number;
  percentage: number;
  status: 'excellent' | 'good' | 'fair' | 'poor';
}

interface AIAttendanceInsight {
  type: 'pattern' | 'prediction' | 'recommendation' | 'alert';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  icon: string;
  color: string;
}

const AttendanceTracker = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isDownloading, setIsDownloading] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const students: Student[] = [
    { id: '1', name: 'Aarav Sharma', class: '10', section: 'A', rollNumber: '15' },
    { id: '2', name: 'Diya Sharma', class: '7', section: 'B', rollNumber: '22' }
  ];

  // Seeded random function for consistent data generation
  const seededRandom = (seed: number) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  // Generate mock attendance data for selected month (consistent based on date)
  const generateAttendanceData = (studentId: string, month: number, year: number): AttendanceRecord[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const records: AttendanceRecord[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
      const dateString = date.toISOString().split('T')[0];

      // Weekend logic
      if (dayOfWeek === 'Saturday' || dayOfWeek === 'Sunday') {
        records.push({
          date: dateString,
          dayOfWeek,
          status: 'holiday',
          remarks: 'Weekend'
        });
        continue;
      }

      // Future dates
      if (date > new Date()) {
        continue;
      }

      // Seeded random attendance pattern (consistent per date + student)
      const seed = parseInt(studentId) * 1000 + year * 100 + month * 10 + day;
      const random = seededRandom(seed);
      let status: 'present' | 'absent' | 'half-day' | 'holiday';

      if (random < 0.92) {
        status = 'present';
      } else if (random < 0.96) {
        status = 'half-day';
      } else {
        status = 'absent';
      }

      // Determine reason for absence using seeded random
      const reasonRandom = seededRandom(seed + 1);
      const reasons = ['Sick Leave', 'Family Emergency', 'Medical Appointment', 'Personal Leave'];
      const selectedReason = reasons[Math.floor(reasonRandom * reasons.length)];

      const record: AttendanceRecord = {
        date: dateString,
        dayOfWeek,
        status,
        checkInTime: status === 'present' || status === 'half-day' ? '08:15 AM' : undefined,
        checkOutTime: status === 'present' ? '03:30 PM' : status === 'half-day' ? '12:00 PM' : undefined,
        duration: status === 'present' ? '7h 15m' : status === 'half-day' ? '3h 45m' : undefined,
        markedBy: 'Class Teacher',
        reason: status === 'absent' ? selectedReason : undefined,
        approvalStatus: status === 'absent' ? 'approved' : undefined
      };

      records.push(record);
    }

    return records;
  };

  const currentAttendance = generateAttendanceData(selectedStudent, selectedMonth, selectedYear);
  const currentStudent = students.find(s => s.id === selectedStudent) || students[0];

  // Calculate stats
  const calculateStats = (): AttendanceStats => {
    const totalDays = currentAttendance.filter(r => r.status !== 'holiday').length;
    const daysPresent = currentAttendance.filter(r => r.status === 'present').length;
    const daysAbsent = currentAttendance.filter(r => r.status === 'absent').length;
    const halfDays = currentAttendance.filter(r => r.status === 'half-day').length;
    const holidays = currentAttendance.filter(r => r.status === 'holiday').length;
    const percentage = totalDays > 0 ? ((daysPresent + halfDays * 0.5) / totalDays) * 100 : 0;

    // Calculate dynamic class average (slightly higher than student's percentage)
    const seed = parseInt(selectedStudent) * 1000 + selectedYear * 100 + selectedMonth;
    const avgOffset = seededRandom(seed) * 4 + 1; // 1-5% higher
    const classAverage = Math.min(100, Math.round((percentage + avgOffset) * 10) / 10);

    // Calculate rank based on how student compares to class average
    const totalStudents = 35;
    const percentile = (percentage / classAverage) * 100;
    const rank = Math.max(1, Math.min(totalStudents, Math.round((100 - percentile) / 100 * totalStudents)));

    return {
      totalDays,
      daysPresent,
      daysAbsent,
      halfDays,
      holidays,
      percentage: Math.round(percentage * 10) / 10,
      classAverage,
      rank,
      totalStudents
    };
  };

  const stats = calculateStats();

  // Subject-wise attendance (dynamically calculated from overall attendance)
  const calculateSubjectAttendance = (): SubjectAttendance[] => {
    const subjects = [
      { name: 'Mathematics', classesPerWeek: 6 },
      { name: 'English', classesPerWeek: 5 },
      { name: 'Science', classesPerWeek: 6 },
      { name: 'Social Studies', classesPerWeek: 5 },
      { name: 'Hindi', classesPerWeek: 4 },
      { name: 'Computer Science', classesPerWeek: 4 }
    ];

    return subjects.map((subject, index) => {
      // Calculate classes held based on school days this month
      const schoolDays = stats.totalDays;
      const weeksInMonth = schoolDays / 5; // Approximate weeks
      const classesHeld = Math.round(subject.classesPerWeek * weeksInMonth);

      // Calculate attendance with small variations from overall percentage
      const seed = parseInt(selectedStudent) * 100 + index + selectedYear + selectedMonth;
      const variation = (seededRandom(seed) - 0.5) * 6; // ±3% variation
      const subjectPercentage = Math.min(100, Math.max(85, stats.percentage + variation));
      const classesAttended = Math.round((subjectPercentage / 100) * classesHeld);
      const actualPercentage = classesHeld > 0 ? (classesAttended / classesHeld) * 100 : 100;

      // Determine status
      let status: 'excellent' | 'good' | 'fair' | 'poor';
      if (actualPercentage >= 95) status = 'excellent';
      else if (actualPercentage >= 90) status = 'good';
      else if (actualPercentage >= 85) status = 'fair';
      else status = 'poor';

      return {
        subject: subject.name,
        classesHeld,
        classesAttended,
        percentage: Math.round(actualPercentage * 10) / 10,
        status
      };
    });
  };

  const subjectAttendance = calculateSubjectAttendance();

  // AI Insights (dynamically generated from actual data)
  const generateAIInsights = (): AIAttendanceInsight[] => {
    const insights: AIAttendanceInsight[] = [];

    // Pattern Analysis
    if (stats.percentage >= 95) {
      insights.push({
        type: 'pattern',
        title: 'Excellent Attendance Pattern',
        description: `Outstanding attendance maintained at ${stats.percentage}%. You're in the top performers of your class. Keep up the excellent work!`,
        severity: 'info',
        icon: 'fa-chart-line',
        color: '#10ac8b'
      });
    } else if (stats.percentage >= 90) {
      insights.push({
        type: 'pattern',
        title: 'Good Attendance Pattern',
        description: `Solid attendance at ${stats.percentage}%. You're meeting the school's attendance requirements consistently.`,
        severity: 'info',
        icon: 'fa-chart-line',
        color: '#3b82f6'
      });
    } else {
      insights.push({
        type: 'pattern',
        title: 'Attendance Needs Improvement',
        description: `Current attendance at ${stats.percentage}% is below the recommended 90% threshold. Focus on reducing absences.`,
        severity: 'warning',
        icon: 'fa-chart-line',
        color: '#f59e0b'
      });
    }

    // Class Comparison Alert
    const diff = stats.classAverage - stats.percentage;
    if (diff > 2) {
      const daysNeeded = Math.ceil((stats.classAverage - stats.percentage) / 100 * stats.totalDays);
      insights.push({
        type: 'alert',
        title: 'Below Class Average',
        description: `Your attendance is ${diff.toFixed(1)}% below class average (${stats.classAverage}%). Attend ${daysNeeded} more consecutive days to match the class average.`,
        severity: 'warning',
        icon: 'fa-exclamation-triangle',
        color: '#f59e0b'
      });
    } else if (diff < -1) {
      insights.push({
        type: 'alert',
        title: 'Above Class Average',
        description: `Excellent! Your attendance is ${Math.abs(diff).toFixed(1)}% above the class average (${stats.classAverage}%). You're ranked #${stats.rank} in your section.`,
        severity: 'info',
        icon: 'fa-trophy',
        color: '#10ac8b'
      });
    }

    // Prediction
    const projectedYearEnd = stats.percentage; // Current rate projection
    const remainingDaysInYear = 220 - stats.totalDays; // Assuming 220 school days per year
    insights.push({
      type: 'prediction',
      title: 'Year-End Projection',
      description: `At your current rate of ${stats.percentage}%, projected year-end attendance will be ${projectedYearEnd.toFixed(1)}%, ${projectedYearEnd >= 90 ? 'comfortably above' : 'below'} the 90% requirement.`,
      severity: projectedYearEnd >= 90 ? 'info' : 'warning',
      icon: 'fa-crystal-ball',
      color: '#8b5cf6'
    });

    // Recommendation
    const targetPercentage = 95;
    if (stats.percentage < targetPercentage) {
      const daysToImprove = Math.ceil(((targetPercentage - stats.percentage) / 100) * stats.totalDays);
      insights.push({
        type: 'recommendation',
        title: 'Reach Excellence Target',
        description: `To reach ${targetPercentage}% attendance, focus on ${daysToImprove} more consecutive present days. Schedule appointments during holidays when possible.`,
        severity: 'info',
        icon: 'fa-lightbulb',
        color: '#3b82f6'
      });
    } else {
      const allowedAbsences = Math.floor(((stats.percentage - 90) / 100) * stats.totalDays);
      insights.push({
        type: 'recommendation',
        title: 'Maintain Excellence',
        description: `You have ${allowedAbsences} days buffer before dropping below 90% attendance. Continue your excellent attendance pattern!`,
        severity: 'info',
        icon: 'fa-lightbulb',
        color: '#3b82f6'
      });
    }

    return insights;
  };

  const aiInsights = generateAIInsights();

  // Calendar helpers
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getFirstDayOfMonth = () => {
    return new Date(selectedYear, selectedMonth, 1).getDay();
  };

  const getDaysInMonth = () => {
    return new Date(selectedYear, selectedMonth + 1, 0).getDate();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(selectedYear - 1);
      } else {
        setSelectedMonth(selectedMonth - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(selectedYear + 1);
      } else {
        setSelectedMonth(selectedMonth + 1);
      }
    }
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
  };

  const getAttendanceForDate = (date: string): AttendanceRecord | undefined => {
    return currentAttendance.find(r => r.date === date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present': return '#10ac8b';
      case 'absent': return '#ef4444';
      case 'half-day': return '#f59e0b';
      case 'holiday': return '#3b82f6';
      default: return '#e5e7eb';
    }
  };

  const handleDateClick = (date: string, record?: AttendanceRecord) => {
    if (record) {
      setSelectedDate(date);
      setShowDetailModal(true);
    }
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDownloadReport = () => {
    setIsDownloading(true);

    try {
      // Generate CSV content
      const reportDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      const monthYear = `${monthNames[selectedMonth]} ${selectedYear}`;

      let csvContent = `Attendance Report\n`;
      csvContent += `Student: ${currentStudent.name}\n`;
      csvContent += `Class: ${currentStudent.class}${currentStudent.section} (Roll No: ${currentStudent.rollNumber})\n`;
      csvContent += `Report Period: ${monthYear}\n`;
      csvContent += `Generated: ${reportDate}\n\n`;

      // Overall Statistics
      csvContent += `Overall Statistics\n`;
      csvContent += `Attendance Percentage,${stats.percentage}%\n`;
      csvContent += `Total School Days,${stats.totalDays}\n`;
      csvContent += `Days Present,${stats.daysPresent}\n`;
      csvContent += `Days Absent,${stats.daysAbsent}\n`;
      csvContent += `Half Days,${stats.halfDays}\n`;
      csvContent += `Holidays,${stats.holidays}\n`;
      csvContent += `Class Average,${stats.classAverage}%\n`;
      csvContent += `Section Rank,${stats.rank} of ${stats.totalStudents}\n\n`;

      // Subject-wise Attendance
      csvContent += `Subject-Wise Attendance\n`;
      csvContent += `Subject,Classes Held,Classes Attended,Percentage,Status\n`;
      subjectAttendance.forEach(subject => {
        csvContent += `${subject.subject},${subject.classesHeld},${subject.classesAttended},${subject.percentage}%,${subject.status}\n`;
      });
      csvContent += `\n`;

      // Daily Attendance Records
      csvContent += `Daily Attendance Records\n`;
      csvContent += `Date,Day,Status,Check-in,Check-out,Duration,Reason,Remarks\n`;
      currentAttendance.forEach(record => {
        const formattedDate = new Date(record.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        csvContent += `${formattedDate},${record.dayOfWeek},${record.status},`;
        csvContent += `${record.checkInTime || '-'},${record.checkOutTime || '-'},${record.duration || '-'},`;
        csvContent += `${record.reason || '-'},${record.remarks || '-'}\n`;
      });
      csvContent += `\n`;

      // AI Insights
      csvContent += `AI-Powered Insights\n`;
      aiInsights.forEach(insight => {
        csvContent += `${insight.type.toUpperCase()}: ${insight.title}\n`;
        csvContent += `${insight.description}\n\n`;
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `Attendance_Report_${currentStudent.name.replace(/\s+/g, '_')}_${monthYear.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsDownloading(false);
      showToast('Attendance report downloaded successfully!', 'success');
    } catch (error) {
      setIsDownloading(false);
      showToast('Failed to download report. Please try again.', 'error');
      console.error('Download error:', error);
    }
  };

  const renderCalendar = () => {
    const firstDay = getFirstDayOfMonth();
    const daysInMonth = getDaysInMonth();
    const calendarDays: JSX.Element[] = [];

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const dateString = date.toISOString().split('T')[0];
      const record = getAttendanceForDate(dateString);
      const isToday = dateString === new Date().toISOString().split('T')[0];
      const isFuture = date > new Date();

      calendarDays.push(
        <div
          key={dateString}
          className={`calendar-day ${record?.status || ''} ${isToday ? 'today' : ''} ${isFuture ? 'future' : ''} ${record ? 'clickable' : ''}`}
          onClick={() => !isFuture && handleDateClick(dateString, record)}
          style={{ borderColor: record ? getStatusColor(record.status) : undefined }}
        >
          <div className="day-number">{day}</div>
          {record && !isFuture && (
            <div className="day-status">
              {record.status === 'present' && <i className="fas fa-check-circle"></i>}
              {record.status === 'absent' && <i className="fas fa-times-circle"></i>}
              {record.status === 'half-day' && <i className="fas fa-clock"></i>}
              {record.status === 'holiday' && <i className="fas fa-umbrella-beach"></i>}
            </div>
          )}
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="attendance-tracker-page">
      {/* Header Section */}
      <div className="attendance-header">
        <div className="header-top">
          <div className="student-selector-attendance">
            <i className="fas fa-user-graduate"></i>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - Class {student.class}{student.section}
                </option>
              ))}
            </select>
          </div>

          <div className="header-actions-attendance">
            <button className="download-report-btn" onClick={handleDownloadReport} disabled={isDownloading}>
              <i className={`fas fa-${isDownloading ? 'spinner fa-spin' : 'download'}`}></i>
              {isDownloading ? 'Downloading...' : 'Download Report'}
            </button>
            <button className="print-btn" onClick={() => window.print()}>
              <i className="fas fa-print"></i>
              Print
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="attendance-quick-stats">
          <div className="attendance-stat-card overall">
            <div className="stat-circle" style={{ background: `conic-gradient(#10ac8b ${stats.percentage * 3.6}deg, #e5e7eb 0deg)` }}>
              <div className="stat-circle-inner">
                <span className="stat-percentage">{stats.percentage}%</span>
              </div>
            </div>
            <div className="stat-label">Overall Attendance</div>
          </div>

          <div className="attendance-stat-card present">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-value">{stats.daysPresent}</div>
            <div className="stat-label">Days Present</div>
          </div>

          <div className="attendance-stat-card absent">
            <div className="stat-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="stat-value">{stats.daysAbsent}</div>
            <div className="stat-label">Days Absent</div>
          </div>

          <div className="attendance-stat-card halfday">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-value">{stats.halfDays}</div>
            <div className="stat-label">Half Days</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="attendance-content-grid">
        {/* Main Column - Calendar */}
        <div className="attendance-main-column">
          {/* Calendar Section */}
          <div className="calendar-section">
            <div className="calendar-header">
              <div className="calendar-navigation">
                <button className="nav-btn" onClick={() => navigateMonth('prev')}>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <h2 className="calendar-title">
                  {monthNames[selectedMonth]} {selectedYear}
                </h2>
                <button className="nav-btn" onClick={() => navigateMonth('next')}>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
              <button className="today-btn" onClick={goToToday}>
                <i className="fas fa-calendar-day"></i>
                Today
              </button>
            </div>

            {/* Days of week header */}
            <div className="calendar-grid">
              {daysOfWeek.map(day => (
                <div key={day} className="calendar-day-header">
                  {day}
                </div>
              ))}

              {/* Calendar days */}
              {renderCalendar()}
            </div>

            {/* Legend */}
            <div className="calendar-legend">
              <div className="legend-item">
                <span className="legend-color present"></span>
                <span>Present</span>
              </div>
              <div className="legend-item">
                <span className="legend-color absent"></span>
                <span>Absent</span>
              </div>
              <div className="legend-item">
                <span className="legend-color half-day"></span>
                <span>Half Day</span>
              </div>
              <div className="legend-item">
                <span className="legend-color holiday"></span>
                <span>Holiday</span>
              </div>
            </div>
          </div>

          {/* Subject-wise Attendance */}
          <div className="subject-attendance-section">
            <h2>
              <i className="fas fa-book"></i>
              Subject-Wise Attendance
            </h2>
            <div className="subject-attendance-grid">
              {subjectAttendance.map((subject, index) => (
                <div key={index} className={`subject-attendance-card ${subject.status}`}>
                  <div className="subject-header">
                    <h4>{subject.subject}</h4>
                    <span className="subject-percentage">{subject.percentage}%</span>
                  </div>
                  <div className="subject-details">
                    <span>{subject.classesAttended}/{subject.classesHeld} classes attended</span>
                  </div>
                  <div className="subject-progress-bar">
                    <div
                      className="subject-progress-fill"
                      style={{ width: `${subject.percentage}%`, background: subject.percentage >= 95 ? '#10ac8b' : subject.percentage >= 90 ? '#f59e0b' : '#ef4444' }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="attendance-sidebar">
          {/* AI Insights Panel */}
          <div className="ai-attendance-insights">
            <h3>
              <i className="fas fa-brain"></i>
              Smart Attendance Insights
            </h3>
            <div className="insights-list-attendance">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`insight-item-attendance ${insight.severity}`}>
                  <div className="insight-icon" style={{ color: insight.color }}>
                    <i className={`fas ${insight.icon}`}></i>
                  </div>
                  <div className="insight-content">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison Panel */}
          <div className="comparison-panel">
            <h3>
              <i className="fas fa-users"></i>
              Class Comparison
            </h3>
            <div className="comparison-content">
              <div className="comparison-row">
                <span className="comparison-label">Your Attendance:</span>
                <span className="comparison-value student">{stats.percentage}%</span>
              </div>
              <div className="comparison-row">
                <span className="comparison-label">Class Average:</span>
                <span className="comparison-value average">{stats.classAverage}%</span>
              </div>
              <div className="comparison-row">
                <span className="comparison-label">Section Rank:</span>
                <span className="comparison-value rank">#{stats.rank} of {stats.totalStudents}</span>
              </div>
              <div className="comparison-bar">
                <div className="bar-fill student" style={{ width: `${(stats.percentage / 100) * 100}%` }}></div>
                <div className="bar-fill average" style={{ width: `${(stats.classAverage / 100) * 100}%`, opacity: 0.5 }}></div>
              </div>
            </div>
          </div>

          {/* Attendance Goal */}
          <div className="goal-panel">
            <h3>
              <i className="fas fa-bullseye"></i>
              Attendance Goal
            </h3>
            <div className="goal-content">
              <div className="goal-target">
                <span>Target: 98%</span>
                <span className="goal-status">2.5% to go</span>
              </div>
              <div className="goal-progress">
                <div className="goal-progress-fill" style={{ width: `${(stats.percentage / 98) * 100}%` }}></div>
              </div>
              <p className="goal-message">Attend 3 more days without absence to reach your goal!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedDate && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-calendar-alt"></i>
                Attendance Details
              </h2>
              <button className="modal-close-btn" onClick={() => setShowDetailModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              {(() => {
                const record = getAttendanceForDate(selectedDate);
                if (!record) return null;

                return (
                  <div className="attendance-detail">
                    <div className="detail-row">
                      <span className="detail-label">Date:</span>
                      <span className="detail-value">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Status:</span>
                      <span className={`detail-value status-badge ${record.status}`}>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </span>
                    </div>
                    {record.checkInTime && (
                      <div className="detail-row">
                        <span className="detail-label">Check-in Time:</span>
                        <span className="detail-value">{record.checkInTime}</span>
                      </div>
                    )}
                    {record.checkOutTime && (
                      <div className="detail-row">
                        <span className="detail-label">Check-out Time:</span>
                        <span className="detail-value">{record.checkOutTime}</span>
                      </div>
                    )}
                    {record.duration && (
                      <div className="detail-row">
                        <span className="detail-label">Duration:</span>
                        <span className="detail-value">{record.duration}</span>
                      </div>
                    )}
                    {record.reason && (
                      <div className="detail-row">
                        <span className="detail-label">Reason:</span>
                        <span className="detail-value">{record.reason}</span>
                      </div>
                    )}
                    {record.markedBy && (
                      <div className="detail-row">
                        <span className="detail-label">Marked By:</span>
                        <span className="detail-value">{record.markedBy}</span>
                      </div>
                    )}
                    {record.approvalStatus && (
                      <div className="detail-row">
                        <span className="detail-label">Approval Status:</span>
                        <span className={`detail-value status-badge ${record.approvalStatus}`}>
                          {record.approvalStatus.charAt(0).toUpperCase() + record.approvalStatus.slice(1)}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification ${toast.type}`}>
          <div className="toast-icon">
            {toast.type === 'success' && <i className="fas fa-check-circle"></i>}
            {toast.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
            {toast.type === 'info' && <i className="fas fa-info-circle"></i>}
          </div>
          <span className="toast-message">{toast.message}</span>
          <button className="toast-close" onClick={() => setToast(null)}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
    </div>
  );
};

export default AttendanceTracker;
