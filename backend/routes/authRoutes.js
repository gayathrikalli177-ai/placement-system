const express = require("express");
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { createAccessToken } = require("../auth");
const {
    validate,
    studentRegistrationSchema,
    companyRegistrationSchema,
    loginSchema
} = require("../middleware/validation");

const router = express.Router();
const bcryptRounds = Number(process.env.BCRYPT_ROUNDS || 12);

function registrationRoute({ path, schema, table, fields, idField, role, responseKey }) {
    router.post(path, validate(schema), async (req, res, next) => {
        try {
            const values = fields.map((field) => req.validatedBody[field]);
            const passwordIndex = fields.indexOf("password");
            values[passwordIndex] = await bcrypt.hash(values[passwordIndex], bcryptRounds);
            const columns = fields.map((field) => field === "password" ? "password_hash" : field);
            const { rows } = await pool.query(
                `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns.map((_, index) => `$${index + 1}`).join(", ")})
                 RETURNING ${idField}, ${responseKey === "student" ? "full_name" : "company_name"}, email`,
                values
            );
            return res.status(201).json({ message: `${responseKey === "student" ? "Student" : "Company"} registered successfully`, [responseKey]: rows[0] });
        } catch (error) { return next(error); }
    });
}

function loginRoute({ path, table, idField, nameField, role, responseKey }) {
    router.post(path, validate(loginSchema), async (req, res, next) => {
        const { email, password } = req.validatedBody;
        try {
            const { rows } = await pool.query(`SELECT * FROM ${table} WHERE LOWER(email) = LOWER($1)`, [email]);
            const user = rows[0];
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            return res.json({
                message: "Login successful",
                accessToken: createAccessToken({ id: user[idField], role, email: user.email }),
                [responseKey]: { [idField]: user[idField], [nameField]: user[nameField], email: user.email }
            });
        } catch (error) { return next(error); }
    });
}

registrationRoute({ path: "/students/register", schema: studentRegistrationSchema, table: "students", fields: ["full_name", "email", "password", "phone", "department", "year_of_study", "cgpa"], idField: "student_id", role: "student", responseKey: "student" });
registrationRoute({ path: "/companies/register", schema: companyRegistrationSchema, table: "companies", fields: ["company_name", "email", "password", "location", "package_lpa"], idField: "company_id", role: "company", responseKey: "company" });
loginRoute({ path: "/students/login", table: "students", idField: "student_id", nameField: "full_name", role: "student", responseKey: "student" });
loginRoute({ path: "/companies/login", table: "companies", idField: "company_id", nameField: "company_name", role: "company", responseKey: "company" });
loginRoute({ path: "/admin/login", table: "admins", idField: "admin_id", nameField: "full_name", role: "admin", responseKey: "admin" });

module.exports = router;
