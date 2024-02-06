import { FC } from "react";
import "./PageCount.scss";
import { PageCountProps } from "../../../../common/types";

const PageCount: FC<PageCountProps> = ({ total, page, pageSize, type }) => {
  return (
    <>
      {total && page && pageSize && (
        <p className="page-count">
          Prikazano {page * pageSize - pageSize + 1} do{" "}
          {page * pageSize < total ? page * pageSize : total} od {total}{" "}
          {type === "country" && "država"}
          {type === "place" && "mjesta"}
          {type === "article" && "postova"}
        </p>
      )}
    </>
  );
};

export default PageCount;
