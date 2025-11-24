import { useState } from 'react';
import './ResearchAssistant.css';

interface ResearchProject {
  id: string;
  title: string;
  status: 'draft' | 'in-progress' | 'review' | 'completed';
  progress: number;
  lastModified: string;
  wordCount: number;
  citations: number;
}

interface Citation {
  id: string;
  authors: string[];
  title: string;
  journal: string;
  year: number;
  doi?: string;
  type: 'journal' | 'conference' | 'book' | 'website';
}

const ResearchAssistant = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'write' | 'citations' | 'check'>('projects');

  const [projects] = useState<ResearchProject[]>([
    {
      id: '1',
      title: 'Machine Learning Applications in Healthcare',
      status: 'in-progress',
      progress: 65,
      lastModified: '2024-01-28',
      wordCount: 3250,
      citations: 12
    },
    {
      id: '2',
      title: 'Blockchain Technology in Supply Chain Management',
      status: 'review',
      progress: 85,
      lastModified: '2024-01-25',
      wordCount: 4800,
      citations: 18
    },
    {
      id: '3',
      title: 'Renewable Energy Systems: A Comparative Study',
      status: 'draft',
      progress: 20,
      lastModified: '2024-01-20',
      wordCount: 1200,
      citations: 5
    }
  ]);

  const [suggestedCitations] = useState<Citation[]>([
    {
      id: 'c1',
      authors: ['Smith, J.', 'Doe, A.'],
      title: 'Deep Learning in Medical Image Analysis',
      journal: 'IEEE Transactions on Medical Imaging',
      year: 2023,
      doi: '10.1109/TMI.2023.123456',
      type: 'journal'
    },
    {
      id: 'c2',
      authors: ['Kumar, R.', 'Patel, S.', 'Lee, M.'],
      title: 'AI-Driven Diagnostic Systems',
      journal: 'Journal of Healthcare Engineering',
      year: 2023,
      type: 'journal'
    }
  ]);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'review': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string): string => {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="research-assistant-container">
      {/* Header */}
      <div className="research-header">
        <div className="header-left">
          <h1>
            <i className="fas fa-flask"></i>
            Research Assistant
          </h1>
          <p>AI-powered writing, citations, and plagiarism detection for academic excellence</p>
        </div>
        <button className="new-project-btn">
          <i className="fas fa-plus"></i>
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-box">
          <i className="fas fa-file-alt"></i>
          <div className="stat-info">
            <span className="stat-number">{projects.length}</span>
            <span className="stat-label">Active Projects</span>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-check-circle"></i>
          <div className="stat-info">
            <span className="stat-number">5</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-quote-right"></i>
          <div className="stat-info">
            <span className="stat-number">35</span>
            <span className="stat-label">Citations</span>
          </div>
        </div>
        <div className="stat-box">
          <i className="fas fa-chart-line"></i>
          <div className="stat-info">
            <span className="stat-number">98%</span>
            <span className="stat-label">Originality</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-wrapper">
        {/* Tabs */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            <i className="fas fa-folder-open"></i>
            Projects
          </button>
          <button
            className={`tab ${activeTab === 'write' ? 'active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            <i className="fas fa-pen"></i>
            Write
          </button>
          <button
            className={`tab ${activeTab === 'citations' ? 'active' : ''}`}
            onClick={() => setActiveTab('citations')}
          >
            <i className="fas fa-book"></i>
            Citations
          </button>
          <button
            className={`tab ${activeTab === 'check' ? 'active' : ''}`}
            onClick={() => setActiveTab('check')}
          >
            <i className="fas fa-shield-alt"></i>
            Check
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Projects Tab */}
          {activeTab === 'projects' && (
            <div className="projects-view">
              <div className="view-header">
                <h2>Your Research Projects</h2>
                <div className="view-actions">
                  <button className="filter-btn">
                    <i className="fas fa-filter"></i>
                    Filter
                  </button>
                  <button className="sort-btn">
                    <i className="fas fa-sort"></i>
                    Sort by Date
                  </button>
                </div>
              </div>

              <div className="projects-list">
                {projects.map((project) => (
                  <div key={project.id} className="project-item">
                    <div className="project-main">
                      <div className="project-title-section">
                        <h3>{project.title}</h3>
                        <span className="status-tag" style={{ background: getStatusColor(project.status) }}>
                          {getStatusLabel(project.status)}
                        </span>
                      </div>

                      <div className="project-stats">
                        <span><i className="fas fa-file-word"></i> {project.wordCount.toLocaleString()} words</span>
                        <span><i className="fas fa-quote-left"></i> {project.citations} citations</span>
                        <span><i className="fas fa-calendar"></i> {new Date(project.lastModified).toLocaleDateString()}</span>
                      </div>

                      <div className="progress-wrapper">
                        <div className="progress-info">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="progress-track">
                          <div
                            className="progress-bar"
                            style={{ width: `${project.progress}%`, background: getStatusColor(project.status) }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="project-actions">
                      <button className="btn-secondary">
                        <i className="fas fa-eye"></i>
                        View
                      </button>
                      <button className="btn-primary">
                        <i className="fas fa-pen"></i>
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Write Tab */}
          {activeTab === 'write' && (
            <div className="write-view">
              <div className="editor-layout">
                <div className="editor-main">
                  <div className="editor-header">
                    <h3>AI Writing Assistant</h3>
                    <div className="editor-tools">
                      <button title="Bold"><i className="fas fa-bold"></i></button>
                      <button title="Italic"><i className="fas fa-italic"></i></button>
                      <button title="Underline"><i className="fas fa-underline"></i></button>
                      <span className="divider"></span>
                      <button title="Bullet List"><i className="fas fa-list-ul"></i></button>
                      <button title="Numbered List"><i className="fas fa-list-ol"></i></button>
                      <span className="divider"></span>
                      <button title="Link"><i className="fas fa-link"></i></button>
                      <button title="Image"><i className="fas fa-image"></i></button>
                    </div>
                  </div>

                  <textarea
                    className="editor-textarea"
                    placeholder="Start writing your research paper here... AI will provide suggestions in real-time."
                  />

                  <div className="editor-footer">
                    <div className="editor-info">
                      <span><i className="fas fa-file-word"></i> 3,250 words</span>
                      <span><i className="fas fa-clock"></i> Saved 2 min ago</span>
                    </div>
                    <div className="editor-actions">
                      <button className="btn-outline">
                        <i className="fas fa-file-pdf"></i>
                        Export PDF
                      </button>
                      <button className="btn-outline">
                        <i className="fas fa-file-word"></i>
                        Export Word
                      </button>
                      <button className="btn-success">
                        <i className="fas fa-save"></i>
                        Save
                      </button>
                    </div>
                  </div>
                </div>

                <div className="editor-sidebar">
                  {/* AI Suggestions */}
                  <div className="sidebar-section">
                    <h4><i className="fas fa-magic"></i> AI Suggestions</h4>

                    <div className="suggestion-item">
                      <div className="suggestion-icon" style={{ background: '#3b82f6' }}>
                        <i className="fas fa-sitemap"></i>
                      </div>
                      <div className="suggestion-text">
                        <strong>Structure</strong>
                        <p>Add a "Methodology Comparison" section before Results</p>
                        <div className="suggestion-btns">
                          <button className="btn-apply">Apply</button>
                          <button className="btn-dismiss">Dismiss</button>
                        </div>
                      </div>
                    </div>

                    <div className="suggestion-item">
                      <div className="suggestion-icon" style={{ background: '#8b5cf6' }}>
                        <i className="fas fa-lightbulb"></i>
                      </div>
                      <div className="suggestion-text">
                        <strong>Content</strong>
                        <p>Add recent statistics about ML adoption in healthcare</p>
                        <div className="suggestion-btns">
                          <button className="btn-apply">Apply</button>
                          <button className="btn-dismiss">Dismiss</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis */}
                  <div className="sidebar-section">
                    <h4><i className="fas fa-chart-bar"></i> Writing Analysis</h4>

                    <div className="analysis-metric">
                      <div className="metric-header">
                        <span>Readability</span>
                        <strong>72/100</strong>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{ width: '72%', background: '#10b981' }}></div>
                      </div>
                      <span className="metric-label">College Level</span>
                    </div>

                    <div className="analysis-metric">
                      <div className="metric-header">
                        <span>Formality</span>
                        <strong>85%</strong>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{ width: '85%', background: '#3b82f6' }}></div>
                      </div>
                    </div>

                    <div className="analysis-metric">
                      <div className="metric-header">
                        <span>Objectivity</span>
                        <strong>92%</strong>
                      </div>
                      <div className="metric-bar">
                        <div className="metric-fill" style={{ width: '92%', background: '#8b5cf6' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tools */}
                  <div className="sidebar-section">
                    <h4><i className="fas fa-tools"></i> Quick Tools</h4>
                    <button className="tool-button">
                      <i className="fas fa-sync"></i>
                      Paraphrase
                    </button>
                    <button className="tool-button">
                      <i className="fas fa-expand"></i>
                      Expand
                    </button>
                    <button className="tool-button">
                      <i className="fas fa-compress"></i>
                      Summarize
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Citations Tab */}
          {activeTab === 'citations' && (
            <div className="citations-view">
              <div className="view-header">
                <h2>Citation Manager</h2>
                <select className="citation-style">
                  <option>APA 7th Edition</option>
                  <option>IEEE</option>
                  <option>MLA 9th</option>
                  <option>Chicago</option>
                  <option>Harvard</option>
                </select>
              </div>

              {/* Search Bar */}
              <div className="citation-search-bar">
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search by title, author, DOI, or keywords..." />
                <button className="btn-primary">Search</button>
              </div>

              {/* PDF Uploader */}
              <div className="pdf-upload-card">
                <div className="upload-icon">
                  <i className="fas fa-file-upload"></i>
                </div>
                <div className="upload-content">
                  <h3>PDF Citation Extractor</h3>
                  <p>Upload a PDF to automatically extract all citations</p>
                  <label className="upload-button">
                    <input type="file" accept=".pdf" style={{ display: 'none' }} />
                    <i className="fas fa-cloud-upload-alt"></i>
                    Choose PDF File
                  </label>
                </div>
              </div>

              {/* Database Search */}
              <div className="database-search-card">
                <h3><i className="fas fa-database"></i> Search Academic Databases</h3>
                <div className="database-grid">
                  <label className="database-item">
                    <input type="checkbox" defaultChecked />
                    <i className="fas fa-graduation-cap"></i>
                    <span>Google Scholar</span>
                  </label>
                  <label className="database-item">
                    <input type="checkbox" defaultChecked />
                    <i className="fas fa-flask"></i>
                    <span>PubMed</span>
                  </label>
                  <label className="database-item">
                    <input type="checkbox" defaultChecked />
                    <i className="fas fa-book"></i>
                    <span>IEEE Xplore</span>
                  </label>
                  <label className="database-item">
                    <input type="checkbox" />
                    <i className="fas fa-microscope"></i>
                    <span>arXiv</span>
                  </label>
                </div>
                <button className="btn-database-search">
                  <i className="fas fa-search"></i>
                  Search Selected Databases
                </button>
              </div>

              {/* Suggested Citations */}
              <div className="citations-section">
                <h3><i className="fas fa-lightbulb"></i> Suggested Citations</h3>
                <p className="section-desc">Based on your research topic</p>

                {suggestedCitations.map((citation) => (
                  <div key={citation.id} className="citation-card">
                    <div className="citation-type-badge">
                      <i className="fas fa-book"></i>
                      {citation.type}
                    </div>
                    <h4>{citation.title}</h4>
                    <p className="citation-authors">{citation.authors.join(', ')}</p>
                    <p className="citation-journal">{citation.journal}, {citation.year}</p>
                    {citation.doi && <p className="citation-doi">DOI: {citation.doi}</p>}
                    <div className="citation-actions">
                      <button className="btn-add">
                        <i className="fas fa-plus"></i>
                        Add to Paper
                      </button>
                      <button className="btn-view">
                        <i className="fas fa-external-link-alt"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Check Tab */}
          {activeTab === 'check' && (
            <div className="check-view">
              <div className="view-header">
                <h2>Grammar & Plagiarism Check</h2>
              </div>

              {/* Check Actions */}
              <div className="check-actions">
                <button className="check-card grammar">
                  <i className="fas fa-spell-check"></i>
                  <span>Run Grammar Check</span>
                </button>
                <button className="check-card plagiarism">
                  <i className="fas fa-shield-alt"></i>
                  <span>Check Plagiarism</span>
                </button>
                <button className="check-card readability">
                  <i className="fas fa-book-reader"></i>
                  <span>Analyze Readability</span>
                </button>
              </div>

              {/* Results */}
              <div className="check-results">
                <div className="result-card">
                  <div className="result-header">
                    <h3>Originality Report</h3>
                    <div className="score-badge success">
                      <span className="score">92%</span>
                      <span className="label">Original</span>
                    </div>
                  </div>

                  <div className="result-summary">
                    <i className="fas fa-check-circle"></i>
                    <div>
                      <strong>Excellent originality!</strong>
                      <p>Your paper shows 92% originality with only 8% similarity to existing sources.</p>
                    </div>
                  </div>

                  <div className="matches-found">
                    <h4><i className="fas fa-exclamation-triangle"></i> Similarity Matches (2)</h4>

                    <div className="match-item">
                      <div className="match-header">
                        <span className="match-source">Wikipedia - Machine Learning</span>
                        <span className="match-percent">5%</span>
                      </div>
                      <p className="match-text">"Machine learning is a subset of artificial intelligence..."</p>
                    </div>

                    <div className="match-item">
                      <div className="match-header">
                        <span className="match-source">IEEE Paper 2022</span>
                        <span className="match-percent">3%</span>
                      </div>
                      <p className="match-text">"Healthcare systems benefit from predictive analytics..."</p>
                    </div>
                  </div>
                </div>

                <div className="result-card">
                  <h3>Grammar Analysis</h3>

                  <div className="grammar-stats">
                    <div className="grammar-stat">
                      <i className="fas fa-check-circle" style={{ color: '#10b981' }}></i>
                      <div>
                        <strong>0</strong>
                        <span>Critical Errors</span>
                      </div>
                    </div>
                    <div className="grammar-stat">
                      <i className="fas fa-exclamation-triangle" style={{ color: '#f59e0b' }}></i>
                      <div>
                        <strong>3</strong>
                        <span>Suggestions</span>
                      </div>
                    </div>
                    <div className="grammar-stat">
                      <i className="fas fa-book-reader" style={{ color: '#3b82f6' }}></i>
                      <div>
                        <strong>College</strong>
                        <span>Reading Level</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResearchAssistant;
