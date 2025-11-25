import { clients } from "../../../../utils/clients";
import { default as MarqueeElement } from "react-fast-marquee";
import Link from "next/link";
import "./Marquee.scss";
import Image from "next/image";

const Marquee = () => {
  return (
    <div className="sponsors-parent-wrapper">
      <MarqueeElement
        className="sponsors-inner-wrapper"
        pauseOnHover={false}
        pauseOnClick={false}
        play={true}
        speed={20}
      >
        {clients.map((client, index) => (
          <Link
            href={client.url.trim()}
            key={index}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={client.img}
              alt={`${client.name || "sponsor"} logo`}
              width={120}
              height={60}
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
        ))}
      </MarqueeElement>
    </div>
  );
};

export default Marquee;
