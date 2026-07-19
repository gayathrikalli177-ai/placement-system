import { useState } from "react";
import axios from "axios";

function StudentLogin() {

    const [login, setLogin] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setLogin({
            ...login,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "https://placement-system-s2xm.onrender.com/api/students/login",
                login
            );

           localStorage.setItem(
    "student",
    JSON.stringify(res.data.student)
);

alert(res.data.message);

window.location.href = "/student/dashboard";
        } catch (err) {

            alert(err.response?.data?.message || "Login Failed");

        }

    };

    return (

        <div className="register-container">

            <h2>Student Login</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={login.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={login.password}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Login
                </button>

            </form>

        </div>

    );

}

export default StudentLogin;