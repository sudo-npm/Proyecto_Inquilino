"use strict";

const { getConnection } = require("../infrastructure/database");

async function getAllInmuebles() {
  const connection = await getConnection();
  const query = "SELECT * FROM Inmuebles";
  const [inmuebles] = await connection.query(query);

  return inmuebles;
}

async function getInmuebleById(id_casa) {
  const connection = await getConnection();
  const query = "SELECT * FROM Inmuebles WHERE id_casa = ?";
  const [inmueble] = await connection.query(query, id_casa);

  return inmueble[0];
}

async function createInmueble(
  /// id_casero, Se genera automático a mi entender, preguntar x si akso---> ????????????
  dirección,
  localidad,
  ciudad,
  cp,
  fotos_inmueble,
  habitaciones,
  baños,
  garajes,
  precio,
  id_user
) {
  const connection = await database.getConnection();

  const insertInmueble = `INSERT INTO Inmuebles (direccion, localidad, ciudad, cp, fotos_inmueble, habitaciones, baños, garaje, precio, id_user) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const [createdInmueble] = await connection.query(insertInmueble, [
    dirección,
    localidad,
    ciudad,
    cp,
    fotos_inmueble,
    habitaciones,
    baños,
    garajes,
    precio,
    id_user,
  ]);
  return createdInmueble.insertId;
}

async function updateInmueble(req, res, next) {
  const connection = await getConnection();
  const updateInmueble =
    "UPDATE `Inmuebles` SET id_casero, direccion, localidad, ciudad, cp, fotos_inmueble, habitaciones, baños, garaje, precio, id_user, WHERE id_casa = ?";
  await connection.query(updateInmueble, [
    id_casero,
    dirección,
    localidad,
    ciudad,
    cp,
    fotos_inmueble,
    habitaciones,
    baños,
    garajes,
    precio,
    id_user,
  ]);

  return true;
}

async function deleteInmueble(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    const { id } = req.params;

    // Compruebo que existe el inmueble
    const [current] = await connection.query(
      `
      SELECT id_casa,
      FROM inmuebles
      WHERE id_casa=?
    `,
      [id]
    );

    if (current.length === 0) {
      const error = new Error(
        `No existe ningún inmueble con id ${id} en la base de datos`
      );
      error.httpStatus = 404;
      throw error;
    }

    await connection.query(
      `
      DELETE FROM inmuebles
      WHERE id_casa=?
    `,
      [id]
    );

    res.send({
      status: "ok",
      message: `El inmueble con id ${id_casa} fue borrado`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  getAllInmuebles,
  getInmuebleById,
  createInmueble,
  updateInmueble,
  deleteInmueble,
};
