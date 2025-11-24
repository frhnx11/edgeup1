import ReactECharts from 'echarts-for-react';
import type { TrendData, SubjectPerformance, ComparisonData } from '../../../../../types';

interface AcademicOverviewProps {
  performanceTrend: TrendData[];
  subjects: SubjectPerformance[];
  comparison: ComparisonData;
}

const AcademicOverview = ({ performanceTrend, subjects, comparison }: AcademicOverviewProps) => {

  // Chart 1: Performance Trend Area Chart
  const performanceTrendOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const data = params[0];
        const events = performanceTrend[data.dataIndex].events;
        let tooltip = `<b>${data.name}</b><br/>Score: ${data.value}%<br/>`;
        if (events && events.length > 0) {
          tooltip += `<br/><i class="fas fa-flag"></i> ${events.join(', ')}`;
        }
        return tooltip;
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
      min: 70,
      max: 100,
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
        emphasis: {
          itemStyle: {
            color: '#094d88',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(16, 172, 139, 0.5)',
          },
        },
        markLine: {
          silent: true,
          lineStyle: {
            color: '#f59e0b',
            type: 'dashed',
            width: 2,
          },
          data: [{ yAxis: 90, label: { formatter: 'Target: 90%', color: '#f59e0b' } }],
        },
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };

  // Chart 2: Subject Radar Chart
  const radarOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
    },
    legend: {
      data: ['Your Score', 'Class Average', 'Top Score'],
      bottom: 0,
      textStyle: { color: '#2d3748', fontWeight: 600 },
    },
    radar: {
      indicator: subjects.map(s => ({
        name: s.name,
        max: 100,
      })),
      shape: 'polygon',
      splitNumber: 4,
      axisName: {
        color: '#2d3748',
        fontWeight: 600,
      },
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(16, 172, 139, 0.05)', 'rgba(255, 255, 255, 0.05)'],
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
        type: 'radar',
        data: [
          {
            value: subjects.map(s => s.currentScore),
            name: 'Your Score',
            areaStyle: {
              color: 'rgba(9, 77, 136, 0.3)',
            },
            lineStyle: {
              color: '#094d88',
              width: 2,
            },
            itemStyle: {
              color: '#094d88',
            },
          },
          {
            value: subjects.map(s => s.classAverage),
            name: 'Class Average',
            areaStyle: {
              color: 'rgba(113, 128, 150, 0.2)',
            },
            lineStyle: {
              color: '#718096',
              width: 2,
              type: 'dashed',
            },
            itemStyle: {
              color: '#718096',
            },
          },
          {
            value: subjects.map(s => s.topScore),
            name: 'Top Score',
            areaStyle: {
              color: 'rgba(16, 172, 139, 0.2)',
            },
            lineStyle: {
              color: '#10ac8b',
              width: 2,
              type: 'dotted',
            },
            itemStyle: {
              color: '#10ac8b',
            },
          },
        ],
        emphasis: {
          lineStyle: {
            width: 3,
          },
        },
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };

  // Chart 3: Grade Distribution Donut Chart
  const gradeDistribution = {
    'A+': subjects.filter(s => s.currentScore >= 90).length,
    'A': subjects.filter(s => s.currentScore >= 80 && s.currentScore < 90).length,
    'B': subjects.filter(s => s.currentScore >= 70 && s.currentScore < 80).length,
    'Below B': subjects.filter(s => s.currentScore < 70).length,
  };

  const donutOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: '{b}: {c} subjects ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '10%',
      top: 'center',
      textStyle: { color: '#2d3748', fontWeight: 600 },
    },
    series: [
      {
        name: 'Grade Distribution',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          fontWeight: 600,
          color: '#2d3748',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        data: [
          { value: gradeDistribution['A+'], name: 'A+', itemStyle: { color: '#10ac8b' } },
          { value: gradeDistribution['A'], name: 'A', itemStyle: { color: '#667eea' } },
          { value: gradeDistribution['B'], name: 'B', itemStyle: { color: '#f59e0b' } },
          { value: gradeDistribution['Below B'], name: 'Below B', itemStyle: { color: '#ef4444' } },
        ],
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };

  return (
    <div>
      {/* Performance Trend Chart */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        marginBottom: '1.5rem'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-chart-area" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Performance Trend
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Your academic performance over the last 12 months
          </p>
        </div>
        <ReactECharts
          option={performanceTrendOption}
          style={{ height: '350px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Subject Radar and Grade Distribution - Side by Side */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
        gap: '1.5rem',
      }}>
        {/* Subject Radar Chart */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-chart-radar" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
              Subject Performance Comparison
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Compare your scores with class average and top performers
            </p>
          </div>
          <ReactECharts
            option={radarOption}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>

        {/* Grade Distribution Donut */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
              <i className="fas fa-chart-pie" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
              Grade Distribution
            </h2>
            <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
              Breakdown of grades across all subjects
            </p>
          </div>
          <ReactECharts
            option={donutOption}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
      </div>
    </div>
  );
};

export default AcademicOverview;
