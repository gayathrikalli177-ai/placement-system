const express = require("express");
const fs = require("fs");
const path = require("path");
const pool = require("../db");
const { authenticate, authorize } = require("../middleware/auth");
const {
    validate, validateParams, jobIdParamSchema, applicationManagementParamSchema,
    roundManagementParamSchema, applicationStatusSchema, roundStatusSchema,
    jobUpdateSchema, jobRoundParamSchema, jobRoundUpdateSchema, companyProfileUpdateSchema
} = require("../middleware/validation");

const router = express.Router();
const companyOnly = [authenticate, authorize("company")];

router.get("/me", ...companyOnly, async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            "SELECT company_id, company_name, email, location, package_lpa FROM companies WHERE company_id = $1",
            [req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Company profile not found" });
        return res.json(rows[0]);
    } catch (error) { return next(error); }
});

router.patch("/me", ...companyOnly, validate(companyProfileUpdateSchema), async (req, res, next) => {
    try {
        const { company_name, location, package_lpa } = req.validatedBody;
        const { rows } = await pool.query(
            `UPDATE companies
             SET company_name = $1, location = $2, package_lpa = $3
             WHERE company_id = $4
             RETURNING company_id, company_name, email, location, package_lpa`,
            [company_name, location, package_lpa, req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Company profile not found" });
        return res.json({ message: "Company profile updated successfully", company: rows[0] });
    } catch (error) { return next(error); }
});

router.get("/me/jobs", ...companyOnly, async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT jobs.*, COUNT(applications.application_id)::integer AS applicant_count
             FROM jobs LEFT JOIN applications ON applications.job_id = jobs.job_id
             WHERE jobs.company_id = $1 GROUP BY jobs.job_id ORDER BY jobs.job_id DESC`,
            [req.auth.userId]
        );
        return res.json(rows);
    } catch (error) { return next(error); }
});

router.get("/me/jobs/:jobId/settings", ...companyOnly, validateParams(jobIdParamSchema), async (req, res, next) => {
    try {
        const jobResult = await pool.query(
            "SELECT * FROM jobs WHERE job_id = $1 AND company_id = $2",
            [req.validatedParams.jobId, req.auth.userId]
        );
        if (!jobResult.rows[0]) return res.status(404).json({ message: "Job not found" });
        const roundsResult = await pool.query(
            "SELECT job_round_id, round_number, round_name FROM job_rounds WHERE job_id = $1 ORDER BY round_number",
            [req.validatedParams.jobId]
        );
        return res.json({ job: jobResult.rows[0], rounds: roundsResult.rows });
    } catch (error) { return next(error); }
});

router.patch("/me/jobs/:jobId", ...companyOnly, validateParams(jobIdParamSchema), validate(jobUpdateSchema), async (req, res, next) => {
    try {
        const job = req.validatedBody;
        const { rows } = await pool.query(
            `UPDATE jobs SET job_title = $1, description = $2, min_cgpa = $3, salary_lpa = $4,
                location = $5, deadline = $6, is_open = $7
             WHERE job_id = $8 AND company_id = $9 RETURNING *`,
            [job.job_title, job.description, job.min_cgpa, job.salary_lpa, job.location, job.deadline,
                job.is_open, req.validatedParams.jobId, req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Job not found" });
        return res.json({ message: "Job settings saved", job: rows[0] });
    } catch (error) { return next(error); }
});

router.patch("/me/jobs/:jobId/rounds/:roundId", ...companyOnly, validateParams(jobRoundParamSchema), validate(jobRoundUpdateSchema), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `UPDATE job_rounds SET round_name = $1
             FROM jobs WHERE job_rounds.job_round_id = $2 AND job_rounds.job_id = jobs.job_id
             AND jobs.job_id = $3 AND jobs.company_id = $4 RETURNING job_rounds.*`,
            [req.validatedBody.round_name, req.validatedParams.roundId, req.validatedParams.jobId, req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Recruitment round not found" });
        return res.json({ message: "Round name saved", round: rows[0] });
    } catch (error) { return next(error); }
});

router.get("/me/jobs/:jobId/applications", ...companyOnly, validateParams(jobIdParamSchema), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT applications.application_id, applications.status, applications.application_date, applications.cover_letter,
                    applications.application_phone, applications.application_department, applications.application_year,
                    applications.application_cgpa, applications.skills, applications.linkedin_url, applications.portfolio_url,
                    applications.why_fit, applications.availability_date, students.full_name, students.email,
                    resumes.resume_id, resumes.resume_file,
                    COALESCE(json_agg(json_build_object('application_round_id', application_rounds.application_round_id,
                        'round_name', job_rounds.round_name, 'round_number', job_rounds.round_number,
                        'status', application_rounds.status, 'remarks', application_rounds.remarks,
                        'scheduled_at', application_rounds.scheduled_at,
                        'interview_mode', application_rounds.interview_mode,
                        'meeting_details', application_rounds.meeting_details)
                        ORDER BY job_rounds.round_number) FILTER (WHERE application_rounds.application_round_id IS NOT NULL), '[]') AS rounds
             FROM applications JOIN students ON students.student_id = applications.student_id
             JOIN jobs ON jobs.job_id = applications.job_id
             LEFT JOIN resumes ON resumes.application_id = applications.application_id
             LEFT JOIN application_rounds ON application_rounds.application_id = applications.application_id
             LEFT JOIN job_rounds ON job_rounds.job_round_id = application_rounds.job_round_id
             WHERE jobs.company_id = $1 AND jobs.job_id = $2
             GROUP BY applications.application_id, students.student_id, resumes.resume_id
             ORDER BY applications.application_id DESC`,
            [req.auth.userId, req.validatedParams.jobId]
        );
        return res.json(rows);
    } catch (error) { return next(error); }
});

router.patch("/me/jobs/:jobId/applications/:applicationId/status", ...companyOnly, validateParams(applicationManagementParamSchema), validate(applicationStatusSchema), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `UPDATE applications SET status = $1 FROM jobs
             WHERE applications.application_id = $2 AND applications.job_id = jobs.job_id
               AND jobs.company_id = $3 AND jobs.job_id = $4 RETURNING applications.*`,
            [req.validatedBody.status, req.validatedParams.applicationId, req.auth.userId, req.validatedParams.jobId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Application not found" });
        return res.json({ message: "Application status updated", application: rows[0] });
    } catch (error) { return next(error); }
});

router.patch("/me/jobs/:jobId/applications/:applicationId/rounds/:applicationRoundId", ...companyOnly, validateParams(roundManagementParamSchema), validate(roundStatusSchema), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `UPDATE application_rounds
             SET status = $1, remarks = $2, scheduled_at = $3, interview_mode = $4, meeting_details = $5
             FROM applications JOIN jobs ON jobs.job_id = applications.job_id
             WHERE application_rounds.application_round_id = $6 AND application_rounds.application_id = applications.application_id
               AND applications.application_id = $7 AND jobs.job_id = $8 AND jobs.company_id = $9 RETURNING application_rounds.*`,
            [req.validatedBody.status, req.validatedBody.remarks || null, req.validatedBody.scheduled_at || null,
                req.validatedBody.interview_mode || null, req.validatedBody.meeting_details || null,
                req.validatedParams.applicationRoundId, req.validatedParams.applicationId, req.validatedParams.jobId, req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Recruitment round not found" });
        return res.json({ message: "Round updated", round: rows[0] });
    } catch (error) { return next(error); }
});

router.get("/me/jobs/:jobId/applications/:applicationId/resume", ...companyOnly, validateParams(applicationManagementParamSchema), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT resumes.resume_file FROM resumes JOIN applications ON applications.application_id = resumes.application_id
             JOIN jobs ON jobs.job_id = applications.job_id
             WHERE resumes.application_id = $1 AND jobs.job_id = $2 AND jobs.company_id = $3`,
            [req.validatedParams.applicationId, req.validatedParams.jobId, req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Resume not found" });
        const filePath = path.join(__dirname, "..", "uploads", "resumes", rows[0].resume_file);
        if (!fs.existsSync(filePath)) return res.status(404).json({ message: "Resume file not found" });
        return res.download(filePath, "resume.pdf");
    } catch (error) { return next(error); }
});

module.exports = router;
