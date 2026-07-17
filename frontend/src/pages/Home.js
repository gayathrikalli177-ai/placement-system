import { Link } from "react-router-dom";

function Home() {

    return (

        <div className="home">

            <h1>🎓 Campus Placement Management System</h1>

            <p>
                Find Your Dream Job with Top Companies
            </p>

            <div className="home-buttons">

                <Link to="/student/login">
                    <button>Student Login</button>
                </Link>

                <Link to="/company/login">
                    <button>Company Login</button>
                </Link>

            </div>

        </div>

    );

}

export default Home;