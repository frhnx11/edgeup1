import React, { useState } from 'react';

// TypeScript Interfaces
interface StaffMember {
  id: string;
  staffId: string;
  name: string;
  photo: string;
  role: string;
  department: 'Teaching' | 'Support' | 'Administration';
  subject?: string;
  email: string;
  phone: string;
  joiningDate: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract';
  status: 'Active' | 'On Leave' | 'Inactive';
  salary: number;
  classes?: string[];
  education?: string;
  experience?: number;
  leaveBalance?: {
    casual: number;
    sick: number;
    vacation: number;
  };
  address?: string;
  emergencyContact?: string;
  bloodGroup?: string;
}

interface AttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'Half-day' | 'On Leave';
  checkIn?: string;
  checkOut?: string;
  notes?: string;
}

interface LeaveRequest {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  leaveType: 'Sick' | 'Casual' | 'Vacation' | 'Maternity' | 'Emergency';
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
}

interface SalaryRecord {
  id: string;
  staffId: string;
  staffName: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  paymentDate: string;
  status: 'Paid' | 'Pending' | 'Processing';
}

interface PerformanceReview {
  id: string;
  staffId: string;
  staffName: string;
  reviewDate: string;
  reviewer: string;
  rating: number;
  strengths: string[];
  improvements: string[];
  comments: string;
  goals: string[];
}

interface StaffDocument {
  id: string;
  staffId: string;
  staffName: string;
  documentType: 'Aadhar' | 'PAN' | 'License' | 'Certificate' | 'Degree' | 'Contract';
  documentName: string;
  uploadDate: string;
  expiryDate?: string;
  status: 'Valid' | 'Expired' | 'Expiring Soon';
}

interface Training {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  trainer: string;
  participants: string[];
  status: 'Upcoming' | 'Ongoing' | 'Completed';
}

interface Holiday {
  id: string;
  name: string;
  date: string;
  type: 'National' | 'School' | 'Festival' | 'Weekend';
  description: string;
}

const StaffManagement = () => {
  // State Management - Main Data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: 'st1', staffId: 'FAC001', name: 'Dr. Sarah Johnson', photo: '👩‍🏫',
      role: 'Professor', department: 'Teaching', subject: 'Data Structures & Algorithms',
      email: 'sarah.johnson@college.edu', phone: '+91 98765 43210',
      joiningDate: '2018-01-15', employmentType: 'Full-time', status: 'Active',
      salary: 75000, classes: ['CSE-3A', 'CSE-3B', 'CSE-4A'],
      education: 'Ph.D Computer Science, M.Tech CSE', experience: 12,
      leaveBalance: { casual: 8, sick: 10, vacation: 15 },
      address: '123 Faculty Quarters, Campus', emergencyContact: '+91 98765 00000',
      bloodGroup: 'O+'
    },
    {
      id: 'st2', staffId: 'FAC002', name: 'Dr. Rajesh Kumar', photo: '👨‍🏫',
      role: 'Associate Professor', department: 'Teaching', subject: 'Thermodynamics',
      email: 'rajesh.kumar@college.edu', phone: '+91 98765 43211',
      joiningDate: '2019-08-01', employmentType: 'Full-time', status: 'Active',
      salary: 68000, classes: ['ME-2A', 'ME-2B', 'ME-3A'],
      education: 'Ph.D Mechanical Engineering, M.Tech Thermal', experience: 9,
      leaveBalance: { casual: 10, sick: 12, vacation: 18 }
    },
    {
      id: 'st3', staffId: 'FAC003', name: 'Prof. Priya Sharma', photo: '👩‍🏫',
      role: 'Assistant Professor', department: 'Teaching', subject: 'Digital Signal Processing',
      email: 'priya.sharma@college.edu', phone: '+91 98765 43212',
      joiningDate: '2020-07-15', employmentType: 'Full-time', status: 'On Leave',
      salary: 62000, classes: ['EC-3A', 'EC-3B', 'EC-4A'],
      education: 'Ph.D Electronics, M.Tech VLSI', experience: 7,
      leaveBalance: { casual: 6, sick: 8, vacation: 12 }
    },
    {
      id: 'st4', staffId: 'STAFF001', name: 'Mr. Anil Verma', photo: '👨‍💼',
      role: 'Lab Technician', department: 'Technical Support', subject: 'Physics Lab',
      email: 'anil.verma@college.edu', phone: '+91 98765 43213',
      joiningDate: '2021-01-10', employmentType: 'Full-time', status: 'Active',
      salary: 45000, education: 'B.Sc. Physics, Diploma Electronics', experience: 5,
      leaveBalance: { casual: 12, sick: 10, vacation: 15 }
    },
    {
      id: 'st5', staffId: 'ADMIN001', name: 'Mrs. Sunita Patel', photo: '👩‍💼',
      role: 'Senior Accountant', department: 'Administration',
      email: 'sunita.patel@college.edu', phone: '+91 98765 43214',
      joiningDate: '2017-01-01', employmentType: 'Full-time', status: 'Active',
      salary: 55000, education: 'M.Com, CA', experience: 15,
      leaveBalance: { casual: 5, sick: 10, vacation: 20 }
    },
    {
      id: 'st6', staffId: 'FAC004', name: 'Dr. Amit Desai', photo: '👨‍🏫',
      role: 'Associate Professor', department: 'Teaching', subject: 'Structural Analysis',
      email: 'amit.desai@college.edu', phone: '+91 98765 43215',
      joiningDate: '2019-06-20', employmentType: 'Full-time', status: 'Active',
      salary: 70000, classes: ['CE-3A', 'CE-4B'],
      education: 'Ph.D Civil Engineering, M.Tech Structures', experience: 10,
      leaveBalance: { casual: 9, sick: 12, vacation: 16 }
    },
    {
      id: 'st7', staffId: 'FAC005', name: 'Prof. Neha Reddy', photo: '👩‍🏫',
      role: 'Assistant Professor', department: 'Teaching', subject: 'Database Management Systems',
      email: 'neha.reddy@college.edu', phone: '+91 98765 43216',
      joiningDate: '2020-08-10', employmentType: 'Full-time', status: 'Active',
      salary: 65000, classes: ['IT-2A', 'IT-2B', 'IT-3A'],
      education: 'Ph.D Information Technology, M.Tech IT', experience: 6,
      leaveBalance: { casual: 10, sick: 11, vacation: 14 }
    },
    {
      id: 'st8', staffId: 'STAFF002', name: 'Mr. Vikram Singh', photo: '👨‍💼',
      role: 'Sports Coordinator', department: 'Support Staff', subject: 'Sports Activities',
      email: 'vikram.singh@college.edu', phone: '+91 98765 43217',
      joiningDate: '2021-03-15', employmentType: 'Full-time', status: 'Active',
      salary: 40000, education: 'M.P.Ed, B.P.Ed', experience: 4,
      leaveBalance: { casual: 8, sick: 6, vacation: 10 }
    },
    {
      id: 'st9', staffId: 'STAFF003', name: 'Mrs. Kavita Joshi', photo: '👩‍💼',
      role: 'Senior Librarian', department: 'Support Staff', subject: 'Library Management',
      email: 'kavita.joshi@college.edu', phone: '+91 98765 43218',
      joiningDate: '2018-07-01', employmentType: 'Full-time', status: 'Active',
      salary: 50000, education: 'M.Lib.Sc, B.Lib.Sc', experience: 11,
      leaveBalance: { casual: 6, sick: 8, vacation: 12 }
    },
    {
      id: 'st10', staffId: 'ADMIN002', name: 'Mr. Ramesh Gupta', photo: '👨‍💼',
      role: 'IT Administrator', department: 'Administration', subject: 'Network & Infrastructure',
      email: 'ramesh.gupta@college.edu', phone: '+91 98765 43219',
      joiningDate: '2020-01-20', employmentType: 'Full-time', status: 'Active',
      salary: 60000, education: 'B.Tech IT, CCNA, MCSE', experience: 8,
      leaveBalance: { casual: 12, sick: 10, vacation: 15 }
    },
  ]);

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'lv1', staffId: 'st3', staffName: 'Prof. Priya Sharma',
      role: 'Assistant Professor', leaveType: 'Sick',
      startDate: '2025-10-25', endDate: '2025-10-27', duration: 3,
      reason: 'Medical emergency - need rest as per doctor advice',
      status: 'Pending', appliedDate: '2025-10-23'
    },
    {
      id: 'lv2', staffId: 'st1', staffName: 'Dr. Sarah Johnson',
      role: 'Professor', leaveType: 'Casual',
      startDate: '2025-11-01', endDate: '2025-11-01', duration: 1,
      reason: 'Personal work - family commitment',
      status: 'Pending', appliedDate: '2025-10-24'
    },
    {
      id: 'lv3', staffId: 'st6', staffName: 'Dr. Amit Desai',
      role: 'Associate Professor', leaveType: 'Vacation',
      startDate: '2025-12-20', endDate: '2025-12-27', duration: 8,
      reason: 'Family vacation planned in advance',
      status: 'Pending', appliedDate: '2025-10-22'
    }
  ]);

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);

  const [salaryRecords, setSalaryRecords] = useState<SalaryRecord[]>([
    {
      id: 'sal1', staffId: 'st1', staffName: 'Dr. Sarah Johnson',
      month: 'September 2025', basicSalary: 75000, allowances: 10000,
      deductions: 5000, netSalary: 80000, paymentDate: '2025-10-01', status: 'Paid'
    },
    {
      id: 'sal2', staffId: 'st2', staffName: 'Mr. Rajesh Kumar',
      month: 'September 2025', basicSalary: 68000, allowances: 8000,
      deductions: 4000, netSalary: 72000, paymentDate: '2025-10-01', status: 'Paid'
    },
    {
      id: 'sal3', staffId: 'st1', staffName: 'Dr. Sarah Johnson',
      month: 'October 2025', basicSalary: 75000, allowances: 10000,
      deductions: 5000, netSalary: 80000, paymentDate: '2025-10-30', status: 'Processing'
    }
  ]);

  const [documents, setDocuments] = useState<StaffDocument[]>([
    {
      id: 'doc1', staffId: 'st1', staffName: 'Dr. Sarah Johnson',
      documentType: 'Aadhar', documentName: 'Aadhar Card',
      uploadDate: '2024-01-15', status: 'Valid'
    },
    {
      id: 'doc2', staffId: 'st1', staffName: 'Dr. Sarah Johnson',
      documentType: 'Degree', documentName: 'M.Sc. Certificate',
      uploadDate: '2024-01-15', status: 'Valid'
    },
    {
      id: 'doc3', staffId: 'st2', staffName: 'Mr. Rajesh Kumar',
      documentType: 'License', documentName: 'Driving License',
      uploadDate: '2024-06-10', expiryDate: '2025-11-15', status: 'Expiring Soon'
    }
  ]);

  const [trainings, setTrainings] = useState<Training[]>([
    {
      id: 'tr1', title: 'Digital Teaching Methods Workshop',
      description: 'Learn modern teaching techniques using technology',
      date: '2025-11-05', duration: '2 days', trainer: 'Prof. Kumar',
      participants: ['st1', 'st2', 'st3'], status: 'Upcoming'
    },
    {
      id: 'tr2', title: 'First Aid & Safety Training',
      description: 'Essential first aid and safety protocols',
      date: '2025-10-28', duration: '1 day', trainer: 'Dr. Mehta',
      participants: ['st4', 'st8'], status: 'Ongoing'
    }
  ]);

  const [holidays, setHolidays] = useState<Holiday[]>([
    {
      id: 'hol1', name: 'Diwali', date: '2025-11-01', type: 'Festival',
      description: 'Festival of Lights'
    },
    {
      id: 'hol2', name: 'Christmas', date: '2025-12-25', type: 'National',
      description: 'Christmas Day'
    },
    {
      id: 'hol3', name: 'Republic Day', date: '2026-01-26', type: 'National',
      description: 'Republic Day of India'
    }
  ]);

  // View Navigation State
  const [currentView, setCurrentView] = useState<'main' | 'attendance' | 'payroll'>('main');

  // Modal States
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showEditStaffModal, setShowEditStaffModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showTrainingModal, setShowTrainingModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success');
  const [activeQuickAction, setActiveQuickAction] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterEmploymentType, setFilterEmploymentType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [activeSection, setActiveSection] = useState<'directory' | 'payroll' | 'documents' | 'training' | 'holidays' | 'departments'>('directory');

  // Form States
  const [newStaffForm, setNewStaffForm] = useState({
    staffId: '', name: '', role: '', department: 'Teaching' as const,
    subject: '', email: '', phone: '', joiningDate: '',
    employmentType: 'Full-time' as const, salary: '',
    education: '', experience: '', photo: '',
    gender: '', dob: '', alternateContact: '', address: '',
    roleCategory: '', qualification: '', basicSalary: '',
    allowances: '', bankAccount: '', ifsc: '', pan: '',
    profilePhoto: null as File | null, resume: null as File | null,
    idProof: null as File | null
  });

  // Attendance States
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceDept, setAttendanceDept] = useState('all');
  const [currentAttendance, setCurrentAttendance] = useState<{[key: string]: {status: string, time?: string, notes?: string}}>({});
  const [selectedStaffForAttendance, setSelectedStaffForAttendance] = useState<string[]>([]);

  // Payroll States
  const [payrollMonth, setPayrollMonth] = useState(new Date().getMonth());
  const [payrollYear, setPayrollYear] = useState(new Date().getFullYear());
  const [payrollDept, setPayrollDept] = useState('all');
  const [selectedStaffForPayroll, setSelectedStaffForPayroll] = useState<string[]>([]);

  // Helper Functions
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Active': '#10ac8b', 'On Leave': '#f39c12', 'Inactive': '#e74c3c',
      'Paid': '#10ac8b', 'Pending': '#f39c12', 'Processing': '#3498db',
      'Approved': '#10ac8b', 'Rejected': '#e74c3c',
      'Valid': '#10ac8b', 'Expired': '#e74c3c', 'Expiring Soon': '#f39c12',
      'Upcoming': '#3498db', 'Ongoing': '#f39c12', 'Completed': '#10ac8b'
    };
    return colors[status] || '#6c757d';
  };

  const getDepartmentIcon = (department: string) => {
    const icons: { [key: string]: string } = {
      'Teaching': 'fa-chalkboard-teacher',
      'Support': 'fa-hands-helping',
      'Administration': 'fa-user-tie'
    };
    return icons[department] || 'fa-user';
  };

  // Statistics
  const calculateStats = () => {
    const total = staffMembers.length;
    const activeTeachers = staffMembers.filter(s => s.department === 'Teaching' && s.status === 'Active').length;
    const presentToday = staffMembers.filter(s => s.status === 'Active').length - staffMembers.filter(s => s.status === 'On Leave').length;
    const onLeaveToday = staffMembers.filter(s => s.status === 'On Leave').length;
    const pendingLeaves = leaveRequests.filter(l => l.status === 'Pending').length;
    const attendanceRate = total > 0 ? Math.round((presentToday / total) * 100) : 0;
    const avgSalary = staffMembers.length > 0 ? Math.round(staffMembers.reduce((sum, s) => sum + s.salary, 0) / staffMembers.length) : 0;
    const teachingStaff = staffMembers.filter(s => s.department === 'Teaching').length;
    const supportStaff = staffMembers.filter(s => s.department === 'Support').length;
    const adminStaff = staffMembers.filter(s => s.department === 'Administration').length;

    return {
      totalStaff: total,
      activeTeachers,
      presentToday,
      onLeaveToday,
      pendingLeaves,
      attendanceRate,
      avgSalary,
      teachingStaff,
      supportStaff,
      adminStaff
    };
  };

  // Filter Functions
  const getFilteredStaff = () => {
    let filtered = staffMembers;

    if (searchQuery) {
      filtered = filtered.filter((staff) =>
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterDepartment !== 'all') {
      filtered = filtered.filter((staff) => staff.department === filterDepartment);
    }

    if (filterEmploymentType !== 'all') {
      filtered = filtered.filter((staff) => staff.employmentType === filterEmploymentType);
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((staff) => staff.status === filterStatus);
    }

    return filtered;
  };

  // CRUD Operations
  const handleAddStaff = () => {
    setActiveQuickAction('add-staff');
    setNewStaffForm({
      staffId: '', name: '', role: '', department: 'Teaching',
      subject: '', email: '', phone: '', joiningDate: '',
      employmentType: 'Full-time', salary: '',
      education: '', experience: ''
    });
    setShowAddStaffModal(true);
  };

  const generateStaffId = () => {
    // Count existing staff by category
    const teachingCount = staffMembers.filter(s => s.department === 'Teaching').length;
    const supportCount = staffMembers.filter(s => s.department === 'Support').length;
    const adminCount = staffMembers.filter(s => s.department === 'Administration').length;

    if (newStaffForm.department === 'Teaching') {
      return `FAC${String(teachingCount + 1).padStart(3, '0')}`;
    } else if (newStaffForm.department === 'Support') {
      return `STAFF${String(supportCount + 1).padStart(3, '0')}`;
    } else {
      return `ADMIN${String(adminCount + 1).padStart(3, '0')}`;
    }
  };

  const handleSaveNewStaff = () => {
    if (!newStaffForm.name || !newStaffForm.email || !newStaffForm.phone || !newStaffForm.role) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    // Auto-generate Staff ID
    const generatedStaffId = generateStaffId();

    const totalSalary = (parseFloat(newStaffForm.basicSalary || '0') + parseFloat(newStaffForm.allowances || '0'));

    const newStaff: StaffMember = {
      id: `st${staffMembers.length + 1}`,
      staffId: generatedStaffId,
      name: newStaffForm.name,
      photo: newStaffForm.department === 'Teaching' ? '👨‍🏫' : newStaffForm.department === 'Support' ? '👨‍💼' : '👨‍💼',
      role: newStaffForm.role,
      department: newStaffForm.department,
      subject: newStaffForm.subject,
      email: newStaffForm.email,
      phone: newStaffForm.phone,
      joiningDate: newStaffForm.joiningDate,
      employmentType: newStaffForm.employmentType,
      status: 'Active',
      salary: totalSalary,
      education: newStaffForm.qualification || newStaffForm.education,
      experience: parseInt(newStaffForm.experience || '0'),
      leaveBalance: { casual: 12, sick: 12, vacation: 18 },
      address: newStaffForm.address,
      emergencyContact: newStaffForm.alternateContact
    };

    setStaffMembers([...staffMembers, newStaff]);

    // Reset form
    setNewStaffForm({
      staffId: '', name: '', role: '', department: 'Teaching' as const,
      subject: '', email: '', phone: '', joiningDate: '',
      employmentType: 'Full-time' as const, salary: '',
      education: '', experience: '', photo: '',
      gender: '', dob: '', alternateContact: '', address: '',
      roleCategory: '', qualification: '', basicSalary: '',
      allowances: '', bankAccount: '', ifsc: '', pan: '',
      profilePhoto: null, resume: null, idProof: null
    });

    setShowAddStaffModal(false);
    showToast(`Faculty member ${newStaff.name} added successfully! ID: ${generatedStaffId}`, 'success');
  };

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setNewStaffForm({
      staffId: staff.staffId,
      name: staff.name,
      role: staff.role,
      department: staff.department,
      subject: staff.subject || '',
      email: staff.email,
      phone: staff.phone,
      joiningDate: staff.joiningDate,
      employmentType: staff.employmentType,
      salary: staff.salary.toString(),
      education: staff.education || '',
      experience: staff.experience?.toString() || ''
    });
    setShowEditStaffModal(true);
  };

  const handleUpdateStaff = () => {
    if (!selectedStaff) return;

    const updatedStaff = staffMembers.map(staff =>
      staff.id === selectedStaff.id
        ? {
            ...staff,
            staffId: newStaffForm.staffId,
            name: newStaffForm.name,
            role: newStaffForm.role,
            department: newStaffForm.department,
            subject: newStaffForm.subject,
            email: newStaffForm.email,
            phone: newStaffForm.phone,
            joiningDate: newStaffForm.joiningDate,
            employmentType: newStaffForm.employmentType,
            salary: parseFloat(newStaffForm.salary),
            education: newStaffForm.education,
            experience: parseInt(newStaffForm.experience)
          }
        : staff
    );

    setStaffMembers(updatedStaff);
    setShowEditStaffModal(false);
    setSelectedStaff(null);
    showToast('Staff details updated successfully!', 'success');
  };

  const handleDeleteStaff = () => {
    if (!selectedStaff) return;

    setStaffMembers(staffMembers.filter(staff => staff.id !== selectedStaff.id));
    setShowDeleteConfirm(false);
    setSelectedStaff(null);
    showToast('Staff member removed successfully', 'success');
  };

  const confirmDeleteStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowDeleteConfirm(true);
  };

  // Attendance Functions
  const handleMarkAttendance = () => {
    setActiveQuickAction('attendance');
    setCurrentView('attendance');
  };

  const markStaffAttendance = (staffId: string, status: 'Present' | 'Absent' | 'Late' | 'Half-day') => {
    const staff = staffMembers.find(s => s.id === staffId);
    if (!staff) return;

    const today = new Date().toISOString().split('T')[0];
    const newRecord: AttendanceRecord = {
      id: `att${attendanceRecords.length + 1}`,
      staffId: staff.id,
      staffName: staff.name,
      date: today,
      status: status,
      checkIn: status === 'Present' ? '09:00 AM' : undefined,
      checkOut: status === 'Present' ? '05:00 PM' : undefined
    };

    setCurrentAttendance([...attendanceRecords, newRecord]);
    showToast(`${staff.name} marked as ${status}`, 'success');
  };

  const handleBulkAttendance = (status: 'Present' | 'Absent') => {
    const today = new Date().toISOString().split('T')[0];
    const newRecords = staffMembers
      .filter(s => s.status === 'Active')
      .map((staff, index) => ({
        id: `att${attendanceRecords.length + index + 1}`,
        staffId: staff.id,
        staffName: staff.name,
        date: today,
        status: status,
        checkIn: status === 'Present' ? '09:00 AM' : undefined,
        checkOut: status === 'Present' ? '05:00 PM' : undefined
      }));

    setCurrentAttendance([...attendanceRecords, ...newRecords]);
    setShowAttendanceModal(false);
    showToast(`Bulk attendance marked for ${newRecords.length} staff members`, 'success');
  };

  // Payroll Functions
  const handleProcessPayroll = () => {
    setActiveQuickAction('payroll');
    setCurrentView('payroll');
  };

  const processMonthlyPayroll = () => {
    const currentMonth = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
    const newPayrollRecords = staffMembers.map((staff, index) => ({
      id: `sal${salaryRecords.length + index + 1}`,
      staffId: staff.id,
      staffName: staff.name,
      month: currentMonth,
      basicSalary: staff.salary,
      allowances: Math.round(staff.salary * 0.15),
      deductions: Math.round(staff.salary * 0.08),
      netSalary: staff.salary + Math.round(staff.salary * 0.15) - Math.round(staff.salary * 0.08),
      paymentDate: new Date().toISOString().split('T')[0],
      status: 'Processing' as const
    }));

    setSalaryRecords([...salaryRecords, ...newPayrollRecords]);
    setShowPayrollModal(false);
    showToast(`Payroll processed for ${staffMembers.length} staff members`, 'success');
  };

  // Leave Management
  const handleLeaveAction = (leave: LeaveRequest, action: 'approve' | 'reject') => {
    const updatedLeaves = leaveRequests.map(l =>
      l.id === leave.id
        ? { ...l, status: action === 'approve' ? 'Approved' as const : 'Rejected' as const }
        : l
    );

    setLeaveRequests(updatedLeaves);

    // Update staff status if approved
    if (action === 'approve') {
      const updatedStaff = staffMembers.map(s =>
        s.id === leave.staffId ? { ...s, status: 'On Leave' as const } : s
      );
      setStaffMembers(updatedStaff);
    }

    showToast(`Leave ${action}d for ${leave.staffName}`, 'success');
    setSelectedLeave(null);
  };

  // Reports & Export
  const handleGenerateReport = (type: string) => {
    setActiveQuickAction('reports');
    setShowReportModal(true);
  };

  const handleExportData = (type: 'staff' | 'attendance' | 'payroll' | 'leaves') => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'staff':
        data = staffMembers;
        filename = 'staff-directory.csv';
        break;
      case 'attendance':
        data = attendanceRecords;
        filename = 'attendance-records.csv';
        break;
      case 'payroll':
        data = salaryRecords;
        filename = 'payroll-records.csv';
        break;
      case 'leaves':
        data = leaveRequests;
        filename = 'leave-requests.csv';
        break;
    }

    // Convert to CSV
    if (data.length > 0) {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;

      // Create download link
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      window.URL.revokeObjectURL(url);

      showToast(`${filename} downloaded successfully`, 'success');
    }
  };

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff);
  };

  const handleViewSalary = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowSalaryModal(true);
  };

  const handlePerformanceReview = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowPerformanceModal(true);
  };

  // Helper function to generate professional avatar with initials
  const getStaffInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      '#10ac8b', // Teal
      '#3b82f6', // Blue
      '#8b5cf6', // Purple
      '#ef4444', // Red
      '#f59e0b', // Orange
      '#14b8a6', // Cyan
      '#ec4899', // Pink
      '#6366f1', // Indigo
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const renderAvatar = (staff: StaffMember, size: 'small' | 'normal' = 'normal') => {
    const initials = getStaffInitials(staff.name);
    const bgColor = getAvatarColor(staff.name);
    const className = size === 'small' ? 'staff-avatar-small' : 'staff-avatar';
    return (
      <span className={className} style={{ backgroundColor: bgColor }}>
        {initials}
      </span>
    );
  };

  // ==================== MARK ATTENDANCE PAGE ====================
  const renderAttendancePage = () => {
    const attendanceStats = {
      present: Object.values(currentAttendance).filter(a => a.status === 'Present').length,
      absent: Object.values(currentAttendance).filter(a => a.status === 'Absent').length,
      late: Object.values(currentAttendance).filter(a => a.status === 'Late').length,
      onLeave: Object.values(currentAttendance).filter(a => a.status === 'On Leave').length,
      total: staffMembers.filter(s => s.status === 'Active').length
    };
    const attendanceRate = attendanceStats.total > 0
      ? ((attendanceStats.present + attendanceStats.late) / attendanceStats.total * 100).toFixed(1)
      : '0.0';

    const filteredAttendanceStaff = staffMembers.filter(staff => {
      if (attendanceDept !== 'all' && staff.department !== attendanceDept) return false;
      return staff.status === 'Active';
    });

    const handleSaveAttendance = () => {
      const recordCount = Object.keys(currentAttendance).length;
      setAttendanceRecords([...attendanceRecords, ...Object.values(currentAttendance)]);
      setCurrentAttendance({});
      showToast(`Attendance saved for ${recordCount} staff members on ${attendanceDate}`, 'success');
      setCurrentView('main');
    };

    const handleBulkMarkPresent = () => {
      const newAttendance = { ...currentAttendance };
      filteredAttendanceStaff.forEach(staff => {
        if (!newAttendance[staff.id]) {
          newAttendance[staff.id] = {
            status: 'Present',
            time: '09:00',
            notes: ''
          };
        }
      });
      setCurrentAttendance(newAttendance);
      showToast('All staff marked as Present', 'success');
    };

    const handleBulkMarkAbsent = () => {
      const newAttendance = { ...currentAttendance };
      filteredAttendanceStaff.forEach(staff => {
        if (!newAttendance[staff.id]) {
          newAttendance[staff.id] = {
            status: 'Absent',
            time: undefined,
            notes: ''
          };
        }
      });
      setCurrentAttendance(newAttendance);
      showToast('All staff marked as Absent', 'error');
    };

    const handleClearAll = () => {
      setCurrentAttendance({});
      showToast('All attendance cleared', 'info');
    };

    const handleAttendanceChange = (staffId: string, field: 'status' | 'time' | 'notes', value: string) => {
      setCurrentAttendance(prev => ({
        ...prev,
        [staffId]: {
          ...prev[staffId],
          [field]: value
        }
      }));
    };

    return (
      <div className="attendance-page-container">
        {/* Header Section */}
        <div className="smgmt-header">
          <button className="back-button" onClick={() => setCurrentView('main')}>
            <i className="fas fa-arrow-left"></i> Back to Staff Management
          </button>
          <div className="header-content-row">
            <div className="header-title-section">
              <h1><i className="fas fa-clipboard-check"></i> Mark Attendance</h1>
              <p className="header-subtitle">
                {new Date(attendanceDate).toLocaleDateString('en-IN', {
                  weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
                })}
              </p>
            </div>
            <div className="header-actions">
              <button className="btn-secondary" onClick={() => handleExportData('attendance')}>
                <i className="fas fa-file-excel"></i> Export Report
              </button>
              <button className="btn-primary" onClick={handleSaveAttendance}>
                <i className="fas fa-save"></i> Save Attendance
              </button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="attendance-stats-grid">
          <div className="attendance-stat-card present">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Present</span>
              <span className="stat-value">{attendanceStats.present}</span>
              <span className="stat-sublabel">Staff members</span>
            </div>
          </div>

          <div className="attendance-stat-card absent">
            <div className="stat-icon">
              <i className="fas fa-times-circle"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Absent</span>
              <span className="stat-value">{attendanceStats.absent}</span>
              <span className="stat-sublabel">Staff members</span>
            </div>
          </div>

          <div className="attendance-stat-card late">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Late</span>
              <span className="stat-value">{attendanceStats.late}</span>
              <span className="stat-sublabel">Staff members</span>
            </div>
          </div>

          <div className="attendance-stat-card leave">
            <div className="stat-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">On Leave</span>
              <span className="stat-value">{attendanceStats.onLeave}</span>
              <span className="stat-sublabel">Staff members</span>
            </div>
          </div>

          <div className="attendance-stat-card percentage">
            <div className="stat-icon">
              <i className="fas fa-percentage"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Attendance Rate</span>
              <span className="stat-value">{attendanceRate}%</span>
              <span className="stat-sublabel">Overall rate</span>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="attendance-controls-card">
          <div className="controls-row">
            <div className="form-group">
              <label><i className="fas fa-calendar"></i> Select Date</label>
              <input
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label><i className="fas fa-filter"></i> Department Filter</label>
              <select
                value={attendanceDept}
                onChange={(e) => setAttendanceDept(e.target.value)}
                className="form-control"
              >
                <option value="all">All Departments</option>
                <option value="Teaching">Teaching Faculty</option>
                <option value="Support">Support Staff</option>
                <option value="Administration">Administrative Staff</option>
              </select>
            </div>

            <div className="bulk-actions-group">
              <button className="bulk-btn present" onClick={handleBulkMarkPresent}>
                <i className="fas fa-check-double"></i> Mark All Present
              </button>
              <button className="bulk-btn absent" onClick={handleBulkMarkAbsent}>
                <i className="fas fa-times-circle"></i> Mark All Absent
              </button>
              <button className="bulk-btn clear" onClick={handleClearAll}>
                <i className="fas fa-eraser"></i> Clear All
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="attendance-table-card">
          <div className="card-header">
            <h3><i className="fas fa-users"></i> Staff Attendance List</h3>
            <p>Total: {filteredAttendanceStaff.length} staff members</p>
          </div>
          <div className="table-container">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Staff ID</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Attendance Status</th>
                  <th>Check-in Time</th>
                  <th>Notes/Remarks</th>
                </tr>
              </thead>
              <tbody>
                {filteredAttendanceStaff.map(staff => {
                  const attendance = currentAttendance[staff.id] || { status: '', time: '', notes: '' };
                  return (
                    <tr key={staff.id}>
                      <td>
                        <div className="staff-info">
                          {renderAvatar(staff)}
                          <div className="staff-details">
                            <span className="staff-name">{staff.name}</span>
                            <span className="staff-email">{staff.email}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="staff-id-badge">{staff.staffId}</span></td>
                      <td><span className="dept-badge">{staff.department}</span></td>
                      <td>{staff.role}</td>
                      <td>
                        <div className="attendance-status-buttons">
                          <button
                            className={`status-btn present ${attendance.status === 'Present' ? 'active' : ''}`}
                            onClick={() => handleAttendanceChange(staff.id, 'status', 'Present')}
                          >
                            <i className="fas fa-check"></i> Present
                          </button>
                          <button
                            className={`status-btn absent ${attendance.status === 'Absent' ? 'active' : ''}`}
                            onClick={() => handleAttendanceChange(staff.id, 'status', 'Absent')}
                          >
                            <i className="fas fa-times"></i> Absent
                          </button>
                          <button
                            className={`status-btn late ${attendance.status === 'Late' ? 'active' : ''}`}
                            onClick={() => handleAttendanceChange(staff.id, 'status', 'Late')}
                          >
                            <i className="fas fa-clock"></i> Late
                          </button>
                          <button
                            className={`status-btn leave ${attendance.status === 'On Leave' ? 'active' : ''}`}
                            onClick={() => handleAttendanceChange(staff.id, 'status', 'On Leave')}
                          >
                            <i className="fas fa-calendar-times"></i> Leave
                          </button>
                        </div>
                      </td>
                      <td>
                        {(attendance.status === 'Present' || attendance.status === 'Late') && (
                          <input
                            type="time"
                            value={attendance.time || '09:00'}
                            onChange={(e) => handleAttendanceChange(staff.id, 'time', e.target.value)}
                            className="time-input"
                          />
                        )}
                      </td>
                      <td>
                        <input
                          type="text"
                          placeholder="Add notes..."
                          value={attendance.notes || ''}
                          onChange={(e) => handleAttendanceChange(staff.id, 'notes', e.target.value)}
                          className="notes-input"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ==================== PROCESS PAYROLL PAGE ====================
  const renderPayrollPage = () => {
    const filteredPayrollStaff = staffMembers.filter(staff => {
      if (payrollDept !== 'all' && staff.department !== payrollDept) return false;
      return staff.status === 'Active';
    });

    const payrollStats = {
      totalStaff: filteredPayrollStaff.length,
      totalSalary: filteredPayrollStaff.reduce((sum, staff) => sum + staff.salary, 0),
      totalDeductions: filteredPayrollStaff.reduce((sum, staff) => sum + Math.round(staff.salary * 0.10), 0),
      netPayable: filteredPayrollStaff.reduce((sum, staff) => {
        const gross = staff.salary;
        const deductions = Math.round(staff.salary * 0.10);
        return sum + (gross - deductions);
      }, 0)
    };

    const handleProcessSalaries = () => {
      const monthName = new Date(payrollYear, payrollMonth).toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric'
      });

      const newPayrollRecords = filteredPayrollStaff.map((staff, index) => {
        const basicSalary = Math.round(staff.salary * 0.70);
        const hra = Math.round(staff.salary * 0.15);
        const da = Math.round(staff.salary * 0.10);
        const ta = Math.round(staff.salary * 0.05);
        const gross = staff.salary;
        const pf = Math.round(gross * 0.05);
        const tax = Math.round(gross * 0.03);
        const professionalTax = 200;
        const deductions = pf + tax + professionalTax;
        const netSalary = gross - deductions;

        return {
          id: `sal${salaryRecords.length + index + 1}`,
          staffId: staff.id,
          staffName: staff.name,
          month: monthName,
          basicSalary: basicSalary,
          allowances: hra + da + ta,
          deductions: deductions,
          netSalary: netSalary,
          paymentDate: new Date(payrollYear, payrollMonth + 1, 5).toISOString().split('T')[0],
          status: 'Pending' as 'Pending'
        };
      });

      setSalaryRecords([...salaryRecords, ...newPayrollRecords]);
      showToast(`Payroll processed for ${newPayrollRecords.length} staff members for ${monthName}`, 'success');
      setCurrentView('main');
    };

    const handleGeneratePayslip = (staff: StaffMember) => {
      showToast(`Generating payslip for ${staff.name}...`, 'info');
      setTimeout(() => {
        showToast(`Payslip generated for ${staff.name}`, 'success');
      }, 1000);
    };

    const handleSendPayslip = (staff: StaffMember) => {
      showToast(`Sending payslip to ${staff.email}...`, 'info');
      setTimeout(() => {
        showToast(`Payslip sent to ${staff.name}`, 'success');
      }, 1000);
    };

    const handleGenerateAllPayslips = () => {
      showToast(`Generating payslips for ${filteredPayrollStaff.length} staff members...`, 'info');
      setTimeout(() => {
        showToast(`All payslips generated successfully`, 'success');
      }, 2000);
    };

    const calculateSalaryBreakdown = (staff: StaffMember) => {
      const gross = staff.salary;
      const basicSalary = Math.round(gross * 0.70);
      const hra = Math.round(gross * 0.15);
      const da = Math.round(gross * 0.10);
      const ta = Math.round(gross * 0.05);
      const allowances = hra + da + ta;

      const pf = Math.round(gross * 0.05);
      const tax = Math.round(gross * 0.03);
      const professionalTax = 200;
      const deductions = pf + tax + professionalTax;

      const netSalary = gross - deductions;

      return { basicSalary, allowances, gross, deductions, netSalary, pf, tax, professionalTax, hra, da, ta };
    };

    return (
      <div className="payroll-page-container">
        {/* Header Section */}
        <div className="smgmt-header">
          <button className="back-button" onClick={() => setCurrentView('main')}>
            <i className="fas fa-arrow-left"></i> Back to Staff Management
          </button>
          <div className="header-content-row">
            <div className="header-title-section">
              <h1><i className="fas fa-money-check-alt"></i> Process Payroll</h1>
              <p className="header-subtitle">
                {new Date(payrollYear, payrollMonth).toLocaleDateString('en-IN', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="header-actions">
              <button className="btn-secondary" onClick={() => handleExportData('payroll')}>
                <i className="fas fa-file-excel"></i> Export Report
              </button>
              <button className="btn-primary" onClick={handleProcessSalaries}>
                <i className="fas fa-check-circle"></i> Process Payroll
              </button>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div className="payroll-stats-grid">
          <div className="payroll-stat-card total">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Total Staff</span>
              <span className="stat-value">{payrollStats.totalStaff}</span>
              <span className="stat-sublabel">Active employees</span>
            </div>
          </div>

          <div className="payroll-stat-card salary">
            <div className="stat-icon">
              <i className="fas fa-wallet"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Gross Salary</span>
              <span className="stat-value">{formatCurrency(payrollStats.totalSalary)}</span>
              <span className="stat-sublabel">Total gross amount</span>
            </div>
          </div>

          <div className="payroll-stat-card deduction">
            <div className="stat-icon">
              <i className="fas fa-minus-circle"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Deductions</span>
              <span className="stat-value">{formatCurrency(payrollStats.totalDeductions)}</span>
              <span className="stat-sublabel">Total deductions</span>
            </div>
          </div>

          <div className="payroll-stat-card net">
            <div className="stat-icon">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="stat-details">
              <span className="stat-label">Net Payable</span>
              <span className="stat-value">{formatCurrency(payrollStats.netPayable)}</span>
              <span className="stat-sublabel">Amount to disburse</span>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="payroll-controls-card">
          <div className="controls-row">
            <div className="form-group">
              <label><i className="fas fa-calendar"></i> Select Month</label>
              <select
                value={payrollMonth}
                onChange={(e) => setPayrollMonth(parseInt(e.target.value))}
                className="form-control"
              >
                <option value={0}>January</option>
                <option value={1}>February</option>
                <option value={2}>March</option>
                <option value={3}>April</option>
                <option value={4}>May</option>
                <option value={5}>June</option>
                <option value={6}>July</option>
                <option value={7}>August</option>
                <option value={8}>September</option>
                <option value={9}>October</option>
                <option value={10}>November</option>
                <option value={11}>December</option>
              </select>
            </div>

            <div className="form-group">
              <label><i className="fas fa-calendar-alt"></i> Select Year</label>
              <select
                value={payrollYear}
                onChange={(e) => setPayrollYear(parseInt(e.target.value))}
                className="form-control"
              >
                <option value={2023}>2023</option>
                <option value={2024}>2024</option>
                <option value={2025}>2025</option>
                <option value={2026}>2026</option>
              </select>
            </div>

            <div className="form-group">
              <label><i className="fas fa-filter"></i> Department Filter</label>
              <select
                value={payrollDept}
                onChange={(e) => setPayrollDept(e.target.value)}
                className="form-control"
              >
                <option value="all">All Departments</option>
                <option value="Teaching">Teaching Faculty</option>
                <option value="Support">Support Staff</option>
                <option value="Administration">Administrative Staff</option>
              </select>
            </div>

            <div className="bulk-actions-group">
              <button className="bulk-btn primary" onClick={handleGenerateAllPayslips}>
                <i className="fas fa-file-pdf"></i> Generate All Payslips
              </button>
            </div>
          </div>
        </div>

        {/* Payroll Table */}
        <div className="payroll-table-card">
          <div className="card-header">
            <h3><i className="fas fa-money-check-alt"></i> Staff Salary Details</h3>
            <p>Total: {filteredPayrollStaff.length} staff members</p>
          </div>
          <div className="table-container">
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Staff ID</th>
                  <th>Department</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayrollStaff.map(staff => {
                  const breakdown = calculateSalaryBreakdown(staff);
                  return (
                    <tr key={staff.id}>
                      <td>
                        <div className="staff-info">
                          {renderAvatar(staff)}
                          <div className="staff-details">
                            <span className="staff-name">{staff.name}</span>
                            <span className="staff-role">{staff.role}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="staff-id-badge">{staff.staffId}</span></td>
                      <td><span className="dept-badge">{staff.department}</span></td>
                      <td>
                        <div className="salary-detail">
                          <span className="amount">{formatCurrency(breakdown.basicSalary)}</span>
                          <span className="percentage">70%</span>
                        </div>
                      </td>
                      <td>
                        <div className="salary-detail">
                          <span className="amount">{formatCurrency(breakdown.allowances)}</span>
                          <div className="allowance-breakdown">
                            <span className="mini-label">HRA: {formatCurrency(breakdown.hra)}</span>
                            <span className="mini-label">DA: {formatCurrency(breakdown.da)}</span>
                            <span className="mini-label">TA: {formatCurrency(breakdown.ta)}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="amount-highlight">{formatCurrency(breakdown.gross)}</span></td>
                      <td>
                        <div className="salary-detail">
                          <span className="amount deduction-amount">{formatCurrency(breakdown.deductions)}</span>
                          <div className="deduction-breakdown">
                            <span className="mini-label">PF: {formatCurrency(breakdown.pf)}</span>
                            <span className="mini-label">Tax: {formatCurrency(breakdown.tax)}</span>
                            <span className="mini-label">PT: {formatCurrency(breakdown.professionalTax)}</span>
                          </div>
                        </div>
                      </td>
                      <td><span className="amount-highlight net">{formatCurrency(breakdown.netSalary)}</span></td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="action-btn view"
                            onClick={() => handleViewSalaryDetails(staff)}
                            title="View Details"
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button
                            className="action-btn generate"
                            onClick={() => handleGeneratePayslip(staff)}
                            title="Generate Payslip"
                          >
                            <i className="fas fa-file-pdf"></i>
                          </button>
                          <button
                            className="action-btn send"
                            onClick={() => handleSendPayslip(staff)}
                            title="Send via Email"
                          >
                            <i className="fas fa-envelope"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const stats = calculateStats();
  const filteredStaff = getFilteredStaff();

  // Conditional rendering based on current view
  if (currentView === 'attendance') {
    return (
      <div className="staff-management-page">
        {/* Notification Toast */}
        {showNotification && (
          <div className={`notification-toast ${notificationType}`}>
            <i className={`fas ${notificationType === 'success' ? 'fa-check-circle' : notificationType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            <span>{notificationMessage}</span>
          </div>
        )}
        {renderAttendancePage()}
      </div>
    );
  }

  if (currentView === 'payroll') {
    return (
      <div className="staff-management-page">
        {/* Notification Toast */}
        {showNotification && (
          <div className={`notification-toast ${notificationType}`}>
            <i className={`fas ${notificationType === 'success' ? 'fa-check-circle' : notificationType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
            <span>{notificationMessage}</span>
          </div>
        )}
        {renderPayrollPage()}
      </div>
    );
  }

  return (
    <div className="staff-management-page">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`notification-toast ${notificationType}`}>
          <i className={`fas ${notificationType === 'success' ? 'fa-check-circle' : notificationType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="staff-mgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-users-cog"></i> Faculty & Staff Management</h1>
          <p>Manage faculty, administrative staff, and HR operations for the institution</p>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" onClick={() => handleExportData('staff')}>
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Overview Statistics */}
      <div className="staff-stats-grid">
        <div className="staff-stat-card total">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <span className="stat-label">Total Faculty & Staff</span>
            <span className="stat-value">{stats.totalStaff}</span>
            <span className="stat-sublabel">Across all departments</span>
          </div>
        </div>

        <div className="staff-stat-card teachers">
          <div className="stat-icon">
            <i className="fas fa-chalkboard-teacher"></i>
          </div>
          <div className="stat-details">
            <span className="stat-label">Active Faculty</span>
            <span className="stat-value">{stats.activeTeachers}</span>
            <span className="stat-sublabel">Teaching faculty</span>
          </div>
        </div>

        <div className="staff-stat-card present">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-details">
            <span className="stat-label">Present Today</span>
            <span className="stat-value">{stats.presentToday}</span>
            <span className="stat-sublabel">{stats.attendanceRate}% attendance rate</span>
          </div>
        </div>

        <div className="staff-stat-card leave">
          <div className="stat-icon">
            <i className="fas fa-calendar-times"></i>
          </div>
          <div className="stat-details">
            <span className="stat-label">On Leave Today</span>
            <span className="stat-value">{stats.onLeaveToday}</span>
            <span className="stat-sublabel">{stats.pendingLeaves} pending requests</span>
          </div>
        </div>

        <div className="staff-stat-card salary">
          <div className="stat-icon">
            <i className="fas fa-wallet"></i>
          </div>
          <div className="stat-details">
            <span className="stat-label">Avg Monthly Salary</span>
            <span className="stat-value">{formatCurrency(stats.avgSalary)}</span>
            <span className="stat-sublabel">Per month average</span>
          </div>
        </div>

        <div className="staff-stat-card documents">
          <div className="stat-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-details">
            <span className="stat-label">Document Renewals</span>
            <span className="stat-value">{documents.length}</span>
            <span className="stat-sublabel">Expiring this month</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="staff-quick-actions">
        <button
          className="action-btn"
          onClick={() => setShowAddStaffModal(true)}
        >
          <i className="fas fa-user-plus"></i>
          Add New Staff
        </button>
        <button
          className="action-btn"
          onClick={handleMarkAttendance}
        >
          <i className="fas fa-clipboard-check"></i>
          Mark Attendance
        </button>
        <button
          className="action-btn"
          onClick={handleProcessPayroll}
        >
          <i className="fas fa-money-check-alt"></i>
          Process Payroll
        </button>
        <button
          className="action-btn"
          onClick={() => handleGenerateReport('staff')}
        >
          <i className="fas fa-chart-bar"></i>
          Generate Reports
        </button>
      </div>

      {/* Section Tabs */}
      <div className="tab-navigation-container">
        <div className="section-tabs">
          <button
            className={`tab-btn ${activeSection === 'directory' ? 'active' : ''}`}
            onClick={() => setActiveSection('directory')}
          >
            <i className="fas fa-users"></i>
            Staff Directory
          </button>
          <button
            className={`tab-btn ${activeSection === 'payroll' ? 'active' : ''}`}
            onClick={() => setActiveSection('payroll')}
          >
            <i className="fas fa-money-bill-wave"></i>
            Payroll History
          </button>
          <button
            className={`tab-btn ${activeSection === 'documents' ? 'active' : ''}`}
            onClick={() => setActiveSection('documents')}
          >
            <i className="fas fa-folder-open"></i>
            Documents
          </button>
          <button
            className={`tab-btn ${activeSection === 'training' ? 'active' : ''}`}
            onClick={() => setActiveSection('training')}
          >
            <i className="fas fa-graduation-cap"></i>
            Training
          </button>
          <button
            className={`tab-btn ${activeSection === 'holidays' ? 'active' : ''}`}
            onClick={() => setActiveSection('holidays')}
          >
            <i className="fas fa-calendar-alt"></i>
            Holidays
          </button>
          <button
            className={`tab-btn ${activeSection === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveSection('departments')}
          >
            <i className="fas fa-sitemap"></i>
            Departments
          </button>
        </div>
      </div>

      {/* Tab Content Container */}
      <div className="tab-content-container">
      {/* SECTION 1: STAFF DIRECTORY */}
      {activeSection === 'directory' && (
        <div className="staff-directory-section">
          <div className="section-header">
            <h2>Staff Directory</h2>
            <p>{filteredStaff.length} staff members</p>
          </div>

          {/* Search and Filters */}
          <div className="staff-filters">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by name, faculty ID, department, designation, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
              <option value="all">All Departments</option>
              <option value="Teaching">Teaching Faculty</option>
              <option value="Technical Support">Technical Staff</option>
              <option value="Support Staff">Support Staff</option>
              <option value="Administration">Administrative Staff</option>
            </select>

            <select value={filterEmploymentType} onChange={(e) => setFilterEmploymentType(e.target.value)}>
              <option value="all">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
            </select>

            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Staff Table */}
          <div className="staff-table-container">
            <table className="staff-table">
              <thead>
                <tr>
                  <th>Staff</th>
                  <th>Staff ID</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Subject</th>
                  <th>Contact</th>
                  <th>Joining Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.map((staff) => (
                  <tr key={staff.id}>
                    <td>
                      <div className="staff-info">
                        {renderAvatar(staff)}
                        <div>
                          <div className="staff-name">{staff.name}</div>
                          <div className="staff-type">{staff.employmentType}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="staff-id-badge">{staff.staffId}</span>
                    </td>
                    <td>{staff.role}</td>
                    <td>
                      <span className="department-badge">
                        <i className={`fas ${getDepartmentIcon(staff.department)}`}></i>
                        {staff.department}
                      </span>
                    </td>
                    <td>{staff.subject || '-'}</td>
                    <td>
                      <div className="contact-info">
                        <div><i className="fas fa-envelope"></i> {staff.email}</div>
                        <div><i className="fas fa-phone"></i> {staff.phone}</div>
                      </div>
                    </td>
                    <td>{formatDate(staff.joiningDate)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: `${getStatusColor(staff.status)}20`, color: getStatusColor(staff.status) }}
                      >
                        {staff.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="icon-btn view" onClick={() => handleViewStaff(staff)} title="View Details">
                          <i className="fas fa-eye"></i>
                        </button>
                        <button className="icon-btn edit" onClick={() => handleEditStaff(staff)} title="Edit">
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="icon-btn salary" onClick={() => handleViewSalary(staff)} title="Salary Details">
                          <i className="fas fa-wallet"></i>
                        </button>
                        <button className="icon-btn delete" onClick={() => confirmDeleteStaff(staff)} title="Delete">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: PAYROLL HISTORY */}
      {activeSection === 'payroll' && (
        <div className="payroll-section">
          <div className="section-header">
            <h2>Payroll History</h2>
            <p>{salaryRecords.length} salary records</p>
            <button className="secondary-btn" onClick={() => handleExportData('payroll')}>
              <i className="fas fa-download"></i>
              Export Payroll
            </button>
          </div>

          <div className="payroll-table-container">
            <table className="payroll-table">
              <thead>
                <tr>
                  <th>Staff Name</th>
                  <th>Month</th>
                  <th>Basic Salary</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Salary</th>
                  <th>Payment Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {salaryRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.staffName}</td>
                    <td>{record.month}</td>
                    <td>{formatCurrency(record.basicSalary)}</td>
                    <td className="positive">{formatCurrency(record.allowances)}</td>
                    <td className="negative">-{formatCurrency(record.deductions)}</td>
                    <td className="net-salary">{formatCurrency(record.netSalary)}</td>
                    <td>{formatDate(record.paymentDate)}</td>
                    <td>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: `${getStatusColor(record.status)}20`, color: getStatusColor(record.status) }}
                      >
                        {record.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: DOCUMENTS */}
      {activeSection === 'documents' && (
        <div className="documents-section">
          <div className="section-header">
            <h2>Staff Documents</h2>
            <p>{documents.length} documents | {documents.filter(d => d.status === 'Expiring Soon').length} expiring soon</p>
          </div>

          <div className="documents-grid">
            {documents.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="doc-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <div className="doc-details">
                  <h4>{doc.documentName}</h4>
                  <p className="doc-staff">{doc.staffName}</p>
                  <p className="doc-type">{doc.documentType}</p>
                  <div className="doc-dates">
                    <span><i className="fas fa-upload"></i> {formatDate(doc.uploadDate)}</span>
                    {doc.expiryDate && (
                      <span><i className="fas fa-calendar"></i> Exp: {formatDate(doc.expiryDate)}</span>
                    )}
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: `${getStatusColor(doc.status)}20`, color: getStatusColor(doc.status) }}
                  >
                    {doc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: TRAINING */}
      {activeSection === 'training' && (
        <div className="training-section">
          <div className="section-header">
            <h2>Training & Development</h2>
            <p>{trainings.length} training programs</p>
          </div>

          <div className="training-grid">
            {trainings.map((training) => (
              <div key={training.id} className="training-card">
                <div className="training-header">
                  <h3>{training.title}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: `${getStatusColor(training.status)}20`, color: getStatusColor(training.status) }}
                  >
                    {training.status}
                  </span>
                </div>
                <p className="training-desc">{training.description}</p>
                <div className="training-info">
                  <div className="info-row">
                    <i className="fas fa-calendar"></i>
                    <span>{formatDate(training.date)}</span>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-clock"></i>
                    <span>{training.duration}</span>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-user-tie"></i>
                    <span>Trainer: {training.trainer}</span>
                  </div>
                  <div className="info-row">
                    <i className="fas fa-users"></i>
                    <span>{training.participants.length} participants</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: HOLIDAYS */}
      {activeSection === 'holidays' && (
        <div className="holidays-section">
          <div className="section-header">
            <h2>Holidays Calendar</h2>
            <p>{holidays.length} holidays planned</p>
          </div>

          <div className="holidays-list">
            {holidays.map((holiday) => (
              <div key={holiday.id} className="holiday-card">
                <div className="holiday-date">
                  <span className="date-day">{new Date(holiday.date).getDate()}</span>
                  <span className="date-month">{new Date(holiday.date).toLocaleDateString('en-IN', { month: 'short' })}</span>
                </div>
                <div className="holiday-details">
                  <h4>{holiday.name}</h4>
                  <p>{holiday.description}</p>
                  <span className="holiday-type">{holiday.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 6: DEPARTMENTS OVERVIEW */}
      {activeSection === 'departments' && (
        <div className="departments-section">
          <div className="section-header">
            <h2>Department Overview</h2>
            <p>Staff distribution across departments</p>
          </div>

          <div className="departments-grid">
            <div className="dept-card teaching">
              <div className="dept-icon">
                <i className="fas fa-chalkboard-teacher"></i>
              </div>
              <div className="dept-details">
                <h3>Teaching</h3>
                <div className="dept-count">{stats.teachingStaff}</div>
                <p>Staff Members</p>
                <div className="dept-progress">
                  <div className="progress-bar" style={{ width: `${(stats.teachingStaff / stats.totalStaff) * 100}%` }}></div>
                </div>
                <span className="dept-percentage">{Math.round((stats.teachingStaff / stats.totalStaff) * 100)}% of total</span>
              </div>
            </div>

            <div className="dept-card support">
              <div className="dept-icon">
                <i className="fas fa-hands-helping"></i>
              </div>
              <div className="dept-details">
                <h3>Support</h3>
                <div className="dept-count">{stats.supportStaff}</div>
                <p>Staff Members</p>
                <div className="dept-progress">
                  <div className="progress-bar" style={{ width: `${(stats.supportStaff / stats.totalStaff) * 100}%` }}></div>
                </div>
                <span className="dept-percentage">{Math.round((stats.supportStaff / stats.totalStaff) * 100)}% of total</span>
              </div>
            </div>

            <div className="dept-card admin">
              <div className="dept-icon">
                <i className="fas fa-user-tie"></i>
              </div>
              <div className="dept-details">
                <h3>Administration</h3>
                <div className="dept-count">{stats.adminStaff}</div>
                <p>Staff Members</p>
                <div className="dept-progress">
                  <div className="progress-bar" style={{ width: `${(stats.adminStaff / stats.totalStaff) * 100}%` }}></div>
                </div>
                <span className="dept-percentage">{Math.round((stats.adminStaff / stats.totalStaff) * 100)}% of total</span>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Leave Management Section - Always Visible */}
      <div className="leave-management-section">
        <div className="section-header">
          <h2>Pending Leave Requests</h2>
          <p>{leaveRequests.filter(l => l.status === 'Pending').length} requests awaiting approval</p>
        </div>

        <div className="leave-requests-grid">
          {leaveRequests.filter(l => l.status === 'Pending').map((leave) => (
            <div key={leave.id} className="leave-request-card">
              <div className="leave-header">
                <div>
                  <h3>{leave.staffName}</h3>
                  <p>{leave.role}</p>
                </div>
                <span className={`leave-type-badge ${leave.leaveType.toLowerCase()}`}>
                  {leave.leaveType}
                </span>
              </div>

              <div className="leave-details">
                <div className="leave-info-row">
                  <i className="fas fa-calendar"></i>
                  <span>{formatDate(leave.startDate)} to {formatDate(leave.endDate)}</span>
                </div>
                <div className="leave-info-row">
                  <i className="fas fa-clock"></i>
                  <span>{leave.duration} days</span>
                </div>
                <div className="leave-reason">
                  <strong>Reason:</strong> {leave.reason}
                </div>
              </div>

              <div className="leave-actions">
                <button className="approve-btn" onClick={() => handleLeaveAction(leave, 'approve')}>
                  <i className="fas fa-check"></i>
                  Approve
                </button>
                <button className="reject-btn" onClick={() => handleLeaveAction(leave, 'reject')}>
                  <i className="fas fa-times"></i>
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteConfirm && selectedStaff && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Delete</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="warning-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <p>Are you sure you want to delete <strong>{selectedStaff.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="modal-btn danger" onClick={handleDeleteStaff}>
                <i className="fas fa-trash"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div className="modal-overlay" onClick={() => setShowAddStaffModal(false)}>
          <div className="add-staff-modal large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-user-plus"></i> Add New Faculty/Staff Member</h2>
              <button className="modal-close" onClick={() => setShowAddStaffModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content scrollable-content">
              <form className="staff-form comprehensive-form">

                {/* SECTION 1: PERSONAL INFORMATION */}
                <div className="form-section">
                  <h3 className="section-title"><i className="fas fa-user"></i> Personal Information</h3>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Staff ID (Auto-generated)</label>
                      <input
                        type="text"
                        value={generateStaffId()}
                        disabled
                        style={{ background: '#f3f4f6', cursor: 'not-allowed' }}
                      />
                      <small style={{ color: '#6b7280', fontSize: '13px' }}>Will be auto-generated based on department</small>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        placeholder="Enter full name"
                        value={newStaffForm.name}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Gender</label>
                      <select
                        value={newStaffForm.gender}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, gender: e.target.value })}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Date of Birth</label>
                      <input
                        type="date"
                        value={newStaffForm.dob}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, dob: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Contact Number *</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={newStaffForm.phone}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        placeholder="name@college.edu"
                        value={newStaffForm.email}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Alternate Contact</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43211"
                        value={newStaffForm.alternateContact}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, alternateContact: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Address</label>
                      <textarea
                        placeholder="Enter complete address"
                        value={newStaffForm.address}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, address: e.target.value })}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PROFESSIONAL INFORMATION */}
                <div className="form-section">
                  <h3 className="section-title"><i className="fas fa-briefcase"></i> Professional Information</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Designation *</label>
                      <select
                        value={newStaffForm.role}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                        required
                      >
                        <option value="">Select Designation</option>
                        <option value="Professor">Professor</option>
                        <option value="Associate Professor">Associate Professor</option>
                        <option value="Assistant Professor">Assistant Professor</option>
                        <option value="Lecturer">Lecturer</option>
                        <option value="Lab Technician">Lab Technician</option>
                        <option value="Senior Accountant">Senior Accountant</option>
                        <option value="IT Administrator">IT Administrator</option>
                        <option value="Sports Coordinator">Sports Coordinator</option>
                        <option value="Senior Librarian">Senior Librarian</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Employment Type *</label>
                      <select
                        value={newStaffForm.employmentType}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, employmentType: e.target.value as any })}
                        required
                      >
                        <option value="Full-time">Full-Time</option>
                        <option value="Part-time">Part-Time</option>
                        <option value="Contract">Visiting Faculty</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Department *</label>
                      <select
                        value={newStaffForm.department}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value as any })}
                        required
                      >
                        <option value="Teaching">Teaching Faculty</option>
                        <option value="Support">Technical Staff</option>
                        <option value="Administration">Administrative Staff</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Subject/Specialization</label>
                      <input
                        type="text"
                        placeholder="e.g., Data Structures & Algorithms"
                        value={newStaffForm.subject}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, subject: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Qualification</label>
                      <input
                        type="text"
                        placeholder="e.g., Ph.D Computer Science, M.Tech CSE"
                        value={newStaffForm.qualification}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, qualification: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Experience (years)</label>
                      <input
                        type="number"
                        placeholder="e.g., 5"
                        value={newStaffForm.experience}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, experience: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Joining Date *</label>
                      <input
                        type="date"
                        value={newStaffForm.joiningDate}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, joiningDate: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Role Category *</label>
                      <select
                        value={newStaffForm.roleCategory}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, roleCategory: e.target.value })}
                      >
                        <option value="">Select Category</option>
                        <option value="Teaching Faculty">Teaching Faculty</option>
                        <option value="Technical Staff">Technical Staff</option>
                        <option value="Administrative Staff">Administrative Staff</option>
                        <option value="Support Staff">Support Staff</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: SALARY & BENEFITS */}
                <div className="form-section">
                  <h3 className="section-title"><i className="fas fa-money-bill-wave"></i> Salary & Benefits</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Basic Salary (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g., 60000"
                        value={newStaffForm.basicSalary}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, basicSalary: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Allowances (₹)</label>
                      <input
                        type="number"
                        placeholder="e.g., 15000"
                        value={newStaffForm.allowances}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, allowances: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group full-width">
                      <label>Total Monthly Salary (Calculated)</label>
                      <input
                        type="text"
                        value={`₹${((parseFloat(newStaffForm.basicSalary || '0') + parseFloat(newStaffForm.allowances || '0'))).toLocaleString('en-IN')}`}
                        disabled
                        style={{ background: '#f3f4f6', cursor: 'not-allowed', fontWeight: '600', color: '#10ac8b' }}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Bank Account Number</label>
                      <input
                        type="text"
                        placeholder="Enter bank account number"
                        value={newStaffForm.bankAccount}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, bankAccount: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>IFSC Code</label>
                      <input
                        type="text"
                        placeholder="e.g., SBIN0001234"
                        value={newStaffForm.ifsc}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, ifsc: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>PAN Number</label>
                      <input
                        type="text"
                        placeholder="e.g., ABCDE1234F"
                        value={newStaffForm.pan}
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, pan: e.target.value.toUpperCase() })}
                        maxLength={10}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: DOCUMENTS */}
                <div className="form-section">
                  <h3 className="section-title"><i className="fas fa-file-upload"></i> Documents (Optional)</h3>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Resume/CV Upload</label>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, resume: e.target.files?.[0] || null })}
                      />
                      <small style={{ color: '#6b7280', fontSize: '13px' }}>PDF format only</small>
                    </div>
                    <div className="form-group">
                      <label>ID Proof Upload</label>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setNewStaffForm({ ...newStaffForm, idProof: e.target.files?.[0] || null })}
                      />
                      <small style={{ color: '#6b7280', fontSize: '13px' }}>Aadhar, Passport, etc.</small>
                    </div>
                  </div>
                </div>

              </form>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowAddStaffModal(false)}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleSaveNewStaff}>
                <i className="fas fa-check"></i>
                Save Faculty Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT STAFF MODAL */}
      {showEditStaffModal && selectedStaff && (
        <div className="modal-overlay" onClick={() => setShowEditStaffModal(false)}>
          <div className="add-staff-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Staff Member</h2>
              <button className="modal-close" onClick={() => setShowEditStaffModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <form className="staff-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Staff ID *</label>
                    <input
                      type="text"
                      value={newStaffForm.staffId}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, staffId: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={newStaffForm.name}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Role *</label>
                    <input
                      type="text"
                      value={newStaffForm.role}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Department *</label>
                    <select
                      value={newStaffForm.department}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, department: e.target.value as any })}
                      required
                    >
                      <option value="Teaching">Teaching</option>
                      <option value="Support">Support</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Subject</label>
                    <input
                      type="text"
                      value={newStaffForm.subject}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, subject: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email *</label>
                    <input
                      type="email"
                      value={newStaffForm.email}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Phone *</label>
                    <input
                      type="tel"
                      value={newStaffForm.phone}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Joining Date *</label>
                    <input
                      type="date"
                      value={newStaffForm.joiningDate}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, joiningDate: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Employment Type *</label>
                    <select
                      value={newStaffForm.employmentType}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, employmentType: e.target.value as any })}
                      required
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Monthly Salary *</label>
                    <input
                      type="number"
                      value={newStaffForm.salary}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, salary: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Education</label>
                    <input
                      type="text"
                      value={newStaffForm.education}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, education: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Experience (years)</label>
                    <input
                      type="number"
                      value={newStaffForm.experience}
                      onChange={(e) => setNewStaffForm({ ...newStaffForm, experience: e.target.value })}
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowEditStaffModal(false)}>
                Cancel
              </button>
              <button className="modal-btn primary" onClick={handleUpdateStaff}>
                <i className="fas fa-save"></i>
                Update Staff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MARK ATTENDANCE MODAL */}
      {showAttendanceModal && (
        <div className="modal-overlay" onClick={() => setShowAttendanceModal(false)}>
          <div className="attendance-modal large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2><i className="fas fa-clipboard-check"></i> Mark Attendance</h2>
                <p>{new Date(attendanceDate).toLocaleDateString('en-IN', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <button className="modal-close" onClick={() => setShowAttendanceModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content scrollable-content">
              {/* HEADER SECTION: Date Selector & Filters */}
              <div className="attendance-header">
                <div className="attendance-controls">
                  <div className="form-group">
                    <label><i className="fas fa-calendar"></i> Select Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-filter"></i> Department Filter</label>
                    <select
                      value={attendanceDept}
                      onChange={(e) => setAttendanceDept(e.target.value)}
                    >
                      <option value="all">All Departments</option>
                      <option value="Teaching">Teaching Faculty</option>
                      <option value="Support">Technical Staff</option>
                      <option value="Administration">Administrative Staff</option>
                    </select>
                  </div>
                </div>

                {/* SUMMARY CARDS */}
                <div className="attendance-summary">
                  <div className="summary-card present">
                    <i className="fas fa-check-circle"></i>
                    <div className="summary-info">
                      <div className="summary-count">
                        {Object.values(attendanceRecords).filter(r => r.status === 'Present').length}
                      </div>
                      <div className="summary-label">Present</div>
                    </div>
                  </div>
                  <div className="summary-card absent">
                    <i className="fas fa-times-circle"></i>
                    <div className="summary-info">
                      <div className="summary-count">
                        {Object.values(attendanceRecords).filter(r => r.status === 'Absent').length}
                      </div>
                      <div className="summary-label">Absent</div>
                    </div>
                  </div>
                  <div className="summary-card late">
                    <i className="fas fa-clock"></i>
                    <div className="summary-info">
                      <div className="summary-count">
                        {Object.values(attendanceRecords).filter(r => r.status === 'Late').length}
                      </div>
                      <div className="summary-label">Late</div>
                    </div>
                  </div>
                  <div className="summary-card leave">
                    <i className="fas fa-calendar-times"></i>
                    <div className="summary-info">
                      <div className="summary-count">
                        {Object.values(attendanceRecords).filter(r => r.status === 'On Leave').length}
                      </div>
                      <div className="summary-label">On Leave</div>
                    </div>
                  </div>
                  <div className="summary-card percentage">
                    <i className="fas fa-percentage"></i>
                    <div className="summary-info">
                      <div className="summary-count">
                        {Object.keys(attendanceRecords).length > 0
                          ? Math.round((Object.values(attendanceRecords).filter(r => r.status === 'Present').length / Object.keys(attendanceRecords).length) * 100)
                          : 0}%
                      </div>
                      <div className="summary-label">Attendance Rate</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BULK ACTIONS */}
              <div className="bulk-actions">
                <button
                  className="bulk-btn present"
                  onClick={() => {
                    const newRecords: any = {};
                    staffMembers
                      .filter(s => s.status === 'Active' && (attendanceDept === 'all' || s.department === attendanceDept))
                      .forEach(staff => {
                        newRecords[staff.id] = { status: 'Present', time: '09:00' };
                      });
                    setCurrentAttendance(newRecords);
                    showToast('All staff marked as Present', 'success');
                  }}
                >
                  <i className="fas fa-check-double"></i>
                  Mark All Present
                </button>
                <button
                  className="bulk-btn absent"
                  onClick={() => {
                    const newRecords: any = {};
                    staffMembers
                      .filter(s => s.status === 'Active' && (attendanceDept === 'all' || s.department === attendanceDept))
                      .forEach(staff => {
                        newRecords[staff.id] = { status: 'Absent' };
                      });
                    setCurrentAttendance(newRecords);
                    showToast('All staff marked as Absent', 'success');
                  }}
                >
                  <i className="fas fa-times-circle"></i>
                  Mark All Absent
                </button>
                <button
                  className="bulk-btn clear"
                  onClick={() => {
                    setCurrentAttendance({});
                    showToast('Attendance cleared', 'info');
                  }}
                >
                  <i className="fas fa-eraser"></i>
                  Clear All
                </button>
              </div>

              {/* STAFF ATTENDANCE TABLE */}
              <div className="attendance-table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedStaffForAttendance.length === staffMembers.filter(s => s.status === 'Active' && (attendanceDept === 'all' || s.department === attendanceDept)).length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStaffForAttendance(
                                staffMembers
                                  .filter(s => s.status === 'Active' && (attendanceDept === 'all' || s.department === attendanceDept))
                                  .map(s => s.id)
                              );
                            } else {
                              setSelectedStaffForAttendance([]);
                            }
                          }}
                        />
                      </th>
                      <th>Staff Member</th>
                      <th>Staff ID</th>
                      <th>Department</th>
                      <th>Attendance Status</th>
                      <th>Check-in Time</th>
                      <th>Notes/Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers
                      .filter(s => s.status === 'Active' && (attendanceDept === 'all' || s.department === attendanceDept))
                      .map((staff) => (
                        <tr key={staff.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={selectedStaffForAttendance.includes(staff.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedStaffForAttendance([...selectedStaffForAttendance, staff.id]);
                                } else {
                                  setSelectedStaffForAttendance(selectedStaffForAttendance.filter(id => id !== staff.id));
                                }
                              }}
                            />
                          </td>
                          <td>
                            <div className="staff-info-cell">
                              {renderAvatar(staff, 'small')}
                              <div>
                                <div className="staff-name-cell">{staff.name}</div>
                                <div className="staff-role-cell">{staff.role}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className="staff-id-badge">{staff.staffId}</span></td>
                          <td>{staff.department}</td>
                          <td>
                            <div className="attendance-status-btns">
                              <button
                                className={`status-btn present ${currentAttendance[staff.id]?.status === 'Present' ? 'active' : ''}`}
                                onClick={() => setCurrentAttendance({...attendanceRecords, [staff.id]: {status: 'Present', time: '09:00'}})}
                                title="Present"
                              >
                                <i className="fas fa-check"></i>
                              </button>
                              <button
                                className={`status-btn absent ${currentAttendance[staff.id]?.status === 'Absent' ? 'active' : ''}`}
                                onClick={() => setCurrentAttendance({...attendanceRecords, [staff.id]: {status: 'Absent'}})}
                                title="Absent"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                              <button
                                className={`status-btn late ${currentAttendance[staff.id]?.status === 'Late' ? 'active' : ''}`}
                                onClick={() => setCurrentAttendance({...attendanceRecords, [staff.id]: {status: 'Late', time: '10:00'}})}
                                title="Late"
                              >
                                <i className="fas fa-clock"></i>
                              </button>
                              <button
                                className={`status-btn leave ${currentAttendance[staff.id]?.status === 'On Leave' ? 'active' : ''}`}
                                onClick={() => setCurrentAttendance({...attendanceRecords, [staff.id]: {status: 'On Leave'}})}
                                title="On Leave"
                              >
                                <i className="fas fa-calendar-times"></i>
                              </button>
                            </div>
                          </td>
                          <td>
                            {(currentAttendance[staff.id]?.status === 'Present' || currentAttendance[staff.id]?.status === 'Late') && (
                              <input
                                type="time"
                                className="time-input"
                                value={currentAttendance[staff.id]?.time || '09:00'}
                                onChange={(e) => setCurrentAttendance({
                                  ...attendanceRecords,
                                  [staff.id]: {...currentAttendance[staff.id], time: e.target.value}
                                })}
                              />
                            )}
                          </td>
                          <td>
                            <input
                              type="text"
                              className="notes-input"
                              placeholder="Add notes..."
                              value={currentAttendance[staff.id]?.notes || ''}
                              onChange={(e) => setCurrentAttendance({
                                ...attendanceRecords,
                                [staff.id]: {...(currentAttendance[staff.id] || {status: 'Present'}), notes: e.target.value}
                              })}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowAttendanceModal(false)}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={() => {
                  const presentCount = Object.values(attendanceRecords).filter(r => r.status === 'Present').length;
                  const absentCount = Object.values(attendanceRecords).filter(r => r.status === 'Absent').length;
                  const lateCount = Object.values(attendanceRecords).filter(r => r.status === 'Late').length;

                  setShowAttendanceModal(false);
                  showToast(`Attendance saved for ${attendanceDate}. ${presentCount} Present, ${absentCount} Absent, ${lateCount} Late`, 'success');
                  setCurrentAttendance({});
                }}
              >
                <i className="fas fa-save"></i>
                Save Attendance
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROCESS PAYROLL MODAL */}
      {showPayrollModal && (
        <div className="modal-overlay" onClick={() => setShowPayrollModal(false)}>
          <div className="payroll-process-modal large-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2><i className="fas fa-money-check-alt"></i> Process Payroll</h2>
                <p>Month: {new Date(payrollYear, payrollMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</p>
              </div>
              <button className="modal-close" onClick={() => setShowPayrollModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content scrollable-content">
              {/* SELECTION SECTION */}
              <div className="payroll-header">
                <div className="payroll-controls">
                  <div className="form-group">
                    <label><i className="fas fa-calendar"></i> Select Month</label>
                    <select
                      value={payrollMonth}
                      onChange={(e) => setPayrollMonth(parseInt(e.target.value))}
                    >
                      {Array.from({length: 12}, (_, i) => (
                        <option key={i} value={i}>
                          {new Date(2024, i).toLocaleDateString('en-IN', { month: 'long' })}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-calendar-alt"></i> Select Year</label>
                    <select
                      value={payrollYear}
                      onChange={(e) => setPayrollYear(parseInt(e.target.value))}
                    >
                      <option value={2023}>2023</option>
                      <option value={2024}>2024</option>
                      <option value={2025}>2025</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label><i className="fas fa-filter"></i> Department Filter</label>
                    <select
                      value={payrollDept}
                      onChange={(e) => setPayrollDept(e.target.value)}
                    >
                      <option value="all">All Departments</option>
                      <option value="Teaching">Teaching Faculty</option>
                      <option value="Support">Technical Staff</option>
                      <option value="Administration">Administrative Staff</option>
                    </select>
                  </div>
                </div>

                {/* PAYROLL SUMMARY CARDS */}
                <div className="payroll-summary-cards">
                  <div className="payroll-card total">
                    <i className="fas fa-users"></i>
                    <div className="card-info">
                      <div className="card-count">
                        {staffMembers.filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept)).length}
                      </div>
                      <div className="card-label">Total Staff</div>
                    </div>
                  </div>
                  <div className="payroll-card salary">
                    <i className="fas fa-wallet"></i>
                    <div className="card-info">
                      <div className="card-count">
                        {formatCurrency(staffMembers.filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept)).reduce((sum, s) => sum + s.salary, 0))}
                      </div>
                      <div className="card-label">Total Salary</div>
                    </div>
                  </div>
                  <div className="payroll-card deduction">
                    <i className="fas fa-minus-circle"></i>
                    <div className="card-info">
                      <div className="card-count">
                        {formatCurrency(staffMembers.filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept)).reduce((sum, s) => sum + (s.salary * 0.1), 0))}
                      </div>
                      <div className="card-label">Deductions</div>
                    </div>
                  </div>
                  <div className="payroll-card net">
                    <i className="fas fa-money-bill-wave"></i>
                    <div className="card-info">
                      <div className="card-count">
                        {formatCurrency(staffMembers.filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept)).reduce((sum, s) => sum + (s.salary * 0.9), 0))}
                      </div>
                      <div className="card-label">Net Payable</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* BULK ACTIONS */}
              <div className="bulk-actions">
                <button
                  className="bulk-btn primary"
                  onClick={() => {
                    showToast('Generating salary slips for all staff...', 'info');
                    setTimeout(() => showToast('All salary slips generated successfully!', 'success'), 1500);
                  }}
                >
                  <i className="fas fa-file-pdf"></i>
                  Generate All Salary Slips
                </button>
                <button
                  className="bulk-btn success"
                  onClick={() => {
                    showToast('Marked all as processed', 'success');
                  }}
                >
                  <i className="fas fa-check-circle"></i>
                  Mark as Processed
                </button>
                <button
                  className="bulk-btn secondary"
                  onClick={() => {
                    showToast('Exporting payroll data to Excel...', 'info');
                    setTimeout(() => showToast('Payroll data exported successfully!', 'success'), 1000);
                  }}
                >
                  <i className="fas fa-file-excel"></i>
                  Export to Excel
                </button>
              </div>

              {/* STAFF SALARY TABLE */}
              <div className="payroll-table-container">
                <table className="payroll-table">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          checked={selectedStaffForPayroll.length === staffMembers.filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept)).length}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedStaffForPayroll(
                                staffMembers
                                  .filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept))
                                  .map(s => s.id)
                              );
                            } else {
                              setSelectedStaffForPayroll([]);
                            }
                          }}
                        />
                      </th>
                      <th>Staff Name</th>
                      <th>Staff ID</th>
                      <th>Department</th>
                      <th>Basic Salary</th>
                      <th>Allowances</th>
                      <th>Gross</th>
                      <th>Deductions</th>
                      <th>Net Salary</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {staffMembers
                      .filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept))
                      .map((staff) => {
                        const basicSalary = staff.salary * 0.7;
                        const allowances = staff.salary * 0.3;
                        const gross = staff.salary;
                        const deductions = gross * 0.1;
                        const netSalary = gross - deductions;

                        return (
                          <tr key={staff.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedStaffForPayroll.includes(staff.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedStaffForPayroll([...selectedStaffForPayroll, staff.id]);
                                  } else {
                                    setSelectedStaffForPayroll(selectedStaffForPayroll.filter(id => id !== staff.id));
                                  }
                                }}
                              />
                            </td>
                            <td>
                              <div className="staff-info-cell">
                                {renderAvatar(staff, 'small')}
                                <div>
                                  <div className="staff-name-cell">{staff.name}</div>
                                  <div className="staff-role-cell">{staff.role}</div>
                                </div>
                              </div>
                            </td>
                            <td><span className="staff-id-badge">{staff.staffId}</span></td>
                            <td>{staff.department}</td>
                            <td>{formatCurrency(basicSalary)}</td>
                            <td>{formatCurrency(allowances)}</td>
                            <td><strong>{formatCurrency(gross)}</strong></td>
                            <td className="deduction-cell">{formatCurrency(deductions)}</td>
                            <td className="net-salary-cell"><strong>{formatCurrency(netSalary)}</strong></td>
                            <td>
                              <span className="status-badge pending">Pending</span>
                            </td>
                            <td>
                              <div className="action-btns">
                                <button
                                  className="action-btn view"
                                  title="View Details"
                                  onClick={() => showToast(`Viewing salary details for ${staff.name}`, 'info')}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                                <button
                                  className="action-btn pdf"
                                  title="Generate Slip"
                                  onClick={() => showToast(`Generating salary slip for ${staff.name}`, 'success')}
                                >
                                  <i className="fas fa-file-pdf"></i>
                                </button>
                                <button
                                  className="action-btn email"
                                  title="Send Email"
                                  onClick={() => showToast(`Salary slip sent to ${staff.email}`, 'success')}
                                >
                                  <i className="fas fa-envelope"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowPayrollModal(false)}>
                <i className="fas fa-times"></i>
                Cancel
              </button>
              <button
                className="modal-btn primary"
                onClick={() => {
                  const staffCount = staffMembers.filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept)).length;
                  const totalAmount = staffMembers
                    .filter(s => s.status === 'Active' && (payrollDept === 'all' || s.department === payrollDept))
                    .reduce((sum, s) => sum + (s.salary * 0.9), 0);

                  setShowPayrollModal(false);
                  showToast(`Payroll processed for ${new Date(payrollYear, payrollMonth).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}. ${staffCount} salary slips generated. Total: ${formatCurrency(totalAmount)}`, 'success');
                }}
              >
                <i className="fas fa-check-circle"></i>
                Process Payroll
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STAFF DETAIL MODAL */}
      {selectedStaff && !showSalaryModal && !showEditStaffModal && !showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setSelectedStaff(null)}>
          <div className="staff-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedStaff.name}</h2>
                <p>{selectedStaff.role}</p>
              </div>
              <button className="modal-close" onClick={() => setSelectedStaff(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="staff-profile-section">
                <div className="profile-photo-large">{selectedStaff.photo}</div>
                <div className="profile-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Staff ID</label>
                      <span>{selectedStaff.staffId}</span>
                    </div>
                    <div className="info-item">
                      <label>Department</label>
                      <span>{selectedStaff.department}</span>
                    </div>
                    <div className="info-item">
                      <label>Subject</label>
                      <span>{selectedStaff.subject || 'N/A'}</span>
                    </div>
                    <div className="info-item">
                      <label>Employment Type</label>
                      <span>{selectedStaff.employmentType}</span>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <span>{selectedStaff.email}</span>
                    </div>
                    <div className="info-item">
                      <label>Phone</label>
                      <span>{selectedStaff.phone}</span>
                    </div>
                    <div className="info-item">
                      <label>Joining Date</label>
                      <span>{formatDate(selectedStaff.joiningDate)}</span>
                    </div>
                    <div className="info-item">
                      <label>Status</label>
                      <span
                        className="status-badge"
                        style={{ backgroundColor: `${getStatusColor(selectedStaff.status)}20`, color: getStatusColor(selectedStaff.status) }}
                      >
                        {selectedStaff.status}
                      </span>
                    </div>
                  </div>

                  {selectedStaff.leaveBalance && (
                    <div className="leave-balance-section">
                      <h4>Leave Balance</h4>
                      <div className="leave-balance-grid">
                        <div className="balance-item">
                          <span className="balance-label">Casual</span>
                          <span className="balance-value">{selectedStaff.leaveBalance.casual} days</span>
                        </div>
                        <div className="balance-item">
                          <span className="balance-label">Sick</span>
                          <span className="balance-value">{selectedStaff.leaveBalance.sick} days</span>
                        </div>
                        <div className="balance-item">
                          <span className="balance-label">Vacation</span>
                          <span className="balance-value">{selectedStaff.leaveBalance.vacation} days</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedStaff.classes && selectedStaff.classes.length > 0 && (
                    <div className="classes-section">
                      <h4>Classes</h4>
                      <div className="classes-tags">
                        {selectedStaff.classes.map((cls, index) => (
                          <span key={index} className="class-tag">{cls}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setSelectedStaff(null)}>
                Close
              </button>
              <button className="modal-btn primary" onClick={() => handleEditStaff(selectedStaff)}>
                <i className="fas fa-edit"></i>
                Edit Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SALARY DETAILS MODAL */}
      {showSalaryModal && selectedStaff && (
        <div className="modal-overlay" onClick={() => { setShowSalaryModal(false); setSelectedStaff(null); }}>
          <div className="salary-detail-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Salary Details</h2>
                <p>{selectedStaff.name}</p>
              </div>
              <button className="modal-close" onClick={() => { setShowSalaryModal(false); setSelectedStaff(null); }}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="salary-breakdown">
                <div className="salary-item">
                  <span className="salary-label">Basic Salary</span>
                  <span className="salary-value">{formatCurrency(selectedStaff.salary)}</span>
                </div>
                <div className="salary-item positive">
                  <span className="salary-label">Allowances (15%)</span>
                  <span className="salary-value">+ {formatCurrency(Math.round(selectedStaff.salary * 0.15))}</span>
                </div>
                <div className="salary-item negative">
                  <span className="salary-label">Deductions (8%)</span>
                  <span className="salary-value">- {formatCurrency(Math.round(selectedStaff.salary * 0.08))}</span>
                </div>
                <div className="salary-item total">
                  <span className="salary-label">Net Salary</span>
                  <span className="salary-value">
                    {formatCurrency(selectedStaff.salary + Math.round(selectedStaff.salary * 0.15) - Math.round(selectedStaff.salary * 0.08))}
                  </span>
                </div>
              </div>

              <div className="payment-info">
                <h4>Payment Information</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Pay Frequency</label>
                    <span>Monthly</span>
                  </div>
                  <div className="info-item">
                    <label>Payment Method</label>
                    <span>Bank Transfer</span>
                  </div>
                  <div className="info-item">
                    <label>Last Payment</label>
                    <span>{formatDate(new Date().toISOString())}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => { setShowSalaryModal(false); setSelectedStaff(null); }}>
                Close
              </button>
              <button className="modal-btn primary" onClick={() => showToast('Salary slip downloaded', 'success')}>
                <i className="fas fa-download"></i>
                Download Salary Slip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE REPORTS MODAL */}
      {showReportModal && (
        <div className="modal-overlay" onClick={() => setShowReportModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Generate Reports</h2>
              <button className="modal-close" onClick={() => setShowReportModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              <div className="report-types">
                <div className="report-type-card" onClick={() => handleExportData('staff')}>
                  <i className="fas fa-users"></i>
                  <h4>Staff Directory</h4>
                  <p>Export complete staff listing</p>
                </div>
                <div className="report-type-card" onClick={() => handleExportData('attendance')}>
                  <i className="fas fa-clipboard-check"></i>
                  <h4>Attendance Report</h4>
                  <p>Export attendance records</p>
                </div>
                <div className="report-type-card" onClick={() => handleExportData('payroll')}>
                  <i className="fas fa-money-bill-wave"></i>
                  <h4>Payroll Report</h4>
                  <p>Export salary records</p>
                </div>
                <div className="report-type-card" onClick={() => handleExportData('leaves')}>
                  <i className="fas fa-calendar-times"></i>
                  <h4>Leave Report</h4>
                  <p>Export leave requests</p>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="modal-btn secondary" onClick={() => setShowReportModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagement;
