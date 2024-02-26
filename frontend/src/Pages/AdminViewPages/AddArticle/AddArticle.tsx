// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

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
import Swal from "sweetalert2";
import {
  ArticleType,
  CountriesData,
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
import { notifySuccess } from "../../../components/atoms/Toast/Toast";
import Textarea from "../../../components/admin/atoms/Textarea";
import { ThreeDots } from "react-loader-spinner";

const AddArticle = () => {
  const navigate = useNavigate();
  const [articleTypes, setArticleTypes] = useState<ArticleType | string>("");
  const [countries, setCountries] = useState<CountriesData | string>("");
  const [places, setPlaces] = useState<PlacesData | string>("");
  const [sectionIcons, setSectionIcons] = useState<SectionIconsData | string>(
    ""
  );

  const [selectedCountryId, setSelectedCountryId] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");
  const [imageHeightValue, setImageHeightValue] = useState("");
  const [imageWidthValue, setImageWidthValue] = useState("");

  // images
  const [imageType, setImageType] = useState<string | null>(null);
  const [sectionSelected, setSectionSelected] = useState<number>(0);
  const [mainArticleImage, setMainArticleImage] = useState<string>("");
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
    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Objavit ćete ovaj članak",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, objavi!",
    }).then(async (result) => {
      if (result.isConfirmed) {
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
          1, // TODO connect with the ID of logged user
          todaysDate
        );

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
          sectionImages[index].map(async (el) => {
            await addSectionImage(el.url, sectionResponse.id);
          });
        });

        otherArticleImages.map(async (image) => {
          return await addGalleryImage(
            image.url,
            image.height,
            image.width,
            articleResponse.id
          );
        });
        navigate("/admin/članci");
        notifySuccess("Uspješno predano!");
      }
    });
  };

  const handleCancel = () => {
    navigate("/admin/članci");
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
      order: 1,
    });
    setSectionImages([...sectionImages, []]);
  };

  const handleDeleteImage = (
    type: string,
    itemIndex?: number,
    sectionIndex?: number
  ) => {
    if (type == "main") {
      setMainArticleImage(null);
    } else if (type == "other") {
      //ovo tu su gallery slike
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
      setOtherArticleImages([
        ...otherArticleImages,
        {
          url: modalInputValue,
          width: imageWidthValue,
          height: imageHeightValue,
        },
      ]);
    } else if (imageType == "section") {
      setSectionImages((prevSectionImages) => [
        ...prevSectionImages.slice(0, sectionSelected), // kopija polja prije indexa odabrane sekcije
        [
          ...prevSectionImages[sectionSelected],
          {
            url: modalInputValue,
            width: imageWidthValue,
            height: imageHeightValue,
          },
        ], // dodavanje slike na kraj odabrane sekcije...tu moram neki objekt dodavati
        ...prevSectionImages.slice(sectionSelected + 1), // kopija polja nakon indexa odabrane sekcije
      ]);
    }
    setModalInputValue("");
    setImageHeightValue("");
    setImageWidthValue("");
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
        {articleTypes && countries ? (
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
                  section_icon: null,
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
                    as={Input}
                    label="Podnaslov članka *"
                    placeholder="Opis članka u par riječi..."
                  />
                  <ErrorMessage name="article_subtitle" component="div" />
                  <Field
                    name="article_description"
                    type="text"
                    as={Textarea}
                    rows={4}
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
                        <Field
                          name="article_country"
                          type="text"
                          as={AdvancedDropdown}
                          label="Država članka (opcionalno)"
                          hardcodedValue="Odaberi državu o kojoj se radi..."
                          options={countries}
                          onChange={(value) => {
                            setFieldValue("article_country", value.id);
                            setSelectedCountryId(value.id);
                          }}
                          selectedValue={values.article_country}
                          imageAttribute="flag_image_url"
                          filter
                          images
                        />
                        {values.article_country != "" && places && (
                          <Field
                            name="article_place"
                            type="text"
                            as={AdvancedDropdown}
                            label="Mjesto članka (opcionalno)"
                            hardcodedValue="Odaberi grad ili mjesto o kojem se radi"
                            options={places}
                            onChange={(value) => {
                              setFieldValue("article_place", value.id);
                            }}
                            selectedValue={values.article_place}
                            filter
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
                                      <Field
                                        type="text"
                                        as={AdvancedDropdown}
                                        hardcodedValue="Odaberi..."
                                        label="Vrsta ikone *"
                                        name={`sections.${index}.section_icon`}
                                        options={sectionIcons}
                                        onChange={(value: SectionIconsData) => {
                                          setFieldValue(
                                            `sections.${index}.section_icon`,
                                            value.id
                                          );
                                        }}
                                        selectedValue={
                                          values.sections[index].section_icon
                                        }
                                        filter={false}
                                        images={true}
                                      />
                                    </div>
                                  </div>
                                  <Field
                                    type="text"
                                    as={Textarea}
                                    rows={12}
                                    name={`sections[${index}].section_text`}
                                    label="Tekst odlomka *"
                                    placeholder="Unesi tekst odlomka..."
                                    value={sections[index].section_text}
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
                                              <img
                                                src={el.url}
                                                alt="img-error"
                                              />
                                            </div>
                                          )
                                        )}
                                      {sectionImages[index].length < 2 && (
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
                                      )}
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
                                  <p>
                                    * preporuča se 1 slika u omjeru 16:9 ili
                                    max. 2 u omjeru 9:16
                                  </p>
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
                          <img src={el.url} alt="img-error" />
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
                  {selectedCountryId && values.article_type == "1" && (
                    <div className="add-article-toggle-item">
                      <ToggleSwitch
                        name={"main-country-post"}
                        description={"Dodaj članak kao glavni za državu"}
                        value={isMainCountryPostChecked}
                        setter={setIsMainCountryPostChecked}
                      />
                    </div>
                  )}
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
      <Modal
        ref={dialogRef}
        toggleDialog={toggleDialog}
        onClick={handleAddImage}
        modalInputValue={modalInputValue}
        modalImageHeightValue={imageHeightValue}
        modalImageWidthValue={imageWidthValue}
        setModalInputValue={setModalInputValue}
        setImageHeightValue={setImageHeightValue}
        setImageWidthValue={setImageWidthValue}
        isAddArticle
      />
    </>
  );
};

export default AddArticle;
