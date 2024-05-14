// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useNavigate, useParams } from "react-router-dom";
import "./EditArticle.scss";
import { useEffect, useRef, useState } from "react";
import {
  Article,
  ArticleType,
  CountriesData,
  GalleryImage,
  PlacesData,
  SectionIconsData,
  SectionImage,
} from "../../../common/types";
import * as Yup from "yup";
import { getPlacesByCountry } from "../../../api/places";
import { getArticleTypes } from "../../../api/articleTypes";
import { getVisitedCountries } from "../../../api/map";
import { getSectionIcons } from "../../../api/sectionIcons";
import Modal from "../../../components/atoms/Modal";
import { ThreeDots } from "react-loader-spinner";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Input from "../../../components/atoms/Input";
import Textarea from "../../../components/admin/atoms/Textarea";
import Dropdown from "../../../components/atoms/Dropdown";
import { Plus, X } from "@phosphor-icons/react";
import AdvancedDropdown from "../../../components/admin/atoms/AdvancedDropdown";
import Button from "../../../components/atoms/Button";
import ToggleSwitch from "../../../components/admin/atoms/ToggleSwitch";
import Swal from "sweetalert2";
import { notifySuccess } from "../../../components/atoms/Toast/Toast";
import {
  createTopCountryArticle,
  deleteArticleById,
  getArticleById,
  getFavoriteArticleByCountry,
  updateArticle,
} from "../../../api/article";
import {
  addSection,
  deleteSection,
  updateSection,
} from "../../../api/sections";
import {
  addSectionImage,
  deleteSectionImage,
} from "../../../api/sectionImages";
import {
  addGalleryImage,
  deleteGalleryImage,
} from "../../../api/galleryImages";
import { getAirportCities } from "../../../api/airportCities";

const EditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [articleTypes, setArticleTypes] = useState<ArticleType | string>("");
  const [airportCities, setAirportCities] = useState("");
  const [article, setArticle] = useState<Article | string>("");
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
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const [isMainCountryPostChecked, setIsMainCountryPostChecked] =
    useState(false);

  const ValidationSchema = Yup.object().shape({
    article_title: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Naslov smije imati max 100 znakova!"),
    article_subtitle: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Podnaslov smije imati max 100 znakova!"),
    article_description: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Opis smije imati max 100 znakova!"),
    article_type: Yup.number().required("Obavezno polje!").integer(),
    article_airport_city_id: Yup.number().when("article_type", {
      is: 2,
      then: () => Yup.number().required("Obavezno polje!").integer(),
      otherwise: () => Yup.number().notRequired(),
    }),
    article_country: Yup.number().when("article_type", {
      is: 1,
      then: () => Yup.number().required("Obavezno polje!").integer(),
      otherwise: () => Yup.number().notRequired(),
    }),
    sections: Yup.array().of(
      Yup.object().shape({
        section_subtitle: Yup.string().max(
          100,
          "Podnaslov smije imati max 100 znakova!"
        ),
        section_url_title: Yup.string().max(
          100,
          "Naslov linka smije imati max 100 znakova!"
        ),
        section_text: Yup.string().required("Obavezno polje!"),
      })
    ),
  });

  const validateImages = () => {
    return mainArticleImage != "" && mainArticleImage;
  };

  const handleSave = async (values) => {
    setIsSubmitClicked(true);

    if (validateImages()) {
      Swal.fire({
        title: "Jeste li sigurni?",
        text: "Objavit ćete ovaj uređeni članak",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2BAC82",
        cancelButtonColor: "#AC2B2B",
        cancelButtonText: "Odustani",
        confirmButtonText: "Da, objavi!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const countryResponse = await updateArticle(
            article.id,
            values.article_title,
            values.article_subtitle,
            values.article_description,
            mainArticleImage,
            values.article_type,
            values.article_country,
            values.article_place,
            values.article_airport_city_id
          );
          console.log(countryResponse);

          values.sections.map(async (el, index) => {
            if (el.section_id) {
              await updateSection(
                el.section_id,
                el.section_text,
                el.section_subtitle,
                index + 1,
                el.section_url_title,
                el.section_url_link,
                el.section_icon
              );

              sectionImages[index].map(async (image: SectionImage) => {
                if (!image.id) {
                  await addSectionImage(
                    image.url,
                    el.section_id,
                    image.width,
                    image.height
                  );
                }
              });
            } else {
              const response = await addSection(
                el.section_text,
                el.section_subtitle,
                index + 1,
                el.section_url_title,
                el.section_url_link,
                el.section_icon,
                article.id
              );

              sectionImages[index].map(async (image: SectionImage) => {
                if (!image.id) {
                  await addSectionImage(
                    image.url,
                    response.section_id,
                    image.height,
                    image.width
                  );
                }
              });
            }
          });

          // delete removed sections (and images in that section automatically)
          const removedSections = article.sections
            .map((section) => section.id) // take only id (later sectionId)
            .filter(
              (sectionId) =>
                !values.sections.some(
                  (section) => section.section_id === sectionId // and check if any section_id (of any section in values.sections) has same id as current section (if yes, don't include it in removedSections array = ! in front)
                )
            );
          removedSections.map(async (el: number) => await deleteSection(el));

          // delete removed section images
          const removedSectionImages = article.sections.map((section, index) =>
            section.section_images
              .map((image: SectionImage) => image.id)
              .filter(
                (imageId: number) =>
                  !sectionImages[index].some((img) => img.id === imageId)
              )
          );

          removedSectionImages.map(async (el: Array<number>) => {
            el.map(async (item: number) => {
              await deleteSectionImage(item);
            });
          });

          otherArticleImages.map(async (image: GalleryImage) => {
            if (!image.id) {
              return await addGalleryImage(
                image.url,
                image.height,
                image.width,
                article.id
              );
            }
          });

          const removedGalleryImages = article.gallery_images
            .map((image: GalleryImage) => image.id)
            .filter(
              (imageId) => !otherArticleImages.some((img) => img.id === imageId)
            );

          removedGalleryImages.map(async (id: number) => {
            await deleteGalleryImage(id);
          });

          if (isMainCountryPostChecked) {
            await createTopCountryArticle(id);
          }

          navigate("/admin/članci");
          notifySuccess("Uspješno uređen članak!");
        }
      });
    }
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
      id: null,
      section_subtitle: "",
      section_text: "",
      section_url_title: "",
      section_url_link: "",
      section_icon: null,
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
            id: null,
            url: modalInputValue,
            width: imageWidthValue | null,
            height: imageHeightValue | null,
          },
        ], // dodavanje slike na kraj odabrane sekcije
        ...prevSectionImages.slice(sectionSelected + 1), // kopija polja nakon indexa odabrane sekcije
      ]);
    }
    setModalInputValue("");
    setImageHeightValue("");
    setImageWidthValue("");
  };

  const fetchData = async () => {
    try {
      if (id) {
        const articleTypesData = await getArticleTypes();
        const countriesData = await getVisitedCountries();
        const sectionIconsData = await getSectionIcons();
        const articleData = await getArticleById(parseInt(id));
        const isSetAsMainCountryPost = await getFavoriteArticleByCountry(
          articleData.countryId
        );
        const airportsData = await getAirportCities();

        setArticleTypes(articleTypesData);
        setCountries(countriesData);
        setSectionIcons(sectionIconsData);
        setArticle(articleData);
        setMainArticleImage(articleData.main_image_url);
        setIsMainCountryPostChecked(isSetAsMainCountryPost.id == id);
        setSectionImages(
          articleData.sections.map((section) => section.section_images)
        );
        setOtherArticleImages(articleData.gallery_images);
        setAirportCities(airportsData);
      }
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  const fetchPlacesData = async () => {
    const placesData = await getPlacesByCountry(parseInt(selectedCountryId));
    setPlaces(placesData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    selectedCountryId && fetchPlacesData();
  }, [selectedCountryId]);

  const handleDeleteArticleById = () => {
    Swal.fire({
      title: `DESTRUKTIVNA RADNJA!\nJeste li sigurni da želite izbrisati članak ${article?.title}`,
      text: "Izbrisat ćete ovaj članak zauvijek!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, izbriši!",
    }).then(async (result) => {
      if (result.isConfirmed && article) {
        await deleteArticleById(article.id);

        navigate("/admin/članci");
        notifySuccess("Uspješno izbrisan članak!");
      }
    });
  };

  return (
    <div>
      <>
        <div className="edit-article-container">
          <div className="edit-article-header">
            <h2>Uredi članak</h2>
            <Button
              red
              disabled={!article}
              onClick={() => {
                handleDeleteArticleById();
              }}
            >
              IZBRIŠI ČLANAK
            </Button>
          </div>
          {articleTypes && countries && article ? (
            <Formik
              initialValues={{
                article_title: article.title,
                article_subtitle: article.subtitle,
                article_description: article.description,
                article_video: article.video ? article.video.url : "",
                article_type: article.articleTypeId,
                article_country: article.countryId || null,
                article_place: article.placeId || null,
                article_airport_city_id: article.airportCityId || null,
                sections: article.sections
                  ? article.sections.map((el) => ({
                      section_id: el.id,
                      section_subtitle: el.subtitle,
                      section_text: el.text,
                      section_url_title: el.link_title,
                      section_url_link: el.link_url,
                      section_icon: el.sectionIconId,
                    }))
                  : [],
              }}
              validationSchema={ValidationSchema}
              onSubmit={handleSave}
              enableReinitialize={true}
            >
              {({ values, setFieldValue }) => (
                <Form className="edit-article-form">
                  <div className="edit-article-inputs">
                    <div className="edit-article-input">
                      <Field
                        name="article_title"
                        type="text"
                        as={Input}
                        label="Naslov članka *"
                        placeholder="Unesi naslov..."
                      />
                      <ErrorMessage
                        name="article_title"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="edit-article-input">
                      <Field
                        name="article_subtitle"
                        as={Input}
                        label="Podnaslov članka *"
                        placeholder="Opis članka u par riječi..."
                      />
                      <ErrorMessage
                        name="article_subtitle"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="add-article-input">
                      <Field
                        name="article_description"
                        type="text"
                        as={Textarea}
                        value={values.article_description}
                        rows={4}
                        label="Opis članka *"
                        placeholder="Opis članka u nekoliko rečenica..."
                      />
                      <ErrorMessage
                        name="article_description"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="edit-article-dropdowns">
                      <div className="add-article-input">
                        <Dropdown
                          hardcodedValue={
                            "Odaberi u kojem će se meniju prikazivat"
                          }
                          options={articleTypes}
                          value={values.article_type}
                          onChange={(value) => {
                            setFieldValue("article_type", value);
                            setFieldValue("article_airport_city_id", null);
                            setFieldValue("article_place", null);
                            setFieldValue("article_country", null);
                          }}
                          label="Vrsta članka *"
                        />
                        <ErrorMessage
                          name="article_type"
                          component="div"
                          className="error-message"
                        />
                      </div>
                      <Field
                        name="article_video"
                        as={Input}
                        label="Videozapis (opcionalno) "
                        placeholder={"Unesi link videa"}
                      />
                      {values.article_type == "1" && (
                        <>
                          <div className="add-article-input">
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
                            <ErrorMessage
                              name="article_country"
                              component="div"
                              className="error-message"
                            />
                          </div>

                          {values.article_country != "" &&
                            values.article_country &&
                            places && (
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
                      {values.article_type == "2" && airportCities && (
                        <div className="add-article-input">
                          <Field
                            name="article_airport_city_id"
                            type="text"
                            as={AdvancedDropdown}
                            label="Aerodrom *"
                            hardcodedValue="Odaberi aerodrom iz kojeg se kreće..."
                            options={airportCities}
                            onChange={(value) => {
                              setFieldValue(
                                "article_airport_city_id",
                                value.id
                              );
                            }}
                            selectedValue={values.article_airport_city_id}
                            imageAttribute="flag_url"
                            images
                          />
                          <ErrorMessage
                            name="article_airport_city_id"
                            component="div"
                            className="error-message"
                          />
                        </div>
                      )}
                    </div>
                    {values.article_type == "1" &&
                      values.article_country != "" &&
                      values.article_country && (
                        <Button
                          red
                          onClick={() => {
                            setSelectedCountryId(null);
                            setFieldValue("article_country", null);
                            setFieldValue("article_place", null);
                          }}
                        >
                          ukloni odabranu državu i grad
                        </Button>
                      )}
                  </div>
                  <div className="edit-article-images-container">
                    {mainArticleImage ? (
                      <div
                        className="edit-article-image"
                        onClick={() => {
                          handleDeleteImage("main");
                        }}
                      >
                        <div className="edit-article-image-remove-icon">
                          <X size={32} color="#e70101" weight="bold" />
                        </div>
                        <img
                          src={mainArticleImage}
                          alt={`image-error-${mainArticleImage}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="edit-article-item"
                        onClick={() => {
                          toggleDialog();
                          setImageType("main");
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    )}
                  </div>
                  {isSubmitClicked &&
                    (mainArticleImage == "" || !mainArticleImage) && (
                      <p className="error-message">Obavezno polje!</p>
                    )}
                  <p>* preporuča se slika u omjeru 16:9</p>

                  <div>
                    <h6>Odlomci</h6>
                    <FieldArray
                      name="sections"
                      render={(arrayHelpers) => {
                        const sections = values.sections;

                        return (
                          <div className="edit-article-sections-container">
                            {sections && sections.length > 0
                              ? sections.map((_section, index) => (
                                  <fieldset
                                    key={index}
                                    className="edit-article-section"
                                  >
                                    <legend>Odlomak {index + 1}</legend>
                                    <div className="edit-article-section-top">
                                      <div className="edit-article-section-top-item">
                                        <Field
                                          name={`sections.${index}.section_subtitle`}
                                          type="text"
                                          as={Input}
                                          label="Podnaslov odlomka (opcionalno)"
                                          placeholder="Unesi podnaslov odlomka..."
                                        />
                                      </div>
                                      <div className="edit-article-section-top-item">
                                        <Field
                                          type="text"
                                          as={AdvancedDropdown}
                                          hardcodedValue="Odaberi..."
                                          label="Vrsta ikone"
                                          name={`sections.${index}.section_icon`}
                                          options={sectionIcons}
                                          onChange={(
                                            value: SectionIconsData
                                          ) => {
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
                                    <div className="add-article-input">
                                      <Field
                                        type="text"
                                        as={Textarea}
                                        rows={12}
                                        value={
                                          values.sections[index].section_text
                                        }
                                        name={`sections.${index}.section_text`}
                                        label="Tekst odlomka *"
                                        placeholder="Unesi tekst odlomka..."
                                      />
                                      <ErrorMessage
                                        name={`sections[${index}].section_text`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>
                                    <div className="edit-article-section-bottom">
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
                                    <div className="edit-article-bottom-container">
                                      <div className="edit-article-images-container">
                                        {sectionImages &&
                                          sectionImages[index].map(
                                            (el, imageIndex) => (
                                              <div
                                                key={imageIndex}
                                                className="edit-article-image"
                                                onClick={() => {
                                                  handleDeleteImage(
                                                    "section",
                                                    imageIndex,
                                                    index
                                                  );
                                                }}
                                              >
                                                <div className="edit-article-image-remove-icon">
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
                                            className="edit-article-item"
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
                  <div className="edit-article-gallery-container">
                    <h6>Preostale fotografije na članku:</h6>
                    <div className="edit-article-images-container">
                      {otherArticleImages &&
                        otherArticleImages.map((el, index) => (
                          <div
                            className="edit-article-image"
                            onClick={() => {
                              handleDeleteImage("other", index);
                            }}
                            key={index}
                          >
                            <div className="edit-article-image-remove-icon">
                              <X size={32} color="#e70101" weight="bold" />
                            </div>
                            <img src={el.url} alt="img-error" />
                          </div>
                        ))}
                      <div
                        className="edit-article-item"
                        onClick={() => {
                          toggleDialog();
                          setImageType("other");
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    </div>
                  </div>
                  <div className="edit-article-toggle-container">
                    {selectedCountryId && values.article_type == "1" && (
                      <div className="edit-article-toggle-item">
                        <ToggleSwitch
                          name={"main-country-post"}
                          description={"Postavi kao glavni članak države"}
                          value={isMainCountryPostChecked}
                          setter={setIsMainCountryPostChecked}
                        />
                      </div>
                    )}
                  </div>

                  <div className="edit-article-buttons">
                    <Button type="submit" adminPrimary>
                      uredi članak
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
        {modalInputValue.toString()}
        {imageHeightValue.toString()}
        {imageWidthValue.toString()}
      </>
    </div>
  );
};

export default EditArticle;
