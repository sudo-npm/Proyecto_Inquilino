import React from "react";
import "../usuarios.css";
import UsuariosItem from "../usuario-items";

function Usuarios() {
  return (
    <div className="usuarios">
      <h1>CASEROS</h1>
      <div className="usuarios-container">
        <div className="usuarios-wrapper">
          <ul className="usuario-items">
            <UsuariosItem
              src="images/avatars/avatar1.png"
              text="Propietario de una pequeña pero novedosa app de alquileres"
              label="Pedro Temperán"
              path="/Usuarios"
            />
          </ul>
        </div>
      </div>
      <h1>INQUILINOS</h1>
      <div className="usuarios-container">
        <div className="usuarios-wrapper">
          <ul className="usuario-items">
            <UsuariosItem
              src="images/avatars/avatar2.png"
              text="Profesor de matemáticas de una academia de preparatoria universitaria"
              label="Wanza Kilulu"
              path="/Usuarios"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;
