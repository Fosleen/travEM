"use client";

import { useState } from "react";
import "./EditMap.scss";
import FeaturedPlaces from "@/components/admin/molecules/FeaturedPlaces";
import FeaturedMapPlaceSelector from "@/components/admin/atoms/FeaturedMapPlaceSelector";

const EditMap = () => {
  const [isOnMapSelected, setIsOnMapSelected] = useState(true);

  return (
    <div className="edit-map-container">
      <h2>Preporuka gradova - karta</h2>
      <FeaturedMapPlaceSelector
        isOnMapSelected={isOnMapSelected}
        setIsOnMapSelected={setIsOnMapSelected}
      />
      <FeaturedPlaces isOnMapSelected={isOnMapSelected} />
    </div>
  );
};

export default EditMap;
