import MainCountryPost from "../../../components/user/atoms/MainCountryPost";
import DestinationHero from "../../../components/user/molecules/DestinationHero";
import MainCountryInfo from "../../../components/user/atoms/MainCountryInfo/MainCountryInfo";
import "./DestinationCountry.scss";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig";
import CountryPlaces from "../../../components/user/molecules/CountryPlaces";
import CountryHighlight from "../../../components/user/atoms/CountryHighlight";
import VisaInfo from "../../../components/user/molecules/VisaInfo";
import DestinationVideos from "../../../components/user/molecules/DestinationVideos";

const DestinationCountry = () => {
  return (
    <div className="destination-country-page-container">
      <DestinationHero />
      <div className="destination-country-upper-container">
        <div className="destination-country-upper-container-item">
          <MainCountryInfo />
        </div>
        <div className="destination-country-upper-container-item">
          <MainCountryPost />
        </div>
      </div>
      <div className="destination-country-posts-container">
        <h2>Pročitajte naše članke</h2>
        <div className="destination-country-posts">
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
      <div className="destination-country-places-container">
        <CountryPlaces />
      </div>
      <div className="destination-country-highlights-container">
        <CountryHighlight iconNmbr={"1"} />
        <CountryHighlight iconNmbr={"2"} />
      </div>

      <div className="destination-country-visa-info-container">
        <VisaInfo />
      </div>

      <div className="destination-country-videos-container">
        <h2>Vlogovi i video putopisi</h2>
        <div className="destination-country-videos">
          <DestinationVideos />
        </div>
      </div>
      <div className="destination-country-posts-container">
        <h2>Povezani članci</h2>
        <div className="destination-country-posts last">
          <HorizontalPostItemBig thin hasDate={false} />
          <HorizontalPostItemBig thin hasDate={false} />
          <HorizontalPostItemBig thin hasDate={false} />
          <HorizontalPostItemBig thin hasDate={false} />
        </div>
      </div>
    </div>
  );
};

export default DestinationCountry;
