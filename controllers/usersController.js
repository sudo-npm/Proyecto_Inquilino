"use strict";

const bcrypt = require("bcryptjs");
const Joi = require("joi");
const mailgun = require("mailgun-js");
const { MAILGUN_KEY, MAILGUN_DOMAIN } = process.env;
const jwt = require("jsonwebtoken");
const { usersRepository } = require("../repositories");

async function getUsers(req, res) {
  try {
    if (!req.auth.role === "id_user") {
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
      name: Joi.string(),
      lastname: Joi.string(),
      dni: Joi.string().max(20),
      email: Joi.string().email(),
      phone: Joi.string(),
      foto_user: Joi.string().max(255),
      password: Joi.string().min(4).max(20),
      repeatPassword: Joi.ref("password"),
      biografia: Joi.string().max(160),
    });

    await registerSchema.validateAsync(req.body);
    //console.log(req.body);
    const {
      name,
      lastname,
      dni,
      email,
      phone,
      foto_user,
      password,
      biografia,
      role,
    } = req.body;

    const user = await usersRepository.getUserByEmail(email);
    //console.log(name, email, password);
    if (user) {
      const error = new Error("Ya existe un usuario con este email");
      error.status = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await usersRepository.createUser(
      name,
      lastname,
      dni,
      email,
      phone,
      foto_user,
      passwordHash,
      biografia,
      role
    );

    const mg = mailgun({
      apiKey: MAILGUN_KEY,
      domain: MAILGUN_DOMAIN,
    });

    const message = {
      from: "sender@gmail.com",
      to: email,
      subject: "Bienvenido",
      text: "Te damos la bienvenida al Inquilino Perfecto",
    };

    await mg.messages().send(message);

    return res.send({ message: "Bienvenido al Inquilino Perfecto" });
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
    const user = await usersRepository.getUserByEmail(email);
    //console.log(user);
    if (!user) {
      const error = new Error("No existe el usuario con ese email");
      error.code = 404;
      throw error;
    }
    // Comprobamos que el password es válido.
    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);

    if (!validPassword) {
      const error = new Error("El password no es válido");
      error.code = 401;
      throw error;
    }
    // generar el jwt
    const tokenUser = {
      id: user.id_user,
      nombre: user.name,
      role: user.role,
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

async function getUserInfo(req, res) {
  try {
    const userId = req.params["id_user"];
    const user = await usersRepository.getUserById(userId);
    if (user) {
      res.send(user);
    } else {
      res.status(404);
      res.send({ error: "Usuario no encontrado" });
    }
  } catch (err) {
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const userId = req.auth.id;
    const segundoId = Number(id);

    const result = await usersRepository.deleteUser(userId);
    if (segundoId !== userId) {
      throw error("Usuario distinto");
    }
    res.send({ message: "El usuario ha sido borrado" });
  } catch (err) {
    console.error("No tienes permiso para realizar esta acción");
    res.send({ error: err.message });
  }
}

async function editPassword(req, res, next) {
  let connection;

  try {
    connection = await getConnection();
    // validamos la password anterior y la nueva
    await editUserPasswordSchema.validateAsync(req.body);

    const { id_user } = req.params;
    const { oldPassword, newPassword } = req.body;
    // Comprobamos que el usuario que hace la peticion es el que quiere cambiar la contraseña
    console.log(req.auth.id, id_user);
    if (req.auth.id !== Number(id_user)) {
      throw generateError("No puedes cambiar la password de otro usuario");
    }

    // Comprobamos que la contraseña nueva y la antigüa no sean iguales

    const [currentUser] = await connection.query(
      `
          SELECT id_user
          FROM users
          WHERE id_user=? AND password= SHA2(?,512)
          `,
      [id_user, oldPassword]
    );

    if (currentUser.length === 0) {
      const error = new Error("La password antigua no es correcta.");
      error.httpStatus = 401;
      throw error;
    }
    // Gardamos la password en la base de datos
    await connection.query(
      `
          UPDATE users
          SET password=SHA2(?,512),
          lastUpdate=UTC_TIMESTAMP,lastAuthUpdate=UTC_TIMESTAMP
          WHERE id_user=?
          `,
      [newPassword, id_user]
    );

    res.send({
      status: "Okey",
      message: "La password ha sido actualizada correctamente.",
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

async function editUser(req, res, next) {
  let connection;

  try {
    connection = await getConnection();

    await editEntrySchema.validateAsync(req.body);

    // Sacamos los datos

    const {
      name,
      lastname,
      dni,
      email,
      phone,
      foto,
      password,
      biografia,
      role,
    } = req.body;

    const { id } = req.params;

    // Seleccionar los datos actuales de la entrada
    const [current] = await connection.query(
      `
      SELECT name,lastname, dni, email, phone, foto, password, biografia, role, 
      lastUpdate
      FROM users
        WHERE id_user=?`,
      [id]
    );
    const [currentEntry] = current;

    if (currentEntry.id_user !== req.auth.id && req.auth.role !== "user") {
      throw generateError("No tienes persmisos para editar esta entrada", 403);
    }

    // Ejecutamos la query de edición de la entrada

    await connection.query(
      `
        UPDATE users SET 
        name=?,
        lastname=?,
        dni=?,
        email=?,
        phone=?,
        foto=?,
        password=?,
        biografia=?,
        role=?
      
    WHERE id_user=?
          `,
      [name, lastname, dni, email, phone, foto, password, biografia, role]
    );

    // Devolver resultados

    res.send({
      status: "ok",
      data: {
        name,
        lastname,
        dni,
        email,
        phone,
        foto,
        password,
        biografia,
        role,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

async function validateUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();
    const { code } = req.params;

    const [result] = await connection.query(
      `
      SELECT email
      FROM users
      WHERE registrationCode=?
    `,
      [code]
    );

    if (result.length === 0) {
      const error = new Error(
        "No hay ningún usuario pendiente de validación con ese código"
      );
      error.httpStatus = 404;
      throw error;
    }

    // Actualizar la tabla de usuarios marcando como activo el usuario que tenga el código de registro recibido

    await connection.query(
      `
      UPDATE users
      SET active=true, registrationCode=NULL
      WHERE registrationCode=?
    `,
      [code]
    );

    res.send({
      status: "Okey",
      message: `Ya puedes hacer login con tu email: ${result[0].email} y tu contraseña`,
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  getUsers,
  register,
  login,
  getUserInfo,
  deleteUser,
  editPassword,
  editUser,
  validateUser,
  //recuperarPassword((mandar un mail á dirección mail do usuario para rastrear o contrasinal))
};
