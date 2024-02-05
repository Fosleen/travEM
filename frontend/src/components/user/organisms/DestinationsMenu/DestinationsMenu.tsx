import DestinationsMenuItem from "../../molecules/DestinationsMenuItem";
import "./DestinationsMenu.scss";
import { FC } from "react";

interface DestinationsMenuProps {
  setIsDestinationsMenuShown?: (isShown: boolean) => void;
}

const DestinationsMenu: FC<DestinationsMenuProps> = ({
  setIsDestinationsMenuShown,
}) => {
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
      <>
        <DestinationsMenuItem title={"Europa"} id={1} />
        <DestinationsMenuItem title={"Afrika"} id={4} />
        <DestinationsMenuItem title={"Azija"} id={2} />
        <DestinationsMenuItem title={"Sjeverna Amerika"} id={3} />
      </>
    </div>
  );
};

export default DestinationsMenu;
