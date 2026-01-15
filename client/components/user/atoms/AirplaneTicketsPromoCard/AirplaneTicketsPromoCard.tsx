"use client";

import Image from "next/image";
import Link from "next/link";
import "./AirplaneTicketsPromoCard.scss";

type Props = {
  // možeš i dalje slati imageUrl, ali ako ne pošalješ -> koristi default promo sliku
  imageUrl?: string;
  title: string;
  text: string;
  buttonText: string;
  href: string;
};

const DEFAULT_PROMO_IMAGE =
  "https://live.staticflickr.com/65535/54231796537_ee931fd0bb_b.jpg";

const AirplaneTicketsPromoCard = ({
  imageUrl,
  title,
  text,
  buttonText,
  href,
}: Props) => {
  const promoImage = imageUrl || DEFAULT_PROMO_IMAGE;

  return (
    <section className="airplane-tickets-promo">
      <div className="airplane-tickets-promo-card">
        <div className="airplane-tickets-promo-image">
          <Image
            src={promoImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 1200px"
            style={{ objectFit: "cover" }}
            unoptimized
            priority={false}
          />
        </div>

        <div className="airplane-tickets-promo-overlay">
          <div className="airplane-tickets-promo-text">
            <div className="airplane-tickets-promo-top">
              <h3>{title}</h3>
            </div>

            <div className="airplane-tickets-promo-middle">
              <p>{text}</p>
            </div>

            <div className="airplane-tickets-promo-bottom">
              <Link className="airplane-tickets-promo-btn" href={href}>
                <span>{buttonText}</span>
                <span className="arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirplaneTicketsPromoCard;
