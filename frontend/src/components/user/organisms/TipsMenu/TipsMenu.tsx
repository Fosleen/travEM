import TipsMenuItem from "../../molecules/TipsMenuItem";
import icon1 from "../../../../assets/images/luggage-icon.png";
import icon2 from "../../../../assets/images/airport-icon.png";
import icon3 from "../../../../assets/images/travel-org-icon.png";
import icon4 from "../../../../assets/images/travel-app-icon.png";
import icon5 from "../../../../assets/images/bed-icon.png";
import icon6 from "../../../../assets/images/cards-icon.png";
import "./TipsMenu.scss";
import { FC } from "react";
import { TipsMenuProps } from "../../../../common/types";

const menuItems = [
  { title: "Pakiranje", icon: icon1 },
  { title: "Let avionom", icon: icon2 },
  { title: "Organizacija puta", icon: icon3 },
  { title: "Aplikacije", icon: icon4 },
  { title: "Smještaj", icon: icon5 },
  { title: "Revolut", icon: icon6 },
];

const TipsMenu: FC<TipsMenuProps> = ({ setIsTipsMenuShown }) => {
  const handleMouseLeave = () => {
    if (setIsTipsMenuShown) {
      setIsTipsMenuShown(false);
    }
  };

  return (
    <div className="tips-menu-container" onMouseLeave={handleMouseLeave}>
      {menuItems.map((item) => (
        <TipsMenuItem
          key={item.title}
          title={item.title}
          icon={item.icon}
          onClick={() => {
            if (setIsTipsMenuShown) {
              setIsTipsMenuShown(false);
            }
          }}
        />
      ))}
    </div>
  );
};

export default TipsMenu;
