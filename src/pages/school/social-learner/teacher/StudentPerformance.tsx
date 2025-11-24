/**
 * Student Performance Analytics Page - Teacher Module
 * Futuristic view with ECharts for detailed student performance analysis
 */

import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import CareerGuideModal from './CareerGuideModal';
import { careerPathsData } from '../../../../data/careerData';
import type { CareerData } from '../../../../types/career';

interface StudentPerformanceProps {
  student: {
    id: string;
    name: string;
    rollNumber: string;
    avatar: string;
  };
  onBack: () => void;
}

const StudentPerformance = ({ student, onBack }: StudentPerformanceProps) => {
  const [selectedCareer, setSelectedCareer] = useState<CareerData | null>(null);

  // TN Board 10th Standard subjects with detailed data
  const subjects = [
    {
      id: 'math',
      name: 'Mathematics',
      score: 88,
      maxScore: 100,
      color: '#3b82f6',
      icon: 'fa-calculator',
      trend: [82, 84, 85, 87, 88],
      topicScores: {
        'Algebra': 92,
        'Geometry': 85,
        'Trigonometry': 88,
        'Statistics': 90,
        'Mensuration': 84
      }
    },
    {
      id: 'science',
      name: 'Science',
      score: 92,
      maxScore: 100,
      color: '#10ac8b',
      icon: 'fa-flask',
      trend: [88, 89, 90, 91, 92],
      topicScores: {
        'Physics': 94,
        'Chemistry': 90,
        'Biology': 92,
        'Practicals': 91
      }
    },
    {
      id: 'tamil',
      name: 'Tamil',
      score: 85,
      maxScore: 100,
      color: '#ef4444',
      icon: 'fa-language',
      trend: [80, 82, 83, 84, 85],
      topicScores: {
        'Grammar': 88,
        'Literature': 82,
        'Composition': 84,
        'Poetry': 86
      }
    },
    {
      id: 'english',
      name: 'English',
      score: 90,
      maxScore: 100,
      color: '#8b5cf6',
      icon: 'fa-book',
      trend: [85, 87, 88, 89, 90],
      topicScores: {
        'Grammar': 92,
        'Literature': 89,
        'Composition': 90,
        'Comprehension': 91
      }
    },
    {
      id: 'social',
      name: 'Social Science',
      score: 87,
      maxScore: 100,
      color: '#f59e0b',
      icon: 'fa-globe',
      trend: [83, 84, 85, 86, 87],
      topicScores: {
        'History': 88,
        'Geography': 86,
        'Civics': 87,
        'Economics': 87
      }
    }
  ];

  // Monthly performance data
  const performanceTrend = [
    { month: 'Jun', score: 82 },
    { month: 'Jul', score: 84 },
    { month: 'Aug', score: 86 },
    { month: 'Sep', score: 87 },
    { month: 'Oct', score: 88 }
  ];

  // Calculate metrics
  const avgScore = Math.round(subjects.reduce((sum, s) => sum + s.score, 0) / subjects.length);
  const attendancePercent = 92;
  const classRank = 2;

  // Performance Trend Chart Options
  const performanceTrendOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const data = params[0];
        return `<b>${data.name}</b><br/>Score: ${data.value}%`;
      },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: performanceTrend.map(d => d.month),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      min: 75,
      max: 95,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    series: [
      {
        name: 'Score',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        data: performanceTrend.map(d => d.score),
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(16, 172, 139, 0.5)' },
              { offset: 1, color: 'rgba(16, 172, 139, 0.05)' },
            ],
          },
        },
        lineStyle: {
          color: '#10ac8b',
          width: 3,
        },
        itemStyle: {
          color: '#10ac8b',
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      },
    ],
  };

  // Subject Comparison Chart Options
  const subjectComparisonOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: subjects.map(s => s.name),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: {
        color: '#718096',
        fontWeight: 600,
        interval: 0,
        rotate: 15
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    series: [
      {
        name: 'Score',
        type: 'bar',
        data: subjects.map(s => ({
          value: s.score,
          itemStyle: { color: s.color }
        })),
        barWidth: '50%',
        label: {
          show: true,
          position: 'top',
          formatter: '{c}%',
          color: '#1a202c',
          fontWeight: 700
        },
      },
    ],
  };

  // Subject Radar Chart Options
  const subjectRadarOption = {
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
    },
    radar: {
      indicator: subjects.map(s => ({ name: s.name, max: 100 })),
      shape: 'polygon',
      splitNumber: 5,
      name: {
        textStyle: {
          color: '#4a5568',
          fontWeight: 600,
        },
      },
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(16, 172, 139, 0.05)', 'rgba(16, 172, 139, 0.1)'],
        },
      },
      axisLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
    },
    series: [
      {
        name: 'Student Performance',
        type: 'radar',
        data: [
          {
            value: subjects.map(s => s.score),
            name: student.name,
            areaStyle: {
              color: 'rgba(16, 172, 139, 0.3)',
            },
            lineStyle: {
              color: '#10ac8b',
              width: 2,
            },
            itemStyle: {
              color: '#10ac8b',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <button
              onClick={onBack}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '2px solid rgba(255, 255, 255, 0.4)',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '1rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <i className="fas fa-arrow-left"></i> Back to Students
            </button>
            <h1>
              <span style={{ fontSize: '3rem', marginRight: '1rem' }}>{student.avatar}</span>
              {student.name}
            </h1>
            <p>Roll No: {student.rollNumber} | Detailed Performance Analytics</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-cards">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-bar"></i>
            </div>
            <div className="stat-info">
              <h4>Overall Average</h4>
              <p className="stat-value">
                {avgScore}% <span className="stat-total">out of 100</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${avgScore}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-info">
              <h4>Attendance Rate</h4>
              <p className="stat-value">
                {attendancePercent}% <span className="stat-total">present</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: `${attendancePercent}%` }}></div>
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="stat-info">
              <h4>Class Rank</h4>
              <p className="stat-value">
                #{classRank} <span className="stat-total">in class</span>
              </p>
              <div className="stat-progress">
                <div className="stat-progress-fill" style={{ width: '95%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Academic Overview Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-chart-line" style={{ color: '#10ac8b' }}></i>
            Academic Performance Overview
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Monthly performance trend showing consistent improvement
          </p>
        </div>
        <ReactECharts option={performanceTrendOption} style={{ height: '350px' }} />
      </div>

      {/* Subject Deep Dive Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Subject Scores Bar Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-book" style={{ color: '#3b82f6' }}></i>
              Subject-wise Performance
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Current scores across all subjects
            </p>
          </div>
          <ReactECharts option={subjectComparisonOption} style={{ height: '350px' }} />
        </div>

        {/* Subject Radar Chart */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-radar" style={{ color: '#10ac8b' }}></i>
              Performance Radar
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Visual comparison of subject strengths
            </p>
          </div>
          <ReactECharts option={subjectRadarOption} style={{ height: '350px' }} />
        </div>
      </div>

      {/* Detailed Subject Breakdown */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-list-check" style={{ color: '#8b5cf6' }}></i>
            Detailed Subject Analysis
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Topic-wise breakdown for each subject
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              style={{
                background: '#f7fafc',
                borderRadius: '12px',
                padding: '1.5rem',
                border: `2px solid ${subject.color}20`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: subject.color,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1.25rem'
                }}>
                  <i className={`fas ${subject.icon}`}></i>
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, color: '#1a202c', fontSize: '1.125rem', fontWeight: 700 }}>
                    {subject.name}
                  </h3>
                  <p style={{ margin: 0, color: subject.color, fontSize: '1.5rem', fontWeight: 700 }}>
                    {subject.score}%
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '1rem' }}>
                <div style={{ fontSize: '0.875rem', color: '#718096', marginBottom: '0.75rem', fontWeight: 600 }}>
                  Topic Breakdown:
                </div>
                {Object.entries(subject.topicScores).map(([topic, score]) => (
                  <div key={topic} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.875rem', color: '#4a5568', fontWeight: 500 }}>{topic}</span>
                      <span style={{ fontSize: '0.875rem', color: '#1a202c', fontWeight: 700 }}>{score}%</span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '6px',
                      background: '#e2e8f0',
                      borderRadius: '3px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${score}%`,
                        height: '100%',
                        background: subject.color,
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Predictions & Insights Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* Strengths */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '2px solid #10b98120'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-star" style={{ color: '#10b981' }}></i>
              Key Strengths
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Areas where the student excels
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: '#d1fae5',
              borderRadius: '10px',
              borderLeft: '4px solid #10b981'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-flask" style={{ color: '#065f46' }}></i>
                <span style={{ fontWeight: 700, color: '#065f46' }}>Science Excellence</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#065f46' }}>
                Consistently scoring above 90% with strong understanding of concepts
              </p>
            </div>

            <div style={{
              padding: '1rem',
              background: '#dbeafe',
              borderRadius: '10px',
              borderLeft: '4px solid #3b82f6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-book" style={{ color: '#1e40af' }}></i>
                <span style={{ fontWeight: 700, color: '#1e40af' }}>English Proficiency</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af' }}>
                Excellent comprehension and composition skills
              </p>
            </div>

            <div style={{
              padding: '1rem',
              background: '#e0e7ff',
              borderRadius: '10px',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-calculator" style={{ color: '#5b21b6' }}></i>
                <span style={{ fontWeight: 700, color: '#5b21b6' }}>Math Problem Solving</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#5b21b6' }}>
                Strong analytical skills in Algebra and Statistics
              </p>
            </div>
          </div>
        </div>

        {/* Areas for Improvement */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          border: '2px solid #f59e0b20'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fas fa-lightbulb" style={{ color: '#f59e0b' }}></i>
              Areas for Improvement
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Focus areas to boost performance
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{
              padding: '1rem',
              background: '#fef3c7',
              borderRadius: '10px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-calculator" style={{ color: '#92400e' }}></i>
                <span style={{ fontWeight: 700, color: '#92400e' }}>Mensuration in Math</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem' }}>
                Current: 84% - Needs practice with volume and surface area problems
              </p>
              <div style={{ fontSize: '0.8125rem', color: '#92400e', fontWeight: 600 }}>
                💡 Recommendation: Additional practice worksheets and visual aids
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: '#fef3c7',
              borderRadius: '10px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-language" style={{ color: '#92400e' }}></i>
                <span style={{ fontWeight: 700, color: '#92400e' }}>Tamil Literature</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem' }}>
                Current: 82% - Could improve poetry analysis and interpretation
              </p>
              <div style={{ fontSize: '0.8125rem', color: '#92400e', fontWeight: 600 }}>
                💡 Recommendation: More reading practice and discussion sessions
              </div>
            </div>

            <div style={{
              padding: '1rem',
              background: '#fef3c7',
              borderRadius: '10px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <i className="fas fa-globe" style={{ color: '#92400e' }}></i>
                <span style={{ fontWeight: 700, color: '#92400e' }}>Geography Concepts</span>
              </div>
              <p style={{ margin: 0, fontSize: '0.875rem', color: '#92400e', marginBottom: '0.5rem' }}>
                Current: 86% - Map work and location identification need focus
              </p>
              <div style={{ fontSize: '0.8125rem', color: '#92400e', fontWeight: 600 }}>
                💡 Recommendation: Use interactive maps and quizzes
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Predictions */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '16px',
        padding: '2rem',
        color: 'white',
        marginBottom: '2rem',
        boxShadow: '0 8px 24px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-brain"></i>
            AI-Powered Predictions & Insights
          </h2>
          <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>
            Data-driven predictions based on current performance trends
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Predicted Final Score</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>89%</div>
            <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>
              <i className="fas fa-arrow-up"></i> +1% from current trend
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Expected Rank</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>#2</div>
            <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>
              <i className="fas fa-equals"></i> Maintaining position
            </div>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Improvement Potential</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>High</div>
            <div style={{ fontSize: '0.8125rem', opacity: 0.8 }}>
              <i className="fas fa-chart-line"></i> Consistent upward trend
            </div>
          </div>
        </div>

        <div style={{
          marginTop: '1.5rem',
          padding: '1.25rem',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <i className="fas fa-robot" style={{ fontSize: '1.25rem' }}></i>
            <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>AI Recommendation</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.9375rem', lineHeight: 1.6 }}>
            {student.name} shows strong performance across most subjects with a consistent improvement trend.
            To reach 90%+ overall, focus on strengthening Mensuration concepts in Mathematics and Literature
            analysis in Tamil. Consider one-on-one tutoring sessions or peer study groups for these specific
            topics. The student has excellent potential to achieve top rank with targeted practice.
          </p>
        </div>
      </div>

      {/* Career Path Suggestions */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-compass" style={{ color: '#667eea' }}></i>
            Suggested Career Paths
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Based on academic performance and subject strengths
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* Career Option 1: Software Engineer */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(16, 172, 139, 0.08) 100%)',
            border: '2px solid #3b82f620',
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'relative',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedCareer(careerPathsData['software-engineer'])}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(59, 130, 246, 0.2)';
            e.currentTarget.style.borderColor = '#3b82f6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#3b82f620';
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#10b981',
              color: 'white',
              padding: '0.375rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              92% Match
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 16px rgba(59, 130, 246, 0.3)'
            }}>
              <i className="fas fa-laptop-code" style={{ color: 'white', fontSize: '1.75rem' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.125rem', fontWeight: 700 }}>
              Software Engineer
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#718096', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Excellent math and problem-solving skills align perfectly with software development
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
                Key Strengths:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>Mathematics 88%</span>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>Science 92%</span>
              </div>
            </div>

            <div style={{
              padding: '0.75rem',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: '#1e40af',
              fontWeight: 600
            }}>
              📚 Path: 11th PCM → JEE → B.Tech CS
            </div>
          </div>

          {/* Career Option 2: Doctor */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
            border: '2px solid #10b98120',
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'relative',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedCareer(careerPathsData['medical-doctor'])}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(16, 185, 129, 0.2)';
            e.currentTarget.style.borderColor = '#10b981';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#10b98120';
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#10b981',
              color: 'white',
              padding: '0.375rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              90% Match
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
            }}>
              <i className="fas fa-user-md" style={{ color: 'white', fontSize: '1.75rem' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.125rem', fontWeight: 700 }}>
              Medical Doctor
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#718096', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Strong science foundation and attention to detail make medicine a great fit
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
                Key Strengths:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: '#d1fae5',
                  color: '#065f46',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>Science 92%</span>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>Biology Focus</span>
              </div>
            </div>

            <div style={{
              padding: '0.75rem',
              background: 'rgba(16, 185, 129, 0.1)',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: '#065f46',
              fontWeight: 600
            }}>
              📚 Path: 11th PCB → NEET → MBBS
            </div>
          </div>

          {/* Career Option 3: Data Scientist */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(124, 58, 237, 0.08) 100%)',
            border: '2px solid #8b5cf620',
            borderRadius: '16px',
            padding: '1.5rem',
            position: 'relative',
            transition: 'all 0.3s',
            cursor: 'pointer'
          }}
          onClick={() => setSelectedCareer(careerPathsData['data-scientist'])}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-4px)';
            e.currentTarget.style.boxShadow = '0 12px 24px rgba(139, 92, 246, 0.2)';
            e.currentTarget.style.borderColor = '#8b5cf6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.borderColor = '#8b5cf620';
          }}>
            <div style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: '#f59e0b',
              color: 'white',
              padding: '0.375rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 700
            }}>
              88% Match
            </div>

            <div style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 8px 16px rgba(139, 92, 246, 0.3)'
            }}>
              <i className="fas fa-chart-bar" style={{ color: 'white', fontSize: '1.75rem' }}></i>
            </div>

            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.125rem', fontWeight: 700 }}>
              Data Scientist
            </h3>
            <p style={{ margin: '0 0 1rem 0', color: '#718096', fontSize: '0.875rem', lineHeight: 1.5 }}>
              Strong analytical skills and math proficiency perfect for data science
            </p>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', color: '#718096', marginBottom: '0.5rem', fontWeight: 600 }}>
                Key Strengths:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: '#dbeafe',
                  color: '#1e40af',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>Statistics 90%</span>
                <span style={{
                  padding: '0.25rem 0.75rem',
                  background: '#e0e7ff',
                  color: '#5b21b6',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600
                }}>Math 88%</span>
              </div>
            </div>

            <div style={{
              padding: '0.75rem',
              background: 'rgba(139, 92, 246, 0.1)',
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: '#5b21b6',
              fontWeight: 600
            }}>
              📚 Path: 11th PCM → B.Sc/B.Tech → M.Sc DS
            </div>
          </div>
        </div>

        {/* Additional Career Info */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
          border: '2px solid #667eea20',
          borderRadius: '12px',
          padding: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <i className="fas fa-lightbulb" style={{ color: 'white', fontSize: '1.25rem' }}></i>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#1a202c', marginBottom: '0.25rem', fontSize: '0.9375rem' }}>
              Career Guidance Tip
            </div>
            <p style={{ margin: 0, color: '#4a5568', fontSize: '0.875rem', lineHeight: 1.5 }}>
              These career suggestions are based on {student.name}'s current academic performance. Consider scheduling a career counseling session to explore detailed roadmaps, entrance exam preparation, and college options for each path.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Action Items */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a202c', fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <i className="fas fa-tasks" style={{ color: '#094d88' }}></i>
            Recommended Actions
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Next steps to support student progress
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          <button style={{
            padding: '1rem 1.5rem',
            background: '#094d88',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0a5ba0';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#094d88';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <i className="fas fa-calendar-plus"></i>
            Schedule Parent-Teacher Meeting
          </button>

          <button style={{
            padding: '1rem 1.5rem',
            background: '#10ac8b',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#0d9270';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#10ac8b';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <i className="fas fa-clipboard-list"></i>
            Assign Additional Practice
          </button>

          <button style={{
            padding: '1rem 1.5rem',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#5568d3';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#667eea';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <i className="fas fa-chart-pie"></i>
            Generate Progress Report
          </button>

          <button style={{
            padding: '1rem 1.5rem',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '0.9375rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#d97706';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#f59e0b';
            e.currentTarget.style.transform = 'translateY(0)';
          }}>
            <i className="fas fa-user-plus"></i>
            Recommend for Advanced Program
          </button>
        </div>
      </div>

      {/* Career Guide Modal */}
      {selectedCareer && (
        <CareerGuideModal
          career={selectedCareer}
          studentName={student.name}
          onClose={() => setSelectedCareer(null)}
        />
      )}
    </>
  );
};

export default StudentPerformance;
