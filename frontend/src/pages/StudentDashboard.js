function StudentDashboard() {

    const student = JSON.parse(localStorage.getItem("student"));

    return (

        <div className="dashboard">

            <h1>🎓 Student Dashboard</h1>

            <h2>Welcome {student?.full_name}</h2>

            <br />

            <button onClick={()=>{
                window.location.href="/jobs";
            }}>
                View Jobs
            </button>

            <br /><br />

            <button
    onClick={()=>{
        window.location.href="/my-applications";
    }}
>
    My Applications
</button>

            <br /><br />

            <button
                onClick={()=>{
                    localStorage.removeItem("student");
                    window.location.href="/";
                }}
            >
                Logout
            </button>

        </div>

    );

}

export default StudentDashboard;