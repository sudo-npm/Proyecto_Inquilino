"use strict";

// const connection = require("mysql2/typings/mysql/lib/Connection");
const { getConnection } = require("../infrastructure/database");

async function getAllAlquileres() {
  const connection = await database.getConnection();
  const query = "SELECT * FROM Alquileres";
  const [alquileres] = await connection.query(query);

  return alquileres;
}

async function createAlquiler(
  id_alquiler,
  id_casa,
  id_inquilino,
  id_casero,
  id_contrato
) {
  const connection = await database.getConnection();

  const insertQuery =
    "INSERT INTO Alquileres ($id_alquiler, $id_casa, $id_inquilino, $id_casero, $id_contrato) VALUES (?, ?, ?, ?, ?)";
  const [created] = await connection.query(insertQuery, [
    { id_alquiler },
    { id_casa },
    { id_inquilino },
    { id_casero },
    { id_contrato },
  ]);
  return created.insertId;
}

async function getAlquilerById(id) {
  const connection = await database.getConnection();
  const query = "SELECT * FROM Alquileres WHERE id = ?";
  const [alquileres] = await connection.query(query, id);

  return alquileres[0];
}

module.exports = {
  getAllAlquileres,
  createAlquiler,
  getAlquilerById,
};
