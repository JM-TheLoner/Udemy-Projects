import React from "react";
import Input from "./Input";

function Form(props) {
  const registered = props.check;

  return (
    <form className="form">
      <Input type="text" placeholder="Username" />
      <Input type="password" placeholder="Password" />
      {!registered && <Input type="password" placeholder="Confirm Password" />}
      <button type="submit">{registered ? "Login" : "Register"}</button>
    </form>
  );
}

export default Form;
