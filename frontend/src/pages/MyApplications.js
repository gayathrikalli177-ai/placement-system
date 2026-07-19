import { useEffect, useState } from "react";
import axios from "axios";

function MyApplications() {

    const [applications, setApplications] = useState([]);

    const student = JSON.parse(localStorage.getItem("student"));

    useEffect(() => {

        const fetchApplications = async () => {

            try {

                const res = await axios.get(
                    `http://localhost:5000/api/jobs/applications/${student.student_id}`
                );

                setApplications(res.data);

            } catch (err) {

                console.log(err);

            }

        };

        if (student) {
            fetchApplications();
        }

    }, [student]);

    return (

        <div className="jobs-container">

            <h1>My Applications</h1>

            {applications.map((app) => (

                <div className="job-card" key={app.application_id}>

                    <h2>{app.job_title}</h2>

                    <h3>{app.company_name}</h3>

                    <p><b>Salary:</b> {app.salary_lpa} LPA</p>

                    <p><b>Status:</b> {app.status}</p>

                </div>

            ))}

        </div>

    );

}

export default MyApplications;