import ReactPaginate from "react-paginate";
import "./Pagination.scss";
import { FC } from "react";
import { PaginationProps } from "../../../common/types";

type ExtendedPaginationProps = PaginationProps & {
  scrollToTop?: boolean;
};

const Pagination: FC<ExtendedPaginationProps> = ({
  setPage,
  onPageChange,
  totalPages,
  currentPage,
  scrollToTop = true,
}) => {
  const handlePageClick = (event: { selected: number }) => {
    if (scrollToTop && typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }

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