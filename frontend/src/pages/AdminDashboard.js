import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { clearSession, getSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./AdminDashboard.css";

function AdminDashboard() {
  const navigate = useNavigate();
  const admin = getSession("admin");
  const { showSuccess, showError } = useToast();

  const [activeTab, setActiveTab] = useState("jobs"); // Default to 'jobs' moderation tab
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    selectedOffers: 0,
  });

  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJobInspect, setSelectedJobInspect] = useState(null);

  useEffect(() => {
    loadAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [anRes, stRes, coRes, joRes, apRes] = await Promise.all([
        api.get("/admin/analytics"),
        api.get("/admin/students"),
        api.get("/admin/companies"),
        api.get("/admin/jobs"),
        api.get("/admin/applications"),
      ]);

      setAnalytics(anRes.data);
      setStudents(stRes.data || []);
      setCompanies(coRes.data || []);
      setJobs(joRes.data || []);
      setApplications(apRes.data || []);
    } catch (err) {
      showError(err.response?.data?.message || "Failed to load admin management data.");
    } finally {
      setLoading(false);
    }
  };

  // Admin Delete Actions
  const handleDeleteStudent = async (studentId, name) => {
    if (!window.confirm(`⚠️ SUPER ADMIN OVERRIDE:\nAre you sure you want to permanently delete candidate '${name}' and wipe all their applications?`)) return;
    try {
      await api.delete(`/admin/students/${studentId}`);
      showSuccess(`Candidate '${name}' deleted successfully.`);
      loadAllData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete student.");
    }
  };

  const handleDeleteCompany = async (companyId, name) => {
    if (!window.confirm(`⚠️ SUPER ADMIN OVERRIDE:\nAre you sure you want to permanently delete company '${name}' and all associated job postings?`)) return;
    try {
      await api.delete(`/admin/companies/${companyId}`);
      showSuccess(`Company '${name}' deleted successfully.`);
      loadAllData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete company.");
    }
  };

  const handleDeleteJob = async (jobId, title) => {
    if (!window.confirm(`⚠️ SUPER ADMIN JOB DELETION:\nAre you sure you want to permanently remove job drive '${title}' from the system?`)) return;
    try {
      await api.delete(`/admin/jobs/${jobId}`);
      showSuccess(`Job drive '${title}' deleted successfully.`);
      if (selectedJobInspect?.job_id === jobId) {
        setSelectedJobInspect(null);
      }
      loadAllData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete job.");
    }
  };

  const handleToggleJobStatus = async (jobId, currentStatus) => {
    try {
      await api.patch(`/admin/jobs/${jobId}`, { is_open: !currentStatus });
      showSuccess(`Job drive status updated to ${!currentStatus ? 'Active' : 'Closed'}.`);
      if (selectedJobInspect?.job_id === jobId) {
        setSelectedJobInspect((prev) => ({ ...prev, is_open: !currentStatus }));
      }
      loadAllData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to toggle job status.");
    }
  };

  const handleOverrideAppStatus = async (appId, newStatus) => {
    try {
      await api.patch(`/admin/applications/${appId}/status`, { status: newStatus });
      showSuccess(`Application status overridden to '${newStatus}'.`);
      loadAllData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to override application status.");
    }
  };

  const handleDeleteApp = async (appId) => {
    if (!window.confirm("⚠️ SUPER ADMIN OVERRIDE:\nDelete this application record?")) return;
    try {
      await api.delete(`/admin/applications/${appId}`);
      showSuccess("Application record deleted.");
      loadAllData();
    } catch (err) {
      showError(err.response?.data?.message || "Failed to delete application.");
    }
  };

  // Filtered lists computation
  const filteredStudents = useMemo(() => {
    return students.filter((s) =>
      (s.full_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.department || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) =>
      (c.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.location || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [companies, searchTerm]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((j) =>
      (j.job_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.company_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [jobs, searchTerm]);

  const filteredApps = useMemo(() => {
    return applications.filter((a) =>
      (a.student_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.job_title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.company_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [applications, searchTerm]);

  return (
    <div className="admin-dashboard-wrapper">
      {/* Top Navbar */}
      <header className="admin-navbar">
        <div className="admin-brand-box">
          <div className="admin-logo-badge">👑</div>
          <div className="admin-brand-text">
            <h2>Super Admin Command Center</h2>
            <p>
              <span className="status-dot-online"></span>
              Owner Access: {admin?.email || "Gayathrikalli123@gmail.com"}
            </p>
          </div>
        </div>

        <div className="admin-nav-actions">
          <div className="admin-user-pill">
            <span>👑 {admin?.full_name || "Gayathri K"}</span>
            <span style={{ fontSize: "11px", color: "#34d399" }}>• Active</span>
          </div>

          <button
            className="admin-logout-btn"
            onClick={() => {
              clearSession("admin");
              navigate("/");
            }}
          >
            Logout Super Admin
          </button>
        </div>
      </header>

      {/* Analytics Stats Bar */}
      <section className="admin-stats-bar">
        <div className="admin-stat-card">
          <div className="admin-stat-icon rose">💼</div>
          <div className="admin-stat-info">
            <h4>{analytics.totalJobs}</h4>
            <p>Live Job Drives</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon purple">🏢</div>
          <div className="admin-stat-info">
            <h4>{analytics.totalCompanies}</h4>
            <p>Corporate Partners</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon blue">🎓</div>
          <div className="admin-stat-info">
            <h4>{analytics.totalStudents}</h4>
            <p>Registered Students</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon emerald">🎉</div>
          <div className="admin-stat-info">
            <h4>{analytics.selectedOffers}</h4>
            <p>Successful Placements</p>
          </div>
        </div>
      </section>

      {/* Control Tabs Bar */}
      <div className="admin-tabs-nav">
        <button
          className={`admin-tab-btn ${activeTab === "jobs" ? "active" : ""}`}
          onClick={() => setActiveTab("jobs")}
        >
          💼 Manage & Moderation Drives ({jobs.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "companies" ? "active" : ""}`}
          onClick={() => setActiveTab("companies")}
        >
          🏢 Corporate Companies ({companies.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "students" ? "active" : ""}`}
          onClick={() => setActiveTab("students")}
        >
          🎓 Registered Students ({students.length})
        </button>
        <button
          className={`admin-tab-btn ${activeTab === "applications" ? "active" : ""}`}
          onClick={() => setActiveTab("applications")}
        >
          📋 ATS Applications Tracker ({applications.length})
        </button>
      </div>

      {/* Content Table Container */}
      <div className="admin-table-container">
        {/* Moderation Banner */}
        <div
          style={{
            background: "rgba(225, 29, 72, 0.12)",
            border: "1px solid rgba(225, 29, 72, 0.35)",
            borderRadius: "20px",
            padding: "18px 24px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 8px 20px rgba(225, 29, 72, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <span style={{ fontSize: "26px" }}>🛡️</span>
            <div>
              <h4 style={{ margin: "0 0 4px", color: "#f43f5e", fontSize: "16px", fontWeight: "800" }}>
                Super Admin Moderation & Misuse Rights Active
              </h4>
              <p style={{ margin: 0, fontSize: "13.5px", color: "#cbd5e1" }}>
                You hold absolute rights to inspect company job descriptions, block suspicious drives, or permanently delete inappropriate postings.
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card-panel">
          <div className="panel-header-row">
            <h3>
              {activeTab === "jobs" && "💼 Company Job Drives & Misuse Moderation"}
              {activeTab === "companies" && "🏢 Corporate Recruiter Directory"}
              {activeTab === "students" && "🎓 Registered Candidates Directory"}
              {activeTab === "applications" && "📋 System ATS Applications Tracker"}
            </h3>

            <input
              type="text"
              className="admin-search-input"
              placeholder="Search by company, title, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px" }}>
              <div className="spinner"></div>
              <h3 style={{ marginTop: "16px", color: "#94a3b8" }}>Loading System Records...</h3>
            </div>
          ) : (
            <>
              {/* TAB 1: COMPANY JOB DRIVES & MODERATION */}
              {activeTab === "jobs" && (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Job Title</th>
                      <th>Company Name</th>
                      <th>Salary Package</th>
                      <th>Min Cutoff</th>
                      <th>Drive Status</th>
                      <th>Applicants</th>
                      <th>Moderation Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.map((j) => {
                      const initial = (j.company_name || "C").charAt(0).toUpperCase();

                      return (
                        <tr key={j.job_id}>
                          <td>#{j.job_id}</td>
                          <td>
                            <strong style={{ fontSize: "14px", color: "#f8fafc" }}>{j.job_title}</strong>
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <div
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  borderRadius: "50%",
                                  background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "12px",
                                  fontWeight: "800",
                                  color: "#fff",
                                }}
                              >
                                {initial}
                              </div>
                              <span style={{ color: "#38bdf8", fontWeight: "700" }}>{j.company_name}</span>
                            </div>
                          </td>
                          <td>💰 {j.salary_lpa} LPA</td>
                          <td>🎓 {j.min_cgpa || "0.0"} CGPA</td>
                          <td>
                            <span
                              style={{
                                padding: "4px 12px",
                                borderRadius: "30px",
                                fontSize: "11px",
                                fontWeight: "800",
                                background: j.is_open ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                color: j.is_open ? "#34d399" : "#f87171",
                                border: j.is_open ? "1px solid rgba(16, 185, 129, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                              }}
                            >
                              {j.is_open ? "🟢 Active Drive" : "🔴 Closed / Blocked"}
                            </span>
                          </td>
                          <td>{j.applicant_count} Applicants</td>
                          <td>
                            <button
                              className="admin-action-btn edit"
                              onClick={() => setSelectedJobInspect(j)}
                              title="Inspect job description & scope"
                            >
                              👁️ Inspect
                            </button>

                            <button
                              className="admin-action-btn edit"
                              style={
                                j.is_open
                                  ? { background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24", borderColor: "rgba(245, 158, 11, 0.4)" }
                                  : {}
                              }
                              onClick={() => handleToggleJobStatus(j.job_id, j.is_open)}
                            >
                              {j.is_open ? "🚫 Block" : "🟢 Unblock"}
                            </button>

                            <button
                              className="admin-action-btn delete"
                              onClick={() => handleDeleteJob(j.job_id, j.job_title)}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}

              {/* TAB 2: COMPANIES */}
              {activeTab === "companies" && (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Company Name</th>
                      <th>Corporate Email</th>
                      <th>Location</th>
                      <th>Package (LPA)</th>
                      <th>Job Drives</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCompanies.map((c) => (
                      <tr key={c.company_id}>
                        <td>#{c.company_id}</td>
                        <td>
                          <strong>{c.company_name}</strong>
                        </td>
                        <td>{c.email}</td>
                        <td>📍 {c.location || "N/A"}</td>
                        <td>💰 {c.package_lpa} LPA</td>
                        <td>{c.job_count} Drives</td>
                        <td>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => handleDeleteCompany(c.company_id, c.company_name)}
                          >
                            🗑️ Delete Company
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB 3: STUDENTS */}
              {activeTab === "students" && (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Department</th>
                      <th>Year</th>
                      <th>CGPA</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s.student_id}>
                        <td>#{s.student_id}</td>
                        <td>
                          <strong>{s.full_name}</strong>
                        </td>
                        <td>{s.email}</td>
                        <td>{s.department || "N/A"}</td>
                        <td>Year {s.year_of_study || "-"}</td>
                        <td>
                          <span style={{ color: "#34d399", fontWeight: "700" }}>
                            {s.cgpa || "0.00"}
                          </span>
                        </td>
                        <td>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => handleDeleteStudent(s.student_id, s.full_name)}
                          >
                            🗑️ Delete Account
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* TAB 4: APPLICATIONS */}
              {activeTab === "applications" && (
                <table className="admin-data-table">
                  <thead>
                    <tr>
                      <th>App ID</th>
                      <th>Candidate</th>
                      <th>Job Title</th>
                      <th>Company</th>
                      <th>CGPA</th>
                      <th>Status</th>
                      <th>Admin Override</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApps.map((a) => (
                      <tr key={a.application_id}>
                        <td>#{a.application_id}</td>
                        <td>
                          <strong>{a.student_name}</strong>
                          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{a.student_email}</div>
                        </td>
                        <td>{a.job_title}</td>
                        <td>{a.company_name}</td>
                        <td>🎓 {a.application_cgpa || "0.0"}</td>
                        <td>
                          <span
                            style={{
                              fontWeight: "800",
                              color:
                                a.status === "Selected"
                                  ? "#34d399"
                                  : a.status === "Shortlisted"
                                  ? "#fbbf24"
                                  : a.status === "Rejected"
                                  ? "#f87171"
                                  : "#60a5fa",
                            }}
                          >
                            {a.status}
                          </span>
                        </td>
                        <td>
                          <select
                            value={a.status}
                            onChange={(e) => handleOverrideAppStatus(a.application_id, e.target.value)}
                            style={{
                              background: "rgba(15, 23, 42, 0.8)",
                              color: "#fff",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              borderRadius: "6px",
                              padding: "4px 8px",
                              fontSize: "12px",
                            }}
                          >
                            <option value="Applied">⏳ Applied</option>
                            <option value="Shortlisted">⭐ Shortlisted</option>
                            <option value="Selected">🎉 Selected</option>
                            <option value="Rejected">🔴 Rejected</option>
                          </select>
                        </td>
                        <td>
                          <button
                            className="admin-action-btn delete"
                            onClick={() => handleDeleteApp(a.application_id)}
                          >
                            🗑️ Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
      </div>

      {/* JOB INSPECTION MODAL */}
      {selectedJobInspect && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(15, 23, 42, 0.85)",
            backdropFilter: "blur(16px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(30, 41, 59, 0.95)",
              border: "2px solid rgba(225, 29, 72, 0.4)",
              borderRadius: "26px",
              maxWidth: "620px",
              width: "100%",
              padding: "36px",
              boxShadow: "0 30px 60px rgba(0,0,0,0.6)",
              color: "#f8fafc",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <span style={{ fontSize: "12px", color: "#f43f5e", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>
                  🛡️ Super Admin Job Inspector
                </span>
                <h2 style={{ margin: "6px 0 0", fontSize: "24px", color: "#ffffff" }}>{selectedJobInspect.job_title}</h2>
                <div style={{ color: "#38bdf8", fontWeight: "700", marginTop: "4px" }}>
                  Posted by: {selectedJobInspect.company_name}
                </div>
              </div>
              <button
                className="admin-action-btn"
                style={{ background: "rgba(255,255,255,0.1)", color: "#fff", padding: "8px 16px" }}
                onClick={() => setSelectedJobInspect(null)}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.7)", padding: "20px", borderRadius: "18px", marginBottom: "24px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", fontSize: "13.5px", marginBottom: "14px" }}>
                <span>💰 Package: <strong style={{ color: "#34d399" }}>{selectedJobInspect.salary_lpa} LPA</strong></span>
                <span>🎓 Cutoff: <strong style={{ color: "#fbbf24" }}>{selectedJobInspect.min_cgpa} CGPA</strong></span>
                <span>📍 Location: <strong style={{ color: "#60a5fa" }}>{selectedJobInspect.location || "Remote"}</strong></span>
              </div>
              <h4 style={{ margin: "14px 0 8px", color: "#94a3b8", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                Published Job Scope / Description:
              </h4>
              <p style={{ margin: 0, fontSize: "14px", lineHeight: "1.65", color: "#cbd5e1", whiteSpace: "pre-line" }}>
                {selectedJobInspect.description || "No description text provided."}
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                className="admin-action-btn edit"
                style={selectedJobInspect.is_open ? { background: "rgba(245, 158, 11, 0.2)", color: "#fbbf24" } : {}}
                onClick={() => handleToggleJobStatus(selectedJobInspect.job_id, selectedJobInspect.is_open)}
              >
                {selectedJobInspect.is_open ? "🚫 Block Drive Immediately" : "🟢 Unblock Drive"}
              </button>
              <button
                className="admin-action-btn delete"
                onClick={() => handleDeleteJob(selectedJobInspect.job_id, selectedJobInspect.job_title)}
              >
                🗑️ Delete Misused Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
