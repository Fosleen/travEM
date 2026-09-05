export const DEFAULT_AIRPORT_BANNER_IMAGE = "/default-og-image.jpg";

export const getAirportBannerImage = (imageUrl?: string | null) =>
  imageUrl?.trim() || DEFAULT_AIRPORT_BANNER_IMAGE;
