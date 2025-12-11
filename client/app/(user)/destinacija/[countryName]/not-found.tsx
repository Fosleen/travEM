import Image from "next/image";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="country-not-found-wrapper">
      <h1>Nažalost, još nismo posjetili ovu državu.</h1>
      <div className="image-container">
        <Image
          src="/images/country_not_found.png"
          alt="error-icon"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default NotFound;
