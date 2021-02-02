"use strict";

require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
//const morgan = require("morgan");

// Controller,
const {
  usersController,
  // reviewsController,
  inmueblesController,
  alquileresController,
  caserosController,
  contratosController,
  valoracionesController,
} = require("./controllers");
const validateAuth = require("./middlewares/validate-auth");

//variables
const { SERVER_PORT } = process.env;

//Declaramos app
const app = express();

//Middlewares
app.use(bodyParser.json());

// Rutas
app.get("/inmuebles", inmueblesController.getInmuebles);
app.get("/alquileres", alquileresController.getAlquileres);
app.get("/caseros", caserosController.getCaseros);
app.get("/contratos", contratosController.getContratos);
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
// app.get("/user-info", validateAuth, usersController.getUserInfo);

app.get("/users", validateAuth, usersController.getUsers);
app.post("/users/register", usersController.register);
app.post("/users/login", usersController.login);
//app.get("/users/:userId/reviews", validateAuth, usersController.getUserReviews);

// // Books
// app.get("/books", booksController.getBooks);
// app.post("/books", validateAuth, booksController.addBook);
// app.get("/books/:bookId/puntuacion", booksController.getBookRating);
// app.put("/books/:bookId", validateAuth, booksController.updateBook);

// Inmuebles
app.get("/inmuebles", inmueblesController.getInmuebles);
app.post("/inmuebles", validateAuth, inmueblesController.addInmueble);
/* app.get(
  "/inmuebles/:inmuebleId/puntuacion",
  inmueblesController.getPuntuacionInmuebles
); */
//app.put("/inmuebles", validateAuth, inmueblesController.updateInmuebles);

// // Reviews
// app.get("/reviews", validateAuth, reviewsController.getReviews);
// app.get("/reviews/:bookId", reviewsController.getBookReviews);
// app.post("/reviews/:bookId", validateAuth, reviewsController.createReview);
// app.delete("/reviews/:reviewId", validateAuth, reviewsController.deleteReview);

app.listen(SERVER_PORT, () => console.log(`Escuchando ${SERVER_PORT}`));
