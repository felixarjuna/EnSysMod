import React from "react";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header>
      <div className="logo">
        <h2>EnSysMod</h2>
      </div>
      <div className="login">
        <Link className="text-link" to="/signup">
          Sign Up
        </Link>
        <Link className="text-link" to="/login">
          Log in
        </Link>
      </div>
    </header>
  );
}

export default Header;
