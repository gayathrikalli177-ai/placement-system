const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgresql://neondb_owner:npg_TNYU4eolg2Cp@ep-quiet-cherry-azs9881y.c-3.ap-southeast-1.aws.neon.tech/neondb?sslmode=require",
    ssl: {
        rejectUnauthorized: false
    }
});

module.exports = pool;