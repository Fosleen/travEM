import Warning from "../../../assets/images/country_not_found.png";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="country-not-found-wrapper">
      <h1>Na žalost još nismo posjetili ovu državu</h1>
      <img src={Warning} alt="" />
    </div>
  );
};

export default NotFound;
