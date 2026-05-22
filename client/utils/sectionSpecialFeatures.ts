export const SECTION_ICON_FEATURE_KEYS = {
  ENTRY_REQUIREMENTS: "entry_requirements",
  BEST_TIME_TO_VISIT: "best_time_to_visit",
} as const;

export type SectionIconFeatureKey =
  (typeof SECTION_ICON_FEATURE_KEYS)[keyof typeof SECTION_ICON_FEATURE_KEYS];

export const getSectionIconFeatureKey = (icon?: any): string | null => {
  return icon?.feature_key || icon?.featureKey || null;
};

export const hasSectionIconFeature = (
  icon: any,
  featureKey: SectionIconFeatureKey
): boolean => {
  return getSectionIconFeatureKey(icon) === featureKey;
};

export const hasAnySectionIconFeature = (icon?: any): boolean => {
  return Boolean(getSectionIconFeatureKey(icon));
};

export const isEntryRequirementsSectionIcon = (icon?: any): boolean => {
  return hasSectionIconFeature(
    icon,
    SECTION_ICON_FEATURE_KEYS.ENTRY_REQUIREMENTS
  );
};

export const isBestTimeToVisitSectionIcon = (icon?: any): boolean => {
  return hasSectionIconFeature(
    icon,
    SECTION_ICON_FEATURE_KEYS.BEST_TIME_TO_VISIT
  );
};