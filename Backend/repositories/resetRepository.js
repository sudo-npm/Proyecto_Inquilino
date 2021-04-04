"use strict";

const { getPoolConnections } = require("../infrastructure/database");

async function createToken(token, id_usuario, valido_hasta) {
  const pool = await getPoolConnections();
  const insertQuery =
    "INSERT INTO reset (token, id_usuario, valido_hasta) VALUES (?, ?, ?)";
  await pool.query(insertQuery, [token, id_usuario, valido_hasta]);
}

async function getTokenByUsuario(id_usuario) {
  const pool = await getPoolConnections();
  const query =
    "SELECT * FROM reset WHERE id_usuario = ? AND valido_hasta >= now()";
  const [reset_info] = await pool.query(query, [id_usuario]);
  return reset_info && reset_info[0] && reset_info[0].token
    ? reset_info[0].token
    : null;
}

async function deleteTokenByUsuario(id_usuario) {
  const pool = await getPoolConnections();
  await pool.query("DELETE FROM reset WHERE id_usuario = ?", [id_usuario]);
}

module.exports = {
  createToken,
  getTokenByUsuario,
  deleteTokenByUsuario,
};
