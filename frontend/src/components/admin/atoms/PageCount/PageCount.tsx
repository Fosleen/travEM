import { FC } from "react";
import "./PageCount.scss";

interface PageCountProps {
  total: number;
  page: number;
  pageSize: number;
}

const PageCount: FC<PageCountProps> = ({ total, page, pageSize }) => {
  return (
    <>
      {total && page && pageSize && (
        <p className="page-count">
          Prikazano {page * pageSize - pageSize + 1} do{" "}
          {page * pageSize < total ? page * pageSize : total} od {total} država
        </p>
      )}
    </>
  );
};

export default PageCount;
