"use client";

import { useEffect, useState } from "react";
import Button from "@/components/atoms/Button";
import "./EditHero.scss";
import { getHomepage, updateHeroImage } from "@/utils/homepage";
import Input from "@/components/atoms/Input";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import { useRouter } from "next/navigation";
import HeroCropPreview from "./HeroCropPreview";
import { defaultHeroImageCrop, type HeroImageCrop } from "@/utils/heroImageCrop";

const EditHero = () => {
  const [savedUrl, setSavedUrl] = useState<string | null>(null);
  const router = useRouter();
  const [isUrlShown, setIsUrlShown] = useState(false);
  const [url, setUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [crop, setCrop] = useState<HeroImageCrop>(defaultHeroImageCrop);

  const fetchData = async () => {
    try {
      const content = await getHomepage(true);
      if (!content || typeof content !== "object") throw new Error("Homepage data unavailable");
      const imageUrl = content.hero_image_url ?? "";
      setSavedUrl(imageUrl);
      setUrl(imageUrl);
      setCrop(content.hero_image_crop ?? defaultHeroImageCrop);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
      notifyFailure("Naslovnu fotografiju nije moguće učitati.");
    }
  };

  const handleCancel = () => {
    router.push("/admin/sadrzaj");
  };

  const handleSave = async () => {
    const imageUrl = url.trim();
    if (!imageUrl || isSaving) return;
    setIsSaving(true);
    try {
      const updatedContent = await updateHeroImage(imageUrl, crop);
      if (updatedContent?.hero_image_url !== imageUrl || !updatedContent.hero_image_crop) {
        throw new Error("Hero image update failed");
      }
      setSavedUrl(imageUrl);
      setUrl(imageUrl);
      setIsUrlShown(false);
      notifySuccess("Uspješno ažurirano!");
    } catch (error) {
      console.log(error);
      notifyFailure("Došlo je do greške. Pokušajte ponovo.");
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="edit-hero-container">
      <h2>Uredi naslovnu fotografiju</h2>
      {!isUrlShown && savedUrl !== null && (
        <div>
          <Button adminPrimary onClick={() => setIsUrlShown(true)}>
            Promijeni fotografiju
          </Button>
        </div>
      )}
      {isUrlShown && (
        <div className="edit-hero-input-container">
          <label htmlFor="hero-image-url">URL naslovne fotografije</label>
          <Input
            placeholder="Unesi URL nove slike..."
            name="hero-image-url"
            value={url}
            disabled={isSaving}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
          />
        </div>
      )}
      <HeroCropPreview
        url={isUrlShown ? url.trim() : savedUrl ?? ""}
        crop={crop}
        editable={isUrlShown && !isSaving}
        onChange={(device, frameCrop) => setCrop((previous) => ({ ...previous, [device]: frameCrop }))}
      />
      {isUrlShown && (
        <div className="edit-hero-buttons">
          <Button adminPrimary disabled={!url.trim() || isSaving} onClick={handleSave}>
            spremi promjene
          </Button>
          <Button white disabled={isSaving} onClick={handleCancel}>
            odustani
          </Button>
        </div>
      )}
    </div>
  );
};

export default EditHero;
