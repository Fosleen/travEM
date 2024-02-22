import ReactPaginate from "react-paginate";
import "./Pagination.scss";
import { FC } from "react";
import { PaginationProps } from "../../../common/types";

const Pagination: FC<PaginationProps> = ({ setPage, totalPages }) => {
  const handlePageClick = (event: { selected: number }) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    setPage(event.selected + 1);
  };

  return (
    <div className="pagination-wrapper">
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={totalPages}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item-carrot"
        previousLinkClassName="page-link-previous"
        nextClassName="page-item-carrot"
        nextLinkClassName="page-link-next"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active-pagination"
        renderOnZeroPageCount={null}
      />
    </div>
  );
};

export default Pagination;
