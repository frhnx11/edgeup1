import { useState, useEffect } from 'react';
import {
  getPortfolio,
  addCertificate,
  addProject,
  addCompetition,
  updateSoftSkillLevel,
  getPortfolioStats,
  getResumeData,
  generateId
} from '../../../services/portfolioService';
import type { Portfolio, Certificate, Project, Competition, SoftSkill } from '../../../types/portfolio';
import jsPDF from 'jspdf';

const PortfolioStage = () => {
  const [portfolio, setPortfolio] = useState<Portfolio>(getPortfolio());
  const [activeTab, setActiveTab] = useState<'overview' | 'certificates' | 'projects' | 'competitions' | 'skills' | 'resume'>('overview');
  const [showAddForm, setShowAddForm] = useState(false);

  const stats = getPortfolioStats();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'fa-th-large' },
    { id: 'certificates', label: 'Certificates', icon: 'fa-certificate' },
    { id: 'projects', label: 'Projects', icon: 'fa-project-diagram' },
    { id: 'competitions', label: 'Competitions', icon: 'fa-trophy' },
    { id: 'skills', label: 'Soft Skills', icon: 'fa-user-check' },
    { id: 'resume', label: 'Resume', icon: 'fa-file-pdf' }
  ];

  const handleAddCertificate = () => {
    const newCert: Certificate = {
      id: generateId('cert'),
      title: 'New Certificate',
      issuedBy: 'Organization Name',
      issuedDate: new Date().toISOString().split('T')[0],
      category: 'academic'
    };
    addCertificate(newCert);
    setPortfolio(getPortfolio());
  };

  const handleAddProject = () => {
    const newProject: Project = {
      id: generateId('proj'),
      title: 'New Project',
      description: 'Project description here',
      category: 'coding',
      skills: ['Skill 1', 'Skill 2'],
      startDate: new Date().toISOString().split('T')[0],
      status: 'in-progress'
    };
    addProject(newProject);
    setPortfolio(getPortfolio());
  };

  const handleAddCompetition = () => {
    const newComp: Competition = {
      id: generateId('comp'),
      name: 'Competition Name',
      organizer: 'Organizer',
      date: new Date().toISOString().split('T')[0],
      category: 'academic',
      achievement: 'Participant',
      level: 'school'
    };
    addCompetition(newComp);
    setPortfolio(getPortfolio());
  };

  const generateResumePDF = () => {
    const doc = new jsPDF();
    const resumeData = getResumeData();

    // Header
    doc.setFontSize(24);
    doc.setTextColor(9, 77, 136);
    doc.text(resumeData.personalInfo.name, 20, 20);

    doc.setFontSize(12);
    doc.setTextColor(108, 117, 125);
    doc.text(resumeData.personalInfo.grade + ' | ' + resumeData.personalInfo.school, 20, 30);
    doc.text(resumeData.personalInfo.email, 20, 37);

    // Education
    let yPos = 50;
    doc.setFontSize(16);
    doc.setTextColor(9, 77, 136);
    doc.text('Education', 20, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    resumeData.education.forEach(edu => {
      doc.text(`${edu.grade} - ${edu.school} (${edu.board})`, 20, yPos);
      yPos += 7;
    });

    // Certificates
    if (resumeData.certificates.length > 0) {
      yPos += 5;
      doc.setFontSize(16);
      doc.setTextColor(9, 77, 136);
      doc.text('Certificates', 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      resumeData.certificates.slice(0, 5).forEach(cert => {
        doc.text(`• ${cert.title} - ${cert.issuedBy}`, 20, yPos);
        yPos += 7;
      });
    }

    // Projects
    if (resumeData.projects.length > 0) {
      yPos += 5;
      doc.setFontSize(16);
      doc.setTextColor(9, 77, 136);
      doc.text('Projects', 20, yPos);
      yPos += 10;

      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      resumeData.projects.slice(0, 3).forEach(proj => {
        doc.text(`• ${proj.title}`, 20, yPos);
        yPos += 7;
      });
    }

    // Skills
    yPos += 5;
    doc.setFontSize(16);
    doc.setTextColor(9, 77, 136);
    doc.text('Skills', 20, yPos);
    yPos += 10;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text('Technical: ' + resumeData.skills.technical.join(', '), 20, yPos, { maxWidth: 170 });
    yPos += 10;
    doc.text('Soft Skills: ' + resumeData.skills.soft.join(', '), 20, yPos, { maxWidth: 170 });

    doc.save('resume.pdf');
  };

  return (
    <div>
      {/* Tabs */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)',
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              background: activeTab === tab.id ? 'linear-gradient(135deg, #094d88, #10ac8b)' : '#f8f9fa',
              color: activeTab === tab.id ? 'white' : '#6c757d',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <i className={`fas ${tab.icon}`} style={{ marginRight: '8px' }}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '2rem',
            marginBottom: '2rem',
            boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
          }}>
            <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1.5rem' }}>
              <i className="fas fa-folder-open" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
              Portfolio Overview
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1.5rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #094d88, #10ac8b)',
                color: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {stats.totalCertificates}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Certificates</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
                color: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {stats.totalProjects}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Projects</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {stats.totalCompetitions}
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Competitions</div>
              </div>

              <div style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white',
                borderRadius: '15px',
                padding: '1.5rem',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '36px', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {stats.averageSoftSkillLevel}/5
                </div>
                <div style={{ fontSize: '14px', opacity: 0.9 }}>Avg Skill Level</div>
              </div>
            </div>
          </div>

          <div style={{
            background: '#fff3cd',
            border: '2px solid #ffc107',
            borderRadius: '15px',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '16px', color: '#856404', margin: 0 }}>
              <i className="fas fa-lightbulb" style={{ marginRight: '10px' }}></i>
              Start building your portfolio by adding certificates, projects, and achievements!
            </p>
          </div>
        </div>
      )}

      {/* Certificates Tab */}
      {activeTab === 'certificates' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '24px', color: '#094d88', margin: 0 }}>
              <i className="fas fa-certificate" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
              Certificates ({portfolio.certificates.length})
            </h2>
            <button
              onClick={handleAddCertificate}
              style={{
                background: 'linear-gradient(135deg, #094d88, #10ac8b)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
              Add Certificate
            </button>
          </div>

          {portfolio.certificates.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
              <i className="fas fa-certificate" style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.3 }}></i>
              <p>No certificates added yet. Click "Add Certificate" to get started!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {portfolio.certificates.map(cert => (
                <div key={cert.id} style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#10ac8b',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-certificate"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', color: '#094d88', margin: '0 0 0.25rem 0' }}>{cert.title}</h4>
                    <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
                      {cert.issuedBy} • {new Date(cert.issuedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '24px', color: '#094d88', margin: 0 }}>
              <i className="fas fa-project-diagram" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
              Projects ({portfolio.projects.length})
            </h2>
            <button
              onClick={handleAddProject}
              style={{
                background: 'linear-gradient(135deg, #094d88, #10ac8b)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
              Add Project
            </button>
          </div>

          {portfolio.projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
              <i className="fas fa-project-diagram" style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.3 }}></i>
              <p>No projects added yet. Click "Add Project" to showcase your work!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {portfolio.projects.map(project => (
                <div key={project.id} style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '1.5rem'
                }}>
                  <h4 style={{ fontSize: '16px', color: '#094d88', margin: '0 0 0.5rem 0' }}>{project.title}</h4>
                  <p style={{ fontSize: '14px', color: '#6c757d', marginBottom: '1rem' }}>{project.description}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {project.skills.map((skill, idx) => (
                      <span key={idx} style={{
                        background: '#e9f7f4',
                        color: '#10ac8b',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '11px'
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Competitions Tab */}
      {activeTab === 'competitions' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '24px', color: '#094d88', margin: 0 }}>
              <i className="fas fa-trophy" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
              Competitions ({portfolio.competitions.length})
            </h2>
            <button
              onClick={handleAddCompetition}
              style={{
                background: 'linear-gradient(135deg, #094d88, #10ac8b)',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
              Add Competition
            </button>
          </div>

          {portfolio.competitions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#6c757d' }}>
              <i className="fas fa-trophy" style={{ fontSize: '48px', marginBottom: '1rem', opacity: 0.3 }}></i>
              <p>No competitions added yet. Click "Add Competition" to highlight your achievements!</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {portfolio.competitions.map(comp => (
                <div key={comp.id} style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem'
                }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: '#ffc107',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: '16px', color: '#094d88', margin: '0 0 0.25rem 0' }}>{comp.name}</h4>
                    <p style={{ fontSize: '14px', color: '#6c757d', margin: 0 }}>
                      {comp.achievement} • {comp.level}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Soft Skills Tab */}
      {activeTab === 'skills' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)'
        }}>
          <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '2rem' }}>
            <i className="fas fa-user-check" style={{ marginRight: '12px', color: '#10ac8b' }}></i>
            Soft Skills Development
          </h2>

          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {portfolio.softSkills.map(skill => (
              <div key={skill.id} style={{
                border: '2px solid #e9ecef',
                borderRadius: '12px',
                padding: '1.5rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '16px', color: '#094d88', margin: 0, textTransform: 'capitalize' }}>
                    {skill.name.replace('-', ' ')}
                  </h4>
                  <span style={{ fontSize: '14px', color: '#6c757d', fontWeight: '600' }}>
                    Level {skill.level}/5
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '10px',
                  background: '#e9ecef',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(skill.level / 5) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #094d88, #10ac8b)',
                    borderRadius: '10px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resume Tab */}
      {activeTab === 'resume' && (
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 10px 40px rgba(9, 77, 136, 0.15)',
          textAlign: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #094d88, #10ac8b)',
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '60px',
            color: 'white'
          }}>
            <i className="fas fa-file-pdf"></i>
          </div>

          <h2 style={{ fontSize: '24px', color: '#094d88', marginBottom: '1rem' }}>
            Digital Resume Builder
          </h2>

          <p style={{ fontSize: '16px', color: '#6c757d', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Generate a professional resume from your portfolio data. Download as PDF and share with colleges or internship programs.
          </p>

          <button
            onClick={generateResumePDF}
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
            <i className="fas fa-download" style={{ marginRight: '10px' }}></i>
            Download Resume PDF
          </button>

          <div style={{
            background: '#e9f7f4',
            border: '2px solid #10ac8b',
            borderRadius: '12px',
            padding: '1rem',
            marginTop: '2rem',
            textAlign: 'left'
          }}>
            <p style={{ fontSize: '14px', color: '#094d88', margin: 0 }}>
              <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
              <strong>Tip:</strong> Add more certificates, projects, and achievements to make your resume stand out!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioStage;
