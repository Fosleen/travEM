import { useState } from "react";
import Pagination from "../../../components/atoms/Pagination/Pagination";
import HorizontalPostItemBig from "../../../components/user/atoms/HorizontalPostItemBig/HorizontalPostItemBig";
import "./SearchResults.scss";

const SearchResults = () => {
  const [currentPage, setCurrentPage] = useState(1);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [maxPages, setMaxPages] = useState(1);

  const contextUsers = [
    // Add mock user data here
    { id: 1, name: "John Doe", age: 25 },
    { id: 2, name: "Jane Smith", age: 30 },
    // Add more user objects as needed
  ];

  // Make sure to adjust the condition in your code to handle an empty array appropriately

  const handleClickNumber = (pageNumber: number) => {
    //this works well
    setCurrentPage(pageNumber);
    console.log("Curr page is", pageNumber);
  };

  // Dummy functions for testing Pagination
  const handleClickPrevious = () => {
    if (currentPage === 1) return;

    const previousPage = currentPage - 1;

    // Assuming you want to check if contextUsers[previousPage] is an array before accessing its length

    if (
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      Array.isArray(contextUsers[previousPage]) &&
      contextUsers[previousPage].length > 0
    ) {
      setCurrentPage(previousPage);
      return;
    }
  };

  const handleClickNext = () => {
    if (currentPage === maxPages) return;

    const nextPage = currentPage + 1;

    if (contextUsers[nextPage]) {
      setCurrentPage(nextPage);
      return;
    }
    console.log("Curr page je", currentPage);
  };

  return (
    <div className="search-results-parent-wrapper">
      <div className="search-results-text-wrapper">
        <h4>Pretraživanja za:&nbsp;</h4>
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

      {/* Pass dummy props to the Pagination component for testing */}
      <Pagination itemsPerPage={5} />
    </div>
  );
};

export default SearchResults;
