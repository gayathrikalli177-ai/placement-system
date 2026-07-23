import { Navigate } from "react-router-dom";
import { getSession } from "../auth/session";

function ProtectedRoute({ children, type }) {
  if (type === "student") {
    const student = getSession("student");
    return student ? children : <Navigate to="/student/login" />;
  }

  if (type === "company") {
    const company = getSession("company");
    return company ? children : <Navigate to="/company/login" />;
  }

  if (type === "admin") {
    const admin = getSession("admin");
    return admin ? children : <Navigate to="/admin/login" />;
  }

  return <Navigate to="/" />;
}

export default ProtectedRoute;
