import "./index.scss";
import "@chap-room/shared/polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "@chap-room/main/App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
