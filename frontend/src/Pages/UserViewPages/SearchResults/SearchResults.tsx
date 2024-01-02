import HorizontalPostItemBig from "../../../components/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./SearchResults.scss";

const SearchResults = () => {
  return (
    <div className="search-results-parent-wrapper">
      <div className="search-results-text-wrapper">
        <h4>Pretraživanja za: &nbsp;</h4>
        <h3>avion</h3>
      </div>
      <div className="search-results-grid-wrapper">
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
        <HorizontalPostItemBig />
      </div>
    </div>
  );
};

export default SearchResults;
