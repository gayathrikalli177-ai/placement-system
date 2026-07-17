import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, type }) {

    if (type === "student") {

        const student = localStorage.getItem("student");

        return student ? children : <Navigate to="/student/login" />;

    }

    if (type === "company") {

        const company = localStorage.getItem("company");

        return company ? children : <Navigate to="/company/login" />;

    }

    return <Navigate to="/" />;

}

export default ProtectedRoute;