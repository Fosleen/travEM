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
import { Plus, X } from "@phosphor-icons/react";
import {
  ArticleType,
  MapCountriesData,
  PlacesData,
} from "../../../common/types";
import image from "../../../assets/images/post-image.jpg";
import ToggleSwitch from "../../../components/admin/atoms/ToggleSwitch/ToggleSwitch";
import { getPlacesByCountry } from "../../../api/places";

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

  const [isMainCountryPostChecked, setIsMainCountryPostChecked] =
    useState(false);
  const [isNotifySubscribersChecked, setIsNotifySubscribersChecked] =
    useState(false);

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

  const handleDeleteSection = () => {
    console.log("delete section");
  };

  const handleDeleteImage = () => {
    console.log("remove image");
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

  const fetchPlacesData = async () => {
    const placesData = await getPlacesByCountry(selectedCountryId);
    setPlaces(placesData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    selectedCountryId && fetchPlacesData();
  }, [selectedCountryId]);

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
          <Form className="add-article-form">
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
                    {selectedCountryId && places && (
                      <Dropdown
                        hardcodedValue={
                          "Odaberi grad ili mjesto o kojem se radi"
                        }
                        onChange={handlePlaceChange}
                        value={selectedPlaceId}
                        isDisabled={false}
                        label="Mjesto članka (opcionalno)"
                        options={places} // TODO add endpoint for places by selected country
                      />
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="add-article-images-container">
              <div className="add-article-item">
                <Plus size={32} color="#616161" weight="bold" />
              </div>
            </div>
            <p>* preporuča se slika u omjeru 16:9</p>

            <div className="add-article-sections-container">
              <h6>Odlomci</h6>
              <fieldset className="add-article-section">
                <legend>Odlomak 1</legend>
                <div className="add-article-section-top">
                  <div className="add-article-section-top-item">
                    <Field
                      name="section_subtitle"
                      type="text"
                      as={Input}
                      label="Podnaslov odlomka (opcionalno)"
                      placeholder="Unesi podnaslov odlomka..."
                    />
                  </div>
                  <div className="add-article-section-top-item">
                    <Dropdown
                      hardcodedValue={"Odaberi..."}
                      options={articleTypes}
                      onChange={handleArticleTypeChange}
                      value={selectedArticleTypeId}
                      label="Vrsta ikone *"
                    />
                  </div>
                </div>
                <Field
                  name="section_subtitle"
                  type="text"
                  as={Input}
                  label="Tekst odlomka *"
                  placeholder="Unesi tekst odlomka..."
                />
                <div className="add-article-section-bottom">
                  <Field
                    name="section_subtitle"
                    type="text"
                    as={Input}
                    label="Naslov poveznice (opcionalno)"
                    placeholder="Unesi naslov poveznice..."
                  />
                  <Field
                    name="section_subtitle"
                    type="text"
                    as={Input}
                    label="Poveznica (opcionalno)"
                    placeholder="Unesi link poveznice..."
                  />
                </div>
                <div className="add-article-bottom-container">
                  <div className="add-article-images-container">
                    <div
                      className="add-article-image"
                      onClick={handleDeleteImage}
                    >
                      <div className="add-article-image-remove-icon">
                        <X size={32} color="#e70101" weight="bold" />
                      </div>
                      <img src={image} alt="selected-image" />
                    </div>
                    <div className="add-article-item">
                      <Plus size={32} color="#616161" weight="bold" />
                    </div>
                  </div>
                  <Button type="button" red onClick={handleDeleteSection}>
                    izbriši odlomak
                  </Button>
                </div>
              </fieldset>
              <Button type="button" primary onClick={handleDeleteSection}>
                dodaj odlomak
              </Button>
            </div>
            <div className="add-article-gallery-container">
              <h6>Preostale fotografije na članku:</h6>
              <div className="add-article-images-container">
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>{" "}
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>{" "}
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>{" "}
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>{" "}
                <div className="add-article-image" onClick={handleDeleteImage}>
                  <div className="add-article-image-remove-icon">
                    <X size={32} color="#e70101" weight="bold" />
                  </div>
                  <img src={image} alt="selected-image" />
                </div>
                <div className="add-article-images-container">
                  <div className="add-article-item">
                    <Plus size={32} color="#616161" weight="bold" />
                  </div>
                </div>
              </div>
            </div>
            <div className="add-article-toggle-container">
              <div className="add-article-toggle-item">
                <ToggleSwitch
                  name={"main-country-post"}
                  description={"Dodaj članak kao glavni za državu"}
                  value={isMainCountryPostChecked}
                  setter={setIsMainCountryPostChecked}
                />
              </div>
              <div className="add-article-toggle-item">
                <ToggleSwitch
                  name={"notify-subscribers"}
                  description={"Obavijesti pretplatnike o ovom članku"}
                  value={isNotifySubscribersChecked}
                  setter={() =>
                    setIsNotifySubscribersChecked(!isNotifySubscribersChecked)
                  }
                />
              </div>
            </div>

            <div className="add-article-buttons">
              <Button type="submit" adminPrimary>
                objavi članak
              </Button>
              {/* TODO add sweetalert before publish */}
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
