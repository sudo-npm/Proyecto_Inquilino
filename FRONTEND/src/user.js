import React, { Component } from "react";

class Usuario extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    console.log(this.props);
    return <div>Hola boddies ebrios</div>;
  }
}
export default Usuario;
