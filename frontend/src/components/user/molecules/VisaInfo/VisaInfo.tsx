import { useState } from "react";
import passportImage from "../../../../assets/images/passport-icon.png";
import "./VisaInfo.scss";
import Button from "../../../atoms/Button";

const VisaInfo = () => {
  const [isInfoShown, setInfoShown] = useState(false);

  return (
    <div className="visa-info-container">
      <img src={passportImage} alt="passport-image" />
      <div className="visa-info-text">
        <h2>Provjerite putne isprave</h2>
        <div>TODO dropdown</div>
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
