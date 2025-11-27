"use client";

import { useState } from "react";
import Button from "@/components/atoms/Button";
import "./Unsubscribe.scss";
import { notifyFailure, notifyInfo } from "@/components/atoms/Toast/Toast";
import { unsubscribeUser } from "@/api/subscribers";
import SocialMediaLinks from "@/components/user/atoms/SocialMediaLinks";

interface UnsubscribeProps {
  userToken: string | null;
}

const Unsubscribe = ({ userToken }: UnsubscribeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  const handleUnsubscribe = async () => {
    if (!userToken) {
      notifyFailure("Nevažeći link za odjavu");
      return;
    }

    setIsLoading(true);

    try {
      await unsubscribeUser(userToken);
      setIsUnsubscribed(true);
      notifyInfo("Uspješno ste se odjavili s newslettera");
    } catch (error) {
      notifyFailure("Došlo je do greške. Molimo pokušajte ponovno.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isUnsubscribed) {
    return (
      <div className="unsubscribe-container">
        <div className="unsubscribe-content">
          <h2>Uspješno ste se odjavili</h2>
          <p>Više nećete primati naš newsletter.</p>
          <p>Pratite nas i dalje putem naših ostalih mreža 💚</p>
          <SocialMediaLinks />
        </div>
      </div>
    );
  }

  return (
    <div className="unsubscribe-container">
      <div className="unsubscribe-content">
        <h2>
          Jeste li sigurni da više ne želite biti pretplaćeni na naš newsletter?
        </h2>
        <p>Više nećete primati obavijesti o novim člancima i putovanjima.</p>
        <div className="unsubscribe-actions">
          <Button
            primary
            onClick={handleUnsubscribe}
            disabled={isLoading || !userToken}
          >
            {isLoading ? "Odjavljujem..." : "Da, otkaži pretplatu"}
          </Button>
        </div>
        {!userToken && (
          <p className="unsubscribe-error">
            Nevažeći link za odjavu. Molimo koristite link iz emaila.
          </p>
        )}
      </div>
    </div>
  );
};

export default Unsubscribe;
