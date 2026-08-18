"use client";

import { default as MarqueeElement } from "react-fast-marquee";
import Link from "next/link";
import "./Marquee.scss";
import { useEffect, useState } from "react";
import { FooterPartnerData } from "@/common/types";
import { getFooterPartners } from "@/utils/footerPartners";

const Marquee = () => {
  const [partners, setPartners] = useState<FooterPartnerData[]>([]);

  useEffect(() => {
    getFooterPartners()
      .then(setPartners)
      // Partners are optional page chrome; an API outage should simply hide it.
      .catch(() => setPartners([]));
  }, []);

  if (partners.length === 0) return null;

  return (
    <div className="sponsors-parent-wrapper">
      <MarqueeElement
        className="sponsors-inner-wrapper"
        pauseOnHover={true}
        pauseOnClick={false}
        play={true}
        speed={20}
        autoFill={true}
      >
        {partners.map((partner) => (
          <Link
            href={partner.target_url}
            key={partner.id}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={partner.image_url} alt={`${partner.name} logo`} />
          </Link>
        ))}
      </MarqueeElement>
    </div>
  );
};

export default Marquee;
