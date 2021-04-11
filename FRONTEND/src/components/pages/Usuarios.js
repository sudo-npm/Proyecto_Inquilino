import React, { useState, useEffect, useContext } from "react";
import "../../App.css";
import { useAuth } from "../providers/AuthProvider";
import fetchApi from "../../api";

function Users() {
  const [setUsers] = useState();
  const { token } = useAuth();
  console.log("token:", token);
  async function getUsers() {
    try {
      const usuarios = await fetchApi("usuarios", {
        token,
      });
      setUsers(usuarios);
    } catch (error) {
      console.log("Error al obtener usuarios: ", error);
      setUsers([]);
    }
  }
  useEffect(() => {
    getUsers();
  });

  return (
    <div className="usuarios">
      <header className=""></header>
    </div>
  );
}

export default Users;
