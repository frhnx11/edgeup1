import { useState } from 'react';
import '../Dashboard.css';

// Document types for teacher professional use
interface Document {
  id: string;
  name: string;
  description: string;
  category: 'employment' | 'professional' | 'administrative' | 'academic';
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

const TeacherDocuPortal = () => {
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

  // Available documents for teachers
  const availableDocuments: Document[] = [
    {
      id: 'employment-cert',
      name: 'Employment Certificate',
      description: 'Official certificate confirming your employment at the institution',
      category: 'employment',
      icon: 'fa-briefcase',
      processingTime: '3-5 working days',
      required: false,
      status: 'approved',
      appliedDate: '2024-10-10',
      approvedDate: '2024-10-13',
      downloadUrl: '#'
    },
    {
      id: 'experience-letter',
      name: 'Experience Letter',
      description: 'Detailed letter of your teaching experience and responsibilities',
      category: 'employment',
      icon: 'fa-file-signature',
      processingTime: '5-7 working days',
      required: false,
      status: 'pending',
      appliedDate: '2024-10-20'
    },
    {
      id: 'salary-cert',
      name: 'Salary Certificate',
      description: 'Certificate stating your current salary details for loan/visa applications',
      category: 'employment',
      icon: 'fa-money-check-alt',
      processingTime: '2-3 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'noc-conference',
      name: 'NOC for Conference/Workshop',
      description: 'No Objection Certificate for attending professional conferences or workshops',
      category: 'professional',
      icon: 'fa-chalkboard-teacher',
      processingTime: '1-2 working days',
      required: false,
      status: 'approved',
      appliedDate: '2024-10-15',
      approvedDate: '2024-10-16',
      downloadUrl: '#'
    },
    {
      id: 'teaching-cert',
      name: 'Teaching Certificate',
      description: 'Certificate of teaching competency and subject expertise',
      category: 'professional',
      icon: 'fa-graduation-cap',
      processingTime: '7-10 working days',
      required: true,
      status: 'not-applied'
    },
    {
      id: 'performance-report',
      name: 'Performance Report',
      description: 'Annual performance evaluation report for career advancement',
      category: 'professional',
      icon: 'fa-chart-line',
      processingTime: '5-7 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'leave-record',
      name: 'Leave Record Certificate',
      description: 'Certificate showing your leave balance and attendance record',
      category: 'administrative',
      icon: 'fa-calendar-alt',
      processingTime: '1-2 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'training-cert',
      name: 'Training Completion Certificate',
      description: 'Certificate for completed professional development training programs',
      category: 'professional',
      icon: 'fa-certificate',
      processingTime: '3-4 working days',
      required: false,
      status: 'approved',
      appliedDate: '2024-09-25',
      approvedDate: '2024-09-28',
      downloadUrl: '#'
    },
    {
      id: 'conduct-cert',
      name: 'Good Conduct Certificate',
      description: 'Certificate of professional conduct and ethical behavior',
      category: 'professional',
      icon: 'fa-user-check',
      processingTime: '3-5 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'recommendation',
      name: 'Letter of Recommendation',
      description: 'Official recommendation letter from administration for higher studies/jobs',
      category: 'professional',
      icon: 'fa-envelope-open-text',
      processingTime: '5-7 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'service-record',
      name: 'Service Record',
      description: 'Complete record of your service tenure and positions held',
      category: 'employment',
      icon: 'fa-history',
      processingTime: '7-10 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'relieving-letter',
      name: 'Relieving Letter',
      description: 'Letter confirming release from current position (for job changes)',
      category: 'employment',
      icon: 'fa-door-open',
      processingTime: '10-15 working days',
      required: true,
      status: 'not-applied'
    },
    {
      id: 'increment-cert',
      name: 'Increment Certificate',
      description: 'Certificate of salary increments and promotions received',
      category: 'employment',
      icon: 'fa-arrow-up',
      processingTime: '3-5 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'bonafide',
      name: 'Bonafide Certificate',
      description: 'Certificate confirming your employment status for official purposes',
      category: 'employment',
      icon: 'fa-id-badge',
      processingTime: '1-2 working days',
      required: false,
      status: 'not-applied'
    },
    {
      id: 'course-completion',
      name: 'Course Completion Letter',
      description: 'Letter confirming completion of assigned courses for academic year',
      category: 'academic',
      icon: 'fa-book-open',
      processingTime: '2-3 working days',
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
    alert('Application submitted successfully! You will receive a notification once processed.');
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'employment': return '#094d88';
      case 'professional': return '#10ac8b';
      case 'administrative': return '#6366f1';
      case 'academic': return '#f59e0b';
      default: return '#718096';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'rejected': return '#ef4444';
      default: return '#718096';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return 'fa-check-circle';
      case 'pending': return 'fa-clock';
      case 'rejected': return 'fa-times-circle';
      default: return 'fa-file';
    }
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(9, 77, 136, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0', color: 'white', fontSize: '2.5rem', fontWeight: 700 }}>
              <i className="fas fa-file-alt" style={{ marginRight: '1rem' }}></i>
              DocuPortal
            </h1>
            <p style={{ margin: 0, color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Request and manage all your professional documents in one place
            </p>
          </div>
          <div style={{
            background: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'white' }}>
              {myDocuments.length}
            </div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.9)', marginTop: '0.25rem' }}>
              Documents Requested
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '2px solid #e2e8f0',
        paddingBottom: '0.5rem'
      }}>
        {[
          { key: 'available', label: 'Available Documents', icon: 'fa-folder-open' },
          { key: 'my-documents', label: 'My Documents', icon: 'fa-file-alt', count: myDocuments.length }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            style={{
              background: activeTab === tab.key ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)' : 'transparent',
              color: activeTab === tab.key ? 'white' : '#4a5568',
              border: 'none',
              padding: '1rem 2rem',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span style={{
                background: activeTab === tab.key ? 'rgba(255, 255, 255, 0.3)' : '#094d88',
                color: activeTab === tab.key ? 'white' : 'white',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.75rem',
                fontWeight: 700
              }}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Available Documents Tab */}
      {activeTab === 'available' && (
        <div>
          {/* Search and Filter */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
          }}>
            <div style={{ flex: 1 }}>
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.875rem 1rem 0.875rem 2.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23718096\' stroke-width=\'2\'%3E%3Ccircle cx=\'11\' cy=\'11\' r=\'8\'/%3E%3Cpath d=\'m21 21-4.35-4.35\'/%3E%3C/svg%3E")',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: '0.75rem center',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                minWidth: '200px'
              }}
            >
              <option value="all">All Categories</option>
              <option value="employment">Employment</option>
              <option value="professional">Professional</option>
              <option value="administrative">Administrative</option>
              <option value="academic">Academic</option>
            </select>
          </div>

          {/* Documents Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '1.5rem'
          }}>
            {filteredDocuments.map(doc => (
              <div
                key={doc.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '2px solid #f7fafc',
                  transition: 'all 0.3s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(9, 77, 136, 0.15)';
                  e.currentTarget.style.borderColor = getCategoryColor(doc.category);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                  e.currentTarget.style.borderColor = '#f7fafc';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    background: `${getCategoryColor(doc.category)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={`fas ${doc.icon}`} style={{
                      fontSize: '1.5rem',
                      color: getCategoryColor(doc.category)
                    }}></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 700, color: '#2d3748' }}>
                      {doc.name}
                      {doc.required && (
                        <span style={{
                          marginLeft: '0.5rem',
                          fontSize: '0.7rem',
                          background: '#fef3c7',
                          color: '#f59e0b',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontWeight: 600
                        }}>
                          REQUIRED
                        </span>
                      )}
                    </h3>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: getCategoryColor(doc.category),
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      {doc.category}
                    </span>
                  </div>
                </div>

                <p style={{
                  margin: '0 0 1rem 0',
                  fontSize: '0.9rem',
                  color: '#718096',
                  lineHeight: '1.6'
                }}>
                  {doc.description}
                </p>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem',
                  background: '#f7fafc',
                  borderRadius: '8px',
                  marginBottom: '1rem'
                }}>
                  <i className="fas fa-clock" style={{ color: '#718096', fontSize: '0.85rem' }}></i>
                  <span style={{ fontSize: '0.85rem', color: '#4a5568', fontWeight: 500 }}>
                    Processing Time: {doc.processingTime}
                  </span>
                </div>

                {doc.status && doc.status !== 'not-applied' ? (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: `${getStatusColor(doc.status)}15`,
                    borderRadius: '8px',
                    border: `1px solid ${getStatusColor(doc.status)}40`
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className={`fas ${getStatusIcon(doc.status)}`} style={{
                        color: getStatusColor(doc.status),
                        fontSize: '1rem'
                      }}></i>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: getStatusColor(doc.status),
                        textTransform: 'capitalize'
                      }}>
                        {doc.status}
                      </span>
                    </div>
                    {doc.status === 'approved' && doc.downloadUrl && (
                      <button
                        style={{
                          background: getStatusColor(doc.status),
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-download" style={{ marginRight: '0.5rem' }}></i>
                        Download
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleApplyClick(doc)}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '0.875rem',
                      borderRadius: '10px',
                      fontSize: '0.95rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 4px 15px rgba(9, 77, 136, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                    Apply Now
                  </button>
                )}
              </div>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <i className="fas fa-search" style={{ fontSize: '4rem', color: '#cbd5e0', marginBottom: '1rem' }}></i>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
                No Documents Found
              </h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      )}

      {/* My Documents Tab */}
      {activeTab === 'my-documents' && (
        <div>
          {myDocuments.length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: '1rem'
            }}>
              {myDocuments.map(doc => (
                <div
                  key={doc.id}
                  style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    border: `2px solid ${getStatusColor(doc.status || 'not-applied')}40`
                  }}
                >
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '12px',
                    background: `${getCategoryColor(doc.category)}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={`fas ${doc.icon}`} style={{
                      fontSize: '1.75rem',
                      color: getCategoryColor(doc.category)
                    }}></i>
                  </div>

                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem', fontWeight: 700, color: '#2d3748' }}>
                      {doc.name}
                    </h3>
                    <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#718096' }}>
                      {doc.description}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', color: '#4a5568' }}>
                      <span>
                        <i className="fas fa-calendar" style={{ marginRight: '0.5rem', color: '#718096' }}></i>
                        Applied: {doc.appliedDate}
                      </span>
                      {doc.approvedDate && (
                        <span>
                          <i className="fas fa-check-circle" style={{ marginRight: '0.5rem', color: '#10b981' }}></i>
                          Approved: {doc.approvedDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: '1rem'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 1rem',
                      background: `${getStatusColor(doc.status || 'not-applied')}15`,
                      borderRadius: '8px',
                      border: `2px solid ${getStatusColor(doc.status || 'not-applied')}`
                    }}>
                      <i className={`fas ${getStatusIcon(doc.status || 'not-applied')}`} style={{
                        color: getStatusColor(doc.status || 'not-applied'),
                        fontSize: '1rem'
                      }}></i>
                      <span style={{
                        fontSize: '0.9rem',
                        fontWeight: 700,
                        color: getStatusColor(doc.status || 'not-applied'),
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {doc.status}
                      </span>
                    </div>

                    {doc.status === 'approved' && doc.downloadUrl && (
                      <button
                        style={{
                          background: '#10b981',
                          color: 'white',
                          border: 'none',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          fontSize: '0.9rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#059669';
                          e.currentTarget.style.transform = 'scale(1.05)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#10b981';
                          e.currentTarget.style.transform = 'scale(1)';
                        }}
                      >
                        <i className="fas fa-download"></i>
                        Download
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}>
              <i className="fas fa-inbox" style={{ fontSize: '4rem', color: '#cbd5e0', marginBottom: '1rem' }}></i>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem' }}>
                No Documents Yet
              </h3>
              <p style={{ margin: '0 0 1.5rem 0', color: '#718096', fontSize: '1rem' }}>
                You haven't applied for any documents yet
              </p>
              <button
                onClick={() => setActiveTab('available')}
                style={{
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '1rem 2rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Browse Available Documents
              </button>
            </div>
          )}
        </div>
      )}

      {/* Application Modal */}
      {showApplicationModal && selectedDocument && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '12px',
                background: `${getCategoryColor(selectedDocument.category)}15`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <i className={`fas ${selectedDocument.icon}`} style={{
                  fontSize: '1.75rem',
                  color: getCategoryColor(selectedDocument.category)
                }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, color: '#2d3748' }}>
                  Apply for {selectedDocument.name}
                </h2>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#718096' }}>
                  {selectedDocument.description}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                Purpose of Request *
              </label>
              <textarea
                value={applicationForm.purpose}
                onChange={(e) => setApplicationForm({ ...applicationForm, purpose: e.target.value })}
                placeholder="Explain why you need this document..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                Additional Notes (Optional)
              </label>
              <textarea
                value={applicationForm.additionalNotes}
                onChange={(e) => setApplicationForm({ ...applicationForm, additionalNotes: e.target.value })}
                placeholder="Any additional information..."
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                marginBottom: '0.5rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                color: '#2d3748'
              }}>
                Priority Level
              </label>
              <select
                value={applicationForm.urgency}
                onChange={(e) => setApplicationForm({ ...applicationForm, urgency: e.target.value as any })}
                style={{
                  width: '100%',
                  padding: '0.875rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                <option value="normal">Normal (Standard processing)</option>
                <option value="urgent">Urgent (Expedited processing)</option>
              </select>
            </div>

            <div style={{
              background: '#f7fafc',
              padding: '1rem',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              border: '2px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-info-circle" style={{ color: '#094d88' }}></i>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2d3748' }}>
                  Processing Information
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#4a5568', lineHeight: '1.6' }}>
                Expected processing time: <strong>{selectedDocument.processingTime}</strong>
                <br />
                You will receive email notifications for status updates.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={handleSubmitApplication}
                disabled={!applicationForm.purpose.trim()}
                style={{
                  flex: 1,
                  background: applicationForm.purpose.trim() ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)' : '#cbd5e0',
                  color: 'white',
                  border: 'none',
                  padding: '1rem',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: applicationForm.purpose.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s'
                }}
              >
                <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                Submit Application
              </button>
              <button
                onClick={() => {
                  setShowApplicationModal(false);
                  setApplicationForm({
                    documentId: '',
                    purpose: '',
                    additionalNotes: '',
                    urgency: 'normal'
                  });
                }}
                style={{
                  padding: '1rem 1.5rem',
                  background: 'white',
                  color: '#718096',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDocuPortal;
