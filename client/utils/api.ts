// utils/api.ts

const LOCAL_API = "http://localhost:25060/api/v1";

export const apiUrl: string =
  typeof window === "undefined"
    ? LOCAL_API
    : (() => {
        // Ako je stranica otvorena s localhosta → desktop dev → koristi localhost
        if (
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1"
        ) {
          return LOCAL_API;
        }

        // Inače (fizički mobitel, tablet, drugi uređaj)
        // koristi IP s kojeg je stranica učitana
        return `http://${window.location.hostname}:25060/api/v1`;
      })();
