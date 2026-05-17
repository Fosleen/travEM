// client/components/user/pages/destinationPlace/DestinationPlace.tsx
// @ts-nocheck
"use client";

import Link from "next/link";
import DestinationHero from "../../molecules/DestinationHero";
import DestinationVideos from "../../molecules/DestinationVideos";
import RecommendedPosts from "../../molecules/RecommendedPosts";
import BestTimeToVisitPlace from "../../molecules/BestTimeToVisitPlace/BestTimeToVisitPlace";
import CountryLanguage from "../../molecules/CountryLanguage/CountryLanguage";
import { getCountryLocative } from "@/utils/countryGrammar";
import "./DestinationPlace.scss";

interface Article {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  main_image_url: string;
  sections?: any[];
  article_sections?: any[];
  articleSections?: any[];
}

interface Country {
  id: number;
  name: string;
}

interface Place {
  id: number;
  name: string;
  name_genitive?: string;
  name_dative?: string;
  name_accusative?: string;
  name_locative?: string;
  description: string;
  main_image_url: string;
  featured_article_id?: number | null;
  featuredArticleId?: number | null;
  featured_article?: Article | null;
  featuredArticle?: Article | null;
  articles: Article[];
  videos: string[];
  country: Country;
}

interface DestinationPlaceProps {
  initialPlace: Place;
  placeName: string;
}

const getPlaceCase = (
  place: Place,
  grammaticalCase: "genitive" | "dative" | "accusative" | "locative"
) => {
  return place?.[`name_${grammaticalCase}`] || place?.name || "";
};

const getArticleImage = (article: any) => {
  return (
    article?.main_image?.url ||
    article?.mainImage?.url ||
    article?.image?.url ||
    article?.thumbnail_image?.url ||
    article?.thumbnailImage?.url ||
    article?.cover_image?.url ||
    article?.coverImage?.url ||
    article?.cover_image_url ||
    article?.main_image_url ||
    article?.mainImageUrl ||
    article?.image_url ||
    article?.imageUrl ||
    ""
  );
};

const getArticleTitle = (article: any) => {
  return article?.title || article?.name || "Članak";
};

const getArticleDescription = (article: any) => {
  return (
    article?.description ||
    article?.short_description ||
    article?.shortDescription ||
    article?.subtitle ||
    article?.excerpt ||
    ""
  );
};

const getArticleHref = (article: any) => {
  return `/clanak/${article?.id}`;
};

const getCountryHref = (country: Country) => {
  return `/destinacija/${country?.name?.toLowerCase()}`;
};

const getArticleSections = (article: any) => {
  const sections =
    article?.sections ||
    article?.article_sections ||
    article?.articleSections ||
    article?.content_sections ||
    article?.contentSections ||
    article?.ArticleSections ||
    article?.Sections ||
    [];

  if (!Array.isArray(sections)) {
    return [];
  }

  return sections
    .map((item: any) => item?.section || item?.Section || item)
    .filter(Boolean);
};

const getSectionIcon = (section: any) => {
  return (
    section?.section_icon?.url?.trim?.() ||
    section?.sectionIcon?.url?.trim?.() ||
    section?.section_icon?.icon_url?.trim?.() ||
    section?.sectionIcon?.iconUrl?.trim?.() ||
    section?.icon?.url?.trim?.() ||
    section?.section_icon_url ||
    section?.sectionIconUrl ||
    section?.icon_url ||
    section?.iconUrl ||
    ""
  );
};

const getSectionSubtitle = (section: any) => {
  return (
    section?.subtitle?.trim?.() ||
    section?.title?.trim?.() ||
    section?.name?.trim?.() ||
    ""
  );
};

const getFeaturedOverviewItems = (featuredArticle: any) => {
  const sections = getArticleSections(featuredArticle);

  if (!sections || sections.length === 0) {
    return [];
  }

  return sections
    .map((section: any, index: number) => ({
      text: getSectionSubtitle(section),
      icon: getSectionIcon(section),
      href: `${getArticleHref(featuredArticle)}#odlomak-${index}`,
    }))
    .filter((item: any) => item.text)
    .slice(0, 5);
};

const getFeaturedArticlePreview = (place: Place, articles: Article[]) => {
  const featuredArticleFromPlace =
    place?.featured_article || place?.featuredArticle || null;

  if (featuredArticleFromPlace) {
    return featuredArticleFromPlace;
  }

  if (!articles || articles.length === 0) {
    return null;
  }

  const featuredArticleId =
    place?.featured_article_id || place?.featuredArticleId || null;

  if (!featuredArticleId) {
    return articles[0];
  }

  return (
    articles.find(
      (article: any) => Number(article?.id) === Number(featuredArticleId)
    ) || articles[0]
  );
};

const DestinationPlace = ({ initialPlace, placeName }: DestinationPlaceProps) => {
  const place = initialPlace;
  const articles = place?.articles || [];

  const featuredArticle = getFeaturedArticlePreview(place, articles);
  const featuredOverviewItems = getFeaturedOverviewItems(featuredArticle);

  const otherArticles = featuredArticle
    ? articles.filter(
        (article: any) => Number(article?.id) !== Number(featuredArticle?.id)
      )
    : articles;

  return (
    <div className="destination-place-page-container">
      <DestinationHero
        name={place.name}
        description={place.description}
        main_image_url={place.main_image_url}
      />

      {place?.country?.name && (
        <div className="destination-place-breadcrumb-wrapper">
          <Link
            href={getCountryHref(place.country)}
            className="destination-place-breadcrumb"
            aria-label={`Povratak na stranicu o ${getCountryLocative(
              place.country.name
            )}`}
          >
            <span className="destination-place-breadcrumb-arrow">←</span>
            <span>
              Povratak na stranicu o {getCountryLocative(place.country.name)}
            </span>
          </Link>
        </div>
      )}

      {articles && articles.length > 0 && (
        <section className="destination-place-content-container">
          <div className="destination-place-section-header">
            <h2>Planirate putovanje u {getPlaceCase(place, "accusative")}?</h2>
          </div>

          {featuredArticle && (
            <section
              className={`destination-place-featured ${
                featuredOverviewItems.length > 0 ? "has-overview" : ""
              }`}
            >
              <Link
                href={getArticleHref(featuredArticle)}
                className="destination-place-featured-card"
              >
                <div className="destination-place-featured-image-wrapper">
                  {getArticleImage(featuredArticle) ? (
                    <img
                      src={getArticleImage(featuredArticle)}
                      alt={getArticleTitle(featuredArticle)}
                    />
                  ) : (
                    <div className="destination-place-image-placeholder" />
                  )}

                  <div className="destination-place-featured-overlay">
                    <span>Istaknuto</span>

                    <h3>{getArticleTitle(featuredArticle)}</h3>

                    {getArticleDescription(featuredArticle) && (
                      <p>{getArticleDescription(featuredArticle)}</p>
                    )}

                    <div className="destination-place-featured-meta">
                      <span>Pročitaj vodič →</span>
                    </div>
                  </div>
                </div>
              </Link>

              {featuredOverviewItems.length > 0 && (
                <aside className="destination-place-overview">
                  <div className="destination-place-overview-header">
                    <div className="destination-place-overview-icon">
                      <span>✈</span>
                    </div>

                    <div>
                      <h3>Brzi pregled</h3>
                      <p>Iz istaknutog članka</p>
                    </div>
                  </div>

                  <ul>
                    {featuredOverviewItems.map((item: any, index: number) => (
                      <li key={`${item.text}-${index}`}>
                        <Link href={item.href}>
                          <span className="destination-place-overview-item-icon">
                            {item.icon ? (
                              <img src={item.icon} alt="" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </span>

                          <span className="destination-place-overview-item-text">
                            {item.text}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={getArticleHref(featuredArticle)}
                    className="destination-place-overview-link"
                  >
                    Pogledaj cijeli vodič
                    <span>→</span>
                  </Link>
                </aside>
              )}
            </section>
          )}

          {otherArticles.length > 0 && (
            <section className="destination-place-articles-section">
              <div className="destination-place-section-header compact">
                <h2>
                  Nastavite istraživati {getPlaceCase(place, "accusative")}
                </h2>
              </div>

              <div
                className={`destination-place-articles-grid count-${otherArticles.length}`}
              >
                {otherArticles.map((article: any, index: number) => (
                  <Link
                    href={getArticleHref(article)}
                    className="destination-place-article-card"
                    key={article.id || index}
                  >
                    <div className="destination-place-article-image-wrapper">
                      {getArticleImage(article) ? (
                        <img
                          src={getArticleImage(article)}
                          alt={getArticleTitle(article)}
                        />
                      ) : (
                        <div className="destination-place-image-placeholder" />
                      )}
                    </div>

                    <div className="destination-place-article-content">
                      <h3>{getArticleTitle(article)}</h3>

                      {getArticleDescription(article) && (
                        <p>{getArticleDescription(article)}</p>
                      )}

                      <div className="destination-place-article-meta">
                        <span>Pročitaj više →</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </section>
      )}

      <BestTimeToVisitPlace
        placeId={place.id}
        placeNameDative={getPlaceCase(place, "dative")}
      />

      {place?.country?.id && (
        <div className="destination-place-language-container">
          <CountryLanguage countryId={place.country.id} />
        </div>
      )}

      {place.videos && place.videos.length > 0 && (
        <div className="destination-place-videos-container">
          <h2>Istražite {getPlaceCase(place, "accusative")} kroz naše videe</h2>

          <div className="destination-place-videos">
            <DestinationVideos data={place.videos} />
          </div>
        </div>
      )}

      <div className="destination-place-recommended-container">
        <RecommendedPosts type={"place-page"} id={place.id} />
      </div>
    </div>
  );
};

export default DestinationPlace;