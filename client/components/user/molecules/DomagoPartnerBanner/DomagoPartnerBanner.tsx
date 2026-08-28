import { useId, type CSSProperties } from "react";
import "./DomagoPartnerBanner.scss";

export interface DomagoPartnerBannerConfig {
  partnerLogoUrl: string; partnerLogoAlt?: string; siteLogoUrl: string; siteLogoAlt?: string;
  heroImageUrl: string; heroImageAlt?: string; headlineLine1: string; headlineLine2Prefix: string;
  headlineAccent: string; description: string; ctaLabel: string; ctaUrl: string;
  openCtaInNewTab?: boolean; note?: string; accentColor?: string; showStamp?: boolean;
  stampTopText?: string; stampMainText?: string; stampBottomText?: string;
  partnerLogoScale?: number;
}

const FlightPath = () => <svg className="domago-partner-banner__flight-path" viewBox="0 0 220 240" aria-hidden="true"><path d="M176 8c-48 20-66 49-58 83 8 35 41 52 31 87-6 23-32 39-70 53" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="7 9"/><path d="m160 13 25-10-7 13 10 7-3 2-12-4-6 7-3-1 3-9-10-2 3-3Z" fill="currentColor"/></svg>;

const Stamp = ({ top, main, bottom }: { top: string; main: string; bottom: string }) => {
  const id = useId().replace(/:/g, "");
  const topPath = `${id}-stamp-top`;
  const bottomPath = `${id}-stamp-bottom`;
  return <div className="domago-partner-banner__stamp" aria-hidden="true">
    <svg viewBox="0 0 110 110">
      <defs>
        <path id={topPath} d="M 15,55 A 40,40 0 0,1 95,55" />
        <path id={bottomPath} d="M 15,61 A 40,40 0 0,0 95,61" />
      </defs>
      <text className="domago-partner-banner__stamp-curved"><textPath href={`#${topPath}`} startOffset="50%" textAnchor="middle">{top}</textPath></text>
      <text className="domago-partner-banner__stamp-curved"><textPath href={`#${bottomPath}`} startOffset="50%" textAnchor="middle">★ {bottom} ★</textPath></text>
    </svg>
    <strong>{main}</strong>
  </div>;
};

export default function DomagoPartnerBanner({ config }: { config: DomagoPartnerBannerConfig }) {
  const bothLogos = Boolean(config.partnerLogoUrl && config.siteLogoUrl);
  const partnerLogoScale = Math.min(3, Math.max(0.5, Number(config.partnerLogoScale) || 2));
  const style = { "--domago-accent": config.accentColor || "#ff9418", "--partner-logo-scale": partnerLogoScale } as CSSProperties;
  return <aside className="domago-partner-banner" style={style} aria-label={`${config.partnerLogoAlt || "Partner"} partner banner`}>
    <div className="domago-partner-banner__content">
      {(config.partnerLogoUrl || config.siteLogoUrl) && <div className="domago-partner-banner__brands">
        {config.partnerLogoUrl && <img className="domago-partner-banner__logo--partner" src={config.partnerLogoUrl} alt={config.partnerLogoAlt || "Partner"} loading="lazy"/>}
        {bothLogos && <span aria-hidden="true">×</span>}
        {config.siteLogoUrl && <img className="domago-partner-banner__logo--site" src={config.siteLogoUrl} alt={config.siteLogoAlt || "putujEM s travEM"} loading="lazy"/>}
      </div>}
      {(config.headlineLine1 || config.headlineLine2Prefix || config.headlineAccent) && <h2><span>{config.headlineLine1}</span><span>{config.headlineLine2Prefix}{config.headlineLine2Prefix && config.headlineAccent ? " " : ""}<strong>{config.headlineAccent}</strong></span></h2>}
      {config.description && <p className="domago-partner-banner__description">{config.description}</p>}
      <div className="domago-partner-banner__actions">
        {config.ctaUrl && config.ctaLabel && <a href={config.ctaUrl} target={config.openCtaInNewTab ? "_blank" : undefined} rel={config.openCtaInNewTab ? "noopener noreferrer sponsored" : "sponsored"}><span aria-hidden="true">➤</span>{config.ctaLabel}</a>}
        {config.note && <p>{config.note}</p>}
      </div>
    </div>
    {config.heroImageUrl && <div className="domago-partner-banner__visual"><FlightPath/><div className="domago-partner-banner__photo"><img src={config.heroImageUrl} alt={config.heroImageAlt || ""} loading="lazy"/></div>{config.showStamp !== false && <Stamp top={config.stampTopText ?? ""} main={config.stampMainText ?? ""} bottom={config.stampBottomText ?? ""} />}</div>}
  </aside>;
}
