// @ts-nocheck
"use client";

import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import "./AddArticle.scss";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Fragment, useEffect, useRef, useState } from "react";
import { getArticleTypes } from "@/utils/articleTypes";
import Dropdown from "@/components/atoms/Dropdown";
import { getVisitedCountries } from "@/utils/map";
import { getSectionIcons } from "@/utils/sectionIcons";
import { Plus, Trash, X } from "@phosphor-icons/react";
import Swal from "sweetalert2";
import {
  ArticleType,
  CountriesData,
  PlacesData,
  SectionIconsData,
} from "@/common/types";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import { getPlacesByCountry } from "@/utils/places";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import { addArticle, createTopCountryArticle } from "@/utils/article";
import { addSection } from "@/utils/sections";
import Modal from "@/components/atoms/Modal";
import { addSectionImage } from "@/utils/sectionImages";
import { addGalleryImage } from "@/utils/galleryImages";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import Textarea from "@/components/admin/atoms/Textarea";
import { getAirportCities } from "@/utils/airportCities";
import pLimit from "p-limit";
import AdvancedEditor from "@/components/atoms/AdvancedEditor";
import {
  getSubscribersWithoutPagination,
  sendNewsletterToSubscribers,
} from "@/utils/subscribers";
import SectionActions from "@/components/admin/atoms/SectionActions/SectionActions";
import {
  ARTICLE_TYPE_AIRPLANE_TICKET_ID,
  ARTICLE_TYPE_DESTINATION_ID,
  getTipsArticleTypeTitle,
  isTipsArticleType,
} from "@/utils/articleTypeHelpers";
import {
  insertSectionImageSlotAfter,
  moveSectionImageSlot,
} from "@/utils/sectionFormHelpers";
import {
  isBestTimeToVisitSectionIcon,
  isEntryRequirementsSectionIcon,
} from "@/utils/sectionSpecialFeatures";

const AddArticlePage = () => {
  const router = useRouter();
  const [articleTypes, setArticleTypes] = useState<ArticleType | string>("");
  const [countries, setCountries] = useState<CountriesData | string>("");
  const [places, setPlaces] = useState<PlacesData | string>("");
  const [airportCities, setAirportCities] = useState("");
  const [sectionIcons, setSectionIcons] = useState<SectionIconsData | string>(
    ""
  );

  const [selectedCountryId, setSelectedCountryId] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");
  const [imageHeightValue, setImageHeightValue] = useState("");
  const [imageWidthValue, setImageWidthValue] = useState("");

  const [imageType, setImageType] = useState<string | null>(null);
  const [sectionSelected, setSectionSelected] = useState<number>(0);
  const [mainArticleImage, setMainArticleImage] = useState<string>("");
  const [sectionImages, setSectionImages] = useState<Array<Array<any>>>([[]]);
  const [otherArticleImages, setOtherArticleImages] = useState<Array<any>>([]);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const [isMainCountryPostChecked, setIsMainCountryPostChecked] =
    useState(false);
  const [isNotifySubscribersChecked, setIsNotifySubscribersChecked] =
    useState(true);
  const [isFarDestinationChecked, setIsFarDestinationChecked] = useState(false);
  const [isTipsFeaturedChecked, setIsTipsFeaturedChecked] = useState(false);

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
      is: (value: string | number) =>
        Number(value) === Number(ARTICLE_TYPE_AIRPLANE_TICKET_ID),
      then: () => Yup.number().required("Obavezno polje!").integer(),
      otherwise: () => Yup.number().notRequired(),
    }),
    article_country: Yup.number().when("article_type", {
      is: (value: string | number) =>
        Number(value) === Number(ARTICLE_TYPE_DESTINATION_ID),
      then: () => Yup.number().required("Obavezno polje!").integer(),
      otherwise: () => Yup.number().notRequired(),
    }),
    metatags: Yup.array().of(
      Yup.object().shape({
        metatag_text: Yup.string().required("Obavezno polje!"),
      })
    ),
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
      })
    ),
  });

  const getUserId = () => {
    const jwtToken = localStorage.getItem("jwt");
    if (!jwtToken) return null;

    const tokenParts = jwtToken.split(".");
    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(base64));
    return decodedPayload.id;
  };

  const limit = pLimit(5);

  const validateImages = () => {
    return mainArticleImage != "" && mainArticleImage;
  };

  const getIconUrl = (icon: any) => {
    return icon?.url || icon?.icon_url || icon?.image_url || icon?.src || "";
  };

  const getSelectedSectionIcon = (iconId: number | string | null) => {
    if (!iconId || !sectionIcons || typeof sectionIcons === "string") {
      return null;
    }

    return (
      sectionIcons.find((icon: any) => Number(icon.id) === Number(iconId)) ||
      null
    );
  };

  const handleSave = async (values: any) => {
    setIsSubmitClicked(true);

    if (validateImages()) {
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
          try {
            const user_id = getUserId();
            const dateString = new Date().toJSON().slice(0, 10);
            const todaysDate = new Date(dateString);

            let metatagsString = "";
            values.metatags.map(
              (el: any, index: number) =>
                (metatagsString += `${index !== 0 ? ", " : ""}${
                  el.metatag_text
                }`)
            );

            const articleResponse = await addArticle(
              values.article_title,
              values.article_subtitle,
              values.article_description,
              values.article_video,
              metatagsString,
              parseInt(values.article_type),
              parseInt(values.article_country),
              parseInt(values.article_place),
              mainArticleImage,
              user_id,
              todaysDate,
              null,
              parseInt(values.article_airport_city_id),
              isFarDestinationChecked,
              isTipsArticleType(values.article_type) && isTipsFeaturedChecked
            );

            const galleryResults = await Promise.all(
              otherArticleImages.map((image) =>
                addGalleryImage(image.url, articleResponse.id, "0", "0")
              )
            );
            console.log("Gallery images saved:", galleryResults);

            await Promise.all([
              isMainCountryPostChecked
                ? createTopCountryArticle(articleResponse.id)
                : Promise.resolve(),

              Promise.all(
                values.sections.map(async (section: any, index: number) => {
                  const sectionResponse = await addSection(
                    section.section_text,
                    section.section_subtitle,
                    index + 1,
                    section.section_url_title,
                    section.section_url_link,
                    section.section_icon,
                    articleResponse.id,
                    Boolean(section.show_visa_info),
                    Boolean(section.show_best_time_to_visit)
                  );

                  return Promise.all(
                    sectionImages[index].map((el: any) =>
                      limit(() => addSectionImage(el.url, sectionResponse.id))
                    )
                  );
                })
              ),
            ]);

            if (isNotifySubscribersChecked) {
              try {
                const subscribers = await getSubscribersWithoutPagination();

                if (subscribers && subscribers.length > 0) {
                  const articleData = {
                    id: articleResponse.id,
                    article_title: values.article_title,
                    article_subtitle: values.article_subtitle,
                    article_description: values.article_description,
                    mainArticleImage: mainArticleImage,
                    article_type_id: articleResponse.articleTypeId,
                  };

                  await sendNewsletterToSubscribers(subscribers, articleData);

                  notifySuccess(
                    "Uspješno objavljen članak i poslan newsletter!"
                  );
                }
              } catch (error) {
                console.error("Newsletter sending failed:", error);
                notifyFailure(
                  "Članak je objavljen, ali slanje newslettera nije uspjelo!"
                );
              }
            } else {
              notifySuccess("Članak je uspješno objavljen!");
            }

            router.push("/admin/clanci");
          } catch (error) {
            console.error("Error publishing article:", error);
            Swal.fire({
              title: "Greška",
              text: "Došlo je do greške prilikom objave članka",
              icon: "error",
              confirmButtonColor: "#2BAC82",
            });
          }
        }
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/clanci");
  };

  const handleDeleteSection = (arrayHelpers: any, sectionIndex: number) => {
    arrayHelpers.remove(sectionIndex);
    setSectionImages(
      sectionImages.filter((_el, index) => index !== sectionIndex)
    );
  };

  const emptySection = {
    section_subtitle: "",
    section_text: "",
    section_url_title: "",
    section_url_link: "",
    section_icon: null,
    show_visa_info: false,
    show_best_time_to_visit: false,
    order: 1,
  };

  const handleInsertSectionAfter = (arrayHelpers: any, index: number) => {
    arrayHelpers.insert(index + 1, { ...emptySection });
    setSectionImages((prev) => insertSectionImageSlotAfter(prev, index));
  };

  const handleMoveSection = (arrayHelpers: any, from: number, to: number) => {
    if (to < 0) return;

    arrayHelpers.move(from, to);
    setSectionImages((prev) => moveSectionImageSlot(prev, from, to));
  };

  const handleAddSection = (arrayHelpers: any) => {
    arrayHelpers.push({
      section_subtitle: "",
      section_text: "",
      section_url_title: "",
      section_url_link: "",
      section_icon: null,
      show_visa_info: false,
      show_best_time_to_visit: false,
      order: 1,
    });
    setSectionImages([...sectionImages, []]);
  };

  const handleAddMetatag = (arrayHelpers: any) => {
    arrayHelpers.push({
      metatag_text: "",
    });
  };

  const handleDeleteMetatag = (arrayHelpers: any, tagIndex: number) => {
    arrayHelpers.remove(tagIndex);
  };

  const handleDeleteImage = (
    type: string,
    itemIndex?: number,
    sectionIndex?: number
  ) => {
    if (type == "main") {
      setMainArticleImage("");
    } else if (type == "other") {
      setOtherArticleImages(
        otherArticleImages.filter((_el, index) => index !== itemIndex)
      );
    } else if (type == "section") {
      setSectionImages((prevSectionImages) => [
        ...prevSectionImages.slice(0, sectionIndex),
        prevSectionImages[sectionIndex!].filter(
          (_el, index) => index !== itemIndex
        ),
        ...prevSectionImages.slice(sectionIndex! + 1),
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
        },
      ]);
    } else if (imageType == "section") {
      setSectionImages((prevSectionImages) => [
        ...prevSectionImages.slice(0, sectionSelected),
        [
          ...prevSectionImages[sectionSelected],
          {
            url: modalInputValue,
            width: imageWidthValue,
            height: imageHeightValue,
          },
        ],
        ...prevSectionImages.slice(sectionSelected + 1),
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
      const airportsData = await getAirportCities();

      setArticleTypes(articleTypesData);
      setCountries(countriesData);
      setSectionIcons(sectionIconsData);
      setAirportCities(airportsData);
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
              article_country: null,
              article_place: null,
              article_airport_city_id: null,
              metatags: [{ metatag_text: "" }],
              sections: [
                {
                  section_subtitle: "",
                  section_text: "",
                  section_url_title: "",
                  section_url_link: "",
                  section_icon: null,
                  show_visa_info: false,
                  show_best_time_to_visit: false,
                },
              ],
            }}
            validationSchema={ValidationSchema}
            onSubmit={handleSave}
          >
            {({ values, setFieldValue }) => (
              <Form className="add-article-form">
                <div className="add-article-inputs">
                  <div className="add-article-input">
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

                  <div className="add-article-input">
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

                  <div className="add-article-dropdowns">
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
                          setSelectedCountryId("");

                          values.sections.forEach((_section: any, index: number) => {
                            setFieldValue(
                              `sections.${index}.show_visa_info`,
                              false
                            );
                            setFieldValue(
                              `sections.${index}.show_best_time_to_visit`,
                              false
                            );
                          });

                          if (value != ARTICLE_TYPE_AIRPLANE_TICKET_ID) {
                            setIsFarDestinationChecked(false);
                          }

                          if (value != ARTICLE_TYPE_DESTINATION_ID) {
                            setIsMainCountryPostChecked(false);
                          }

                          if (!isTipsArticleType(value)) {
                            setIsTipsFeaturedChecked(false);
                          }
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

                    {values.article_type == ARTICLE_TYPE_DESTINATION_ID && (
                      <>
                        <div className="add-article-input">
                          <Field
                            name="article_country"
                            type="text"
                            as={AdvancedDropdown}
                            label="Država članka *"
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

                    {values.article_type == ARTICLE_TYPE_AIRPLANE_TICKET_ID &&
                      airportCities && (
                        <div className="add-article-airport-row">
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

                          <div className="add-article-airport-toggle">
                            <div className="add-article-toggle-item">
                              <ToggleSwitch
                                name={"far-destination"}
                                description={"Daleka destinacija?"}
                                value={isFarDestinationChecked}
                                setter={() =>
                                  setIsFarDestinationChecked(
                                    !isFarDestinationChecked
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div>
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
                        <div className="add-article-sections-container">
                          {sections && sections.length > 0
                            ? sections.map((section, index) => {
                                const selectedIcon = getSelectedSectionIcon(
                                  section.section_icon
                                );
                                const selectedIconUrl =
                                  getIconUrl(selectedIcon);
                                const isEntryRequirementsIconSelected =
                                  isEntryRequirementsSectionIcon(
                                    selectedIcon
                                  );
                                const isBestTimeToVisitIconSelected =
                                  isBestTimeToVisitSectionIcon(selectedIcon);

                                const canShowVisaInfoToggle =
                                  isEntryRequirementsIconSelected &&
                                  values.article_type ==
                                    ARTICLE_TYPE_DESTINATION_ID &&
                                  values.article_country;

                                const canShowBestTimeToVisitToggle =
                                  isBestTimeToVisitIconSelected &&
                                  values.article_type ==
                                    ARTICLE_TYPE_DESTINATION_ID &&
                                  values.article_country;

                                return (
                                  <fieldset
                                    key={index}
                                    className="add-article-section"
                                  >
                                    <legend>Odlomak {index + 1}</legend>

                                    <SectionActions
                                      index={index}
                                      total={sections.length}
                                      onInsertBelow={() =>
                                        handleInsertSectionAfter(
                                          arrayHelpers,
                                          index
                                        )
                                      }
                                      onMoveUp={() =>
                                        handleMoveSection(
                                          arrayHelpers,
                                          index,
                                          index - 1
                                        )
                                      }
                                      onMoveDown={() =>
                                        handleMoveSection(
                                          arrayHelpers,
                                          index,
                                          index + 1
                                        )
                                      }
                                    />

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

                                      <div
                                        className={`add-article-section-top-item ${
                                          isEntryRequirementsIconSelected ||
                                          isBestTimeToVisitIconSelected
                                            ? "is-special-entry-requirements"
                                            : ""
                                        }`}
                                      >
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
                                            if (!value) {
                                              setFieldValue(
                                                `sections.${index}.section_icon`,
                                                null
                                              );
                                              setFieldValue(
                                                `sections.${index}.show_visa_info`,
                                                false
                                              );
                                              setFieldValue(
                                                `sections.${index}.show_best_time_to_visit`,
                                                false
                                              );
                                              return;
                                            }

                                            const isEntryRequirementsIcon =
                                              isEntryRequirementsSectionIcon(
                                                value
                                              );
                                            const isBestTimeToVisitIcon =
                                              isBestTimeToVisitSectionIcon(
                                                value
                                              );

                                            setFieldValue(
                                              `sections.${index}.section_icon`,
                                              value.id
                                            );

                                            if (!isEntryRequirementsIcon) {
                                              setFieldValue(
                                                `sections.${index}.show_visa_info`,
                                                false
                                              );
                                            }

                                            if (!isBestTimeToVisitIcon) {
                                              setFieldValue(
                                                `sections.${index}.show_best_time_to_visit`,
                                                false
                                              );
                                            }
                                          }}
                                          selectedValue={
                                            values.sections[index].section_icon
                                          }
                                          filter={false}
                                          images={true}
                                        />
                                      </div>
                                    </div>

                                    {isEntryRequirementsIconSelected && (
                                      <div className="add-article-special-feature-panel">
                                        <div className="add-article-special-feature-header">
                                          {selectedIconUrl && (
                                            <img
                                              src={selectedIconUrl}
                                              alt="Ikonica uvjeta ulaska"
                                            />
                                          )}

                                          <div>
                                            <strong>
                                              Posebni blok za uvjete ulaska
                                            </strong>
                                            <p>
                                              Ova ikonica može prikazati
                                              interaktivni blok u kojem čitatelj
                                              sam bira svoje državljanstvo i
                                              provjerava treba li mu osobna,
                                              putovnica ili viza.
                                            </p>
                                          </div>
                                        </div>

                                        {canShowVisaInfoToggle ? (
                                          <div className="add-article-special-feature-toggle">
                                            <ToggleSwitch
                                              name={`show-visa-info-${index}`}
                                              description={
                                                "Prikaži uvjete ulaska u državu u ovom odlomku"
                                              }
                                              value={Boolean(
                                                section.show_visa_info
                                              )}
                                              setter={() =>
                                                setFieldValue(
                                                  `sections.${index}.show_visa_info`,
                                                  !section.show_visa_info
                                                )
                                              }
                                            />

                                            <p>
                                              Ako označite ovu opciju, VisaInfo
                                              blok će se prikazati iznad teksta
                                              ovog odlomka na stranici članka.
                                            </p>
                                          </div>
                                        ) : (
                                          <p className="add-article-special-feature-warning">
                                            Za prikaz uvjeta ulaska članak mora
                                            biti vezan uz državu. Prvo odaberite
                                            vrstu članka “Destinacija” i državu
                                            članka.
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    {isBestTimeToVisitIconSelected && (
                                      <div className="add-article-special-feature-panel">
                                        <div className="add-article-special-feature-header">
                                          {selectedIconUrl && (
                                            <img
                                              src={selectedIconUrl}
                                              alt="Ikonica najboljeg vremena za posjet"
                                            />
                                          )}

                                          <div>
                                            <strong>
                                              Posebni blok za najbolje vrijeme za posjet
                                            </strong>
                                            <p>
                                              Ova ikonica može prikazati
                                              interaktivni blok koji čitatelju
                                              pokazuje najbolje mjesece za
                                              posjet. Ako je članak vezan uz
                                              grad, prikazat će se podaci za
                                              grad. Ako je vezan samo uz državu,
                                              prikazat će se podaci za državu.
                                            </p>
                                          </div>
                                        </div>

                                        {canShowBestTimeToVisitToggle ? (
                                          <div className="add-article-special-feature-toggle">
                                            <ToggleSwitch
                                              name={`show-best-time-to-visit-${index}`}
                                              description={
                                                "Prikaži najbolje vrijeme za posjet u ovom odlomku"
                                              }
                                              value={Boolean(
                                                section.show_best_time_to_visit
                                              )}
                                              setter={() =>
                                                setFieldValue(
                                                  `sections.${index}.show_best_time_to_visit`,
                                                  !section.show_best_time_to_visit
                                                )
                                              }
                                            />

                                            <p>
                                              Ako označite ovu opciju, blok
                                              najboljeg vremena za posjet
                                              prikazat će se iznad teksta ovog
                                              odlomka na stranici članka.
                                            </p>
                                          </div>
                                        ) : (
                                          <p className="add-article-special-feature-warning">
                                            Za prikaz najboljeg vremena za
                                            posjet članak mora biti vezan uz
                                            državu. Ako odaberete i grad,
                                            prikazat će se gradska varijanta
                                            bloka.
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    <div className="add-article-input">
                                      <Field
                                        name={`sections[${index}].section_text`}
                                        label="Tekst odlomka *"
                                        as={AdvancedEditor}
                                      />
                                      <ErrorMessage
                                        name={`sections[${index}].section_text`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>

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
                                );
                              })
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
                          key={index}
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

                <div className="add-metatags-wrapper">
                  <div className="add-metatag-outer-container">
                    <FieldArray
                      name="metatags"
                      render={(arrayHelpersMetatag) => {
                        const metatags = values.metatags;

                        return (
                          <div className="add-metatags-container">
                            <div className="add-metatag-header">
                              <h6>Meta oznake</h6>

                              <Button
                                type="button"
                                circle
                                onClick={() => {
                                  handleAddMetatag(arrayHelpersMetatag);
                                }}
                              >
                                +
                              </Button>
                            </div>

                            {metatags && metatags.length > 0
                              ? metatags.map((_metatags, index) => (
                                  <Fragment key={index}>
                                    <div className="add-metatag-row">
                                      <Field
                                        name={`metatags.${index}.metatag_text`}
                                        type="text"
                                        as={Input}
                                        label=""
                                        placeholder="Unesi meta oznaku..."
                                      />

                                      <div
                                        onClick={() => {
                                          handleDeleteMetatag(
                                            arrayHelpersMetatag,
                                            index
                                          );
                                        }}
                                      >
                                        <Trash color="#AC2B2B" size={32} />
                                      </div>
                                    </div>

                                    <ErrorMessage
                                      name={`metatags.${index}.metatag_text`}
                                      component="div"
                                      className="error-message"
                                    />
                                  </Fragment>
                                ))
                              : null}
                          </div>
                        );
                      }}
                    />
                  </div>
                </div>

                <div className="add-article-toggle-container">
                  {selectedCountryId &&
                    values.article_type == ARTICLE_TYPE_DESTINATION_ID && (
                      <div className="add-article-toggle-item">
                        <ToggleSwitch
                          name={"main-country-post"}
                          description={"Dodaj članak kao glavni za državu"}
                          value={isMainCountryPostChecked}
                          setter={setIsMainCountryPostChecked}
                        />
                      </div>
                    )}

                  {isTipsArticleType(values.article_type) && (
                    <div className="add-article-toggle-item add-article-toggle-item-highlight">
                      <ToggleSwitch
                        name={"tips-featured"}
                        description={`Postavi kao istaknuti članak rubrike ${getTipsArticleTypeTitle(
                          values.article_type
                        )}`}
                        value={isTipsFeaturedChecked}
                        setter={() =>
                          setIsTipsFeaturedChecked(!isTipsFeaturedChecked)
                        }
                      />

                      <p>
                        Ako označite ovu opciju, ovaj članak će biti prikazan
                        kao istaknuti članak za rubriku{" "}
                        {getTipsArticleTypeTitle(values.article_type)}.
                      </p>
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
          <p>Loading...</p>
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

export default AddArticlePage;