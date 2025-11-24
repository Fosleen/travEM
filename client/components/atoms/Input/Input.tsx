import { FC } from "react";
import { InputProps } from "../../../common/types";
import "./Input.scss";

const Input: FC<InputProps> = ({
  type = "text",
  label = "",
  adminView = false,
  value,
  error,
  name,
  placeholder,
  green = false,
  disabled = false,
  onBlur,
  onChange,
}) => {
  let inputClasses = `input `;
  let labelClasses = ``;

  if (disabled) {
    inputClasses += ` input-disabled `;
  }

  if (green) {
    inputClasses += ` input-green `;
  }

  if (adminView) {
    labelClasses += ` input-admin-view `;
  }

  return (
    <div className="input-parent-wrapper">
      <label htmlFor={label} className={labelClasses}>
        {label}
      </label>
      <div className="input-wrapper">
        <input
          className={inputClasses}
          type={type}
          id={name}
          value={value}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          onBlur={onBlur}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Input;
