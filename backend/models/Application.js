const { getPool } = require("../config/db");

const create = async ({ userId, courseName, email, firstName, lastName, phoneNumber, address }) => {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO applications (user_id, course_name, email, first_name, last_name, phone_number, address)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, courseName, email, firstName, lastName, phoneNumber, address]
  );
  return rows[0];
};

module.exports = {
  create,
};
