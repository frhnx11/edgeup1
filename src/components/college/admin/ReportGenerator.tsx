import { useState, useEffect } from 'react';

interface ReportTemplate {
  id: string;
  name: string;
  category: string;
  icon: string;
  description: string;
  color: string;
  estimatedTime: string;
}

interface GeneratedReport {
  id: string;
  name: string;
  category: string;
  dateGenerated: string;
  fileSize: string;
  status: 'ready' | 'generating' | 'failed';
}

const ReportGenerator = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [reportDateRange, setReportDateRange] = useState({ from: '', to: '' });
  const [selectedFormat, setSelectedFormat] = useState('pdf');
  const [showNotificationPopup, setShowNotificationPopup] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Animated stats
  const [timeSaved, setTimeSaved] = useState(0);
  const [reportsGenerated, setReportsGenerated] = useState(0);

  useEffect(() => {
    // Animate stats
    const interval = setInterval(() => {
      setTimeSaved((prev) => (prev < 95 ? prev + 1 : 95));
      setReportsGenerated((prev) => (prev < 247 ? prev + 3 : 247));
    }, 20);

    return () => clearInterval(interval);
  }, []);

  const reportTemplates: ReportTemplate[] = [
    {
      id: '1',
      name: 'Attendance Report',
      category: 'Academic',
      icon: 'fa-user-check',
      description: 'Student and staff attendance summary',
      color: '#3498db',
      estimatedTime: '15 sec'
    },
    {
      id: '2',
      name: 'Performance Report',
      category: 'Academic',
      icon: 'fa-chart-line',
      description: 'Academic performance and grades analysis',
      color: '#9b59b6',
      estimatedTime: '20 sec'
    },
    {
      id: '3',
      name: 'Fee Collection Report',
      category: 'Finance',
      icon: 'fa-money-bill-wave',
      description: 'Fee payment status and collection summary',
      color: '#27ae60',
      estimatedTime: '18 sec'
    },
    {
      id: '4',
      name: 'Compliance Report',
      category: 'Compliance',
      icon: 'fa-clipboard-check',
      description: 'Regulatory compliance and audit reports',
      color: '#e67e22',
      estimatedTime: '25 sec'
    },
    {
      id: '5',
      name: 'Incident Report',
      category: 'Safety',
      icon: 'fa-exclamation-triangle',
      description: 'Safety incidents and disciplinary actions',
      color: '#e74c3c',
      estimatedTime: '12 sec'
    },
    {
      id: '6',
      name: 'Transportation Report',
      category: 'Operations',
      icon: 'fa-bus',
      description: 'Bus routes, attendance, and maintenance',
      color: '#16a085',
      estimatedTime: '15 sec'
    },
    {
      id: '7',
      name: 'Inventory Report',
      category: 'Operations',
      icon: 'fa-boxes',
      description: 'Assets, supplies, and inventory tracking',
      color: '#34495e',
      estimatedTime: '20 sec'
    },
    {
      id: '8',
      name: 'Staff Performance',
      category: 'HR',
      icon: 'fa-user-tie',
      description: 'Staff attendance, performance, and evaluations',
      color: '#d35400',
      estimatedTime: '22 sec'
    }
  ];

  const handleTemplateSelect = (template: ReportTemplate) => {
    setSelectedTemplate(template);
    setShowCustomizeModal(true);
  };

  const generateReport = () => {
    if (!selectedTemplate) return;

    setIsGenerating(true);
    setShowCustomizeModal(false);

    // Simulate report generation
    setTimeout(() => {
      const newReport: GeneratedReport = {
        id: Date.now().toString(),
        name: selectedTemplate.name,
        category: selectedTemplate.category,
        dateGenerated: new Date().toLocaleString(),
        fileSize: `${Math.floor(Math.random() * 500 + 100)} KB`,
        status: 'ready'
      };

      setGeneratedReports([newReport, ...generatedReports]);
      setIsGenerating(false);

      setNotificationMessage(
        `Report Generated Successfully!\n\n${selectedTemplate.name} is ready to download.\n\nGeneration Time: ${selectedTemplate.estimatedTime}`
      );
      setShowNotificationPopup(true);
      setTimeout(() => setShowNotificationPopup(false), 4000);

      // Reset form
      setSelectedTemplate(null);
      setReportDateRange({ from: '', to: '' });
      setSelectedFormat('pdf');
    }, 2500);
  };

  const downloadReport = (report: GeneratedReport) => {
    setNotificationMessage(
      `Downloading Report...\n\n${report.name}\nFormat: ${selectedFormat.toUpperCase()}\nSize: ${report.fileSize}`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const deleteReport = (reportId: string) => {
    setGeneratedReports(generatedReports.filter(r => r.id !== reportId));
    setNotificationMessage('Report deleted successfully!');
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 2000);
  };

  const scheduleReport = (template: ReportTemplate) => {
    setNotificationMessage(
      `Report Scheduled!\n\n${template.name} will be generated automatically every month.\n\nYou'll receive email notifications.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 4000);
  };

  const viewReport = (report: GeneratedReport) => {
    setNotificationMessage(
      `Opening Preview...\n\n${report.name}\n\nPreview will open in a new window.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3000);
  };

  const shareReport = (report: GeneratedReport) => {
    setNotificationMessage(
      `Share Report\n\n${report.name}\n\nShare link copied to clipboard!\nYou can now share this report with others.`
    );
    setShowNotificationPopup(true);
    setTimeout(() => setShowNotificationPopup(false), 3500);
  };

  return (
    <div className="report-generator-page">
      {/* Impact Stats */}
      <div className="report-stats-grid">
        <div className="report-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-content">
            <h3>{timeSaved}%</h3>
            <p>Time Saved on Reporting</p>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #229954 100%)' }}>
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-content">
            <h3>{reportsGenerated}</h3>
            <p>Reports Generated</p>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)' }}>
            <i className="fas fa-bolt"></i>
          </div>
          <div className="stat-content">
            <h3>30 sec</h3>
            <p>Average Generation Time</p>
          </div>
        </div>

        <div className="report-stat-card">
          <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e67e22 0%, #d35400 100%)' }}>
            <i className="fas fa-download"></i>
          </div>
          <div className="stat-content">
            <h3>One Click</h3>
            <p>Instant Report Generation</p>
          </div>
        </div>
      </div>

      {/* Report Templates */}
      <div className="report-templates-section">
        <div className="section-header">
          <div className="section-title">
            <i className="fas fa-layer-group"></i>
            <h2>Report Templates</h2>
          </div>
          <p className="section-description">Select a template to generate reports instantly</p>
        </div>

        <div className="templates-grid">
          {reportTemplates.map((template) => (
            <div key={template.id} className="report-template-card">
              <div className="template-header">
                <div className="template-icon-wrapper" style={{ background: template.color }}>
                  <i className={`fas ${template.icon}`}></i>
                </div>
                <span className="template-category">{template.category}</span>
              </div>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <div className="template-meta">
                <span className="generation-time">
                  <i className="fas fa-clock"></i>
                  {template.estimatedTime}
                </span>
              </div>
              <div className="template-actions">
                <button
                  className="generate-btn"
                  onClick={() => handleTemplateSelect(template)}
                >
                  <i className="fas fa-magic"></i>
                  Generate Now
                </button>
                <button
                  className="schedule-btn"
                  onClick={() => scheduleReport(template)}
                >
                  <i className="fas fa-calendar-alt"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      {generatedReports.length > 0 && (
        <div className="generated-reports-section">
          <div className="section-header">
            <div className="section-title">
              <i className="fas fa-folder-open"></i>
              <h2>Generated Reports ({generatedReports.length})</h2>
            </div>
          </div>

          <div className="reports-table">
            <div className="table-header">
              <div className="th-name">Report Name</div>
              <div className="th-category">Category</div>
              <div className="th-date">Generated On</div>
              <div className="th-size">Size</div>
              <div className="th-status">Status</div>
              <div className="th-actions">Actions</div>
            </div>

            {generatedReports.map((report) => (
              <div key={report.id} className="table-row">
                <div className="td-name">
                  <i className="fas fa-file-pdf"></i>
                  {report.name}
                </div>
                <div className="td-category">
                  <span className="category-badge">{report.category}</span>
                </div>
                <div className="td-date">{report.dateGenerated}</div>
                <div className="td-size">{report.fileSize}</div>
                <div className="td-status">
                  <span className={`status-badge ${report.status}`}>
                    <i className={`fas ${
                      report.status === 'ready' ? 'fa-check-circle' :
                      report.status === 'generating' ? 'fa-spinner fa-spin' :
                      'fa-exclamation-circle'
                    }`}></i>
                    {report.status === 'ready' ? 'Ready' :
                     report.status === 'generating' ? 'Generating...' : 'Failed'}
                  </span>
                </div>
                <div className="td-actions">
                  <button
                    className="action-btn download"
                    onClick={() => downloadReport(report)}
                    title="Download"
                  >
                    <i className="fas fa-download"></i>
                  </button>
                  <button
                    className="action-btn view"
                    onClick={() => viewReport(report)}
                    title="Preview"
                  >
                    <i className="fas fa-eye"></i>
                  </button>
                  <button
                    className="action-btn share"
                    onClick={() => shareReport(report)}
                    title="Share"
                  >
                    <i className="fas fa-share-alt"></i>
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => deleteReport(report.id)}
                    title="Delete"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customize Modal */}
      {showCustomizeModal && selectedTemplate && (
        <div className="report-modal-overlay" onClick={() => setShowCustomizeModal(false)}>
          <div className="report-modal" onClick={(e) => e.stopPropagation()}>
            <div className="report-modal-header">
              <div>
                <h2>Customize Report</h2>
                <p>{selectedTemplate.name}</p>
              </div>
              <button className="modal-close-btn" onClick={() => setShowCustomizeModal(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="report-modal-content">
              <div className="form-group">
                <label>
                  <i className="fas fa-calendar"></i>
                  Date Range
                </label>
                <div className="date-range-inputs">
                  <input
                    type="date"
                    value={reportDateRange.from}
                    onChange={(e) => setReportDateRange({ ...reportDateRange, from: e.target.value })}
                    placeholder="From"
                  />
                  <span>to</span>
                  <input
                    type="date"
                    value={reportDateRange.to}
                    onChange={(e) => setReportDateRange({ ...reportDateRange, to: e.target.value })}
                    placeholder="To"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>
                  <i className="fas fa-file-export"></i>
                  Export Format
                </label>
                <div className="format-options">
                  <button
                    className={`format-btn ${selectedFormat === 'pdf' ? 'active' : ''}`}
                    onClick={() => setSelectedFormat('pdf')}
                  >
                    <i className="fas fa-file-pdf"></i>
                    PDF
                  </button>
                  <button
                    className={`format-btn ${selectedFormat === 'excel' ? 'active' : ''}`}
                    onClick={() => setSelectedFormat('excel')}
                  >
                    <i className="fas fa-file-excel"></i>
                    Excel
                  </button>
                  <button
                    className={`format-btn ${selectedFormat === 'csv' ? 'active' : ''}`}
                    onClick={() => setSelectedFormat('csv')}
                  >
                    <i className="fas fa-file-csv"></i>
                    CSV
                  </button>
                </div>
              </div>

              <div className="generation-info">
                <div className="info-item">
                  <i className="fas fa-clock"></i>
                  <span>Estimated Time: <strong>{selectedTemplate.estimatedTime}</strong></span>
                </div>
                <div className="info-item">
                  <i className="fas fa-layer-group"></i>
                  <span>Category: <strong>{selectedTemplate.category}</strong></span>
                </div>
              </div>
            </div>

            <div className="report-modal-footer">
              <button className="cancel-btn" onClick={() => setShowCustomizeModal(false)}>
                Cancel
              </button>
              <button className="generate-report-btn" onClick={generateReport}>
                {isGenerating ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Generating...
                  </>
                ) : (
                  <>
                    <i className="fas fa-magic"></i>
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Popup */}
      {showNotificationPopup && (
        <div className="notification-popup">
          <div className="notification-icon">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="notification-text">
            {notificationMessage.split('\n').map((line, index) => (
              <span key={index}>
                {line}
                <br />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {generatedReports.length === 0 && !isGenerating && (
        <div className="report-empty-state">
          <div className="empty-state-icon">
            <i className="fas fa-chart-bar"></i>
          </div>
          <h3>No Reports Generated Yet</h3>
          <p>Select a template above to generate your first report in 30 seconds</p>
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
