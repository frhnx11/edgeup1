import { useState } from 'react';

interface SharedPlan {
  id: string;
  name: string;
  type: 'lesson' | 'course' | 'sow';
  subject: string;
  grade: string;
  owner: string;
  ownerAvatar: string;
  sharedWith: string[];
  sharedDate: string;
  permission: 'view' | 'edit' | 'comment';
  department: string;
  status: 'draft' | 'review' | 'approved' | 'published';
  comments: number;
  collaborators: number;
}

interface Comment {
  id: string;
  user: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  replies: Comment[];
}

interface CollaborationProps {
  onBack: () => void;
}

const Collaboration = ({ onBack }: CollaborationProps) => {
  const [activeTab, setActiveTab] = useState<'shared' | 'library' | 'pending'>('shared');
  const [selectedPlan, setSelectedPlan] = useState<SharedPlan | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showCommentsPanel, setShowCommentsPanel] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [newComment, setNewComment] = useState('');

  // Mock data for shared plans
  const [sharedPlans] = useState<SharedPlan[]>([
    {
      id: '1',
      name: 'Advanced Calculus - Derivatives',
      type: 'lesson',
      subject: 'Mathematics',
      grade: 'Grade 12',
      owner: 'Dr. Sarah Johnson',
      ownerAvatar: '👩‍🏫',
      sharedWith: ['You', 'Mr. Mike Chen', 'Ms. Emily Davis'],
      sharedDate: '2024-03-15',
      permission: 'edit',
      department: 'Mathematics',
      status: 'published',
      comments: 5,
      collaborators: 3
    },
    {
      id: '2',
      name: 'Physics - Electromagnetism Course',
      type: 'course',
      subject: 'Physics',
      grade: 'Grade 11',
      owner: 'Prof. James Wilson',
      ownerAvatar: '👨‍🔬',
      sharedWith: ['You', 'Dr. Sarah Johnson'],
      sharedDate: '2024-03-10',
      permission: 'comment',
      department: 'Science',
      status: 'review',
      comments: 12,
      collaborators: 2
    },
    {
      id: '3',
      name: 'English Literature - Shakespeare Unit',
      type: 'sow',
      subject: 'English',
      grade: 'Grade 10',
      owner: 'Ms. Emma Thompson',
      ownerAvatar: '👩‍💼',
      sharedWith: ['You', 'Mr. John Smith', 'Ms. Lisa Brown', 'Mr. David Lee'],
      sharedDate: '2024-03-08',
      permission: 'view',
      department: 'English',
      status: 'approved',
      comments: 8,
      collaborators: 4
    },
    {
      id: '4',
      name: 'Chemistry Lab Safety Procedures',
      type: 'lesson',
      subject: 'Chemistry',
      grade: 'Grade 9',
      owner: 'Dr. Robert Martinez',
      ownerAvatar: '👨‍🔬',
      sharedWith: ['You', 'Prof. James Wilson'],
      sharedDate: '2024-03-12',
      permission: 'edit',
      department: 'Science',
      status: 'draft',
      comments: 3,
      collaborators: 2
    },
    {
      id: '5',
      name: 'World History - Ancient Civilizations',
      type: 'course',
      subject: 'History',
      grade: 'Grade 11',
      owner: 'You',
      ownerAvatar: '👤',
      sharedWith: ['Dr. Sarah Johnson', 'Ms. Emma Thompson', 'Mr. John Smith'],
      sharedDate: '2024-03-14',
      permission: 'edit',
      department: 'Humanities',
      status: 'review',
      comments: 7,
      collaborators: 3
    }
  ]);

  const [comments] = useState<Comment[]>([
    {
      id: '1',
      user: 'Dr. Sarah Johnson',
      userAvatar: '👩‍🏫',
      text: 'Great lesson plan! I particularly like the hands-on activities section. Have you considered adding more real-world examples?',
      timestamp: '2024-03-18 10:30 AM',
      replies: [
        {
          id: '1-1',
          user: 'You',
          userAvatar: '👤',
          text: 'Thanks Sarah! That\'s a great suggestion. I\'ll add a section on practical applications in engineering.',
          timestamp: '2024-03-18 11:15 AM',
          replies: []
        }
      ]
    },
    {
      id: '2',
      user: 'Mr. Mike Chen',
      userAvatar: '👨‍🏫',
      text: 'The assessment criteria are well-defined. However, I think we should align this more closely with the new curriculum standards.',
      timestamp: '2024-03-18 02:45 PM',
      replies: []
    },
    {
      id: '3',
      user: 'Ms. Emily Davis',
      userAvatar: '👩‍💼',
      text: 'I\'ve made some edits to the differentiation section. Please review when you get a chance!',
      timestamp: '2024-03-18 04:20 PM',
      replies: []
    }
  ]);

  const departments = [
    { name: 'all', label: 'All Departments', count: 5 },
    { name: 'Mathematics', label: 'Mathematics', count: 1 },
    { name: 'Science', label: 'Science', count: 2 },
    { name: 'English', label: 'English', count: 1 },
    { name: 'Humanities', label: 'Humanities', count: 1 }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'lesson':
        return { label: 'Lesson', color: '#094d88', icon: 'clipboard' };
      case 'course':
        return { label: 'Course', color: '#10ac8b', icon: 'graduation-cap' };
      case 'sow':
        return { label: 'SOW', color: '#10ac8b', icon: 'calendar-alt' };
      default:
        return { label: 'Plan', color: '#718096', icon: 'file' };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'Draft', color: '#718096', icon: 'file-alt' };
      case 'review':
        return { label: 'In Review', color: '#10ac8b', icon: 'eye' };
      case 'approved':
        return { label: 'Approved', color: '#10ac8b', icon: 'check-circle' };
      case 'published':
        return { label: 'Published', color: '#094d88', icon: 'globe' };
      default:
        return { label: 'Unknown', color: '#718096', icon: 'question' };
    }
  };

  const getPermissionBadge = (permission: string) => {
    switch (permission) {
      case 'view':
        return { label: 'View Only', color: '#718096', icon: 'eye' };
      case 'comment':
        return { label: 'Can Comment', color: '#094d88', icon: 'comment' };
      case 'edit':
        return { label: 'Can Edit', color: '#10ac8b', icon: 'edit' };
      default:
        return { label: 'Unknown', color: '#718096', icon: 'question' };
    }
  };

  const filteredPlans = sharedPlans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || plan.department === selectedDepartment;

    if (activeTab === 'shared') {
      return matchesSearch && matchesDepartment && plan.owner !== 'You';
    } else if (activeTab === 'library') {
      return matchesSearch && matchesDepartment;
    } else if (activeTab === 'pending') {
      return matchesSearch && matchesDepartment && (plan.status === 'review' || plan.status === 'draft');
    }
    return false;
  });

  const handleSharePlan = () => {
    alert('Plan shared successfully!');
    setShowShareModal(false);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      alert(`Comment added: "${newComment}"`);
      setNewComment('');
    }
  };

  const handleApprove = (planId: string) => {
    alert(`Plan ${planId} approved!`);
  };

  const handleReject = (planId: string) => {
    alert(`Plan ${planId} rejected!`);
  };

  const handleRequestReview = (planId: string) => {
    alert(`Review requested for plan ${planId}!`);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateX(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Smart Planner
        </button>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.3)'
            }}>
              <i className="fas fa-users" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                Collaboration Hub
              </h1>
              <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
                Share plans, collaborate with colleagues, and access department resources
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowShareModal(true)}
            style={{
              padding: '1rem 2rem',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              color: 'white',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            <i className="fas fa-share-alt"></i> Share a Plan
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '1.5rem 2rem',
        marginBottom: '2rem',
        display: 'flex',
        gap: '1rem'
      }}>
        {[
          { id: 'shared', label: 'Shared with Me', icon: 'share-alt', count: sharedPlans.filter(p => p.owner !== 'You').length },
          { id: 'library', label: 'Department Library', icon: 'book-open', count: sharedPlans.length },
          { id: 'pending', label: 'Pending Approval', icon: 'clock', count: sharedPlans.filter(p => p.status === 'review' || p.status === 'draft').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              padding: '1.25rem 2rem',
              background: activeTab === tab.id
                ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                : 'white',
              border: `2px solid ${activeTab === tab.id ? '#094d88' : '#e2e8f0'}`,
              borderRadius: '12px',
              color: activeTab === tab.id ? 'white' : '#2d3748',
              cursor: 'pointer',
              transition: 'all 0.2s',
              fontWeight: 600,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(139, 92, 246, 0.3)' : 'none'
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = '#094d88';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.id) {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
          >
            <i className={`fas fa-${tab.icon}`}></i>
            <span>{tab.label}</span>
            <div style={{
              padding: '0.25rem 0.75rem',
              background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : '#f7fafc',
              borderRadius: '6px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              {tab.count}
            </div>
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '2rem',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem' }}>
          {/* Search */}
          <div style={{ position: 'relative' }}>
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '1.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#718096',
              fontSize: '1rem'
            }}></i>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plans by name, subject, or owner..."
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '0.95rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Department Filter */}
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            style={{
              padding: '1rem 1.5rem',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              fontSize: '0.95rem',
              fontWeight: 500,
              cursor: 'pointer',
              outline: 'none',
              background: 'white',
              minWidth: '200px'
            }}
          >
            {departments.map(dept => (
              <option key={dept.name} value={dept.name}>
                {dept.label} ({dept.count})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Plans Grid */}
      {filteredPlans.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '4rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 2rem',
            borderRadius: '50%',
            background: '#f7fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="fas fa-users" style={{ fontSize: '3rem', color: '#cbd5e0' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            No Plans Found
          </h3>
          <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
            {activeTab === 'shared' && 'No plans have been shared with you yet'}
            {activeTab === 'library' && 'The department library is empty'}
            {activeTab === 'pending' && 'No plans are pending approval'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem' }}>
          {filteredPlans.map((plan) => {
            const typeBadge = getTypeBadge(plan.type);
            const statusBadge = getStatusBadge(plan.status);
            const permissionBadge = getPermissionBadge(plan.permission);

            return (
              <div
                key={plan.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  overflow: 'hidden',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                }}
              >
                {/* Card Header */}
                <div style={{
                  background: `linear-gradient(135deg, ${typeBadge.color} 0%, ${typeBadge.color}dd 100%)`,
                  padding: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: 'rgba(255,255,255,0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backdropFilter: 'blur(10px)',
                      fontSize: '1.5rem'
                    }}>
                      {plan.ownerAvatar}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {typeBadge.label} • {plan.subject}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                        {plan.owner}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(255,255,255,0.2)',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)',
                    fontSize: '0.75rem',
                    color: 'white',
                    fontWeight: 600
                  }}>
                    <i className={`fas fa-${permissionBadge.icon}`}></i> {permissionBadge.label}
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                    <h4 style={{
                      margin: 0,
                      color: '#2d3748',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      lineHeight: '1.4',
                      flex: 1
                    }}>
                      {plan.name}
                    </h4>
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: `${statusBadge.color}20`,
                      color: statusBadge.color,
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginLeft: '1rem',
                      whiteSpace: 'nowrap'
                    }}>
                      <i className={`fas fa-${statusBadge.icon}`}></i> {statusBadge.label}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '1rem' }}>
                    {plan.grade} • {plan.department}
                  </div>

                  {/* Collaborators */}
                  <div style={{
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#718096', marginBottom: '0.5rem' }}>
                      <i className="fas fa-users"></i> Collaborators ({plan.collaborators})
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                      {plan.sharedWith.slice(0, 3).join(', ')}
                      {plan.sharedWith.length > 3 && ` +${plan.sharedWith.length - 3} more`}
                    </div>
                  </div>

                  {/* Stats */}
                  <div style={{
                    display: 'flex',
                    gap: '1rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #f7fafc',
                    fontSize: '0.85rem',
                    color: '#718096'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-comments"></i>
                      <span>{plan.comments} comments</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="fas fa-calendar"></i>
                      <span>{new Date(plan.sharedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowCommentsPanel(true);
                      }}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: `linear-gradient(135deg, ${typeBadge.color} 0%, ${typeBadge.color}dd 100%)`,
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      <i className="fas fa-eye"></i> View
                    </button>
                    {plan.permission === 'edit' && (
                      <button
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'white',
                          border: `2px solid ${typeBadge.color}`,
                          borderRadius: '8px',
                          color: typeBadge.color,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                    )}
                    {activeTab === 'pending' && plan.owner === 'You' && (
                      <button
                        onClick={() => handleRequestReview(plan.id)}
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-paper-plane"></i> Submit
                      </button>
                    )}
                    {activeTab === 'pending' && plan.owner !== 'You' && (
                      <>
                        <button
                          onClick={() => handleApprove(plan.id)}
                          style={{
                            padding: '0.75rem 1rem',
                            background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-check"></i>
                        </button>
                        <button
                          onClick={() => handleReject(plan.id)}
                          style={{
                            padding: '0.75rem 1rem',
                            background: 'linear-gradient(135deg, #dc3545 0%, #dc2626 100%)',
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '2.5rem',
            maxWidth: '600px',
            width: '90%',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.75rem', fontWeight: 700 }}>
              <i className="fas fa-share-alt"></i> Share Plan
            </h3>

            {/* Select Plan */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '0.75rem'
              }}>
                Select Plan to Share
              </label>
              <select style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                outline: 'none'
              }}>
                <option>Introduction to Quadratic Equations</option>
                <option>Physics - Full Year Course</option>
                <option>Chemistry Semester 1 Scheme</option>
              </select>
            </div>

            {/* Share with */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '0.75rem'
              }}>
                Share With
              </label>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {[
                  { name: 'Dr. Sarah Johnson', avatar: '👩‍🏫', department: 'Mathematics' },
                  { name: 'Prof. James Wilson', avatar: '👨‍🔬', department: 'Science' },
                  { name: 'Ms. Emma Thompson', avatar: '👩‍💼', department: 'English' },
                  { name: 'Mr. John Smith', avatar: '👨‍🏫', department: 'History' }
                ].map((person, i) => (
                  <label key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#edf2f7'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f7fafc'}
                  >
                    <input type="checkbox" style={{ width: '20px', height: '20px', cursor: 'pointer' }} />
                    <div style={{ fontSize: '2rem' }}>{person.avatar}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: '#2d3748' }}>{person.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>{person.department}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Permissions */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '0.75rem'
              }}>
                Permission Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {[
                  { value: 'view', label: 'View Only', icon: 'eye', color: '#718096' },
                  { value: 'comment', label: 'Can Comment', icon: 'comment', color: '#094d88' },
                  { value: 'edit', label: 'Can Edit', icon: 'edit', color: '#10ac8b' }
                ].map((perm) => (
                  <label key={perm.value} style={{
                    padding: '1.25rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}>
                    <input type="radio" name="permission" value={perm.value} style={{ display: 'none' }} />
                    <i className={`fas fa-${perm.icon}`} style={{ fontSize: '1.5rem', color: perm.color, marginBottom: '0.5rem', display: 'block' }}></i>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#2d3748' }}>{perm.label}</div>
                  </label>
                ))}
              </div>
            </div>

            {/* Message */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{
                display: 'block',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#2d3748',
                marginBottom: '0.75rem'
              }}>
                Message (Optional)
              </label>
              <textarea
                placeholder="Add a note to your colleagues..."
                rows={3}
                style={{
                  width: '100%',
                  padding: '1rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  outline: 'none',
                  fontFamily: 'inherit',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => setShowShareModal(false)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  background: 'white',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  color: '#2d3748',
                  fontSize: '1rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSharePlan}
                className="sign-in-btn"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)'
                }}
              >
                <i className="fas fa-share-alt"></i> Share Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comments Panel */}
      {showCommentsPanel && selectedPlan && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            width: '90%',
            maxWidth: '900px',
            maxHeight: '90vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
          }}>
            {/* Header */}
            <div style={{
              padding: '2rem',
              borderBottom: '2px solid #f7fafc',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
                  {selectedPlan.name}
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                  <i className="fas fa-comments"></i> {comments.length} comments
                </div>
              </div>
              <button
                onClick={() => {
                  setShowCommentsPanel(false);
                  setSelectedPlan(null);
                }}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  border: '2px solid #e2e8f0',
                  background: 'white',
                  color: '#718096',
                  cursor: 'pointer',
                  fontSize: '1.25rem'
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Comments List */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '2rem'
            }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{ marginBottom: '2rem' }}>
                  <div style={{
                    padding: '1.5rem',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={{ fontSize: '2.5rem' }}>{comment.userAvatar}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: '0.25rem' }}>
                          {comment.user}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                          {comment.timestamp}
                        </div>
                      </div>
                    </div>
                    <div style={{ color: '#4a5568', lineHeight: '1.6', marginBottom: '1rem' }}>
                      {comment.text}
                    </div>
                    <button style={{
                      padding: '0.5rem 1rem',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '8px',
                      color: '#094d88',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}>
                      <i className="fas fa-reply"></i> Reply
                    </button>
                  </div>

                  {/* Replies */}
                  {comment.replies.map((reply) => (
                    <div key={reply.id} style={{ marginLeft: '3rem', marginTop: '1rem' }}>
                      <div style={{
                        padding: '1.25rem',
                        background: 'white',
                        borderRadius: '12px',
                        border: '2px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '2rem' }}>{reply.userAvatar}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: '#2d3748', marginBottom: '0.25rem' }}>
                              {reply.user}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                              {reply.timestamp}
                            </div>
                          </div>
                        </div>
                        <div style={{ color: '#4a5568', lineHeight: '1.6' }}>
                          {reply.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Add Comment */}
            <div style={{
              padding: '2rem',
              borderTop: '2px solid #f7fafc'
            }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '1rem',
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                  onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="sign-in-btn"
                  style={{
                    padding: '1rem 2rem',
                    fontSize: '1rem',
                    background: newComment.trim() ? 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)' : '#e2e8f0',
                    cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                    opacity: newComment.trim() ? 1 : 0.6
                  }}
                >
                  <i className="fas fa-paper-plane"></i> Comment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaboration;
