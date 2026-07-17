function CompanyDashboard() {

    const company = JSON.parse(localStorage.getItem("company"));

    return (

        <div className="dashboard">

            <h1>🏢 Company Dashboard</h1>

            <h2>Welcome {company?.company_name}</h2>

            <br />

            <button onClick={()=>{
                window.location.href="/post-job";
            }}>
                Post New Job
            </button>

            <br /><br />

            <button onClick={()=>{
                window.location.href="/jobs";
            }}>
                View Jobs
            </button>

            <br /><br />

            <button
    onClick={()=>{
        window.location.href="/view-applicants";
    }}
>
    View Applicants
</button>

            <br /><br />

            <button
                onClick={()=>{
                    localStorage.removeItem("company");
                    window.location.href="/";
                }}
            >
                Logout
            </button>

        </div>

    );

}

export default CompanyDashboard;