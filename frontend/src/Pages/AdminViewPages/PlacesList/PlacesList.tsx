import React, { useEffect, useState } from "react";
import Table from "../../../components/admin/organisms/Table";
import { getCountries } from "../../../api/countries";

const PlacesList = () => {
  return (
    <div className="places-list-container">
      <Table />
    </div>
  );
};

export default PlacesList;
