import { useState } from 'react';
import AIQuestionGenerator from './AIQuestionGenerator';
import ManualQuestionGenerator from './ManualQuestionGenerator';

interface QuestionPaperGeneratorProps {
  onBack?: () => void;
}

const QuestionPaperGenerator = ({ onBack }: QuestionPaperGeneratorProps) => {
  const [activeGenerator, setActiveGenerator] = useState<'ai' | 'manual' | null>(null);

  // If AI generator is active
  if (activeGenerator === 'ai') {
    return <AIQuestionGenerator onBack={() => setActiveGenerator(null)} />;
  }

  // If Manual generator is active
  if (activeGenerator === 'manual') {
    return <ManualQuestionGenerator onBack={() => setActiveGenerator(null)} />;
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
        {onBack && (
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
            <i className="fas fa-arrow-left"></i> Back
          </button>
        )}

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
            <i className="fas fa-file-alt" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Question Paper Generator
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Create professional question papers for TN Board 10th Standard
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
        {/* AI Question Generator */}
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
              <i className="fas fa-magic" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.75rem', fontWeight: 700 }}>
              AI Question Generator
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#4a5568', fontSize: '1rem', lineHeight: 1.6 }}>
              Let AI generate complete question papers based on TN Board syllabus, difficulty levels, and question types
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['AI-Powered', 'Fast Generation', 'TN Board Aligned', 'Auto Marking Scheme'].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              style={{
                background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.75rem',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
              }}
            >
              <i className="fas fa-bolt"></i>
              Generate with AI
            </button>
          </div>
        </div>

        {/* Manual Question Generator */}
        <div
          onClick={() => setActiveGenerator('manual')}
          style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(16, 185, 129, 0.2)',
            borderRadius: '20px',
            padding: '2.5rem',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.3)';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
          }}
        >
          {/* Decorative gradient blob */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.5rem',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)'
            }}>
              <i className="fas fa-edit" style={{ fontSize: '2.5rem', color: 'white' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.75rem 0', color: '#1a202c', fontSize: '1.75rem', fontWeight: 700 }}>
              Manual Question Generator
            </h3>
            <p style={{ margin: '0 0 1.5rem 0', color: '#4a5568', fontSize: '1rem', lineHeight: 1.6 }}>
              Create question papers manually with full control over each question, format, and marks distribution
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {['Full Control', 'Custom Questions', 'Question Bank', 'Flexible Format'].map((tag, i) => (
                <span
                  key={i}
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              style={{
                background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                color: 'white',
                border: 'none',
                padding: '0.875rem 1.75rem',
                borderRadius: '10px',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }}
            >
              <i className="fas fa-pencil-alt"></i>
              Create Manually
            </button>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#1a202c', fontSize: '1.25rem', fontWeight: 700 }}>
          <i className="fas fa-info-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
          Both Generators Include:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[
            { icon: 'file-pdf', text: 'PDF Download with EdgeUp Branding' },
            { icon: 'key', text: 'Auto-generated Answer Key' },
            { icon: 'clipboard-check', text: 'Detailed Marking Scheme' },
            { icon: 'edit', text: 'Edit & Refine Questions' }
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#10ac8b15',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <i className={`fas fa-${item.icon}`} style={{ color: '#10ac8b', fontSize: '1rem' }}></i>
              </div>
              <span style={{ color: '#4a5568', fontSize: '0.95rem', fontWeight: 500 }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionPaperGenerator;
