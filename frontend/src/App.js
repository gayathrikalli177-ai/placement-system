import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import { ToastProvider } from "./context/ToastContext";

import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Jobs from "./pages/Jobs";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import JobApplication from "./pages/JobApplication";
import CompanyApplicants from "./pages/CompanyApplicants";
import CompanyJobSettings from "./pages/CompanyJobSettings";
import ProtectedRoute from "./components/ProtectedRoute";
import AIChatbot from "./components/AIChatbot";
import "./App.css";

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/student/register" element={<StudentRegister />} />
          <Route path="/student/login" element={<StudentLogin />} />
          <Route path="/company/register" element={<CompanyRegister />} />
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute type="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/jobs" element={<Jobs />} />
          <Route
            path="/student/dashboard"
            element={
              <ProtectedRoute type="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/dashboard"
            element={
              <ProtectedRoute type="company">
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/post-job"
            element={
              <ProtectedRoute type="company">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <ProtectedRoute type="student">
                <MyApplications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/jobs/:jobId/apply"
            element={
              <ProtectedRoute type="student">
                <JobApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-applicants"
            element={<Navigate to="/company/dashboard" replace />}
          />
          <Route
            path="/company/jobs/:jobId/applicants"
            element={
              <ProtectedRoute type="company">
                <CompanyApplicants />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/:jobId/settings"
            element={
              <ProtectedRoute type="company">
                <CompanyJobSettings />
              </ProtectedRoute>
            }
          />
        </Routes>

        {/* Global Floating AI Placement & Career Mentor Chatbot */}
        <AIChatbot />
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
