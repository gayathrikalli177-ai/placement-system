const { Pool } = require("pg");

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "placement_system",
    password: "1625",
    port: 5432,
});

module.exports = pool;