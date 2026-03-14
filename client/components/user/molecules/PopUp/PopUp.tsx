// client/components/user/molecules/PopUp/PopUp.tsx

// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import Input from "../../../atoms/Input";
import "./PopUp.scss";
import Button from "../../../atoms/Button";
import { notifyFailure, notifyInfo } from "../../../atoms/Toast/Toast";
import { addSubscriber } from "../../../../utils/subscribers";
import travemLogo from "/images/travem-logo-hero.webp";
import popUpBg from "/images/popupbg.webp";
import { X } from "@phosphor-icons/react";

import {
  COMMON_DOMAINS,
  normalizeEmail,
  isBasicValidEmail,
  suggestEmailCorrection,
} from "../../../../utils/email";

const PopUp = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const commonDomains = useMemo(() => COMMON_DOMAINS, []);

  useEffect(() => {
    const hasClosedPopup = localStorage.getItem("newsletterPopupClosed");
    if (!hasClosedPopup) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, []);

  const closePopup = () => {
    setIsClosing(true);
    setTimeout(() => {
      localStorage.setItem("newsletterPopupClosed", "true");
      setShowPopup(false);
      setIsClosing(false);
    }, 500);
  };

  const handleSubscriptionClick = async () => {
    const normalized = normalizeEmail(email);

    if (!normalized) {
      notifyFailure("Molimo unesite email adresu");
      return;
    }

    if (!isBasicValidEmail(normalized)) {
      notifyFailure("Molimo unesite valjanu email adresu");
      return;
    }

    const suggestion = suggestEmailCorrection(normalized, commonDomains);
    const finalEmail = suggestion ?? normalized;

    if (suggestion) {
      notifyInfo(`Ispravili smo domenu: ${normalized} -> ${finalEmail}`);
      setEmail(finalEmail);
    }

    try {
      await addSubscriber(finalEmail);
      notifyInfo(
        "Uspješno ste se pretplatili na newsletter! Ako ne vidite poruke, provjerite neželjenu poštu (spam mail) i maknite naš mail odande. Hvala."
      );
      setEmail("");
      closePopup();
    } catch (error) {
      notifyFailure("Došlo je do greške prilikom pretplate");
    }
  };

  if (!showPopup) return null;

  return (
    <div className={`email-popup-bg ${isClosing ? "closing" : ""}`}>
      <div className={`email-popup-container ${isClosing ? "closing" : ""}`}>
        <div className="email-popup-remove-icon" onClick={closePopup}>
          <X size={32} color="#121b20" weight="bold" />
        </div>

        <div className="email-popup-text-section">
          <img src={travemLogo} alt="travem-logo" className="popup-logo-img" />
          <div className="newsletter-form">
            <h2>Pretplati se na naš newsletter!</h2>
            <p>
              Pronađi najljepše destinacije, skrivene savjete i ekskluzivne
              ponude - direktno u svom inboxu.
            </p>

            <div className="newsletter-actions">
              <div className="newsletter-input-container">
                <Input
                  green
                  name="newsletter-input"
                  placeholder="Unesi e-mail adresu..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="newsletter-button-container">
                <Button primary onClick={handleSubscriptionClick}>
                  pretplati se ✈︎
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="email-popup-img-section">
          <img alt="travem-popup-bg" src={popUpBg} />
        </div>
      </div>
    </div>
  );
};

export default PopUp;
