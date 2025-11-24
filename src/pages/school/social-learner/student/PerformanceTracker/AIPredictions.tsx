import ReactECharts from 'echarts-for-react';
import type { PredictionsData } from '../../../../../types';

interface AIPredictionsProps {
  predictions: PredictionsData;
}

const AIPredictions = ({ predictions }: AIPredictionsProps) => {

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return '#10ac8b';
      case 'medium': return '#f59e0b';
      case 'high': return '#ef4444';
      default: return '#718096';
    }
  };

  // Chart 1: Board Exam Predictions
  const boardExamOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const exam = predictions.boardExam[params.dataIndex];
        return `
          <b>${exam.subject}</b><br/>
          Predicted: ${exam.predicted}%<br/>
          Range: ${exam.confidenceLow}% - ${exam.confidenceHigh}%<br/>
          Risk Level: <span style="color: ${getRiskColor(exam.riskLevel)}">${exam.riskLevel.toUpperCase()}</span><br/>
          <br/><b>Factors:</b><br/>
          ${exam.factors.map(f => `• ${f}`).join('<br/>')}
        `;
      },
    },
    grid: {
      left: '15%',
      right: '10%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      min: 75,
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
      data: predictions.boardExam.map(e => e.subject),
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    series: [
      // Error bars (confidence intervals)
      {
        type: 'custom',
        renderItem: (params: any, api: any) => {
          const exam = predictions.boardExam[params.dataIndex];
          const yValue = api.value(0);
          const lowPoint = api.coord([exam.confidenceLow, yValue]);
          const highPoint = api.coord([exam.confidenceHigh, yValue]);
          const height = api.size([0, 1])[1] * 0.3;

          return {
            type: 'group',
            children: [
              {
                type: 'line',
                shape: {
                  x1: lowPoint[0],
                  y1: lowPoint[1],
                  x2: highPoint[0],
                  y2: highPoint[1],
                },
                style: {
                  stroke: getRiskColor(exam.riskLevel),
                  lineWidth: 3,
                },
              },
              {
                type: 'line',
                shape: {
                  x1: lowPoint[0],
                  y1: lowPoint[1] - height / 2,
                  x2: lowPoint[0],
                  y2: lowPoint[1] + height / 2,
                },
                style: {
                  stroke: getRiskColor(exam.riskLevel),
                  lineWidth: 2,
                },
              },
              {
                type: 'line',
                shape: {
                  x1: highPoint[0],
                  y1: highPoint[1] - height / 2,
                  x2: highPoint[0],
                  y2: highPoint[1] + height / 2,
                },
                style: {
                  stroke: getRiskColor(exam.riskLevel),
                  lineWidth: 2,
                },
              },
            ],
          };
        },
        data: predictions.boardExam.map((_, idx) => idx),
        z: 1,
      },
      // Predicted score bars
      {
        type: 'bar',
        data: predictions.boardExam.map(e => ({
          value: e.predicted,
          itemStyle: {
            color: getRiskColor(e.riskLevel),
          },
        })),
        barWidth: '40%',
        label: {
          show: true,
          position: 'right',
          formatter: '{c}%',
          fontWeight: 700,
          color: '#2d3748',
        },
        z: 2,
      },
    ],
    animation: true,
    animationDuration: 800,
  };

  // Chart 2: Improvement Potential Matrix
  const improvementMatrixOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const data = predictions.improvementMatrix[params.dataIndex];
        let quadrant = '';
        if (data.currentScore < 85 && data.potential >= 88) quadrant = 'Focus Zone';
        else if (data.currentScore >= 85 && data.potential >= 88) quadrant = 'Rising Stars';
        else if (data.currentScore < 85 && data.potential < 88) quadrant = 'Urgent';
        else quadrant = 'Masters';
        return `<b>${data.subject}</b><br/>Current: ${data.currentScore}%<br/>Potential: ${data.potential}%<br/>Quadrant: ${quadrant}`;
      },
    },
    grid: {
      left: '12%',
      right: '10%',
      bottom: '12%',
      top: '5%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      name: 'Current Performance',
      nameLocation: 'middle',
      nameGap: 30,
      nameTextStyle: { color: '#2d3748', fontWeight: 700, fontSize: 14 },
      min: 80,
      max: 95,
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
          type: 'dashed',
        },
      },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    yAxis: {
      type: 'value',
      name: 'Improvement Potential',
      nameLocation: 'middle',
      nameGap: 40,
      nameTextStyle: { color: '#2d3748', fontWeight: 700, fontSize: 14 },
      min: 80,
      max: 100,
      splitLine: {
        lineStyle: {
          color: '#e2e8f0',
          type: 'dashed',
        },
      },
      axisLabel: { color: '#718096', fontWeight: 600 },
    },
    series: [
      // Quadrant backgrounds
      {
        type: 'custom',
        renderItem: () => ({
          type: 'group',
          children: [
            // Urgent quadrant (bottom-left)
            { type: 'rect', shape: { x: 0, y: 0, width: '45%', height: '48%' }, style: { fill: 'rgba(239, 68, 68, 0.05)' } },
            // Focus Zone (top-left)
            { type: 'rect', shape: { x: 0, y: '52%', width: '45%', height: '48%' }, style: { fill: 'rgba(245, 158, 11, 0.05)' } },
            // Masters (bottom-right)
            { type: 'rect', shape: { x: '55%', y: 0, width: '45%', height: '48%' }, style: { fill: 'rgba(16, 172, 139, 0.05)' } },
            // Rising Stars (top-right)
            { type: 'rect', shape: { x: '55%', y: '52%', width: '45%', height: '48%' }, style: { fill: 'rgba(102, 126, 234, 0.05)' } },
          ],
        }),
        data: [0],
        z: 0,
      },
      // Bubbles
      {
        type: 'scatter',
        symbolSize: (data: number[]) => predictions.improvementMatrix[data[2]].weightage * 8,
        data: predictions.improvementMatrix.map((m, idx) => [m.currentScore, m.potential, idx]),
        itemStyle: {
          color: (params: any) => {
            const m = predictions.improvementMatrix[params.data[2]];
            if (m.currentScore < 85 && m.potential >= 88) return '#f59e0b'; // Focus
            if (m.currentScore >= 85 && m.potential >= 88) return '#667eea'; // Rising
            if (m.currentScore < 85 && m.potential < 88) return '#ef4444'; // Urgent
            return '#10ac8b'; // Masters
          },
          borderColor: '#ffffff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: (params: any) => predictions.improvementMatrix[params.data[2]].subject,
          position: 'top',
          color: '#2d3748',
          fontWeight: 600,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.3)',
          },
        },
        z: 10,
      },
    ],
    animation: true,
    animationDuration: 800,
  };

  // Chart 3: Performance Forecast
  const forecastOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: '#094d88',
      borderWidth: 1,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const data = params[0];
        const forecast = predictions.forecast[data.dataIndex];
        if (forecast.isHistorical) {
          return `<b>${data.name}</b><br/>Score: ${data.value}%`;
        } else {
          return `<b>${data.name} (Predicted)</b><br/>Predicted: ${forecast.predicted}%<br/>Range: ${forecast.confidenceLow}% - ${forecast.confidenceHigh}%`;
        }
      },
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
      data: predictions.forecast.map(f => f.month),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisLabel: { color: '#718096', fontWeight: 600 },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#e2e8f0',
          type: 'dashed',
        },
      },
    },
    yAxis: {
      type: 'value',
      min: 82,
      max: 95,
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      splitLine: { lineStyle: { color: '#e2e8f0', type: 'dashed' } },
      axisLabel: {
        formatter: '{value}%',
        color: '#718096',
        fontWeight: 600,
      },
    },
    series: [
      // Historical data (solid line)
      {
        type: 'line',
        name: 'Actual',
        data: predictions.forecast.map(f => (f.isHistorical ? f.predicted : null)),
        lineStyle: {
          color: '#094d88',
          width: 3,
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#094d88',
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      },
      // Predicted data (dashed line)
      {
        type: 'line',
        name: 'Predicted',
        data: predictions.forecast.map(f => (!f.isHistorical ? f.predicted : null)),
        lineStyle: {
          color: '#10ac8b',
          width: 3,
          type: 'dashed',
        },
        symbol: 'circle',
        symbolSize: 8,
        itemStyle: {
          color: '#10ac8b',
          borderColor: '#ffffff',
          borderWidth: 2,
        },
      },
      // Confidence band (area)
      {
        type: 'line',
        name: 'Confidence Upper',
        data: predictions.forecast.map(f => (!f.isHistorical ? f.confidenceHigh : null)),
        lineStyle: {
          opacity: 0,
        },
        symbol: 'none',
        stack: 'confidence',
        areaStyle: {
          color: 'rgba(16, 172, 139, 0.2)',
        },
      },
      {
        type: 'line',
        name: 'Confidence Lower',
        data: predictions.forecast.map(f => (!f.isHistorical ? f.confidenceLow : null)),
        lineStyle: {
          opacity: 0,
        },
        symbol: 'none',
        areaStyle: {
          color: 'rgba(16, 172, 139, 0.2)',
        },
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
      {/* Board Exam Predictions */}
      <div style={{
        flex: 1,
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#2d3748', fontSize: '1.5rem', fontWeight: 700 }}>
            <i className="fas fa-robot" style={{ marginRight: '0.75rem', color: '#10ac8b' }}></i>
            AI Board Exam Predictions
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Predicted scores with confidence intervals • Color indicates risk level
          </p>
        </div>
        <ReactECharts
          option={boardExamOption}
          style={{ height: '400px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
      </div>

      {/* Improvement Potential Matrix */}
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
            Improvement Potential Matrix
          </h2>
          <p style={{ margin: 0, color: '#718096', fontSize: '0.9rem' }}>
            Strategic subject prioritization • Bubble size = Subject importance
          </p>
        </div>
        <ReactECharts
          option={improvementMatrixOption}
          style={{ height: '450px', width: '100%' }}
          opts={{ renderer: 'canvas' }}
        />
        <div style={{
          marginTop: '1rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', borderLeft: '4px solid #ef4444' }}>
            <strong style={{ color: '#ef4444' }}>Urgent:</strong> Low score, low potential
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', borderLeft: '4px solid #f59e0b' }}>
            <strong style={{ color: '#f59e0b' }}>Focus Zone:</strong> Low score, high potential
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(16, 172, 139, 0.1)', borderRadius: '8px', borderLeft: '4px solid #10ac8b' }}>
            <strong style={{ color: '#10ac8b' }}>Masters:</strong> High score, maintain
          </div>
          <div style={{ padding: '0.75rem', background: 'rgba(102, 126, 234, 0.1)', borderRadius: '8px', borderLeft: '4px solid #667eea' }}>
            <strong style={{ color: '#667eea' }}>Rising Stars:</strong> High score, high potential
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIPredictions;
