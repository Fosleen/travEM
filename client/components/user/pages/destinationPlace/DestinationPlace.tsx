// client/components/user/templates/DestinationPlace/DestinationPlace.tsx
// @ts-nocheck
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DestinationHero from "../../molecules/DestinationHero";
import DestinationVideos from "../../molecules/DestinationVideos";
import RecommendedPosts from "../../molecules/RecommendedPosts";
import BestTimeToVisitPlace from "../../molecules/BestTimeToVisitPlace/BestTimeToVisitPlace";
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
  description: string;
  main_image_url: string;
  featured_article_id?: number | null;
  articles: Article[];
  videos: string[];
  country: Country;
}

interface DestinationPlaceProps {
  initialPlace: Place;
  placeName: string; // slug iz URL-a
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:25060/api/v1";

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

const getArticleSections = (article: any) => {
  return (
    article?.sections ||
    article?.article_sections ||
    article?.articleSections ||
    article?.content_sections ||
    article?.contentSections ||
    []
  );
};

const getSectionIcon = (section: any) => {
  return (
    section?.section_icon?.url?.trim?.() ||
    section?.sectionIcon?.url?.trim?.() ||
    section?.icon?.url?.trim?.() ||
    section?.section_icon_url ||
    section?.icon_url ||
    ""
  );
};

const getSectionSubtitle = (section: any) => {
  return section?.subtitle || "";
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

const normalizeFetchedArticle = (data: any) => {
  return data?.data || data?.article || data;
};

const fetchFullArticleById = async (articleId: number | string) => {
  try {
    const response = await fetch(`${API_URL}/articles/${articleId}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(
        "Failed to fetch full featured place article:",
        response.status
      );
      return null;
    }

    const data = await response.json();

    return normalizeFetchedArticle(data);
  } catch (error) {
    console.warn("Failed to fetch full featured place article:", error);
    return null;
  }
};

const getFeaturedArticlePreview = (place: Place, articles: Article[]) => {
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

  const [fullFeaturedArticle, setFullFeaturedArticle] = useState<any>(null);

  const featuredArticlePreview = getFeaturedArticlePreview(place, articles);
  const featuredArticle = fullFeaturedArticle || featuredArticlePreview;

  const otherArticles = featuredArticlePreview
    ? articles.filter(
        (article: any) =>
          Number(article?.id) !== Number((featuredArticlePreview as any)?.id)
      )
    : articles;

  const featuredOverviewItems = getFeaturedOverviewItems(featuredArticle);

  useEffect(() => {
    let isMounted = true;

    const loadFullFeaturedArticle = async () => {
      setFullFeaturedArticle(null);

      if (!featuredArticlePreview?.id) {
        return;
      }

      const previewSections = getArticleSections(featuredArticlePreview);

      if (previewSections && previewSections.length > 0) {
        setFullFeaturedArticle(featuredArticlePreview);
        return;
      }

      const fullArticle = await fetchFullArticleById(
        (featuredArticlePreview as any).id
      );

      if (!isMounted) return;

      if (fullArticle) {
        setFullFeaturedArticle(fullArticle);
      }
    };

    loadFullFeaturedArticle();

    return () => {
      isMounted = false;
    };
  }, [featuredArticlePreview?.id]);

  return (
    <div className="destination-place-page-container">
      <DestinationHero
        name={place.name}
        description={place.description}
        main_image_url={place.main_image_url}
      />

      <BestTimeToVisitPlace placeSlug={placeName} />

      {articles && articles.length > 0 && (
        <section className="destination-place-content-container">
          <div className="destination-place-section-header">
            <h2>Krenite od ovoga</h2>
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
                    Pogledaj cijeli članak
                    <span>→</span>
                  </Link>
                </aside>
              )}
            </section>
          )}

          {otherArticles.length > 0 && (
            <section className="destination-place-articles-section">
              <div className="destination-place-section-header compact">
                <h2>Još korisnih vodiča</h2>
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

      {place.videos && place.videos.length > 0 && (
        <div className="destination-place-videos-container">
          <h2>Istražite grad kroz naše videe</h2>

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