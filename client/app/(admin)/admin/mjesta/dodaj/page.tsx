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
import * as Yup from "yup";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import { Plus, Trash, X } from "@phosphor-icons/react";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import { getVisitedCountries } from "@/utils/map";
import Modal from "@/components/atoms/Modal";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import { addPlace } from "@/utils/places";
import { useRouter } from "next/navigation";

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
      const countriesData = await getVisitedCountries();
      const newArray = countriesData.map(
        (el: { id: number; flag_image_url: string; name: string }) => ({
          id: el.id,
          url: el.flag_image_url, // because of this new array is needed (for image display in dropdown)
          name: el.name,
        })
      );
      setCountries(newArray);
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVideo = (arrayHelpers) => {
    arrayHelpers.push({
      video_url: "",
    });
  };

  const handleDeleteVideo = (arrayHelpers, videoIndex) => {
    arrayHelpers.remove(videoIndex);
  };

  const handleSave = async (values) => {
    setIsSubmitClicked(true);

    if (validateImages()) {
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
            parseInt(selectedCountryId),
            values.videos
          );
          console.log(placeResponse);

          router.push("/admin/mjesta");
          notifySuccess("Uspješno dodano mjesto!");
        }
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/mjesta");
  };

  const handleAddImage = () => {
    setMainPlaceImage(modalInputValue);
    setModalInputValue("");
  };

  const handleDeleteImage = () => {
    setMainPlaceImage(null);
  };

  const toggleDialog = () => {
    if (dialogRef && dialogRef.current) {
      dialogRef.current.hasAttribute("open")
        ? dialogRef.current.close()
        : dialogRef.current.showModal();
    }
  };

  const ValidationSchema = Yup.object().shape({
    place_name: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Naslov smije imati max 100 znakova!"),
    place_latitude: Yup.string()
      .required("Obavezno polje!")
      .test(
        "is-valid-latitude",
        "Geografska širina mora biti validan decimalni broj!",
        (value) => !isNaN(parseFloat(value))
      ),
    place_longitude: Yup.string()
      .required("Obavezno polje!")
      .test(
        "is-valid-longitude",
        "Geografska dužina mora biti validan decimalni broj!",
        (value) => !isNaN(parseFloat(value))
      ),
    place_description: Yup.string().required("Obavezno polje!"),
    place_country: Yup.number().required("Obavezno polje!").integer(),
    videos: Yup.array().of(
      Yup.object().shape({
        video_url: Yup.string().required("Obavezno polje!"),
      })
    ),
  });

  const validateImages = () => {
    return mainPlaceImage != "" && mainPlaceImage;
  };

  return (
    <>
      <div className="add-place-container">
        <h2>Unesi novo mjesto</h2>
        {countries ? (
          <Formik
            initialValues={{
              place_name: "",
              place_description: "",
              place_country: null,
              place_latitude: "",
              place_longitude: "",
              place_icon_url: "",
              videos: [{ video_url: "" }],
            }}
            validationSchema={ValidationSchema}
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
                          handleDeleteImage();
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
                          toggleDialog();
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
                                    handleAddVideo(arrayHelpers);
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
                                          handleDeleteVideo(
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
        setModalInputValue={setModalInputValue}
      />
    </>
  );
};

export default AddPlace;
