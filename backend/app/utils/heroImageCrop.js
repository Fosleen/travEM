export function isHeroImageCrop(value) {
  return value === null || (
    value && typeof value === "object" &&
    (value.topShade === undefined ||
      (Number.isInteger(value.topShade) && value.topShade >= 0 && value.topShade <= 100)) &&
    ["desktop", "mobile"].every((device) => {
      const crop = value[device];
      return crop && [[crop.x, 0, 100], [crop.y, 0, 100], [crop.zoom, 1, 3]].every(
        ([number, min, max]) => Number.isFinite(number) && number >= min && number <= max
      );
    })
  );
}
