// @ts-nocheck
"use client";
import { useSearchParams, useRouter } from "next/navigation";
import Pagination from "@/components/atoms/Pagination";
import HorizontalPostItemBig from "@/components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./SearchResults.scss";
import { useTransition } from "react";
import { Article, Nullable } from "@/common/types";

interface SearchResultsProps {
  initialArticles: Nullable<Array<Article>>;
  initialTotalPages: number;
  initialSearchQuery: string;
  initialPage: number;
}

const SearchResults = ({
  initialArticles,
  initialTotalPages,
  initialSearchQuery,
  initialPage,
}: SearchResultsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Use props directly instead of useState
  const articles = initialArticles;
  const totalPages = initialTotalPages;

  const currentSearchQuery = searchParams.get("naslov") || initialSearchQuery;
  const currentPage = parseInt(
    searchParams.get("page") || String(initialPage),
    10
  );

  const handlePageChange = (newPage: number) => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.push(`/pretrazivanje?${params.toString()}`);
    });
  };

  return (
    <div className="search-results-parent-wrapper">
      <div className="search-results-text-wrapper">
        <h4>Pretraživanja za:&nbsp;</h4>
        <h3>{currentSearchQuery}</h3>
      </div>
      {!currentSearchQuery && (
        <div className="search-results-no-query">
          Unesite pojam za pretraživanje.
        </div>
      )}
      {currentSearchQuery && articles?.length === 0 && (
        <div className="search-results-empty">
          Ne postoji niti jedan članak s tim nazivom.
        </div>
      )}
      {articles && articles.length > 0 && (
        <div
          className="search-results-grid-wrapper"
          style={{ opacity: isPending ? 0.5 : 1 }}
        >
          {articles.map((el, index) => (
            <HorizontalPostItemBig key={el.id || index} data={el} />
          ))}
        </div>
      )}
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default SearchResults;
