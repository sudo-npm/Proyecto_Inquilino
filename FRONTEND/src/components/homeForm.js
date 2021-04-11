import React, { useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import fetchApi from "../api";
import { useParams } from "react-router";

export const HomeForm = () => {
  const [, setAccessToken] = useLocalStorage("auth", "");

  const Inmuebles = async (e) => {
    e.preventDefault();
    try {
      let query;
      if (filter.ciudad) {
        query = query + addOptionalFilter("ciudad", "=", query);
        params.push(filter.ciudad);
      }
      if (filter.min_precio) {
        query = query + addOptionalFilter("precio", ">=", query);
        params.push(filter.min_precio);
      }
      if (filter.max_precio) {
        query = query + addOptionalFilter("precio", "<=", query);
        params.push(filter.max_precio);
      }
      if (filter.habitaciones) {
        query = query + addOptionalFilter("habitaciones", ">=", query);
        params.push(filter.habitaciones);
      }
      console.log("Query: " + query);
      const query = await fetchApi("usuarios/inmuebles", {
        method: "GET",
        query,
      });
      //setAccessToken(result.token);
    } catch (error) {
      setAccessToken("");
    }
  };

  return <form id={"inmuebles"} onSubmit={Inmuebles.query}></form>;
};
