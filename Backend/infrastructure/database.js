"use strict";

const mysql = require("mysql2/promise");
const { normalizePort } = require("../utils");

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_NAME,
  DATABASE_USER,
  DATABASE_PASSWORD,
} = process.env;

let pool;

async function getPoolConnections() {
  if (!pool) {
    pool = mysql.createPool({
      host: DATABASE_HOST,
      port: normalizePort(DATABASE_PORT),
      database: DATABASE_NAME,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

module.exports = { getPoolConnections };
