"use strict";

require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");

const usuariosRouter = require("./routes/usuariosRoutes");
const inmueblesRouter = require("./routes/inmueblesRoutes");
const valoracionesRouter = require("./routes/valoracionesRoutes");

// Declaramos app
const app = express();

// Middlewares
app.use(express.json());
// multipart from data <- subida de imágenes
app.use(fileUpload());

app.use("/usuarios", usuariosRouter);
app.use("/inmuebles", inmueblesRouter);
app.use("/valoraciones", valoracionesRouter);

app.use("/img", express.static("img"));

app.use(function (req, res) {
  res.status(404);
  res.send({ error: "Recurso no encontrado" });
});

module.exports = app;
