// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { FC, useEffect, useMemo, useState } from "react";
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
  defaultValue = null,
  filterAttribute = "name",
  imageAttribute = "url",
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // 1) Dodaj "praznu" opciju na vrh (reset)
  const optionsWithEmpty = useMemo(() => {
    const emptyOption = {
      id: null,
      [filterAttribute]: "— Bez odabira —",
      [imageAttribute]: "",
      __isEmpty: true,
    };

    // Ako već postoji opcija s id=null, ne dodaj duplu
    const hasNull = Array.isArray(options) && options.some((o) => o?.id === null);

    return hasNull ? options : [emptyOption, ...(options || [])];
  }, [options, filterAttribute, imageAttribute]);

  // 2) Kada parent promijeni selectedValue (npr. edit), syncaj selectedOption
  useEffect(() => {
    const list = optionsWithEmpty || [];
    const option = list.find((o) => o?.id === selectedValue) || null;
    setSelectedOption(option);
  }, [selectedValue, optionsWithEmpty]);

  // 3) Default value (ako želiš automatski postaviti na mount)
  useEffect(() => {
    // ako je defaultValue null -> to znači "prazno"
    if (defaultValue === null || defaultValue === undefined) return;

    const list = optionsWithEmpty || [];
    const defaultOption = list.find((o) => o?.id === defaultValue) || null;
    setSelectedOption(defaultOption);
    if (onChange) onChange(defaultOption);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (option) => {
    // klik na "— Bez odabira —" => reset (null)
    if (option?.id === null || option?.__isEmpty) {
      setSelectedOption(null);
      if (onChange) onChange(null);
      return;
    }

    setSelectedOption(option);
    if (onChange) onChange(option);
  };

  const selectedOptionTemplate = (option, props) => {
    // Kad je reset (null) -> pokaži placeholder (hardcodedValue)
    if (!option || option?.id === null || option?.__isEmpty) {
      return <span className="dropdown-placeholder">{props.placeholder}</span>;
    }

    return (
      <div className="option-item selected">
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

    return (
      <div className="option-item">
        {images && option?.[imageAttribute] && (
          <img alt={option?.[filterAttribute] || ""} src={option?.[imageAttribute]} className="icon" />
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
