import Button from "../Button/Button";
import "./CookieConsent.scss";
import { Link } from "react-router-dom";
import { FC, useEffect } from "react";
import ReactGA from "react-ga4";

interface CookieConsentProps {
  cookies: { cookie_consent?: string };
  setCookie: (name: string, value: string) => void;
}

const CookieConsent: FC<CookieConsentProps> = ({ cookies, setCookie }) => {
  const handleAccept = () => {
    setCookie("cookie_consent", "accepted");
  };

  const handleDecline = () => {
    setCookie("cookie_consent", "declined");
  };

  const initializeGoogleAnalytics = () => {
    ReactGA.initialize("G-L09ZLTCLHW");
  };

  useEffect(() => {
    if (cookies.cookie_consent === "accepted") {
      initializeGoogleAnalytics();
    } else {
      // console.log("nisu prihvaceni");
    }
  }, [cookies.cookie_consent]);

  return (
    <>
      {!cookies.cookie_consent && (
        <div className="cookie-consent-container">
          <h2>Zašto koristimo 🍪?</h2>
          <p>
            Saznajte više o tome kako koristimo Vaše podatke na{" "}
            <Link to={"pravila-o-privatnosti"}>Politici privatnosti</Link>.
          </p>
          <div className="cookie-consent-buttons">
            <Button fitText white onClick={handleAccept}>
              prihvati sve
            </Button>
            <Button fitText grey onClick={handleDecline}>
              samo neophodni
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CookieConsent;
