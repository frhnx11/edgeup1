import React, { useState } from 'react';

// TypeScript Interfaces
interface Student {
  id: string;
  enrollmentNumber: string;
  admissionNumber: string;
  name: string;
  photo: string;
  department: string;
  year: number;
  semester: number;
  program: string;
  batch: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  email: string;
  phone: string;
  admissionDate: string;
  status: 'Active' | 'On Leave' | 'Graduated' | 'Dropped Out';
  cgpa: number;
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  hostel: string;
  previousCollege?: string;
  medicalConditions?: string;
}

interface EnrollmentApplication {
  id: string;
  applicationNumber: string;
  studentName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  programApplied: string;
  entranceExam: string;
  examScore: string;
  applicationDate: string;
  counselingDate?: string;
  documentStatus: 'Complete' | 'Pending' | 'Incomplete';
  status: 'Pending' | 'Under Review' | 'Provisionally Admitted' | 'Admitted' | 'Rejected' | 'Waitlisted';
  guardianName: string;
  guardianEmail: string;
  guardianPhone: string;
  remarks?: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  semester: number;
  date: string;
  status: 'Present' | 'Absent' | 'Late' | 'On Leave';
  checkIn?: string;
  lecturesAttended: string;
  totalLectures: number;
  markedBy: string;
  remarks?: string;
  notifiedGuardian: boolean;
}

interface AcademicRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  semester: number;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  creditsEarned: number;
  totalCredits: number;
  gradeObtained: string;
  rank?: number;
  backlogs: number;
  attendance: number;
  remarks?: string;
}

interface SubjectGrade {
  subject: string;
  marksObtained: number;
  totalMarks: number;
  grade: string;
  teacher: string;
  remarks?: string;
}

interface DisciplinaryRecord {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  semester: number;
  incidentDate: string;
  incidentType: 'Late to Class' | 'Attendance Shortage' | 'Academic Misconduct' | 'Ragging Complaint' | 'Hostel Rule Violation' | 'Lab Safety Violation' | 'Library Fine' | 'Disciplinary Action' | 'Other';
  severity: 'Minor' | 'Moderate' | 'Serious';
  description: string;
  actionTaken: string;
  reportedBy: string;
  guardianNotified: boolean;
  resolutionDate?: string;
  status: 'Resolved' | 'Pending' | 'Under Investigation';
}

interface TransferRequest {
  id: string;
  studentId: string;
  studentName: string;
  enrollmentNumber: string;
  department: string;
  year: number;
  semester: number;
  requestType: 'Transfer Out' | 'Transfer In' | 'Department Change' | 'Withdrawal' | 'Leave of Absence';
  requestDate: string;
  reason: string;
  destinationInstitution?: string;
  sourceInstitution?: string;
  tcStatus: 'Pending' | 'Issued' | 'Not Applicable';
  tcNumber?: string;
  clearanceStatus: {
    library: boolean;
    hostel: boolean;
    fees: boolean;
  };
  status: 'Requested' | 'Under Review' | 'Approved' | 'Rejected' | 'Completed';
  approvedBy?: string;
}

const StudentManagement = () => {
  // Tab Navigation State
  const [activeTab, setActiveTab] = useState<'directory' | 'enrollment' | 'attendance' | 'performance' | 'disciplinary' | 'transfers'>('directory');

  // Modal States
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [showEditStudentModal, setShowEditStudentModal] = useState(false);
  const [showViewStudentModal, setShowViewStudentModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddAdmissionModal, setShowAddAdmissionModal] = useState(false);
  const [showAddIncidentModal, setShowAddIncidentModal] = useState(false);
  const [showAddTransferModal, setShowAddTransferModal] = useState(false);
  const [showContactParentModal, setShowContactParentModal] = useState(false);

  // Selection States
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterYear, setFilterYear] = useState('all');
  const [filterSemester, setFilterSemester] = useState('all');
  const [filterProgram, setFilterProgram] = useState('all');
  const [filterBatch, setFilterBatch] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterAccommodation, setFilterAccommodation] = useState('all');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTerm, setSelectedTerm] = useState<'Term 1' | 'Term 2' | 'Term 3' | 'Final'>('Term 1');

  // Sorting State
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Notification State
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'info'>('success');

  // Three-dots Menu State
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Form States
  const [newStudentForm, setNewStudentForm] = useState({
    enrollmentNumber: '', admissionNumber: '', name: '', dateOfBirth: '',
    gender: 'Male', bloodGroup: '', department: '', year: '1', semester: '1',
    program: 'B.Tech', batch: '', address: '', email: '', phone: '',
    admissionDate: '', guardianName: '', guardianEmail: '', guardianPhone: '',
    hostel: 'Day Scholar', cgpa: '0.0'
  });

  const [newAdmissionForm, setNewAdmissionForm] = useState({
    applicationNumber: '', studentName: '', dateOfBirth: '', gender: 'Male',
    gradeAppliedFor: '', parentName: '', parentEmail: '', parentPhone: '',
    interviewDate: '', priority: 'Medium'
  });

  // Mock Data - Students
  const [students, setStudents] = useState<Student[]>([
    {
      id: 'st1', enrollmentNumber: 'CS2021045', admissionNumber: 'ADM2021045', name: 'Aarav Sharma',
      photo: '👦', department: 'Computer Science Engineering', year: 4, semester: 7, program: 'B.Tech', batch: '2021-2025',
      dateOfBirth: '2003-05-15', gender: 'Male', bloodGroup: 'O+', address: '123 MG Road, Bangalore',
      email: 'aarav.sharma@college.edu', phone: '+91 98765 43210', admissionDate: '2021-08-01', status: 'Active',
      cgpa: 8.7, guardianName: 'Rajesh Sharma', guardianEmail: 'rajesh.sharma@email.com',
      guardianPhone: '+91 98765 43211', hostel: 'Hostel A-Block Room 204'
    },
    {
      id: 'st2', enrollmentNumber: 'ME2022012', admissionNumber: 'ADM2022012', name: 'Priya Patel',
      photo: '👧', department: 'Mechanical Engineering', year: 3, semester: 5, program: 'B.Tech', batch: '2022-2026',
      dateOfBirth: '2004-08-22', gender: 'Female', bloodGroup: 'A+', address: '456 Park Street, Mumbai',
      email: 'priya.patel@college.edu', phone: '+91 98765 43212', admissionDate: '2022-08-01', status: 'Active',
      cgpa: 9.1, guardianName: 'Amit Patel', guardianEmail: 'amit.patel@email.com',
      guardianPhone: '+91 98765 43213', hostel: 'Day Scholar'
    },
    {
      id: 'st3', enrollmentNumber: 'EE2021089', admissionNumber: 'ADM2021089', name: 'Rohan Singh',
      photo: '👦', department: 'Electrical Engineering', year: 4, semester: 8, program: 'B.Tech', batch: '2021-2025',
      dateOfBirth: '2003-03-10', gender: 'Male', bloodGroup: 'B+', address: '789 Jubilee Hills, Hyderabad',
      email: 'rohan.singh@college.edu', phone: '+91 98765 43214', admissionDate: '2021-08-01', status: 'Active',
      cgpa: 7.9, guardianName: 'Harpreet Singh', guardianEmail: 'harpreet.singh@email.com',
      guardianPhone: '+91 98765 43215', hostel: 'Hostel B-Block Room 315'
    },
    {
      id: 'st4', enrollmentNumber: 'IT2023034', admissionNumber: 'ADM2023034', name: 'Ananya Desai',
      photo: '👧', department: 'Information Technology', year: 2, semester: 3, program: 'B.Tech', batch: '2023-2027',
      dateOfBirth: '2005-11-05', gender: 'Female', bloodGroup: 'AB+', address: '321 Civil Lines, Delhi',
      email: 'ananya.desai@college.edu', phone: '+91 98765 43216', admissionDate: '2023-08-01', status: 'Active',
      cgpa: 8.5, guardianName: 'Suresh Desai', guardianEmail: 'suresh.desai@email.com',
      guardianPhone: '+91 98765 43217', hostel: 'Hostel C-Block Room 128'
    },
    {
      id: 'st5', enrollmentNumber: 'CE2022067', admissionNumber: 'ADM2022067', name: 'Vikram Reddy',
      photo: '👦', department: 'Civil Engineering', year: 3, semester: 6, program: 'B.Tech', batch: '2022-2026',
      dateOfBirth: '2004-06-18', gender: 'Male', bloodGroup: 'O-', address: '654 Sector 12, Chandigarh',
      email: 'vikram.reddy@college.edu', phone: '+91 98765 43218', admissionDate: '2022-08-01', status: 'Active',
      cgpa: 8.2, guardianName: 'Krishna Reddy', guardianEmail: 'krishna.reddy@email.com',
      guardianPhone: '+91 98765 43219', hostel: 'Day Scholar'
    },
    {
      id: 'st6', enrollmentNumber: 'CS2021078', admissionNumber: 'ADM2021078', name: 'Ishita Kumar',
      photo: '👧', department: 'Computer Science Engineering', year: 4, semester: 7, program: 'B.Tech', batch: '2021-2025',
      dateOfBirth: '2003-09-25', gender: 'Female', bloodGroup: 'A-', address: '987 Salt Lake, Kolkata',
      email: 'ishita.kumar@college.edu', phone: '+91 98765 43220', admissionDate: '2021-08-01', status: 'Active',
      cgpa: 9.3, guardianName: 'Rakesh Kumar', guardianEmail: 'rakesh.kumar@email.com',
      guardianPhone: '+91 98765 43221', hostel: 'Hostel A-Block Room 305'
    },
    {
      id: 'st7', enrollmentNumber: 'EC2023021', admissionNumber: 'ADM2023021', name: 'Arjun Mehta',
      photo: '👦', department: 'Electronics Engineering', year: 2, semester: 4, program: 'B.Tech', batch: '2023-2027',
      dateOfBirth: '2005-07-30', gender: 'Male', bloodGroup: 'B-', address: '111 Green Park, Delhi',
      email: 'arjun.mehta@college.edu', phone: '+91 98765 43222', admissionDate: '2023-08-01', status: 'Active',
      cgpa: 8.8, guardianName: 'Rahul Mehta', guardianEmail: 'rahul.mehta@email.com',
      guardianPhone: '+91 98765 43223', hostel: 'Hostel B-Block Room 212'
    },
    {
      id: 'st8', enrollmentNumber: 'ME2022098', admissionNumber: 'ADM2022098', name: 'Kavya Iyer',
      photo: '👧', department: 'Mechanical Engineering', year: 3, semester: 5, program: 'B.Tech', batch: '2022-2026',
      dateOfBirth: '2004-12-15', gender: 'Female', bloodGroup: 'O+', address: '222 Anna Nagar, Chennai',
      email: 'kavya.iyer@college.edu', phone: '+91 98765 43224', admissionDate: '2022-08-01', status: 'Active',
      cgpa: 7.6, guardianName: 'Harish Iyer', guardianEmail: 'harish.iyer@email.com',
      guardianPhone: '+91 98765 43225', hostel: 'Day Scholar'
    }
  ]);

  // Mock Data - Enrollment Applications
  const [applications, setApplications] = useState<EnrollmentApplication[]>([
    {
      id: 'app1', applicationNumber: 'APP2024101', studentName: 'Rahul Gupta',
      dateOfBirth: '2006-04-12', gender: 'Male', programApplied: 'B.Tech - Computer Science',
      entranceExam: 'JEE Main', examScore: '95.6 percentile', applicationDate: '2024-10-15',
      counselingDate: '2024-10-25', documentStatus: 'Complete', status: 'Admitted',
      guardianName: 'Sanjay Gupta', guardianEmail: 'sanjay.gupta@email.com',
      guardianPhone: '+91 98765 43220'
    },
    {
      id: 'app2', applicationNumber: 'APP2024102', studentName: 'Meera Shah',
      dateOfBirth: '2006-07-08', gender: 'Female', programApplied: 'B.Tech - Electronics',
      entranceExam: 'State Entrance', examScore: 'Rank 1245', applicationDate: '2024-10-18',
      counselingDate: '2024-10-30', documentStatus: 'Pending', status: 'Under Review',
      guardianName: 'Kiran Shah', guardianEmail: 'kiran.shah@email.com',
      guardianPhone: '+91 98765 43221'
    },
    {
      id: 'app3', applicationNumber: 'APP2024103', studentName: 'Aditya Joshi',
      dateOfBirth: '2006-12-20', gender: 'Male', programApplied: 'B.Tech - Mechanical Engineering',
      entranceExam: 'JEE Advanced', examScore: '92.3 percentile', applicationDate: '2024-10-20',
      counselingDate: '2024-10-28', documentStatus: 'Complete', status: 'Provisionally Admitted',
      guardianName: 'Manish Joshi', guardianEmail: 'manish.joshi@email.com',
      guardianPhone: '+91 98765 43222'
    },
    {
      id: 'app4', applicationNumber: 'APP2024104', studentName: 'Sneha Iyer',
      dateOfBirth: '2006-02-14', gender: 'Female', programApplied: 'B.Tech - Civil Engineering',
      entranceExam: 'JEE Main', examScore: '88.5 percentile', applicationDate: '2024-10-22',
      documentStatus: 'Incomplete', status: 'Rejected',
      guardianName: 'Krishnan Iyer', guardianEmail: 'krishnan.iyer@email.com',
      guardianPhone: '+91 98765 43223', remarks: 'Incomplete documentation'
    },
    {
      id: 'app5', applicationNumber: 'APP2024105', studentName: 'Karan Patel',
      dateOfBirth: '2001-09-18', gender: 'Male', programApplied: 'M.Tech - Data Science',
      entranceExam: 'GATE', examScore: '720/1000', applicationDate: '2024-10-12',
      counselingDate: '2024-10-26', documentStatus: 'Complete', status: 'Waitlisted',
      guardianName: 'Deepak Patel', guardianEmail: 'deepak.patel@email.com',
      guardianPhone: '+91 98765 43224'
    }
  ]);

  // Mock Data - Attendance Records (includes today's records)
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    // Today's attendance (2025-11-06)
    {
      id: 'att-today-1', studentId: 'st1', studentName: 'Aarav Sharma', enrollmentNumber: 'CS2021045',
      department: 'Computer Science Engineering', year: 4, semester: 7, date: '2025-11-06',
      status: 'Present', checkIn: '09:15 AM', lecturesAttended: '5/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true
    },
    {
      id: 'att-today-2', studentId: 'st2', studentName: 'Priya Patel', enrollmentNumber: 'ME2022012',
      department: 'Mechanical Engineering', year: 3, semester: 5, date: '2025-11-06',
      status: 'Present', checkIn: '09:20 AM', lecturesAttended: '6/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true
    },
    {
      id: 'att-today-3', studentId: 'st3', studentName: 'Rohan Singh', enrollmentNumber: 'EE2021089',
      department: 'Electrical Engineering', year: 4, semester: 8, date: '2025-11-06',
      status: 'Absent', lecturesAttended: '0/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true,
      remarks: 'Absent - Not marked present'
    },
    {
      id: 'att-today-4', studentId: 'st4', studentName: 'Ananya Desai', enrollmentNumber: 'IT2023034',
      department: 'Information Technology', year: 2, semester: 3, date: '2025-11-06',
      status: 'Late', checkIn: '10:15 AM', lecturesAttended: '4/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true,
      remarks: 'Arrived late, missed first 2 lectures'
    },
    {
      id: 'att-today-5', studentId: 'st5', studentName: 'Vikram Reddy', enrollmentNumber: 'CE2022067',
      department: 'Civil Engineering', year: 3, semester: 6, date: '2025-11-06',
      status: 'On Leave', lecturesAttended: '0/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true,
      remarks: 'Approved leave'
    },
    {
      id: 'att-today-6', studentId: 'st6', studentName: 'Ishita Kumar', enrollmentNumber: 'CS2021078',
      department: 'Computer Science Engineering', year: 4, semester: 7, date: '2025-11-06',
      status: 'Present', checkIn: '09:10 AM', lecturesAttended: '6/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true
    },
    {
      id: 'att-today-7', studentId: 'st7', studentName: 'Arjun Mehta', enrollmentNumber: 'EC2023021',
      department: 'Electronics Engineering', year: 2, semester: 4, date: '2025-11-06',
      status: 'Present', checkIn: '09:25 AM', lecturesAttended: '6/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true
    },
    {
      id: 'att-today-8', studentId: 'st8', studentName: 'Kavya Iyer', enrollmentNumber: 'ME2022098',
      department: 'Mechanical Engineering', year: 3, semester: 5, date: '2025-11-06',
      status: 'Present', checkIn: '09:18 AM', lecturesAttended: '5/6', totalLectures: 6,
      markedBy: 'System', notifiedGuardian: true
    },
    // Yesterday's attendance (2025-11-05)
    {
      id: 'att1', studentId: 'st1', studentName: 'Aarav Sharma', enrollmentNumber: 'CS2021045',
      department: 'Computer Science', year: 4, semester: 7, date: '2025-11-05',
      status: 'Present', checkIn: '09:15', lecturesAttended: '5/6', totalLectures: 6,
      markedBy: 'Department Faculty', notifiedGuardian: false
    },
    {
      id: 'att2', studentId: 'st2', studentName: 'Priya Patel', enrollmentNumber: 'ME2022012',
      department: 'Mechanical Engineering', year: 3, semester: 5, date: '2025-11-05',
      status: 'Present', checkIn: '09:20', lecturesAttended: '6/6', totalLectures: 6,
      markedBy: 'Department Faculty', notifiedGuardian: false
    },
    {
      id: 'att3', studentId: 'st3', studentName: 'Rohan Singh', enrollmentNumber: 'EE2021089',
      department: 'Electrical Engineering', year: 4, semester: 8, date: '2025-11-05',
      status: 'Absent', lecturesAttended: '0/6', totalLectures: 6,
      markedBy: 'Department Faculty', notifiedGuardian: true,
      remarks: 'Guardian informed - medical leave'
    },
    {
      id: 'att4', studentId: 'st4', studentName: 'Ananya Desai', enrollmentNumber: 'IT2023034',
      department: 'Information Technology', year: 2, semester: 3, date: '2025-11-05',
      status: 'Late', checkIn: '10:15', lecturesAttended: '4/6', totalLectures: 6,
      markedBy: 'Department Faculty', notifiedGuardian: false,
      remarks: 'Arrived late, missed first 2 lectures'
    },
    {
      id: 'att5', studentId: 'st5', studentName: 'Vikram Reddy', enrollmentNumber: 'CE2022067',
      department: 'Civil Engineering', year: 3, semester: 6, date: '2025-11-05',
      status: 'On Leave', lecturesAttended: '0/6', totalLectures: 6,
      markedBy: 'Department Faculty', notifiedGuardian: true,
      remarks: 'Approved leave for family emergency'
    },
    {
      id: 'att6', studentId: 'st6', studentName: 'Ishita Kumar', enrollmentNumber: 'CS2021078',
      department: 'Computer Science', year: 4, semester: 7, date: '2025-11-05',
      status: 'Present', checkIn: '09:10', lecturesAttended: '6/6', totalLectures: 6,
      markedBy: 'Department Faculty', notifiedGuardian: false
    }
  ]);

  // Mock Data - Academic Records
  const [academicRecords, setAcademicRecords] = useState<AcademicRecord[]>([
    {
      id: 'ac1', studentId: 'st1', studentName: 'Aarav Sharma', enrollmentNumber: 'CS2021045',
      department: 'Computer Science', year: 4, semester: 7, academicYear: '2024-25',
      sgpa: 8.5, cgpa: 8.7, creditsEarned: 22, totalCredits: 24,
      gradeObtained: 'A', rank: 2, backlogs: 0, attendance: 95
    },
    {
      id: 'ac2', studentId: 'st2', studentName: 'Priya Patel', enrollmentNumber: 'ME2022012',
      department: 'Mechanical Engineering', year: 3, semester: 5, academicYear: '2024-25',
      sgpa: 9.3, cgpa: 9.1, creditsEarned: 24, totalCredits: 24,
      gradeObtained: 'O', rank: 1, backlogs: 0, attendance: 98
    },
    {
      id: 'ac3', studentId: 'st3', studentName: 'Rohan Singh', enrollmentNumber: 'EE2021089',
      department: 'Electrical Engineering', year: 4, semester: 8, academicYear: '2024-25',
      sgpa: 7.8, cgpa: 7.9, creditsEarned: 20, totalCredits: 24,
      gradeObtained: 'B+', rank: 5, backlogs: 1, attendance: 89
    },
    {
      id: 'ac4', studentId: 'st4', studentName: 'Ananya Desai', enrollmentNumber: 'IT2023034',
      department: 'Information Technology', year: 2, semester: 3, academicYear: '2024-25',
      sgpa: 8.7, cgpa: 8.5, creditsEarned: 22, totalCredits: 22,
      gradeObtained: 'A', rank: 3, backlogs: 0, attendance: 94
    },
    {
      id: 'ac5', studentId: 'st5', studentName: 'Vikram Reddy', enrollmentNumber: 'CE2022067',
      department: 'Civil Engineering', year: 3, semester: 6, academicYear: '2024-25',
      sgpa: 8.0, cgpa: 8.2, creditsEarned: 23, totalCredits: 24,
      gradeObtained: 'A', rank: 4, backlogs: 0, attendance: 92
    },
    {
      id: 'ac6', studentId: 'st6', studentName: 'Ishita Kumar', enrollmentNumber: 'CS2021078',
      department: 'Computer Science', year: 4, semester: 7, academicYear: '2024-25',
      sgpa: 9.5, cgpa: 9.3, creditsEarned: 24, totalCredits: 24,
      gradeObtained: 'O', rank: 1, backlogs: 0, attendance: 97
    },
    {
      id: 'ac7', studentId: 'st7', studentName: 'Arjun Mehta', enrollmentNumber: 'EC2023021',
      department: 'Electronics Engineering', year: 2, semester: 4, academicYear: '2024-25',
      sgpa: 8.9, cgpa: 8.8, creditsEarned: 22, totalCredits: 22,
      gradeObtained: 'A', rank: 2, backlogs: 0, attendance: 96
    },
    {
      id: 'ac8', studentId: 'st8', studentName: 'Kavya Iyer', enrollmentNumber: 'ME2022098',
      department: 'Mechanical Engineering', year: 3, semester: 5, academicYear: '2024-25',
      sgpa: 7.4, cgpa: 7.6, creditsEarned: 21, totalCredits: 24,
      gradeObtained: 'B', rank: 8, backlogs: 1, attendance: 88
    }
  ]);

  // Mock Data - Disciplinary Records
  const [disciplinaryRecords, setDisciplinaryRecords] = useState<DisciplinaryRecord[]>([
    {
      id: 'dis1', studentId: 'st9', studentName: 'Arjun Reddy', enrollmentNumber: 'CS2021023',
      department: 'Computer Science', year: 4, semester: 7, incidentDate: '2024-10-20',
      incidentType: 'Attendance Shortage', severity: 'Moderate',
      description: 'Attendance below 75% threshold - 68% attendance in current semester',
      actionTaken: 'Warning letter issued, parents notified', reportedBy: 'HOD - Computer Science',
      guardianNotified: true, resolutionDate: '2024-10-25', status: 'Resolved'
    },
    {
      id: 'dis2', studentId: 'st10', studentName: 'Kabir Singh', enrollmentNumber: 'ME2022045',
      department: 'Mechanical Engineering', year: 3, semester: 5, incidentDate: '2024-10-22',
      incidentType: 'Lab Safety Violation', severity: 'Minor',
      description: 'Failed to follow safety protocols in workshop',
      actionTaken: 'Written warning, lab access suspended for 1 week',
      reportedBy: 'Lab Instructor', guardianNotified: false,
      resolutionDate: '2024-10-28', status: 'Resolved'
    },
    {
      id: 'dis3', studentId: 'st11', studentName: 'Ishita Verma', enrollmentNumber: 'EE2023004',
      department: 'Electrical Engineering', year: 2, semester: 3, incidentDate: '2024-10-18',
      incidentType: 'Academic Misconduct', severity: 'Serious',
      description: 'Found using unauthorized materials during examination',
      actionTaken: 'Disciplinary committee hearing scheduled, interim suspension',
      reportedBy: 'Examination Controller', guardianNotified: true, status: 'Pending'
    },
    {
      id: 'dis4', studentId: 'st12', studentName: 'Rahul Kumar', enrollmentNumber: 'IT2022067',
      department: 'Information Technology', year: 3, semester: 5, incidentDate: '2024-10-15',
      incidentType: 'Hostel Rule Violation', severity: 'Minor',
      description: 'Late return to hostel after curfew hours',
      actionTaken: 'Fine of ₹500, verbal warning',
      reportedBy: 'Hostel Warden', guardianNotified: false,
      resolutionDate: '2024-10-16', status: 'Resolved'
    },
    {
      id: 'dis5', studentId: 'st13', studentName: 'Priya Desai', enrollmentNumber: 'CE2021089',
      department: 'Civil Engineering', year: 4, semester: 7, incidentDate: '2024-10-25',
      incidentType: 'Library Fine', severity: 'Minor',
      description: 'Overdue library books - 30 days past due date',
      actionTaken: '₹300 fine for overdue books',
      reportedBy: 'Chief Librarian', guardianNotified: false,
      resolutionDate: '2024-10-26', status: 'Resolved'
    }
  ]);

  // Mock Data - Transfer Requests
  const [transferRequests, setTransferRequests] = useState<TransferRequest[]>([
    {
      id: 'tr1', studentId: 'st1', studentName: 'Aarav Sharma', enrollmentNumber: 'CS2021045',
      department: 'Computer Science', year: 4, semester: 7, requestType: 'Transfer Out',
      requestDate: '2024-10-15', reason: 'Better placement opportunity at IIT Delhi',
      destinationInstitution: 'IIT Delhi', tcStatus: 'Pending',
      clearanceStatus: { library: true, hostel: true, fees: false },
      status: 'Requested'
    },
    {
      id: 'tr2', studentId: 'st14', studentName: 'Ananya Kumar', enrollmentNumber: 'ME2022006',
      department: 'Mechanical Engineering', year: 3, semester: 5, requestType: 'Withdrawal',
      requestDate: '2024-10-18', reason: 'Pursuing higher studies abroad',
      destinationInstitution: 'University of Toronto', tcStatus: 'Issued', tcNumber: 'TC2024001',
      clearanceStatus: { library: true, hostel: true, fees: true },
      status: 'Approved', approvedBy: 'Principal'
    },
    {
      id: 'tr3', studentId: 'st15', studentName: 'Vikram Patel', enrollmentNumber: 'EE2023012',
      department: 'Electrical Engineering', year: 2, semester: 3, requestType: 'Department Change',
      requestDate: '2024-10-20', reason: 'Interest in Computer Science',
      destinationInstitution: 'Internal (CS Dept)', tcStatus: 'Not Applicable',
      clearanceStatus: { library: false, hostel: false, fees: false },
      status: 'Under Review'
    },
    {
      id: 'tr4', studentId: 'st16', studentName: 'Priya Reddy', enrollmentNumber: 'IT2021089',
      department: 'Information Technology', year: 4, semester: 8, requestType: 'Leave of Absence',
      requestDate: '2024-10-22', reason: 'Medical reasons',
      tcStatus: 'Not Applicable',
      clearanceStatus: { library: false, hostel: false, fees: false },
      status: 'Approved', approvedBy: 'Dean'
    },
    {
      id: 'tr5', studentId: 'st17', studentName: 'Rohan Singh', enrollmentNumber: 'CE2022034',
      department: 'Civil Engineering', year: 3, semester: 6, requestType: 'Transfer In',
      requestDate: '2024-10-10', reason: 'Transfer from XYZ College',
      sourceInstitution: 'XYZ Engineering College', tcStatus: 'Not Applicable',
      clearanceStatus: { library: true, hostel: true, fees: true },
      status: 'Completed', approvedBy: 'Registrar'
    }
  ]);

  // Utility Functions
  const showToast = (message: string, type: 'success' | 'error' | 'info') => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  // Calculate Statistics
  const calculateStats = (dataToCalculate: Student[] = students) => {
    const totalStudents = dataToCalculate.length;
    const activeStudents = dataToCalculate.filter(s => s.status === 'Active').length;

    // Calculate average attendance from academic records
    const attendanceRate = dataToCalculate.length > 0
      ? Math.round(
          dataToCalculate.reduce((sum, student) => {
            // Get most recent attendance from academic records
            const studentAttendance = academicRecords
              .filter(r => r.studentId === student.id)
              .sort((a, b) => b.semester - a.semester)[0]?.attendance || 0;
            return sum + studentAttendance;
          }, 0) / dataToCalculate.length
        )
      : 0;

    const studentsOnCampus = dataToCalculate.filter(s => s.hostel !== 'Day Scholar').length;
    const pendingApplications = applications.filter(a => a.status === 'Pending' || a.status === 'Under Review').length;

    const activePercentage = totalStudents > 0
      ? Math.round((activeStudents / totalStudents) * 100)
      : 0;

    return {
      totalStudents,
      activeStudents,
      activePercentage,
      attendanceRate,
      studentsOnCampus,
      pendingApplications
    };
  };

  // Row Selection
  const handleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedRows.length === getFilteredData().length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(getFilteredData().map((item: any) => item.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedRows([]);
  };

  // Row Expansion
  const toggleRowExpansion = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // Sorting
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Filter and Sort Data
  const getFilteredData = () => {
    let filtered: any[] = [];

    switch (activeTab) {
      case 'directory':
        filtered = students.filter(student => {
          const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              student.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              student.guardianName.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesDepartment = filterDepartment === 'all' || student.department === filterDepartment;
          const matchesYear = filterYear === 'all' || student.year.toString() === filterYear;
          const matchesProgram = filterProgram === 'all' || student.program === filterProgram;
          const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
          const matchesAccommodation = filterAccommodation === 'all' ||
                                      (filterAccommodation === 'hostel' && !student.hostel.includes('Day')) ||
                                      (filterAccommodation === 'day-scholar' && student.hostel.includes('Day'));
          return matchesSearch && matchesDepartment && matchesYear && matchesProgram && matchesStatus && matchesAccommodation;
        });
        break;
      case 'enrollment':
        filtered = applications.filter(app => {
          const matchesSearch = app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              app.applicationNumber.includes(searchQuery);
          const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
          return matchesSearch && matchesStatus;
        });
        break;
      case 'attendance':
        // Filter by date first
        filtered = attendanceRecords.filter(r => r.date === attendanceDate);

        // Apply additional filters for attendance
        filtered = filtered.filter(record => {
          const matchesSearch =
            record.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            record.enrollmentNumber.toLowerCase().includes(searchQuery.toLowerCase());
          const matchesDepartment = filterDepartment === 'all' || record.department === filterDepartment;
          const matchesYear = filterYear === 'all' || record.year.toString() === filterYear;
          const matchesSemester = filterSemester === 'all' || record.semester.toString() === filterSemester;
          return matchesSearch && matchesDepartment && matchesYear && matchesSemester;
        });
        break;
      case 'performance':
        // Show all academic records - college system doesn't filter by term
        filtered = academicRecords;
        break;
      case 'disciplinary':
        filtered = disciplinaryRecords;
        break;
      case 'transfers':
        filtered = transferRequests;
        break;
    }

    // Apply sorting
    if (sortColumn && filtered.length > 0) {
      filtered.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  // Pagination
  const getPaginatedData = () => {
    const filtered = getFilteredData();
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filtered.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(getFilteredData().length / rowsPerPage);
  };

  // CRUD Operations - Students
  const handleAddStudent = () => {
    if (!newStudentForm.name || !newStudentForm.enrollmentNumber || !newStudentForm.department) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const newStudent: Student = {
      id: `st${students.length + 1}`,
      enrollmentNumber: newStudentForm.enrollmentNumber,
      admissionNumber: newStudentForm.admissionNumber,
      name: newStudentForm.name,
      photo: newStudentForm.gender === 'Male' ? '👦' : '👧',
      department: newStudentForm.department,
      year: parseInt(newStudentForm.year),
      semester: parseInt(newStudentForm.semester),
      program: newStudentForm.program,
      batch: newStudentForm.batch,
      dateOfBirth: newStudentForm.dateOfBirth,
      gender: newStudentForm.gender as 'Male' | 'Female' | 'Other',
      bloodGroup: newStudentForm.bloodGroup,
      address: newStudentForm.address,
      email: newStudentForm.email,
      phone: newStudentForm.phone,
      admissionDate: newStudentForm.admissionDate,
      status: 'Active',
      cgpa: parseFloat(newStudentForm.cgpa),
      guardianName: newStudentForm.guardianName,
      guardianEmail: newStudentForm.guardianEmail,
      guardianPhone: newStudentForm.guardianPhone,
      hostel: newStudentForm.hostel
    };

    setStudents([...students, newStudent]);
    setShowAddStudentModal(false);
    showToast(`${newStudent.name} added successfully!`, 'success');
    setNewStudentForm({
      enrollmentNumber: '', admissionNumber: '', name: '', dateOfBirth: '',
      gender: 'Male', bloodGroup: '', department: '', year: '1', semester: '1',
      program: 'B.Tech', batch: '', address: '', email: '', phone: '',
      admissionDate: '', guardianName: '', guardianEmail: '', guardianPhone: '',
      hostel: 'Day Scholar', cgpa: '0.0'
    });
  };

  const handleEditStudent = (student: Student) => {
    setSelectedStudent(student);
    setNewStudentForm({
      enrollmentNumber: student.enrollmentNumber,
      admissionNumber: student.admissionNumber,
      name: student.name,
      dateOfBirth: student.dateOfBirth,
      gender: student.gender,
      bloodGroup: student.bloodGroup,
      department: student.department,
      year: student.year.toString(),
      semester: student.semester.toString(),
      program: student.program,
      batch: student.batch,
      address: student.address,
      email: student.email,
      phone: student.phone,
      admissionDate: student.admissionDate,
      guardianName: student.guardianName,
      guardianEmail: student.guardianEmail,
      guardianPhone: student.guardianPhone,
      hostel: student.hostel,
      cgpa: student.cgpa.toString()
    });
    setShowEditStudentModal(true);
  };

  const handleUpdateStudent = () => {
    if (!selectedStudent) return;

    const updatedStudents = students.map(student =>
      student.id === selectedStudent.id
        ? {
            ...student,
            enrollmentNumber: newStudentForm.enrollmentNumber,
            admissionNumber: newStudentForm.admissionNumber,
            name: newStudentForm.name,
            dateOfBirth: newStudentForm.dateOfBirth,
            gender: newStudentForm.gender as 'Male' | 'Female' | 'Other',
            bloodGroup: newStudentForm.bloodGroup,
            department: newStudentForm.department,
            year: parseInt(newStudentForm.year),
            semester: parseInt(newStudentForm.semester),
            program: newStudentForm.program,
            batch: newStudentForm.batch,
            address: newStudentForm.address,
            email: newStudentForm.email,
            phone: newStudentForm.phone,
            admissionDate: newStudentForm.admissionDate,
            cgpa: parseFloat(newStudentForm.cgpa),
            guardianName: newStudentForm.guardianName,
            guardianEmail: newStudentForm.guardianEmail,
            guardianPhone: newStudentForm.guardianPhone,
            hostel: newStudentForm.hostel
          }
        : student
    );

    setStudents(updatedStudents);
    setShowEditStudentModal(false);
    setSelectedStudent(null);
    showToast('Student details updated successfully!', 'success');
  };

  const handleDeleteStudent = () => {
    if (!selectedStudent) return;

    setStudents(students.filter(student => student.id !== selectedStudent.id));
    setShowDeleteConfirm(false);
    setSelectedStudent(null);
    showToast('Student removed successfully', 'success');
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowViewStudentModal(true);
  };

  const handleContactParent = (student: Student) => {
    setSelectedStudent(student);
    setShowContactParentModal(true);
  };

  // Three-dots Menu Handlers
  const handleMenuToggle = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleMenuAction = (action: string, item: any) => {
    switch (action) {
      case 'view':
        if ('studentId' in item) {
          // For records that reference students
          const student = students.find(s => s.id === item.studentId);
          if (student) handleViewStudent(student);
        } else {
          handleViewStudent(item);
        }
        break;
      case 'edit':
        if ('studentId' in item) {
          const student = students.find(s => s.id === item.studentId);
          if (student) handleEditStudent(student);
        } else {
          handleEditStudent(item);
        }
        break;
      case 'contact':
        if ('studentId' in item) {
          const student = students.find(s => s.id === item.studentId);
          if (student) handleContactParent(student);
        } else {
          handleContactParent(item);
        }
        break;
      case 'delete':
        if ('studentId' in item) {
          const student = students.find(s => s.id === item.studentId);
          if (student) {
            setSelectedStudent(student);
            setShowDeleteConfirm(true);
          }
        } else {
          setSelectedStudent(item);
          setShowDeleteConfirm(true);
        }
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

  // Bulk Actions
  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) {
      showToast('Please select at least one row', 'error');
      return;
    }

    switch (action) {
      case 'markPresent':
        showToast(`Marked ${selectedRows.length} students as present`, 'success');
        handleClearSelection();
        break;
      case 'markAbsent':
        showToast(`Marked ${selectedRows.length} students as absent`, 'success');
        handleClearSelection();
        break;
      case 'messageParents':
        showToast(`Sending message to ${selectedRows.length} parents`, 'info');
        handleClearSelection();
        break;
      case 'export':
        handleExportData('selected');
        handleClearSelection();
        break;
      case 'generateReports':
        showToast(`Generating reports for ${selectedRows.length} students`, 'info');
        handleClearSelection();
        break;
    }
  };

  // Export Function
  const handleExportData = (type: string) => {
    let data: any[] = [];
    let filename = '';

    switch (type) {
      case 'selected':
        data = students.filter(s => selectedRows.includes(s.id));
        filename = 'selected_students.csv';
        break;
      case 'students':
        data = getFilteredData();
        filename = 'students.csv';
        break;
      case 'applications':
        data = applications;
        filename = 'applications.csv';
        break;
      case 'attendance':
        data = attendanceRecords;
        filename = 'attendance.csv';
        break;
      case 'performance':
        data = academicRecords;
        filename = 'academic_records.csv';
        break;
      case 'disciplinary':
        data = disciplinaryRecords;
        filename = 'disciplinary_records.csv';
        break;
      case 'transfers':
        data = transferRequests;
        filename = 'transfer_requests.csv';
        break;
      default:
        return;
    }

    if (data.length > 0) {
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(item => Object.values(item).join(',')).join('\n');
      const csv = `${headers}\n${rows}`;

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

  // Add Admission
  const handleAddAdmission = () => {
    if (!newAdmissionForm.studentName || !newAdmissionForm.parentName || !newAdmissionForm.gradeAppliedFor) {
      showToast('Please fill all required fields', 'error');
      return;
    }

    const newApplication: EnrollmentApplication = {
      id: `app${applications.length + 1}`,
      applicationNumber: newAdmissionForm.applicationNumber || `APP2024${100 + applications.length + 1}`,
      studentName: newAdmissionForm.studentName,
      dateOfBirth: newAdmissionForm.dateOfBirth,
      gender: newAdmissionForm.gender as 'Male' | 'Female' | 'Other',
      gradeAppliedFor: newAdmissionForm.gradeAppliedFor,
      parentName: newAdmissionForm.parentName,
      parentEmail: newAdmissionForm.parentEmail,
      parentPhone: newAdmissionForm.parentPhone,
      applicationDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      documentsSubmitted: false,
      interviewDate: newAdmissionForm.interviewDate,
      priority: newAdmissionForm.priority as 'High' | 'Medium' | 'Low'
    };

    setApplications([...applications, newApplication]);
    setShowAddAdmissionModal(false);
    showToast(`Application for ${newApplication.studentName} submitted successfully!`, 'success');
    setNewAdmissionForm({
      applicationNumber: '', studentName: '', dateOfBirth: '', gender: 'Male',
      gradeAppliedFor: '', parentName: '', parentEmail: '', parentPhone: '',
      interviewDate: '', priority: 'Medium'
    });
  };

  // Calculate stats from filtered data when in directory tab
  const filteredData = getFilteredData();
  const stats = calculateStats(
    activeTab === 'directory' ? filteredData as Student[] : students
  );
  const paginatedData = getPaginatedData();
  const totalPages = getTotalPages();

  return (
    <div className="student-mgmt-new">
      {/* Notification Toast */}
      {showNotification && (
        <div className={`notification-toast ${notificationType}`}>
          <i className={`fas ${notificationType === 'success' ? 'fa-check-circle' : notificationType === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
          <span>{notificationMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-user-graduate"></i> College Student Management</h1>
          <p>Comprehensive student information and academic tracking system</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => setShowAddStudentModal(true)}>
            <i className="fas fa-user-plus"></i>
            Add Student
          </button>
          <button className="btn-secondary" onClick={() => handleExportData('students')}>
            <i className="fas fa-download"></i>
            Export
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="smgmt-stats">
        <div className="stat-card blue">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.totalStudents}</h3>
            <p>Total Enrolled Students</p>
            <span className="stat-trend">Across all departments</span>
          </div>
        </div>
        <div className="stat-card green">
          <div className="stat-icon">
            <i className="fas fa-user-check"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.activeStudents}</h3>
            <p>Active Students</p>
            <span className="stat-trend">{stats.activePercentage}% currently attending</span>
          </div>
        </div>
        <div className="stat-card purple">
          <div className="stat-icon">
            <i className="fas fa-clipboard-check"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.attendanceRate}%</h3>
            <p>Overall Attendance Rate</p>
            <span className="stat-trend">This month's average</span>
          </div>
        </div>
        <div className="stat-card orange">
          <div className="stat-icon">
            <i className="fas fa-building"></i>
          </div>
          <div className="stat-details">
            <h3>{stats.studentsOnCampus}</h3>
            <p>Students on Campus</p>
            <span className="stat-trend">Hostel residents</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="smgmt-filters">
        <div className="search-box">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search by name, enrollment number, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="all">All Departments</option>
          <option value="Computer Science Engineering">Computer Science</option>
          <option value="Electronics Engineering">Electronics</option>
          <option value="Mechanical Engineering">Mechanical</option>
          <option value="Civil Engineering">Civil</option>
          <option value="Electrical Engineering">Electrical</option>
          <option value="Information Technology">IT</option>
        </select>
        <select value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
          <option value="all">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
        <select value={filterProgram} onChange={(e) => setFilterProgram(e.target.value)}>
          <option value="all">All Programs</option>
          <option value="B.Tech">B.Tech</option>
          <option value="B.Sc">B.Sc</option>
          <option value="M.Tech">M.Tech</option>
          <option value="MBA">MBA</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="On Leave">On Leave</option>
          <option value="Graduated">Graduated</option>
          <option value="Dropped Out">Dropped Out</option>
        </select>
        <select value={filterAccommodation} onChange={(e) => setFilterAccommodation(e.target.value)}>
          <option value="all">All</option>
          <option value="hostel">Hostel</option>
          <option value="day-scholar">Day Scholar</option>
        </select>
        {activeTab === 'attendance' && (
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
          />
        )}
        {activeTab === 'performance' && (
          <select value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value as any)}>
            <option value="Term 1">Term 1</option>
            <option value="Term 2">Term 2</option>
            <option value="Term 3">Term 3</option>
            <option value="Final">Final</option>
          </select>
        )}
        <div className="bulk-actions-dropdown">
          <button className="btn-bulk">
            <i className="fas fa-tasks"></i>
            Bulk Actions
            <i className="fas fa-chevron-down"></i>
          </button>
          <div className="bulk-dropdown-menu">
            <button onClick={() => handleBulkAction('sendEmail')}>
              <i className="fas fa-envelope"></i>
              Send Email Notification
            </button>
            <button onClick={() => handleBulkAction('generateIDCards')}>
              <i className="fas fa-id-card"></i>
              Generate ID Cards
            </button>
            <button onClick={() => handleBulkAction('markAttendance')}>
              <i className="fas fa-check"></i>
              Mark Attendance
            </button>
            <button onClick={() => handleBulkAction('issueBonafide')}>
              <i className="fas fa-certificate"></i>
              Issue Bonafide Certificates
            </button>
            <button onClick={() => handleBulkAction('updateSemester')}>
              <i className="fas fa-sync"></i>
              Update Semester
            </button>
            <button onClick={() => handleBulkAction('generateProgressReports')}>
              <i className="fas fa-chart-line"></i>
              Generate Progress Reports
            </button>
            <button onClick={() => handleBulkAction('export')}>
              <i className="fas fa-download"></i>
              Export to Excel
            </button>
            <button onClick={() => handleBulkAction('printHallTickets')}>
              <i className="fas fa-print"></i>
              Print Hall Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="smgmt-tabs">
        <button
          className={`tab-btn ${activeTab === 'directory' ? 'active' : ''}`}
          onClick={() => { setActiveTab('directory'); setCurrentPage(1); }}
        >
          <i className="fas fa-address-book"></i>
          Directory
        </button>
        <button
          className={`tab-btn ${activeTab === 'enrollment' ? 'active' : ''}`}
          onClick={() => { setActiveTab('enrollment'); setCurrentPage(1); }}
        >
          <i className="fas fa-user-graduate"></i>
          Enrollment
        </button>
        <button
          className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`}
          onClick={() => { setActiveTab('attendance'); setCurrentPage(1); }}
        >
          <i className="fas fa-clipboard-check"></i>
          Attendance
        </button>
        <button
          className={`tab-btn ${activeTab === 'performance' ? 'active' : ''}`}
          onClick={() => { setActiveTab('performance'); setCurrentPage(1); }}
        >
          <i className="fas fa-chart-line"></i>
          Performance
        </button>
        <button
          className={`tab-btn ${activeTab === 'disciplinary' ? 'active' : ''}`}
          onClick={() => { setActiveTab('disciplinary'); setCurrentPage(1); }}
        >
          <i className="fas fa-exclamation-triangle"></i>
          Disciplinary
        </button>
        <button
          className={`tab-btn ${activeTab === 'transfers' ? 'active' : ''}`}
          onClick={() => { setActiveTab('transfers'); setCurrentPage(1); }}
        >
          <i className="fas fa-exchange-alt"></i>
          Transfers
        </button>
      </div>

      {/* Table Container */}
      <div className="smgmt-table-container">
        {/* DIRECTORY TAB */}
        {activeTab === 'directory' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === paginatedData.length && paginatedData.length > 0}
                    onChange={handleSelectAll}
                  />
                </th>
                <th onClick={() => handleSort('name')}>
                  Name
                  {sortColumn === 'name' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('enrollmentNumber')}>
                  Enrollment Number
                  {sortColumn === 'enrollmentNumber' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('department')}>
                  Department
                  {sortColumn === 'department' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('year')}>
                  Year & Semester
                  {sortColumn === 'year' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('program')}>
                  Program
                  {sortColumn === 'program' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('cgpa')}>
                  CGPA
                  {sortColumn === 'cgpa' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('guardianName')}>
                  Guardian Contact
                  {sortColumn === 'guardianName' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('hostel')}>
                  Hostel
                  {sortColumn === 'hostel' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th onClick={() => handleSort('status')}>
                  Status
                  {sortColumn === 'status' && <i className={`fas fa-sort-${sortDirection === 'asc' ? 'up' : 'down'}`}></i>}
                </th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((student: Student) => (
                <React.Fragment key={student.id}>
                  <tr className={`${selectedRows.includes(student.id) ? 'selected' : ''} ${expandedRow === student.id ? 'expanded' : ''}`}>
                    <td className="checkbox-col">
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(student.id)}
                        onChange={() => handleSelectRow(student.id)}
                      />
                    </td>
                    <td className="name-col" onClick={() => toggleRowExpansion(student.id)}>
                      <strong>{student.name}</strong>
                    </td>
                    <td>{student.enrollmentNumber}</td>
                    <td>{student.department}</td>
                    <td>{student.year}{['st', 'nd', 'rd', 'th'][Math.min(student.year - 1, 3)]} Year - Sem {student.semester}</td>
                    <td>{student.program}</td>
                    <td><strong>{student.cgpa.toFixed(1)}</strong></td>
                    <td>{student.guardianName}</td>
                    <td>{student.hostel.includes('Day') ? 'Day Scholar' : 'Hostel'}</td>
                    <td>
                      <span className={`status-badge-table ${student.status.toLowerCase().replace(' ', '-')}`}>
                        {student.status}
                      </span>
                    </td>
                    <td className="actions-col">
                      <div className="three-dots-menu-container">
                        <button
                          className="three-dots-btn"
                          onClick={() => handleMenuToggle(student.id)}
                          title="Actions"
                        >
                          <i className="fas fa-ellipsis-h"></i>
                        </button>
                        {openMenuId === student.id && (
                          <div className="actions-popup-menu">
                            <button className="menu-item" onClick={() => handleMenuAction('view', student)}>
                              View
                            </button>
                            <button className="menu-item" onClick={() => handleMenuAction('edit', student)}>
                              Edit
                            </button>
                            <button className="menu-item" onClick={() => handleMenuAction('contact', student)}>
                              Contact Guardian
                            </button>
                            <button className="menu-item delete" onClick={() => handleMenuAction('delete', student)}>
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                  {expandedRow === student.id && (
                    <tr className="expanded-row">
                      <td colSpan={11}>
                        <div className="expanded-content">
                          <div className="expanded-grid">
                            <div className="expanded-item">
                              <label>Admission Number:</label>
                              <span>{student.admissionNumber}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Batch:</label>
                              <span>{student.batch}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Date of Birth:</label>
                              <span>{formatDate(student.dateOfBirth)}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Blood Group:</label>
                              <span>{student.bloodGroup}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Student Email:</label>
                              <span>{student.email}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Student Phone:</label>
                              <span>{student.phone}</span>
                            </div>
                            <div className="expanded-item full">
                              <label>Address:</label>
                              <span>{student.address}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Guardian Email:</label>
                              <span>{student.guardianEmail}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Guardian Phone:</label>
                              <span>{student.guardianPhone}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Hostel/Accommodation:</label>
                              <span>{student.hostel}</span>
                            </div>
                            <div className="expanded-item">
                              <label>Admission Date:</label>
                              <span>{formatDate(student.admissionDate)}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}

        {/* ENROLLMENT TAB */}
        {activeTab === 'enrollment' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input type="checkbox" checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} onChange={handleSelectAll} />
                </th>
                <th onClick={() => handleSort('studentName')}>Name</th>
                <th onClick={() => handleSort('applicationNumber')}>Application Number</th>
                <th onClick={() => handleSort('programApplied')}>Program Applied</th>
                <th onClick={() => handleSort('entranceExam')}>Entrance Exam</th>
                <th onClick={() => handleSort('examScore')}>Exam Score</th>
                <th onClick={() => handleSort('applicationDate')}>Applied Date</th>
                <th onClick={() => handleSort('counselingDate')}>Counseling Date</th>
                <th onClick={() => handleSort('documentStatus')}>Document Status</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((app: EnrollmentApplication) => (
                <tr key={app.id} className={selectedRows.includes(app.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input type="checkbox" checked={selectedRows.includes(app.id)} onChange={() => handleSelectRow(app.id)} />
                  </td>
                  <td><strong>{app.studentName}</strong></td>
                  <td>{app.applicationNumber}</td>
                  <td>{app.programApplied}</td>
                  <td>{app.entranceExam}</td>
                  <td><strong>{app.examScore}</strong></td>
                  <td>{formatDate(app.applicationDate)}</td>
                  <td>{app.counselingDate ? formatDate(app.counselingDate) : 'Not scheduled'}</td>
                  <td>
                    <span className={`status-badge-table ${app.documentStatus.toLowerCase()}`}>
                      {app.documentStatus}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge-table ${app.status.toLowerCase().replace(' ', '-')}`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <div className="three-dots-menu-container">
                      <button
                        className="three-dots-btn"
                        onClick={() => handleMenuToggle(app.id)}
                        title="Actions"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      {openMenuId === app.id && (
                        <div className="actions-popup-menu">
                          <button className="menu-item" onClick={() => handleMenuAction('view', app)}>
                            View
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('edit', app)}>
                            Edit
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('contact', app)}>
                            Contact Guardian
                          </button>
                          <button className="menu-item delete" onClick={() => handleMenuAction('delete', app)}>
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
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input type="checkbox" checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} onChange={handleSelectAll} />
                </th>
                <th onClick={() => handleSort('studentName')}>Name</th>
                <th onClick={() => handleSort('enrollmentNumber')}>Enrollment Number</th>
                <th onClick={() => handleSort('department')}>Department</th>
                <th onClick={() => handleSort('year')}>Year & Semester</th>
                <th onClick={() => handleSort('date')}>Date</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th onClick={() => handleSort('checkIn')}>Check-in Time</th>
                <th>Lectures Attended</th>
                <th>Notified</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record: AttendanceRecord) => (
                <tr key={record.id} className={selectedRows.includes(record.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input type="checkbox" checked={selectedRows.includes(record.id)} onChange={() => handleSelectRow(record.id)} />
                  </td>
                  <td><strong>{record.studentName}</strong></td>
                  <td>{record.enrollmentNumber}</td>
                  <td>{record.department}</td>
                  <td>{record.year}{['st', 'nd', 'rd', 'th'][Math.min(record.year - 1, 3)]} Year - Sem {record.semester}</td>
                  <td>{formatDate(record.date)}</td>
                  <td>
                    <span className={`status-badge-table ${record.status.toLowerCase().replace(' ', '-')}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.checkIn || '-'}</td>
                  <td><strong>{record.lecturesAttended}</strong></td>
                  <td>
                    {record.notifiedGuardian ? (
                      <i className="fas fa-check-circle" style={{ color: '#10ac8b' }}></i>
                    ) : (
                      <i className="fas fa-times-circle" style={{ color: '#ef4444' }}></i>
                    )}
                  </td>
                  <td className="actions-col">
                    <div className="three-dots-menu-container">
                      <button
                        className="three-dots-btn"
                        onClick={() => handleMenuToggle(record.id)}
                        title="Actions"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      {openMenuId === record.id && (
                        <div className="actions-popup-menu">
                          <button className="menu-item" onClick={() => handleMenuAction('view', record)}>
                            View
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('edit', record)}>
                            Edit
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('contact', record)}>
                            Contact Guardian
                          </button>
                          <button className="menu-item delete" onClick={() => handleMenuAction('delete', record)}>
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
        )}

        {/* PERFORMANCE TAB */}
        {activeTab === 'performance' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input type="checkbox" checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} onChange={handleSelectAll} />
                </th>
                <th onClick={() => handleSort('studentName')}>Name</th>
                <th onClick={() => handleSort('enrollmentNumber')}>Enrollment Number</th>
                <th onClick={() => handleSort('department')}>Department</th>
                <th onClick={() => handleSort('year')}>Year & Semester</th>
                <th onClick={() => handleSort('semester')}>Semester</th>
                <th onClick={() => handleSort('sgpa')}>SGPA</th>
                <th onClick={() => handleSort('cgpa')}>CGPA</th>
                <th>Credits Earned</th>
                <th onClick={() => handleSort('rank')}>Rank</th>
                <th onClick={() => handleSort('backlogs')}>Backlogs</th>
                <th onClick={() => handleSort('gradeObtained')}>Grade</th>
                <th onClick={() => handleSort('attendance')}>Attendance</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record: AcademicRecord) => (
                <tr key={record.id} className={selectedRows.includes(record.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input type="checkbox" checked={selectedRows.includes(record.id)} onChange={() => handleSelectRow(record.id)} />
                  </td>
                  <td><strong>{record.studentName}</strong></td>
                  <td>{record.enrollmentNumber}</td>
                  <td>{record.department}</td>
                  <td>{record.year}{['st', 'nd', 'rd', 'th'][Math.min(record.year - 1, 3)]} Year - Sem {record.semester}</td>
                  <td>Semester {record.semester}</td>
                  <td><strong>{record.sgpa.toFixed(1)}</strong></td>
                  <td><strong>{record.cgpa.toFixed(1)}</strong></td>
                  <td>{record.creditsEarned}/{record.totalCredits}</td>
                  <td>#{record.rank}</td>
                  <td>
                    <span className={`status-badge-table ${record.backlogs === 0 ? 'active' : 'inactive'}`}>
                      {record.backlogs === 0 ? 'None' : record.backlogs}
                    </span>
                  </td>
                  <td>
                    <span className={`grade-badge-table ${record.gradeObtained.replace('+', 'plus')}`}>
                      {record.gradeObtained}
                    </span>
                  </td>
                  <td>{record.attendance}%</td>
                  <td className="actions-col">
                    <div className="three-dots-menu-container">
                      <button
                        className="three-dots-btn"
                        onClick={() => handleMenuToggle(record.id)}
                        title="Actions"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      {openMenuId === record.id && (
                        <div className="actions-popup-menu">
                          <button className="menu-item" onClick={() => handleMenuAction('view', record)}>
                            View
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('edit', record)}>
                            Edit
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('contact', record)}>
                            Contact Guardian
                          </button>
                          <button className="menu-item delete" onClick={() => handleMenuAction('delete', record)}>
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
        )}

        {/* DISCIPLINARY TAB */}
        {activeTab === 'disciplinary' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input type="checkbox" checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} onChange={handleSelectAll} />
                </th>
                <th onClick={() => handleSort('studentName')}>Name</th>
                <th onClick={() => handleSort('enrollmentNumber')}>Enrollment Number</th>
                <th onClick={() => handleSort('department')}>Department</th>
                <th onClick={() => handleSort('incidentDate')}>Date</th>
                <th onClick={() => handleSort('incidentType')}>Type</th>
                <th onClick={() => handleSort('severity')}>Severity</th>
                <th>Action Taken</th>
                <th onClick={() => handleSort('resolutionDate')}>Resolution Date</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((record: DisciplinaryRecord) => (
                <tr key={record.id} className={selectedRows.includes(record.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input type="checkbox" checked={selectedRows.includes(record.id)} onChange={() => handleSelectRow(record.id)} />
                  </td>
                  <td><strong>{record.studentName}</strong></td>
                  <td>{record.enrollmentNumber}</td>
                  <td>{record.department}</td>
                  <td>{formatDate(record.incidentDate)}</td>
                  <td>{record.incidentType}</td>
                  <td>
                    <span className={`severity-badge-table ${record.severity.toLowerCase()}`}>
                      {record.severity}
                    </span>
                  </td>
                  <td className="truncate">{record.actionTaken}</td>
                  <td>{record.resolutionDate ? formatDate(record.resolutionDate) : '-'}</td>
                  <td>
                    <span className={`status-badge-table ${record.status.toLowerCase().replace(' ', '-')}`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <div className="three-dots-menu-container">
                      <button
                        className="three-dots-btn"
                        onClick={() => handleMenuToggle(record.id)}
                        title="Actions"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      {openMenuId === record.id && (
                        <div className="actions-popup-menu">
                          <button className="menu-item" onClick={() => handleMenuAction('view', record)}>
                            View
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('edit', record)}>
                            Edit
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('contact', record)}>
                            Contact Guardian
                          </button>
                          <button className="menu-item delete" onClick={() => handleMenuAction('delete', record)}>
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
        )}

        {/* TRANSFERS TAB */}
        {activeTab === 'transfers' && (
          <table className="data-table">
            <thead>
              <tr>
                <th className="checkbox-col">
                  <input type="checkbox" checked={selectedRows.length === paginatedData.length && paginatedData.length > 0} onChange={handleSelectAll} />
                </th>
                <th onClick={() => handleSort('studentName')}>Name</th>
                <th onClick={() => handleSort('enrollmentNumber')}>Enrollment Number</th>
                <th onClick={() => handleSort('department')}>Department</th>
                <th onClick={() => handleSort('year')}>Year & Semester</th>
                <th onClick={() => handleSort('requestType')}>Type</th>
                <th onClick={() => handleSort('requestDate')}>Request Date</th>
                <th>Reason</th>
                <th>Destination/Source</th>
                <th onClick={() => handleSort('tcStatus')}>TC Status</th>
                <th>Clearance Status</th>
                <th onClick={() => handleSort('status')}>Status</th>
                <th className="actions-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((request: TransferRequest) => (
                <tr key={request.id} className={selectedRows.includes(request.id) ? 'selected' : ''}>
                  <td className="checkbox-col">
                    <input type="checkbox" checked={selectedRows.includes(request.id)} onChange={() => handleSelectRow(request.id)} />
                  </td>
                  <td><strong>{request.studentName}</strong></td>
                  <td>{request.enrollmentNumber}</td>
                  <td>{request.department}</td>
                  <td>{request.year}{['st', 'nd', 'rd', 'th'][Math.min(request.year - 1, 3)]} Year - Sem {request.semester}</td>
                  <td>
                    <span className={`type-badge-table ${request.requestType.toLowerCase().replace(' ', '-')}`}>
                      {request.requestType}
                    </span>
                  </td>
                  <td>{formatDate(request.requestDate)}</td>
                  <td className="truncate">{request.reason}</td>
                  <td className="truncate">{request.destinationInstitution || request.sourceInstitution || '-'}</td>
                  <td>
                    <span className={`tc-status ${request.tcStatus.toLowerCase().replace(' ', '-')}`}>
                      {request.tcStatus === 'Issued' && request.tcNumber ? `${request.tcStatus} - ${request.tcNumber}` : request.tcStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px' }}>
                      Library: {request.clearanceStatus.library ? '✓' : '✗'}<br/>
                      Hostel: {request.clearanceStatus.hostel ? '✓' : '✗'}<br/>
                      Fees: {request.clearanceStatus.fees ? '✓' : '✗'}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge-table ${request.status.toLowerCase().replace(' ', '-')}`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="actions-col">
                    <div className="three-dots-menu-container">
                      <button
                        className="three-dots-btn"
                        onClick={() => handleMenuToggle(request.id)}
                        title="Actions"
                      >
                        <i className="fas fa-ellipsis-h"></i>
                      </button>
                      {openMenuId === request.id && (
                        <div className="actions-popup-menu">
                          <button className="menu-item" onClick={() => handleMenuAction('view', request)}>
                            View
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('edit', request)}>
                            Edit
                          </button>
                          <button className="menu-item" onClick={() => handleMenuAction('contact', request)}>
                            Contact Guardian
                          </button>
                          <button className="menu-item delete" onClick={() => handleMenuAction('delete', request)}>
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
        )}
      </div>

      {/* Pagination */}
      <div className="smgmt-pagination">
        <div className="pagination-info">
          Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, getFilteredData().length)} of {getFilteredData().length} entries
        </div>
        <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="page-btn"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && <span className="page-ellipsis">...</span>}
                <button
                  onClick={() => setCurrentPage(page)}
                  className={`page-btn ${currentPage === page ? 'active' : ''}`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="page-btn"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <div className="rows-per-page">
          <label>Rows per page:</label>
          <select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>

      {/* Floating Action Bar (when rows selected) */}
      {selectedRows.length > 0 && (
        <div className="floating-action-bar">
          <div className="fab-left">
            <i className="fas fa-check-circle"></i>
            <strong>{selectedRows.length}</strong> selected
          </div>
          <div className="fab-actions">
            <button onClick={() => handleBulkAction('messageParents')}>
              <i className="fas fa-envelope"></i>
              Message Parents
            </button>
            <button onClick={() => handleBulkAction('export')}>
              <i className="fas fa-download"></i>
              Export
            </button>
            <button onClick={() => handleBulkAction('generateReports')}>
              <i className="fas fa-file-pdf"></i>
              Generate Reports
            </button>
            <button className="fab-clear" onClick={handleClearSelection}>
              <i className="fas fa-times"></i>
              Clear
            </button>
          </div>
        </div>
      )}

      {/* MODALS (keeping existing modal structure) */}

      {/* Add Student Modal */}
      {showAddStudentModal && (
        <div className="modal-overlay" onClick={() => setShowAddStudentModal(false)}>
          <div className="student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Student</h2>
              <button className="modal-close" onClick={() => setShowAddStudentModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    type="text"
                    value={newStudentForm.rollNumber}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, rollNumber: e.target.value })}
                    placeholder="2024001"
                  />
                </div>
                <div className="form-group">
                  <label>Admission Number *</label>
                  <input
                    type="text"
                    value={newStudentForm.admissionNumber}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, admissionNumber: e.target.value })}
                    placeholder="ADM2024001"
                  />
                </div>
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                    placeholder="Student Name"
                  />
                </div>
                <div className="form-group">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    value={newStudentForm.dateOfBirth}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, dateOfBirth: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Gender *</label>
                  <select
                    value={newStudentForm.gender}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, gender: e.target.value })}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Blood Group</label>
                  <input
                    type="text"
                    value={newStudentForm.bloodGroup}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, bloodGroup: e.target.value })}
                    placeholder="O+"
                  />
                </div>
                <div className="form-group">
                  <label>Grade *</label>
                  <select
                    value={newStudentForm.grade}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, grade: e.target.value })}
                  >
                    <option value="">Select Grade</option>
                    {[1,2,3,4,5,6,7,8,9,10].map(g => (
                      <option key={g} value={g.toString()}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Section *</label>
                  <select
                    value={newStudentForm.section}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, section: e.target.value })}
                  >
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Address</label>
                  <input
                    type="text"
                    value={newStudentForm.address}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, address: e.target.value })}
                    placeholder="Full Address"
                  />
                </div>
                <div className="form-group">
                  <label>Admission Date *</label>
                  <input
                    type="date"
                    value={newStudentForm.admissionDate}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, admissionDate: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Parent Name *</label>
                  <input
                    type="text"
                    value={newStudentForm.parentName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentName: e.target.value })}
                    placeholder="Parent/Guardian Name"
                  />
                </div>
                <div className="form-group">
                  <label>Parent Email *</label>
                  <input
                    type="email"
                    value={newStudentForm.parentEmail}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentEmail: e.target.value })}
                    placeholder="parent@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Parent Phone *</label>
                  <input
                    type="tel"
                    value={newStudentForm.parentPhone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newStudentForm.transportRequired}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, transportRequired: e.target.checked })}
                    />
                    Transport Required
                  </label>
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={newStudentForm.hostelResident}
                      onChange={(e) => setNewStudentForm({ ...newStudentForm, hostelResident: e.target.checked })}
                    />
                    Hostel Resident
                  </label>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddStudentModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleAddStudent}>
                <i className="fas fa-plus"></i>
                Add Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {showEditStudentModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowEditStudentModal(false)}>
          <div className="student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Student Details</h2>
              <button className="modal-close" onClick={() => setShowEditStudentModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="form-grid">
                <div className="form-group">
                  <label>Roll Number *</label>
                  <input
                    type="text"
                    value={newStudentForm.rollNumber}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, rollNumber: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Admission Number *</label>
                  <input
                    type="text"
                    value={newStudentForm.admissionNumber}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, admissionNumber: e.target.value })}
                  />
                </div>
                <div className="form-group full-width">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={newStudentForm.name}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Grade *</label>
                  <select
                    value={newStudentForm.grade}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, grade: e.target.value })}
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(g => (
                      <option key={g} value={g.toString()}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Section *</label>
                  <select
                    value={newStudentForm.section}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, section: e.target.value })}
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Parent Name *</label>
                  <input
                    type="text"
                    value={newStudentForm.parentName}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentName: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Parent Email *</label>
                  <input
                    type="email"
                    value={newStudentForm.parentEmail}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentEmail: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Parent Phone *</label>
                  <input
                    type="tel"
                    value={newStudentForm.parentPhone}
                    onChange={(e) => setNewStudentForm({ ...newStudentForm, parentPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowEditStudentModal(false)}>
                Cancel
              </button>
              <button className="btn-primary" onClick={handleUpdateStudent}>
                <i className="fas fa-save"></i>
                Update Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Student Details Modal */}
      {showViewStudentModal && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowViewStudentModal(false)}>
          <div className="student-view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="modal-close" onClick={() => setShowViewStudentModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="details-grid">
                <div className="smgmt-modal-field">
                  <label>Student Name:</label>
                  <span><strong>{selectedStudent.name}</strong></span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Enrollment Number:</label>
                  <span>{selectedStudent.enrollmentNumber}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Admission Number:</label>
                  <span>{selectedStudent.admissionNumber}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Department:</label>
                  <span>{selectedStudent.department}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Year & Semester:</label>
                  <span>{selectedStudent.year}{['st', 'nd', 'rd', 'th'][Math.min(selectedStudent.year - 1, 3)]} Year - Semester {selectedStudent.semester}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Program:</label>
                  <span>{selectedStudent.program}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Batch:</label>
                  <span>{selectedStudent.batch}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>CGPA:</label>
                  <span><strong>{selectedStudent.cgpa.toFixed(2)}</strong></span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Date of Birth:</label>
                  <span>{formatDate(selectedStudent.dateOfBirth)}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Gender:</label>
                  <span>{selectedStudent.gender}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Blood Group:</label>
                  <span>{selectedStudent.bloodGroup}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Admission Date:</label>
                  <span>{formatDate(selectedStudent.admissionDate)}</span>
                </div>
                <div className="smgmt-modal-field full-width">
                  <label>Address:</label>
                  <span>{selectedStudent.address}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Student Email:</label>
                  <span>{selectedStudent.email}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Student Phone:</label>
                  <span>{selectedStudent.phone}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Guardian Name:</label>
                  <span>{selectedStudent.guardianName}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Guardian Email:</label>
                  <span>{selectedStudent.guardianEmail}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Guardian Phone:</label>
                  <span>{selectedStudent.guardianPhone}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Hostel/Accommodation:</label>
                  <span>{selectedStudent.hostel}</span>
                </div>
                <div className="smgmt-modal-field">
                  <label>Status:</label>
                  <span className={`status-badge ${selectedStudent.status.toLowerCase().replace(' ', '-')}`}>
                    {selectedStudent.status}
                  </span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowViewStudentModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedStudent && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Deletion</h2>
              <button className="modal-close" onClick={() => setShowDeleteConfirm(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to delete <strong>{selectedStudent.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </button>
              <button className="btn-danger" onClick={handleDeleteStudent}>
                <i className="fas fa-trash"></i>
                Delete Student
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contact Guardian Modal */}
      {showContactParentModal && selectedStudent && (
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
                <h4>{selectedStudent.guardianName}</h4>
                <p className="student-ref">Guardian of {selectedStudent.name} ({selectedStudent.enrollmentNumber})</p>
                <div className="contact-methods">
                  <a href={`mailto:${selectedStudent.guardianEmail}`} className="contact-btn">
                    <i className="fas fa-envelope"></i>
                    {selectedStudent.guardianEmail}
                  </a>
                  <a href={`tel:${selectedStudent.guardianPhone}`} className="contact-btn">
                    <i className="fas fa-phone"></i>
                    {selectedStudent.guardianPhone}
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
    </div>
  );
};

export default StudentManagement;
