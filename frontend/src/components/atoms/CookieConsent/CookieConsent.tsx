import Button from "../Button/Button";
import "./CookieConsent.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga4";

const CookieConsent = () => {
  const { pathname } = useLocation();
  const oldPage = useRef(pathname);
  const willMountReactGA = useRef(true);
  const [cookieConsent, setCookieConsent] = useState<string | null>(
    localStorage.getItem("cookie_consent")
  );

  const setConsent = (consentValue: "granted" | "denied") => {
    ReactGA.gtag("consent", "update", {
      analytics_storage: consentValue,
      ad_storage: consentValue,
      ad_personalization: consentValue,
      ad_user_data: consentValue,
    });
  };

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", "accepted");
    setCookieConsent("accepted");
    setConsent("granted");
    initializeGoogleAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", "declined");
    setCookieConsent("declined");
    setConsent("denied");
  };

  const initializeGoogleAnalytics = () => {
    if (!ReactGA.isInitialized) {
      ReactGA.initialize([
        {
          trackingId: "G-L09ZLTCLHW",
          gaOptions: { cookieDomain: "putujemstravem.com" },
          gtagOptions: {
            analytics_storage:
              cookieConsent === "accepted" ? "granted" : "denied",
          },
        },
      ]);
    }
  };

  useEffect(() => {
    if (!willMountReactGA.current && ReactGA.isInitialized) {
      setConsent(cookieConsent === "accepted" ? "granted" : "denied");
    }
    if (willMountReactGA.current) {
      if (cookieConsent === "accepted") {
        initializeGoogleAnalytics();
      }
      willMountReactGA.current = false;
    }
  }, [cookieConsent]);

  useEffect(() => {
    if (pathname !== oldPage.current) {
      oldPage.current = pathname;

      if (cookieConsent === "accepted" && !willMountReactGA.current) {
        ReactGA.send({ hitType: "pageview", page: pathname });
      }
    }
  }, [pathname, cookieConsent]);

  return (
    <>
      {!cookieConsent && (
        <div className="cookie-consent-container">
          <h2>Zašto koristimo 🍪?</h2>
          <p>
            Saznajte više o tome kako koristimo Vaše podatke na{" "}
            <Link to={"/pravila-o-privatnosti"}>Politici privatnosti</Link>.
          </p>
          <div className="cookie-consent-buttons">
            <Button fitText white onClick={handleAccept}>
              Prihvati sve
            </Button>
            <Button fitText grey onClick={handleDecline}>
              Samo neophodni
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
