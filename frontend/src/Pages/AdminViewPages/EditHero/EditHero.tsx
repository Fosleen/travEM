import { useEffect, useState } from "react";
import Button from "../../../components/atoms/Button";
import "./EditHero.scss";
import { HomepageData } from "../../../common/types";
import { getHomepage } from "../../../api/homepage";
import { PencilSimpleLine } from "@phosphor-icons/react";

const EditHero = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );

  const fetchData = async () => {
    try {
      const content = await getHomepage();
      setHomepageContent(content);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="edit-hero-container">
      <h2>Uredi naslovnu fotografiju</h2>
      <div className="edit-hero-image-container">
        <img src={homepageContent?.hero_image_url} alt="hero-image" />
        <Button edit>
          <PencilSimpleLine size={32} />
        </Button>
      </div>
      <p>*preporuča se slika u omjeru 16:9</p>
      <div className="edit-hero-buttons">
        <Button adminPrimary>spremi promjene</Button>
        <Button white>odustani</Button>
      </div>
    </div>
  );
};

export default EditHero;
