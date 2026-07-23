import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/client";
import { getSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./JobApplication.css";

function JobApplication() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState("details"); // 'details' | 'apply'
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [alreadyApplied, setAlreadyApplied] = useState(false);

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [profile, setProfile] = useState({
    phone: "",
    department: "",
    year_of_study: "",
    cgpa: "",
    skills: "",
    linkedin_url: "",
    portfolio_url: "",
    why_fit: "",
    availability_date: "",
    declaration: false,
  });

  useEffect(() => {
    setLoadingJob(true);
    api
      .get(`/jobs/${jobId}`)
      .then((response) => {
        setJob(response.data);
      })
      .catch(() => setError("Unable to load job details."))
      .finally(() => setLoadingJob(false));

    api
      .get("/students/me")
      .then((response) => {
        const d = response.data;
        setProfile((prev) => ({
          ...prev,
          phone: d.phone || prev.phone,
          department: d.department || prev.department,
          year_of_study: d.year_of_study || prev.year_of_study,
          cgpa: d.cgpa || prev.cgpa,
        }));
      })
      .catch(() => {});

    // Check if student has already applied to this specific job
    const student = getSession("student");
    if (student?.accessToken) {
      api
        .get("/students/me/applications")
        .then((res) => {
          const apps = res.data || [];
          const hasApplied = apps.some((a) => String(a.job_id) === String(jobId));
          if (hasApplied) {
            setAlreadyApplied(true);
          }
        })
        .catch(() => {});
    }
  }, [jobId]);

  const updateProfile = (event) => {
    const { name, type, checked, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const studentCgpa = parseFloat(profile.cgpa || 0);
  const requiredCgpa = parseFloat(job?.min_cgpa || 0);
  const isIneligibleCgpa = studentCgpa > 0 && requiredCgpa > 0 && studentCgpa < requiredCgpa;

  const submitApplication = async (event) => {
    event.preventDefault();
    if (alreadyApplied) {
      showError("You have already submitted an application for this position.");
      return;
    }

    if (isIneligibleCgpa) {
      showError(`Ineligible: Minimum ${requiredCgpa} CGPA required. Your CGPA is ${studentCgpa}.`);
      return;
    }

    if (!resume) {
      showError("Please select a valid PDF resume file.");
      return;
    }

    const allowedKeys = [
      "phone",
      "department",
      "year_of_study",
      "cgpa",
      "skills",
      "linkedin_url",
      "portfolio_url",
      "why_fit",
      "availability_date",
      "declaration",
    ];

    const data = new FormData();
    data.append("resume", resume);
    data.append("cover_letter", coverLetter);
    allowedKeys.forEach((key) => {
      if (profile[key] !== undefined && profile[key] !== null) {
        data.append(key, String(profile[key]));
      }
    });

    try {
      setSubmitting(true);
      setError("");
      await api.post(`/jobs/${jobId}/applications`, data);
      showSuccess("Application submitted successfully! Redirecting...");
      setTimeout(() => navigate("/my-applications"), 1500);
    } catch (requestError) {
      const msg = requestError.response?.data?.message || "Unable to submit application.";
      setError(msg);
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="application-page-wrapper">
        <div style={{ textAlign: "center", padding: "100px 20px" }}>
          <div className="spinner"></div>
          <h2>Loading Job Details...</h2>
        </div>
      </div>
    );
  }

  const initialLetter = (job?.company_name || "C").charAt(0).toUpperCase();

  return (
    <div className="application-page-wrapper">
      {/* Top Navbar */}
      <header className="app-navbar">
        <button className="back-link-btn" onClick={() => navigate("/jobs")}>
          ← Back to All Jobs
        </button>
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>
          Role: <strong style={{ color: "#f8fafc" }}>{job?.job_title}</strong>
        </div>
      </header>

      {/* Tabs Header */}
      <div className="view-tabs-bar">
        <button
          className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          🏢 1. Company Overview & Policies
        </button>
        <button
          className={`tab-btn ${activeTab === "apply" ? "active" : ""}`}
          onClick={() => setActiveTab("apply")}
        >
          📝 2. Application Form
        </button>
      </div>

      <div className="app-container">
        {/* Company & Job Hero Banner */}
        <section className="job-detail-hero">
          <div className="job-detail-header">
            <div className="company-logo-large">{initialLetter}</div>
            <div className="job-main-title">
              <h1>{job?.job_title}</h1>
              <div className="company-sub-line">
                <span>{job?.company_name}</span>
                <span className="verified-badge">✓ Verified Recruiter</span>
              </div>
              <div className="hero-badges-row">
                <span className="hero-badge ctc">💰 {job?.salary_lpa} LPA Package</span>
                <span className="hero-badge cgpa" style={isIneligibleCgpa ? { background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)" } : {}}>
                  🎓 Min {job?.min_cgpa || "0.0"} CGPA
                </span>
                <span className="hero-badge loc">📍 {job?.location || "Remote"}</span>
                <span className="hero-badge rounds">
                  🔄 {job?.round_count || 1} Recruitment Rounds
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* INELIGIBLE CGPA WARNING BANNER */}
        {isIneligibleCgpa && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "2px solid rgba(239, 68, 68, 0.4)",
              borderRadius: "18px",
              padding: "20px 24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(239, 68, 68, 0.15)",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#f87171", fontWeight: "800" }}>
                🚫 Ineligible for this Placement Drive
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1" }}>
                This company requires a minimum cutoff of <strong>{requiredCgpa.toFixed(2)} CGPA</strong>. Your current profile CGPA is <strong>{studentCgpa.toFixed(2)}</strong>.
              </p>
            </div>
            <button
              className="back-link-btn"
              style={{ background: "rgba(239, 68, 68, 0.3)", color: "#ffffff", border: "1px solid rgba(239, 68, 68, 0.5)", padding: "10px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
              onClick={() => navigate("/student/dashboard")}
            >
              👤 Update Profile CGPA →
            </button>
          </div>
        )}

        {/* ALREADY APPLIED BANNER */}
        {alreadyApplied && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.15)",
              border: "2px solid rgba(16, 185, 129, 0.4)",
              borderRadius: "18px",
              padding: "20px 24px",
              marginBottom: "24px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 8px 20px rgba(16, 185, 129, 0.15)",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 4px", fontSize: "18px", color: "#34d399", fontWeight: "800" }}>
                ✓ Application Already Submitted
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#cbd5e1" }}>
                You have already submitted your candidate profile & resume for <strong>{job?.job_title}</strong> at <strong>{job?.company_name}</strong>.
              </p>
            </div>
            <button
              className="back-link-btn"
              style={{ background: "#10b981", color: "#ffffff", border: "none", padding: "10px 18px", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}
              onClick={() => navigate("/my-applications")}
            >
              📋 View Application Status →
            </button>
          </div>
        )}

        {/* TAB 1: COMPANY OVERVIEW, POLICIES & JOB DESCRIPTION */}
        {activeTab === "details" && (
          <div className="detail-grid-layout">
            <div className="main-details-column">
              {/* Job Description Card */}
              <div className="section-card">
                <h3 className="section-title">📌 Job Description & Responsibilities</h3>
                <p className="section-text">{job?.description}</p>
                <div style={{ marginTop: "16px" }}>
                  <h4 style={{ color: "#38bdf8", marginBottom: "8px" }}>Key Expectations:</h4>
                  <ul style={{ color: "#cbd5e1", lineHeight: "1.7", paddingLeft: "20px" }}>
                    <li>Design, code, and maintain robust modules in production environments.</li>
                    <li>Collaborate with cross-functional technical teams and product managers.</li>
                    <li>Participate in code reviews, automated unit testing, and agile sprints.</li>
                  </ul>
                </div>
              </div>

              {/* Company Culture & Workspace Images */}
              <div className="section-card">
                <h3 className="section-title">🏢 Workspace & Corporate Culture</h3>
                <p className="section-text">
                  Our organization fosters an innovative, inclusive culture prioritizing high performance,
                  continuous learning, and transparent career progression.
                </p>
                <div className="gallery-grid">
                  <div className="gallery-card">
                    <img src="/images/tech_workspace.jpg" alt="Modern Tech Office" />
                    <div className="gallery-caption">Sleek Engineering Workspaces & Labs</div>
                  </div>
                  <div className="gallery-card">
                    <img src="/images/team_culture.jpg" alt="Team Collaboration Space" />
                    <div className="gallery-caption">Collaborative Tech & Design Lounge</div>
                  </div>
                </div>
              </div>

              {/* Company Policies */}
              <div className="section-card">
                <h3 className="section-title">🛡️ Corporate Policies & Perks</h3>
                <div className="policies-grid">
                  <div className="policy-item">
                    <div className="policy-icon">🏡</div>
                    <h4>Flexible Hybrid Policy</h4>
                    <p>Options for remote work flexibility alongside state-of-the-art office spaces.</p>
                  </div>
                  <div className="policy-item">
                    <div className="policy-icon">🏥</div>
                    <h4>Health & Wellness</h4>
                    <p>Comprehensive health insurance coverage for employees and eligible family members.</p>
                  </div>
                  <div className="policy-item">
                    <div className="policy-icon">📜</div>
                    <h4>Fair Contract & No Bond</h4>
                    <p>Standard probation period with performance reviews and clear path to permanent employment.</p>
                  </div>
                  <div className="policy-item">
                    <div className="policy-icon">🚀</div>
                    <h4>Learning & Mentorship</h4>
                    <p>Annual learning budgets for certifications, tech conferences, and skill upgrades.</p>
                  </div>
                </div>
              </div>

              {/* Selection Process Pipeline */}
              <div className="section-card">
                <h3 className="section-title">🔄 Selection & Recruitment Pipeline</h3>
                <div className="selection-pipeline">
                  <div className="pipeline-step">
                    <div className="step-number">1</div>
                    <div className="step-details">
                      <h5>Online Technical & Aptitude Assessment</h5>
                      <p>Evaluating core fundamentals, problem-solving, and coding competency.</p>
                    </div>
                  </div>
                  <div className="pipeline-step">
                    <div className="step-number">2</div>
                    <div className="step-details">
                      <h5>Technical Interview Round</h5>
                      <p>Deep dive into project architecture, data structures, and live coding.</p>
                    </div>
                  </div>
                  {job?.round_count >= 3 && (
                    <div className="pipeline-step">
                      <div className="step-number">3</div>
                      <div className="step-details">
                        <h5>HR & Executive Discussion</h5>
                        <p>Cultural fitment, role alignment, CTC discussion, and offer rollout.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sticky Sidebar CTA */}
            <div className="sticky-sidebar">
              <div className="sidebar-card">
                <h3>Application Checklist</h3>
                <div className="quick-meta-list">
                  <div className="quick-meta-item">
                    <span>Min CGPA Required:</span>
                    <strong style={isIneligibleCgpa ? { color: "#f87171" } : {}}>{job?.min_cgpa || "Any"}</strong>
                  </div>
                  <div className="quick-meta-item">
                    <span>Annual Package:</span>
                    <strong>{job?.salary_lpa} LPA</strong>
                  </div>
                  <div className="quick-meta-item">
                    <span>Deadline:</span>
                    <strong>{job?.deadline ? new Date(job.deadline).toLocaleDateString() : "Open"}</strong>
                  </div>
                  <div className="quick-meta-item">
                    <span>Resume Format:</span>
                    <strong>PDF (&lt; 5MB)</strong>
                  </div>
                </div>

                {alreadyApplied ? (
                  <button
                    className="cta-apply-btn"
                    style={{ background: "linear-gradient(135deg, #10b981, #059669)", cursor: "pointer" }}
                    onClick={() => navigate("/my-applications")}
                  >
                    ✓ Track Application Status →
                  </button>
                ) : isIneligibleCgpa ? (
                  <button
                    className="cta-apply-btn"
                    style={{ background: "rgba(239, 68, 68, 0.2)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.4)", cursor: "not-allowed" }}
                    disabled
                  >
                    🚫 Below Cutoff ({requiredCgpa} CGPA)
                  </button>
                ) : (
                  <button className="cta-apply-btn" onClick={() => setActiveTab("apply")}>
                    Proceed to Apply →
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: APPLICATION FORM */}
        {activeTab === "apply" && (
          <div className="form-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h2 style={{ margin: 0, fontSize: "24px", color: "#f8fafc" }}>
                Submit Application for {job?.job_title}
              </h2>
              <button
                className="back-link-btn"
                style={{ fontSize: "12px", padding: "6px 12px" }}
                onClick={() => setActiveTab("details")}
              >
                ← View Policies
              </button>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#f87171",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={submitApplication}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input
                    name="phone"
                    type="text"
                    value={profile.phone}
                    onChange={updateProfile}
                    disabled={alreadyApplied || isIneligibleCgpa}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Department / Branch *</label>
                  <input
                    name="department"
                    type="text"
                    value={profile.department}
                    onChange={updateProfile}
                    disabled={alreadyApplied || isIneligibleCgpa}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Year of Study *</label>
                  <input
                    name="year_of_study"
                    type="number"
                    min="1"
                    max="8"
                    value={profile.year_of_study}
                    onChange={updateProfile}
                    disabled={alreadyApplied || isIneligibleCgpa}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Current CGPA *</label>
                  <input
                    name="cgpa"
                    type="number"
                    min="0"
                    max="10"
                    step="0.01"
                    value={profile.cgpa}
                    onChange={updateProfile}
                    disabled={alreadyApplied || isIneligibleCgpa}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Technical & Core Skills *</label>
                  <textarea
                    name="skills"
                    value={profile.skills}
                    onChange={updateProfile}
                    placeholder="Example: JavaScript, React, Python, PostgreSQL, Data Structures"
                    disabled={alreadyApplied || isIneligibleCgpa}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>LinkedIn Profile URL</label>
                  <input
                    name="linkedin_url"
                    type="url"
                    value={profile.linkedin_url}
                    onChange={updateProfile}
                    placeholder="https://linkedin.com/in/username"
                    disabled={alreadyApplied || isIneligibleCgpa}
                  />
                </div>

                <div className="form-group">
                  <label>GitHub / Portfolio URL</label>
                  <input
                    name="portfolio_url"
                    type="url"
                    value={profile.portfolio_url}
                    onChange={updateProfile}
                    placeholder="https://github.com/username"
                    disabled={alreadyApplied || isIneligibleCgpa}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Cover Letter (Optional)</label>
                  <textarea
                    name="cover_letter"
                    value={coverLetter}
                    onChange={(e) => setCoverLetter(e.target.value)}
                    maxLength="2000"
                    placeholder="Briefly introduce yourself and highlight why this position aligns with your goals..."
                    disabled={alreadyApplied || isIneligibleCgpa}
                  />
                </div>

                <div className="form-group full-width">
                  <label>Why are you a strong fit for this role? *</label>
                  <textarea
                    name="why_fit"
                    value={profile.why_fit}
                    onChange={updateProfile}
                    minLength="20"
                    maxLength="2000"
                    placeholder="Describe your project experience, technical strengths, and relevant coursework..."
                    disabled={alreadyApplied || isIneligibleCgpa}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label>Earliest Joining Availability Date *</label>
                  <input
                    name="availability_date"
                    type="date"
                    value={profile.availability_date}
                    onChange={updateProfile}
                    disabled={alreadyApplied || isIneligibleCgpa}
                    required
                  />
                </div>

                {/* PDF Resume Upload Dropzone */}
                <div className="form-group full-width">
                  <label>Upload Resume (PDF format, max 5 MB) *</label>
                  <div
                    className="upload-dropzone"
                    onClick={() => !alreadyApplied && !isIneligibleCgpa && document.getElementById("resume-input").click()}
                    style={{ cursor: (alreadyApplied || isIneligibleCgpa) ? "not-allowed" : "pointer" }}
                  >
                    <div className="upload-icon">📄</div>
                    <div className="upload-title">
                      {resume ? resume.name : alreadyApplied ? "Application Already Submitted" : isIneligibleCgpa ? "Ineligible due to CGPA Cutoff" : "Click to select or drop your PDF Resume"}
                    </div>
                    <div className="upload-desc">Only PDF files up to 5 MB are accepted</div>
                    <input
                      id="resume-input"
                      type="file"
                      accept="application/pdf"
                      style={{ display: "none" }}
                      disabled={alreadyApplied || isIneligibleCgpa}
                      onChange={(e) => setResume(e.target.files?.[0] || null)}
                    />

                    {resume && (
                      <div className="selected-file-badge">
                        ✓ Selected: {resume.name} ({(resume.size / 1024 / 1024).toFixed(2)} MB)
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-group full-width">
                  <div className="declaration-box">
                    <input
                      id="declaration-check"
                      name="declaration"
                      type="checkbox"
                      checked={profile.declaration}
                      onChange={updateProfile}
                      disabled={alreadyApplied || isIneligibleCgpa}
                      required
                    />
                    <label htmlFor="declaration-check">
                      I hereby declare that all information provided in this application is accurate and true to the best of my knowledge.
                    </label>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={submitting || alreadyApplied || isIneligibleCgpa}
                style={{ opacity: (alreadyApplied || isIneligibleCgpa) ? 0.6 : 1, cursor: (alreadyApplied || isIneligibleCgpa) ? "not-allowed" : "pointer" }}
              >
                {alreadyApplied ? "✓ Application Already Submitted" : isIneligibleCgpa ? `🚫 Below Cutoff (${requiredCgpa} CGPA)` : submitting ? "Submitting Application..." : "🚀 Confirm & Submit Application"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default JobApplication;
