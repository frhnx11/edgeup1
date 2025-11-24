import { useState } from 'react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  email: string;
  photo?: string;
  attendance?: 'present' | 'absent' | 'late' | 'leave';
}

interface ClassData {
  id: string;
  name: string;
  code: string;
  students: number;
  room: string;
}

interface AttendanceMarkerProps {
  classData: ClassData;
  onBack: () => void;
  onSave?: (attendance: Record<string, string>) => void;
}

const AttendanceMarker = ({ classData, onBack, onSave }: AttendanceMarkerProps) => {
  const [students, setStudents] = useState<Student[]>([
    { id: '1', name: 'Aravind Kumar', rollNumber: 'CS301-001', email: 'aravind.k@college.edu' },
    { id: '2', name: 'Priya Lakshmi', rollNumber: 'CS301-002', email: 'priya.l@college.edu' },
    { id: '3', name: 'Rajesh Kannan', rollNumber: 'CS301-003', email: 'rajesh.k@college.edu' },
    { id: '4', name: 'Karthik Raj', rollNumber: 'CS301-004', email: 'karthik.r@college.edu' },
    { id: '5', name: 'Divya Bharathi', rollNumber: 'CS301-005', email: 'divya.b@college.edu' },
    { id: '6', name: 'Vishnu Prasad', rollNumber: 'CS301-006', email: 'vishnu.p@college.edu' },
    { id: '7', name: 'Meenakshi Sundaram', rollNumber: 'CS301-007', email: 'meenakshi.s@college.edu' },
    { id: '8', name: 'Lakshmi Devi', rollNumber: 'CS301-008', email: 'lakshmi.d@college.edu' },
    { id: '9', name: 'Murugan Selvam', rollNumber: 'CS301-009', email: 'murugan.s@college.edu' },
    { id: '10', name: 'Ananya Krishnan', rollNumber: 'CS301-010', email: 'ananya.k@college.edu' },
    { id: '11', name: 'Suresh Babu', rollNumber: 'CS301-011', email: 'suresh.b@college.edu' },
    { id: '12', name: 'Deepa Nair', rollNumber: 'CS301-012', email: 'deepa.n@college.edu' },
    { id: '13', name: 'Ganesh Kumar', rollNumber: 'CS301-013', email: 'ganesh.k@college.edu' },
    { id: '14', name: 'Sangeetha Raman', rollNumber: 'CS301-014', email: 'sangeetha.r@college.edu' },
    { id: '15', name: 'Dinesh Babu', rollNumber: 'CS301-015', email: 'dinesh.b@college.edu' },
  ]);

  const [activeTab, setActiveTab] = useState<'roll-call' | 'qr-scan'>('roll-call');
  const [isSaving, setIsSaving] = useState(false);
  const [qrScanning, setQrScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAttendanceChange = (studentId: string, status: 'present' | 'absent' | 'late' | 'leave') => {
    setStudents(students.map(s =>
      s.id === studentId ? { ...s, attendance: status } : s
    ));
  };

  const handleMarkAllPresent = () => {
    setStudents(students.map(s => ({ ...s, attendance: 'present' })));
  };

  const handleSaveAttendance = () => {
    setIsSaving(true);

    const attendanceData: Record<string, string> = {};
    students.forEach(student => {
      if (student.attendance) {
        attendanceData[student.id] = student.attendance;
      }
    });

    setTimeout(() => {
      onSave?.(attendanceData);
      alert(`✅ Attendance saved successfully!\n\nPresent: ${presentCount}\nAbsent: ${absentCount}\nLate: ${lateCount}\nLeave: ${leaveCount}\n\nAlerts sent to absentees and parents.`);
      setIsSaving(false);
      onBack();
    }, 1000);
  };

  const handleStartQrScan = () => {
    setQrScanning(true);
    // Simulate QR scanning
    setTimeout(() => {
      setQrScanning(false);
    }, 5000);
  };

  // Calculate stats
  const presentCount = students.filter(s => s.attendance === 'present').length;
  const absentCount = students.filter(s => s.attendance === 'absent').length;
  const lateCount = students.filter(s => s.attendance === 'late').length;
  const leaveCount = students.filter(s => s.attendance === 'leave').length;
  const unmarkedCount = students.filter(s => !s.attendance).length;
  const totalMarked = presentCount + absentCount + lateCount + leaveCount;
  const progressPercentage = (totalMarked / students.length) * 100;

  // Filter students based on search
  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              <button
                onClick={onBack}
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
                }}
              >
                <i className="fas fa-arrow-left"></i>
                Back
              </button>
            </div>
            <h1>Mark Attendance</h1>
            <p>{classData.name} ({classData.code}) • {classData.room}</p>
          </div>
          <div className="streak-badge">
            <i className="fas fa-users"></i>
            <div>
              <strong>{students.length}</strong>
              <span>Students</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <div className="stat-info">
              <h4>Present</h4>
              <p className="stat-value">
                {presentCount} <span className="stat-total">/ {students.length}</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(presentCount / students.length) * 100}%`, backgroundColor: '#10ac8b' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-times"></i>
            </div>
            <div className="stat-info">
              <h4>Absent</h4>
              <p className="stat-value">
                {absentCount} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(absentCount / students.length) * 100}%`, backgroundColor: '#ef4444' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Late / Leave</h4>
              <p className="stat-value">
                {lateCount + leaveCount} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${((lateCount + leaveCount) / students.length) * 100}%`, backgroundColor: '#f59e0b' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '12px',
          padding: '16px',
          marginTop: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#ffffff' }}>Progress</span>
            <span style={{ fontSize: '14px', fontWeight: '700', color: '#ffffff' }}>
              {totalMarked} / {students.length} marked ({Math.round(progressPercentage)}%)
            </span>
          </div>
          <div style={{ height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.25)', borderRadius: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                backgroundColor: '#ffffff',
                borderRadius: '10px',
                transition: 'width 0.3s ease'
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mode Tabs */}
      <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => setActiveTab('roll-call')}
          style={{
            flex: 1,
            padding: '16px',
            background: activeTab === 'roll-call'
              ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
              : '#ffffff',
            border: activeTab === 'roll-call' ? 'none' : '2px solid #e9ecef',
            borderRadius: '12px',
            color: activeTab === 'roll-call' ? '#ffffff' : '#6c757d',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <i className="fas fa-list-check" style={{ fontSize: '18px' }}></i>
          Roll Call
        </button>

        <button
          onClick={() => setActiveTab('qr-scan')}
          style={{
            flex: 1,
            padding: '16px',
            background: activeTab === 'qr-scan'
              ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
              : '#ffffff',
            border: activeTab === 'qr-scan' ? 'none' : '2px solid #e9ecef',
            borderRadius: '12px',
            color: activeTab === 'qr-scan' ? '#ffffff' : '#6c757d',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          <i className="fas fa-qrcode" style={{ fontSize: '18px' }}></i>
          QR Scan
        </button>
      </div>

      {/* Content Area */}
      {activeTab === 'roll-call' && (
        <div className="dashboard-card">
          {/* Search and Actions */}
          <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <i className="fas fa-search" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d',
                fontSize: '14px'
              }}></i>
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '14px',
                  color: '#212529',
                  outline: 'none',
                  transition: 'border-color 0.3s ease'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e9ecef'}
              />
            </div>
            <button
              onClick={handleMarkAllPresent}
              style={{
                padding: '12px 20px',
                backgroundColor: '#10ac8b',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 172, 139, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-check-double"></i>
              Mark All Present
            </button>
          </div>

          {/* Student List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#094d88',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  {student.name.charAt(0)}
                </div>

                {/* Student Info */}
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>
                    {student.name}
                  </h4>
                  <p style={{ fontSize: '13px', color: '#6c757d', marginBottom: '0' }}>
                    {student.rollNumber} • {student.email}
                  </p>
                </div>

                {/* Attendance Buttons */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleAttendanceChange(student.id, 'present')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: student.attendance === 'present' ? '#10ac8b' : '#ffffff',
                      border: `2px solid ${student.attendance === 'present' ? '#10ac8b' : '#e9ecef'}`,
                      borderRadius: '8px',
                      color: student.attendance === 'present' ? '#ffffff' : '#6c757d',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-check"></i>
                    Present
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student.id, 'absent')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: student.attendance === 'absent' ? '#ef4444' : '#ffffff',
                      border: `2px solid ${student.attendance === 'absent' ? '#ef4444' : '#e9ecef'}`,
                      borderRadius: '8px',
                      color: student.attendance === 'absent' ? '#ffffff' : '#6c757d',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-times"></i>
                    Absent
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student.id, 'late')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: student.attendance === 'late' ? '#f59e0b' : '#ffffff',
                      border: `2px solid ${student.attendance === 'late' ? '#f59e0b' : '#e9ecef'}`,
                      borderRadius: '8px',
                      color: student.attendance === 'late' ? '#ffffff' : '#6c757d',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-clock"></i>
                    Late
                  </button>

                  <button
                    onClick={() => handleAttendanceChange(student.id, 'leave')}
                    style={{
                      padding: '10px 16px',
                      backgroundColor: student.attendance === 'leave' ? '#6366f1' : '#ffffff',
                      border: `2px solid ${student.attendance === 'leave' ? '#6366f1' : '#e9ecef'}`,
                      borderRadius: '8px',
                      color: student.attendance === 'leave' ? '#ffffff' : '#6c757d',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <i className="fas fa-door-open"></i>
                    Leave
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              onClick={onBack}
              style={{
                padding: '14px 24px',
                backgroundColor: '#ffffff',
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                color: '#6c757d',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveAttendance}
              disabled={isSaving || unmarkedCount === students.length}
              style={{
                padding: '14px 32px',
                background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: isSaving || unmarkedCount === students.length ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease',
                opacity: isSaving || unmarkedCount === students.length ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}
            >
              {isSaving ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i>
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'qr-scan' && (
        <div className="dashboard-card">
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            {/* QR Code Display */}
            <div style={{
              width: '300px',
              height: '300px',
              margin: '0 auto 24px',
              backgroundColor: '#ffffff',
              border: '4px solid #094d88',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '120px',
              color: '#094d88'
            }}>
              <i className="fas fa-qrcode"></i>
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#212529', marginBottom: '8px' }}>
              Scan QR Code to Mark Attendance
            </h3>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '24px' }}>
              Students can scan this QR code with their mobile devices to mark their attendance
            </p>

            {/* Session Info */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 24px',
              backgroundColor: '#f8f9fa',
              borderRadius: '10px',
              marginBottom: '32px'
            }}>
              <i className="fas fa-key" style={{ color: '#094d88', fontSize: '16px' }}></i>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '12px', color: '#6c757d', marginBottom: '2px' }}>Session Code</div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#094d88' }}>CS301-{new Date().getTime().toString().slice(-6)}</div>
              </div>
            </div>

            {/* Scan Status */}
            {qrScanning && (
              <div style={{
                padding: '20px',
                backgroundColor: 'rgba(16, 172, 139, 0.1)',
                borderRadius: '12px',
                marginBottom: '24px'
              }}>
                <i className="fas fa-check-circle" style={{ color: '#10ac8b', fontSize: '32px', marginBottom: '12px' }}></i>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#10ac8b' }}>
                  Scanning active - Students can now mark attendance
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '32px' }}>
              <button
                onClick={handleStartQrScan}
                disabled={qrScanning}
                style={{
                  padding: '14px 32px',
                  background: qrScanning ? '#6c757d' : 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: qrScanning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
              >
                <i className={qrScanning ? 'fas fa-spinner fa-spin' : 'fas fa-play'}></i>
                {qrScanning ? 'Scanning Active' : 'Start Scanning'}
              </button>

              <button
                onClick={() => setQrScanning(false)}
                disabled={!qrScanning}
                style={{
                  padding: '14px 32px',
                  backgroundColor: '#ffffff',
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  color: '#6c757d',
                  fontSize: '15px',
                  fontWeight: '600',
                  cursor: !qrScanning ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: !qrScanning ? 0.5 : 1
                }}
              >
                Stop Scanning
              </button>
            </div>

            {/* Instructions */}
            <div style={{
              marginTop: '40px',
              padding: '24px',
              backgroundColor: '#f8f9fa',
              borderRadius: '12px',
              textAlign: 'left'
            }}>
              <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#212529', marginBottom: '16px' }}>
                <i className="fas fa-info-circle" style={{ marginRight: '8px', color: '#094d88' }}></i>
                How it works
              </h4>
              <ul style={{ margin: 0, paddingLeft: '24px', color: '#6c757d', fontSize: '14px', lineHeight: '1.8' }}>
                <li>Click "Start Scanning" to activate the QR code</li>
                <li>Students scan the QR code using their mobile devices</li>
                <li>Attendance is automatically marked in real-time</li>
                <li>Students will receive a confirmation notification</li>
                <li>Absentees and parents will be automatically notified</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceMarker;
