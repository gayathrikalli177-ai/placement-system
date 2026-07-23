const { Pool } = require("pg");
require("dotenv").config();

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required. Add it to backend/.env.");
}

const isProduction =
  process.env.NODE_ENV === "production" ||
  connectionString.includes("render.com") ||
  process.env.DB_SSL === "true";

const pool = new Pool({
  connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

module.exports = pool;
