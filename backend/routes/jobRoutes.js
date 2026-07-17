const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===============================
// POST A NEW JOB
// ===============================

router.post("/add", async (req, res) => {

    const {
        company_id,
        job_title,
        description,
        min_cgpa,
        salary_lpa
    } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO jobs
            (company_id, job_title, description, min_cgpa, salary_lpa)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                company_id,
                job_title,
                description,
                min_cgpa,
                salary_lpa
            ]
        );

        res.status(201).json({
            message: "Job Posted Successfully",
            job: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

});
// ===============================
// VIEW ALL JOBS
// ===============================

router.get("/", async (req, res) => {

    try {

        const result = await pool.query(`
            SELECT
                jobs.job_id,
                companies.company_name,
                jobs.job_title,
                jobs.description,
                jobs.min_cgpa,
                jobs.salary_lpa
            FROM jobs
            JOIN companies
            ON jobs.company_id = companies.company_id
            ORDER BY jobs.job_id;
        `);

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

});
// ===============================
// APPLY FOR JOB
// ===============================

router.post("/apply", async (req, res) => {

    const { student_id, job_id } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO applications
            (student_id, job_id, status)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [
                student_id,
                job_id,
                "Applied"
            ]
        );

        res.status(201).json({
            message: "Applied Successfully",
            application: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

});
// ===============================
// VIEW MY APPLICATIONS
// ===============================

router.get("/applications/:studentId", async (req, res) => {

    const { studentId } = req.params;

    try {

        const result = await pool.query(
            `
            SELECT
                applications.application_id,
                companies.company_name,
                jobs.job_title,
                jobs.salary_lpa,
                applications.status
            FROM applications
            JOIN jobs
                ON applications.job_id = jobs.job_id
            JOIN companies
                ON jobs.company_id = companies.company_id
            WHERE applications.student_id = $1
            ORDER BY applications.application_id DESC;
            `,
            [studentId]
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

});
// ===============================
// VIEW APPLICANTS FOR A COMPANY
// ===============================

router.get("/applicants/:companyId", async (req, res) => {

    const { companyId } = req.params;

    try {

        const result = await pool.query(
            `
            SELECT
                applications.application_id,
                students.full_name,
                students.email,
                students.department,
                students.cgpa,
                jobs.job_title,
                applications.status
            FROM applications
            JOIN students
                ON applications.student_id = students.student_id
            JOIN jobs
                ON applications.job_id = jobs.job_id
            WHERE jobs.company_id = $1
            ORDER BY applications.application_id DESC;
            `,
            [companyId]
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

});
module.exports = router;