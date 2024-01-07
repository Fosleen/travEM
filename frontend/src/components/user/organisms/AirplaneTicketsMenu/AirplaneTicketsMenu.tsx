import AirplaneTicketsMenuItem from "../../molecules/AirplaneTicketsMenuItem";
import "./AirplaneTicketsMenu.scss";

const AirplaneTicketsMenu = ({ setIsPlaneTicketsMenuShown }) => {
  const handleMouseLeave = () => {
    setIsPlaneTicketsMenuShown(false);
  };

  return (
    <div
      className="airplane-tickets-menu-container"
      onMouseLeave={handleMouseLeave}
    >
      <AirplaneTicketsMenuItem title={"Iz Hrvatske"} />
      <AirplaneTicketsMenuItem title={"Ostalo"} />
    </div>
  );
};

export default AirplaneTicketsMenu;
