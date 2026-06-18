import React from "react";
import ReactDOM from "react-dom/client";
import Widget from './Widget';
import "./index.css";

// Read the api key from the script tag
const scriptTag = document.currentScript as HTMLScriptElement;
const apiKey = scriptTag?.getAttribute("data-api-key") || "";

// Create a shadow container so widget styles don't conflict with host website
const container = document.createElement("div");
container.id = "botforge-widget-root";
document.body.appendChild(container);

ReactDOM.createRoot(container).render(
  <React.StrictMode>
    <Widget apiKey={apiKey} />
  </React.StrictMode>,
);
