import { useState } from 'react';
import type { AIRecommendation, QuickAction } from '../../../../../types';

interface ActionableInsightsProps {
  recommendations: AIRecommendation[];
  quickActions: QuickAction[];
}

const ActionableInsights = ({ recommendations, quickActions }: ActionableInsightsProps) => {
  const [expandedRecommendation, setExpandedRecommendation] = useState<string | null>(null);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10ac8b';
      default: return '#718096';
    }
  };

  const getDifficultyBadge = (difficulty: string) => {
    const colors = {
      easy: { bg: '#d1fae5', text: '#065f46' },
      medium: { bg: '#fef3c7', text: '#92400e' },
      hard: { bg: '#fee2e2', text: '#991b1b' },
    };
    const color = colors[difficulty as keyof typeof colors];
    return (
      <span style={{
        background: color.bg,
        color: color.text,
        padding: '0.25rem 0.625rem',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 700,
        textTransform: 'uppercase'
      }}>
        {difficulty}
      </span>
    );
  };

  const toggleAction = (id: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompletedActions(newCompleted);
  };

  // Sort quick actions by priority (descending)
  const sortedActions = [...quickActions].sort((a, b) => b.priority - a.priority);

  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
    }}>
      {/* AI-Powered Recommendations */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-robot" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            AI-Powered Recommendations
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Personalized suggestions based on your performance data • Click to expand for detailed action plan
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recommendations.map((recommendation) => (
            <div
              key={recommendation.id}
              style={{
                background: 'linear-gradient(135deg, #f7fafc 0%, #ffffff 100%)',
                border: `2px solid ${expandedRecommendation === recommendation.id ? getPriorityColor(recommendation.priority) : '#e2e8f0'}`,
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.3s',
                position: 'relative',
                cursor: 'pointer'
              }}
              onClick={() => setExpandedRecommendation(expandedRecommendation === recommendation.id ? null : recommendation.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = getPriorityColor(recommendation.priority);
                e.currentTarget.style.boxShadow = `0 8px 20px ${getPriorityColor(recommendation.priority)}20`;
              }}
              onMouseLeave={(e) => {
                if (expandedRecommendation !== recommendation.id) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Priority indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: getPriorityColor(recommendation.priority),
                color: 'white',
                padding: '0.25rem 0.75rem',
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {recommendation.priority}
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', paddingRight: '5rem' }}>
                {/* Icon */}
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: `${getPriorityColor(recommendation.priority)}15`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className={`fas ${recommendation.icon}`} style={{
                    fontSize: '1.5rem',
                    color: getPriorityColor(recommendation.priority)
                  }}></i>
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                    <span style={{
                      background: '#094d88',
                      color: 'white',
                      padding: '0.25rem 0.625rem',
                      borderRadius: '8px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {recommendation.subject}
                    </span>
                    {getDifficultyBadge(recommendation.difficulty)}
                    <span style={{
                      color: '#718096',
                      fontSize: '0.875rem'
                    }}>
                      <i className="fas fa-clock" style={{ marginRight: '0.25rem' }}></i>
                      {recommendation.timeRequired}
                    </span>
                  </div>

                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.125rem', fontWeight: 700 }}>
                    {recommendation.title}
                  </h3>
                  <p style={{ margin: '0 0 0.75rem 0', color: '#718096', fontSize: '0.9rem', lineHeight: 1.6 }}>
                    {recommendation.description}
                  </p>

                  {/* Impact badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#d1fae5',
                    color: '#065f46',
                    padding: '0.375rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    gap: '0.5rem'
                  }}>
                    <i className="fas fa-arrow-trend-up"></i>
                    {recommendation.impact}
                  </div>

                  {/* Expanded section */}
                  {expandedRecommendation === recommendation.id && (
                    <div style={{
                      marginTop: '1.5rem',
                      paddingTop: '1.5rem',
                      borderTop: '2px solid #e2e8f0',
                      animation: 'fadeIn 0.3s ease-in'
                    }}>
                      {/* Action Plan */}
                      <div style={{ marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1rem', fontWeight: 700 }}>
                          <i className="fas fa-list-check" style={{ marginRight: '0.5rem', color: '#10ac8b' }}></i>
                          Action Plan
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                          {recommendation.actionPlan.map((step, idx) => (
                            <div key={idx} style={{
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '0.75rem',
                              padding: '0.75rem',
                              background: '#f7fafc',
                              borderRadius: '8px',
                              borderLeft: '3px solid #10ac8b'
                            }}>
                              <div style={{
                                minWidth: '24px',
                                height: '24px',
                                background: '#10ac8b',
                                color: 'white',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}>
                                {idx + 1}
                              </div>
                              <span style={{ color: '#2d3748', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                {step}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      {recommendation.resources.length > 0 && (
                        <div>
                          <h4 style={{ margin: '0 0 1rem 0', color: '#2d3748', fontSize: '1rem', fontWeight: 700 }}>
                            <i className="fas fa-book" style={{ marginRight: '0.5rem', color: '#667eea' }}></i>
                            Recommended Resources
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {recommendation.resources.map((resource, idx) => (
                              <a
                                key={idx}
                                href={resource.link}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  padding: '0.75rem 1rem',
                                  background: '#ffffff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '8px',
                                  color: '#094d88',
                                  textDecoration: 'none',
                                  fontSize: '0.9rem',
                                  fontWeight: 600,
                                  transition: 'all 0.2s'
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = '#f7fafc';
                                  e.currentTarget.style.borderColor = '#094d88';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = '#ffffff';
                                  e.currentTarget.style.borderColor = '#e2e8f0';
                                }}
                              >
                                <i className="fas fa-arrow-right"></i>
                                {resource.title}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Items */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-clipboard-check" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Quick Action Items
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Priority-sorted tasks to boost your performance • {completedActions.size}/{sortedActions.length} completed
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          width: '100%',
          height: '8px',
          background: '#e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
          marginBottom: '2rem'
        }}>
          <div
            style={{
              width: `${(completedActions.size / sortedActions.length) * 100}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #10ac8b 0%, #059669 100%)',
              borderRadius: '4px',
              transition: 'width 0.3s ease'
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {sortedActions.map((action) => {
            const isCompleted = completedActions.has(action.id);
            return (
              <div
                key={action.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  background: isCompleted ? '#f0fdf4' : '#f7fafc',
                  border: `2px solid ${isCompleted ? '#10ac8b' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  transition: 'all 0.3s',
                  opacity: isCompleted ? 0.7 : 1
                }}
              >
                {/* Checkbox */}
                <div
                  onClick={() => toggleAction(action.id)}
                  style={{
                    minWidth: '28px',
                    height: '28px',
                    background: isCompleted ? '#10ac8b' : '#ffffff',
                    border: `2px solid ${isCompleted ? '#10ac8b' : '#cbd5e0'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  {isCompleted && <i className="fas fa-check" style={{ color: 'white', fontSize: '0.875rem' }}></i>}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    textDecoration: isCompleted ? 'line-through' : 'none',
                    color: isCompleted ? '#718096' : '#2d3748',
                    fontSize: '1rem',
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}>
                    {action.action}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', fontSize: '0.875rem', color: '#718096' }}>
                    <span>
                      <i className="fas fa-clock" style={{ marginRight: '0.25rem' }}></i>
                      {action.estimatedTime} mins
                    </span>
                    <span>
                      <i className="fas fa-calendar" style={{ marginRight: '0.25rem' }}></i>
                      Due: {new Date(action.deadline).toLocaleDateString()}
                    </span>
                    <span style={{ color: '#10ac8b', fontWeight: 600 }}>
                      <i className="fas fa-arrow-trend-up" style={{ marginRight: '0.25rem' }}></i>
                      {action.impact}
                    </span>
                  </div>
                </div>

                {/* Priority badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  {Array.from({ length: action.priority }).map((_, idx) => (
                    <div key={idx} style={{
                      width: '8px',
                      height: '24px',
                      background: action.priority >= 4 ? '#ef4444' : action.priority >= 3 ? '#f59e0b' : '#10ac8b',
                      borderRadius: '2px'
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActionableInsights;
