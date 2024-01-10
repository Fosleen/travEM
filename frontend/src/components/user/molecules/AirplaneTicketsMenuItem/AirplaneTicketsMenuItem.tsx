import DestinationItem from "../../atoms/DestinationItem";
import "./AirplaneTicketsMenuItem.scss";

const AirplaneTicketsMenuItem = ({ title }) => {
  return (
    <div className="airplane-tickets-menu-item-container">
      <h2>{title}</h2>
      <hr />
      <div className="airplane-tickets-menu-items">
        <DestinationItem filterMenuItem name="Zagreb" />
        <DestinationItem filterMenuItem name="Split" />
        <DestinationItem filterMenuItem name="Dubrovnik" />
        <DestinationItem filterMenuItem name="Zadar" />
        <DestinationItem filterMenuItem name="Pula" />
        <DestinationItem filterMenuItem name="Rijeka" />
        <DestinationItem filterMenuItem name="Osijek" />
        <DestinationItem filterMenuItem name="Brač" />
      </div>
    </div>
  );
};

export default AirplaneTicketsMenuItem;
