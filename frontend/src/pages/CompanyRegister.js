import { useState } from "react";
import axios from "axios";

function CompanyRegister() {

    const [company, setCompany] = useState({
        company_name: "",
        email: "",
        password: "",
        location: "",
        package_lpa: ""
    });

    const handleChange = (e) => {
        setCompany({
            ...company,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "https://placement-system-s2xm.onrender.com/api/companies/register",
                company
            );

            alert(res.data.message);

            setCompany({
                company_name: "",
                email: "",
                password: "",
                location: "",
                package_lpa: ""
            });

        } catch (err) {

            alert(err.response?.data?.message || "Registration Failed");

        }

    };

    return (

        <div className="register-container">

            <h2>Company Registration</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="company_name"
                    placeholder="Company Name"
                    value={company.company_name}
                    onChange={handleChange}
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={company.email}
                    onChange={handleChange}
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={company.password}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={company.location}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="package_lpa"
                    placeholder="Package (LPA)"
                    value={company.package_lpa}
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

export default CompanyRegister;