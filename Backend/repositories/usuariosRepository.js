"use strict";

const { getPoolConnections } = require("../infrastructure/database");

async function getUsuarios() {
  const pool = await getPoolConnections();
  const query =
    "SELECT nombre, apellidos, email, telefono, biografia FROM usuarios";
  const [usuarios] = await pool.query(query);

  return usuarios;
}

async function getUsuarioByEmail(email) {
  const pool = await getPoolConnections();
  const query = "SELECT * FROM usuarios WHERE email = ?";
  const [usuarios] = await pool.query(query, email);

  return usuarios[0];
}

async function getUsuarioById(id_usuario) {
  const pool = await getPoolConnections();
  const query = "SELECT * FROM usuarios WHERE id_usuario = ?";
  const [usuarios] = await pool.query(query, id_usuario);

  if (usuarios[0]) {
    const { password, ...usuario } = usuarios[0];
    return usuario;
  } else {
    return null;
  }
}

async function createUsuario(
  nombre,
  apellidos,
  dni,
  email,
  telefono,
  password,
  biografia,
  avatar
) {
  const pool = await getPoolConnections();

  const insertQuery =
    "INSERT INTO usuarios (nombre, apellidos, dni, email, telefono, password, biografia, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
  await pool.query(insertQuery, [
    nombre,
    apellidos,
    dni,
    email,
    telefono,
    password,
    biografia,
    avatar,
  ]);
}

async function updateUsuario(usuario) {
  const {
    id_usuario,
    nombre,
    apellidos,
    dni,
    email,
    telefono,
    password,
    biografia,
  } = usuario;
  const pool = await getPoolConnections();
  const updateUsuario =
    "UPDATE `usuarios` SET nombre = ?, apellidos = ?, dni = ?, email = ?, telefono = ?, foto = ?,  password = ?, biografia = ? WHERE id_usuario = ?";
  await pool.query(updateUsuario, [
    nombre,
    apellidos,
    dni,
    email,
    telefono,
    password,
    biografia,
    id_usuario,
  ]);
}

async function updatePassword(password, id_usuario) {
  const pool = await getPoolConnections();
  const updateQuery = "UPDATE `usuarios` SET password = ? WHERE id_usuario = ?";
  await pool.query(updateQuery, [password, id_usuario]);
}

async function deleteUsuario(id_usuario) {
  const pool = await getPoolConnections();
  // Compruebo que existe el usuario
  const [
    current,
  ] = await pool.query(
    "SELECT id_usuario FROM usuarios WHERE id_usuario = ? ",
    [id_usuario]
  );
  if (current.length === 0) {
    const error = new Error(
      `No existe ningún usuario con id ${id_usuario} en la base de datos`
    );
    error.httpStatus = 404;
    throw error;
  }
  await pool.query("DELETE FROM usuarios WHERE id_usuario = ?", [id_usuario]);
}

module.exports = {
  getUsuarios,
  getUsuarioByEmail,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  updatePassword,
  deleteUsuario,
};
