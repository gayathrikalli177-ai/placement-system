import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearSession, getSession } from "../auth/session";
import "./Jobs.css";

function Jobs({ hideNavbar = false }) {
  const [jobs, setJobs] = useState([]);
  const [appliedJobIds, setAppliedJobIds] = useState(new Set());
  const [studentProfile, setStudentProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedJobs, setExpandedJobs] = useState({});

  const navigate = useNavigate();
  const student = getSession("student");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/jobs");
      setJobs(res.data || []);

      // If student is logged in, fetch submitted applications & current student profile (CGPA)
      const currentStudent = getSession("student");
      if (currentStudent?.accessToken) {
        try {
          const [appRes, profRes] = await Promise.all([
            api.get("/students/me/applications"),
            api.get("/students/me"),
          ]);
          const ids = new Set((appRes.data || []).map((a) => a.job_id));
          setAppliedJobIds(ids);
          setStudentProfile(profRes.data);
        } catch (e) {
          // Non-blocking catch
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleReadMore = (jobId) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const applyJob = (jobId, minCgpa) => {
    const currentStudent = getSession("student");
    if (!currentStudent?.accessToken) {
      alert("Please log in as a student to apply.");
      return;
    }

    const currentCgpa = parseFloat(studentProfile?.cgpa || currentStudent?.cgpa || 0);
    const requiredCgpa = parseFloat(minCgpa || 0);

    if (requiredCgpa > 0 && currentCgpa < requiredCgpa) {
      alert(
        `🚫 CGPA Cutoff Eligibility Warning:\n\nThis position requires a minimum CGPA of ${requiredCgpa.toFixed(
          2
        )}, but your current profile CGPA is ${currentCgpa.toFixed(
          2
        )}.\n\nCandidates below the cutoff CGPA cannot apply.`
      );
      return;
    }

    navigate(`/jobs/${jobId}/apply`);
  };

  // Filtered Jobs Computation
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      const salary = parseFloat(job.salary_lpa) || 0;
      const minCgpa = parseFloat(job.min_cgpa) || 0;
      const currentCgpa = parseFloat(studentProfile?.cgpa || student?.cgpa || 0);

      if (activeFilter === "high_ctc") return salary >= 9.0;
      if (activeFilter === "eligible") return currentCgpa >= minCgpa;
      if (activeFilter === "multi_round") return (job.round_count || 1) >= 3;

      return true;
    });
  }, [jobs, searchTerm, activeFilter, studentProfile, student]);

  // Statistics
  const stats = useMemo(() => {
    if (!jobs.length) return { total: 0, maxSalary: 0, avgSalary: 0 };
    const salaries = jobs.map((j) => parseFloat(j.salary_lpa) || 0);
    const maxSalary = Math.max(...salaries);
    const avgSalary = (salaries.reduce((a, b) => a + b, 0) / jobs.length).toFixed(1);
    return { total: jobs.length, maxSalary, avgSalary };
  }, [jobs]);

  const formatDate = (dateStr) => {
    if (!dateStr) return "Open";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch (e) {
      return dateStr;
    }
  };

  const studentCgpa = parseFloat(studentProfile?.cgpa || student?.cgpa || 0);

  return (
    <div className="jobs-page-wrapper">
      {/* Top Navbar (Hidden when embedded in Dashboard) */}
      {!hideNavbar && (
        <header className="jobs-navbar">
          <div className="jobs-logo-title">
            <div className="jobs-logo-icon">💼</div>
            <div className="jobs-brand-text">
              <h2>Campus Portal</h2>
              <p>Placement & Career Hub</p>
            </div>
          </div>

          <div className="jobs-user-actions">
            {student ? (
              <>
                <button className="jobs-nav-btn primary" onClick={() => navigate("/my-applications")}>
                  📋 My Applications
                </button>
                <button
                  className="jobs-nav-btn secondary"
                  onClick={() => {
                    clearSession("student");
                    navigate("/");
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <button className="jobs-nav-btn primary" onClick={() => navigate("/student/login")}>
                Student Login
              </button>
            )}
          </div>
        </header>
      )}

      {/* Hero Banner */}
      <section className="jobs-hero">
        <div className="jobs-hero-badge">⚡ Live Recruitment Drive 2026</div>
        <h1>
          {student ? `Welcome back, ${(studentProfile?.full_name || student.full_name).split(" ")[0]}!` : "Explore Dream Opportunities"}
        </h1>
        <p>
          Discover top campus placements from Fortune 500 MNCs and technology leaders with upfront CTC packages and clear eligibility criteria.
        </p>
      </section>

      {/* Analytics Stats Bar */}
      <section className="jobs-stats-bar">
        <div className="stat-card">
          <div className="stat-icon blue">💼</div>
          <div className="stat-info">
            <h4>{stats.total}</h4>
            <p>Active Job Drives</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">💰</div>
          <div className="stat-info">
            <h4>{stats.maxSalary} LPA</h4>
            <p>Highest CTC Offered</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">📊</div>
          <div className="stat-info">
            <h4>{stats.avgSalary} LPA</h4>
            <p>Average Package</p>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls */}
      <section className="jobs-controls">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by job title, company, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-pills">
          <button
            className={`filter-pill ${activeFilter === "all" ? "active" : ""}`}
            onClick={() => setActiveFilter("all")}
          >
            All Openings ({jobs.length})
          </button>

          <button
            className={`filter-pill ${activeFilter === "high_ctc" ? "active" : ""}`}
            onClick={() => setActiveFilter("high_ctc")}
          >
            💎 High CTC (&ge; 9 LPA)
          </button>

          <button
            className={`filter-pill ${activeFilter === "eligible" ? "active" : ""}`}
            onClick={() => setActiveFilter("eligible")}
          >
            🎓 Eligible Drives Only ({studentCgpa > 0 ? `${studentCgpa.toFixed(1)} CGPA` : "Check"})
          </button>

          <button
            className={`filter-pill ${activeFilter === "multi_round" ? "active" : ""}`}
            onClick={() => setActiveFilter("multi_round")}
          >
            🔄 Multi-Round Drives
          </button>
        </div>
      </section>

      {/* Jobs Grid Container */}
      {loading ? (
        <div className="state-container">
          <div className="spinner"></div>
          <h3 className="state-title">Loading Opportunities...</h3>
          <p className="state-desc">Fetching available campus placement drives for your profile.</p>
        </div>
      ) : error ? (
        <div className="state-container" style={{ borderColor: "rgba(239, 68, 68, 0.4)" }}>
          <div className="state-icon">⚠️</div>
          <h3 className="state-title" style={{ color: "#f87171" }}>
            Failed to Load Jobs
          </h3>
          <p className="state-desc">{error}</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="state-container">
          <div className="state-icon">🔍</div>
          <h3 className="state-title">No Matching Opportunities</h3>
          <p className="state-desc">Try clearing your search terms or filter pills to see more results.</p>
        </div>
      ) : (
        <div className="jobs-cards-grid">
          {filteredJobs.map((job) => {
            const isExpanded = expandedJobs[job.job_id];
            const isApplied = appliedJobIds.has(job.job_id);
            const minCgpa = parseFloat(job.min_cgpa || 0);
            const isIneligible = studentCgpa > 0 && minCgpa > 0 && studentCgpa < minCgpa;
            const initial = (job.company_name || "C").charAt(0).toUpperCase();
            const desc = job.description || "";
            const shortDesc = desc.length > 130 ? `${desc.substring(0, 130)}...` : desc;

            return (
              <div className="job-card-modern" key={job.job_id}>
                <div>
                  {/* Card Header */}
                  <div className="job-card-header">
                    <div className="company-avatar">{initial}</div>
                    <div className="company-meta">
                      <h3>{job.job_title}</h3>
                      <div className="company-name-tag">
                        <span>{job.company_name}</span>
                        <span className="status-indicator" title="Active Hiring Drive"></span>
                      </div>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="job-badges">
                    <span className="badge-item badge-salary">💰 {job.salary_lpa} LPA</span>
                    <span className={`badge-item ${isIneligible ? "badge-salary" : "badge-cgpa"}`} style={isIneligible ? { background: "rgba(239, 68, 68, 0.15)", color: "#f87171", borderColor: "rgba(239, 68, 68, 0.3)" } : {}}>
                      🎓 Min {job.min_cgpa || "0.0"} CGPA
                    </span>
                    <span className="badge-item badge-location">📍 {job.location || "Remote"}</span>
                    <span className="badge-item badge-rounds">🔄 {job.round_count || 1} Rounds</span>
                  </div>

                  {/* Description Box */}
                  <div className="job-description-box">
                    <p className="job-description-text">{isExpanded ? desc : shortDesc}</p>

                    {desc.length > 130 && (
                      <button className="read-more-btn" onClick={() => toggleReadMore(job.job_id)}>
                        {isExpanded ? "Show Less ▲" : "Read Full Scope ▼"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Footer Call to Action */}
                <div className="job-card-footer">
                  <div className="deadline-tag">
                    <span>📅 Deadline:</span>
                    <strong>{formatDate(job.deadline)}</strong>
                  </div>

                  {isApplied ? (
                    <button
                      className="apply-action-btn"
                      style={{
                        background: "rgba(16, 185, 129, 0.2)",
                        color: "#34d399",
                        border: "1px solid rgba(16, 185, 129, 0.4)",
                      }}
                      onClick={() => navigate("/my-applications")}
                    >
                      ✓ Already Applied →
                    </button>
                  ) : isIneligible ? (
                    <button
                      className="apply-action-btn"
                      style={{
                        background: "rgba(239, 68, 68, 0.15)",
                        color: "#f87171",
                        border: "1px solid rgba(239, 68, 68, 0.35)",
                        cursor: "not-allowed",
                      }}
                      onClick={() =>
                        alert(
                          `🚫 Ineligible for ${job.job_title} at ${job.company_name}:\n\nCompany Cutoff Required: ${minCgpa.toFixed(
                            2
                          )} CGPA\nYour Profile CGPA: ${studentCgpa.toFixed(
                            2
                          )} CGPA\n\nUpdate your profile CGPA or apply to eligible drives!`
                        )
                      }
                    >
                      🚫 Below Cutoff ({minCgpa} CGPA)
                    </button>
                  ) : (
                    <button className="apply-action-btn" onClick={() => applyJob(job.job_id, minCgpa)}>
                      Apply Now →
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Jobs;
