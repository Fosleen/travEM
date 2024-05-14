import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { PrimeReactProvider } from "primereact/api";
import { ArticleProvider } from "./Context/ArticleContext.tsx";
import { ContinentProvider } from "./Context/ContinentContext.tsx";
import { CountryProvider } from "./Context/CountryContext.tsx";
import { PlaneTicketsProvider } from "./Context/PlaneTicketsMenuContext.tsx";
import { CookiesProvider } from "react-cookie";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
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
    </CookiesProvider>
  </React.StrictMode>
);
