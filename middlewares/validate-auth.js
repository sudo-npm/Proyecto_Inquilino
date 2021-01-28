"use strict";

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function validateAuth(req, res, next) {
  try {
    const token = req.headers.authorization;
    jwt.verify(token, JWT_SECRET);
    console.log(token);
    //???const { id, name, mail } = decodedToken;
    //???req.auth = { id, name, mail };
    next();
  } catch (error) {
    console.log(error.message);
    error.message = "Error 401: Tienes que estar loggeado";
    res.status(401);
    res.redirect("http://localhost:8080/login");
  }
}

module.exports = validateAuth;
