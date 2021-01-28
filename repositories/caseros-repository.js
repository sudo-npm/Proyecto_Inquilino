"use strict";

const database = require("../infrastructure/database");

async function getAllCaseros() {
  const pool = await database.getPool();
  const query = "SELECT * FROM Caseros";
  const [caseros] = await pool.query(query);

  return caseros;
}

module.exports = {
  getAllCaseros,
};
