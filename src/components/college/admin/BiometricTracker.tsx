import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// TypeScript Interfaces
interface BiometricDevice {
  id: string;
  name: string;
  location: string;
  type: 'fingerprint' | 'face-recognition' | 'temperature' | 'rfid';
  status: 'online' | 'offline' | 'maintenance';
  lastScan: string;
  scansToday: number;
  batteryLevel?: number;
  signalStrength?: number;
  aiEnabled: boolean;
}

interface BiometricScan {
  id: string;
  userId: string;
  userName: string;
  userType: 'student' | 'staff' | 'visitor' | 'parent';
  userPhoto?: string;
  deviceId: string;
  deviceLocation: string;
  scanType: 'entry' | 'exit' | 'access';
  timestamp: string;
  temperature?: number;
  status: 'success' | 'failed' | 'suspicious';
  aiFlags?: string[];
}

interface AIAnomaly {
  id: string;
  type: 'unusual-access' | 'duplicate-scan' | 'location-mismatch' | 'spoofing' | 'health-risk' | 'behavioral-deviation';
  severity: 'high' | 'medium' | 'low';
  userId: string;
  userName: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  aiConfidence: number;
  details: string;
}

interface HealthAlert {
  id: string;
  userId: string;
  userName: string;
  userType: 'student' | 'staff';
  temperature: number;
  location: string;
  timestamp: string;
  notified: boolean;
  followUp: 'cleared' | 'quarantined' | 'pending';
  parentContact?: string;
}

interface PredictionData {
  date: string;
  predictedAttendance: number;
  confidence: number;
}

const BiometricTracker: React.FC = () => {
  // State Management
  const [activeSection, setActiveSection] = useState<'dashboard' | 'devices' | 'health' | 'access' | 'analytics' | 'reports'>('dashboard');
  const [selectedDevice, setSelectedDevice] = useState<BiometricDevice | null>(null);
  const [selectedAnomaly, setSelectedAnomaly] = useState<AIAnomaly | null>(null);
  const [activityFilter, setActivityFilter] = useState<'all' | 'success' | 'failed' | 'suspicious'>('all');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'fingerprint' | 'face-recognition' | 'temperature' | 'rfid'>('all');

  // Animated Counter States
  const [totalDevices, setTotalDevices] = useState(0);
  const [todaysScans, setTodaysScans] = useState(0);
  const [systemHealth, setSystemHealth] = useState(0);
  const [aiAlerts, setAiAlerts] = useState(0);

  // Auto-refresh state
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Mock Data - Biometric Devices
  const devices: BiometricDevice[] = [
    // Fingerprint Readers
    { id: 'FP001', name: 'Main Gate Reader 1', location: 'Main Entrance', type: 'fingerprint', status: 'online', lastScan: '2025-11-03T12:30:00', scansToday: 234, batteryLevel: 95, signalStrength: 100, aiEnabled: true },
    { id: 'FP002', name: 'Main Gate Reader 2', location: 'Main Entrance', type: 'fingerprint', status: 'online', lastScan: '2025-11-03T12:28:00', scansToday: 228, batteryLevel: 92, signalStrength: 98, aiEnabled: true },
    { id: 'FP003', name: 'Staff Room Reader', location: 'Staff Room', type: 'fingerprint', status: 'online', lastScan: '2025-11-03T11:45:00', scansToday: 87, batteryLevel: 88, signalStrength: 95, aiEnabled: true },
    { id: 'FP004', name: 'Admin Block Reader', location: 'Admin Office', type: 'fingerprint', status: 'online', lastScan: '2025-11-03T12:15:00', scansToday: 45, batteryLevel: 100, signalStrength: 100, aiEnabled: true },
    { id: 'FP005', name: 'Library Reader', location: 'Library Entrance', type: 'fingerprint', status: 'maintenance', lastScan: '2025-11-03T10:00:00', scansToday: 34, batteryLevel: 65, signalStrength: 80, aiEnabled: true },
    { id: 'FP006', name: 'Lab Block Reader', location: 'Science Lab', type: 'fingerprint', status: 'online', lastScan: '2025-11-03T12:20:00', scansToday: 56, batteryLevel: 90, signalStrength: 92, aiEnabled: true },

    // Face Recognition Cameras
    { id: 'FR001', name: 'Main Gate Camera 1', location: 'Main Entrance', type: 'face-recognition', status: 'online', lastScan: '2025-11-03T12:31:00', scansToday: 198, aiEnabled: true },
    { id: 'FR002', name: 'Main Gate Camera 2', location: 'Main Entrance', type: 'face-recognition', status: 'online', lastScan: '2025-11-03T12:29:00', scansToday: 189, aiEnabled: true },
    { id: 'FR003', name: 'Cafeteria Camera', location: 'Cafeteria', type: 'face-recognition', status: 'online', lastScan: '2025-11-03T12:25:00', scansToday: 145, aiEnabled: true },
    { id: 'FR004', name: 'Playground Camera', location: 'Playground', type: 'face-recognition', status: 'offline', lastScan: '2025-11-03T09:00:00', scansToday: 23, aiEnabled: true },
    { id: 'FR005', name: 'Parking Camera', location: 'Parking Lot', type: 'face-recognition', status: 'online', lastScan: '2025-11-03T12:10:00', scansToday: 67, aiEnabled: true },

    // Temperature Scanners
    { id: 'TS001', name: 'Gate Temperature Scanner 1', location: 'Main Entrance', type: 'temperature', status: 'online', lastScan: '2025-11-03T12:30:00', scansToday: 256, aiEnabled: true },
    { id: 'TS002', name: 'Gate Temperature Scanner 2', location: 'Main Entrance', type: 'temperature', status: 'online', lastScan: '2025-11-03T12:29:00', scansToday: 248, aiEnabled: true },
    { id: 'TS003', name: 'Cafeteria Scanner', location: 'Cafeteria', type: 'temperature', status: 'online', lastScan: '2025-11-03T12:22:00', scansToday: 134, aiEnabled: true },
    { id: 'TS004', name: 'Medical Room Scanner', location: 'Medical Room', type: 'temperature', status: 'online', lastScan: '2025-11-03T11:30:00', scansToday: 12, aiEnabled: true },

    // RFID Readers
    { id: 'RF001', name: 'Library RFID', location: 'Library', type: 'rfid', status: 'online', lastScan: '2025-11-03T12:28:00', scansToday: 189, aiEnabled: false },
    { id: 'RF002', name: 'Lab RFID', location: 'Science Lab', type: 'rfid', status: 'online', lastScan: '2025-11-03T12:15:00', scansToday: 78, aiEnabled: false },
    { id: 'RF003', name: 'Canteen RFID', location: 'Canteen', type: 'rfid', status: 'online', lastScan: '2025-11-03T12:30:00', scansToday: 234, aiEnabled: false },
    { id: 'RF004', name: 'Transport RFID 1', location: 'Bus Stand', type: 'rfid', status: 'online', lastScan: '2025-11-03T08:30:00', scansToday: 156, aiEnabled: false }
  ];

  // Mock Data - Recent Scans
  const generateRecentScans = (): BiometricScan[] => {
    const names = ['Aarav Sharma', 'Priya Patel', 'Rohan Kumar', 'Ananya Singh', 'Vihaan Gupta', 'Diya Mehta', 'Arjun Reddy', 'Ishita Verma', 'Kartik Joshi', 'Navya Kapoor'];
    const scans: BiometricScan[] = [];

    for (let i = 0; i < 30; i++) {
      const minutes = Math.floor(Math.random() * 60);
      const timestamp = new Date(Date.now() - minutes * 60000).toISOString();
      const temp = 36 + Math.random() * 2;
      const hasTemp = Math.random() > 0.4;

      scans.push({
        id: `SCAN${1000 + i}`,
        userId: `U${100 + i}`,
        userName: names[Math.floor(Math.random() * names.length)],
        userType: Math.random() > 0.8 ? 'staff' : 'student',
        deviceId: devices[Math.floor(Math.random() * devices.length)].id,
        deviceLocation: devices[Math.floor(Math.random() * devices.length)].location,
        scanType: Math.random() > 0.5 ? 'entry' : 'exit',
        timestamp: timestamp,
        temperature: hasTemp ? parseFloat(temp.toFixed(1)) : undefined,
        status: temp > 37.5 ? 'suspicious' : (Math.random() > 0.95 ? 'failed' : 'success'),
        aiFlags: temp > 37.5 ? ['High Temperature'] : []
      });
    }

    return scans.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const [recentScans, setRecentScans] = useState<BiometricScan[]>(generateRecentScans());

  // Mock Data - AI Anomalies
  const anomalies: AIAnomaly[] = [
    {
      id: 'AN001',
      type: 'health-risk',
      severity: 'high',
      userId: 'U101',
      userName: 'Aarav Sharma',
      description: 'Elevated temperature detected (38.2°C) at Main Entrance',
      timestamp: '2025-11-03T12:15:00',
      resolved: false,
      aiConfidence: 95,
      details: 'Student scanned at main gate with temperature 38.2°C. This is the third consecutive day with elevated readings. Recommend immediate medical screening.'
    },
    {
      id: 'AN002',
      type: 'duplicate-scan',
      severity: 'medium',
      userId: 'U205',
      userName: 'Rohan Kumar',
      description: 'Multiple entry scans detected within 5 minutes',
      timestamp: '2025-11-03T11:45:00',
      resolved: false,
      aiConfidence: 88,
      details: 'Same user scanned entry at Main Gate (11:45 AM) and Staff Room (11:47 AM). Unusual pattern detected.'
    },
    {
      id: 'AN003',
      type: 'unusual-access',
      severity: 'high',
      userId: 'U312',
      userName: 'Priya Patel',
      description: 'After-hours access to Admin Block',
      timestamp: '2025-11-02T22:30:00',
      resolved: false,
      aiConfidence: 92,
      details: 'Staff member accessed Admin Office at 10:30 PM on November 2nd. Outside normal working hours (6 AM - 8 PM).'
    },
    {
      id: 'AN004',
      type: 'spoofing',
      severity: 'high',
      userId: 'U156',
      userName: 'Vihaan Gupta',
      description: 'Possible fingerprint spoofing attempt',
      timestamp: '2025-11-03T10:20:00',
      resolved: true,
      aiConfidence: 85,
      details: 'Biometric pattern analysis indicates possible fake fingerprint usage. Multiple failed attempts followed by suspicious success.'
    },
    {
      id: 'AN005',
      type: 'location-mismatch',
      severity: 'medium',
      userId: 'U289',
      userName: 'Ananya Singh',
      description: 'Simultaneous presence detected at two locations',
      timestamp: '2025-11-03T09:00:00',
      resolved: false,
      aiConfidence: 78,
      details: 'Student scanned at Library (9:00 AM) and Cafeteria (9:02 AM) simultaneously. Physical impossibility detected.'
    },
    {
      id: 'AN006',
      type: 'behavioral-deviation',
      severity: 'low',
      userId: 'U178',
      userName: 'Kartik Joshi',
      description: 'Unusual attendance pattern - Late entry for 5 consecutive days',
      timestamp: '2025-11-03T09:45:00',
      resolved: false,
      aiConfidence: 72,
      details: 'Student consistently arriving 30-45 minutes late for past week. Deviation from normal punctuality pattern.'
    }
  ];

  // Mock Data - Health Alerts
  const healthAlerts: HealthAlert[] = [
    {
      id: 'HA001',
      userId: 'U101',
      userName: 'Aarav Sharma',
      userType: 'student',
      temperature: 38.2,
      location: 'Main Entrance',
      timestamp: '2025-11-03T12:15:00',
      notified: true,
      followUp: 'pending',
      parentContact: '+91-9876543210'
    },
    {
      id: 'HA002',
      userId: 'U134',
      userName: 'Diya Mehta',
      userType: 'student',
      temperature: 37.8,
      location: 'Main Entrance',
      timestamp: '2025-11-03T11:30:00',
      notified: true,
      followUp: 'cleared',
      parentContact: '+91-9876543211'
    },
    {
      id: 'HA003',
      userId: 'S045',
      userName: 'Mr. Rajesh Kumar',
      userType: 'staff',
      temperature: 38.0,
      location: 'Staff Room',
      timestamp: '2025-11-03T10:45:00',
      notified: true,
      followUp: 'quarantined'
    }
  ];

  // Mock Data - Predictions
  const predictions: PredictionData[] = [
    { date: '2025-11-04', predictedAttendance: 94, confidence: 89 },
    { date: '2025-11-05', predictedAttendance: 96, confidence: 91 },
    { date: '2025-11-06', predictedAttendance: 95, confidence: 88 },
    { date: '2025-11-07', predictedAttendance: 92, confidence: 85 },
    { date: '2025-11-08', predictedAttendance: 97, confidence: 92 },
    { date: '2025-11-09', predictedAttendance: 78, confidence: 76 }, // Weekend
    { date: '2025-11-10', predictedAttendance: 76, confidence: 74 }  // Weekend
  ];

  // Animated Counter Effect
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const targetDevices = devices.filter(d => d.status === 'online').length;
    const targetScans = devices.reduce((sum, d) => sum + d.scansToday, 0);
    const targetHealth = Math.round((devices.filter(d => d.status === 'online').length / devices.length) * 100);
    const targetAlerts = anomalies.filter(a => !a.resolved).length;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setTotalDevices(Math.floor(targetDevices * progress));
      setTodaysScans(Math.floor(targetScans * progress));
      setSystemHealth(Math.floor(targetHealth * progress));
      setAiAlerts(Math.floor(targetAlerts * progress));

      if (currentStep >= steps) {
        clearInterval(timer);
        setTotalDevices(targetDevices);
        setTodaysScans(targetScans);
        setSystemHealth(targetHealth);
        setAiAlerts(targetAlerts);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh Activity Feed
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      // Simulate new scan data
      setRecentScans(prev => {
        const newScans = generateRecentScans();
        return newScans.slice(0, 30);
      });
      setLastRefresh(new Date());
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(refreshInterval);
  }, []);

  // Helper Functions
  const getRelativeTime = (timestamp: string): string => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'Yesterday';
    return `${diffDays} days ago`;
  };

  const getDeviceIcon = (type: string): string => {
    const icons: { [key: string]: string } = {
      'fingerprint': 'fa-fingerprint',
      'face-recognition': 'fa-user-circle',
      'temperature': 'fa-thermometer-half',
      'rfid': 'fa-id-card'
    };
    return icons[type] || 'fa-microchip';
  };

  const getStatusColor = (status: string): string => {
    const colors: { [key: string]: string } = {
      'online': 'status-online',
      'offline': 'status-offline',
      'maintenance': 'status-maintenance'
    };
    return colors[status] || '';
  };

  const getSeverityClass = (severity: string): string => {
    const classes: { [key: string]: string } = {
      'high': 'severity-high',
      'medium': 'severity-medium',
      'low': 'severity-low'
    };
    return classes[severity] || '';
  };

  const filterActivity = (): BiometricScan[] => {
    if (activityFilter === 'all') return recentScans;
    return recentScans.filter(scan => scan.status === activityFilter);
  };

  const filterDevices = (): BiometricDevice[] => {
    if (deviceFilter === 'all') return devices;
    return devices.filter(device => device.type === deviceFilter);
  };

  const downloadReport = (reportType: string) => {
    // Simulate report generation
    alert(`Generating ${reportType} report... Download will start shortly.`);
  };

  return (
    <div className="biometric-tracker-container">
      {/* Page Header */}
      <h2><i className="fas fa-fingerprint"></i> Biometric Tracker</h2>
      <p>Real-time biometric monitoring with AI-powered anomaly detection</p>

      {/* Stats Overview */}
      <div className="biometric-stats-overview">
        <div className="bio-stat-card">
          <div className="bio-stat-header">
            <div className="bio-stat-icon">
              <i className="fas fa-microchip"></i>
            </div>
            <span className="bio-stat-trend up">+12%</span>
          </div>
          <div className="bio-stat-content">
            <h4>Active Devices</h4>
            <div className="bio-stat-value">{totalDevices}</div>
          </div>
        </div>

        <div className="bio-stat-card">
          <div className="bio-stat-header">
            <div className="bio-stat-icon">
              <i className="fas fa-hand-pointer"></i>
            </div>
            <span className="bio-stat-trend up">+8%</span>
          </div>
          <div className="bio-stat-content">
            <h4>Today's Scans</h4>
            <div className="bio-stat-value">{todaysScans.toLocaleString()}</div>
          </div>
        </div>

        <div className="bio-stat-card">
          <div className="bio-stat-header">
            <div className="bio-stat-icon">
              <i className="fas fa-heartbeat"></i>
            </div>
            <span className="bio-stat-trend up">{systemHealth}%</span>
          </div>
          <div className="bio-stat-content">
            <h4>System Health</h4>
            <div className="bio-stat-value">{devices.length} Devices</div>
          </div>
        </div>

        <div className="bio-stat-card">
          <div className="bio-stat-header">
            <div className="bio-stat-icon">
              <i className="fas fa-exclamation-triangle"></i>
            </div>
            <span className="bio-stat-trend down">!</span>
          </div>
          <div className="bio-stat-content">
            <h4>AI Alerts</h4>
            <div className="bio-stat-value">{aiAlerts}</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="biometric-main-grid">
          {/* Real-time Activity Feed */}
          <div className="activity-feed-card">
            <div className="card-header-bio">
              <div className="card-title-bio">
                <i className="fas fa-stream"></i>
                <h3>Live Activity Feed</h3>
              </div>
              <div className="live-indicator">
                <div className="live-dot"></div>
                <span>LIVE</span>
              </div>
            </div>

            {/* Activity Filters */}
            <div className="feed-filters">
              <button
                className={`filter-chip ${activityFilter === 'all' ? 'active' : ''}`}
                onClick={() => setActivityFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-chip ${activityFilter === 'success' ? 'active' : ''}`}
                onClick={() => setActivityFilter('success')}
              >
                Success
              </button>
              <button
                className={`filter-chip ${activityFilter === 'failed' ? 'active' : ''}`}
                onClick={() => setActivityFilter('failed')}
              >
                Failed
              </button>
              <button
                className={`filter-chip ${activityFilter === 'suspicious' ? 'active' : ''}`}
                onClick={() => setActivityFilter('suspicious')}
              >
                Suspicious
              </button>
            </div>

            {/* Activity List */}
            <div className="activity-feed-list">
              {filterActivity().slice(0, 15).map(scan => (
                <div key={scan.id} className={`activity-item ${scan.status}`}>
                  <div className={`activity-icon ${scan.status}`}>
                    <i className={`fas ${scan.status === 'success' ? 'fa-check-circle' : scan.status === 'failed' ? 'fa-times-circle' : 'fa-exclamation-circle'}`}></i>
                  </div>
                  <div className="activity-details">
                    <div className="activity-user">{scan.userName}</div>
                    <div className="activity-meta">
                      <span className={`activity-badge ${scan.userType}`}>
                        {scan.userType}
                      </span>
                      <span>
                        <i className="fas fa-map-marker-alt"></i>
                        {scan.deviceLocation}
                      </span>
                      <span>
                        {scan.scanType === 'entry' ? '→ Entry' : '← Exit'}
                      </span>
                      {scan.temperature && (
                        <span>
                          <i className="fas fa-thermometer-half"></i>
                          {scan.temperature}°C
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="activity-time">{getRelativeTime(scan.timestamp)}</div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Anomaly Detection */}
          <div className="anomaly-detection-card">
            <div className="card-header-bio">
              <div className="card-title-bio">
                <i className="fas fa-brain"></i>
                <h3>AI Anomaly Detection</h3>
              </div>
              <span className="anomaly-count">{anomalies.filter(a => !a.resolved).length} Active</span>
            </div>

            <div className="anomaly-list">
              {anomalies.filter(a => !a.resolved).map(anomaly => (
                <div key={anomaly.id} className={`anomaly-item ${anomaly.severity}`}>
                  <div className="anomaly-header">
                    <div className="anomaly-type">
                      <i className="fas fa-exclamation-triangle"></i>
                      {anomaly.type.replace(/-/g, ' ')}
                    </div>
                    <span className={`severity-badge ${anomaly.severity}`}>
                      {anomaly.severity.toUpperCase()}
                    </span>
                  </div>
                  <p className="anomaly-description">{anomaly.description}</p>
                  <div className="anomaly-footer">
                    <span className="anomaly-user">{anomaly.userName}</span>
                    <span className="anomaly-confidence">
                      <i className="fas fa-brain"></i>
                      {anomaly.aiConfidence}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Device Management Grid */}
          <div className="device-management-card">
            <div className="card-header-bio">
              <div className="card-title-bio">
                <i className="fas fa-server"></i>
                <h3>Device Management</h3>
              </div>
            </div>

            <div className="device-filters">
              <button
                className={`filter-chip ${deviceFilter === 'all' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-chip ${deviceFilter === 'fingerprint' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('fingerprint')}
              >
                <i className="fas fa-fingerprint"></i> Fingerprint
              </button>
              <button
                className={`filter-chip ${deviceFilter === 'face-recognition' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('face-recognition')}
              >
                <i className="fas fa-user-circle"></i> Face
              </button>
              <button
                className={`filter-chip ${deviceFilter === 'temperature' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('temperature')}
              >
                <i className="fas fa-thermometer-half"></i> Temp
              </button>
              <button
                className={`filter-chip ${deviceFilter === 'rfid' ? 'active' : ''}`}
                onClick={() => setDeviceFilter('rfid')}
              >
                <i className="fas fa-id-card"></i> RFID
              </button>
            </div>

            <div className="device-grid">
              {filterDevices().slice(0, 8).map(device => (
                <div key={device.id} className={`device-card ${device.status}`}>
                  <div className="device-header">
                    <div className="device-type-icon">
                      <i className={`fas ${getDeviceIcon(device.type)}`}></i>
                    </div>
                    <div className={`device-status-indicator ${device.status}`}></div>
                  </div>
                  <div className="device-name">{device.name}</div>
                  <div className="device-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {device.location}
                  </div>
                  <div className="device-stats">
                    <span>
                      <i className="fas fa-hand-pointer"></i>
                      {device.scansToday}
                    </span>
                    {device.batteryLevel !== undefined && (
                      <span>
                        <i className="fas fa-battery-three-quarters"></i>
                        {device.batteryLevel}%
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Health Screening Dashboard */}
          <div className="health-screening-card">
            <div className="card-header-bio">
              <div className="card-title-bio">
                <i className="fas fa-medkit"></i>
                <h3>Health Screening</h3>
              </div>
              <span className="health-count">
                {healthAlerts.filter(h => h.followUp === 'pending').length} Pending
              </span>
            </div>

            <div className="health-alerts-list">
              {healthAlerts.map(alert => (
                <div key={alert.id} className="health-alert-item">
                  <div className="health-alert-header">
                    <div className="health-alert-user">
                      <div className="health-alert-icon">
                        <i className="fas fa-thermometer-full"></i>
                      </div>
                      <div className="health-alert-info">
                        <h4>{alert.userName}</h4>
                        <p>{alert.userType}</p>
                      </div>
                    </div>
                    <div className="temperature-badge">
                      <i className="fas fa-thermometer-half"></i>
                      {alert.temperature}°C
                    </div>
                  </div>
                  <div className="health-alert-details">
                    <span>
                      <i className="fas fa-map-marker-alt"></i>
                      {alert.location}
                    </span>
                    <span>
                      <i className="fas fa-clock"></i>
                      {getRelativeTime(alert.timestamp)}
                    </span>
                    {alert.notified && (
                      <span>
                        <i className="fas fa-bell"></i>
                        Parent Notified
                      </span>
                    )}
                  </div>
                  <div className="health-alert-actions">
                    <button className="health-action-btn primary">
                      <i className="fas fa-user-check"></i>
                      Follow Up
                    </button>
                    <button className="health-action-btn secondary">
                      <i className="fas fa-check"></i>
                      Clear
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Predictive Analytics */}
          <div className="predictive-analytics-card">
            <div className="card-header-bio">
              <div className="card-title-bio">
                <i className="fas fa-chart-line"></i>
                <h3>Predictive Analytics</h3>
              </div>
              <span className="ai-powered-badge">
                <i className="fas fa-brain"></i>
                AI Powered
              </span>
            </div>

            <div className="prediction-chart">
              <h4 className="card-subtitle-bio">7-Day Attendance Forecast</h4>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart
                  data={predictions.map(pred => {
                    const date = new Date(pred.date);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                    return {
                      day: dayName,
                      attendance: pred.predictedAttendance,
                      confidence: pred.confidence,
                      date: pred.date
                    };
                  })}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#094d88" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10ac8b" stopOpacity={0.2}/>
                    </linearGradient>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10ac8b" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#10ac8b" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                  <XAxis
                    dataKey="day"
                    stroke="#6c757d"
                    style={{ fontSize: '12px', fontWeight: 500 }}
                  />
                  <YAxis
                    stroke="#6c757d"
                    style={{ fontSize: '12px' }}
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e9ecef',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    formatter={(value: number, name: string) => {
                      if (name === 'attendance') return [`${value}%`, 'Attendance'];
                      if (name === 'confidence') return [`${value}%`, 'Confidence'];
                      return [value, name];
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="attendance"
                    stroke="#094d88"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorAttendance)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                  <Area
                    type="monotone"
                    dataKey="confidence"
                    stroke="#10ac8b"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    fillOpacity={1}
                    fill="url(#colorConfidence)"
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </AreaChart>
              </ResponsiveContainer>

              <div className="prediction-insights">
                <div className="insight-item">
                  <i className="fas fa-lightbulb"></i>
                  <p>Expected dip in attendance this weekend (Nov 9-10)</p>
                </div>
                <div className="insight-item">
                  <i className="fas fa-chart-line"></i>
                  <p>Peak attendance predicted for Friday (Nov 8) at 97%</p>
                </div>
                <div className="insight-item">
                  <i className="fas fa-clock"></i>
                  <p>Busiest entry time: 8:00 AM - 8:30 AM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Reports & Export */}
          <div className="reports-export-card">
            <div className="card-header-bio">
              <div className="card-title-bio">
                <i className="fas fa-file-download"></i>
                <h3>Reports & Export</h3>
              </div>
            </div>

            <div className="reports-grid">
              <button className="report-button" onClick={() => downloadReport('attendance')}>
                <i className="fas fa-calendar-check"></i>
                <span>Attendance Report</span>
              </button>
              <button className="report-button" onClick={() => downloadReport('health')}>
                <i className="fas fa-heartbeat"></i>
                <span>Health Screening Report</span>
              </button>
              <button className="report-button" onClick={() => downloadReport('anomalies')}>
                <i className="fas fa-exclamation-triangle"></i>
                <span>AI Anomaly Report</span>
              </button>
              <button className="report-button" onClick={() => downloadReport('devices')}>
                <i className="fas fa-server"></i>
                <span>Device Performance Report</span>
              </button>
            </div>
          </div>
      </div>

      {/* Anomaly Details Modal */}
      {selectedAnomaly && (
        <div className="modal-overlay-bio" onClick={() => setSelectedAnomaly(null)}>
          <div className="anomaly-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-bio">
              <h3>Anomaly Details</h3>
              <button className="modal-close-bio" onClick={() => setSelectedAnomaly(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body-bio">
              <div className={`anomaly-severity-banner ${getSeverityClass(selectedAnomaly.severity)}`}>
                <i className="fas fa-exclamation-triangle"></i>
                <span>{selectedAnomaly.severity.toUpperCase()} SEVERITY ALERT</span>
              </div>

              <div className="anomaly-detail-section">
                <h4>User Information</h4>
                <p><strong>Name:</strong> {selectedAnomaly.userName}</p>
                <p><strong>User ID:</strong> {selectedAnomaly.userId}</p>
                <p><strong>Time:</strong> {new Date(selectedAnomaly.timestamp).toLocaleString()}</p>
              </div>

              <div className="anomaly-detail-section">
                <h4>Anomaly Type</h4>
                <p className="anomaly-type-desc">{selectedAnomaly.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
              </div>

              <div className="anomaly-detail-section">
                <h4>Description</h4>
                <p>{selectedAnomaly.description}</p>
              </div>

              <div className="anomaly-detail-section">
                <h4>AI Analysis</h4>
                <p>{selectedAnomaly.details}</p>
                <div className="ai-confidence-display">
                  <span>AI Confidence Score:</span>
                  <div className="confidence-bar-large">
                    <div
                      className="confidence-fill-large"
                      style={{ width: `${selectedAnomaly.aiConfidence}%` }}
                    ></div>
                  </div>
                  <span className="confidence-percent">{selectedAnomaly.aiConfidence}%</span>
                </div>
              </div>

              <div className="anomaly-actions-modal">
                <button className="btn-investigate-bio">
                  <i className="fas fa-search"></i>
                  Investigate Further
                </button>
                <button className="btn-dismiss-bio">
                  <i className="fas fa-times-circle"></i>
                  Dismiss
                </button>
                <button className="btn-resolve-modal-bio">
                  <i className="fas fa-check-circle"></i>
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiometricTracker;
