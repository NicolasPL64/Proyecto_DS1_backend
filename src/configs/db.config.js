const { Pool } = require('pg');

const pool = new Pool({
    connectionString: "postgres://default:cZVGF62eRQsa@ep-floral-dream-a4cqkv4k-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require",
})

module.exports = pool;