// @ts-nocheck

import { FC } from "react";
import "./Textarea.scss";
import { TextareaProps } from "../../../../common/types";

const Textarea: FC<TextareaProps> = ({
  label = "",
  error,
  name,
  placeholder,
  disabled = false,
  onChange,
  rows,
}) => {
  return (
    <div className="textarea-parent-wrapper">
      <label htmlFor={label}>{label}</label>
      <div className="textarea-wrapper">
        <textarea
          id={name}
          name={name}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          rows={rows}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default Textarea;
