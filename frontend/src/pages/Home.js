import { Link } from "react-router-dom";
import { getSession } from "../auth/session";
import "./Home.css";

function Home() {
  const student = getSession("student");
  const company = getSession("company");
  const admin = getSession("admin");

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