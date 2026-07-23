import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { setSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./Auth.css";

function CompanyLogin() {
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleChange = (e) => {
    setLogin({
      ...login,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const res = await api.post("/auth/companies/login", login);
      setSession("company", res.data.company, res.data.accessToken);
      showSuccess(`Welcome back, ${res.data.company.company_name}!`);
      navigate("/company/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid company email or password";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Visual Side with Corporate Joining Letters */}
      <div
        className="auth-banner-side"
        style={{ backgroundImage: `url('/images/joining_letter_bg.jpg')` }}
      >
        <div className="auth-banner-overlay"></div>

        <div className="auth-banner-content">
          <div className="banner-brand-tag" style={{ color: "#a78bfa" }}>
            🏢 Corporate Recruiter Portal
          </div>
          <h1>Hire Exceptional Tech Talent</h1>
          <p>
            Post job openings, manage multi-round selection processes, evaluate student applications, and issue offer letters seamlessly.
          </p>
        </div>

        {/* Floating Appointment Card */}
        <div className="floating-offer-card">
          <div className="offer-card-header">
            <div className="offer-icon" style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
              📑
            </div>
            <div className="offer-title">
              <h4>Recruitment Management System</h4>
              <p style={{ color: "#a78bfa" }}>✓ Verified Employer</p>
            </div>
          </div>
          <div className="offer-details-row">
            <div className="offer-detail-item">
              <label>Status</label>
              <span>Drive Active</span>
            </div>
            <div className="offer-detail-item">
              <label>Applicants</label>
              <span>150+ Candidates</span>
            </div>
          </div>
          <div className="offer-status-badge" style={{ color: "#a78bfa" }}>
            <span>⚡ Issue joining letters & track candidate interview rounds.</span>
          </div>
        </div>

        <div className="banner-stats-footer">
          <div className="stat-item">
            <h3>10,000+</h3>
            <p>Students Placed</p>
          </div>
          <div className="stat-item">
            <h3>48 hrs</h3>
            <p>Avg Shortlist Speed</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Verified Candidates</p>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-header">
            <span className="role-pill company">Corporate Portal</span>
            <h2>Recruiter Sign In</h2>
            <p>Access your company dashboard to post jobs and review applicants.</p>
          </div>

          {error && <div className="auth-error-alert">⚠️ {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-field-group">
              <label>Corporate Email</label>
              <div className="input-wrapper">
                <span className="input-icon">🏢</span>
                <input
                  type="email"
                  name="email"
                  placeholder="hr@company.com"
                  value={login.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={login.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
              disabled={loading}
            >
              {loading ? "Authenticating..." : "Login to Corporate Portal →"}
            </button>

            <div className="auth-footer-links">
              <span>New corporate partner?</span>
              <Link to="/company/register">Register company</Link>
            </div>

            <div className="auth-footer-links" style={{ marginTop: "12px" }}>
              <span>Are you a student?</span>
              <Link to="/student/login">Student Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyLogin;
