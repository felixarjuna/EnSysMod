import React, { useContext } from "react";
import { useState } from "react";
import axios from "axios";
import { UserContext } from "../Context/UserContext";
import ClipLoader from "react-spinners/ClipLoader";
import _ from "lodash";

function Dataset() {
  const { token, setDatasetID } = useContext(UserContext);

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [dataset, setDataset] = useState({
    name: "",
    description: "",
    hours_per_time_step: "1",
    number_of_time_step: "8760",
    cost_unit: "€",
    length_unit: "km",
    ref_created_by: 0,
  });

  const [fileUpload, setFileUpload] = useState(false);
  const [file, setFile] = useState();

  function handleChange(event) {
    const { name, value } = event.target;
    setDataset((prevValue) => {
      return { ...prevValue, [name]: value };
    });
  }

  function handleFile(event) {
    const newFile = event.target.files[0];
    setFile(newFile);
  }

  const [loading, setLoading] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    axios
      .post("https://ensysmod.herokuapp.com/datasets/", dataset, { headers })
      .then((res) => {
        if (res.status === 200) {
          const dataset_id = res.data.id;
          setDatasetID(dataset_id);

          // Check if any file uploaded
          if (file === undefined) {
            setSuccess(true);
            setLoading(false);
          } else {
            // Define specific header
            const headers = {
              Authorization: `Bearer ${token}`,
              "Content-Type": file?.type,
            };
            const formData = new FormData();
            formData.append("file", file);

            axios
              .post(
                `https://ensysmod.herokuapp.com/datasets/${dataset_id}/upload`,
                formData,
                {
                  headers,
                }
              )
              .then((res) => {
                if (res.status === 200) {
                  setFileUpload(true);
                  setSuccess(true);
                  setLoading(false);
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
              });
          }
        }
      })
      .catch((err) => {
        setSuccess(false);
        setLoading(false);
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
      });

    setDataset({
      name: "",
      description: "",
      hours_per_time_step: "1",
      number_of_time_step: "8760",
      cost_unit: "€",
      length_unit: "km",
      ref_created_by: 0,
    });
  }

  return (
    <form className="sidebar-form" onSubmit={handleSubmit}>
      <label htmlFor="name">
        <div>
          Name<span className="required"> *</span>
        </div>
        <input
          name="name"
          onChange={handleChange}
          value={dataset.name}
          type="text"
          autoComplete="off"
        />
      </label>
      <label htmlFor="description">
        Description
        <input
          name="description"
          onChange={handleChange}
          value={dataset.description}
          type="text"
          autoComplete="off"
        />
      </label>
      <label htmlFor="hours_per_time_step">
        <div>
          Hours per time step<span className="required"> *</span>
        </div>
        <input
          name="hours_per_time_step"
          onChange={handleChange}
          type="text"
          value={dataset.hours_per_time_step}
        />
      </label>
      <label htmlFor="number_of_time_step">
        <div>
          Number of time step<span className="required"> *</span>
        </div>
        <input
          name="number_of_time_step"
          onChange={handleChange}
          type="text"
          value={dataset.number_of_time_step}
        />
      </label>
      <label htmlFor="">
        <div>
          Cost unit<span className="required"> *</span>
        </div>
        <input
          name="cost_unit"
          onChange={handleChange}
          value={dataset.cost_unit}
          type="text"
        />
      </label>
      <label htmlFor="length_unit">
        <div>
          Length unit<span className="required"> *</span>
        </div>
        <input
          name="length_unit"
          onChange={handleChange}
          value={dataset.length_unit}
          type="text"
        />
      </label>
      <label htmlFor="">
        Upload Zip Archive
        <input name="upload" onChange={handleFile} type="file" />
      </label>
      {fileUpload ? (
        <p className="response-success">Upload dataset succesfull!</p>
      ) : (
        ""
      )}
      <button className="button btn-optimize" type="submit">
        +
      </button>
      {loading && (
        <ClipLoader
          className="loader"
          color="rgba(46, 177, 163, 1)"
          loading={loading}
          size={35}
        />
      )}
      {success ? (
        <p className="response-success">Dataset successfully created!</p>
      ) : (
        <p className="response-failed">{errorMsg}</p>
      )}
    </form>
  );
}

export default Dataset;
