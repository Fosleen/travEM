import { FC } from "react";
import { ButtonProps } from "../../../common/types";
import "./Button.scss";

const Button: FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  red = false,
  edit = false,
  primary = false,
  grey = false,
  white = false,
  fitText = true,
  circle = false,
  adminPrimary = false,
  form,
}) => {
  let buttonClasses = " button";

  if (red) {
    buttonClasses += ` button-red `;
  }

  if (fitText) {
    buttonClasses += ` button-fit `;
  }

  if (primary) {
    buttonClasses += ` button-primary `;
  }

  if (white) {
    buttonClasses += ` button-white `;
  }

  if (edit) {
    buttonClasses += ` button-edit `;
  }

  if (circle) {
    buttonClasses += ` button-circle `;
  }

  if (adminPrimary) {
    buttonClasses += ` button-admin-primary `;
  }

  if (disabled) {
    buttonClasses += ` button-disabled`;
  }

  if (grey) {
    buttonClasses += ` button-grey`;
  }

  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={buttonClasses}
      form={form}
    >
      {children}
    </button>
  );
};

export default Button;
