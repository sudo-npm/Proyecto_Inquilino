"use strict";

const {
  inmueblesRepository,
  fotosRepository,
  usuariosRepository,
} = require("../repositories");
const Joi = require("joi");
const { sendEmail } = require("../utils");

// Listar todos os inmuebles
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

// Listar un inmueble
async function getInmueble(req, res) {
  try {
    const { id_inmueble } = req.params;
    const inmueble = await inmueblesRepository.getInmuebleById(id_inmueble);
    if (inmueble) {
      const fotos = await fotosRepository.getFotosByInmueble(id_inmueble);
      inmueble.fotos = fotos.map((foto) => foto.url_foto);
      res.send(inmueble);
    } else {
      res.status(404);
      res.send({ error: "Inmueble no encontrado" });
    }
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function createInmueble(req, res) {
  try {
    const inmuebleSchema = Joi.object({
      superficie: Joi.string(),
      habitaciones: Joi.number(),
      baños: Joi.number(),
      cocinas: Joi.number(),
      salones: Joi.number(),
      garajes: Joi.number(),
      trasteros: Joi.number(),
      cp: Joi.string(),
      direccion: Joi.string(),
      ciudad: Joi.string(),
      precio: Joi.string(),
      titulo: Joi.string(),
    });
    await inmuebleSchema.validateAsync(req.body);
    await inmueblesRepository.createInmueble(
      req.auth.id_usuario,
      req.body.superficie,
      req.body.habitaciones,
      req.body.baños,
      req.body.cocinas,
      req.body.salones,
      req.body.garajes,
      req.body.trasteros,
      req.body.cp,
      req.body.direccion,
      req.body.ciudad,
      req.body.precio,
      req.body.titulo
    );
    const newInmueble = await inmueblesRepository.getInmuebleByTitulo(
      req.auth.id_usuario,
      req.body.titulo
    );
    if (req.files && req.files.fotos) {
      Object.keys(req.files.fotos).forEach((key) => {
        const foto = req.files.fotos[key];
        const foto_url = `/img/${newInmueble.id_inmueble}_${foto.name}`;
        fotosRepository.createFoto(newInmueble.id_inmueble, foto_url);
        foto.mv(`.${foto_url}`);
      });
    }
    res.status(201);
    res.send(newInmueble);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function editInmueble(req, res) {
  try {
    const inmuebleSchema = Joi.object({
      superficie: Joi.string(),
      habitaciones: Joi.number(),
      baños: Joi.number(),
      cocinas: Joi.number(),
      salones: Joi.number(),
      garajes: Joi.number(),
      trasteros: Joi.number(),
      cp: Joi.string(),
      direccion: Joi.string(),
      ciudad: Joi.string(),
      precio: Joi.string(),
      titulo: Joi.string(),
    });
    await inmuebleSchema.validateAsync(req.body);

    const { id_inmueble } = req.params;
    await inmueblesRepository.updateInmueble(
      id_inmueble,
      req.body.superficie,
      req.body.habitaciones,
      req.body.baños,
      req.body.cocinas,
      req.body.salones,
      req.body.garajes,
      req.body.trasteros,
      req.body.cp,
      req.body.direccion,
      req.body.ciudad,
      req.body.precio,
      req.body.titulo
    );

    const updatedInmueble = await inmueblesRepository.getInmuebleById(
      id_inmueble
    );
    res.status(200);
    res.send(updatedInmueble);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function setOfferInmueble(req, res) {
  try {
    const { id_inmueble } = req.params;
    const { id_usuario } = req.auth;
    const inmueble = await inmueblesRepository.getInmuebleById(id_inmueble);
    if (inmueble.estado !== "disponible") {
      throw {
        status: 403,
        message: "No puedes ofertar por un inmueble que no está disponible",
      };
    }
    await inmueblesRepository.setOfferInmueble(id_inmueble, id_usuario);
    const updatedInmueble = await inmueblesRepository.getInmuebleById(
      id_inmueble
    );
    res.status(200);
    res.send(updatedInmueble);
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function acceptOfferInmueble(req, res) {
  try {
    const { id_inmueble } = req.params;
    const inmueble = await inmueblesRepository.getInmuebleById(id_inmueble);
    if (inmueble.estado !== "oferta") {
      throw {
        status: 403,
        message:
          "No puedes aceptar una oferta por un inmueble que no dispone de una",
      };
    }
    const inquilino = await usuariosRepository.getUsuarioById(
      inmueble.id_inquilino
    );
    await sendEmail(
      inquilino.email,
      "Oferta aceptada",
      `¡Enhorabuena! El casero ha aceptado tu oferta de alquiler por el inmueble situado en ${inmueble.direccion} (${inmueble.ciudad})`
    );
    await inmueblesRepository.acceptOfferInmueble(id_inmueble);
    const updatedInmueble = await inmueblesRepository.getInmuebleById(
      id_inmueble
    );
    res.status(200);
    res.send(updatedInmueble);
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function rejectOfferInmueble(req, res) {
  try {
    const { id_inmueble } = req.params;
    const inmueble = await inmueblesRepository.getInmuebleById(id_inmueble);
    if (inmueble.estado !== "oferta") {
      throw {
        status: 403,
        message:
          "No puedes rechazar una oferta por un inmueble que no dispone de una",
      };
    }
    const inquilino = await usuariosRepository.getUsuarioById(
      inmueble.id_inquilino
    );
    await sendEmail(
      inquilino.email,
      "Oferta rechazada",
      `¡Lo sentimos! El casero ha rechazado tu oferta de alquiler por el inmueble situado en ${inmueble.direccion} (${inmueble.ciudad})`
    );
    await inmueblesRepository.rejectOfferInmueble(id_inmueble);
    const updatedInmueble = await inmueblesRepository.getInmuebleById(
      id_inmueble
    );
    res.status(200);
    res.send(updatedInmueble);
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function deleteInmueble(req, res) {
  try {
    const { id_inmueble } = req.params;
    await inmueblesRepository.deleteInmueble(id_inmueble);
    res.send({ message: "El inmueble ha sido borrado" });
  } catch (err) {
    console.error("No tienes permiso para realizar esta acción");
    res.send({ error: err.message });
  }
}

module.exports = {
  createInmueble,
  getInmuebles,
  getInmueble,
  editInmueble,
  setOfferInmueble,
  acceptOfferInmueble,
  rejectOfferInmueble,
  deleteInmueble,
};
