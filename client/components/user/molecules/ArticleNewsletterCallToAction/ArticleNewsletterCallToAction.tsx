import Input from "../../../atoms/Input";
import "./ArticleNewsletterCallToAction.scss";
import { useState } from "react";
import Image from "next/image";
import NewsletterSubmitButton from "../../atoms/NewsletterSubmitButton/NewsletterSubmitButton";
import { handleSubscriptionClick } from "@/utils/newsletterSubscription";

const ArticleNewsletterCallToAction = () => {
  const [email, setEmail] = useState("");
  const [animateTrigger, setAnimateTrigger] = useState(0);

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
              text="pretplati se besplatno"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleNewsletterCallToAction;
