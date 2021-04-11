import React, { useState } from "react";
import fetchApi from "../api";
import { useHistory } from "react-router-dom";

export const RegisterForm = (props) => {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [dni, setDni] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [biografia, setBiografia] = useState("");
  const [avatar, setAvatar] = useState("");
  const history = useHistory();

  const register = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("nombre", nombre);
      formData.append("apellidos", apellidos);
      formData.append("dni", dni);
      formData.append("email", email);
      formData.append("telefono", telefono);
      formData.append("password", password);
      formData.append("repeatPassword", repeatPassword);
      formData.append("biografia", biografia);
      formData.append("avatar", avatar);
      await fetchApi("usuarios/register", {
        method: "POST",
        body: formData,
        isFormData: true,
      });
      history.push("/login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form id={"register"} onSubmit={register}>
      <h2>Registro</h2>
      <label htmlFor="nombre">Nombre</label>
      <input
        type="text"
        name="nombre"
        id="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <label htmlFor="apellidos">Apellidos</label>
      <input
        type="text"
        name="apellidos"
        id="apellidos"
        value={apellidos}
        onChange={(e) => setApellidos(e.target.value)}
        required
      />
      <label htmlFor="dni">D.N.I.</label>
      <input
        type="dni"
        name="dni"
        id="dni"
        value={dni}
        onChange={(e) => setDni(e.target.value)}
        required
      />
      <label htmlFor="email">Correo electrónico</label>
      <input
        type="text"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <label htmlFor="telefono">Teléfono</label>
      <input
        type="telefono"
        name="telefono"
        id="telefono"
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        required
      />
      <label htmlFor="password">Contraseña</label>
      <input
        type="password"
        name="email"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <label htmlFor="repeatPassword">Repite la contraseña</label>
      <input
        type="password"
        name="repeatPassword"
        id="repeatPassword"
        value={repeatPassword}
        onChange={(e) => setRepeatPassword(e.target.value)}
        required
      />
      <label htmlFor="biografia">Biografía</label>
      <input
        type="biografia"
        name="biografia"
        id="biografia"
        value={biografia}
        onChange={(e) => setBiografia(e.target.value)}
        required
      />
      <label htmlFor="avatar">Avatar</label>
      <input
        type="file"
        name="avatar"
        id="avatar"
        onChange={(e) => setAvatar(e.target.files[0])}
        required
      />

      <button className="btn btn--primary">Registrar</button>
    </form>
  );
};
