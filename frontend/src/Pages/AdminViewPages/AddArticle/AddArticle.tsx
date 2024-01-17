import { ErrorMessage, Field, Form, Formik } from "formik";
import "./AddArticle.scss";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import { useEffect, useState } from "react";
import { getArticleTypes } from "../../../api/articleTypes";
import Dropdown from "../../../components/atoms/Dropdown";
import { getVisitedCountries } from "../../../api/map";
import {
  ArticleType,
  MapCountriesData,
  PlacesData,
} from "../../../common/types";

const AddArticle = () => {
  const navigate = useNavigate();
  const [articleTypes, setArticleTypes] = useState("");
  const [countries, setCountries] = useState<MapCountriesData | string>("");
  const [places, setPlaces] = useState<PlacesData | string>("");
  const [selectedArticleTypeId, setSelectedArticleTypeId] = useState<
    number | string
  >("");
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState("");

  const ValidationSchema = Yup.object().shape({
    article_title: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Naslov smije imati max 100 znakova!"),
  });

  const handleSave = async (values) => {
    console.log("dodaj");
  };

  const handleCancel = () => {
    navigate("/admin/članci");
  };

  const handleCountryChange = (selectedValue) => {
    setSelectedCountryId(selectedValue);
  };

  const handleArticleTypeChange = (selectedValue) => {
    setSelectedArticleTypeId(selectedValue);
  };

  const handlePlaceChange = (selectedValue) => {
    setSelectedPlaceId(selectedValue);
  };

  const fetchData = async () => {
    try {
      const articleTypesData = await getArticleTypes();
      const countriesData = await getVisitedCountries();

      setArticleTypes(articleTypesData);
      setCountries(countriesData);
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="add-article-container">
      <h2>Unesi novi članak</h2>
      {articleTypes && countries && (
        <Formik
          initialValues={{
            article_title: "",
            article_subtitle: "",
            article_description: "",
          }}
          validationSchema={ValidationSchema}
          onSubmit={handleSave}
        >
          <Form>
            <div className="add-article-inputs">
              <Field
                name="article_title"
                type="text"
                as={Input}
                label="Naslov članka *"
                placeholder="Unesi naslov..."
              />
              <ErrorMessage name="article_title" component="div" />
              <Field
                name="article_subtitle"
                type="text"
                as={Input}
                label="Podaslov članka *"
                placeholder="Opis članka u par riječi..."
              />
              <ErrorMessage name="article_subtitle" component="div" />
              <Field // TODO change to textarea
                name="article_description"
                type="text"
                as={Input}
                label="Opis članka *"
                placeholder="Opis članka u nekoliko rečenica..."
              />
              <ErrorMessage name="article_description" component="div" />
              <div className="add-article-dropdowns">
                <Dropdown
                  hardcodedValue={"Odaberi u kojem će se meniju prikazivat"}
                  options={articleTypes}
                  onChange={handleArticleTypeChange}
                  value={selectedArticleTypeId}
                  label="Vrsta članka *"
                />
                <ErrorMessage name="article_type" component="div" />
                <Field
                  name="article_type"
                  as={Input}
                  label="Videozapis (opcionalno) "
                  placeholder={"Unesi link videa"}
                />
                <ErrorMessage name="article_type" component="div" />
                {selectedArticleTypeId == 1 && (
                  <>
                    <Dropdown
                      hardcodedValue={"Odaberi državu o kojoj se radi"}
                      options={countries}
                      value={selectedCountryId}
                      onChange={handleCountryChange}
                      isDisabled={false}
                      label="Država članka (opcionalno)"
                    />
                    {selectedCountryId && (
                      <Dropdown
                        hardcodedValue={
                          "Odaberi grad ili mjesto o kojem se radi"
                        }
                        onChange={handleCountryChange}
                        value={selectedPlaceId}
                        isDisabled={false}
                        label="Mjesto članka (opcionalno)"
                        options={countries} // TODO add endpoint for places by selected country
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="add-article-image-container"></div>
            <div className="add-article-buttons">
              <Button type="submit" adminPrimary>
                objavi članak
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

export default AddArticle;
