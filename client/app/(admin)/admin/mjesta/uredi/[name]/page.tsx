// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { PlacesData } from "@/common/types";
import Button from "@/components/atoms/Button";
import "./EditPlace.scss";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Textarea from "@/components/admin/atoms/Textarea";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import Input from "@/components/atoms/Input";
import Modal from "@/components/atoms/Modal";
import Swal from "sweetalert2";
import { deletePlaceById, getPlacesByName, updatePlace } from "@/utils/places";
import { notifySuccess } from "@/components/atoms/Toast/Toast";
import { Plus, Trash, X } from "@phosphor-icons/react";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import { addVideo, deleteVideo, updateVideo } from "@/utils/videos";
import { useParams, useRouter } from "next/navigation";
import {
  addMainPlaceImage,
  addVideoField,
  bestTimeMonths,
  buildBestTimeToVisitPayload,
  createPlaceValidationSchema,
  deleteMainPlaceImage,
  deleteVideoField,
  fetchCountryDropdownOptions,
  getInitialBestTimeToVisit,
  grammarRows,
  hasMainPlaceImage,
  navigateToPlaces,
  toggleDialog,
} from "@/utils/placeFormHelpers";

const EditPlace = () => {
  const params = useParams();
  const router = useRouter();
  const name = params?.name as string;

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");

  const [countries, setCountries] = useState<Array<PlacesData>>([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [mainPlaceImage, setMainPlaceImage] = useState<string>("");

  const [isFeaturedChecked, setIsFeaturedChecked] = useState(false);
  const [isOnMapChecked, setIsOnMapChecked] = useState(false);

  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [place, setPlace] = useState<PlacesData | null>(null);

  const getArticleOptions = () => {
    const placeArticles = place?.articles || [];

    return [
      {
        id: null,
        name: "Bez istaknutog članka",
      },
      ...placeArticles.map((article) => ({
        id: article.id,
        name: article.title,
      })),
    ];
  };

  const handleSave = async (values) => {
    setIsSubmitClicked(true);

    if (hasMainPlaceImage(mainPlaceImage)) {
      Swal.fire({
        title: "Jeste li sigurni?",
        text: "Uredit ćete ovo mjesto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2BAC82",
        cancelButtonColor: "#AC2B2B",
        cancelButtonText: "Odustani",
        confirmButtonText: "Da, objavi promjene!",
      }).then(async (result) => {
        if (result.isConfirmed && place) {
          const placeResponse = await updatePlace({
            id: place.id,
            description: values.place_description,
            name: values.place_name,
            name_genitive: values.name_genitive,
            name_dative: values.name_dative,
            name_accusative: values.name_accusative,
            name_locative: values.name_locative,
            country_id: parseInt(values.place_country),
            map_icon: values.place_icon_url,
            latitude: parseFloat(
              values.place_latitude.toString().replace(",", ".")
            ),
            longitude: parseFloat(
              values.place_longitude.toString().replace(",", ".")
            ),
            main_image_url: mainPlaceImage,
            is_on_homepage_map: isOnMapChecked,
            is_above_homepage_map: isFeaturedChecked,
            featured_article_id: values.featured_article_id
              ? parseInt(values.featured_article_id)
              : null,
            best_time_to_visit: buildBestTimeToVisitPayload(values),
          });

          console.log(placeResponse);

          if (place.videos) {
            const removedVideoIds = place.videos.filter(
              (el) =>
                !values.videos.some(
                  (video: { id: number }) => video.id === el.id
                )
            );

            removedVideoIds.map(async (el) => await deleteVideo(el.id));
          }

          values.videos.map(async (el: { id: number; video_url: string }) => {
            let videoResponse;

            if (el.id) {
              videoResponse = await updateVideo(el.id, el.video_url);
            } else {
              videoResponse = await addVideo(
                el.video_url,
                null,
                place.id,
                null
              );
            }

            console.log(videoResponse);
          });

          router.push("/admin/mjesta");
          notifySuccess("Uspješno uređeno mjesto!");
        }
      });
    }
  };

  const handleDeletePlace = () => {
    Swal.fire({
      title: `DESTRUKTIVNA RADNJA!\nJeste li sigurni da želite izbrisati mjesto ${place?.name} i sve članke o njemu?`,
      text: "Izbrisat ćete ovo mjesto i sve članke o njemu",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, izbriši!",
    }).then(async (result) => {
      if (result.isConfirmed && place) {
        const placeResponse = await deletePlaceById(place.id);
        console.log(placeResponse);

        router.push("/admin/mjesta");
        notifySuccess("Uspješno izbrisano mjesto i članci!");
      }
    });
  };

  const fetchData = async () => {
    try {
      setCountries(await fetchCountryDropdownOptions());

      if (name) {
        const _place = await getPlacesByName(name, 1, 1);
        const selectedPlace = _place.data[0];

        setPlace(selectedPlace);
        setMainPlaceImage(selectedPlace.main_image_url);
        setIsOnMapChecked(selectedPlace.is_on_homepage_map);
        setIsFeaturedChecked(selectedPlace.is_above_homepage_map);
        setSelectedCountryId(selectedPlace.countryId);
      }
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    if (name) {
      fetchData();
    }
  }, [name]);

  return (
    <>
      <div className="edit-place-container">
        <div className="edit-place-header">
          <h2>Uredi mjesto</h2>
          <Button
            red
            disabled={!place}
            onClick={() => {
              handleDeletePlace();
            }}
          >
            IZBRIŠI MJESTO I SVE ČLANKE O NJEMU
          </Button>
        </div>

        {countries && place ? (
          <Formik
            initialValues={{
              place_name: place.name,
              name_genitive: place.name_genitive || "",
              name_dative: place.name_dative || "",
              name_accusative: place.name_accusative || "",
              name_locative: place.name_locative || "",
              place_description: place.description,
              place_country: place.countryId,
              place_latitude: place.latitude,
              place_longitude: place.longitude,
              place_icon_url: place.map_icon,
              featured_article_id: place.featured_article_id || null,
              best_time_to_visit: getInitialBestTimeToVisit(place),
              videos: place.videos
                ? place.videos.map((el) => ({
                    id: el.id,
                    video_url: el.url,
                  }))
                : [],
            }}
            validationSchema={createPlaceValidationSchema({
              includeFeaturedArticle: true,
            })}
            onSubmit={handleSave}
            enableReinitialize={true}
          >
            {({ values, setFieldValue }) => (
              <Form className="edit-place-form">
                <div className="edit-place-inputs">
                  <div className="edit-place-input">
                    <Field
                      name="place_name"
                      type="text"
                      as={Input}
                      label="Naziv mjesta *"
                      placeholder="Unesi naziv..."
                    />
                    <ErrorMessage
                      name="place_name"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="edit-place-input">
                    <AdvancedDropdown
                      filter
                      images
                      hardcodedValue={"Odaberi državu o kojoj se radi"}
                      options={countries}
                      value={values.place_country}
                      selectedValue={values.place_country}
                      onChange={(value) => {
                        setFieldValue("place_country", value.id);
                        setSelectedCountryId(value.id);
                      }}
                      isDisabled={false}
                      label="Država mjesta *"
                    />
                    <ErrorMessage
                      name="place_country"
                      component="div"
                      className="error-message"
                    />
                  </div>

                  <div className="edit-place-row">
                    <div className="edit-place-row-item">
                      <Field
                        name="place_latitude"
                        as={Input}
                        label="Geografska širina (latitude) *"
                        placeholder="Unesi..."
                      />
                      <ErrorMessage
                        name="place_latitude"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="edit-place-row-item">
                      <Field
                        name="place_longitude"
                        as={Input}
                        label="Geografska dužina (longitude) *"
                        placeholder="Unesi..."
                      />
                      <ErrorMessage
                        name="place_longitude"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>

                  <div className="edit-place-input">
                    <Field
                      name="place_description"
                      value={values.place_description}
                      type="text"
                      as={Textarea}
                      rows={3}
                      label="Opis mjesta *"
                      placeholder="Opis mjesta u nekoliko rečenica..."
                    />
                    <ErrorMessage
                      name="place_description"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>

                <div className="edit-place-input">
                  <div className="edit-place-images-container">
                    {mainPlaceImage ? (
                      <div
                        className="edit-place-image"
                        onClick={() => {
                          deleteMainPlaceImage(setMainPlaceImage);
                        }}
                      >
                        <div className="edit-place-image-remove-icon">
                          <X size={32} color="#e70101" weight="bold" />
                        </div>

                        <img
                          src={mainPlaceImage}
                          alt={`image-error-${mainPlaceImage}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="edit-place-item"
                        onClick={() => {
                          toggleDialog(dialogRef);
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    )}
                  </div>

                  {isSubmitClicked &&
                    (mainPlaceImage == "" || !mainPlaceImage) && (
                      <p className="error-message">Obavezno polje!</p>
                    )}

                  <p>* preporuča se slika u omjeru 16:9</p>
                </div>

                <div className="edit-place-input edit-place-featured-article-wrapper">
                  <AdvancedDropdown
                    filter
                    hardcodedValue={"Odaberi istaknuti članak za ovaj grad"}
                    options={getArticleOptions()}
                    value={values.featured_article_id}
                    selectedValue={values.featured_article_id}
                    onChange={(value) => {
                      setFieldValue("featured_article_id", value.id);
                    }}
                    isDisabled={!place?.articles || place.articles.length === 0}
                    label="Istaknuti članak"
                  />

                  {(!place?.articles || place.articles.length === 0) && (
                    <p className="edit-place-helper-text">
                      Još nema članaka vezanih uz ovo mjesto. Istaknuti članak
                      moći ćete odabrati nakon što dodate članak s ovim mjestom.
                    </p>
                  )}

                  <ErrorMessage
                    name="featured_article_id"
                    component="div"
                    className="error-message"
                  />
                </div>

                <div className="edit-place-grammar-wrapper">
                  <div className="edit-place-grammar-header">
                    <h6>Padeži naziva mjesta *</h6>
                    <p>
                      Unesite oblike koji će se koristiti u tekstovima na
                      stranici grada.
                    </p>
                  </div>

                  <div className="edit-place-grammar-table">
                    <div className="edit-place-grammar-row edit-place-grammar-row-head">
                      <div>Padež</div>
                      <div>Pitanje</div>
                      <div>Glagol</div>
                      <div>Naziv mjesta</div>
                    </div>

                    {grammarRows.map((row) => (
                      <div className="edit-place-grammar-row" key={row.key}>
                        <div className="edit-place-grammar-case">
                          {row.label}
                        </div>
                        <div>{row.question}</div>
                        <div>{row.example}</div>
                        <div>
                          {row.isPreview ? (
                            <div className="edit-place-grammar-preview">
                              {values.place_name || "Naziv mjesta"}
                            </div>
                          ) : (
                            <>
                              <Field
                                name={row.key}
                                type="text"
                                as={Input}
                                label=""
                                placeholder={row.placeholder}
                              />
                              <ErrorMessage
                                name={row.key}
                                component="div"
                                className="error-message"
                              />
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="edit-place-best-time-wrapper">
                  <div className="edit-place-best-time-header">
                    <div>
                      <h6>Najbolje vrijeme za posjet *</h6>
                      <p>
                        Unesite prosječnu temperaturu i količinu kiše za svaki
                        mjesec.
                      </p>
                    </div>

                    <ToggleSwitch
                      name={"best-time-enabled"}
                      description={"Prikaži ovu sekciju na stranici grada"}
                      value={values.best_time_to_visit.is_enabled}
                      setter={(value) => {
                        setFieldValue("best_time_to_visit.is_enabled", value);
                      }}
                    />
                  </div>

                  <div className="edit-place-best-time-inputs">
                    <div className="edit-place-input">
                      <Field
                        name="best_time_to_visit.subtitle"
                        type="text"
                        as={Input}
                        label="Podnaslov *"
                        placeholder="npr. Umjerena kontinentalna klima..."
                      />
                      <ErrorMessage
                        name="best_time_to_visit.subtitle"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="edit-place-input">
                      <Field
                        name="best_time_to_visit.note"
                        type="text"
                        as={Textarea}
                        rows={2}
                        label="Napomena"
                        placeholder="npr. Svibanj, lipanj i rujan nude najbolji balans..."
                      />
                      <ErrorMessage
                        name="best_time_to_visit.note"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>

                  <div className="edit-place-best-time-table">
                    <div className="edit-place-best-time-row edit-place-best-time-row-head">
                      <div>Mjesec</div>
                      <div>Prosj. temp. °C</div>
                      <div>Kiša mm</div>
                    </div>

                    {bestTimeMonths.map((month, index) => (
                      <div
                        className="edit-place-best-time-row"
                        key={month.month_key}
                      >
                        <div className="edit-place-best-time-month">
                          {month.label}
                        </div>

                        <div>
                          <Field
                            name={`best_time_to_visit.months.${index}.avg_temp_c`}
                            type="text"
                            as={Input}
                            label=""
                            placeholder="npr. 17"
                          />
                          <ErrorMessage
                            name={`best_time_to_visit.months.${index}.avg_temp_c`}
                            component="div"
                            className="error-message"
                          />
                        </div>

                        <div>
                          <Field
                            name={`best_time_to_visit.months.${index}.avg_rain_mm`}
                            type="text"
                            as={Input}
                            label=""
                            placeholder="npr. 120"
                          />
                          <ErrorMessage
                            name={`best_time_to_visit.months.${index}.avg_rain_mm`}
                            component="div"
                            className="error-message"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="edit-place-videos-wrapper">
                  <div className="edit-place-video-outer-container">
                    <FieldArray
                      name="videos"
                      render={(arrayHelpers) => {
                        const videos = values.videos;

                        return (
                          <div className="edit-place-videos-container">
                            <div className="edit-place-header">
                              <h6>Preporučeni videi (max 3) *</h6>
                              {videos.length < 3 && (
                                <Button
                                  type="button"
                                  circle
                                  onClick={() => {
                                    addVideoField(arrayHelpers);
                                  }}
                                >
                                  +
                                </Button>
                              )}
                            </div>

                            {videos && videos.length > 0
                              ? videos.map((_videos, index) => (
                                  <Fragment key={index}>
                                    <div className="edit-place-video-row">
                                      <Field
                                        name={`videos.${index}.video_url`}
                                        type="text"
                                        as={Input}
                                        label=""
                                        placeholder="Unesi URL videa..."
                                      />

                                      <div
                                        onClick={() => {
                                          deleteVideoField(
                                            arrayHelpers,
                                            index
                                          );
                                        }}
                                      >
                                        <Trash color="#AC2B2B" size={32} />
                                      </div>
                                    </div>

                                    <ErrorMessage
                                      name={`videos.${index}.video_url`}
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

                <div className="edit-place-toggle-container">
                  <div className="edit-place-toggle-item">
                    <ToggleSwitch
                      name={"place-on-map"}
                      description={"Postavi mjesto na kartu"}
                      value={isOnMapChecked}
                      setter={setIsOnMapChecked}
                    />
                  </div>

                  <div className="edit-place-toggle-item">
                    <ToggleSwitch
                      name={"featured-place"}
                      description={"Postavi mjesto kao istaknuto iznad karte"}
                      value={isFeaturedChecked}
                      setter={setIsFeaturedChecked}
                    />
                  </div>

                  {isFeaturedChecked && (
                    <div className="edit-place-toggle-input">
                      <Field
                        name="place_icon_url"
                        type="text"
                        as={Input}
                        label="URL ikone mjesta *"
                        placeholder="Unesi URL ikone..."
                      />
                    </div>
                  )}
                </div>

                <div className="edit-place-buttons">
                  <Button type="submit" adminPrimary>
                    uredi mjesto
                  </Button>

                  <Button
                    type="button"
                    white
                    onClick={() => navigateToPlaces(router)}
                  >
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
        onClick={() =>
          addMainPlaceImage({
            modalInputValue,
            setMainPlaceImage,
            setModalInputValue,
          })
        }
        modalInputValue={modalInputValue}
        setModalInputValue={setModalInputValue}
      />
    </>
  );
};

export default EditPlace;
