import { useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface StudentSubjectScore {
  studentId: string;
  studentName: string;
  scores: {
    [subject: string]: number;
  };
}

interface SubjectPerformance {
  subject: string;
  average: number;
  excellent: number;
  good: number;
  needsAttention: number;
  topStudent: string;
  topScore: number;
  lowestStudent: string;
  lowestScore: number;
}

interface SubjectHeatmapProps {
  classId: string;
  className: string;
  students: StudentSubjectScore[];
}

const SubjectHeatmap = ({ classId, className, students }: SubjectHeatmapProps) => {
  const [selectedSubject, setSelectedSubject] = useState<SubjectPerformance | null>(null);
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Get all subjects from first student (assuming all students have same subjects)
  const subjects = students.length > 0 ? Object.keys(students[0].scores) : [];

  // Calculate performance metrics for each subject
  const calculateSubjectPerformance = (): SubjectPerformance[] => {
    return subjects.map((subject) => {
      const scores = students.map((s) => s.scores[subject]).filter((score) => score !== undefined);

      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;

      const excellent = scores.filter((score) => score >= 90).length;
      const good = scores.filter((score) => score >= 70 && score < 90).length;
      const needsAttention = scores.filter((score) => score < 70).length;

      const maxScore = Math.max(...scores);
      const minScore = Math.min(...scores);

      const topStudent = students.find((s) => s.scores[subject] === maxScore);
      const lowestStudent = students.find((s) => s.scores[subject] === minScore);

      return {
        subject,
        average: Math.round(average * 10) / 10,
        excellent,
        good,
        needsAttention,
        topStudent: topStudent?.studentName || 'N/A',
        topScore: maxScore,
        lowestStudent: lowestStudent?.studentName || 'N/A',
        lowestScore: minScore
      };
    });
  };

  const performanceData = calculateSubjectPerformance();

  // Get color based on score
  const getColor = (score: number): string => {
    if (score >= 90) return '#10b981'; // Green
    if (score >= 80) return '#84cc16'; // Light green
    if (score >= 70) return '#fbbf24'; // Yellow/Orange
    if (score >= 60) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  // Prepare data for eCharts
  const chartData = performanceData.map((perf, index) => [index, 0, perf.average]);

  // eCharts configuration
  const getOption = () => {
    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const subjectIndex = params.value[0];
          const perf = performanceData[subjectIndex];
          return `
            <div style="padding: 8px; min-width: 200px;">
              <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px; color: #1a202c;">
                ${perf.subject}
              </div>
              <div style="font-size: 20px; font-weight: 700; margin-bottom: 8px; color: ${getColor(perf.average)};">
                ${perf.average}%
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #10b981;">✅ Excellent (90+):</span>
                  <strong>${perf.excellent} students</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span style="color: #fbbf24;">⚠️ Good (70-89):</span>
                  <strong>${perf.good} students</strong>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #ef4444;">❌ Needs Attention (<70):</span>
                  <strong>${perf.needsAttention} students</strong>
                </div>
              </div>
              <div style="border-top: 1px solid #e2e8f0; padding-top: 8px; margin-top: 8px;">
                <div style="font-size: 11px; color: #718096; margin-bottom: 4px;">
                  🏆 Top: <strong style="color: #1a202c;">${perf.topStudent}</strong> (${perf.topScore}%)
                </div>
                <div style="font-size: 11px; color: #718096;">
                  📉 Lowest: <strong style="color: #1a202c;">${perf.lowestStudent}</strong> (${perf.lowestScore}%)
                </div>
              </div>
              <div style="margin-top: 8px; font-size: 11px; color: #718096; font-style: italic;">
                💡 Click for detailed analysis
              </div>
            </div>
          `;
        },
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        textStyle: {
          color: '#1a202c'
        }
      },
      grid: {
        height: '60%',
        top: '15%',
        left: '5%',
        right: '5%',
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: performanceData.map((p) => p.subject),
        splitArea: {
          show: false
        },
        axisLabel: {
          fontSize: 13,
          fontWeight: 600,
          color: '#1a202c',
          interval: 0,
          rotate: 0,
          margin: 15
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      yAxis: {
        type: 'category',
        data: ['Performance'],
        splitArea: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        }
      },
      visualMap: {
        min: 0,
        max: 100,
        show: false,
        inRange: {
          color: ['#ef4444', '#f59e0b', '#fbbf24', '#84cc16', '#10b981']
        }
      },
      series: [
        {
          name: 'Subject Performance',
          type: 'heatmap',
          data: chartData,
          label: {
            show: true,
            formatter: (params: any) => {
              const value = params.value[2];
              return `${value.toFixed(1)}%`;
            },
            fontSize: 16,
            fontWeight: 700,
            color: '#ffffff'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowColor: 'rgba(0, 0, 0, 0.3)',
              borderColor: '#ffffff',
              borderWidth: 3
            },
            label: {
              fontSize: 18,
              fontWeight: 700
            }
          },
          itemStyle: {
            borderRadius: 8,
            borderWidth: 3,
            borderColor: '#ffffff'
          }
        }
      ]
    };
  };

  const handleChartClick = (params: any) => {
    if (params.componentType === 'series') {
      const subjectIndex = params.value[0];
      const subject = performanceData[subjectIndex];
      setSelectedSubject(subject);
      setShowDrillDown(true);
    }
  };

  const onChartEvents = {
    click: handleChartClick
  };

  // Get students for selected subject
  const getSubjectStudents = () => {
    if (!selectedSubject) return [];

    return students
      .map((student) => ({
        name: student.studentName,
        score: student.scores[selectedSubject.subject] || 0
      }))
      .sort((a, b) => b.score - a.score);
  };

  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(9, 77, 136, 0.03) 0%, rgba(16, 172, 139, 0.03) 100%)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '30px',
        border: '2px solid rgba(9, 77, 136, 0.1)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1a202c',
                margin: '0 0 8px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #094d88 0%, #10ac8b 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(9, 77, 136, 0.3)'
                }}
              >
                <i className="fas fa-chart-bar" style={{ color: '#ffffff', fontSize: '20px' }}></i>
              </div>
              Subject Performance Heatmap
            </h2>
            <p style={{ fontSize: '14px', color: '#718096', margin: '0', marginLeft: '60px' }}>
              Class average performance across all subjects • Hover for details • Click to drill down
            </p>
          </div>

          {/* Legend */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              padding: '12px 16px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '10px',
              border: '1px solid rgba(9, 77, 136, 0.1)'
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '600', color: '#718096' }}>Performance:</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#10b981',
                  borderRadius: '4px',
                  border: '2px solid #ffffff'
                }}
              ></div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>90+</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#fbbf24',
                  borderRadius: '4px',
                  border: '2px solid #ffffff'
                }}
              ></div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>70-89</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: '#ef4444',
                  borderRadius: '4px',
                  border: '2px solid #ffffff'
                }}
              ></div>
              <span style={{ fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>&lt;70</span>
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Chart */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
        }}
      >
        <ReactECharts
          option={getOption()}
          style={{ height: '180px', width: '100%' }}
          onEvents={onChartEvents}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '12px',
          marginTop: '20px'
        }}
      >
        <div
          style={{
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(16, 185, 129, 0.2)'
          }}
        >
          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: '600', marginBottom: '4px' }}>
            BEST SUBJECT
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
            {performanceData.reduce((max, p) => (p.average > max.average ? p : max)).subject}
          </div>
          <div style={{ fontSize: '12px', color: '#718096' }}>
            {performanceData.reduce((max, p) => (p.average > max.average ? p : max)).average}% avg
          </div>
        </div>

        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <div style={{ fontSize: '11px', color: '#ef4444', fontWeight: '600', marginBottom: '4px' }}>
            NEEDS FOCUS
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
            {performanceData.reduce((min, p) => (p.average < min.average ? p : min)).subject}
          </div>
          <div style={{ fontSize: '12px', color: '#718096' }}>
            {performanceData.reduce((min, p) => (p.average < min.average ? p : min)).average}% avg
          </div>
        </div>

        <div
          style={{
            background: 'rgba(9, 77, 136, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(9, 77, 136, 0.2)'
          }}
        >
          <div style={{ fontSize: '11px', color: '#094d88', fontWeight: '600', marginBottom: '4px' }}>
            CLASS AVERAGE
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
            {(
              performanceData.reduce((sum, p) => sum + p.average, 0) / performanceData.length
            ).toFixed(1)}
            %
          </div>
          <div style={{ fontSize: '12px', color: '#718096' }}>Across all subjects</div>
        </div>

        <div
          style={{
            background: 'rgba(251, 191, 36, 0.1)',
            padding: '12px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(251, 191, 36, 0.2)'
          }}
        >
          <div style={{ fontSize: '11px', color: '#f59e0b', fontWeight: '600', marginBottom: '4px' }}>
            AT-RISK TOTAL
          </div>
          <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>
            {performanceData.reduce((sum, p) => sum + p.needsAttention, 0)}
          </div>
          <div style={{ fontSize: '12px', color: '#718096' }}>Students need attention</div>
        </div>
      </div>

      {/* Drill-Down Modal */}
      {showDrillDown && selectedSubject && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowDrillDown(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '700px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              style={{
                background: `linear-gradient(135deg, ${getColor(selectedSubject.average)} 0%, ${getColor(
                  selectedSubject.average - 10
                )} 100%)`,
                padding: '24px',
                borderRadius: '16px 16px 0 0'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', margin: '0 0 8px 0' }}>
                    {selectedSubject.subject}
                  </h2>
                  <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.9)', margin: '0' }}>
                    Detailed student performance analysis
                  </p>
                </div>
                <button
                  onClick={() => setShowDrillDown(false)}
                  style={{
                    width: '40px',
                    height: '40px',
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '20px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px' }}>
              {/* Performance Summary */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '16px',
                  marginBottom: '24px'
                }}
              >
                <div
                  style={{
                    background: '#f7fafc',
                    padding: '16px',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Class Average</div>
                  <div style={{ fontSize: '32px', fontWeight: '700', color: getColor(selectedSubject.average) }}>
                    {selectedSubject.average}%
                  </div>
                </div>

                <div
                  style={{
                    background: '#f7fafc',
                    padding: '16px',
                    borderRadius: '12px'
                  }}
                >
                  <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px' }}>Performance Breakdown</div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#10b981' }}>
                        {selectedSubject.excellent}
                      </div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>Excellent</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#fbbf24' }}>
                        {selectedSubject.good}
                      </div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>Good</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '700', color: '#ef4444' }}>
                        {selectedSubject.needsAttention}
                      </div>
                      <div style={{ fontSize: '11px', color: '#718096' }}>At Risk</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Students List */}
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px' }}>
                  All Students
                </h3>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {getSubjectStudents().map((student, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: index % 2 === 0 ? '#ffffff' : '#f7fafc',
                        borderRadius: '8px',
                        marginBottom: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            background:
                              index === 0
                                ? '#ffd700'
                                : index === 1
                                ? '#c0c0c0'
                                : index === 2
                                ? '#cd7f32'
                                : '#e2e8f0',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '12px',
                            color: index < 3 ? '#ffffff' : '#718096'
                          }}
                        >
                          {index + 1}
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>
                            {student.name}
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: '6px 12px',
                          background:
                            student.score >= 90
                              ? 'rgba(16, 185, 129, 0.1)'
                              : student.score >= 70
                              ? 'rgba(251, 191, 36, 0.1)'
                              : 'rgba(239, 68, 68, 0.1)',
                          color: student.score >= 90 ? '#10b981' : student.score >= 70 ? '#f59e0b' : '#ef4444',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '700'
                        }}
                      >
                        {student.score}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              {selectedSubject.needsAttention > 0 && (
                <div
                  style={{
                    marginTop: '24px',
                    padding: '16px',
                    background: 'rgba(239, 68, 68, 0.05)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '12px'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '12px'
                    }}
                  >
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        background: '#ef4444',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <i className="fas fa-lightbulb" style={{ color: '#ffffff', fontSize: '16px' }}></i>
                    </div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', margin: 0 }}>
                      Intervention Recommendations
                    </h4>
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '13px', color: '#1a202c', lineHeight: '1.6' }}>
                    <li>Schedule additional practice sessions for {selectedSubject.needsAttention} at-risk students</li>
                    <li>Provide personalized study materials focusing on weak areas</li>
                    <li>Consider peer tutoring with top performers</li>
                    <li>Plan one-on-one discussions with parents of struggling students</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectHeatmap;
