import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import { setSession } from "../auth/session";
import { useToast } from "../context/ToastContext";
import "./AdminLogin.css";

function AdminLogin() {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState("Gayathrikalli123@gmail.com");
  const [password, setPassword] = useState("Gayathri@123");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    try {
      setLoading(true);
      const res = await api.post("/auth/admin/login", { email, password });
      setSession("admin", res.data.admin, res.data.accessToken);
      showSuccess("👑 Super Admin authenticated! Accessing Command Center...");
      navigate("/admin/dashboard");
    } catch (err) {
      showError(err.response?.data?.message || "Invalid Admin Email or Password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-icon-box">👑</div>
          <h2>Super Admin Command Portal</h2>
          <p>Full System Access & Administrative Override Rights</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="admin-form-group">
            <label>Admin Email Address *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. Gayathrikalli123@gmail.com"
              required
            />
          </div>

          <div className="admin-form-group">
            <label>Security Password *</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
            />
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            {loading ? "Authenticating Admin..." : "⚡ Enter Super Admin Control Panel"}
          </button>

          <button
            type="button"
            className="admin-quick-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            ⚡ 1-Click Super Admin Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
