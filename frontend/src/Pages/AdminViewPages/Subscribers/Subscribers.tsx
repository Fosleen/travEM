// @ts-nocheck

import { useEffect, useState } from "react";
import { getSubscribers } from "../../../api/subscribers";
import Table from "../../../components/admin/organisms/Table";

const Subsrcibers = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    fetchData();
  }, [pageSize, page]);

  const fetchData = async () => {
    try {
      const response = await getSubscribers(page, pageSize);
      const formattedData = {
        data: response.data || [],
        total: response.total || 0,
        pageSize: response.pageSize || pageSize,
        totalPages: response.totalPages || 0,
      };
      setSubscribers(formattedData);
    } catch (error) {
      console.error("Error while fetching:", error);
      setSubscribers({
        data: [],
        total: 0,
        pageSize: pageSize,
        totalPages: 0,
      });
    }
  };
  return (
    <div className="places-list-container">
      <Table
        data={subscribers}
        setPageSize={setPageSize}
        page={page}
        setPage={setPage}
        setSearchText={setSearchText}
        type="subscribers"
      />
    </div>
  );
};

export default Subsrcibers;
