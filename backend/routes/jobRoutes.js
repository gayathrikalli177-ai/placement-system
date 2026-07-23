const express = require("express");
const pool = require("../db");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, validateParams, ValidationError, applicationFormSchema, jobSchema, jobIdParamSchema } = require("../middleware/validation");
const { uploadResume } = require("../middleware/upload");

const router = express.Router();

router.post("/", authenticate, authorize("company"), validate(jobSchema), async (req, res, next) => {
    const { job_title, description, min_cgpa, salary_lpa, location, deadline, round_count } = req.validatedBody;
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `INSERT INTO jobs (company_id, job_title, description, min_cgpa, salary_lpa, location, deadline, round_count)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
            [req.auth.userId, job_title, description, min_cgpa, salary_lpa, location, deadline, round_count]
        );
        for (let roundNumber = 1; roundNumber <= round_count; roundNumber += 1) {
            await client.query(
                "INSERT INTO job_rounds (job_id, round_number, round_name) VALUES ($1, $2, $3)",
                [rows[0].job_id, roundNumber, `Round ${roundNumber}`]
            );
        }
        await client.query("COMMIT");
        return res.status(201).json({ message: "Job posted successfully", job: rows[0] });
    } catch (error) { await client.query("ROLLBACK"); return next(error); } finally { client.release(); }
});

router.get("/", async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT jobs.job_id, companies.company_name, jobs.job_title, jobs.description,
                    jobs.min_cgpa, jobs.salary_lpa, jobs.location, jobs.deadline, jobs.round_count
             FROM jobs JOIN companies ON jobs.company_id = companies.company_id
             WHERE jobs.is_open = TRUE AND (jobs.deadline IS NULL OR jobs.deadline >= CURRENT_DATE)
             ORDER BY jobs.job_id DESC`
        );
        return res.json(rows);
    } catch (error) { return next(error); }
});

router.get("/:jobId", validateParams(jobIdParamSchema), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT jobs.job_id, companies.company_name, jobs.job_title, jobs.description, jobs.min_cgpa,
                    jobs.salary_lpa, jobs.location, jobs.deadline, jobs.round_count
             FROM jobs JOIN companies ON jobs.company_id = companies.company_id
             WHERE jobs.job_id = $1 AND jobs.is_open = TRUE AND (jobs.deadline IS NULL OR jobs.deadline >= CURRENT_DATE)`,
            [req.validatedParams.jobId]
        );
        if (rows.length === 0) return res.status(404).json({ message: "Job not found" });
        return res.json(rows[0]);
    } catch (error) { return next(error); }
});

router.post("/:jobId/applications", authenticate, authorize("student"), validateParams(jobIdParamSchema), uploadResume, async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "A PDF resume is required" });
    const form = applicationFormSchema.safeParse(req.body);
    if (!form.success) return next(new ValidationError(form.error.issues));
    const client = await pool.connect();
    try {
        await client.query("BEGIN");
        const { rows } = await client.query(
            `INSERT INTO applications (student_id, job_id, status, cover_letter, application_phone, application_department,
                application_year, application_cgpa, skills, linkedin_url, portfolio_url, why_fit, availability_date, declaration)
             SELECT $1, jobs.job_id, 'Applied', $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, TRUE
             FROM jobs JOIN students ON students.student_id = $1
             WHERE jobs.job_id = $2
               AND (jobs.min_cgpa IS NULL OR students.cgpa >= jobs.min_cgpa)
               AND jobs.is_open = TRUE
               AND (jobs.deadline IS NULL OR jobs.deadline >= CURRENT_DATE)
               AND NOT EXISTS (SELECT 1 FROM applications WHERE student_id = $1 AND job_id = $2)
             RETURNING *`,
            [req.auth.userId, req.validatedParams.jobId, form.data.cover_letter || null, form.data.phone, form.data.department,
                form.data.year_of_study, form.data.cgpa, form.data.skills, form.data.linkedin_url || null,
                form.data.portfolio_url || null, form.data.why_fit, form.data.availability_date]
        );
        if (rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(409).json({ message: "Already applied, not eligible, or job is closed" });
        }
        await client.query(
            "INSERT INTO resumes (student_id, application_id, resume_file) VALUES ($1, $2, $3)",
            [req.auth.userId, rows[0].application_id, req.file.filename]
        );
        await client.query(
            `INSERT INTO application_rounds (application_id, job_round_id)
             SELECT $1, job_round_id FROM job_rounds WHERE job_id = $2`,
            [rows[0].application_id, req.validatedParams.jobId]
        );
        await client.query("COMMIT");
        return res.status(201).json({ message: "Applied successfully", application: rows[0] });
    } catch (error) { await client.query("ROLLBACK"); return next(error); } finally { client.release(); }
});

module.exports = router;
