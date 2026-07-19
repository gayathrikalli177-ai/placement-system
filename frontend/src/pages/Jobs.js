import { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {

    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {

        try {

            const res = await axios.get(
                "https://placement-system-s2xm.onrender.com/api/jobs"
            );

            setJobs(res.data);

        } catch (err) {

            console.log(err);

        }

    };

    const applyJob = async (jobId) => {

        const studentId = prompt("Enter your Student ID");

        if (!studentId) {
            return;
        }

        try {

            const res = await axios.post(
                "https://placement-system-s2xm.onrender.com/api/jobs/apply",
                {
                    student_id: studentId,
                    job_id: jobId
                }
            );

            alert(res.data.message);

        } catch (err) {

            alert(err.response?.data?.message || "Application Failed");

        }

    };

    return (

        <div className="jobs-container">

            <h1>Available Jobs</h1>

            {jobs.map((job) => (

                <div className="job-card" key={job.job_id}>

                    <h2>{job.job_title}</h2>

                    <h3>{job.company_name}</h3>

                    <p>{job.description}</p>

                    <p><b>Minimum CGPA:</b> {job.min_cgpa}</p>

                    <p><b>Salary:</b> {job.salary_lpa} LPA</p>

                    <button onClick={() => applyJob(job.job_id)}>
                        Apply
                    </button>

                </div>

            ))}

        </div>

    );

}

export default Jobs;