// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

"use client";

import { useParams, useRouter } from "next/navigation";
import "./EditArticle.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  Article,
  ArticleType,
  CountriesData,
  GalleryImage,
  PlacesData,
  SectionIconsData,
  SectionImage,
} from "@/common/types";
import Modal from "@/components/atoms/Modal";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import Dropdown from "@/components/atoms/Dropdown";
import { Plus, Trash, X } from "@phosphor-icons/react";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import Button from "@/components/atoms/Button";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import Swal from "sweetalert2";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import {
  createTopCountryArticle,
  deleteArticleById,
  getArticleById,
  getFavoriteArticleByCountry,
  removeTopCountryArticle,
  updateArticle,
} from "@/utils/article";
import { addSection, deleteSection, updateSection } from "@/utils/sections";
import { addSectionImage, deleteSectionImage } from "@/utils/sectionImages";
import { addGalleryImage, deleteGalleryImage } from "@/utils/galleryImages";
import { addVideo, updateVideo, deleteVideo } from "@/utils/videos";
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
  addArticleSection,
  createEmptyArticleSection,
  deleteArticleSection,
  getSectionIconUrl,
  getSelectedSectionIcon,
  insertArticleSectionAfter,
  moveArticleSection,
} from "@/utils/sectionFormHelpers";
import {
  addArticleFormImage,
  addMetatag,
  articleValidationSchema,
  deleteArticleFormImage,
  deleteMetatag,
  fetchArticleFormOptions,
  fetchArticlePlaces,
  hasMainArticleImage,
  navigateToArticles,
  toggleDialog,
} from "@/utils/articleFormHelpers";
import {
  isBestTimeToVisitSectionIcon,
  isCountryLanguageSectionIcon,
  isEntryRequirementsSectionIcon,
} from "@/utils/sectionSpecialFeatures";
import { parseBooleanValue } from "@/utils/parseBooleanValue";

const EditArticle = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

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
  const [isMainCountryPost, setIsMainCountryPost] = useState(false);
  const [isFarDestinationChecked, setIsFarDestinationChecked] = useState(false);
  const [isTipsFeaturedChecked, setIsTipsFeaturedChecked] = useState(false);

  const handleSave = async (values: any) => {
    console.log("=== HANDLE SAVE STARTED ===");
    setIsSubmitClicked(true);

    if (!hasMainArticleImage(mainArticleImage)) {
      console.log("❌ Image validation failed");
      return;
    }

    console.log("✅ Images validated");

    const result = await Swal.fire({
      title: "Jeste li sigurni?",
      text: "Objavit ćete ovaj uređeni članak",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, objavi!",
    });

    console.log("Swal result:", result);

    if (!result.isConfirmed) {
      console.log("❌ User cancelled");
      return;
    }

    try {
      console.log("=== STARTING UPDATE PROCESS ===");

      let metatagsString = "";
      values.metatags.forEach(
        (el, index) =>
          (metatagsString += `${index !== 0 ? ", " : ""}${el.metatag_text}`)
      );
      console.log("Metatags string:", metatagsString);

      const dateString = new Date().toJSON().slice(0, 10);
      const todaysDate = new Date(dateString);

      console.log("1️⃣ Updating main article...", {
        id: article.id,
        title: values.article_title,
        subtitle: values.article_subtitle,
        description: values.article_description,
        metatags: metatagsString,
        mainArticleImage,
        article_type: values.article_type,
        article_country: values.article_country,
        article_place: values.article_place,
        article_airport_city_id: values.article_airport_city_id,
        is_far_destination: isFarDestinationChecked,
        is_tips_featured:
          isTipsArticleType(values.article_type) && isTipsFeaturedChecked,
      });

      const articleResponse = await updateArticle(
        article.id,
        values.article_title,
        values.article_subtitle,
        values.article_description,
        metatagsString,
        mainArticleImage,
        article.date_written,
        todaysDate,
        values.article_type,
        values.article_country,
        values.article_place,
        values.article_airport_city_id,
        isFarDestinationChecked,
        isTipsArticleType(values.article_type) && isTipsFeaturedChecked
      );

      console.log("✅ Article updated:", articleResponse);

      console.log(
        "2️⃣ Updating sections...",
        values.sections.length,
        "sections"
      );

      await Promise.all(
        values.sections.map(async (el, index) => {
          console.log(
            `   Section ${index + 1}:`,
            el.section_id ? "UPDATE" : "CREATE"
          );

          if (el.section_id) {
            const sectionResponse = await updateSection(
              el.section_id,
              el.section_text,
              el.section_subtitle,
              index + 1,
              el.section_url_title,
              el.section_url_link,
              el.section_icon,
              Boolean(el.show_visa_info),
              Boolean(el.show_best_time_to_visit),
              Boolean(el.show_country_language)
            );

            console.log(`   ✅ Section ${index + 1} updated:`, sectionResponse);

            const newImages =
              sectionImages[index]?.filter((img) => !img.id) || [];
            console.log(
              `   Adding ${newImages.length} new images to section ${index + 1}`
            );

            await Promise.all(
              newImages.map(async (image: SectionImage) => {
                const imgResponse = await addSectionImage(
                  image.url,
                  el.section_id,
                  image.width,
                  image.height
                );
                console.log(`   ✅ Image added:`, imgResponse);
                return imgResponse;
              })
            );
          } else {
            const response = await addSection(
              el.section_text,
              el.section_subtitle,
              index + 1,
              el.section_url_title,
              el.section_url_link,
              el.section_icon,
              article.id,
              Boolean(el.show_visa_info),
              Boolean(el.show_best_time_to_visit),
              Boolean(el.show_country_language)
            );

            console.log(`   ✅ Section ${index + 1} created:`, response);

            const newImages = sectionImages[index] || [];
            console.log(`   Adding ${newImages.length} images to new section`);

            await Promise.all(
              newImages.map(async (image: SectionImage) => {
                const imgResponse = await addSectionImage(
                  image.url,
                  response.id,
                  image.height,
                  image.width
                );
                console.log(`   ✅ Image added to new section:`, imgResponse);
                return imgResponse;
              })
            );
          }
        })
      );

      console.log("✅ All sections updated");

      const removedSections = article.sections
        .map((section) => section.id)
        .filter(
          (sectionId) =>
            !values.sections.some((section) => section.section_id === sectionId)
        );

      console.log("3️⃣ Deleting removed sections:", removedSections);

      await Promise.all(
        removedSections.map(async (id: number) => {
          const deleteResponse = await deleteSection(id);
          console.log(`   ✅ Section ${id} deleted:`, deleteResponse);
          return deleteResponse;
        })
      );

      console.log("✅ Removed sections deleted");

      const removedSectionImages = article.sections.map((section, index) =>
        section.section_images
          .map((image: SectionImage) => image.id)
          .filter(
            (imageId: number) =>
              !sectionImages[index]?.some((img) => img.id === imageId)
          )
      );

      const flatRemovedImages = removedSectionImages.flat();
      console.log("4️⃣ Deleting removed section images:", flatRemovedImages);

      await Promise.all(
        flatRemovedImages.map(async (id: number) => {
          const deleteResponse = await deleteSectionImage(id);
          console.log(`   ✅ Section image ${id} deleted:`, deleteResponse);
          return deleteResponse;
        })
      );

      console.log("✅ Removed section images deleted");

      const newGalleryImages = otherArticleImages.filter((img) => !img.id);
      console.log("5️⃣ Adding new gallery images:", newGalleryImages.length);

      await Promise.all(
        newGalleryImages.map(async (image: GalleryImage) => {
          const imgResponse = await addGalleryImage(
            image.url,
            article.id,
            image.height,
            image.width
          );
          console.log(`   ✅ Gallery image added:`, imgResponse);
          return imgResponse;
        })
      );

      console.log("✅ Gallery images added");

      const removedGalleryImages = article.gallery_images
        .map((image: GalleryImage) => image.id)
        .filter(
          (imageId) => !otherArticleImages.some((img) => img.id === imageId)
        );

      console.log("6️⃣ Deleting removed gallery images:", removedGalleryImages);

      await Promise.all(
        removedGalleryImages.map(async (id: number) => {
          const deleteResponse = await deleteGalleryImage(id);
          console.log(`   ✅ Gallery image ${id} deleted:`, deleteResponse);
          return deleteResponse;
        })
      );

      console.log("✅ Gallery images deleted");

      console.log("7️⃣ Handling top country article...");
      console.log("   isMainCountryPostChecked:", isMainCountryPostChecked);
      console.log("   isMainCountryPost:", isMainCountryPost);

      if (isMainCountryPostChecked) {
        console.log("   Creating top country article...");
        const topResponse = await createTopCountryArticle(id);
        console.log("   ✅ Top country article created:", topResponse);
      } else if (isMainCountryPost) {
        console.log("   Removing top country article...");
        const removeResponse = await removeTopCountryArticle(id);
        console.log("   ✅ Top country article removed:", removeResponse);
      }

      console.log("✅ Top country article handled");

      console.log("Handling video...");
      const hasVideo =
        values.article_video && values.article_video.trim() !== "";
      const existingVideo = article.video;

      if (hasVideo && existingVideo) {
        console.log("   Updating existing video...", existingVideo.id);
        await updateVideo(existingVideo.id, values.article_video);
        console.log("   ✅ Video updated");
      } else if (hasVideo && !existingVideo) {
        console.log("   Adding new video...");
        await addVideo(values.article_video, article.id, null, null);
        console.log("   ✅ Video added");
      } else if (!hasVideo && existingVideo) {
        console.log("   Deleting existing video...", existingVideo.id);
        await deleteVideo(existingVideo.id);
        console.log("   ✅ Video deleted");
      } else {
        console.log("   No video changes needed");
      }

      console.log("=== UPDATE COMPLETE ===");
      router.push("/admin/clanci");
      notifySuccess("Uspješno uređen članak!");
    } catch (error) {
      console.error("❌ ERROR in handleSave:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        name: error.name,
      });
      notifyFailure("Došlo je do pogreške prilikom uređivanja članka.");
    }
  };

  const resendNewsletter = async () => {
    const result = await Swal.fire({
      title: "Jeste li sigurni?",
      text: "Poslat ćete newsletter svim pretplatnicima.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, pošalji!",
    });

    if (result.isConfirmed) {
      try {
        const subscribers = await getSubscribersWithoutPagination();
        const articleDataMapped = {
          id: article.id,
          article_title: article.title,
          article_subtitle: article.subtitle,
          article_description: article.description,
          mainArticleImage: article.main_image_url,
          article_type_id: article.articleTypeId,
        };
        await sendNewsletterToSubscribers(subscribers, articleDataMapped);
        notifySuccess("Newsletter uspješno poslan pretplatnicima!");
      } catch (error) {
        console.error("Error sending newsletter:", error);
        notifyFailure("Došlo je do pogreške prilikom slanja newslettera.");
      }
    }
  };

  const handleCancel = () => {
    navigateToArticles(router);
  };

  const handleDeleteSection = (arrayHelpers, sectionIndex) => {
    deleteArticleSection(arrayHelpers, setSectionImages, sectionIndex);
  };

  const handleAddSection = (arrayHelpers) => {
    addArticleSection(
      arrayHelpers,
      setSectionImages,
      createEmptyArticleSection({
        includeId: true,
        includeSectionId: true,
        includeOrder: true,
      })
    );
  };

  const handleDeleteImage = (
    type: string,
    itemIndex?: number,
    sectionIndex?: number
  ) => {
    deleteArticleFormImage({
      type,
      itemIndex,
      sectionIndex,
      setMainArticleImage,
      setOtherArticleImages,
      setSectionImages,
      setImageType,
      emptyMainImageValue: null,
    });
  };

  const handleAddImage = () => {
    addArticleFormImage({
      imageType,
      modalInputValue,
      imageWidthValue,
      imageHeightValue,
      sectionSelected,
      setMainArticleImage,
      setOtherArticleImages,
      setSectionImages,
      setModalInputValue,
      setImageHeightValue,
      setImageWidthValue,
      includeOtherImageDimensions: true,
      includeSectionImageId: true,
      emptySectionImageDimensionValue: null,
    });
  };

  const fetchData = async () => {
    try {
      console.log("Fetching data for article ID:", id);
      if (id) {
        const {
          articleTypesData,
          countriesData,
          sectionIconsData,
          airportsData,
        } = await fetchArticleFormOptions();
        const articleData = await getArticleById(parseInt(id), true);

        let isSetAsMainCountryPost = null;

        if (articleData.countryId) {
          isSetAsMainCountryPost = await getFavoriteArticleByCountry(
            articleData.countryId,
            true
          );
        }

        setArticleTypes(articleTypesData);
        setCountries(countriesData);
        setSectionIcons(sectionIconsData);
        setArticle(articleData);
        setMainArticleImage(articleData.main_image_url);
        setIsMainCountryPostChecked(isSetAsMainCountryPost?.id == id);
        setIsMainCountryPost(isSetAsMainCountryPost?.id == id);
        setSelectedCountryId(articleData.countryId || "");
        setIsFarDestinationChecked(Boolean(articleData.isFarDestination));
        setIsTipsFeaturedChecked(parseBooleanValue(articleData.isTipsFeatured));
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
    const placesData = await fetchArticlePlaces(selectedCountryId);
    setPlaces(placesData);
  };

  useEffect(() => {
    if (id) {
      fetchData();
    }
  }, [id]);

  useEffect(() => {
    if (selectedCountryId) {
      fetchPlacesData();
    }
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

        router.push("/admin/clanci");
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
                metatags: article.metatags.split(",").map((tag) => ({
                  metatag_text: tag.trim(),
                })),
                sections: article.sections
                  ? article.sections.map((el) => ({
                      section_id: el.id,
                      section_subtitle: el.subtitle,
                      section_text: el.text,
                      section_url_title: el.link_title,
                      section_url_link: el.link_url,
                      section_icon: el.sectionIconId,
                      show_visa_info:
                        parseBooleanValue(el.show_visa_info) ||
                        parseBooleanValue(el.showVisaInfo),
                      show_best_time_to_visit:
                        parseBooleanValue(el.show_best_time_to_visit) ||
                        parseBooleanValue(el.showBestTimeToVisit),
                      show_country_language:
                        parseBooleanValue(el.show_country_language) ||
                        parseBooleanValue(el.showCountryLanguage),
                    }))
                  : [],
              }}
              validationSchema={articleValidationSchema}
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

                    <div className="edit-article-input">
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
                      <div className="edit-article-input">
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

                            values.sections.forEach(
                              (_section: any, index: number) => {
                                setFieldValue(
                                  `sections.${index}.show_visa_info`,
                                  false
                                );
                                setFieldValue(
                                  `sections.${index}.show_best_time_to_visit`,
                                  false
                                );
                                setFieldValue(
                                  `sections.${index}.show_country_language`,
                                  false
                                );
                              }
                            );

                            if (value != ARTICLE_TYPE_AIRPLANE_TICKET_ID) {
                              setIsFarDestinationChecked(false);
                            }

                            if (value != ARTICLE_TYPE_DESTINATION_ID) {
                              setIsMainCountryPostChecked(false);
                              setIsMainCountryPost(false);
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
                          <div className="edit-article-input">
                            <Field
                              name="article_country"
                              type="text"
                              as={AdvancedDropdown}
                              label="Država članka (opcionalno)"
                              hardcodedValue="Odaberi državu o kojoj se radi..."
                              options={countries}
                              onChange={(value) => {
                                if (!value) {
                                  setFieldValue("article_country", null);
                                  setFieldValue("article_place", null);
                                  setSelectedCountryId("");

                                  values.sections.forEach(
                                    (_section: any, index: number) => {
                                      setFieldValue(
                                        `sections.${index}.show_visa_info`,
                                        false
                                      );
                                      setFieldValue(
                                        `sections.${index}.show_best_time_to_visit`,
                                        false
                                      );
                                      setFieldValue(
                                        `sections.${index}.show_country_language`,
                                        false
                                      );
                                    }
                                  );

                                  return;
                                }

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
                                  setFieldValue(
                                    "article_place",
                                    value ? value.id : null
                                  );
                                }}
                                selectedValue={values.article_place}
                                filter
                              />
                            )}
                        </>
                      )}

                      {values.article_type == ARTICLE_TYPE_AIRPLANE_TICKET_ID &&
                        airportCities && (
                          <div className="edit-article-airport-row">
                            <div className="edit-article-input">
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
                                    value ? value.id : null
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

                            <div className="edit-article-airport-toggle">
                              <div className="edit-article-toggle-item">
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

                    {values.article_type == ARTICLE_TYPE_DESTINATION_ID &&
                      values.article_country != "" &&
                      values.article_country && (
                        <Button
                          red
                          onClick={() => {
                            setSelectedCountryId(null);
                            setFieldValue("article_country", null);
                            setFieldValue("article_place", null);

                            values.sections.forEach(
                              (_section: any, index: number) => {
                                setFieldValue(
                                  `sections.${index}.show_visa_info`,
                                  false
                                );
                                setFieldValue(
                                  `sections.${index}.show_best_time_to_visit`,
                                  false
                                );
                                setFieldValue(
                                  `sections.${index}.show_country_language`,
                                  false
                                );
                              }
                            );
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
                          toggleDialog(dialogRef);
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
                              ? sections.map((section, index) => {
                                  const selectedIcon = getSelectedSectionIcon(
                                    sectionIcons,
                                    section.section_icon
                                  );
                                  const selectedIconUrl =
                                    getSectionIconUrl(selectedIcon);
                                  const isEntryRequirementsIconSelected =
                                    isEntryRequirementsSectionIcon(
                                      selectedIcon
                                    );
                                  const isBestTimeToVisitIconSelected =
                                    isBestTimeToVisitSectionIcon(selectedIcon);
                                  const isCountryLanguageIconSelected =
                                    isCountryLanguageSectionIcon(selectedIcon);

                                  const isSpecialFeatureIconSelected =
                                    isEntryRequirementsIconSelected ||
                                    isBestTimeToVisitIconSelected ||
                                    isCountryLanguageIconSelected;

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

                                  const canShowCountryLanguageToggle =
                                    isCountryLanguageIconSelected &&
                                    values.article_type ==
                                      ARTICLE_TYPE_DESTINATION_ID &&
                                    values.article_country;

                                  return (
                                    <fieldset
                                      key={index}
                                      className="edit-article-section"
                                    >
                                      <legend>Odlomak {index + 1}</legend>

                                      <SectionActions
                                        index={index}
                                        total={sections.length}
                                        onInsertBelow={() =>
                                          insertArticleSectionAfter(
                                            arrayHelpers,
                                            setSectionImages,
                                            index,
                                            createEmptyArticleSection({
                                              includeSectionId: true,
                                            })
                                          )
                                        }
                                        onMoveUp={() =>
                                          moveArticleSection(
                                            arrayHelpers,
                                            setSectionImages,
                                            index,
                                            index - 1
                                          )
                                        }
                                        onMoveDown={() =>
                                          moveArticleSection(
                                            arrayHelpers,
                                            setSectionImages,
                                            index,
                                            index + 1
                                          )
                                        }
                                      />

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

                                        <div
                                          className={`edit-article-section-top-item ${
                                            isSpecialFeatureIconSelected
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
                                                setFieldValue(
                                                  `sections.${index}.show_country_language`,
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
                                              const isCountryLanguageIcon =
                                                isCountryLanguageSectionIcon(
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

                                              if (!isCountryLanguageIcon) {
                                                setFieldValue(
                                                  `sections.${index}.show_country_language`,
                                                  false
                                                );
                                              }
                                            }}
                                            selectedValue={
                                              values.sections[index]
                                                .section_icon
                                            }
                                            filter={false}
                                            images={true}
                                          />
                                        </div>
                                      </div>

                                      {isEntryRequirementsIconSelected && (
                                        <div className="edit-article-special-feature-panel">
                                          <div className="edit-article-special-feature-header">
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
                                                interaktivni blok u kojem
                                                čitatelj sam bira svoje
                                                državljanstvo i provjerava treba
                                                li mu osobna, putovnica ili
                                                viza.
                                              </p>
                                            </div>
                                          </div>

                                          {canShowVisaInfoToggle ? (
                                            <div className="edit-article-special-feature-toggle">
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
                                                Ako označite ovu opciju,
                                                VisaInfo blok će se prikazati
                                                iznad teksta ovog odlomka na
                                                stranici članka.
                                              </p>
                                            </div>
                                          ) : (
                                            <p className="edit-article-special-feature-warning">
                                              Za prikaz uvjeta ulaska članak
                                              mora biti vezan uz državu. Prvo
                                              odaberite vrstu članka
                                              “Destinacija” i državu članka.
                                            </p>
                                          )}
                                        </div>
                                      )}

                                      {isBestTimeToVisitIconSelected && (
                                        <div className="edit-article-special-feature-panel">
                                          <div className="edit-article-special-feature-header">
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
                                                grad. Ako je vezan samo uz
                                                državu, prikazat će se podaci za
                                                državu.
                                              </p>
                                            </div>
                                          </div>

                                          {canShowBestTimeToVisitToggle ? (
                                            <div className="edit-article-special-feature-toggle">
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
                                            <p className="edit-article-special-feature-warning">
                                              Za prikaz najboljeg vremena za
                                              posjet članak mora biti vezan uz
                                              državu. Ako odaberete i grad,
                                              prikazat će se gradska varijanta
                                              bloka.
                                            </p>
                                          )}
                                        </div>
                                      )}

{isCountryLanguageIconSelected && (
                                        <div className="edit-article-special-feature-panel">
                                          <div className="edit-article-special-feature-header">
                                            {selectedIconUrl && (
                                              <img
                                                src={selectedIconUrl}
                                                alt="Ikonica korisnih fraza i jezika"
                                              />
                                            )}

                                            <div>
                                              <strong>
                                                Posebni blok za jezik i korisne fraze
                                              </strong>
                                              <p>
                                                Ova ikonica može prikazati
                                                interaktivni blok s osnovnim
                                                korisnim frazama za državu
                                                članka. Čitatelji mogu vidjeti
                                                najvažnije izraze za putovanje,
                                                poput pozdrava, zahvale i
                                                osnovnih riječi.
                                              </p>
                                            </div>
                                          </div>

                                          {canShowCountryLanguageToggle ? (
                                            <div className="edit-article-special-feature-toggle">
                                              <ToggleSwitch
                                                name={`show-country-language-${index}`}
                                                description={
                                                  "Prikaži jezik i korisne fraze u ovom odlomku"
                                                }
                                                value={Boolean(
                                                  section.show_country_language
                                                )}
                                                setter={() =>
                                                  setFieldValue(
                                                    `sections.${index}.show_country_language`,
                                                    !section.show_country_language
                                                  )
                                                }
                                              />

                                              <p>
                                                Ako označite ovu opciju,
                                                CountryLanguage blok prikazat će
                                                se iznad teksta ovog odlomka na
                                                stranici članka.
                                              </p>
                                            </div>
                                          ) : (
                                            <p className="edit-article-special-feature-warning">
                                              Za prikaz jezika i korisnih fraza
                                              članak mora biti vezan uz državu.
                                              Prvo odaberite vrstu članka
                                              “Destinacija” i državu članka.
                                            </p>
                                          )}
                                        </div>
                                      )}

                                      <div className="edit-article-input">
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
                                            (sectionImages[index] || []).map((el, imageIndex) => (
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

                                          {(sectionImages[index] || []).length < 2 && (
                                            <div
                                              className="edit-article-item"
                                              onClick={() => {
                                                toggleDialog(dialogRef);
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
                          toggleDialog(dialogRef);
                          setImageType("other");
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    </div>
                  </div>

                  <div className="edit-metatags-wrapper">
                    <div className="edit-metatag-outer-container">
                      <FieldArray
                        name="metatags"
                        render={(arrayHelpersMetatag) => {
                          const metatags = values.metatags;

                          return (
                            <div className="edit-metatags-container">
                              <div className="edit-metatag-header">
                                <h6>Meta oznake</h6>

                                <Button
                                  type="button"
                                  circle
                                  onClick={() => {
                                    addMetatag(arrayHelpersMetatag);
                                  }}
                                >
                                  +
                                </Button>
                              </div>

                              {metatags && metatags.length > 0
                                ? metatags.map((_metatags, index) => (
                                    <Fragment key={index}>
                                      <div className="edit-metatag-row">
                                        <Field
                                          name={`metatags.${index}.metatag_text`}
                                          type="text"
                                          as={Input}
                                          label=""
                                          placeholder="Unesi meta oznaku..."
                                        />

                                        <div
                                          onClick={() => {
                                            deleteMetatag(
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

                  <div className="edit-article-toggle-container">
                    {selectedCountryId &&
                      values.article_type == ARTICLE_TYPE_DESTINATION_ID && (
                        <div className="edit-article-toggle-item">
                          <ToggleSwitch
                            name={"main-country-post"}
                            description={"Postavi kao glavni članak države"}
                            value={isMainCountryPostChecked}
                            setter={setIsMainCountryPostChecked}
                          />
                        </div>
                      )}

                    {isTipsArticleType(values.article_type) && (
                      <div className="edit-article-toggle-item edit-article-toggle-item-highlight">
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
                  </div>

                  <div className="edit-article-buttons">
                    <Button type="submit" adminPrimary>
                      uredi članak
                    </Button>

                    <Button type="button" white onClick={handleCancel}>
                      Odustani
                    </Button>

                    <Button
                      type="button"
                      adminPrimary
                      onClick={resendNewsletter}
                    >
                      Ponovno pošalji newsletter pretplatnicima
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
          toggleDialog={() => toggleDialog(dialogRef)}
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
