"use client";

import { FooterPartnerData } from "@/common/types";
import { CaretDown } from "@phosphor-icons/react";
import { useState, useSyncExternalStore } from "react";
import "./PartnerShowcase.scss";

const emptySubscribe = () => () => {};
const INITIAL_PARTNER_COUNT = 4;

interface PartnerShowcaseProps {
  partners: FooterPartnerData[];
}

const PartnerShowcase = ({ partners }: PartnerShowcaseProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Keep the server and the client's first render identical even when the
  // optional partner request returns different data during development.
  if (!isMounted || partners.length === 0) return null;

  const featuredPartners = partners.slice(0, INITIAL_PARTNER_COUNT);
  const remainingPartners = partners.slice(INITIAL_PARTNER_COUNT);
  const hasMorePartners = partners.length > INITIAL_PARTNER_COUNT;

  return (
    <section
      className="partner-showcase"
      aria-labelledby="partner-showcase-title"
      data-nosnippet
    >
      <div className="partner-showcase__content">
        <h2 id="partner-showcase-title">Hvala našim partnerima</h2>

        <div className="partner-showcase__logos">
          {featuredPartners.map((partner) => (
            <a
              href={partner.target_url}
              key={partner.id}
              target="_blank"
              rel="sponsored noopener noreferrer"
              aria-label={`${partner.name} — otvori web stranicu`}
            >
              <img
                src={partner.showcase_image_url || partner.image_url}
                alt={`${partner.name} logo`}
              />
            </a>
          ))}

        </div>

        {hasMorePartners && (
          <>
            <div
              className={`partner-showcase__expandable ${isExpanded ? "is-expanded" : ""}`}
              aria-hidden={!isExpanded}
            >
              <div className="partner-showcase__expandable-inner">
                <div className="partner-showcase__logos partner-showcase__logos--remaining">
                  {remainingPartners.map((partner) => (
                    <a
                      href={partner.target_url}
                      key={partner.id}
                      target="_blank"
                      rel="sponsored noopener noreferrer"
                      aria-label={`${partner.name} — otvori web stranicu`}
                      tabIndex={isExpanded ? undefined : -1}
                    >
                      <img
                        src={partner.showcase_image_url || partner.image_url}
                        alt={`${partner.name} logo`}
                      />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <button
              className={`partner-showcase__toggle ${isExpanded ? "is-expanded" : ""}`}
              type="button"
              onClick={() => setIsExpanded((current) => !current)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? "Prikaži manje partnera" : "Prikaži više partnera"}
            >
              <span>{isExpanded ? "Prikaži manje" : "Prikaži više"}</span>
              <CaretDown size={22} weight="bold" aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default PartnerShowcase;
