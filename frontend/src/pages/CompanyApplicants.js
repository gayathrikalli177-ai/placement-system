import { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./CompanyApplicants.css";

function RoundManager({ applicant, round, jobId, onSaved }) {
  const [form, setForm] = useState({
    status: round.status || "Pending",
    remarks: round.remarks || "",
    scheduled_at: round.scheduled_at
      ? new Date(round.scheduled_at).toISOString().slice(0, 16)
      : "",
    interview_mode: round.interview_mode || "",
    meeting_details: round.meeting_details || "",
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    try {
      setSaving(true);
      const payload = {
        ...form,
        scheduled_at: form.scheduled_at ? new Date(form.scheduled_at).toISOString() : "",
      };
      await api.patch(
        `/companies/me/jobs/${jobId}/applications/${applicant.application_id}/rounds/${round.application_round_id}`,
        payload
      );
      onSaved(`Round ${round.round_number} (${round.round_name}) details saved.`);
    } catch (error) {
      onSaved(error.response?.data?.message || "Unable to save this round.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="round-management-item">
      <div className="round-title-row">
        <span className="round-name-tag">
          Round {round.round_number}: {round.round_name}
        </span>
        <span
          style={{
            fontSize: "12px",
            fontWeight: "700",
            padding: "2px 8px",
            borderRadius: "6px",
            background:
              form.status === "Passed"
                ? "rgba(16, 185, 129, 0.2)"
                : form.status === "Failed"
                ? "rgba(239, 68, 68, 0.2)"
                : "rgba(59, 130, 246, 0.2)",
            color:
              form.status === "Passed"
                ? "#34d399"
                : form.status === "Failed"
                ? "#f87171"
                : "#60a5fa",
          }}
        >
          {form.status}
        </span>
      </div>

      <div className="round-inputs-grid">
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="Pending">Pending</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Passed">Passed</option>
          <option value="Failed">Failed</option>
        </select>

        <input
          type="datetime-local"
          value={form.scheduled_at}
          onChange={(e) => setForm({ ...form, scheduled_at: e.target.value })}
        />

        <select
          value={form.interview_mode}
          onChange={(e) => setForm({ ...form, interview_mode: e.target.value })}
        >
          <option value="">Mode (Online/Offline)</option>
          <option value="Online">Online</option>
          <option value="Offline">Offline</option>
        </select>

        <input
          value={form.meeting_details}
          onChange={(e) => setForm({ ...form, meeting_details: e.target.value })}
          placeholder="Meeting Link / Venue"
        />

        <input
          value={form.remarks}
          onChange={(e) => setForm({ ...form, remarks: e.target.value })}
          placeholder="Evaluator Remarks"
        />

        <button type="button" className="round-save-btn" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save Round"}
        </button>
      </div>
    </div>
  );
}

function CompanyApplicants() {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const loadApplicants = useCallback(() => {
    setLoading(true);
    api
      .get(`/companies/me/jobs/${jobId}/applications`)
      .then((response) => setApplicants(response.data || []))
      .catch(() => setMessage("Unable to load applicants for this job."))
      .finally(() => setLoading(false));
  }, [jobId]);

  useEffect(() => {
    loadApplicants();
  }, [loadApplicants]);

  const updateApplication = async (applicationId, status) => {
    try {
      await api.patch(`/companies/me/jobs/${jobId}/applications/${applicationId}/status`, {
        status,
      });
      setMessage(`Application status updated to "${status}".`);
      loadApplicants();
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update application status.");
    }
  };

  const roundSaved = (newMessage) => {
    setMessage(newMessage);
    loadApplicants();
  };

  // Filter Computation
  const filteredApplicants = useMemo(() => {
    return applicants.filter((app) => {
      const matchesSearch =
        app.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.application_department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.skills?.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "shortlisted") return app.status === "Shortlisted";
      if (activeFilter === "selected") return app.status === "Selected";
      if (activeFilter === "rejected") return app.status === "Rejected";

      return true;
    });
  }, [applicants, searchTerm, activeFilter]);

  const openResume = (applicationId) => {
    api
      .get(`/companies/me/jobs/${jobId}/applications/${applicationId}/resume`, {
        responseType: "blob",
      })
      .then((response) => window.open(URL.createObjectURL(response.data)))
      .catch(() => alert("Resume file not found."));
  };

  return (
    <div className="applicants-page-wrapper">
      {/* Top Navbar */}
      <header className="applicants-navbar">
        <button className="back-dash-btn" onClick={() => navigate("/company/dashboard")}>
          ← Back to Company Workspace
        </button>
        <div style={{ fontSize: "14px", color: "#94a3b8" }}>
          Applicants Portal · Job #{jobId}
        </div>
      </header>

      <div className="applicants-container">
        <div className="applicants-hero">
          <h1>Candidate Selection & ATS Pipeline</h1>
          <p>Review candidate profiles, evaluate resume PDFs, and update round-by-round interview progress.</p>
        </div>

        {message && (
          <div
            style={{
              background: "rgba(59, 130, 246, 0.15)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              color: "#60a5fa",
              padding: "12px 18px",
              borderRadius: "12px",
              marginBottom: "24px",
              fontSize: "14px",
            }}
          >
            🔔 {message}
          </div>
        )}

        {/* Controls (Search + Filters) */}
        <section className="applicants-controls">
          <div className="applicant-search-box">
            <span className="applicant-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search candidate by name, email, department, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="applicant-filter-pills">
            <button
              className={`applicant-filter-pill ${activeFilter === "all" ? "active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All Applicants ({applicants.length})
            </button>
            <button
              className={`applicant-filter-pill ${activeFilter === "shortlisted" ? "active" : ""}`}
              onClick={() => setActiveFilter("shortlisted")}
            >
              ⭐ Shortlisted
            </button>
            <button
              className={`applicant-filter-pill ${activeFilter === "selected" ? "active" : ""}`}
              onClick={() => setActiveFilter("selected")}
            >
              🎉 Selected
            </button>
            <button
              className={`applicant-filter-pill ${activeFilter === "rejected" ? "active" : ""}`}
              onClick={() => setActiveFilter("rejected")}
            >
              🚫 Rejected
            </button>
          </div>
        </section>

        {/* Applicants List */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div className="spinner"></div>
            <h3>Loading Candidate Profiles...</h3>
          </div>
        ) : filteredApplicants.length === 0 ? (
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
              {applicants.length === 0 ? "No Candidates Have Applied Yet" : "No Matching Candidates"}
            </h3>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              {applicants.length === 0
                ? "Applications submitted by students will appear here for evaluation."
                : "Try clearing your search or adjusting your filter criteria."}
            </p>
          </div>
        ) : (
          <div className="applicant-cards-list">
            {filteredApplicants.map((applicant) => {
              const initial = (applicant.full_name || "A").charAt(0).toUpperCase();

              return (
                <div className="applicant-card-item" key={applicant.application_id}>
                  {/* Top Header */}
                  <div className="applicant-header-row">
                    <div className="candidate-profile-info">
                      <div className="candidate-avatar">{initial}</div>
                      <div className="candidate-name-details">
                        <h3>{applicant.full_name}</h3>
                        <div className="candidate-sub-text">
                          <span>✉️ {applicant.email}</span>
                          <span>🏫 {applicant.application_department}</span>
                        </div>
                      </div>
                    </div>

                    <div className="status-select-box">
                      <label>Overall Status:</label>
                      <select
                        className="status-dropdown"
                        value={applicant.status}
                        onChange={(e) =>
                          updateApplication(applicant.application_id, e.target.value)
                        }
                      >
                        <option value="Applied">Applied</option>
                        <option value="Shortlisted">Shortlisted</option>
                        <option value="Selected">Selected</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  {/* Badges Grid */}
                  <div className="candidate-badges-grid">
                    <span className="cand-badge cgpa">🎓 CGPA: <strong>{applicant.application_cgpa}</strong></span>
                    <span className="cand-badge phone">📞 {applicant.application_phone}</span>
                    <span className="cand-badge year">📅 Year: <strong>{applicant.application_year}</strong></span>
                    <span className="cand-badge date">⏳ Joining: <strong>{applicant.availability_date || "Immediate"}</strong></span>
                  </div>

                  {/* Candidate Fit Essay & Skills */}
                  <div className="candidate-essay-box">
                    <div className="essay-title">💡 Technical Skills & Strengths</div>
                    <p className="essay-text" style={{ marginBottom: "12px" }}>
                      <strong>Skills:</strong> {applicant.skills || "Not specified"}
                    </p>

                    <div className="essay-title">🎯 Why They Are A Good Fit</div>
                    <p className="essay-text">{applicant.why_fit || "No statement provided."}</p>

                    {applicant.cover_letter && (
                      <div style={{ marginTop: "12px" }}>
                        <div className="essay-title">✉️ Cover Letter</div>
                        <p className="essay-text">{applicant.cover_letter}</p>
                      </div>
                    )}
                  </div>

                  {/* Resume PDF Download Button */}
                  {applicant.resume_id && (
                    <button
                      className="resume-download-btn"
                      onClick={() => openResume(applicant.application_id)}
                    >
                      📄 Download & View Candidate Resume (PDF)
                    </button>
                  )}

                  {/* Multi-Round Selection Pipeline Manager */}
                  <div className="rounds-section-card">
                    <div className="rounds-section-title">
                      🔄 Recruitment Round Progress ({applicant.rounds?.length || 0} Rounds)
                    </div>

                    {applicant.rounds?.map((round) => (
                      <RoundManager
                        key={round.application_round_id}
                        applicant={applicant}
                        round={round}
                        jobId={jobId}
                        onSaved={roundSaved}
                      />
                    ))}
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

export default CompanyApplicants;
