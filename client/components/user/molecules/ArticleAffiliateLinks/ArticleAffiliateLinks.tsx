import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import "./ArticleAffiliateLinks.scss";

const ArticleAffiliateLinks = ({ links = [] }: { links?: any[] }) => {
  const enabledLinks = links.filter(
    (link) =>
      link.is_enabled && (link.url || link.partner?.default_url) && link.partner
  );
  if (!enabledLinks.length) return null;

  return (
    <aside className="article-affiliate-links" aria-label="Korisne poveznice za planiranje putovanja">
      <div className="article-affiliate-links__intro">
        <span>Jesi li znao...</span>
        <p>Da kupnjom preko naših linkova podržavaš naš rad i pomažeš nam da i dalje stvaramo besplatne i kvalitetne vodiče, bez dodatnog troška za tebe.</p>
      </div>
      <div className="article-affiliate-links__grid">
        {enabledLinks.map((link) => (
          <a
            key={link.id || link.affiliatePartnerId}
            href={link.url || link.partner.default_url}
            target="_blank"
            rel="sponsored noopener noreferrer"
            aria-label={`${link.partner.name}: ${link.partner.label} (otvara se u novoj kartici)`}
          >
            <img src={link.icon_url || link.partner.icon_url} alt="" />
            <div className="article-affiliate-links__copy">
              <h3>{link.partner.name}</h3>
              <p>{link.partner.label}</p>
            </div>
            <ArrowUpRight
              className="article-affiliate-links__arrow"
              size={20}
              weight="bold"
              aria-hidden="true"
            />
          </a>
        ))}
      </div>
    </aside>
  );
};

export default ArticleAffiliateLinks;
