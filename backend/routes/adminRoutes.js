const express = require("express");
const pool = require("../db");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Require admin role for all routes
router.use(authenticate, authorize("admin"));

// 1. System Analytics Overview
router.get("/analytics", async (req, res, next) => {
  try {
    const [studRes, compRes, jobsRes, appRes, selectedRes] = await Promise.all([
      pool.query("SELECT COUNT(*) FROM students"),
      pool.query("SELECT COUNT(*) FROM companies"),
      pool.query("SELECT COUNT(*) FROM jobs"),
      pool.query("SELECT COUNT(*) FROM applications"),
      pool.query("SELECT COUNT(*) FROM applications WHERE status = 'Selected'"),
    ]);

    return res.json({
      totalStudents: parseInt(studRes.rows[0].count) || 0,
      totalCompanies: parseInt(compRes.rows[0].count) || 0,
      totalJobs: parseInt(jobsRes.rows[0].count) || 0,
      totalApplications: parseInt(appRes.rows[0].count) || 0,
      selectedOffers: parseInt(selectedRes.rows[0].count) || 0,
    });
  } catch (error) {
    return next(error);
  }
});

// 2. Students Management
router.get("/students", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT student_id, full_name, email, phone, department, year_of_study, cgpa, profile_pic
       FROM students ORDER BY student_id DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.patch("/students/:studentId", async (req, res, next) => {
  const { full_name, phone, department, year_of_study, cgpa } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE students
       SET full_name = COALESCE($1, full_name),
           phone = COALESCE($2, phone),
           department = COALESCE($3, department),
           year_of_study = COALESCE($4, year_of_study),
           cgpa = COALESCE($5, cgpa)
       WHERE student_id = $6 RETURNING *`,
      [full_name, phone, department, year_of_study, cgpa, req.params.studentId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Student not found" });
    return res.json({ message: "Student updated by Admin", student: rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.delete("/students/:studentId", async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM applications WHERE student_id = $1", [req.params.studentId]);
    await client.query("DELETE FROM resumes WHERE student_id = $1", [req.params.studentId]);
    const { rows } = await client.query(
      "DELETE FROM students WHERE student_id = $1 RETURNING student_id",
      [req.params.studentId]
    );
    await client.query("COMMIT");

    if (rows.length === 0) return res.status(404).json({ message: "Student not found" });
    return res.json({ message: "Student account deleted by Admin" });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally {
    client.release();
  }
});

// 3. Companies Management
router.get("/companies", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.company_id, c.company_name, c.email, c.location, c.package_lpa,
              COUNT(j.job_id) AS job_count
       FROM companies c
       LEFT JOIN jobs j ON c.company_id = j.company_id
       GROUP BY c.company_id ORDER BY c.company_id DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.patch("/companies/:companyId", async (req, res, next) => {
  const { company_name, location, package_lpa } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE companies
       SET company_name = COALESCE($1, company_name),
           location = COALESCE($2, location),
           package_lpa = COALESCE($3, package_lpa)
       WHERE company_id = $4 RETURNING *`,
      [company_name, location, package_lpa, req.params.companyId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Company not found" });
    return res.json({ message: "Company updated by Admin", company: rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.delete("/companies/:companyId", async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Delete jobs belonging to company
    const { rows: jobRows } = await client.query("SELECT job_id FROM jobs WHERE company_id = $1", [req.params.companyId]);
    for (const job of jobRows) {
      await client.query("DELETE FROM applications WHERE job_id = $1", [job.job_id]);
      await client.query("DELETE FROM job_rounds WHERE job_id = $1", [job.job_id]);
    }
    await client.query("DELETE FROM jobs WHERE company_id = $1", [req.params.companyId]);
    const { rows } = await client.query("DELETE FROM companies WHERE company_id = $1 RETURNING company_id", [req.params.companyId]);
    await client.query("COMMIT");

    if (rows.length === 0) return res.status(404).json({ message: "Company not found" });
    return res.json({ message: "Company account and drives deleted by Admin" });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally {
    client.release();
  }
});

// 4. Jobs Drive Management
router.get("/jobs", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT j.job_id, j.job_title, j.description, j.min_cgpa, j.salary_lpa, j.location,
              j.deadline, j.is_open, c.company_name,
              COUNT(a.application_id) AS applicant_count
       FROM jobs j
       JOIN companies c ON j.company_id = c.company_id
       LEFT JOIN applications a ON j.job_id = a.job_id
       GROUP BY j.job_id, c.company_name
       ORDER BY j.job_id DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.patch("/jobs/:jobId", async (req, res, next) => {
  const { is_open, salary_lpa, min_cgpa } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE jobs
       SET is_open = COALESCE($1, is_open),
           salary_lpa = COALESCE($2, salary_lpa),
           min_cgpa = COALESCE($3, min_cgpa)
       WHERE job_id = $4 RETURNING *`,
      [is_open, salary_lpa, min_cgpa, req.params.jobId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Job not found" });
    return res.json({ message: "Job posting updated by Admin", job: rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.delete("/jobs/:jobId", async (req, res, next) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM applications WHERE job_id = $1", [req.params.jobId]);
    await client.query("DELETE FROM job_rounds WHERE job_id = $1", [req.params.jobId]);
    const { rows } = await client.query("DELETE FROM jobs WHERE job_id = $1 RETURNING job_id", [req.params.jobId]);
    await client.query("COMMIT");

    if (rows.length === 0) return res.status(404).json({ message: "Job not found" });
    return res.json({ message: "Job posting deleted by Admin" });
  } catch (error) {
    await client.query("ROLLBACK");
    return next(error);
  } finally {
    client.release();
  }
});

// 5. Applications Management
router.get("/applications", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT a.application_id, a.status, a.application_date, a.application_phone,
              a.application_department, a.application_cgpa,
              s.full_name AS student_name, s.email AS student_email,
              j.job_title, c.company_name, r.resume_file
       FROM applications a
       JOIN students s ON a.student_id = s.student_id
       JOIN jobs j ON a.job_id = j.job_id
       JOIN companies c ON j.company_id = c.company_id
       LEFT JOIN resumes r ON a.application_id = r.application_id
       ORDER BY a.application_id DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
});

router.patch("/applications/:applicationId/status", async (req, res, next) => {
  const { status } = req.body;
  try {
    const { rows } = await pool.query(
      `UPDATE applications SET status = $1 WHERE application_id = $2 RETURNING *`,
      [status, req.params.applicationId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Application not found" });
    return res.json({ message: "Application status updated by Admin", application: rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.delete("/applications/:applicationId", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "DELETE FROM applications WHERE application_id = $1 RETURNING application_id",
      [req.params.applicationId]
    );

    if (rows.length === 0) return res.status(404).json({ message: "Application not found" });
    return res.json({ message: "Application record deleted by Admin" });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
