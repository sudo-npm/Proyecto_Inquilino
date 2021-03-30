const { getInmuebleLocalidad } = require("../repositories/search-repository");
const connection = await database.getConnection();
let connection;

async function searchByLocalidad(req, res, next) {
  try {
    const { name } = req.body;
    const localidad = await getInmuebleLocalidad(name);
    res.send(localidad);
  } catch (error) {
    next(error);
  }
}

async function searchByPrice(req, res, next) {
  try {
    const { name } = req.body;
    const precio = await getInmuebleprecio:(name);
    res.send(precio);
  } catch (error) {
    next(error);
  }
}

async function searchByDireccion(req, res, next) {
  try {
    const { name } = req.body;
    const direccion = await getInmuebledireccion(name);
    res.send(direccion);
  } catch (error) {
    next(error);
  }
}

async function search(req, res, next) {
  try {
    const { name } = req.body;
    const fecha_inicio = await getInmuebleFechaInicio(name);
    res.send(fecha_inicio);
  } catch (error) {
    next(error);
  }
}

async function searchCasaByFecha(req, res, next) {
  try {
    const { casa } = req.body;
    const fecha_fin = await getInmuebleFechaFin:fecha_fin(casa);
    res.send(casa);
  } catch (error) {
    next(error);
  }
}

async function searchCasaByCasero(req, res, next) {
  try {
    const { id_casa } = req.body;
    const userIdCasero = await getInmueble:id_casero(id_casa);
    res.send(id_casa);
  } catch (error) {
    next(error);
  }
}
/* 
async function search(req, res, next) {
  try {
    const { id_casa } = req.body;
    const id_casa = await getInmueble:id_casa(id_casa);
    res.send(id_casa);
  } catch (error) {
    next(error);
  }
} */

async function searchCasaByNumHabitaciones(req, res, next) {
  try {
    const { id_casa } = req.body;
    const id_casa = await getInmuebleByNumHabitaciones:habitaciones(id_casa);
    res.send(id_casa);
  } catch (error) {
    next(error);
  }
}

async function searchCasaByCP(req, res, next) {
  try {
    const { id_casa } = req.body;
    const codigoPostal = await getInmuebleByCodigoPostal:cp(id_casa);
    res.send(id_casa);
  } catch (error) {
    next(error);
  }
}
