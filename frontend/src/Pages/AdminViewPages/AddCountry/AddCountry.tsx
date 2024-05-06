// @ts-nocheck

import { useNavigate } from "react-router-dom";
import "./AddCountry.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import { notifySuccess } from "../../../components/atoms/Toast/Toast";
import Swal from "sweetalert2";
import Modal from "../../../components/atoms/Modal";
import Button from "../../../components/atoms/Button";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Input from "../../../components/atoms/Input";
import Textarea from "../../../components/admin/atoms/Textarea";
import { ThreeDots } from "react-loader-spinner";
import { getColors } from "../../../api/colors";
import { getCharacteristicIcons } from "../../../api/characteristicIcons";
import * as Yup from "yup";
import AdvancedDropdown from "../../../components/admin/atoms/AdvancedDropdown";
import { countries as countryList } from "../../../utils/all_countries";
import { Plus, Trash, X } from "@phosphor-icons/react";
import { addCountry, getCountries } from "../../../api/countries";
import { getContinents } from "../../../api/continents";
import { addSpecificity } from "../../../api/specificities";
import { addCharacteristic } from "../../../api/characteristics";
import { addVideo } from "../../../api/videos";

const AddCountry = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState(null);
  const [countries, setCountries] = useState(null);
  const [alreadyAddedCountries, setAlreadyAddedCountries] = useState(null);
  const [continents, setContinents] = useState(null);
  const [characteristicIcons, setCharacteristicIcons] = useState(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");

  // images
  const [imageType, setImageType] = useState<string | null>(null);
  const [mainCountryImage, setMainCountryImage] = useState<string>("");
  const [flagImage, setFlagImage] = useState<string>("");
  const [specificityImages, setSpecificityImages] = useState<
    Array<Array<string | null>>
  >([
    [null, null, null],
    [null, null, null],
  ]);
  const [selectedSpecificityImage, setSelectedSpecificityImage] = useState([]);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const ValidationSchema = Yup.object().shape({
    country_name: Yup.string().required("Obavezno polje!"),
    country_description: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Opis smije imati max 100 znakova!"),
    country_color: Yup.string().required("Obavezno polje!"),
    characteristics: Yup.array().of(
      Yup.object().shape({
        characteristic_icon: Yup.string().required("Obavezno polje!"),
        characteristic_title: Yup.string()
          .required("Obavezno polje !")
          .max(80, "Naslov smije imati max 80 znakova!"),
        characteristic_description: Yup.string()
          .required("Obavezno polje!")
          .max(80, "Opis smije imati max 80 znakova!"),
      })
    ),
    specificities: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .required("Obavezno polje!")
          .max(45, "Naslov smije imati max 100 znakova!"),
        items: Yup.array().of(
          Yup.object().shape({
            title: Yup.string()
              .required("Obavezno polje!")
              .max(30, "Naslov smije imati max 30 znakova!"),
            description: Yup.string()
              .required("Obavezno polje!")
              .max(100, "Opis smije imati max 100 znakova!"),
          })
        ),
      })
    ),
    videos: Yup.array().of(
      Yup.object().shape({
        video_url: Yup.string().required("Obavezno polje!"),
      })
    ),
  });

  const validateImages = () => {
    let areAllImagesFilledIn = true;

    specificityImages.map((imageGroup) => {
      imageGroup.map((image) => {
        if (!image || image == "") {
          areAllImagesFilledIn = false;
        }
      });
    });

    if (
      mainCountryImage == "" ||
      !mainCountryImage ||
      flagImage == "" ||
      !flagImage
    ) {
      areAllImagesFilledIn = false;
    }

    return areAllImagesFilledIn;
  };

  const handleSave = async (values) => {
    setIsSubmitClicked(true);

    if (validateImages()) {
      Swal.fire({
        title: "Jeste li sigurni?",
        text: "Objavit ćete ovu državu",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#2BAC82",
        cancelButtonColor: "#AC2B2B",
        cancelButtonText: "Odustani",
        confirmButtonText: "Da, objavi!",
      }).then(async (result) => {
        const selectedCountry = countries.find(
          (el) => el.id == values.country_name
        );

        if (result.isConfirmed) {
          const countryResponse = await addCountry(
            selectedCountry.name,
            values.country_description,
            mainCountryImage,
            flagImage,
            values.country_continent,
            values.country_color
          );

          values.specificities.map(async (el, index) => {
            return await addSpecificity(
              el.title,
              countryResponse.id,
              el.items,
              specificityImages[index]
            );
          });

          values.characteristics.map(
            async (el) =>
              await addCharacteristic(
                el.characteristic_title,
                el.characteristic_description,
                countryResponse.id,
                el.characteristic_icon
              )
          );

          values.videos.map(
            async (el) =>
              await addVideo(el.video_url, null, null, countryResponse.id)
          );

          navigate("/admin/države");
          notifySuccess("Uspješno dodana država!");
        }
      });
    }
  };

  const handleCancel = () => {
    navigate("/admin/države");
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
      setMainCountryImage(modalInputValue);
    } else if (imageType == "flag") {
      setFlagImage(modalInputValue);
    } else if (imageType == "spec") {
      setSpecificityImages((prevSectionImages) => {
        // pretvori array [[null,null,null],[null,null,null]] u [[null,"url",null],[null,null,null]] temeljem podataka [1,0] --> 2. slika (subarray), 1. specificnost (array) (0. el = index slike u subarrayu, 1. el = index specificnosti (arraya))
        return [
          ...prevSectionImages.slice(0, selectedSpecificityImage[1]), // ostavi subarraye prije
          [
            // u odabranom subarrayu ostavi elemente prije odabranog
            ...prevSectionImages[selectedSpecificityImage[1]].slice(
              0,
              selectedSpecificityImage[0]
            ),
            modalInputValue, // dodaj url na to mjesto
            // u odabranom subarrayu ostavi elemente nakon odabranog
            ...prevSectionImages[selectedSpecificityImage[1]].slice(
              selectedSpecificityImage[0] + 1
            ),
          ],
          ...prevSectionImages.slice(selectedSpecificityImage[1] + 1), // ostavi subarraye nakon
        ];
      });
    }
    setModalInputValue("");
  };

  const handleDeleteImage = (
    type: string,
    imageIndex?: number,
    specificityIndex?: number
  ) => {
    if (type == "main") {
      setMainCountryImage(null);
    } else if (type == "flag") {
      setFlagImage(null);
    } else if (type == "spec") {
      setSpecificityImages((prevSectionImages) => {
        return [
          ...prevSectionImages.slice(0, specificityIndex),
          [
            ...prevSectionImages[specificityIndex!].slice(0, imageIndex),
            null,
            ...prevSectionImages[specificityIndex!].slice(imageIndex! + 1),
          ],
          ...prevSectionImages.slice(specificityIndex! + 1),
        ];
      });
    }
  };

  const handleAddVideo = (arrayHelpers) => {
    arrayHelpers.push({
      video_url: "",
    });
  };

  const handleDeleteVideo = (arrayHelpers, videoIndex) => {
    arrayHelpers.remove(videoIndex);
  };

  const handleAddSpecificityItem = (subarrayHelpers) => {
    subarrayHelpers.push({
      title: "",
      description: "",
    });
  };

  const handleDeleteSpecificityItem = (subarrayHelpers, index) => {
    subarrayHelpers.remove(index);
  };

  const fetchData = async () => {
    try {
      const alreadyAddedCountriesData = await getCountries(1, 300); // no pagination
      const colorsData = await getColors();
      const characteristicIconsData = await getCharacteristicIcons();
      const continentsData = await getContinents();

      setAlreadyAddedCountries(alreadyAddedCountriesData.data);
      setColors(colorsData);
      setCharacteristicIcons(characteristicIconsData);
      setContinents(continentsData);
    } catch (error) {
      console.error("Error occured while fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    reorganizeArrays();
  }, [alreadyAddedCountries]);

  const reorganizeArrays = async () => {
    if (alreadyAddedCountries) {
      const allCountries = countryList.map((el, index) => ({
        id: index,
        name: el.cro_name, // for correct data display in dropdown
      }));

      // remove countries that are already in database (if the same name attribute exists in both arrays)
      const filtered = allCountries.filter((el) => {
        return !alreadyAddedCountries.some((existingCountry) => {
          return existingCountry.name === el.name;
        });
      });
      setCountries(filtered);
    }
  };

  return (
    <>
      <div className="add-country-container">
        <h2>Unesi novu državu</h2>
        {characteristicIcons && colors && countries ? (
          <Formik
            initialValues={{
              country_name: null,
              country_description: null,
              country_continent: null,
              country_color: null,
              characteristics: [
                {
                  characteristic_icon: null,
                  characteristic_title: "",
                  characteristic_description: "",
                },
                {
                  characteristic_icon: null,
                  characteristic_title: "",
                  characteristic_description: "",
                },
                {
                  characteristic_icon: null,
                  characteristic_title: "",
                  characteristic_description: "",
                },
                {
                  characteristic_icon: null,
                  characteristic_title: "",
                  characteristic_description: "",
                },
                {
                  characteristic_icon: null,
                  characteristic_title: "",
                  characteristic_description: "",
                },
                {
                  characteristic_icon: null,
                  characteristic_title: "",
                  characteristic_description: "",
                },
              ],
              specificities: [
                {
                  title: "",
                  items: [{ title: "", description: "" }],
                },
                {
                  title: "",
                  items: [{ title: "", description: "" }],
                },
              ],
              videos: [{ video_url: "" }],
            }}
            validationSchema={ValidationSchema}
            onSubmit={handleSave}
          >
            {({ values, setFieldValue }) => (
              <Form className="add-country-form">
                <div className="add-country-inputs">
                  <div className="add-country-inputs-row">
                    <div className="add-country-input">
                      <Field
                        name="country_name"
                        type="text"
                        as={AdvancedDropdown}
                        label="Naziv države *"
                        hardcodedValue="Odaberi naziv..."
                        options={countries}
                        onChange={(value: { id: number }) => {
                          setFieldValue(`country_name`, value.id);
                        }}
                        selectedValue={values.country_name}
                        filter
                      />
                      <ErrorMessage
                        name="country_name"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="add-country-input">
                      <Field
                        name="country_color"
                        type="text"
                        as={AdvancedDropdown}
                        label="Boja teksta države *"
                        hardcodedValue="Odaberi boju..."
                        options={colors}
                        onChange={(value: { id: number }) => {
                          setFieldValue(`country_color`, value.id);
                        }}
                        selectedValue={values.country_color}
                        images
                      />
                      <ErrorMessage
                        name="country_color"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div className="add-country-input">
                      <Field
                        name="country_continent"
                        type="text"
                        as={AdvancedDropdown}
                        label="Kontinent kojem pripada *"
                        hardcodedValue="Odaberi kontinent..."
                        options={continents}
                        onChange={(value: { id: number }) => {
                          setFieldValue(`country_continent`, value.id);
                        }}
                        selectedValue={values.country_continent}
                      />
                      <ErrorMessage
                        name="country_continent"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>
                  <div className="add-country-input">
                    <Field
                      name="country_description"
                      type="text"
                      as={Textarea}
                      rows={4}
                      label="Opis države *"
                      placeholder="1 ili 2 rečenice koje najbolje opisuju državu..."
                    />
                    <ErrorMessage
                      name="country_description"
                      component="div"
                      className="error-message"
                    />
                  </div>
                </div>
                <div className="add-country-images-container">
                  <div className="add-country-images-item">
                    <h6>Zastava države *</h6>
                    {flagImage ? (
                      <div
                        className="add-country-image"
                        onClick={() => {
                          handleDeleteImage("flag");
                        }}
                      >
                        <div className="add-country-image-remove-icon">
                          <X size={32} color="#e70101" weight="bold" />
                        </div>
                        <img src={flagImage} alt={`image-error-${flagImage}`} />
                      </div>
                    ) : (
                      <div
                        className="add-country-item"
                        onClick={() => {
                          toggleDialog();
                          setImageType("flag");
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    )}
                    {isSubmitClicked && (flagImage == "" || !flagImage) && (
                      <p className="error-message">Obavezno polje!</p>
                    )}
                  </div>
                  <div className="add-country-images-item">
                    <h6>Glavna fotografija države *</h6>
                    {mainCountryImage ? (
                      <div
                        className="add-country-image"
                        onClick={() => {
                          handleDeleteImage("main");
                        }}
                      >
                        <div className="add-country-image-remove-icon">
                          <X size={32} color="#e70101" weight="bold" />
                        </div>
                        <img
                          src={mainCountryImage}
                          alt={`image-error-${mainCountryImage}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="add-country-item"
                        onClick={() => {
                          toggleDialog();
                          setImageType("main");
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    )}
                    {isSubmitClicked &&
                      (mainCountryImage == "" || !mainCountryImage) && (
                        <p className="error-message">Obavezno polje!</p>
                      )}
                  </div>
                </div>
                <p>* preporuča se okrugla slika zastave</p>
                <p>* preporuča se slika u omjeru 16:9 za glavnu fotografiju</p>

                <div className="add-country-characteristics-container">
                  <h6>Da Vas ne iznenadi</h6>
                  <fieldset>
                    <legend>Odaberi 6 karakteristika</legend>

                    <FieldArray
                      name="characteristics"
                      render={() => {
                        const characteristics = values.characteristics;

                        return (
                          <div className="add-country-characteristics-inner">
                            {characteristics && characteristics.length > 0
                              ? characteristics.map(
                                  (_characteristic, index) => (
                                    <div
                                      className="add-country-characteristics-item"
                                      key={index}
                                    >
                                      <Field
                                        type="text"
                                        as={AdvancedDropdown}
                                        hardcodedValue="Odaberi ikonu..."
                                        name={`characteristics.${index}.characteristic_icon`}
                                        options={characteristicIcons}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `characteristics.${index}.characteristic_icon`,
                                            value.id
                                          );
                                        }}
                                        selectedValue={
                                          values.characteristics[index]
                                            .characteristic_icon
                                        }
                                        filter={false}
                                        images={true}
                                      />
                                      <ErrorMessage
                                        name={`characteristics.${index}.characteristic_icon`}
                                        component="div"
                                        className="error-message"
                                      />
                                      <Field
                                        type="text"
                                        name={`characteristics.${index}.characteristic_title`}
                                        as={Input}
                                        placeholder="Unesi podnaslov..."
                                      />
                                      <ErrorMessage
                                        name={`characteristics.${index}.characteristic_title`}
                                        component="div"
                                        className="error-message"
                                      />
                                      <Field
                                        type="text"
                                        name={`characteristics.${index}.characteristic_description`}
                                        as={Input}
                                        placeholder="Unesi opis..."
                                      />
                                      <ErrorMessage
                                        name={`characteristics.${index}.characteristic_description`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>
                                  )
                                )
                              : null}
                          </div>
                        );
                      }}
                    />
                  </fieldset>
                </div>

                <div className="add-country-specificities-container">
                  <h6>Specifičnosti</h6>
                  {/* array of specificities (2) */}
                  <FieldArray
                    name="specificities"
                    render={() => {
                      const specificities = values.specificities;

                      return (
                        <div className="add-country-specificities-inner">
                          {specificities && specificities.length > 0
                            ? specificities.map((_specificity, index) => (
                                <div key={index}>
                                  <div className="add-country-specificities-inner-item">
                                    <Field
                                      type="text"
                                      name={`specificities[${index}].title`}
                                      as={Input}
                                      placeholder="Unesi naslov..."
                                    />
                                  </div>
                                  <ErrorMessage
                                    name={`specificities[${index}].title`}
                                    component="div"
                                    className="error-message"
                                  />
                                  <fieldset>
                                    <legend>
                                      {index === 0 ? "Lijevo" : "Desno"}
                                    </legend>
                                    {/* array of specificity items (1-4) */}
                                    <FieldArray
                                      name={`specificities[${index}].items`} // this has to be connected to initial values array and subarray names
                                      render={(subarrayHelpers) => {
                                        const specificityItems =
                                          values.specificities[index].items;
                                        const specificityImagesTemplate = [
                                          null,
                                          null,
                                          null,
                                        ];

                                        return (
                                          <>
                                            {specificityItems &&
                                            specificityItems.length > 0
                                              ? specificityItems.map(
                                                  (
                                                    _specificityItem,
                                                    itemIndex
                                                  ) => (
                                                    <div
                                                      className="add-country-specificities-item"
                                                      key={itemIndex}
                                                    >
                                                      <div className="add-country-specificities-item-column">
                                                        <Field
                                                          type="text"
                                                          name={`specificities[${index}].items[${itemIndex}].title`}
                                                          as={Input}
                                                          placeholder="Unesi podnaslov..."
                                                        />
                                                        <ErrorMessage
                                                          name={`specificities[${index}].items[${itemIndex}].title`}
                                                          component="div"
                                                          className="error-message"
                                                        />
                                                        <Field
                                                          type="text"
                                                          name={`specificities[${index}].items[${itemIndex}].description`}
                                                          as={Input}
                                                          placeholder="Unesi opis..."
                                                        />
                                                        <ErrorMessage
                                                          name={`specificities[${index}].items[${itemIndex}].description`}
                                                          component="div"
                                                          className="error-message"
                                                        />
                                                      </div>

                                                      <div
                                                        onClick={() => {
                                                          handleDeleteSpecificityItem(
                                                            subarrayHelpers,
                                                            itemIndex
                                                          );
                                                        }}
                                                      >
                                                        <Trash
                                                          color="#AC2B2B"
                                                          size={32}
                                                        />
                                                      </div>
                                                    </div>
                                                  )
                                                )
                                              : null}
                                            {specificityItems.length < 4 && (
                                              <Button
                                                type="button"
                                                primary
                                                onClick={() => {
                                                  handleAddSpecificityItem(
                                                    subarrayHelpers
                                                  );
                                                }}
                                              >
                                                dodaj
                                              </Button>
                                            )}
                                            <div className="add-country-specificities-images-container">
                                              {specificityImagesTemplate.map(
                                                (el, imageIndex) => (
                                                  <div
                                                    className="add-country-images-container"
                                                    key={imageIndex}
                                                  >
                                                    {specificityImages[index][
                                                      imageIndex
                                                    ] &&
                                                    specificityImages[index][
                                                      imageIndex
                                                    ] != "" ? (
                                                      <div
                                                        className="add-country-image"
                                                        onClick={() => {
                                                          handleDeleteImage(
                                                            "spec",
                                                            imageIndex,
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        <div className="add-country-image-remove-icon">
                                                          <X
                                                            size={32}
                                                            color="#e70101"
                                                            weight="bold"
                                                          />
                                                        </div>
                                                        <img
                                                          src={
                                                            specificityImages[
                                                              index
                                                            ][imageIndex]
                                                          }
                                                          alt={`image-error-${index}-${imageIndex}`}
                                                        />
                                                      </div>
                                                    ) : (
                                                      <div
                                                        className="add-country-item"
                                                        onClick={() => {
                                                          toggleDialog();
                                                          setSelectedSpecificityImage(
                                                            [imageIndex, index]
                                                          );
                                                          setImageType("spec");
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
                                                )
                                              )}
                                            </div>
                                            {isSubmitClicked &&
                                              (!specificityImages[index][0] ||
                                                !specificityImages[index][1] ||
                                                !specificityImages[
                                                  index
                                                ][2]) && (
                                                <p className="error-message">
                                                  Obavezno unijeti 3 slike!
                                                </p>
                                              )}
                                          </>
                                        );
                                      }}
                                    />
                                  </fieldset>
                                </div>
                              ))
                            : null}
                        </div>
                      );
                    }}
                  />
                </div>

                <div className="add-country-videos-wrapper">
                  <div className="add-country-video-outer-container">
                    <FieldArray
                      name="videos"
                      render={(arrayHelpers) => {
                        const videos = values.videos;

                        return (
                          <div className="add-country-videos-container">
                            <div className="add-country-header">
                              <h6>Preporučeni videi (opcionalno, max 3)</h6>
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
                                    <div className="add-country-video-row">
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
                <div className="add-country-buttons">
                  <Button type="submit" adminPrimary>
                    objavi državu
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

export default AddCountry;
