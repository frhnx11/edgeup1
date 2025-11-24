import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import type { CareerData, TimelineNode } from '../../../../types/career';

interface CareerGuideModalProps {
  career: CareerData;
  studentName: string;
  onClose: () => void;
}

const CareerGuideModal = ({ career, studentName, onClose }: CareerGuideModalProps) => {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'exams' | 'colleges' | 'skills'>('roadmap');

  // Timeline Chart Options
  const timelineOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      borderColor: career.color,
      borderWidth: 2,
      textStyle: { color: '#ffffff' },
      formatter: (params: any) => {
        const data = career.timeline[params.dataIndex];
        return `<div style="padding: 8px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 8px;">${data.title}</div>
          <div style="font-size: 12px; color: #e0e0e0;">${data.description}</div>
        </div>`;
      }
    },
    grid: {
      left: '5%',
      right: '5%',
      top: '15%',
      bottom: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: career.timeline.map((_, index) => `Step ${index + 1}`),
      axisLabel: {
        color: '#718096',
        fontWeight: 600,
        interval: 0,
        rotate: 0
      },
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false }
    },
    yAxis: {
      type: 'value',
      show: false
    },
    series: [
      {
        name: 'Timeline',
        type: 'line',
        data: career.timeline.map((_, index) => index + 1),
        smooth: true,
        symbol: 'circle',
        symbolSize: 20,
        lineStyle: {
          color: career.color,
          width: 4
        },
        itemStyle: {
          color: career.color,
          borderColor: '#ffffff',
          borderWidth: 3
        },
        label: {
          show: true,
          position: 'top',
          formatter: (params: any) => career.timeline[params.dataIndex].year,
          color: '#1a202c',
          fontWeight: 700,
          fontSize: 12,
          distance: 15
        },
        markPoint: {
          data: career.timeline.map((node, index) => ({
            coord: [index, index + 1],
            symbol: 'pin',
            symbolSize: 0,
            label: {
              show: false
            }
          }))
        }
      }
    ]
  };

  const getDemandColor = (demand: string) => {
    if (demand === 'High') return '#10b981';
    if (demand === 'Medium') return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        padding: '20px',
        overflowY: 'auto'
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          maxWidth: '1200px',
          width: '100%',
          maxHeight: '95vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px rgba(0, 0, 0, 0.3)',
          margin: '20px 0'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hero Header */}
        <div
          style={{
            background: `linear-gradient(135deg, ${career.color} 0%, ${career.color}dd 100%)`,
            padding: '32px',
            borderRadius: '20px 20px 0 0',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              width: '44px',
              height: '44px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            ×
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '16px' }}>
            <div
              style={{
                width: '80px',
                height: '80px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <i className={`fas ${career.icon}`} style={{ color: '#ffffff', fontSize: '36px' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#ffffff', margin: '0' }}>
                  {career.name}
                </h1>
                <span
                  style={{
                    padding: '6px 14px',
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '700',
                    color: '#ffffff',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  {career.match}% Match
                </span>
              </div>
              <p style={{ fontSize: '16px', color: 'rgba(255, 255, 255, 0.95)', margin: '0' }}>
                {career.tagline}
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px' }}>
                Market Demand
              </div>
              <div
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <i className="fas fa-chart-line"></i>
                {career.marketInsights.demand}
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px' }}>
                Starting Salary
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                {career.marketInsights.startingSalary}
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(10px)',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}
            >
              <div style={{ fontSize: '12px', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '4px' }}>
                Growth Rate
              </div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff' }}>
                {career.marketInsights.growth}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div style={{ padding: '32px' }}>
          {/* Interactive Timeline */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(9, 77, 136, 0.05) 0%, rgba(16, 172, 139, 0.05) 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '2px solid rgba(9, 77, 136, 0.1)'
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <i className="fas fa-route" style={{ color: career.color }}></i>
              Career Journey Timeline
            </h2>
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px' }}>
              <ReactECharts option={timelineOption} style={{ height: '200px' }} />
            </div>

            {/* Timeline Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '20px' }}>
              {career.timeline.map((node, index) => (
                <div
                  key={index}
                  style={{
                    background: '#ffffff',
                    padding: '16px',
                    borderRadius: '12px',
                    border: `2px solid ${career.color}20`
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      marginBottom: '8px'
                    }}
                  >
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        background: career.color,
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        fontSize: '18px'
                      }}
                    >
                      <i className={`fas ${node.icon}`}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#718096', fontWeight: '600' }}>{node.year}</div>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{node.title}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '13px', color: '#4a5568', margin: '0', lineHeight: '1.5' }}>
                    {node.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabbed Content */}
          <div style={{ marginBottom: '32px' }}>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                borderBottom: '2px solid #e2e8f0',
                marginBottom: '24px'
              }}
            >
              {[
                { key: 'roadmap', icon: 'fa-map-marked-alt', label: 'Educational Roadmap' },
                { key: 'exams', icon: 'fa-graduation-cap', label: 'Entrance Exams' },
                { key: 'colleges', icon: 'fa-university', label: 'Top Colleges' },
                { key: 'skills', icon: 'fa-brain', label: 'Skills & Focus' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  style={{
                    padding: '12px 20px',
                    background: 'transparent',
                    border: 'none',
                    borderBottom: activeTab === tab.key ? `3px solid ${career.color}` : 'none',
                    color: activeTab === tab.key ? career.color : '#718096',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '-2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <i className={`fas ${tab.icon}`}></i>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'roadmap' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <div
                    style={{
                      background: '#f7fafc',
                      padding: '20px',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${career.color}`
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px', fontWeight: '600' }}>
                      STEP 1: CLASS 11-12
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
                      {career.roadmap.class11_12.join(' • ')}
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
                      <li>Focus on core subjects with strong foundation</li>
                      <li>Maintain 85%+ score in key subjects</li>
                      <li>Participate in relevant competitions</li>
                    </ul>
                  </div>

                  <div
                    style={{
                      background: '#f7fafc',
                      padding: '20px',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${career.color}`
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px', fontWeight: '600' }}>
                      STEP 2: ENTRANCE EXAM
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
                      {career.roadmap.entranceExam}
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
                      <li>Start preparation in Class 11</li>
                      <li>Join coaching or online courses</li>
                      <li>Practice previous year papers</li>
                    </ul>
                  </div>

                  <div
                    style={{
                      background: '#f7fafc',
                      padding: '20px',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${career.color}`
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px', fontWeight: '600' }}>
                      STEP 3: UNDERGRADUATE
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
                      {career.roadmap.undergraduate}
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
                      <li>4-5 years duration</li>
                      <li>Focus on practical skills and projects</li>
                      <li>Internships and industry exposure</li>
                    </ul>
                  </div>

                  {career.roadmap.postgraduate && (
                    <div
                      style={{
                        background: '#f7fafc',
                        padding: '20px',
                        borderRadius: '12px',
                        borderLeft: `4px solid ${career.color}`
                      }}
                    >
                      <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px', fontWeight: '600' }}>
                        STEP 4: POSTGRADUATE (OPTIONAL)
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
                        {career.roadmap.postgraduate}
                      </div>
                      <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
                        <li>Specialization in specific domain</li>
                        <li>Research opportunities</li>
                        <li>Higher career advancement</li>
                      </ul>
                    </div>
                  )}

                  <div
                    style={{
                      background: '#f7fafc',
                      padding: '20px',
                      borderRadius: '12px',
                      borderLeft: `4px solid ${career.color}`
                    }}
                  >
                    <div style={{ fontSize: '12px', color: '#718096', marginBottom: '8px', fontWeight: '600' }}>
                      FINAL: CAREER ENTRY
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '12px' }}>
                      {career.roadmap.careerEntry}
                    </div>
                    <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
                      <li>Campus placements or job applications</li>
                      <li>Build professional network</li>
                      <li>Continuous skill development</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'exams' && (
              <div>
                {career.entranceExams.map((exam, index) => (
                  <div
                    key={index}
                    style={{
                      background: '#ffffff',
                      border: '2px solid #e2e8f0',
                      borderRadius: '16px',
                      padding: '24px',
                      marginBottom: '20px'
                    }}
                  >
                    <div style={{ marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: '0 0 4px 0' }}>
                        {exam.name}
                      </h3>
                      <p style={{ fontSize: '14px', color: '#718096', margin: '0' }}>{exam.fullName}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Pattern</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>{exam.pattern}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Duration</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>{exam.duration}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '12px', color: '#718096', marginBottom: '4px' }}>Important Dates</div>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c' }}>{exam.dates}</div>
                      </div>
                    </div>

                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                        💡 Preparation Tips:
                      </div>
                      <ul style={{ margin: '0', paddingLeft: '20px', fontSize: '14px', color: '#4a5568' }}>
                        {exam.tips.map((tip, idx) => (
                          <li key={idx} style={{ marginBottom: '4px' }}>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a202c', marginBottom: '8px' }}>
                        📚 Recommended Resources:
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {exam.resources.map((resource, idx) => (
                          <span
                            key={idx}
                            style={{
                              padding: '6px 12px',
                              background: `${career.color}15`,
                              color: career.color,
                              borderRadius: '6px',
                              fontSize: '13px',
                              fontWeight: '600'
                            }}
                          >
                            {resource}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'colleges' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  {career.topColleges.map((college, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#ffffff',
                        border: '2px solid #e2e8f0',
                        borderRadius: '16px',
                        padding: '20px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = career.color;
                        e.currentTarget.style.boxShadow = `0 4px 16px ${career.color}30`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a202c', margin: '0 0 4px 0' }}>
                            {college.name}
                          </h3>
                          <div style={{ fontSize: '14px', color: '#718096', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-map-marker-alt"></i>
                            {college.location}
                          </div>
                        </div>
                        <span
                          style={{
                            padding: '6px 12px',
                            background: '#10b98115',
                            color: '#10b981',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700'
                          }}
                        >
                          {college.ranking}
                        </span>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px', fontWeight: '600' }}>
                            FEES (PER YEAR)
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{college.fees}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px', fontWeight: '600' }}>
                            CUTOFF
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c' }}>{college.cutoff}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: '11px', color: '#718096', marginBottom: '4px', fontWeight: '600' }}>
                            AVG PLACEMENT
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: '700', color: career.color }}>{college.placement}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                <div
                  style={{
                    background: '#f7fafc',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-laptop-code" style={{ color: career.color }}></i>
                    Technical Skills
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {career.skills.technical.map((skill, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a202c',
                          border: `1px solid ${career.color}30`
                        }}
                      >
                        • {skill}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#f7fafc',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-book-open" style={{ color: career.color }}></i>
                    Subject Focus
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {career.skills.subjects.map((subject, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a202c',
                          border: `1px solid ${career.color}30`
                        }}
                      >
                        • {subject}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#f7fafc',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-certificate" style={{ color: career.color }}></i>
                    Certifications
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {career.skills.certifications.map((cert, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a202c',
                          border: `1px solid ${career.color}30`
                        }}
                      >
                        • {cert}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    background: '#f7fafc',
                    padding: '20px',
                    borderRadius: '16px',
                    border: '2px solid #e2e8f0'
                  }}
                >
                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <i className="fas fa-comments" style={{ color: career.color }}></i>
                    Soft Skills
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {career.skills.softSkills.map((skill, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: '10px 14px',
                          background: '#ffffff',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#1a202c',
                          border: `1px solid ${career.color}30`
                        }}
                      >
                        • {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Career Progression */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '2px solid rgba(102, 126, 234, 0.1)'
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <i className="fas fa-chart-line" style={{ color: '#667eea' }}></i>
              Career Progression Path
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
              {career.progression.map((level, index) => (
                <div
                  key={index}
                  style={{
                    background: '#ffffff',
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${career.color}20`,
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '16px',
                      background: career.color,
                      color: '#ffffff',
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700'
                    }}
                  >
                    {level.years}
                  </div>
                  <h4 style={{ fontSize: '16px', fontWeight: '700', color: '#1a202c', marginTop: '8px', marginBottom: '8px' }}>
                    {level.title}
                  </h4>
                  <div
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: career.color,
                      marginBottom: '12px'
                    }}
                  >
                    {level.salary}
                  </div>
                  <ul style={{ margin: '0', paddingLeft: '18px', fontSize: '13px', color: '#4a5568', lineHeight: '1.6' }}>
                    {level.responsibilities.map((resp, idx) => (
                      <li key={idx}>{resp}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Action Checklist for Student */}
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(16, 172, 139, 0.08) 0%, rgba(5, 150, 105, 0.08) 100%)',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '32px',
              border: '2px solid rgba(16, 172, 139, 0.2)'
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <i className="fas fa-tasks" style={{ color: '#10ac8b' }}></i>
              Personalized Action Checklist for {studentName}
            </h2>
            <p style={{ fontSize: '14px', color: '#718096', marginBottom: '20px' }}>
              Based on current grade and performance level
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: '#fef3c7',
                    borderRadius: '8px'
                  }}
                >
                  <i className="fas fa-bolt" style={{ color: '#f59e0b' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#92400e' }}>IMMEDIATE ACTIONS</span>
                </div>
                {career.checklist.immediate.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      color: '#1a202c',
                      display: 'flex',
                      gap: '8px'
                    }}
                  >
                    <input type="checkbox" style={{ marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: '#dbeafe',
                    borderRadius: '8px'
                  }}
                >
                  <i className="fas fa-calendar-alt" style={{ color: '#3b82f6' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#1e40af' }}>SHORT-TERM (3-6 MONTHS)</span>
                </div>
                {career.checklist.shortTerm.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      color: '#1a202c',
                      display: 'flex',
                      gap: '8px'
                    }}
                  >
                    <input type="checkbox" style={{ marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: '#d1fae5',
                    borderRadius: '8px'
                  }}
                >
                  <i className="fas fa-flag-checkered" style={{ color: '#10b981' }}></i>
                  <span style={{ fontSize: '14px', fontWeight: '700', color: '#065f46' }}>LONG-TERM (1-2 YEARS)</span>
                </div>
                {career.checklist.longTerm.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: '12px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      border: '1px solid #e2e8f0',
                      fontSize: '13px',
                      color: '#1a202c',
                      display: 'flex',
                      gap: '8px'
                    }}
                  >
                    <input type="checkbox" style={{ marginTop: '2px' }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Helpful Resources */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #e2e8f0',
              marginBottom: '32px'
            }}
          >
            <h2
              style={{
                fontSize: '22px',
                fontWeight: '700',
                color: '#1a202c',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}
            >
              <i className="fas fa-link" style={{ color: career.color }}></i>
              Helpful Resources & Links
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
              {career.resources.map((resource, index) => (
                <a
                  key={index}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '16px',
                    background: '#f7fafc',
                    borderRadius: '12px',
                    border: '2px solid #e2e8f0',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = career.color;
                    e.currentTarget.style.background = `${career.color}10`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.background = '#f7fafc';
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      background: `${career.color}20`,
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: career.color,
                      fontSize: '18px'
                    }}
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '14px', fontWeight: '700', color: '#1a202c', marginBottom: '2px' }}>
                      {resource.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#718096', fontWeight: '600' }}>
                      {resource.type}
                    </div>
                  </div>
                  <i className="fas fa-arrow-right" style={{ color: career.color }}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              style={{
                flex: 1,
                padding: '16px',
                background: career.color,
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onClick={() => alert('Download PDF feature - Coming soon!')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = `0 8px 20px ${career.color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-download"></i>
              Download Complete Guide (PDF)
            </button>
            <button
              style={{
                flex: 1,
                padding: '16px',
                background: '#10ac8b',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
              onClick={() => alert('Schedule counseling feature - Coming soon!')}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(16, 172, 139, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <i className="fas fa-calendar-check"></i>
              Schedule Career Counseling
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerGuideModal;
