import React from "react";
import "../../App.css";
import Inmuebles from "./Inmuebles";
import Usuarios from "./Usuarios";
import MainSection from "../main";

function Home() {
  return (
    <>
      <MainSection />
      <Inmuebles />
      <Usuarios />
    </>
  );
}

export default Home;
