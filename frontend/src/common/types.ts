import { ChangeEvent, HTMLInputTypeAttribute } from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  red?: boolean;
  grey?: boolean;
  primary?: boolean;
  circle?: boolean;
  fitText?: boolean;
  white?: boolean;
  adminPrimary?: boolean;
  form?: string;
}

export interface InputProps {
  type?: HTMLInputTypeAttribute;
  label?: string;
  value?: string | number;
  name: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  green?: boolean;
  adminView?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface SearchProps {
  green?: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface DropdownProps {
  success?: boolean;
  error?: boolean;
  label: string;
  message?: string;
  defaultValue?: string;
  options: Array<object>;
  hardcodedValue?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isDisabled: boolean;
}

export interface AirplaneTicketsMenuProps {
  setIsPlaneTicketsMenuShown?: (value: boolean) => void;
}

export interface HomepageData {
  id: number;
  hero_image_url: string;
  banner_title: string;
  banner_small_text: string;
  banner_description: string;
  button_text: string;
  flights_nmbr: string;
  videos_nmbr: string;
  distance_nmbr: string;
}
