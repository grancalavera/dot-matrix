import React from "react";
import ReactDOM from "react-dom/client";
import AppQuickEdit from "./AppQuickEdit.tsx";
import "./AppQuickEdit.css";
import "./index.css";

if (import.meta.env.MODE === "development") {
  const { scan } = await import("react-scan");
  scan({
    enabled: true,
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppQuickEdit />
  </React.StrictMode>
);
