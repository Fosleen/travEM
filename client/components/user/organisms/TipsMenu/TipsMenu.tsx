import TipsMenuItem from "../../molecules/TipsMenuItem";
import "./TipsMenu.scss";
import { FC } from "react";
import { TipsMenuProps } from "@/common/types";
import { TIPS_CATEGORY_ICONS } from "@/utils/articleTypeHelpers";

const menuItems = [
  {
    title: "Pakiranje",
    icon: TIPS_CATEGORY_ICONS.pakiranje,
  },
  {
    title: "Let avionom",
    icon: TIPS_CATEGORY_ICONS["let-avionom"],
  },
  {
    title: "Novosti i organizacija puta",
    slugTitle: "Organizacija puta",
    icon: TIPS_CATEGORY_ICONS["organizacija-puta"],
  },
  {
    title: "Aplikacije",
    icon: TIPS_CATEGORY_ICONS.aplikacije,
  },
  {
    title: "Smještaj",
    icon: TIPS_CATEGORY_ICONS.smjestaj,
  },
  {
    title: "Revolut",
    icon: TIPS_CATEGORY_ICONS.revolut,
  },
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
          slugTitle={item.slugTitle}
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
