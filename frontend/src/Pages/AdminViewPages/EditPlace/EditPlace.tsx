// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { getVisitedCountries } from "../../../api/map";
import { PlacesData } from "../../../common/types";
import Button from "../../../components/atoms/Button";
import "./EditPlace.scss";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Textarea from "../../../components/admin/atoms/Textarea";
import AdvancedDropdown from "../../../components/admin/atoms/AdvancedDropdown";
import Input from "../../../components/atoms/Input";
import Modal from "../../../components/atoms/Modal";
import { ThreeDots } from "react-loader-spinner";
import Swal from "sweetalert2";
import {
  deletePlaceById,
  getPlacesByName,
  updatePlace,
} from "../../../api/places";
import * as Yup from "yup";
import { notifySuccess } from "../../../components/atoms/Toast/Toast";
import { Plus, Trash, X } from "@phosphor-icons/react";
import ToggleSwitch from "../../../components/admin/atoms/ToggleSwitch/ToggleSwitch";
import { addVideo, deleteVideo, updateVideo } from "../../../api/videos";

const EditPlace = () => {
  const navigate = useNavigate();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");

  const [countries, setCountries] = useState<Array<PlacesData>>([]);
  const [selectedCountryId, setSelectedCountryId] = useState("");
  const [mainPlaceImage, setMainPlaceImage] = useState<string>("");

  // toggle state
  const [isFeaturedChecked, setIsFeaturedChecked] = useState(false);
  const [isOnMapChecked, setIsOnMapChecked] = useState(false);

  const [place, setPlace] = useState<PlacesData | null>(null);
  const { name } = useParams();

  const handleAddVideo = (arrayHelpers) => {
    arrayHelpers.push({
      video_url: "",
    });
  };

  const handleDeleteVideo = (arrayHelpers, videoIndex) => {
    arrayHelpers.remove(videoIndex);
  };

  const handleSave = async (values) => {
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
          country_id: parseInt(selectedCountryId),
          map_icon: values.place_icon_url,
          latitude: parseFloat(values.place_latitude),
          longitude: parseFloat(values.place_longitude),
          main_image_url: mainPlaceImage,
          is_on_homepage_map: isOnMapChecked,
          is_above_homepage_map: isFeaturedChecked,
        });
        console.log(placeResponse);

        // add, update (if it has id attibute already) and delete videos
        if (place.videos) {
          const removedVideoIds = place.videos.filter(
            (el) =>
              !values.videos.some((video: { id: number }) => video.id === el.id)
          );
          removedVideoIds.map(async (el) => await deleteVideo(el.id));
        }
        values.videos.map(async (el: { id: number; video_url: string }) => {
          let videoResponse;
          if (el.id) {
            videoResponse = await updateVideo(el.id, el.video_url);
          } else {
            videoResponse = await addVideo(el.video_url, null, place.id, null);
          }
          console.log(videoResponse);
        });

        navigate("/admin/mjesta");
        notifySuccess("Uspješno dodano mjesto!");
      }
    });
  };

  const handleCancel = () => {
    navigate("/admin/mjesta");
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

        navigate("/admin/mjesta");
        notifySuccess("Uspješno izbrisano mjesto i članci!");
      }
    });
  };

  const fetchData = async () => {
    try {
      const countriesData = await getVisitedCountries();
      const newArray = countriesData.map(
        (el: { id: number; flag_image_url: string; name: string }) => ({
          id: el.id,
          url: el.flag_image_url,
          name: el.name,
        })
      );
      setCountries(newArray);

      if (name) {
        const _place = await getPlacesByName(name, 1, 1);
        setPlace(_place.data[0]);
        setMainPlaceImage(_place.data[0].main_image_url);
        setIsOnMapChecked(_place.data[0].is_on_homepage_map);
        setIsFeaturedChecked(_place.data[0].is_above_homepage_map);
      }
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const ValidationSchema = Yup.object().shape({
    place_name: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Naslov smije imati max 100 znakova!"),
    place_latitude: Yup.string().required("Obavezno polje!"),
    place_longitude: Yup.string().required("Obavezno polje!"),
  });

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
              place_description: place.description,
              place_country: place.countryId,
              place_latitude: place.latitude,
              place_longitude: place.longitude,
              place_icon_url: place.map_icon,
              videos: place.videos
                ? place.videos.map((el) => ({
                    id: el.id,
                    video_url: el.url,
                  }))
                : [],
            }}
            validationSchema={ValidationSchema}
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
                    <ErrorMessage name="place_name" component="div" />
                  </div>
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
                  <div className="edit-place-row">
                    <div className="edit-place-row-item">
                      <Field
                        name="place_latitude"
                        as={Input}
                        label="Geografska širina (latitude) *"
                        placeholder="Unesi..."
                      />
                      <ErrorMessage name="place_latitude" component="div" />
                    </div>
                    <div className="edit-place-row-item">
                      <Field
                        name="place_longitude"
                        as={Input}
                        label="Geografska dužina (longitude) *"
                        placeholder="Unesi..."
                      />
                      <ErrorMessage name="place_longitude" component="div" />
                    </div>
                  </div>
                  <Field
                    name="place_description"
                    defaultValue={place.description}
                    type="text"
                    as={Textarea}
                    rows={3}
                    label="Opis mjesta *"
                    placeholder="Opis mjesta u nekoliko rečenica..."
                  />
                  <ErrorMessage name="place_description" component="div" />
                </div>
                <div className="edit-place-images-container">
                  {mainPlaceImage ? (
                    <div
                      className="edit-place-image"
                      onClick={() => {
                        handleDeleteImage();
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
                        toggleDialog();
                      }}
                    >
                      <Plus size={32} color="#616161" weight="bold" />
                    </div>
                  )}
                </div>
                <p>* preporuča se slika u omjeru 16:9</p>

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
                                    handleAddVideo(arrayHelpers);
                                  }}
                                >
                                  +
                                </Button>
                              )}
                            </div>
                            {videos && videos.length > 0
                              ? videos.map((_videos, index) => (
                                  <div
                                    className="edit-place-video-row"
                                    key={index}
                                  >
                                    <Field
                                      name={`videos.${index}.video_url`}
                                      type="text"
                                      as={Input}
                                      label=""
                                      placeholder="Unesi URL videa..."
                                    />
                                    <div
                                      onClick={() => {
                                        handleDeleteVideo(arrayHelpers, index);
                                      }}
                                    >
                                      <Trash color="#AC2B2B" size={32} />
                                    </div>
                                  </div>
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
        setModalInputValue={setModalInputValue}
      />
    </>
  );
};

export default EditPlace;
