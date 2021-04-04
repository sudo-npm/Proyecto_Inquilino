const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");
const { valoracionesController } = require("../controllers");

router.post("/", auth, valoracionesController.createValoracion);
router.get(
  "/:objeto",
  auth,
  valoracionesController.getPuntuacionAllUsuariosAsObjeto
);
router.get(
  "/:objeto/:id_receptor",
  auth,
  valoracionesController.getValoracionesUsuario
);

module.exports = router;
