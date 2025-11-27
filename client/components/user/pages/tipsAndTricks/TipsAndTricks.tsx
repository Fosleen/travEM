"use client";

import { useRouter, useSearchParams } from "next/navigation";
import HorizontalPostItemBig from "@/components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./TipsAndTricks.scss";
import { useState, useTransition } from "react";
import { convertFromSlug } from "@/utils/global";
import { Article, ArticleType, Nullable } from "@/common/types";
import Pagination from "@/components/atoms/Pagination";

interface TipsAndTricksProps {
  initialArticleTypes: Array<ArticleType>;
  initialSelectedType: ArticleType;
  initialArticles: Nullable<Array<Article>>;
  initialTotalPages: number;
  initialRecommendedArticles: Nullable<Array<Article>>;
  initialPage: number;
  tip: string;
}

const TipsAndTricks = ({
  initialArticleTypes,
  initialSelectedType,
  initialArticles,
  initialTotalPages,
  initialRecommendedArticles,
  initialPage,
  tip,
}: TipsAndTricksProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [selectedArticleType] = useState<ArticleType>(initialSelectedType);
  const [articles] = useState<Nullable<Array<Article>>>(initialArticles);
  const [totalPages] = useState(initialTotalPages);
  const [recommendedArticles] = useState<Nullable<Array<Article>>>(
    initialRecommendedArticles
  );

  const currentPage = parseInt(
    searchParams.get("page") || String(initialPage),
    10
  );

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.push(`/savjeti/${tip}?${params.toString()}`);
    });
  };

  return (
    <div className="tips-and-tricks-parent-wrapper">
      {tip && selectedArticleType && (
        <div className="tips-and-tricks-text-wrapper">
          <h2>{convertFromSlug(selectedArticleType.name)}</h2>
          <h4>{selectedArticleType.description}</h4>
        </div>
      )}

      {articles && articles.length > 0 ? (
        <div
          className="tips-and-tricks-grid-wrapper"
          style={{ opacity: isPending ? 0.5 : 1 }}
        >
          {articles.map((el, index) => (
            <HorizontalPostItemBig data={el} key={el.id || index} />
          ))}
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
