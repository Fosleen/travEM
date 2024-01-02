import MainCountryPost from "../../../components/user/atoms/MainCountryPost";
import DestinationHero from "../../../components/user/molecules/DestinationHero";
import "./DestinationCountry.scss";

const DestinationCountry = () => {
  return (
    <div className="destination-country-page-container">
      <DestinationHero />
      <div className="destination-country-upper-container">
        <div className="destination-country-upper-container-item">
          <p>lijevo</p>
        </div>
        <div className="destination-country-upper-container-item">
          <MainCountryPost />
        </div>
      </div>
    </div>
  );
};

export default DestinationCountry;
