import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import StudentLogin from "./pages/StudentLogin";
import StudentRegister from "./pages/StudentRegister";
import CompanyLogin from "./pages/CompanyLogin";
import CompanyRegister from "./pages/CompanyRegister";
import Jobs from "./pages/Jobs";
import StudentDashboard from "./pages/StudentDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import ViewApplicants from "./pages/ViewApplicants";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/student/register" element={<StudentRegister />} />

        <Route path="/student/login" element={<StudentLogin />} />

        <Route path="/company/register" element={<CompanyRegister />} />

        <Route path="/company/login" element={<CompanyLogin />} />

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
    element={<CompanyDashboard />}
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
    path="/view-applicants"
    element={
        <ProtectedRoute type="company">
            <ViewApplicants />
        </ProtectedRoute>
    }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;