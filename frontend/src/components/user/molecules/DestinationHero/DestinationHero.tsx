import DestinationImage from "../../atoms/DestinationImage";
import "./DestinationHero.scss";

const DestinationHero = ({
  name = "testno",
  description = "testni opis",
  main_image_url = "",
  color = "#d2eb64",
}) => {
  return (
    <div className="destination-hero-container">
      <div className="destination-hero-left">
        <div className="destination-hero-titles">
          <h2 className="bold-grey">{name.toUpperCase()}</h2>
          <h2 className="bold-color" style={{ color: `#${color}` }}>
            {name.toUpperCase()}
          </h2>
          <h2 className="cursive-black">{name}</h2>
        </div>
        <p className="destination-hero-description">{description}</p>
      </div>
      <div className="destination-hero-right">
        <DestinationImage url={main_image_url} />
      </div>
    </div>
  );
};

export default DestinationHero;
