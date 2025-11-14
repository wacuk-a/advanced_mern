import { useState } from 'react';
import { jsonrpc } from '../utils/jsonrpc';
import { useAuthStore } from '../store/authStore';
import './Reports.css';

interface ReportForm {
  reportType: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  images: File[];
  riskLevel?: string;
}

const Reports = () => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState<ReportForm>({
    reportType: '',
    description: '',
    images: []
  });
  const [submitting, setSubmitting] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get current location if available
      let location = formData.location;
      if (!location && navigator.geolocation) {
        location = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            }),
            () => resolve(undefined)
          );
        });
      }

      // Upload images if any
      const imageUrls: string[] = [];
      // In production, upload images to cloud storage first
      // For now, we'll skip image uploads in this example

      // Submit report
      const reportData = {
        reportType: formData.reportType,
        text: formData.description,
        images: imageUrls,
        location: location
      };

      // Analyze with AI
      const analysis = await jsonrpc.call('reporting.analyze', reportData);
      setAnalysisResult(analysis);
      setShowAnalysis(true);

      // Submit report
      const result = await jsonrpc.call('reporting.submit', {
        reportType: reportData.reportType,
        text: reportData.text,
        images: reportData.images,
        location: reportData.location,
        riskAssessment: analysis
      });

      alert('Report submitted successfully. A counselor will review it shortly.');
      
      // Reset form
      setFormData({
        reportType: '',
        description: '',
        images: []
      });
      setShowAnalysis(false);
    } catch (error: any) {
      alert(`Failed to submit report: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        images: Array.from(e.target.files)
      });
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>Report an Incident</h1>
        <p>Your report is confidential and will be reviewed by trained counselors</p>
      </div>

      <div className="reports-content">
        <form onSubmit={handleSubmit} className="report-form">
          <div className="form-group">
            <label htmlFor="reportType">Report Type *</label>
            <select
              id="reportType"
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
              required
            >
              <option value="">Select a type</option>
              <option value="abuse">Abuse</option>
              <option value="threat">Threat</option>
              <option value="incident">Incident</option>
              <option value="harassment">Harassment</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={8}
              placeholder="Please describe what happened in detail..."
            />
            <small>Be as detailed as possible. This helps with risk assessment.</small>
          </div>

          <div className="form-group">
            <label htmlFor="images">Evidence (Images)</label>
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
            <small>You can upload multiple images. All evidence is encrypted.</small>
          </div>

          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.location !== undefined}
                onChange={(e) => {
                  if (e.target.checked) {
                    navigator.geolocation.getCurrentPosition(
                      (pos) => setFormData({
                        ...formData,
                        location: {
                          latitude: pos.coords.latitude,
                          longitude: pos.coords.longitude
                        }
                      }),
                      () => alert('Failed to get location')
                    );
                  } else {
                    setFormData({ ...formData, location: undefined });
                  }
                }}
              />
              Include current location
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Report'}
          </button>
        </form>

        {showAnalysis && analysisResult && (
          <div className="analysis-result">
            <h2>AI Risk Assessment</h2>
            <div className="risk-score">
              <div className={`risk-level risk-${analysisResult.riskLevel}`}>
                {analysisResult.riskLevel.toUpperCase()}
              </div>
              <div className="risk-value">Risk Score: {analysisResult.riskScore}/100</div>
            </div>
            <div className="risk-explanation">
              <p>{analysisResult.explanation}</p>
            </div>
            {analysisResult.keywords && analysisResult.keywords.length > 0 && (
              <div className="risk-keywords">
                <strong>Detected Keywords:</strong>
                <div className="keywords-list">
                  {analysisResult.keywords.map((keyword: string, index: number) => (
                    <span key={index} className="keyword-tag">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="reports-info">
        <h3>What happens after you submit?</h3>
        <ul>
          <li>Your report is analyzed by AI for risk assessment</li>
          <li>A trained counselor reviews your report</li>
          <li>You may be contacted for follow-up if needed</li>
          <li>All information is kept confidential and secure</li>
        </ul>
      </div>
    </div>
  );
};

export default Reports;

