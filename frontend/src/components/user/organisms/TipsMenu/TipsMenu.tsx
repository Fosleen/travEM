import TipsMenuItem from "../../molecules/TipsMenuItem";
import icon1 from "../../../../assets/images/luggage-icon.png";
import icon2 from "../../../../assets/images/airport-icon.png";
import icon3 from "../../../../assets/images/travel-org-icon.png";
import icon4 from "../../../../assets/images/travel-app-icon.png";
import icon5 from "../../../../assets/images/bed-icon.png";
import icon6 from "../../../../assets/images/cards-icon.png";
import "./TipsMenu.scss";

const TipsMenu = ({ setIsTipsMenuShown }) => {
  const handleMouseLeave = () => {
    if (setIsTipsMenuShown) {
      setIsTipsMenuShown(false);
    }
  };

  return (
    <div className="tips-menu-container" onMouseLeave={handleMouseLeave}>
      <TipsMenuItem title={"Pakiranje"} icon={icon1} />
      <TipsMenuItem title={"Let avionom"} icon={icon2} />
      <TipsMenuItem title={"Organizacija puta"} icon={icon3} />
      <TipsMenuItem title={"Aplikacije"} icon={icon4} />
      <TipsMenuItem title={"Smještaj"} icon={icon5} />
      <TipsMenuItem title={"Revolut"} icon={icon6} />
    </div>
  );
};

export default TipsMenu;
