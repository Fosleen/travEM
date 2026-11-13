"use client";

import { useEffect, useState, type SetStateAction } from "react";
import "./ArticlesList.scss";
import { getArticles, getArticlesByName } from "@/utils/article";
import Table from "@/components/admin/organisms/Table";

const ArticlesList = () => {
  const [articles, setArticles] = useState({ data: [], total: 0, totalPages: 0, pageSize: 8 });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    let active = true;
    const request = searchText
      ? getArticlesByName(searchText, page, pageSize, true)
      : getArticles(page, pageSize, null, true);
    void request.then((data) => {
      if (active && data?.data) setArticles(data);
    }).catch((error) => console.error("Error fetching articles:", error));
    return () => { active = false; };
  }, [pageSize, page, searchText]);

  const handleSearch = (value: SetStateAction<string>) => {
    setSearchText(value);
    setPage(1);
  };

  return (
    <div className="articles-list-container">
      <Table
        data={articles}
        type={"article"}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        setSearchText={handleSearch}
        pageSize={pageSize}
        displayHeader
        displayFooter
      />
    </div>
  );
};

export default ArticlesList;
