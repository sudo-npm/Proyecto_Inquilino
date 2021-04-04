"use strict";

const { getPoolConnections } = require("../infrastructure/database");

async function getAllInmuebles() {
  const pool = await getPoolConnections();
  const query = "SELECT * FROM inmuebles";
  const [inmuebles] = await pool.query(query);

  return inmuebles;
}

async function getInmuebleById(id_inmueble) {
  const pool = await getPoolConnections();
  const query = "SELECT * FROM inmuebles WHERE id_inmueble = ?";
  const [inmueble] = await pool.query(query, [id_inmueble]);

  return inmueble[0];
}

async function getInmuebleByTitulo(id_casero, titulo) {
  const pool = await getPoolConnections();
  const query = "SELECT * FROM inmuebles WHERE id_casero = ? AND titulo = ?";
  const [inmueble] = await pool.query(query, [id_casero, titulo]);

  return inmueble[0];
}

async function createInmueble(
  id_casero,
  superficie,
  habitaciones,
  baños,
  cocinas,
  salones,
  garajes,
  trasteros,
  cp,
  direccion,
  ciudad,
  precio,
  titulo
) {
  const pool = await getPoolConnections();
  const insertInmueble =
    "INSERT INTO inmuebles (id_casero, superficie, habitaciones, baños, cocinas, salones, garajes, trasteros, cp, direccion, ciudad, precio, titulo, estado) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  await pool.query(insertInmueble, [
    id_casero,
    superficie,
    habitaciones,
    baños,
    cocinas,
    salones,
    garajes,
    trasteros,
    cp,
    direccion,
    ciudad,
    precio,
    titulo,
    "disponible",
  ]);
}

async function updateInmueble(
  id_inmueble,
  superficie,
  habitaciones,
  baños,
  cocinas,
  salones,
  garajes,
  trasteros,
  cp,
  direccion,
  ciudad,
  precio,
  titulo
) {
  const pool = await getPoolConnections();
  const updateInmueble =
    "UPDATE inmuebles SET superficie = ?, habitaciones = ?, baños = ?, cocinas = ?, salones = ?, garajes = ?, trasteros = ?, cp = ?, direccion = ?, ciudad = ?, precio = ?, titulo = ? WHERE id_inmueble = ?";
  await pool.query(updateInmueble, [
    superficie,
    habitaciones,
    baños,
    cocinas,
    salones,
    garajes,
    trasteros,
    cp,
    direccion,
    ciudad,
    precio,
    titulo,
    id_inmueble,
  ]);
}

async function setOfferInmueble(id_inmueble, id_inquilino) {
  const pool = await getPoolConnections();
  const updateQuery =
    "UPDATE inmuebles SET id_inquilino = ?, estado = 'oferta' WHERE id_inmueble = ?";
  await pool.query(updateQuery, [id_inquilino, id_inmueble]);
}

async function acceptOfferInmueble(id_inmueble) {
  const pool = await getPoolConnections();
  const updateQuery =
    "UPDATE inmuebles SET estado = 'alquilado' WHERE id_inmueble = ?";
  await pool.query(updateQuery, [id_inmueble]);
}

async function rejectOfferInmueble(id_inmueble) {
  const pool = await getPoolConnections();
  const updateQuery =
    "UPDATE inmuebles SET id_inquilino = null, estado = 'disponible' WHERE id_inmueble = ?";
  await pool.query(updateQuery, [id_inmueble]);
}

async function deleteInmueble(id_inmueble) {
  const pool = await getPoolConnections();
  // Compruebo que existe el inmueble
  const [
    current,
  ] = await pool.query(
    "SELECT id_inmueble FROM inmuebles WHERE id_inmueble = ? ",
    [id_inmueble]
  );
  if (current.length === 0) {
    const error = new Error(
      `No existe ningún inmueble con id ${id_inmueble} en la base de datos`
    );
    error.httpStatus = 404;
    throw error;
  }
  await pool.query("DELETE FROM inmuebles WHERE id_inmueble = ?", [
    id_inmueble,
  ]);
}

module.exports = {
  getAllInmuebles,
  getInmuebleById,
  getInmuebleByTitulo,
  createInmueble,
  updateInmueble,
  setOfferInmueble,
  acceptOfferInmueble,
  rejectOfferInmueble,
  deleteInmueble,
};
