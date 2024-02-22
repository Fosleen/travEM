import { useParams } from "react-router-dom";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./TipsAndTricks.scss";
import { useEffect, useState } from "react";
import { convertFromSlug } from "../../../utils/global";
import { getArticleTypes } from "../../../api/articleTypes";
import { Article, ArticleType, Nullable } from "../../../common/types";
import { getArticles, getRecommendedArticles } from "../../../api/article";
import Pagination from "../../../components/atoms/Pagination/Pagination";
import { ThreeDots } from "react-loader-spinner";

const TipsAndTricks = () => {
  const { tip } = useParams();
  const [articleTypes, setArticleTypes] =
    useState<Nullable<Array<ArticleType>>>(null);
  const [selectedArticleType, setSelectedArticleType] =
    useState<Nullable<ArticleType>>(null);
  const [articles, setArticles] = useState<Nullable<Array<Article>>>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [recommendedArticles, setRecommendedArticles] = useState([]);
  const [newestArticleId, setNewestArticleId] =
    useState<Nullable<number>>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await getArticleTypes();
      setArticleTypes(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  useEffect(() => {
    setArticles(null);
    findSelectedArticleType();
    setPage(1);
  }, [articleTypes, tip]);

  const findSelectedArticleType = () => {
    if (articleTypes) {
      const el = articleTypes.find((el) => el.name === tip);
      setSelectedArticleType(el);
    }
  };

  useEffect(() => {
    if (selectedArticleType) {
      setArticles(null);
      findArticlesOfSelectedType();
    }
  }, [selectedArticleType]);

  const findRecommendedArticles = async () => {
    if (newestArticleId) {
      const recommended = await getRecommendedArticles(
        // returns random articles for this type of tips and tricks (based on the articleTypeId of newestArticleId) or random posts it there are not enough articles of this type
        newestArticleId,
        "article"
      );
      setRecommendedArticles(recommended);
    }
  };

  useEffect(() => {
    if (newestArticleId) {
      findRecommendedArticles();
    }
  }, [newestArticleId]);

  useEffect(() => {
    setArticles(null);
    findArticlesOfSelectedType();
  }, [page]);

  const findArticlesOfSelectedType = async () => {
    if (
      articleTypes &&
      selectedArticleType &&
      selectedArticleType.id !== undefined
    ) {
      const _articles = await getArticles(page, 8, selectedArticleType.id);
      if (!articles) {
        // if there are no fetched articles - set first article fetched in _article as the main one to fetch recommended articles
        setNewestArticleId(_articles.data[0].id);
      }
      setArticles(_articles.data);
      setTotalPages(_articles.totalPages);
      setLoading(false);
    }
  };

  return (
    <div className="tips-and-tricks-parent-wrapper">
      {tip && selectedArticleType && (
        <div className="tips-and-tricks-text-wrapper">
          <h2>{convertFromSlug(selectedArticleType.name)}</h2>
          <h4>{selectedArticleType.description}</h4>
        </div>
      )}
      {!loading && articles ? (
        <>
          <div className="tips-and-tricks-grid-wrapper">
            {articles.map((el, index) => (
              <HorizontalPostItemBig data={el} key={index} />
            ))}
          </div>
        </>
      ) : (
        <ThreeDots
          height="80"
          width="80"
          radius="8"
          color="#2BAC82"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ justifyContent: "center" }}
          visible={true}
        />
      )}
      {totalPages > 1 && (
        <Pagination totalPages={totalPages} setPage={setPage} />
      )}
      {!loading && recommendedArticles && (
        <>
          <div className="tips-and-tricks-text-articles-wrapper">
            <h2>Povezani članci</h2>
          </div>
          <div className="tips-and-tricks-connected-articles-wrapper">
            {recommendedArticles.map((el, index) => (
              <HorizontalPostItemBig key={index} data={el} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TipsAndTricks;
