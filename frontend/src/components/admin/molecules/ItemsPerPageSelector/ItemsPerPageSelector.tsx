import Dropdown from "../../../atoms/Dropdown";
import AdvancedDropdown from "../../atoms/AdvancedDropdown";
import "./ItemsPerPageSelector.scss";

const ItemsPerPageSelector = ({ setItemsPerPage }) => {
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
        ]}
      />
      <p>postova</p>
    </div>
  );
};

export default ItemsPerPageSelector;
