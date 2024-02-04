import { useEffect, useState } from "react";
import Table from "../../../components/admin/organisms/Table";
import "./CountriesList.scss";
import { getCountries, getCountriesByName } from "../../../api/countries";

const CountriesList = () => {
  const [countries, setCountries] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(`change ${pageSize} ${page}`);
    fetchData();
  }, [pageSize, page]);

  const fetchData = async () => {
    try {
      const data = await getCountries(page, pageSize);
      console.log(data);
      setCountries(data);
    } catch (error) {
      console.error("error while fetching:", error);
    }
  };

  const fetchSearch = async () => {
    console.log(searchText, page, pageSize);

    try {
      const data = await getCountriesByName(searchText, page, pageSize);
      console.log(data);
      setCountries(data);
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
};

export default CountriesList;
