"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PencilSimpleLine } from "@phosphor-icons/react";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import { PopupContentData } from "@/common/types";
import { getPopupContent, updatePopupImage } from "@/utils/popupContent";
import "./EditPopup.scss";

const EditPopup = () => {
  const [popupContent, setPopupContent] = useState<PopupContentData | null>(null);
  const [isUrlShown, setIsUrlShown] = useState(false);
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    getPopupContent(true)
      .then((content) => {
        setPopupContent(content);
        setUrl(content.image_url);
      })
      .catch((error) => {
        console.error("Error fetching popup content:", error);
        notifyFailure("Došlo je do greške pri učitavanju slike.");
      });
  }, []);

  const handleSave = async () => {
    try {
      const updatedContent = await updatePopupImage(url);
      setPopupContent(updatedContent);
      setIsUrlShown(false);
      notifySuccess("Uspješno ažurirano!");
    } catch (error) {
      console.error(error);
      notifyFailure("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  return (
    <div className="edit-popup-container">
      <h2>Uredi fotografiju newsletter popupa</h2>
      <div className="edit-popup-image-container">
        {popupContent && (
          <img src={popupContent.image_url} alt="Newsletter popup" />
        )}
        {!isUrlShown && (
          <Button edit onClick={() => setIsUrlShown(true)}>
            <PencilSimpleLine size={32} />
          </Button>
        )}
      </div>
      {isUrlShown && (
        <div className="edit-popup-input-container">
          <Input
            placeholder="Unesi URL nove slike..."
            name="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
          />
        </div>
      )}
      <p>* preporuča se vodoravna fotografija</p>
      {isUrlShown && (
        <div className="edit-popup-buttons">
          <Button adminPrimary onClick={handleSave}>
            spremi promjene
          </Button>
          <Button white onClick={() => router.push("/admin/sadrzaj")}>
            odustani
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditPopup;
