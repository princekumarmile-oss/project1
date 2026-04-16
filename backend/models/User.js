const { getPool } = require("../config/db");

const findOne = async (filter) => {
  if (!filter || !filter.email) return null;
  const pool = getPool();
  const { rows } = await pool.query("SELECT * FROM users WHERE email = $1", [filter.email]);
  return rows[0] || null;
};

const create = async ({ name, email, password }) => {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email, password]
  );
  return rows[0];
};

module.exports = {
  findOne,
  create,
};
