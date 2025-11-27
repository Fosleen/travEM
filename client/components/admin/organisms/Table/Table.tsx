import "./Table.scss";
import TableContent from "../../molecules/TableContent/TableContent";
import Pagination from "../../../atoms/Pagination";
import PageCount from "../../atoms/PageCount";
import ItemsPerPageSelector from "../../molecules/ItemsPerPageSelector";
import Search from "../../../atoms/Search";
import Button from "../../../atoms/Button";
import { FC, SetStateAction } from "react";
import { TableProps } from "../../../../common/types";
import { useRouter } from "next/navigation";

const Table: FC<TableProps> = ({
  data,
  type,
  page,
  setPage,
  setPageSize,
  setSearchText,
  displayHeader = true,
  displayFooter = true,
}) => {
  const router = useRouter();

  const handleAddClick = () => {
    if (type == "country") {
      router.push("/admin/drzave/dodaj");
    } else if (type == "place") {
      router.push("/admin/mjesta/dodaj");
    } else if (type == "article") {
      router.push("/admin/clanci/dodaj");
    }
  };

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };

  return (
    <div className="table-container">
      {displayHeader ? (
        <div className="table-header">
          <ItemsPerPageSelector setItemsPerPage={setPageSize} type={type} />
          <div className="table-search-add-container">
            <Search
              green
              onChange={handleSearch}
              placeholder="Pretraži po nazivu..."
            />
            <Button circle onClick={handleAddClick}>
              +
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}

      {data.data ? (
        <TableContent data={data.data} type={type} />
      ) : (
        <p>Loading...</p>
      )}

      {displayFooter ? (
        <div className="table-footer">
          <PageCount
            total={data.total}
            page={page}
            pageSize={data.pageSize}
            type={type}
          />
          <Pagination setPage={setPage} totalPages={data.totalPages} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Table;
