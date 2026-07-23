import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import "./Auth.css";

function CompanyRegister() {
  const [company, setCompany] = useState({
    company_name: "",
    email: "",
    password: "",
    location: "",
    package_lpa: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      setSuccess("");
      const res = await api.post("/auth/companies/register", company);
      setSuccess(res.data.message || "Company registered successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/company/login");
      }, 1500);
    } catch (err) {
      const msg = err.response?.data?.errors?.[0]?.message || err.response?.data?.message || "Registration failed. Please check your details.";
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
        style={{ backgroundImage: `url('/images/joining_letter_bg.jpg')` }}
      >
        <div className="auth-banner-overlay"></div>

        <div className="auth-banner-content">
          <div className="banner-brand-tag" style={{ color: "#a78bfa" }}>
            🏢 Employer Onboarding
          </div>
          <h1>Partner with Our Campus Placement Drive</h1>
          <p>
            Gain access to thousands of pre-screened engineering and technology graduates. Post job openings and schedule recruitment rounds.
          </p>
        </div>

        {/* Floating Employer Card */}
        <div className="floating-offer-card">
          <div className="offer-card-header">
            <div className="offer-icon" style={{ background: "linear-gradient(135deg, #8b5cf6, #6d28d9)" }}>
              💼
            </div>
            <div className="offer-title">
              <h4>Verified Employer Portal</h4>
              <p style={{ color: "#a78bfa" }}>✓ Direct Campus Integration</p>
            </div>
          </div>
          <div className="offer-details-row">
            <div className="offer-detail-item">
              <label>Talent Pool</label>
              <span>Multi-Branch</span>
            </div>
            <div className="offer-detail-item">
              <label>Round Setup</label>
              <span>Custom Pipeline</span>
            </div>
          </div>
          <div className="offer-status-badge" style={{ color: "#a78bfa" }}>
            <span>⚡ Hire software engineers, analysts, and project leads.</span>
          </div>
        </div>

        <div className="banner-stats-footer">
          <div className="stat-item">
            <h3>500+</h3>
            <p>Active Recruiters</p>
          </div>
          <div className="stat-item">
            <h3>24 hrs</h3>
            <p>Verification Speed</p>
          </div>
          <div className="stat-item">
            <h3>100%</h3>
            <p>Direct Access</p>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card" style={{ maxWidth: "480px" }}>
          <div className="auth-header">
            <span className="role-pill company">Corporate Onboarding</span>
            <h2>Register Employer Account</h2>
            <p>Register your company to start posting jobs and hiring top talent.</p>
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
            <div className="input-field-group">
              <label>Company Name *</label>
              <div className="input-wrapper">
                <span className="input-icon">🏢</span>
                <input
                  type="text"
                  name="company_name"
                  placeholder="TechNova Solutions Pvt Ltd"
                  value={company.company_name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="input-field-group">
              <label>Corporate Email Address *</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="recruitment@company.com"
                  value={company.email}
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
                  placeholder="Create corporate password"
                  value={company.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div className="input-field-group">
                <label>Headquarter Location *</label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input
                    type="text"
                    name="location"
                    placeholder="Bengaluru / Remote"
                    value={company.location}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="input-field-group">
                <label>Typical Package (LPA) *</label>
                <div className="input-wrapper">
                  <span className="input-icon">💰</span>
                  <input
                    type="number"
                    step="0.01"
                    name="package_lpa"
                    placeholder="10.5"
                    value={company.package_lpa}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              style={{ background: "linear-gradient(135deg, #7c3aed, #8b5cf6)" }}
              disabled={loading}
            >
              {loading ? "Registering Company..." : "Register Corporate Account →"}
            </button>

            <div className="auth-footer-links">
              <span>Already registered?</span>
              <Link to="/company/login">Recruiter Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanyRegister;
