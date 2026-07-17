import { Dispatch, SetStateAction } from "react";

type OpenLightboxParams = {
  index: number;
  setLightboxIndex: Dispatch<SetStateAction<number>>;
  setLightboxOpen: Dispatch<SetStateAction<boolean>>;
};

export const openLightbox = ({
  index,
  setLightboxIndex,
  setLightboxOpen,
}: OpenLightboxParams) => {
  setLightboxIndex(index);
  setLightboxOpen(true);
};
