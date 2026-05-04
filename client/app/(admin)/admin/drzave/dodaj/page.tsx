// @ts-nocheck

"use client";

import { useRouter } from "next/navigation";
import "./AddCountry.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import { notifySuccess } from "@/components/atoms/Toast/Toast";
import Swal from "sweetalert2";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/admin/atoms/Textarea";
import { getColors } from "@/utils/colors";
import { getCharacteristicIcons } from "@/utils/characteristicIcons";
import * as Yup from "yup";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import { countries as countryList } from "@/utils/all_countries";
import { Plus, Trash, X } from "@phosphor-icons/react";
import { addCountry, getCountries } from "@/utils/countries";
import { getContinents } from "@/utils/continents";
import { addSpecificity } from "@/utils/specificities";
import { addCharacteristic } from "@/utils/characteristics";
import { addVideo } from "@/utils/videos";
import ToggleSwitch from "@/components/admin/atoms/ToggleSwitch";
import { getCountryAccusative } from "@/utils/countryGrammar";

const bestTimeMonths = [
  { month_key: "jan", label: "Siječanj" },
  { month_key: "feb", label: "Veljača" },
  { month_key: "mar", label: "Ožujak" },
  { month_key: "apr", label: "Travanj" },
  { month_key: "may", label: "Svibanj" },
  { month_key: "jun", label: "Lipanj" },
  { month_key: "jul", label: "Srpanj" },
  { month_key: "aug", label: "Kolovoz" },
  { month_key: "sep", label: "Rujan" },
  { month_key: "oct", label: "Listopad" },
  { month_key: "nov", label: "Studeni" },
  { month_key: "dec", label: "Prosinac" },
];

const getDefaultBestTimeMonths = () =>
  bestTimeMonths.map((month) => ({
    month_key: month.month_key,
    avg_temp_c: "",
    avg_rain_mm: "",
  }));

const getDefaultBestTimeRegion = (sortOrder = 1) => ({
  region_key: "",
  label: "",
  note: "",
  sort_order: sortOrder,
  months: getDefaultBestTimeMonths(),
});

const normalizeSlug = (value: string) => {
  return value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const getDefaultBestTimeTitle = (countryName: string) => {
  if (!countryName) return "";

  return `Kada je najbolje posjetiti ${getCountryAccusative(countryName)}?`;
};

const numberValidation = Yup.string()
  .required("Obavezno polje!")
  .test("is-valid-number", "Vrijednost mora biti validan broj!", (value) => {
    if (value === undefined || value === null || value === "") return false;

    return !Number.isNaN(Number(value.toString().replace(",", ".")));
  });

const AddCountry = () => {
  const router = useRouter();

  const [colors, setColors] = useState(null);
  const [countries, setCountries] = useState(null);
  const [alreadyAddedCountries, setAlreadyAddedCountries] = useState(null);
  const [continents, setContinents] = useState(null);
  const [characteristicIcons, setCharacteristicIcons] = useState(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");

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
    country_continent: Yup.string().required("Obavezno polje!"),
    best_time_to_visit: Yup.object().shape({
      title: Yup.string().nullable(),
      subtitle: Yup.string().required("Obavezno polje!"),
      is_enabled: Yup.boolean(),
      regions: Yup.array()
        .of(
          Yup.object().shape({
            region_key: Yup.string().nullable(),
            label: Yup.string().required("Obavezno polje!"),
            note: Yup.string().nullable(),
            sort_order: Yup.number(),
            months: Yup.array()
              .of(
                Yup.object().shape({
                  month_key: Yup.string().required("Obavezno polje!"),
                  avg_temp_c: numberValidation,
                  avg_rain_mm: numberValidation,
                })
              )
              .min(12, "Potrebno je unijeti svih 12 mjeseci."),
          })
        )
        .min(1, "Potrebno je unijeti barem jednu regiju."),
    }),
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

  const prepareBestTimeToVisitPayload = (values, selectedCountry) => {
    return {
      ...values.best_time_to_visit,
      slug: normalizeSlug(selectedCountry.name),
      title:
        values.best_time_to_visit.title ||
        getDefaultBestTimeTitle(selectedCountry.name),
      subtitle: values.best_time_to_visit.subtitle,
      is_enabled: values.best_time_to_visit.is_enabled,
      regions: values.best_time_to_visit.regions.map((region, index) => ({
        ...region,
        region_key: normalizeSlug(region.label),
        sort_order: index + 1,
        months: region.months,
      })),
    };
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

        if (result.isConfirmed && selectedCountry) {
          const bestTimeToVisitPayload = prepareBestTimeToVisitPayload(
            values,
            selectedCountry
          );

          const countryResponse = await addCountry(
            selectedCountry.name,
            values.country_description,
            mainCountryImage,
            flagImage,
            values.country_continent,
            values.country_color,
            bestTimeToVisitPayload
          );

          console.log("countryResponse", countryResponse);
          console.log("values.specificities", values.specificities);

          values.specificities.map(async (el, index) => {
            return await addSpecificity(
              el.title,
              countryResponse.id,
              el.items,
              specificityImages[index]
            );
          });

          console.log("values.characteristics", values.characteristics);

          values.characteristics.map(
            async (el) =>
              await addCharacteristic(
                el.characteristic_title,
                el.characteristic_description,
                countryResponse.id,
                el.characteristic_icon
              )
          );

          console.log("values.videos", values.videos);

          values.videos.map(
            async (el) =>
              await addVideo(el.video_url, null, null, countryResponse.id)
          );

          router.push("/admin/drzave");
          notifySuccess("Uspješno dodana država!");
        }
      });
    }
  };

  const handleCancel = () => {
    router.push("/admin/drzave");
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
        return [
          ...prevSectionImages.slice(0, selectedSpecificityImage[1]),
          [
            ...prevSectionImages[selectedSpecificityImage[1]].slice(
              0,
              selectedSpecificityImage[0]
            ),
            modalInputValue,
            ...prevSectionImages[selectedSpecificityImage[1]].slice(
              selectedSpecificityImage[0] + 1
            ),
          ],
          ...prevSectionImages.slice(selectedSpecificityImage[1] + 1),
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
      const alreadyAddedCountriesData = await getCountries(1, 300, true);
      const colorsData = await getColors();
      const characteristicIconsData = await getCharacteristicIcons();
      const continentsData = await getContinents(true);

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
        name: el.cro_name,
      }));

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
              country_description: "",
              country_continent: null,
              country_color: null,
              best_time_to_visit: {
                title: "",
                subtitle: "",
                is_enabled: true,
                regions: [getDefaultBestTimeRegion(1)],
              },
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
                        onChange={(value: { id: number; name: string }) => {
                          setFieldValue(`country_name`, value.id);
                          setFieldValue(
                            "best_time_to_visit.title",
                            getDefaultBestTimeTitle(value.name)
                          );
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

                <div className="add-country-best-time-wrapper">
                  <div className="add-country-best-time-header">
                    <div>
                      <h6>Najbolje vrijeme za posjet *</h6>
                      <p>
                        Unesite klimatske regije i prosječne mjesečne
                        vrijednosti temperature i kiše.
                      </p>
                    </div>

                    <ToggleSwitch
                      name={"country-best-time-enabled"}
                      description={"Prikaži ovu sekciju na stranici države"}
                      value={values.best_time_to_visit.is_enabled}
                      setter={(value) => {
                        setFieldValue("best_time_to_visit.is_enabled", value);
                      }}
                    />
                  </div>

                  <div className="add-country-best-time-inputs">
                    <div className="add-country-input">
                      <Field
                        name="best_time_to_visit.title"
                        type="text"
                        as={Input}
                        label="Naslov sekcije"
                        placeholder="Odaberi državu i naslov će se automatski popuniti"
                      />
                      <ErrorMessage
                        name="best_time_to_visit.title"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="add-country-input">
                      <Field
                        name="best_time_to_visit.subtitle"
                        type="text"
                        as={Input}
                        label="Podnaslov *"
                        placeholder="npr. Obala je blaža, unutrašnjost svježija..."
                      />
                      <ErrorMessage
                        name="best_time_to_visit.subtitle"
                        component="div"
                        className="error-message"
                      />
                    </div>
                  </div>

                  <FieldArray
                    name="best_time_to_visit.regions"
                    render={(regionArrayHelpers) => {
                      const regions = values.best_time_to_visit.regions;

                      return (
                        <div className="add-country-best-time-regions">
                          <div className="add-country-best-time-regions-header">
                            <h6>Regije</h6>

                            <Button
                              type="button"
                              circle
                              onClick={() => {
                                regionArrayHelpers.push(
                                  getDefaultBestTimeRegion(regions.length + 1)
                                );
                              }}
                            >
                              +
                            </Button>
                          </div>

                          {regions.map((region, regionIndex) => (
                            <div
                              className="add-country-best-time-region"
                              key={regionIndex}
                            >
                              <div className="add-country-best-time-region-header">
                                <h6>Regija {regionIndex + 1}</h6>

                                {regions.length > 1 && (
                                  <div
                                    className="add-country-best-time-region-delete"
                                    onClick={() => {
                                      regionArrayHelpers.remove(regionIndex);
                                    }}
                                  >
                                    <Trash color="#AC2B2B" size={28} />
                                  </div>
                                )}
                              </div>

                              <div className="add-country-best-time-region-inputs">
                                <div className="add-country-input">
                                  <Field
                                    name={`best_time_to_visit.regions.${regionIndex}.label`}
                                    type="text"
                                    as={Input}
                                    label="Naziv regije *"
                                    placeholder="npr. Ljubljana i unutrašnjost"
                                  />
                                  <ErrorMessage
                                    name={`best_time_to_visit.regions.${regionIndex}.label`}
                                    component="div"
                                    className="error-message"
                                  />
                                </div>

                                <div className="add-country-input">
                                  <Field
                                    name={`best_time_to_visit.regions.${regionIndex}.note`}
                                    type="text"
                                    as={Textarea}
                                    rows={2}
                                    label="Napomena"
                                    placeholder="npr. Najugodnije: svibanj-lipanj i rujan..."
                                  />
                                  <ErrorMessage
                                    name={`best_time_to_visit.regions.${regionIndex}.note`}
                                    component="div"
                                    className="error-message"
                                  />
                                </div>
                              </div>

                              <div className="add-country-best-time-table">
                                <div className="add-country-best-time-row add-country-best-time-row-head">
                                  <div>Mjesec</div>
                                  <div>Prosj. temp. °C</div>
                                  <div>Kiša mm</div>
                                </div>

                                {bestTimeMonths.map((month, monthIndex) => (
                                  <div
                                    className="add-country-best-time-row"
                                    key={`${regionIndex}-${month.month_key}`}
                                  >
                                    <div className="add-country-best-time-month">
                                      {month.label}
                                    </div>

                                    <div>
                                      <Field
                                        name={`best_time_to_visit.regions.${regionIndex}.months.${monthIndex}.avg_temp_c`}
                                        type="text"
                                        as={Input}
                                        label=""
                                        placeholder="npr. 18"
                                      />
                                      <ErrorMessage
                                        name={`best_time_to_visit.regions.${regionIndex}.months.${monthIndex}.avg_temp_c`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>

                                    <div>
                                      <Field
                                        name={`best_time_to_visit.regions.${regionIndex}.months.${monthIndex}.avg_rain_mm`}
                                        type="text"
                                        as={Input}
                                        label=""
                                        placeholder="npr. 120"
                                      />
                                      <ErrorMessage
                                        name={`best_time_to_visit.regions.${regionIndex}.months.${monthIndex}.avg_rain_mm`}
                                        component="div"
                                        className="error-message"
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }}
                  />
                </div>

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

                                    <FieldArray
                                      name={`specificities[${index}].items`}
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

export default AddCountry;