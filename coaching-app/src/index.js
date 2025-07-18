import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ToggleColorModeProvider from "./theme/theme";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToggleColorModeProvider>
    <App />
  </ToggleColorModeProvider>
);
