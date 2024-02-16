// @ts-nocheck

import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./AirplaneTickets.scss";

const AirplaneTickets = () => {
  return (
    <div className="airplane-tickets-parent-wrapper">
      <div className="airplane-tickets-text-wrapper">
        <h2>Aviokarte iz Zagreba</h2>
      </div>
      <div className="airplane-tickets-grid-wrapper">
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
      </div>
      <div className="airplane-tickets-text-articles-wrapper">
        <h2>Povezani članci</h2>
      </div>

      <div className="airplane-tickets-connected-articles-wrapper">
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
      </div>
    </div>
  );
};

export default AirplaneTickets;
