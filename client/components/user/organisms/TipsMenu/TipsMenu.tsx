import TipsMenuItem from "../../molecules/TipsMenuItem";
import "./TipsMenu.scss";
import { FC } from "react";
import { TipsMenuProps } from "@/common/types";

const menuItems = [
  { title: "Pakiranje", icon: "/images/luggage-icon.png" },
  { title: "Let avionom", icon: "/images/airport-icon.png" },
  { title: "Organizacija puta", icon: "/images/travel-org-icon.png" },
  { title: "Aplikacije", icon: "/images/travel-app-icon.png" },
  { title: "Smještaj", icon: "/images/bed-icon.png" },
  { title: "Revolut", icon: "/images/cards-icon.png" },
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
