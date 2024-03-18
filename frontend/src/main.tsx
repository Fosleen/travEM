import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";
import ReactGA from "react-ga4";
import { ArticleProvider } from "./Context/ArticleContext.tsx";
import { ContinentProvider } from "./Context/ContinentContext.tsx";
import { CountryProvider } from "./Context/CountryContext.tsx";
import { PlaneTicketsProvider } from "./Context/PlaneTicketsMenuContext.tsx";

ReactGA.initialize("G-L09ZLTCLHW");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CountryProvider>
        <ContinentProvider>
          <ArticleProvider>
            <PlaneTicketsProvider>
              <PrimeReactProvider>
                <App />
                <ToastContainer />
              </PrimeReactProvider>
            </PlaneTicketsProvider>
          </ArticleProvider>
        </ContinentProvider>
      </CountryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
