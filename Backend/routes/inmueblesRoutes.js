const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares");
const { inmueblesController } = require("../controllers");

router.post("/", auth, inmueblesController.createInmueble);
router.get("/", auth, inmueblesController.getInmuebles);
router.get("/:id_inmueble", auth, inmueblesController.getInmueble);
router.put("/:id_inmueble", auth, inmueblesController.editInmueble);
router.delete("/:id_inmueble", auth, inmueblesController.deleteInmueble);
router.patch("/:id_inmueble/offer", auth, inmueblesController.setOfferInmueble);
router.patch(
  "/:id_inmueble/accept",
  auth,
  inmueblesController.acceptOfferInmueble
);
router.patch(
  "/:id_inmueble/reject",
  auth,
  inmueblesController.rejectOfferInmueble
);

module.exports = router;
