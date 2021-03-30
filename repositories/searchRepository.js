"use strict";

const database = require("../infrastructure/database");

async function getInmuebleCiudad(nameCiudad) {
  const connection = await database.getConnection();
  const query = "select * from Inmuebles where ciudad = ?";
  const [Inmueble] = await connection.query(query, nameCiudad);

  return Inmueble;
}

module.exports = {
  getInmuebleCiudad,
  getInmueblePrecio,
  getInmuebleDireccion,
};
