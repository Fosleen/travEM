export type HeroCrop = { x: number; y: number; zoom: number };
export type HeroDevice = "desktop" | "mobile";
export type HeroImageCrop = Record<HeroDevice, HeroCrop>;

export const defaultHeroCrop: HeroCrop = { x: 50, y: 50, zoom: 1 };
export const defaultHeroImageCrop: HeroImageCrop = {
  desktop: defaultHeroCrop,
  mobile: defaultHeroCrop,
};
