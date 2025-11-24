import React, { useState } from 'react';

// TypeScript Interfaces
interface Application {
  id: string;
  applicationNumber: string;
  applicantName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  programApplied: string;
  entranceExam: string;
  examScore: string;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  address: string;
  applicationDate: string;
  documentStatus: 'Complete' | 'Pending' | 'Incomplete';
  documentsSubmitted: number;
  totalDocuments: number;
  pendingDocuments?: string;
  verifiedBy?: string;
  verificationDate?: string;
  status: 'New Application' | 'Documents Pending' | 'Documents Verified' | 'Entrance Test Scheduled' | 'Counseling Scheduled' | 'Provisionally Admitted' | 'Admitted' | 'Waitlisted' | 'Rejected' | 'Under Review';
  priority: 'High' | 'Medium' | 'Low';
  counselingDate?: string;
  counselingTime?: string;
  counselingMode?: 'In-Person' | 'Online';
  counselorAssigned?: string;
  waitlistPosition?: number;
  waitlistCategory?: 'General' | 'OBC' | 'SC/ST' | 'Management';
  admissionDecision?: 'Admitted' | 'Provisionally Admitted' | 'Waitlisted' | 'Rejected' | 'Pending';
  notes?: string;
  previousCollege?: string;
}

const AdmissionManagement: React.FC = () => {
  // Modal States
  const [showViewModal, setShowViewModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showVerifyDocsModal, setShowVerifyDocsModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showAddApplicationModal, setShowAddApplicationModal] = useState(false);
  const [showContactParentModal, setShowContactParentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Selection States
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Filter States
  const [activeTab, setActiveTab] = useState<'all' | 'counseling' | 'documents' | 'waitlist'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterEntranceExam, setFilterEntranceExam] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  // Sorting State
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Three-dots Menu State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Notification State
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success');

  // Form States
  const [newApplicationForm, setNewApplicationForm] = useState({
    applicationNumber: '', applicantName: '', dateOfBirth: '', gender: 'Male',
    gradeApplied: '', parentName: '', parentEmail: '', parentPhone: '',
    address: '', previousSchool: '', priority: 'Medium'
  });

  const [interviewForm, setInterviewForm] = useState({
    interviewDate: '', interviewTime: '', notes: ''
  });

  // Mock Data - Applications
  const [applications, setApplications] = useState<Application[]>([
    {
      id: 'app1', applicationNumber: 'APP2024001', applicantName: 'Riya Kapoor',
      dateOfBirth: '2006-03-15', gender: 'Female', programApplied: 'B.Tech - Computer Science',
      entranceExam: 'JEE Main', examScore: '95.6 percentile',
      guardianName: 'Ankit Kapoor', guardianEmail: 'ankit.kapoor@email.com',
      guardianPhone: '+91 98765 11111', address: '123 Green Park, Delhi',
      applicationDate: '2024-10-15', status: 'Counseling Scheduled',
      documentStatus: 'Complete', documentsSubmitted: 10, totalDocuments: 10,
      verifiedBy: 'Dr. Singh', verificationDate: '2024-10-20',
      priority: 'High', counselingDate: '2024-11-05', counselingTime: '10:00 AM',
      counselingMode: 'In-Person', counselorAssigned: 'Dr. Sharma',
      admissionDecision: 'Pending'
    },
    {
      id: 'app2', applicationNumber: 'APP2024002', applicantName: 'Aditya Mehta',
      dateOfBirth: '2006-07-22', gender: 'Male', programApplied: 'B.Tech - Electronics Engineering',
      entranceExam: 'State Entrance', examScore: 'Rank 1245',
      guardianName: 'Priya Mehta', guardianEmail: 'priya.mehta@email.com',
      guardianPhone: '+91 98765 22222', address: '456 Salt Lake, Kolkata',
      applicationDate: '2024-10-18', status: 'Documents Pending',
      documentStatus: 'Pending', documentsSubmitted: 7, totalDocuments: 10,
      pendingDocuments: '12th Certificate, Medical Certificate, Caste Certificate',
      priority: 'Medium', admissionDecision: 'Pending'
    },
    {
      id: 'app3', applicationNumber: 'APP2024003', applicantName: 'Zara Khan',
      dateOfBirth: '2006-11-08', gender: 'Female', programApplied: 'B.Tech - Mechanical Engineering',
      entranceExam: 'JEE Advanced', examScore: '92.3 percentile',
      guardianName: 'Imran Khan', guardianEmail: 'imran.khan@email.com',
      guardianPhone: '+91 98765 33333', address: '789 Banjara Hills, Hyderabad',
      applicationDate: '2024-10-20', status: 'Documents Verified',
      documentStatus: 'Complete', documentsSubmitted: 10, totalDocuments: 10,
      verifiedBy: 'Mr. Verma', verificationDate: '2024-10-25',
      priority: 'High', admissionDecision: 'Pending'
    },
    {
      id: 'app4', applicationNumber: 'APP2024004', applicantName: 'Arjun Verma',
      dateOfBirth: '2006-01-12', gender: 'Male', programApplied: 'B.Tech - Civil Engineering',
      entranceExam: 'JEE Main', examScore: '88.5 percentile',
      guardianName: 'Neha Verma', guardianEmail: 'neha.verma@email.com',
      guardianPhone: '+91 98765 44444', address: '321 Koramangala, Bangalore',
      applicationDate: '2024-10-12', status: 'Admitted',
      documentStatus: 'Complete', documentsSubmitted: 10, totalDocuments: 10,
      verifiedBy: 'Dr. Singh', verificationDate: '2024-10-18',
      priority: 'Medium', counselingDate: '2024-10-28', counselingTime: '11:00 AM',
      counselingMode: 'Online', counselorAssigned: 'Prof. Mehta',
      admissionDecision: 'Admitted'
    },
    {
      id: 'app5', applicationNumber: 'APP2024005', applicantName: 'Myra Singh',
      dateOfBirth: '2006-05-19', gender: 'Female', programApplied: 'B.Tech - Information Technology',
      entranceExam: 'State Entrance', examScore: 'Rank 2890',
      guardianName: 'Rajiv Singh', guardianEmail: 'rajiv.singh@email.com',
      guardianPhone: '+91 98765 55555', address: '654 Civil Lines, Jaipur',
      applicationDate: '2024-10-22', status: 'Waitlisted',
      documentStatus: 'Incomplete', documentsSubmitted: 5, totalDocuments: 10,
      pendingDocuments: 'All documents pending',
      priority: 'Low', counselingDate: '2024-10-30', counselingTime: '02:00 PM',
      counselingMode: 'In-Person', counselorAssigned: 'Dr. Kumar',
      waitlistPosition: 5, waitlistCategory: 'General',
      admissionDecision: 'Waitlisted'
    },
    {
      id: 'app6', applicationNumber: 'APP2024006', applicantName: 'Kabir Sharma',
      dateOfBirth: '2007-09-03', gender: 'Male', programApplied: 'B.Tech - Electrical Engineering',
      entranceExam: 'Management Quota', examScore: 'N/A',
      guardianName: 'Anjali Sharma', guardianEmail: 'anjali.sharma@email.com',
      guardianPhone: '+91 98765 66666', address: '987 MG Road, Pune',
      applicationDate: '2024-10-25', status: 'New Application',
      documentStatus: 'Pending', documentsSubmitted: 5, totalDocuments: 10,
      pendingDocuments: 'All documents pending',
      priority: 'Medium', admissionDecision: 'Pending'
    },
    {
      id: 'app7', applicationNumber: 'APP2024007', applicantName: 'Ananya Patel',
      dateOfBirth: '2001-03-25', gender: 'Female', programApplied: 'M.Tech - Data Science',
      entranceExam: 'GATE', examScore: '720/1000',
      guardianName: 'Deepak Patel', guardianEmail: 'deepak.patel@email.com',
      guardianPhone: '+91 98765 77777', address: '456 Anna Nagar, Chennai',
      applicationDate: '2024-10-10', status: 'Provisionally Admitted',
      documentStatus: 'Complete', documentsSubmitted: 10, totalDocuments: 10,
      verifiedBy: 'Dr. Singh', verificationDate: '2024-10-15',
      priority: 'High', counselingDate: '2024-11-01', counselingTime: '09:30 AM',
      counselingMode: 'Online', counselorAssigned: 'Prof. Singh',
      admissionDecision: 'Provisionally Admitted'
    },
    {
      id: 'app8', applicationNumber: 'APP2024008', applicantName: 'Rohan Kumar',
      dateOfBirth: '2006-08-17', gender: 'Male', programApplied: 'B.Tech - Computer Science',
      entranceExam: 'JEE Main', examScore: '97.2 percentile',
      guardianName: 'Sunita Kumar', guardianEmail: 'sunita.kumar@email.com',
      guardianPhone: '+91 98765 88888', address: '789 Sector 5, Noida',
      applicationDate: '2024-10-08', status: 'Admitted',
      documentStatus: 'Complete', documentsSubmitted: 10, totalDocuments: 10,
      verifiedBy: 'Dr. Singh', verificationDate: '2024-10-12',
      priority: 'High', counselingDate: '2024-10-22', counselingTime: '10:00 AM',
      counselingMode: 'In-Person', counselorAssigned: 'Dr. Sharma',
      admissionDecision: 'Admitted'
    }
  ]);

  // Handler Functions
  const handleViewApplication = (application: Application) => {
    setSelectedApplication(application);
    setShowViewModal(true);
  };

  const handleScheduleInterview = (application: Application) => {
    setSelectedApplication(application);
    setInterviewForm({
      interviewDate: application.counselingDate || '',
      interviewTime: application.counselingTime || '',
      notes: application.notes || ''
    });
    setShowScheduleModal(true);
  };

  const handleVerifyDocuments = (application: Application) => {
    setSelectedApplication(application);
    setShowVerifyDocsModal(true);
  };

  const handleUpdateStatus = (application: Application) => {
    setSelectedApplication(application);
    setShowUpdateStatusModal(true);
  };

  const handleContactGuardian = (application: Application) => {
    setSelectedApplication(application);
    setShowContactParentModal(true);
  };

  const handleDeleteApplication = () => {
    if (selectedApplication) {
      setApplications(applications.filter(app => app.id !== selectedApplication.id));
      showNotificationMessage('Application deleted successfully', 'success');
      setShowDeleteConfirm(false);
      setSelectedApplication(null);
    }
  };

  // Three-dots Menu Handlers
  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleMenuAction = (action: string, application: Application) => {
    switch (action) {
      case 'view':
        handleViewApplication(application);
        break;
      case 'schedule':
        handleScheduleInterview(application);
        break;
      case 'verify':
        handleVerifyDocuments(application);
        break;
      case 'update':
        handleUpdateStatus(application);
        break;
      case 'contact':
        handleContactGuardian(application);
        break;
      case 'delete':
        setSelectedApplication(application);
        setShowDeleteConfirm(true);
        break;
    }
    setOpenMenuId(null);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.three-dots-menu-container')) {
        setOpenMenuId(null);
      }
    };

    if (openMenuId) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [openMenuId]);

  // Row Selection Handlers
  const handleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const currentData = getFilteredData();
    if (selectedRows.length === currentData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(currentData.map(app => app.id));
    }
  };

  // Bulk Actions
  const handleBulkAction = (action: string) => {
    showNotificationMessage(`Bulk action "${action}" performed on ${selectedRows.length} applications`, 'info');
    setSelectedRows([]);
  };

  // Sorting Handler
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter & Search Logic
  const getFilteredData = () => {
    let filtered = [...applications];

    // Tab filtering
    if (activeTab === 'counseling') {
      filtered = filtered.filter(app => app.counselingDate);
    } else if (activeTab === 'documents') {
      filtered = filtered.filter(app => app.documentStatus === 'Pending' || app.documentStatus === 'Incomplete');
    } else if (activeTab === 'waitlist') {
      filtered = filtered.filter(app => app.admissionDecision === 'Waitlisted');
    }

    // Search filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(app =>
        app.applicantName.toLowerCase().includes(query) ||
        app.applicationNumber.toLowerCase().includes(query) ||
        app.guardianName.toLowerCase().includes(query) ||
        app.programApplied.toLowerCase().includes(query)
      );
    }

    // Program filtering
    if (filterProgram !== 'all') {
      filtered = filtered.filter(app => app.programApplied === filterProgram);
    }

    // Entrance Exam filtering
    if (filterEntranceExam !== 'all') {
      filtered = filtered.filter(app => app.entranceExam === filterEntranceExam);
    }

    // Status filtering
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.status === filterStatus);
    }

    // Priority filtering
    if (filterPriority !== 'all') {
      filtered = filtered.filter(app => app.priority === filterPriority);
    }

    // Sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn as keyof Application] as string;
        const bVal = b[sortColumn as keyof Application] as string;
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  // Pagination Logic
  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filtered.slice(startIndex, startIndex + rowsPerPage);
  };

  const totalPages = Math.ceil(getFilteredData().length / rowsPerPage);

  // Stats Calculations
  const stats = {
    total: applications.length,
    pendingReview: applications.filter(app =>
      app.documentStatus === 'Pending' || app.documentStatus === 'Incomplete'
    ).length,
    counselingScheduled: applications.filter(app =>
      app.status === 'Counseling Scheduled'
    ).length,
    provisionallyAdmitted: applications.filter(app =>
      app.admissionDecision === 'Provisionally Admitted'
    ).length
  };

  // Notification Handler
  const showNotificationMessage = (message: string, type: 'success' | 'error' | 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Format Date Helper
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  // Save Counseling
  const handleSaveInterview = () => {
    if (selectedApplication) {
      setApplications(applications.map(app =>
        app.id === selectedApplication.id
          ? {
              ...app,
              counselingDate: interviewForm.interviewDate,
              counselingTime: interviewForm.interviewTime,
              notes: interviewForm.notes,
              status: 'Counseling Scheduled'
            }
          : app
      ));
      showNotificationMessage('Counseling scheduled successfully', 'success');
      setShowScheduleModal(false);
      setSelectedApplication(null);
    }
  };

  // Verify Documents
  const handleSaveDocVerification = () => {
    if (selectedApplication) {
      setApplications(applications.map(app =>
        app.id === selectedApplication.id
          ? {
              ...app,
              documentStatus: 'Complete',
              documentsSubmitted: app.totalDocuments,
              verifiedBy: 'Dr. Singh',
              verificationDate: new Date().toISOString().split('T')[0],
              status: 'Documents Verified'
            }
          : app
      ));
      showNotificationMessage('Documents verified successfully', 'success');
      setShowVerifyDocsModal(false);
      setSelectedApplication(null);
    }
  };

  return (
    <div className="admission-mgmt-container">
      {/* Header */}
      <div className="admission-mgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-user-plus"></i> College Admission Management</h1>
          <p>Manage undergraduate and postgraduate applications, entrance exams, and admissions</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAddApplicationModal(true)}>
            <i className="fas fa-plus"></i>
            New Application
          </button>
          <button className="btn-secondary" onClick={() => console.log('Export clicked')}>
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="admission-mgmt-stats">
        <div className="stat-card blue">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.total}</h3>
            <p>Total Applications</p>
            <span className="stat-subtitle">Across all programs</span>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.pendingReview}</h3>
            <p>Pending Review</p>
            <span className="stat-subtitle">Awaiting document verification</span>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.counselingScheduled}</h3>
            <p>Counseling Scheduled</p>
            <span className="stat-subtitle">Upcoming sessions</span>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.provisionallyAdmitted}</h3>
            <p>Provisionally Admitted</p>
            <span className="stat-subtitle">Pending final confirmation</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="admission-mgmt-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, application number, or program..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)}>
          <option value="all">All Programs</option>
          <option value="B.Tech - Computer Science">B.Tech - Computer Science</option>
          <option value="B.Tech - Electronics Engineering">B.Tech - Electronics Engineering</option>
          <option value="B.Tech - Mechanical Engineering">B.Tech - Mechanical Engineering</option>
          <option value="B.Tech - Civil Engineering">B.Tech - Civil Engineering</option>
          <option value="B.Tech - Electrical Engineering">B.Tech - Electrical Engineering</option>
          <option value="B.Tech - Information Technology">B.Tech - Information Technology</option>
          <option value="M.Tech - Data Science">M.Tech - Data Science</option>
        </select>
        <select value={filterEntranceExam} onChange={(e) => setFilterEntranceExam(e.target.value)}>
          <option value="all">All Entrance Exams</option>
          <option value="JEE Main">JEE Main</option>
          <option value="JEE Advanced">JEE Advanced</option>
          <option value="State Entrance">State Entrance</option>
          <option value="GATE">GATE</option>
          <option value="Management Quota">Management Quota</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="New Application">New Application</option>
          <option value="Documents Pending">Documents Pending</option>
          <option value="Documents Verified">Documents Verified</option>
          <option value="Entrance Test Scheduled">Entrance Test Scheduled</option>
          <option value="Counseling Scheduled">Counseling Scheduled</option>
          <option value="Provisionally Admitted">Provisionally Admitted</option>
          <option value="Admitted">Admitted</option>
          <option value="Waitlisted">Waitlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Under Review">Under Review</option>
        </select>
        <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
        <div className="bulk-actions-dropdown">
          <button className="bulk-actions-btn">
            <i className="fas fa-tasks"></i>
            Bulk Actions
            <i className="fas fa-chevron-down"></i>
          </button>
          <div className="bulk-actions-menu">
            <button onClick={() => handleBulkAction('schedule-counseling')}>Schedule Counseling</button>
            <button onClick={() => handleBulkAction('verify')}>Verify Documents</button>
            <button onClick={() => handleBulkAction('provisional-admit')}>Provisional Admit</button>
            <button onClick={() => handleBulkAction('admit')}>Admit Selected</button>
            <button onClick={() => handleBulkAction('waitlist')}>Move to Waitlist</button>
            <button onClick={() => handleBulkAction('reject')}>Reject Selected</button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admission-mgmt-tabs">
        <button
          className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => { setActiveTab('all'); setCurrentPage(1); }}
        >
          <i className="fas fa-list"></i>
          All Applications
        </button>
        <button
          className={`tab-btn ${activeTab === 'counseling' ? 'active' : ''}`}
          onClick={() => { setActiveTab('counseling'); setCurrentPage(1); }}
        >
          <i className="fas fa-calendar-alt"></i>
          Counseling Schedule
        </button>
        <button
          className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => { setActiveTab('documents'); setCurrentPage(1); }}
        >
          <i className="fas fa-file-check"></i>
          Document Verification
        </button>
        <button
          className={`tab-btn ${activeTab === 'waitlist' ? 'active' : ''}`}
          onClick={() => { setActiveTab('waitlist'); setCurrentPage(1); }}
        >
          <i className="fas fa-hourglass-half"></i>
          Waitlist
        </button>
      </div>

      {/* Data Table */}
      <div className="admission-mgmt-table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedRows.length === getPaginatedData().length && getPaginatedData().length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th onClick={() => handleSort('applicationNumber')}>
                Application #
                {sortColumn === 'applicationNumber' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
              </th>
              <th onClick={() => handleSort('applicantName')}>
                Applicant Name
                {sortColumn === 'applicantName' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
              </th>
              {activeTab === 'all' && (
                <>
                  <th onClick={() => handleSort('programApplied')}>
                    Program Applied
                    {sortColumn === 'programApplied' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                  </th>
                  <th onClick={() => handleSort('entranceExam')}>
                    Entrance Exam
                    {sortColumn === 'entranceExam' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                  </th>
                  <th>Exam Score</th>
                  <th>Document Status</th>
                </>
              )}
              {activeTab === 'counseling' && (
                <>
                  <th onClick={() => handleSort('programApplied')}>Program Applied</th>
                  <th>Counseling Date</th>
                  <th>Counseling Time</th>
                  <th>Mode</th>
                  <th>Counselor</th>
                </>
              )}
              {activeTab === 'documents' && (
                <>
                  <th onClick={() => handleSort('programApplied')}>Program Applied</th>
                  <th>Documents Status</th>
                  <th>Submitted/Total</th>
                  <th>Pending Documents</th>
                  <th>Verified By</th>
                </>
              )}
              {activeTab === 'waitlist' && (
                <>
                  <th onClick={() => handleSort('programApplied')}>Program Applied</th>
                  <th>Waitlist Position</th>
                  <th>Category</th>
                  <th>Entrance Exam</th>
                  <th>Exam Score</th>
                </>
              )}
              <th onClick={() => handleSort('applicationDate')}>
                Application Date
                {sortColumn === 'applicationDate' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
              </th>
              <th onClick={() => handleSort('status')}>
                Status
                {sortColumn === 'status' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
              </th>
              {activeTab === 'all' && (
                <th onClick={() => handleSort('priority')}>
                  Priority
                  {sortColumn === 'priority' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
              )}
              <th>Guardian Contact</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getPaginatedData().map((application) => (
              <tr key={application.id} className={selectedRows.includes(application.id) ? 'selected' : ''}>
                <td className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(application.id)}
                    onChange={() => handleSelectRow(application.id)}
                  />
                </td>
                <td><strong>{application.applicationNumber}</strong></td>
                <td>{application.applicantName}</td>

                {activeTab === 'all' && (
                  <>
                    <td>{application.programApplied}</td>
                    <td>{application.entranceExam}</td>
                    <td>{application.examScore}</td>
                    <td>
                      <span className={`status-badge-table ${application.documentStatus.toLowerCase()}`}>
                        {application.documentStatus} ({application.documentsSubmitted}/{application.totalDocuments})
                      </span>
                    </td>
                  </>
                )}

                {activeTab === 'counseling' && (
                  <>
                    <td>{application.programApplied}</td>
                    <td>{application.counselingDate ? formatDate(application.counselingDate) : '-'}</td>
                    <td>{application.counselingTime || '-'}</td>
                    <td>{application.counselingMode || '-'}</td>
                    <td>{application.counselorAssigned || '-'}</td>
                  </>
                )}

                {activeTab === 'documents' && (
                  <>
                    <td>{application.programApplied}</td>
                    <td>
                      <span className={`status-badge-table ${application.documentStatus.toLowerCase()}`}>
                        {application.documentStatus}
                      </span>
                    </td>
                    <td>{application.documentsSubmitted}/{application.totalDocuments}</td>
                    <td>{application.pendingDocuments || '-'}</td>
                    <td>{application.verifiedBy || '-'}</td>
                  </>
                )}

                {activeTab === 'waitlist' && (
                  <>
                    <td>{application.programApplied}</td>
                    <td><strong>#{application.waitlistPosition || '-'}</strong></td>
                    <td>
                      <span className={`priority-badge ${application.waitlistCategory?.toLowerCase()}`}>
                        {application.waitlistCategory || '-'}
                      </span>
                    </td>
                    <td>{application.entranceExam}</td>
                    <td>{application.examScore}</td>
                  </>
                )}

                <td>{formatDate(application.applicationDate)}</td>
                <td>
                  <span className={`status-badge-table ${application.status.toLowerCase().replace(/ /g, '-')}`}>
                    {application.status}
                  </span>
                </td>
                {activeTab === 'all' && (
                  <td>
                    <span className={`priority-badge ${application.priority.toLowerCase()}`}>
                      {application.priority}
                    </span>
                  </td>
                )}
                <td>{application.guardianPhone}</td>
                <td className="actions-col">
                  <div className="three-dots-menu-container">
                    <button
                      className="three-dots-btn"
                      onClick={() => handleMenuToggle(application.id)}
                      title="Actions"
                    >
                      <i className="fas fa-ellipsis-h"></i>
                    </button>
                    {openMenuId === application.id && (
                      <div className="actions-popup-menu">
                        <button className="menu-item" onClick={() => handleMenuAction('view', application)}>
                          View Details
                        </button>
                        <button className="menu-item" onClick={() => handleMenuAction('schedule', application)}>
                          Schedule Counseling
                        </button>
                        <button className="menu-item" onClick={() => handleMenuAction('verify', application)}>
                          Verify Documents
                        </button>
                        <button className="menu-item" onClick={() => handleMenuAction('update', application)}>
                          Update Status
                        </button>
                        <button className="menu-item" onClick={() => handleMenuAction('contact', application)}>
                          Contact Guardian
                        </button>
                        <button className="menu-item delete" onClick={() => handleMenuAction('delete', application)}>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="admission-mgmt-pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, getFilteredData().length)} of {getFilteredData().length} entries
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          <span className="page-numbers">
            Page {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            <i className="fas fa-chevron-right"></i>
          </button>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
            <option value={100}>100 per page</option>
          </select>
        </div>
      </div>

      {/* Floating Action Bar */}
      {selectedRows.length > 0 && (
        <div className="floating-action-bar">
          <div className="fab-left">
            <i className="fas fa-check-circle"></i>
            <strong>{selectedRows.length}</strong> selected
          </div>
          <div className="fab-actions">
            <button onClick={() => handleBulkAction('schedule-counseling')}>
              <i className="fas fa-calendar"></i>
              Schedule Counseling
            </button>
            <button onClick={() => handleBulkAction('verify')}>
              <i className="fas fa-check"></i>
              Verify Documents
            </button>
            <button onClick={() => handleBulkAction('provisional-admit')}>
              <i className="fas fa-user-clock"></i>
              Provisional Admit
            </button>
            <button onClick={() => handleBulkAction('admit')}>
              <i className="fas fa-user-check"></i>
              Admit
            </button>
            <button className="fab-clear" onClick={() => setSelectedRows([])}>
              <i className="fas fa-times"></i>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Notification */}
      {showNotification && (
        <div className={`notification ${notificationType}`}>
          <i className={`fas fa-${notificationType === 'success' ? 'check-circle' : notificationType === 'error' ? 'exclamation-circle' : 'info-circle'}`}></i>
          {notificationMessage}
        </div>
      )}

      {/* View Application Modal */}
      {showViewModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="admission-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Application Details</h2>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="details-grid">
                <div className="admission-modal-field">
                  <label>Application Number:</label>
                  <span><strong>{selectedApplication.applicationNumber}</strong></span>
                </div>
                <div className="admission-modal-field">
                  <label>Applicant Name:</label>
                  <span>{selectedApplication.applicantName}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Date of Birth:</label>
                  <span>{formatDate(selectedApplication.dateOfBirth)}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Gender:</label>
                  <span>{selectedApplication.gender}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Program Applied:</label>
                  <span><strong>{selectedApplication.programApplied}</strong></span>
                </div>
                <div className="admission-modal-field">
                  <label>Entrance Exam:</label>
                  <span>{selectedApplication.entranceExam}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Exam Score:</label>
                  <span><strong>{selectedApplication.examScore}</strong></span>
                </div>
                <div className="admission-modal-field">
                  <label>Application Date:</label>
                  <span>{formatDate(selectedApplication.applicationDate)}</span>
                </div>
                <div className="admission-modal-field full-width">
                  <label>Address:</label>
                  <span>{selectedApplication.address}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Guardian Name:</label>
                  <span>{selectedApplication.guardianName}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Guardian Email:</label>
                  <span>{selectedApplication.guardianEmail}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Guardian Phone:</label>
                  <span>{selectedApplication.guardianPhone}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Previous College:</label>
                  <span>{selectedApplication.previousCollege || 'Not specified'}</span>
                </div>
                <div className="admission-modal-field">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedApplication.status.toLowerCase().replace(/ /g, '-')}`}>
                    {selectedApplication.status}
                  </span>
                </div>
                <div className="admission-modal-field">
                  <label>Priority:</label>
                  <span className={`priority-badge ${selectedApplication.priority.toLowerCase()}`}>
                    {selectedApplication.priority}
                  </span>
                </div>
                <div className="admission-modal-field">
                  <label>Document Status:</label>
                  <span className={`status-badge ${selectedApplication.documentStatus.toLowerCase()}`}>
                    {selectedApplication.documentStatus} ({selectedApplication.documentsSubmitted}/{selectedApplication.totalDocuments})
                  </span>
                </div>
                {selectedApplication.verifiedBy && (
                  <div className="admission-modal-field">
                    <label>Verified By:</label>
                    <span>{selectedApplication.verifiedBy} on {formatDate(selectedApplication.verificationDate!)}</span>
                  </div>
                )}
                {selectedApplication.counselingDate && (
                  <>
                    <div className="admission-modal-field">
                      <label>Counseling Date:</label>
                      <span>{formatDate(selectedApplication.counselingDate)}</span>
                    </div>
                    <div className="admission-modal-field">
                      <label>Counseling Time:</label>
                      <span>{selectedApplication.counselingTime}</span>
                    </div>
                    <div className="admission-modal-field">
                      <label>Counseling Mode:</label>
                      <span>{selectedApplication.counselingMode}</span>
                    </div>
                    <div className="admission-modal-field">
                      <label>Counselor Assigned:</label>
                      <span>{selectedApplication.counselorAssigned}</span>
                    </div>
                  </>
                )}
                {selectedApplication.waitlistPosition && (
                  <>
                    <div className="admission-modal-field">
                      <label>Waitlist Position:</label>
                      <span><strong>#{selectedApplication.waitlistPosition}</strong></span>
                    </div>
                    <div className="admission-modal-field">
                      <label>Waitlist Category:</label>
                      <span>{selectedApplication.waitlistCategory}</span>
                    </div>
                  </>
                )}
                <div className="admission-modal-field">
                  <label>Admission Decision:</label>
                  <span className={`status-badge ${selectedApplication.admissionDecision?.toLowerCase()}`}>
                    {selectedApplication.admissionDecision}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Counseling Modal */}
      {showScheduleModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowScheduleModal(false)}>
          <div className="admission-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Schedule Counseling Session</h2>
              <button className="modal-close" onClick={() => setShowScheduleModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="applicant-info">
                <h4>{selectedApplication.applicantName}</h4>
                <p>{selectedApplication.applicationNumber} - {selectedApplication.programApplied}</p>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Counseling Date *</label>
                  <input
                    type="date"
                    value={interviewForm.interviewDate}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Counseling Time *</label>
                  <input
                    type="time"
                    value={interviewForm.interviewTime}
                    onChange={(e) => setInterviewForm({ ...interviewForm, interviewTime: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Notes</label>
                  <textarea
                    rows={3}
                    value={interviewForm.notes}
                    onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                    placeholder="Add any notes or instructions for the counseling session..."
                  ></textarea>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveInterview}>
                <i className="fas fa-calendar-check"></i>
                Schedule Counseling
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Documents Modal */}
      {showVerifyDocsModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowVerifyDocsModal(false)}>
          <div className="admission-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Verify Documents</h2>
              <button className="modal-close" onClick={() => setShowVerifyDocsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="applicant-info">
                <h4>{selectedApplication.applicantName}</h4>
                <p>{selectedApplication.applicationNumber}</p>
              </div>
              <div className="document-checklist">
                <h4>Required Documents for College Admission</h4>
                <div className="checklist-item">
                  <input type="checkbox" id="doc1" defaultChecked />
                  <label htmlFor="doc1">10th Mark Sheet</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc2" defaultChecked />
                  <label htmlFor="doc2">12th Mark Sheet</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc3" defaultChecked />
                  <label htmlFor="doc3">Entrance Exam Scorecard</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc4" defaultChecked />
                  <label htmlFor="doc4">Transfer Certificate (TC)</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc5" defaultChecked />
                  <label htmlFor="doc5">Caste Certificate (if applicable)</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc6" defaultChecked />
                  <label htmlFor="doc6">Aadhar Card</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc7" defaultChecked />
                  <label htmlFor="doc7">Medical Certificate</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc8" defaultChecked />
                  <label htmlFor="doc8">Migration Certificate (if applicable)</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc9" defaultChecked />
                  <label htmlFor="doc9">Character Certificate</label>
                </div>
                <div className="checklist-item">
                  <input type="checkbox" id="doc10" defaultChecked />
                  <label htmlFor="doc10">Passport Size Photos (4 copies)</label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowVerifyDocsModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleSaveDocVerification}>
                <i className="fas fa-check-circle"></i>
                Mark as Verified
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Guardian Modal */}
      {showContactParentModal && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowContactParentModal(false)}>
          <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Guardian</h2>
              <button className="modal-close" onClick={() => setShowContactParentModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="contact-info">
                <h4>{selectedApplication.guardianName}</h4>
                <p className="student-ref">Guardian of {selectedApplication.applicantName} ({selectedApplication.applicationNumber})</p>
                <div className="contact-methods">
                  <a href={`mailto:${selectedApplication.guardianEmail}`} className="contact-btn">
                    <i className="fas fa-envelope"></i>
                    {selectedApplication.guardianEmail}
                  </a>
                  <a href={`tel:${selectedApplication.guardianPhone}`} className="contact-btn">
                    <i className="fas fa-phone"></i>
                    {selectedApplication.guardianPhone}
                  </a>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowContactParentModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedApplication && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="confirm-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3>Delete Application?</h3>
              <p>Are you sure you want to delete the application for <strong>{selectedApplication.applicantName}</strong>? This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteApplication}>
                <i className="fas fa-trash"></i>
                Delete Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdmissionManagement;
