// @ts-nocheck

import { FC, useEffect, useState } from "react";
import passportImage from "../../../../assets/images/passport-icon.png";
import "./VisaInfo.scss";
import Button from "../../../atoms/Button";
import AdvancedDropdown from "../../../admin/atoms/AdvancedDropdown";
import { getVisitedCountries } from "../../../../api/map";
import { checkIfInfoExists } from "../../../../api/visaInfo";
import { Info } from "@phosphor-icons/react";

const VisaInfo: FC<{ countryId: number; countryName: string }> = ({
  countryId,
  countryName,
}) => {
  const [isInfoShown, setInfoShown] = useState(false);
  const [visaInfo, setVisaInfo] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [visaCountries, setVisaCountries] = useState([
    "Hrvatska",
    "Bosna i Hercegovina",
    "Srbija",
    "Slovenija",
    "Crna Gora",
  ]);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

  const handleClick = async () => {
    const response = await checkIfInfoExists(countryId, selectedCountry.id);
    console.log(response);
    if (response === true) {
      setVisaInfo({
        documentation: "-",
        visa_needed: "-",
        additional_info: "-",
      });
    } else {
      setVisaInfo(response);
    }
    setInfoShown(true);
  };

  const fetchData = async () => {
    try {
      const countriesData = await getVisitedCountries();
      const filteredAllCountries = countriesData.map(
        (el: { id: number; flag_image_url: string; name: string }) => ({
          id: el.id,
          url: el.flag_image_url,
          name: el.name,
        })
      );

      const filteredVisaCountries = filteredAllCountries.filter((i) =>
        visaCountries.includes(i.name)
      );

      setVisaCountries(filteredVisaCountries);
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="visa-info-container">
      <img src={passportImage} alt="passport-image" />
      <div className="visa-info-text">
        <div className="visa-info-title-container">
          <h2>Provjerite putne isprave</h2>
          <span
            className="icon-wrapper"
            onClick={toggleTooltip}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <Info size={24} weight="duotone" />
            {tooltipVisible && (
              <span className="tooltip">
                Odaberite državu čije dokumente/putne isprave posjedujete kako
                biste provjerili što Vam treba za ulazak u državu {countryName}.
              </span>
            )}
          </span>
        </div>
        <div className="dropdown-container">
          <AdvancedDropdown
            images
            hardcodedValue={"Odaberi državu..."}
            options={visaCountries}
            value={selectedCountry}
            onChange={(value) => setSelectedCountry(value)}
          />
        </div>
        <Button
          onClick={() => {
            handleClick();
          }}
          primary
          fitText={false}
        >
          provjeri
        </Button>
      </div>
      {isInfoShown && visaInfo && (
        <div className="visa-info-results">
          <div className="visa-info-result">
            <h4>Putna isprava:</h4>
            <p>{visaInfo.documentation}</p>
          </div>
          <div className="visa-info-result">
            <h4>Putna viza:</h4>
            <p>
              {visaInfo.visa_needed == "-"
                ? "-"
                : visaInfo.visa_needed
                ? "Da."
                : "Ne."}
            </p>
          </div>
          <div className="visa-info-result">
            <h4>Napomena:</h4>
            <p>{visaInfo.additional_info}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaInfo;
