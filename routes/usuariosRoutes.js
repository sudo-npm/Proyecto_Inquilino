const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");
const { usuariosController } = require("../controllers");

router.post("/register", usuariosController.createUsuario);
router.post("/login", usuariosController.login);
router.get("/", auth, usuariosController.getUsuarios);
router.get("/me", auth, usuariosController.getUsuarioInfo);
router.delete("/", auth, usuariosController.deleteUsuario);
router.get("/reset-password/:email", usuariosController.resetPasswordToken);
router.patch(
  "/reset-password/:token/:id_usuario",
  usuariosController.resetPassword
);

module.exports = router;
