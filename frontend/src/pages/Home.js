import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/client";
import { getSession, setSession } from "../auth/session";
import "./Home.css";

function Home() {
  const student = getSession("student");
  const company = getSession("company");
  const admin = getSession("admin");
  const navigate = useNavigate();

  const [loadingStudent, setLoadingStudent] = useState(false);
  const [loadingCompany, setLoadingCompany] = useState(false);
  const [loadingAdmin, setLoadingAdmin] = useState(false);

  const handleDemoStudentLogin = async () => {
    try {
      setLoadingStudent(true);
      const res = await api.post("/auth/students/login", {
        email: "student@demo.com",
        password: "password123",
      });
      setSession("student", res.data.student, res.data.accessToken);
      navigate("/jobs");
    } catch (err) {
      alert("Unable to login with demo student account.");
    } finally {
      setLoadingStudent(false);
    }
  };

  const handleDemoCompanyLogin = async () => {
    try {
      setLoadingCompany(true);
      const res = await api.post("/auth/companies/login", {
        email: "company@demo.com",
        password: "password123",
      });
      setSession("company", res.data.company, res.data.accessToken);
      navigate("/company/dashboard");
    } catch (err) {
      alert("Unable to login with demo company account.");
    } finally {
      setLoadingCompany(false);
    }
  };

  const handleDemoAdminLogin = async () => {
    try {
      setLoadingAdmin(true);
      const res = await api.post("/auth/admin/login", {
        email: "Gayathrikalli123@gmail.com",
        password: "Gayathri@123",
      });
      setSession("admin", res.data.admin, res.data.accessToken);
      navigate("/admin/dashboard");
    } catch (err) {
      alert("Unable to login with demo admin account.");
    } finally {
      setLoadingAdmin(false);
    }
  };

  return (
    <div className="home-page-wrapper">
      {/* Top Glassmorphic Navigation Bar */}
      <header className="home-navbar">
        <Link to="/" className="home-brand">
          <div className="home-brand-icon">🎓</div>
          <div className="home-brand-text">
            <h2>Campus Placement System</h2>
            <p>Career Transformation Hub</p>
          </div>
        </Link>

        <nav className="home-nav-links">
          <Link to="/jobs" className="nav-link-item">
            💼 Explore Jobs
          </Link>
          {student ? (
            <Link to="/student/dashboard" className="nav-btn-primary">
              Student Dashboard →
            </Link>
          ) : company ? (
            <Link to="/company/dashboard" className="nav-btn-accent">
              Recruiter Dashboard →
            </Link>
          ) : admin ? (
            <Link
              to="/admin/dashboard"
              className="nav-btn-accent"
              style={{ background: "linear-gradient(135deg, #e11d48, #be123c)" }}
            >
              👑 Admin Command Center →
            </Link>
          ) : (
            <>
              <Link to="/student/login" className="nav-btn-primary">
                🎓 Student Login
              </Link>
              <Link to="/company/login" className="nav-btn-accent">
                🏢 Company Login
              </Link>
              <Link to="/admin/login" className="nav-link-item" style={{ color: "#f43f5e" }}>
                👑 Admin Portal
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section with Transformation Pathway */}
      <section
        className="home-hero-section"
        style={{ backgroundImage: `url('/images/home_hero_bg.jpg')` }}
      >
        <div className="home-hero-overlay"></div>

        <div className="home-hero-content">
          <div className="hero-text-left">
            <div className="transformation-badge">
              <span>🚀 Unemployed Graduate ➔ Hired Professional</span>
            </div>
            <h1>Bridge The Gap From Campus Graduate To High-CTC Career</h1>
            <p>
              Transform your job hunt into a structured success journey. Access top recruiters, transparent CTC packages, multi-round selection tracking, and official offer letters in one unified portal.
            </p>

            <div className="hero-cta-group">
              <Link to="/jobs" className="hero-cta-btn main">
                Explore Open Jobs →
              </Link>
              {!student && !company && !admin && (
                <>
                  <Link to="/student/login" className="hero-cta-btn student">
                    Student Login 🎓
                  </Link>
                  <Link to="/company/login" className="hero-cta-btn company">
                    Company Login 🏢
                  </Link>
                  <Link to="/admin/login" className="hero-cta-btn" style={{ background: "rgba(225, 29, 72, 0.2)", color: "#f43f5e", border: "1px solid rgba(225, 29, 72, 0.4)" }}>
                    Super Admin 👑
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Right Floating Transformation Progress Card */}
          <div className="transformation-card-hero">
            <div className="transformation-card-header">
              <div className="transform-icon-box">📜</div>
              <div className="transform-title">
                <h3>Campus Transformation Journey</h3>
                <p>✓ Automated Placement Pathway</p>
              </div>
            </div>

            <div className="mini-steps-list">
              <div className="mini-step-item">
                <div className="mini-step-num">1</div>
                <div className="mini-step-text">
                  <h5>Profile Setup & Verification</h5>
                  <p>Validate CGPA, skills, & upload PDF resume.</p>
                </div>
              </div>
              <div className="mini-step-item">
                <div className="mini-step-num">2</div>
                <div className="mini-step-text">
                  <h5>Direct Employer Applications</h5>
                  <p>Filter by package CTC, location, & cutoffs.</p>
                </div>
              </div>
              <div className="mini-step-item">
                <div className="mini-step-num">3</div>
                <div className="mini-step-text">
                  <h5>Multi-Round Interview Selection</h5>
                  <p>Track test scores, technical rounds, & HR calls.</p>
                </div>
              </div>
              <div className="mini-step-item">
                <div className="mini-step-num">4</div>
                <div className="mini-step-text">
                  <h5>Official Job Offer Letter Received!</h5>
                  <p>Sign appointment letter & launch your career.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔑 DEMO LOGIN CREDENTIALS BANNER */}
      {!student && !company && !admin && (
        <section className="demo-credentials-banner">
          <div className="demo-banner-wrapper">
            <div className="demo-banner-title">
              <span>🔑 DEMO LOGIN CREDENTIALS & ONE-CLICK TEST LOGINS</span>
              <h3>Instant Portal Access For Reviewers</h3>
              <p>Test the full application flow immediately using pre-seeded candidate, recruiter, or admin credentials below.</p>
            </div>

            <div className="demo-credentials-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
              {/* Student Demo Account */}
              <div className="demo-card student">
                <div>
                  <div className="demo-card-head">
                    <div className="demo-icon">🎓</div>
                    <div>
                      <h4>Student Demo Account</h4>
                      <p>View jobs, submit resumes & track interview rounds</p>
                    </div>
                  </div>
                  <div className="demo-fields">
                    <div className="demo-field">
                      <span>Email Address:</span>
                      <code>student@demo.com</code>
                    </div>
                    <div className="demo-field">
                      <span>Password:</span>
                      <code>password123</code>
                    </div>
                  </div>
                </div>
                <button
                  className="demo-quick-login-btn student"
                  onClick={handleDemoStudentLogin}
                  disabled={loadingStudent}
                >
                  {loadingStudent ? "Logging in..." : "⚡ 1-Click Student Login →"}
                </button>
              </div>

              {/* Recruiter Demo Account */}
              <div className="demo-card company">
                <div>
                  <div className="demo-card-head">
                    <div className="demo-icon">🏢</div>
                    <div>
                      <h4>Recruiter Demo Account</h4>
                      <p>Post job openings, manage rounds & evaluate applicants</p>
                    </div>
                  </div>
                  <div className="demo-fields">
                    <div className="demo-field">
                      <span>Email Address:</span>
                      <code>company@demo.com</code>
                    </div>
                    <div className="demo-field">
                      <span>Password:</span>
                      <code>password123</code>
                    </div>
                  </div>
                </div>
                <button
                  className="demo-quick-login-btn company"
                  onClick={handleDemoCompanyLogin}
                  disabled={loadingCompany}
                >
                  {loadingCompany ? "Logging in..." : "⚡ 1-Click Recruiter Login →"}
                </button>
              </div>

              {/* Super Admin Demo Account */}
              <div className="demo-card company" style={{ borderLeftColor: "#e11d48" }}>
                <div>
                  <div className="demo-card-head">
                    <div className="demo-icon" style={{ background: "rgba(225, 29, 72, 0.2)", color: "#fb7185" }}>👑</div>
                    <div>
                      <h4>Super Admin Account</h4>
                      <p>Full control over Students, Companies, Jobs & Applications</p>
                    </div>
                  </div>
                  <div className="demo-fields">
                    <div className="demo-field">
                      <span>Email Address:</span>
                      <code>Gayathrikalli123@gmail.com</code>
                    </div>
                    <div className="demo-field">
                      <span>Password:</span>
                      <code>Gayathri@123</code>
                    </div>
                  </div>
                </div>
                <button
                  className="demo-quick-login-btn company"
                  style={{ background: "linear-gradient(135deg, #e11d48, #be123c)" }}
                  onClick={handleDemoAdminLogin}
                  disabled={loadingAdmin}
                >
                  {loadingAdmin ? "Authenticating..." : "⚡ 1-Click Super Admin Login →"}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Impact Stats Banner */}
      <section className="impact-stats-section">
        <div className="stats-grid-container">
          <div className="impact-stat-card">
            <h3>10,000+</h3>
            <p>Graduates Placed</p>
          </div>
          <div className="impact-stat-card">
            <h3>45.0 LPA</h3>
            <p>Highest CTC Package</p>
          </div>
          <div className="impact-stat-card">
            <h3>98.4%</h3>
            <p>Placement Success Rate</p>
          </div>
          <div className="impact-stat-card">
            <h3>500+</h3>
            <p>Recruiting Partners</p>
          </div>
        </div>
      </section>

      {/* Detailed "Unemployed to Employed" Transformation Steps */}
      <section className="pathway-section">
        <div className="section-header-center">
          <h2>The "Unemployed to Employed" Career Pathway</h2>
          <p>
            Our placement portal provides a proven 4-stage roadmap to help graduating students transition smoothly into high-paying tech careers.
          </p>
        </div>

        <div className="pathway-grid">
          <div className="pathway-card">
            <div className="pathway-step-badge">01</div>
            <h4>Profile Build & Skill Matching</h4>
            <p>
              Students build a verified profile including CGPA, department credentials, and skills. Automated filters match candidates with eligible job openings.
            </p>
          </div>

          <div className="pathway-card">
            <div className="pathway-step-badge">02</div>
            <h4>Transparent Job Discovery</h4>
            <p>
              Browse live openings with upfront CTC disclosures, company policies, workspace culture gallery, and explicit eligibility criteria.
            </p>
          </div>

          <div className="pathway-card">
            <div className="pathway-step-badge">03</div>
            <h4>Multi-Round Assessment</h4>
            <p>
              Participate in structured selection drives. Real-time updates track your status through coding tests, technical interviews, and management rounds.
            </p>
          </div>

          <div className="pathway-card">
            <div className="pathway-step-badge">04</div>
            <h4>Offer Rollout & Onboarding</h4>
            <p>
              Receive verified digital offer letters, review corporate joining terms, and accept your dream position with zero middleman friction.
            </p>
          </div>
        </div>
      </section>

      {/* Recent Success Stories / Placed Students */}
      <section className="stories-section">
        <div className="section-header-center">
          <h2>Recent Placement Success Stories</h2>
          <p>Meet students who successfully transitioned from campus job seekers into placed engineers.</p>
        </div>

        <div className="stories-grid">
          <div className="story-card">
            <div>
              <div className="story-user-row">
                <div className="story-avatar">RS</div>
                <div className="story-user-info">
                  <h4>Rahul Sharma</h4>
                  <p>Computer Science & Engineering</p>
                </div>
              </div>
              <p className="story-quote">
                "The portal's multi-round status tracker kept me informed at every stage. I landed a Software Engineer role within two weeks of applying!"
              </p>
            </div>
            <div className="story-badge-ctc">
              🎉 Placed at TechNova Solutions (14.50 LPA)
            </div>
          </div>

          <div className="story-card">
            <div>
              <div className="story-user-row">
                <div className="story-avatar">PP</div>
                <div className="story-user-info">
                  <h4>Priya Patel</h4>
                  <p>Information Technology</p>
                </div>
              </div>
              <p className="story-quote">
                "Reviewing company culture policies and workspace images on the job details page gave me full confidence before accepting my offer."
              </p>
            </div>
            <div className="story-badge-ctc">
              🎉 Placed at CloudBridge Systems (11.00 LPA)
            </div>
          </div>

          <div className="story-card">
            <div>
              <div className="story-user-row">
                <div className="story-avatar">AV</div>
                <div className="story-user-info">
                  <h4>Ankit Verma</h4>
                  <p>Electronics & Communication</p>
                </div>
              </div>
              <p className="story-quote">
                "The seamless PDF resume upload and instant profile verification made applying to multiple high-CTC roles fast and effortless."
              </p>
            </div>
            <div className="story-badge-ctc">
              🎉 Placed at Insight Analytics (9.50 LPA)
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <p>© 2026 Campus Placement Management System. Empowering Student Careers Nationwide.</p>
      </footer>
    </div>
  );
}

export default Home;