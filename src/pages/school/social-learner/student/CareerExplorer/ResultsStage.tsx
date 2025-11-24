import { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { matchCareers, getStreamRecommendations } from '../../../../../services/careerMatcher';
import type { AssessmentAnswer, AssessmentResults, CareerMatch, StreamRecommendation } from '../../../../../types/assessment';

interface Props {
  answers: AssessmentAnswer[];
  results: AssessmentResults;
  onNext: () => void;
}

const ResultsStage = ({ answers, results, onNext }: Props) => {
  const [careerMatches, setCareerMatches] = useState<CareerMatch[]>([]);
  const [streamRecommendations, setStreamRecommendations] = useState<StreamRecommendation[]>([]);

  useEffect(() => {
    const matches = matchCareers(answers, results);
    const streams = getStreamRecommendations(results, matches);
    setCareerMatches(matches);
    setStreamRecommendations(streams);
  }, [answers, results]);

  const topCareers = careerMatches.slice(0, 5);
  const topStream = streamRecommendations[0];

  // Radar Chart for Interest Scores
  const interestChartOption = {
    radar: {
      indicator: Object.entries(results.interestScores).map(([key, _]) => ({
        name: key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        max: 100
      }))
    },
    series: [{
      type: 'radar',
      data: [{
        value: Object.values(results.interestScores),
        name: 'Your Interests',
        areaStyle: { opacity: 0.3, color: '#10ac8b' },
        lineStyle: { color: '#094d88' }
      }]
    }]
  };

  return (
    <div>
      {/* Results Overview */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
      }}>
        <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
          <i className="fas fa-trophy" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
          Your Assessment Results
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {Object.entries(results.aptitudeScores).map(([skill, score]) => (
            <div key={skill} style={{
              background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
              borderRadius: '15px',
              padding: '1.5rem',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#094d88', marginBottom: '0.5rem' }}>
                {score}%
              </div>
              <div style={{ fontSize: '14px', color: '#6c757d', textTransform: 'capitalize' }}>
                {skill} Skills
              </div>
            </div>
          ))}
        </div>

        <ReactECharts option={interestChartOption} style={{ height: '400px' }} />
      </div>

      {/* Stream Recommendation */}
      <div style={{
        background: `linear-gradient(135deg, ${topStream?.stream === 'Science' ? '#094d88' : topStream?.stream === 'Commerce' ? '#10ac8b' : '#8b5cf6'}, ${topStream?.stream === 'Science' ? '#10ac8b' : topStream?.stream === 'Commerce' ? '#f59e0b' : '#ef4444'})`,
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        color: 'white'
      }}>
        <h2 style={{ fontSize: '24px', marginBottom: '1rem' }}>
          <i className="fas fa-graduation-cap" style={{ marginRight: '12px' }}></i>
          Recommended Stream: {topStream?.stream}
        </h2>
        <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '1rem' }}>
          {topStream?.matchPercentage}% Match
        </div>
        <ul style={{ marginLeft: '1.5rem' }}>
          {topStream?.reasoning.map((reason, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{reason}</li>
          ))}
        </ul>
      </div>

      {/* Top Career Matches */}
      <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
        <i className="fas fa-briefcase" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
        Your Top Career Matches
      </h2>

      <div style={{ display: 'grid', gap: '1.5rem', marginBottom: '2rem' }}>
        {topCareers.map((career, index) => (
          <div key={career.careerId} style={{
            background: 'white',
            borderRadius: '15px',
            padding: '1.5rem',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            border: index === 0 ? '3px solid #10ac8b' : 'none'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: career.color,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              flexShrink: 0
            }}>
              <i className={`fas ${career.icon}`}></i>
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '20px', color: '#094d88', margin: 0 }}>{career.careerName}</h3>
                <span style={{
                  background: '#10ac8b',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {career.matchPercentage}% Match
                </span>
                {index === 0 && (
                  <span style={{
                    background: '#ffc107',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    <i className="fas fa-star"></i> Best Match
                  </span>
                )}
              </div>
              <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '1rem' }}>{career.tagline}</p>
              {career.strengths.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {career.strengths.map((strength, idx) => (
                    <span key={idx} style={{
                      background: '#e9f7f4',
                      color: '#10ac8b',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '12px'
                    }}>
                      <i className="fas fa-check-circle" style={{ marginRight: '4px' }}></i>
                      {strength}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
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
          Explore Careers <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
        </button>
      </div>
    </div>
  );
};

export default ResultsStage;
