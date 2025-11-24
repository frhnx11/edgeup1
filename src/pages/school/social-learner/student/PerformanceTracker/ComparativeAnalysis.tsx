import ReactECharts from 'echarts-for-react';
import type { RankHistory, OverallMetrics } from '../../../../../types';

interface ComparativeAnalysisProps {
  rankHistory: RankHistory[];
  overall: OverallMetrics;
}

const ComparativeAnalysis = ({ rankHistory, overall }: ComparativeAnalysisProps) => {

  // Chart 1: Rank Progression Timeline (Inverted Y-axis - lower rank is better)
  const rankProgressionOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const data = params[0];
        const rankData = rankHistory[data.dataIndex];
        let tooltip = `<b>${data.name}</b><br/>Rank: #${data.value}<br/>Total: ${rankData.totalStudents} students`;
        if (rankData.milestone) {
          tooltip += `<br/><br/><i class="fas fa-star" style="color: #f59e0b;"></i> ${rankData.milestone}`;
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
      data: rankHistory.map(r => r.month),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      inverse: true, // Inverted: Lower rank = better = higher on chart
      min: 0,
      max: 15,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: {
        formatter: '#{value}',
        color: '#718096',
        fontWeight: 600,
      },
    },
    series: [
      {
        name: 'Class Rank',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: (value: number, params: any) => {
          return rankHistory[params.dataIndex].milestone ? 14 : 8;
        },
        data: rankHistory.map((r, index) => ({
          value: r.rank,
          itemStyle: {
            color: r.milestone ? '#f59e0b' : (index > 0 && r.rank < rankHistory[index - 1].rank ? '#10ac8b' : '#667eea'),
            borderColor: '#ffffff',
            borderWidth: 2,
          },
        })),
        lineStyle: {
          color: '#667eea',
          width: 3,
        },
        emphasis: {
          itemStyle: {
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: 'rgba(102, 126, 234, 0.5)',
          },
        },
        markLine: {
          silent: true,
          symbol: 'none',
          lineStyle: {
            color: '#10ac8b',
            type: 'dashed',
            width: 2,
          },
          data: [
            {
              yAxis: overall.classRank,
              label: {
                formatter: 'Current: #{c}',
                position: 'end',
                color: '#10ac8b',
                fontWeight: 600,
              },
            },
          ],
        },
      },
    ],
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
  };

  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '2rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
    }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
          <i className="fas fa-chart-line" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
          Rank Progression Timeline
        </h2>
        <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
          Track your class rank improvement over the last 12 months
        </p>
      </div>
      <ReactECharts
        option={rankProgressionOption}
        style={{ height: '550px', width: '100%' }}
        opts={{ renderer: 'canvas' }}
      />
    </div>
  );
};

export default ComparativeAnalysis;
