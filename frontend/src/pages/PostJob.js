import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { getSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./PostJob.css";

function PostJob() {
  const company = getSession("company");
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [job, setJob] = useState({
    job_title: "",
    description: "",
    min_cgpa: "",
    salary_lpa: "",
    location: "",
    deadline: "",
    round_count: "1",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");
      const res = await api.post("/jobs", job);
      const msg = res.data.message || "Job published successfully! Redirecting to workspace...";
      setSuccess(msg);
      showSuccess(msg);
      setTimeout(() => {
        navigate("/company/dashboard");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to post job. Please check your inputs.";
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

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
    <div className="postjob-page-wrapper">
      {/* Top Navbar */}
      <header className="postjob-navbar">
        <button className="back-dash-btn" onClick={() => navigate("/company/dashboard")}>
          ← Back to Employer Dashboard
        </button>
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>
          Recruiter: <strong style={{ color: "#f8fafc" }}>{company?.company_name}</strong>
        </div>
      </header>

      <div className="postjob-container">
        {/* Left Side: Job Creation Form */}
        <div className="postjob-form-card">
          <div className="postjob-header">
            <span className="postjob-badge">Job Creation Studio</span>
            <h1>Publish New Hiring Opening</h1>
            <p>Post your job role to thousands of qualified graduating candidates.</p>
          </div>

          {error && (
            <div
              style={{
                background: "rgba(239, 68, 68, 0.15)",
                border: "1px solid rgba(239, 68, 68, 0.35)",
                color: "#f87171",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#34d399",
                padding: "12px 16px",
                borderRadius: "12px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              🎉 {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section 1: Basic Role Information */}
            <div className="form-section-title">📌 1. Basic Role & Compensation</div>

            <div className="postjob-field full">
              <label>Job Title / Position Name *</label>
              <input
                type="text"
                name="job_title"
                placeholder="e.g. Software Engineer / Data Analyst"
                value={job.job_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="postjob-grid-2">
              <div className="postjob-field">
                <label>Job Location *</label>
                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Bengaluru / Hyderabad / Remote"
                  value={job.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="postjob-field">
                <label>Annual Package (CTC in LPA) *</label>
                <input
                  type="number"
                  step="0.01"
                  name="salary_lpa"
                  placeholder="e.g. 12.50"
                  value={job.salary_lpa}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Section 2: Eligibility & Recruitment Process */}
            <div className="form-section-title">🎓 2. Candidate Eligibility & Process</div>

            <div className="postjob-grid-2">
              <div className="postjob-field">
                <label>Minimum CGPA Cutoff *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  name="min_cgpa"
                  placeholder="e.g. 7.50"
                  value={job.min_cgpa}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="postjob-field">
                <label>Number of Selection Rounds (1 - 10) *</label>
                <input
                  type="number"
                  name="round_count"
                  min="1"
                  max="10"
                  placeholder="3"
                  value={job.round_count}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="postjob-field full">
              <label>Application Deadline Date *</label>
              <input
                type="date"
                name="deadline"
                value={job.deadline}
                onChange={handleChange}
                required
              />
            </div>

            {/* Section 3: Detailed Job Description */}
            <div className="form-section-title">📝 3. Detailed Role Description</div>

            <div className="postjob-field full">
              <label>Job Description & Responsibilities *</label>
              <textarea
                name="description"
                placeholder="Describe role responsibilities, tech stack requirements, and candidate expectations..."
                value={job.description}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="submit-job-btn" disabled={submitting}>
              {submitting ? "Publishing Job..." : "🚀 Publish Job Opportunity"}
            </button>
          </form>
        </div>

        {/* Right Side: Real-Time Live Student View Preview */}
        <div className="live-preview-card">
          <div className="preview-title">
            <span>👁️ Live Card Preview</span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Student Directory View</span>
          </div>

          <div className="preview-job-card">
            <div className="preview-card-header">
              <div className="preview-avatar">{initialLetter}</div>
              <div className="preview-meta">
                <h4>{job.job_title || "Software Development Engineer"}</h4>
                <p>{company?.company_name || "Tech Company"} · {job.location || "Location"}</p>
              </div>
            </div>

            <div className="preview-badges">
              <span className="preview-badge ctc">
                💰 {job.salary_lpa ? `${job.salary_lpa} LPA` : "Package"}
              </span>
              <span className="preview-badge cgpa">
                🎓 Min {job.min_cgpa || "0.00"} CGPA
              </span>
              <span className="preview-badge rounds">
                🔄 {job.round_count || 1} {parseInt(job.round_count) === 1 ? "Round" : "Rounds"}
              </span>
            </div>

            <div className="preview-desc-box">
              {job.description || "Your full job description and responsibilities will appear here for candidate evaluation..."}
            </div>

            <div className="preview-footer">
              <span>⏳ Deadline: <strong>{formatDate(job.deadline)}</strong></span>
              <span style={{ color: "#38bdf8", fontWeight: "700" }}>View & Apply →</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
