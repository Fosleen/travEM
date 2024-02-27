import { CaretRight } from "@phosphor-icons/react";
import DestinationItem from "../../atoms/DestinationItem";
import "./DestinationsMenuItem.scss";
import { Link } from "react-router-dom";
import { FC, useEffect, useState } from "react";
import { getCountriesByContinent } from "../../../../api/countries";

const DestinationsMenuItem: FC<{
  title: string;
  id: number;
}> = ({ title, id }) => {
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const data = await getCountriesByContinent(id);
      setCountries(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  return (
    <div className="destinations-menu-item-container">
      <div className="destinations-menu-item-header">
        <Link to={`/kontinent/${id}`}>
          <h2>{title}</h2>
          <CaretRight size={32} color="#1abb6f" weight="duotone" />
        </Link>
      </div>
      <hr />
      {countries && (
        <div className="destinations-menu-items">
          {countries.map(
            (el: { name: string; flag_image_url: string }, index) => (
              <DestinationItem
                key={index}
                filterMenuItem
                name={el.name}
                iconUrl={el.flag_image_url}
              />
            )
          )}
        </div>
      )}
    </div>
  );
};

export default DestinationsMenuItem;
