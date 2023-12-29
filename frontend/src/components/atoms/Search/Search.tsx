import { FC } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import "./Search.scss";
import { SearchProps } from "../../../common/types";

const Search: FC<SearchProps> = ({ onChange, green = false }) => {
  let searchClasses = `search `;
  if (green) {
    searchClasses += ` search-green `;
  }
  return (
    <div className="search-container">
      <input
        type="text"
        className={searchClasses}
        onChange={onChange}
        placeholder="Pretraži..."
      />
      <MagnifyingGlass size={16} className="ph-magnifying-glass" />
    </div>
  );
};

export default Search;
