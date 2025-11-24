import { useState } from 'react';

interface Student {
  id: string;
  name: string;
  rollNumber: string;
  attendanceRate: number;
  totalClasses: number;
  attended: number;
  absent: number;
  late: number;
  trend: 'improving' | 'declining' | 'stable';
  riskLevel: 'low' | 'medium' | 'high';
}

interface ProxyAlert {
  id: string;
  studentName: string;
  rollNumber: string;
  date: string;
  time: string;
  reason: string;
  confidence: number;
}

interface AttendanceAnalyticsProps {
  onBack?: () => void;
}

const AttendanceAnalytics = ({ onBack }: AttendanceAnalyticsProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'semester'>('month');
  const [selectedView, setSelectedView] = useState<'overview' | 'students' | 'alerts' | 'interventions'>('overview');

  const [students] = useState<Student[]>([
    { id: '1', name: 'Aravind Kumar', rollNumber: 'CS301-001', attendanceRate: 95, totalClasses: 40, attended: 38, absent: 2, late: 1, trend: 'stable', riskLevel: 'low' },
    { id: '2', name: 'Priya Lakshmi', rollNumber: 'CS301-002', attendanceRate: 92, totalClasses: 40, attended: 37, absent: 3, late: 0, trend: 'stable', riskLevel: 'low' },
    { id: '3', name: 'Rajesh Kannan', rollNumber: 'CS301-003', attendanceRate: 88, totalClasses: 40, attended: 35, absent: 4, late: 2, trend: 'improving', riskLevel: 'low' },
    { id: '4', name: 'Karthik Raj', rollNumber: 'CS301-004', attendanceRate: 68, totalClasses: 40, attended: 27, absent: 11, late: 4, trend: 'declining', riskLevel: 'high' },
    { id: '5', name: 'Divya Bharathi', rollNumber: 'CS301-005', attendanceRate: 98, totalClasses: 40, attended: 39, absent: 1, late: 0, trend: 'stable', riskLevel: 'low' },
    { id: '6', name: 'Vishnu Prasad', rollNumber: 'CS301-006', attendanceRate: 72, totalClasses: 40, attended: 29, absent: 9, late: 3, trend: 'declining', riskLevel: 'medium' },
    { id: '7', name: 'Meenakshi Sundaram', rollNumber: 'CS301-007', attendanceRate: 85, totalClasses: 40, attended: 34, absent: 5, late: 2, trend: 'stable', riskLevel: 'low' },
    { id: '8', name: 'Lakshmi Devi', rollNumber: 'CS301-008', attendanceRate: 65, totalClasses: 40, attended: 26, absent: 12, late: 5, trend: 'declining', riskLevel: 'high' },
  ]);

  const [proxyAlerts] = useState<ProxyAlert[]>([
    { id: '1', studentName: 'Karthik Raj', rollNumber: 'CS301-004', date: '2025-11-18', time: '9:00 AM', reason: 'Different device ID detected', confidence: 85 },
    { id: '2', studentName: 'Vishnu Prasad', rollNumber: 'CS301-006', date: '2025-11-17', time: '11:00 AM', reason: 'Location mismatch', confidence: 72 },
  ]);

  const avgAttendance = Math.round(students.reduce((sum, s) => sum + s.attendanceRate, 0) / students.length);
  const atRiskStudents = students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'medium');
  const excellentAttendance = students.filter(s => s.attendanceRate >= 90).length;
  const poorAttendance = students.filter(s => s.attendanceRate < 75).length;

  const getRiskColor = (level: string) => {
    if (level === 'low') return '#10ac8b';
    if (level === 'medium') return '#f59e0b';
    return '#ef4444';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'improving') return 'fa-arrow-up';
    if (trend === 'declining') return 'fa-arrow-down';
    return 'fa-minus';
  };

  const getTrendColor = (trend: string) => {
    if (trend === 'improving') return '#10ac8b';
    if (trend === 'declining') return '#ef4444';
    return '#6c757d';
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' }}>
              {onBack && (
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
              )}
            </div>
            <h1>Attendance Analytics</h1>
            <p>Comprehensive insights, trends, and intervention recommendations</p>
          </div>
          <div className="streak-badge">
            <i className="fas fa-chart-bar"></i>
            <div>
              <strong>{avgAttendance}%</strong>
              <span>Class Average</span>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-info">
              <h4>Excellent Attendance</h4>
              <p className="stat-value">
                {excellentAttendance} <span className="stat-total">students</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(excellentAttendance / students.length) * 100}%`, backgroundColor: '#10ac8b' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <div className="stat-info">
              <h4>At-Risk Students</h4>
              <p className="stat-value">
                {atRiskStudents.length} <span className="stat-total">need attention</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(atRiskStudents.length / students.length) * 100}%`, backgroundColor: '#ef4444' }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div className="stat-info">
              <h4>Proxy Alerts</h4>
              <p className="stat-value">
                {proxyAlerts.length} <span className="stat-total">flagged</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${Math.min(100, (proxyAlerts.length / students.length) * 100)}%`, backgroundColor: '#f59e0b' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Period Selector */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'center' }}>
          {(['week', 'month', 'semester'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              style={{
                padding: '12px 24px',
                background: selectedPeriod === period
                  ? 'rgba(255, 255, 255, 0.35)'
                  : 'rgba(255, 255, 255, 0.15)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '10px',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'capitalize'
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* View Tabs */}
      <div style={{ marginBottom: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
        {[
          { id: 'overview', icon: 'fa-chart-pie', label: 'Overview' },
          { id: 'students', icon: 'fa-users', label: 'Student Details' },
          { id: 'alerts', icon: 'fa-bell', label: 'Proxy Alerts' },
          { id: 'interventions', icon: 'fa-hands-helping', label: 'Interventions' }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id as any)}
            style={{
              padding: '16px',
              background: selectedView === view.id
                ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                : '#ffffff',
              border: selectedView === view.id ? 'none' : '2px solid #e9ecef',
              borderRadius: '12px',
              color: selectedView === view.id ? '#ffffff' : '#6c757d',
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
            <i className={`fas ${view.icon}`} style={{ fontSize: '18px' }}></i>
            {view.label}
          </button>
        ))}
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <>
          {/* Attendance Distribution */}
          <div className="dashboard-card" style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                <i className="fas fa-chart-pie" style={{ marginRight: '8px', color: '#094d88' }}></i>
                Attendance Distribution
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#10ac8b 0deg 324deg, #e9ecef 324deg 360deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#10ac8b'
                  }}>
                    90%+
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>Excellent</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#10ac8b', marginBottom: '0' }}>{excellentAttendance}</p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#10ac8b 0deg 270deg, #e9ecef 270deg 360deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#10ac8b'
                  }}>
                    75-89%
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>Good</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#10ac8b', marginBottom: '0' }}>
                  {students.filter(s => s.attendanceRate >= 75 && s.attendanceRate < 90).length}
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#f59e0b 0deg 216deg, #e9ecef 216deg 360deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '16px',
                    fontWeight: '700',
                    color: '#f59e0b'
                  }}>
                    60-74%
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>Fair</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b', marginBottom: '0' }}>
                  {students.filter(s => s.attendanceRate >= 60 && s.attendanceRate < 75).length}
                </p>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 12px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#ef4444 0deg 180deg, #e9ecef 180deg 360deg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    fontWeight: '700',
                    color: '#ef4444'
                  }}>
                    &lt;60%
                  </div>
                </div>
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '4px' }}>Critical</p>
                <p style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444', marginBottom: '0' }}>
                  {students.filter(s => s.attendanceRate < 60).length}
                </p>
              </div>
            </div>
          </div>

          {/* Trend Analysis */}
          <div className="dashboard-card">
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
                <i className="fas fa-chart-line" style={{ marginRight: '8px', color: '#094d88' }}></i>
                Trend Analysis
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
              <div style={{ textAlign: 'center', padding: '24px', backgroundColor: 'rgba(16, 172, 139, 0.05)', borderRadius: '12px' }}>
                <i className="fas fa-arrow-up" style={{ fontSize: '32px', color: '#10ac8b', marginBottom: '12px' }}></i>
                <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#10ac8b', marginBottom: '8px' }}>
                  {students.filter(s => s.trend === 'improving').length}
                </h4>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>Improving</p>
              </div>

              <div style={{ textAlign: 'center', padding: '24px', backgroundColor: 'rgba(108, 117, 125, 0.05)', borderRadius: '12px' }}>
                <i className="fas fa-minus" style={{ fontSize: '32px', color: '#6c757d', marginBottom: '12px' }}></i>
                <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#6c757d', marginBottom: '8px' }}>
                  {students.filter(s => s.trend === 'stable').length}
                </h4>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>Stable</p>
              </div>

              <div style={{ textAlign: 'center', padding: '24px', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px' }}>
                <i className="fas fa-arrow-down" style={{ fontSize: '32px', color: '#ef4444', marginBottom: '12px' }}></i>
                <h4 style={{ fontSize: '24px', fontWeight: '700', color: '#ef4444', marginBottom: '8px' }}>
                  {students.filter(s => s.trend === 'declining').length}
                </h4>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>Declining</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Student Details View */}
      {selectedView === 'students' && (
        <div className="dashboard-card">
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
              <i className="fas fa-users" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Detailed Student Records
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {students.map((student) => (
              <div
                key={student.id}
                style={{
                  padding: '16px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${getRiskColor(student.riskLevel)}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getRiskColor(student.riskLevel)} 0%, ${getRiskColor(student.riskLevel)}cc 100%)`,
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: '700',
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
                      {student.rollNumber}
                    </p>
                  </div>

                  {/* Stats */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', paddingLeft: '20px', borderLeft: '2px solid #e9ecef' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: getRiskColor(student.riskLevel), marginBottom: '2px' }}>
                        {student.attendanceRate}%
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase' }}>
                        Rate
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#10ac8b', marginBottom: '2px' }}>
                        {student.attended}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase' }}>
                        Present
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#ef4444', marginBottom: '2px' }}>
                        {student.absent}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase' }}>
                        Absent
                      </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', fontWeight: '700', color: '#f59e0b', marginBottom: '2px' }}>
                        {student.late}
                      </div>
                      <div style={{ fontSize: '11px', color: '#6c757d', fontWeight: '600', textTransform: 'uppercase' }}>
                        Late
                      </div>
                    </div>
                  </div>

                  {/* Trend & Risk */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <div style={{
                      padding: '8px 16px',
                      backgroundColor: getTrendColor(student.trend) + '20',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: getTrendColor(student.trend),
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      <i className={`fas ${getTrendIcon(student.trend)}`}></i>
                      {student.trend}
                    </div>

                    <div style={{
                      padding: '8px 16px',
                      backgroundColor: getRiskColor(student.riskLevel) + '20',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: getRiskColor(student.riskLevel),
                      textTransform: 'capitalize'
                    }}>
                      {student.riskLevel} Risk
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Proxy Alerts View */}
      {selectedView === 'alerts' && (
        <div className="dashboard-card">
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
              <i className="fas fa-shield-alt" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
              Proxy Detection Alerts
            </h3>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
              AI-powered detection of potential proxy attendance
            </p>
          </div>

          {proxyAlerts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#10ac8b', marginBottom: '16px' }}></i>
              <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>
                No Proxy Alerts
              </h4>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
                All attendance records appear authentic
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {proxyAlerts.map((alert) => (
                <div
                  key={alert.id}
                  style={{
                    padding: '20px',
                    backgroundColor: 'rgba(245, 158, 11, 0.05)',
                    borderLeft: '4px solid #f59e0b',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      <i className="fas fa-exclamation-triangle"></i>
                    </div>

                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '6px' }}>
                        {alert.studentName} ({alert.rollNumber})
                      </h4>
                      <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '8px' }}>
                        {alert.reason}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: '#6c757d' }}>
                        <span>
                          <i className="fas fa-calendar" style={{ marginRight: '6px' }}></i>
                          {alert.date}
                        </span>
                        <span>
                          <i className="fas fa-clock" style={{ marginRight: '6px' }}></i>
                          {alert.time}
                        </span>
                        <span style={{ color: '#f59e0b', fontWeight: '600' }}>
                          <i className="fas fa-percentage" style={{ marginRight: '6px' }}></i>
                          {alert.confidence}% Confidence
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button style={{
                        padding: '10px 20px',
                        backgroundColor: '#10ac8b',
                        border: 'none',
                        borderRadius: '8px',
                        color: '#ffffff',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Verify
                      </button>
                      <button style={{
                        padding: '10px 20px',
                        backgroundColor: '#ffffff',
                        border: '2px solid #e9ecef',
                        borderRadius: '8px',
                        color: '#6c757d',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Interventions View */}
      {selectedView === 'interventions' && (
        <div className="dashboard-card">
          <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '2px solid #e9ecef' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#212529', marginBottom: '4px' }}>
              <i className="fas fa-hands-helping" style={{ marginRight: '8px', color: '#094d88' }}></i>
              Recommended Interventions
            </h3>
            <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
              AI-powered recommendations for improving student attendance
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {atRiskStudents.map((student) => (
              <div
                key={student.id}
                style={{
                  padding: '20px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '12px',
                  borderLeft: `4px solid ${getRiskColor(student.riskLevel)}`
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#212529', marginBottom: '6px' }}>
                    {student.name} ({student.rollNumber})
                  </h4>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: getRiskColor(student.riskLevel) + '20',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: getRiskColor(student.riskLevel),
                      textTransform: 'capitalize'
                    }}>
                      {student.riskLevel} Risk
                    </span>
                    <span style={{ fontSize: '14px', color: '#6c757d' }}>
                      Attendance: {student.attendanceRate}% ({student.attended}/{student.totalClasses} classes)
                    </span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <h5 style={{ fontSize: '14px', fontWeight: '600', color: '#212529', marginBottom: '12px' }}>
                    Recommended Actions:
                  </h5>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                      <i className="fas fa-envelope" style={{ color: '#094d88', fontSize: '16px' }}></i>
                      <span style={{ flex: 1, fontSize: '14px', color: '#212529' }}>
                        Send personalized attendance alert to student and parent
                      </span>
                      <button style={{
                        padding: '6px 16px',
                        backgroundColor: '#094d88',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Send
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                      <i className="fas fa-calendar-check" style={{ color: '#10ac8b', fontSize: '16px' }}></i>
                      <span style={{ flex: 1, fontSize: '14px', color: '#212529' }}>
                        Schedule one-on-one meeting to discuss attendance concerns
                      </span>
                      <button style={{
                        padding: '6px 16px',
                        backgroundColor: '#10ac8b',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Schedule
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', backgroundColor: '#ffffff', borderRadius: '8px' }}>
                      <i className="fas fa-file-alt" style={{ color: '#f59e0b', fontSize: '16px' }}></i>
                      <span style={{ flex: 1, fontSize: '14px', color: '#212529' }}>
                        Generate attendance improvement plan
                      </span>
                      <button style={{
                        padding: '6px 16px',
                        backgroundColor: '#f59e0b',
                        border: 'none',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer'
                      }}>
                        Generate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {atRiskStudents.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <i className="fas fa-check-circle" style={{ fontSize: '48px', color: '#10ac8b', marginBottom: '16px' }}></i>
                <h4 style={{ fontSize: '18px', fontWeight: '600', color: '#212529', marginBottom: '8px' }}>
                  No At-Risk Students
                </h4>
                <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0' }}>
                  All students are maintaining satisfactory attendance
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AttendanceAnalytics;
