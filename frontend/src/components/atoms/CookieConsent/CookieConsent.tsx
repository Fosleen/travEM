import Button from "../Button/Button";
import "./CookieConsent.scss";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import ReactGA from "react-ga4";

const CONSENT_GRANTED = "granted";
const CONSENT_DENIED = "denied";

const CookieConsent = () => {
  const { pathname } = useLocation();
  const oldPage = useRef(pathname);
  const willMountReactGA = useRef(true);

  const [cookieConsent, setCookieConsent] = useState<string | null>(
    localStorage.getItem("cookie_consent") || CONSENT_DENIED
  );

  const setConsent = (consentValue: string) => {
    ReactGA.gtag("consent", "update", {
      analytics_storage: consentValue,
      ad_storage: consentValue,
      ad_personalization: consentValue,
      ad_user_data: consentValue,
    });
  };

  const handleAccept = () => {
    localStorage.setItem("cookie_consent", CONSENT_GRANTED);
    setCookieConsent(CONSENT_GRANTED);
    setConsent(CONSENT_GRANTED);
    initializeGoogleAnalytics();
  };

  const handleDecline = () => {
    localStorage.setItem("cookie_consent", CONSENT_DENIED);
    setCookieConsent(CONSENT_DENIED);
    setConsent(CONSENT_DENIED);
  };

  const initializeGoogleAnalytics = () => {
    if (!ReactGA.isInitialized) {
      ReactGA.initialize([
        {
          trackingId: "G-L09ZLTCLHW",
          gaOptions: { cookieDomain: "putujemstravem.com" },
          gtagOptions: {
            analytics_storage:
              cookieConsent === CONSENT_GRANTED
                ? CONSENT_GRANTED
                : CONSENT_DENIED,
            ad_storage:
              cookieConsent === CONSENT_GRANTED
                ? CONSENT_GRANTED
                : CONSENT_DENIED,
            ad_personalization:
              cookieConsent === CONSENT_GRANTED
                ? CONSENT_GRANTED
                : CONSENT_DENIED,
            ad_user_data:
              cookieConsent === CONSENT_GRANTED
                ? CONSENT_GRANTED
                : CONSENT_DENIED,
          },
        },
      ]);
    }
  };

  useEffect(() => {
    if (!ReactGA.isInitialized) {
      ReactGA.gtag("consent", "default", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }

    if (!willMountReactGA.current && ReactGA.isInitialized) {
      setConsent(
        cookieConsent === CONSENT_GRANTED ? CONSENT_GRANTED : CONSENT_DENIED
      );
    }
    if (willMountReactGA.current) {
      if (cookieConsent === CONSENT_GRANTED) {
        initializeGoogleAnalytics();
      }
      willMountReactGA.current = false;
    }
  }, [cookieConsent]);

  useEffect(() => {
    if (pathname !== oldPage.current) {
      oldPage.current = pathname;

      if (cookieConsent === CONSENT_GRANTED && !willMountReactGA.current) {
        ReactGA.send({ hitType: "pageview", page: pathname });
      }
    }
  }, [pathname, cookieConsent]);

  return (
    <>
      {cookieConsent === CONSENT_DENIED && (
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
