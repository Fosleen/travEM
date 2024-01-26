import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import "./AddArticle.scss";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/atoms/Input";
import Button from "../../../components/atoms/Button";
import { useEffect, useRef, useState } from "react";
import { getArticleTypes } from "../../../api/articleTypes";
import Dropdown from "../../../components/atoms/Dropdown";
import { getVisitedCountries } from "../../../api/map";
import { getSectionIcons } from "../../../api/sectionIcons";
import { Plus, X } from "@phosphor-icons/react";
import {
  ArticleType,
  MapCountriesData,
  PlacesData,
  SectionIconsData,
} from "../../../common/types";
import ToggleSwitch from "../../../components/admin/atoms/ToggleSwitch/ToggleSwitch";
import { getPlacesByCountry } from "../../../api/places";
import AdvancedDropdown from "../../../components/admin/atoms/AdvancedDropdown";
import { addArticle } from "../../../api/article";
import { addSection } from "../../../api/sections";
import Modal from "../../../components/atoms/Modal";
import { addSectionImage } from "../../../api/sectionImages";
import { addGalleryImage } from "../../../api/galleryImages";

const AddArticle = () => {
  const navigate = useNavigate();
  const [articleTypes, setArticleTypes] = useState<ArticleType | string>("");
  const [countries, setCountries] = useState<MapCountriesData | string>("");
  const [places, setPlaces] = useState<PlacesData | string>("");
  const [sectionIcons, setSectionIcons] = useState<SectionIconsData | string>(
    ""
  );

  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [selectedSectionIcon, setSelectedSectionIcon] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");

  // images
  const [imageType, setImageType] = useState<string | null>(null);
  const [sectionSelected, setSectionSelected] = useState<number>(0);
  const [mainArticleImage, setMainArticleImage] = useState<string | null>(null);
  const [sectionImages, setSectionImages] = useState<Array<Array<string>>>([
    [],
  ]);
  const [otherArticleImages, setOtherArticleImages] = useState([]);

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
    console.log(
      "zakej se ovo opet ne poziva haaaa - jer nisi napisala naslov clanka koji je obavezan!!!!"
    );
    console.log(values);

    const dateString = new Date().toJSON().slice(0, 10);
    const todaysDate = new Date(dateString);

    const articleResponse = await addArticle(
      values.article_title,
      values.article_subtitle,
      values.article_description,
      values.article_video,
      parseInt(values.article_type),
      parseInt(values.article_country),
      parseInt(values.article_place),
      mainArticleImage,
      1, // hardcoded user id
      todaysDate
    );

    console.log(articleResponse);
    values.sections.map(async (section) => console.log(section));

    values.sections.map(async (section, index) => {
      const sectionResponse = await addSection(
        section.section_text,
        section.section_subtitle,
        index + 1,
        section.section_url_title,
        section.section_url_link,
        section.section_icon,
        articleResponse.id
      );
      console.log("sec odg");

      console.log(sectionResponse);

      sectionImages[index].map(
        async (el) => await addSectionImage(el, sectionResponse.id)
      );
    });

    console.log(sectionImages);
    console.log(otherArticleImages);

    otherArticleImages.map(
      async (image) => await addGalleryImage(image, articleResponse.id)
    );
  };

  const handleCancel = () => {
    navigate("/admin/članci");
  };

  const handleSectionIconChange = (selectedValue) => {
    console.log(selectedValue);

    setSelectedSectionIcon(selectedValue);
  };

  const handleDeleteSection = (arrayHelpers, sectionIndex) => {
    arrayHelpers.remove(sectionIndex);
    setSectionImages(
      sectionImages.filter((_el, index) => index !== sectionIndex)
    );
  };

  const handleAddSection = (arrayHelpers) => {
    arrayHelpers.push({
      section_subtitle: "",
      section_text: "",
      section_url_title: "",
      section_url_link: "",
      section_icon: "",
      order: 1, // TODO fix if this is needed. otherwise remove this attribute
    });
    setSectionImages([...sectionImages, []]);
  };

  const handleDeleteImage = (
    type: string,
    itemIndex?: number,
    sectionIndex?: number
  ) => {
    console.log(
      "remove image itemindex" + itemIndex + "section:" + sectionIndex
    );
    console.log(sectionImages);

    if (type == "main") {
      setMainArticleImage(null);
    } else if (type == "other") {
      setOtherArticleImages(
        otherArticleImages.filter((_el, index) => index !== itemIndex)
      );
    } else if (type == "section") {
      setSectionImages((prevSectionImages) => [
        ...prevSectionImages.slice(0, sectionIndex), // kopija polja prije indexa odabrane sekcije
        prevSectionImages[sectionIndex].filter(
          (_el, index) => index !== itemIndex
        ), // micanje slike prema indexu slike prema indexu
        ...prevSectionImages.slice(sectionIndex + 1), // kopija polja nakon indexa odabrane sekcije
      ]);
    }
    setImageType(null);
  };

  const toggleDialog = () => {
    if (dialogRef && dialogRef.current) {
      dialogRef.current.hasAttribute("open")
        ? dialogRef.current.close()
        : dialogRef.current.showModal();
    }
  };

  const handleAddImage = () => {
    if (imageType == "main") {
      setMainArticleImage(modalInputValue);
    } else if (imageType == "other") {
      setOtherArticleImages([...otherArticleImages, modalInputValue]);
    } else if (imageType == "section") {
      setSectionImages((prevSectionImages) => [
        ...prevSectionImages.slice(0, sectionSelected), // kopija polja prije indexa odabrane sekcije
        [...prevSectionImages[sectionSelected], modalInputValue], // dodavanje slike na kraj odabrane sekcije
        ...prevSectionImages.slice(sectionSelected + 1), // kopija polja nakon indexa odabrane sekcije
      ]);
    }
    setModalInputValue("");
  };

  const fetchData = async () => {
    try {
      const articleTypesData = await getArticleTypes();
      const countriesData = await getVisitedCountries();
      const sectionIconsData = await getSectionIcons();

      setArticleTypes(articleTypesData);
      setCountries(countriesData);
      setSectionIcons(sectionIconsData);
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
    <>
      <div className="add-article-container">
        <h2>Unesi novi članak</h2>
        {articleTypes && countries && (
          <Formik
            initialValues={{
              article_title: "",
              article_subtitle: "",
              article_description: "",
              article_video: "",
              article_type: "",
              article_country: "",
              article_place: "",
              sections: [
                {
                  section_subtitle: "",
                  section_text: "",
                  section_url_title: "",
                  section_url_link: "",
                  section_icon: "",
                  order: 1,
                },
              ],
            }}
            validationSchema={ValidationSchema}
            onSubmit={handleSave}
          >
            {({ values, setFieldValue }) => (
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
                      value={values.article_type}
                      onChange={(value) => setFieldValue("article_type", value)}
                      label="Vrsta članka *"
                    />
                    <ErrorMessage name="article_type" component="div" />
                    <Field
                      name="article_video"
                      as={Input}
                      label="Videozapis (opcionalno) "
                      placeholder={"Unesi link videa"}
                    />
                    {values.article_type == "1" && (
                      <>
                        <Dropdown
                          hardcodedValue={"Odaberi državu o kojoj se radi"}
                          options={countries}
                          value={values.article_country}
                          onChange={(value) => {
                            setFieldValue("article_country", value);
                            setSelectedCountryId(value);
                          }}
                          isDisabled={false}
                          label="Država članka (opcionalno)"
                        />
                        {values.article_country != "" && places && (
                          <Dropdown
                            hardcodedValue={
                              "Odaberi grad ili mjesto o kojem se radi"
                            }
                            value={values.article_place}
                            onChange={(value) =>
                              setFieldValue("article_place", value)
                            }
                            isDisabled={false}
                            label="Mjesto članka (opcionalno)"
                            options={places}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
                <div className="add-article-images-container">
                  {mainArticleImage ? (
                    <div
                      className="add-article-image"
                      onClick={() => {
                        handleDeleteImage("main");
                      }}
                    >
                      <div className="add-article-image-remove-icon">
                        <X size={32} color="#e70101" weight="bold" />
                      </div>
                      <img
                        src={mainArticleImage}
                        alt={`image-error-${mainArticleImage}`}
                      />
                    </div>
                  ) : (
                    <div
                      className="add-article-item"
                      onClick={() => {
                        toggleDialog();
                        setImageType("main");
                      }}
                    >
                      <Plus size={32} color="#616161" weight="bold" />
                    </div>
                  )}
                </div>
                <p>* preporuča se slika u omjeru 16:9</p>

                <div>
                  <h6>Odlomci</h6>
                  <FieldArray
                    name="sections"
                    render={(arrayHelpers) => {
                      const sections = values.sections;

                      return (
                        <div className="add-article-sections-container">
                          {sections && sections.length > 0
                            ? sections.map((_section, index) => (
                                <fieldset
                                  key={index}
                                  className="add-article-section"
                                >
                                  <legend>Odlomak {index + 1}</legend>
                                  <div className="add-article-section-top">
                                    <div className="add-article-section-top-item">
                                      <Field
                                        name={`sections.${index}.section_subtitle`}
                                        type="text"
                                        as={Input}
                                        label="Podnaslov odlomka (opcionalno)"
                                        placeholder="Unesi podnaslov odlomka..."
                                      />
                                    </div>
                                    <div className="add-article-section-top-item">
                                      <AdvancedDropdown
                                        hardcodedValue="Odaberi..."
                                        label="Vrsta ikone *"
                                        name={`sections.${index}.section_icon`} // TODO connect this with formik
                                        options={sectionIcons}
                                        onChange={handleSectionIconChange}
                                        filter={false}
                                        images={true}
                                      />
                                    </div>
                                  </div>
                                  <Field
                                    type="text"
                                    as={Input}
                                    name={`sections.${index}.section_text`}
                                    label="Tekst odlomka *"
                                    placeholder="Unesi tekst odlomka..."
                                  />
                                  <div className="add-article-section-bottom">
                                    <Field
                                      type="text"
                                      name={`sections.${index}.section_url_title`}
                                      as={Input}
                                      label="Naslov poveznice (opcionalno)"
                                      placeholder="Unesi naslov poveznice..."
                                    />
                                    <Field
                                      type="text"
                                      name={`sections.${index}.section_url_link`}
                                      as={Input}
                                      label="Poveznica (opcionalno)"
                                      placeholder="Unesi link poveznice..."
                                    />
                                  </div>
                                  <div className="add-article-bottom-container">
                                    <div className="add-article-images-container">
                                      {sectionImages &&
                                        sectionImages[index].map(
                                          (el, imageIndex) => (
                                            <div
                                              key={imageIndex}
                                              className="add-article-image"
                                              onClick={() => {
                                                handleDeleteImage(
                                                  "section",
                                                  imageIndex,
                                                  index
                                                );
                                              }}
                                            >
                                              <div className="add-article-image-remove-icon">
                                                <X
                                                  size={32}
                                                  color="#e70101"
                                                  weight="bold"
                                                />
                                              </div>
                                              <img src={el} alt="img-error" />
                                            </div>
                                          )
                                        )}
                                      <div
                                        className="add-article-item"
                                        onClick={() => {
                                          toggleDialog();
                                          setImageType("section");
                                          setSectionSelected(index);
                                        }}
                                      >
                                        <Plus
                                          size={32}
                                          color="#616161"
                                          weight="bold"
                                        />
                                      </div>
                                    </div>
                                    <Button
                                      type="button"
                                      red
                                      onClick={() => {
                                        handleDeleteSection(
                                          arrayHelpers,
                                          index
                                        );
                                      }}
                                    >
                                      izbriši odlomak
                                    </Button>
                                  </div>
                                </fieldset>
                              ))
                            : null}
                          <Button
                            type="button"
                            primary
                            onClick={() => {
                              handleAddSection(arrayHelpers);
                            }}
                          >
                            dodaj odlomak
                          </Button>
                        </div>
                      );
                    }}
                  />
                </div>
                <div className="add-article-gallery-container">
                  <h6>Preostale fotografije na članku:</h6>
                  <div className="add-article-images-container">
                    {otherArticleImages &&
                      otherArticleImages.map((el, index) => (
                        <div
                          className="add-article-image"
                          onClick={() => {
                            handleDeleteImage("other", index);
                          }}
                        >
                          <div className="add-article-image-remove-icon">
                            <X size={32} color="#e70101" weight="bold" />
                          </div>
                          <img src={el} alt="img-error" />
                        </div>
                      ))}
                    <div
                      className="add-article-item"
                      onClick={() => {
                        toggleDialog();
                        setImageType("other");
                      }}
                    >
                      <Plus size={32} color="#616161" weight="bold" />
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
                        setIsNotifySubscribersChecked(
                          !isNotifySubscribersChecked
                        )
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
            )}
          </Formik>
        )}
      </div>
      <Modal
        ref={dialogRef}
        toggleDialog={toggleDialog}
        onClick={handleAddImage}
        modalInputValue={modalInputValue}
        setModalInputValue={setModalInputValue}
      />
      {modalInputValue.toString()}
    </>
  );
};

export default AddArticle;
