import { FC } from "react";
import AirplaneTicketsMenuItem from "../../molecules/AirplaneTicketsMenuItem";
import "./AirplaneTicketsMenu.scss";
import { AirplaneTicketsMenuProps } from "../../../../common/types";

const AirplaneTicketsMenu: FC<AirplaneTicketsMenuProps> = ({
  setIsPlaneTicketsMenuShown,
}) => {
  const handleMouseLeave = () => {
    if (setIsPlaneTicketsMenuShown) {
      setIsPlaneTicketsMenuShown(false);
    }
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
