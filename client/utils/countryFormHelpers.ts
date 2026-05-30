import type { RefObject } from "react";
import * as Yup from "yup";
import { getCountryAccusative } from "@/utils/countryGrammar";
import {
  bestTimeMonths,
  getDefaultBestTimeMonths,
  normalizeNumberForInput,
  numberValidation,
} from "@/utils/bestTimeFormHelpers";
import { safeDecodeURIComponent } from "@/utils/url";

export {
  bestTimeMonths,
  getDefaultBestTimeMonths,
  normalizeNumberForInput,
  safeDecodeURIComponent,
};

export const countryLanguagePhraseLabels = [
  { order_index: 1, label: "Bok / pozdrav" },
  { order_index: 2, label: "Hvala" },
  { order_index: 3, label: "Molim" },
  { order_index: 4, label: "Oprostite" },
  { order_index: 5, label: "Da" },
  { order_index: 6, label: "Ne" },
];

export const getDefaultBestTimeRegion = (sortOrder = 1) => ({
  region_key: "",
  label: "",
  note: "",
  sort_order: sortOrder,
  months: getDefaultBestTimeMonths(),
});

export const getDefaultCountryLanguagePhrases = () =>
  countryLanguagePhraseLabels.map((item) => ({
    order_index: item.order_index,
    phrase: "",
    pronunciation: "",
  }));

export const getInitialCountryLanguage = (countryLanguage: any) => {
  if (!countryLanguage) {
    return {
      id: null,
      language_name: "",
      is_active: true,
      phrases: getDefaultCountryLanguagePhrases(),
    };
  }

  const existingPhrases = countryLanguage.phrases || [];

  return {
    id: countryLanguage.id || null,
    language_name: countryLanguage.language_name || "",
    is_active:
      countryLanguage.is_active === undefined
        ? true
        : Boolean(countryLanguage.is_active),
    phrases: countryLanguagePhraseLabels.map((item) => {
      const foundPhrase = existingPhrases.find(
        (phraseItem: any) => phraseItem.order_index === item.order_index
      );

      return {
        order_index: item.order_index,
        phrase: foundPhrase?.phrase || "",
        pronunciation: foundPhrase?.pronunciation || "",
      };
    }),
  };
};

export const normalizeSlug = (value: string) => {
  return value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
};

export const getDefaultBestTimeTitle = (countryName: string) => {
  if (!countryName) return "";
  return `Kada je najbolje posjetiti ${getCountryAccusative(countryName)}?`;
};

export const getInitialBestTimeToVisit = (country: any) => {
  const bestTime = country?.best_time_to_visit;
  const countryRealName = country?.country_real_name || "";
  const defaultTitle = getDefaultBestTimeTitle(countryRealName);

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
        ? existingRegions.map((region: any, regionIndex: number) => {
            const existingMonths = region.months || [];

            return {
              region_key: region.region_key || "",
              label: region.label || "",
              note: region.note || "",
              sort_order: region.sort_order || regionIndex + 1,
              months: bestTimeMonths.map((month) => {
                const foundMonth = existingMonths.find(
                  (item: any) => item.month_key === month.month_key
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

export const createCountryValidationSchema = (mode: "add" | "edit") =>
  Yup.object().shape({
    country_name: Yup.string().required("Obavezno polje!"),
    country_description: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Opis smije imati max 100 znakova!"),
    country_color: Yup.string().required("Obavezno polje!"),
    country_continent: Yup.string().required("Obavezno polje!"),
    country_language: Yup.object().shape({
      language_name: Yup.string()
        .required("Obavezno polje!")
        .max(100, "Naziv jezika smije imati max 100 znakova!"),
      is_active: Yup.boolean(),
      phrases: Yup.array()
        .of(
          Yup.object().shape({
            order_index: Yup.number().required("Obavezno polje!"),
            phrase: Yup.string()
              .required("Obavezno polje!")
              .max(100, "Riječ/fraza smije imati max 100 znakova!"),
            pronunciation: Yup.string()
              .required("Obavezno polje!")
              .max(100, "Izgovor smije imati max 100 znakova!"),
          })
        )
        .min(6, "Potrebno je unijeti svih 6 riječi."),
    }),
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
      Yup.object().shape(
        mode === "add"
          ? {
              characteristic_icon: Yup.string().required("Obavezno polje!"),
              characteristic_title: Yup.string()
                .required("Obavezno polje !")
                .max(80, "Naslov smije imati max 80 znakova!"),
              characteristic_description: Yup.string()
                .required("Obavezno polje!")
                .max(80, "Opis smije imati max 80 znakova!"),
            }
          : {
              icon: Yup.string().required("Obavezno polje!"),
              title: Yup.string()
                .required("Obavezno polje !")
                .max(80, "Naslov smije imati max 80 znakova!"),
              description: Yup.string()
                .required("Obavezno polje!")
                .max(80, "Opis smije imati max 80 znakova!"),
            }
      )
    ),
    specificities: Yup.array().of(
      Yup.object().shape({
        title: Yup.string()
          .required("Obavezno polje!")
          .max(45, "Naslov smije imati max 100 znakova!"),
        [mode === "add" ? "items" : "specificity_items"]: Yup.array().of(
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

export const hasAllCountryImages = ({
  mainCountryImage,
  flagImage,
  specificityImages,
}: {
  mainCountryImage: string | null;
  flagImage: string | null;
  specificityImages: any[][];
}) => {
  let areAllImagesFilledIn = true;

  specificityImages.forEach((imageGroup) => {
    imageGroup.forEach((image) => {
      const imageUrl = typeof image === "string" ? image : image?.url;

      if (!image || imageUrl == "") {
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

export const prepareBestTimeToVisitPayload = (
  values: any,
  selectedCountry: { name: string }
) => ({
  ...values.best_time_to_visit,
  slug: normalizeSlug(selectedCountry.name),
  title:
    values.best_time_to_visit.title ||
    getDefaultBestTimeTitle(selectedCountry.name),
  subtitle: values.best_time_to_visit.subtitle,
  is_enabled: values.best_time_to_visit.is_enabled,
  regions: values.best_time_to_visit.regions.map(
    (region: any, index: number) => ({
      ...region,
      region_key: normalizeSlug(region.label),
      sort_order: index + 1,
      months: region.months,
    })
  ),
});

export const prepareCountryLanguagePayload = (values: any) => ({
  language_name: values.country_language.language_name,
  is_active: values.country_language.is_active,
  phrases: values.country_language.phrases.map(
    (phraseItem: any, index: number) => ({
      order_index: index + 1,
      phrase: phraseItem.phrase,
      pronunciation: phraseItem.pronunciation,
    })
  ),
});

export const navigateToCountries = (router: any) => {
  router.push("/admin/drzave");
};

export const toggleDialog = (dialogRef: RefObject<HTMLDialogElement>) => {
  if (dialogRef && dialogRef.current) {
    if (dialogRef.current.hasAttribute("open")) {
      dialogRef.current.close();
    } else {
      dialogRef.current.showModal();
    }
  }
};

export const addVideoField = (arrayHelpers: any) => {
  arrayHelpers.push({
    video_url: "",
  });
};

export const deleteVideoField = (arrayHelpers: any, videoIndex: number) => {
  arrayHelpers.remove(videoIndex);
};

export const addSpecificityItemField = (subarrayHelpers: any) => {
  subarrayHelpers.push({
    title: "",
    description: "",
  });
};

export const deleteSpecificityItemField = (
  subarrayHelpers: any,
  index: number
) => {
  subarrayHelpers.remove(index);
};

export const addCountryImage = ({
  imageType,
  modalInputValue,
  selectedSpecificityImage,
  setMainCountryImage,
  setFlagImage,
  setSpecificityImages,
  setModalInputValue,
  preserveSpecificityImageData = false,
}: {
  imageType: string | null;
  modalInputValue: string;
  selectedSpecificityImage: number[];
  setMainCountryImage: (value: string) => void;
  setFlagImage: (value: string) => void;
  setSpecificityImages: (value: any) => void;
  setModalInputValue: (value: string) => void;
  preserveSpecificityImageData?: boolean;
}) => {
  if (imageType == "main") {
    setMainCountryImage(modalInputValue);
  } else if (imageType == "flag") {
    setFlagImage(modalInputValue);
  } else if (imageType == "spec") {
    setSpecificityImages((prevSectionImages: any[][]) => [
      ...prevSectionImages.slice(0, selectedSpecificityImage[1]),
      [
        ...prevSectionImages[selectedSpecificityImage[1]].slice(
          0,
          selectedSpecificityImage[0]
        ),
        preserveSpecificityImageData
          ? {
              ...prevSectionImages[selectedSpecificityImage[1]!][
                selectedSpecificityImage[0]!
              ],
              url: modalInputValue,
            }
          : modalInputValue,
        ...prevSectionImages[selectedSpecificityImage[1]].slice(
          selectedSpecificityImage[0] + 1
        ),
      ],
      ...prevSectionImages.slice(selectedSpecificityImage[1] + 1),
    ]);
  }

  setModalInputValue("");
};

export const deleteCountryImage = ({
  type,
  imageIndex,
  specificityIndex,
  setMainCountryImage,
  setFlagImage,
  setSpecificityImages,
  emptySpecificityImageValue = null,
}: {
  type: string;
  imageIndex?: number;
  specificityIndex?: number;
  setMainCountryImage: (value: null) => void;
  setFlagImage: (value: null) => void;
  setSpecificityImages: (value: any) => void;
  emptySpecificityImageValue?: null | { id: number; url: string };
}) => {
  if (type == "main") {
    setMainCountryImage(null);
  } else if (type == "flag") {
    setFlagImage(null);
  } else if (type == "spec") {
    setSpecificityImages((prevSectionImages: any[][]) => [
      ...prevSectionImages.slice(0, specificityIndex),
      [
        ...prevSectionImages[specificityIndex!].slice(0, imageIndex),
        emptySpecificityImageValue,
        ...prevSectionImages[specificityIndex!].slice(imageIndex! + 1),
      ],
      ...prevSectionImages.slice(specificityIndex! + 1),
    ]);
  }
};
