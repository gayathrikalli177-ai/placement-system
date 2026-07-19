import { useEffect, useState } from "react";
import axios from "axios";

function ViewApplicants() {

    const [applicants, setApplicants] = useState([]);

    const company = JSON.parse(localStorage.getItem("company"));

    useEffect(() => {

        const fetchApplicants = async () => {

            try {

                const res = await axios.get(
                    `http://localhost:5000/api/jobs/applicants/${company.company_id}`
                );

                setApplicants(res.data);

            } catch (err) {

                console.log(err);

            }

        };

        if (company) {
            fetchApplicants();
        }

    }, []);

    return (

        <div className="jobs-container">

            <h1>Applicants</h1>

            {applicants.map((app) => (

                <div className="job-card" key={app.application_id}>

                    <h2>{app.full_name}</h2>

                    <p><b>Email:</b> {app.email}</p>

                    <p><b>Department:</b> {app.department}</p>

                    <p><b>CGPA:</b> {app.cgpa}</p>

                    <p><b>Applied For:</b> {app.job_title}</p>

                    <p><b>Status:</b> {app.status}</p>

                </div>

            ))}

        </div>

    );

}

export default ViewApplicants;