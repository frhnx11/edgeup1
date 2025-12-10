import { useState } from 'react';

interface SavedPlan {
  id: string;
  name: string;
  type: 'lesson' | 'course' | 'sow';
  subject: string;
  grade: string;
  folder: string;
  tags: string[];
  content: string;
  createdDate: string;
  lastModified: string;
  isTemplate: boolean;
  versions: number;
}

interface PlanManagementProps {
  onBack: () => void;
}

const PlanManagement = ({ onBack }: PlanManagementProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState<SavedPlan | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Mock data for saved plans
  const [savedPlans] = useState<SavedPlan[]>([
    {
      id: '1',
      name: 'Introduction to Quadratic Equations',
      type: 'lesson',
      subject: 'Mathematics',
      grade: 'Grade 10A',
      folder: 'Mathematics',
      tags: ['algebra', 'equations', 'interactive'],
      content: 'Full lesson plan content here...',
      createdDate: '2024-03-15',
      lastModified: '2024-03-18',
      isTemplate: false,
      versions: 3
    },
    {
      id: '2',
      name: 'Physics - Full Year Course',
      type: 'course',
      subject: 'Physics',
      grade: 'Grade 11',
      folder: 'Physics',
      tags: ['mechanics', 'electricity', 'full-year'],
      content: 'Full course plan content here...',
      createdDate: '2024-03-10',
      lastModified: '2024-03-20',
      isTemplate: true,
      versions: 5
    },
    {
      id: '3',
      name: 'Chemistry Semester 1 Scheme',
      type: 'sow',
      subject: 'Chemistry',
      grade: 'Grade 12',
      folder: 'Chemistry',
      tags: ['organic', 'inorganic', 'semester'],
      content: 'Full scheme of work content here...',
      createdDate: '2024-03-05',
      lastModified: '2024-03-12',
      isTemplate: false,
      versions: 2
    },
    {
      id: '4',
      name: 'Cell Biology and Genetics',
      type: 'lesson',
      subject: 'Biology',
      grade: 'Grade 10B',
      folder: 'Biology',
      tags: ['cells', 'genetics', 'practical'],
      content: 'Full lesson plan content here...',
      createdDate: '2024-03-08',
      lastModified: '2024-03-16',
      isTemplate: false,
      versions: 1
    },
    {
      id: '5',
      name: 'English Literature - Semester Plan',
      type: 'course',
      subject: 'English',
      grade: 'Grade 11',
      folder: 'English',
      tags: ['literature', 'poetry', 'novels'],
      content: 'Full course plan content here...',
      createdDate: '2024-03-01',
      lastModified: '2024-03-19',
      isTemplate: true,
      versions: 4
    },
    {
      id: '6',
      name: 'World War II History',
      type: 'lesson',
      subject: 'History',
      grade: 'Grade 12',
      folder: 'History',
      tags: ['wwii', 'modern-history', 'interactive'],
      content: 'Full lesson plan content here...',
      createdDate: '2024-02-28',
      lastModified: '2024-03-14',
      isTemplate: false,
      versions: 2
    }
  ]);

  const [folders] = useState([
    { name: 'all', count: 6, icon: 'folder-open', color: '#094d88' },
    { name: 'Mathematics', count: 1, icon: 'calculator', color: '#094d88' },
    { name: 'Physics', count: 1, icon: 'atom', color: '#10ac8b' },
    { name: 'Chemistry', count: 1, icon: 'flask', color: '#10ac8b' },
    { name: 'Biology', count: 1, icon: 'dna', color: '#094d88' },
    { name: 'English', count: 1, icon: 'book', color: '#dc3545' },
    { name: 'History', count: 1, icon: 'landmark', color: '#6366f1' }
  ]);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'lesson':
        return { label: 'Lesson Plan', color: '#094d88', icon: 'clipboard' };
      case 'course':
        return { label: 'Course Plan', color: '#10ac8b', icon: 'graduation-cap' };
      case 'sow':
        return { label: 'Scheme of Work', color: '#10ac8b', icon: 'calendar-alt' };
      default:
        return { label: 'Unknown', color: '#718096', icon: 'file' };
    }
  };

  const filteredPlans = savedPlans.filter(plan => {
    const matchesFolder = selectedFolder === 'all' || plan.folder === selectedFolder;
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = selectedType === 'all' || plan.type === selectedType;
    return matchesFolder && matchesSearch && matchesType;
  });

  const handleDownload = (plan: SavedPlan, format: 'pdf' | 'word') => {
    // Mock download functionality
    alert(`Downloading "${plan.name}" as ${format.toUpperCase()}...`);
  };

  const handleDuplicate = (plan: SavedPlan) => {
    alert(`Creating duplicate of "${plan.name}"...`);
  };

  const handleSaveAsTemplate = (plan: SavedPlan) => {
    alert(`Saving "${plan.name}" as template...`);
  };

  const handleEdit = (plan: SavedPlan) => {
    setSelectedPlan(plan);
    setEditedContent(plan.content);
    setIsEditMode(true);
  };

  const handleSaveEdit = () => {
    alert(`Saving changes to "${selectedPlan?.name}"...`);
    setIsEditMode(false);
    setSelectedPlan(null);
  };

  const handleViewPlan = (plan: SavedPlan) => {
    setSelectedPlan(plan);
    setEditedContent(plan.content);
    setIsEditMode(false);
  };

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      alert(`Creating folder "${newFolderName}"...`);
      setNewFolderName('');
      setShowFolderModal(false);
    }
  };

  // If viewing a specific plan
  if (selectedPlan) {
    return (
      <div style={{ minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
          padding: '2.5rem 3rem',
          borderRadius: '16px',
          marginBottom: '2.5rem',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
        }}>
          <button
            onClick={() => setSelectedPlan(null)}
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
            <i className="fas fa-arrow-left"></i> Back to My Plans
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
                <i className={`fas fa-${getTypeBadge(selectedPlan.type).icon}`} style={{ fontSize: '2.5rem', color: 'white' }}></i>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                  <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                    {selectedPlan.name}
                  </h1>
                  {selectedPlan.isTemplate && (
                    <div style={{
                      padding: '0.5rem 1rem',
                      background: 'rgba(255, 255, 255, 0.2)',
                      borderRadius: '8px',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      backdropFilter: 'blur(10px)'
                    }}>
                      <i className="fas fa-star"></i> Template
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.95rem' }}>
                  <span><i className="fas fa-book"></i> {selectedPlan.subject}</span>
                  <span><i className="fas fa-school"></i> {selectedPlan.grade}</span>
                  <span><i className="fas fa-folder"></i> {selectedPlan.folder}</span>
                  <span><i className="fas fa-history"></i> Version {selectedPlan.versions}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
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
                  <i className="fas fa-edit"></i> Edit Plan
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
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
                  >
                    <i className="fas fa-times"></i> Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      padding: '1rem 2rem',
                      background: 'rgba(16, 185, 129, 1)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <i className="fas fa-save"></i> Save Changes
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          {[
            { icon: 'download', label: 'Download PDF', color: '#094d88', onClick: () => handleDownload(selectedPlan, 'pdf') },
            { icon: 'file-word', label: 'Download Word', color: '#10ac8b', onClick: () => handleDownload(selectedPlan, 'word') },
            { icon: 'copy', label: 'Duplicate', color: '#094d88', onClick: () => handleDuplicate(selectedPlan) },
            { icon: 'star', label: 'Save as Template', color: '#10ac8b', onClick: () => handleSaveAsTemplate(selectedPlan) },
            { icon: 'share', label: 'Share', color: '#10ac8b', onClick: () => alert('Share functionality coming soon!') },
            { icon: 'print', label: 'Print', color: '#6366f1', onClick: () => window.print() }
          ].map((btn, i) => (
            <button
              key={i}
              onClick={btn.onClick}
              className="sign-in-btn"
              style={{
                fontSize: '0.9rem',
                padding: '0.75rem 1.5rem',
                background: `linear-gradient(135deg, ${btn.color} 0%, ${btn.color}dd 100%)`,
                boxShadow: `0 4px 12px ${btn.color}40`
              }}
            >
              <i className={`fas fa-${btn.icon}`}></i> {btn.label}
            </button>
          ))}
        </div>

        {/* Plan Content */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '3rem',
          marginBottom: '2rem'
        }}>
          {isEditMode ? (
            <div>
              <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#2d3748', fontSize: '1.3rem', fontWeight: 700 }}>
                  <i className="fas fa-edit"></i> Edit Mode
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                  <i className="fas fa-info-circle"></i> Changes are auto-saved
                </div>
              </div>
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                style={{
                  width: '100%',
                  minHeight: '600px',
                  padding: '1.5rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '1rem',
                  color: '#2d3748',
                  fontFamily: 'monospace',
                  lineHeight: '2',
                  resize: 'vertical',
                  outline: 'none',
                  transition: 'border-color 0.2s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          ) : (
            <div>
              <div style={{ marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '2px solid #f7fafc' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {selectedPlan.tags.map((tag, i) => (
                    <div key={i} style={{
                      padding: '0.5rem 1rem',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      color: 'white',
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                    }}>
                      <i className="fas fa-tag"></i> {tag}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#718096' }}>
                  <span><i className="fas fa-calendar-plus"></i> Created: {new Date(selectedPlan.createdDate).toLocaleDateString()}</span>
                  <span style={{ margin: '0 1rem' }}>•</span>
                  <span><i className="fas fa-calendar-edit"></i> Last Modified: {new Date(selectedPlan.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '2', color: '#2d3748', fontSize: '1rem' }}>
                {selectedPlan.content}
              </div>
            </div>
          )}
        </div>

        {/* Version History */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          padding: '2.5rem 3rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.3rem', fontWeight: 700 }}>
            <i className="fas fa-history"></i> Version History
          </h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {[
              { version: 3, date: '2024-03-18', user: 'You', changes: 'Updated assessment criteria and added differentiation strategies' },
              { version: 2, date: '2024-03-16', user: 'You', changes: 'Modified learning objectives and extended activity time' },
              { version: 1, date: '2024-03-15', user: 'You', changes: 'Initial creation via AI generator' }
            ].map((v, i) => (
              <div key={i} style={{
                padding: '1.5rem',
                background: '#f7fafc',
                borderRadius: '12px',
                border: '2px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.9rem'
                    }}>
                      V{v.version}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, color: '#2d3748' }}>{v.user}</div>
                      <div style={{ fontSize: '0.85rem', color: '#718096' }}>{new Date(v.date).toLocaleDateString()} at {new Date(v.date).toLocaleTimeString()}</div>
                    </div>
                  </div>
                  <div style={{ color: '#4a5568', fontSize: '0.95rem', marginLeft: '3.5rem' }}>
                    {v.changes}
                  </div>
                </div>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'white',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    color: '#094d88',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#094d88';
                    e.currentTarget.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white';
                    e.currentTarget.style.color = '#094d88';
                  }}
                >
                  <i className="fas fa-undo"></i> Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Main Plan Management View
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
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
              <i className="fas fa-folder-open" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                My Plans
              </h1>
              <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
                Manage and organize all your teaching plans
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFolderModal(true)}
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
            <i className="fas fa-folder-plus"></i> New Folder
          </button>
        </div>
      </div>

      {/* Folders Sidebar + Plans Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2rem' }}>
        {/* Folders Sidebar */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem',
            position: 'sticky',
            top: '2rem'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.1rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Folders
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {folders.map((folder) => (
                <button
                  key={folder.name}
                  onClick={() => setSelectedFolder(folder.name)}
                  style={{
                    padding: '1rem',
                    background: selectedFolder === folder.name
                      ? `linear-gradient(135deg, ${folder.color} 0%, ${folder.color}dd 100%)`
                      : 'white',
                    border: `2px solid ${selectedFolder === folder.name ? folder.color : '#e2e8f0'}`,
                    borderRadius: '12px',
                    color: selectedFolder === folder.name ? 'white' : '#2d3748',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    boxShadow: selectedFolder === folder.name ? `0 4px 12px ${folder.color}40` : 'none'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedFolder !== folder.name) {
                      e.currentTarget.style.borderColor = folder.color;
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedFolder !== folder.name) {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <i className={`fas fa-${folder.icon}`} style={{
                      fontSize: '1.1rem',
                      color: selectedFolder === folder.name ? 'white' : folder.color
                    }}></i>
                    <span>{folder.name === 'all' ? 'All Plans' : folder.name}</span>
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: selectedFolder === folder.name ? 'rgba(255,255,255,0.2)' : '#f7fafc',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}>
                    {folder.count}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plans Content */}
        <div>
          {/* Search and Filters */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '1rem', alignItems: 'center' }}>
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
                  placeholder="Search plans by name, subject, or tags..."
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

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                style={{
                  padding: '1rem 1.25rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '12px',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  outline: 'none',
                  background: 'white'
                }}
              >
                <option value="all">All Types</option>
                <option value="lesson">Lesson Plans</option>
                <option value="course">Course Plans</option>
                <option value="sow">Schemes of Work</option>
              </select>

              {/* View Mode Toggle */}
              <div style={{
                display: 'flex',
                background: '#f7fafc',
                padding: '0.5rem',
                borderRadius: '12px',
                gap: '0.5rem'
              }}>
                <button
                  onClick={() => setViewMode('grid')}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: viewMode === 'grid' ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: viewMode === 'grid' ? '#094d88' : '#718096',
                    fontWeight: 600,
                    boxShadow: viewMode === 'grid' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-th"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  style={{
                    padding: '0.75rem 1.25rem',
                    background: viewMode === 'list' ? 'white' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: viewMode === 'list' ? '#094d88' : '#718096',
                    fontWeight: 600,
                    boxShadow: viewMode === 'list' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <i className="fas fa-list"></i>
                </button>
              </div>

              {/* Results Count */}
              <div style={{
                padding: '1rem 1.5rem',
                background: '#f7fafc',
                borderRadius: '12px',
                color: '#718096',
                fontSize: '0.95rem',
                fontWeight: 600
              }}>
                {filteredPlans.length} plan{filteredPlans.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>

          {/* Plans Grid/List */}
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
                <i className="fas fa-search" style={{ fontSize: '3rem', color: '#cbd5e0' }}></i>
              </div>
              <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
                No Plans Found
              </h3>
              <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
                Try adjusting your search or filters
              </p>
            </div>
          ) : viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredPlans.map((plan) => {
                const badge = getTypeBadge(plan.type);
                return (
                  <div
                    key={plan.id}
                    style={{
                      background: 'white',
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      overflow: 'hidden',
                      cursor: 'pointer',
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
                      background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`,
                      padding: '1.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem'
                    }}>
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '12px',
                        background: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backdropFilter: 'blur(10px)'
                      }}>
                        <i className={`fas fa-${badge.icon}`} style={{ fontSize: '1.5rem', color: 'white' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 600, marginBottom: '0.25rem' }}>
                          {badge.label}
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'white', fontWeight: 600 }}>
                          {plan.subject} • {plan.grade}
                        </div>
                      </div>
                      {plan.isTemplate && (
                        <i className="fas fa-star" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.25rem' }}></i>
                      )}
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.5rem' }}>
                      <h4 style={{
                        margin: '0 0 1rem 0',
                        color: '#2d3748',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        lineHeight: '1.4',
                        minHeight: '2.8rem'
                      }}>
                        {plan.name}
                      </h4>

                      {/* Tags */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem', minHeight: '2rem' }}>
                        {plan.tags.slice(0, 3).map((tag, i) => (
                          <div key={i} style={{
                            padding: '0.25rem 0.75rem',
                            background: '#f7fafc',
                            color: '#094d88',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            {tag}
                          </div>
                        ))}
                      </div>

                      {/* Meta Info */}
                      <div style={{
                        paddingTop: '1rem',
                        borderTop: '1px solid #f7fafc',
                        fontSize: '0.85rem',
                        color: '#718096',
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}>
                        <span><i className="fas fa-calendar"></i> {new Date(plan.lastModified).toLocaleDateString()}</span>
                        <span><i className="fas fa-history"></i> V{plan.versions}</span>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                        <button
                          onClick={() => handleViewPlan(plan)}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`,
                            border: 'none',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                        <button
                          onClick={() => handleEdit(plan)}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: 'white',
                            border: `2px solid ${badge.color}`,
                            borderRadius: '8px',
                            color: badge.color,
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = badge.color;
                            e.currentTarget.style.color = 'white';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'white';
                            e.currentTarget.style.color = badge.color;
                          }}
                        >
                          <i className="fas fa-edit"></i> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // List View
            <div style={{
              background: 'white',
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              overflow: 'hidden'
            }}>
              {filteredPlans.map((plan, index) => {
                const badge = getTypeBadge(plan.type);
                return (
                  <div
                    key={plan.id}
                    style={{
                      padding: '1.5rem 2rem',
                      borderBottom: index < filteredPlans.length - 1 ? '1px solid #f7fafc' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      cursor: 'pointer',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#f7fafc'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <div style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '12px',
                      background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <i className={`fas fa-${badge.icon}`} style={{ fontSize: '1.25rem', color: 'white' }}></i>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h4 style={{ margin: 0, color: '#2d3748', fontSize: '1.1rem', fontWeight: 700 }}>
                          {plan.name}
                        </h4>
                        {plan.isTemplate && (
                          <div style={{
                            padding: '0.25rem 0.75rem',
                            background: '#fef3c7',
                            color: '#10ac8b',
                            borderRadius: '6px',
                            fontSize: '0.75rem',
                            fontWeight: 600
                          }}>
                            <i className="fas fa-star"></i> Template
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                        {badge.label} • {plan.subject} • {plan.grade} • {plan.folder}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxWidth: '250px' }}>
                      {plan.tags.slice(0, 3).map((tag, i) => (
                        <div key={i} style={{
                          padding: '0.25rem 0.75rem',
                          background: '#f7fafc',
                          color: '#094d88',
                          borderRadius: '6px',
                          fontSize: '0.75rem',
                          fontWeight: 600
                        }}>
                          {tag}
                        </div>
                      ))}
                    </div>

                    <div style={{ fontSize: '0.85rem', color: '#718096', minWidth: '100px', textAlign: 'right' }}>
                      {new Date(plan.lastModified).toLocaleDateString()}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleViewPlan(plan)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          background: `linear-gradient(135deg, ${badge.color} 0%, ${badge.color}dd 100%)`,
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
                      <button
                        onClick={() => handleEdit(plan)}
                        style={{
                          padding: '0.75rem 1.25rem',
                          background: 'white',
                          border: `2px solid ${badge.color}`,
                          borderRadius: '8px',
                          color: badge.color,
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-edit"></i> Edit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Folder Modal */}
      {showFolderModal && (
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
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 80px rgba(0,0,0,0.3)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-folder-plus"></i> Create New Folder
            </h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name..."
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '12px',
                fontSize: '1rem',
                marginBottom: '1.5rem',
                outline: 'none'
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = '#094d88'}
              onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  setShowFolderModal(false);
                  setNewFolderName('');
                }}
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
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="sign-in-btn"
                style={{
                  flex: 1,
                  padding: '1rem',
                  fontSize: '1rem',
                  opacity: !newFolderName.trim() ? 0.5 : 1,
                  cursor: !newFolderName.trim() ? 'not-allowed' : 'pointer'
                }}
              >
                <i className="fas fa-check"></i> Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanManagement;
