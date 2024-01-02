import coinsIcon from "../../../../assets/images/euro-coins-icon.png";
import worldMap from "../../../../assets/images/world-map.jpg";
import "./MainCountryInfo.scss";

const MainCountryInfo = () => {
  return (
    <div className="main-country-info-container">
      <div className="main-country-world-map-image">
        <img src={worldMap} alt="world-map" />
      </div>
      <div className="main-country-info-content">
        <h2>Da vas ne iznenadi</h2>
        <div className="main-country-info-items">
          <div className="main-country-info-item">
            <img src={coinsIcon} alt="coins-icon" />
            <h5>Valuta</h5>
            <p>euro</p>
          </div>
          <div className="main-country-info-item">
            <img src={coinsIcon} alt="coins-icon" />
            <h5>Valuta</h5>
            <p>euro</p>
          </div>
          <div className="main-country-info-item">
            <img src={coinsIcon} alt="coins-icon" />
            <h5>Valuta</h5>
            <p>euro</p>
          </div>
          <div className="main-country-info-item">
            <img src={coinsIcon} alt="coins-icon" />
            <h5>Valuta</h5>
            <p>euro</p>
          </div>
          <div className="main-country-info-item">
            <img src={coinsIcon} alt="coins-icon" />
            <h5>Valuta</h5>
            <p>euro</p>
          </div>
          <div className="main-country-info-item">
            <img src={coinsIcon} alt="coins-icon" />
            <h5>Valuta</h5>
            <p>euro</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCountryInfo;
