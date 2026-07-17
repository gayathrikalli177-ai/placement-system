import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {

    return (

        <nav className="navbar">

            <h2>🎓 Campus Placement</h2>

            <div className="nav-links">

                <Link to="/">Home</Link>

                <Link to="/jobs">Jobs</Link>

                <Link to="/student/login">Student</Link>

                <Link to="/company/login">Company</Link>

            </div>

        </nav>

    );

}

export default Navbar;