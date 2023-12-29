import { FC } from "react";
import { InputProps } from "../../../common/types";
import "./Input.scss";

const Input: FC<InputProps> = ({
  type = "text",
  label = "",
  adminView = false,
  value,
  name,
  placeholder,
  error,
  green = false,
  disabled = false,
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
        />
      </div>

      {error && (
        <p className=" text-red-500 font-medium text-center md:text-left rounded-md px-4">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;
