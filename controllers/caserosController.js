"use strict";

const { caserosRepository } = require("../repositories");

// Listar todos los caseros

async function getCaseros(req, res) {
  try {
    const caseros = await caserosRepository.getAllCaseros();

    res.send({
      caseros: caseros,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  getCaseros,
};
