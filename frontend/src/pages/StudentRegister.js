import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./Auth.css";

function StudentRegister() {
  const [student, setStudent] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
    department: "",
    year_of_study: "",
    cgpa: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await api.post("/auth/students/register", student);
      setSuccess(res.data.message || "Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/student/login");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Registration failed. Please check your inputs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Visual Side */}
      <div
        className="auth-banner-side"
        style={{ backgroundImage: `url('/images/job_offer_bg.jpg')` }}
      >
        <div className="auth-banner-overlay"></div>

        <div className="auth-banner-content">
          <div className="banner-brand-tag">🎓 Campus Placement Portal</div>
          <h1>Create Your Student Account</h1>
          <p>
            Join thousands of students applying to top tech companies, tier-1 recruiters, and exclusive campus hiring drives.
          </p>
        </div>

        {/* Floating Verification Badge */}
        <div className="floating-offer-card">
          <div className="offer-card-header">
            <div className="offer-icon">🚀</div>
            <div className="offer-title">
              <h4>Instant Profile Verification</h4>
              <p>✓ Automated Eligibility Check</p>
            </div>
          </div>
          <div className="offer-details-row">
            <div className="offer-detail-item">
              <label>Drive Access</label>
              <span>Full Access</span>
            </div>
            <div className="offer-detail-item">
              <label>Direct Applications</label>
              <span>1-Click Apply</span>
            </div>
          </div>
          <div className="offer-status-badge">
            <span>✨ Get matched with high-CTC roles tailored to your CGPA.</span>
          </div>
        </div>

        <div className="banner-stats-footer">
          <div className="stat-item">
            <h3>100%</h3>
            <p>Direct Recruiting</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Live Companies</p>
          </div>
          <div className="stat-item">
            <h3>Zero</h3>
            <p>Middleman Fees</p>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card" style={{ maxWidth: "520px" }}>
          <div className="auth-header">
            <span className="role-pill student">Student Registration</span>
            <h2>Register Student Account</h2>
            <p>Fill in your academic and contact details to get started.</p>
          </div>

          {error && <div className="auth-error-alert">⚠️ {error}</div>}
          {success && (
            <div
              className="auth-error-alert"
              style={{ background: "rgba(16, 185, 129, 0.15)", borderColor: "rgba(16, 185, 129, 0.4)", color: "#34d399" }}
            >
              🎉 {success}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="input-field-group">
                <label>Full Name *</label>
                <div className="input-wrapper">
                  <span className="input-icon">👤</span>
                  <input
                    type="text"
                    name="full_name"
                    placeholder="John Doe"
                    value={student.full_name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Phone Number *</label>
                <div className="input-wrapper">
                  <span className="input-icon">📞</span>
                  <input
                    type="text"
                    name="phone"
                    placeholder="+91 9876543210"
                    value={student.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="input-field-group">
              <label>College Email Address *</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="student@college.edu"
                  value={student.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Password *</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="Create strong password"
                  value={student.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
              <div className="input-field-group">
                <label>Department *</label>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ fontSize: "14px" }}>🏫</span>
                  <input
                    type="text"
                    name="department"
                    placeholder="CSE / ECE"
                    value={student.department}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Year *</label>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ fontSize: "14px" }}>📅</span>
                  <input
                    type="number"
                    min="1"
                    max="8"
                    name="year_of_study"
                    placeholder="4"
                    value={student.year_of_study}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>CGPA *</label>
                <div className="input-wrapper">
                  <span className="input-icon" style={{ fontSize: "14px" }}>📊</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    name="cgpa"
                    placeholder="8.5"
                    value={student.cgpa}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Creating Account..." : "Create Student Account →"}
            </button>

            <div className="auth-footer-links">
              <span>Already have an account?</span>
              <Link to="/student/login">Sign in here</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentRegister;
