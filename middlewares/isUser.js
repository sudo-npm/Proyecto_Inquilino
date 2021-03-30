const jsonwebtoken = require("jsonwebtoken");
const { getConnection } = require("../db");

async function isUser(req, res, next) {
  let connection;
  try {
    connection = await getConnection();

    // Extraemos o token dos headers da petición (req)
    const { authorization } = req.headers;

    if (!authorization) {
      const error = new Error("Falta la cabecera de autorización");
      error.httpStatus = 401;
      throw error;
    }

    // Comprobamos que o token é válido e decodificamos o contido
    let tokenInfo;
    try {
      tokenInfo = jsonwebtoken.verify(authorization, process.env.JWT_SECRET);
    } catch (error) {
      const tokenError = new Error("El token no es válido");
      tokenError.httpStatus = 401;
      throw tokenError;
    }

    const [result] = await connection.query(
      `
      SELECT lastAuthUpdate
      FROM users
      WHERE id_user=?
      `,
      [tokenInfo.id_user]
    );

    if (result.length === 0) {
      const error = new Error("El usuario no existe en la base de datos");
      error.httpStatus = 401;
      throw error;
    }

    const tokenCreatedAt = new Date(tokenInfo.iat * 1000);
    const lastAuthUpdate = new Date(result[0].lastAuthUpdate);

    console.log(tokenCreatedAt, lastAuthUpdate);

    if (tokenCreatedAt < lastAuthUpdate) {
      const error = new Error(
        "El token no es valido. Haz login para conseguir otro"
      );
      error.httpStatus = 401;
      throw error;
    }

    // Metemos o contido no obxeto da petición
    req.auth = tokenInfo;

    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
}

module.exports = isUser;
