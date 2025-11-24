import { useState, useEffect } from 'react';

interface Camera {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'inactive' | 'alert';
  lastActivity: string;
  recordingStatus: 'recording' | 'paused';
  aiEnabled: boolean;
}

interface Alert {
  id: string;
  cameraId: string;
  cameraName: string;
  type: 'motion' | 'unauthorized' | 'suspicious' | 'loitering';
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  description: string;
  imageUrl?: string;
  resolved: boolean;
}

interface ActivityLog {
  id: string;
  time: string;
  event: string;
  camera: string;
  aiDetected: boolean;
}

const CCTVMonitoring = () => {
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null);
  const [alertFilter, setAlertFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [showAlertDetail, setShowAlertDetail] = useState<Alert | null>(null);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);
  const [aiMonitoringEnabled, setAiMonitoringEnabled] = useState(true);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Animated stats
  const [incidentResponse, setIncidentResponse] = useState(0);
  const [camerasMonitored, setCamerasMonitored] = useState(0);
  const targetResponse = 90;
  const targetCameras = 52;

  const [newCameraData, setNewCameraData] = useState({
    name: '',
    location: '',
    ipAddress: '',
    aiEnabled: true
  });

  useEffect(() => {
    // Animate incident response
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setIncidentResponse(Math.floor(targetResponse * progress));
      setCamerasMonitored(Math.floor(targetCameras * progress));

      if (currentStep >= steps) {
        setIncidentResponse(targetResponse);
        setCamerasMonitored(targetCameras);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const cameras: Camera[] = [
    {
      id: '1',
      name: 'Main Entrance',
      location: 'Building A - Front Gate',
      status: 'active',
      lastActivity: '2 mins ago',
      recordingStatus: 'recording',
      aiEnabled: true
    },
    {
      id: '2',
      name: 'Parking Lot',
      location: 'Outdoor - West Wing',
      status: 'active',
      lastActivity: '5 mins ago',
      recordingStatus: 'recording',
      aiEnabled: true
    },
    {
      id: '3',
      name: 'Hallway 1st Floor',
      location: 'Building A - Floor 1',
      status: 'alert',
      lastActivity: 'Just now',
      recordingStatus: 'recording',
      aiEnabled: true
    },
    {
      id: '4',
      name: 'Back Exit',
      location: 'Building B - Rear',
      status: 'active',
      lastActivity: '8 mins ago',
      recordingStatus: 'recording',
      aiEnabled: true
    },
    {
      id: '5',
      name: 'Cafeteria',
      location: 'Building A - Ground Floor',
      status: 'active',
      lastActivity: '3 mins ago',
      recordingStatus: 'recording',
      aiEnabled: false
    },
    {
      id: '6',
      name: 'Library',
      location: 'Building C - Floor 2',
      status: 'inactive',
      lastActivity: '1 hour ago',
      recordingStatus: 'paused',
      aiEnabled: true
    },
    {
      id: '7',
      name: 'Server Room',
      location: 'Building A - Basement',
      status: 'active',
      lastActivity: '1 min ago',
      recordingStatus: 'recording',
      aiEnabled: true
    },
    {
      id: '8',
      name: 'Playground',
      location: 'Outdoor - East Wing',
      status: 'active',
      lastActivity: '4 mins ago',
      recordingStatus: 'recording',
      aiEnabled: true
    }
  ];

  const alerts: Alert[] = [
    {
      id: '1',
      cameraId: '3',
      cameraName: 'Hallway 1st Floor',
      type: 'unauthorized',
      severity: 'high',
      timestamp: '10:45 PM',
      description: 'Unauthorized person detected in restricted area after office hours',
      resolved: false
    },
    {
      id: '2',
      cameraId: '1',
      cameraName: 'Main Entrance',
      type: 'motion',
      severity: 'medium',
      timestamp: '10:30 PM',
      description: 'Motion detected at main entrance outside operating hours',
      resolved: false
    },
    {
      id: '3',
      cameraId: '7',
      cameraName: 'Server Room',
      type: 'suspicious',
      severity: 'high',
      timestamp: '10:15 PM',
      description: 'Suspicious activity detected - prolonged presence in server room',
      resolved: false
    },
    {
      id: '4',
      cameraId: '2',
      cameraName: 'Parking Lot',
      type: 'loitering',
      severity: 'low',
      timestamp: '09:50 PM',
      description: 'Person loitering in parking lot for extended period',
      resolved: true
    },
    {
      id: '5',
      cameraId: '4',
      cameraName: 'Back Exit',
      type: 'motion',
      severity: 'medium',
      timestamp: '09:30 PM',
      description: 'Motion detected at back exit after hours',
      resolved: true
    }
  ];

  const activityLogs: ActivityLog[] = [
    { id: '1', time: '10:45 PM', event: 'Unauthorized Entry Detected', camera: 'Hallway 1st Floor', aiDetected: true },
    { id: '2', time: '10:30 PM', event: 'Motion Alert Triggered', camera: 'Main Entrance', aiDetected: true },
    { id: '3', time: '10:15 PM', event: 'Suspicious Activity Alert', camera: 'Server Room', aiDetected: true },
    { id: '4', time: '09:50 PM', event: 'Loitering Detection', camera: 'Parking Lot', aiDetected: true },
    { id: '5', time: '09:30 PM', event: 'Motion Detected', camera: 'Back Exit', aiDetected: true },
    { id: '6', time: '09:00 PM', event: 'Recording Started', camera: 'All Cameras', aiDetected: false },
    { id: '7', time: '08:45 PM', event: 'AI Monitoring Enabled', camera: 'System', aiDetected: false }
  ];

  const filteredAlerts = alertFilter === 'all'
    ? alerts
    : alerts.filter(alert => alert.severity === alertFilter);

  const activeAlerts = alerts.filter(a => !a.resolved).length;
  const activeCameras = cameras.filter(c => c.status === 'active').length;
  const aiEnabledCameras = cameras.filter(c => c.aiEnabled).length;

  const toggleAIMonitoring = () => {
    const newState = !aiMonitoringEnabled;
    setAiMonitoringEnabled(newState);

    setNotificationMessage(
      newState
        ? 'AI Monitoring Enabled\n\nAll cameras are now using AI-powered threat detection.'
        : 'AI Monitoring Disabled\n\nCameras are in standard recording mode.'
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const resolveAlert = (alertId: string) => {
    setNotificationMessage(`Alert #${alertId} has been marked as resolved.`);
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
    setShowAlertDetail(null);
  };

  const downloadRecording = (camera: Camera) => {
    setNotificationMessage(`Downloading recording from ${camera.name}...\n\nLast 24 hours of footage will be saved.`);
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const toggleRecording = (camera: Camera) => {
    const action = camera.recordingStatus === 'recording' ? 'paused' : 'resumed';
    setNotificationMessage(`Recording ${action} for ${camera.name}`);
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const handleAddCamera = () => {
    if (!newCameraData.name || !newCameraData.location) {
      alert('Please fill in Camera Name and Location');
      return;
    }

    console.log('New Camera:', newCameraData);

    setNotificationMessage(`Camera "${newCameraData.name}" added successfully!\n\nLocation: ${newCameraData.location}`);
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);

    setNewCameraData({
      name: '',
      location: '',
      ipAddress: '',
      aiEnabled: true
    });
    setShowAddCameraModal(false);
  };

  const exportReport = (type: string) => {
    setNotificationMessage(`Generating ${type} Report...\n\nThis will include all alerts, activity logs, and camera status.`);
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  return (
    <div className="cctv-monitoring-page">
      {/* Impact Stats */}
      <div className="cctv-stats-grid">
        <div className="cctv-stat-card response">
          <div className="stat-icon">
            <i className="fas fa-bolt"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Faster Incident Response</span>
            <span className="stat-value">{incidentResponse}%</span>
            <span className="stat-trend"><i className="fas fa-arrow-up"></i> Proactive security enabled</span>
          </div>
        </div>

        <div className="cctv-stat-card cameras">
          <div className="stat-icon">
            <i className="fas fa-video"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Cameras Monitored</span>
            <span className="stat-value">{camerasMonitored}</span>
            <span className="stat-trend"><i className="fas fa-eye"></i> 24/7 AI surveillance</span>
          </div>
        </div>

        <div className="cctv-stat-card alerts">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Alerts</span>
            <span className="stat-value">{activeAlerts}</span>
            <span className="stat-trend"><i className="fas fa-shield-alt"></i> AI-detected threats</span>
          </div>
        </div>

        <div className="cctv-stat-card ai">
          <div className="stat-icon">
            <i className="fas fa-brain"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">AI-Enabled Cameras</span>
            <span className="stat-value">{aiEnabledCameras}/{cameras.length}</span>
            <span className="stat-trend"><i className="fas fa-robot"></i> Smart detection active</span>
          </div>
        </div>
      </div>

      {/* AI Monitoring Control */}
      <div className="ai-control-card">
        <div className="ai-control-header">
          <div className="ai-control-info">
            <h3><i className="fas fa-brain"></i> AI Monitoring System</h3>
            <p>Automated threat detection and security alerts powered by artificial intelligence</p>
          </div>
          <button
            className={`ai-toggle-btn ${aiMonitoringEnabled ? 'enabled' : 'disabled'}`}
            onClick={toggleAIMonitoring}
          >
            <i className={`fas ${aiMonitoringEnabled ? 'fa-toggle-on' : 'fa-toggle-off'}`}></i>
            {aiMonitoringEnabled ? 'AI Enabled' : 'AI Disabled'}
          </button>
        </div>

        <div className="ai-features-grid">
          <div className="ai-feature">
            <i className="fas fa-walking"></i>
            <h4>Motion Detection</h4>
            <p>Detects movement in restricted areas</p>
          </div>
          <div className="ai-feature">
            <i className="fas fa-user-secret"></i>
            <h4>Unauthorized Entry</h4>
            <p>Identifies unknown persons after hours</p>
          </div>
          <div className="ai-feature">
            <i className="fas fa-exclamation-circle"></i>
            <h4>Suspicious Activity</h4>
            <p>Recognizes unusual behavior patterns</p>
          </div>
          <div className="ai-feature">
            <i className="fas fa-user-clock"></i>
            <h4>Loitering Detection</h4>
            <p>Alerts for prolonged presence in areas</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="cctv-main-grid">
        {/* Camera Grid */}
        <div className="camera-grid-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-video"></i>
              <h3>Live Camera Feeds</h3>
              <span className="camera-count">{activeCameras} Active</span>
            </div>
            <button className="add-camera-btn" onClick={() => setShowAddCameraModal(true)}>
              <i className="fas fa-plus"></i>
              Add Camera
            </button>
          </div>

          <div className="cameras-grid">
            {cameras.map((camera) => (
              <div
                key={camera.id}
                className={`camera-card ${camera.status} ${selectedCamera?.id === camera.id ? 'selected' : ''}`}
                onClick={() => setSelectedCamera(camera)}
              >
                <div className="camera-preview">
                  <div className="preview-placeholder">
                    <i className="fas fa-video"></i>
                    <span>LIVE</span>
                  </div>
                  {camera.status === 'alert' && (
                    <div className="alert-badge">
                      <i className="fas fa-exclamation-triangle"></i>
                      Alert
                    </div>
                  )}
                  {camera.aiEnabled && (
                    <div className="ai-badge">
                      <i className="fas fa-brain"></i>
                      AI
                    </div>
                  )}
                </div>

                <div className="camera-info">
                  <h4>{camera.name}</h4>
                  <p className="camera-location">
                    <i className="fas fa-map-marker-alt"></i>
                    {camera.location}
                  </p>
                  <div className="camera-meta">
                    <span className={`status-indicator ${camera.status}`}>
                      <i className="fas fa-circle"></i>
                      {camera.status}
                    </span>
                    <span className="last-activity">{camera.lastActivity}</span>
                  </div>
                </div>

                <div className="camera-actions">
                  <button
                    className="camera-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleRecording(camera);
                    }}
                  >
                    <i className={`fas ${camera.recordingStatus === 'recording' ? 'fa-pause' : 'fa-play'}`}></i>
                  </button>
                  <button
                    className="camera-action-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadRecording(camera);
                    }}
                  >
                    <i className="fas fa-download"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="alerts-panel">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-bell"></i>
              <h3>Security Alerts</h3>
            </div>
            <div className="alert-filters">
              <button
                className={`filter-btn ${alertFilter === 'all' ? 'active' : ''}`}
                onClick={() => setAlertFilter('all')}
              >
                All
              </button>
              <button
                className={`filter-btn high ${alertFilter === 'high' ? 'active' : ''}`}
                onClick={() => setAlertFilter('high')}
              >
                High
              </button>
              <button
                className={`filter-btn medium ${alertFilter === 'medium' ? 'active' : ''}`}
                onClick={() => setAlertFilter('medium')}
              >
                Medium
              </button>
              <button
                className={`filter-btn low ${alertFilter === 'low' ? 'active' : ''}`}
                onClick={() => setAlertFilter('low')}
              >
                Low
              </button>
            </div>
          </div>

          <div className="alerts-list">
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`alert-item ${alert.severity} ${alert.resolved ? 'resolved' : ''}`}
                onClick={() => setShowAlertDetail(alert)}
              >
                <div className={`alert-severity-bar ${alert.severity}`}></div>
                <div className="alert-content">
                  <div className="alert-header">
                    <div className="alert-type-icon">
                      <i className={`fas ${
                        alert.type === 'motion' ? 'fa-walking' :
                        alert.type === 'unauthorized' ? 'fa-user-secret' :
                        alert.type === 'suspicious' ? 'fa-exclamation-circle' :
                        'fa-user-clock'
                      }`}></i>
                    </div>
                    <div className="alert-info">
                      <h4>{alert.cameraName}</h4>
                      <span className={`severity-badge ${alert.severity}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                    </div>
                    <span className="alert-time">{alert.timestamp}</span>
                  </div>
                  <p className="alert-description">{alert.description}</p>
                  {alert.resolved && (
                    <div className="resolved-badge">
                      <i className="fas fa-check-circle"></i>
                      Resolved
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Activity Logs - inside alerts panel */}
          <div className="activity-logs-subsection">
            <div className="subsection-header">
              <i className="fas fa-history"></i>
              <h4>Recent Activity</h4>
            </div>

            <div className="activity-timeline">
              {activityLogs.map((log) => (
                <div key={log.id} className="activity-log-item">
                  <div className="activity-time-badge">{log.time}</div>
                  <div className="activity-dot"></div>
                  <div className="activity-details">
                    <h4>{log.event}</h4>
                    <p>
                      <i className="fas fa-video"></i>
                      {log.camera}
                      {log.aiDetected && (
                        <span className="ai-detected-tag">
                          <i className="fas fa-brain"></i>
                          AI Detected
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Alert Detail Modal */}
      {showAlertDetail && (
        <div className="alert-modal-overlay" onClick={() => setShowAlertDetail(null)}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alert-modal-header">
              <div>
                <h2>Security Alert Details</h2>
                <span className={`alert-severity-badge ${showAlertDetail.severity}`}>
                  {showAlertDetail.severity.toUpperCase()} PRIORITY
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAlertDetail(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="alert-modal-content">
              <div className="alert-detail-grid">
                <div className="detail-item">
                  <span className="detail-label">Camera</span>
                  <span className="detail-value">{showAlertDetail.cameraName}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Alert Type</span>
                  <span className="detail-value">{showAlertDetail.type}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{showAlertDetail.timestamp}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">{showAlertDetail.resolved ? 'Resolved' : 'Active'}</span>
                </div>
              </div>

              <div className="alert-description-full">
                <h3>Description</h3>
                <p>{showAlertDetail.description}</p>
              </div>

              <div className="alert-snapshot">
                <h3>Camera Snapshot</h3>
                <div className="snapshot-placeholder">
                  <i className="fas fa-camera"></i>
                  <p>Snapshot from {showAlertDetail.cameraName}</p>
                  <span>{showAlertDetail.timestamp}</span>
                </div>
              </div>
            </div>

            <div className="alert-modal-footer">
              <button className="modal-action-btn secondary" onClick={() => setShowAlertDetail(null)}>
                <i className="fas fa-times"></i>
                Close
              </button>
              {!showAlertDetail.resolved && (
                <button
                  className="modal-action-btn primary"
                  onClick={() => resolveAlert(showAlertDetail.id)}
                >
                  <i className="fas fa-check"></i>
                  Mark as Resolved
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Camera Modal */}
      {showAddCameraModal && (
        <div className="alert-modal-overlay" onClick={() => setShowAddCameraModal(false)}>
          <div className="alert-modal" onClick={(e) => e.stopPropagation()}>
            <div className="alert-modal-header">
              <div>
                <h2>Add New Camera</h2>
                <span className="modal-subtitle">Connect a new CCTV camera to the monitoring system</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddCameraModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="alert-modal-content">
              <div className="add-camera-form">
                <div className="form-group-cctv">
                  <label>
                    <i className="fas fa-video"></i>
                    Camera Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Rooftop Camera"
                    value={newCameraData.name}
                    onChange={(e) => setNewCameraData({ ...newCameraData, name: e.target.value })}
                  />
                </div>

                <div className="form-group-cctv">
                  <label>
                    <i className="fas fa-map-marker-alt"></i>
                    Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Building D - Floor 3"
                    value={newCameraData.location}
                    onChange={(e) => setNewCameraData({ ...newCameraData, location: e.target.value })}
                  />
                </div>

                <div className="form-group-cctv">
                  <label>
                    <i className="fas fa-network-wired"></i>
                    IP Address
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 192.168.1.100"
                    value={newCameraData.ipAddress}
                    onChange={(e) => setNewCameraData({ ...newCameraData, ipAddress: e.target.value })}
                  />
                </div>

                <div className="form-checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={newCameraData.aiEnabled}
                      onChange={(e) => setNewCameraData({ ...newCameraData, aiEnabled: e.target.checked })}
                    />
                    <span>Enable AI-powered threat detection</span>
                  </label>
                </div>

                <div className="form-info-box">
                  <i className="fas fa-info-circle"></i>
                  <p>AI monitoring will automatically detect motion, unauthorized entry, and suspicious activities.</p>
                </div>
              </div>
            </div>

            <div className="alert-modal-footer">
              <button className="modal-action-btn secondary" onClick={() => setShowAddCameraModal(false)}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button className="modal-action-btn primary" onClick={handleAddCamera}>
                <i className="fas fa-plus"></i>
                Add Camera
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="sms-popup">
          <div className="sms-popup-content">
            <div className="sms-popup-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <p>{notificationMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CCTVMonitoring;
