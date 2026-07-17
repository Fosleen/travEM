import type { RefObject } from "react";
import * as Yup from "yup";
import { getVisitedCountries } from "@/utils/map";
import {
  bestTimeMonths,
  getDefaultBestTimeMonths,
  normalizeNumberForInput,
  numberValidation,
} from "@/utils/bestTimeFormHelpers";

export const grammarRows = [
  {
    key: "place_name",
    label: "Nominativ",
    question: "tko? što?",
    example: "radi",
    isPreview: true,
  },
  {
    key: "name_genitive",
    label: "Genitiv",
    question: "koga? čega?",
    example: "nema",
  },
  {
    key: "name_dative",
    label: "Dativ",
    question: "komu? čemu?",
    example: "idem",
  },
  {
    key: "name_accusative",
    label: "Akuzativ",
    question: "koga? što?",
    example: "vidim",
  },
  {
    key: "name_locative",
    label: "Lokativ",
    question: "o komu? o čemu?",
    example: "govorim",
  },
];

export { bestTimeMonths, getDefaultBestTimeMonths, normalizeNumberForInput };

export const slugifyPlaceName = (value: string) => {
  return value.trim().toLowerCase().replace(/\s+/g, "-");
};

export const buildBestTimeToVisitPayload = (values: any) => ({
  ...values.best_time_to_visit,
  slug: slugifyPlaceName(values.place_name),
});

export const getInitialBestTimeToVisit = (place: any) => {
  const bestTime = place?.best_time_to_visit;

  if (!bestTime) {
    return {
      subtitle: "",
      note: "",
      is_enabled: true,
      months: getDefaultBestTimeMonths(),
    };
  }

  const existingMonths = bestTime.months || [];

  return {
    subtitle: bestTime.subtitle || "",
    note: bestTime.note || "",
    is_enabled:
      bestTime.is_enabled === undefined ? true : Boolean(bestTime.is_enabled),
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
};

export const createPlaceValidationSchema = ({
  includeFeaturedArticle = false,
} = {}) =>
  Yup.object().shape({
    place_name: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Naziv smije imati max 100 znakova!"),
    name_genitive: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Genitiv smije imati max 100 znakova!"),
    name_dative: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Dativ smije imati max 100 znakova!"),
    name_accusative: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Akuzativ smije imati max 100 znakova!"),
    name_locative: Yup.string()
      .required("Obavezno polje!")
      .max(100, "Lokativ smije imati max 100 znakova!"),
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
    ...(includeFeaturedArticle ? { featured_article_id: Yup.mixed().nullable() } : {}),
    best_time_to_visit: Yup.object().shape({
      subtitle: Yup.string().required("Obavezno polje!"),
      note: Yup.string().nullable(),
      is_enabled: Yup.boolean(),
      months: Yup.array()
        .of(
          Yup.object().shape({
            month_key: Yup.string().required("Obavezno polje!"),
            avg_temp_c: numberValidation,
            avg_rain_mm: numberValidation,
          })
        )
        .min(12, "Potrebno je unijeti svih 12 mjeseci."),
    }),
    videos: Yup.array().of(
      Yup.object().shape({
        video_url: Yup.string().required("Obavezno polje!"),
      })
    ),
  });

export const addVideoField = (arrayHelpers: any) => {
  arrayHelpers.push({
    video_url: "",
  });
};

export const deleteVideoField = (arrayHelpers: any, videoIndex: number) => {
  arrayHelpers.remove(videoIndex);
};

export const hasMainPlaceImage = (mainPlaceImage: string | null) => {
  return mainPlaceImage != "" && mainPlaceImage;
};

export const navigateToPlaces = (router: any) => {
  router.push("/admin/mjesta");
};

export const addMainPlaceImage = ({
  modalInputValue,
  setMainPlaceImage,
  setModalInputValue,
}: {
  modalInputValue: string;
  setMainPlaceImage: (value: string) => void;
  setModalInputValue: (value: string) => void;
}) => {
  setMainPlaceImage(modalInputValue);
  setModalInputValue("");
};

export const deleteMainPlaceImage = (
  setMainPlaceImage: (value: null) => void
) => {
  setMainPlaceImage(null);
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

export const mapCountriesToDropdownOptions = (countriesData: any[]) =>
  countriesData.map(
    (el: { id: number; flag_image_url: string; name: string }) => ({
      id: el.id,
      url: el.flag_image_url,
      name: el.name,
    })
  );

export const fetchCountryDropdownOptions = async () => {
  const countriesData = await getVisitedCountries();
  return mapCountriesToDropdownOptions(countriesData);
};
