import { getArticlesByName } from "@/api/article";
import SearchResults from "@/components/user/pages/searchResults/SearchResults";
import { Metadata } from "next";

type Props = {
  searchParams: Promise<{ naslov?: string; page?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const params = await searchParams;
  const searchQuery = params.naslov || "";

  const title = searchQuery
    ? `Rezultati pretrage: ${searchQuery} - putujEM s travEM`
    : "Pretraga - putujEM s travEM";

  const description = searchQuery
    ? `Rezultati pretrage za "${searchQuery}". Pronađite članke, putopise i savjete o putovanjima.`
    : "Pretražite naše članke, putopise i savjete o putovanjima.";

  return {
    title: title,
    description: description,
    keywords: `${searchQuery}, pretraga, putovanje, putopis, travem`,
    openGraph: {
      title: title,
      description: description,
      type: "website",
      url: `https://putujemstravem.com/pretrazivanje?naslov=${encodeURIComponent(
        searchQuery
      )}`,
      siteName: "putujEM s travEM",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const searchQuery = params.naslov || "";
  const currentPage = parseInt(params.page || "1", 10);

  let initialArticles = null;
  let initialTotalPages = 1;

  if (searchQuery) {
    try {
      const data = await getArticlesByName(searchQuery, currentPage, 8);

      if (data && !data.error) {
        initialArticles = data.data || [];
        initialTotalPages = data.totalPages || 1;
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  }

  return (
    <SearchResults
      initialArticles={initialArticles}
      initialTotalPages={initialTotalPages}
      initialSearchQuery={searchQuery}
      initialPage={currentPage}
    />
  );
}
