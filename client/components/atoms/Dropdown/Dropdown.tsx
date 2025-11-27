import { useState, FC } from "react";
import { DropdownProps } from "../../../common/types";
import "./Dropdown.scss";

const Dropdown: FC<DropdownProps> = ({
  success,
  error,
  label,
  message,
  defaultValue,
  options,
  hardcodedValue,
  onChange,
  isDisabled = false,
  ...restProps
}) => {
  const DropdownClassName = success
    ? "dropdown success"
    : error
    ? "dropdown error"
    : "dropdown";
  const labelClassName = error ? "dropdown-label error" : "dropdown-label";
  const messageClassName = error
    ? "dropdown-message error"
    : "dropdown-message";
  const errorStyle = error ? { margin: "8px 0" } : {};
  const [selectedOption, setSelectedOption] = useState<string | undefined>(
    defaultValue || undefined
  );

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignoreS
  const handleSelect = (option) => {
    setSelectedOption(option);
    onChange(option);
  };
  return (
    <div className="dropdown-wrapper">
      {label && <label className={labelClassName}>{label}</label>}
      <select
        disabled={isDisabled}
        className={DropdownClassName}
        defaultValue={defaultValue}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignoreS
        value={selectedOption}
        onChange={(e) => handleSelect(e.target.value)}
        {...restProps}
      >
        <option value="" disabled>
          {hardcodedValue}
        </option>
        {options.map((option) => (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignoreS
          <option key={option.id} value={option.id} className="dropdown-item">
            {(option as { name: string }).name}
          </option>
        ))}
      </select>
      {message && <p className={messageClassName}>{message}</p>}

      {error && (
        <p className={messageClassName} style={errorStyle}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Dropdown;
