import ReactPaginate from "react-paginate";
import "./Pagination.scss";
import { FC } from "react";
import { PaginationProps } from "../../../common/types";

const Pagination: FC<PaginationProps> = ({
  setPage,
  onPageChange,
  totalPages,
  currentPage,
}) => {
  const handlePageClick = (event: { selected: number }) => {
    window.scrollTo({ top: 0, behavior: "instant" });
    const pageHandler = onPageChange || setPage;
    if (pageHandler) {
      pageHandler(event.selected + 1);
    }
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
        forcePage={currentPage ? currentPage - 1 : 0}
      />
    </div>
  );
};

export default Pagination;
