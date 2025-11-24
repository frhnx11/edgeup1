import { useState, useEffect } from 'react';

interface StationeryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  consumed: number;
  wasted: number;
  wastagePercentage: number;
  costPerUnit: number;
  totalCost: number;
  wastageCost: number;
  status: 'critical' | 'warning' | 'normal';
}

interface WastageAlert {
  id: string;
  itemName: string;
  category: string;
  alertType: 'high-wastage' | 'low-stock' | 'unusual-consumption';
  severity: 'high' | 'medium' | 'low';
  message: string;
  timestamp: string;
  department: string;
  resolved: boolean;
}

interface ConsumptionPattern {
  month: string;
  consumed: number;
  wasted: number;
}

const StationeryWastage = () => {
  const [selectedItem, setSelectedItem] = useState<StationeryItem | null>(null);
  const [showAlertDetail, setShowAlertDetail] = useState<WastageAlert | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Animated stats
  const [wasteReduction, setWasteReduction] = useState(0);
  const [costSavings, setCostSavings] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setWasteReduction((prev) => (prev < 18 ? prev + 1 : 18));
      setCostSavings((prev) => (prev < 165000 ? prev + 2000 : 165000));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const stationeryItems: StationeryItem[] = [
    {
      id: '1',
      name: 'A4 Paper Reams',
      category: 'Paper',
      currentStock: 150,
      consumed: 450,
      wasted: 90,
      wastagePercentage: 20,
      costPerUnit: 250,
      totalCost: 112500,
      wastageCost: 22500,
      status: 'critical'
    },
    {
      id: '2',
      name: 'Blue Pens',
      category: 'Writing',
      currentStock: 500,
      consumed: 1200,
      wasted: 180,
      wastagePercentage: 15,
      costPerUnit: 10,
      totalCost: 12000,
      wastageCost: 1800,
      status: 'warning'
    },
    {
      id: '3',
      name: 'Notebooks',
      category: 'Books',
      currentStock: 300,
      consumed: 800,
      wasted: 120,
      wastagePercentage: 15,
      costPerUnit: 50,
      totalCost: 40000,
      wastageCost: 6000,
      status: 'warning'
    },
    {
      id: '4',
      name: 'Whiteboard Markers',
      category: 'Writing',
      currentStock: 120,
      consumed: 300,
      wasted: 24,
      wastagePercentage: 8,
      costPerUnit: 30,
      totalCost: 9000,
      wastageCost: 720,
      status: 'normal'
    },
    {
      id: '5',
      name: 'Chart Papers',
      category: 'Paper',
      currentStock: 200,
      consumed: 500,
      wasted: 100,
      wastagePercentage: 20,
      costPerUnit: 15,
      totalCost: 7500,
      wastageCost: 1500,
      status: 'critical'
    },
    {
      id: '6',
      name: 'Erasers',
      category: 'Writing',
      currentStock: 400,
      consumed: 600,
      wasted: 60,
      wastagePercentage: 10,
      costPerUnit: 5,
      totalCost: 3000,
      wastageCost: 300,
      status: 'normal'
    }
  ];

  const wastageAlerts: WastageAlert[] = [
    {
      id: '1',
      itemName: 'A4 Paper Reams',
      category: 'Paper',
      alertType: 'high-wastage',
      severity: 'high',
      message: '20% wastage detected - 90 reams wasted this month',
      timestamp: '2 hours ago',
      department: 'Administration',
      resolved: false
    },
    {
      id: '2',
      itemName: 'Chart Papers',
      category: 'Paper',
      alertType: 'high-wastage',
      severity: 'high',
      message: '20% wastage detected - Review usage patterns',
      timestamp: '4 hours ago',
      department: 'Art Department',
      resolved: false
    },
    {
      id: '3',
      itemName: 'Blue Pens',
      category: 'Writing',
      alertType: 'unusual-consumption',
      severity: 'medium',
      message: 'Consumption 30% higher than average this week',
      timestamp: '6 hours ago',
      department: 'Primary Section',
      resolved: false
    },
    {
      id: '4',
      itemName: 'Notebooks',
      category: 'Books',
      alertType: 'low-stock',
      severity: 'medium',
      message: 'Stock running low - Order within 5 days',
      timestamp: '1 day ago',
      department: 'Stores',
      resolved: true
    },
    {
      id: '5',
      itemName: 'Whiteboard Markers',
      category: 'Writing',
      alertType: 'low-stock',
      severity: 'low',
      message: 'Stock below reorder level',
      timestamp: '2 days ago',
      department: 'Stores',
      resolved: true
    }
  ];

  const filteredItems = stationeryItems.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    return categoryMatch && statusMatch;
  });

  const resolveAlert = (alertId: string) => {
    setNotificationMessage(
      `Alert Resolved!\n\nThe wastage alert has been marked as resolved.\n\nAction will be logged in the system.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const generateReport = (item: StationeryItem) => {
    setNotificationMessage(
      `Generating Wastage Report...\n\n${item.name}\n\nWastage: ${item.wastagePercentage}%\nCost Impact: ₹${item.wastageCost.toLocaleString()}`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3500);
  };

  const setReorderAlert = (item: StationeryItem) => {
    setNotificationMessage(
      `Reorder Alert Set!\n\n${item.name}\n\nYou'll be notified when stock reaches reorder level.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const analyzePattern = (item: StationeryItem) => {
    setNotificationMessage(
      `Analyzing Consumption Pattern...\n\n${item.name}\n\nAI is analyzing usage trends and wastage patterns.\nReport will be ready in 30 seconds.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 4000);
  };

  const exportData = () => {
    setNotificationMessage(
      `Exporting Wastage Data...\n\nAll wastage data exported to Excel.\n\nFile will be downloaded shortly.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  return (
    <div className="stationery-wastage-page">
      {/* Impact Stats */}
      <div className="wastage-stats-grid">
        <div className="wastage-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' }}>
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-content">
            <h3>{wasteReduction}%</h3>
            <p>Wastage Reduction Achieved</p>
          </div>
        </div>

        <div className="wastage-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' }}>
            <span style={{ fontSize: '26px', fontWeight: 'bold', color: 'white' }}>₹</span>
          </div>
          <div className="stat-content">
            <h3>
              <span style={{ marginRight: '2px' }}>₹</span>
              {(costSavings / 1000).toFixed(0)}K
            </h3>
            <p>Annual Cost Savings</p>
          </div>
        </div>

        <div className="wastage-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' }}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>Real-time</h3>
            <p>Wastage Monitoring</p>
          </div>
        </div>

        <div className="wastage-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }}>
            <i className="fas fa-bell"></i>
          </div>
          <div className="stat-content">
            <h3>3</h3>
            <p>Active Alerts</p>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="wastage-controls-section">
        <div className="wastage-filters">
          <div className="filter-group">
            <label>Category:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Paper">Paper</option>
              <option value="Writing">Writing</option>
              <option value="Books">Books</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="normal">Normal</option>
            </select>
          </div>
        </div>

        <button className="export-data-btn" onClick={exportData}>
          <i className="fas fa-file-download"></i>
          Export Data
        </button>
      </div>

      {/* Stationery Items Grid */}
      <div className="wastage-items-section">
        <div className="section-header">
          <div className="section-title">
            <i className="fas fa-box"></i>
            <h2>Stationery Inventory & Wastage</h2>
          </div>
          <p className="section-description">Track consumption patterns and identify wastage</p>
        </div>

        <div className="wastage-items-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className={`wastage-item-card ${item.status}`}>
              <div className="item-header">
                <div className="item-title-section">
                  <h3>{item.name}</h3>
                  <span className="item-category">{item.category}</span>
                </div>
                <span className={`wastage-badge ${item.status}`}>
                  {item.wastagePercentage}% Wastage
                </span>
              </div>

              <div className="item-stats">
                <div className="stat-item">
                  <span className="stat-label">Current Stock</span>
                  <span className="stat-value">{item.currentStock}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Consumed</span>
                  <span className="stat-value">{item.consumed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Wasted</span>
                  <span className="stat-value critical">{item.wasted}</span>
                </div>
              </div>

              <div className="wastage-progress">
                <div className="progress-info">
                  <span>Wastage Level</span>
                  <span className={`wastage-percentage ${item.status}`}>
                    {item.wastagePercentage}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`progress-fill ${item.status}`}
                    style={{ width: `${item.wastagePercentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="cost-impact">
                <div className="cost-item">
                  <i className="fas fa-coins"></i>
                  <div>
                    <span className="cost-label">Total Cost</span>
                    <span className="cost-value">
                      ₹{item.totalCost.toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="cost-item wastage-cost">
                  <i className="fas fa-exclamation-circle"></i>
                  <div>
                    <span className="cost-label">Wastage Cost</span>
                    <span className="cost-value">
                      ₹{item.wastageCost.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="item-actions">
                <button
                  className="action-btn primary"
                  onClick={() => generateReport(item)}
                >
                  <i className="fas fa-file-alt"></i>
                  Report
                </button>
                <button
                  className="action-btn secondary"
                  onClick={() => analyzePattern(item)}
                >
                  <i className="fas fa-chart-bar"></i>
                  Analyze
                </button>
                <button
                  className="action-btn tertiary"
                  onClick={() => setReorderAlert(item)}
                >
                  <i className="fas fa-bell"></i>
                  Alert
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wastage Alerts Panel */}
      <div className="wastage-alerts-section">
        <div className="section-header">
          <div className="section-title">
            <i className="fas fa-exclamation-triangle"></i>
            <h2>Wastage Alerts</h2>
          </div>
        </div>

        <div className="alerts-list">
          {wastageAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-card ${alert.severity} ${alert.resolved ? 'resolved' : ''}`}
              onClick={() => setShowAlertDetail(alert)}
            >
              <div className={`alert-indicator ${alert.severity}`}></div>

              <div className="alert-icon-wrapper">
                <i className={`fas ${
                  alert.alertType === 'high-wastage' ? 'fa-exclamation-triangle' :
                  alert.alertType === 'low-stock' ? 'fa-box-open' :
                  'fa-chart-line'
                }`}></i>
              </div>

              <div className="alert-content">
                <div className="alert-header-row">
                  <h4>{alert.itemName}</h4>
                  <span className={`severity-tag ${alert.severity}`}>
                    {alert.severity.toUpperCase()}
                  </span>
                </div>
                <p className="alert-message">{alert.message}</p>
                <div className="alert-meta">
                  <span className="alert-department">
                    <i className="fas fa-building"></i>
                    {alert.department}
                  </span>
                  <span className="alert-timestamp">
                    <i className="fas fa-clock"></i>
                    {alert.timestamp}
                  </span>
                </div>
                {alert.resolved && (
                  <div className="resolved-tag">
                    <i className="fas fa-check-circle"></i>
                    Resolved
                  </div>
                )}
              </div>

              {!alert.resolved && (
                <button
                  className="resolve-alert-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    resolveAlert(alert.id);
                  }}
                >
                  <i className="fas fa-check"></i>
                  Resolve
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="notification-popup">
          <div className="notification-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="notification-text">
            {notificationMessage.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Alert Detail Modal */}
      {showAlertDetail && (
        <div className="alert-modal-overlay" onClick={() => setShowAlertDetail(null)}>
          <div className="alert-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Alert Details</h2>
                <span className={`severity-badge ${showAlertDetail.severity}`}>
                  {showAlertDetail.severity.toUpperCase()} PRIORITY
                </span>
              </div>
              <button className="modal-close-btn" onClick={() => setShowAlertDetail(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="alert-detail-grid">
                <div className="detail-row">
                  <span className="detail-label">Item Name</span>
                  <span className="detail-value">{showAlertDetail.itemName}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Category</span>
                  <span className="detail-value">{showAlertDetail.category}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Alert Type</span>
                  <span className="detail-value">{showAlertDetail.alertType.replace('-', ' ').toUpperCase()}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Department</span>
                  <span className="detail-value">{showAlertDetail.department}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{showAlertDetail.timestamp}</span>
                </div>
                <div className="detail-row full-width">
                  <span className="detail-label">Message</span>
                  <span className="detail-value">{showAlertDetail.message}</span>
                </div>
              </div>

              <div className="recommended-actions">
                <h3>Recommended Actions</h3>
                <ul>
                  <li>Review department usage patterns</li>
                  <li>Implement stricter distribution controls</li>
                  <li>Conduct awareness session on wastage reduction</li>
                  <li>Set up approval process for bulk requests</li>
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowAlertDetail(null)}>
                Close
              </button>
              <button
                className="modal-btn primary"
                onClick={() => {
                  resolveAlert(showAlertDetail.id);
                  setShowAlertDetail(null);
                }}
              >
                <i className="fas fa-check"></i>
                Mark as Resolved
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationeryWastage;
