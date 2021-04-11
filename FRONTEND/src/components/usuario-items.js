import React from "react";
import { Link } from "react-router-dom";

function UsuariosItem(props) {
  return (
    <li className="usuarios-perfil">
      <Link className="usuarios-perfil-link" to={props.path}>
        <figure
          className="usuarios-perfil-pic-wrap"
          data-category={props.label}
        >
          <img
            className="usuarios-item-img"
            alt="Imagen de perfil"
            src={props.src}
          />
        </figure>
        <div className="usuarios-item-info">
          <h4 className="usuarios-item-text">{props.text}</h4>
        </div>
      </Link>
    </li>
  );
}

export default UsuariosItem;
