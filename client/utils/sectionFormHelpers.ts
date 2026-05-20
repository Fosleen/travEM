export const insertSectionImageSlotAfter = <T>(
  sectionImages: T[][],
  index: number
) => {
  const sectionImagesCopy = [...sectionImages];
  sectionImagesCopy.splice(index + 1, 0, []);

  return sectionImagesCopy;
};

export const moveSectionImageSlot = <T>(
  sectionImages: T[][],
  from: number,
  to: number
) => {
  if (to < 0 || to >= sectionImages.length) {
    return sectionImages;
  }

  const sectionImagesCopy = [...sectionImages];
  const [movedSectionImages] = sectionImagesCopy.splice(from, 1);
  sectionImagesCopy.splice(to, 0, movedSectionImages);

  return sectionImagesCopy;
};