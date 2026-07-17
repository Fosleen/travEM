"use client";

import Image from "next/image";
import "./AirplaneTicketsHero.scss";

type Props = {
  imageUrl: string;
  title: string;
  subtitle: string;
};

const AirplaneTicketsHero = ({ imageUrl, title, subtitle }: Props) => {
  return (
    <section className="airplane-tickets-hero">
      <div className="airplane-tickets-hero-image">
        <Image
          src={imageUrl}
          alt={title}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          unoptimized
          priority={true}
        />
        <div className="airplane-tickets-hero-overlay">
          <div className="airplane-tickets-hero-text">
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AirplaneTicketsHero;
