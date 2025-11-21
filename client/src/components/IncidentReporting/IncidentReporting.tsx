import React, { useState, useRef } from 'react';

interface IncidentReport {
  id: string;
  title: string;
  description: string;
  location: string;
  date: string;
  time: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  evidence: string[]; // URLs or base64 strings for images
  contactInfo: string;
  status: 'draft' | 'submitted' | 'under_review' | 'resolved';
  createdAt: string;
}

const IncidentReporting: React.FC = () => {
  const [reports, setReports] = useState<IncidentReport[]>([
    {
      id: '1',
      title: 'Suspicious activity near CBD',
      description: 'Noticed someone following me from Moi Avenue to Tom Mboya Street during evening hours',
      location: 'Nairobi CBD, Moi Avenue',
      date: '2024-01-15',
      time: '18:30',
      type: 'harassment',
      severity: 'medium',
      evidence: [],
      contactInfo: '+254712345678',
      status: 'submitted',
      createdAt: '2024-01-15'
    }
  ]);
  
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState<Omit<IncidentReport, 'id' | 'status' | 'createdAt'>>({
    title: '',
    description: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    type: 'harassment',
    severity: 'medium',
    evidence: [],
    contactInfo: ''
  });
  
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const incidentTypes = [
    'harassment',
    'assault',
    'theft',
    'stalking',
    'discrimination',
    'cyber_bullying',
    'matatu_harassment',
    'street_violence',
    'other'
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: '#10b981' },
    { value: 'medium', label: 'Medium', color: '#f59e0b' },
    { value: 'high', label: 'High', color: '#ef4444' },
    { value: 'critical', label: 'Critical', color: '#dc2626' }
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
    
    // Convert files to base64 for preview (in real app, upload to server)
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setNewReport(prev => ({
            ...prev,
            evidence: [...prev.evidence, e.target.result as string]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setNewReport(prev => ({
      ...prev,
      evidence: prev.evidence.filter((_, i) => i !== index)
    }));
  };

  const submitReport = () => {
    if (newReport.title && newReport.description) {
      const report: IncidentReport = {
        ...newReport,
        id: Date.now().toString(),
        status: 'submitted',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setReports([...reports, report]);
      setNewReport({
        title: '',
        description: '',
        location: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().slice(0, 5),
        type: 'harassment',
        severity: 'medium',
        evidence: [],
        contactInfo: ''
      });
      setSelectedFiles([]);
      setShowReportForm(false);
      alert('Incident report submitted successfully. Kenya Police have been notified if required.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return '#6b7280';
      case 'submitted': return '#3b82f6';
      case 'under_review': return '#f59e0b';
      case 'resolved': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Draft';
      case 'submitted': return 'Submitted';
      case 'under_review': return 'Under Review';
      case 'resolved': return 'Resolved';
      default: return status;
    }
  };

  const getSeverityColor = (severity: string) => {
    return severityLevels.find(s => s.value === severity)?.color || '#6b7280';
  };

  return (
    <div style={{ 
      padding: '20px', 
      background: 'white', 
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      maxWidth: '1000px',
      margin: '0 auto'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#333', margin: '0 0 10px 0' }}>🚨 Incident Reporting</h1>
        <p style={{ color: '#666', margin: 0 }}>Report safety incidents in Kenya with evidence and location details</p>
      </div>

      {/* Emergency Alert */}
      <div style={{
        padding: '15px',
        background: '#fef2f2',
        border: '2px solid #ef4444',
        borderRadius: '8px',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>🚨 Immediate Emergency in Kenya?</h3>
        <p style={{ color: '#991b1b', margin: '0 0 15px 0' }}>
          If you're in immediate danger, call Kenya emergency services first:
        </p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => window.open('tel:999', '_self')}
            style={{
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚔 Call 999 (Police)
          </button>
          <button
            onClick={() => window.open('tel:999', '_self')}
            style={{
              padding: '10px 20px',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚑 Call 999 (Ambulance)
          </button>
          <button
            onClick={() => window.open('tel:119', '_self')}
            style={{
              padding: '10px 20px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🏥 AAR Insurance (119)
          </button>
        </div>
      </div>

      {/* Create Report Button */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button
          onClick={() => setShowReportForm(true)}
          style={{
            padding: '12px 24px',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          📝 Report New Incident
        </button>
      </div>

      {/* Report Form */}
      {showReportForm && (
        <div style={{
          padding: '25px',
          background: '#fef2f2',
          border: '2px solid #fecaca',
          borderRadius: '10px',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#dc2626', margin: '0 0 20px 0' }}>Report Safety Incident in Kenya</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Incident Title *
              </label>
              <input
                type="text"
                placeholder="Brief description of the incident"
                value={newReport.title}
                onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Incident Type *
              </label>
              <select
                value={newReport.type}
                onChange={(e) => setNewReport({...newReport, type: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {incidentTypes.map(type => (
                  <option key={type} value={type}>
                    {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Description *
            </label>
            <textarea
              placeholder="Detailed description of what happened in Kenya..."
              value={newReport.description}
              onChange={(e) => setNewReport({...newReport, description: e.target.value})}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Location in Kenya
              </label>
              <input
                type="text"
                placeholder="e.g., Nairobi CBD, Mombasa, Nakuru"
                value={newReport.location}
                onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Date
              </label>
              <input
                type="date"
                value={newReport.date}
                onChange={(e) => setNewReport({...newReport, date: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Time
              </label>
              <input
                type="time"
                value={newReport.time}
                onChange={(e) => setNewReport({...newReport, time: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Severity Level
              </label>
              <select
                value={newReport.severity}
                onChange={(e) => setNewReport({...newReport, severity: e.target.value as any})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
                Contact Information
              </label>
              <input
                type="text"
                placeholder="+254 phone number or email"
                value={newReport.contactInfo}
                onChange={(e) => setNewReport({...newReport, contactInfo: e.target.value})}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #ddd',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          {/* Evidence Upload */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Evidence (Photos, Videos, Documents)
            </label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                padding: '10px 20px',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              📎 Add Evidence Files
            </button>
            
            {selectedFiles.length > 0 && (
              <div style={{ marginTop: '10px' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Selected Files:</p>
                {selectedFiles.map((file, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '8px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    marginBottom: '5px'
                  }}>
                    <span style={{ fontSize: '14px' }}>{file.name}</span>
                    <button
                      onClick={() => removeFile(index)}
                      style={{
                        padding: '4px 8px',
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={submitReport}
              disabled={!newReport.title || !newReport.description}
              style={{
                padding: '12px 24px',
                background: (!newReport.title || !newReport.description) ? '#9ca3af' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: (!newReport.title || !newReport.description) ? 'not-allowed' : 'pointer'
              }}
            >
              🚨 Submit Incident Report
            </button>
            <button
              onClick={() => setShowReportForm(false)}
              style={{
                padding: '12px 24px',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      {/* Incident Reports List */}
      <div>
        <h3 style={{ color: '#333', marginBottom: '20px' }}>
          Your Incident Reports ({reports.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {reports.map(report => (
            <div
              key={report.id}
              style={{
                padding: '20px',
                border: '2px solid #e5e7eb',
                borderRadius: '10px',
                background: '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div>
                  <h4 style={{ color: '#1f2937', margin: '0 0 5px 0', fontSize: '18px' }}>{report.title}</h4>
                  <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ 
                      padding: '4px 12px', 
                      background: getSeverityColor(report.severity),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {report.severity.toUpperCase()}
                    </span>
                    <span style={{ 
                      padding: '4px 12px', 
                      background: getStatusColor(report.status),
                      color: 'white',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      {getStatusLabel(report.status)}
                    </span>
                    <span style={{ color: '#6b7280', fontSize: '14px' }}>
                      {report.date} at {report.time}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <p style={{ color: '#4b5563', margin: '0 0 10px 0', lineHeight: '1.5' }}>
                  {report.description}
                </p>
                {report.location && (
                  <p style={{ color: '#6b7280', margin: '0 0 5px 0', fontSize: '14px' }}>
                    <strong>Location:</strong> {report.location}
                  </p>
                )}
                <p style={{ color: '#6b7280', margin: '0 0 5px 0', fontSize: '14px' }}>
                  <strong>Type:</strong> {report.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </p>
                {report.contactInfo && (
                  <p style={{ color: '#6b7280', margin: '0', fontSize: '14px' }}>
                    <strong>Contact:</strong> {report.contactInfo}
                  </p>
                )}
              </div>

              {report.evidence.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                  <strong style={{ color: '#333', fontSize: '14px' }}>Evidence:</strong>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '5px', flexWrap: 'wrap' }}>
                    {report.evidence.map((evidence, index) => (
                      <img 
                        key={index}
                        src={evidence} 
                        alt={`Evidence ${index + 1}`}
                        style={{ 
                          width: '80px', 
                          height: '80px', 
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #e5e7eb'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => alert(`Sharing report with Kenya Police: ${report.title}`)}
                  style={{
                    padding: '8px 16px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  📤 Share with Kenya Police
                </button>
                <button
                  onClick={() => alert(`Downloading report: ${report.title}`)}
                  style={{
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '12px',
                    cursor: 'pointer'
                  }}
                >
                  💾 Download Report
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {reports.length === 0 && !showReportForm && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280' }}>
          <p>No incident reports yet. Create your first report to document safety concerns in Kenya.</p>
        </div>
      )}

      {/* Kenya-Specific Resources */}
      <div style={{ 
        marginTop: '30px',
        padding: '15px',
        background: '#eff6ff',
        borderRadius: '8px',
        border: '1px solid #dbeafe'
      }}>
        <h4 style={{ color: '#1e40af', margin: '0 0 10px 0' }}>🇰🇪 Kenya Support Resources</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '10px', fontSize: '14px', color: '#374151' }}>
          <div>
            <strong>Gender Violence:</strong> 1195
          </div>
          <div>
            <strong>Child Protection:</strong> 116
          </div>
          <div>
            <strong>Mental Health:</strong> 1199
          </div>
          <div>
            <strong>Red Cross Kenya:</strong> 1199
          </div>
          <div>
            <strong>FIDA Kenya (Legal):</strong> +254 20 374 3764
          </div>
          <div>
            <strong>CRADLE (Children):</strong> +254 20 387 3037
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncidentReporting;
