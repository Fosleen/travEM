"use client";

import "./EditAirplaneTicketPromo.scss";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import { getArticles } from "@/utils/article";
import {
  getAirplaneTicketPromo,
  updateAirplaneTicketPromo,
} from "@/utils/airplaneTicketPromo";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import * as Yup from "yup";

export default function EditAirplaneTicketPromoPage() {
  const [promoContent, setPromoContent] = useState<any>(null);
  const [allArticles, setAllArticles] = useState<any>(null);
  const router = useRouter();

  const handleCancel = () => {
    router.push("/admin/sadrzaj");
  };

  const handleSave = async (values: any) => {
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Uredit ćete promo na stranici aviokarata.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, objavi!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedContent = await updateAirplaneTicketPromo(
            values.top_text,
            values.middle_text,
            values.button_text,
            values.article_id
          );

          if (typeof updatedContent === "string") {
            throw new Error(updatedContent);
          }

          setPromoContent(updatedContent);
          notifySuccess("Uspješno ažurirano!");
        } catch (error) {
          console.log(error);
          notifyFailure("Došlo je do greške. Pokušajte ponovo.");
        }
      }
    });
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getAirplaneTicketPromo(true),
      getArticles(1, 2000, null, true),
    ])
      .then(([promo, articles]) => {
        if (!isMounted) {
          return;
        }

        setPromoContent(promo);
        setAllArticles(articles.data);
      })
      .catch((error) => {
        console.error(
          "Error occured while fetching airplane promo data:",
          error
        );
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const ValidationSchema = Yup.object().shape({
    top_text: Yup.string()
      .required("Obavezno polje!")
      .max(120, "Gornji tekst smije imati max 120 znakova!"),
    middle_text: Yup.string()
      .required("Obavezno polje!")
      .max(255, "Srednji tekst smije imati max 255 znakova!"),
    button_text: Yup.string()
      .required("Obavezno polje!")
      .max(45, "Tekst gumba smije imati max 45 znakova!"),
    article_id: Yup.number().required("Obavezno polje!"),
  });

  return (
    <div className="edit-airplane-ticket-promo-container">
      <h2>Uredi aviokarte promo</h2>
      {promoContent && allArticles ? (
        <Formik
          initialValues={{
            top_text: promoContent.top_text,
            middle_text: promoContent.middle_text,
            button_text: promoContent.button_text,
            article_id:
              promoContent.article_id || promoContent.featured_article?.id,
          }}
          validationSchema={ValidationSchema}
          onSubmit={handleSave}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="edit-airplane-ticket-promo-inputs">
                <Field
                  name="top_text"
                  as={Textarea}
                  rows={3}
                  label="Gornji tekst *"
                  placeholder="Unesi gornji tekst..."
                />
                <ErrorMessage name="top_text" component="div" />

                <Field
                  name="middle_text"
                  as={Textarea}
                  rows={4}
                  label="Srednji tekst *"
                  placeholder="Unesi srednji tekst..."
                />
                <ErrorMessage name="middle_text" component="div" />

                <Field
                  name="button_text"
                  type="text"
                  as={Input}
                  label="Tekst gumba *"
                  placeholder="Unesi tekst gumba..."
                />
                <ErrorMessage name="button_text" component="div" />

                <Field
                  name="article_id"
                  type="text"
                  selectedValue={values.article_id}
                  as={AdvancedDropdown}
                  label="Featured članak *"
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={
                    promoContent.article_id || promoContent.featured_article?.id
                  }
                  onChange={(value: { id: number }) => {
                    setFieldValue("article_id", value?.id);
                  }}
                  filter
                />
                <ErrorMessage name="article_id" component="div" />
              </div>

              <div className="edit-airplane-ticket-promo-preview">
                {promoContent.featured_article?.main_image_url && (
                  <img
                    src={promoContent.featured_article.main_image_url}
                    alt={promoContent.featured_article.title}
                  />
                )}
              </div>

              <div className="edit-airplane-ticket-promo-buttons">
                <Button type="submit" adminPrimary>
                  spremi promjene
                </Button>
                <Button type="button" white onClick={handleCancel}>
                  Odustani
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
