import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Styling
import "../styles.css";
import "bootstrap/dist/css/bootstrap.min.css";

// Routes
import Homepage from "./Homepage";
import WebApp from "./WebApp";
import Signup from "./Authentication/Signup";
import Login from "./Authentication/Login";
import { UserContext } from "./Context/UserContext";

function App() {
  const [token, setToken] = useState("");
  const [datasetID, setDatasetID] = useState();
  const [modelID, setModelID] = useState();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
      </Routes>
      <UserContext.Provider
        value={{
          token,
          setToken,
          datasetID,
          setDatasetID,
          modelID,
          setModelID,
        }}
      >
        <Routes>
          <Route path="/webapp" element={<WebApp />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
