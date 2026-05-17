"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Input from "../../../atoms/Input";
import NewsletterSubmitButton from "../../atoms/NewsletterSubmitButton/NewsletterSubmitButton";
import { notifyFailure, notifyInfo } from "../../../atoms/Toast/Toast";
import { addSubscriber } from "../../../../utils/subscribers";

import {
  COMMON_DOMAINS,
  normalizeEmail,
  isBasicValidEmail,
  suggestEmailCorrection,
} from "../../../../utils/email";

import "./AirplaneTicketsNewsletterCallToAction.scss";

type AirplaneTicketsNewsletterCallToActionProps = {
  cityGenitive?: string;
};

const AirplaneTicketsNewsletterCallToAction = ({
  cityGenitive,
}: AirplaneTicketsNewsletterCallToActionProps) => {
  const [email, setEmail] = useState("");
  const [animateTrigger, setAnimateTrigger] = useState(0);

  const commonDomains = useMemo(() => COMMON_DOMAINS, []);

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

    setAnimateTrigger((prev) => prev + 1);

    const suggestion = suggestEmailCorrection(normalized, commonDomains);
    const finalEmail = suggestion ?? normalized;

    if (suggestion) {
      notifyInfo(`Ispravili smo domenu: ${normalized} -> ${finalEmail}`);
      setEmail(finalEmail);
    }

    try {
      await addSubscriber(finalEmail);
      notifyInfo(
        "Uspješno ste se besplatno pretplatili na newsletter! Ako ne vidite poruke, provjerite neželjenu poštu i maknite naš mail odande. Hvala."
      );
      setEmail("");
    } catch (error) {
      notifyFailure("Došlo je do greške prilikom pretplate");
    }
  };

  return (
    <div className="airplane-tickets-newsletter-call-to-action-container">
      <div className="airplane-tickets-newsletter-call-to-action-visual">
        <Image
          src="/images/envelope.png"
          alt="newsletter-envelope"
          width={96}
          height={96}
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      <div className="airplane-tickets-newsletter-call-to-action-content">
        <span className="airplane-tickets-newsletter-call-to-action-badge">
          Besplatan newsletter
        </span>

        <p>
          Trenutno nema povoljnih ponuda za ovu rubriku
          {cityGenitive ? ` iz ${cityGenitive}` : ""}. Prijavi se i primi
          obavijest čim se pojave jeftini letovi.
        </p>
      </div>

      <div className="airplane-tickets-newsletter-call-to-action-actions">
        <div className="airplane-tickets-newsletter-call-to-action-input">
          <Input
            green
            name="airplane-tickets-newsletter-input"
            placeholder="Unesi e-mail adresu..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <NewsletterSubmitButton
          onClick={handleSubscriptionClick}
          animateTrigger={animateTrigger}
          text="Obavijesti me"
        />

        <span className="airplane-tickets-newsletter-call-to-action-note">
          Bez spama. Odjava u bilo kojem trenutku.
        </span>
      </div>
    </div>
  );
};

export default AirplaneTicketsNewsletterCallToAction;