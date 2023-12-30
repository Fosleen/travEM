import HorizontalPostItemBig from "../../../components/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import VerticalPostItem from "../../../components/atoms/VerticalPostItem";
import "./AirplaneTickets.scss";

const AirplaneTickets = () => {
  return (
    <div className="airplane-tickets-parent-wrapper">
      <div className="airplane-tickets-text-wrapper">
        <h2>Aviokarte iz Zagreba </h2>
      </div>
      <div className="airplane-tickets-grid-wrapper">
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
      </div>
      <h3>Povezani članci</h3>
      <div className="airplane-tickets-connected-articles-wrapper">
        <VerticalPostItem />
        <VerticalPostItem />
        <VerticalPostItem />
        <VerticalPostItem />
      </div>
    </div>
  );
};

export default AirplaneTickets;
