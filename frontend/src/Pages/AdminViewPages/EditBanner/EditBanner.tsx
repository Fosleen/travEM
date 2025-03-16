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
import AdvancedDropdown from "../../../components/admin/atoms/AdvancedDropdown";
import {
  getArticles,
  getHomepageArticles,
  updateOrCreateTopHomepageArticles,
} from "../../../api/article";
import { ThreeDots } from "react-loader-spinner";
import Swal from "sweetalert2";

const EditBanner = () => {
  const [homepageContent, setHomepageContent] = useState<HomepageData | null>(
    null
  );
  const [allArticles, setAllArticles] = useState(null);
  const [favoriteArticles, setFavoriteArticles] = useState<Array<{
    articleTypeId: number;
    id: number;
  }> | null>(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const content = await getHomepage(true);
      setHomepageContent(content);
      const _favoriteArticles = await getHomepageArticles(true);
      setFavoriteArticles(
        _favoriteArticles.filter(
          (el: { article_special_types: Array<{ id: number }>; id: number }) =>
            el.article_special_types.some(
              (type) => type.id == 5 // 5 = banner_homepage_article)
            )
        )
      );
      const _allArticles = await getArticles(1, 2000);
      setAllArticles(_allArticles.data);
    } catch (error) {
      console.error("Error occured while fetching homepage data:", error);
    }
  };

  const handleCancel = () => {
    navigate("/admin/sadržaj");
  };

  const handleSave = async (values: EditBannerData) => {
    console.log(values);
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Uredit ćete podatke u banneru.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, objavi!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const updatedContent = await updateBanner(
            values.banner_title,
            values.banner_small_text,
            values.banner_description,
            values.button_text,
            values.banner_image_url,
            values.button_url
          );
          await updateOrCreateTopHomepageArticles(
            [
              values.recommended_post_1,
              values.recommended_post_2,
              values.recommended_post_3,
            ],
            5 // 5 = banner_homepage_article
          );

          setHomepageContent(updatedContent);
          notifySuccess("Uspješno ažurirano!");
        } catch (error) {
          console.log(error);
          notifyFailure("Došlo je do greške. Pokušajte ponovo.");
        }
      }
    });
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
    button_url: Yup.string().required("Obavezno polje!"),
    button_text: Yup.string()
      .required("Obavezno polje!")
      .max(45, "Gumb smije imati max 45 znakova!"),
    banner_image_url: Yup.string().required("Obavezno polje!"),
  });

  return (
    <div className="edit-banner-container">
      <h2>Uredi ravni banner i preporučene članke</h2>
      {homepageContent && favoriteArticles && allArticles ? (
        <Formik
          initialValues={{
            banner_title: homepageContent.banner_title,
            banner_small_text: homepageContent.banner_small_text,
            banner_description: homepageContent.banner_description,
            button_url: homepageContent.button_url,
            button_text: homepageContent.button_text,
            banner_image_url: homepageContent.banner_image_url,
            recommended_post_1: favoriteArticles[0].id,
            recommended_post_2: favoriteArticles[1].id,
            recommended_post_3: favoriteArticles[2].id,
          }}
          validationSchema={ValidationSchema}
          onSubmit={handleSave}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
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
                  selectedValue={values.recommended_post_1}
                  as={AdvancedDropdown}
                  label="Preporučeni članci *"
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteArticles[0].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_post_1", value.id);
                  }}
                  filter
                />
                <ErrorMessage name="recommended_post_1" component="div" />
                <Field
                  filter
                  value={values.recommended_post_2}
                  name="recommended_post_2"
                  type="text"
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteArticles[1].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_post_2", value.id);
                  }}
                />
                <ErrorMessage name="recommended_post_3" component="div" />
                <Field
                  filter
                  value={values.recommended_post_3}
                  name="recommended_post_3"
                  type="text"
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteArticles[2].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_post_3", value.id);
                  }}
                />
                <ErrorMessage name="recommended_post_3" component="div" />
                <Field
                  name="button_url"
                  type="text"
                  as={Input}
                  label="Klik na gumb vodi na: *"
                />
                <ErrorMessage name="button_url" component="div" />
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
          )}
        </Formik>
      ) : (
        <ThreeDots
          height="80"
          width="80"
          radius="8"
          color="#2BAC82"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ justifyContent: "center" }}
          visible={true}
        />
      )}
    </div>
  );
};

export default EditBanner;
