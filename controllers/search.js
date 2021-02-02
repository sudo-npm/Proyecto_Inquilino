const { getPool } = require("./database");

async function search(req, res, next) {
  let connection;
  try {
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}
