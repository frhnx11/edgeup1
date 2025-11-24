import { useState, useEffect, useRef } from 'react';

interface ComplianceItem {
  id: string;
  title: string;
  category: string;
  status: 'compliant' | 'pending' | 'critical';
  deadline: string;
  progress: number;
  description: string;
  isRenewable?: boolean;
  renewalFee?: number;
  renewalDueDate?: string;
  licenseNumber?: string;
}

interface Alert {
  id: string;
  type: 'urgent' | 'warning' | 'info';
  title: string;
  message: string;
  date: string;
}

interface RenewalDocument {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  required: boolean;
  status: 'pending' | 'uploaded' | 'verified';
  fileData?: string;
}

interface RenewalPayment {
  id: string;
  renewalId: string;
  transactionId: string;
  receiptNumber: string;
  date: string;
  amount: number;
  paymentMethod: 'card' | 'netbanking' | 'upi' | 'wallet' | 'cash' | 'cheque' | 'bank_code';
  status: 'success' | 'pending' | 'failed';
  licenseType: string;
  notes?: string;
}

interface AutoRenewalSettings {
  enabled: boolean;
  reminderDays: number[];
  lastReminderSent?: string;
}

interface LicenseRenewal {
  id: string;
  complianceItemId: string;
  licenseType: string;
  licenseNumber: string;
  currentExpiryDate: string;
  renewalDueDate: string;
  renewalFee: number;
  renewalStatus: 'not_started' | 'in_progress' | 'payment_pending' | 'completed' | 'expired';
  paymentStatus: 'unpaid' | 'paid' | 'partial' | 'overdue';
  paymentMethod?: string;
  transactionId?: string;
  receiptNumber?: string;
  newExpiryDate?: string;
  documents: RenewalDocument[];
  autoRenewal: AutoRenewalSettings;
  renewalHistory: {
    date: string;
    action: string;
    performedBy: string;
    notes?: string;
  }[];
}

const Compliance = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCompliance, setSelectedCompliance] = useState<ComplianceItem | null>(null);
  const [showUpdateProgress, setShowUpdateProgress] = useState(false);
  const [newProgress, setNewProgress] = useState(0);

  // License Renewal States
  const [showRenewalModal, setShowRenewalModal] = useState(false);
  const [renewalStep, setRenewalStep] = useState(1);
  const [selectedRenewal, setSelectedRenewal] = useState<LicenseRenewal | null>(null);
  const [renewals, setRenewals] = useState<LicenseRenewal[]>([]);
  const isInitialMount = useRef(true);

  // Sample payment data for comprehensive history display
  const samplePayments: RenewalPayment[] = [
    {
      id: 'PAY-001',
      renewalId: 'REN-001',
      transactionId: 'TXN1761896235576',
      receiptNumber: 'RCP1761896235576',
      date: '2024-10-31T10:30:00',
      amount: 75000,
      paymentMethod: 'card',
      status: 'success',
      licenseType: 'AICTE Annual Approval Renewal'
    },
    {
      id: 'PAY-002',
      renewalId: 'REN-002',
      transactionId: 'TXN1761896235575',
      receiptNumber: 'RCP1761896235575',
      date: '2024-09-15T14:45:00',
      amount: 50000,
      paymentMethod: 'upi',
      status: 'success',
      licenseType: 'UGC Faculty Qualification Compliance'
    },
    {
      id: 'PAY-003',
      renewalId: 'REN-003',
      transactionId: 'TXN1761896235574',
      receiptNumber: 'RCP1761896235574',
      date: '2024-08-05T09:15:00',
      amount: 100000,
      paymentMethod: 'netbanking',
      status: 'success',
      licenseType: 'NBA Department Accreditation'
    },
    {
      id: 'PAY-004',
      renewalId: 'REN-004',
      transactionId: 'TXN1761896235573',
      receiptNumber: 'RCP1761896235573',
      date: '2024-07-20T11:00:00',
      amount: 25000,
      paymentMethod: 'card',
      status: 'success',
      licenseType: 'Fire & Building Safety Compliance'
    },
    {
      id: 'PAY-005',
      renewalId: 'REN-005',
      transactionId: 'TXN1761896235572',
      receiptNumber: 'RCP1761896235572',
      date: '2024-06-10T16:20:00',
      amount: 60000,
      paymentMethod: 'cheque',
      status: 'pending',
      licenseType: 'Laboratory Safety Standards (NABL)'
    },
    {
      id: 'PAY-006',
      renewalId: 'REN-006',
      transactionId: 'TXN1761896235571',
      receiptNumber: 'RCP1761896235571',
      date: '2024-05-25T13:30:00',
      amount: 10000,
      paymentMethod: 'upi',
      status: 'success',
      licenseType: 'Anti-Ragging Compliance (UGC)'
    },
    {
      id: 'PAY-007',
      renewalId: 'REN-007',
      transactionId: 'TXN1761896235570',
      receiptNumber: 'RCP1761896235570',
      date: '2024-04-15T10:00:00',
      amount: 45000,
      paymentMethod: 'netbanking',
      status: 'success',
      licenseType: 'University Affiliation Fee'
    },
    {
      id: 'PAY-008',
      renewalId: 'REN-008',
      transactionId: 'TXN1761896235569',
      receiptNumber: 'RCP1761896235569',
      date: '2024-03-30T15:45:00',
      amount: 25000,
      paymentMethod: 'card',
      status: 'success',
      licenseType: 'Fire & Building Safety Compliance'
    },
    {
      id: 'PAY-009',
      renewalId: 'REN-009',
      transactionId: 'TXN1761896235568',
      receiptNumber: 'RCP1761896235568',
      date: '2024-02-12T12:15:00',
      amount: 40000,
      paymentMethod: 'upi',
      status: 'success',
      licenseType: 'Research Ethics Committee Approval'
    },
    {
      id: 'PAY-010',
      renewalId: 'REN-010',
      transactionId: 'TXN1761896235567',
      receiptNumber: 'RCP1761896235567',
      date: '2024-01-20T09:30:00',
      amount: 30000,
      paymentMethod: 'card',
      status: 'success',
      licenseType: 'Library Accreditation Fee'
    },
    {
      id: 'PAY-011',
      renewalId: 'REN-011',
      transactionId: 'TXN1761896235566',
      receiptNumber: 'RCP1761896235566',
      date: '2023-12-15T11:45:00',
      amount: 75000,
      paymentMethod: 'netbanking',
      status: 'success',
      licenseType: 'AICTE Annual Approval Renewal'
    },
    {
      id: 'PAY-012',
      renewalId: 'REN-012',
      transactionId: 'TXN1761896235565',
      receiptNumber: 'RCP1761896235565',
      date: '2023-11-05T14:00:00',
      amount: 15000,
      paymentMethod: 'upi',
      status: 'success',
      licenseType: 'Sports Facility License'
    }
  ];

  const [renewalPayments, setRenewalPayments] = useState<RenewalPayment[]>([]);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showOfflineOptions, setShowOfflineOptions] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [offlinePaymentType, setOfflinePaymentType] = useState<'manual' | 'form' | 'code'>('manual');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [viewMode, setViewMode] = useState<'compliance' | 'renewals'>('compliance');

  const initialData: ComplianceItem[] = [
    {
      id: '1',
      title: 'AICTE Annual Approval Renewal',
      category: 'AICTE',
      status: 'compliant',
      deadline: '2025-03-11',
      progress: 100,
      description: 'Annual approval renewal for all B.Tech programs including infrastructure audit and faculty qualification verification.',
      isRenewable: true,
      renewalFee: 75000,
      renewalDueDate: '2025-11-03',
      licenseNumber: 'AICTE-APP-2024-001'
    },
    {
      id: '2',
      title: 'UGC Faculty Qualification Compliance',
      category: 'UGC',
      status: 'pending',
      deadline: '2024-12-15',
      progress: 65,
      description: 'Submit faculty qualification certificates and experience letters to University Grants Commission for verification.',
      isRenewable: true,
      renewalFee: 50000,
      renewalDueDate: '2025-11-30',
      licenseNumber: 'UGC-FAC-2024-089'
    },
    {
      id: '3',
      title: 'NBA Department Accreditation',
      category: 'ACCREDITATION',
      status: 'pending',
      deadline: '2024-11-30',
      progress: 45,
      description: 'National Board of Accreditation assessment for Computer Science and Mechanical Engineering departments.',
      isRenewable: true,
      renewalFee: 100000,
      renewalDueDate: '2025-10-31',
      licenseNumber: 'NBA-ACC-2024-456'
    },
    {
      id: '4',
      title: 'Fire & Building Safety Compliance',
      category: 'SAFETY',
      status: 'critical',
      deadline: '2024-10-25',
      progress: 30,
      description: 'Annual building structural safety inspection and earthquake preparedness audit. Fire safety systems check.',
      isRenewable: true,
      renewalFee: 25000,
      renewalDueDate: '2025-09-30',
      licenseNumber: 'BS-FIRE-2024-789'
    },
    {
      id: '5',
      title: 'Laboratory Safety Standards (NABL)',
      category: 'SAFETY',
      status: 'compliant',
      deadline: '2025-08-31',
      progress: 100,
      description: 'National Accreditation Board for Testing and Calibration Laboratories - All engineering labs accredited.',
      isRenewable: true,
      renewalFee: 60000,
      renewalDueDate: '2025-07-31',
      licenseNumber: 'NABL-LAB-2024-345'
    },
    {
      id: '6',
      title: 'Anti-Ragging Compliance (UGC)',
      category: 'STUDENT WELFARE',
      status: 'compliant',
      deadline: '2025-09-30',
      progress: 100,
      description: 'UGC anti-ragging guidelines implementation. Committee formed, awareness programs conducted.',
      isRenewable: true,
      renewalFee: 10000,
      renewalDueDate: '2025-08-31',
      licenseNumber: 'UGC-AR-2024-678'
    },
    {
      id: '7',
      title: 'Curriculum Revision & Implementation',
      category: 'ACADEMIC',
      status: 'pending',
      deadline: '2024-12-20',
      progress: 70,
      description: 'Implementation of updated university curriculum for academic year 2024-25 across all departments.',
      isRenewable: true,
      renewalFee: 30000,
      renewalDueDate: '2025-11-30',
      licenseNumber: 'CURR-IMP-2024-901'
    },
    {
      id: '8',
      title: 'Research Ethics Committee Approval',
      category: 'RESEARCH',
      status: 'pending',
      deadline: '2025-02-28',
      progress: 55,
      description: 'Institutional Ethics Committee formation and approval for student research projects and faculty research grants.',
      isRenewable: true,
      renewalFee: 40000,
      renewalDueDate: '2026-01-31',
      licenseNumber: 'REC-ETH-2024-234'
    }
  ];

  const [complianceItems, setComplianceItems] = useState<ComplianceItem[]>(initialData);

  // Load renewals and payments from localStorage on mount
  useEffect(() => {
    const savedRenewals = localStorage.getItem('license_renewals');
    const savedPayments = localStorage.getItem('renewal_payments');

    console.log('🔍 Loading data from localStorage...');
    console.log('Saved payments:', savedPayments);

    if (savedRenewals) {
      setRenewals(JSON.parse(savedRenewals));
    }

    // Check if saved payments exist and are not empty
    if (savedPayments) {
      const parsed = JSON.parse(savedPayments);
      console.log('Parsed payments array length:', parsed.length);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log('✅ Loading', parsed.length, 'saved payments from localStorage');
        setRenewalPayments(parsed);
      } else {
        // If empty array, use sample data
        console.log('⚠️ Empty array found, loading', samplePayments.length, 'sample payments');
        setRenewalPayments(samplePayments);
      }
    } else {
      // No saved payments, use sample data
      console.log('✅ No localStorage data found, loading', samplePayments.length, 'sample payments');
      setRenewalPayments(samplePayments);
    }

    isInitialMount.current = false;
  }, []);

  // Save renewals to localStorage whenever they change
  useEffect(() => {
    if (renewals.length > 0) {
      localStorage.setItem('license_renewals', JSON.stringify(renewals));
    }
  }, [renewals]);

  const alerts: Alert[] = [
    {
      id: '1',
      type: 'urgent',
      title: 'AICTE Approval Renewal Due',
      message: 'Annual AICTE approval renewal deadline approaching in 3 days. Submit documentation immediately.',
      date: 'Today'
    },
    {
      id: '2',
      type: 'warning',
      title: 'UGC Compliance Report Pending',
      message: 'University Grants Commission quarterly compliance report 60% complete. 15 days remaining.',
      date: 'Yesterday'
    },
    {
      id: '3',
      type: 'info',
      title: 'NBA Accreditation Assessment Scheduled',
      message: 'National Board of Accreditation site visit scheduled in 45 days. Ensure all documentation ready.',
      date: '2 days ago'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: complianceItems.length },
    { id: 'AICTE', name: 'AICTE', count: complianceItems.filter(i => i.category === 'AICTE').length },
    { id: 'UGC', name: 'UGC', count: complianceItems.filter(i => i.category === 'UGC').length },
    { id: 'SAFETY', name: 'Safety Norms', count: complianceItems.filter(i => i.category === 'SAFETY').length },
    { id: 'ACCREDITATION', name: 'Accreditation', count: complianceItems.filter(i => i.category === 'ACCREDITATION').length },
    { id: 'STUDENT WELFARE', name: 'Student Welfare', count: complianceItems.filter(i => i.category === 'STUDENT WELFARE').length },
    { id: 'ACADEMIC', name: 'Academic', count: complianceItems.filter(i => i.category === 'ACADEMIC').length },
    { id: 'RESEARCH', name: 'Research', count: complianceItems.filter(i => i.category === 'RESEARCH').length }
  ];

  const filteredItems = selectedCategory === 'all'
    ? complianceItems
    : complianceItems.filter(item => item.category === selectedCategory);

  const stats = {
    compliant: complianceItems.filter(i => i.status === 'compliant').length,
    pending: complianceItems.filter(i => i.status === 'pending').length,
    critical: complianceItems.filter(i => i.status === 'critical').length,
    total: complianceItems.length
  };

  const generateReport = (type: string) => {
    alert(`Generating ${type} report... (Feature will be implemented)`);
  };

  // Download Report functionality
  const downloadReport = (item: ComplianceItem) => {
    const reportContent = `
COMPLIANCE REPORT
=================

Title: ${item.title}
Category: ${item.category}
Status: ${item.status.toUpperCase()}
Progress: ${item.progress}%
Deadline: ${new Date(item.deadline).toLocaleDateString()}

Description:
${item.description}

---
Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}
Generated by: EdgeUp Compliance Management System
`;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/\s+/g, '_')}_Report.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Update Progress functionality
  const handleUpdateProgress = () => {
    setShowUpdateProgress(true);
    setNewProgress(selectedCompliance?.progress || 0);
  };

  const saveProgress = () => {
    if (selectedCompliance) {
      const updatedItems = complianceItems.map(item => {
        if (item.id === selectedCompliance.id) {
          // Update status based on progress
          let newStatus: 'compliant' | 'pending' | 'critical' = 'pending';
          if (newProgress === 100) {
            newStatus = 'compliant';
          } else if (newProgress < 40) {
            newStatus = 'critical';
          }

          return {
            ...item,
            progress: newProgress,
            status: newStatus
          };
        }
        return item;
      });

      setComplianceItems(updatedItems);

      // Update selected compliance
      const updated = updatedItems.find(i => i.id === selectedCompliance.id);
      if (updated) {
        setSelectedCompliance(updated);
      }

      setShowUpdateProgress(false);
      alert('Progress updated successfully!');
    }
  };

  const cancelProgressUpdate = () => {
    setShowUpdateProgress(false);
    setNewProgress(selectedCompliance?.progress || 0);
  };

  // License Renewal Functions
  const startRenewal = (item: ComplianceItem) => {
    if (!item.isRenewable) return;

    // Check if renewal already exists
    const existingRenewal = renewals.find(r => r.complianceItemId === item.id && r.renewalStatus !== 'completed');

    if (existingRenewal) {
      setSelectedRenewal(existingRenewal);
    } else {
      // Create new renewal
      const newRenewal: LicenseRenewal = {
        id: `REN-${Date.now()}`,
        complianceItemId: item.id,
        licenseType: item.title,
        licenseNumber: item.licenseNumber || 'N/A',
        currentExpiryDate: item.deadline,
        renewalDueDate: item.renewalDueDate || item.deadline,
        renewalFee: item.renewalFee || 0,
        renewalStatus: 'not_started',
        paymentStatus: 'unpaid',
        documents: [
          { id: 'doc1', name: 'Application Form', type: 'PDF', uploadDate: '', required: true, status: 'pending' },
          { id: 'doc2', name: 'Previous License Copy', type: 'PDF', uploadDate: '', required: true, status: 'pending' },
          { id: 'doc3', name: 'Compliance Certificate', type: 'PDF', uploadDate: '', required: true, status: 'pending' },
          { id: 'doc4', name: 'Payment Receipt', type: 'PDF', uploadDate: '', required: false, status: 'pending' }
        ],
        autoRenewal: {
          enabled: false,
          reminderDays: [30, 15, 7]
        },
        renewalHistory: [
          {
            date: new Date().toISOString(),
            action: 'Renewal Process Initiated',
            performedBy: 'Management',
            notes: 'Started renewal process through system'
          }
        ]
      };

      setSelectedRenewal(newRenewal);
      setRenewals([...renewals, newRenewal]);
    }

    setRenewalStep(1);
    setShowRenewalModal(true);
    setSelectedCompliance(null);
  };

  const closeRenewalModal = () => {
    setShowRenewalModal(false);
    setRenewalStep(1);
    setSelectedPaymentMethod('');
    setShowOfflineOptions(false);
    setProcessingPayment(false);
  };

  const handleDocumentUpload = (docId: string) => {
    if (!selectedRenewal) return;

    const updatedDocs = selectedRenewal.documents.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          status: 'uploaded' as const,
          uploadDate: new Date().toISOString(),
          fileData: `mock_file_data_${docId}_${Date.now()}`
        };
      }
      return doc;
    });

    const updatedRenewal = {
      ...selectedRenewal,
      documents: updatedDocs,
      renewalStatus: 'in_progress' as const
    };

    setSelectedRenewal(updatedRenewal);
    updateRenewalInList(updatedRenewal);
  };

  const updateRenewalInList = (updatedRenewal: LicenseRenewal) => {
    setRenewals(prev => prev.map(r => r.id === updatedRenewal.id ? updatedRenewal : r));
  };

  const processPayment = async (method: string) => {
    if (!selectedRenewal) return;

    setProcessingPayment(true);
    setSelectedPaymentMethod(method);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2500));

    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      const transactionId = `TXN${Date.now()}`;
      const receiptNumber = `RCP${Date.now()}`;

      // Calculate new expiry date (1 year from current expiry or today, whichever is later)
      const currentExpiry = new Date(selectedRenewal.currentExpiryDate);
      const today = new Date();
      const baseDate = currentExpiry > today ? currentExpiry : today;
      const newExpiry = new Date(baseDate);
      newExpiry.setFullYear(newExpiry.getFullYear() + 1);

      const payment: RenewalPayment = {
        id: `PAY-${Date.now()}`,
        renewalId: selectedRenewal.id,
        transactionId,
        receiptNumber,
        date: new Date().toISOString(),
        amount: selectedRenewal.renewalFee,
        paymentMethod: method as any,
        status: 'success',
        licenseType: selectedRenewal.licenseType,
        notes: method === 'cash' || method === 'cheque' || method === 'bank_code' ? 'Offline payment recorded' : 'Online payment processed successfully'
      };

      const updatedPayments = [...renewalPayments, payment];
      setRenewalPayments(updatedPayments);

      // Manually save to localStorage when new payment is created
      localStorage.setItem('renewal_payments', JSON.stringify(updatedPayments));
      console.log('💾 Saved new payment to localStorage. Total payments:', updatedPayments.length);

      const updatedRenewal = {
        ...selectedRenewal,
        renewalStatus: 'completed' as const,
        paymentStatus: 'paid' as const,
        paymentMethod: method,
        transactionId,
        receiptNumber,
        newExpiryDate: newExpiry.toISOString(),
        renewalHistory: [
          ...selectedRenewal.renewalHistory,
          {
            date: new Date().toISOString(),
            action: 'Payment Processed',
            performedBy: 'Management',
            notes: `Payment successful via ${method}. Amount: ₹${selectedRenewal.renewalFee}`
          },
          {
            date: new Date().toISOString(),
            action: 'Renewal Completed',
            performedBy: 'System',
            notes: `License renewed successfully. New expiry: ${newExpiry.toLocaleDateString()}`
          }
        ]
      };

      setSelectedRenewal(updatedRenewal);
      updateRenewalInList(updatedRenewal);

      setProcessingPayment(false);
      setRenewalStep(4);
    } else {
      setProcessingPayment(false);
      alert('Payment failed. Please try again or contact support.');
    }
  };

  const generatePaymentCode = () => {
    const code = `PAY-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    return code;
  };

  const downloadApplicationForm = () => {
    if (!selectedRenewal) return;

    const formContent = `
LICENSE RENEWAL APPLICATION FORM
==================================

Tracking Number: ${selectedRenewal.id}
License Type: ${selectedRenewal.licenseType}
License Number: ${selectedRenewal.licenseNumber}
Current Expiry Date: ${new Date(selectedRenewal.currentExpiryDate).toLocaleDateString()}

RENEWAL DETAILS:
- Renewal Fee: ₹${selectedRenewal.renewalFee}
- Application Date: ${new Date().toLocaleDateString()}
- Payment Status: ${selectedRenewal.paymentStatus}

REQUIRED DOCUMENTS:
${selectedRenewal.documents.filter(d => d.required).map((d, i) => `${i + 1}. ${d.name}`).join('\n')}

INSTRUCTIONS:
1. Fill out this form completely
2. Attach all required documents
3. Submit to the concerned authority
4. Payment can be made online or offline
5. Keep this tracking number for reference

---
Generated on: ${new Date().toLocaleString()}
Generated by: EdgeUp Compliance Management System
`;

    const blob = new Blob([formContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedRenewal.licenseType.replace(/\s+/g, '_')}_Application_Form.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const downloadReceipt = (payment: RenewalPayment) => {
    const renewal = renewals.find(r => r.id === payment.renewalId);

    const receiptContent = `
RENEWAL PAYMENT RECEIPT
========================

Receipt Number: ${payment.receiptNumber}
Transaction ID: ${payment.transactionId}
Date: ${new Date(payment.date).toLocaleString()}

LICENSE DETAILS:
License Type: ${payment.licenseType}
${renewal ? `License Number: ${renewal.licenseNumber}` : ''}

PAYMENT INFORMATION:
Amount Paid: ₹${payment.amount}
Payment Method: ${payment.paymentMethod.toUpperCase()}
Status: ${payment.status.toUpperCase()}

${payment.notes ? `Notes: ${payment.notes}\n` : ''}
${renewal?.newExpiryDate ? `New Expiry Date: ${new Date(renewal.newExpiryDate).toLocaleDateString()}\n` : ''}

Thank you for your payment!

---
Generated on: ${new Date().toLocaleString()}
This is a computer-generated receipt and does not require a signature.
`;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Receipt_${payment.receiptNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const toggleAutoRenewal = (renewalId: string) => {
    const renewal = renewals.find(r => r.id === renewalId);
    if (!renewal) return;

    const updatedRenewal = {
      ...renewal,
      autoRenewal: {
        ...renewal.autoRenewal,
        enabled: !renewal.autoRenewal.enabled
      },
      renewalHistory: [
        ...renewal.renewalHistory,
        {
          date: new Date().toISOString(),
          action: renewal.autoRenewal.enabled ? 'Auto-Renewal Disabled' : 'Auto-Renewal Enabled',
          performedBy: 'Management',
          notes: `Auto-renewal subscription ${renewal.autoRenewal.enabled ? 'disabled' : 'enabled'} for this license`
        }
      ]
    };

    if (selectedRenewal?.id === renewalId) {
      setSelectedRenewal(updatedRenewal);
    }
    updateRenewalInList(updatedRenewal);
  };

  // Calculate days until renewal
  const getDaysUntilRenewal = (renewalDate: string) => {
    const today = new Date();
    const renewal = new Date(renewalDate);
    const diffTime = renewal.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="compliance-page">
      {/* Page Header */}
      <div className="smgmt-header">
        <div className="header-left">
          <h1><i className="fas fa-shield-alt"></i> Compliance & Regulations</h1>
          <p>Automated compliance tracking, license renewals, and regulatory management</p>
        </div>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => alert('Add Compliance Item functionality')}>
            <i className="fas fa-plus"></i>
            Add Compliance Item
          </button>
          <button className="btn-secondary" onClick={() => alert('Generate Report functionality')}>
            <i className="fas fa-file-alt"></i>
            Generate Report
          </button>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="view-mode-toggle">
        <button
          className={`toggle-btn ${viewMode === 'compliance' ? 'active' : ''}`}
          onClick={() => setViewMode('compliance')}
        >
          <i className="fas fa-clipboard-check"></i>
          Compliance & Regulations
        </button>
        <button
          className={`toggle-btn ${viewMode === 'renewals' ? 'active' : ''}`}
          onClick={() => setViewMode('renewals')}
        >
          <i className="fas fa-sync-alt"></i>
          License Renewals
        </button>
        <button
          className="toggle-btn"
          onClick={() => setShowPaymentHistory(true)}
        >
          <i className="fas fa-history"></i>
          Payment History
        </button>
      </div>

      {viewMode === 'compliance' ? (
        <>
          {/* Compliance Overview Stats */}
          <div className="compliance-stats-grid">
        <div className="compliance-stat-card total">
          <div className="stat-icon">
            <i className="fas fa-clipboard-list"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Total Regulations</span>
            <span className="stat-value">{stats.total}</span>
          </div>
        </div>

        <div className="compliance-stat-card compliant">
          <div className="stat-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Compliant</span>
            <span className="stat-value">{stats.compliant}</span>
          </div>
        </div>

        <div className="compliance-stat-card pending">
          <div className="stat-icon">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">In Progress</span>
            <span className="stat-value">{stats.pending}</span>
          </div>
        </div>

        <div className="compliance-stat-card critical">
          <div className="stat-icon">
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <div className="stat-info">
            <span className="stat-label">Critical</span>
            <span className="stat-value">{stats.critical}</span>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      <div className="alerts-card">
        <div className="alerts-header">
          <div className="alerts-title">
            <i className="fas fa-bell"></i>
            <h3>Automated Alerts & Notifications</h3>
          </div>
          <span className="alerts-badge">{alerts.length} Active</span>
        </div>
        <div className="alerts-list">
          {alerts.map((alert) => (
            <div key={alert.id} className={`alert-item ${alert.type}`}>
              <div className="alert-icon">
                <i className={`fas ${
                  alert.type === 'urgent' ? 'fa-exclamation-circle' :
                  alert.type === 'warning' ? 'fa-exclamation-triangle' :
                  'fa-info-circle'
                }`}></i>
              </div>
              <div className="alert-content">
                <h4>{alert.title}</h4>
                <p>{alert.message}</p>
              </div>
              <span className="alert-date">{alert.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filters */}
      <div className="compliance-categories">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className={`category-chip ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span>{cat.name}</span>
            <span className="category-count">{cat.count}</span>
          </div>
        ))}
      </div>

      {/* Compliance Items Grid */}
      <div className="compliance-items-grid">
        {filteredItems.map((item) => {
          const daysUntilRenewal = item.renewalDueDate ? getDaysUntilRenewal(item.renewalDueDate) : null;
          const needsRenewal = daysUntilRenewal !== null && daysUntilRenewal <= 30;

          return (
            <div
              key={item.id}
              className={`compliance-item-card ${item.status}`}
            >
              <div onClick={() => setSelectedCompliance(item)}>
                <div className="compliance-item-header">
                  <div className="item-status-badge">
                    {item.status === 'compliant' && <><i className="fas fa-check"></i> Compliant</>}
                    {item.status === 'pending' && <><i className="fas fa-clock"></i> Pending</>}
                    {item.status === 'critical' && <><i className="fas fa-exclamation"></i> Critical</>}
                  </div>
                  <span className="item-category">{item.category}</span>
                </div>

                {needsRenewal && item.isRenewable && (
                  <div className="renewal-due-badge">
                    <i className="fas fa-sync-alt"></i>
                    Renewal Due in {daysUntilRenewal} days
                  </div>
                )}

                <h3>{item.title}</h3>
                <p>{item.description}</p>

                <div className="item-progress">
                  <div className="progress-info">
                    <span>Progress</span>
                    <span className="progress-percent">{item.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>

                <div className="item-deadline">
                  <i className="fas fa-calendar"></i>
                  <span>Deadline: {new Date(item.deadline).toLocaleDateString()}</span>
                </div>
              </div>

              {item.isRenewable && (
                <button
                  className="renew-license-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    startRenewal(item);
                  }}
                >
                  <i className="fas fa-sync-alt"></i>
                  Renew License
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Pre-Audit Reports Section */}
      <div className="audit-reports-card">
        <div className="audit-header">
          <div className="audit-header-icon">
            <i className="fas fa-file-invoice"></i>
          </div>
          <div>
            <h2>Pre-Audit Reports & Documentation</h2>
            <p>Generate comprehensive audit-ready reports instantly</p>
          </div>
        </div>

        <div className="audit-reports-grid">
          <div className="audit-report-item" onClick={() => generateReport('AICTE Compliance')}>
            <div className="report-icon">
              <i className="fas fa-university"></i>
            </div>
            <h4>AICTE Compliance Report</h4>
            <p>Complete AICTE affiliation compliance status including infrastructure, faculty, and academic standards</p>
          </div>

          <div className="audit-report-item" onClick={() => generateReport('University Affiliation')}>
            <div className="report-icon">
              <i className="fas fa-graduation-cap"></i>
            </div>
            <h4>University Affiliation Audit</h4>
            <p>Annual university affiliation audit report with examination procedures and academic performance</p>
          </div>

          <div className="audit-report-item" onClick={() => generateReport('NBA Accreditation')}>
            <div className="report-icon">
              <i className="fas fa-certificate"></i>
            </div>
            <h4>NBA Accreditation Status</h4>
            <p>National Board of Accreditation documentation for all engineering programs seeking accreditation</p>
          </div>

          <div className="audit-report-item" onClick={() => generateReport('Faculty Qualification')}>
            <div className="report-icon">
              <i className="fas fa-user-check"></i>
            </div>
            <h4>Faculty Qualification Report</h4>
            <p>Complete faculty qualifications, experience, publications, and professional development records</p>
          </div>

          <div className="audit-report-item" onClick={() => generateReport('Laboratory Audit')}>
            <div className="report-icon">
              <i className="fas fa-flask"></i>
            </div>
            <h4>Laboratory Audit Report</h4>
            <p>Engineering lab equipment inventory, calibration status, and safety compliance documentation</p>
          </div>

          <div className="audit-report-item" onClick={() => generateReport('Library Accreditation')}>
            <div className="report-icon">
              <i className="fas fa-book"></i>
            </div>
            <h4>Library Accreditation Status</h4>
            <p>Library resources, digital subscriptions, and NAAC library standards compliance report</p>
          </div>
        </div>
      </div>

        {/* Compliance Detail Modal */}
        {selectedCompliance && (
        <div className="compliance-modal-overlay" onClick={() => setSelectedCompliance(null)}>
          <div className="compliance-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>{selectedCompliance.title}</h2>
                <span className={`modal-status ${selectedCompliance.status}`}>
                  {selectedCompliance.status.toUpperCase()}
                </span>
              </div>
              <button className="modal-close" onClick={() => setSelectedCompliance(null)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              {!showUpdateProgress ? (
                <>
                  <div className="modal-info-grid">
                    <div className="info-item">
                      <span className="info-label">Category</span>
                      <span className="info-value">{selectedCompliance.category}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Deadline</span>
                      <span className="info-value">{new Date(selectedCompliance.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Progress</span>
                      <span className="info-value">{selectedCompliance.progress}%</span>
                    </div>
                  </div>

                  <div className="modal-description">
                    <h3>Description</h3>
                    <p>{selectedCompliance.description}</p>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="modal-btn secondary"
                      onClick={() => downloadReport(selectedCompliance)}
                    >
                      <i className="fas fa-download"></i>
                      Download Report
                    </button>
                    <button
                      className="modal-btn primary"
                      onClick={handleUpdateProgress}
                    >
                      <i className="fas fa-edit"></i>
                      Update Progress
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="progress-update-section">
                    <h3>Update Progress</h3>
                    <p className="update-description">Adjust the progress slider to update the completion status</p>

                    <div className="progress-slider-container">
                      <div className="progress-display">
                        <span className="progress-value">{newProgress}%</span>
                        <span className="progress-status">
                          {newProgress === 100 ? 'Compliant' : newProgress < 40 ? 'Critical' : 'In Progress'}
                        </span>
                      </div>

                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => setNewProgress(parseInt(e.target.value))}
                        className="progress-slider"
                      />

                      <div className="progress-markers">
                        <span>0%</span>
                        <span>25%</span>
                        <span>50%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    <div className="progress-bar-preview">
                      <div className="progress-fill" style={{ width: `${newProgress}%` }}></div>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button
                      className="modal-btn secondary"
                      onClick={cancelProgressUpdate}
                    >
                      <i className="fas fa-times"></i>
                      Cancel
                    </button>
                    <button
                      className="modal-btn primary"
                      onClick={saveProgress}
                    >
                      <i className="fas fa-save"></i>
                      Save Progress
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
        </>
      ) : (
        <>
          {/* License Renewals View */}
          <div className="renewals-section">
            <div className="renewals-header">
              <h2><i className="fas fa-sync-alt"></i> License Renewals Management</h2>
              <p>Manage license renewals with online and offline payment options</p>
            </div>

            {/* Renewal Stats */}
            <div className="renewal-stats-grid">
              <div className="renewal-stat-card total">
                <i className="fas fa-file-contract"></i>
                <div>
                  <span className="stat-value">{complianceItems.filter(i => i.isRenewable).length}</span>
                  <span className="stat-label">Renewable Licenses</span>
                </div>
              </div>
              <div className="renewal-stat-card pending">
                <i className="fas fa-clock"></i>
                <div>
                  <span className="stat-value">{renewals.filter(r => r.renewalStatus === 'in_progress' || r.renewalStatus === 'payment_pending').length}</span>
                  <span className="stat-label">Pending Renewals</span>
                </div>
              </div>
              <div className="renewal-stat-card completed">
                <i className="fas fa-check-circle"></i>
                <div>
                  <span className="stat-value">{renewals.filter(r => r.renewalStatus === 'completed').length}</span>
                  <span className="stat-label">Completed</span>
                </div>
              </div>
              <div className="renewal-stat-card due-soon">
                <i className="fas fa-exclamation-triangle"></i>
                <div>
                  <span className="stat-value">
                    {complianceItems.filter(i => i.isRenewable && i.renewalDueDate && getDaysUntilRenewal(i.renewalDueDate) <= 30).length}
                  </span>
                  <span className="stat-label">Due Within 30 Days</span>
                </div>
              </div>
            </div>

            {/* Renewable Licenses Grid */}
            <div className="renewable-licenses-grid">
              {complianceItems.filter(item => item.isRenewable).map((item) => {
                const daysUntilRenewal = item.renewalDueDate ? getDaysUntilRenewal(item.renewalDueDate) : null;
                const existingRenewal = renewals.find(r => r.complianceItemId === item.id);
                const isCompleted = existingRenewal?.renewalStatus === 'completed';

                return (
                  <div key={item.id} className={`renewal-card ${isCompleted ? 'completed' : daysUntilRenewal && daysUntilRenewal <= 7 ? 'urgent' : ''}`}>
                    <div className="renewal-card-header">
                      <h3>{item.title}</h3>
                      {isCompleted && (
                        <span className="renewal-status completed">
                          <i className="fas fa-check-circle"></i> Renewed
                        </span>
                      )}
                      {!isCompleted && daysUntilRenewal && daysUntilRenewal <= 30 && (
                        <span className={`renewal-status ${daysUntilRenewal <= 7 ? 'urgent' : 'warning'}`}>
                          <i className="fas fa-clock"></i> Due in {daysUntilRenewal} days
                        </span>
                      )}
                    </div>

                    <div className="renewal-card-info">
                      <div className="info-row">
                        <span className="info-label"><i className="fas fa-certificate"></i> License #:</span>
                        <span className="info-value">{item.licenseNumber}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label"><i className="fas fa-calendar-alt"></i> Current Expiry:</span>
                        <span className="info-value">{new Date(item.deadline).toLocaleDateString()}</span>
                      </div>
                      {item.renewalDueDate && (
                        <div className="info-row">
                          <span className="info-label"><i className="fas fa-calendar-check"></i> Renewal Due:</span>
                          <span className="info-value">{new Date(item.renewalDueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="info-row">
                        <span className="info-label"><i className="fas fa-rupee-sign"></i> Renewal Fee:</span>
                        <span className="info-value">₹{item.renewalFee?.toLocaleString()}</span>
                      </div>
                      {existingRenewal?.newExpiryDate && (
                        <div className="info-row success">
                          <span className="info-label"><i className="fas fa-calendar-plus"></i> New Expiry:</span>
                          <span className="info-value">{new Date(existingRenewal.newExpiryDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {existingRenewal && (
                      <div className="renewal-auto-toggle">
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={existingRenewal.autoRenewal.enabled}
                            onChange={() => toggleAutoRenewal(existingRenewal.id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                        <span className="toggle-label">
                          <i className="fas fa-sync"></i> Auto-Renewal Subscription
                        </span>
                      </div>
                    )}

                    <div className="renewal-card-actions">
                      {isCompleted && existingRenewal ? (
                        <>
                          <button
                            className="renewal-btn success"
                            onClick={() => {
                              const payment = renewalPayments.find(p => p.renewalId === existingRenewal.id);
                              if (payment) downloadReceipt(payment);
                            }}
                          >
                            <i className="fas fa-download"></i>
                            Download Receipt
                          </button>
                          <button
                            className="renewal-btn secondary"
                            onClick={() => {
                              setSelectedRenewal(existingRenewal);
                              setShowRenewalModal(true);
                              setRenewalStep(4);
                            }}
                          >
                            <i className="fas fa-eye"></i>
                            View Details
                          </button>
                        </>
                      ) : (
                        <button
                          className="renewal-btn primary"
                          onClick={() => startRenewal(item)}
                        >
                          <i className="fas fa-play"></i>
                          {existingRenewal ? 'Continue Renewal' : 'Start Renewal Process'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Payment History Modal */}
      {showPaymentHistory && (
        <div className="compliance-modal-overlay" onClick={() => setShowPaymentHistory(false)}>
          <div className="compliance-modal payment-history-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fas fa-history"></i> Payment History</h2>
              <button className="modal-close" onClick={() => setShowPaymentHistory(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              {renewalPayments.length === 0 ? (
                <div className="empty-state">
                  <i className="fas fa-receipt"></i>
                  <p>No payment history available</p>
                </div>
              ) : (
                <div className="payment-history-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Receipt #</th>
                        <th>Date</th>
                        <th>License Type</th>
                        <th>Amount</th>
                        <th>Payment Method</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {renewalPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td>{payment.receiptNumber}</td>
                          <td>{new Date(payment.date).toLocaleDateString()}</td>
                          <td>{payment.licenseType}</td>
                          <td>₹{payment.amount.toLocaleString()}</td>
                          <td className="payment-method">
                            <i className={`fas ${
                              payment.paymentMethod === 'card' ? 'fa-credit-card' :
                              payment.paymentMethod === 'upi' ? 'fa-mobile-alt' :
                              payment.paymentMethod === 'netbanking' ? 'fa-university' :
                              payment.paymentMethod === 'wallet' ? 'fa-wallet' :
                              payment.paymentMethod === 'cash' ? 'fa-money-bill-wave' :
                              payment.paymentMethod === 'cheque' ? 'fa-money-check' :
                              'fa-barcode'
                            }`}></i>
                            {payment.paymentMethod.toUpperCase()}
                          </td>
                          <td>
                            <span className={`status-badge ${payment.status}`}>
                              {payment.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-btn"
                              onClick={() => downloadReceipt(payment)}
                              title="Download Receipt"
                            >
                              <i className="fas fa-download"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Renewal Modal (Multi-step) */}
      {showRenewalModal && selectedRenewal && (
        <div className="compliance-modal-overlay" onClick={closeRenewalModal}>
          <div className="compliance-modal renewal-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>License Renewal - {selectedRenewal.licenseType}</h2>
                <div className="renewal-steps-indicator">
                  <div className={`step ${renewalStep >= 1 ? 'active' : ''} ${renewalStep > 1 ? 'completed' : ''}`}>
                    <span className="step-number">1</span>
                    <span className="step-label">Details</span>
                  </div>
                  <div className={`step ${renewalStep >= 2 ? 'active' : ''} ${renewalStep > 2 ? 'completed' : ''}`}>
                    <span className="step-number">2</span>
                    <span className="step-label">Payment</span>
                  </div>
                  <div className={`step ${renewalStep >= 3 ? 'active' : ''} ${renewalStep > 3 ? 'completed' : ''}`}>
                    <span className="step-number">3</span>
                    <span className="step-label">Documents</span>
                  </div>
                  <div className={`step ${renewalStep >= 4 ? 'active' : ''}`}>
                    <span className="step-number">4</span>
                    <span className="step-label">Confirmation</span>
                  </div>
                </div>
              </div>
              <button className="modal-close" onClick={closeRenewalModal}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content renewal-content">
              {/* Step 1: Renewal Details */}
              {renewalStep === 1 && (
                <div className="renewal-step">
                  <h3>Renewal Information</h3>

                  <div className="renewal-details-grid">
                    <div className="detail-card">
                      <span className="detail-label">License Number</span>
                      <span className="detail-value">{selectedRenewal.licenseNumber}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Current Expiry Date</span>
                      <span className="detail-value">{new Date(selectedRenewal.currentExpiryDate).toLocaleDateString()}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">Renewal Fee</span>
                      <span className="detail-value fee">₹{selectedRenewal.renewalFee.toLocaleString()}</span>
                    </div>
                    <div className="detail-card">
                      <span className="detail-label">New Expiry Date (After Renewal)</span>
                      <span className="detail-value success">
                        {new Date(new Date(selectedRenewal.currentExpiryDate).setFullYear(new Date(selectedRenewal.currentExpiryDate).getFullYear() + 1)).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="fee-breakdown">
                    <h4>Fee Breakdown</h4>
                    <div className="breakdown-row">
                      <span>Renewal Fee</span>
                      <span>₹{selectedRenewal.renewalFee.toLocaleString()}</span>
                    </div>
                    <div className="breakdown-row">
                      <span>Processing Fee</span>
                      <span>₹0</span>
                    </div>
                    <div className="breakdown-row total">
                      <span>Total Amount</span>
                      <span>₹{selectedRenewal.renewalFee.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button className="modal-btn secondary" onClick={closeRenewalModal}>
                      Cancel
                    </button>
                    <button className="modal-btn primary" onClick={() => setRenewalStep(2)}>
                      Proceed to Payment <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Payment Method */}
              {renewalStep === 2 && (
                <div className="renewal-step">
                  <h3>Select Payment Method</h3>

                  <div className="payment-method-selector">
                    <div className="payment-section">
                      <h4><i className="fas fa-globe"></i> Online Payment</h4>
                      <div className="payment-methods-grid">
                        <div
                          className={`payment-method-card ${processingPayment && selectedPaymentMethod === 'card' ? 'processing' : ''}`}
                          onClick={() => !processingPayment && processPayment('card')}
                        >
                          <i className="fas fa-credit-card"></i>
                          <span>Credit/Debit Card</span>
                        </div>
                        <div
                          className={`payment-method-card ${processingPayment && selectedPaymentMethod === 'upi' ? 'processing' : ''}`}
                          onClick={() => !processingPayment && processPayment('upi')}
                        >
                          <i className="fas fa-mobile-alt"></i>
                          <span>UPI</span>
                        </div>
                        <div
                          className={`payment-method-card ${processingPayment && selectedPaymentMethod === 'netbanking' ? 'processing' : ''}`}
                          onClick={() => !processingPayment && processPayment('netbanking')}
                        >
                          <i className="fas fa-university"></i>
                          <span>Net Banking</span>
                        </div>
                        <div
                          className={`payment-method-card ${processingPayment && selectedPaymentMethod === 'wallet' ? 'processing' : ''}`}
                          onClick={() => !processingPayment && processPayment('wallet')}
                        >
                          <i className="fas fa-wallet"></i>
                          <span>Wallet</span>
                        </div>
                      </div>
                    </div>

                    <div className="payment-divider">
                      <span>OR</span>
                    </div>

                    <div className="payment-section">
                      <h4><i className="fas fa-file-alt"></i> Offline Payment</h4>
                      <div className="offline-options">
                        <button
                          className="offline-option-btn"
                          onClick={() => {
                            setOfflinePaymentType('manual');
                            setShowOfflineOptions(true);
                          }}
                        >
                          <i className="fas fa-pen"></i>
                          <div>
                            <span className="option-title">Manual Entry</span>
                            <span className="option-desc">Record cash/cheque payment manually</span>
                          </div>
                        </button>
                        <button
                          className="offline-option-btn"
                          onClick={() => {
                            setOfflinePaymentType('form');
                            setShowOfflineOptions(true);
                          }}
                        >
                          <i className="fas fa-file-download"></i>
                          <div>
                            <span className="option-title">Download Application Form</span>
                            <span className="option-desc">Generate PDF form with tracking number</span>
                          </div>
                        </button>
                        <button
                          className="offline-option-btn"
                          onClick={() => {
                            setOfflinePaymentType('code');
                            setShowOfflineOptions(true);
                          }}
                        >
                          <i className="fas fa-barcode"></i>
                          <div>
                            <span className="option-title">Payment Code</span>
                            <span className="option-desc">Generate code for bank/authorized centers</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  {processingPayment && (
                    <div className="payment-processing">
                      <div className="processing-spinner"></div>
                      <p>Processing your payment...</p>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button className="modal-btn secondary" onClick={() => setRenewalStep(1)} disabled={processingPayment}>
                      <i className="fas fa-arrow-left"></i> Back
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Document Upload */}
              {renewalStep === 3 && (
                <div className="renewal-step">
                  <h3>Upload Required Documents</h3>

                  <div className="documents-list">
                    {selectedRenewal.documents.map((doc) => (
                      <div key={doc.id} className={`document-item ${doc.status}`}>
                        <div className="document-info">
                          <i className={`fas ${doc.status === 'uploaded' ? 'fa-check-circle' : 'fa-file-pdf'}`}></i>
                          <div>
                            <span className="document-name">
                              {doc.name}
                              {doc.required && <span className="required-badge">Required</span>}
                            </span>
                            {doc.uploadDate && (
                              <span className="upload-date">Uploaded: {new Date(doc.uploadDate).toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                        {doc.status !== 'uploaded' ? (
                          <button
                            className="upload-btn"
                            onClick={() => handleDocumentUpload(doc.id)}
                          >
                            <i className="fas fa-upload"></i>
                            Upload
                          </button>
                        ) : (
                          <span className="upload-status success">
                            <i className="fas fa-check"></i> Uploaded
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="modal-actions">
                    <button className="modal-btn secondary" onClick={() => setRenewalStep(2)}>
                      <i className="fas fa-arrow-left"></i> Back
                    </button>
                    <button
                      className="modal-btn primary"
                      onClick={() => setRenewalStep(4)}
                      disabled={selectedRenewal.documents.filter(d => d.required).some(d => d.status !== 'uploaded')}
                    >
                      Complete Renewal <i className="fas fa-check"></i>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Confirmation */}
              {renewalStep === 4 && (
                <div className="renewal-step confirmation-step">
                  <div className="success-icon">
                    <i className="fas fa-check-circle"></i>
                  </div>
                  <h3>Renewal Completed Successfully!</h3>

                  <div className="confirmation-details">
                    <div className="detail-row">
                      <span>Transaction ID:</span>
                      <span className="value">{selectedRenewal.transactionId}</span>
                    </div>
                    <div className="detail-row">
                      <span>Receipt Number:</span>
                      <span className="value">{selectedRenewal.receiptNumber}</span>
                    </div>
                    <div className="detail-row">
                      <span>Amount Paid:</span>
                      <span className="value">₹{selectedRenewal.renewalFee.toLocaleString()}</span>
                    </div>
                    <div className="detail-row">
                      <span>Payment Method:</span>
                      <span className="value">{selectedRenewal.paymentMethod?.toUpperCase()}</span>
                    </div>
                    {selectedRenewal.newExpiryDate && (
                      <div className="detail-row highlight">
                        <span>New Expiry Date:</span>
                        <span className="value">{new Date(selectedRenewal.newExpiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  <div className="confirmation-actions">
                    <button
                      className="modal-btn secondary"
                      onClick={() => {
                        const payment = renewalPayments.find(p => p.renewalId === selectedRenewal.id);
                        if (payment) downloadReceipt(payment);
                      }}
                    >
                      <i className="fas fa-download"></i>
                      Download Receipt
                    </button>
                    <button className="modal-btn primary" onClick={closeRenewalModal}>
                      <i className="fas fa-check"></i>
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Offline Payment Options Modal */}
      {showOfflineOptions && selectedRenewal && (
        <div className="compliance-modal-overlay" onClick={() => setShowOfflineOptions(false)}>
          <div className="compliance-modal offline-payment-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {offlinePaymentType === 'manual' && 'Manual Payment Entry'}
                {offlinePaymentType === 'form' && 'Download Application Form'}
                {offlinePaymentType === 'code' && 'Payment Code'}
              </h2>
              <button className="modal-close" onClick={() => setShowOfflineOptions(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-content">
              {offlinePaymentType === 'manual' && (
                <div className="manual-payment-form">
                  <p>Record offline payment (cash/cheque) made for this license renewal.</p>
                  <button
                    className="modal-btn primary"
                    onClick={() => {
                      processPayment('cash');
                      setShowOfflineOptions(false);
                    }}
                  >
                    <i className="fas fa-money-bill-wave"></i>
                    Record Cash Payment
                  </button>
                  <button
                    className="modal-btn secondary"
                    onClick={() => {
                      processPayment('cheque');
                      setShowOfflineOptions(false);
                    }}
                  >
                    <i className="fas fa-money-check"></i>
                    Record Cheque Payment
                  </button>
                </div>
              )}

              {offlinePaymentType === 'form' && (
                <div className="application-form-download">
                  <p>Download the pre-filled application form with tracking number for offline submission.</p>
                  <div className="form-info">
                    <i className="fas fa-info-circle"></i>
                    <span>The form includes all license details and required documents list.</span>
                  </div>
                  <button
                    className="modal-btn primary"
                    onClick={() => {
                      downloadApplicationForm();
                      setShowOfflineOptions(false);
                    }}
                  >
                    <i className="fas fa-file-download"></i>
                    Download Application Form
                  </button>
                </div>
              )}

              {offlinePaymentType === 'code' && (
                <div className="payment-code-generator">
                  <p>Use this payment code at authorized banks or payment centers.</p>
                  <div className="payment-code-display">
                    <div className="code-value">{generatePaymentCode()}</div>
                    <button
                      className="copy-btn"
                      onClick={(e) => {
                        const code = generatePaymentCode();
                        navigator.clipboard.writeText(code);
                        (e.target as HTMLButtonElement).innerHTML = '<i class="fas fa-check"></i> Copied!';
                        setTimeout(() => {
                          (e.target as HTMLButtonElement).innerHTML = '<i class="fas fa-copy"></i> Copy';
                        }, 2000);
                      }}
                    >
                      <i className="fas fa-copy"></i> Copy
                    </button>
                  </div>
                  <div className="code-instructions">
                    <h4>Instructions:</h4>
                    <ol>
                      <li>Visit any authorized payment center</li>
                      <li>Provide this payment code</li>
                      <li>Complete the payment of ₹{selectedRenewal.renewalFee.toLocaleString()}</li>
                      <li>Return here to mark payment as completed</li>
                    </ol>
                  </div>
                  <button
                    className="modal-btn primary"
                    onClick={() => {
                      processPayment('bank_code');
                      setShowOfflineOptions(false);
                    }}
                  >
                    <i className="fas fa-check"></i>
                    Mark as Paid
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compliance;
