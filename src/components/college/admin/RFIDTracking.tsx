import { useState, useEffect } from 'react';

interface Bus {
  id: string;
  busNumber: string;
  route: string;
  driver: string;
  status: 'active' | 'stopped' | 'maintenance';
  currentStop: string;
  studentsOnBoard: number;
  totalCapacity: number;
  lastUpdate: string;
  eta: string;
  location: {
    lat: number;
    lng: number;
  };
}

interface StudentAlert {
  id: string;
  studentName: string;
  studentId: string;
  busNumber: string;
  type: 'boarding' | 'alighting';
  timestamp: string;
  location: string;
  parentNotified: boolean;
}

interface Route {
  id: string;
  name: string;
  totalStops: number;
  activeBuses: number;
  studentsAssigned: number;
}

const RFIDTracking = () => {
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [alertFilter, setAlertFilter] = useState<'all' | 'boarding' | 'alighting'>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [lastRefreshTime, setLastRefreshTime] = useState<string>(new Date().toLocaleTimeString());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showSMSPopup, setShowSMSPopup] = useState(false);
  const [smsMessage, setSmsMessage] = useState('');
  const [showAddRouteModal, setShowAddRouteModal] = useState(false);
  const [newRouteData, setNewRouteData] = useState({
    name: '',
    zone: '',
    totalStops: '',
    assignedBus: '',
    driver: ''
  });

  // Animated impact stats
  const [parentQueries, setParentQueries] = useState(0);
  const targetQueries = 80;

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      setParentQueries(Math.floor(targetQueries * progress));

      if (currentStep >= steps) {
        setParentQueries(targetQueries);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh) {
      const refreshInterval = setInterval(() => {
        refreshMap();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(refreshInterval);
    }
  }, [autoRefresh]);

  const buses: Bus[] = [
    {
      id: '1',
      busNumber: 'BUS-001',
      route: 'Route A - Downtown',
      driver: 'Rajesh Kumar',
      status: 'active',
      currentStop: 'Main Street Stop',
      studentsOnBoard: 42,
      totalCapacity: 50,
      lastUpdate: '2 mins ago',
      eta: '5 mins',
      location: { lat: 28.6139, lng: 77.2090 }
    },
    {
      id: '2',
      busNumber: 'BUS-002',
      route: 'Route B - Suburbs',
      driver: 'Amit Sharma',
      status: 'active',
      currentStop: 'Park Avenue',
      studentsOnBoard: 38,
      totalCapacity: 50,
      lastUpdate: '1 min ago',
      eta: '8 mins',
      location: { lat: 28.6200, lng: 77.2150 }
    },
    {
      id: '3',
      busNumber: 'BUS-003',
      route: 'Route C - East Zone',
      driver: 'Priya Desai',
      status: 'stopped',
      currentStop: 'School Gate',
      studentsOnBoard: 0,
      totalCapacity: 45,
      lastUpdate: '5 mins ago',
      eta: 'Arrived',
      location: { lat: 28.6100, lng: 77.2000 }
    },
    {
      id: '4',
      busNumber: 'BUS-004',
      route: 'Route D - West Zone',
      driver: 'Mohammed Ali',
      status: 'active',
      currentStop: 'Market Square',
      studentsOnBoard: 35,
      totalCapacity: 50,
      lastUpdate: '3 mins ago',
      eta: '12 mins',
      location: { lat: 28.6050, lng: 77.2200 }
    },
    {
      id: '5',
      busNumber: 'BUS-005',
      route: 'Route E - North Zone',
      driver: 'Sunita Verma',
      status: 'maintenance',
      currentStop: 'Bus Depot',
      studentsOnBoard: 0,
      totalCapacity: 50,
      lastUpdate: '1 hour ago',
      eta: 'N/A',
      location: { lat: 28.6300, lng: 77.2100 }
    }
  ];

  const recentAlerts: StudentAlert[] = [
    {
      id: '1',
      studentName: 'Aarav Sharma',
      studentId: 'STU2024001',
      busNumber: 'BUS-001',
      type: 'boarding',
      timestamp: '08:15 AM',
      location: 'Main Street Stop',
      parentNotified: true
    },
    {
      id: '2',
      studentName: 'Diya Patel',
      studentId: 'STU2024002',
      busNumber: 'BUS-002',
      type: 'boarding',
      timestamp: '08:12 AM',
      location: 'Park Avenue',
      parentNotified: true
    },
    {
      id: '3',
      studentName: 'Rohan Kumar',
      studentId: 'STU2024003',
      busNumber: 'BUS-001',
      type: 'alighting',
      timestamp: '08:10 AM',
      location: 'School Gate',
      parentNotified: true
    },
    {
      id: '4',
      studentName: 'Priya Singh',
      studentId: 'STU2024004',
      busNumber: 'BUS-004',
      type: 'boarding',
      timestamp: '08:08 AM',
      location: 'Market Square',
      parentNotified: true
    },
    {
      id: '5',
      studentName: 'Arjun Verma',
      studentId: 'STU2024005',
      busNumber: 'BUS-002',
      type: 'boarding',
      timestamp: '08:05 AM',
      location: 'Cedar Street',
      parentNotified: true
    },
    {
      id: '6',
      studentName: 'Ananya Reddy',
      studentId: 'STU2024006',
      busNumber: 'BUS-003',
      type: 'alighting',
      timestamp: '08:02 AM',
      location: 'School Gate',
      parentNotified: false
    }
  ];

  const routes: Route[] = [
    { id: '1', name: 'Route A - Downtown', totalStops: 12, activeBuses: 1, studentsAssigned: 45 },
    { id: '2', name: 'Route B - Suburbs', totalStops: 15, activeBuses: 1, studentsAssigned: 52 },
    { id: '3', name: 'Route C - East Zone', totalStops: 10, activeBuses: 1, studentsAssigned: 38 },
    { id: '4', name: 'Route D - West Zone', totalStops: 14, activeBuses: 1, studentsAssigned: 48 },
    { id: '5', name: 'Route E - North Zone', totalStops: 11, activeBuses: 0, studentsAssigned: 40 }
  ];

  const filteredAlerts = alertFilter === 'all'
    ? recentAlerts
    : recentAlerts.filter(alert => alert.type === alertFilter);

  const activeBuses = buses.filter(b => b.status === 'active').length;
  const totalStudents = buses.reduce((sum, bus) => sum + bus.studentsOnBoard, 0);
  const todayAlerts = recentAlerts.length;

  const toggleAutoRefresh = () => {
    const newState = !autoRefresh;
    setAutoRefresh(newState);
    if (newState) {
      // Trigger immediate refresh when enabling
      refreshMap();
    }
  };

  const refreshMap = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastRefreshTime(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }, 1500); // Simulate loading for 1.5 seconds
  };

  const sendTestSMS = (alert: StudentAlert) => {
    const message = alert.type === 'boarding'
      ? `Your child ${alert.studentName} has boarded ${alert.busNumber} at ${alert.location} (${alert.timestamp}). ETA to school: 15 mins.`
      : `Your child ${alert.studentName} has safely reached school and alighted from ${alert.busNumber} at ${alert.timestamp}.`;

    setSmsMessage(`SMS sent to parent of ${alert.studentName}\n\n${message}`);
    setShowSMSPopup(true);

    // Auto-hide popup after 4 seconds
    setTimeout(() => {
      setShowSMSPopup(false);
    }, 4000);
  };

  const handleAddRouteSubmit = () => {
    if (!newRouteData.name || !newRouteData.zone) {
      alert('Please fill in at least Route Name and Zone');
      return;
    }
    // Here you would normally save the route data
    console.log('New Route Data:', newRouteData);

    // Reset form and close modal
    setNewRouteData({
      name: '',
      zone: '',
      totalStops: '',
      assignedBus: '',
      driver: ''
    });
    setShowAddRouteModal(false);

    // Show success message
    setSmsMessage(`Route "${newRouteData.name}" has been created successfully!`);
    setShowSMSPopup(true);
    setTimeout(() => {
      setShowSMSPopup(false);
    }, 3000);
  };

  const viewRouteDetails = (route: Route) => {
    setSelectedRoute(route);
  };

  const editRoute = (route: Route) => {
    alert(`Edit Route: ${route.name}\n\n` +
      `This would open an editor to modify:\n\n` +
      `• Route name and description\n` +
      `• Add/remove bus stops\n` +
      `• Adjust stop timings\n` +
      `• Assign/reassign buses\n` +
      `• Update student assignments\n` +
      `• Modify route path on map`);
  };

  const addNewRoute = () => {
    setShowAddRouteModal(true);
  };

  return (
    <div className="rfid-tracking-page">
      {/* Impact Stats */}
      <div className="tracking-stats-grid">
        <div className="tracking-stat-card reduction">
          <div className="stat-icon">
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Parent Query Reduction</span>
            <span className="stat-value">{parentQueries}%</span>
            <span className="stat-trend"><i className="fas fa-arrow-down"></i> Compared to last year</span>
          </div>
        </div>

        <div className="tracking-stat-card buses">
          <div className="stat-icon">
            <i className="fas fa-bus"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Active Buses</span>
            <span className="stat-value">{activeBuses}</span>
            <span className="stat-trend"><i className="fas fa-check-circle"></i> All tracked in real-time</span>
          </div>
        </div>

        <div className="tracking-stat-card students">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Students On Board</span>
            <span className="stat-value">{totalStudents}</span>
            <span className="stat-trend"><i className="fas fa-route"></i> Across {routes.length} routes</span>
          </div>
        </div>

        <div className="tracking-stat-card alerts">
          <div className="stat-icon">
            <i className="fas fa-bell"></i>
          </div>
          <div className="stat-content">
            <span className="stat-label">Alerts Today</span>
            <span className="stat-value">{todayAlerts}</span>
            <span className="stat-trend"><i className="fas fa-mobile-alt"></i> SMS notifications sent</span>
          </div>
        </div>
      </div>

      {/* Main Tracking Grid */}
      <div className="tracking-main-grid">
        {/* Live Bus Tracking Map */}
        <div className="live-map-card">
          <div className="map-header">
            <div className="map-title">
              <i className="fas fa-map-marked-alt"></i>
              <h3>Live Bus Tracking</h3>
            </div>
            <div className="map-controls">
              <button className={`refresh-btn ${autoRefresh ? 'active' : ''}`} onClick={toggleAutoRefresh}>
                <i className="fas fa-sync-alt"></i>
                Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
              </button>
              <span className="last-refresh-time">
                <i className="fas fa-clock"></i> Last updated: {lastRefreshTime}
              </span>
            </div>
          </div>

          <div className="map-container">
            {isRefreshing && (
              <div className="map-loading-overlay">
                <div className="loading-spinner-map">
                  <i className="fas fa-sync-alt fa-spin"></i>
                </div>
                <p>Refreshing map data...</p>
              </div>
            )}
            <div className="map-visual">
              {/* Background grid to simulate map */}
              <div className="map-grid"></div>

              {/* Simulated roads */}
              <div className="map-road horizontal" style={{ top: '20%' }}></div>
              <div className="map-road horizontal" style={{ top: '50%' }}></div>
              <div className="map-road horizontal" style={{ top: '80%' }}></div>
              <div className="map-road vertical" style={{ left: '30%' }}></div>
              <div className="map-road vertical" style={{ left: '70%' }}></div>

              {/* School location */}
              <div className="map-marker school" style={{ top: '50%', left: '50%' }}>
                <i className="fas fa-school"></i>
                <span className="marker-label">School</span>
              </div>

              {/* Bus markers for active buses */}
              {buses.filter(b => b.status === 'active').map((bus, idx) => {
                const positions = [
                  { top: '15%', left: '25%' },
                  { top: '45%', left: '65%' },
                  { top: '75%', left: '35%' },
                  { top: '25%', left: '75%' }
                ];
                const pos = positions[idx] || { top: '50%', left: '50%' };

                return (
                  <div
                    key={bus.id}
                    className={`map-marker bus ${selectedBus?.id === bus.id ? 'selected' : ''}`}
                    style={{ top: pos.top, left: pos.left }}
                    onClick={() => setSelectedBus(bus)}
                  >
                    <i className="fas fa-bus"></i>
                    <span className="marker-label">{bus.busNumber}</span>
                    <div className="bus-pulse"></div>
                  </div>
                );
              })}

              {/* Bus stops */}
              {['Main Street', 'Park Avenue', 'Market Square', 'Cedar Street'].map((stop, idx) => {
                const stopPositions = [
                  { top: '20%', left: '30%' },
                  { top: '50%', left: '70%' },
                  { top: '80%', left: '30%' },
                  { top: '20%', left: '70%' }
                ];
                const pos = stopPositions[idx];

                return (
                  <div
                    key={idx}
                    className="map-marker stop"
                    style={{ top: pos.top, left: pos.left }}
                  >
                    <i className="fas fa-map-pin"></i>
                    <span className="marker-label">{stop}</span>
                  </div>
                );
              })}
            </div>

            {/* Map Overlay Info */}
            <div className="map-overlay-stats">
              <div className="overlay-stat">
                <i className="fas fa-bus"></i>
                <span>{activeBuses} Active</span>
              </div>
              <div className="overlay-stat">
                <i className="fas fa-pause-circle"></i>
                <span>{buses.filter(b => b.status === 'stopped').length} Stopped</span>
              </div>
              <div className="overlay-stat maintenance">
                <i className="fas fa-tools"></i>
                <span>{buses.filter(b => b.status === 'maintenance').length} Maintenance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bus Fleet Status */}
        <div className="fleet-status-card">
          <div className="fleet-header">
            <div className="fleet-title">
              <i className="fas fa-list-ul"></i>
              <h3>Bus Fleet Status</h3>
            </div>
            <span className="live-indicator">
              <i className="fas fa-circle"></i> LIVE
            </span>
          </div>

          <div className="fleet-list">
            {buses.map((bus) => (
              <div
                key={bus.id}
                className={`bus-item ${selectedBus?.id === bus.id ? 'selected' : ''} ${bus.status}`}
                onClick={() => setSelectedBus(bus)}
              >
                <div className="bus-item-header">
                  <div className="bus-number">
                    <i className="fas fa-bus"></i>
                    <span>{bus.busNumber}</span>
                  </div>
                  <span className={`bus-status-badge ${bus.status}`}>
                    {bus.status === 'active' && <><i className="fas fa-circle"></i> Active</>}
                    {bus.status === 'stopped' && <><i className="fas fa-pause-circle"></i> Stopped</>}
                    {bus.status === 'maintenance' && <><i className="fas fa-tools"></i> Maintenance</>}
                  </span>
                </div>

                <div className="bus-route">{bus.route}</div>

                <div className="bus-details">
                  <div className="detail-item">
                    <i className="fas fa-map-pin"></i>
                    <span>{bus.currentStop}</span>
                  </div>
                  <div className="detail-item">
                    <i className="fas fa-user-tie"></i>
                    <span>{bus.driver}</span>
                  </div>
                </div>

                <div className="bus-capacity">
                  <div className="capacity-info">
                    <span className="capacity-label">Occupancy</span>
                    <span className="capacity-value">{bus.studentsOnBoard}/{bus.totalCapacity}</span>
                  </div>
                  <div className="capacity-bar">
                    <div
                      className="capacity-fill"
                      style={{ width: `${(bus.studentsOnBoard / bus.totalCapacity) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bus-footer">
                  <span className="last-update">
                    <i className="fas fa-clock"></i> {bus.lastUpdate}
                  </span>
                  {bus.status === 'active' && (
                    <span className="eta">
                      ETA: {bus.eta}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Alerts Section */}
      <div className="alerts-section">
        <div className="alerts-header">
          <div className="alerts-title">
            <i className="fas fa-bell"></i>
            <h3>Recent RFID Alerts</h3>
            <span className="alerts-count">{filteredAlerts.length} alerts</span>
          </div>

          <div className="alert-filters">
            <button
              className={`filter-chip ${alertFilter === 'all' ? 'active' : ''}`}
              onClick={() => setAlertFilter('all')}
            >
              All Alerts
            </button>
            <button
              className={`filter-chip ${alertFilter === 'boarding' ? 'active' : ''}`}
              onClick={() => setAlertFilter('boarding')}
            >
              <i className="fas fa-sign-in-alt"></i> Boarding
            </button>
            <button
              className={`filter-chip ${alertFilter === 'alighting' ? 'active' : ''}`}
              onClick={() => setAlertFilter('alighting')}
            >
              <i className="fas fa-sign-out-alt"></i> Alighting
            </button>
          </div>
        </div>

        <div className="alerts-list">
          {filteredAlerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.type}`}>
              <div className={`alert-icon ${alert.type}`}>
                <i className={`fas ${alert.type === 'boarding' ? 'fa-sign-in-alt' : 'fa-sign-out-alt'}`}></i>
              </div>

              <div className="alert-details">
                <div className="alert-main">
                  <h4>{alert.studentName}</h4>
                  <span className="alert-type-badge">
                    {alert.type === 'boarding' ? 'Boarded' : 'Alighted'}
                  </span>
                </div>

                <div className="alert-info">
                  <span className="info-item">
                    <i className="fas fa-id-card"></i> {alert.studentId}
                  </span>
                  <span className="info-item">
                    <i className="fas fa-bus"></i> {alert.busNumber}
                  </span>
                  <span className="info-item">
                    <i className="fas fa-map-marker-alt"></i> {alert.location}
                  </span>
                  <span className="info-item">
                    <i className="fas fa-clock"></i> {alert.timestamp}
                  </span>
                </div>
              </div>

              <div className="alert-actions">
                <div className={`notification-status ${alert.parentNotified ? 'sent' : 'pending'}`}>
                  <i className={`fas ${alert.parentNotified ? 'fa-check-circle' : 'fa-clock'}`}></i>
                  {alert.parentNotified ? 'Parent Notified' : 'Pending'}
                </div>
                <button className="resend-btn" onClick={() => sendTestSMS(alert)}>
                  <i className="fas fa-paper-plane"></i>
                  Test SMS
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Management */}
      <div className="routes-management-card">
        <div className="routes-header">
          <div className="routes-title">
            <i className="fas fa-route"></i>
            <h3>Route Management</h3>
          </div>
          <button className="add-route-btn" onClick={addNewRoute}>
            <i className="fas fa-plus"></i>
            Add Route
          </button>
        </div>

        <div className="routes-grid">
          {routes.map((route) => (
            <div key={route.id} className="route-card">
              <div className="route-header">
                <h4>{route.name}</h4>
                <span className={`route-status ${route.activeBuses > 0 ? 'active' : 'inactive'}`}>
                  {route.activeBuses > 0 ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div className="route-stats">
                <div className="route-stat">
                  <i className="fas fa-map-signs"></i>
                  <div>
                    <span className="stat-value">{route.totalStops}</span>
                    <span className="stat-label">Total Stops</span>
                  </div>
                </div>
                <div className="route-stat">
                  <i className="fas fa-bus"></i>
                  <div>
                    <span className="stat-value">{route.activeBuses}</span>
                    <span className="stat-label">Active Buses</span>
                  </div>
                </div>
                <div className="route-stat">
                  <i className="fas fa-users"></i>
                  <div>
                    <span className="stat-value">{route.studentsAssigned}</span>
                    <span className="stat-label">Students</span>
                  </div>
                </div>
              </div>

              <div className="route-actions">
                <button className="route-action-btn" onClick={() => viewRouteDetails(route)}>
                  <i className="fas fa-eye"></i>
                  View Details
                </button>
                <button className="route-action-btn" onClick={() => editRoute(route)}>
                  <i className="fas fa-edit"></i>
                  Edit Route
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Route Details Modal */}
      {selectedRoute && (
        <div className="route-modal-overlay" onClick={() => setSelectedRoute(null)}>
          <div className="route-modal" onClick={(e) => e.stopPropagation()}>
            <div className="route-modal-header">
              <div>
                <h2>{selectedRoute.name}</h2>
                <span className={`route-modal-status ${selectedRoute.activeBuses > 0 ? 'active' : 'inactive'}`}>
                  {selectedRoute.activeBuses > 0 ? 'Active Route' : 'Inactive Route'}
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedRoute(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="route-modal-content">
              {/* Quick Stats */}
              <div className="route-modal-stats">
                <div className="route-modal-stat">
                  <div className="stat-icon-small">
                    <i className="fas fa-map-signs"></i>
                  </div>
                  <div>
                    <span className="stat-value-small">{selectedRoute.totalStops}</span>
                    <span className="stat-label-small">Total Stops</span>
                  </div>
                </div>
                <div className="route-modal-stat">
                  <div className="stat-icon-small">
                    <i className="fas fa-bus"></i>
                  </div>
                  <div>
                    <span className="stat-value-small">{selectedRoute.activeBuses}</span>
                    <span className="stat-label-small">Active Buses</span>
                  </div>
                </div>
                <div className="route-modal-stat">
                  <div className="stat-icon-small">
                    <i className="fas fa-users"></i>
                  </div>
                  <div>
                    <span className="stat-value-small">{selectedRoute.studentsAssigned}</span>
                    <span className="stat-label-small">Students Assigned</span>
                  </div>
                </div>
              </div>

              {/* Bus Stops Timeline */}
              <div className="route-section">
                <h3><i className="fas fa-map-marker-alt"></i> Bus Stops</h3>
                <div className="stops-timeline">
                  {Array.from({ length: selectedRoute.totalStops }, (_, i) => (
                    <div key={i} className="stop-item">
                      <div className="stop-number">{i + 1}</div>
                      <div className="stop-details">
                        <h4>Stop {i + 1} - {['Main Street', 'Park Avenue', 'Market Square', 'Cedar Street', 'School Gate', 'Railway Station', 'Central Plaza', 'Library Road', 'Hospital Junction', 'Garden View', 'Sports Complex', 'Mall Road'][i % 12]}</h4>
                        <p className="stop-time">
                          <i className="fas fa-clock"></i> {7 + Math.floor(i * 0.5)}:{(i * 5) % 60 < 10 ? '0' : ''}{(i * 5) % 60} AM
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Buses */}
              <div className="route-section">
                <h3><i className="fas fa-bus"></i> Assigned Buses</h3>
                <div className="assigned-buses-list">
                  {buses.filter(bus => bus.route === selectedRoute.name).map((bus) => (
                    <div key={bus.id} className="assigned-bus-item">
                      <div className="assigned-bus-header">
                        <div className="bus-badge">
                          <i className="fas fa-bus"></i>
                          {bus.busNumber}
                        </div>
                        <span className={`status-badge-small ${bus.status}`}>
                          {bus.status}
                        </span>
                      </div>
                      <div className="assigned-bus-info">
                        <span><i className="fas fa-user-tie"></i> Driver: {bus.driver}</span>
                        <span><i className="fas fa-users"></i> Capacity: {bus.studentsOnBoard}/{bus.totalCapacity}</span>
                        <span><i className="fas fa-map-pin"></i> Current: {bus.currentStop}</span>
                      </div>
                    </div>
                  ))}
                  {buses.filter(bus => bus.route === selectedRoute.name).length === 0 && (
                    <div className="no-buses-assigned">
                      <i className="fas fa-info-circle"></i>
                      <p>No buses currently assigned to this route</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Student Information */}
              <div className="route-section">
                <h3><i className="fas fa-user-graduate"></i> Student Information</h3>
                <div className="student-summary">
                  <div className="summary-item">
                    <i className="fas fa-users"></i>
                    <span><strong>{selectedRoute.studentsAssigned}</strong> students assigned to this route</span>
                  </div>
                  <div className="summary-item">
                    <i className="fas fa-map-signs"></i>
                    <span>Students distributed across <strong>{selectedRoute.totalStops}</strong> pickup points</span>
                  </div>
                  <div className="summary-item">
                    <i className="fas fa-bell"></i>
                    <span>All parents receive real-time RFID notifications</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="route-modal-footer">
              <button className="modal-action-btn secondary" onClick={() => setSelectedRoute(null)}>
                <i className="fas fa-times"></i>
                Close
              </button>
              <button className="modal-action-btn primary" onClick={() => {
                setSelectedRoute(null);
                editRoute(selectedRoute);
              }}>
                <i className="fas fa-edit"></i>
                Edit Route
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SMS Success Popup */}
      {showSMSPopup && (
        <div className="sms-popup">
          <div className="sms-popup-content">
            <div className="sms-popup-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <p>{smsMessage}</p>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {showAddRouteModal && (
        <div className="route-modal-overlay" onClick={() => setShowAddRouteModal(false)}>
          <div className="route-modal add-route-modal" onClick={(e) => e.stopPropagation()}>
            <div className="route-modal-header">
              <div>
                <h2>Add New Route</h2>
                <span className="modal-subtitle">Create a new bus route for your school</span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAddRouteModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="route-modal-content">
              <div className="add-route-form">
                <div className="form-row">
                  <div className="form-group-route">
                    <label>
                      <i className="fas fa-route"></i>
                      Route Name *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Route A - Downtown"
                      value={newRouteData.name}
                      onChange={(e) => setNewRouteData({ ...newRouteData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group-route">
                    <label>
                      <i className="fas fa-map-marked-alt"></i>
                      Zone *
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., North Zone"
                      value={newRouteData.zone}
                      onChange={(e) => setNewRouteData({ ...newRouteData, zone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group-route">
                    <label>
                      <i className="fas fa-map-signs"></i>
                      Total Stops
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 12"
                      value={newRouteData.totalStops}
                      onChange={(e) => setNewRouteData({ ...newRouteData, totalStops: e.target.value })}
                    />
                  </div>

                  <div className="form-group-route">
                    <label>
                      <i className="fas fa-bus"></i>
                      Assigned Bus
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., BUS-006"
                      value={newRouteData.assignedBus}
                      onChange={(e) => setNewRouteData({ ...newRouteData, assignedBus: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group-route full-width">
                  <label>
                    <i className="fas fa-user-tie"></i>
                    Driver Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Ramesh Kumar"
                    value={newRouteData.driver}
                    onChange={(e) => setNewRouteData({ ...newRouteData, driver: e.target.value })}
                  />
                </div>

                <div className="form-info-box">
                  <i className="fas fa-info-circle"></i>
                  <p>After creating the route, you'll be able to add bus stops, set timings, and assign students.</p>
                </div>
              </div>
            </div>

            <div className="route-modal-footer">
              <button className="modal-action-btn secondary" onClick={() => setShowAddRouteModal(false)}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button className="modal-action-btn primary" onClick={handleAddRouteSubmit}>
                <i className="fas fa-plus"></i>
                Create Route
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RFIDTracking;
