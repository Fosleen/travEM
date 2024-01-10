import DestinationsMenuItem from "../../molecules/DestinationsMenuItem";
import "./DestinationsMenu.scss";

const DestinationsMenu = ({ setIsDestinationsMenuShown }) => {
  const handleMouseLeave = () => {
    if (setIsDestinationsMenuShown) {
      setIsDestinationsMenuShown(false);
    }
  };

  return (
    <div
      className="destinations-menu-container"
      onMouseLeave={handleMouseLeave}
    >
      <DestinationsMenuItem title={"Europa"} />
      <DestinationsMenuItem title={"Afrika"} />
      <DestinationsMenuItem title={"Azija"} />
      <DestinationsMenuItem title={"Amerika"} />
    </div>
  );
};

export default DestinationsMenu;
