import { FC, useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import "./AdvancedDropdown.scss";
import { DropdownProps } from "../../../../common/types";

const AdvancedDropdown: FC<DropdownProps> = ({
  label,
  options,
  hardcodedValue,
  onChange,
  filter = false,
  images = false,
  selectedValue,
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS

  useEffect(() => {
    if (selectedOption) onChange(selectedOption);
  }, [selectedOption]);

  useEffect(() => {
    // to update selected value when article section is deleted
    const option = options.find((option) => option.id === selectedValue);
    setSelectedOption(option || null);
  }, [selectedValue, options]);

  const handleSelect = (option) => {
    setSelectedOption(option);
  };

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  const selectedOptionTemplate = (option, props) => {
    if (option) {
      return (
        <div className="option-item selected">
          {images && <img alt={option.url} src={option.url} className="icon" />}
          {option.name && <div>{option.name}</div>}
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const itemOptionTemplate: FC<{ url?: string; name?: string }> = (option) => {
    return (
      <div className="option-item">
        {images && <img alt={option.name} src={option.url} className="icon" />}
        <div>{option.name}</div>
      </div>
    );
  };

  return (
    <div className="dropdown-wrapper">
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-filter-wrapper">
        <Dropdown
          value={selectedOption}
          onChange={(e) => handleSelect(e.value)}
          options={options}
          optionLabel="name"
          placeholder={hardcodedValue}
          filter={filter}
          valueTemplate={selectedOptionTemplate}
          itemTemplate={itemOptionTemplate}
          className="dropdown"
        />
      </div>
    </div>
  );
};

export default AdvancedDropdown;