import { CaretRight } from "@phosphor-icons/react";
import DestinationItem from "../../atoms/DestinationItem";
import "./DestinationsMenuItem.scss";
import Link from "next/link";
import { FC, useContext, useEffect, useState } from "react";
import { getCountriesByContinent } from "../../../../api/countries";
import { CountryContext } from "../../../../Context/CountryContext";

const DestinationsMenuItem: FC<{
  title: string;
  id: number;
}> = ({ title, id }) => {
  const [countries, setCountries] = useState([]);
  const {
    countriesByContinentContextData,
    setCountriesByContinentContextData,
  } = useContext(CountryContext);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let data: any = [];

      if (!countriesByContinentContextData) {
        data = await getCountriesByContinent(id);
        setCountriesByContinentContextData((prevState) => [
          ...(prevState || []),
          {
            id: id,
            data: data,
          },
        ]);
      } else {
        const continentData = countriesByContinentContextData.find(
          (el) => el.id === id
        );
        if (continentData) {
          data = continentData.data;
        }
      }
      setCountries(data);
    } catch (error) {
      console.error("Error while fetching:", error);
    }
  };

  return (
    <div className="destinations-menu-item-container">
      <div className="destinations-menu-item-header">
        <Link href={`/kontinent/${id}`}>
          <h2>{title}</h2>
          <CaretRight size={32} color="#1abb6f" weight="duotone" />
        </Link>
      </div>
      <hr />
      {countries && (
        <div className="destinations-menu-items">
          {countries
            .sort(
              (
                a: { name: string; flag_image_url: string },
                b: { name: string; flag_image_url: string }
              ) => a.name.localeCompare(b.name)
            )
            .map((el: { name: string; flag_image_url: string }, index) => (
              <DestinationItem
                key={index}
                filterMenuItem
                name={el.name}
                iconUrl={el.flag_image_url}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default DestinationsMenuItem;
