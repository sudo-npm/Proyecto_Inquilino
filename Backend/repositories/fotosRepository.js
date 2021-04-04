"use strict";

const { getPoolConnections } = require("../infrastructure/database");

async function createFoto(id_inmueble, url_foto) {
  const pool = await getPoolConnections();
  const insertFoto = "INSERT INTO fotos (id_inmueble, url_foto) VALUES (?, ?)";
  await pool.query(insertFoto, [id_inmueble, url_foto]);
}

async function getFotosByInmueble(id_inmueble) {
  const pool = await getPoolConnections();
  const query = "SELECT * FROM fotos WHERE id_inmueble = ?";
  const [fotos] = await pool.query(query, [id_inmueble]);

  return fotos;
}

module.exports = {
  createFoto,
  getFotosByInmueble,
};
