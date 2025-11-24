import ReactECharts from 'echarts-for-react';
import type { StudyTimeData, StudyCorrelation } from '../../../../../types';

interface TimeProductivityProps {
  studyTime: StudyTimeData;
  studyCorrelation: StudyCorrelation[];
}

const TimeProductivity = ({ studyTime, studyCorrelation }: TimeProductivityProps) => {

  // Chart 1: Study Time Distribution (Dual-ring Donut)
  const studyTimeDonutOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: '{b}: {c} hours ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#2d3748', fontWeight: 600 },
    },
    series: [
      {
        name: 'Actual Hours',
        type: 'pie',
        selectedMode: 'single',
        radius: ['30%', '50%'],
        center: ['35%', '50%'],
        label: {
          position: 'inner',
          fontSize: 10,
          formatter: '{d}%',
          color: '#ffffff',
          fontWeight: 600,
        },
        labelLine: {
          show: false,
        },
        data: studyTime.bySubject.map(s => ({
          value: s.actual,
          name: s.subject,
        })),
      },
      {
        name: 'Recommended Hours',
        type: 'pie',
        radius: ['55%', '70%'],
        center: ['35%', '50%'],
        itemStyle: {
          borderRadius: 6,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          formatter: '{b}\n{c}h / {d}%',
          fontWeight: 600,
          color: '#2d3748',
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold',
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        data: studyTime.bySubject.map((s, idx) => {
          const colors = ['#667eea', '#10ac8b', '#f59e0b', '#ec4899', '#06b6d4', '#8b5cf6'];
          return {
            value: s.recommended,
            name: s.subject,
            itemStyle: {
              color: colors[idx % colors.length],
            },
          };
        }),
      },
    ],
    animation: true,
    animationDuration: 800,
  };

  // Chart 2: Time vs Score Correlation (Scatter Plot)
  const scatterOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const data = studyCorrelation[params.dataIndex];
        return `<b>${data.subject}</b><br/>Study Hours: ${data.hours}h/week<br/>Score: ${data.score}%<br/>Tests: ${data.tests}`;
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '15%',
      top: '10%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Study Hours per Week',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#2d3748', fontWeight: 700, fontSize: 14 },
      min: 0,
      max: 7,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      name: 'Average Score',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: { color: '#2d3748', fontWeight: 700, fontSize: 14 },
      min: 75,
      max: 100,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    series: [
      {
        type: 'scatter',
        symbolSize: (data: number[]) => studyCorrelation[data[2]].tests * 3,
        data: studyCorrelation.map((s, idx) => [s.hours, s.score, idx]),
        itemStyle: {
          color: (params: any) => studyCorrelation[params.data[2]].color,
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        label: {
          show: true,
          formatter: (params: any) => studyCorrelation[params.data[2]].subject,
          position: 'top',
          color: '#2d3748',
          fontWeight: 600,
          fontSize: 11,
        },
      },
      // Trend line (simple linear approximation)
      {
        type: 'line',
        data: [
          [2.5, 80],
          [6, 95],
        ],
        lineStyle: {
          color: '#10ac8b',
          width: 2,
          type: 'dashed',
        },
        symbol: 'none',
        z: 0,
      },
    ],
    animation: true,
    animationDuration: 800,
  };

  return (
    <div style={{
      display: 'flex',
      gap: '1.5rem',
    }}>
      {/* Study Time Distribution */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-clock" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Study Time Distribution
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Actual vs Recommended study hours per subject • Inner ring: Actual • Outer ring: Recommended
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <ReactECharts
            option={studyTimeDonutOption}
            style={{ height: '400px', width: '100%' }}
            opts={{ renderer: 'canvas' }}
          />
        </div>
        <div style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f7fafc',
          borderRadius: '12px',
          borderLeft: '4px solid #10ac8b'
        }}>
          <p style={{ margin: 0, color: '#2d3748', fontWeight: 600 }}>
            <i className="fas fa-lightbulb" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i>
            Total Study Time This Week: <span style={{ color: '#10ac8b', fontSize: '1.25rem' }}>{studyTime.total} hours</span>
          </p>
        </div>
      </div>

      {/* Time vs Performance */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-chart-scatter" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            Time vs Performance
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Correlation between study hours and scores
          </p>
        </div>
        <ReactECharts
          option={scatterOption}
          style={{ height: '400px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>
    </div>
  );
};

export default TimeProductivity;
