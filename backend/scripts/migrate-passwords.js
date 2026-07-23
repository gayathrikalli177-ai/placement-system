require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("../db");

const rounds = Number(process.env.BCRYPT_ROUNDS || 12);

if (!Number.isInteger(rounds) || rounds < 10 || rounds > 15) {
    throw new Error("BCRYPT_ROUNDS must be an integer between 10 and 15.");
}

function isBcryptHash(value) {
    return /^\$2[aby]\$\d{2}\$/.test(value);
}

async function migrateTable(client, table, idColumn) {
    const columnResult = await client.query(
        `SELECT column_name FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = $1
           AND column_name IN ('password', 'password_hash')`,
        [table]
    );
    const columns = new Set(columnResult.rows.map((row) => row.column_name));

    if (columns.has("password")) {
        await client.query(`ALTER TABLE ${table} RENAME COLUMN password TO password_hash`);
    }

    if (!columns.has("password") && !columns.has("password_hash")) {
        throw new Error(`${table} has neither password nor password_hash column.`);
    }

    const { rows } = await client.query(`SELECT ${idColumn}, password_hash FROM ${table}`);

    for (const row of rows) {
        if (!isBcryptHash(row.password_hash)) {
            const passwordHash = await bcrypt.hash(row.password_hash, rounds);
            await client.query(
                `UPDATE ${table} SET password_hash = $1 WHERE ${idColumn} = $2`,
                [passwordHash, row[idColumn]]
            );
        }
    }
}

async function run() {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");
        await migrateTable(client, "students", "student_id");
        await migrateTable(client, "companies", "company_id");
        await client.query("COMMIT");
        console.log("Password migration completed successfully.");
    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Password migration failed:", error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

run();
