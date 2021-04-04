"use strict";

const Joi = require("joi");
const {
  valoracionesRepository,
  usuariosRepository,
} = require("../repositories");

async function createValoracion(req, res) {
  try {
    const valoracionSchema = Joi.object({
      id_receptor: Joi.number().min(1).required(),
      objeto: Joi.string().valid("casero", "inquilino"),
      puntuacion: Joi.number().min(1).max(5).required(),
      valoracion: Joi.string().min(1).max(240).required(),
    });
    await valoracionSchema.validateAsync(req.body);
    const id_emisor = req.auth.id_usuario;
    await valoracionesRepository.createValoracion(
      id_emisor,
      req.body.id_receptor,
      req.body.objeto,
      req.body.puntuacion,
      req.body.valoracion
    );
    res.status(201);
    res.send({ message: "La valoración ha sido creada correctamente" });
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getValoracionesUsuario(req, res) {
  try {
    const { objeto, id_receptor } = req.params;
    if (!["casero", "inquilino"].includes(objeto)) {
      throw {
        status: 400,
        message:
          'El objeto de las valoraciones debe ser "casero" o "inquilino"',
      };
    }
    const valoraciones = await valoracionesRepository.getAllValoracionesByUsuarioAsObjeto(
      id_receptor,
      objeto
    );
    res.send(valoraciones);
  } catch (err) {
    console.log(err);
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getPuntuacionAllUsuariosAsObjeto(req, res) {
  try {
    const { objeto } = req.params;
    if (!["casero", "inquilino"].includes(objeto)) {
      throw {
        status: 400,
        message:
          'El objeto de las valoraciones debe ser "casero" o "inquilino"',
      };
    }
    const valoraciones = await valoracionesRepository.getAllValoracionesByObjeto(
      objeto
    );
    const puntuacionByUsuario = valoraciones.reduce((acc, curr) => {
      const suma_puntuacion =
        acc[curr.id_receptor] && acc[curr.id_receptor].suma_puntuacion
          ? acc[curr.id_receptor].suma_puntuacion + curr.puntuacion
          : curr.puntuacion;
      const total_valoraciones =
        acc[curr.id_receptor] && acc[curr.id_receptor].total_valoraciones
          ? acc[curr.id_receptor].total_valoraciones + 1
          : 1;
      acc[curr.id_receptor] = {
        puntuacion: suma_puntuacion / total_valoraciones,
        suma_puntuacion,
        total_valoraciones,
      };
      return acc;
    }, {});
    const getUsuariosPromises = Object.keys(puntuacionByUsuario).map(
      usuariosRepository.getUsuarioById
    );
    const usuariosPuntuacion = [];
    for await (let usuario of getUsuariosPromises) {
      usuariosPuntuacion.push({
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        dni: usuario.dni,
        email: usuario.email,
        telefono: usuario.telefono,
        biografia: usuario.biografia,
        avatar: usuario.avatar,
        puntuacion: puntuacionByUsuario[usuario.id_usuario].puntuacion,
      });
    }
    res.send(usuariosPuntuacion);
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  createValoracion,
  getValoracionesUsuario,
  getPuntuacionAllUsuariosAsObjeto,
};
