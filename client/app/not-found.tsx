import Image from "next/image";
import Warning from "@/assets/images/country_not_found.png";
import "./NotFound.scss";

const NotFound = () => {
  return (
    <div className="country-not-found-wrapper">
      <h1>Ova stranica ne postoji.</h1>
      <div className="image-container">
        <Image
          src={Warning}
          alt="error-icon"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
};

export default NotFound;
