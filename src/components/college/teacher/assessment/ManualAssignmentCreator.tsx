import { useState } from 'react';

interface ManualAssignmentCreatorProps {
  onBack: () => void;
  onSave?: (assignment: any) => void;
}

const ManualAssignmentCreator = ({ onBack, onSave }: ManualAssignmentCreatorProps) => {
  const [manualForm, setManualForm] = useState({
    title: '',
    className: 'Grade 10A',
    type: 'Homework',
    totalMarks: '',
    dueDate: '',
    description: ''
  });

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const assignment = {
      id: `assign-${Date.now()}`,
      title: manualForm.title,
      class: manualForm.className,
      type: manualForm.type,
      totalMarks: parseInt(manualForm.totalMarks),
      dueDate: manualForm.dueDate,
      description: manualForm.description,
      createdAt: new Date().toISOString(),
      status: 'Published'
    };

    if (onSave) {
      onSave(assignment);
    }

    // Show success message
    alert('Assignment created successfully!');

    // Reset form and go back
    setManualForm({
      title: '',
      className: 'Grade 10A',
      type: 'Homework',
      totalMarks: '',
      dueDate: '',
      description: ''
    });
    onBack();
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Hero Header */}
      <div style={{
        background: 'linear-gradient(90deg, #9333ea 0%, #7c3aed 100%)',
        padding: '2.5rem 3rem',
        borderRadius: '16px',
        marginBottom: '2.5rem',
        boxShadow: '0 8px 32px rgba(147, 51, 234, 0.3)'
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '12px',
            padding: '0.75rem 1.5rem',
            color: 'white',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            marginBottom: '2rem',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            e.currentTarget.style.transform = 'translateX(-5px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <i className="fas fa-arrow-left"></i> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.3)'
          }}>
            <i className="fas fa-pencil-alt" style={{ fontSize: '2.5rem', color: 'white' }}></i>
          </div>
          <div>
            <h1 style={{ margin: 0, color: 'white', fontSize: '2.5rem', fontWeight: 700, textShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
              Manual Assignment Creation
            </h1>
            <p style={{ margin: '0.5rem 0 0', color: 'rgba(255, 255, 255, 0.9)', fontSize: '1.1rem' }}>
              Create custom assignments with full control over every detail
            </p>
          </div>
        </div>
      </div>

      {/* Manual Form */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '2.5rem',
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        <form onSubmit={handleManualSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {/* Assignment Title */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                <i className="fas fa-heading" style={{ marginRight: '0.5rem', color: '#9333ea' }}></i>
                Assignment Title *
              </label>
              <input
                type="text"
                value={manualForm.title}
                onChange={(e) => setManualForm({...manualForm, title: e.target.value})}
                placeholder="e.g., Linear Equations Practice"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Class */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                <i className="fas fa-chalkboard" style={{ marginRight: '0.5rem', color: '#9333ea' }}></i>
                Class *
              </label>
              <select
                value={manualForm.className}
                onChange={(e) => setManualForm({...manualForm, className: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
              </select>
            </div>

            {/* Assignment Type */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                <i className="fas fa-tag" style={{ marginRight: '0.5rem', color: '#9333ea' }}></i>
                Assignment Type *
              </label>
              <select
                value={manualForm.type}
                onChange={(e) => setManualForm({...manualForm, type: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  background: 'white',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <option value="Homework">Homework</option>
                <option value="Quiz">Quiz</option>
                <option value="Project">Project</option>
                <option value="Essay">Essay</option>
                <option value="Lab Work">Lab Work</option>
                <option value="Research">Research</option>
              </select>
            </div>

            {/* Total Marks */}
            <div className="form-group">
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                <i className="fas fa-award" style={{ marginRight: '0.5rem', color: '#9333ea' }}></i>
                Total Marks *
              </label>
              <input
                type="number"
                value={manualForm.totalMarks}
                onChange={(e) => setManualForm({...manualForm, totalMarks: e.target.value})}
                placeholder="100"
                min="1"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Due Date */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                <i className="fas fa-calendar-alt" style={{ marginRight: '0.5rem', color: '#9333ea' }}></i>
                Due Date *
              </label>
              <input
                type="date"
                value={manualForm.dueDate}
                onChange={(e) => setManualForm({...manualForm, dueDate: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>

            {/* Description & Instructions */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: '#2d3748', fontSize: '0.9rem' }}>
                <i className="fas fa-align-left" style={{ marginRight: '0.5rem', color: '#9333ea' }}></i>
                Description & Instructions *
              </label>
              <textarea
                value={manualForm.description}
                onChange={(e) => setManualForm({...manualForm, description: e.target.value})}
                placeholder="Enter assignment description and instructions for students..."
                rows={6}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '2px solid #e2e8f0',
                  borderRadius: '8px',
                  fontSize: '0.95rem',
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = '#9333ea'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#e2e8f0'}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                padding: '0.75rem 1.5rem',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                background: 'white',
                color: '#2d3748',
                fontSize: '0.95rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f7fafc';
                e.currentTarget.style.borderColor = '#cbd5e0';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e2e8f0';
              }}
            >
              <i className="fas fa-times" style={{ marginRight: '0.5rem' }}></i>
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '0.75rem 2rem',
                fontSize: '0.95rem',
                background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(147, 51, 234, 0.3)',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 25px rgba(147, 51, 234, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(147, 51, 234, 0.3)';
              }}
            >
              <i className="fas fa-check" style={{ marginRight: '0.5rem' }}></i>
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManualAssignmentCreator;
