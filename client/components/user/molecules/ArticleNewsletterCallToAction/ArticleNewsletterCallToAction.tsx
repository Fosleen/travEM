import Input from "../../../atoms/Input";
import "./ArticleNewsletterCallToAction.scss";
import { useMemo, useState } from "react";
import { notifyFailure, notifyInfo } from "../../../atoms/Toast/Toast";
import { addSubscriber } from "../../../../utils/subscribers";
import Image from "next/image";
import NewsletterSubmitButton from "../../atoms/NewsletterSubmitButton/NewsletterSubmitButton";

import {
  COMMON_DOMAINS,
  normalizeEmail,
  isBasicValidEmail,
  suggestEmailCorrection,
} from "../../../../utils/email";

const ArticleNewsletterCallToAction = () => {
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
    <div className="article-newsletter-call-to-action-container">
      <div className="article-newsletter-call-to-action-icon">
        <Image
          src="/images/envelope.png"
          alt="newsletter-envelope"
          width={96}
          height={96}
          style={{ width: "auto", height: "auto" }}
        />
      </div>

      <div className="article-newsletter-call-to-action-content">
        <span className="article-newsletter-call-to-action-badge">
          Besplatan newsletter
        </span>

        <h3>Želiš li primati ovakav sadržaj među prvima?</h3>

        <p>
          Besplatno se pretplati i primaj vodiče, savjete, obavijesti i povoljne
          aviokarte direktno na svoju e-mail adresu.
        </p>

        <div className="article-newsletter-call-to-action-actions">
          <div className="article-newsletter-call-to-action-input">
            <Input
              green
              name="article-newsletter-input"
              placeholder="Unesi e-mail adresu..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="article-newsletter-call-to-action-button">
            <NewsletterSubmitButton
              onClick={handleSubscriptionClick}
              animateTrigger={animateTrigger}
              text="pretplati se besplatno"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleNewsletterCallToAction;