import { useState, useEffect } from 'react';

interface Child {
  id: string;
  name: string;
  class: string;
  section: string;
  rollNumber: string;
  busNumber: string;
  route: string;
  pickupStop: string;
  dropOffStop: string;
  scheduledPickupTime: string;
  scheduledDropTime: string;
}

interface BusLocation {
  busNumber: string;
  currentLocation: { lat: number; lng: number };
  currentStop: string;
  status: 'en-route' | 'stopped' | 'at-school';
  speed: number;
  lastUpdate: string;
  driver: {
    name: string;
    contact: string;
    experience: string;
  };
  nextStop: string;
  etaNextStop: string;
}

interface JourneyStatus {
  isOnBus: boolean;
  boardingTime?: string;
  boardingLocation?: string;
  etaToSchool?: string;
  distanceCovered: number;
  totalDistance: number;
  estimatedArrival: string;
  currentPhase: 'pickup' | 'en-route' | 'arrived';
}

interface RFIDAlert {
  id: string;
  type: 'boarding' | 'alighting';
  timestamp: string;
  location: string;
  busNumber: string;
  notificationSent: boolean;
  date: string;
}

interface AITransportInsight {
  type: 'prediction' | 'safety' | 'recommendation' | 'alert';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'success';
  icon: string;
  color: string;
}

interface MonthlyStats {
  onTimePickups: number;
  totalDays: number;
  avgJourneyTime: number;
  totalDistance: number;
  notificationsDelivered: number;
  consistencyScore: number;
}

const TransportTracking = () => {
  const [selectedChild, setSelectedChild] = useState<string>('1');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showAlertHistory, setShowAlertHistory] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [notifyMessage, setNotifyMessage] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Mock data - students
  const children: Child[] = [
    {
      id: '1',
      name: 'Aarav Sharma',
      class: '10',
      section: 'A',
      rollNumber: '15',
      busNumber: 'BUS-001',
      route: 'Route A - Downtown',
      pickupStop: 'Main Street Stop',
      dropOffStop: 'School Gate',
      scheduledPickupTime: '08:15 AM',
      scheduledDropTime: '03:45 PM'
    },
    {
      id: '2',
      name: 'Diya Sharma',
      class: '7',
      section: 'B',
      rollNumber: '22',
      busNumber: 'BUS-002',
      route: 'Route B - Suburbs',
      pickupStop: 'Park Avenue',
      dropOffStop: 'School Gate',
      scheduledPickupTime: '08:10 AM',
      scheduledDropTime: '03:50 PM'
    }
  ];

  const currentChild = children.find(c => c.id === selectedChild) || children[0];

  // Mock bus location data
  const busLocation: BusLocation = {
    busNumber: currentChild.busNumber,
    currentLocation: { lat: 28.6139, lng: 77.2090 },
    currentStop: 'Market Square',
    status: 'en-route',
    speed: 35,
    lastUpdate: '30 secs ago',
    driver: {
      name: 'Rajesh Kumar',
      contact: '+91 98765 43210',
      experience: '12 years'
    },
    nextStop: currentChild.pickupStop,
    etaNextStop: '5 mins'
  };

  // Journey status
  const journeyStatus: JourneyStatus = {
    isOnBus: false,
    etaToSchool: '23 mins',
    distanceCovered: 2.5,
    totalDistance: 8.3,
    estimatedArrival: '08:38 AM',
    currentPhase: 'pickup'
  };

  // Today's alerts
  const todayAlerts: RFIDAlert[] = [
    {
      id: '1',
      type: 'boarding',
      timestamp: '08:17 AM',
      location: 'Main Street Stop',
      busNumber: currentChild.busNumber,
      notificationSent: true,
      date: new Date().toISOString().split('T')[0]
    }
  ];

  // Alert history (last 7 days)
  const alertHistory: RFIDAlert[] = [
    ...todayAlerts,
    {
      id: '2',
      type: 'alighting',
      timestamp: '03:42 PM',
      location: 'School Gate',
      busNumber: currentChild.busNumber,
      notificationSent: true,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    },
    {
      id: '3',
      type: 'boarding',
      timestamp: '08:15 AM',
      location: 'Main Street Stop',
      busNumber: currentChild.busNumber,
      notificationSent: true,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0]
    },
    {
      id: '4',
      type: 'alighting',
      timestamp: '03:45 PM',
      location: 'School Gate',
      busNumber: currentChild.busNumber,
      notificationSent: true,
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
    },
    {
      id: '5',
      type: 'boarding',
      timestamp: '08:14 AM',
      location: 'Main Street Stop',
      busNumber: currentChild.busNumber,
      notificationSent: true,
      date: new Date(Date.now() - 172800000).toISOString().split('T')[0]
    }
  ];

  // Monthly statistics
  const monthlyStats: MonthlyStats = {
    onTimePickups: 22,
    totalDays: 24,
    avgJourneyTime: 23,
    totalDistance: 384,
    notificationsDelivered: 100,
    consistencyScore: 95
  };

  // AI Insights
  const generateAIInsights = (): AITransportInsight[] => {
    const insights: AITransportInsight[] = [];

    // Current status prediction
    if (busLocation.status === 'en-route') {
      insights.push({
        type: 'prediction',
        title: 'On Schedule',
        description: `Bus is on time and will reach ${currentChild.pickupStop} in approximately ${busLocation.etaNextStop}. Current speed: ${busLocation.speed} km/h.`,
        severity: 'success',
        icon: 'fa-check-circle',
        color: '#10ac8b'
      });
    }

    // Safety insight
    insights.push({
      type: 'safety',
      title: 'Consistent Attendance',
      description: `${currentChild.name} has boarded on time for ${monthlyStats.onTimePickups} out of ${monthlyStats.totalDays} school days this month. Excellent consistency!`,
      severity: 'info',
      icon: 'fa-shield-alt',
      color: '#3b82f6'
    });

    // Travel time recommendation
    const avgPickupTime = new Date(`2000-01-01 ${currentChild.scheduledPickupTime}`);
    const optimalArrival = new Date(avgPickupTime.getTime() - 3 * 60000);
    insights.push({
      type: 'recommendation',
      title: 'Optimal Arrival Time',
      description: `Based on ${monthlyStats.totalDays} days of data, the bus typically arrives 2-3 minutes early. Recommended arrival at stop: ${optimalArrival.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}.`,
      severity: 'info',
      icon: 'fa-lightbulb',
      color: '#8b5cf6'
    });

    // Journey insights
    if (monthlyStats.avgJourneyTime <= 25) {
      insights.push({
        type: 'prediction',
        title: 'Efficient Route',
        description: `Average journey time of ${monthlyStats.avgJourneyTime} minutes is within the optimal range. Route ${currentChild.route} maintains good time consistency.`,
        severity: 'success',
        icon: 'fa-route',
        color: '#10ac8b'
      });
    }

    return insights;
  };

  const aiInsights = generateAIInsights();

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const refreshInterval = setInterval(() => {
        refreshLocation();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(refreshInterval);
    }
  }, [autoRefresh]);

  const toggleAutoRefresh = () => {
    const newState = !autoRefresh;
    setAutoRefresh(newState);
    if (newState) {
      refreshLocation();
    }
  };

  const refreshLocation = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshTime(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 1500);
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleNotifyDriver = () => {
    if (!notifyMessage.trim()) {
      showToast('Please enter a message', 'error');
      return;
    }
    // Simulate sending notification
    setShowNotifyModal(false);
    setNotifyMessage('');
    showToast(`Notification sent to driver ${busLocation.driver.name}`, 'success');
  };

  const handleEmergencyContact = () => {
    showToast('Calling transport coordinator...', 'info');
  };

  const handleReportIssue = () => {
    showToast('Issue report form opened', 'info');
  };

  const handleShareLocation = () => {
    showToast('Location link copied to clipboard!', 'success');
  };

  const handleDownloadReport = () => {
    try {
      // Generate CSV content for monthly transport report
      const reportMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

      let csvContent = `Monthly Transport Report\n`;
      csvContent += `Student: ${currentChild.name}\n`;
      csvContent += `Class: ${currentChild.class}${currentChild.section} (Roll No: ${currentChild.rollNumber})\n`;
      csvContent += `Bus: ${currentChild.busNumber} - ${currentChild.route}\n`;
      csvContent += `Report Period: ${reportMonth}\n\n`;

      // Statistics
      csvContent += `Transport Statistics\n`;
      csvContent += `On-Time Pickups,${monthlyStats.onTimePickups}/${monthlyStats.totalDays}\n`;
      csvContent += `Average Journey Time,${monthlyStats.avgJourneyTime} minutes\n`;
      csvContent += `Total Distance Traveled,${monthlyStats.totalDistance} km\n`;
      csvContent += `Notifications Delivered,${monthlyStats.notificationsDelivered}%\n`;
      csvContent += `Consistency Score,${monthlyStats.consistencyScore}%\n\n`;

      // Route Information
      csvContent += `Route Information\n`;
      csvContent += `Pickup Stop,${currentChild.pickupStop}\n`;
      csvContent += `Scheduled Pickup,${currentChild.scheduledPickupTime}\n`;
      csvContent += `Drop-off Stop,${currentChild.dropOffStop}\n`;
      csvContent += `Scheduled Drop-off,${currentChild.scheduledDropTime}\n\n`;

      // Driver Information
      csvContent += `Driver Information\n`;
      csvContent += `Name,${busLocation.driver.name}\n`;
      csvContent += `Contact,${busLocation.driver.contact}\n`;
      csvContent += `Experience,${busLocation.driver.experience}\n\n`;

      // Recent Alerts
      csvContent += `Recent Boarding & Alighting Records\n`;
      csvContent += `Date,Type,Time,Location,Bus,Notification Status\n`;
      alertHistory.forEach(alert => {
        const date = new Date(alert.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        csvContent += `${date},${alert.type},${alert.timestamp},${alert.location},${alert.busNumber},${alert.notificationSent ? 'Sent' : 'Pending'}\n`;
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `Transport_Report_${currentChild.name.replace(/\s+/g, '_')}_${reportMonth.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('Transport report downloaded successfully!', 'success');
    } catch (error) {
      showToast('Failed to download report. Please try again.', 'error');
      console.error('Download error:', error);
    }
  };

  return (
    <div className="parent-transport-page">
      {/* Header Section */}
      <div className="transport-header">
        <div className="header-top-row">
          <div className="child-selector-transport">
            <i className="fas fa-user-graduate"></i>
            <select value={selectedChild} onChange={(e) => setSelectedChild(e.target.value)}>
              {children.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - Class {child.class}{child.section}
                </option>
              ))}
            </select>
          </div>

          <div className="current-status-badge">
            {journeyStatus.isOnBus ? (
              <>
                <i className="fas fa-bus status-icon on-bus"></i>
                <span className="status-text">On {busLocation.busNumber}</span>
              </>
            ) : busLocation.status === 'at-school' ? (
              <>
                <i className="fas fa-school status-icon at-school"></i>
                <span className="status-text">At School</span>
              </>
            ) : (
              <>
                <i className="fas fa-home status-icon at-home"></i>
                <span className="status-text">Bus En-Route</span>
              </>
            )}
            <span className="live-pulse"></span>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="quick-info-grid">
          <div className="info-card">
            <div className="info-icon pickup">
              <i className="fas fa-map-marker-alt"></i>
            </div>
            <div className="info-content">
              <span className="info-label">Pickup Stop</span>
              <span className="info-value">{currentChild.pickupStop}</span>
              <span className="info-time">{currentChild.scheduledPickupTime}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon eta">
              <i className="fas fa-clock"></i>
            </div>
            <div className="info-content">
              <span className="info-label">ETA to Pickup</span>
              <span className="info-value">{busLocation.etaNextStop}</span>
              <span className="info-time">Updated {busLocation.lastUpdate}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon journey">
              <i className="fas fa-route"></i>
            </div>
            <div className="info-content">
              <span className="info-label">Avg Journey</span>
              <span className="info-value">{monthlyStats.avgJourneyTime} mins</span>
              <span className="info-time">{currentChild.route}</span>
            </div>
          </div>

          <div className="info-card">
            <div className="info-icon driver">
              <i className="fas fa-user-tie"></i>
            </div>
            <div className="info-content">
              <span className="info-label">Driver</span>
              <span className="info-value">{busLocation.driver.name}</span>
              <span className="info-time" style={{ cursor: 'pointer' }} onClick={() => setShowDriverModal(true)}>
                <i className="fas fa-phone-alt"></i> View Contact
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="transport-content-grid">
        {/* Live Map Section */}
        <div className="live-tracking-section">
          <div className="map-card-parent">
            <div className="map-header-parent">
              <div className="map-title-parent">
                <i className="fas fa-map-marked-alt"></i>
                <h3>Live Bus Tracking</h3>
              </div>
              <div className="map-controls-parent">
                <button className={`refresh-btn-parent ${autoRefresh ? 'active' : ''}`} onClick={toggleAutoRefresh}>
                  <i className="fas fa-sync-alt"></i>
                  {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
                </button>
                <button className="center-btn" onClick={refreshLocation}>
                  <i className="fas fa-crosshairs"></i>
                  Center on Bus
                </button>
                <span className="last-refresh">
                  <i className="fas fa-clock"></i> {lastRefreshTime}
                </span>
              </div>
            </div>

            <div className="map-container-parent">
              {isRefreshing && (
                <div className="map-loading-overlay">
                  <div className="loading-spinner-map">
                    <i className="fas fa-sync-alt fa-spin"></i>
                  </div>
                  <p>Updating location...</p>
                </div>
              )}

              <div className="map-visual-parent">
                {/* Background grid */}
                <div className="map-grid"></div>

                {/* Roads */}
                <div className="map-road horizontal" style={{ top: '30%' }}></div>
                <div className="map-road horizontal" style={{ top: '70%' }}></div>
                <div className="map-road vertical" style={{ left: '40%' }}></div>
                <div className="map-road vertical" style={{ left: '60%' }}></div>

                {/* School location */}
                <div className="map-marker school" style={{ top: '50%', left: '80%' }}>
                  <i className="fas fa-school"></i>
                  <span className="marker-label">School</span>
                </div>

                {/* Child's bus (highlighted) */}
                <div className="map-marker bus-parent active" style={{ top: '25%', left: '35%' }}>
                  <i className="fas fa-bus"></i>
                  <span className="marker-label">{busLocation.busNumber}</span>
                  <div className="bus-pulse-parent"></div>
                </div>

                {/* Child's pickup stop (highlighted) */}
                <div className="map-marker pickup-stop-parent" style={{ top: '28%', left: '50%' }}>
                  <i className="fas fa-map-pin"></i>
                  <span className="marker-label">{currentChild.pickupStop}</span>
                  <div className="stop-highlight"></div>
                </div>

                {/* Route path */}
                <svg className="route-path-parent" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                  <path d="M 35% 25% L 50% 28% L 80% 50%" stroke="#094d88" strokeWidth="3" strokeDasharray="10,5" fill="none" opacity="0.6" />
                </svg>

                {/* Other stops on route (dimmed) */}
                <div className="map-marker stop-dimmed" style={{ top: '65%', left: '45%' }}>
                  <i className="fas fa-map-pin"></i>
                  <span className="marker-label">Market Square</span>
                </div>

                <div className="map-marker stop-dimmed" style={{ top: '35%', left: '65%' }}>
                  <i className="fas fa-map-pin"></i>
                  <span className="marker-label">Park Avenue</span>
                </div>
              </div>

              {/* Map overlay info */}
              <div className="map-overlay-info-parent">
                <div className="overlay-info-item">
                  <i className="fas fa-tachometer-alt"></i>
                  <span>{busLocation.speed} km/h</span>
                </div>
                <div className="overlay-info-item">
                  <i className="fas fa-route"></i>
                  <span>{busLocation.currentStop}</span>
                </div>
                <div className="overlay-info-item success">
                  <i className="fas fa-circle"></i>
                  <span>{busLocation.status === 'en-route' ? 'En-Route' : busLocation.status}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Journey Progress Bar */}
          <div className="journey-progress-card">
            <h4>
              <i className="fas fa-route"></i>
              Journey Progress
            </h4>
            <div className="progress-timeline">
              <div className={`timeline-point ${journeyStatus.currentPhase === 'pickup' || journeyStatus.currentPhase === 'en-route' || journeyStatus.currentPhase === 'arrived' ? 'completed' : 'pending'}`}>
                <div className="point-circle">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="point-label">
                  <span className="point-title">Pickup Stop</span>
                  <span className="point-time">{currentChild.scheduledPickupTime}</span>
                </div>
              </div>

              <div className={`timeline-line ${journeyStatus.currentPhase === 'en-route' || journeyStatus.currentPhase === 'arrived' ? 'completed' : 'pending'}`}>
                <div className="line-progress" style={{ width: journeyStatus.currentPhase === 'en-route' ? `${(journeyStatus.distanceCovered / journeyStatus.totalDistance) * 100}%` : '0%' }}></div>
              </div>

              <div className={`timeline-point ${journeyStatus.currentPhase === 'en-route' ? 'active' : journeyStatus.currentPhase === 'arrived' ? 'completed' : 'pending'}`}>
                <div className="point-circle">
                  <i className="fas fa-bus"></i>
                </div>
                <div className="point-label">
                  <span className="point-title">En-Route</span>
                  <span className="point-time">{journeyStatus.distanceCovered}/{journeyStatus.totalDistance} km</span>
                </div>
              </div>

              <div className={`timeline-line ${journeyStatus.currentPhase === 'arrived' ? 'completed' : 'pending'}`}></div>

              <div className={`timeline-point ${journeyStatus.currentPhase === 'arrived' ? 'completed' : 'pending'}`}>
                <div className="point-circle">
                  <i className="fas fa-school"></i>
                </div>
                <div className="point-label">
                  <span className="point-title">School</span>
                  <span className="point-time">ETA: {journeyStatus.estimatedArrival}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Route Information */}
          <div className="route-info-card">
            <h3>
              <i className="fas fa-route"></i>
              Route Details
            </h3>
            <div className="route-info-content">
              <div className="route-info-item">
                <span className="info-label-sidebar">Route Name:</span>
                <span className="info-value-sidebar">{currentChild.route}</span>
              </div>
              <div className="route-info-item">
                <span className="info-label-sidebar">Bus Number:</span>
                <span className="info-value-sidebar">{currentChild.busNumber}</span>
              </div>
              <div className="route-info-item">
                <span className="info-label-sidebar">Pickup Time:</span>
                <span className="info-value-sidebar">{currentChild.scheduledPickupTime}</span>
              </div>
              <div className="route-info-item">
                <span className="info-label-sidebar">Drop Time:</span>
                <span className="info-value-sidebar">{currentChild.scheduledDropTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="transport-sidebar">
          {/* AI Insights Panel */}
          <div className="ai-transport-insights">
            <h3>
              <i className="fas fa-brain"></i>
              Smart Transport Insights
            </h3>
            <div className="insights-list-transport">
              {aiInsights.map((insight, index) => (
                <div key={index} className={`insight-item-transport ${insight.severity}`}>
                  <div className="insight-icon-transport" style={{ color: insight.color }}>
                    <i className={`fas ${insight.icon}`}></i>
                  </div>
                  <div className="insight-content-transport">
                    <h4>{insight.title}</h4>
                    <p>{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="quick-actions-card">
            <h3>
              <i className="fas fa-bolt"></i>
              Quick Actions
            </h3>
            <div className="actions-grid">
              <button className="action-btn notify" onClick={() => setShowNotifyModal(true)}>
                <i className="fas fa-bell"></i>
                <span>Notify Driver</span>
              </button>
              <button className="action-btn emergency" onClick={handleEmergencyContact}>
                <i className="fas fa-phone-alt"></i>
                <span>Emergency Call</span>
              </button>
              <button className="action-btn report" onClick={handleReportIssue}>
                <i className="fas fa-exclamation-triangle"></i>
                <span>Report Issue</span>
              </button>
              <button className="action-btn share" onClick={handleShareLocation}>
                <i className="fas fa-share-alt"></i>
                <span>Share Location</span>
              </button>
              <button className="action-btn download" onClick={handleDownloadReport}>
                <i className="fas fa-download"></i>
                <span>Download Report</span>
              </button>
              <button className="action-btn settings" onClick={() => showToast('Settings opened', 'info')}>
                <i className="fas fa-cog"></i>
                <span>Alert Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Boarding & Alighting Alerts */}
      <div className="alerts-section-parent">
        <div className="alerts-header-parent">
          <div className="alerts-title-parent">
            <i className="fas fa-bell"></i>
            <h3>Today's Boarding & Alighting</h3>
            <span className="alerts-count-parent">{todayAlerts.length} alerts</span>
          </div>
          <button className="view-history-btn" onClick={() => setShowAlertHistory(!showAlertHistory)}>
            <i className={`fas fa-${showAlertHistory ? 'chevron-up' : 'history'}`}></i>
            {showAlertHistory ? 'Hide History' : 'View History'}
          </button>
        </div>

        <div className="alerts-list-parent">
          {todayAlerts.length > 0 ? (
            todayAlerts.map((alert) => (
              <div key={alert.id} className={`alert-item-parent ${alert.type}`}>
                <div className={`alert-icon-parent ${alert.type}`}>
                  <i className={`fas ${alert.type === 'boarding' ? 'fa-sign-in-alt' : 'fa-sign-out-alt'}`}></i>
                </div>
                <div className="alert-details-parent">
                  <div className="alert-main-parent">
                    <h4>{currentChild.name}</h4>
                    <span className="alert-type-badge-parent">
                      {alert.type === 'boarding' ? 'Boarded Bus' : 'Alighted at School'}
                    </span>
                  </div>
                  <div className="alert-info-parent">
                    <span><i className="fas fa-bus"></i> {alert.busNumber}</span>
                    <span><i className="fas fa-map-marker-alt"></i> {alert.location}</span>
                    <span><i className="fas fa-clock"></i> {alert.timestamp}</span>
                    <span className={`notification-status-parent ${alert.notificationSent ? 'sent' : 'pending'}`}>
                      <i className={`fas ${alert.notificationSent ? 'fa-check-circle' : 'fa-clock'}`}></i>
                      {alert.notificationSent ? 'Notified' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-alerts-parent">
              <i className="fas fa-info-circle"></i>
              <p>No boarding or alighting alerts for today yet.</p>
            </div>
          )}
        </div>

        {/* Alert History */}
        {showAlertHistory && (
          <div className="alert-history-section">
            <h4><i className="fas fa-history"></i> Last 7 Days</h4>
            <div className="history-list">
              {alertHistory.slice(1).map((alert) => (
                <div key={alert.id} className="history-item">
                  <div className="history-date">
                    {new Date(alert.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className={`history-type ${alert.type}`}>
                    <i className={`fas ${alert.type === 'boarding' ? 'fa-sign-in-alt' : 'fa-sign-out-alt'}`}></i>
                    {alert.type === 'boarding' ? 'Boarded' : 'Alighted'}
                  </div>
                  <div className="history-time">{alert.timestamp}</div>
                  <div className="history-location">{alert.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Monthly Statistics */}
      <div className="monthly-stats-section">
        <div className="stats-header">
          <h3>
            <i className="fas fa-chart-line"></i>
            Monthly Transport Statistics
          </h3>
          <span className="stats-period">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>

        <div className="stats-grid-parent">
          <div className="stat-card-parent">
            <div className="stat-icon-parent ontime">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-content-parent">
              <span className="stat-value-parent">{monthlyStats.onTimePickups}/{monthlyStats.totalDays}</span>
              <span className="stat-label-parent">On-Time Pickups</span>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${(monthlyStats.onTimePickups / monthlyStats.totalDays) * 100}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card-parent">
            <div className="stat-icon-parent journey">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-content-parent">
              <span className="stat-value-parent">{monthlyStats.avgJourneyTime} mins</span>
              <span className="stat-label-parent">Avg Journey Time</span>
              <span className="stat-trend">
                <i className="fas fa-arrow-down"></i> 2 mins faster than last month
              </span>
            </div>
          </div>

          <div className="stat-card-parent">
            <div className="stat-icon-parent distance">
              <i className="fas fa-road"></i>
            </div>
            <div className="stat-content-parent">
              <span className="stat-value-parent">{monthlyStats.totalDistance} km</span>
              <span className="stat-label-parent">Total Distance</span>
              <span className="stat-trend">
                <i className="fas fa-route"></i> {monthlyStats.totalDays} trips completed
              </span>
            </div>
          </div>

          <div className="stat-card-parent">
            <div className="stat-icon-parent notifications">
              <i className="fas fa-bell"></i>
            </div>
            <div className="stat-content-parent">
              <span className="stat-value-parent">{monthlyStats.notificationsDelivered}%</span>
              <span className="stat-label-parent">Notifications Delivered</span>
              <span className="stat-trend">
                <i className="fas fa-check-circle"></i> All alerts received
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Driver Modal */}
      {showDriverModal && (
        <div className="modal-overlay" onClick={() => setShowDriverModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-user-tie"></i>
                Driver Information
              </h2>
              <button className="modal-close-btn" onClick={() => setShowDriverModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="driver-info-modal">
                <div className="driver-avatar">
                  <i className="fas fa-user-circle"></i>
                </div>
                <div className="driver-details-modal">
                  <h3>{busLocation.driver.name}</h3>
                  <p className="driver-experience">
                    <i className="fas fa-award"></i>
                    {busLocation.driver.experience} of experience
                  </p>
                  <div className="driver-contact-info">
                    <div className="contact-item">
                      <i className="fas fa-phone"></i>
                      <span>{busLocation.driver.contact}</span>
                    </div>
                    <div className="contact-item">
                      <i className="fas fa-bus"></i>
                      <span>{busLocation.busNumber} - {currentChild.route}</span>
                    </div>
                  </div>
                  <button className="call-driver-btn" onClick={() => showToast('Calling driver...', 'info')}>
                    <i className="fas fa-phone-alt"></i>
                    Call Driver
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notify Driver Modal */}
      {showNotifyModal && (
        <div className="modal-overlay" onClick={() => setShowNotifyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <i className="fas fa-bell"></i>
                Notify Driver
              </h2>
              <button className="modal-close-btn" onClick={() => setShowNotifyModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="notify-form">
                <label>Message to Driver</label>
                <textarea
                  placeholder="e.g., My child will be absent today..."
                  value={notifyMessage}
                  onChange={(e) => setNotifyMessage(e.target.value)}
                  rows={4}
                ></textarea>
                <div className="quick-messages">
                  <p>Quick messages:</p>
                  <button onClick={() => setNotifyMessage(`${currentChild.name} will be absent today.`)}>
                    Child Absent
                  </button>
                  <button onClick={() => setNotifyMessage(`${currentChild.name} will be late by 10 minutes.`)}>
                    Running Late
                  </button>
                  <button onClick={() => setNotifyMessage(`${currentChild.name} won't need pickup today.`)}>
                    No Pickup Needed
                  </button>
                </div>
                <button className="send-notification-btn" onClick={handleNotifyDriver}>
                  <i className="fas fa-paper-plane"></i>
                  Send Notification
                </button>
              </div>
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

export default TransportTracking;
