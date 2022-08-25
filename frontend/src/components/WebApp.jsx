import React from "react";
import Sidebar from "./Sidebar";
import Editor from "./Editor";
import Split from "react-split";
import Header from "./Header";

function WebApp() {
  return (
    <div>
      <Header />
      <main className="main-container">
        <Split sizes={[25, 70]} direction="horizontal" className="split">
          <Sidebar />
          <Editor />
        </Split>
      </main>
    </div>
  );
}

export default WebApp;
