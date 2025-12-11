// @ts-nocheck

"use client";

import { useEffect, useState } from "react";
import Table from "@/components/admin/organisms/Table";
import { getPlaces, getPlacesByName } from "@/api/places";
import "./PlacesList.scss";

const PlacesList = () => {
  const [places, setPlaces] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, [pageSize, page]);

  const fetchData = async () => {
    try {
      const data = await getPlaces(page, pageSize);
      setPlaces(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  const fetchSearch = async () => {
    try {
      const data = await getPlacesByName(searchText, page, pageSize);
      setPlaces(data);
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
    <div className="places-list-container">
      <Table
        data={places}
        type={"place"}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        setSearchText={setSearchText}
      />
    </div>
  );
};

export default PlacesList;
