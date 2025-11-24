import React, { useState } from 'react';
import '../Dashboard.css';

// TypeScript Interfaces
interface Child {
  id: string;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
}

interface FeeCategory {
  id: string;
  name: string;
  amount: number;
  paid: number;
  pending: number;
  dueDate: string;
  status: 'paid' | 'pending' | 'overdue' | 'partial';
  term: string;
  subCategories?: FeeSubCategory[];
}

interface FeeSubCategory {
  id: string;
  name: string;
  amount: number;
  paid: number;
}

interface PaymentTransaction {
  id: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentMethod: 'card' | 'netbanking' | 'upi' | 'cash' | 'cheque' | 'wallet';
  transactionId: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  feeCategories: string[];
  notes?: string;
}

interface PendingPayment {
  id: string;
  category: string;
  amount: number;
  dueDate: string;
  lateFee: number;
  isOverdue: boolean;
  term: string;
}

const FeePayment = () => {
  // Mock Data - Children
  const childrenData: Child[] = [
    { id: 'c1', name: 'Aarav Sharma', grade: '10', section: 'A', rollNumber: '10A001' },
    { id: 'c2', name: 'Diya Sharma', grade: '7', section: 'B', rollNumber: '7B015' },
  ];

  // Mock Data - Fee Categories
  const feeCategoriesData: FeeCategory[] = [
    {
      id: 'f1',
      name: 'Tuition Fee',
      amount: 45000,
      paid: 45000,
      pending: 0,
      dueDate: '2025-04-15',
      status: 'paid',
      term: 'Term 1',
    },
    {
      id: 'f2',
      name: 'Transportation',
      amount: 12000,
      paid: 6000,
      pending: 6000,
      dueDate: '2025-11-15',
      status: 'partial',
      term: 'Term 2',
    },
    {
      id: 'f3',
      name: 'Library Fee',
      amount: 3000,
      paid: 3000,
      pending: 0,
      dueDate: '2025-04-15',
      status: 'paid',
      term: 'Term 1',
    },
    {
      id: 'f4',
      name: 'Laboratory Fee',
      amount: 8000,
      paid: 0,
      pending: 8000,
      dueDate: '2025-10-25',
      status: 'overdue',
      term: 'Term 2',
    },
    {
      id: 'f5',
      name: 'Sports & Activities',
      amount: 5000,
      paid: 5000,
      pending: 0,
      dueDate: '2025-04-15',
      status: 'paid',
      term: 'Term 1',
    },
    {
      id: 'f6',
      name: 'Computer Lab',
      amount: 4000,
      paid: 0,
      pending: 4000,
      dueDate: '2025-11-30',
      status: 'pending',
      term: 'Term 3',
    },
    {
      id: 'f7',
      name: 'Examination Fee',
      amount: 2500,
      paid: 0,
      pending: 2500,
      dueDate: '2025-12-10',
      status: 'pending',
      term: 'Term 3',
    },
    {
      id: 'f8',
      name: 'Annual Function',
      amount: 1500,
      paid: 1500,
      pending: 0,
      dueDate: '2025-04-15',
      status: 'paid',
      term: 'Term 1',
    },
  ];

  // Mock Data - Payment History
  const paymentHistoryData: PaymentTransaction[] = [
    {
      id: 'p1',
      receiptNumber: 'RCP-2025-001',
      date: '2025-04-12',
      amount: 45000,
      paymentMethod: 'upi',
      transactionId: 'UPI2025041200123',
      status: 'success',
      feeCategories: ['Tuition Fee'],
      notes: 'Term 1 Tuition Payment',
    },
    {
      id: 'p2',
      receiptNumber: 'RCP-2025-002',
      date: '2025-04-12',
      amount: 9500,
      paymentMethod: 'card',
      transactionId: 'CARD2025041200456',
      status: 'success',
      feeCategories: ['Library Fee', 'Sports & Activities', 'Annual Function'],
      notes: 'Term 1 Additional Fees',
    },
    {
      id: 'p3',
      receiptNumber: 'RCP-2025-003',
      date: '2025-06-15',
      amount: 6000,
      paymentMethod: 'netbanking',
      transactionId: 'NB2025061500789',
      status: 'success',
      feeCategories: ['Transportation'],
      notes: 'Term 1 & 2 Transport Fee (Partial)',
    },
    {
      id: 'p4',
      receiptNumber: 'RCP-2025-004',
      date: '2025-03-20',
      amount: 2000,
      paymentMethod: 'cash',
      transactionId: 'CASH2025032000001',
      status: 'success',
      feeCategories: ['Miscellaneous'],
      notes: 'Study Material',
    },
  ];

  // Mock Data - Pending Payments
  const pendingPaymentsData: PendingPayment[] = [
    {
      id: 'pp1',
      category: 'Laboratory Fee',
      amount: 8000,
      dueDate: '2025-10-25',
      lateFee: 400,
      isOverdue: true,
      term: 'Term 2',
    },
    {
      id: 'pp2',
      category: 'Transportation (Remaining)',
      amount: 6000,
      dueDate: '2025-11-15',
      lateFee: 0,
      isOverdue: false,
      term: 'Term 2',
    },
    {
      id: 'pp3',
      category: 'Computer Lab',
      amount: 4000,
      dueDate: '2025-11-30',
      lateFee: 0,
      isOverdue: false,
      term: 'Term 3',
    },
    {
      id: 'pp4',
      category: 'Examination Fee',
      amount: 2500,
      dueDate: '2025-12-10',
      lateFee: 0,
      isOverdue: false,
      term: 'Term 3',
    },
  ];

  // State Management
  const [currentChild, setCurrentChild] = useState<Child>(childrenData[0]);
  const [feeCategories] = useState<FeeCategory[]>(feeCategoriesData);
  const [paymentHistory, setPaymentHistory] = useState<PaymentTransaction[]>(paymentHistoryData);
  const [pendingPayments, setPendingPayments] = useState<PendingPayment[]>(pendingPaymentsData);

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [showAutoPayModal, setShowAutoPayModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  const [paymentStep, setPaymentStep] = useState(1);
  const [selectedPayments, setSelectedPayments] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [discountCode, setDiscountCode] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMethod, setFilterMethod] = useState<string>('all');

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Calculate Stats
  const totalFee = feeCategories.reduce((sum, cat) => sum + cat.amount, 0);
  const paidAmount = feeCategories.reduce((sum, cat) => sum + cat.paid, 0);
  const pendingAmount = feeCategories.reduce((sum, cat) => sum + cat.pending, 0);
  const paymentPercentage = (paidAmount / totalFee) * 100;

  const nextDuePayment = pendingPayments
    .filter(p => !p.isOverdue)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())[0];

  // Toast Notification
  const showToastNotification = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Payment Modal Handlers
  const handleOpenPaymentModal = (paymentId?: string) => {
    if (paymentId) {
      setSelectedPayments([paymentId]);
    }
    setPaymentStep(1);
    setShowPaymentModal(true);
  };

  const handleNextPaymentStep = () => {
    if (paymentStep === 1 && selectedPayments.length === 0) {
      showToastNotification('Please select at least one payment');
      return;
    }
    if (paymentStep === 2 && !paymentMethod) {
      showToastNotification('Please select a payment method');
      return;
    }
    if (paymentStep < 4) {
      setPaymentStep(paymentStep + 1);
    }
  };

  const handlePreviousPaymentStep = () => {
    if (paymentStep > 1) {
      setPaymentStep(paymentStep - 1);
    }
  };

  const handleTogglePayment = (paymentId: string) => {
    setSelectedPayments(prev =>
      prev.includes(paymentId)
        ? prev.filter(id => id !== paymentId)
        : [...prev, paymentId]
    );
  };

  const handleConfirmPayment = () => {
    const totalAmount = pendingPayments
      .filter(p => selectedPayments.includes(p.id))
      .reduce((sum, p) => sum + p.amount + p.lateFee, 0);

    const newTransaction: PaymentTransaction = {
      id: `p${paymentHistory.length + 1}`,
      receiptNumber: `RCP-2025-${String(paymentHistory.length + 1).padStart(3, '0')}`,
      date: new Date().toISOString().split('T')[0],
      amount: totalAmount,
      paymentMethod: paymentMethod as any,
      transactionId: `TXN${Date.now()}`,
      status: 'success',
      feeCategories: pendingPayments
        .filter(p => selectedPayments.includes(p.id))
        .map(p => p.category),
      notes: paymentNotes || undefined,
    };

    setPaymentHistory([newTransaction, ...paymentHistory]);
    setPendingPayments(prev => prev.filter(p => !selectedPayments.includes(p.id)));
    setShowPaymentModal(false);
    setSelectedPayments([]);
    setPaymentMethod('');
    setPaymentNotes('');
    setDiscountCode('');
    showToastNotification(`Payment of ₹${totalAmount.toLocaleString()} successful! Receipt: ${newTransaction.receiptNumber}`);
  };

  const handleViewReceipt = (transaction: PaymentTransaction) => {
    setSelectedReceipt(transaction);
    setShowReceiptModal(true);
  };

  const handleDownloadReceipt = (transaction: PaymentTransaction) => {
    showToastNotification(`Downloading receipt ${transaction.receiptNumber}...`);
    // Mock download functionality
  };

  const handlePrintReceipt = () => {
    if (selectedReceipt) {
      window.print();
      showToastNotification('Printing receipt...');
    }
  };

  const handleDownloadStatement = () => {
    showToastNotification('Downloading annual statement...');
    // Mock download functionality
  };

  // Filter Payment History
  const filteredHistory = paymentHistory.filter(transaction => {
    const matchesSearch =
      transaction.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.transactionId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.feeCategories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || transaction.paymentMethod === filterMethod;

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Get Status Color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
      case 'success':
        return '#10ac8b';
      case 'pending':
      case 'partial':
        return '#f59e0b';
      case 'overdue':
      case 'failed':
        return '#ef4444';
      case 'refunded':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  // Get Payment Method Icon
  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'card':
        return 'fa-credit-card';
      case 'netbanking':
        return 'fa-university';
      case 'upi':
        return 'fa-mobile-alt';
      case 'cash':
        return 'fa-money-bill-wave';
      case 'cheque':
        return 'fa-money-check';
      case 'wallet':
        return 'fa-wallet';
      default:
        return 'fa-money-bill';
    }
  };

  const calculateSelectedTotal = () => {
    return pendingPayments
      .filter(p => selectedPayments.includes(p.id))
      .reduce((sum, p) => sum + p.amount + p.lateFee, 0);
  };

  return (
    <div className="fee-payment-container">
      {/* Header */}
      <div className="fee-payment-header">
        <div className="fee-header-left">
          <div className="fee-header-icon">
            <i className="fas fa-credit-card"></i>
          </div>
          <div className="fee-header-title-group">
            <h1>Fee Payment Portal</h1>
            <p>Academic Year 2025-2026</p>
          </div>
        </div>
        <div className="fee-header-right">
          <div className="child-selector-fee">
            <i className="fas fa-user-graduate"></i>
            <select
              value={currentChild.id}
              onChange={(e) => {
                const child = childrenData.find(c => c.id === e.target.value);
                if (child) setCurrentChild(child);
              }}
            >
              {childrenData.map(child => (
                <option key={child.id} value={child.id}>
                  {child.name} - {child.rollNumber}
                </option>
              ))}
            </select>
          </div>
          <button className="btn-download-statement" onClick={handleDownloadStatement}>
            <i className="fas fa-file-download"></i>
            Annual Statement
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="fee-quick-stats">
        <div className="stat-card-fee stat-total-fee">
          <div className="stat-icon">
            <i className="fas fa-receipt"></i>
          </div>
          <div className="stat-details">
            <div className="stat-label">Total Fee</div>
            <div className="stat-value">₹{totalFee.toLocaleString()}</div>
          </div>
        </div>
        <div className="stat-card-fee stat-paid-fee">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <div className="stat-label">Paid Amount</div>
            <div className="stat-value">₹{paidAmount.toLocaleString()}</div>
            <div className="stat-subtext">{paymentPercentage.toFixed(1)}% completed</div>
          </div>
        </div>
        <div className="stat-card-fee stat-pending-fee">
          <div className="stat-icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-details">
            <div className="stat-label">Pending Amount</div>
            <div className="stat-value">₹{pendingAmount.toLocaleString()}</div>
            <div className="stat-subtext">{pendingPayments.length} pending items</div>
          </div>
        </div>
        <div className="stat-card-fee stat-due-date">
          <div className="stat-icon">
            <i className="fas fa-calendar-day"></i>
          </div>
          <div className="stat-details">
            <div className="stat-label">Next Due Date</div>
            <div className="stat-value">
              {nextDuePayment ? new Date(nextDuePayment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
            </div>
            <div className="stat-subtext">{nextDuePayment?.category}</div>
          </div>
        </div>
      </div>

      {/* Payment Progress */}
      <div className="payment-progress-section">
        <div className="progress-header">
          <h3><i className="fas fa-chart-line"></i> Payment Progress</h3>
          <span className="progress-percentage">{paymentPercentage.toFixed(1)}%</span>
        </div>
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${paymentPercentage}%` }}></div>
        </div>
        <div className="progress-details">
          <div className="progress-detail-item">
            <span className="progress-dot paid"></span>
            <span>Paid: ₹{paidAmount.toLocaleString()}</span>
          </div>
          <div className="progress-detail-item">
            <span className="progress-dot pending"></span>
            <span>Pending: ₹{pendingAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="fee-main-grid">
        {/* Pending Payments Section */}
        <div className="pending-payments-section">
          <div className="section-header">
            <h2><i className="fas fa-exclamation-circle"></i> Pending Payments</h2>
            {pendingPayments.length > 0 && (
              <button className="btn-pay-all" onClick={() => handleOpenPaymentModal()}>
                <i className="fas fa-credit-card"></i> Pay All
              </button>
            )}
          </div>
          <div className="pending-payments-list">
            {pendingPayments.length === 0 ? (
              <div className="no-pending-payments">
                <i className="fas fa-check-circle"></i>
                <p>All payments are up to date!</p>
                <span>No pending payments</span>
              </div>
            ) : (
              pendingPayments.map(payment => (
                <div key={payment.id} className={`pending-payment-card ${payment.isOverdue ? 'overdue' : ''}`}>
                  <div className="pending-payment-header">
                    <div className="pending-payment-info">
                      <h4>{payment.category}</h4>
                      <span className="payment-term">{payment.term}</span>
                    </div>
                    {payment.isOverdue && (
                      <span className="overdue-badge">
                        <i className="fas fa-exclamation-triangle"></i> Overdue
                      </span>
                    )}
                  </div>
                  <div className="pending-payment-details">
                    <div className="payment-amount-row">
                      <span>Amount:</span>
                      <strong>₹{payment.amount.toLocaleString()}</strong>
                    </div>
                    {payment.lateFee > 0 && (
                      <div className="payment-amount-row late-fee">
                        <span>Late Fee:</span>
                        <strong className="late-fee-amount">+₹{payment.lateFee.toLocaleString()}</strong>
                      </div>
                    )}
                    <div className="payment-amount-row total">
                      <span>Total Due:</span>
                      <strong>₹{(payment.amount + payment.lateFee).toLocaleString()}</strong>
                    </div>
                    <div className="payment-due-date">
                      <i className="fas fa-calendar"></i>
                      <span>Due: {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <button className="btn-pay-now" onClick={() => handleOpenPaymentModal(payment.id)}>
                    <i className="fas fa-credit-card"></i> Pay Now
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Fee Structure Section */}
        <div className="fee-structure-section">
          <div className="section-header">
            <h2><i className="fas fa-list-alt"></i> Fee Structure</h2>
          </div>
          <div className="fee-structure-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Term</th>
                  <th>Amount</th>
                  <th>Paid</th>
                  <th>Pending</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {feeCategories.map(category => (
                  <tr key={category.id}>
                    <td className="category-name">
                      <i className="fas fa-folder"></i>
                      {category.name}
                    </td>
                    <td>{category.term}</td>
                    <td className="amount-cell">₹{category.amount.toLocaleString()}</td>
                    <td className="amount-cell paid">₹{category.paid.toLocaleString()}</td>
                    <td className="amount-cell pending">₹{category.pending.toLocaleString()}</td>
                    <td>
                      <span
                        className="status-badge-fee"
                        style={{ backgroundColor: getStatusColor(category.status) }}
                      >
                        {category.status}
                      </span>
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={2}><strong>Total</strong></td>
                  <td className="amount-cell"><strong>₹{totalFee.toLocaleString()}</strong></td>
                  <td className="amount-cell paid"><strong>₹{paidAmount.toLocaleString()}</strong></td>
                  <td className="amount-cell pending"><strong>₹{pendingAmount.toLocaleString()}</strong></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Payment History Section */}
      <div className="payment-history-section">
        <div className="section-header">
          <h2><i className="fas fa-history"></i> Payment History</h2>
        </div>
        <div className="payment-history-controls">
          <div className="search-box-fee">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search by receipt, transaction ID, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn-fee" onClick={() => setSearchQuery('')}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          <select
            className="filter-select-fee"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
          <select
            className="filter-select-fee"
            value={filterMethod}
            onChange={(e) => setFilterMethod(e.target.value)}
          >
            <option value="all">All Methods</option>
            <option value="card">Card</option>
            <option value="netbanking">Net Banking</option>
            <option value="upi">UPI</option>
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="wallet">Wallet</option>
          </select>
        </div>
        <div className="payment-history-table">
          {filteredHistory.length === 0 ? (
            <div className="no-history">
              <i className="fas fa-file-invoice"></i>
              <p>No payment history found</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Receipt</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Transaction ID</th>
                  <th>Categories</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map(transaction => (
                  <tr key={transaction.id}>
                    <td className="receipt-cell">
                      <i className="fas fa-receipt"></i>
                      {transaction.receiptNumber}
                    </td>
                    <td>{new Date(transaction.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="amount-cell">₹{transaction.amount.toLocaleString()}</td>
                    <td>
                      <span className="payment-method-badge">
                        <i className={`fas ${getPaymentMethodIcon(transaction.paymentMethod)}`}></i>
                        {transaction.paymentMethod.toUpperCase()}
                      </span>
                    </td>
                    <td className="transaction-id">{transaction.transactionId}</td>
                    <td className="categories-cell">
                      {transaction.feeCategories.slice(0, 2).map((cat, idx) => (
                        <span key={idx} className="category-tag">{cat}</span>
                      ))}
                      {transaction.feeCategories.length > 2 && (
                        <span className="category-tag more">+{transaction.feeCategories.length - 2}</span>
                      )}
                    </td>
                    <td>
                      <span
                        className="status-badge-fee"
                        style={{ backgroundColor: getStatusColor(transaction.status) }}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button className="btn-icon" onClick={() => handleViewReceipt(transaction)} title="View Receipt">
                        <i className="fas fa-eye"></i>
                      </button>
                      <button className="btn-icon" onClick={() => handleDownloadReceipt(transaction)} title="Download">
                        <i className="fas fa-download"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <>
          <div className="modal-overlay-fee" onClick={() => setShowPaymentModal(false)}></div>
          <div className="payment-modal-fee">
            <div className="payment-modal-header">
              <h3>
                <i className="fas fa-credit-card"></i>
                Make Payment
              </h3>
              <button className="modal-close-btn" onClick={() => setShowPaymentModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Payment Steps */}
            <div className="payment-steps">
              <div className={`payment-step ${paymentStep >= 1 ? 'active' : ''} ${paymentStep > 1 ? 'completed' : ''}`}>
                <div className="step-number">1</div>
                <div className="step-label">Select Items</div>
              </div>
              <div className="step-line"></div>
              <div className={`payment-step ${paymentStep >= 2 ? 'active' : ''} ${paymentStep > 2 ? 'completed' : ''}`}>
                <div className="step-number">2</div>
                <div className="step-label">Payment Method</div>
              </div>
              <div className="step-line"></div>
              <div className={`payment-step ${paymentStep >= 3 ? 'active' : ''} ${paymentStep > 3 ? 'completed' : ''}`}>
                <div className="step-number">3</div>
                <div className="step-label">Details</div>
              </div>
              <div className="step-line"></div>
              <div className={`payment-step ${paymentStep >= 4 ? 'active' : ''}`}>
                <div className="step-number">4</div>
                <div className="step-label">Confirm</div>
              </div>
            </div>

            <div className="payment-modal-content">
              {/* Step 1: Select Items */}
              {paymentStep === 1 && (
                <div className="payment-step-content">
                  <h4><i className="fas fa-check-square"></i> Select Payment Items</h4>
                  <div className="payment-items-list">
                    {pendingPayments.map(payment => (
                      <div key={payment.id} className="payment-item-checkbox">
                        <label>
                          <input
                            type="checkbox"
                            checked={selectedPayments.includes(payment.id)}
                            onChange={() => handleTogglePayment(payment.id)}
                          />
                          <div className="payment-item-details">
                            <div className="payment-item-name">
                              {payment.category}
                              {payment.isOverdue && <span className="overdue-tag">Overdue</span>}
                            </div>
                            <div className="payment-item-info">
                              <span>{payment.term}</span>
                              <span>Due: {new Date(payment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="payment-item-amount">
                              ₹{payment.amount.toLocaleString()}
                              {payment.lateFee > 0 && <span className="late-fee-tag">+₹{payment.lateFee} late fee</span>}
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedPayments.length > 0 && (
                    <div className="selected-total">
                      <span>Total Selected:</span>
                      <strong>₹{calculateSelectedTotal().toLocaleString()}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Payment Method */}
              {paymentStep === 2 && (
                <div className="payment-step-content">
                  <h4><i className="fas fa-wallet"></i> Select Payment Method</h4>
                  <div className="payment-methods-grid">
                    <button
                      className={`payment-method-option ${paymentMethod === 'card' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <i className="fas fa-credit-card"></i>
                      <span>Credit/Debit Card</span>
                    </button>
                    <button
                      className={`payment-method-option ${paymentMethod === 'netbanking' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <i className="fas fa-university"></i>
                      <span>Net Banking</span>
                    </button>
                    <button
                      className={`payment-method-option ${paymentMethod === 'upi' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <i className="fas fa-mobile-alt"></i>
                      <span>UPI</span>
                    </button>
                    <button
                      className={`payment-method-option ${paymentMethod === 'wallet' ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod('wallet')}
                    >
                      <i className="fas fa-wallet"></i>
                      <span>Wallet</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment Details */}
              {paymentStep === 3 && (
                <div className="payment-step-content">
                  <h4><i className="fas fa-info-circle"></i> Payment Details</h4>
                  <div className="form-group-fee">
                    <label>Discount Code (Optional)</label>
                    <input
                      type="text"
                      placeholder="Enter discount code"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                    />
                  </div>
                  <div className="form-group-fee">
                    <label>Payment Notes (Optional)</label>
                    <textarea
                      rows={3}
                      placeholder="Add any notes for this payment..."
                      value={paymentNotes}
                      onChange={(e) => setPaymentNotes(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="payment-summary-box">
                    <div className="summary-row">
                      <span>Selected Items:</span>
                      <span>{selectedPayments.length}</span>
                    </div>
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>₹{calculateSelectedTotal().toLocaleString()}</span>
                    </div>
                    {discountCode && (
                      <div className="summary-row discount">
                        <span>Discount:</span>
                        <span>- ₹0</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <strong>Total Amount:</strong>
                      <strong>₹{calculateSelectedTotal().toLocaleString()}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Confirm */}
              {paymentStep === 4 && (
                <div className="payment-step-content">
                  <h4><i className="fas fa-check-circle"></i> Confirm Payment</h4>
                  <div className="payment-confirmation-details">
                    <div className="confirmation-section">
                      <h5><i className="fas fa-list"></i> Payment Items</h5>
                      <ul>
                        {pendingPayments.filter(p => selectedPayments.includes(p.id)).map(p => (
                          <li key={p.id}>
                            {p.category} - ₹{(p.amount + p.lateFee).toLocaleString()}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="confirmation-section">
                      <h5><i className="fas fa-wallet"></i> Payment Method</h5>
                      <p>
                        <i className={`fas ${getPaymentMethodIcon(paymentMethod)}`}></i>
                        {paymentMethod.toUpperCase()}
                      </p>
                    </div>
                    <div className="confirmation-section">
                      <h5><i className="fas fa-money-bill-wave"></i> Total Amount</h5>
                      <p className="total-amount-confirm">₹{calculateSelectedTotal().toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="payment-terms">
                    <label>
                      <input type="checkbox" defaultChecked />
                      <span>I agree to the terms and conditions</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div className="payment-modal-footer">
              {paymentStep > 1 && (
                <button className="btn-secondary-fee" onClick={handlePreviousPaymentStep}>
                  <i className="fas fa-arrow-left"></i> Previous
                </button>
              )}
              {paymentStep < 4 ? (
                <button className="btn-primary-fee" onClick={handleNextPaymentStep}>
                  Next <i className="fas fa-arrow-right"></i>
                </button>
              ) : (
                <button className="btn-primary-fee" onClick={handleConfirmPayment}>
                  <i className="fas fa-check"></i> Confirm Payment
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedReceipt && (
        <>
          <div className="modal-overlay-fee" onClick={() => setShowReceiptModal(false)}></div>
          <div className="receipt-modal-fee">
            <div className="receipt-modal-header">
              <h3><i className="fas fa-receipt"></i> Payment Receipt</h3>
              <button className="modal-close-btn" onClick={() => setShowReceiptModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="receipt-content">
              <div className="receipt-school-info">
                <h2>EdgeUp School</h2>
                <p>123 Education Street, Learning City, 560001</p>
                <p>Phone: +91 80 1234 5678 | Email: fees@edgeup.school</p>
              </div>
              <div className="receipt-divider"></div>
              <div className="receipt-info-grid">
                <div className="receipt-info-item">
                  <label>Receipt Number:</label>
                  <span>{selectedReceipt.receiptNumber}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Date:</label>
                  <span>{new Date(selectedReceipt.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Student Name:</label>
                  <span>{currentChild.name}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Roll Number:</label>
                  <span>{currentChild.rollNumber}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Grade/Section:</label>
                  <span>{currentChild.grade}{currentChild.section}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Transaction ID:</label>
                  <span>{selectedReceipt.transactionId}</span>
                </div>
              </div>
              <div className="receipt-divider"></div>
              <div className="receipt-payment-details">
                <h4>Payment Details</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Description</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReceipt.feeCategories.map((cat, idx) => (
                      <tr key={idx}>
                        <td>{cat}</td>
                        <td>₹{(selectedReceipt.amount / selectedReceipt.feeCategories.length).toLocaleString()}</td>
                      </tr>
                    ))}
                    <tr className="total-row">
                      <td><strong>Total Paid</strong></td>
                      <td><strong>₹{selectedReceipt.amount.toLocaleString()}</strong></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="receipt-payment-method">
                <span>Payment Method: </span>
                <strong>
                  <i className={`fas ${getPaymentMethodIcon(selectedReceipt.paymentMethod)}`}></i>
                  {selectedReceipt.paymentMethod.toUpperCase()}
                </strong>
              </div>
              {selectedReceipt.notes && (
                <div className="receipt-notes">
                  <strong>Notes:</strong> {selectedReceipt.notes}
                </div>
              )}
              <div className="receipt-footer">
                <p>This is a computer-generated receipt and does not require a signature.</p>
                <p>Thank you for your payment!</p>
              </div>
            </div>
            <div className="receipt-modal-footer">
              <button className="btn-secondary-fee" onClick={handlePrintReceipt}>
                <i className="fas fa-print"></i> Print
              </button>
              <button className="btn-primary-fee" onClick={() => handleDownloadReceipt(selectedReceipt)}>
                <i className="fas fa-download"></i> Download PDF
              </button>
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="toast-notification-fee">
          <i className="fas fa-check-circle"></i>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default FeePayment;
