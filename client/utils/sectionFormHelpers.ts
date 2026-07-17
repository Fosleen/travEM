type SectionIcon = {
  id: number | string;
  url?: string | null;
  icon_url?: string | null;
  image_url?: string | null;
  src?: string | null;
};

type EmptyArticleSectionOptions = {
  includeId?: boolean;
  includeSectionId?: boolean;
  includeOrder?: boolean;
};

export const createEmptyArticleSection = (
  options: EmptyArticleSectionOptions = {}
) => ({
  ...(options.includeId ? { id: null } : {}),
  ...(options.includeSectionId ? { section_id: null } : {}),
  section_subtitle: "",
  section_text: "",
  section_url_title: "",
  section_url_link: "",
  section_icon: null,
  show_visa_info: false,
  show_best_time_to_visit: false,
  show_country_language: false,
  ...(options.includeOrder ? { order: 1 } : {}),
});

export const getSectionIconUrl = (icon?: SectionIcon | null) => {
  return icon?.url || icon?.icon_url || icon?.image_url || icon?.src || "";
};

export const getSelectedSectionIcon = (
  sectionIcons: Array<SectionIcon> | string,
  iconId: number | string | null
) => {
  if (!iconId || !sectionIcons || typeof sectionIcons === "string") {
    return null;
  }

  return (
    sectionIcons.find((icon) => Number(icon.id) === Number(iconId)) || null
  );
};

export const insertSectionImageSlotAfter = <T>(
  sectionImages: T[][],
  index: number
) => {
  const sectionImagesCopy = [...sectionImages];
  sectionImagesCopy.splice(index + 1, 0, []);

  return sectionImagesCopy;
};

export const insertArticleSectionAfter = (
  arrayHelpers: any,
  setSectionImages: any,
  index: number,
  section: Record<string, unknown>
) => {
  arrayHelpers.insert(index + 1, { ...section });
  setSectionImages((prev: any[]) => insertSectionImageSlotAfter(prev, index));
};

export const addArticleSection = (
  arrayHelpers: any,
  setSectionImages: any,
  section: Record<string, unknown>
) => {
  arrayHelpers.push(section);
  setSectionImages((prev: any[]) => [...prev, []]);
};

export const deleteArticleSection = (
  arrayHelpers: any,
  setSectionImages: any,
  sectionIndex: number
) => {
  arrayHelpers.remove(sectionIndex);
  setSectionImages((prev: any[]) =>
    prev.filter((_sectionImages, index) => index !== sectionIndex)
  );
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

export const moveArticleSection = (
  arrayHelpers: any,
  setSectionImages: any,
  from: number,
  to: number
) => {
  if (to < 0) return;

  arrayHelpers.move(from, to);
  setSectionImages((prev: any[]) => moveSectionImageSlot(prev, from, to));
};
