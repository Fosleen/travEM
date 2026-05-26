// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
"use client";

import Button from "@/components/atoms/Button";
import "./AddPlace.scss";
import { CountriesData } from "@/common/types";
import { Fragment, useEffect, useRef, useState } from "react";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { notifySuccess } from "@/components/atoms/Toast/Toast";
import Swal from "sweetalert2";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import { Plus, Trash, X } from "@phosphor-icons/react";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import Modal from "@/components/atoms/Modal";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import { addPlace } from "@/utils/places";
import { useRouter } from "next/navigation";
import {
  addMainPlaceImage,
  addVideoField,
  bestTimeMonths,
  buildBestTimeToVisitPayload,
  createPlaceValidationSchema,
  deleteMainPlaceImage,
  deleteVideoField,
  fetchCountryDropdownOptions,
  getDefaultBestTimeMonths,
  grammarRows,
  hasMainPlaceImage,
  navigateToPlaces,
  toggleDialog,
} from "@/utils/placeFormHelpers";

const AddPlace = () => {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");

  const [countries, setCountries] = useState<Array<CountriesData>>([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [mainPlaceImage, setMainPlaceImage] = useState<string>("");

  const [isFeaturedChecked, setIsFeaturedChecked] = useState(false);
  const [isOnMapChecked, setIsOnMapChecked] = useState(false);

  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const fetchData = async () => {
    try {
      setCountries(await fetchCountryDropdownOptions());
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (values) => {
    setIsSubmitClicked(true);

    if (hasMainPlaceImage(mainPlaceImage)) {
      Swal.fire({
        title: "Jeste li sigurni?",
        text: "Dodat ćete ovo mjesto",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2BAC82",
        cancelButtonColor: "#AC2B2B",
        cancelButtonText: "Odustani",
        confirmButtonText: "Da, objavi!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const placeResponse = await addPlace(
            values.place_name,
            values.place_description,
            values.place_icon_url,
            isOnMapChecked,
            isFeaturedChecked,
            parseFloat(values.place_latitude.replace(",", ".")),
            parseFloat(values.place_longitude.replace(",", ".")),
            mainPlaceImage,
            parseInt(values.place_country),
            values.videos,
            values.name_genitive,
            values.name_dative,
            values.name_accusative,
            values.name_locative,
            buildBestTimeToVisitPayload(values)
          );

          console.log(placeResponse);

          router.push("/admin/mjesta");
          notifySuccess("Uspješno dodano mjesto!");
        }
      });
    }
  };

  return (
    <>
      <div className="add-place-container">
        <h2>Unesi novo mjesto</h2>
        {countries ? (
          <Formik
            initialValues={{
              place_name: "",
              name_genitive: "",
              name_dative: "",
              name_accusative: "",
              name_locative: "",
              place_description: "",
              place_country: null,
              place_latitude: "",
              place_longitude: "",
              place_icon_url: "",
              best_time_to_visit: {
                subtitle: "",
                note: "",
                is_enabled: true,
                months: getDefaultBestTimeMonths(),
              },
              videos: [{ video_url: "" }],
            }}
            validationSchema={createPlaceValidationSchema()}
            onSubmit={handleSave}
          >
            {({ values, setFieldValue }) => (
              <Form className="add-place-form">
                <div className="add-place-inputs">
                  <div className="add-place-input">
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

                  <div className="add-place-input">
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

                  <div className="add-place-row">
                    <div className="add-place-row-item">
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

                    <div className="add-place-row-item">
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

                  <div className="add-place-input">
                    <Field
                      name="place_description"
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

                <div className="add-place-input">
                  <div className="add-place-images-container">
                    {mainPlaceImage ? (
                      <div
                        className="add-place-image"
                        onClick={() => {
                          deleteMainPlaceImage(setMainPlaceImage);
                        }}
                      >
                        <div className="add-place-image-remove-icon">
                          <X size={32} color="#e70101" weight="bold" />
                        </div>
                        <img
                          src={mainPlaceImage}
                          alt={`image-error-${mainPlaceImage}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="add-place-item"
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

                <div className="add-place-grammar-wrapper">
                  <div className="add-place-grammar-header">
                    <h6>Padeži naziva mjesta *</h6>
                    <p>
                      Unesite oblike koji će se koristiti u tekstovima na
                      stranici grada.
                    </p>
                  </div>

                  <div className="add-place-grammar-table">
                    <div className="add-place-grammar-row add-place-grammar-row-head">
                      <div>Padež</div>
                      <div>Pitanje</div>
                      <div>Glagol</div>
                      <div>Naziv mjesta</div>
                    </div>

                    {grammarRows.map((row) => (
                      <div className="add-place-grammar-row" key={row.key}>
                        <div className="add-place-grammar-case">
                          {row.label}
                        </div>
                        <div>{row.question}</div>
                        <div>{row.example}</div>
                        <div>
                          {row.isPreview ? (
                            <div className="add-place-grammar-preview">
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

                <div className="add-place-best-time-wrapper">
                  <div className="add-place-best-time-header">
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

                  <div className="add-place-best-time-inputs">
                    <div className="add-place-input">
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

                    <div className="add-place-input">
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

                  <div className="add-place-best-time-table">
                    <div className="add-place-best-time-row add-place-best-time-row-head">
                      <div>Mjesec</div>
                      <div>Prosj. temp. °C</div>
                      <div>Kiša mm</div>
                    </div>

                    {bestTimeMonths.map((month, index) => (
                      <div
                        className="add-place-best-time-row"
                        key={month.month_key}
                      >
                        <div className="add-place-best-time-month">
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

                <div className="add-place-videos-wrapper">
                  <div className="add-place-video-outer-container">
                    <FieldArray
                      name="videos"
                      render={(arrayHelpers) => {
                        const videos = values.videos;

                        return (
                          <div className="add-place-videos-container">
                            <div className="add-place-header">
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
                                    <div className="add-place-video-row">
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

                <div className="add-place-toggle-container">
                  <div className="add-place-toggle-item">
                    <ToggleSwitch
                      name={"place-on-map"}
                      description={"Postavi mjesto na kartu"}
                      value={isOnMapChecked}
                      setter={setIsOnMapChecked}
                    />
                  </div>

                  <div className="add-place-toggle-item">
                    <ToggleSwitch
                      name={"featured-place"}
                      description={"Postavi mjesto kao istaknuto iznad karte"}
                      value={isFeaturedChecked}
                      setter={setIsFeaturedChecked}
                    />
                  </div>

                  {isFeaturedChecked && (
                    <div className="add-place-toggle-input">
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

                <div className="add-place-buttons">
                  <Button type="submit" adminPrimary>
                    dodaj mjesto
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

export default AddPlace;
