import { useNavigate, useParams } from "react-router-dom";
import "./EditCountry.scss";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { countries as countryList } from "../../../components/organisms/DestinationsMap/visited_countries";
import Swal from "sweetalert2";
import { notifySuccess } from "../../../components/atoms/Toast/Toast";
import Modal from "../../../components/atoms/Modal";
import { ThreeDots } from "react-loader-spinner";
import Button from "../../../components/atoms/Button";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import AdvancedDropdown from "../../../components/admin/atoms/AdvancedDropdown";
import Textarea from "../../../components/admin/atoms/Textarea";
import { Plus, Trash, X } from "@phosphor-icons/react";
import Input from "../../../components/atoms/Input";
import {
  getCountries,
  getCountriesByName,
  updateCountry,
} from "../../../api/countries";
import { getCharacteristicIcons } from "../../../api/characteristicIcons";
import { getColors } from "../../../api/colors";
import { getContinents } from "../../../api/continents";
import { CountriesData } from "../../../common/types";

const EditCountry = () => {
  const { name } = useParams();
  const navigate = useNavigate();
  const [colors, setColors] = useState(null);
  const [country, setCountry] = useState<CountriesData | null>(null);
  const [countries, setCountries] = useState<Array<{
    id: number;
    name: string;
  }> | null>(null);
  const [alreadyAddedCountries, setAlreadyAddedCountries] = useState(null);
  const [countryArrayId, setCountryArrayId] = useState(null);
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

  const ValidationSchema = Yup.object().shape({
    country_name: Yup.string().required("Obavezno polje!"),
    country_description: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Opis smije imati max 100 znakova!"),
    country_color: Yup.string().required("Obavezno polje!"),
  });

  const handleSave = async (values) => {
    console.log(values);

    Swal.fire({
      title: "Jeste li sigurni?",
      text: "Uredit ćete ovu državu",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2BAC82",
      cancelButtonColor: "#AC2B2B",
      cancelButtonText: "Odustani",
      confirmButtonText: "Da, objavi promjene!",
    }).then(async (result) => {
      if (result.isConfirmed && country && countries) {
        const selectedCountry = countries.find(
          (el) => el.id == values.country_name
        );
        console.log(selectedCountry);

        const countryResponse = await updateCountry({
          id: country.id,
          name: selectedCountry!.name,
          description: values.country_description,
          main_image_url: mainCountryImage,
          flag_image_url: flagImage,
          continentId: values.country_continent,
          colorId: values.country_color,
        });
        console.log(countryResponse);

        navigate("/admin/države");
        notifySuccess("Uspješno uređena država!");
      }
    });
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

  useEffect(() => {
    fetchData();
  }, []);

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
    reorganizeArrays();
  }, [alreadyAddedCountries]);

  const reorganizeArrays = async () => {
    if (alreadyAddedCountries) {
      const allCountries = countryList.map((el, index) => ({
        id: index,
        name: el.cro_name, // for correct data display in dropdown
      }));

      // remove countries that are already in database (if the same name attribute exists in both arrays) except for the initial country name (from url name parameter)
      const filtered = allCountries.filter((el) => {
        return (
          el.name.toLowerCase() === name ||
          !alreadyAddedCountries.some((existingCountry) => {
            return existingCountry.name === el.name;
          })
        );
      });

      setCountries(filtered);
      // find initial country name and its id so it shows in dropdown correctly
      const foundCountryElement = filtered.find(
        (el) => el.name.toLowerCase() === name
      );
      if (foundCountryElement) {
        setCountryArrayId(foundCountryElement.id);
      }
    }
  };

  useEffect(() => {
    fetchSelectedCountryData();
  }, [countries]);

  const fetchSelectedCountryData = async () => {
    if (name) {
      const _country = await getCountriesByName(name, 1, 1, 0);
      console.log(_country.data[0]);

      setCountry({
        ..._country.data[0],
        name: countryArrayId, // name is in db saved as a string, but here is needed id of that country in filtered countries array
      });
      setMainCountryImage(_country.data[0].main_image_url);
      setFlagImage(_country.data[0].flag_image_url);
    }
  };

  return (
    <>
      <div className="edit-country-container">
        <h2>Uredi državu</h2>
        {country &&
        characteristicIcons &&
        colors &&
        countries &&
        countryArrayId ? (
          <Formik
            initialValues={{
              country_name: country.name,
              country_description: country.description,
              country_continent: country.continentId,
              country_color: country.colorId,
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
            enableReinitialize={true}
          >
            {({ values, setFieldValue }) => (
              <Form className="edit-country-form">
                <div className="edit-country-inputs">
                  <div className="edit-country-inputs-row">
                    <div className="edit-country-input">
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
                      <ErrorMessage name="country_name" component="div" />
                    </div>
                    <div className="edit-country-input">
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
                      <ErrorMessage name="country_color" component="div" />
                    </div>
                    <div className="edit-country-input">
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
                      <ErrorMessage name="country_color" component="div" />
                    </div>
                  </div>
                  <div className="edit-country-input">
                    <Field
                      name="country_description"
                      type="text"
                      defaultValue={country.description}
                      as={Textarea}
                      rows={4}
                      label="Opis države *"
                      placeholder="1 ili 2 rečenice koje najbolje opisuju državu..."
                    />
                    <ErrorMessage name="country_description" component="div" />
                  </div>
                </div>
                <div className="edit-country-images-container">
                  <div className="edit-country-images-item">
                    <h6>Zastava države *</h6>
                    {flagImage ? (
                      <div
                        className="edit-country-image"
                        onClick={() => {
                          handleDeleteImage("flag");
                        }}
                      >
                        <div className="edit-country-image-remove-icon">
                          <X size={32} color="#e70101" weight="bold" />
                        </div>
                        <img src={flagImage} alt={`image-error-${flagImage}`} />
                      </div>
                    ) : (
                      <div
                        className="edit-country-item"
                        onClick={() => {
                          toggleDialog();
                          setImageType("flag");
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    )}
                  </div>
                  <div className="edit-country-images-item">
                    <h6>Glavna fotografija države *</h6>
                    {mainCountryImage ? (
                      <div
                        className="edit-country-image"
                        onClick={() => {
                          handleDeleteImage("main");
                        }}
                      >
                        <div className="edit-country-image-remove-icon">
                          <X size={32} color="#e70101" weight="bold" />
                        </div>
                        <img
                          src={mainCountryImage}
                          alt={`image-error-${mainCountryImage}`}
                        />
                      </div>
                    ) : (
                      <div
                        className="edit-country-item"
                        onClick={() => {
                          toggleDialog();
                          setImageType("main");
                        }}
                      >
                        <Plus size={32} color="#616161" weight="bold" />
                      </div>
                    )}
                  </div>
                </div>
                <p>* preporuča se okrugla slika zastave</p>
                <p>* preporuča se slika u omjeru 16:9 za glavnu fotografiju</p>

                <div className="edit-country-characteristics-container">
                  <h6>Da Vas ne iznenadi</h6>
                  <fieldset>
                    <legend>Odaberi 6 karakteristika</legend>

                    <FieldArray
                      name="characteristics"
                      render={(arrayHelpers) => {
                        const characteristics = values.characteristics;

                        return (
                          <div className="edit-country-characteristics-inner">
                            {characteristics && characteristics.length > 0
                              ? characteristics.map(
                                  (_characteristic, index) => (
                                    <div
                                      className="edit-country-characteristics-item"
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
                                      <Field
                                        type="text"
                                        name={`characteristics.${index}.characteristic_title`}
                                        as={Input}
                                        placeholder="Unesi podnaslov..."
                                      />
                                      <Field
                                        type="text"
                                        name={`characteristics.${index}.characteristic_description`}
                                        as={Input}
                                        placeholder="Unesi opis..."
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

                <div className="edit-country-specificities-container">
                  <h6>Specifičnosti</h6>
                  {/* array of specificities (2) */}
                  <FieldArray
                    name="specificities"
                    render={(arrayHelpers) => {
                      const specificities = values.specificities;

                      return (
                        <div className="edit-country-specificities-inner">
                          {specificities && specificities.length > 0
                            ? specificities.map((_specificity, index) => (
                                <div key={index}>
                                  <Field
                                    type="text"
                                    name={`specificities[${index}].title`}
                                    as={Input}
                                    placeholder="Unesi naslov..."
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
                                                      className="edit-country-specificities-item"
                                                      key={itemIndex}
                                                    >
                                                      <div className="edit-country-specificities-item-column">
                                                        <Field
                                                          type="text"
                                                          name={`specificities[${index}].items[${itemIndex}].title`}
                                                          as={Input}
                                                          placeholder="Unesi podnaslov..."
                                                        />
                                                        <Field
                                                          type="text"
                                                          name={`specificities[${index}].items[${itemIndex}].description`}
                                                          as={Input}
                                                          placeholder="Unesi opis..."
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
                                            <div className="edit-country-specificities-images-container">
                                              {specificityImagesTemplate.map(
                                                (el, imageIndex) => (
                                                  <div
                                                    className="edit-country-images-container"
                                                    key={imageIndex}
                                                  >
                                                    {specificityImages[index][
                                                      imageIndex
                                                    ] &&
                                                    specificityImages[index][
                                                      imageIndex
                                                    ] != "" ? (
                                                      <div
                                                        className="edit-country-image"
                                                        onClick={() => {
                                                          handleDeleteImage(
                                                            "spec",
                                                            imageIndex,
                                                            index
                                                          );
                                                        }}
                                                      >
                                                        <div className="edit-country-image-remove-icon">
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
                                                        className="edit-country-item"
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

                <div className="edit-country-videos-wrapper">
                  <div className="edit-country-video-outer-container">
                    <FieldArray
                      name="videos"
                      render={(arrayHelpers) => {
                        const videos = values.videos;

                        return (
                          <div className="edit-country-videos-container">
                            <div className="edit-country-header">
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
                                  <div
                                    className="edit-country-video-row"
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
                <div className="edit-country-buttons">
                  <Button type="submit" adminPrimary>
                    uredi državu
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

export default EditCountry;
