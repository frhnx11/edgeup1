import { useState } from 'react';

// Document types for inside and outside school use
interface Document {
  id: string;
  name: string;
  description: string;
  category: 'academic' | 'administrative' | 'external' | 'personal';
  icon: string;
  processingTime: string;
  required: boolean;
  status?: 'not-applied' | 'pending' | 'approved' | 'rejected';
  appliedDate?: string;
  approvedDate?: string;
  downloadUrl?: string;
}

interface ApplicationForm {
  documentId: string;
  purpose: string;
  additionalNotes: string;
  urgency: 'normal' | 'urgent';
}

const DocuPortal = () => {
  const [activeTab, setActiveTab] = useState<'available' | 'my-documents'>('available');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationForm, setApplicationForm] = useState<ApplicationForm>({
    documentId: '',
    purpose: '',
    additionalNotes: '',
    urgency: 'normal'
  });

  // Available documents for application
  const availableDocuments: Document[] = [
    {
      id: 'tc',
      name: 'Transfer Certificate (TC)',
      description: 'Official transfer certificate for school change or higher education admission',
      category: 'academic',
      icon: 'fa-file-contract',
      processingTime: '7-10 working days',
      required: true,
      status: 'not-applied'
    },
    {
      id: 'bonafide',
      name: 'Bonafide Certificate',
      description: 'Proof of being a student at this institution for various purposes',
      category: 'academic',
      icon: 'fa-certificate',
      processingTime: '2-3 working days',
      required: false,
      status: 'approved',
      appliedDate: '2024-10-15',
      approvedDate: '2024-10-18',
      downloadUrl: '#'
    },
    {
      id: 'marksheet',
      name: 'Marksheet Copy',
      description: 'Attested copy of examination marksheets for admission/job applications',
      category: 'academic',
      icon: 'fa-graduation-cap',
      processingTime: '1-2 working days',
      required: false,
      status: 'pending',
      appliedDate: '2024-10-20'
    },
    {
      id: 'conduct',
      name: 'Conduct Certificate',
      description: 'Certificate of good conduct and behavior for scholarship/internship',
      category: 'academic',
      icon: 'fa-user-check',
      processingTime: '3-5 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'id-card',
      name: 'Student ID Card',
      description: 'Official student identification card for school and external use',
      category: 'administrative',
      icon: 'fa-id-card',
      processingTime: '5-7 working days',
      required: true,
      status: 'approved',
      appliedDate: '2024-09-01',
      approvedDate: '2024-09-08',
      downloadUrl: '#'
    },
    {
      id: 'attendance',
      name: 'Attendance Certificate',
      description: 'Certificate showing your attendance percentage for the academic year',
      category: 'academic',
      icon: 'fa-calendar-check',
      processingTime: '1-2 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'income',
      name: 'Income Certificate Request',
      description: 'Letter requesting income certificate from authorities for scholarship',
      category: 'external',
      icon: 'fa-money-bill-wave',
      processingTime: '2-3 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'character',
      name: 'Character Certificate',
      description: 'Certificate of character for college admission or employment',
      category: 'academic',
      icon: 'fa-star',
      processingTime: '3-4 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'migration',
      name: 'Migration Certificate',
      description: 'Certificate for migrating to another university or education board',
      category: 'academic',
      icon: 'fa-exchange-alt',
      processingTime: '10-15 working days',
      required: true,
      status: 'not-applied'
    },
    {
      id: 'experience',
      name: 'School Experience Letter',
      description: 'Letter detailing your academic experience and achievements',
      category: 'personal',
      icon: 'fa-file-signature',
      processingTime: '2-4 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'noc',
      name: 'No Objection Certificate (NOC)',
      description: 'NOC for participating in external events, competitions, or programs',
      category: 'administrative',
      icon: 'fa-file-check',
      processingTime: '1-3 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'library-noc',
      name: 'Library No Due Certificate',
      description: 'Certificate confirming no pending library books or dues',
      category: 'administrative',
      icon: 'fa-book',
      processingTime: '1 working day',
      required: false,
      status: 'not-applied'
    }
  ];

  const [documents] = useState<Document[]>(availableDocuments);

  const myDocuments = documents.filter(doc => doc.status !== 'not-applied');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleApplyClick = (doc: Document) => {
    setSelectedDocument(doc);
    setApplicationForm({
      ...applicationForm,
      documentId: doc.id
    });
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = () => {
    console.log('Application submitted:', applicationForm);
    setShowApplicationModal(false);
    setApplicationForm({
      documentId: '',
      purpose: '',
      additionalNotes: '',
      urgency: 'normal'
    });
  };

  return (
    <>
      {/* Hero Section - Matching Overview exactly */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>DocuPortal 📄</h1>
            <p>Apply for academic and administrative documents seamlessly</p>
          </div>
          <div className="streak-badge">
            <i className="fas fa-file-invoice"></i>
            <div>
              <strong>{myDocuments.length}</strong>
              <span>Active Docs</span>
            </div>
          </div>
        </div>

        {/* Stats Cards - Summary of document statuses */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <div className="stat-info">
              <h4>Approved</h4>
              <p className="stat-value">
                {documents.filter(d => d.status === 'approved').length} <span className="stat-total">/ {documents.length} docs</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(documents.filter(d => d.status === 'approved').length / documents.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Pending</h4>
              <p className="stat-value">
                {documents.filter(d => d.status === 'pending').length} <span className="stat-total">/ {documents.length} docs</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(documents.filter(d => d.status === 'pending').length / documents.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <div className="stat-info">
              <h4>Available</h4>
              <p className="stat-value">
                {documents.filter(d => d.status === 'not-applied').length} <span className="stat-total">/ {documents.length} docs</span>
              </p>
              <div className="stat-progress">
                <div
                  className="stat-progress-fill"
                  style={{ width: `${(documents.filter(d => d.status === 'not-applied').length / documents.length) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Cards - Quick actions */}
        <div className="action-cards">
          <div className="action-card" onClick={() => setActiveTab('available')}>
            <i className="fas fa-folder-open"></i>
            <span>Browse Documents</span>
          </div>
          <div className="action-card" onClick={() => setActiveTab('my-documents')}>
            <i className="fas fa-briefcase"></i>
            <span>My Documents</span>
          </div>
          <div className="action-card">
            <i className="fas fa-history"></i>
            <span>Application History</span>
          </div>
          <div className="action-card">
            <i className="fas fa-question-circle"></i>
            <span>Help & Support</span>
          </div>
        </div>
      </div>

      {/* Metrics Row - Key metrics */}
      <div className="metrics-row">
        <div className="metric-card">
          <i className="fas fa-file-check"></i>
          <div className="metric-info">
            <h2>{documents.length}</h2>
            <p>Total Documents</p>
          </div>
          <span className="metric-change positive">+{documents.filter(d => d.required).length}</span>
        </div>

        <div className="metric-card">
          <i className="fas fa-download"></i>
          <div className="metric-info">
            <h2>{documents.filter(d => d.status === 'approved').length}</h2>
            <p>Ready to Download</p>
          </div>
          <span className="metric-change positive">+{documents.filter(d => d.status === 'approved').length}</span>
        </div>

        <div className="metric-card">
          <i className="fas fa-hourglass-half"></i>
          <div className="metric-info">
            <h2>{documents.filter(d => d.status === 'pending').length}</h2>
            <p>Processing</p>
          </div>
        </div>

        <div className="metric-card">
          <i className="fas fa-bolt"></i>
          <div className="metric-info">
            <h2>{documents.filter(d => d.required).length}</h2>
            <p>Required Docs</p>
          </div>
          <span className="metric-change positive">!</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        <button
          onClick={() => setActiveTab('available')}
          style={{
            flex: 1,
            padding: '16px 24px',
            background: activeTab === 'available' ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : '#ffffff',
            color: activeTab === 'available' ? '#ffffff' : '#212529',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: activeTab === 'available' ? '0 10px 30px rgba(9, 77, 136, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <i className="fas fa-folder-open"></i>
          Available Documents
        </button>
        <button
          onClick={() => setActiveTab('my-documents')}
          style={{
            flex: 1,
            padding: '16px 24px',
            background: activeTab === 'my-documents' ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)' : '#ffffff',
            color: activeTab === 'my-documents' ? '#ffffff' : '#212529',
            border: 'none',
            borderRadius: '12px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: activeTab === 'my-documents' ? '0 10px 30px rgba(9, 77, 136, 0.2)' : '0 2px 10px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <i className="fas fa-briefcase"></i>
          My Documents ({myDocuments.length})
        </button>
      </div>

      {/* Search and Filter Bar */}
      {activeTab === 'available' && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <i className="fas fa-search" style={{
                position: 'absolute',
                left: '16px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }}></i>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 44px',
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  outline: 'none'
                }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All', icon: 'fa-th-large' },
              { id: 'academic', label: 'Academic', icon: 'fa-graduation-cap' },
              { id: 'administrative', label: 'Administrative', icon: 'fa-cogs' },
              { id: 'external', label: 'External', icon: 'fa-globe' },
              { id: 'personal', label: 'Personal', icon: 'fa-user' }
            ].map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                style={{
                  padding: '8px 16px',
                  background: selectedCategory === category.id ? '#094d88' : '#f8f9fa',
                  color: selectedCategory === category.id ? '#ffffff' : '#212529',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className={`fas ${category.icon}`}></i>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Grid - 2 column layout matching Overview */}
      <div className="dashboard-grid">
        {(activeTab === 'available' ? filteredDocuments : myDocuments).map((doc) => (
          <div className="dashboard-card" key={doc.id}>
            <div className="card-header">
              <div className="card-title">
                <i className={`fas ${doc.icon}`}></i>
                <div>
                  <h3>
                    {doc.name}
                    {doc.required && <span style={{ color: '#dc3545', marginLeft: '8px' }}>*</span>}
                  </h3>
                  <p>{doc.description}</p>
                </div>
              </div>
            </div>

            <div className="card-content">
              {/* Document Info */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                backgroundColor: '#f8f9fa',
                borderRadius: '12px',
                marginBottom: '16px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#6c757d',
                    marginBottom: '4px'
                  }}>
                    Processing Time
                  </div>
                  <div style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#212529',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-clock" style={{ color: '#10ac8b' }}></i>
                    {doc.processingTime}
                  </div>
                </div>
                <div style={{
                  padding: '8px 16px',
                  backgroundColor: doc.category === 'academic' ? 'rgba(9, 77, 136, 0.1)' :
                                  doc.category === 'administrative' ? 'rgba(16, 172, 139, 0.1)' :
                                  doc.category === 'external' ? 'rgba(245, 158, 11, 0.1)' :
                                  'rgba(99, 102, 241, 0.1)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: doc.category === 'academic' ? '#094d88' :
                        doc.category === 'administrative' ? '#10ac8b' :
                        doc.category === 'external' ? '#f59e0b' :
                        '#6366f1',
                  textTransform: 'capitalize'
                }}>
                  {doc.category}
                </div>
              </div>

              {/* Status Badge */}
              {doc.status && doc.status !== 'not-applied' && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  backgroundColor: doc.status === 'approved' ? 'rgba(16, 172, 139, 0.1)' :
                                  doc.status === 'pending' ? 'rgba(245, 158, 11, 0.1)' :
                                  'rgba(220, 53, 69, 0.1)',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: doc.status === 'approved' ? '#10ac8b' :
                        doc.status === 'pending' ? '#f59e0b' :
                        '#dc3545',
                  marginBottom: '16px'
                }}>
                  <i className={`fas ${
                    doc.status === 'approved' ? 'fa-check-circle' :
                    doc.status === 'pending' ? 'fa-clock' :
                    'fa-times-circle'
                  }`}></i>
                  {doc.status === 'approved' ? 'Approved' :
                   doc.status === 'pending' ? 'Processing' :
                   'Rejected'}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                {doc.status === 'not-applied' && (
                  <button
                    onClick={() => handleApplyClick(doc)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fas fa-paper-plane"></i>
                    Apply Now
                  </button>
                )}
                {doc.status === 'approved' && doc.downloadUrl && (
                  <button
                    onClick={() => window.open(doc.downloadUrl, '_blank')}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#10ac8b',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className="fas fa-download"></i>
                    Download
                  </button>
                )}
                {doc.status === 'pending' && (
                  <div style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#6c757d',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}>
                    <i className="fas fa-hourglass-half"></i>
                    Processing...
                  </div>
                )}
                <button
                  style={{
                    padding: '12px 16px',
                    backgroundColor: '#ffffff',
                    color: '#094d88',
                    border: '1px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <i className="fas fa-info-circle"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Application Modal */}
      {showApplicationModal && selectedDocument && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '24px'
        }}
        onClick={() => setShowApplicationModal(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: '0 0 8px 0', fontSize: '24px', fontWeight: 700, color: '#212529' }}>
                  Apply for {selectedDocument.name}
                </h2>
                <p style={{ margin: 0, fontSize: '14px', color: '#6c757d' }}>
                  Fill in the details below to submit your application
                </p>
              </div>
              <button
                onClick={() => setShowApplicationModal(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: '#f8f9fa',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  color: '#6c757d',
                  transition: 'all 0.3s ease'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#212529' }}>
                Purpose of Application <span style={{ color: '#dc3545' }}>*</span>
              </label>
              <input
                type="text"
                value={applicationForm.purpose}
                onChange={(e) => setApplicationForm({ ...applicationForm, purpose: e.target.value })}
                placeholder="e.g., College admission, Scholarship application"
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600, color: '#212529' }}>
                Additional Notes
              </label>
              <textarea
                value={applicationForm.additionalNotes}
                onChange={(e) => setApplicationForm({ ...applicationForm, additionalNotes: e.target.value })}
                placeholder="Any additional information..."
                rows={4}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'vertical',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '12px', fontSize: '14px', fontWeight: 600, color: '#212529' }}>
                Urgency Level
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { value: 'normal', label: 'Normal', icon: 'fa-clock' },
                  { value: 'urgent', label: 'Urgent', icon: 'fa-bolt' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setApplicationForm({ ...applicationForm, urgency: option.value as any })}
                    style={{
                      flex: 1,
                      padding: '12px',
                      backgroundColor: applicationForm.urgency === option.value ? '#094d88' : '#f8f9fa',
                      color: applicationForm.urgency === option.value ? '#ffffff' : '#212529',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <i className={`fas ${option.icon}`}></i>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(9, 77, 136, 0.1)',
              borderRadius: '10px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <i className="fas fa-info-circle" style={{ color: '#094d88' }}></i>
                <strong style={{ fontSize: '14px', color: '#212529' }}>Processing Time</strong>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#6c757d', paddingLeft: '28px' }}>
                Your application will be processed within {selectedDocument.processingTime}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setShowApplicationModal(false)}
                style={{
                  flex: 1,
                  padding: '14px',
                  backgroundColor: '#ffffff',
                  color: '#6c757d',
                  border: '1px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitApplication}
                disabled={!applicationForm.purpose}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: applicationForm.purpose
                    ? 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)'
                    : '#f8f9fa',
                  color: applicationForm.purpose ? '#ffffff' : '#6c757d',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 600,
                  cursor: applicationForm.purpose ? 'pointer' : 'not-allowed',
                  transition: 'all 0.3s ease',
                  opacity: applicationForm.purpose ? 1 : 0.5
                }}
              >
                <i className="fas fa-paper-plane"></i> Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DocuPortal;
