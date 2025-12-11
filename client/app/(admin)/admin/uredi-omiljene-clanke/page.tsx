// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import "./EditFavoriteArticles.scss";
import {
  getArticles,
  getHomepageArticles,
  updateOrCreateTopHomepageArticles,
} from "@/utils/article";
import Swal from "sweetalert2";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import { ErrorMessage, Field, Form, Formik } from "formik";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import Button from "@/components/atoms/Button";
import { useRouter } from "next/navigation";

const EditFavoriteArticles = () => {
  const [allArticles, setAllArticles] = useState(null);
  const [favoriteVerticalArticles, setFavoriteVerticalArticles] =
    useState<Array<{
      articleTypeId: number;
      id: number;
    }> | null>(null);
  const [favoriteHorizontalArticles, setFavoriteHorizontalArticles] =
    useState<Array<{
      articleTypeId: number;
      id: number;
    }> | null>(null);
  const router = useRouter();
  const fetchData = async () => {
    try {
      const _favoriteArticles = await getHomepageArticles(true);
      setFavoriteVerticalArticles(
        _favoriteArticles.filter(
          (el: { article_special_types: Array<{ id: number }>; id: number }) =>
            el.article_special_types.some(
              (type) => type.id == 3 // 3 = vertical_homepage_article
            )
        )
      );
      setFavoriteHorizontalArticles(
        _favoriteArticles.filter(
          (el: { article_special_types: Array<{ id: number }>; id: number }) =>
            el.article_special_types.some(
              (type) => type.id == 4 // 4 = horizontal_homepage_article
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
    router.push("/admin/sadrzaj");
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (values: {
    recommended_vertical_post_1: number;
    recommended_vertical_post_2: number;
    recommended_vertical_post_3: number;
    recommended_horizontal_post_1: number;
    recommended_horizontal_post_2: number;
    recommended_horizontal_post_3: number;
    recommended_horizontal_post_4: number;
  }) => {
    console.log(values);
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Uredit ćete podatke omiljenih članaka.",
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
              values.recommended_vertical_post_1,
              values.recommended_vertical_post_2,
              values.recommended_vertical_post_3,
            ],
            3 // 3 = vertical_homepage_article
          );
          await updateOrCreateTopHomepageArticles(
            [
              values.recommended_horizontal_post_1,
              values.recommended_horizontal_post_2,
              values.recommended_horizontal_post_3,
              values.recommended_horizontal_post_4,
            ],
            4 // 4 = horizontal_homepage_article
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
    <div className="edit-favorite-articles-container">
      <h2>Uredi omiljene članke</h2>
      {favoriteHorizontalArticles && favoriteVerticalArticles && allArticles ? (
        <Formik
          initialValues={{
            recommended_horizontal_post_1: favoriteHorizontalArticles[0].id,
            recommended_horizontal_post_2: favoriteHorizontalArticles[1].id,
            recommended_horizontal_post_3: favoriteHorizontalArticles[2].id,
            recommended_horizontal_post_4: favoriteHorizontalArticles[3].id,
            recommended_vertical_post_1: favoriteVerticalArticles[0].id,
            recommended_vertical_post_2: favoriteVerticalArticles[1].id,
            recommended_vertical_post_3: favoriteVerticalArticles[2].id,
          }}
          onSubmit={handleSave}
          enableReinitialize={true}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <div className="edit-favorite-articles-inputs">
                <h3>Omiljeni horizontalni članci *</h3>
                <Field
                  name="recommended_horizontal_post_1"
                  type="text"
                  selectedValue={values.recommended_horizontal_post_1}
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteHorizontalArticles[0].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_horizontal_post_1", value.id);
                  }}
                  filter
                />
                <ErrorMessage name="recommended_post_1" component="div" />
                <Field
                  name="recommended_horizontal_post_2"
                  type="text"
                  selectedValue={values.recommended_horizontal_post_2}
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteHorizontalArticles[1].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_horizontal_post_2", value.id);
                  }}
                  filter
                />
                <ErrorMessage
                  name="recommended_horizontal_post_2"
                  component="div"
                />
                <Field
                  name="recommended_horizontal_post_3"
                  type="text"
                  selectedValue={values.recommended_horizontal_post_3}
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteHorizontalArticles[2].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_horizontal_post_3", value.id);
                  }}
                  filter
                />
                <ErrorMessage
                  name="recommended_horizontal_post_3"
                  component="div"
                />
                <Field
                  name="recommended_horizontal_post_4"
                  type="text"
                  selectedValue={values.recommended_horizontal_post_4}
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteHorizontalArticles[3].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_horizontal_post_4", value.id);
                  }}
                  filter
                />
                <ErrorMessage
                  name="recommended_horizontal_post_4"
                  component="div"
                />
                <h3>Omiljeni vertikalni članci *</h3>
                <Field
                  name="recommended_vertical_post_1"
                  type="text"
                  selectedValue={values.recommended_vertical_post_1}
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteVerticalArticles[0].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_vertical_post_1", value.id);
                  }}
                  filter
                />
                <ErrorMessage name="recommended_post_1" component="div" />
                <Field
                  name="recommended_vertical_post_2"
                  type="text"
                  selectedValue={values.recommended_vertical_post_2}
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteVerticalArticles[1].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_vertical_post_2", value.id);
                  }}
                  filter
                />
                <ErrorMessage
                  name="recommended_vertical_post_2"
                  component="div"
                />
                <Field
                  name="recommended_vertical_post_3"
                  type="text"
                  selectedValue={values.recommended_vertical_post_3}
                  as={AdvancedDropdown}
                  options={allArticles}
                  filterAttribute={"title"}
                  defaultValue={favoriteVerticalArticles[2].id}
                  onChange={(value: { id: number }) => {
                    setFieldValue("recommended_vertical_post_3", value.id);
                  }}
                  filter
                />
                <ErrorMessage
                  name="recommended_vertical_post_3"
                  component="div"
                />
              </div>

              <div className="edit-favorite-articles-buttons">
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
};

export default EditFavoriteArticles;
