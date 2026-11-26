export function isHeroImageCrop(value) {
  return value === null || (
    value && typeof value === "object" &&
    ["desktop", "mobile"].every((device) => {
      const crop = value[device];
      return crop && [[crop.x, 0, 100], [crop.y, 0, 100], [crop.zoom, 1, 3]].every(
        ([number, min, max]) => Number.isFinite(number) && number >= min && number <= max
      );
    })
  );
}
