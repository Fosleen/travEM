import { useNavigate } from "react-router-dom";
import "./EditTopArticles.scss";
import { useEffect, useState } from "react";
import {
  getArticles,
  getHomepageArticles,
  updateOrCreateTopHomepageArticles,
} from "../../../api/article";
import { ThreeDots } from "react-loader-spinner";
import { ErrorMessage, Field, Form, Formik } from "formik";
import AdvancedDropdown from "../../../components/admin/atoms/AdvancedDropdown";
import Button from "../../../components/atoms/Button";
import Swal from "sweetalert2";
import {
  notifyFailure,
  notifySuccess,
} from "../../../components/atoms/Toast/Toast";

const EditTopArticles = () => {
  const [allArticles, setAllArticles] = useState(null);
  const [favoriteArticles, setFavoriteArticles] = useState<Array<{
    articleTypeId: number;
    id: number;
  }> | null>(null);
  const navigate = useNavigate();
  const fetchData = async () => {
    try {
      const _favoriteArticles = await getHomepageArticles();
      setFavoriteArticles(
        _favoriteArticles.filter(
          (el: { article_special_types: Array<{ id: number }>; id: number }) =>
            el.article_special_types.some(
              (type) => type.id == 1 // 1 = top_homepage_article
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (values: {
    recommended_post_1: number;
    recommended_post_2: number;
    recommended_post_3: number;
  }) => {
    console.log(values);
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Uredit ćete podatke top 3 istaknuta članka.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, objavi!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await updateOrCreateTopHomepageArticles(
            [
              values.recommended_post_1,
              values.recommended_post_2,
              values.recommended_post_3,
            ],
            1 // 1 = top_homepage_article
          );
          notifySuccess("Uspješno ažurirano!");
        } catch (error) {
          console.log(error);
          notifyFailure("Došlo je do greške. Pokušajte ponovo.");
        }
      }
    });
  };

  return (
    <div className="edit-top-homepage-articles-container">
      <h2>Uredi top 3 istaknuta članka</h2>
      {favoriteArticles && allArticles ? (
        <Formik
          initialValues={{
            recommended_post_1: favoriteArticles[0].id,
            recommended_post_2: favoriteArticles[1].id,
            recommended_post_3: favoriteArticles[2].id,
          }}
          onSubmit={handleSave}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="edit-top-homepage-articles-inputs">
                <Field
                  name="recommended_post_1"
                  type="text"
                  selectedValue={values.recommended_post_1}
                  as={AdvancedDropdown}
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
              </div>

              <div className="edit-top-homepage-articles-buttons">
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

export default EditTopArticles;
