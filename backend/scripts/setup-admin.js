require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../db");

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // 1. Create admins table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admins (
        admin_id SERIAL PRIMARY KEY,
        full_name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'superadmin',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Seed Super Admin Account with requested email & password
    const adminEmail = "Gayathrikalli123@gmail.com";
    const passwordHash = await bcrypt.hash("Gayathri@123", 12);

    await client.query(
      `INSERT INTO admins (full_name, email, password_hash, role)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
      ["Super Admin (Gayathri K)", adminEmail, passwordHash, "superadmin"]
    );

    await client.query("COMMIT");
    console.log(`👑 Super Admin account (Gayathrikalli123@gmail.com / Gayathri@123) configured successfully.`);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Admin setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
