import React from "react";
import Navbar from "./components/Navbar";
// import Footer from "./components/Footer";
import "./App.css";
import { AuthProvider } from "./components/providers/AuthProvider";
import Home from "./components/pages/Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Usuarios from "./components/pages/Usuarios";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/login" component={Login} />
          <Route path="/usuarios" component={Usuarios} />
          <Route path="/register" component={Register} />
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
