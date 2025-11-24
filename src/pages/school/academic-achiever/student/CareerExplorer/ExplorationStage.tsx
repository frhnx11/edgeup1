import { useState } from 'react';
import { careerPathsData } from '../../../data/careerData';
import { emergingCareersData } from '../../../data/emergingCareers';
import CareerGuideModal from '../../teacher/CareerGuideModal';
import type { AssessmentResults } from '../../../types/assessment';
import type { CareerData } from '../../../types/career';

interface Props {
  assessmentResults: AssessmentResults | null;
  onNext: () => void;
}

const ExplorationStage = ({ assessmentResults, onNext }: Props) => {
  const [selectedCareer, setSelectedCareer] = useState<CareerData | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'emerging'>('all');

  const allCareers = Object.values({ ...careerPathsData, ...emergingCareersData });
  const emergingCareers = Object.values(emergingCareersData);

  const displayCareers = activeTab === 'all' ? allCareers : emergingCareers;

  return (
    <div>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
      }}>
        <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
          <i className="fas fa-search" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
          Explore Career Paths
        </h2>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              border: activeTab === 'all' ? 'none' : '2px solid #e9ecef',
              background: activeTab === 'all' ? 'linear-gradient(135deg, #094d88, #10ac8b)' : 'white',
              color: activeTab === 'all' ? 'white' : '#6c757d',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            All Careers ({allCareers.length})
          </button>
          <button
            onClick={() => setActiveTab('emerging')}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              border: activeTab === 'emerging' ? 'none' : '2px solid #e9ecef',
              background: activeTab === 'emerging' ? 'linear-gradient(135deg, #094d88, #10ac8b)' : 'white',
              color: activeTab === 'emerging' ? 'white' : '#6c757d',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            <i className="fas fa-rocket" style={{ marginRight: '8px' }}></i>
            Emerging Careers ({emergingCareers.length})
          </button>
        </div>

        {/* Career Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          {displayCareers.map(career => (
            <div
              key={career.id}
              onClick={() => setSelectedCareer(career)}
              style={{
                background: 'white',
                border: '2px solid #e9ecef',
                borderRadius: '15px',
                padding: '1.5rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = career.color;
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = `0 12px 30px ${career.color}30`;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e9ecef';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: career.color,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '1rem'
              }}>
                <i className={`fas ${career.icon}`}></i>
              </div>

              <h3 style={{ fontSize: '18px', color: '#094d88', marginBottom: '0.5rem' }}>
                {career.name}
              </h3>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '1rem' }}>
                {career.tagline}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  background: career.marketInsights.demand === 'High' ? '#10b981' : career.marketInsights.demand === 'Medium' ? '#f59e0b' : '#6c757d',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  {career.marketInsights.demand} Demand
                </span>
                <span style={{ fontSize: '14px', color: '#094d88', fontWeight: '600' }}>
                  Learn More <i className="fas fa-arrow-right"></i>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onNext}
          style={{
            background: 'linear-gradient(135deg, #094d88, #10ac8b)',
            color: 'white',
            border: 'none',
            padding: '1rem 3rem',
            borderRadius: '50px',
            fontSize: '18px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(9, 77, 136, 0.3)'
          }}
        >
          Plan Your Path <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
        </button>
      </div>

      {/* Career Detail Modal */}
      {selectedCareer && (
        <div
          onClick={() => setSelectedCareer(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'white',
              borderRadius: '20px',
              maxWidth: '1200px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto'
            }}
          >
            <CareerGuideModal career={selectedCareer} onClose={() => setSelectedCareer(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExplorationStage;
