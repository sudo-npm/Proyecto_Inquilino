"use strict";

const jwt = require("jsonwebtoken");
const { JWT_SECRET } = process.env;

function validateAuth(req, res, next) {
  try {
    if (!req.headers.authorization || req.headers.authorization === "null") {
      throw new Error();
    }
    const token = req.headers.authorization;
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.auth = decodedToken;
    next();
  } catch (error) {
    error.message = "Error: Tienes que estar loggeado";
    console.log(error.message);
    res.status(401);
    res.redirect("http://localhost:8080/login");
  }
}

module.exports = validateAuth;
