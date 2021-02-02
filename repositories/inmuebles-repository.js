"use strict";

const database = require("../infrastructure/database");

async function getAllInmuebles() {
  const pool = await database.getPool();
  const query = "SELECT * FROM Inmuebles";
  const [inmuebles] = await pool.query(query);

  return inmuebles;
}

module.exports = {
  getAllInmuebles,
};
