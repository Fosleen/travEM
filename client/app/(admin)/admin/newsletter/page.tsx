// @ts-nocheck
"use client";

import { useEffect, useState } from "react";
import { getSubscribers, getSubscribersStats } from "@/api/subscribers";
import Table from "@/components/admin/organisms/Table";
import "./Subscribers.scss";
import SubscribersStats from "@/components/admin/molecules/SubscribersStats";

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersStats, setSubscribersStats] = useState("...");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState("");

  const fetchSubscribersData = async () => {
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

  const fetchSubscribersStats = async () => {
    try {
      const response = await getSubscribersStats();
      setSubscribersStats(response.data);
    } catch (error) {
      console.error("Error while fetching:", error);
      setSubscribersStats(null);
    }
  };

  useEffect(() => {
    fetchSubscribersData();
    fetchSubscribersStats();
  }, [pageSize, page]);

  return (
    <div className="subs-list-container">
      <SubscribersStats data={subscribersStats} />
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
}
