"use strict";

require("dotenv").config();

const express = require("express");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
//const morgan = require("morgan");

// Controller,
const {
  usersController,
  inmueblesController,
  alquileresController,
  caserosController,
  valoracionesController,
} = require("./controllers");
const validateAuth = require("./middlewares/validateAuth");

//variables
const { SERVER_PORT } = process.env;

//Declaramos app
const app = express();

//Middlewares
app.use(bodyParser.json());

// Body parser (multipart from data <- subida de imágenes)
app.use(fileUpload());

// Rutas
app.get("/inmuebles", inmueblesController.getInmuebles);
app.get("/alquileres", alquileresController.getAlquileres);
app.get("/caseros", caserosController.getCaseros);
app.get("/inquilinos", caserosController.getInquilinos);
/* app.get("/contratos", contratosController.getContratos);
 */
app.get("/users", usersController.getUsers);
app.get("/valoraciones", valoracionesController.getValoraciones);
/* app.post(
  "/inmuebles/:inmuebleId/alquilar",
  validateAuth,
  inmueblesController.alquilarInmuebles
); */
/* app.post(
  "/inmuebles/:inmuebleId/puntuacion",
  validateAuth,
  inmueblesController.puntuarInmuebles
); */

// RUTAS ADMIN (AQUI IRÍAN TODAS LAS RUTAS )

// Configuración de las rutas

// Users
app.get("/users/:id_user", usersController.getUserInfo);

app.get("/users", validateAuth, usersController.getUsers);
app.post("/users/register", usersController.register);
app.post("/users/login", usersController.login);
app.post("/users/editPassword", validateAuth, usersController.editPassword);
app.post("/users/editUser", validateAuth, usersController.editUser);
app.delete("/users/:id", validateAuth, usersController.deleteUser);
//app.get("/users/:userId/reviews", validateAuth, usersController.getUserReviews);

// Inmuebles
app.get("/inmuebles", inmueblesController.getInmuebles);
app.get("/inmuebles", inmueblesController.getInmuebleId);
app.post("/inmuebles", validateAuth, inmueblesController.addInmueble);
app.post("/inmuebles", validateAuth, inmueblesController.editInmueble);
//app.get("/inmuebles/:id_casa/valoracion", inmueblesController.getValoracion);
/* app.put(
  "/inmuebles/:id_casa",
  validateAuth,
  inmueblesController.updateInmuebles
); */
/* app.get(
  "/inmuebles/:inmuebleId/puntuacion",
  inmueblesController.getPuntuacionInmuebles
); */
//app.put("/inmuebles", validateAuth, inmueblesController.updateInmuebles);

app.listen(SERVER_PORT, () => console.log(`Escuchando ${SERVER_PORT}`));
