import React, { useState, useContext } from "react";
import axios from "axios";
import _ from "lodash";
import { UserContext } from "../Context/UserContext";
import ClipLoader from "react-spinners/ClipLoader";

function OptimizeModel() {
  const { token, modelID } = useContext(UserContext);
  const [optimizeText, setOptimizeText] = useState({
    model_id: modelID,
    output: "",
  });

  const [optimization, setOptimization] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setOptimizeText((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    const id = parseInt(optimizeText.model_id);
    const output = _.toLower(optimizeText.output);
    console.log(id, output);
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    axios
      .get(`https://ensysmod.herokuapp.com/models/${id}/optimize?output=${output}`, {
        headers,
      })
      .then((res) => {
        if (res.status === 200) {
          console.log(res);
          setOptimization(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setOptimization(false);
        const errMsg = err.response.data.detail;
        setErrorMsg(errMsg);
      });
  }

  return (
    <div className="sidebar-optimize">
      <form onSubmit={handleSubmit} className="sidebar-form">
        <div>
          <label htmlFor="">
            Model ID<span className="required"> *</span>
          </label>
        </div>
        <input
          type="text"
          name="model_id"
          autoComplete="off"
          onChange={handleChange}
          value={optimizeText.model_id}
          required
        />
        <div>
          <label htmlFor="">
            Output<span className="required"> *</span>
          </label>
        </div>
        <input
          type="text"
          name="output"
          onChange={handleChange}
          value={optimizeText.output}
          autoComplete="off"
          required
          placeholder="Excel or JSON"
        />
        <button className="btn-optimize button" type="submit">
          Optimize Model
        </button>
        {loading && (
          <ClipLoader
            className="loader"
            color="rgba(46, 177, 163, 1)"
            loading={loading}
            size={35}
          />
        )}
        {optimization ? (
          <p className="response-success">Optimization successfull!</p>
        ) : (
          <p className="response-failed">{errorMsg}</p>
        )}
      </form>
    </div>
  );
}

export default OptimizeModel;
