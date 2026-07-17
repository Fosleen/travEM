"use client";

import Image from "next/image";
import { useState } from "react";
import Input from "../../../atoms/Input";
import NewsletterSubmitButton from "../../atoms/NewsletterSubmitButton/NewsletterSubmitButton";
import { handleSubscriptionClick } from "@/utils/newsletterSubscription";

import "./AirplaneTicketsNewsletterCallToAction.scss";

type AirplaneTicketsNewsletterCallToActionProps = {
  cityGenitive?: string;
};

const AirplaneTicketsNewsletterCallToAction = ({
  cityGenitive,
}: AirplaneTicketsNewsletterCallToActionProps) => {
  const [email, setEmail] = useState("");
  const [animateTrigger, setAnimateTrigger] = useState(0);

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
          onClick={() =>
            handleSubscriptionClick({
              email,
              setEmail,
              setAnimateTrigger,
              successMessage:
                "Uspješno ste se besplatno pretplatili na newsletter! Ako ne vidite poruke, provjerite neželjenu poštu i maknite naš mail odande. Hvala.",
            })
          }
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
