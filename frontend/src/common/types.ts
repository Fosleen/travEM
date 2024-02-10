import { ChangeEvent, HTMLInputTypeAttribute } from "react";

export interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  red?: boolean;
  grey?: boolean;
  primary?: boolean;
  edit?: boolean;
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

export interface TextareaProps {
  label?: string;
  name: string;
  placeholder: string;
  error?: string;
  disabled?: boolean;
  rows?: number;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export interface SearchProps {
  green?: boolean;
  placeholder?: string;
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
  filter?: boolean;
  images?: boolean;
}

export interface AirplaneTicketsMenuProps {
  setIsPlaneTicketsMenuShown?: (value: boolean) => void;
}

export interface HomepageData {
  id: number;
  hero_image_url: string;
  banner_image_url: string;
  banner_title: string;
  banner_small_text: string;
  banner_description: string;
  button_text: string;
  flights_nmbr: string;
  videos_nmbr: string;
  distance_nmbr: string;
}

export interface EditBannerData {
  banner_title: string;
  banner_small_text: string;
  banner_description: string;
  button_text: string;
  banner_image_url: string;
}

export interface CountriesData {
  id: number;
  name: string;
  description: string;
  main_image_url: string;
  flag_image_url: string;
  colorId: number;
  continentId: number;
  color?: { hex_value: string };
  characteristics?: Array<CharacteristicProps>;
  articles?: Array<ArticleProps>;
  places: Array<PlacesData>;
  specificities: Array<SpecificityProps>;
  videos: Array<VideoProps>;
}

export interface VideoProps {
  id: number;
  url: string;
}

export interface PlacesData {
  id: number;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  is_on_homepage_map: boolean;
  map_icon: string;
  country_id: number;
}

export interface ArticleType {
  id: number;
  name: string;
}

export interface SectionIconsData {
  id: number;
  url: string;
}

export interface Article {
  title: string;
  subtitle: string;
  description: string;
  video: string;
  article_type_id: number;
  country_id: number;
  place_id: number;
  main_image_url: string;
  user_id: number;
}

export interface HorizontalPostItemBigProps {
  stretched?: boolean;
  thin?: boolean;
  hasDate?: boolean;
  article: {
    id: number;
    main_image_url: string;
    title: string;
    subtitle: string;
    date_written: Date;
  };
}

export interface PageCountProps {
  total: number;
  page: number;
  pageSize: number;
  type: string;
}

export interface TableProps {
  data: { data: object; total: number; totalPages: number; pageSize: number };
  type: string;
  pageSize: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

export interface PaginationProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export interface SidebarMenuItemProps {
  text: string;
}

export interface ItemsPerPageSelectorProps {
  setItemsPerPage: React.Dispatch<React.SetStateAction<number>>;
  type: string;
}

export interface DestinationsMapProps {
  initialLongitude: number;
  initialLatitude: number;
}

export interface BlogStatsItemProps {
  icon: string;
  value?: string;
}

export interface SpecificityProps {
  id: number;
  title: string;
  specificity_items: Array<{ title: string; description: string }>;
  specificity_images?: Array<{ url: string }>;
}

export interface CharacteristicProps {
  id: number;
  title: string;
  description: string;
  countryId: number;
  characteristicIconId: number;
  characteristic_icon: {
    id: number;
    url: string;
  };
}

export interface ArticleProps {
  hasImage?: boolean;
  hasVideo?: boolean;
  hasImages?: boolean;
}

export interface DestinationsMenuProps {
  setIsDestinationsMenuShown?: (isShown: boolean) => void;
}

export interface TipsMenuProps {
  setIsTipsMenuShown?: (isShown: boolean) => void;
}
