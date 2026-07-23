import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearSession, getSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./CompanyDashboard.css";

function CompanyDashboard() {
  const sessionCompany = getSession("company");
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState("workspace"); // 'workspace' | 'profile'
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  // Company Profile State
  const [companyProfile, setCompanyProfile] = useState({
    company_name: "",
    email: "",
    location: "",
    package_lpa: "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get("/companies/me/jobs")
      .then((res) => setJobs(res.data || []))
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));

    api
      .get("/companies/me")
      .then((res) => setCompanyProfile(res.data))
      .catch(() => {});
  }, []);

  const handleProfileChange = (e) => {
    setCompanyProfile({
      ...companyProfile,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      setProfileMsg("");
      setProfileErr("");
      const res = await api.patch("/companies/me", {
        company_name: companyProfile.company_name,
        location: companyProfile.location,
        package_lpa: companyProfile.package_lpa,
      });

      setCompanyProfile(res.data.company);
      const msg = "🎉 Company profile updated successfully!";
      setProfileMsg(msg);
      showSuccess(msg);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update company profile.";
      setProfileErr(msg);
      showError(msg);
    } finally {
      setSavingProfile(false);
    }
  };

  // Filter Computation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      const applicantCount = parseInt(job.applicant_count) || 0;

      if (activeFilter === "open") return job.is_open === true;
      if (activeFilter === "closed") return job.is_open === false;
      if (activeFilter === "high_applicants") return applicantCount >= 1;

      return true;
    });
  }, [jobs, searchTerm, activeFilter]);

  // Analytics Computation
  const stats = useMemo(() => {
    const totalJobs = jobs.length;
    const openDrives = jobs.filter((j) => j.is_open).length;
    const totalApplicants = jobs.reduce((sum, j) => sum + (parseInt(j.applicant_count) || 0), 0);
    const packages = jobs.map((j) => parseFloat(j.salary_lpa) || 0);
    const avgPackage =
      packages.length > 0 ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1) : 0;

    return { totalJobs, openDrives, totalApplicants, avgPackage };
  }, [jobs]);

  const initialLetter = (
    companyProfile.company_name ||
    sessionCompany?.company_name ||
    "C"
  )
    .charAt(0)
    .toUpperCase();

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
    <div className="company-dashboard-wrapper">
      {/* Top Navbar */}
      <header className="company-navbar">
        <div className="company-brand-info" onClick={() => setActiveTab("workspace")}>
          <div className="company-logo-avatar">{initialLetter}</div>
          <div className="company-brand-text">
            <h2>Corporate Recruiter Portal</h2>
          </div>
        </div>

        <div className="company-user-actions">
          <button className="comp-btn primary" onClick={() => navigate("/post-job")}>
            ➕ Post New Job
          </button>

          {/* Sleek Rounded User Corner Pill */}
          <div
            className="user-profile-corner-pill"
            onClick={() => setActiveTab(activeTab === "profile" ? "workspace" : "profile")}
            title="Click to view & edit company profile"
          >
            <div className="corner-avatar company">{initialLetter}</div>
            <span className="corner-user-name">
              {companyProfile.company_name || "Company"}
            </span>
            <span className="corner-toggle-tag company">
              {activeTab === "profile" ? "Close Edit ✕" : "Profile 🏢"}
            </span>
          </div>

          <button
            className="comp-btn secondary"
            onClick={() => {
              clearSession("company");
              navigate("/");
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN VIEW: WORKSPACE & JOBS OR PROFILE */}
      {activeTab === "workspace" ? (
        <>
          {/* Hero Section */}
          <section className="company-hero">
            <div className="hero-title-group">
              <h1>Employer Command Center</h1>
              <p>Manage job postings, review applicant profiles, and track interview pipelines.</p>
            </div>

            <button className="comp-btn primary" style={{ padding: "12px 24px" }} onClick={() => navigate("/post-job")}>
              🚀 Create Opening
            </button>
          </section>

          {/* Analytics Stats Bar */}
          <section className="company-stats-bar">
            <div className="comp-stat-card">
              <div className="comp-stat-icon purple">💼</div>
              <div className="comp-stat-info">
                <h4>{stats.totalJobs}</h4>
                <p>Total Positions</p>
              </div>
            </div>
            <div className="comp-stat-card">
              <div className="comp-stat-icon green">⚡</div>
              <div className="comp-stat-info">
                <h4>{stats.openDrives}</h4>
                <p>Active Hiring Drives</p>
              </div>
            </div>
            <div className="comp-stat-card">
              <div className="comp-stat-icon blue">👥</div>
              <div className="comp-stat-info">
                <h4>{stats.totalApplicants}</h4>
                <p>Total Applications</p>
              </div>
            </div>
            <div className="comp-stat-card">
              <div className="comp-stat-icon amber">💎</div>
              <div className="comp-stat-info">
                <h4>{stats.avgPackage > 0 ? `${stats.avgPackage} LPA` : "N/A"}</h4>
                <p>Average CTC Offered</p>
              </div>
            </div>
          </section>

          {/* Search & Filter Controls */}
          <section className="company-controls">
            <div className="comp-search-box">
              <span className="comp-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search posted jobs by title or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="comp-filter-pills">
              <button
                className={`comp-filter-pill ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveFilter("all")}
              >
                All Jobs ({jobs.length})
              </button>
              <button
                className={`comp-filter-pill ${activeFilter === "open" ? "active" : ""}`}
                onClick={() => setActiveFilter("open")}
              >
                🟢 Active Drives ({stats.openDrives})
              </button>
              <button
                className={`comp-filter-pill ${activeFilter === "high_applicants" ? "active" : ""}`}
                onClick={() => setActiveFilter("high_applicants")}
              >
                👥 Has Applicants
              </button>
              <button
                className={`comp-filter-pill ${activeFilter === "closed" ? "active" : ""}`}
                onClick={() => setActiveFilter("closed")}
              >
                🔴 Closed Drives
              </button>
            </div>
          </section>

          {/* Main Content / Jobs Grid */}
          {loading ? (
            <div className="comp-empty-state">
              <div className="spinner"></div>
              <h3 className="comp-empty-title">Loading Workspace</h3>
              <p className="comp-empty-desc">Fetching your posted job opportunities...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="comp-empty-state">
              <div className="comp-empty-icon">📢</div>
              <h3 className="comp-empty-title">
                {jobs.length === 0 ? "No Job Postings Yet" : "No Matching Openings"}
              </h3>
              <p className="comp-empty-desc">
                {jobs.length === 0
                  ? "Create your first hiring drive to start receiving candidate applications."
                  : "Try adjusting your search criteria or filter pills."}
              </p>
              {jobs.length === 0 && (
                <button className="comp-btn primary" style={{ margin: "0 auto" }} onClick={() => navigate("/post-job")}>
                  + Post First Job
                </button>
              )}
            </div>
          ) : (
            <div className="company-jobs-grid">
              {filteredJobs.map((job) => {
                const count = parseInt(job.applicant_count) || 0;

                return (
                  <div className="comp-job-card" key={job.job_id}>
                    <div>
                      <div className="card-top-header">
                        <div>
                          <h3>{job.job_title}</h3>
                          <span className="card-location">📍 {job.location || "Remote"}</span>
                        </div>
                        <span className={`status-pill ${job.is_open ? "open" : "closed"}`}>
                          {job.is_open ? "🟢 Active" : "🔴 Closed"}
                        </span>
                      </div>

                      <div className="card-badges-flex">
                        <span className="comp-badge salary">💰 {job.salary_lpa} LPA</span>
                        <span className="comp-badge rounds">🔄 {job.round_count} Rounds</span>
                        <span className="comp-badge applicants">👥 {count} {count === 1 ? "Applicant" : "Applicants"}</span>
                      </div>

                      <div className="card-deadline-row">
                        <span>Application Deadline:</span>
                        <strong>{formatDate(job.deadline)}</strong>
                      </div>
                    </div>

                    <div className="card-actions-grid">
                      <button
                        className="action-manage-btn"
                        onClick={() => navigate(`/company/jobs/${job.job_id}/applicants`)}
                      >
                        👥 Manage Applicants ({count})
                      </button>
                      <button
                        className="action-settings-btn"
                        onClick={() => navigate(`/company/jobs/${job.job_id}/settings`)}
                      >
                        ⚙️ Settings
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* TAB 2: COMPANY PROFILE & USER INFORMATION */
        <div style={{ maxWidth: "1216px", margin: "32px auto 0", padding: "0 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "36px" }}>
          {/* Edit Profile Form */}
          <div className="comp-job-card" style={{ padding: "36px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", paddingBottom: "16px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <div>
                <h1 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: "800", color: "#f8fafc" }}>
                  Company Profile & Account Details
                </h1>
                <p style={{ margin: 0, fontSize: "14px", color: "#94a3b8" }}>
                  Update your corporate identity, headquarter location, and typical hiring CTC package.
                </p>
              </div>
              <button
                className="comp-btn secondary"
                style={{ fontSize: "13px", padding: "8px 14px" }}
                onClick={() => setActiveTab("workspace")}
              >
                ← Back to Workspace
              </button>
            </div>

            {profileMsg && (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  color: "#34d399",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  fontSize: "14px",
                }}
              >
                {profileMsg}
              </div>
            )}

            {profileErr && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  color: "#f87171",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  marginBottom: "24px",
                  fontSize: "14px",
                }}
              >
                ⚠️ {profileErr}
              </div>
            )}

            <form onSubmit={handleProfileSave}>
              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px" }}>
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={companyProfile.company_name}
                  onChange={handleProfileChange}
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "12px", color: "#fff", fontSize: "14px" }}
                  required
                />
              </div>

              <div style={{ marginBottom: "18px" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px" }}>
                  Corporate Email Address (Identity Locked)
                </label>
                <input
                  type="email"
                  value={companyProfile.email}
                  style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", background: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "12px", color: "#94a3b8", fontSize: "14px", cursor: "not-allowed" }}
                  disabled
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "18px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px" }}>
                    Headquarter Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={companyProfile.location}
                    onChange={handleProfileChange}
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "12px", color: "#fff", fontSize: "14px" }}
                    required
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#cbd5e1", marginBottom: "6px" }}>
                    Typical Package (LPA) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="package_lpa"
                    value={companyProfile.package_lpa}
                    onChange={handleProfileChange}
                    style={{ width: "100%", boxSizing: "border-box", padding: "12px 16px", background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.12)", borderRadius: "12px", color: "#fff", fontSize: "14px" }}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="comp-btn primary"
                style={{ width: "100%", padding: "16px", borderRadius: "14px", fontSize: "16px", fontWeight: "800", marginTop: "10px" }}
                disabled={savingProfile}
              >
                {savingProfile ? "Saving Company Profile..." : "💾 Save Company Profile Changes"}
              </button>
            </form>
          </div>

          {/* Right Side: Digital Corporate Verification Card */}
          <div className="comp-job-card" style={{ padding: "28px", height: "fit-content", position: "sticky", top: "36px" }}>
            <div style={{ fontSize: "13px", fontWeight: "800", color: "#a78bfa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", paddingBottom: "12px", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
              🏢 Verified Recruiter Badge
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.7)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", padding: "24px", textAlign: "center" }}>
              <div style={{ width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg, #7c3aed, #8b5cf6)", color: "#fff", fontSize: "32px", fontWeight: "800", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", boxShadow: "0 8px 20px rgba(124, 58, 237, 0.4)" }}>
                {initialLetter}
              </div>

              <h3 style={{ fontSize: "22px", fontWeight: "800", color: "#f8fafc", margin: "0 0 4px" }}>
                {companyProfile.company_name || "Company Name"}
              </h3>
              <p style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 16px" }}>
                📍 {companyProfile.location || "Location"}
              </p>

              <div style={{ display: "flex", justifyContent: "space-around", background: "rgba(30, 41, 59, 0.6)", borderRadius: "12px", padding: "12px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Package</label>
                  <strong style={{ fontSize: "16px", color: "#34d399" }}>{companyProfile.package_lpa ? `${companyProfile.package_lpa} LPA` : "N/A"}</strong>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", color: "#94a3b8", textTransform: "uppercase" }}>Status</label>
                  <strong style={{ fontSize: "16px", color: "#a78bfa" }}>Verified</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyDashboard;
