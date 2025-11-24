import { useState } from 'react';
import { TN_BOARD_10TH_STUDY_RESOURCES } from '../../../../data/tn-board-10th-resources';
import type { StudyResource } from '../../../../types/curriculum.types';

const StudyResources = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'pdf' | 'video' | 'document' | 'link' | 'notes'>('all');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Use centralized resources data
  const resources: StudyResource[] = TN_BOARD_10TH_STUDY_RESOURCES;

  const subjects = ['all', 'Tamil', 'English', 'Mathematics', 'Science', 'Social Science', 'General'];

  const categories = [
    { id: 'all', label: 'All Resources', icon: 'fa-th', color: '#094d88' },
    { id: 'pdf', label: 'PDF Files', icon: 'fa-file-pdf', color: '#ef4444' },
    { id: 'video', label: 'Videos', icon: 'fa-video', color: '#8b5cf6' },
    { id: 'document', label: 'Documents', icon: 'fa-file-alt', color: '#10ac8b' },
    { id: 'link', label: 'Links', icon: 'fa-link', color: '#f59e0b' },
    { id: 'notes', label: 'Notes', icon: 'fa-sticky-note', color: '#06b6d4' }
  ];

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf': return 'fa-file-pdf';
      case 'video': return 'fa-video';
      case 'document': return 'fa-file-alt';
      case 'link': return 'fa-link';
      case 'notes': return 'fa-sticky-note';
      default: return 'fa-file';
    }
  };

  const getResourceColor = (type: string) => {
    switch (type) {
      case 'pdf': return '#ef4444';
      case 'video': return '#8b5cf6';
      case 'document': return '#10ac8b';
      case 'link': return '#f59e0b';
      case 'notes': return '#06b6d4';
      default: return '#718096';
    }
  };

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.type === selectedCategory;
    const matchesSubject = selectedSubject === 'all' || resource.subject === selectedSubject;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSubject && matchesSearch;
  });

  const handleDownload = (resource: Resource) => {
    alert(`Downloading: ${resource.title}`);
  };

  const handlePreview = (resource: Resource) => {
    alert(`Opening preview for: ${resource.title}`);
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-book-reader" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Study Resources
            </h1>
            <p>Access comprehensive learning materials and resources</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <i className="fas fa-download" style={{ color: 'white' }}></i>
              <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>
                {resources.reduce((sum, r) => sum + r.downloads, 0)} Downloads
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-folder-open"></i>
            </div>
            <div className="stat-info">
              <h4>Total Resources</h4>
              <p className="stat-value">
                {resources.length} <span className="stat-total">files</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-book"></i>
            </div>
            <div className="stat-info">
              <h4>Subjects Covered</h4>
              <p className="stat-value">
                {subjects.length - 1} <span className="stat-total">subjects</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <h4>Most Popular</h4>
              <p className="stat-value">
                {Math.max(...resources.map(r => r.downloads))} <span className="stat-total">downloads</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
      }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ position: 'relative', maxWidth: '600px' }}>
            <input
              type="text"
              placeholder="Search resources by title, subject, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '1rem 1.5rem',
                paddingLeft: '3.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '16px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'all 0.3s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10ac8b';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(16, 172, 139, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
            <i className="fas fa-search" style={{
              position: 'absolute',
              left: '1.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#a0aec0',
              fontSize: '1.125rem'
            }}></i>
          </div>
        </div>

        {/* Filters Section - Professional */}
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-filter"></i> Filter by Type
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as any)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.label}</option>
              ))}
            </select>
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#2d3748', marginBottom: '0.5rem' }}>
              <i className="fas fa-book-open"></i> Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#2d3748',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
            >
              {subjects.map((subject) => (
                <option key={subject} value={subject}>{subject === 'all' ? 'All Subjects' : subject}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedSubject('all');
              }}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f7fafc',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                color: '#2d3748',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-redo"></i> Reset Filters
            </button>
          </div>
        </div>

        {/* Removed old Subject Filter - now combined above */}
        <div style={{ display: 'none' }}>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                style={{
                  padding: '0.5rem 1rem',
                  background: selectedSubject === subject ? '#094d88' : '#f7fafc',
                  border: '2px solid',
                  borderColor: selectedSubject === subject ? '#094d88' : '#e2e8f0',
                  borderRadius: '25px',
                  color: selectedSubject === subject ? 'white' : '#2d3748',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  textTransform: subject === 'all' ? 'capitalize' : 'none'
                }}
                onMouseEnter={(e) => {
                  if (selectedSubject !== subject) {
                    e.currentTarget.style.borderColor = '#094d88';
                    e.currentTarget.style.color = '#094d88';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedSubject !== subject) {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#2d3748';
                  }
                }}
              >
                {subject === 'all' ? 'All Subjects' : subject}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: '1.5rem' }}>
        <p style={{ margin: 0, color: '#718096', fontSize: '1rem', fontWeight: 600 }}>
          Showing <span style={{ color: '#10ac8b', fontWeight: 700 }}>{filteredResources.length}</span> of {resources.length} resources
        </p>
      </div>

      {/* Resources Grid */}
      {filteredResources.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
              }}
            >
              {/* Resource Header */}
              <div style={{
                background: '#f7fafc',
                padding: '1.5rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: '#094d88',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    <i className={`fas ${getResourceIcon(resource.type)}`}></i>
                  </div>
                  <div style={{
                    background: '#e2e8f0',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '6px',
                    color: '#2d3748',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}>
                    {resource.type}
                  </div>
                </div>
              </div>

              {/* Resource Content */}
              <div style={{ padding: '1.5rem' }}>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#2d3748',
                  fontSize: '1.125rem',
                  fontWeight: 700,
                  lineHeight: 1.4
                }}>
                  {resource.title}
                </h3>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1rem'
                }}>
                  <span style={{
                    background: '#f7fafc',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    color: '#094d88',
                    fontWeight: 600
                  }}>
                    {resource.subject}
                  </span>
                  <span style={{
                    color: '#718096',
                    fontSize: '0.8rem',
                    fontWeight: 500
                  }}>
                    • {resource.size}
                  </span>
                </div>

                <p style={{
                  margin: '0 0 1.5rem 0',
                  color: '#718096',
                  fontSize: '0.9rem',
                  lineHeight: 1.6
                }}>
                  {resource.description}
                </p>

                {/* Resource Info */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  padding: '1rem',
                  background: '#f7fafc',
                  borderRadius: '12px',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Uploaded By
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#2d3748', fontWeight: 700 }}>
                      {resource.uploadedBy}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#718096', fontWeight: 600 }}>
                      Downloads
                    </p>
                    <p style={{ margin: 0, fontSize: '0.85rem', color: '#2d3748', fontWeight: 700 }}>
                      <i className="fas fa-download" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                      {resource.downloads}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    onClick={() => handlePreview(resource)}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      background: 'white',
                      border: '2px solid #e2e8f0',
                      borderRadius: '12px',
                      color: '#2d3748',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#094d88';
                      e.currentTarget.style.color = '#094d88';
                      e.currentTarget.style.background = '#f7fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.color = '#2d3748';
                      e.currentTarget.style.background = 'white';
                    }}
                  >
                    <i className="fas fa-eye"></i>
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(resource)}
                    style={{
                      flex: 1,
                      padding: '0.875rem',
                      background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      color: 'white',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(9, 77, 136, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(9, 77, 136, 0.3)';
                    }}
                  >
                    <i className="fas fa-download"></i>
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '4rem 2rem',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: '#f7fafc',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}>
            <i className="fas fa-search" style={{ fontSize: '2rem', color: '#718096' }}></i>
          </div>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            No Resources Found
          </h3>
          <p style={{ margin: 0, color: '#718096', fontSize: '1rem' }}>
            Try adjusting your filters or search query
          </p>
        </div>
      )}
    </>
  );
};

export default StudyResources;
