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
      // Prvi odabir: samo prikaži sadržaj normalno
      if (!isInfoShown || !visaInfo) {
        const nextVisaInfo = await getVisaResponseData(countryOption);
        setVisaInfo(nextVisaInfo);
        setInfoShown(true);
        return;
      }

      // Kod promjene države:
      // 1. pokreni fade-out / refresh animaciju starog sadržaja
      setIsAnimatingChange(true);

      // 2. pričekaj da stari sadržaj “izađe”
      await new Promise((resolve) => setTimeout(resolve, 180));

      // 3. dohvati novi sadržaj
      const nextVisaInfo = await getVisaResponseData(countryOption);

      // 4. ubaci novi sadržaj dok je animacija još aktivna
      setVisaInfo(nextVisaInfo);

      // 5. kratko zadrži animaciju da se novi sadržaj lijepo pokaže
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
          {visaInfo && (
            <>
              <div className="visa-info-result">
                <div className="visa-info-result-icon">🪪</div>
                <div className="visa-info-result-text">
                  <h4>Dovoljan dokument:</h4>
                  <p>{visaInfo.documentation}</p>
                </div>
              </div>

              <div className="visa-info-divider" />

              <div className="visa-info-result">
                <div className="visa-info-result-icon">🛂</div>
                <div className="visa-info-result-text">
                  <h4>Viza:</h4>
                  <p>{formatVisaValue(visaInfo.visa_needed)}</p>
                </div>
              </div>

              <div className="visa-info-divider" />

              <div className="visa-info-result">
                <div className="visa-info-result-icon">📝</div>
                <div className="visa-info-result-text">
                  <h4>Napomena:</h4>
                  <p>{visaInfo.additional_info}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VisaInfo;