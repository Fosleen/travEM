import { FC, useEffect, useRef, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import "./Search.scss";
import { SearchProps } from "../../../common/types";

const Search: FC<SearchProps> = ({
  onChange,
  onClick = () => {},
  green = false,
  placeholder = "Pretraži...",
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFocused, setIsFocused] = useState(false);

  const isActive = isFocused;

  let searchClasses = `search`;
  if (green) searchClasses += ` search-green`;

  const closeOverlay = () => {
    setIsFocused(false);
    inputRef.current?.blur();
  };

  const runSearch = () => {
    closeOverlay();
    onClick();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    runSearch();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runSearch();
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeOverlay();
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isActive]);

  return (
    <>
      <div
        className={`search-backdrop ${isActive ? "active" : ""}`}
        onMouseDown={(e) => {
          e.preventDefault();
          closeOverlay();
        }}
      />

      <form
        onSubmit={handleSubmit}
        className={`search-container ${isActive ? "active" : ""}`}
      >
        <input
          ref={inputRef}
          type="text"
          className={searchClasses}
          onChange={onChange}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        <MagnifyingGlass
          size={16}
          className="ph-magnifying-glass"
          onMouseDown={(e) => e.preventDefault()}
          onClick={runSearch}
        />
      </form>
    </>
  );
};

export default Search;
