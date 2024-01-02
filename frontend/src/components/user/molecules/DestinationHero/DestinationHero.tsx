import DestinationImage from "../../atoms/DestinationImage";
import "./DestinationHero.scss";

const DestinationHero = () => {
  return (
    <div className="destination-hero-container">
      <div className="destination-hero-left">
        <div className="destination-hero-titles">
          <h2 className="bold-grey">Bosna i Hercegovina</h2>
          <h2 className="bold-color">Bosna i Hercegovina</h2>
          <h2 className="cursive-black">Bosna i Hercegovina</h2>
        </div>
        <p className="destination-hero-description">
          Na svakom koraku iznenađuje autentičnošću, netaknutom ljepotom i
          kristalno čistim morem. Nudi brojne mogućnosti za opuštanje i pravi
          odmor.
        </p>
      </div>
      <div className="destination-hero-right">
        <DestinationImage />
      </div>
    </div>
  );
};

export default DestinationHero;
