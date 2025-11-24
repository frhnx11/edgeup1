import { useState } from 'react';
import AIAssignmentCreator from './AIAssignmentCreator';
import ManualAssignmentCreator from './ManualAssignmentCreator';

interface AssignmentGeneratorProps {
  onSave?: (assignment: any) => void;
}

const AssignmentGenerator = ({ onSave }: AssignmentGeneratorProps) => {
  const [activeGenerator, setActiveGenerator] = useState<'ai' | 'manual' | null>(null);

  // If AI generator is active
  if (activeGenerator === 'ai') {
    return <AIAssignmentCreator onBack={() => setActiveGenerator(null)} onSave={onSave} />;
  }

  // If Manual generator is active
  if (activeGenerator === 'manual') {
    return <ManualAssignmentCreator onBack={() => setActiveGenerator(null)} onSave={onSave} />;
  }

  // Main landing page with two options
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(90deg, #094d88 0%, #10ac8b 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
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
            <i className="fas fa-file-invoice" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Assignment Generator
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Create assignments manually or let AI generate them based on curriculum
            </p>
          </div>
        </div>
      </div>

      {/* Generator Options */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Manual Assignment Creator */}
        <div
          onClick={() => setActiveGenerator('manual')}
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(147, 51, 234, 0.2)',
            borderRadius: '20px',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(147, 51, 234, 0.3)';
            e.currentTarget.style.borderColor = '#9333ea';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(147, 51, 234, 0.2)';
          }}
        >
          {/* Decorative gradient blob */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 25px rgba(147, 51, 234, 0.4)'
            }}>
              <i className="fas fa-pencil-alt" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.75rem', fontWeight: 700 }}>
              Manual Creation
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#4a5568', fontSize: '1rem', lineHeight: 1.6 }}>
              Create assignments from scratch with full control over every detail
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{
                background: 'rgba(147, 51, 234, 0.1)',
                color: '#7c3aed',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <i className="fas fa-sliders-h" style={{ marginRight: '0.4rem' }}></i>
                Full Control
              </span>
              <span style={{
                background: 'rgba(147, 51, 234, 0.1)',
                color: '#7c3aed',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <i className="fas fa-tasks" style={{ marginRight: '0.4rem' }}></i>
                Custom Questions
              </span>
              <span style={{
                background: 'rgba(147, 51, 234, 0.1)',
                color: '#7c3aed',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <i className="fas fa-bolt" style={{ marginRight: '0.4rem' }}></i>
                Quick & Straightforward
              </span>
            </div>

            <button
              onClick={() => setActiveGenerator('manual')}
              style={{
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(147, 51, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(147, 51, 234, 0.3)';
              }}
            >
              Create Manually
              <i className="fas fa-arrow-right" style={{ marginLeft: '0.75rem' }}></i>
            </button>
          </div>
        </div>

        {/* AI Assignment Creator */}
        <div
          onClick={() => setActiveGenerator('ai')}
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(16, 172, 139, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '20px',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(59, 130, 246, 0.3)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.2)';
          }}
        >
          {/* AI Badge */}
          <div style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            background: 'linear-gradient(135deg, #10ac8b 0%, #0e9f7f 100%)',
            color: 'white',
            padding: '0.4rem 0.9rem',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            boxShadow: '0 4px 15px rgba(16, 172, 139, 0.4)',
            zIndex: 2
          }}>
            AI POWERED
          </div>

          {/* Decorative gradient blob */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)'
            }}>
              <i className="fas fa-robot" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.75rem', fontWeight: 700 }}>
              AI Generation
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#4a5568', fontSize: '1rem', lineHeight: 1.6 }}>
              Let AI generate comprehensive assignments based on curriculum, topics, and learning outcomes
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <span style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#2563eb',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <i className="fas fa-brain" style={{ marginRight: '0.4rem' }}></i>
                Intelligent Generation
              </span>
              <span style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#2563eb',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <i className="fas fa-clipboard-check" style={{ marginRight: '0.4rem' }}></i>
                Detailed Rubrics
              </span>
              <span style={{
                background: 'rgba(59, 130, 246, 0.1)',
                color: '#2563eb',
                padding: '0.4rem 0.9rem',
                borderRadius: '20px',
                fontSize: '0.85rem',
                fontWeight: 600
              }}>
                <i className="fas fa-clock" style={{ marginRight: '0.4rem' }}></i>
                Time-Saving
              </span>
            </div>

            <button
              onClick={() => setActiveGenerator('ai')}
              style={{
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                border: 'none',
                borderRadius: '12px',
                padding: '1rem 2rem',
                color: 'white',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                width: '100%',
                transition: 'all 0.3s',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(59, 130, 246, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(59, 130, 246, 0.3)';
              }}
            >
              Generate with AI
              <i className="fas fa-sparkles" style={{ marginLeft: '0.75rem' }}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentGenerator;
