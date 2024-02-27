// @ts-nocheck

import { useEffect, useState } from "react";
import DestinationItem from "../../atoms/DestinationItem";
import "./AirplaneTicketsMenuItem.scss";
import { getAirportCities } from "../../../../api/airportCities";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignoreS
const AirplaneTicketsMenuItem = ({ title, isCroatia }) => {
  const [airportCities, setAirportCities] = useState([]);

  const fetchData = async () => {
    try {
      const response = await getAirportCities();
      setAirportCities(response);
    } catch {
      console.log("Neuspjesno fetchanje gradova s pistama");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="airplane-tickets-menu-item-container">
      <h2>{title}</h2>
      <hr />

      {isCroatia ? (
        <div className="airplane-tickets-menu-items">
          {airportCities?.slice(0, 4).map((airportCity) => (
            <DestinationItem
              key={airportCity.id}
              filterMenuItem
              name={airportCity.name}
              planeTickets
              iconUrl={airportCity.flag_url}
            />
          ))}
        </div>
      ) : (
        <div className="airplane-tickets-menu-items">
          {airportCities?.slice(4, 10).map((airportCity) => (
            <DestinationItem
              key={airportCity.id}
              filterMenuItem
              name={airportCity.name}
              planeTickets
              iconUrl={airportCity.flag_url}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AirplaneTicketsMenuItem;
