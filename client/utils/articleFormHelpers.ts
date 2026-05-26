import * as Yup from "yup";
import type { RefObject } from "react";
import {
  ARTICLE_TYPE_AIRPLANE_TICKET_ID,
  ARTICLE_TYPE_DESTINATION_ID,
} from "@/utils/articleTypeHelpers";
import { getArticleTypes } from "@/utils/articleTypes";
import { getVisitedCountries } from "@/utils/map";
import { getSectionIcons } from "@/utils/sectionIcons";
import { getAirportCities } from "@/utils/airportCities";
import { getPlacesByCountry } from "@/utils/places";

type ImageType = "main" | "other" | "section";

type AddArticleFormImageOptions = {
  imageType: string | null;
  modalInputValue: string;
  imageWidthValue: string;
  imageHeightValue: string;
  sectionSelected: number;
  setMainArticleImage: (value: any) => void;
  setOtherArticleImages: (value: any) => void;
  setSectionImages: (value: any) => void;
  setModalInputValue: (value: string) => void;
  setImageHeightValue: (value: string) => void;
  setImageWidthValue: (value: string) => void;
  includeOtherImageDimensions?: boolean;
  includeSectionImageId?: boolean;
  emptySectionImageDimensionValue?: null | "";
};

type DeleteArticleFormImageOptions = {
  type: ImageType;
  itemIndex?: number;
  sectionIndex?: number;
  setMainArticleImage: (value: any) => void;
  setOtherArticleImages: (value: any) => void;
  setSectionImages: (value: any) => void;
  setImageType: (value: string | null) => void;
  emptyMainImageValue?: null | "";
};

export const articleValidationSchema = Yup.object().shape({
  article_title: Yup.string()
    .required("Obavezno polje!")
    .max(100, "Naslov smije imati max 100 znakova!"),
  article_subtitle: Yup.string()
    .required("Obavezno polje!")
    .max(100, "Podnaslov smije imati max 100 znakova!"),
  article_description: Yup.string()
    .required("Obavezno polje!")
    .max(100, "Opis smije imati max 100 znakova!"),
  article_type: Yup.number().required("Obavezno polje!").integer(),
  article_airport_city_id: Yup.number().when("article_type", {
    is: (value: string | number) =>
      Number(value) === Number(ARTICLE_TYPE_AIRPLANE_TICKET_ID),
    then: () => Yup.number().required("Obavezno polje!").integer(),
    otherwise: () => Yup.number().notRequired(),
  }),
  article_country: Yup.number().when("article_type", {
    is: (value: string | number) =>
      Number(value) === Number(ARTICLE_TYPE_DESTINATION_ID),
    then: () => Yup.number().required("Obavezno polje!").integer(),
    otherwise: () => Yup.number().notRequired(),
  }),
  metatags: Yup.array().of(
    Yup.object().shape({
      metatag_text: Yup.string().required("Obavezno polje!"),
    })
  ),
  sections: Yup.array().of(
    Yup.object().shape({
      section_subtitle: Yup.string().max(
        100,
        "Podnaslov smije imati max 100 znakova!"
      ),
      section_url_title: Yup.string().max(
        100,
        "Naslov linka smije imati max 100 znakova!"
      ),
    })
  ),
});

export const hasMainArticleImage = (mainArticleImage: string | null) => {
  return mainArticleImage != "" && mainArticleImage;
};

export const navigateToArticles = (router: any) => {
  router.push("/admin/clanci");
};

export const addMetatag = (arrayHelpers: any) => {
  arrayHelpers.push({
    metatag_text: "",
  });
};

export const deleteMetatag = (arrayHelpers: any, tagIndex: number) => {
  arrayHelpers.remove(tagIndex);
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

export const deleteArticleFormImage = ({
  type,
  itemIndex,
  sectionIndex,
  setMainArticleImage,
  setOtherArticleImages,
  setSectionImages,
  setImageType,
  emptyMainImageValue = "",
}: DeleteArticleFormImageOptions) => {
  if (type == "main") {
    setMainArticleImage(emptyMainImageValue);
  } else if (type == "other") {
    setOtherArticleImages((prev: any[]) =>
      prev.filter((_image, index) => index !== itemIndex)
    );
  } else if (type == "section" && sectionIndex !== undefined) {
    setSectionImages((prevSectionImages: any[][]) => [
      ...prevSectionImages.slice(0, sectionIndex),
      (prevSectionImages[sectionIndex] || []).filter(
        (_image, index) => index !== itemIndex
      ),
      ...prevSectionImages.slice(sectionIndex + 1),
    ]);
  }

  setImageType(null);
};

export const addArticleFormImage = ({
  imageType,
  modalInputValue,
  imageWidthValue,
  imageHeightValue,
  sectionSelected,
  setMainArticleImage,
  setOtherArticleImages,
  setSectionImages,
  setModalInputValue,
  setImageHeightValue,
  setImageWidthValue,
  includeOtherImageDimensions = false,
  includeSectionImageId = false,
  emptySectionImageDimensionValue = "",
}: AddArticleFormImageOptions) => {
  if (imageType == "main") {
    setMainArticleImage(modalInputValue);
  } else if (imageType == "other") {
    setOtherArticleImages((prev: any[]) => [
      ...prev,
      {
        url: modalInputValue,
        ...(includeOtherImageDimensions
          ? { width: imageWidthValue, height: imageHeightValue }
          : {}),
      },
    ]);
  } else if (imageType == "section") {
    setSectionImages((prevSectionImages: any[][]) => [
      ...prevSectionImages.slice(0, sectionSelected),
      [
        ...(prevSectionImages[sectionSelected] || []),
        {
          ...(includeSectionImageId ? { id: null } : {}),
          url: modalInputValue,
          width: imageWidthValue || emptySectionImageDimensionValue,
          height: imageHeightValue || emptySectionImageDimensionValue,
        },
      ],
      ...prevSectionImages.slice(sectionSelected + 1),
    ]);
  }

  setModalInputValue("");
  setImageHeightValue("");
  setImageWidthValue("");
};

export const fetchArticleFormOptions = async () => {
  const [articleTypesData, countriesData, sectionIconsData, airportsData] =
    await Promise.all([
      getArticleTypes(),
      getVisitedCountries(),
      getSectionIcons(),
      getAirportCities(),
    ]);

  return {
    articleTypesData,
    countriesData,
    sectionIconsData,
    airportsData,
  };
};

export const fetchArticlePlaces = async (selectedCountryId: string | number) => {
  return getPlacesByCountry(Number(selectedCountryId));
};
