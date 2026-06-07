// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, useEffect, useMemo, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import "./AdvancedDropdown.scss";
import { DropdownProps } from "../../../../common/types";
import { hasAnySectionIconFeature } from "@/utils/sectionSpecialFeatures";

const AdvancedDropdown: FC<DropdownProps> = ({
  label,
  options,
  hardcodedValue,
  onChange,
  filter = false,
  images = false,
  selectedValue,
  defaultValue = null,
  filterAttribute = "name",
  imageAttribute = "url",
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const getValueId = (value) => {
    if (value === null || value === undefined) return null;

    if (typeof value === "object") {
      return value?.id ?? null;
    }

    return value;
  };

  const optionsWithEmpty = useMemo(() => {
    const emptyOption = {
      id: null,
      [filterAttribute]: "— Bez odabira —",
      [imageAttribute]: "",
      __isEmpty: true,
    };

    const hasNull =
      Array.isArray(options) && options.some((option) => option?.id === null);

    return hasNull ? options : [emptyOption, ...(options || [])];
  }, [options, filterAttribute, imageAttribute]);

  const findOptionByValue = (value) => {
    const valueId = getValueId(value);

    if (valueId === null || valueId === undefined) return null;

    const list = optionsWithEmpty || [];

    return list.find((item) => item?.id === valueId) || null;
  };

  useEffect(() => {
    const option = findOptionByValue(selectedValue);
    setSelectedOption(option);
  }, [selectedValue, optionsWithEmpty]);

  useEffect(() => {
    if (defaultValue === null || defaultValue === undefined) return;

    const defaultOption = findOptionByValue(defaultValue);
    setSelectedOption(defaultOption);

    // Važno:
    // Ne zovemo onChange ovdje jer defaultValue služi samo za prikaz početne vrijednosti.
    // Inače komponenta roditelju može poslati null tijekom inicijalizacije.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValue, optionsWithEmpty]);

  const handleSelect = (option) => {
    if (option?.id === null || option?.__isEmpty) {
      setSelectedOption(null);

      if (onChange) {
        onChange(null);
      }

      return;
    }

    setSelectedOption(option);

    if (onChange) {
      onChange(option);
    }
  };

  const getIsSpecialFeatureOption = (option) => {
    if (!option || option?.id === null || option?.__isEmpty) return false;

    return hasAnySectionIconFeature(option);
  };

  const selectedOptionTemplate = (option, props) => {
    if (!option || option?.id === null || option?.__isEmpty) {
      return <span className="dropdown-placeholder">{props.placeholder}</span>;
    }

    const isSpecialFeatureOption = getIsSpecialFeatureOption(option);

    return (
      <div
        className={`option-item selected ${
          isSpecialFeatureOption ? "option-item--special" : ""
        }`}
      >
        {images && option?.[imageAttribute] && (
          <img
            alt={option?.[filterAttribute] || ""}
            src={option?.[imageAttribute]}
            className="icon"
          />
        )}

        {option?.[filterAttribute] && <div>{option?.[filterAttribute]}</div>}
      </div>
    );
  };

  const itemOptionTemplate = (option) => {
    const isEmpty = option?.id === null || option?.__isEmpty;

    if (isEmpty) {
      return (
        <div className="option-item option-item--empty">
          <div>{option?.[filterAttribute] || "— Bez odabira —"}</div>
        </div>
      );
    }

    const isSpecialFeatureOption = getIsSpecialFeatureOption(option);

    return (
      <div
        className={`option-item ${
          isSpecialFeatureOption ? "option-item--special" : ""
        }`}
      >
        {images && option?.[imageAttribute] && (
          <img
            alt={option?.[filterAttribute] || ""}
            src={option?.[imageAttribute]}
            className="icon"
          />
        )}

        <div>{option?.[filterAttribute]}</div>
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
          options={optionsWithEmpty}
          optionLabel={filterAttribute}
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