import { useState } from 'react';
import { internshipPrograms, getFeaturedInternships } from '../../../../../data/internshipPrograms';
import { saveSelectedStream, getSelectedStream } from '../../../../../services/portfolioService';
import type { AssessmentResults } from '../../../../../types/assessment';
import type { InternshipProgram } from '../../../../../types/portfolio';

interface Props {
  assessmentResults: AssessmentResults | null;
  onNext: () => void;
}

const PlanningStage = ({ assessmentResults, onNext }: Props) => {
  const [selectedStream, setSelectedStream] = useState<'Science' | 'Commerce' | 'Arts' | null>(getSelectedStream());
  const [internshipFilter, setInternshipFilter] = useState<string>('all');

  const handleSelectStream = (stream: 'Science' | 'Commerce' | 'Arts') => {
    setSelectedStream(stream);
    saveSelectedStream(stream);
  };

  const filteredInternships = internshipFilter === 'featured'
    ? getFeaturedInternships()
    : internshipFilter === 'all'
    ? internshipPrograms
    : internshipPrograms.filter(p => p.category === internshipFilter);

  const streams = [
    {
      name: 'Science' as const,
      icon: 'fa-flask',
      color: '#094d88',
      subjects: ['Physics', 'Chemistry', 'Mathematics', 'Biology/Computer Science'],
      careers: ['Engineer', 'Doctor', 'Scientist', 'Researcher']
    },
    {
      name: 'Commerce' as const,
      icon: 'fa-chart-line',
      color: '#10ac8b',
      subjects: ['Accountancy', 'Business Studies', 'Economics', 'Mathematics'],
      careers: ['CA', 'MBA', 'Economist', 'Entrepreneur']
    },
    {
      name: 'Arts' as const,
      icon: 'fa-palette',
      color: '#8b5cf6',
      subjects: ['English', 'History', 'Political Science', 'Psychology'],
      careers: ['Designer', 'Psychologist', 'Journalist', 'Lawyer']
    }
  ];

  return (
    <div>
      {/* Stream Selection */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
      }}>
        <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
          <i className="fas fa-graduation-cap" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
          Select Your Stream
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {streams.map(stream => (
            <div
              key={stream.name}
              onClick={() => handleSelectStream(stream.name)}
              style={{
                background: selectedStream === stream.name ? stream.color : 'white',
                color: selectedStream === stream.name ? 'white' : '#212529',
                border: selectedStream === stream.name ? 'none' : '2px solid #e9ecef',
                borderRadius: '15px',
                padding: '2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                if (selectedStream !== stream.name) {
                  e.currentTarget.style.borderColor = stream.color;
                  e.currentTarget.style.transform = 'translateY(-8px)';
                }
              }}
              onMouseOut={(e) => {
                if (selectedStream !== stream.name) {
                  e.currentTarget.style.borderColor = '#e9ecef';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {selectedStream === stream.name && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: 'white',
                  color: stream.color,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px'
                }}>
                  <i className="fas fa-check"></i>
                </div>
              )}

              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: selectedStream === stream.name ? 'rgba(255, 255, 255, 0.2)' : stream.color,
                color: selectedStream === stream.name ? 'white' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                marginBottom: '1rem'
              }}>
                <i className={`fas ${stream.icon}`}></i>
              </div>

              <h3 style={{ fontSize: '20px', marginBottom: '1rem', fontWeight: '700' }}>
                {stream.name}
              </h3>

              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ fontSize: '14px', opacity: selectedStream === stream.name ? 0.9 : 0.7 }}>
                  Core Subjects:
                </strong>
                <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
                  {stream.subjects.map((subject, idx) => (
                    <li key={idx} style={{ fontSize: '13px', marginBottom: '0.25rem' }}>{subject}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong style={{ fontSize: '14px', opacity: selectedStream === stream.name ? 0.9 : 0.7 }}>
                  Career Options:
                </strong>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {stream.careers.map((career, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: selectedStream === stream.name ? 'rgba(255, 255, 255, 0.2)' : stream.color + '20',
                        color: selectedStream === stream.name ? 'white' : stream.color,
                        padding: '4px 10px',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedStream && (
          <div style={{
            background: '#e9f7f4',
            border: '2px solid #10ac8b',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '16px', color: '#094d88', margin: 0 }}>
              <i className="fas fa-check-circle" style={{ marginRight: '8px', color: '#10ac8b' }}></i>
              <strong>Stream Selected:</strong> {selectedStream}
            </p>
          </div>
        )}
      </div>

      {/* Internship & Program Finder */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '2rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
      }}>
        <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
          <i className="fas fa-briefcase" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
          Internships & Programs
        </h2>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {['all', 'featured', 'technology', 'science', 'business', 'arts'].map(filter => (
            <button
              key={filter}
              onClick={() => setInternshipFilter(filter)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '25px',
                border: internshipFilter === filter ? 'none' : '2px solid #e9ecef',
                background: internshipFilter === filter ? 'linear-gradient(135deg, #094d88, #10ac8b)' : 'white',
                color: internshipFilter === filter ? 'white' : '#6c757d',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {filter === 'all' ? 'All Programs' : filter === 'featured' ? '⭐ Featured' : filter}
            </button>
          ))}
        </div>

        {/* Internship Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredInternships.slice(0, 6).map(program => (
            <div
              key={program.id}
              style={{
                background: 'white',
                border: program.featured ? '2px solid #ffc107' : '2px solid #e9ecef',
                borderRadius: '15px',
                padding: '1.5rem',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '16px', color: '#094d88', margin: 0, flex: 1 }}>
                  {program.title}
                </h3>
                {program.featured && (
                  <span style={{
                    background: '#ffc107',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    ⭐ Featured
                  </span>
                )}
              </div>

              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0.5rem' }}>
                <i className="fas fa-building" style={{ marginRight: '8px' }}></i>
                {program.organization}
              </div>

              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '0.5rem' }}>
                <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                {program.duration} • {program.mode}
              </div>

              <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '1rem' }}>
                <i className="fas fa-map-marker-alt" style={{ marginRight: '8px' }}></i>
                {program.location}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {program.skills.slice(0, 3).map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: '#e9f7f4',
                      color: '#10ac8b',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {program.stipend && (
                <div style={{
                  background: '#fff3cd',
                  color: '#856404',
                  padding: '8px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginTop: '1rem'
                }}>
                  <i className="fas fa-money-bill-wave" style={{ marginRight: '6px' }}></i>
                  {program.stipend}
                </div>
              )}
            </div>
          ))}
        </div>
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
          Build Portfolio <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
        </button>
      </div>
    </div>
  );
};

export default PlanningStage;
