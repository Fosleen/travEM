// @ts-nocheck

import { useContext, useEffect } from "react";
import DestinationItem from "../../atoms/DestinationItem";
import "./AirplaneTicketsMenuItem.scss";
import { getAirportCities } from "../../../../api/airportCities";
import { PlaneTicketsContext } from "../../../../Context/PlaneTicketsMenuContext";

const AirplaneTicketsMenuItem = ({ title, isCroatia }) => {
  const {
    homepagePlaneTicketsContextData,
    setHomepagePlaneTicketsContextData,
  } = useContext(PlaneTicketsContext);

  const fetchData = async () => {
    try {
      if (!homepagePlaneTicketsContextData) {
        const response = await getAirportCities();
        setHomepagePlaneTicketsContextData(response);
      }
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

      <div className="airplane-tickets-menu-items">
        {homepagePlaneTicketsContextData
          ?.filter((airportCity) =>
            isCroatia
              ? airportCity.is_in_croatia == 1
              : airportCity.is_in_croatia != 1
          )
          .map((airportCity) => (
            <DestinationItem
              key={airportCity.id}
              filterMenuItem
              name={airportCity.name}
              planeTickets
              iconUrl={airportCity.flag_url}
            />
          ))}
      </div>
    </div>
  );
};

export default AirplaneTicketsMenuItem;
