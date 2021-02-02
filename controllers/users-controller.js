"use strict";

const bcrypt = require("bcryptjs");
const Joi = require("@hapi/joi");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const sengrid = require("@sendgrid/mail");
const { usersRepository } = require("../repositories");

async function getUsers(req, res) {
  try {
    if (!req.auth.role === "user") {
      throw new Error("No eres usuario");
    }
    const users = await usersRepository.getUsers();

    res.send(users);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function register(req, res) {
  try {
    const registerSchema = Joi.object({
      name: Joi.string().required(),
      lastname: Joi.string().required(),
      email: Joi.string().email().required(),
      phone: Joi.string().required(),
      foto: Joi.string().required().max(255),
      password: Joi.string().min(4).max(20).required(),
      repeatPassword: Joi.ref("password").required(),
      biografia: Joi.string().required().max(160),
      role: Joi.string().valid("casero", "inquilino").required(),
    });

    await registerSchema.validateAsync(req.body);

    const {
      name,
      lastname,
      email,
      phone,
      foto,
      password,
      biografia,
      role,
    } = req.body;

    const user = await usersRepository.getUserByEmail(email);
    console.log(name, email, password);
    if (user) {
      const error = new Error("Ya existe un usuario con este email");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = await usersRepository.createUser(
      email,
      name,
      lastname,
      phone,
      foto,
      password,
      biografia,
      role
    );
    //console.log("hola");
    console.log(process.env.SENDGRID_KEY);
    console.log(process.env.SENDGRID_MAIL_FROM);
    // - enviar un mail
    sengrid.setApiKey(process.env.SENDGRID_KEY);
    const data = {
      from: process.env.SENDGRID_MAIL_FROM,
      to: `${email}`,
      subject: "Hola!",
      text: `Hola ${name}.\n<strong>Bienvenido al Inquilino Perfecto.\nTu email es ${email}\n`,
      html: `<h1>Hola ${name}.</h1>\n<strong>Bienvenido al Inquilino Perfecto.</strong>\nTu email es ${email}\n`,
    };
    await sengrid.send(data);

    return res.send({ userId: id });
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
      password: Joi.string().min(4).max(20).required(),
    });
    await schema.validateAsync({ email, password });

    // 1. Recuperamos el usuario desde la base de datos.
    const user = await usersRepository.getUserByEmail(email);
    if (!user) {
      const error = new Error("No existe el usuario con ese email");
      error.code = 404;
      throw error;
    }
    // 2. Comprobamos que el password que nos están enviando es válido.
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      const error = new Error("El password no es válido");
      error.code = 401;
      throw error;
    }
    // generar el jwt
    /** 
    * DUDA!!!
    * const tokenPayload = { id: user.id, name: user.name, role: user.role };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });*/

    res.send(token);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function getUserInfo(req, res) {
  try {
    const userId = req.auth.id;
    const user = await usersRepository.getUserById(userId);

    res.send(user);
  } catch (err) {
    if (err.name === "ValidationError") {
      err.status = 400;
    }
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  getUsers,
  register,
  login,
  getUserInfo,
  /*  deleteUser,
  editPassword,
  editUser,
  validateUser, */
  //recuperarPassword((mandar un mail á dirección mail do usuario para rastrear o contrasinal))
  //resetPassword,(comprobar no req.body as password nova e vella)
};
