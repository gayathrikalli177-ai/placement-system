const express = require("express");
const router = express.Router();
const pool = require("../db");

// ===============================
// COMPANY REGISTER
// ===============================

router.post("/register", async (req, res) => {

    const {
        company_name,
        email,
        password,
        location,
        package_lpa
    } = req.body;

    try {

        const result = await pool.query(
            `INSERT INTO companies
            (company_name,email,password,location,package_lpa)
            VALUES ($1,$2,$3,$4,$5)
            RETURNING *`,
            [
                company_name,
                email,
                password,
                location,
                package_lpa
            ]
        );

        res.status(201).json({
            message: "Company Registered Successfully",
            company: result.rows[0]
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            message: err.message
        });

    }

});

// ===============================
// COMPANY LOGIN
// ===============================

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {

        const result = await pool.query(
            "SELECT * FROM companies WHERE email=$1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Company Not Found"
            });
        }

        const company = result.rows[0];

        if (company.password !== password) {
            return res.status(401).json({
                message: "Invalid Password"
            });
        }

        res.json({
            message: "Login Successful",
            company: {
                company_id: company.company_id,
                company_name: company.company_name,
                email: company.email
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