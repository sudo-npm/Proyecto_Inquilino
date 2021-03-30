"use strict";

const database = require("../infrastructure/database");

async function getAllCaseros() {
  const connection = await database.getConnection();
  const query = "SELECT * FROM Caseros";
  const [caseros] = await connection.query(query);

  return caseros;
}

module.exports = {
  getAllCaseros,
};
