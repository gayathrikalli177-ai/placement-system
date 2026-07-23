const pool = require('../db.js');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        const hash = await bcrypt.hash('password123', 12);
        
        await pool.query(
            `INSERT INTO students (full_name, email, password_hash, phone, department, year_of_study, cgpa)
             VALUES ('Subba Reddy', 'student@demo.com', $1, '9876543210', 'Computer Science', 4, 8.50)
             ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
            [hash]
        );

        await pool.query(
            `INSERT INTO companies (company_name, email, password_hash, location, package_lpa)
             VALUES ('TechNova Solutions', 'company@demo.com', $1, 'Bengaluru', 12.50)
             ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
            [hash]
        );

        console.log('DEMO ACCOUNTS SUCCESSFULLY CREATED/UPDATED:');
        console.log('Student Email: student@demo.com | Password: password123');
        console.log('Company Email: company@demo.com | Password: password123');
    } catch (err) {
        console.error('Seed Error:', err);
    } finally {
        pool.end();
    }
}

seed();
