"use strict";

const { inmueblesRepository } = require("../repositories");
const Joi = require("joi");

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

/// Listar un inmueble

async function getInmuebleId(req, res) {
  try {
    const inmueble = await inmueblesRepository.getInmuebleById();

    res.send({
      inmueble: inmueble,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function addInmueble(req, res) {
  try {
    if (currentEntry.id_user !== req.auth.id) {
      throw new Error("No eres Usuario");
    }

    const inmuebleSchema = Joi.object({
      direccion: Joi.string().min(5).max(255).required(),
      localidad: Joi.string().min(5).max(255).required(),
      ciudad: Joi.string().min(1).max(255).required(),
      cp: Joi.string().min(5).max(255).required(),
      fotos_inmueble: Joi.string().min(1).max(200).required(),
      habitaciones: Joi.string().min(1).max(20).required(),
      baños: Joi.string(),
      cocinas: Joi.string(),
      salones: Joi.string(),
      garaje: Joi.string(),
      trasteros: Joi.string(),
      precio: Joi.string().required(),
    });

    await inmuebleSchema.validateAsync(req.body);

    const idCreado = await inmueblesRepository.createInmueble(
      req.auth.id_casero,
      req.body.direccion,
      req.body.localidad,
      req.body.ciudad,
      req.body.cp,
      req.body.fotos_inmueble,
      req.body.habitaciones,
      req.body.baños,
      req.body.garaje,
      req.body.precio
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

async function editInmueble(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await editEntrySchema.validateAsync(req.body);

    // Sacamos os datos
    const {
      direccion,
      localidad,
      ciudad,
      cp,
      fotos_inmueble,
      habitaciones,
      baños,
      cocinas,
      salones,
      garajes,
      trasteros,
      precio,
    } = req.body;

    const { id } = req.params;

    // Seleccionamos os datos actuais da entrada
    const [current] = await connection.query(
      `
      SELECT direccion, localidad, ciudad, cp, fotos_inmueble, habitaciones, baños, cocinas, salones, garajes, trasteros, precio,
      lastUpdate
      FROM Inmuebles WHERE id_casa = ?
      `,
      [id]
    );
    const [currentEntry] = current;

    if (currentEntry.id_user !== req.auth.id && req.auth.role !== "user") {
      throw generateError("No tienes persmisos para editar esta entrada", 403);
    }

    // Executamos a query de edición da entrada

    await connection.query(
      `
      UPDATE Inmuebles SET 
      direccion=?, 
      localidad=?, 
      ciudad=?, 
      cp=?, 
      fotos_inmueble=?, 
      habitaciones=?, 
      baños=?, 
      cocinas=?, 
      salones=?, 
      garajes=?, 
      trasteros=?, 
      precio=?
      
      WHERE id_casa = ?
      `,
      [
        direccion,
        localidad,
        ciudad,
        cp,
        fotos_inmueble,
        habitaciones,
        baños,
        cocinas,
        salones,
        garajes,
        trasteros,
        precio,
      ]
    );

    // Devolvemos resultados

    res.send({
      status: "ok",
      data: {
        direccion,
        localidad,
        ciudad,
        cp,
        fotos_inmueble,
        habitaciones,
        baños,
        cocinas,
        salones,
        garajes,
        trasteros,
        precio,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

async function deleteInmueble() {
  try {
    const { id } = req.params;
    const id_casa = req.auth.id;
    const segundoId = Number(id);

    const result = await inmueblesRepository.deleteInmueble(id_casa);
    if (segundoId !== id_casa) {
      throw error("Inmueble distinto");
    }
    res.send({ message: "El inmueble ha sido borrado" });
  } catch (err) {
    console.error("No tienes permiso para realizar esta acción");
    res.send({ error: err.message });
  }
}

module.exports = {
  getInmuebles,
  getInmuebleId,
  addInmueble,
  editInmueble,
  deleteInmueble,
};
