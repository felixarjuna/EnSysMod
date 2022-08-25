import axios from "axios";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { UserContext } from "../Context/UserContext";
import _ from "lodash";

function Model() {
  const { token, datasetID, setModelID } = useContext(UserContext);

  const [model, setModel] = useState({
    name: "",
    description: "",
    ref_dataset: "",
    parameters: [],
  });

  const [createModel, setCreateModel] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setModel((prevValue) => {
      return { ...prevValue, ref_dataset: datasetID };
    });
  }, [datasetID]);

  function handleChange(event) {
    const { name, value } = event.target;
    setModel((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  function handleSubmit(event) {
    event.preventDefault();

    axios
      .post("https://ensysmod.herokuapp.com/models/", model, { headers })
      .then((res) => {
        if (res.status === 200) {
          setModelID(res.data.id);
          setCreateModel(true);
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          console.log(err);
          const errMsg = _.capitalize(
            JSON.parse(err.request.responseText).detail[0].msg
          );
          setErrorMsg(errMsg);
        }
        if (err.response.status === 409) {
          const errMsg = err.response.data.detail;
          setErrorMsg(errMsg);
        }
        if (err.response.status === 403) {
          console.log(err);
          const errMsg =
            err.response.data.detail + "\nPlease sign up or log in";
          setErrorMsg(errMsg);
        }
        setCreateModel(false);
      });
  }

  return (
    <form className="sidebar-form" onSubmit={handleSubmit}>
      <label htmlFor="">
        <div>
          Name<span className="required"> *</span>
        </div>
        <input
          name="name"
          onChange={handleChange}
          value={model.name}
          type="text"
          autoComplete="off"
        />
      </label>
      <label htmlFor="">
        Description
        <input
          name="description"
          onChange={handleChange}
          value={model.description}
          type="text"
          autoComplete="off"
        />
      </label>
      <label htmlFor="">
        <div>
          Dataset reference id<span className="required"> *</span>
        </div>
        <input
          name="ref_dataset"
          value={model.ref_dataset}
          type="text"
          autoComplete="off"
        />
      </label>
      <button className="button btn-optimize">+</button>
      {createModel ? (
        <p className="response-success">Model successfully created!</p>
      ) : (
        <p className="response-failed">{errorMsg}</p>
      )}
    </form>
  );
}

export default Model;
