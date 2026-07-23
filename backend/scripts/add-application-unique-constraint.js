require("dotenv").config();

const pool = require("../db");

async function run() {
    const client = await pool.connect();
    try {
        const { rows: duplicates } = await client.query(
            `SELECT student_id, job_id, COUNT(*)::integer AS count
             FROM applications GROUP BY student_id, job_id HAVING COUNT(*) > 1`
        );
        if (duplicates.length > 0) {
            console.error("Cannot add the unique constraint while duplicate applications exist:");
            console.error(duplicates);
            process.exitCode = 1;
            return;
        }
        await client.query(
            `ALTER TABLE applications
             ADD CONSTRAINT applications_student_job_unique UNIQUE (student_id, job_id)`
        );
        console.log("Application uniqueness constraint added.");
    } catch (error) {
        if (error.code === "42P07" || error.code === "42710") {
            console.log("Application uniqueness constraint already exists.");
        } else {
            console.error("Could not add application uniqueness constraint:", error.message);
            process.exitCode = 1;
        }
    } finally {
        client.release();
        await pool.end();
    }
}

run();
