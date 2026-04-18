const { Pool } = require("pg");

let pool;

const ensureTables = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS applications (
      id SERIAL PRIMARY KEY,
      user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      course_name TEXT NOT NULL,
      email TEXT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      phone_number TEXT NOT NULL,
      address TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `);

  await pool.query(`ALTER TABLE applications ALTER COLUMN user_id DROP NOT NULL`);
  await pool.query(`ALTER TABLE applications ADD COLUMN IF NOT EXISTS email TEXT`);
};

const connectDB = async (connectionString) => {
  pool = new Pool({ connectionString });
  await pool.query("SELECT 1");
  await ensureTables();
  console.log("PostgreSQL connected");
};

const getPool = () => {
  if (!pool) {
    throw new Error("Database not initialized. Call connectDB first.");
  }
  return pool;
};

module.exports = {
  connectDB,
  getPool,
};
