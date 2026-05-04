// @ts-nocheck

"use client";

import "./EditCountry.scss";
import { Fragment, useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { countries as countryList } from "@/utils/all_countries.ts";
import Swal from "sweetalert2";
import { notifySuccess } from "@/components/atoms/Toast/Toast";
import Modal from "@/components/atoms/Modal";
import Button from "@/components/atoms/Button";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import AdvancedDropdown from "@/components/admin/atoms/AdvancedDropdown";
import Textarea from "@/components/admin/atoms/Textarea";
import { Plus, Trash, X } from "@phosphor-icons/react";
import Input from "@/components/atoms/Input";
import {
  getCountries,
  getCountriesByName,
  getCountryById,
  updateCountry,
} from "@/utils/countries";
import { getCharacteristicIcons } from "@/utils/characteristicIcons";
import { getColors } from "@/utils/colors";
import { getContinents } from "@/utils/continents";
import {
  CharacteristicProps,
  CountriesData,
  SpecificityProps,
} from "@/common/types";
import { addVideo, deleteVideo, updateVideo } from "@/utils/videos";
import { updateCharacteristic } from "@/utils/characteristics";
import { updateSpecificity } from "@/utils/specificities";
import {
  addSpecificityItem,
  deleteSpecificityItem,
  updateSpecificityItem,
} from "@/utils/specificityItems";
import { updateSpecificityImage } from "@/utils/specificityImages";
import { useParams, useRouter } from "next/navigation";
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

const normalizeNumberForInput = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).replace(".", ",");
};

const normalizeSlug = (value: string) => {
  return value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

const safeDecodeURIComponent = (value: string) => {
  if (!value) return "";

  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
};

const getBestTimeTitle = (countryName: string) => {
  if (!countryName) return "";
  return `Kada je najbolje posjetiti ${getCountryAccusative(countryName)}?`;
};

const getInitialBestTimeToVisit = (country) => {
  const bestTime = country?.best_time_to_visit;
  const countryRealName = country?.country_real_name || "";
  const defaultTitle = getBestTimeTitle(countryRealName);

  if (!bestTime) {
    return {
      title: defaultTitle,
      subtitle: "",
      is_enabled: true,
      regions: [getDefaultBestTimeRegion(1)],
    };
  }

  const existingRegions = bestTime.regions || [];

  return {
    title: bestTime.title || defaultTitle,
    subtitle: bestTime.subtitle || "",
    is_enabled:
      bestTime.is_enabled === undefined ? true : Boolean(bestTime.is_enabled),
    regions:
      existingRegions.length > 0
        ? existingRegions.map((region, regionIndex) => {
            const existingMonths = region.months || [];

            return {
              region_key: region.region_key || "",
              label: region.label || "",
              note: region.note || "",
              sort_order: region.sort_order || regionIndex + 1,
              months: bestTimeMonths.map((month) => {
                const foundMonth = existingMonths.find(
                  (item) => item.month_key === month.month_key
                );

                return {
                  month_key: month.month_key,
                  avg_temp_c: normalizeNumberForInput(foundMonth?.avg_temp_c),
                  avg_rain_mm: normalizeNumberForInput(foundMonth?.avg_rain_mm),
                };
              }),
            };
          })
        : [getDefaultBestTimeRegion(1)],
  };
};

const numberValidation = Yup.string()
  .required("Obavezno polje!")
  .test("is-valid-number", "Vrijednost mora biti validan broj!", (value) => {
    if (value === undefined || value === null || value === "") return false;
    return !Number.isNaN(Number(value.toString().replace(",", ".")));
  });

const EditCountry = () => {
  const params = useParams();
  const router = useRouter();

  const rawName = params?.name as string;
  const name = safeDecodeURIComponent(rawName);
  const normalizedName = name.toLowerCase();

  const [colors, setColors] = useState(null);
  const [country, setCountry] = useState<CountriesData | null>(null);
  const [countries, setCountries] = useState<
    Array<{
      id: number;
      name: string;
    }> | null
  >(null);
  const [alreadyAddedCountries, setAlreadyAddedCountries] = useState(null);
  const [countryArrayId, setCountryArrayId] = useState(null);
  const [continents, setContinents] = useState(null);
  const [characteristicIcons, setCharacteristicIcons] = useState(null);

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalInputValue, setModalInputValue] = useState("");

  const [imageType, setImageType] = useState<string | null>(null);
  const [mainCountryImage, setMainCountryImage] = useState<string>("");
  const [flagImage, setFlagImage] = useState<string>("");
  const [specificityImages, setSpecificityImages] = useState<
    Array<Array<{ id: number; url: string }>>
  >([
    [
      { id: 0, url: "" },
      { id: 0, url: "" },
      { id: 0, url: "" },
    ],
    [
      { id: 0, url: "" },
      { id: 0, url: "" },
      { id: 0, url: "" },
    ],
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
        icon: Yup.string().required("Obavezno polje!"),
        title: Yup.string()
          .required("Obavezno polje !")
          .max(80, "Naslov smije imati max 80 znakova!"),
        description: Yup.string()
          .required("Obavezno polje!")
          .max(80, "Opis smije imati max 80 znakova!"),
      })
    ),
    specificities: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .required("Obavezno polje!")
          .max(45, "Naslov smije imati max 100 znakova!"),
        specificity_items: Yup.array().of(
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
        if (!image || image.url == "") {
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
        values.best_time_to_visit.title || getBestTimeTitle(selectedCountry.name),
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

          if (!selectedCountry) {
            console.error("Selected country not found");
            return;
          }

          const bestTimeToVisitPayload = prepareBestTimeToVisitPayload(
            values,
            selectedCountry
          );

          const countryResponse = await updateCountry({
            id: country.id,
            name: selectedCountry.name,
            description: values.country_description,
            main_image_url: mainCountryImage,
            flag_image_url: flagImage,
            continentId: values.country_continent,
            colorId: values.country_color,
            best_time_to_visit: bestTimeToVisitPayload,
          });

          console.log(countryResponse);

          if (values.characteristics) {
            values.characteristics.map(async (el: CharacteristicProps) => {
              await updateCharacteristic(
                el.id,
                el.title,
                el.description,
                el.icon
              );
            });
          }

          if (values.specificities && country.specificities) {
            values.specificities.map(async (el: SpecificityProps) => {
              let specificityResponse;

              if (el.id) {
                specificityResponse = await updateSpecificity(el.id, el.title);
                console.log(specificityResponse);

                el.specificity_items.map(async (item) => {
                  if (item.id) {
                    await updateSpecificityItem(
                      item.id,
                      item.title,
                      item.description
                    );
                  } else {
                    await addSpecificityItem(
                      item.title,
                      item.description,
                      el.id
                    );
                  }
                });

                specificityImages.map(async (imageGroup, groupIndex) => {
                  imageGroup.map(async (image, imageIndex) => {
                    await updateSpecificityImage(
                      image.id,
                      specificityImages[groupIndex][imageIndex].url,
                      el.id
                    );
                  });
                });
              }
            });

            const array1: (number | undefined)[] = [];
            const array2: (number | undefined)[] = [];

            country.specificities.map((specificity) => {
              specificity.specificity_items.map((item) => {
                array1.push(item.id);
              });
            });

            values.specificities.map(
              (specificity: { specificity_items: { id: number }[] }) => {
                specificity.specificity_items.map((item: { id: number }) => {
                  array2.push(item.id);
                });
              }
            );

            const removedValues = array1.filter(
              (item) => !array2.includes(item)
            );

            removedValues.map(
              async (el: number) => await deleteSpecificityItem(el)
            );
          }

          if (country.videos) {
            const removedVideoIds = country.videos.filter(
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
                null,
                country.id
              );
            }

            console.log(videoResponse);
          });

          router.push("/admin/drzave");
          notifySuccess("Uspješno uređena država!");
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
            {
              ...prevSectionImages[selectedSpecificityImage[1]!][
                selectedSpecificityImage[0]!
              ],
              url: modalInputValue,
            },
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
            { ...prevSectionImages[specificityIndex!][imageIndex!], url: "" },
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
    if (name) {
      fetchData();
    }
  }, [name]);

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
    reorganizeArrays();
  }, [alreadyAddedCountries, normalizedName]);

  const reorganizeArrays = async () => {
    if (alreadyAddedCountries) {
      const allCountries = countryList.map((el, index) => ({
        id: index,
        name: el.cro_name,
      }));

      const filtered = allCountries.filter((el) => {
        return (
          el.name.toLowerCase() === normalizedName ||
          !alreadyAddedCountries.some((existingCountry) => {
            return existingCountry.name === el.name;
          })
        );
      });

      setCountries(filtered);

      const foundCountryElement = filtered.find(
        (el) => el.name.toLowerCase() === normalizedName
      );

      if (foundCountryElement) {
        setCountryArrayId(foundCountryElement.id);
      }
    }
  };

  useEffect(() => {
    if (countries && countryArrayId !== null) {
      fetchSelectedCountryData();
    }
  }, [countries, countryArrayId]);

  const fetchSelectedCountryData = async () => {
    if (name) {
      const _country = await getCountriesByName(name, 1, 1, 0, true);

      if (!_country?.data?.[0]?.id) {
        console.error("Country not found by name:", name);
        return;
      }

      const _countryData = await getCountryById(_country.data[0].id, true);

      setCountry({
        ..._countryData,
        country_real_name: _countryData.name,
        name: countryArrayId,
      });

      setMainCountryImage(_countryData.main_image_url);
      setFlagImage(_countryData.flag_image_url);

      setSpecificityImages([
        [
          {
            id: _countryData.specificities?.[0]?.specificity_images?.[0]?.id || 0,
            url:
              _countryData.specificities?.[0]?.specificity_images?.[0]?.url ||
              "",
          },
          {
            id: _countryData.specificities?.[0]?.specificity_images?.[1]?.id || 0,
            url:
              _countryData.specificities?.[0]?.specificity_images?.[1]?.url ||
              "",
          },
          {
            id: _countryData.specificities?.[0]?.specificity_images?.[2]?.id || 0,
            url:
              _countryData.specificities?.[0]?.specificity_images?.[2]?.url ||
              "",
          },
        ],
        [
          {
            id: _countryData.specificities?.[1]?.specificity_images?.[0]?.id || 0,
            url:
              _countryData.specificities?.[1]?.specificity_images?.[0]?.url ||
              "",
          },
          {
            id: _countryData.specificities?.[1]?.specificity_images?.[1]?.id || 0,
            url:
              _countryData.specificities?.[1]?.specificity_images?.[1]?.url ||
              "",
          },
          {
            id: _countryData.specificities?.[1]?.specificity_images?.[2]?.id || 0,
            url:
              _countryData.specificities?.[1]?.specificity_images?.[2]?.url ||
              "",
          },
        ],
      ]);
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
        countryArrayId !== null ? (
          <Formik
            initialValues={{
              country_name: country.name,
              country_description: country.description || "",
              country_continent: country.continentId,
              country_color: country.colorId,
              best_time_to_visit: getInitialBestTimeToVisit(country),
              characteristics: Array.from({ length: 6 }, (_, index) => ({
                id:
                  country.characteristics && country.characteristics[index]?.id,
                icon:
                  (country.characteristics &&
                    country.characteristics[index]?.characteristicIconId) ||
                  null,
                title:
                  (country.characteristics &&
                    country.characteristics[index]?.title) ||
                  "",
                description:
                  (country.characteristics &&
                    country.characteristics[index]?.description) ||
                  "",
              })),
              specificities: (country.specificities || [])
                .slice(0, 2)
                .map((specificity) => ({
                  id: specificity.id,
                  title: specificity.title || "",
                  specificity_items: (specificity.specificity_items || [])
                    .slice(0, 4)
                    .map((item) => ({
                      id: item.id || "",
                      title: item.title || "",
                      description: item.description || "",
                      specificity_id: item.specificityId || 0,
                    })),
                })),
              videos: country.videos
                ? country.videos.map((el) => ({
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
                        onChange={(value: { id: number; name: string }) => {
                          setFieldValue("country_name", value.id);
                          setFieldValue(
                            "best_time_to_visit.title",
                            getBestTimeTitle(value.name)
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

                    <div className="edit-country-input">
                      <Field
                        name="country_color"
                        type="text"
                        as={AdvancedDropdown}
                        label="Boja teksta države *"
                        hardcodedValue="Odaberi boju..."
                        options={colors}
                        onChange={(value: { id: number }) => {
                          setFieldValue("country_color", value.id);
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

                    <div className="edit-country-input">
                      <Field
                        name="country_continent"
                        type="text"
                        as={AdvancedDropdown}
                        label="Kontinent kojem pripada *"
                        hardcodedValue="Odaberi kontinent..."
                        options={continents}
                        onChange={(value: { id: number }) => {
                          setFieldValue("country_continent", value.id);
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

                  <div className="edit-country-input">
                    <Field
                      name="country_description"
                      type="text"
                      value={values.country_description || ""}
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

                    {isSubmitClicked && (flagImage == "" || !flagImage) && (
                      <p className="error-message">Obavezno polje!</p>
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

                    {isSubmitClicked &&
                      (mainCountryImage == "" || !mainCountryImage) && (
                        <p className="error-message">Obavezno polje!</p>
                      )}
                  </div>
                </div>

                <p>* preporuča se okrugla slika zastave</p>
                <p>* preporuča se slika u omjeru 16:9 za glavnu fotografiju</p>

                <div className="edit-country-best-time-wrapper">
                  <div className="edit-country-best-time-header">
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

                  <div className="edit-country-best-time-inputs">
                    <div className="edit-country-input">
                      <Field
                        name="best_time_to_visit.title"
                        type="text"
                        as={Input}
                        label="Naslov sekcije"
                        placeholder="npr. Kada je najbolje posjetiti Sloveniju?"
                      />
                      <ErrorMessage
                        name="best_time_to_visit.title"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <div className="edit-country-input">
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
                        <div className="edit-country-best-time-regions">
                          <div className="edit-country-best-time-regions-header">
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
                              className="edit-country-best-time-region"
                              key={regionIndex}
                            >
                              <div className="edit-country-best-time-region-header">
                                <h6>Regija {regionIndex + 1}</h6>

                                {regions.length > 1 && (
                                  <div
                                    className="edit-country-best-time-region-delete"
                                    onClick={() => {
                                      regionArrayHelpers.remove(regionIndex);
                                    }}
                                  >
                                    <Trash color="#AC2B2B" size={28} />
                                  </div>
                                )}
                              </div>

                              <div className="edit-country-best-time-region-inputs">
                                <div className="edit-country-input">
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

                                <div className="edit-country-input">
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

                              <div className="edit-country-best-time-table">
                                <div className="edit-country-best-time-row edit-country-best-time-row-head">
                                  <div>Mjesec</div>
                                  <div>Prosj. temp. °C</div>
                                  <div>Kiša mm</div>
                                </div>

                                {bestTimeMonths.map((month, monthIndex) => (
                                  <div
                                    className="edit-country-best-time-row"
                                    key={`${regionIndex}-${month.month_key}`}
                                  >
                                    <div className="edit-country-best-time-month">
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

                <div className="edit-country-characteristics-container">
                  <h6>Da Vas ne iznenadi</h6>
                  <fieldset>
                    <legend>Odaberi 6 karakteristika</legend>

                    <FieldArray
                      name="characteristics"
                      render={() => {
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
                                        name={`characteristics.${index}.icon`}
                                        options={characteristicIcons}
                                        onChange={(value) => {
                                          setFieldValue(
                                            `characteristics.${index}.icon`,
                                            value.id
                                          );
                                        }}
                                        selectedValue={
                                          values.characteristics[index].icon
                                        }
                                        filter={false}
                                        images={true}
                                      />
                                      <ErrorMessage
                                        name={`characteristics.${index}.icon`}
                                        component="div"
                                        className="error-message"
                                      />
                                      <Field
                                        type="text"
                                        name={`characteristics.${index}.title`}
                                        as={Input}
                                        placeholder="Unesi podnaslov..."
                                      />
                                      <ErrorMessage
                                        name={`characteristics.${index}.title`}
                                        component="div"
                                        className="error-message"
                                      />
                                      <Field
                                        type="text"
                                        name={`characteristics.${index}.description`}
                                        as={Input}
                                        placeholder="Unesi opis..."
                                      />
                                      <ErrorMessage
                                        name={`characteristics.${index}.description`}
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

                <div className="edit-country-specificities-container">
                  <h6>Specifičnosti</h6>

                  <FieldArray
                    name="specificities"
                    render={() => {
                      const specificities = values.specificities;

                      return (
                        <div className="edit-country-specificities-inner">
                          {specificities && specificities.length > 0
                            ? specificities.map((_specificity, index) => (
                                <div key={index}>
                                  <div className="edit-country-specificities-inner-item">
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
                                      name={`specificities[${index}].specificity_items`}
                                      render={(subarrayHelpers) => {
                                        const specificityItems =
                                          values.specificities[index]
                                            .specificity_items;
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
                                                          name={`specificities[${index}].specificity_items[${itemIndex}].title`}
                                                          as={Input}
                                                          placeholder="Unesi podnaslov..."
                                                        />
                                                        <ErrorMessage
                                                          name={`specificities[${index}].specificity_items[${itemIndex}].title`}
                                                          component="div"
                                                          className="error-message"
                                                        />
                                                        <Field
                                                          type="text"
                                                          name={`specificities[${index}].specificity_items[${itemIndex}].description`}
                                                          as={Input}
                                                          placeholder="Unesi opis..."
                                                        />
                                                        <ErrorMessage
                                                          name={`specificities[${index}].specificity_items[${itemIndex}].description`}
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
                                                    ].url != "" ? (
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
                                                            ][imageIndex].url
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

                                            {isSubmitClicked &&
                                              (!specificityImages[index][0] ||
                                                specificityImages[index][0]
                                                  .url == "" ||
                                                !specificityImages[index][1] ||
                                                specificityImages[index][1]
                                                  .url == "" ||
                                                !specificityImages[index][2] ||
                                                specificityImages[index][2]
                                                  .url == "") && (
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
                                  <Fragment key={index}>
                                    <div className="edit-country-video-row">
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

export default EditCountry;