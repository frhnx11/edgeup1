import { useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  requiredStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  status: 'critical' | 'low' | 'optimal' | 'overstock';
  demandTrend: 'increasing' | 'decreasing' | 'stable';
  lastRestocked: string;
  supplier: string;
  costPerUnit: number;
}

interface PurchaseOrder {
  id: string;
  items: { name: string; quantity: number; cost: number }[];
  supplier: string;
  status: 'pending' | 'approved' | 'ordered' | 'received';
  totalAmount: number;
  orderDate: string;
  expectedDelivery: string;
  generatedBy: 'AI' | 'Manual';
}

interface CalendarEvent {
  id: string;
  eventName: string;
  date: string;
  affectedItems: string[];
  predictedIncrease: number;
}

interface StockAlert {
  id: string;
  itemName: string;
  alertType: 'stockout' | 'low-stock' | 'overstock';
  severity: 'high' | 'medium' | 'low';
  message: string;
  recommendedAction: string;
}

const Inventory = () => {
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [showPOModal, setShowPOModal] = useState(false);
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showPredictionModal, setShowPredictionModal] = useState(false);
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [showAllItems, setShowAllItems] = useState(false);

  // Animated stats
  const [costReduction, setCostReduction] = useState(0);
  const [itemsTracked, setItemsTracked] = useState(0);
  const [autoPOs, setAutoPOs] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCostReduction((prev) => (prev < 30 ? prev + 1 : 30));
      setItemsTracked((prev) => (prev < 247 ? prev + 3 : 247));
      setAutoPOs((prev) => (prev < 18 ? prev + 1 : 18));
    }, 25);

    return () => clearInterval(interval);
  }, []);

  const inventoryItems: InventoryItem[] = [
    {
      id: '1',
      name: 'A4 Paper Reams',
      category: 'Stationery',
      currentStock: 45,
      requiredStock: 150,
      minStock: 50,
      maxStock: 200,
      unit: 'reams',
      status: 'critical',
      demandTrend: 'increasing',
      lastRestocked: '15 days ago',
      supplier: 'Office Supplies Co.',
      costPerUnit: 250
    },
    {
      id: '2',
      name: 'Chemistry Lab Chemicals',
      category: 'Lab Equipment',
      currentStock: 25,
      requiredStock: 30,
      minStock: 20,
      maxStock: 50,
      unit: 'sets',
      status: 'low',
      demandTrend: 'stable',
      lastRestocked: '8 days ago',
      supplier: 'Scientific Solutions',
      costPerUnit: 1500
    },
    {
      id: '3',
      name: 'Whiteboard Markers',
      category: 'Stationery',
      currentStock: 180,
      requiredStock: 150,
      minStock: 100,
      maxStock: 200,
      unit: 'boxes',
      status: 'optimal',
      demandTrend: 'stable',
      lastRestocked: '3 days ago',
      supplier: 'Office Supplies Co.',
      costPerUnit: 30
    },
    {
      id: '4',
      name: 'Football Equipment',
      category: 'Sports',
      currentStock: 45,
      requiredStock: 40,
      minStock: 30,
      maxStock: 60,
      unit: 'sets',
      status: 'optimal',
      demandTrend: 'increasing',
      lastRestocked: '12 days ago',
      supplier: 'Sports World',
      costPerUnit: 800
    },
    {
      id: '5',
      name: 'Cleaning Supplies',
      category: 'Maintenance',
      currentStock: 15,
      requiredStock: 50,
      minStock: 30,
      maxStock: 80,
      unit: 'units',
      status: 'critical',
      demandTrend: 'stable',
      lastRestocked: '20 days ago',
      supplier: 'Clean Tech Inc.',
      costPerUnit: 120
    },
    {
      id: '6',
      name: 'Computer Accessories',
      category: 'IT Equipment',
      currentStock: 95,
      requiredStock: 60,
      minStock: 40,
      maxStock: 80,
      unit: 'sets',
      status: 'overstock',
      demandTrend: 'decreasing',
      lastRestocked: '5 days ago',
      supplier: 'Tech Hub',
      costPerUnit: 450
    },
    {
      id: '7',
      name: 'Art Supplies',
      category: 'Stationery',
      currentStock: 35,
      requiredStock: 50,
      minStock: 40,
      maxStock: 70,
      unit: 'sets',
      status: 'low',
      demandTrend: 'increasing',
      lastRestocked: '10 days ago',
      supplier: 'Creative Supplies',
      costPerUnit: 350
    },
    {
      id: '8',
      name: 'First Aid Kits',
      category: 'Medical',
      currentStock: 12,
      requiredStock: 25,
      minStock: 15,
      maxStock: 30,
      unit: 'kits',
      status: 'critical',
      demandTrend: 'stable',
      lastRestocked: '18 days ago',
      supplier: 'MedSupply',
      costPerUnit: 600
    },
    {
      id: '9',
      name: 'Notebooks',
      category: 'Stationery',
      currentStock: 420,
      requiredStock: 300,
      minStock: 250,
      maxStock: 400,
      unit: 'units',
      status: 'overstock',
      demandTrend: 'decreasing',
      lastRestocked: '2 days ago',
      supplier: 'Office Supplies Co.',
      costPerUnit: 50
    },
    {
      id: '10',
      name: 'Laboratory Glassware',
      category: 'Lab Equipment',
      currentStock: 55,
      requiredStock: 50,
      minStock: 40,
      maxStock: 70,
      unit: 'sets',
      status: 'optimal',
      demandTrend: 'stable',
      lastRestocked: '6 days ago',
      supplier: 'Scientific Solutions',
      costPerUnit: 900
    },
    {
      id: '11',
      name: 'Basketball Equipment',
      category: 'Sports',
      currentStock: 28,
      requiredStock: 35,
      minStock: 25,
      maxStock: 50,
      unit: 'sets',
      status: 'low',
      demandTrend: 'increasing',
      lastRestocked: '14 days ago',
      supplier: 'Sports World',
      costPerUnit: 750
    },
    {
      id: '12',
      name: 'Projector Bulbs',
      category: 'IT Equipment',
      currentStock: 18,
      requiredStock: 20,
      minStock: 15,
      maxStock: 30,
      unit: 'units',
      status: 'low',
      demandTrend: 'stable',
      lastRestocked: '9 days ago',
      supplier: 'Tech Hub',
      costPerUnit: 1200
    }
  ];

  const purchaseOrders: PurchaseOrder[] = [
    {
      id: 'PO-001',
      items: [
        { name: 'A4 Paper Reams', quantity: 100, cost: 25000 }
      ],
      supplier: 'Office Supplies Co.',
      status: 'pending',
      totalAmount: 25000,
      orderDate: '2025-10-20',
      expectedDelivery: '2025-10-27',
      generatedBy: 'AI'
    },
    {
      id: 'PO-002',
      items: [
        { name: 'Cleaning Supplies', quantity: 40, cost: 4800 },
        { name: 'First Aid Kits', quantity: 15, cost: 9000 }
      ],
      supplier: 'Multiple Suppliers',
      status: 'approved',
      totalAmount: 13800,
      orderDate: '2025-10-19',
      expectedDelivery: '2025-10-26',
      generatedBy: 'AI'
    },
    {
      id: 'PO-003',
      items: [
        { name: 'Art Supplies', quantity: 20, cost: 7000 }
      ],
      supplier: 'Creative Supplies',
      status: 'ordered',
      totalAmount: 7000,
      orderDate: '2025-10-18',
      expectedDelivery: '2025-10-25',
      generatedBy: 'Manual'
    },
    {
      id: 'PO-004',
      items: [
        { name: 'Basketball Equipment', quantity: 10, cost: 7500 }
      ],
      supplier: 'Sports World',
      status: 'received',
      totalAmount: 7500,
      orderDate: '2025-10-15',
      expectedDelivery: '2025-10-22',
      generatedBy: 'AI'
    },
    {
      id: 'PO-005',
      items: [
        { name: 'Projector Bulbs', quantity: 8, cost: 9600 }
      ],
      supplier: 'Tech Hub',
      status: 'pending',
      totalAmount: 9600,
      orderDate: '2025-10-21',
      expectedDelivery: '2025-10-28',
      generatedBy: 'Manual'
    }
  ];

  const calendarEvents: CalendarEvent[] = [
    {
      id: '1',
      eventName: 'Annual Day Preparation',
      date: 'Nov 5, 2025',
      affectedItems: ['Art Supplies', 'Stationery Items', 'Stage Equipment'],
      predictedIncrease: 45
    },
    {
      id: '2',
      eventName: 'Mid-Term Examinations',
      date: 'Nov 12, 2025',
      affectedItems: ['A4 Paper Reams', 'Whiteboard Markers'],
      predictedIncrease: 30
    },
    {
      id: '3',
      eventName: 'Sports Week',
      date: 'Nov 20, 2025',
      affectedItems: ['Football Equipment', 'Basketball Equipment', 'First Aid Kits'],
      predictedIncrease: 60
    },
    {
      id: '4',
      eventName: 'Science Fair',
      date: 'Dec 1, 2025',
      affectedItems: ['Chemistry Lab Chemicals', 'Laboratory Glassware'],
      predictedIncrease: 40
    }
  ];

  const stockAlerts: StockAlert[] = [
    {
      id: '1',
      itemName: 'A4 Paper Reams',
      alertType: 'low-stock',
      severity: 'high',
      message: 'Critical stock level - Only 45 reams remaining',
      recommendedAction: 'Order 100 reams immediately (PO already generated)'
    },
    {
      id: '2',
      itemName: 'Cleaning Supplies',
      alertType: 'low-stock',
      severity: 'high',
      message: 'Stock below minimum threshold - 15 units left',
      recommendedAction: 'Approve pending purchase order PO-002'
    },
    {
      id: '3',
      itemName: 'Computer Accessories',
      alertType: 'overstock',
      severity: 'medium',
      message: 'Excess stock detected - 95 sets available',
      recommendedAction: 'Review usage patterns and adjust future orders'
    },
    {
      id: '4',
      itemName: 'First Aid Kits',
      alertType: 'stockout',
      severity: 'high',
      message: 'Below critical minimum - Only 12 kits available',
      recommendedAction: 'Emergency order required (included in PO-002)'
    }
  ];

  const filteredItems = inventoryItems.filter(item => {
    const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
    const statusMatch = filterStatus === 'all' || item.status === filterStatus;
    const searchMatch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return categoryMatch && statusMatch && searchMatch;
  });

  const displayedItems = showAllItems ? filteredItems : filteredItems.slice(0, 8);

  const generatePurchaseOrder = (item: InventoryItem) => {
    const quantity = item.requiredStock - item.currentStock;
    const cost = quantity * item.costPerUnit;
    setNotificationMessage(
      `Purchase Order Generated!\n\nItem: ${item.name}\nQuantity: ${quantity} ${item.unit}\nSupplier: ${item.supplier}\nEstimated Cost: ₹${cost.toLocaleString()}\n\nPO will be sent for approval.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 4000);
  };

  const approvePurchaseOrder = (order: PurchaseOrder) => {
    setNotificationMessage(
      `Purchase Order Approved!\n\n${order.id}\nSupplier: ${order.supplier}\nAmount: ₹${order.totalAmount.toLocaleString()}\n\nOrder will be placed immediately.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3500);
  };

  const markReceived = (order: PurchaseOrder) => {
    setNotificationMessage(
      `Order Marked as Received!\n\n${order.id}\nStock levels have been updated.\n\nAll items added to inventory.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const restockItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowRestockModal(true);
  };

  const adjustStock = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowAdjustModal(true);
  };

  const viewPrediction = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowPredictionModal(true);
  };

  const exportInventory = () => {
    setNotificationMessage(
      `Exporting Inventory Data...\n\nComplete inventory report with AI predictions exported to Excel.\n\nFile will download shortly.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const handleRestock = () => {
    if (!selectedItem) return;
    setNotificationMessage(
      `Stock Updated!\n\n${selectedItem.name}\nNew stock levels recorded.\n\nInventory database updated.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
    setShowRestockModal(false);
  };

  const handleAdjustStock = () => {
    if (!selectedItem) return;
    setNotificationMessage(
      `Stock Adjusted!\n\n${selectedItem.name}\nStock count manually adjusted.\n\nReason logged for audit.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
    setShowAdjustModal(false);
  };

  const cancelOrder = (order: PurchaseOrder) => {
    setNotificationMessage(
      `Purchase Order Cancelled!\n\n${order.id}\nOrder has been cancelled.\n\nSupplier will be notified.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  return (
    <div className="inventory-management-page">
      {/* Impact Stats */}
      <div className="inventory-stats-grid">
        <div className="inventory-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' }}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>{costReduction}%</h3>
            <p>Inventory Cost Reduction</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }}>
            <i className="fas fa-boxes"></i>
          </div>
          <div className="stat-content">
            <h3>{itemsTracked}</h3>
            <p>Items Tracked</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
            <i className="fas fa-robot"></i>
          </div>
          <div className="stat-content">
            <h3>{autoPOs}</h3>
            <p>Auto Purchase Orders</p>
          </div>
        </div>

        <div className="inventory-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>98%</h3>
            <p>Stock Accuracy</p>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="inventory-controls-section">
        <div className="inventory-filters">
          <div className="filter-group">
            <label>Category:</label>
            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="all">All Categories</option>
              <option value="Stationery">Stationery</option>
              <option value="Lab Equipment">Lab Equipment</option>
              <option value="Sports">Sports</option>
              <option value="IT Equipment">IT Equipment</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Medical">Medical</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="critical">Critical</option>
              <option value="low">Low Stock</option>
              <option value="optimal">Optimal</option>
              <option value="overstock">Overstock</option>
            </select>
          </div>

          <div className="filter-group search-group">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <button className="export-inventory-btn" onClick={exportInventory}>
          <i className="fas fa-file-download"></i>
          Export Inventory
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="inventory-main-grid">
        {/* Inventory Items */}
        <div className="inventory-items-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-warehouse"></i>
              <h2>Inventory Items</h2>
            </div>
            <p className="section-description">AI-powered stock management</p>
          </div>

          <div className="inventory-items-grid">
            {displayedItems.map((item) => (
              <div key={item.id} className={`inventory-item-card ${item.status}`}>
                <div className="item-header">
                  <div className="item-title-section">
                    <h3>{item.name}</h3>
                    <span className="item-category-tag">{item.category}</span>
                  </div>
                  <span className={`stock-status-badge ${item.status}`}>
                    {item.status === 'critical' ? 'CRITICAL' :
                     item.status === 'low' ? 'LOW' :
                     item.status === 'optimal' ? 'OPTIMAL' : 'OVERSTOCK'}
                  </span>
                </div>

                <div className="stock-info-grid">
                  <div className="stock-info-item">
                    <span className="info-label">Current Stock</span>
                    <span className="info-value">{item.currentStock} {item.unit}</span>
                  </div>
                  <div className="stock-info-item">
                    <span className="info-label">Required</span>
                    <span className="info-value">{item.requiredStock} {item.unit}</span>
                  </div>
                  <div className="stock-info-item">
                    <span className="info-label">Demand Trend</span>
                    <span className={`trend-indicator ${item.demandTrend}`}>
                      {item.demandTrend === 'increasing' ? '↑' :
                       item.demandTrend === 'decreasing' ? '↓' : '→'}
                      {' '}
                      {item.demandTrend}
                    </span>
                  </div>
                  <div className="stock-info-item">
                    <span className="info-label">Last Restocked</span>
                    <span className="info-value">{item.lastRestocked}</span>
                  </div>
                </div>

                <div className="stock-progress-section">
                  <div className="progress-label-row">
                    <span>Stock Level</span>
                    <span className={`stock-percentage ${item.status}`}>
                      {Math.round((item.currentStock / item.requiredStock) * 100)}%
                    </span>
                  </div>
                  <div className="stock-progress-bar">
                    <div
                      className={`stock-progress-fill ${item.status}`}
                      style={{ width: `${Math.min((item.currentStock / item.requiredStock) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="item-actions">
                  <button
                    className="action-btn primary"
                    onClick={() => restockItem(item)}
                  >
                    <i className="fas fa-plus-circle"></i>
                    Restock
                  </button>
                  <button
                    className="action-btn secondary"
                    onClick={() => adjustStock(item)}
                  >
                    <i className="fas fa-edit"></i>
                    Adjust
                  </button>
                  <button
                    className="action-btn tertiary full-width"
                    onClick={() => generatePurchaseOrder(item)}
                  >
                    <i className="fas fa-file-invoice"></i>
                    Generate Purchase Order
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* View More Button */}
          {filteredItems.length > 8 && (
            <div className="view-more-container">
              <button
                className="view-more-btn"
                onClick={() => setShowAllItems(!showAllItems)}
              >
                <i className={`fas fa-${showAllItems ? 'chevron-up' : 'chevron-down'}`}></i>
                {showAllItems ? 'Show Less' : `View More (${filteredItems.length - 8} more items)`}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="inventory-sidebar">
          {/* AI Prediction Panel */}
          <div className="ai-prediction-panel">
            <div className="panel-header">
              <i className="fas fa-brain"></i>
              <h3>AI Demand Prediction</h3>
            </div>

            <div className="calendar-events-list">
              {calendarEvents.map((event) => (
                <div key={event.id} className="calendar-event-card">
                  <div className="event-date-badge">{event.date}</div>
                  <h4>{event.eventName}</h4>
                  <div className="predicted-impact">
                    <span className="impact-label">Predicted Increase:</span>
                    <span className="impact-value">+{event.predictedIncrease}%</span>
                  </div>
                  <div className="affected-items">
                    <span className="affected-label">Affected Items:</span>
                    <div className="items-tags">
                      {event.affectedItems.map((item, index) => (
                        <span key={index} className="item-tag">{item}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="stock-alerts-panel">
            <div className="panel-header">
              <i className="fas fa-exclamation-circle"></i>
              <h3>Critical Alerts</h3>
            </div>

            <div className="alerts-list">
              {stockAlerts.map((alert) => (
                <div key={alert.id} className={`alert-item ${alert.severity}`}>
                  <div className={`alert-indicator-dot ${alert.severity}`}></div>
                  <div className="alert-content">
                    <h4>{alert.itemName}</h4>
                    <p className="alert-message">{alert.message}</p>
                    <p className="alert-action">{alert.recommendedAction}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Orders Section */}
      <div className="purchase-orders-section">
        <div className="section-header">
          <div className="section-title">
            <i className="fas fa-file-invoice-dollar"></i>
            <h2>Purchase Orders</h2>
          </div>
        </div>

        <div className="purchase-orders-grid">
          {purchaseOrders.map((order) => (
            <div key={order.id} className={`purchase-order-card ${order.status}`}>
              <div className="po-header">
                <div className="po-id-section">
                  <span className="po-id">{order.id}</span>
                  <span className={`po-type-badge ${order.generatedBy.toLowerCase()}`}>
                    {order.generatedBy === 'AI' ? '🤖 AI Generated' : '✍️ Manual'}
                  </span>
                </div>
                <span className={`po-status-badge ${order.status}`}>
                  {order.status.toUpperCase()}
                </span>
              </div>

              <div className="po-details">
                <div className="po-detail-row">
                  <span className="detail-label">Supplier:</span>
                  <span className="detail-value">{order.supplier}</span>
                </div>
                <div className="po-detail-row">
                  <span className="detail-label">Items:</span>
                  <span className="detail-value">{order.items.length} items</span>
                </div>
                <div className="po-detail-row">
                  <span className="detail-label">Amount:</span>
                  <span className="detail-value amount">₹{order.totalAmount.toLocaleString()}</span>
                </div>
                <div className="po-detail-row">
                  <span className="detail-label">Expected Delivery:</span>
                  <span className="detail-value">{order.expectedDelivery}</span>
                </div>
              </div>

              <div className="po-actions">
                <button
                  className="po-action-btn view"
                  onClick={() => {
                    setSelectedOrder(order);
                    setShowPOModal(true);
                  }}
                >
                  <i className="fas fa-eye"></i>
                  View Details
                </button>
                {order.status === 'pending' && (
                  <button
                    className="po-action-btn approve"
                    onClick={() => approvePurchaseOrder(order)}
                  >
                    <i className="fas fa-check"></i>
                    Approve
                  </button>
                )}
                {order.status === 'ordered' && (
                  <button
                    className="po-action-btn received"
                    onClick={() => markReceived(order)}
                  >
                    <i className="fas fa-box-open"></i>
                    Mark Received
                  </button>
                )}
                {(order.status === 'pending' || order.status === 'approved') && (
                  <button
                    className="po-action-btn cancel full-width"
                    onClick={() => cancelOrder(order)}
                  >
                    <i className="fas fa-times-circle"></i>
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowRestockModal(false)}>
          <div className="inventory-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Restock Item</h2>
              <button className="modal-close-btn" onClick={() => setShowRestockModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-item-info">
                <h3>{selectedItem.name}</h3>
                <p>Current Stock: {selectedItem.currentStock} {selectedItem.unit}</p>
              </div>

              <div className="form-group">
                <label>Quantity Received</label>
                <input type="number" placeholder="Enter quantity" />
              </div>

              <div className="form-group">
                <label>Supplier</label>
                <input type="text" defaultValue={selectedItem.supplier} />
              </div>

              <div className="form-group">
                <label>Invoice Number</label>
                <input type="text" placeholder="Enter invoice number" />
              </div>

              <div className="form-group">
                <label>Delivery Date</label>
                <input type="date" />
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowRestockModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleRestock}>
                <i className="fas fa-check"></i>
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showAdjustModal && selectedItem && (
        <div className="modal-overlay" onClick={() => setShowAdjustModal(false)}>
          <div className="inventory-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Adjust Stock</h2>
              <button className="modal-close-btn" onClick={() => setShowAdjustModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="modal-item-info">
                <h3>{selectedItem.name}</h3>
                <p>Current Stock: {selectedItem.currentStock} {selectedItem.unit}</p>
              </div>

              <div className="form-group">
                <label>New Stock Count</label>
                <input type="number" placeholder="Enter new count" defaultValue={selectedItem.currentStock} />
              </div>

              <div className="form-group">
                <label>Adjustment Reason</label>
                <select>
                  <option>Physical count correction</option>
                  <option>Damaged items</option>
                  <option>Lost items</option>
                  <option>System error correction</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea placeholder="Enter additional details..." rows={3}></textarea>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowAdjustModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleAdjustStock}>
                <i className="fas fa-save"></i>
                Save Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PO Detail Modal */}
      {showPOModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowPOModal(false)}>
          <div className="inventory-modal large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Purchase Order Details</h2>
                <p className="modal-subtitle">{selectedOrder.id}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowPOModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="po-detail-grid">
                <div className="po-detail-item">
                  <span className="detail-label">Supplier</span>
                  <span className="detail-value">{selectedOrder.supplier}</span>
                </div>
                <div className="po-detail-item">
                  <span className="detail-label">Status</span>
                  <span className={`detail-value status ${selectedOrder.status}`}>
                    {selectedOrder.status.toUpperCase()}
                  </span>
                </div>
                <div className="po-detail-item">
                  <span className="detail-label">Order Date</span>
                  <span className="detail-value">{selectedOrder.orderDate}</span>
                </div>
                <div className="po-detail-item">
                  <span className="detail-label">Expected Delivery</span>
                  <span className="detail-value">{selectedOrder.expectedDelivery}</span>
                </div>
              </div>

              <div className="po-items-table">
                <h3>Order Items</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>₹{item.cost.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={2}><strong>Total Amount</strong></td>
                      <td><strong>₹{selectedOrder.totalAmount.toLocaleString()}</strong></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowPOModal(false)}>
                Close
              </button>
              {selectedOrder.status === 'pending' && (
                <button className="modal-btn primary" onClick={() => {
                  approvePurchaseOrder(selectedOrder);
                  setShowPOModal(false);
                }}>
                  <i className="fas fa-check"></i>
                  Approve Order
                </button>
              )}
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Inventory;
