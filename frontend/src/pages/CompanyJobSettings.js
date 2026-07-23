import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { getSession } from "../auth/session";
import "./CompanyJobSettings.css";

function CompanyJobSettings() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const company = getSession("company");

  const [job, setJob] = useState(null);
  const [rounds, setRounds] = useState([]);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get(`/companies/me/jobs/${jobId}/settings`)
      .then((response) => {
        setJob(response.data.job);
        setRounds(response.data.rounds);
      })
      .catch((error) =>
        setMessage(error.response?.data?.message || "Unable to load job settings.")
      );
  }, [jobId]);

  const saveJob = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setMessage("");
      const response = await api.patch(`/companies/me/jobs/${jobId}`, job);
      setJob(response.data.job);
      setMessage("🎉 Job settings updated successfully.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save job settings.");
    } finally {
      setSaving(false);
    }
  };

  const saveRound = async (round) => {
    try {
      await api.patch(`/companies/me/jobs/${jobId}/rounds/${round.job_round_id}`, {
        round_name: round.round_name,
      });
      setMessage(`✓ Round ${round.round_number} updated to "${round.round_name}".`);
    } catch (error) {
      setMessage(error.response?.data?.message || "Unable to save round name.");
    }
  };

  if (!job) {
    return (
      <div className="jobsettings-page-wrapper">
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div className="spinner"></div>
          <h2>Loading Job Settings...</h2>
        </div>
      </div>
    );
  }

  const initialLetter = (company?.company_name || "C").charAt(0).toUpperCase();

  const formatDate = (dateStr) => {
    if (!dateStr) return "Open Deadline";
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="jobsettings-page-wrapper">
      {/* Top Navbar */}
      <header className="jobsettings-navbar">
        <button className="back-dash-btn" onClick={() => navigate("/company/dashboard")}>
          ← Back to Employer Workspace
        </button>
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>
          Job Settings · <strong style={{ color: "#f8fafc" }}>{job.job_title}</strong>
        </div>
      </header>

      <div className="jobsettings-container">
        {/* Left Side: Settings Form */}
        <div className="settings-form-card">
          <div className="settings-header">
            <span
              style={{
                fontSize: "12px",
                fontWeight: "700",
                padding: "4px 12px",
                borderRadius: "20px",
                background: job.is_open ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)",
                color: job.is_open ? "#34d399" : "#f87171",
                border: job.is_open ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid rgba(239, 68, 68, 0.3)",
                display: "inline-block",
                marginBottom: "10px",
              }}
            >
              {job.is_open ? "🟢 Active Drive" : "🔴 Drive Closed"}
            </span>
            <h1>Job Configuration & Settings</h1>
            <p>Update role parameters, adjust eligibility rules, or edit recruitment round names.</p>
          </div>

          {message && (
            <div
              style={{
                background: "rgba(59, 130, 246, 0.15)",
                border: "1px solid rgba(59, 130, 246, 0.35)",
                color: "#60a5fa",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "24px",
                fontSize: "14px",
              }}
            >
              🔔 {message}
            </div>
          )}

          <form onSubmit={saveJob}>
            {/* Section 1: Basic Parameters */}
            <div className="settings-section-title">📌 1. Basic Information & Compensation</div>

            <div className="settings-field full">
              <label>Job Title / Role Name *</label>
              <input
                value={job.job_title}
                onChange={(e) => setJob({ ...job, job_title: e.target.value })}
                required
              />
            </div>

            <div className="settings-grid-2">
              <div className="settings-field">
                <label>Job Location *</label>
                <input
                  value={job.location}
                  onChange={(e) => setJob({ ...job, location: e.target.value })}
                  required
                />
              </div>

              <div className="settings-field">
                <label>Package (LPA) *</label>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={job.salary_lpa}
                  onChange={(e) => setJob({ ...job, salary_lpa: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Section 2: Eligibility & Cutoffs */}
            <div className="settings-section-title">🎓 2. Eligibility & Application Deadline</div>

            <div className="settings-grid-2">
              <div className="settings-field">
                <label>Minimum CGPA Cutoff *</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  step="0.01"
                  value={job.min_cgpa}
                  onChange={(e) => setJob({ ...job, min_cgpa: e.target.value })}
                  required
                />
              </div>

              <div className="settings-field">
                <label>Application Deadline Date *</label>
                <input
                  type="date"
                  value={String(job.deadline).slice(0, 10)}
                  onChange={(e) => setJob({ ...job, deadline: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="settings-field full">
              <label>Detailed Description *</label>
              <textarea
                value={job.description || ""}
                onChange={(e) => setJob({ ...job, description: e.target.value })}
                required
              />
            </div>

            {/* Toggle Status */}
            <div className="toggle-switch-card">
              <div className="toggle-info">
                <h4>Hiring Drive Status</h4>
                <p>Check box to accept new student applications, uncheck to close drive.</p>
              </div>
              <input
                className="toggle-checkbox"
                type="checkbox"
                checked={job.is_open}
                onChange={(e) => setJob({ ...job, is_open: e.target.checked })}
              />
            </div>

            <button type="submit" className="save-settings-btn" disabled={saving}>
              {saving ? "Saving Changes..." : "💾 Save Job Configuration"}
            </button>
          </form>

          {/* Section 3: Round Names Editor */}
          <div className="round-editors-card">
            <div className="settings-section-title" style={{ marginTop: 0 }}>
              🔄 Customize Recruitment Round Names ({rounds.length} Rounds)
            </div>
            <p style={{ fontSize: "13px", color: "#94a3b8", marginBottom: "16px" }}>
              Renaming a recruitment round updates the title for all applicant evaluation cards.
            </p>

            {rounds.map((round, index) => (
              <div className="round-editor-row" key={round.job_round_id}>
                <span className="round-number-label">Round {round.round_number}</span>
                <input
                  value={round.round_name}
                  onChange={(e) =>
                    setRounds(
                      rounds.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, round_name: e.target.value } : item
                      )
                    )
                  }
                />
                <button type="button" onClick={() => saveRound(round)}>
                  Save Name
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Live Card Preview Panel */}
        <div className="live-preview-settings">
          <div className="preview-title">
            <span>👁️ Real-Time Student Directory View</span>
          </div>

          <div className="preview-job-card">
            <div className="preview-card-header">
              <div className="preview-avatar">{initialLetter}</div>
              <div className="preview-meta">
                <h4>{job.job_title}</h4>
                <p>{company?.company_name || "Company"} · {job.location}</p>
              </div>
            </div>

            <div className="preview-badges">
              <span className="preview-badge ctc">💰 {job.salary_lpa} LPA</span>
              <span className="preview-badge cgpa">🎓 Min {job.min_cgpa} CGPA</span>
              <span className="preview-badge rounds">🔄 {job.round_count} Rounds</span>
            </div>

            <div className="preview-desc-box">
              {job.description || "Job description preview..."}
            </div>

            <div className="preview-footer">
              <span>⏳ Deadline: <strong>{formatDate(job.deadline)}</strong></span>
              <span
                style={{
                  color: job.is_open ? "#34d399" : "#f87171",
                  fontWeight: "700",
                }}
              >
                {job.is_open ? "🟢 Open to Apply" : "🔴 Drive Closed"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyJobSettings;
