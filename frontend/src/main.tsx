import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";
import ReactGA from "react-ga4";
import { ArticleProvider } from "./Context/ArticleContext.tsx";

ReactGA.initialize("G-P636ECTSKC");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ArticleProvider>
        <PrimeReactProvider>
          <App />
          <ToastContainer />
        </PrimeReactProvider>
      </ArticleProvider>
    </BrowserRouter>
  </React.StrictMode>
);
