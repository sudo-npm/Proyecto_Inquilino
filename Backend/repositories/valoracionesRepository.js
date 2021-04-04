"use strict";

const { getPoolConnections } = require("../infrastructure/database");

async function createValoracion(
  id_emisor,
  id_receptor,
  objeto,
  puntuacion,
  valoracion
) {
  const pool = await getPoolConnections();
  const fecha = new Date();
  const insertValoracion =
    "INSERT INTO valoraciones (id_emisor, id_receptor, objeto, puntuacion, valoracion, fecha) VALUES (?, ?, ?, ?, ?, ?)";
  await pool.query(insertValoracion, [
    id_emisor,
    id_receptor,
    objeto,
    puntuacion,
    valoracion,
    fecha,
  ]);
}

async function getAllValoracionesByUsuarioAsObjeto(id_receptor, objeto) {
  const pool = await getPoolConnections();
  const getValoraciones =
    "SELECT * FROM valoraciones WHERE id_receptor = ? AND objeto = ?";
  const [valoraciones] = await pool.query(getValoraciones, [
    id_receptor,
    objeto,
  ]);

  return valoraciones;
}

async function getAllValoracionesByObjeto(objeto) {
  const pool = await getPoolConnections();
  const getValoraciones = "SELECT * FROM valoraciones WHERE objeto = ?";
  const [valoraciones] = await pool.query(getValoraciones, [objeto]);

  return valoraciones;
}

module.exports = {
  createValoracion,
  getAllValoracionesByUsuarioAsObjeto,
  getAllValoracionesByObjeto,
};
