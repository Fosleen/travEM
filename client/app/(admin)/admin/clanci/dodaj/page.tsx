// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";
import { getArticleScheduleHoursError } from "@/utils/articleSchedule";
import ArticleSchedulePicker from "@/components/admin/organisms/ArticleSchedulePicker";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import "./AddArticle.scss";
import { useRouter } from "next/navigation";
import {readDealArticlePrefill,clearDealArticlePrefill} from '@/utils/dealArticlePrefill.mjs';
import {dealFinderApi} from '@/utils/dealFinder';
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import { Fragment, useEffect, useRef, useState } from "react";
import Dropdown from "@/components/atoms/Dropdown";
import { Plus, Trash, X } from "@phosphor-icons/react";
import Swal from "sweetalert2";
import {
  ArticleType,
  CountriesData,
  PlacesData,
  SectionIconsData,
} from "@/common/types";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import {
  addArticle,
  createTopCountryArticle,
  createTopPlaceArticle,
} from "@/utils/article";
import { addSection } from "@/utils/sections";
import Modal from "@/components/atoms/Modal";
import { addSectionImage } from "@/utils/sectionImages";
import { addGalleryImage } from "@/utils/galleryImages";
import { notifyFailure, notifySuccess } from "@/components/atoms/Toast/Toast";
import Textarea from "@/components/admin/atoms/Textarea";
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
import {
  formatDateTimeInTimeZone,
  getArticleScheduleTimeZoneOptions,
  getBrowserTimeZone,
  ZAGREB_TIME_ZONE,
  zonedDateTimeLocalToUtcIso,
} from "@/utils/articleSchedule";
import { useDashboardUser } from "@/context/DashboardUserContext";
import ArticleAuthorHelp from "@/components/admin/organisms/ArticleAuthorHelp";
import { articleReviewAction } from "@/utils/articleReview";
import AffiliateLinksEditor from "@/components/admin/organisms/AffiliateLinksEditor/AffiliateLinksEditor";
import UnsavedChangesGuard, {
  confirmDiscardChanges,
} from "@/components/admin/atoms/UnsavedChangesGuard";
import {
  getAffiliatePartners,
  mergeArticleAffiliateLinks,
  persistAffiliatePartners,
  saveArticleAffiliateLinks,
} from "@/utils/affiliateLinks";

const AddArticlePage = () => {
  const router = useRouter();
  const { isAdmin } = useDashboardUser();
  const [dealPrefill,setDealPrefill]=useState(null);
  const [prefillReady,setPrefillReady]=useState(false);
  const prefillToken=useRef<string|null>(null);
  const [articleTypes, setArticleTypes] = useState<ArticleType | string>("");
  const [countries, setCountries] = useState<CountriesData | string>("");
  const [places, setPlaces] = useState<PlacesData | string>("");
  const [airportCities, setAirportCities] = useState("");
  const [sectionIcons, setSectionIcons] = useState<SectionIconsData | string>(
    ""
  );
  const [affiliateLinks, setAffiliateLinks] = useState([]);

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
  const [isMainPlacePostChecked, setIsMainPlacePostChecked] = useState(false);
  const [isNotifySubscribersChecked, setIsNotifySubscribersChecked] =
    useState(true);
  const [isFarDestinationChecked, setIsFarDestinationChecked] = useState(false);
  const [isTipsFeaturedChecked, setIsTipsFeaturedChecked] = useState(false);
  const [isDomagoPartnerChecked, setIsDomagoPartnerChecked] = useState(false);
  const [isScheduleChecked, setIsScheduleChecked] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState("");
  const [scheduleTimezone, setScheduleTimezone] = useState(getBrowserTimeZone());

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

  const handleSave = async (values: any) => {
    setIsSubmitClicked(true);

    if (hasMainArticleImage(mainArticleImage)) {
      const publishAt = isScheduleChecked
        ? zonedDateTimeLocalToUtcIso(scheduleDateTime, scheduleTimezone)
        : null;

      if (isScheduleChecked && !publishAt) {
        notifyFailure("Odaberite datum i vrijeme zakazane objave.");
        return;
      }

      if (publishAt && new Date(publishAt).getTime() <= Date.now()) {
        notifyFailure("Zakazana objava mora biti u budućnosti.");
        return;
      }

      const scheduleError = isScheduleChecked ? getArticleScheduleHoursError(scheduleDateTime, scheduleTimezone) : "";
      if (scheduleError) {
        notifyFailure(scheduleError);
        return;
      }

      Swal.fire({
        title: "Jeste li sigurni?",
        text: !isAdmin ? "Poslat ćete članak administratoru na pregled. Objavit će se tek nakon odobrenja." : isScheduleChecked
          ? "Zakazat ćete objavu ovog članka"
          : "Objavit ćete ovaj članak",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2BAC82",
        cancelButtonColor: "#AC2B2B",
        cancelButtonText: "Odustani",
        confirmButtonText: isAdmin ? "Da, objavi!" : "Pošalji na pregled",
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
              isTipsArticleType(values.article_type) && isTipsFeaturedChecked,
              isDomagoPartnerChecked,
              isScheduleChecked ? publishAt : isAdmin ? undefined : null,
              isScheduleChecked || !isAdmin ? scheduleTimezone : undefined,
              isScheduleChecked || !isAdmin ? isNotifySubscribersChecked : undefined
            );

            if (isAdmin && affiliateLinks.length > 0) {
              const persistedAffiliateLinks = await persistAffiliatePartners(
                affiliateLinks
              );
              setAffiliateLinks(persistedAffiliateLinks);
              await saveArticleAffiliateLinks(
                articleResponse.id,
                persistedAffiliateLinks
              );
            }

            const galleryResults = await Promise.all(
              otherArticleImages.map((image) =>
                addGalleryImage(image.url, articleResponse.id, "0", "0")
              )
            );
            console.log("Gallery images saved:", galleryResults);

            await Promise.all([
              isAdmin && isMainCountryPostChecked
                ? createTopCountryArticle(articleResponse.id)
                : Promise.resolve(),

              isAdmin && isMainPlacePostChecked && values.article_place
                ? createTopPlaceArticle(articleResponse.id)
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
                    Boolean(section.show_best_time_to_visit),
                    Boolean(section.show_country_language)
                  );

                  return Promise.all(
                    sectionImages[index].map((el: any) =>
                      limit(() => addSectionImage(el.url, sectionResponse.id))
                    )
                  );
                })
              ),
            ]);

            if (!isAdmin) {
              await articleReviewAction(articleResponse.id, "submit-review");
              notifySuccess(isScheduleChecked ? "Članak je zakazan i poslan na pregled. Objavit će se nakon odobrenja." : "Članak je poslan na pregled.");
            } else if (!isScheduleChecked && isNotifySubscribersChecked) {
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
              notifySuccess(
                isScheduleChecked
                  ? "Članak je uspješno zakazan!"
                  : "Članak je uspješno objavljen!"
              );
            }

            if(dealPrefill){
              clearDealArticlePrefill(sessionStorage,prefillToken.current);
              if(!isScheduleChecked){
                try{await dealFinderApi(`/offers/${dealPrefill.offerId}/dismiss`,{});}
                catch(error){console.warn('Članak je spremljen, ali ponuda nije uklonjena.',error);}
              }
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

  const handleCancel = async () => {
    if (await confirmDiscardChanges()) navigateToArticles(router);
  };

  const handleDeleteSection = (arrayHelpers: any, sectionIndex: number) => {
    deleteArticleSection(arrayHelpers, setSectionImages, sectionIndex);
  };

  const handleAddSection = (arrayHelpers: any) => {
    addArticleSection(
      arrayHelpers,
      setSectionImages,
      createEmptyArticleSection({ includeOrder: true })
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
    });
  };

  const fetchData = async (prepared = null) => {
    try {
      const {
        articleTypesData,
        countriesData,
        sectionIconsData,
        airportsData,
      } = await fetchArticleFormOptions();

      setArticleTypes(articleTypesData);
      setCountries(countriesData);
      setSectionIcons(sectionIconsData);
      setAirportCities(airportsData);
      try {
        const partners = isAdmin ? await getAffiliatePartners() : [];
        setAffiliateLinks(mergeArticleAffiliateLinks(partners,prepared?.affiliateLinks||[]));
      } catch (error) {
        console.warn("Affiliate tables are not installed yet.", error);
        setAffiliateLinks([]);
      }
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    let cancelled=false;
    void Promise.resolve().then(()=>{
    if(cancelled)return;
    const token=new URLSearchParams(window.location.search).get('dealFinder');
    const prepared=readDealArticlePrefill(sessionStorage,token);
    if(prepared){
      prefillToken.current=token;setDealPrefill(prepared);
      setSectionImages(prepared.values.sections.map(section=>(section.section_images||[]).map(image=>({url:image.url}))));
      setIsFarDestinationChecked(prepared.outsideEurope===true);
      setIsNotifySubscribersChecked(false);
    }
    setPrefillReady(true);
    fetchData(prepared);
    });
    return()=>{cancelled=true;};
  }, []);

  useEffect(() => {
    if(!selectedCountryId)return;
    let cancelled=false;
    void fetchArticlePlaces(selectedCountryId).then(data=>{if(!cancelled)setPlaces(data);});
    return()=>{cancelled=true;};
  }, [selectedCountryId]);

  return (
    <>
      <div className="add-article-container">
        <h2>Unesi novi članak</h2>
        {dealPrefill?.automation&&<aside className="deal-finder-import-summary" role="status"><strong>Popunjeno iz Deal Findera</strong><ul><li>{dealPrefill.automation.video?`Video iz postojećeg sadržaja: ${dealPrefill.automation.video.sourceTitle}`:'Za destinaciju nije pronađen spremljeni video. Možeš ga dodati ručno.'}</li>{dealPrefill.automation.affiliateUpdates.map((item)=><li key={item.partnerName}>{item.partnerName}: {item.source}.</li>)}{dealPrefill.automation.warnings.map((message,index)=><li key={`warning-${index}`}>{message}</li>)}</ul><p>Ostale poveznice zadržavaju postojeće vrijednosti. Sve možeš urediti prije objave; globalni affiliate URL-ovi ostaju sačuvani.</p></aside>}
        {articleTypes && countries && prefillReady ? (
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
                createEmptyArticleSection(),
              ],
              ...(dealPrefill?.values||{}),
            }}
            validationSchema={articleValidationSchema}
            onSubmit={handleSave}
          >
            {({ values, setFieldValue, isSubmitting }) => (
              <Form className="add-article-form">
                <UnsavedChangesGuard active={!isSubmitting} />
                <div className="add-article-inputs">
                  <div className="add-article-input">
                    <Field
                      name="article_title"
                      type="text"
                      as={Input}
                      label="Naslov članka *"
                      placeholder={isAdmin ? "Unesi naslov..." : "Unesite naslov - najviše 100 znakova"}
                      maxLength={100}
                    />
                      {!isAdmin && <ArticleAuthorHelp field="title" />}
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
                      placeholder={isAdmin ? "Opis članka u par riječi..." : "1 do max 3 pojma - kratki CTA"}
                    />
                      {!isAdmin && <ArticleAuthorHelp field="subtitle" />}
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
                      placeholder={isAdmin ? "Opis članka u nekoliko rečenica..." : "Kratak uvod i poziv na čitanje - najviše 100 znakova"}
                      maxLength={100}
                    />
                      {!isAdmin && <ArticleAuthorHelp field="description" />}
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
                            setFieldValue(
                              `sections.${index}.show_country_language`,
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
                      {!isAdmin && <ArticleAuthorHelp field="video" />}

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

                <p>* naslovna slika mora biti horizontalne orijentacije</p>

                <div>
                  <h6>Odlomci</h6>
                  {!isAdmin && <ArticleAuthorHelp field="sections" />}
                    <FieldArray
                    name="sections"
                    render={(arrayHelpers) => {
                      const sections = values.sections;

                      return (
                        <div className="add-article-sections-container">
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
                                    className="add-article-section"
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
                                            includeOrder: true,
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

{isCountryLanguageIconSelected && (
                                      <div className="add-article-special-feature-panel">
                                        <div className="add-article-special-feature-header">
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
                                              korisnim frazama za državu članka.
                                              Čitatelji mogu vidjeti najvažnije
                                              izraze za putovanje, poput
                                              pozdrava, zahvale i osnovnih
                                              riječi.
                                            </p>
                                          </div>
                                        </div>

                                        {canShowCountryLanguageToggle ? (
                                          <div className="add-article-special-feature-toggle">
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
                                          <p className="add-article-special-feature-warning">
                                            Za prikaz jezika i korisnih fraza
                                            članak mora biti vezan uz državu.
                                            Prvo odaberite vrstu članka
                                            “Destinacija” i državu članka.
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
                                      * Ako uz odlomak dodajete jednu sliku, ona mora biti horizontalne orijentacije. Ako dodajete dvije slike, obje moraju biti vertikalne orijentacije.
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
                        toggleDialog(dialogRef);
                        setImageType("other");
                      }}
                    >
                      <Plus size={32} color="#616161" weight="bold" />
                    </div>
                  </div>
                </div>

                {isAdmin && <AffiliateLinksEditor
                  value={affiliateLinks}
                  onChange={setAffiliateLinks}
                />}

                <div className="add-metatags-wrapper">
                  <div className="add-metatag-outer-container">
                    <FieldArray
                      name="metatags"
                      render={(arrayHelpersMetatag) => {
                        const metatags = values.metatags;

                        return (
                          <div className="add-metatags-container">
                            <div className="add-metatag-header">
                              <h6>Meta oznake</h6><p>SEO meta oznake pišu se odvojene zarezom.</p>

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

                <div className="add-article-toggle-container">
                  {isAdmin && selectedCountryId &&
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

                  {isAdmin && values.article_place &&
                    values.article_type == ARTICLE_TYPE_DESTINATION_ID && (
                      <div className="add-article-toggle-item">
                        <ToggleSwitch
                          name={"main-place-post"}
                          description={"Dodaj članak kao glavni za mjesto"}
                          value={isMainPlacePostChecked}
                          setter={setIsMainPlacePostChecked}
                        />
                      </div>
                    )}

                  {isAdmin && isTipsArticleType(values.article_type) && (
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

                  {isAdmin && <div className="add-article-toggle-item">
                    <ToggleSwitch
                      name={"domago-partner"}
                      description={"Partner banner"}
                      value={isDomagoPartnerChecked}
                      setter={setIsDomagoPartnerChecked}
                    />
                  </div>}

                  <div className="add-article-toggle-item">
                    <ToggleSwitch
                      name={"notify-subscribers"}
                      description={
                        isScheduleChecked
                          ? "Obavijesti pretplatnike kad članak bude objavljen"
                          : "Obavijesti pretplatnike o ovom članku"
                      }
                      value={isNotifySubscribersChecked}
                      setter={() =>
                        setIsNotifySubscribersChecked(
                          !isNotifySubscribersChecked
                        )
                      }
                    />
                  </div>
                  <div className="add-article-toggle-item">
                    <ToggleSwitch
                      name={"schedule-article"}
                      description={"Zakaži objavu članka"}
                      value={isScheduleChecked}
                      setter={() => setIsScheduleChecked(!isScheduleChecked)}
                    />
                  </div>
                </div>

                <div className="add-article-schedule-container">
                  {isScheduleChecked && (
                    <div className="add-article-schedule-panel">
                      <div className="add-article-schedule-grid">
                        <ArticleSchedulePicker value={scheduleDateTime} timeZone={scheduleTimezone} onChange={setScheduleDateTime} />

                        <label>
                          Vremenska zona
                          <select
                            value={scheduleTimezone}
                            onChange={(event) =>
                              setScheduleTimezone(event.target.value)
                            }
                          >
                            {getArticleScheduleTimeZoneOptions(
                              scheduleTimezone
                            ).map((timeZone) => (
                              <option
                                key={timeZone.value}
                                value={timeZone.value}
                              >
                                {timeZone.label} ({timeZone.value})
                              </option>
                            ))}
                          </select>
                        </label>
                      </div>

                      {scheduleDateTime && (
                        <div className="add-article-schedule-preview">
                          <span>
                            Lokalno:{" "}
                            {formatDateTimeInTimeZone(
                              zonedDateTimeLocalToUtcIso(
                                scheduleDateTime,
                                scheduleTimezone
                              ),
                              scheduleTimezone
                            )}
                          </span>
                          <span>
                            Zagreb:{" "}
                            {formatDateTimeInTimeZone(
                              zonedDateTimeLocalToUtcIso(
                                scheduleDateTime,
                                scheduleTimezone
                              ),
                              ZAGREB_TIME_ZONE
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="add-article-buttons">
                  <Button type="submit" adminPrimary>
                    {isAdmin ? (isScheduleChecked ? "Zakaži članak" : "Objavi članak") : (isScheduleChecked ? "Zakaži članak i pošalji na pregled" : "Pošalji na pregled")}
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
    </>
  );
};

export default AddArticlePage;
