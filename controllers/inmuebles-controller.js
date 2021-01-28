"use strict";

const { inmueblesRepository } = require("../repositories");

// Listar todos los inmuebles

async function getInmuebles(req, res) {
  try {
    const inmuebles = await inmueblesRepository.getAllInmuebles();

    res.send({
      inmuebles: inmuebles,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function addInmueble(req, res) {
  try {
    if (!req.auth.role === "user.casero") {
      throw new Error("No eres Casero");
    }

    const schema = Joi.object({
      localidad: Joi.string().min(5).max(255).required(),
      provincia: Joi.string().min(5).max(255).required(),
      cp: Joi.string().min(5).max(255).required(),
      fotos: Joi.string().min(5).max(255).required(),
      habitaciones: Joi.string().min(5).max(255).required(),
      baños: Joi.string().min(5).max(255).required(),
      cocinas: Joi.string().min(5).max(255).required(),
      salones: Joi.string().min(5).max(255).required(),
      garajes: Joi.string().min(5).max(255).required(),
      trasteros: Joi.string().min(5).max(255).required(),
      puntuacion: Joi.string().min(5).max(255).required(),
    });

    await schema.validateAsync(req.body);

    const idCreado = await inmueblesRepository.createInmueble(
      req.body.localidad,
      req.body.provincia,
      req.body.cp,
      req.body.fotos,
      req.body.habitaciones,
      req.body.baños,
      req.body.cocinas,
      req.body.salonesreq.body.garajes,
      req.body.trasteros
    );

    const inmueble = await inmueblesRepository.getInmuebleById(idCreado);

    res.send(inmueble);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  getInmuebles,
  addInmueble,
};
