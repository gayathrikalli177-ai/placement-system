require("dotenv").config();
const pool = require("../db");

async function ensurePrimaryKey(client, table, column) {
    const { rows } = await client.query(
        `SELECT 1 FROM pg_constraint WHERE conrelid = $1::regclass AND contype = 'p'`,
        [table]
    );
    if (rows.length === 0) {
        await client.query(`ALTER TABLE ${table} ADD PRIMARY KEY (${column})`);
    }
}

async function run() {
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        await client.query(`CREATE TABLE IF NOT EXISTS jobs (
            job_id SERIAL PRIMARY KEY, company_id INTEGER NOT NULL REFERENCES companies(company_id),
            job_title VARCHAR(100) NOT NULL, description TEXT, min_cgpa NUMERIC(3, 2),
            salary_lpa NUMERIC(5, 2), location VARCHAR(100), deadline DATE)`);
        await client.query(`CREATE TABLE IF NOT EXISTS applications (
            application_id SERIAL PRIMARY KEY, student_id INTEGER NOT NULL REFERENCES students(student_id),
            job_id INTEGER NOT NULL REFERENCES jobs(job_id), application_date DATE NOT NULL DEFAULT CURRENT_DATE,
            status VARCHAR(30) NOT NULL DEFAULT 'Applied')`);
        await client.query(`CREATE TABLE IF NOT EXISTS resumes (
            resume_id SERIAL PRIMARY KEY, student_id INTEGER NOT NULL REFERENCES students(student_id),
            resume_file VARCHAR(255), resume_score NUMERIC(5, 2), uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)`);
        await ensurePrimaryKey(client, "jobs", "job_id");
        await ensurePrimaryKey(client, "applications", "application_id");
        await ensurePrimaryKey(client, "resumes", "resume_id");
        await client.query("CREATE SEQUENCE IF NOT EXISTS applications_application_id_seq");
        await client.query("ALTER SEQUENCE applications_application_id_seq OWNED BY applications.application_id");
        await client.query("ALTER TABLE applications ALTER COLUMN application_id SET DEFAULT nextval('applications_application_id_seq')");
        await client.query(`SELECT setval(
            'applications_application_id_seq',
            COALESCE(MAX(application_id), 1),
            MAX(application_id) IS NOT NULL
        ) FROM applications`);
        await client.query("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS round_count INTEGER NOT NULL DEFAULT 1 CHECK (round_count BETWEEN 1 AND 10)");
        await client.query("ALTER TABLE jobs ADD COLUMN IF NOT EXISTS is_open BOOLEAN NOT NULL DEFAULT TRUE");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS cover_letter TEXT");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS application_phone VARCHAR(15)");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS application_department VARCHAR(50)");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS application_year INTEGER");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS application_cgpa NUMERIC(3, 2)");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS skills TEXT");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(255)");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS portfolio_url VARCHAR(255)");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS why_fit TEXT");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS availability_date DATE");
        await client.query("ALTER TABLE applications ADD COLUMN IF NOT EXISTS declaration BOOLEAN NOT NULL DEFAULT FALSE");
        await client.query("ALTER TABLE resumes ADD COLUMN IF NOT EXISTS application_id INTEGER REFERENCES applications(application_id) ON DELETE CASCADE");
        await client.query("CREATE UNIQUE INDEX IF NOT EXISTS resumes_application_id_unique ON resumes(application_id)");
        await client.query(`CREATE TABLE IF NOT EXISTS job_rounds (
            job_round_id SERIAL PRIMARY KEY, job_id INTEGER NOT NULL REFERENCES jobs(job_id) ON DELETE CASCADE,
            round_number INTEGER NOT NULL CHECK (round_number > 0), round_name VARCHAR(100) NOT NULL,
            round_type VARCHAR(50) NOT NULL DEFAULT 'Assessment', UNIQUE (job_id, round_number))`);
        await client.query(`CREATE TABLE IF NOT EXISTS application_rounds (
            application_round_id SERIAL PRIMARY KEY, application_id INTEGER NOT NULL REFERENCES applications(application_id) ON DELETE CASCADE,
            job_round_id INTEGER NOT NULL REFERENCES job_rounds(job_round_id) ON DELETE CASCADE,
            status VARCHAR(30) NOT NULL DEFAULT 'Pending', scheduled_at TIMESTAMP, remarks TEXT,
            UNIQUE (application_id, job_round_id))`);
        await client.query("ALTER TABLE application_rounds ADD COLUMN IF NOT EXISTS interview_mode VARCHAR(20)");
        await client.query("ALTER TABLE application_rounds ADD COLUMN IF NOT EXISTS meeting_details VARCHAR(500)");
        await client.query("COMMIT");
        console.log("Placement workflow migration completed successfully.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Placement workflow migration failed:", error.message);
        process.exitCode = 1;
    } finally { client.release(); await pool.end(); }
}
run();
