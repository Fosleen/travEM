"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import HorizontalPostItemBig from "@/components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./TipsAndTricks.scss";
import { useEffect, useState, useTransition } from "react";
import { convertFromSlug } from "@/utils/global";
import { Article, ArticleType, Nullable } from "@/common/types";
import Pagination from "@/components/atoms/Pagination";
import { parseBooleanValue } from "@/utils/parseBooleanValue";

interface TipsAndTricksProps {
  initialArticleTypes: Array<ArticleType>;
  initialSelectedType: ArticleType;
  initialArticles: Nullable<Array<Article>>;
  initialFeaturedArticle?: any;
  initialTotalPages: number;
  initialRecommendedArticles: Nullable<Array<Article>>;
  initialPage: number;
  tip: string;
}

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:25060/api/v1";

const TIPS_SCROLL_STORAGE_KEY = "tips-and-tricks-scroll-y";

const tipsMenuItems = [
  {
    title: "Pakiranje",
    displayTitle: "Pakiranje",
    slugTitle: "pakiranje",
    icon: "/images/luggage-icon.png",
  },
  {
    title: "Let avionom",
    displayTitle: "Let avionom",
    slugTitle: "let-avionom",
    icon: "/images/airport-icon.png",
  },
  {
    title: "Organizacija puta",
    displayTitle: "Novosti i organizacija puta",
    slugTitle: "organizacija-puta",
    icon: "/images/travel-org-icon.png",
  },
  {
    title: "Aplikacije",
    displayTitle: "Aplikacije",
    slugTitle: "aplikacije",
    icon: "/images/travel-app-icon.png",
  },
  {
    title: "Smještaj",
    displayTitle: "Smještaj",
    slugTitle: "smjestaj",
    icon: "/images/bed-icon.png",
  },
  {
    title: "Revolut",
    displayTitle: "Revolut",
    slugTitle: "revolut",
    icon: "/images/cards-icon.png",
  },
];

const tipVisualMap: Record<
  string,
  {
    icon: string;
    heroImage: string;
    modifier: string;
    eyebrow: string;
    intro: string;
    displayTitle?: string;
  }
> = {
  pakiranje: {
    icon: "/images/luggage-icon.png",
    heroImage: "/images/TipsAndTricks/Pakiranje.png",
    modifier: "packing",
    eyebrow: "Pametno spremanje",
    intro:
      "Pametno pakiranje štedi vrijeme, novac i živce. Pronađite praktične savjete, checkliste i trikove koji će vam olakšati svako putovanje.",
  },
  "let-avionom": {
    icon: "/images/airport-icon.png",
    heroImage: "/images/TipsAndTricks/Let avionom.png",
    modifier: "flight",
    eyebrow: "Bez stresa u zraku",
    intro:
      "Sve što trebate znati prije leta, od pripreme za zračnu luku do sigurnosne kontrole i prvog ulaska u avion.",
  },
  "organizacija-puta": {
    icon: "/images/travel-org-icon.png",
    heroImage: "/images/TipsAndTricks/Organizacija_puta.png",
    modifier: "organization",
    eyebrow: "Planiranje putovanja",
    displayTitle: "Novosti i organizacija puta",
    intro:
      "Savjeti, novosti, alati i ideje koje vam mogu pomoći da putovanje isplanirate jednostavnije, pametnije i povoljnije.",
  },
  aplikacije: {
    icon: "/images/travel-app-icon.png",
    heroImage: "/images/TipsAndTricks/Aplikacije.png",
    modifier: "apps",
    eyebrow: "Digitalni alati",
    intro:
      "Korisne aplikacije i digitalni alati koji olakšavaju snalaženje, planiranje, plaćanje i komunikaciju na putovanju.",
  },
  smjestaj: {
    icon: "/images/bed-icon.png",
    heroImage: "/images/TipsAndTricks/Smjestaj.png",
    modifier: "stay",
    eyebrow: "Pametniji booking",
    displayTitle: "Smještaj",
    intro:
      "Savjeti za pronalazak smještaja, rezervacije i stvari na koje treba paziti prije nego što potvrdite booking.",
  },
  revolut: {
    icon: "/images/cards-icon.png",
    heroImage: "/images/TipsAndTricks/Revolut.png",
    modifier: "revolut",
    eyebrow: "Novac na putu",
    intro:
      "Savjeti za plaćanje na putovanju, korištenje kartica, podizanje gotovine i izbjegavanje nepotrebnih troškova.",
  },
};

const isTipsFeaturedArticle = (article: any) => {
  return parseBooleanValue(
    article?.is_tips_featured || article?.isTipsFeatured
  );
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

const getArticleDateInfo = (article: any) => {
  const updatedDate =
    article?.date_updated ||
    article?.dateUpdated ||
    article?.updated_at ||
    article?.updatedAt ||
    "";

  if (updatedDate) {
    return {
      value: updatedDate,
    };
  }

  const writtenDate =
    article?.date_written ||
    article?.dateWritten ||
    article?.date ||
    article?.published_date ||
    article?.publishedDate ||
    article?.publish_date ||
    article?.publishDate ||
    article?.created_at ||
    article?.createdAt ||
    article?.published_at ||
    article?.publishedAt ||
    "";

  if (writtenDate) {
    return {
      value: writtenDate,
    };
  }

  return {
    value: "",
  };
};

const getArticleDate = (article: any) => {
  return getArticleDateInfo(article).value;
};

const formatArticleDate = (dateValue: string) => {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return dateValue;
  }

  return date.toLocaleDateString("hr-HR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};

const getArticleHref = (article: any) => {
  return `/clanak/${article?.id}`;
};

const getReadableTipTitle = (selectedArticleType: ArticleType) => {
  if (selectedArticleType.name === "smjestaj") {
    return "Smještaj";
  }

  return convertFromSlug(selectedArticleType.name);
};

const getArticleSections = (article: any) => {
  const sections =
    article?.sections ||
    article?.article_sections ||
    article?.articleSections ||
    article?.content_sections ||
    article?.contentSections ||
    [];

  return Array.isArray(sections) ? sections : [];
};

const getSectionIcon = (section: any) => {
  return (
    section?.section_icon?.url?.trim?.() ||
    section?.sectionIcon?.url?.trim?.() ||
    section?.icon?.url?.trim?.() ||
    section?.section_icon_url ||
    section?.sectionIconUrl ||
    section?.icon_url ||
    section?.iconUrl ||
    ""
  );
};

const getSectionSubtitle = (section: any) => {
  return section?.subtitle?.trim?.() || "";
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

const getNewestArticle = (articles: Array<Article>) => {
  return [...articles].sort((a: any, b: any) => {
    const dateA = new Date(getArticleDate(a)).getTime();
    const dateB = new Date(getArticleDate(b)).getTime();

    if (Number.isNaN(dateA) && Number.isNaN(dateB)) return 0;
    if (Number.isNaN(dateA)) return 1;
    if (Number.isNaN(dateB)) return -1;

    return dateB - dateA;
  })[0];
};

const getFeaturedArticle = (articles: Array<Article>) => {
  if (!articles || articles.length === 0) return null;

  const featuredArticle = articles.find((article: any) =>
    isTipsFeaturedArticle(article)
  );

  if (featuredArticle) {
    return featuredArticle;
  }

  return getNewestArticle(articles);
};

const normalizeFetchedArticle = (data: any) => {
  return data?.data || data?.article || data;
};

const fetchFullArticleById = async (articleId: number | string) => {
  try {
    const response = await fetch(`${API_URL}/articles/${articleId}?noCache=true`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn("Failed to fetch full featured article:", response.status);
      return null;
    }

    const data = await response.json();

    return normalizeFetchedArticle(data);
  } catch (error) {
    console.warn("Failed to fetch full featured article:", error);
    return null;
  }
};

const TipsAndTricks = ({
  initialArticleTypes,
  initialSelectedType,
  initialArticles,
  initialFeaturedArticle,
  initialTotalPages,
  initialRecommendedArticles,
  initialPage,
  tip,
}: TipsAndTricksProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [fullFeaturedArticle, setFullFeaturedArticle] = useState<any>(null);

  const selectedArticleType = initialSelectedType;
  const articles = initialArticles || [];
  const totalPages = initialTotalPages;
  const recommendedArticles = initialRecommendedArticles || [];

  const currentPage = parseInt(
    searchParams.get("page") || String(initialPage),
    10
  );

  const currentTipVisual = tipVisualMap[tip] || tipVisualMap.pakiranje;
  const featuredArticlePreview =
    initialFeaturedArticle || getFeaturedArticle(articles);

  const featuredArticle =
    fullFeaturedArticle && getArticleSections(fullFeaturedArticle).length > 0
      ? fullFeaturedArticle
      : featuredArticlePreview;

  const featuredDateInfo = getArticleDateInfo(featuredArticle);
  const featuredOverviewItems = getFeaturedOverviewItems(featuredArticle);

  const otherArticles = featuredArticlePreview
    ? articles.filter(
        (article: any) =>
          Number(article?.id) !== Number((featuredArticlePreview as any)?.id)
      )
    : articles;

  const selectedTitle = selectedArticleType
    ? getReadableTipTitle(selectedArticleType)
    : "";

  const displayedSelectedTitle = currentTipVisual.displayTitle || selectedTitle;

  const introText =
    currentTipVisual.intro || selectedArticleType?.description || "";

  useEffect(() => {
    let isMounted = true;

    const loadFullFeaturedArticle = async () => {
      setFullFeaturedArticle(null);

      if (!featuredArticlePreview?.id) {
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
  }, [tip, featuredArticlePreview?.id]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const savedScrollY = sessionStorage.getItem(TIPS_SCROLL_STORAGE_KEY);

    if (!savedScrollY) return;

    const scrollY = Number(savedScrollY);

    if (Number.isNaN(scrollY)) {
      sessionStorage.removeItem(TIPS_SCROLL_STORAGE_KEY);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        window.scrollTo({
          top: scrollY,
          left: 0,
          behavior: "auto",
        });

        sessionStorage.removeItem(TIPS_SCROLL_STORAGE_KEY);
      });
    });
  }, [tip]);

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.push(`/savjeti/${tip}?${params.toString()}`, { scroll: false });
    });
  };

  const handleTipChange = (slugTitle: string) => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(TIPS_SCROLL_STORAGE_KEY, String(window.scrollY));
    }

    startTransition(() => {
      router.push(`/savjeti/${slugTitle}`, { scroll: false });
    });
  };

  return (
    <div className="tips-and-tricks-parent-wrapper">
      {tip && selectedArticleType && (
        <section
          className={`tips-and-tricks-hero tips-and-tricks-hero-${currentTipVisual.modifier}`}
        >
          <div className="tips-and-tricks-hero-card">
            <img
              className="tips-and-tricks-hero-image"
              src={currentTipVisual.heroImage}
              alt=""
            />

            <div className="tips-and-tricks-hero-overlay" />

            <div className="tips-and-tricks-hero-content">
              <div className="tips-and-tricks-hero-text">
                <span className="tips-and-tricks-hero-eyebrow">
                  {currentTipVisual.eyebrow}
                </span>
                <h1>{displayedSelectedTitle}</h1>
                <h2>{selectedArticleType.description}</h2>
                {introText && <p>{introText}</p>}
              </div>

              <div className="tips-and-tricks-hero-line" aria-hidden="true">
                <span>✈</span>
              </div>
            </div>
          </div>
        </section>
      )}

      <nav className="tips-and-tricks-chips" aria-label="Rubrike savjeta">
        {tipsMenuItems.map((item) => {
          const isActive = item.slugTitle === tip;

          return (
            <button
              key={item.slugTitle}
              type="button"
              className={`tips-and-tricks-chip ${isActive ? "active" : ""}`}
              onClick={() => handleTipChange(item.slugTitle)}
              disabled={isPending || isActive}
            >
              <span className="tips-and-tricks-chip-icon">
                <img src={item.icon} alt="" />
              </span>
              <span>{item.displayTitle || item.title}</span>
            </button>
          );
        })}
      </nav>

      {articles && articles.length > 0 ? (
        <div
          className="tips-and-tricks-content"
          style={{ opacity: isPending ? 0.5 : 1 }}
        >
          {featuredArticle && (
            <section
              className={`tips-and-tricks-featured ${
                featuredOverviewItems.length > 0 ? "has-overview" : ""
              }`}
            >
              <Link
                href={getArticleHref(featuredArticle)}
                className="tips-and-tricks-featured-card"
              >
                <div className="tips-and-tricks-featured-image-wrapper">
                  {getArticleImage(featuredArticle) ? (
                    <img
                      src={getArticleImage(featuredArticle)}
                      alt={getArticleTitle(featuredArticle)}
                    />
                  ) : (
                    <div className="tips-and-tricks-image-placeholder" />
                  )}

                  <span className="tips-and-tricks-featured-label">
                    Istaknuto
                  </span>
                </div>

                <div className="tips-and-tricks-featured-body">
                  <h3>{getArticleTitle(featuredArticle)}</h3>

                  {getArticleDescription(featuredArticle) && (
                    <p>{getArticleDescription(featuredArticle)}</p>
                  )}

                  {featuredDateInfo.value && (
                    <div className="tips-and-tricks-featured-meta">
                      <span>{formatArticleDate(featuredDateInfo.value)}</span>
                    </div>
                  )}
                </div>
              </Link>

              {featuredOverviewItems.length > 0 && (
                <aside className="tips-and-tricks-overview">
                  <div className="tips-and-tricks-overview-header">
                    <div className="tips-and-tricks-overview-icon">
                      <img src={currentTipVisual.icon} alt="" />
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
                          <span className="tips-and-tricks-overview-item-icon">
                            {item.icon ? (
                              <img src={item.icon} alt="" />
                            ) : (
                              <span>{index + 1}</span>
                            )}
                          </span>
                          <span className="tips-and-tricks-overview-item-text">
                            {item.text}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={getArticleHref(featuredArticle)}
                    className="tips-and-tricks-overview-link"
                  >
                    Pogledaj cijeli vodič
                    <span>→</span>
                  </Link>
                </aside>
              )}
            </section>
          )}

          {otherArticles.length > 0 && (
            <section className="tips-and-tricks-section">
              <div className="tips-and-tricks-section-header">
                <h2>Još savjeta iz rubrike {displayedSelectedTitle}</h2>
              </div>

              <div
                className={`tips-and-tricks-articles-grid count-${otherArticles.length}`}
              >
                {otherArticles.map((article: any, index) => {
                  const articleDateInfo = getArticleDateInfo(article);

                  return (
                    <Link
                      href={getArticleHref(article)}
                      className="tips-and-tricks-article-card"
                      key={article.id || index}
                    >
                      <div className="tips-and-tricks-article-image-wrapper">
                        {getArticleImage(article) ? (
                          <img
                            src={getArticleImage(article)}
                            alt={getArticleTitle(article)}
                          />
                        ) : (
                          <div className="tips-and-tricks-image-placeholder" />
                        )}
                      </div>

                      <div className="tips-and-tricks-article-content">
                        <h3>{getArticleTitle(article)}</h3>

                        {getArticleDescription(article) && (
                          <p>{getArticleDescription(article)}</p>
                        )}

                        <div className="tips-and-tricks-article-meta">
                          {articleDateInfo.value && (
                            <span>
                              {formatArticleDate(articleDateInfo.value)}
                            </span>
                          )}
                          <span>Pročitaj više →</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="tips-and-tricks-empty">
          Nema dostupnih članaka za ovu kategoriju.
        </div>
      )}

      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          scrollToTop={false}
        />
      )}

      {recommendedArticles && recommendedArticles.length > 0 && (
        <>
          <div className="tips-and-tricks-text-articles-wrapper">
            <h2>Povezani članci</h2>
          </div>
          <div className="tips-and-tricks-connected-articles-wrapper">
            {recommendedArticles.map((el, index) => (
              <HorizontalPostItemBig key={el.id || index} data={el} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TipsAndTricks;
