import Button from "../../../atoms/Button";
import Input from "../../../atoms/Input";
import envelope from "../../../../assets/images/envelope.png";
import "./Newsletter.scss";
import NewsletterImage from "../../atoms/NewsletterImage";
import { useState } from "react";
import { notifyFailure, notifyInfo } from "../../../atoms/Toast/Toast";
import { addSubscriber } from "../../../../api/subscribers";
import Image from "next/image";

const Newsletter = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  // eslint-disable-next-line
  const [email, setEmail] = useState("");

  const handleSubscriptionClick = async () => {
    if (!email) {
      notifyFailure("Molimo unesite email adresu");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      notifyFailure("Molimo unesite valjanu email adresu");
      return;
    }

    try {
      await addSubscriber(email);
      notifyInfo(
        "Uspješno ste se pretplatili na newsletter! Ako ne vidite poruke, provjerite neželjenu poštu (spam mail) i maknite naš mail odande. Hvala."
      );
      setEmail("");
    } catch (error) {
      notifyFailure("Došlo je do greške prilikom pretplate");
    }
  };

  return (
    <div className="newsletter-container">
      <div className="custom-shape-divider-top">
        <svg
          width="2878"
          height="405"
          viewBox="0 0 2878 405"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1420 404.854H0L6.92145e-06 280.19L1.38429e-05 155.525C367.5 -17.0073 809.5 138.135 1071 206.148C1213.35 243.173 1352 146.196 1420 79.5978C1488 13 1560.3 -49.0457 2061.5 59.3543C2562.7 167.754 2814.67 129.521 2878 96.8542V404.854H1420Z"
            fill="#121B20"
          />
        </svg>
      </div>
      <div className="newsletter-content-container">
        <div className="newsletter-content">
          <div className="newsletter-envelope">
            <Image
              src={envelope}
              alt="envelope-icon"
              width={320}
              height={320}
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          <div className="newsletter-content-text">
            <h3>Pridruži nam se</h3>
            <p>
              Inspiriraj se. Primaj popuste na letove. Prvi saznaj sve savjete.
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
                  pretplati se
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="newsletter-image">
          <NewsletterImage />
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
