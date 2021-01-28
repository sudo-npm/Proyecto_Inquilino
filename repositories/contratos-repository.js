"use strict";

const database = require("../infrastructure/database");

async function getAllContratos() {
  const pool = await database.getPool();
  const query = "SELECT * FROM Contratos";
  const [contratos] = await pool.query(query);

  return contratos;
}

module.exports = {
  getAllContratos,
};
