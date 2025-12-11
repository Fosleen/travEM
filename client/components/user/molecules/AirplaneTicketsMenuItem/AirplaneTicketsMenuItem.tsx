import { FC, useContext, useEffect } from "react";
import DestinationItem from "../../atoms/DestinationItem";
import "./AirplaneTicketsMenuItem.scss";
import { getAirportCities } from "../../../../utils/airportCities";
import { PlaneTicketsContext } from "@/context/PlaneTicketsMenuContext";
import { AirplaneTicketsMenuItemProps } from "@/common/types";

const AirplaneTicketsMenuItem: FC<AirplaneTicketsMenuItemProps> = ({
  title,
  isCroatia,
}) => {
  const {
    homepagePlaneTicketsContextData,
    setHomepagePlaneTicketsContextData,
  } = useContext(PlaneTicketsContext);

  const fetchData = async () => {
    try {
      if (!homepagePlaneTicketsContextData) {
        const response = await getAirportCities();
        console.log("res", response);

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
              ? airportCity.is_in_croatia == true
              : airportCity.is_in_croatia != true
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
