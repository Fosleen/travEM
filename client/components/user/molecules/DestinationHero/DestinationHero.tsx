import DestinationImage from "../../atoms/DestinationImage";
import "./DestinationHero.scss";

const DestinationHero = ({
  name = "testno",
  description = "testni opis",
  main_image_url = "",
  color = "#d2eb64",
}) => {
  const normalizedName = name.trim().toLowerCase();
  const isCrnaGora = normalizedName === "crna gora";
  const titleColor = String(color).startsWith("#") ? color : `#${color}`;

  return (
    <div className="destination-hero-container">
      <div className="destination-hero-left">
        <div
          className={`destination-hero-titles ${
            isCrnaGora ? "destination-hero-titles--crna-gora" : ""
          }`}
        >
          <h2 className="bold-grey">
            {isCrnaGora ? (
              <>
                CRNA
                <br />
                GORA
              </>
            ) : (
              name.toUpperCase()
            )}
          </h2>

          <h2 className="bold-color" style={{ color: titleColor }}>
            {isCrnaGora ? (
              <>
                CRNA
                <br />
                GORA
              </>
            ) : (
              name.toUpperCase()
            )}
          </h2>

          <h2 className="cursive-black">
            {isCrnaGora ? (
              <>
                Crna
                <br />
                Gora
              </>
            ) : (
              name
            )}
          </h2>
        </div>

        <p className="destination-hero-description">{description}</p>
      </div>

      <div className="destination-hero-right">
        <DestinationImage url={main_image_url} />
      </div>
    </div>
  );
};

export default DestinationHero;