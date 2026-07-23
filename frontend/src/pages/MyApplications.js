import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { getSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./MyApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const student = getSession("student");
  const navigate = useNavigate();
  const { showError } = useToast();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const res = await api.get("/students/me/applications");
        setApplications(res.data || []);
      } catch (err) {
        const msg = err.response?.data?.message || "Unable to load your applications.";
        setError(msg);
        showError(msg);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Analytics Computation
  const stats = useMemo(() => {
    const total = applications.length;
    const selected = applications.filter((a) => a.status === "Selected").length;
    const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
    const packages = applications.map((a) => parseFloat(a.salary_lpa) || 0);
    const avgPackage =
      packages.length > 0
        ? (packages.reduce((a, b) => a + b, 0) / packages.length).toFixed(1)
        : 0;

    return { total, selected, shortlisted, avgPackage };
  }, [applications]);

  // Filter Computation
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        app.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.company_name?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "selected") return app.status === "Selected";
      if (activeFilter === "shortlisted") return app.status === "Shortlisted";
      if (activeFilter === "applied") return app.status === "Applied";
      if (activeFilter === "rejected") return app.status === "Rejected";

      return true;
    });
  }, [applications, searchTerm, activeFilter]);

  const getStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "selected") return "selected";
    if (s === "shortlisted") return "shortlisted";
    if (s === "rejected") return "rejected";
    return "applied";
  };

  const getRoundStatusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "passed") return "passed";
    if (s === "scheduled") return "scheduled";
    if (s === "failed") return "failed";
    return "pending";
  };

  return (
    <div className="myapps-page-wrapper">
      {/* Top Navbar */}
      <header className="myapps-navbar">
        <button className="back-dash-btn" onClick={() => navigate("/student/dashboard")}>
          ← Back to Student Workspace
        </button>
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>
          Candidate: <strong style={{ color: "#f8fafc" }}>{student?.full_name}</strong>
        </div>
      </header>

      <div className="myapps-container">
        {/* Hero Banner */}
        <section className="myapps-hero">
          <h1>My Job Applications & Tracking Studio</h1>
          <p>Track recruitment drive progress, interview round schedules, and company updates in real-time.</p>
        </section>

        {/* Analytics Stats Bar */}
        <section className="myapps-stats-bar">
          <div className="myapps-stat-card">
            <div className="myapps-stat-icon blue">💼</div>
            <div className="myapps-stat-info">
              <h4>{stats.total}</h4>
              <p>Submitted Applications</p>
            </div>
          </div>
          <div className="myapps-stat-card">
            <div className="myapps-stat-icon green">🎉</div>
            <div className="myapps-stat-info">
              <h4>{stats.selected}</h4>
              <p>Selected Offers</p>
            </div>
          </div>
          <div className="myapps-stat-card">
            <div className="myapps-stat-icon purple">⭐</div>
            <div className="myapps-stat-info">
              <h4>{stats.shortlisted}</h4>
              <p>Shortlisted Drives</p>
            </div>
          </div>
          <div className="myapps-stat-card">
            <div className="myapps-stat-icon amber">💎</div>
            <div className="myapps-stat-info">
              <h4>{stats.avgPackage > 0 ? `${stats.avgPackage} LPA` : "N/A"}</h4>
              <p>Avg Package Applied</p>
            </div>
          </div>
        </section>

        {/* Controls (Search + Filters) */}
        <section className="myapps-controls">
          <div className="myapps-search-box">
            <span className="myapps-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by job title or company name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="myapps-filter-pills">
            <button
              className={`myapps-filter-pill ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All ({applications.length})
            </button>
            <button
              className={`myapps-filter-pill ${activeFilter === "selected" ? "active" : ""}`}
              onClick={() => setActiveFilter("selected")}
            >
              🎉 Selected ({stats.selected})
            </button>
            <button
              className={`myapps-filter-pill ${activeFilter === "shortlisted" ? "active" : ""}`}
              onClick={() => setActiveFilter("shortlisted")}
            >
              ⭐ Shortlisted ({stats.shortlisted})
            </button>
            <button
              className={`myapps-filter-pill ${activeFilter === "applied" ? "active" : ""}`}
              onClick={() => setActiveFilter("applied")}
            >
              ⏳ Applied
            </button>
          </div>
        </section>

        {/* Applications List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div className="spinner"></div>
            <h3>Loading Your Application Records...</h3>
          </div>
        ) : error ? (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              color: "#f87171",
              padding: "16px 20px",
              borderRadius: "14px",
              textAlign: "center",
            }}
          >
            ⚠️ {error}
          </div>
        ) : filteredApps.length === 0 ? (
          <div
            style={{
              background: "rgba(30, 41, 59, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "20px",
              padding: "48px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📂</div>
            <h3 style={{ fontSize: "20px", color: "#f8fafc", margin: "0 0 8px" }}>
              {applications.length === 0 ? "No Applications Submitted Yet" : "No Matching Applications"}
            </h3>
            <p style={{ color: "#94a3b8", margin: "0 0 20px" }}>
              {applications.length === 0
                ? "Browse available campus placement drives and apply to land your dream offer."
                : "Try clearing your search or filter pills."}
            </p>
            {applications.length === 0 && (
              <button className="back-dash-btn" style={{ margin: "0 auto" }} onClick={() => navigate("/jobs")}>
                Explore Open Jobs →
              </button>
            )}
          </div>
        ) : (
          <div className="myapps-cards-list">
            {filteredApps.map((app) => {
              const initial = (app.company_name || "C").charAt(0).toUpperCase();

              return (
                <div className="myapps-card-item" key={app.application_id}>
                  {/* Top Card Header */}
                  <div className="app-card-header">
                    <div className="app-company-info">
                      <div className="company-avatar-box">{initial}</div>
                      <div className="app-title-meta">
                        <h3>{app.job_title}</h3>
                        <p>{app.company_name} · 💰 <strong>{app.salary_lpa} LPA</strong></p>
                      </div>
                    </div>

                    <span className={`status-badge-pill ${getStatusClass(app.status)}`}>
                      {app.status === "Selected" && "🎉 Selected / Offer Extended"}
                      {app.status === "Shortlisted" && "⭐ Shortlisted"}
                      {app.status === "Rejected" && "🔴 Application Closed"}
                      {app.status === "Applied" && "⏳ Application Under Review"}
                    </span>
                  </div>

                  {/* Recruitment Progress Roadmap */}
                  <div className="rounds-timeline-card">
                    <div className="timeline-header-title">
                      🔄 Recruitment Round Progress ({app.rounds?.length || 0} Rounds)
                    </div>

                    {app.rounds?.length === 0 ? (
                      <div style={{ fontSize: "13px", color: "#94a3b8" }}>
                        Waiting for recruiter to publish round schedules and evaluations...
                      </div>
                    ) : (
                      <div className="timeline-steps-list">
                        {app.rounds.map((round) => {
                          const roundStatus = getRoundStatusClass(round.status);

                          return (
                            <div className="timeline-step-row" key={`${app.application_id}-${round.round_number}`}>
                              <div className={`step-status-indicator ${roundStatus}`}></div>

                              <div className="step-details-content">
                                <div className="step-title-line">
                                  <h5>
                                    Round {round.round_number}: {round.round_name}
                                  </h5>
                                  <span className={`step-badge ${roundStatus}`}>
                                    {round.status}
                                  </span>
                                </div>

                                <div className="step-meta-details">
                                  {round.scheduled_at && (
                                    <span>
                                      📅 Interview Date:{" "}
                                      <strong>
                                        {new Date(round.scheduled_at).toLocaleString([], {
                                          month: "short",
                                          day: "numeric",
                                          year: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </strong>
                                    </span>
                                  )}

                                  {round.interview_mode && (
                                    <span>
                                      🎥 Mode: <strong>{round.interview_mode}</strong>
                                    </span>
                                  )}
                                </div>

                                {round.meeting_details && (
                                  <div style={{ marginTop: "6px" }}>
                                    {round.meeting_details.startsWith("http") ? (
                                      <a
                                        href={round.meeting_details}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="join-meeting-link-btn"
                                      >
                                        🎥 Join Interview Meeting →
                                      </a>
                                    ) : (
                                      <span style={{ fontSize: "13px", color: "#38bdf8" }}>
                                        📍 Location: <strong>{round.meeting_details}</strong>
                                      </span>
                                    )}
                                  </div>
                                )}

                                {round.remarks && (
                                  <div className="step-remarks">
                                    <strong>Company Evaluator Note:</strong> {round.remarks}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyApplications;
