import "./RecommendedPosts.scss";
import HorizontalPostItemBig from "../../atoms/HorizontalPostItemBig";
import { FC, useEffect, useState } from "react";
import { getRecommendedArticles } from "../../../../utils/article";
import { Article } from "../../../../common/types";
import ReactGA from "react-ga4";

const normalizeArticles = (data: any): Article[] => {
  // 1) već je array
  if (Array.isArray(data)) return data;

  // 2) česti backend wrapperi
  if (Array.isArray(data?.articles)) return data.articles;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;

  // 3) single object -> array od 1
  if (data && typeof data === "object") return [data as Article];

  // 4) fallback
  return [];
};

const RecommendedPosts: FC<{ id: number; type: string }> = ({ id, type }) => {
  const [articles, setArticles] = useState<Article[] | null>(null);

  useEffect(() => {
    let alive = true;

    const fetchData = async () => {
      try {
        const data = await getRecommendedArticles(id, type);
        const normalized = normalizeArticles(data);

        if (alive) setArticles(normalized);
      } catch (error) {
        console.error("error while fetching:", error);
        if (alive) setArticles([]); // da ne ostane vječni loading
      }
    };

    fetchData();

    return () => {
      alive = false;
    };
  }, [id, type]);

  const handleClick = (index: number) => {
    ReactGA.event({
      category: "Navigation",
      action: "Clicked recommended article",
      label: `Selected recommended article with index ${index}`,
      nonInteraction: false,
    });
  };

  return (
    <div className="recommended-posts-container">
      <h2>Povezani članci</h2>

      {articles === null ? (
        <p>Loading...</p>
      ) : articles.length === 0 ? (
        <p>Trenutno nema povezanih članaka.</p>
      ) : (
        <div className="recommended-posts last">
          {articles.map((el, index) => (
            <div onClick={() => handleClick(index)} key={el?.id ?? index}>
              <HorizontalPostItemBig thin hasDate={false} data={el} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendedPosts;
