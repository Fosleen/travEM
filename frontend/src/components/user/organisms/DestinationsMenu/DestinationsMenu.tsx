import DestinationsMenuItem from "../../molecules/DestinationsMenuItem";
import "./DestinationsMenu.scss";
import { FC } from "react";

interface DestinationsMenuProps {
  setIsDestinationsMenuShown?: (isShown: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignoreS
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
      <DestinationsMenuItem title={"Europa"} />
      <DestinationsMenuItem title={"Afrika"} />
      <DestinationsMenuItem title={"Azija"} />
      <DestinationsMenuItem title={"Amerika"} />
    </div>
  );
};

export default DestinationsMenu;
