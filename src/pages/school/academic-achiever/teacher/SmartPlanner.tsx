import { useState } from 'react';
import LessonPlanGeneratorNew from './LessonPlanGeneratorNew';
import CoursePlanGenerator from './CoursePlanGenerator';
import PlanManagement from './PlanManagement';
import Collaboration from './Collaboration';
import Integrations from './Integrations';

interface Plan {
  id: string;
  name: string;
  type: 'lesson' | 'course' | 'sow';
  subject: string;
  grade: string;
  createdDate: string;
  lastModified: string;
}

const SmartPlanner = () => {
  const [activeGenerator, setActiveGenerator] = useState<'lesson' | 'course' | 'sow' | null>(null);
  const [showPlanManagement, setShowPlanManagement] = useState(false);
  const [showCollaboration, setShowCollaboration] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [plans] = useState<Plan[]>([
    {
      id: '1',
      name: 'Introduction to Quadratic Equations',
      type: 'lesson',
      subject: 'Mathematics',
      grade: 'Grade 10A',
      createdDate: '2024-03-15',
      lastModified: '2024-03-15'
    },
    {
      id: '2',
      name: 'Physics - Full Year Course',
      type: 'course',
      subject: 'Physics',
      grade: 'Grade 11',
      createdDate: '2024-03-10',
      lastModified: '2024-03-18'
    },
    {
      id: '3',
      name: 'Chemistry Semester 1 Scheme',
      type: 'sow',
      subject: 'Chemistry',
      grade: 'Grade 12',
      createdDate: '2024-03-05',
      lastModified: '2024-03-12'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'lesson':
        return { label: 'Lesson Plan', color: '#3b82f6', bg: '#dbeafe' };
      case 'course':
        return { label: 'Curriculum Plan', color: '#10b981', bg: '#d1fae5' };
      case 'sow':
        return { label: 'Scheme of Work', color: '#8b5cf6', bg: '#e0e7ff' };
      default:
        return { label: 'Unknown', color: '#718096', bg: '#f7fafc' };
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         plan.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || plan.type === filterType;
    return matchesSearch && matchesType;
  });

  // If plan management is active, show that component
  if (showPlanManagement) {
    return <PlanManagement onBack={() => setShowPlanManagement(false)} />;
  }

  // If collaboration is active, show that component
  if (showCollaboration) {
    return <Collaboration onBack={() => setShowCollaboration(false)} />;
  }

  // If integrations is active, show that component
  if (showIntegrations) {
    return <Integrations onBack={() => setShowIntegrations(false)} />;
  }

  // If a generator is active, show that component
  if (activeGenerator === 'lesson') {
    return <LessonPlanGeneratorNew onBack={() => setActiveGenerator(null)} />;
  }

  if (activeGenerator === 'course') {
    return <CoursePlanGenerator onBack={() => setActiveGenerator(null)} />;
  }

  // For now, Scheme of Work shows coming soon message
  if (activeGenerator === 'sow') {
    return (
      <div>
        <button
          onClick={() => setActiveGenerator(null)}
          style={{
            padding: '0.75rem 1.5rem',
            background: 'white',
            border: '2px solid #e2e8f0',
            borderRadius: '8px',
            color: '#2d3748',
            fontSize: '0.9rem',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '1.5rem'
          }}
        >
          <i className="fas fa-arrow-left"></i> Back to Smart Planner
        </button>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          padding: '4rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem',
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
          }}>
            <i className="fas fa-cog fa-spin" style={{ fontSize: '3rem', color: 'white' }}></i>
          </div>
          <h2 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '2rem', fontWeight: 700 }}>Coming Soon</h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '1.125rem' }}>Scheme of Work generator is under development</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1>
              <i className="fas fa-brain" style={{ marginRight: '1rem', color: '#10ac8b' }}></i>
              Smart Planner
            </h1>
            <p>AI-Powered Teaching Assistant - Generate lesson plans, curriculum plans, and schemes of work in minutes</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setShowPlanManagement(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-folder-open"></i> My Plans
            </button>
            <button
              onClick={() => setShowCollaboration(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-users"></i> Collaborate
            </button>
            <button
              onClick={() => setShowIntegrations(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: 600,
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <i className="fas fa-plug"></i> Integrations
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-file-alt"></i>
            </div>
            <div className="stat-info">
              <h4>Total Plans</h4>
              <p className="stat-value">
                24 <span className="stat-total">plans</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '100%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-clock"></i>
            </div>
            <div className="stat-info">
              <h4>Time Saved</h4>
              <p className="stat-value">
                48 <span className="stat-total">hours</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '85%' }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>This Month</h4>
              <p className="stat-value">
                8 <span className="stat-total">plans</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Generator Cards - Glassmorphism Design */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Lesson Plan Generator */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 172, 139, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(59, 130, 246, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(59, 130, 246, 0.2)';
          e.currentTarget.style.borderColor = '#3b82f6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
        }}>
          {/* Decorative gradient blob */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)'
            }}>
              <i className="fas fa-clipboard-list" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700 }}>
              Lesson Plan Generator
            </h3>
            <p style={{ margin: '0 0 2rem 0', color: '#4a5568', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Create detailed lesson plans with objectives, activities, and assessments in minutes
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveGenerator('lesson');
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.3)';
              }}
            >
              <i className="fas fa-magic"></i> Generate Now
            </button>
          </div>
        </div>

        {/* Curriculum Plan Generator */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(16, 185, 129, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.2)';
          e.currentTarget.style.borderColor = '#10b981';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
        }}>
          {/* Decorative gradient blob */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)'
            }}>
              <i className="fas fa-calendar-alt" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700 }}>
              Curriculum Plan Generator
            </h3>
            <p style={{ margin: '0 0 2rem 0', color: '#4a5568', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Plan your entire semester or year with structured timeline and milestones
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveGenerator('course');
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(16, 185, 129, 0.3)';
              }}
            >
              <i className="fas fa-magic"></i> Generate Now
            </button>
          </div>
        </div>

        {/* Scheme of Work Generator */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.05) 100%)',
          backdropFilter: 'blur(10px)',
          border: '2px solid rgba(139, 92, 246, 0.2)',
          borderRadius: '20px',
          padding: '2rem',
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.2)';
          e.currentTarget.style.borderColor = '#8b5cf6';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.2)';
        }}>
          {/* Decorative gradient blob */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 24px rgba(139, 92, 246, 0.3)'
            }}>
              <i className="fas fa-folder-open" style={{ fontSize: '2rem', color: 'white' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700 }}>
              Scheme of Work Generator
            </h3>
            <p style={{ margin: '0 0 2rem 0', color: '#4a5568', fontSize: '0.9375rem', lineHeight: 1.6 }}>
              Develop comprehensive schemes of work aligned with curriculum standards
            </p>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveGenerator('sow');
              }}
              style={{
                width: '100%',
                padding: '1rem',
                background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                transition: 'all 0.3s',
                boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(139, 92, 246, 0.3)';
              }}
            >
              <i className="fas fa-magic"></i> Generate Now
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats - Modern Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderLeft: '4px solid #3b82f6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>Lesson Plans</div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>+3</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c' }}>15</div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderLeft: '4px solid #10b981'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>Curriculum Plans</div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>+2</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c' }}>6</div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderLeft: '4px solid #8b5cf6'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>Schemes</div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>+1</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c' }}>3</div>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '1.5rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          borderLeft: '4px solid #f59e0b'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>Downloads</div>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>+8</span>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: '#1a202c' }}>42</div>
        </div>
      </div>

      {/* Search and Filter - Modern Design */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ flex: '1', minWidth: '280px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1a202c',
              marginBottom: '0.5rem'
            }}>
              <i className="fas fa-search" style={{ marginRight: '0.5rem', color: '#3b82f6' }}></i>
              Search Plans
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or subject..."
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                color: '#1a202c',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            />
          </div>

          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: 600,
              color: '#1a202c',
              marginBottom: '0.5rem'
            }}>
              <i className="fas fa-filter" style={{ marginRight: '0.5rem', color: '#10b981' }}></i>
              Filter by Type
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                fontSize: '0.9375rem',
                color: '#1a202c',
                background: 'white',
                cursor: 'pointer',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#10b981';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <option value="all">All Types</option>
              <option value="lesson">Lesson Plans</option>
              <option value="course">Curriculum Plans</option>
              <option value="sow">Schemes of Work</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchQuery('');
              setFilterType('all');
            }}
            style={{
              padding: '0.875rem 1.75rem',
              background: '#f7fafc',
              border: '2px solid #e2e8f0',
              borderRadius: '10px',
              color: '#4a5568',
              fontSize: '0.9375rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#edf2f7';
              e.currentTarget.style.borderColor = '#cbd5e0';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f7fafc';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <i className="fas fa-redo"></i> Reset
          </button>
        </div>
      </div>

      {/* Recent Plans - Professional Table */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }}>
        <div style={{
          padding: '1.5rem 2rem',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            margin: 0,
            color: '#1a202c',
            fontSize: '1.25rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <i className="fas fa-history" style={{ color: '#667eea' }}></i>
            Recent Plans
          </h3>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f7fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Plan Name
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Type
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Subject
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'left',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Grade
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Created
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Modified
                </th>
                <th style={{
                  padding: '1rem 1.5rem',
                  textAlign: 'center',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: '#4a5568',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((plan, index) => {
                const typeBadge = getTypeBadge(plan.type);
                return (
                  <tr
                    key={plan.id}
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      background: index % 2 === 0 ? 'white' : '#fafbfc',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#f7fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = index % 2 === 0 ? 'white' : '#fafbfc';
                    }}
                  >
                    <td style={{
                      padding: '1rem 1.5rem',
                      color: '#1a202c',
                      fontWeight: 600,
                      fontSize: '0.9375rem'
                    }}>
                      {plan.name}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.375rem 0.875rem',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        fontWeight: 600,
                        background: typeBadge.bg,
                        color: typeBadge.color
                      }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: typeBadge.color
                        }}></div>
                        {typeBadge.label}
                      </span>
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      color: '#4a5568',
                      fontSize: '0.9375rem',
                      fontWeight: 500
                    }}>
                      {plan.subject}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      color: '#4a5568',
                      fontSize: '0.9375rem',
                      fontWeight: 500
                    }}>
                      {plan.grade}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center',
                      color: '#718096',
                      fontSize: '0.875rem'
                    }}>
                      {plan.createdDate}
                    </td>
                    <td style={{
                      padding: '1rem 1.5rem',
                      textAlign: 'center',
                      color: '#718096',
                      fontSize: '0.875rem'
                    }}>
                      {plan.lastModified}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{
                        display: 'flex',
                        gap: '0.5rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                      }}>
                        <button style={{
                          padding: '0.5rem',
                          background: '#1a202c',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2d3748';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#1a202c';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                          <i className="fas fa-eye"></i>
                        </button>
                        <button style={{
                          padding: '0.5rem',
                          background: '#1a202c',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2d3748';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#1a202c';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button style={{
                          padding: '0.5rem',
                          background: '#1a202c',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          width: '36px',
                          height: '36px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#2d3748';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#1a202c';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                          <i className="fas fa-download"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div style={{
          padding: '1rem 2rem',
          background: '#f7fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ fontSize: '0.875rem', color: '#718096' }}>
            Showing <strong style={{ color: '#1a202c' }}>{filteredPlans.length}</strong> of <strong style={{ color: '#1a202c' }}>{plans.length}</strong> plans
          </div>
        </div>
      </div>
    </>
  );
};

export default SmartPlanner;
