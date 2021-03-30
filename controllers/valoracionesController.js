"use strict";

const Joi = require("joi");
const { valoracionesRepository } = require("../repositories");

// Listar todos los caseros
async function addValoracion(req, res) {
  try {
    if (!req.auth.role === "id_usuario") {
      throw new Error("No eres usuario");
    }
    const schema = Joi.object({
      valoracion: Joi.string().min(1).max(240).required(),
      puntuacion: Joi.number().min(1).max(3).required(),
    });
  } catch (error) {}
}

async function getValoraciones(req, res) {
  try {
    const valoraciones = await valoracionesRepository.getValoraciones();

    res.send({
      valoraciones: valoraciones,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  getValoraciones,
  addValoracion,
};
