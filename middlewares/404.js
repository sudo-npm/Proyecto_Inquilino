"use strict";

function notFound(req, res) {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  console.log(error.message);
  res.status(error.status);
  res.send({ error: error.message });
}

module.exports = notFound;
