"use strict";

const jwt = require("jsonwebtoken");
const { usuariosRepository } = require("../repositories");
const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
  try {
    if (!req.headers.authorization || req.headers.authorization === "null") {
      throw new Error();
    }
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const usuario = await usuariosRepository.getUsuarioById(
      decodedToken.id_usuario
    );
    console.log("Usuario: " + JSON.stringify(usuario));
    if (usuario) {
      req.auth = decodedToken;
      next();
    } else {
      throw new Error();
    }
  } catch (error) {
    res.status(401);
    res.send({ error: "Debes ser un usuario registrado de la aplicación" });
  }
}

module.exports = auth;
