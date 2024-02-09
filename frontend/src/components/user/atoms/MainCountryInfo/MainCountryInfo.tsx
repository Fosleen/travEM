import coinsIcon from "../../../../assets/images/euro-coins-icon.png";
import worldMap from "../../../../assets/images/world-map.jpg";
import "./MainCountryInfo.scss";

const MainCountryInfo = ({ characteristics }) => {
  return (
    <div className="main-country-info-container">
      <div className="main-country-world-map-image">
        <img src={worldMap} alt="world-map" />
      </div>
      <div className="main-country-info-content">
        <h2>Da vas ne iznenadi</h2>
        <div className="main-country-info-items">
          {characteristics.map((el) => (
            <div className="main-country-info-item">
              <img src={el.characteristic_icon.url} alt="coins-icon" />
              <h5>{el.title}</h5>
              <p>{el.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainCountryInfo;
