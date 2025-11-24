import { useState, useEffect } from 'react';

interface AcademicEvent {
  id: string;
  title: string;
  type: 'exam' | 'event' | 'holiday';
  date: string;
  impact: 'high' | 'medium' | 'low';
}

interface InventoryPrediction {
  item: string;
  currentStock: number;
  predictedDemand: number;
  recommended: number;
  status: 'sufficient' | 'low' | 'critical';
  category: string;
}

interface ForecastData {
  date: string;
  demand: number;
  confidence: number;
}

const DemandPrediction = () => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Animated counters for impact stats
  const [seatUtilization, setSeatUtilization] = useState(0);
  const [revenueOptimization, setRevenueOptimization] = useState(0);
  const [forecastAccuracy, setForecastAccuracy] = useState(0);

  // Target values
  const targetSeatUtilization = 85;
  const targetRevenueOptimization = 92;
  const targetAccuracy = 96;

  // Animate counters on mount
  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;

    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setSeatUtilization(Math.floor(targetSeatUtilization * progress));
      setRevenueOptimization(Math.floor(targetRevenueOptimization * progress));
      setForecastAccuracy(Math.floor(targetAccuracy * progress));

      if (currentStep >= steps) {
        setSeatUtilization(targetSeatUtilization);
        setRevenueOptimization(targetRevenueOptimization);
        setForecastAccuracy(targetAccuracy);
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const academicEvents: AcademicEvent[] = [
    { id: '1', title: 'Mid-Semester Examinations', type: 'exam', date: '2025-10-15', impact: 'high' },
    { id: '2', title: 'Technical Symposium', type: 'event', date: '2025-11-05', impact: 'medium' },
    { id: '3', title: 'Industry Internship Drive', type: 'event', date: '2025-11-20', impact: 'high' },
    { id: '4', title: 'End-Semester Examinations', type: 'exam', date: '2025-12-10', impact: 'high' },
    { id: '5', title: 'Winter Vacation', type: 'holiday', date: '2025-12-22', impact: 'low' }
  ];

  const inventoryPredictions: InventoryPrediction[] = [
    { item: 'Lab Equipment - Oscilloscopes', currentStock: 25, predictedDemand: 40, recommended: 15, status: 'critical', category: 'Lab Equipment' },
    { item: 'Engineering Drawing Sheets', currentStock: 2000, predictedDemand: 5000, recommended: 3000, status: 'low', category: 'Stationery' },
    { item: 'Computer Lab Workstations', currentStock: 150, predictedDemand: 180, recommended: 30, status: 'sufficient', category: 'IT Infrastructure' },
    { item: 'Library Reference Books', currentStock: 500, predictedDemand: 750, recommended: 250, status: 'low', category: 'Academic Resources' },
    { item: 'Laboratory Chemicals - Engineering', currentStock: 50, predictedDemand: 80, recommended: 30, status: 'sufficient', category: 'Lab Supplies' },
    { item: 'Workshop Tools & Machinery Parts', currentStock: 100, predictedDemand: 150, recommended: 50, status: 'sufficient', category: 'Workshop' },
    { item: 'Student ID Cards (Blank)', currentStock: 200, predictedDemand: 500, recommended: 300, status: 'critical', category: 'Administration' },
    { item: 'Examination Answer Booklets', currentStock: 5000, predictedDemand: 8000, recommended: 3000, status: 'low', category: 'Exam Materials' },
    { item: 'Projector Replacement Lamps', currentStock: 10, predictedDemand: 25, recommended: 15, status: 'sufficient', category: 'AV Equipment' },
    { item: 'Network Cables & Routers', currentStock: 50, predictedDemand: 80, recommended: 30, status: 'sufficient', category: 'IT Infrastructure' }
  ];

  const forecastData: ForecastData[] = Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    demand: Math.floor(Math.random() * 40) + 60 + (i > 10 && i < 20 ? 30 : 0),
    confidence: Math.floor(Math.random() * 15) + 85
  }));

  const categories = [
    { id: 'all', name: 'All Items', count: inventoryPredictions.length },
    { id: 'Lab Equipment', name: 'Lab Equipment', count: inventoryPredictions.filter(i => i.category === 'Lab Equipment').length },
    { id: 'IT Infrastructure', name: 'IT Infrastructure', count: inventoryPredictions.filter(i => i.category === 'IT Infrastructure').length },
    { id: 'Academic Resources', name: 'Academic Resources', count: inventoryPredictions.filter(i => i.category === 'Academic Resources').length },
    { id: 'Exam Materials', name: 'Exam Materials', count: inventoryPredictions.filter(i => i.category === 'Exam Materials').length },
    { id: 'Workshop', name: 'Workshop', count: inventoryPredictions.filter(i => i.category === 'Workshop').length },
    { id: 'Stationery', name: 'Stationery', count: inventoryPredictions.filter(i => i.category === 'Stationery').length }
  ];

  const filteredPredictions = selectedCategory === 'all'
    ? inventoryPredictions
    : inventoryPredictions.filter(item => item.category === selectedCategory);

  const stats = {
    critical: inventoryPredictions.filter(i => i.status === 'critical').length,
    low: inventoryPredictions.filter(i => i.status === 'low').length,
    sufficient: inventoryPredictions.filter(i => i.status === 'sufficient').length
  };

  const total = stats.critical + stats.low + stats.sufficient;
  const percentages = {
    critical: Math.round((stats.critical / total) * 100),
    low: Math.round((stats.low / total) * 100),
    sufficient: Math.round((stats.sufficient / total) * 100)
  };

  const generateOrder = () => {
    const orderList = inventoryPredictions
      .filter(i => i.status !== 'sufficient')
      .map(i => `${i.item}: Order ${i.recommended} units`)
      .join('\n');

    alert(`Generated Order List:\n\n${orderList}\n\n(Feature will be implemented)`);
  };

  return (
    <div className="demand-prediction-page">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-chart-line"></i> Enrollment Prediction</h1>
          <p>AI-powered demand forecasting and resource optimization</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Run Prediction functionality')}>
            <i className="fas fa-brain"></i>
            Run Prediction
          </button>
          <button className="btn-secondary" onClick={() => alert('Export Report functionality')}>
            <i className="fas fa-download"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="impact-stats-grid">
        <div className="impact-stat-card wastage">
          <div className="impact-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="impact-content">
            <span className="impact-label">Seat Utilization</span>
            <span className="impact-value">{seatUtilization}%</span>
            <span className="impact-trend"><i className="fas fa-check"></i> Optimal capacity usage</span>
          </div>
        </div>

        <div className="impact-stat-card savings">
          <div className="impact-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="impact-content">
            <span className="impact-label">Revenue Optimization</span>
            <span className="impact-value">{revenueOptimization}%</span>
            <span className="impact-trend"><i className="fas fa-arrow-up"></i> Fee collection efficiency</span>
          </div>
        </div>

        <div className="impact-stat-card accuracy">
          <div className="impact-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <div className="impact-content">
            <span className="impact-label">Forecast Accuracy</span>
            <span className="impact-value">{forecastAccuracy}%</span>
            <span className="impact-trend"><i className="fas fa-check"></i> Semester-wise accuracy</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="demand-main-grid">
        {/* Academic Calendar */}
        <div className="academic-calendar-card">
          <div className="calendar-header">
            <div className="calendar-title">
              <i className="fas fa-calendar-alt"></i>
              <h3>Academic Calendar</h3>
            </div>
            <span className="calendar-badge">{academicEvents.length} Upcoming Events</span>
          </div>

          <div className="events-list">
            {academicEvents.map((event) => (
              <div key={event.id} className={`event-item ${event.type}`}>
                <div className="event-date">
                  <span className="event-day">{new Date(event.date).getDate()}</span>
                  <span className="event-month">{new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}</span>
                </div>
                <div className="event-details">
                  <h4>{event.title}</h4>
                  <div className="event-meta">
                    <span className={`event-type ${event.type}`}>
                      {event.type === 'exam' && <><i className="fas fa-clipboard-list"></i> Exam</>}
                      {event.type === 'event' && <><i className="fas fa-calendar-star"></i> Event</>}
                      {event.type === 'holiday' && <><i className="fas fa-umbrella-beach"></i> Holiday</>}
                    </span>
                    <span className={`event-impact ${event.impact}`}>
                      {event.impact === 'high' && 'High Impact'}
                      {event.impact === 'medium' && 'Medium Impact'}
                      {event.impact === 'low' && 'Low Impact'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 30-Day Forecast */}
        <div className="forecast-card">
          <div className="forecast-header">
            <div className="forecast-title">
              <i className="fas fa-chart-line"></i>
              <h3>30-Day Demand Forecast</h3>
            </div>
            <div className="forecast-legend">
              <div className="legend-item">
                <span className="legend-dot demand"></span>
                <span>Predicted Demand</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot confidence"></span>
                <span>Confidence Level</span>
              </div>
            </div>
          </div>

          <div className="forecast-chart">
            <div className="chart-y-axis">
              <span>High</span>
              <span>Med</span>
              <span>Low</span>
            </div>
            <div className="chart-bars">
              {forecastData.slice(0, 15).map((data, idx) => (
                <div key={idx} className="chart-bar-group">
                  <div
                    className="demand-bar"
                    style={{ height: `${data.demand}%` }}
                    title={`${data.date}: ${data.demand}% demand`}
                  ></div>
                  <span className="bar-label">{data.date.split(' ')[1]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="forecast-insights">
            <div className="insight-item">
              <i className="fas fa-exclamation-triangle"></i>
              <span>Peak demand expected during Nov 12-20 (Placement Season)</span>
            </div>
            <div className="insight-item">
              <i className="fas fa-info-circle"></i>
              <span>Average confidence level: 96% based on historical patterns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Resource Status */}
      <div className="inventory-status-section">
        <div className="inventory-section-header">
          <h3 className="inventory-section-title">
            <i className="fas fa-box inventory-section-icon"></i>
            Inventory Resource Status
          </h3>
        </div>

        <div className="inventory-status-grid">
          {/* Critical Card */}
          <div className="inventory-status-card critical">
            <div className="status-icon-wrapper">
              <i className="fas fa-exclamation-circle status-icon"></i>
            </div>
            <h2 className="status-count">{stats.critical}</h2>
            <p className="status-label">Critical</p>
            <div className="status-progress-bar">
              <div className="status-progress-fill" style={{ width: `${percentages.critical}%` }}></div>
            </div>
            <p className="status-description">Immediate action required</p>
          </div>

          {/* Low Stock Card */}
          <div className="inventory-status-card low-stock">
            <div className="status-icon-wrapper">
              <i className="fas fa-exclamation-triangle status-icon"></i>
            </div>
            <h2 className="status-count">{stats.low}</h2>
            <p className="status-label">Low Stock</p>
            <div className="status-progress-bar">
              <div className="status-progress-fill" style={{ width: `${percentages.low}%` }}></div>
            </div>
            <p className="status-description">Order within 2 weeks</p>
          </div>

          {/* Sufficient Card */}
          <div className="inventory-status-card sufficient">
            <div className="status-icon-wrapper">
              <i className="fas fa-check-circle status-icon"></i>
            </div>
            <h2 className="status-count">{stats.sufficient}</h2>
            <p className="status-label">Sufficient</p>
            <div className="status-progress-bar">
              <div className="status-progress-fill" style={{ width: `${percentages.sufficient}%` }}></div>
            </div>
            <p className="status-description">Stock levels healthy</p>
          </div>
        </div>
      </div>

      {/* Category Filters */}
      <div className="demand-categories">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`demand-category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.name}</span>
            <span className="category-badge">{cat.count}</span>
          </div>
        ))}
      </div>

      {/* Inventory Predictions Grid */}
      <div className="predictions-card">
        <div className="predictions-header">
          <div className="predictions-title">
            <i className="fas fa-boxes"></i>
            <h3>Inventory Demand Predictions</h3>
          </div>
          <button className="generate-order-btn" onClick={generateOrder}>
            <i className="fas fa-shopping-cart"></i>
            Generate Order List
          </button>
        </div>

        <div className="predictions-table-container">
          <table className="predictions-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Predicted Demand</th>
                <th>Order Recommendation</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPredictions.map((pred, idx) => (
                <tr key={idx} className={`prediction-row ${pred.status}`}>
                  <td className="item-name">
                    <i className="fas fa-box"></i>
                    {pred.item}
                  </td>
                  <td>
                    <span className="category-tag">{pred.category}</span>
                  </td>
                  <td className="stock-value">{pred.currentStock}</td>
                  <td className="demand-value">{pred.predictedDemand}</td>
                  <td className="recommend-value">
                    {pred.recommended > 0 ? (
                      <span className="order-badge">
                        <i className="fas fa-plus"></i> {pred.recommended}
                      </span>
                    ) : (
                      <span className="no-order">-</span>
                    )}
                  </td>
                  <td>
                    <span className={`status-badge ${pred.status}`}>
                      {pred.status === 'critical' && <><i className="fas fa-exclamation-circle"></i> Critical</>}
                      {pred.status === 'low' && <><i className="fas fa-exclamation-triangle"></i> Low</>}
                      {pred.status === 'sufficient' && <><i className="fas fa-check-circle"></i> Sufficient</>}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* AI Insights */}
      <div className="ai-insights-card">
        <div className="insights-header">
          <div className="insights-title">
            <i className="fas fa-brain"></i>
            <h3>AI-Powered Insights</h3>
          </div>
        </div>
        <div className="insights-grid">
          <div className="insight-card">
            <i className="fas fa-chart-line"></i>
            <h4>Historical Pattern</h4>
            <p>Enrollment patterns show 3x increase in lab equipment demand during Nov-Dec due to final year projects</p>
          </div>
          <div className="insight-card">
            <i className="fas fa-lightbulb"></i>
            <h4>Optimization Tip</h4>
            <p>Order 8 weeks before semester peaks to ensure availability and best prices for technical equipment</p>
          </div>
          <div className="insight-card">
            <i className="fas fa-calendar-check"></i>
            <h4>Upcoming Peak</h4>
            <p>Final assessments in 3 weeks - start procuring examination materials and lab supplies now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemandPrediction;
