import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { setSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./Auth.css";

function StudentLogin() {
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
      const res = await api.post("/auth/students/login", login);
      setSession("student", res.data.student, res.data.accessToken);
      showSuccess(`Welcome back, ${res.data.student.full_name}!`);
      navigate("/jobs");
    } catch (err) {
      const msg = err.response?.data?.message || "Invalid student email or password";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* Left Visual Side with Job Offers & Joining Letters */}
      <div
        className="auth-banner-side"
        style={{ backgroundImage: `url('/images/job_offer_bg.jpg')` }}
      >
        <div className="auth-banner-overlay"></div>

        <div className="auth-banner-content">
          <div className="banner-brand-tag">🎓 Student Placement Hub</div>
          <h1>Unlock Your Career Opportunities</h1>
          <p>
            Connect with top hiring partners, participate in campus recruitment drives, and land your dream job offer.
          </p>
        </div>

        {/* Floating Offer Letter Card */}
        <div className="floating-offer-card">
          <div className="offer-card-header">
            <div className="offer-icon">📜</div>
            <div className="offer-title">
              <h4>Official Job Offer Issued</h4>
              <p>✓ Verified Campus Offer</p>
            </div>
          </div>
          <div className="offer-details-row">
            <div className="offer-detail-item">
              <label>Role</label>
              <span>Software Engineer</span>
            </div>
            <div className="offer-detail-item">
              <label>CTC Package</label>
              <span>12.50 LPA</span>
            </div>
          </div>
          <div className="offer-status-badge">
            <span>🎉 Congratulations! Joining letter ready for download.</span>
          </div>
        </div>

        <div className="banner-stats-footer">
          <div className="stat-item">
            <h3>98.4%</h3>
            <p>Placement Rate</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Recruiting Partners</p>
          </div>
          <div className="stat-item">
            <h3>14.2 LPA</h3>
            <p>Average Package</p>
          </div>
        </div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-card">
          <div className="auth-header">
            <span className="role-pill student">Student Portal</span>
            <h2>Sign in to your account</h2>
            <p>Enter your student credentials to view and apply for open jobs.</p>
          </div>

          {error && <div className="auth-error-alert">⚠️ {error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="input-field-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  name="email"
                  placeholder="student@college.edu"
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

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Login to Student Portal →"}
            </button>

            <div className="auth-footer-links">
              <span>Don't have a student account?</span>
              <Link to="/student/register">Register here</Link>
            </div>

            <div className="auth-footer-links" style={{ marginTop: "12px" }}>
              <span>Are you a recruiter?</span>
              <Link to="/company/login">Company Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default StudentLogin;
