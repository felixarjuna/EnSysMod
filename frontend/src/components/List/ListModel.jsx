import React from "react";
import axios from "axios";
import { useEffect, useContext } from "react";
import { UserContext } from "../Context/UserContext";
import { useState } from "react";
import Collapsible from "react-collapsible";

function ModelItem(props) {
  const triggerStyle = {
    fontSize: "1.0rem",
    display: "flex",
  };
  return (
    <Collapsible trigger={props.name} triggerStyle={triggerStyle}>
      <div className="list-item">
        Name: {props.name}
        <br></br>ID: {props.id}
      </div>
    </Collapsible>
  );
}

function ListModel() {
  const { token, modelID } = useContext(UserContext);
  const [models, setModels] = useState([]);

  useEffect(() => {
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    function getModel() {
      axios
        .get("https://ensysmod.herokuapp.com/models/", { headers })
        .then((res) => {
          setModels(() => {
            return [res.data];
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }

    getModel();
  }, [modelID, token]);

  return (
    <div className="sidebar-list">
      <Collapsible trigger="Models">
        <ul>
          {models[0]?.map((data) => (
            <ModelItem name={data.name} id={data.id} key={data.id} />
          ))}
        </ul>
      </Collapsible>
    </div>
  );
}

export default ListModel;
