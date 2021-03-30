"use strict";

const database = require("../infrastructure/database");

async function createValoracion(userId, content, postId) {
  const pool = await database.getPool();
  const insertValoracion =
    "INSERT INTO `valoracion`(id_usuario, valoracion, puntuacion, postId) VALUES (?, ?, ?)";
  const [createdValoracion] = await pool.query(insertValoracion, [
    userId,
    valoracion,
    puntuacion,
    postId,
  ]);

  return createdValoracion.insertId;
}

async function getAllValoraciones() {
  const pool = await database.getPool();
  const query = "SELECT * FROM Valoraciones";
  const [valoraciones] = await pool.query(query);

  return valoraciones;
}

module.exports = {
  createValoracion,
  getAllValoraciones,
};
