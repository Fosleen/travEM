// @ts-nocheck

import { FC } from "react";
import Dropdown from "../../../atoms/Dropdown";
import "./ItemsPerPageSelector.scss";
import { ItemsPerPageSelectorProps } from "../../../../common/types";

const ItemsPerPageSelector: FC<ItemsPerPageSelectorProps> = ({
  setItemsPerPage,
  type,
}) => {
  const handleChange = (selectedValue) => {
    setItemsPerPage(selectedValue);
  };

  return (
    <div className="items-per-page-selector-container">
      <p>Prikaz</p>
      <Dropdown
        label=""
        isDisabled={false}
        onChange={handleChange}
        options={[
          { id: 8, name: 8 },
          { id: 16, name: 16 },
          { id: 24, name: 24 },
          { id: 48, name: 48 },
          { id: 96, name: 96 },
          { id: 192, name: 192 },
        ]}
      />
      {type === "country" && <p>država</p>}
      {type === "place" && <p>mjesta</p>}
      {type === "article" && <p> članaka</p>}
    </div>
  );
};

export default ItemsPerPageSelector;
