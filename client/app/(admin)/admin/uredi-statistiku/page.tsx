"use client";

import { getHomepage, updateStats } from "@/api/homepage";
import "./EditStats.scss";
import { HomepageData } from "@/common/types";
import { useEffect, useState } from "react";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import Button from "@/components/atoms/Button";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Input from "@/components/atoms/Input";
import * as Yup from "yup";
import { useRouter } from "next/navigation";

const EditStats = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );
  const router = useRouter();

  const fetchData = async () => {
    try {
      const content = await getHomepage(true);
      setHomepageContent(content);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  const handleCancel = () => {
    router.push("/admin/sadrzaj");
  };

  const handleSave = async (values: {
    flights_nmbr: string;
    videos_nmbr: string;
    distance_nmbr: string;
  }) => {
    try {
      const updatedContent = await updateStats(
        values.flights_nmbr,
        values.videos_nmbr,
        values.distance_nmbr
      );
      setHomepageContent(updatedContent);
      router.push("/admin/sadrzaj");
      notifySuccess("Uspješno ažurirano!");
    } catch (error) {
      console.log(error);
      notifyFailure("Došlo je do greške. Pokušajte ponovo.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ValidationSchema = Yup.object().shape({
    flights_nmbr: Yup.string()
      .max(4, "Najviše 4 znaka!")
      .required("Obavezno polje!"),
    videos_nmbr: Yup.string()
      .max(4, "Najviše 4 znaka!")
      .required("Obavezno polje!"),
    distance_nmbr: Yup.string()
      .max(4, "Najviše 4 znaka!")
      .required("Obavezno polje!"),
  });

  return (
    <div className="edit-stats-container">
      <h2>Uredi statistiku</h2>
      {homepageContent && (
        <Formik
          initialValues={{
            flights_nmbr: homepageContent.flights_nmbr,
            videos_nmbr: homepageContent.videos_nmbr,
            distance_nmbr: homepageContent.distance_nmbr,
          }}
          validationSchema={ValidationSchema}
          onSubmit={handleSave}
        >
          <Form>
            <div className="edit-stats-inputs">
              <Field
                name="flights_nmbr"
                type="text"
                as={Input}
                label="Letova avionom (max 4 znaka) *"
              />
              <ErrorMessage name="flights_nmbr" component="div" />
              <Field
                name="videos_nmbr"
                type="text"
                as={Input}
                label="Videa (max 4 znaka) *"
              />
              <ErrorMessage name="videos_nmbr" component="div" />
              <Field
                name="distance_nmbr"
                type="text"
                as={Input}
                label="Prijeđenih kilometara (max 4 znaka) *"
              />
              <ErrorMessage name="distance_nmbr" component="div" />
            </div>

            <div className="edit-stats-buttons">
              <Button type="submit" adminPrimary>
                spremi promjene
              </Button>
              <Button type="button" white onClick={handleCancel}>
                Odustani
              </Button>
            </div>
          </Form>
        </Formik>
      )}
    </div>
  );
};

export default EditStats;
