import React, { useState, useEffect } from 'react';

// TypeScript Interfaces
interface Student {
  id: string;
  name: string;
  class: string;
  section: string;
}

interface GrievanceResponse {
  id: string;
  respondentName: string;
  respondentRole: string;
  message: string;
  date: string;
  isOfficial: boolean;
}

interface Grievance {
  id: string;
  studentId: string;
  studentName: string;
  category: 'academic' | 'behavioral' | 'infrastructure' | 'transport' | 'fee' | 'administration' | 'safety' | 'other';
  priority: 'high' | 'medium' | 'low';
  subject: string;
  description: string;
  status: 'submitted' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
  submittedDate: string;
  lastUpdated: string;
  isAnonymous: boolean;
  attachments?: string[];
  responses: GrievanceResponse[];
  assignedTo?: string;
  resolutionNotes?: string;
  satisfactionRating?: number;
}

interface GrievanceStats {
  total: number;
  pending: number;
  investigating: number;
  resolved: number;
}

interface FormData {
  category: string;
  priority: 'high' | 'medium' | 'low';
  subject: string;
  description: string;
  isAnonymous: boolean;
  attachments: string[];
}

const Grievance: React.FC = () => {
  // Mock Students Data
  const students: Student[] = [
    { id: '1', name: 'Aarav Sharma', class: '10', section: 'A' },
    { id: '2', name: 'Diya Sharma', class: '7', section: 'B' },
    { id: '3', name: 'Arjun Sharma', class: '4', section: 'C' }
  ];

  // Mock Grievances Data
  const initialGrievances: Grievance[] = [
    {
      id: 'GRV001',
      studentId: '1',
      studentName: 'Aarav Sharma',
      category: 'academic',
      priority: 'high',
      subject: 'Mathematics Teacher Absence',
      description: 'Our mathematics teacher has been absent for the past week without any substitute arrangement. This is affecting my child\'s board exam preparation.',
      status: 'investigating',
      submittedDate: '2024-10-25',
      lastUpdated: '2024-10-28',
      isAnonymous: false,
      responses: [
        {
          id: 'R1',
          respondentName: 'Dr. Sharma',
          respondentRole: 'Academic Coordinator',
          message: 'Thank you for bringing this to our attention. We have arranged a substitute teacher starting from tomorrow. The regular teacher is on medical leave.',
          date: '2024-10-26',
          isOfficial: true
        }
      ],
      assignedTo: 'Dr. Sharma'
    },
    {
      id: 'GRV002',
      studentId: '1',
      studentName: 'Aarav Sharma',
      category: 'infrastructure',
      priority: 'medium',
      subject: 'Broken Benches in Classroom',
      description: 'Several benches in classroom 10-A are broken and pose safety risks to students. Need immediate repair.',
      status: 'resolved',
      submittedDate: '2024-10-20',
      lastUpdated: '2024-10-24',
      isAnonymous: false,
      responses: [
        {
          id: 'R2',
          respondentName: 'Maintenance Department',
          respondentRole: 'Facilities Manager',
          message: 'All broken benches have been replaced. Thank you for reporting this safety concern.',
          date: '2024-10-24',
          isOfficial: true
        }
      ],
      resolutionNotes: 'All benches replaced on 24th October'
    },
    {
      id: 'GRV003',
      studentId: '2',
      studentName: 'Diya Sharma',
      category: 'transport',
      priority: 'high',
      subject: 'School Bus Arriving Late Consistently',
      description: 'For the past 2 weeks, school bus route 12 has been arriving 20-30 minutes late every morning, causing my daughter to miss the first period.',
      status: 'acknowledged',
      submittedDate: '2024-10-27',
      lastUpdated: '2024-10-28',
      isAnonymous: false,
      responses: [
        {
          id: 'R3',
          respondentName: 'Transport Coordinator',
          respondentRole: 'Transport Head',
          message: 'We have acknowledged your complaint and are investigating the route timing issues. We will update you within 48 hours.',
          date: '2024-10-28',
          isOfficial: true
        }
      ],
      assignedTo: 'Transport Department'
    },
    {
      id: 'GRV004',
      studentId: '1',
      studentName: 'Aarav Sharma',
      category: 'behavioral',
      priority: 'high',
      subject: 'Bullying Incident in Playground',
      description: 'My son reported being bullied by senior students during lunch break. This needs immediate attention as it\'s affecting his mental well-being.',
      status: 'investigating',
      submittedDate: '2024-10-26',
      lastUpdated: '2024-10-29',
      isAnonymous: false,
      responses: [
        {
          id: 'R4',
          respondentName: 'Principal Mrs. Verma',
          respondentRole: 'School Principal',
          message: 'We take bullying very seriously. Our counselor has met with your child and the involved students. Strict action is being taken. We will schedule a meeting with you.',
          date: '2024-10-27',
          isOfficial: true
        },
        {
          id: 'R5',
          respondentName: 'School Counselor',
          respondentRole: 'Student Counselor',
          message: 'I have had a session with Aarav. He is doing better. Please reach out if you notice any concerns at home.',
          date: '2024-10-29',
          isOfficial: true
        }
      ],
      assignedTo: 'Principal & Counselor'
    },
    {
      id: 'GRV005',
      studentId: '3',
      studentName: 'Arjun Sharma',
      category: 'fee',
      priority: 'medium',
      subject: 'Incorrect Fee Calculation',
      description: 'The quarterly fee statement shows an additional charge that was not communicated. Please clarify the breakdown.',
      status: 'resolved',
      submittedDate: '2024-10-15',
      lastUpdated: '2024-10-18',
      isAnonymous: false,
      responses: [
        {
          id: 'R6',
          respondentName: 'Accounts Department',
          respondentRole: 'Finance Manager',
          message: 'Thank you for pointing this out. There was an error in the system. We have corrected it and refunded the excess amount to your account.',
          date: '2024-10-18',
          isOfficial: true
        }
      ],
      resolutionNotes: 'Fee corrected, excess amount refunded'
    },
    {
      id: 'GRV006',
      studentId: '2',
      studentName: 'Diya Sharma',
      category: 'safety',
      priority: 'high',
      subject: 'Inadequate Security at Main Gate',
      description: 'Unknown persons are able to enter school premises easily. Security checks need to be strengthened for child safety.',
      status: 'investigating',
      submittedDate: '2024-10-24',
      lastUpdated: '2024-10-28',
      isAnonymous: false,
      responses: [
        {
          id: 'R7',
          respondentName: 'Security Head',
          respondentRole: 'Chief Security Officer',
          message: 'Additional security personnel have been deployed. Visitor verification system is being upgraded. Thank you for your concern.',
          date: '2024-10-28',
          isOfficial: true
        }
      ],
      assignedTo: 'Security Department'
    },
    {
      id: 'GRV007',
      studentId: '1',
      studentName: 'Aarav Sharma',
      category: 'administration',
      priority: 'low',
      subject: 'Delay in Report Card Issuance',
      description: 'Mid-term report cards were supposed to be issued last week but we haven\'t received them yet.',
      status: 'submitted',
      submittedDate: '2024-10-29',
      lastUpdated: '2024-10-29',
      isAnonymous: false,
      responses: []
    },
    {
      id: 'GRV008',
      studentId: '3',
      studentName: 'Arjun Sharma',
      category: 'infrastructure',
      priority: 'medium',
      subject: 'Water Cooler Not Working',
      description: 'The water cooler on the second floor has not been working for 3 days. Students are facing difficulty getting drinking water.',
      status: 'acknowledged',
      submittedDate: '2024-10-28',
      lastUpdated: '2024-10-29',
      isAnonymous: false,
      responses: [
        {
          id: 'R8',
          respondentName: 'Maintenance',
          respondentRole: 'Facilities Team',
          message: 'Repair technician has been called. Will be fixed by tomorrow.',
          date: '2024-10-29',
          isOfficial: true
        }
      ]
    },
    {
      id: 'GRV009',
      studentId: '2',
      studentName: 'Diya Sharma',
      category: 'academic',
      priority: 'low',
      subject: 'Request for Extra Class in Science',
      description: 'Many students including my daughter are finding the current science syllabus pace too fast. Can we have additional doubt-clearing sessions?',
      status: 'resolved',
      submittedDate: '2024-10-10',
      lastUpdated: '2024-10-15',
      isAnonymous: false,
      responses: [
        {
          id: 'R9',
          respondentName: 'Science Department',
          respondentRole: 'Science HOD',
          message: 'We have arranged extra doubt-clearing sessions every Saturday from 9-10 AM starting next week.',
          date: '2024-10-15',
          isOfficial: true
        }
      ],
      resolutionNotes: 'Extra classes scheduled on Saturdays'
    },
    {
      id: 'GRV010',
      studentId: '1',
      studentName: 'Aarav Sharma',
      category: 'other',
      priority: 'medium',
      subject: 'Library Books Availability',
      description: 'Reference books for board exam preparation are always occupied. Need more copies or extended borrowing time.',
      status: 'investigating',
      submittedDate: '2024-10-23',
      lastUpdated: '2024-10-27',
      isAnonymous: false,
      responses: [
        {
          id: 'R10',
          respondentName: 'Librarian',
          respondentRole: 'Head Librarian',
          message: 'We are ordering additional copies of the most requested books. They should arrive within 2 weeks.',
          date: '2024-10-27',
          isOfficial: true
        }
      ],
      assignedTo: 'Library Department'
    }
  ];

  // State Management
  const [selectedStudent, setSelectedStudent] = useState<string>('1');
  const [grievances, setGrievances] = useState<Grievance[]>([]);
  const [filteredGrievances, setFilteredGrievances] = useState<Grievance[]>([]);

  // Form State
  const [formData, setFormData] = useState<FormData>({
    category: '',
    priority: 'medium',
    subject: '',
    description: '',
    isAnonymous: false,
    attachments: []
  });

  // Filter State
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal State
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [followUpComment, setFollowUpComment] = useState('');

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Load grievances from localStorage
  useEffect(() => {
    const savedGrievances = localStorage.getItem('parentGrievances');
    if (savedGrievances) {
      setGrievances(JSON.parse(savedGrievances));
    } else {
      setGrievances(initialGrievances);
      localStorage.setItem('parentGrievances', JSON.stringify(initialGrievances));
    }
  }, []);

  // Save grievances to localStorage whenever they change
  useEffect(() => {
    if (grievances.length > 0) {
      localStorage.setItem('parentGrievances', JSON.stringify(grievances));
    }
  }, [grievances]);

  // Filter grievances based on selected student and filters
  useEffect(() => {
    let filtered = grievances.filter(g => g.studentId === selectedStudent);

    if (statusFilter !== 'all') {
      filtered = filtered.filter(g => g.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(g => g.category === categoryFilter);
    }

    if (dateFilter !== 'all') {
      const today = new Date();
      const filterDate = new Date();

      if (dateFilter === '30days') {
        filterDate.setDate(today.getDate() - 30);
      } else if (dateFilter === '90days') {
        filterDate.setDate(today.getDate() - 90);
      }

      if (dateFilter !== 'all') {
        filtered = filtered.filter(g => new Date(g.submittedDate) >= filterDate);
      }
    }

    if (searchQuery.trim()) {
      filtered = filtered.filter(g =>
        g.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredGrievances(filtered.sort((a, b) =>
      new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime()
    ));
  }, [selectedStudent, grievances, statusFilter, categoryFilter, dateFilter, searchQuery]);

  // Calculate statistics
  const calculateStats = (): GrievanceStats => {
    const studentGrievances = grievances.filter(g => g.studentId === selectedStudent);
    return {
      total: studentGrievances.length,
      pending: studentGrievances.filter(g => g.status === 'submitted' || g.status === 'acknowledged').length,
      investigating: studentGrievances.filter(g => g.status === 'investigating').length,
      resolved: studentGrievances.filter(g => g.status === 'resolved' || g.status === 'closed').length
    };
  };

  const stats = calculateStats();

  // Form Handlers
  const handleFormChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitGrievance = () => {
    // Validation
    if (!formData.category) {
      showToast('Please select a category', 'error');
      return;
    }
    if (!formData.subject.trim()) {
      showToast('Please enter a subject', 'error');
      return;
    }
    if (!formData.description.trim()) {
      showToast('Please provide a detailed description', 'error');
      return;
    }
    if (formData.subject.length > 100) {
      showToast('Subject must be less than 100 characters', 'error');
      return;
    }

    const selectedStudentData = students.find(s => s.id === selectedStudent);
    if (!selectedStudentData) return;

    const newGrievance: Grievance = {
      id: `GRV${String(grievances.length + 1).padStart(3, '0')}`,
      studentId: selectedStudent,
      studentName: selectedStudentData.name,
      category: formData.category as any,
      priority: formData.priority,
      subject: formData.subject,
      description: formData.description,
      status: 'submitted',
      submittedDate: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      isAnonymous: formData.isAnonymous,
      attachments: formData.attachments,
      responses: []
    };

    setGrievances(prev => [newGrievance, ...prev]);

    // Reset form
    setFormData({
      category: '',
      priority: 'medium',
      subject: '',
      description: '',
      isAnonymous: false,
      attachments: []
    });

    showToast('Grievance submitted successfully! You will receive updates soon.', 'success');
  };

  const handleViewDetails = (grievance: Grievance) => {
    setSelectedGrievance(grievance);
    setShowDetailsModal(true);
  };

  const handleAddFollowUp = () => {
    if (!selectedGrievance || !followUpComment.trim()) {
      showToast('Please enter a comment', 'error');
      return;
    }

    const updatedGrievances = grievances.map(g => {
      if (g.id === selectedGrievance.id) {
        return {
          ...g,
          responses: [
            ...g.responses,
            {
              id: `R${g.responses.length + 1}`,
              respondentName: 'Parent',
              respondentRole: 'Parent',
              message: followUpComment,
              date: new Date().toISOString().split('T')[0],
              isOfficial: false
            }
          ],
          lastUpdated: new Date().toISOString().split('T')[0]
        };
      }
      return g;
    });

    setGrievances(updatedGrievances);
    setFollowUpComment('');
    showToast('Follow-up comment added successfully', 'success');
  };

  const handlePrintGrievance = () => {
    if (!selectedGrievance) return;
    window.print();
  };

  const resetFilters = () => {
    setStatusFilter('all');
    setCategoryFilter('all');
    setDateFilter('all');
    setSearchQuery('');
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper functions
  const getCategoryLabel = (category: string): string => {
    const labels: { [key: string]: string } = {
      academic: 'Academic Issues',
      behavioral: 'Behavioral Concerns',
      infrastructure: 'Infrastructure & Facilities',
      transport: 'Transport Issues',
      fee: 'Fee & Payment',
      administration: 'Administration',
      safety: 'Safety & Security',
      other: 'Other'
    };
    return labels[category] || category;
  };

  const getStatusLabel = (status: string): string => {
    const labels: { [key: string]: string } = {
      submitted: 'Submitted',
      acknowledged: 'Acknowledged',
      investigating: 'Under Review',
      resolved: 'Resolved',
      closed: 'Closed'
    };
    return labels[status] || status;
  };

  const getStatusClass = (status: string): string => {
    const classes: { [key: string]: string } = {
      submitted: 'status-submitted',
      acknowledged: 'status-acknowledged',
      investigating: 'status-investigating',
      resolved: 'status-resolved',
      closed: 'status-closed'
    };
    return classes[status] || '';
  };

  const getPriorityClass = (priority: string): string => {
    const classes: { [key: string]: string } = {
      high: 'priority-high',
      medium: 'priority-medium',
      low: 'priority-low'
    };
    return classes[priority] || '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getTimelineSteps = (grievance: Grievance) => {
    const steps = [
      { status: 'submitted', label: 'Submitted', date: grievance.submittedDate, active: true },
      { status: 'acknowledged', label: 'Acknowledged', date: '', active: false },
      { status: 'investigating', label: 'Under Review', date: '', active: false },
      { status: 'resolved', label: 'Resolved', date: '', active: false }
    ];

    const statusOrder = ['submitted', 'acknowledged', 'investigating', 'resolved', 'closed'];
    const currentIndex = statusOrder.indexOf(grievance.status);

    return steps.map((step, index) => ({
      ...step,
      active: index <= currentIndex,
      current: statusOrder[currentIndex] === step.status
    }));
  };

  return (
    <div className="grievance-container">
      {/* Header Section */}
      <div className="grievance-header">
        <div className="header-top">
          <div>
            <h2><i className="fas fa-exclamation-circle"></i> Grievance Portal</h2>
            <p>Submit and track grievances regarding school matters</p>
          </div>
          <div className="student-selector">
            <i className="fas fa-user-graduate"></i>
            <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              {students.map(student => (
                <option key={student.id} value={student.id}>
                  {student.name} - Class {student.class}{student.section}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grievance-stats">
          <div className="stat-card stat-total">
            <div className="stat-icon">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.total}</span>
              <span className="stat-label">Total Grievances</span>
            </div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending/Open</span>
            </div>
          </div>
          <div className="stat-card stat-investigating">
            <div className="stat-icon">
              <i className="fas fa-search"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.investigating}</span>
              <span className="stat-label">Under Review</span>
            </div>
          </div>
          <div className="stat-card stat-resolved">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <span className="stat-value">{stats.resolved}</span>
              <span className="stat-label">Resolved</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grievance-main-content">
        {/* Left Column - Submit Grievance Form */}
        <div className="grievance-form-column">
          <div className="form-card">
            <h3><i className="fas fa-file-alt"></i> Submit New Grievance</h3>

            <div className="form-group">
              <label>Category <span className="required">*</span></label>
              <select
                value={formData.category}
                onChange={(e) => handleFormChange('category', e.target.value)}
              >
                <option value="">Select Category</option>
                <option value="academic">Academic Issues</option>
                <option value="behavioral">Behavioral Concerns</option>
                <option value="infrastructure">Infrastructure & Facilities</option>
                <option value="transport">Transport Issues</option>
                <option value="fee">Fee & Payment</option>
                <option value="administration">Administration</option>
                <option value="safety">Safety & Security</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Priority Level <span className="required">*</span></label>
              <div className="priority-options">
                <label className={`priority-option ${formData.priority === 'low' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={formData.priority === 'low'}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                  />
                  <span className="priority-indicator priority-low"></span>
                  <span>Low</span>
                </label>
                <label className={`priority-option ${formData.priority === 'medium' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={formData.priority === 'medium'}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                  />
                  <span className="priority-indicator priority-medium"></span>
                  <span>Medium</span>
                </label>
                <label className={`priority-option ${formData.priority === 'high' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={formData.priority === 'high'}
                    onChange={(e) => handleFormChange('priority', e.target.value)}
                  />
                  <span className="priority-indicator priority-high"></span>
                  <span>High</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>Subject/Title <span className="required">*</span></label>
              <input
                type="text"
                placeholder="Brief summary of the issue (max 100 characters)"
                maxLength={100}
                value={formData.subject}
                onChange={(e) => handleFormChange('subject', e.target.value)}
              />
              <span className="char-count">{formData.subject.length}/100</span>
            </div>

            <div className="form-group">
              <label>Detailed Description <span className="required">*</span></label>
              <textarea
                rows={5}
                placeholder="Please provide detailed information about your grievance. Include dates, names, and specific incidents if relevant."
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isAnonymous}
                  onChange={(e) => handleFormChange('isAnonymous', e.target.checked)}
                />
                <span>Submit anonymously (your identity will not be shared)</span>
              </label>
            </div>

            <button className="btn-submit-grievance" onClick={handleSubmitGrievance}>
              <i className="fas fa-paper-plane"></i>
              Submit Grievance
            </button>
          </div>
        </div>

        {/* Right Column - Grievance History */}
        <div className="grievance-history-column">
          <div className="history-card">
            <h3><i className="fas fa-history"></i> Your Grievances</h3>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="filter-row">
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                  <option value="all">All Status</option>
                  <option value="submitted">Submitted</option>
                  <option value="acknowledged">Acknowledged</option>
                  <option value="investigating">Under Review</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                  <option value="all">All Categories</option>
                  <option value="academic">Academic</option>
                  <option value="behavioral">Behavioral</option>
                  <option value="infrastructure">Infrastructure</option>
                  <option value="transport">Transport</option>
                  <option value="fee">Fee & Payment</option>
                  <option value="administration">Administration</option>
                  <option value="safety">Safety</option>
                  <option value="other">Other</option>
                </select>

                <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                  <option value="all">All Time</option>
                  <option value="30days">Last 30 Days</option>
                  <option value="90days">Last 90 Days</option>
                </select>
              </div>

              <div className="filter-row">
                <div className="search-box">
                  <i className="fas fa-search"></i>
                  <input
                    type="text"
                    placeholder="Search by subject or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="btn-reset-filters" onClick={resetFilters}>
                  <i className="fas fa-redo"></i>
                  Reset
                </button>
              </div>
            </div>

            {/* Grievance List */}
            <div className="grievance-list">
              {filteredGrievances.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-inbox"></i>
                  <p>No grievances found</p>
                  <span>Submit a new grievance to get started</span>
                </div>
              ) : (
                filteredGrievances.map(grievance => (
                  <div key={grievance.id} className="grievance-item">
                    <div className="grievance-item-header">
                      <h4>{grievance.subject}</h4>
                      <span className={`status-badge ${getStatusClass(grievance.status)}`}>
                        {getStatusLabel(grievance.status)}
                      </span>
                    </div>
                    <div className="grievance-item-meta">
                      <span className="category-badge">
                        <i className="fas fa-tag"></i>
                        {getCategoryLabel(grievance.category)}
                      </span>
                      <span className={`priority-badge ${getPriorityClass(grievance.priority)}`}>
                        <i className="fas fa-flag"></i>
                        {grievance.priority.toUpperCase()}
                      </span>
                      <span className="date-badge">
                        <i className="fas fa-calendar"></i>
                        {formatDate(grievance.submittedDate)}
                      </span>
                    </div>
                    <p className="grievance-preview">
                      {grievance.description.substring(0, 120)}
                      {grievance.description.length > 120 ? '...' : ''}
                    </p>
                    <div className="grievance-item-footer">
                      <button
                        className="btn-view-details"
                        onClick={() => handleViewDetails(grievance)}
                      >
                        <i className="fas fa-eye"></i>
                        View Details
                      </button>
                      <span className="last-updated">
                        Updated: {formatDate(grievance.lastUpdated)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Grievance Details Modal */}
      {showDetailsModal && selectedGrievance && (
        <div className="modal-overlay" onClick={() => setShowDetailsModal(false)}>
          <div className="grievance-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Grievance Details</h3>
              <button className="modal-close" onClick={() => setShowDetailsModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-body">
              {/* Grievance Header Info */}
              <div className="grievance-detail-header">
                <div className="detail-title">
                  <h2>{selectedGrievance.subject}</h2>
                  <span className="grievance-id">ID: {selectedGrievance.id}</span>
                </div>
                <div className="detail-badges">
                  <span className="category-badge">
                    <i className="fas fa-tag"></i>
                    {getCategoryLabel(selectedGrievance.category)}
                  </span>
                  <span className={`priority-badge ${getPriorityClass(selectedGrievance.priority)}`}>
                    <i className="fas fa-flag"></i>
                    {selectedGrievance.priority.toUpperCase()}
                  </span>
                  <span className={`status-badge ${getStatusClass(selectedGrievance.status)}`}>
                    {getStatusLabel(selectedGrievance.status)}
                  </span>
                </div>
              </div>

              {/* Timeline Section */}
              <div className="timeline-section">
                <h4><i className="fas fa-stream"></i> Status Timeline</h4>
                <div className="timeline">
                  {getTimelineSteps(selectedGrievance).map((step, index) => (
                    <div key={index} className={`timeline-step ${step.active ? 'active' : ''} ${step.current ? 'current' : ''}`}>
                      <div className="timeline-marker">
                        <div className="timeline-dot"></div>
                        {index < 3 && <div className="timeline-line"></div>}
                      </div>
                      <div className="timeline-content">
                        <span className="timeline-label">{step.label}</span>
                        {step.date && <span className="timeline-date">{formatDate(step.date)}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Original Submission */}
              <div className="submission-section">
                <h4><i className="fas fa-file-alt"></i> Original Submission</h4>
                <div className="submission-content">
                  <p className="submission-meta">
                    <strong>Submitted by:</strong> {selectedGrievance.isAnonymous ? 'Anonymous' : 'You'} |
                    <strong> Date:</strong> {formatDate(selectedGrievance.submittedDate)}
                    {selectedGrievance.assignedTo && (
                      <> | <strong> Assigned to:</strong> {selectedGrievance.assignedTo}</>
                    )}
                  </p>
                  <p className="submission-description">{selectedGrievance.description}</p>
                  {selectedGrievance.resolutionNotes && (
                    <div className="resolution-notes">
                      <strong><i className="fas fa-check-circle"></i> Resolution:</strong>
                      <p>{selectedGrievance.resolutionNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Responses Section */}
              <div className="responses-section">
                <h4><i className="fas fa-comments"></i> Responses ({selectedGrievance.responses.length})</h4>
                {selectedGrievance.responses.length === 0 ? (
                  <p className="no-responses">No responses yet. The school will respond soon.</p>
                ) : (
                  <div className="responses-list">
                    {selectedGrievance.responses.map(response => (
                      <div key={response.id} className={`response-item ${response.isOfficial ? 'official' : 'parent'}`}>
                        <div className="response-header">
                          <div className="response-author">
                            <i className={`fas ${response.isOfficial ? 'fa-user-tie' : 'fa-user'}`}></i>
                            <div>
                              <strong>{response.respondentName}</strong>
                              <span className="response-role">{response.respondentRole}</span>
                            </div>
                          </div>
                          <span className="response-date">{formatDate(response.date)}</span>
                        </div>
                        <p className="response-message">{response.message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up Section */}
              {selectedGrievance.status !== 'closed' && (
                <div className="followup-section">
                  <h4><i className="fas fa-reply"></i> Add Follow-up Comment</h4>
                  <textarea
                    rows={3}
                    placeholder="Add additional information or ask a question..."
                    value={followUpComment}
                    onChange={(e) => setFollowUpComment(e.target.value)}
                  ></textarea>
                  <button className="btn-add-followup" onClick={handleAddFollowUp}>
                    <i className="fas fa-paper-plane"></i>
                    Add Comment
                  </button>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button className="btn-print" onClick={handlePrintGrievance}>
                <i className="fas fa-print"></i>
                Print
              </button>
              <button className="btn-close-modal" onClick={() => setShowDetailsModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`toast-notification toast-${toast.type}`}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : toast.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default Grievance;
