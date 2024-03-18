import { ThreeDots } from "react-loader-spinner";
import { getContinents } from "../../../../api/continents";
import {
  ContinentsData,
  DestinationsMenuProps,
} from "../../../../common/types";
import DestinationsMenuItem from "../../molecules/DestinationsMenuItem";
import "./DestinationsMenu.scss";
import { FC, useContext, useEffect, useState } from "react";
import { ContinentContext } from "../../../../Context/ContinentContext";

const DestinationsMenu: FC<DestinationsMenuProps> = ({
  setIsDestinationsMenuShown,
}) => {
  const { continentsContextData, setContinentsContextData } =
    useContext(ContinentContext);

  const [continents, setContinents] = useState<Array<ContinentsData> | null>(
    null
  );

  const handleMouseLeave = () => {
    if (setIsDestinationsMenuShown) {
      setIsDestinationsMenuShown(false);
    }
  };

  useEffect(() => {
    if (!continentsContextData) {
      fetchData();
    } else {
      setContinents(continentsContextData);
    }
  }, []);

  const fetchData = async () => {
    try {
      const _continentsData = await getContinents();
      setContinents(_continentsData);
      setContinentsContextData(_continentsData);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  return (
    <div
      className="destinations-menu-container"
      onMouseLeave={handleMouseLeave}
    >
      {continents ? (
        <>
          {continents.map((el, index) => (
            <DestinationsMenuItem title={el.name} id={el.id} key={index} />
          ))}
        </>
      ) : (
        <ThreeDots
          height="80"
          width="80"
          radius="8"
          color="#2BAC82"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ justifyContent: "center" }}
          visible={true}
        />
      )}
    </div>
  );
};

export default DestinationsMenu;
