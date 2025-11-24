import { useState, useEffect } from 'react';
import AssessmentStage from './AssessmentStage';
import ResultsStage from './ResultsStage';
import ExplorationStage from './ExplorationStage';
import PlanningStage from './PlanningStage';
import PortfolioStage from './PortfolioStage';
import { isAssessmentCompleted, loadAssessmentResults } from '../../../../../services/careerMatcher';
import type { AssessmentAnswer, AssessmentResults } from '../../../../../types/assessment';

type Stage = 'assessment' | 'results' | 'exploration' | 'planning' | 'portfolio';

const CareerExplorer = () => {
  const [currentStage, setCurrentStage] = useState<Stage>('assessment');
  const [assessmentAnswers, setAssessmentAnswers] = useState<AssessmentAnswer[]>([]);
  const [assessmentResults, setAssessmentResults] = useState<AssessmentResults | null>(null);

  useEffect(() => {
    // Check if assessment is already completed
    if (isAssessmentCompleted()) {
      const saved = loadAssessmentResults();
      if (saved) {
        setAssessmentAnswers(saved.answers);
        setAssessmentResults(saved.results);
        setCurrentStage('results'); // Start from results if already completed
      }
    }
  }, []);

  const handleAssessmentComplete = (answers: AssessmentAnswer[], results: AssessmentResults) => {
    setAssessmentAnswers(answers);
    setAssessmentResults(results);
    setCurrentStage('results');
  };

  const stages = [
    { id: 'assessment', label: 'Assessment', icon: 'fa-clipboard-list' },
    { id: 'results', label: 'Results', icon: 'fa-chart-pie' },
    { id: 'exploration', label: 'Explore', icon: 'fa-search' },
    { id: 'planning', label: 'Plan', icon: 'fa-tasks' },
    { id: 'portfolio', label: 'Portfolio', icon: 'fa-folder-open' }
  ];

  const currentStageIndex = stages.findIndex(s => s.id === currentStage);

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text" style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <i className="fas fa-compass" style={{ fontSize: '36px' }}></i>
              Career Explorer & Aptitude Platform
            </h1>
            <p style={{ fontSize: '16px', opacity: 0.9 }}>
              Discover your ideal career path through assessment, exploration, and planning
            </p>
          </div>

          {/* Progress Tracker */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '15px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}>
              {stages.map((stage, index) => {
                const isActive = stage.id === currentStage;
                const isCompleted = index < currentStageIndex;
                const isAccessible = index <= currentStageIndex || (stage.id === 'results' && assessmentResults);

                return (
                  <div
                    key={stage.id}
                    onClick={() => isAccessible && setCurrentStage(stage.id as Stage)}
                    style={{
                      flex: '1',
                      minWidth: '140px',
                      textAlign: 'center',
                      cursor: isAccessible ? 'pointer' : 'not-allowed',
                      opacity: isAccessible ? 1 : 0.5,
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <div style={{
                      width: '60px',
                      height: '60px',
                      borderRadius: '50%',
                      background: isActive ? 'white' : isCompleted ? 'rgba(16, 172, 139, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                      color: isActive ? '#094d88' : 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      fontSize: '24px',
                      border: isActive ? '3px solid white' : '2px solid rgba(255, 255, 255, 0.3)',
                      transform: isActive ? 'scale(1.1)' : 'scale(1)',
                      boxShadow: isActive ? '0 8px 20px rgba(0, 0, 0, 0.2)' : 'none'
                    }}>
                      <i className={`fas ${stage.icon}`}></i>
                      {isCompleted && !isActive && (
                        <i className="fas fa-check" style={{
                          position: 'absolute',
                          fontSize: '14px',
                          background: '#10ac8b',
                          borderRadius: '50%',
                          padding: '4px',
                          marginTop: '-30px',
                          marginLeft: '30px'
                        }}></i>
                      )}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: isActive ? '600' : '500',
                      textShadow: isActive ? '0 2px 4px rgba(0, 0, 0, 0.2)' : 'none'
                    }}>
                      {stage.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div>
        {currentStage === 'assessment' && (
          <AssessmentStage onComplete={handleAssessmentComplete} />
        )}

        {currentStage === 'results' && assessmentResults && (
          <ResultsStage
            answers={assessmentAnswers}
            results={assessmentResults}
            onNext={() => setCurrentStage('exploration')}
          />
        )}

        {currentStage === 'exploration' && (
          <ExplorationStage
            assessmentResults={assessmentResults}
            onNext={() => setCurrentStage('planning')}
          />
        )}

        {currentStage === 'planning' && (
          <PlanningStage
            assessmentResults={assessmentResults}
            onNext={() => setCurrentStage('portfolio')}
          />
        )}

        {currentStage === 'portfolio' && (
          <PortfolioStage />
        )}
      </div>
    </>
  );
};

export default CareerExplorer;
