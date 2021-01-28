"use strict";

const Joi = require("joi");
const { alquileresRepository } = require("../repositories");

async function getAlquileres(req, res) {
  try {
    const alquileres = await alquileresRepository.getAlquileres();
    res.send(alquileres);
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function addAlquiler(req, res) {
  try {
    if (!req.auth.role === "admin") {
      throw new Error("No eres usuario");
    }

    const schema = Joi.object({
      id_alquiler: Joi.string().min(5).max(255).required(),
      id_casa: Joi.string().min(5).max(255).required(),
      id_casero: Joi.string().min(5).max(255).required(),
      id_inquilino: Joi.string().min(5).max(255).required(),
      id_contrato: Joi.string().min(5).max(255).required(),
    });

    await schema.validateAsync(req.body);

    const idAlquilerCreado = await alquileresRepository.createAlquiler(
      req.body.id_alquiler,
      req.body.id_casa,
      req.body.id_casero,
      req.body.id_inquilino,
      req.body.id_contrato
    );

    const book = await alquileresRepository.getAlquilerById(idCreado);

    return res.send(book);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

// Listar todos los alquileres

async function getAlquileres(req, res) {
  try {
    const alquiler = await alquileresRepository.getAllAlquileres();

    res.send({
      alquileres: alquiler,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  getAlquileres,
  addAlquiler,
};
