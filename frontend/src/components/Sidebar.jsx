import React from "react";
import Dataset from "./Form/Dataset";
import Model from "./Form/Model";
import OptimizeModel from "./Form/OptimizeModel";
import ListDataset from "./List/ListDataset";
import ListModel from "./List/ListModel";

function Sidebar() {
  return (
    <section className="pane sidebar">
      <div className="sidebar-header">
        <div className="dataset">
          <ListDataset />
          <span className="required">* This field is required</span>
          <h3>New Dataset</h3>
          <Dataset />
        </div>
        <div className="model">
          <ListModel />
          <h3>New Model</h3>
          <Model />
          <h3>Optimize Model</h3>
          <OptimizeModel />
        </div>
      </div>
    </section>
  );
}

export default Sidebar;
