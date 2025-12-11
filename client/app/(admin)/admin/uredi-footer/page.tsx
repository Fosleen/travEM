// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { FooterData, Nullable } from "@/common/types";
import "./EditFooter.scss";
import { getFooter, updateFooter } from "@/utils/footer";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import { PencilSimpleLine } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

const EditFooter = () => {
  const [footerContent, setFooterContent] =
    useState<Nullable<FooterData>>(null);
  const router = useRouter();
  const [isUrlShown, setIsUrlShown] = useState(false);
  const [url, setUrl] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const content = await getFooter(true);
      setFooterContent(content);
      setUrl(content.image_url);
    } catch (error) {
      console.error("Error occured while fetching footer data:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/sadrzaj");
  };

  const handleSave = async () => {
    try {
      const updatedContent = await updateFooter(url);
      setFooterContent(updatedContent);
      setIsUrlShown(false);
      notifySuccess("Uspješno ažurirano!");
    } catch (error) {
      console.log(error);
      notifyFailure("Došlo je do greške. Pokušajte ponovo.");
    }
  };
  return (
    <div className="edit-footer-container">
      <h2>Uredi fotografiju u footeru</h2>
      <div className="edit-footer-image-container">
        <img
          src={footerContent?.image_url}
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
        <div className="edit-footer-input-container">
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
      <p>* preporuča se slika u omjeru 1:1 (ili okomita)</p>
      {isUrlShown && (
        <div className="edit-footer-buttons">
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

export default EditFooter;
