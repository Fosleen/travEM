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
import * as Yup from "yup";

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
      navigate("/admin/sadržaj");
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
    banner_title: Yup.string()
      .required("Obavezno polje!")
      .max(45, "Naslov smije imati max 45 znakova!"),
    banner_small_text: Yup.string()
      .required("Obavezno polje!")
      .max(45, "Sitan naslov smije imati max 45 znakova!"),
    banner_description: Yup.string()
      .required("Obavezno polje!")
      .max(200, "Tekst smije imati max 200 znakova!"),
    button_text: Yup.string()
      .required("Obavezno polje!")
      .max(45, "Gumb smije imati max 45 znakova!"),
    banner_image_url: Yup.string().required("Obavezno polje!"),
  });

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
          validationSchema={ValidationSchema}
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
              <ErrorMessage name="banner_title" component="div" />
              <Field
                name="banner_description"
                type="text"
                as={Input}
                label="Tekst odlomka *"
              />
              <ErrorMessage name="banner_description" component="div" />
              <Field
                name="button_text"
                type="text"
                as={Input}
                label="Tekst gumba *"
              />
              <ErrorMessage name="button_text" component="div" />
              <Field
                name="banner_image_url"
                type="text"
                as={Input}
                label="URL slike bannera *"
              />
              <ErrorMessage name="banner_image_url" component="div" />
              <Field
                name="recommended_post_1"
                type="text"
                as={Input}
                label="Preporučeni članci *"
              />
              <ErrorMessage name="recommended_post_1" component="div" />
              <Field name="recommended_post_2" type="text" as={Input} />
              <ErrorMessage name="recommended_post_2" component="div" />
              <Field name="recommended_post_3" type="text" as={Input} />
              <ErrorMessage name="recommended_post_3" component="div" />
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
