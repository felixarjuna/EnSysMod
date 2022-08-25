import React from "react";
import { Link } from "react-router-dom";

function SuccessPage(props) {
  return (
    <div className="success-page">
      <h1>
        Congrats! 🎉 <br></br>
        {props.params === "login" ? "Login" : "Signup"} successful
      </h1>
      <br />
      <p>
        <Link className="text-link-dark" to="/webapp">
          Home
        </Link>
      </p>
    </div>
  );
}

export default SuccessPage;
