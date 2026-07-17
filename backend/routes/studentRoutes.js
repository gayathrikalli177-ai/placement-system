const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===============================
// GET ALL STUDENTS
// ===============================
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Database Error");
    }
});

// ===============================
// REGISTER STUDENT
// ===============================
router.post("/register", async (req, res) => {

    const {
        full_name,
        email,
        password,
        phone,
        department,
        year_of_study,
        cgpa
    } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO students
            (full_name,email,password,phone,department,year_of_study,cgpa)
            VALUES ($1,$2,$3,$4,$5,$6,$7)
            RETURNING *`,
            [
                full_name,
                email,
                password,
                phone,
                department,
                year_of_study,
                cgpa
            ]
        );

        res.status(201).json({
            message: "Student Registered Successfully",
            student: result.rows[0]
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Database Error");
    }

});
router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const result = await pool.query(
            "SELECT * FROM students WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Student Not Found"
            });
        }

        const student = result.rows[0];

        if (student.password !== password) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        res.json({
            message: "Login Successful",
            student: {
                student_id: student.student_id,
                full_name: student.full_name,
                email: student.email
            }
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            message: err.message
        });
    }

});

module.exports = router;