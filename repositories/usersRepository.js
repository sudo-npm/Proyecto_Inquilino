"use strict";

const { getConnection } = require("../infrastructure/database");

async function getUsers() {
  const connection = await getConnection();
  const query = "SELECT * FROM users";
  const [users] = await connection.query(query);

  return users;
}

async function getUserByEmail(email) {
  const connection = await getConnection();
  const query = "SELECT * FROM users WHERE email = ?";
  const [users] = await connection.query(query, email);

  return users[0];
}

async function getUserById(id_user) {
  const connection = await getConnection();
  const query = "SELECT * FROM users WHERE id_user = ?";
  const [users] = await connection.query(query, id_user);

  return users[0];
}

async function createUser(
  email,
  name,
  lastname,
  dni,
  phone,
  foto_user,
  password,
  biografia,
  role
) {
  const connection = await getConnection();

  const insertQuery =
    "INSERT INTO users (name, lastname, dni, email, phone, foto_user,  password, biografia, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const result = await connection.query(insertQuery, [
    email,
    name,
    lastname,
    dni,
    phone,
    foto_user,
    password,
    biografia,
    role,
  ]);
}

async function updateUser(
  email,
  name,
  lastname,
  dni,
  phone,
  foto,
  password,
  biografia,
  role,
  userId
) {
  const connection = await getConnection();
  const updateUser =
    "UPDATE `users` SET name = ?, lastName = ?, dni = ?, mail = ?, phone = ?, foto = ?,  password = ?, biografia = ?, role = ?, WHERE id_user = ?";
  await connection.query(updateUser, [
    name,
    lastname,
    dni,
    email,
    phone,
    foto,
    password,
    biografia,
    role,
    userId,
  ]);

  return true;
}

async function deleteUser(userId) {
  let connection;
  try {
    connection = await getConnection();

    // Compruebo que existe el usuario
    const [current] = await connection.query(
      `
      SELECT id_user
      FROM users
      WHERE id_user=?
    `,
      [userId]
    );

    if (current.length === 0) {
      const error = new Error(
        `No existe ningún usuario con id ${id} en la base de datos`
      );
      error.httpStatus = 404;
      throw error;
    }

    await connection.query(
      `
      DELETE FROM users
      WHERE id_user=?
    `,
      [userId]
    );

    const msg = "Usuario eliminado";
    return msg;
  } catch (error) {
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
