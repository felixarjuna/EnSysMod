import React, { useState } from "react";
import Logo from "../../assets/fhaachenlogo.png";
import { Link } from "react-router-dom";
import axios from "axios";
import SuccessPage from "./SuccessPage";
import { UserContext } from "../Context/UserContext";
import { useContext } from "react";

function Login() {
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);
  const { token, setToken } = useContext(UserContext);

  function handleChange(event) {
    const { name, value } = event.target;
    setUser((prevValue) => {
      return {
        ...prevValue,
        [name]: value,
      };
    });
  }

  function handleClick(event) {
    event.preventDefault();

    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const data = `username=${user.username}&password=${user.password}`;
    axios
      .post("https://ensysmod.herokuapp.com/auth/login", data, {
        headers,
      })
      .then((res) => {
        if (res.status === 200) {
          setSuccess(true);
          const newToken = res.data.access_token;
          console.log(newToken);
          setToken(newToken);
        }
      })
      .catch((err) => {
        if (err) {
          alert(err);
        }
      });
  }

  return (
    <>
      {success ? (
        <SuccessPage params={"login"} />
      ) : (
        <div className="text-center signup-container">
          <form action="" className="form-signin">
            <img className="mb-4" src={Logo} alt="" width="60" />
            <h1 className="h3 mb-3">Log In</h1>
            <input
              name="username"
              type="username"
              id="inputUsername"
              className="form-control top"
              placeholder="Username"
              value={user.username}
              onChange={handleChange}
              required
              autoFocus
            />
            <input
              name="password"
              type="password"
              id="inputPassword"
              className="form-control bottom"
              placeholder="Password"
              value={user.password}
              onChange={handleChange}
              required
            />
            <div className="checkbox mb-3">
              <label>
                <input type="checkbox" value="remember-me" /> Remember me
              </label>
            </div>
            <div className="submit-area">
              <button
                className="btn btn-primary"
                id="submit-btn"
                type="submit"
                onClick={handleClick}
              >
                Submit
              </button>
              <span className="spacy"> or </span>
              <span>
                <Link className="text-link-dark" to="/signup">
                  Sign Up
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

export default Login;
