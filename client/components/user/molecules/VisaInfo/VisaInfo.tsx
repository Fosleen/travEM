// @ts-nocheck

import { FC, useEffect, useState } from "react";
import "./VisaInfo.scss";
import AdvancedDropdown from "../../../admin/atoms/AdvancedDropdown";
import { getVisitedCountries } from "../../../../utils/map";
import { checkIfInfoExists } from "../../../../utils/visaInfo";
import { getCountryAccusative } from "../../../../utils/countryGrammar";
import Image from "next/image";

const VisaInfo: FC<{ countryId: number; countryName: string }> = ({
  countryId,
  countryName,
}) => {
  const [isInfoShown, setInfoShown] = useState(false);
  const [isAnimatingChange, setIsAnimatingChange] = useState(false);
  const [visaInfo, setVisaInfo] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isLoadingVisaInfo, setIsLoadingVisaInfo] = useState(false);

  const [visaCountries, setVisaCountries] = useState([
    "Hrvatska",
    "Bosna i Hercegovina",
    "Srbija",
    "Slovenija",
    "Crna Gora",
  ]);

  const countryNameAccusative = getCountryAccusative(countryName);

  const visaDocumentLabelMap: Record<string, string> = {
    Hrvatska: "hrvatske",
    Slovenija: "slovenske",
    Srbija: "srpske",
    "Bosna i Hercegovina": "bosanskohercegovačke",
    "Crna Gora": "crnogorske",
  };

  const getVisaDocumentLabel = (countryName: string): string => {
    return visaDocumentLabelMap[countryName] || countryName;
  };

  const getVisaResponseData = async (countryOption: any) => {
    const response = await checkIfInfoExists(countryId, countryOption.id);

    if (response === true) {
      return {
        documentation: "-",
        visa_needed: "-",
        additional_info: "-",
      };
    }

    return response;
  };

  const handleFetchVisaInfo = async (countryOption: any) => {
    if (!countryOption?.id) return;

    setIsLoadingVisaInfo(true);

    try {
      if (!isInfoShown || !visaInfo) {
        const nextVisaInfo = await getVisaResponseData(countryOption);
        setVisaInfo(nextVisaInfo);
        setInfoShown(true);
        return;
      }

      setIsAnimatingChange(true);

      await new Promise((resolve) => setTimeout(resolve, 180));

      const nextVisaInfo = await getVisaResponseData(countryOption);

      setVisaInfo(nextVisaInfo);

      setTimeout(() => {
        setIsAnimatingChange(false);
      }, 220);
    } catch (error) {
      console.error("Error occured while fetching visa info:", error);
    } finally {
      setIsLoadingVisaInfo(false);
    }
  };

  const fetchData = async () => {
    try {
      const countriesData = await getVisitedCountries();

      const filteredAllCountries = countriesData.map(
        (el: { id: number; flag_image_url: string; name: string }) => ({
          id: el.id,
          url: el.flag_image_url,
          name: getVisaDocumentLabel(el.name),
          originalName: el.name,
        })
      );

      const filteredVisaCountries = filteredAllCountries.filter((i) =>
        visaCountries.includes(i.originalName)
      );

      setVisaCountries(filteredVisaCountries);
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const formatVisaValue = (value: boolean | string) => {
    if (value === "-") return "-";
    if (value === true) return "Da.";
    if (value === false) return "Ne.";
    return value;
  };

  const hasAdditionalInfo = (value: string | null | undefined) => {
    if (value === null || value === undefined) return false;

    const trimmedValue = String(value).trim();

    return trimmedValue !== "" && trimmedValue !== "-";
  };

  const getVisibleVisaResults = () => {
    if (!visaInfo) return [];

    const results = [
      {
        icon: "🪪",
        title: "Dovoljan dokument:",
        value: visaInfo.documentation,
      },
      {
        icon: "🛂",
        title: "Viza:",
        value: formatVisaValue(visaInfo.visa_needed),
      },
    ];

    if (hasAdditionalInfo(visaInfo.additional_info)) {
      results.push({
        icon: "📝",
        title: "Napomena:",
        value: visaInfo.additional_info,
      });
    }

    return results;
  };

  const visibleVisaResults = getVisibleVisaResults();

  return (
    <div className="visa-info-container">
      <div className="visa-info-illustration">
        <Image
          src="/images/passport-icon.png"
          width={321}
          height={321}
          alt="passport-image"
        />
      </div>

      <div className="visa-info-content">
        <div className="visa-info-text">
          <h2>Što vam treba za ulazak u {countryNameAccusative}?</h2>

          <p className="visa-info-helper-text">
            Odaberite svoju državu kako biste vidjeli treba li za{" "}
            {countryNameAccusative} osobna, putovnica, viza ili nešto treće.
          </p>

          <div className="visa-info-dropdown-block">
            <label className="visa-info-label">Koje dokumente imate?</label>

            <div className="dropdown-container">
              <AdvancedDropdown
                images
                hardcodedValue={"Odaberite dokumente"}
                options={visaCountries}
                value={selectedCountry}
                onChange={(value) => {
                  setSelectedCountry(value);

                  handleFetchVisaInfo({
                    ...value,
                    name: value.originalName,
                  });
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={`visa-info-results ${
            isInfoShown && visaInfo ? "visible" : ""
          } ${isAnimatingChange ? "changing" : ""} ${
            isLoadingVisaInfo ? "loading" : ""
          }`}
        >
          {visibleVisaResults.map((result, index) => (
            <div key={result.title} className="visa-info-result-wrapper">
              <div className="visa-info-result">
                <div className="visa-info-result-icon">{result.icon}</div>

                <div className="visa-info-result-text">
                  <h4>{result.title}</h4>
                  <p>{result.value}</p>
                </div>
              </div>

              {index < visibleVisaResults.length - 1 && (
                <div className="visa-info-divider" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VisaInfo;