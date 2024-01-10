import Warning from "../../../assets/images/country_not_found.png";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="country-not-found-wrapper">
      <h1>Nažalost, još nismo posjetili ovu državu.</h1>
      <img src={Warning} alt="error-icon" />
    </div>
  );
};

export default NotFound;
