import React from "react";
import Plot from "react-plotly.js";

function Editor() {
  return (
    <section>
      <div className="pane editor">
        <div>
          <h1>EnSysMod: Platform for Energy System Model</h1>
          <h3>Model </h3>
        </div>
        <div className="result">
          <div className="result-img">
            <Plot
              data={[
                {
                  x: [1, 2, 3],
                  y: [2, 6, 3],
                  type: "scatter",
                  mode: "lines+markers",
                  marker: { color: "red" },
                },
                { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
              ]}
              layout={{
                width: 600,
                height: 400,
                title: "A Fancy Plot",
                margin: { t: 40, r: 20, l: 20, b: 20 },
              }}
            />
          </div>
          <h3 className="result-header">Optimization Result</h3>
        </div>
      </div>
    </section>
  );
}

export default Editor;
