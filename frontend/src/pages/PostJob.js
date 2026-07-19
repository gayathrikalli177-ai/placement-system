import { useState } from "react";
import axios from "axios";

function PostJob() {
    const company = JSON.parse(localStorage.getItem("company"));
    const [job, setJob] = useState({
    job_title: "",
    description: "",
    min_cgpa: "",
    salary_lpa: ""
});

    const handleChange = (e) => {
        setJob({
            ...job,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
    "https://placement-system-s2xm.onrender.com/api/jobs/add",
    {
        ...job,
        company_id: company.company_id
    }
);

            alert(res.data.message);

            setJob({
    job_title: "",
    description: "",
    min_cgpa: "",
    salary_lpa: ""
});

        } catch (err) {

            alert(err.response?.data?.message || "Failed to Post Job");

        }

    };

    return (

        <div className="register-container">

            <h2>Post New Job</h2>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="job_title"
                    placeholder="Job Title"
                    value={job.job_title}
                    onChange={handleChange}
                    required
                />

                <input
                    type="text"
                    name="description"
                    placeholder="Job Description"
                    value={job.description}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="min_cgpa"
                    placeholder="Minimum CGPA"
                    value={job.min_cgpa}
                    onChange={handleChange}
                    required
                />

                <input
                    type="number"
                    step="0.01"
                    name="salary_lpa"
                    placeholder="Salary (LPA)"
                    value={job.salary_lpa}
                    onChange={handleChange}
                    required
                />

                <button type="submit">
                    Post Job
                </button>

            </form>

        </div>

    );

}

export default PostJob;