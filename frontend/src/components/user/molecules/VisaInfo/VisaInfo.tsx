import { useState } from "react";
import passportImage from "../../../../assets/images/passport-icon.png";
import "./VisaInfo.scss";
import Button from "../../../atoms/Button";
import Dropdown from "../../../atoms/Dropdown";

const VisaInfo = () => {
  const [isInfoShown, setInfoShown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS

  const handleCountryChange = (selectedValue) => {
    console.log("nekaj");

    setSelectedCountry(selectedValue);
  };

  const countries = [
    { id: 1, name: "Hrvatska" },
    { id: 2, name: "Slovenija" },
    { id: 3, name: "Bosna i Hercegovina" },
    { id: 4, name: "Srbija" },
    { id: 5, name: "Crna Gora" },
  ];

  return (
    <div className="visa-info-container">
      <img src={passportImage} alt="passport-image" />
      <div className="visa-info-text">
        <h2>Provjerite putne isprave</h2>
        <Dropdown
          hardcodedValue={"--odaberite--"}
          options={countries}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignoreS
          value={selectedCountry}
          onChange={handleCountryChange}
        />
        <Button
          onClick={() => {
            setInfoShown(true);
          }}
          primary
          fitText={false}
        >
          provjeri
        </Button>
      </div>
      {isInfoShown && (
        <div className="visa-info-results">
          <div className="visa-info-result">
            <h4>Putna isprava:</h4>
            <p>Potrebna putovnica</p>
          </div>
          <div className="visa-info-result">
            <h4>Putna viza:</h4>
            <p>Ne.</p>
          </div>
          <div className="visa-info-result">
            <h4>Napomena:</h4>
            <p>Ovo je skupo i dugo se čeka</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisaInfo;
