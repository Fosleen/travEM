import { useEffect, useState } from "react";
import Button from "../../../components/atoms/Button";
import "./EditHero.scss";
import { HomepageData } from "../../../common/types";
import { getHomepage, updateHeroImage } from "../../../api/homepage";
import { PencilSimpleLine } from "@phosphor-icons/react";
import Input from "../../../components/atoms/Input";
import { useNavigate } from "react-router-dom";
import {
  notifyFailure,
  notifySuccess,
} from "../../../components/atoms/Toast/Toast";

const EditHero = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );
  const navigate = useNavigate();
  const [isUrlShown, setIsUrlShown] = useState(false);
  const [url, setUrl] = useState("");

  const fetchData = async () => {
    try {
      const content = await getHomepage();
      setHomepageContent(content);
      setUrl(content.hero_image_url);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin/sadržaj");
  };

  const handleSave = async () => {
    try {
      const updatedContent = await updateHeroImage(url);
      setHomepageContent(updatedContent);
      setIsUrlShown(false);
      notifySuccess("Uspješno ažurirano!");
    } catch (error) {
      console.log(error);
      notifyFailure("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="edit-hero-container">
      <h2>Uredi naslovnu fotografiju</h2>
      <div className="edit-hero-image-container">
        <img
          src={homepageContent?.hero_image_url}
          alt="greska-s-prikazom-ili-vrstom-slike"
        />
        {!isUrlShown && (
          <Button
            edit
            onClick={() => {
              setIsUrlShown(true);
            }}
          >
            <PencilSimpleLine size={32} />
          </Button>
        )}
      </div>
      {isUrlShown && (
        <div className="edit-hero-input-container">
          <Input
            placeholder="Unesi URL nove slike..."
            name="url"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
        </div>
      )}
      <p>* preporuča se slika u omjeru 16:9</p>
      {isUrlShown && (
        <div className="edit-hero-buttons">
          <Button adminPrimary onClick={handleSave}>
            spremi promjene
          </Button>
          <Button white onClick={handleCancel}>
            odustani
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditHero;
