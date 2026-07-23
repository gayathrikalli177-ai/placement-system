import { useEffect, useState } from "react";
import api from "../api/client";
import { getSession } from "../auth/session";

function ViewApplicants() {

    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const company = getSession("company");

    useEffect(() => {

        const fetchApplicants = async () => {

            try {

                const res = await api.get("/companies/me/applications");

                setApplicants(res.data);

            } catch (err) {
                setError(err.response?.data?.message || "Unable to load applicants.");

            } finally {
                setLoading(false);

            }

        };

        if (company) {
            fetchApplicants();
        }

    }, [company]);

    return (

        <div className="jobs-container">

            <h1>Applicants</h1>

            {loading && <p className="page-message">Loading applicants…</p>}

            {!loading && error && <p className="page-message error-message">{error}</p>}

            {!loading && !error && applicants.length === 0 && (
                <p className="page-message">No students have applied to your jobs yet.</p>
            )}

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
