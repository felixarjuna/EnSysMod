import React from "react";
import Logo from "../../assets/fhaachenlogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import SuccessPage from "./SuccessPage";

function Signup() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const token = "";

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    axios
      .post("https://ensysmod.herokuapp.com/auth/register", user, { headers })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
        }
      })
      .catch((err) => console.log(err));

    setUser({
      username: "",
      password: "",
    });
  }

  return (
    <>
      {success ? (
        <SuccessPage params={"signup"} />
      ) : (
        <div className="text-center signup-container">
          <form onSubmit={handleSubmit} className="form-signin">
            <img className="mb-4" src={Logo} alt="" width="60" />
            <h1 className="h3 mb-3">Sign Up</h1>
            <input
              name="username"
              type="username"
              id="inputUsername"
              className="form-control top"
              placeholder="Username"
              onChange={handleChange}
              value={user.username}
              required
              autoFocus
            />
            <input
              name="password"
              type="password"
              id="inputPassword"
              className="form-control bottom"
              placeholder="Password"
              required
              onChange={handleChange}
              value={user.password}
            />
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <div className="submit-area">
              <button className="btn btn-primary" id="submit-btn" type="submit">
                Submit
              </button>
              <span className="spacy"> or </span>
              <span>
                <Link className="text-link-dark" to="/login">
                  Log In
                </Link>
              </span>
            </div>
            <p className="mt-5 mb-3 text-muted">&copy;2022 Nowum Institut</p>
          </form>
        </div>
      )}
    </>
  );
}

export default Signup;
