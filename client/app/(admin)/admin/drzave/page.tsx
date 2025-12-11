// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import Table from "@/components/admin/organisms/Table";
import "./CountriesList.scss";
import { getCountries, getCountriesByName } from "@/api/countries";

export default function CountriesListPage() {
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");

  const fetchData = async () => {
    try {
      const data = await getCountries(page, pageSize, true);
      setCountries(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  const fetchSearch = async () => {
    try {
      const data = await getCountriesByName(
        searchText,
        page,
        pageSize,
        1,
        true
      );
      setCountries(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [pageSize, page]);

  useEffect(() => {
    setPage(1);
    setPageSize(8);
    searchText === "" ? fetchData() : fetchSearch();
  }, [searchText]);

  return (
    <div className="countries-list-container">
      <Table
        data={countries}
        type={"country"}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        setSearchText={setSearchText}
      />
    </div>
  );
}
