import React, { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Link, useHistory } from "react-router-dom";
import fetchApi from "../api";

export const LoginForm = () => {
  const [, setAccessToken] = useLocalStorage("auth", "");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const login = async (e) => {
    e.preventDefault();
    try {
      const result = await fetchApi("usuarios/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      setAccessToken(result.token);
      history.push("/");
    } catch (error) {
      setAccessToken("");
    }
  };

  return (
    <form id={"login"} onSubmit={login}>
      <h2>Login</h2>
      <label htmlFor="email">Correo electrónico</label>
      <input
        type="text"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
      <button className="btn btn--primary">Entrar</button>
      <p>
        ¿No estás registrado?
        <Link to="/register">Regístrate</Link>
      </p>
    </form>
  );
};
