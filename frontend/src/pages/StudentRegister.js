import { useState } from "react";
import axios from "axios";

function StudentRegister() {

    const [student, setStudent] = useState({
        full_name: "",
        email: "",
        password: "",
        phone: "",
        department: "",
        year_of_study: "",
        cgpa: ""
    });

    const handleChange = (e) => {
        setStudent({
            ...student,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/students/register",
                student
            );

            alert(res.data.message);

            setStudent({
                full_name: "",
                email: "",
                password: "",
                phone: "",
                department: "",
                year_of_study: "",
                cgpa: ""
            });

        } catch (err) {
    console.log(err);
    console.log(err.response);
    alert(err.response?.data?.message || "Registration Failed");
}

    };

    return (

        <div className="register-container">

            <h2>Student Registration</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="full_name"
                    placeholder="Full Name"
                    value={student.full_name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={student.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={student.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="phone"
                    placeholder="Phone Number"
                    value={student.phone}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="department"
                    placeholder="Department"
                    value={student.department}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    name="year_of_study"
                    placeholder="Year of Study"
                    value={student.year_of_study}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="cgpa"
                    placeholder="CGPA"
                    value={student.cgpa}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Register
                </button>

            </form>

        </div>

    );

}

export default StudentRegister;