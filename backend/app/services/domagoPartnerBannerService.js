import db from "../models/index.js";

const DEFAULTS = {
  id: 1, partnerLogoUrl: "", partnerLogoAlt: "Partner", partnerLogoScale: 2, siteLogoUrl: "", siteLogoAlt: "putujEM s travEM",
  heroImageUrl: "", heroImageAlt: "", headlineLine1: "", headlineLine2Prefix: "",
  headlineAccent: "", description: "", ctaLabel: "", ctaUrl: "", openCtaInNewTab: true,
  note: "", accentColor: "#ff9418", showStamp: true,
  stampTopText: "", stampMainText: "", stampBottomText: "",
};

class DomagoPartnerBannerService {
  async get() {
    return (await db.models.DomagoPartnerBanner.findByPk(1)) || DEFAULTS;
  }

  async patch(values) {
    const allowed = Object.keys(db.models.DomagoPartnerBanner.rawAttributes).filter((key) => key !== "id");
    const updates = Object.fromEntries(allowed.filter((key) => values[key] !== undefined).map((key) => [key, values[key]]));
    const [config] = await db.models.DomagoPartnerBanner.findOrCreate({ where: { id: 1 }, defaults: { ...DEFAULTS, ...updates } });
    return config.update(updates);
  }
}

export default new DomagoPartnerBannerService();
