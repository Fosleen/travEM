import { clients } from "../../../../utils/clients";
import { default as MarqueeElement } from "react-fast-marquee";
import Link from "next/link";
import "./Marquee.scss";

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
        {clients.map((client) => (
          <Link href={client.url} key={client.url} target="_blank">
            <img src={client.img} alt="sponsor-logo" />
          </Link>
        ))}
      </MarqueeElement>
    </div>
  );
};

export default Marquee;
