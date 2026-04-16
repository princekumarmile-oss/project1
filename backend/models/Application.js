const { getPool } = require("../config/db");

const create = async ({ userId, courseName, firstName, lastName, phoneNumber, address }) => {
  const pool = getPool();
  const { rows } = await pool.query(
    `INSERT INTO applications (user_id, course_name, first_name, last_name, phone_number, address)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [userId, courseName, firstName, lastName, phoneNumber, address]
  );
  return rows[0];
};

module.exports = {
  create,
};
