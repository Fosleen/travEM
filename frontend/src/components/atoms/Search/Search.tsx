import { FC } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import "./Search.scss";
import { SearchProps } from "../../../common/types";

const Search: FC<SearchProps> = ({
  onChange,
  onClick = () => {},
  green = false,
  placeholder = "Pretraži...",
}) => {
  let searchClasses = `search `;
  if (green) {
    searchClasses += ` search-green `;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onClick();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <input
        type="search"
        className={searchClasses}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
      />
      <MagnifyingGlass
        size={16}
        className="ph-magnifying-glass"
        onClick={onClick}
      />
    </form>
  );
};

export default Search;
