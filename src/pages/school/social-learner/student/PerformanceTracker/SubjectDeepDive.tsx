import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { SubjectPerformance } from '../../../../../types';

interface SubjectDeepDiveProps {
  subjects: SubjectPerformance[];
}

const SubjectDeepDive = ({ subjects }: SubjectDeepDiveProps) => {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return 'fa-arrow-up';
      case 'down': return 'fa-arrow-down';
      case 'stable': return 'fa-minus';
      default: return 'fa-minus';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return '#10ac8b';
      case 'down': return '#ef4444';
      case 'stable': return '#f59e0b';
      default: return '#718096';
    }
  };

  // Mini sparkline for each subject card
  const getSparklineOption = (scores: { score: number }[]) => ({
    grid: { left: 0, right: 0, top: 2, bottom: 2 },
    xAxis: {
      type: 'category',
      show: false,
      data: scores.map((_, i) => i),
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        data: scores.map(s => s.score),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 4,
        lineStyle: {
          color: '#094d88',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(9, 77, 136, 0.3)' },
              { offset: 1, color: 'rgba(9, 77, 136, 0.05)' },
            ],
          },
        },
        itemStyle: {
          color: '#094d88',
        },
      },
    ],
    animation: false,
  });

  // Chapter Mastery Heatmap
  const heatmapOption = {
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const subjectIndex = params.data[1];
        const chapterIndex = params.data[0];
        const subject = subjects[subjectIndex];
        const chapter = subject.chapters[chapterIndex];
        return `<b>${subject.name}</b><br/>${chapter.name}<br/>Mastery: ${params.data[2]}%<br/>Topics: ${chapter.topics.filter(t => t.completed).length}/${chapter.topics.length} completed`;
      },
    },
    grid: {
      left: '15%',
      right: '5%',
      bottom: '15%',
      top: '5%',
    },
    xAxis: {
      type: 'category',
      data: ['Ch 1', 'Ch 2', 'Ch 3', 'Ch 4', 'Ch 5'],
      splitArea: { show: true },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    yAxis: {
      type: 'category',
      data: subjects.map(s => s.name),
      splitArea: { show: true },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      inRange: {
        color: ['#ef4444', '#f59e0b', '#fbbf24', '#a3e635', '#10ac8b'],
      },
      text: ['High Mastery', 'Low Mastery'],
      textStyle: { color: '#2d3748', fontWeight: 600 },
    },
    series: [
      {
        type: 'heatmap',
        data: subjects.flatMap((subject, subjectIdx) =>
          subject.chapters.map((chapter, chapterIdx) => [
            chapterIdx,
            subjectIdx,
            chapter.mastery,
          ])
        ),
        label: {
          show: true,
          formatter: (params: any) => `${params.data[2]}%`,
          fontWeight: 600,
          color: '#ffffff',
        },
        emphasis: {
          itemStyle: {
            borderColor: '#094d88',
            borderWidth: 3,
          },
        },
      },
    ],
    animation: true,
    animationDuration: 800,
  };

  // Question Type Accuracy Chart
  const questionAccuracyOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
    },
    legend: {
      data: ['MCQ', 'Short Answer', 'Long Answer', 'Practical'],
      bottom: 0,
      textStyle: { color: '#2d3748', fontWeight: 600 },
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '12%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      max: 100,
      axisLabel: {
        formatter: '{value}%',
        color: '#718096',
        fontWeight: 600,
      },
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'category',
      data: subjects.map(s => s.name),
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    series: [
      {
        name: 'MCQ',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: '{c}%',
          fontWeight: 600,
        },
        data: subjects.map(s => s.questionAccuracy.mcq),
        itemStyle: { color: '#667eea' },
      },
      {
        name: 'Short Answer',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: '{c}%',
          fontWeight: 600,
        },
        data: subjects.map(s => s.questionAccuracy.shortAnswer),
        itemStyle: { color: '#10ac8b' },
      },
      {
        name: 'Long Answer',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: '{c}%',
          fontWeight: 600,
        },
        data: subjects.map(s => s.questionAccuracy.longAnswer),
        itemStyle: { color: '#f59e0b' },
      },
      {
        name: 'Practical',
        type: 'bar',
        stack: 'total',
        label: {
          show: true,
          formatter: '{c}%',
          fontWeight: 600,
        },
        data: subjects.map(s => s.questionAccuracy.practical),
        itemStyle: { color: '#ec4899' },
      },
    ],
    animation: true,
    animationDuration: 800,
  };

  return (
    <div>
      {/* Enhanced Subject Cards */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-book" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Subject-wise Performance
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Detailed breakdown of your performance in each subject
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1rem'
        }}>
          {subjects.map((subject) => (
            <div
              key={subject.id}
              style={{
                background: '#f7fafc',
                border: `2px solid ${expandedSubject === subject.id ? subject.color : '#e2e8f0'}`,
                borderRadius: '16px',
                padding: '1rem',
                transition: 'all 0.3s',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
              }}
              onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = subject.color;
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${subject.color}30`;
              }}
              onMouseLeave={(e) => {
                if (expandedSubject !== subject.id) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Trend indicator */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                width: '32px',
                height: '32px',
                background: getTrendColor(subject.trend),
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${getTrendColor(subject.trend)}40`
              }}>
                <i className={`fas ${getTrendIcon(subject.trend)}`} style={{ color: 'white', fontSize: '0.875rem' }}></i>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.25rem', fontWeight: 700 }}>
                  {subject.name}
                </h3>
                <p style={{ margin: 0, color: '#718096', fontSize: '0.875rem' }}>
                  Rank: #{subject.classRank} / {subject.totalStudents} • {subject.improvementRate > 0 ? '+' : ''}{subject.improvementRate.toFixed(1)}% this month
                </p>
              </div>

              {/* Score display */}
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: subject.color }}>
                    {subject.currentScore}
                  </span>
                  <span style={{ fontSize: '1rem', color: '#718096', fontWeight: 600 }}>
                    / 100
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  width: '100%',
                  height: '12px',
                  background: '#e2e8f0',
                  borderRadius: '6px',
                  overflow: 'hidden',
                  marginBottom: '0.5rem'
                }}>
                  <div
                    style={{
                      width: `${subject.currentScore}%`,
                      height: '100%',
                      background: subject.color,
                      borderRadius: '6px',
                      transition: 'width 0.5s ease'
                    }}
                  />
                </div>

                {/* Grade badge */}
                <div style={{
                  display: 'inline-block',
                  background: subject.color,
                  color: 'white',
                  padding: '0.375rem 0.875rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 700
                }}>
                  Grade: {subject.grade}
                </div>
              </div>

              {/* Mini Sparkline */}
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', color: '#718096', fontWeight: 600 }}>
                  Last 10 Tests
                </p>
                <ReactECharts
                  option={getSparklineOption(subject.lastTenScores)}
                  style={{ height: '60px', width: '100%' }}
                  opts={{ renderer: 'canvas' }}
                />
              </div>

              {/* Expandable section */}
              {expandedSubject === subject.id && (
                <div style={{
                  marginTop: '1rem',
                  paddingTop: '1rem',
                  borderTop: '2px solid #e2e8f0',
                  animation: 'fadeIn 0.3s ease-in'
                }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#2d3748' }}>
                      <i className="fas fa-check-circle" style={{ color: '#10ac8b', marginRight: '0.5rem' }}></i>
                      Strengths
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {subject.strengths.map((s, i) => (
                        <span key={i} style={{
                          background: '#d1fae5',
                          color: '#065f46',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {s.chapter} ({s.score}%)
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 700, color: '#2d3748' }}>
                      <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i>
                      Areas to Improve
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {subject.weaknesses.map((w, i) => (
                        <span key={i} style={{
                          background: '#fee2e2',
                          color: '#991b1b',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px',
                          fontSize: '0.8rem',
                          fontWeight: 600
                        }}>
                          {w.chapter} ({w.score}%)
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chapter Mastery Heatmap */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-th" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Chapter Mastery Heatmap
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Visual representation of chapter-wise mastery across all subjects
          </p>
        </div>
        <ReactECharts
          option={heatmapOption}
          style={{ height: '400px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Question Type Accuracy */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-chart-bar" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Question Type Accuracy
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Performance breakdown by question type across subjects
          </p>
        </div>
        <ReactECharts
          option={questionAccuracyOption}
          style={{ height: '450px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};

export default SubjectDeepDive;
