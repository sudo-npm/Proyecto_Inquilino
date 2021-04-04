"use strict";

const bcrypt = require("bcryptjs");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { usuariosRepository, resetRepository } = require("../repositories");
const { sendEmail } = require("../utils");

async function createUsuario(req, res) {
  try {
    const usuarioSchema = Joi.object({
      nombre: Joi.string().max(60),
      apellidos: Joi.string().max(120),
      dni: Joi.string().max(9),
      email: Joi.string().email().max(60),
      telefono: Joi.string().max(9),
      password: Joi.string().max(255),
      repeatPassword: Joi.ref("password"),
      biografia: Joi.string().max(255),
    });
    console.log(`Body: ${JSON.stringify(req.body)}`);
    await usuarioSchema.validateAsync(req.body);
    const {
      nombre,
      apellidos,
      dni,
      email,
      telefono,
      password,
      biografia,
    } = req.body;

    const usuario = await usuariosRepository.getUsuarioByEmail(email);
    if (usuario) {
      const error = new Error("Ya existe un usuario con este email");
      error.status = 409;
      throw error;
    }

    let avatar;
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar;
      avatar = `/img/${email}_${avatarFile.name}`;
      avatarFile.mv(`.${avatar}`);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await usuariosRepository.createUsuario(
      nombre,
      apellidos,
      dni,
      email,
      telefono,
      passwordHash,
      biografia,
      avatar
    );

    await sendEmail(
      email,
      "Bienvenido",
      "Te damos la bienvenida al Inquilino Perfecto"
    );

    res.status(201);
    res.send({ message: "Bienvenido al Inquilino Perfecto" });
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string(),
    });
    await schema.validateAsync(req.body);
    // Recuperamos el usuario desde la base de datos.
    const usuario = await usuariosRepository.getUsuarioByEmail(email);
    if (!usuario) {
      const error = new Error("Usuario o password incorrecto");
      error.code = 401;
      throw error;
    }
    // Comprobamos que el password es válido.
    const validPassword = await bcrypt.compare(password, usuario.password);
    console.log(validPassword);

    if (!validPassword) {
      const error = new Error("Usuario o password incorrecto");
      error.code = 401;
      throw error;
    }
    // generar el jwt
    const tokenUser = {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
    };
    const encodedToken = jwt.sign(tokenUser, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res.send({ token: encodedToken });
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getUsuarios(req, res) {
  try {
    const usuarios = await usuariosRepository.getUsuarios();

    res.send(usuarios);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getUsuarioInfo(req, res) {
  try {
    const id_usuario = req.auth.id_usuario;
    const usuario = await usuariosRepository.getUsuarioById(id_usuario);
    if (usuario) {
      res.send(usuario);
    } else {
      res.status(404);
      res.send({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function deleteUsuario(req, res) {
  try {
    const id_usuario = req.auth.id_usuario;
    await usuariosRepository.deleteUsuario(id_usuario);
    res.status(204);
    res.send();
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function resetPasswordToken(req, res) {
  try {
    const { email } = req.params;
    const usuario = await usuariosRepository.getUsuarioByEmail(email);
    const id_usuario = usuario.id_usuario;
    const resetToken = crypto.randomBytes(32).toString("hex");
    await resetRepository.deleteTokenByUsuario(id_usuario);
    const valido_hasta = new Date(Date.now() + 600000); // Válido durante 10 minutos
    await resetRepository.createToken(resetToken, id_usuario, valido_hasta);
    await sendEmail(
      usuario.email,
      "Reset password",
      `Por favor, utiliza el siguiente enlace para generar un nuevo password:

      <a href="https://elinquilinoperfecto/reset-password?token=${resetToken}&id_usuario=${id_usuario}">Reset password</a>

      ¡Saludos!
      `
    );
    res.status(204);
    res.send();
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, id_usuario } = req.params;
    const usuarioPasswordSchema = Joi.object({
      password: Joi.string().max(255),
      repeatPassword: Joi.ref("password"),
    });
    await usuarioPasswordSchema.validateAsync(req.body);
    const reset_token = await resetRepository.getTokenByUsuario(id_usuario);
    console.log(`Token: ${token}`);
    console.log(`Reset token: ${reset_token}`);
    if (reset_token && reset_token === token) {
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      await usuariosRepository.updatePassword(passwordHash, id_usuario);
      await resetRepository.deleteTokenByUsuario(id_usuario);
    } else {
      throw {
        status: 403,
        message: "No tienes permiso para realizar esta operación",
      };
    }
    res.status(204);
    res.send();
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  createUsuario,
  getUsuarios,
  login,
  getUsuarioInfo,
  deleteUsuario,
  resetPasswordToken,
  resetPassword,
};
