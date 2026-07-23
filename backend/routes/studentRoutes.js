const express = require("express");
const pool = require("../db");
const { authenticate, authorize } = require("../middleware/auth");
const { validate, studentProfileUpdateSchema } = require("../middleware/validation");
const { uploadAvatar } = require("../middleware/upload");

const router = express.Router();

router.get("/me", authenticate, authorize("student"), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            "SELECT student_id, full_name, email, phone, department, year_of_study, cgpa, profile_pic FROM students WHERE student_id = $1",
            [req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Student profile not found" });
        return res.json(rows[0]);
    } catch (error) { return next(error); }
});

router.patch("/me", authenticate, authorize("student"), validate(studentProfileUpdateSchema), async (req, res, next) => {
    try {
        const { full_name, phone, department, year_of_study, cgpa } = req.validatedBody;
        const { rows } = await pool.query(
            `UPDATE students
             SET full_name = $1, phone = $2, department = $3, year_of_study = $4, cgpa = $5
             WHERE student_id = $6
             RETURNING student_id, full_name, email, phone, department, year_of_study, cgpa, profile_pic`,
            [full_name, phone, department, year_of_study, cgpa, req.auth.userId]
        );
        if (!rows[0]) return res.status(404).json({ message: "Student profile not found" });
        return res.json({ message: "Profile updated successfully", student: rows[0] });
    } catch (error) { return next(error); }
});

router.post("/me/avatar", authenticate, authorize("student"), uploadAvatar, async (req, res, next) => {
    if (!req.file) return res.status(400).json({ message: "Please select an image file (JPG, PNG, WEBP)" });
    try {
        const filename = req.file.filename;
        const { rows } = await pool.query(
            `UPDATE students SET profile_pic = $1 WHERE student_id = $2
             RETURNING student_id, full_name, email, profile_pic`,
            [filename, req.auth.userId]
        );
        return res.json({
            message: "Profile picture uploaded successfully",
            profile_pic: filename,
            student: rows[0]
        });
    } catch (error) { return next(error); }
});

router.get("/me/applications", authenticate, authorize("student"), async (req, res, next) => {
    try {
        const { rows } = await pool.query(
            `SELECT applications.application_id, companies.company_name, jobs.job_title, jobs.salary_lpa, applications.status,
                    COALESCE(json_agg(json_build_object('round_number', job_rounds.round_number,
                        'round_name', job_rounds.round_name, 'status', application_rounds.status,
                        'remarks', application_rounds.remarks, 'scheduled_at', application_rounds.scheduled_at,
                        'interview_mode', application_rounds.interview_mode,
                        'meeting_details', application_rounds.meeting_details)
                        ORDER BY job_rounds.round_number) FILTER (WHERE application_rounds.application_round_id IS NOT NULL), '[]') AS rounds
             FROM applications JOIN jobs ON applications.job_id = jobs.job_id
             JOIN companies ON jobs.company_id = companies.company_id
             LEFT JOIN application_rounds ON application_rounds.application_id = applications.application_id
             LEFT JOIN job_rounds ON job_rounds.job_round_id = application_rounds.job_round_id
             WHERE applications.student_id = $1
             GROUP BY applications.application_id, companies.company_id, jobs.job_id
             ORDER BY applications.application_id DESC`,
            [req.auth.userId]
        );
        return res.json(rows);
    } catch (error) { return next(error); }
});

module.exports = router;
