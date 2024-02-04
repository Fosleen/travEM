import { useEffect, useState } from "react";
import Table from "../../../components/admin/organisms/Table";
import "./ArticlesList.scss";
import { getArticles, getArticlesByName } from "../../../api/article";

const ArticlesList = () => {
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, [pageSize, page]);

  const fetchData = async () => {
    try {
      const data = await getArticles(page, pageSize);
      setArticles(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  const fetchSearch = async () => {
    try {
      const data = await getArticlesByName(searchText, page, pageSize);
      setArticles(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  useEffect(() => {
    setPage(1);
    setPageSize(8);
    searchText === "" ? fetchData() : fetchSearch();
  }, [searchText]);

  return (
    <div className="articles-list-container">
      <Table
        data={articles}
        type={"article"}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        setSearchText={setSearchText}
      />
    </div>
  );
};

export default ArticlesList;
