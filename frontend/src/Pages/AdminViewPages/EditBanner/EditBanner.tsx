import "./EditBanner.scss";
import Button from "../../../components/atoms/Button";
import { useEffect, useState } from "react";
import { EditBannerData, HomepageData } from "../../../common/types";
import { getHomepage, updateBanner } from "../../../api/homepage";
import Input from "../../../components/atoms/Input";
import { useNavigate } from "react-router-dom";
import {
  notifyFailure,
  notifySuccess,
} from "../../../components/atoms/Toast/Toast";
import { ErrorMessage, Field, Form, Formik } from "formik";

const EditBanner = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const content = await getHomepage();
      setHomepageContent(content);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin/sadržaj");
  };

  const handleSave = async (values: EditBannerData) => {
    try {
      const updatedContent = await updateBanner(
        values.banner_title,
        values.banner_small_text,
        values.banner_description,
        values.button_text,
        values.banner_image_url
      );
      setHomepageContent(updatedContent);
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
    <div className="edit-banner-container">
      <h2>Uredi ravni banner i preporučene članke</h2>
      {homepageContent && (
        <Formik
          initialValues={{
            banner_title: homepageContent.banner_title,
            banner_small_text: homepageContent.banner_small_text,
            banner_description: homepageContent.banner_description,
            button_text: homepageContent.button_text,
            banner_image_url: homepageContent.banner_image_url,
          }}
          validator={(values: EditBannerData) => {
            const errors: EditBannerData = {
              banner_title: "",
              banner_small_text: "",
              banner_description: "",
              button_text: "",
              banner_image_url: "",
            };
            if (!values.banner_title) {
              errors.banner_title = "Unesi veliki naslov bannera!";
            }
            if (!values.banner_small_text) {
              errors.banner_small_text = "Unesi sitan naslov bannera!";
            }
            if (!values.banner_description) {
              errors.banner_description = "Unesi opis bannera!";
            }
            if (!values.button_text) {
              errors.button_text = "Unesi tekst gumba bannera!";
            }
            if (!values.banner_image_url) {
              errors.banner_image_url = "Unesi URL pozadinske slike bannera!";
            }

            return errors;
          }}
          onSubmit={handleSave}
        >
          <Form>
            <div className="edit-banner-inputs">
              <Field
                name="banner_small_text"
                type="text"
                as={Input}
                label="Sitan naslov *"
              />
              <ErrorMessage name="banner_small_text" component="div" />
              <Field
                name="banner_title"
                type="text"
                as={Input}
                label="Veliki naslov *"
              />
              <Field
                name="banner_description"
                type="text"
                as={Input}
                label="Tekst odlomka *"
              />
              <Field
                name="button_text"
                type="text"
                as={Input}
                label="Tekst gumba *"
              />
              <Field
                name="banner_image_url"
                type="text"
                as={Input}
                label="URL slike bannera *"
              />
              <Field
                name="recommended_post_1"
                type="text"
                as={Input}
                label="Preporučeni članci *"
              />
              <Field name="recommended_post_2" type="text" as={Input} />
              <Field name="recommended_post_3" type="text" as={Input} />
            </div>
            <div className="edit-banner-image-container">
              <img
                src={homepageContent.banner_image_url}
                alt="problem-with-banner-image"
              />
            </div>
            <div className="edit-banner-buttons">
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

export default EditBanner;
