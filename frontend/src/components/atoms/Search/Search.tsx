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

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className={searchClasses}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={handleKeyPress}
      />
      <MagnifyingGlass
        size={16}
        className="ph-magnifying-glass"
        onClick={onClick}
      />
    </div>
  );
};

export default Search;
