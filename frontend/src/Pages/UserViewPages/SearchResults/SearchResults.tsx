import { useLocation } from "react-router-dom";
import Pagination from "../../../components/atoms/Pagination/Pagination";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./SearchResults.scss";
import { useEffect, useState } from "react";
import { getArticlesByName } from "../../../api/article";
import { Article, Nullable } from "../../../common/types";
import { ThreeDots } from "react-loader-spinner";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlValue = queryParams.get("naslov");
  const [articles, setArticles] = useState<Nullable<Array<Article>>>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [page, urlValue]);

  const fetchData = async () => {
    try {
      if (urlValue) {
        const data = await getArticlesByName(urlValue, page, 8);
        setTotalPages(data.totalPages);
        setArticles(data.data);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error occured while fetching articles:", error);
    }
  };

  return (
    <div className="search-results-parent-wrapper">
      <div className="search-results-text-wrapper">
        <h4>Pretraživanja za:&nbsp;</h4>
        <h3>{urlValue}</h3>
      </div>
      {articles?.length == 0 && "Ne postoji niti jedan članak s tim nazivom."}
      {!loading && articles ? (
        <div className="search-results-grid-wrapper">
          {articles.map((el) => (
            <HorizontalPostItemBig data={el} />
          ))}
        </div>
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
      <Pagination totalPages={totalPages} setPage={setPage} />
    </div>
  );
};

export default SearchResults;
