import { useState } from 'react';

// TypeScript Interfaces
interface Student {
  id: string;
  rollNumber: string;
  name: string;
  year: string;
  department: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
}

interface StudentFeeRecord {
  studentId: string;
  studentName: string;
  rollNumber: string;
  year: string;
  department: string;
  totalFee: number;
  paidAmount: number;
  pendingAmount: number;
  overdueAmount: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  lastPaymentDate: string;
  feeBreakdown: FeeBreakdownItem[];
  concessions: Concession[];
}

interface FeeBreakdownItem {
  category: string;
  amount: number;
  paid: number;
  pending: number;
  dueDate: string;
  term: number;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

interface Transaction {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  date: string;
  time: string;
  amount: number;
  paymentMethod: 'card' | 'netbanking' | 'upi' | 'cash' | 'cheque' | 'wallet';
  transactionId: string;
  status: 'success' | 'pending' | 'failed' | 'refunded';
  categories: string[];
  entryType: 'auto' | 'manual';
  enteredBy?: string;
  notes?: string;
}

interface Concession {
  id: string;
  studentId: string;
  studentName: string;
  year: string;
  type: 'scholarship' | 'discount' | 'waiver';
  category: string;
  amount: number | string;
  reason: string;
  validUntil: string;
  appliedDate: string;
}

interface FeeStructure {
  category: string;
  annualAmount: number;
  term1: number;
  term2: number;
  term3: number;
  applicableYears: string[];
}

const FeeManagement = () => {
  // State Management
  const [selectedStudent, setSelectedStudent] = useState<StudentFeeRecord | null>(null);
  const [showManualPaymentModal, setShowManualPaymentModal] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [showConcessionModal, setShowConcessionModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedStudentsForReminder, setSelectedStudentsForReminder] = useState<string[]>([]);

  // Mock Data - Fee Structure
  const feeStructures: FeeStructure[] = [
    { category: 'Tuition Fee', annualAmount: 45000, term1: 15000, term2: 15000, term3: 15000, applicableYears: ['all'] },
    { category: 'Transportation', annualAmount: 12000, term1: 4000, term2: 4000, term3: 4000, applicableYears: ['all'] },
    { category: 'Library Fee', annualAmount: 3000, term1: 1000, term2: 1000, term3: 1000, applicableYears: ['all'] },
    { category: 'Laboratory Fee', annualAmount: 8000, term1: 2667, term2: 2667, term3: 2666, applicableYears: ['1', '2', '3', '4'] },
    { category: 'Sports & Activities', annualAmount: 5000, term1: 1667, term2: 1667, term3: 1666, applicableYears: ['all'] },
    { category: 'Examination Fee', annualAmount: 4000, term1: 2000, term2: 0, term3: 2000, applicableYears: ['all'] },
  ];

  // Mock Data - Student Fee Records
  const studentFeeRecords: StudentFeeRecord[] = [
    {
      studentId: 's1',
      studentName: 'Aarav Kumar',
      rollNumber: 'CSE2025001',
      year: '1',
      department: 'CSE',
      totalFee: 77000,
      paidAmount: 77000,
      pendingAmount: 0,
      overdueAmount: 0,
      status: 'paid',
      lastPaymentDate: '2025-10-15',
      feeBreakdown: [
        { category: 'Tuition Fee', amount: 45000, paid: 45000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Transportation', amount: 12000, paid: 12000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Library Fee', amount: 3000, paid: 3000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Laboratory Fee', amount: 8000, paid: 8000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Sports & Activities', amount: 5000, paid: 5000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Examination Fee', amount: 4000, paid: 4000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
      ],
      concessions: [],
    },
    {
      studentId: 's2',
      studentName: 'Priya Sharma',
      rollNumber: '10A002',
      grade: '10',
      section: 'A',
      totalFee: 77000,
      paidAmount: 54000,
      pendingAmount: 23000,
      overdueAmount: 0,
      status: 'partial',
      lastPaymentDate: '2025-09-20',
      feeBreakdown: [
        { category: 'Tuition Fee', amount: 45000, paid: 30000, pending: 15000, dueDate: '2025-11-15', term: 2, status: 'partial' },
        { category: 'Transportation', amount: 12000, paid: 8000, pending: 4000, dueDate: '2025-11-15', term: 2, status: 'partial' },
        { category: 'Library Fee', amount: 3000, paid: 3000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Laboratory Fee', amount: 8000, paid: 8000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Sports & Activities', amount: 5000, paid: 5000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Examination Fee', amount: 4000, paid: 0, pending: 4000, dueDate: '2025-11-15', term: 2, status: 'pending' },
      ],
      concessions: [],
    },
    {
      studentId: 's3',
      studentName: 'Rahul Verma',
      rollNumber: '10A003',
      grade: '10',
      section: 'A',
      totalFee: 77000,
      paidAmount: 38000,
      pendingAmount: 39000,
      overdueAmount: 15000,
      status: 'overdue',
      lastPaymentDate: '2025-08-10',
      feeBreakdown: [
        { category: 'Tuition Fee', amount: 45000, paid: 30000, pending: 15000, dueDate: '2025-10-20', term: 2, status: 'overdue' },
        { category: 'Transportation', amount: 12000, paid: 4000, pending: 8000, dueDate: '2025-10-20', term: 2, status: 'overdue' },
        { category: 'Library Fee', amount: 3000, paid: 0, pending: 3000, dueDate: '2025-10-20', term: 2, status: 'overdue' },
        { category: 'Laboratory Fee', amount: 8000, paid: 0, pending: 8000, dueDate: '2025-10-20', term: 2, status: 'overdue' },
        { category: 'Sports & Activities', amount: 5000, paid: 4000, pending: 1000, dueDate: '2025-10-20', term: 2, status: 'overdue' },
        { category: 'Examination Fee', amount: 4000, paid: 0, pending: 4000, dueDate: '2025-10-20', term: 2, status: 'overdue' },
      ],
      concessions: [],
    },
    {
      studentId: 's4',
      studentName: 'Diya Patel',
      rollNumber: '7B015',
      grade: '7',
      section: 'B',
      totalFee: 73000,
      paidAmount: 48000,
      pendingAmount: 25000,
      overdueAmount: 0,
      status: 'partial',
      lastPaymentDate: '2025-10-01',
      feeBreakdown: [
        { category: 'Tuition Fee', amount: 45000, paid: 30000, pending: 15000, dueDate: '2025-11-15', term: 2, status: 'partial' },
        { category: 'Transportation', amount: 12000, paid: 8000, pending: 4000, dueDate: '2025-11-15', term: 2, status: 'partial' },
        { category: 'Library Fee', amount: 3000, paid: 3000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Laboratory Fee', amount: 8000, paid: 5000, pending: 3000, dueDate: '2025-11-15', term: 2, status: 'partial' },
        { category: 'Sports & Activities', amount: 5000, paid: 2000, pending: 3000, dueDate: '2025-11-15', term: 2, status: 'partial' },
        { category: 'Examination Fee', amount: 4000, paid: 0, pending: 0, dueDate: '2026-03-15', term: 3, status: 'pending' },
      ],
      concessions: [],
    },
    {
      studentId: 's5',
      studentName: 'Rohan Singh',
      rollNumber: '9C012',
      grade: '9',
      section: 'C',
      totalFee: 38500,
      paidAmount: 38500,
      pendingAmount: 0,
      overdueAmount: 0,
      status: 'paid',
      lastPaymentDate: '2025-09-30',
      feeBreakdown: [
        { category: 'Tuition Fee', amount: 22500, paid: 22500, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Transportation', amount: 6000, paid: 6000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Library Fee', amount: 1500, paid: 1500, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Laboratory Fee', amount: 4000, paid: 4000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Sports & Activities', amount: 2500, paid: 2500, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
        { category: 'Examination Fee', amount: 2000, paid: 2000, pending: 0, dueDate: '2025-04-15', term: 1, status: 'paid' },
      ],
      concessions: [{ id: 'c1', studentId: 's5', studentName: 'Rohan Singh', grade: '9', type: 'scholarship', category: 'Merit Scholarship', amount: '50%', reason: 'Board Topper', validUntil: '2026-03-31', appliedDate: '2025-04-01' }],
    },
  ];

  // Mock Data - Recent Transactions
  const recentTransactions: Transaction[] = [
    {
      id: 't1',
      receiptNumber: 'RCP-2025-1234',
      studentId: 's1',
      studentName: 'Aarav Kumar',
      rollNumber: '10A001',
      date: '2025-10-23',
      time: '14:45',
      amount: 15000,
      paymentMethod: 'upi',
      transactionId: 'UPI202510231445',
      status: 'success',
      categories: ['Tuition Fee - Term 2'],
      entryType: 'auto',
    },
    {
      id: 't2',
      receiptNumber: 'RCP-2025-1233',
      studentId: 's4',
      studentName: 'Diya Patel',
      rollNumber: '7B015',
      date: '2025-10-23',
      time: '11:20',
      amount: 6000,
      paymentMethod: 'netbanking',
      transactionId: 'NB789456123',
      status: 'success',
      categories: ['Transportation - Term 2'],
      entryType: 'auto',
    },
    {
      id: 't3',
      receiptNumber: 'RCP-2025-1232',
      studentId: 's3',
      studentName: 'Rahul Verma',
      rollNumber: '10A003',
      date: '2025-10-22',
      time: '16:30',
      amount: 5000,
      paymentMethod: 'cash',
      transactionId: 'CASH-2025-1022',
      status: 'success',
      categories: ['Library Fee', 'Lab Fee'],
      entryType: 'manual',
      enteredBy: 'Admin Office',
      notes: 'Cash paid at office',
    },
    {
      id: 't4',
      receiptNumber: 'RCP-2025-1231',
      studentId: 's2',
      studentName: 'Priya Sharma',
      rollNumber: '10A002',
      date: '2025-10-20',
      time: '09:15',
      amount: 8000,
      paymentMethod: 'card',
      transactionId: 'CARD987654321',
      status: 'success',
      categories: ['Transportation - Term 2'],
      entryType: 'auto',
    },
  ];

  // Mock Data - Active Concessions
  const activeConcessions: Concession[] = [
    {
      id: 'c1',
      studentId: 's5',
      studentName: 'Rohan Singh',
      grade: '9',
      type: 'scholarship',
      category: 'Merit Scholarship',
      amount: '50%',
      reason: 'Board Topper',
      validUntil: '2026-03-31',
      appliedDate: '2025-04-01',
    },
    {
      id: 'c2',
      studentId: 's6',
      studentName: 'Neha Kumar',
      grade: '10',
      type: 'discount',
      category: 'Sibling Discount',
      amount: 5000,
      reason: '2nd Child',
      validUntil: '2026-03-31',
      appliedDate: '2025-04-01',
    },
    {
      id: 'c3',
      studentId: 's7',
      studentName: 'Amit Reddy',
      grade: '8',
      type: 'waiver',
      category: 'Financial Aid',
      amount: '100%',
      reason: 'Economically Weak Section',
      validUntil: '2026-03-31',
      appliedDate: '2025-04-01',
    },
  ];

  // Utility Functions
  const formatCurrency = (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'paid': return '#10ac8b';
      case 'partial': return '#f59e0b';
      case 'pending': return '#6c757d';
      case 'overdue': return '#ef4444';
      default: return '#6c757d';
    }
  };

  const getPaymentMethodIcon = (method: string): string => {
    switch (method) {
      case 'upi': return 'fa-mobile-alt';
      case 'card': return 'fa-credit-card';
      case 'netbanking': return 'fa-university';
      case 'cash': return 'fa-money-bill-wave';
      case 'cheque': return 'fa-file-invoice';
      case 'wallet': return 'fa-wallet';
      default: return 'fa-money-bill-wave';
    }
  };

  // Calculate Overview Statistics
  const calculateStats = () => {
    const totalCollections = studentFeeRecords.reduce((sum, record) => sum + record.paidAmount, 0);
    const totalTarget = studentFeeRecords.reduce((sum, record) => sum + record.totalFee, 0);
    const totalOutstanding = studentFeeRecords.reduce((sum, record) => sum + record.pendingAmount, 0);
    const totalOverdue = studentFeeRecords.reduce((sum, record) => sum + record.overdueAmount, 0);
    const overdueStudentsCount = studentFeeRecords.filter(r => r.status === 'overdue').length;
    const outstandingStudentsCount = studentFeeRecords.filter(r => r.pendingAmount > 0).length;
    const collectionRate = totalTarget > 0 ? (totalCollections / totalTarget) * 100 : 0;

    return {
      totalCollections,
      totalTarget,
      totalOutstanding,
      totalOverdue,
      overdueStudentsCount,
      outstandingStudentsCount,
      collectionRate,
      collectionProgress: totalTarget > 0 ? (totalCollections / totalTarget) * 100 : 0,
    };
  };

  const stats = calculateStats();

  // Filter Student Records
  const getFilteredRecords = () => {
    let filtered = studentFeeRecords;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (record) =>
          record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          record.rollNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Year filter
    if (filterYear !== 'all') {
      filtered = filtered.filter((record) => record.year === filterYear);
    }

    // Department filter
    if (filterDepartment !== 'all') {
      filtered = filtered.filter((record) => record.department === filterDepartment);
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((record) => record.status === filterStatus);
    }

    return filtered;
  };

  const filteredRecords = getFilteredRecords();

  // Handlers
  const handleViewDetails = (record: StudentFeeRecord) => {
    setSelectedStudent(record);
  };

  const handleSendReminder = (studentId: string) => {
    setSelectedStudentsForReminder([studentId]);
    setShowReminderModal(true);
  };

  const handleRecordPayment = (studentId: string) => {
    const student = studentFeeRecords.find(r => r.studentId === studentId);
    if (student) {
      setSelectedStudent(student);
      setShowManualPaymentModal(true);
    }
  };

  const handleExportReport = (type: string) => {
    alert(`Generating ${type} report... (Feature will be implemented with backend)`);
  };

  return (
    <div className="fee-management-page">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-coins"></i> Fee Management</h1>
          <p>Manage student fee collections, payments, and financial records</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Add Fee functionality')}>
            <i className="fas fa-plus"></i>
            Add Fee Rule
          </button>
          <button className="btn-secondary" onClick={() => handleExportReport('fees')}>
            <i className="fas fa-download"></i>
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="fee-stats-grid">
        <div className="fee-stat-card total">
          <div className="stat-icon">
            <i className="fas fa-coins"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Collections</span>
            <span className="stat-value">{formatCurrency(stats.totalCollections)}</span>
            <div className="stat-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${stats.collectionProgress}%` }}></div>
              </div>
              <span className="progress-text">{formatCurrency(stats.totalTarget)} target</span>
            </div>
          </div>
        </div>

        <div className="fee-stat-card outstanding">
          <div className="stat-icon">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Outstanding Payments</span>
            <span className="stat-value">{formatCurrency(stats.totalOutstanding)}</span>
            <span className="stat-detail">{stats.outstandingStudentsCount} students</span>
          </div>
        </div>

        <div className="fee-stat-card overdue">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Overdue Payments</span>
            <span className="stat-value">{formatCurrency(stats.totalOverdue)}</span>
            <span className="stat-detail">{stats.overdueStudentsCount} students</span>
          </div>
        </div>

        <div className="fee-stat-card collection-rate">
          <div className="stat-icon">
            <i className="fas fa-percentage"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Collection Rate</span>
            <span className="stat-value">{stats.collectionRate.toFixed(1)}%</span>
            <span className="stat-detail trend-up">
              <i className="fas fa-arrow-up"></i> +2.3%
            </span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="fee-quick-actions">
        <button className="action-btn primary" onClick={() => setShowManualPaymentModal(true)}>
          <i className="fas fa-plus-circle"></i>
          Record Manual Payment
        </button>
        <button className="action-btn secondary" onClick={() => setShowReminderModal(true)}>
          <i className="fas fa-bell"></i>
          Send Reminders
        </button>
        <button className="action-btn secondary" onClick={() => setShowReportModal(true)}>
          <i className="fas fa-file-chart-line"></i>
          Generate Reports
        </button>
        <button className="action-btn secondary" onClick={() => handleExportReport('Defaulters List')}>
          <i className="fas fa-user-clock"></i>
          View Defaulters
        </button>
      </div>

      {/* Student Fee Records Section */}
      <div className="fee-records-section">
        <div className="section-header">
          <h2>Student Fee Records</h2>
          <div className="header-actions">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="fee-filters">
          <div className="filter-group">
            <label>Year</label>
            <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="all">All Years</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Department</label>
            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              <option value="CSE">Computer Science</option>
              <option value="ECE">Electronics</option>
              <option value="MECH">Mechanical</option>
              <option value="CIVIL">Civil</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="partial">Partial</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <button className="filter-reset" onClick={() => { setFilterGrade('all'); setFilterSection('all'); setFilterStatus('all'); setSearchQuery(''); }}>
            <i className="fas fa-redo"></i> Reset Filters
          </button>
        </div>

        {/* Student Fee Table */}
        <div className="fee-table-container">
          <table className="fee-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student Name</th>
                <th>Year</th>
                <th>Department</th>
                <th>Total Fee</th>
                <th>Paid</th>
                <th>Pending</th>
                <th>Status</th>
                <th>Last Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((record) => (
                  <tr key={record.studentId}>
                    <td>{record.rollNumber}</td>
                    <td className="student-name-cell">
                      <i className="fas fa-user-circle"></i>
                      {record.studentName}
                    </td>
                    <td>{record.year}</td>
                    <td>{record.department}</td>
                    <td className="amount-cell">{formatCurrency(record.totalFee)}</td>
                    <td className="amount-cell paid">{formatCurrency(record.paidAmount)}</td>
                    <td className="amount-cell pending">{formatCurrency(record.pendingAmount)}</td>
                    <td>
                      <span className={`status-badge ${record.status}`}>
                        {record.status === 'paid' && <><i className="fas fa-check-circle"></i> Paid</>}
                        {record.status === 'partial' && <><i className="fas fa-clock"></i> Partial</>}
                        {record.status === 'pending' && <><i className="fas fa-hourglass-half"></i> Pending</>}
                        {record.status === 'overdue' && <><i className="fas fa-exclamation-circle"></i> Overdue</>}
                      </span>
                    </td>
                    <td>{formatDate(record.lastPaymentDate)}</td>
                    <td className="actions-cell">
                      <button className="action-icon-btn view" onClick={() => handleViewDetails(record)} title="View Details">
                        <i className="fas fa-eye"></i>
                      </button>
                      {record.pendingAmount > 0 && (
                        <>
                          <button className="action-icon-btn reminder" onClick={() => handleSendReminder(record.studentId)} title="Send Reminder">
                            <i className="fas fa-bell"></i>
                          </button>
                          <button className="action-icon-btn payment" onClick={() => handleRecordPayment(record.studentId)} title="Record Payment">
                            <i className="fas fa-plus"></i>
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={10} className="no-data">
                    <i className="fas fa-inbox"></i>
                    <p>No records found matching your filters</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="recent-transactions-section">
        <div className="section-header">
          <h2>Recent Payment Transactions</h2>
          <button className="view-all-btn" onClick={() => alert('View all transactions')}>
            View All <i className="fas fa-arrow-right"></i>
          </button>
        </div>

        <div className="transactions-list">
          {recentTransactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-icon">
                <i className={`fas ${getPaymentMethodIcon(transaction.paymentMethod)}`}></i>
              </div>
              <div className="transaction-details">
                <div className="transaction-primary">
                  <span className="student-name">{transaction.studentName}</span>
                  <span className="roll-number">({transaction.rollNumber})</span>
                  <span className="amount">{formatCurrency(transaction.amount)}</span>
                </div>
                <div className="transaction-secondary">
                  <span className="payment-method">
                    {transaction.paymentMethod.toUpperCase()}
                  </span>
                  <span className="separator">•</span>
                  <span className="transaction-id">{transaction.transactionId}</span>
                  <span className="separator">•</span>
                  <span className="categories">{transaction.categories.join(', ')}</span>
                </div>
              </div>
              <div className="transaction-meta">
                <span className="transaction-time">{transaction.time}</span>
                <span className="transaction-date">{formatDate(transaction.date)}</span>
                <button className="receipt-btn" onClick={() => alert(`View receipt ${transaction.receiptNumber}`)}>
                  <i className="fas fa-receipt"></i> Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fee Structure & Concessions Row */}
      <div className="fee-info-row">
        {/* Fee Structure */}
        <div className="fee-structure-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-list-ul"></i> Fee Structure
            </h3>
          </div>
          <div className="fee-structure-list">
            {feeStructures.slice(0, 6).map((structure, index) => (
              <div key={index} className="structure-item">
                <div className="structure-name">{structure.category}</div>
                <div className="structure-amount">{formatCurrency(structure.annualAmount)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Concessions */}
        <div className="concessions-card">
          <div className="card-header">
            <h3>
              <i className="fas fa-gift"></i> Active Concessions
            </h3>
            <button className="add-concession-btn" onClick={() => setShowConcessionModal(true)}>
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="concessions-list">
            {activeConcessions.map((concession) => (
              <div key={concession.id} className="concession-item">
                <div className="concession-student">
                  <span className="student-name">{concession.studentName}</span>
                  <span className="grade">Grade {concession.grade}</span>
                </div>
                <div className="concession-details">
                  <span className={`concession-type ${concession.type}`}>
                    {concession.type === 'scholarship' && <i className="fas fa-trophy"></i>}
                    {concession.type === 'discount' && <i className="fas fa-percentage"></i>}
                    {concession.type === 'waiver' && <i className="fas fa-hand-holding-heart"></i>}
                    {concession.category}
                  </span>
                  <span className="concession-amount">{typeof concession.amount === 'number' ? formatCurrency(concession.amount) : concession.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Student Fee Detail Modal */}
      {selectedStudent && !showManualPaymentModal && (
        <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="fee-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedStudent.studentName}</h2>
                <p>{selectedStudent.rollNumber} • Year {selectedStudent.year} • {selectedStudent.department}</p>
              </div>
              <button className="modal-close" onClick={() => setSelectedStudent(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="fee-summary-cards">
                <div className="summary-card">
                  <span className="summary-label">Total Fee</span>
                  <span className="summary-value">{formatCurrency(selectedStudent.totalFee)}</span>
                </div>
                <div className="summary-card paid">
                  <span className="summary-label">Paid</span>
                  <span className="summary-value">{formatCurrency(selectedStudent.paidAmount)}</span>
                </div>
                <div className="summary-card pending">
                  <span className="summary-label">Pending</span>
                  <span className="summary-value">{formatCurrency(selectedStudent.pendingAmount)}</span>
                </div>
              </div>

              <h3>Fee Breakdown</h3>
              <div className="fee-breakdown-table">
                <table>
                  <thead>
                    <tr>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Paid</th>
                      <th>Pending</th>
                      <th>Due Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedStudent.feeBreakdown.map((item, index) => (
                      <tr key={index}>
                        <td>{item.category}</td>
                        <td>{formatCurrency(item.amount)}</td>
                        <td className="paid">{formatCurrency(item.paid)}</td>
                        <td className="pending">{formatCurrency(item.pending)}</td>
                        <td>{formatDate(item.dueDate)}</td>
                        <td>
                          <span className={`status-badge ${item.status}`}>{item.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-actions">
                <button className="modal-btn secondary" onClick={() => handleSendReminder(selectedStudent.studentId)}>
                  <i className="fas fa-bell"></i>
                  Send Reminder
                </button>
                <button className="modal-btn primary" onClick={() => setShowManualPaymentModal(true)}>
                  <i className="fas fa-plus-circle"></i>
                  Record Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manual Payment Modal */}
      {showManualPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowManualPaymentModal(false)}>
          <div className="payment-entry-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Record Manual Payment</h2>
              <button className="modal-close" onClick={() => setShowManualPaymentModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <form className="payment-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Student</label>
                    <select defaultValue={selectedStudent?.studentId || ''}>
                      <option value="">Select Student</option>
                      {studentFeeRecords.map((record) => (
                        <option key={record.studentId} value={record.studentId}>
                          {record.studentName} - {record.rollNumber}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Payment Date</label>
                    <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Amount</label>
                    <input type="number" placeholder="Enter amount" />
                  </div>

                  <div className="form-group">
                    <label>Payment Method</label>
                    <select>
                      <option value="cash">Cash</option>
                      <option value="cheque">Cheque</option>
                      <option value="card">Card</option>
                      <option value="upi">UPI</option>
                      <option value="netbanking">Net Banking</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Fee Categories</label>
                  <div className="checkbox-group">
                    {feeStructures.map((structure, index) => (
                      <label key={index} className="checkbox-label">
                        <input type="checkbox" />
                        <span>{structure.category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Notes / Remarks</label>
                  <textarea placeholder="Add any additional notes..." rows={3}></textarea>
                </div>

                <div className="modal-actions">
                  <button type="button" className="modal-btn secondary" onClick={() => setShowManualPaymentModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="modal-btn primary" onClick={(e) => { e.preventDefault(); alert('Payment recorded successfully!'); setShowManualPaymentModal(false); }}>
                    <i className="fas fa-check"></i>
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {showReminderModal && (
        <div className="modal-overlay" onClick={() => setShowReminderModal(false)}>
          <div className="reminder-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Payment Reminder</h2>
              <button className="modal-close" onClick={() => setShowReminderModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="reminder-preview">
                <h4>Reminder Message Preview</h4>
                <div className="message-preview">
                  <p>Dear Parent,</p>
                  <p>This is a friendly reminder that the following fee payment is pending:</p>
                  <ul>
                    <li>Student: [Student Name]</li>
                    <li>Pending Amount: ₹[Amount]</li>
                    <li>Due Date: [Date]</li>
                  </ul>
                  <p>Please make the payment through the Parent Portal or contact the school office.</p>
                  <p>Thank you,<br/>EdgeUp College</p>
                </div>
              </div>

              <div className="reminder-options">
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Send via Email</span>
                </label>
                <label className="checkbox-label">
                  <input type="checkbox" defaultChecked />
                  <span>Send via SMS</span>
                </label>
              </div>

              <div className="modal-actions">
                <button className="modal-btn secondary" onClick={() => setShowReminderModal(false)}>
                  Cancel
                </button>
                <button className="modal-btn primary" onClick={() => { alert('Reminder sent successfully!'); setShowReminderModal(false); }}>
                  <i className="fas fa-paper-plane"></i>
                  Send Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Concession Modal */}
      {showConcessionModal && (
        <div className="modal-overlay" onClick={() => setShowConcessionModal(false)}>
          <div className="concession-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply Concession</h2>
              <button className="modal-close" onClick={() => setShowConcessionModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <form className="concession-form">
                <div className="form-group">
                  <label>Student</label>
                  <select>
                    <option value="">Select Student</option>
                    {studentFeeRecords.map((record) => (
                      <option key={record.studentId} value={record.studentId}>
                        {record.studentName} - {record.rollNumber} - Grade {record.grade}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Concession Type</label>
                    <select>
                      <option value="scholarship">Scholarship</option>
                      <option value="discount">Discount</option>
                      <option value="waiver">Fee Waiver</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Category Name</label>
                    <input type="text" placeholder="e.g., Merit Scholarship" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Amount Type</label>
                    <select>
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed Amount (₹)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Amount / Percentage</label>
                    <input type="number" placeholder="Enter value" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason</label>
                  <textarea placeholder="Reason for concession..." rows={3}></textarea>
                </div>

                <div className="form-group">
                  <label>Valid Until</label>
                  <input type="date" />
                </div>

                <div className="modal-actions">
                  <button type="button" className="modal-btn secondary" onClick={() => setShowConcessionModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="modal-btn primary" onClick={(e) => { e.preventDefault(); alert('Concession applied successfully!'); setShowConcessionModal(false); }}>
                    <i className="fas fa-check"></i>
                    Apply Concession
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate Report</h2>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="report-types">
                <h4>Select Report Type</h4>
                <div className="report-options">
                  <label className="report-option">
                    <input type="radio" name="reportType" value="daily" defaultChecked />
                    <div className="option-content">
                      <i className="fas fa-calendar-day"></i>
                      <span>Daily Collection Report</span>
                    </div>
                  </label>
                  <label className="report-option">
                    <input type="radio" name="reportType" value="monthly" />
                    <div className="option-content">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Monthly Collection Report</span>
                    </div>
                  </label>
                  <label className="report-option">
                    <input type="radio" name="reportType" value="defaulters" />
                    <div className="option-content">
                      <i className="fas fa-user-clock"></i>
                      <span>Defaulters List</span>
                    </div>
                  </label>
                  <label className="report-option">
                    <input type="radio" name="reportType" value="classwise" />
                    <div className="option-content">
                      <i className="fas fa-users"></i>
                      <span>Year-wise Analysis</span>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>From Date</label>
                  <input type="date" />
                </div>
                <div className="form-group">
                  <label>To Date</label>
                  <input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              <div className="form-group">
                <label>Export Format</label>
                <select>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel (XLSX)</option>
                  <option value="csv">CSV</option>
                </select>
              </div>

              <div className="modal-actions">
                <button className="modal-btn secondary" onClick={() => setShowReportModal(false)}>
                  Cancel
                </button>
                <button className="modal-btn primary" onClick={() => { alert('Report generated successfully!'); setShowReportModal(false); }}>
                  <i className="fas fa-download"></i>
                  Generate & Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeManagement;
