"use strict";

const { contratosRepository } = require("../repositories");

// Listar todos los contratos

async function getContratos(req, res) {
  try {
    const contratos = await contratosRepository.getAllContratos();

    res.send({
      contratos: contratos,
    });
  } catch (err) {
    console.log(err);
    res.status(err.status || 500);
    res.send({ error: err.message });
  }
}

module.exports = {
  getContratos,
};
