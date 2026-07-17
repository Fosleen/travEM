// @ts-nocheck
"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "@phosphor-icons/react";

import Input from "../../../atoms/Input";
import "./PopUp.scss";
import NewsletterSubmitButton from "../../atoms/NewsletterSubmitButton/NewsletterSubmitButton";
import { handleSubscriptionClick } from "@/utils/newsletterSubscription";

const travemLogo = "/images/travem-logo-hero.webp";
const popUpBg = "/images/popupbg.webp";

const POPUP_DELAY_MS = 60000;
const REQUIRED_SCROLL_PERCENT = 30;
const EXIT_INTENT_MIN_TIME_MS = 10000;

const CLOSED_COOLDOWN_DAYS = 7;
const SUBSCRIBED_COOLDOWN_DAYS = 30;

const MS_IN_DAY = 24 * 60 * 60 * 1000;

const STORAGE_KEYS = {
  oldClosed: "newsletterPopupClosed",
  closedAt: "newsletterPopupClosedAt",
  subscribedAt: "newsletterPopupSubscribedAt",
  shownThisSession: "newsletterPopupShownThisSession",
};

const getStoredTimestamp = (key: string) => {
  const value = localStorage.getItem(key);

  if (!value) {
    return null;
  }

  const timestamp = Number(value);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return timestamp;
};

const isWithinCooldown = (timestamp: number | null, cooldownDays: number) => {
  if (!timestamp) {
    return false;
  }

  return Date.now() - timestamp < cooldownDays * MS_IN_DAY;
};

const getScrollPercent = () => {
  const documentElement = document.documentElement;
  const body = document.body;

  const scrollTop =
    window.scrollY || documentElement.scrollTop || body.scrollTop || 0;

  const scrollHeight = Math.max(
    body.scrollHeight,
    body.offsetHeight,
    documentElement.clientHeight,
    documentElement.scrollHeight,
    documentElement.offsetHeight
  );

  const viewportHeight = window.innerHeight || documentElement.clientHeight;
  const scrollableHeight = scrollHeight - viewportHeight;

  if (scrollableHeight <= 0) {
    return 0;
  }

  return Math.round((scrollTop / scrollableHeight) * 100);
};

const isDesktopDevice = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
};

const PopUp = () => {
  const [email, setEmail] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [animateTrigger, setAnimateTrigger] = useState(0);

  const hasTriggeredPopupRef = useRef(false);
  const isExitIntentReadyRef = useRef(false);

  const migrateOldPopupStorage = () => {
    const hasOldClosedValue = localStorage.getItem(STORAGE_KEYS.oldClosed);
    const hasNewClosedValue = localStorage.getItem(STORAGE_KEYS.closedAt);

    if (hasOldClosedValue && !hasNewClosedValue) {
      localStorage.setItem(STORAGE_KEYS.closedAt, String(Date.now()));
      localStorage.removeItem(STORAGE_KEYS.oldClosed);
    }
  };

  const canShowPopup = () => {
    if (hasTriggeredPopupRef.current || showPopup || isClosing) {
      return false;
    }

    const wasShownThisSession = sessionStorage.getItem(
      STORAGE_KEYS.shownThisSession
    );

    if (wasShownThisSession) {
      return false;
    }

    const closedAt = getStoredTimestamp(STORAGE_KEYS.closedAt);
    const subscribedAt = getStoredTimestamp(STORAGE_KEYS.subscribedAt);

    const isClosedCooldownActive = isWithinCooldown(
      closedAt,
      CLOSED_COOLDOWN_DAYS
    );

    const isSubscribedCooldownActive = isWithinCooldown(
      subscribedAt,
      SUBSCRIBED_COOLDOWN_DAYS
    );

    if (isClosedCooldownActive || isSubscribedCooldownActive) {
      return false;
    }

    return true;
  };

  const openPopup = () => {
    if (!canShowPopup()) {
      return;
    }

    hasTriggeredPopupRef.current = true;
    sessionStorage.setItem(STORAGE_KEYS.shownThisSession, "true");
    setShowPopup(true);
  };

  useEffect(() => {
    migrateOldPopupStorage();

    const popupTimer = setTimeout(() => {
      openPopup();
    }, POPUP_DELAY_MS);

    const exitIntentTimer = setTimeout(() => {
      isExitIntentReadyRef.current = true;
    }, EXIT_INTENT_MIN_TIME_MS);

    const handleScroll = () => {
      const currentScrollPercent = getScrollPercent();

      if (currentScrollPercent >= REQUIRED_SCROLL_PERCENT) {
        openPopup();
      }
    };

    const handleExitIntent = (event: MouseEvent) => {
      if (!isDesktopDevice()) {
        return;
      }

      if (!isExitIntentReadyRef.current) {
        return;
      }

      if (event.clientY > 0) {
        return;
      }

      openPopup();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("mouseleave", handleExitIntent);

    handleScroll();

    return () => {
      clearTimeout(popupTimer);
      clearTimeout(exitIntentTimer);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mouseleave", handleExitIntent);
    };
  }, []);

  const closePopup = () => {
    setIsClosing(true);

    setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.closedAt, String(Date.now()));
      setShowPopup(false);
      setIsClosing(false);
    }, 500);
  };

  const closePopupAfterSuccessfulSubscription = () => {
    setIsClosing(true);

    setTimeout(() => {
      localStorage.setItem(STORAGE_KEYS.subscribedAt, String(Date.now()));
      setShowPopup(false);
      setIsClosing(false);
    }, 500);
  };

  if (!showPopup) return null;

  return (
    <div className={`email-popup-bg ${isClosing ? "closing" : ""}`}>
      <div className={`email-popup-container ${isClosing ? "closing" : ""}`}>
        <div
          className="email-popup-remove-icon"
          onClick={closePopup}
          role="button"
          aria-label="Zatvori newsletter popup"
        >
          <X size={32} color="#121b20" weight="bold" />
        </div>

        <div className="email-popup-text-section">
          <img src={travemLogo} alt="putujEM s travEM" className="popup-logo-img" />

          <div className="newsletter-form">
            <h2>Pretplati se na naš newsletter!</h2>
            <p>
              Pronađi najljepše destinacije, skrivene savjete i ekskluzivne
              ponude direktno u svom inboxu.
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
                <NewsletterSubmitButton
                  onClick={() =>
                    handleSubscriptionClick({
                      email,
                      setEmail,
                      setAnimateTrigger,
                      successMessage:
                        "Uspješno ste se pretplatili na newsletter! Ako ne vidite poruke, provjerite neželjenu poštu (spam mail) i maknite naš mail odande. Hvala.",
                      onSuccess: closePopupAfterSuccessfulSubscription,
                    })
                  }
                  animateTrigger={animateTrigger}
                  text="pretplati se"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="email-popup-img-section">
          <img alt="Newsletter pozadina" src={popUpBg} />
        </div>
      </div>
    </div>
  );
};

export default PopUp;
