import DestinationsMap from "../../../components/organisms/DestinationsMap/DestinationsMap";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";

import "./Continent.scss";

const Continent = () => {
  return (
    <div className="continent-page-wrapper">
      <div className="continent-text-wrapper">
        <h2>Azija</h2> {/*ovo bu se dobivalo prek use params*/}
      </div>
      <DestinationsMap initialLatitude={49.1382} initialLongitude={87.848} />
      <div className="continent-page-recommended-wrapper">
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
        <HorizontalPostItemBig thin hasDate={false} />
      </div>
    </div>
  );
};

export default Continent;
