"use strict";

const database = require("../infrastructure/database");

async function getUsers() {
  const pool = await database.getPool();
  const query = "SELECT * FROM users";
  const [users] = await pool.query(query);

  return users;
}

async function getUserByEmail(email) {
  const pool = await database.getPool();
  const query = "SELECT * FROM users WHERE email = ?";
  const [users] = await pool.query(query, email);

  return users[0];
}

async function getUserById(id) {
  const pool = await database.getPool();
  const query = "SELECT * FROM users WHERE id = ?";
  const [users] = await pool.query(query, id);

  return users[0];
}

async function createUser(
  email,
  name,
  lastname,
  phone,
  foto,
  password,
  biografia,
  role
) {
  const pool = await database.getPool();
  const insertQuery =
    "INSERT INTO users (email, name, lastname, phone, foto,  password, biografia, role) VALUES (?, ?, ?, ?)";
  const [created] = await pool.query(insertQuery, [
    email,
    name,
    lastname,
    phone,
    foto,
    password,
    biografia,
    role,
  ]);

  return created.insertId;
}

async function updateUser(
  email,
  name,
  lastname,
  phone,
  foto,
  password,
  biografia,
  role,
  userId
) {
  const pool = await database.getPool();
  const updateUser =
    "UPDATE `users` SET mail = ?, name = ?, lastName = ?, phone = ?, foto = ?,  password = ?, biografia = ?, role = ?, WHERE id_usuario = ?";
  await pool.query(updateUser, [
    email,
    name,
    lastname,
    phone,
    foto,
    password,
    biografia,
    role,
    userId,
  ]);

  return true;
}

module.exports = {
  getUsers,
  getUserByEmail,
  getUserById,
  createUser,
  updateUser,
};
