"use strict";

const database = require("../infrastructure/database");

async function getAllAlquileres() {
  const pool = await database.getPool();
  const query = "SELECT * FROM Alquileres";
  const [alquileres] = await pool.query(query);

  return alquileres;
}

async function createAlquiler(
  id_alquiler,
  id_casa,
  id_inquilino,
  id_casero,
  id_contrato
) {
  const pool = await database.getPool();

  const insertQuery =
    "INSERT INTO Alquileres ($id_alquiler, $id_casa, $id_inquilino, $id_casero, $id_contrato) VALUES (?, ?, ?, ?, ?)";
  const [created] = await pool.query(insertQuery, [
    { id_alquiler },
    { id_casa },
    { id_inquilino },
    { id_casero },
    { id_contrato },
  ]);
  return created.insertId;
}

async function getAlquilerById(id) {
  const pool = await database.getPool();
  const query = "SELECT * FROM Alquileres WHERE id = ?";
  const [alquileres] = await pool.query(query, id);

  return alquileres[0];
}

module.exports = {
  getAllAlquileres,
  createAlquiler,
  getAlquilerById,
};
