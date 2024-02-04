import "./Table.scss";
import TableContent from "../../molecules/TableContent/TableContent";
import Pagination from "../../../atoms/Pagination/Pagination";
import PageCount from "../../atoms/PageCount";
import ItemsPerPageSelector from "../../molecules/ItemsPerPageSelector";
import Search from "../../../atoms/Search";
import Button from "../../../atoms/Button";
import { FC, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";

interface TableProps {
  data: { data: object; total: number; totalPages: number; pageSize: number };
  type: string;
  pageSize: number;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setPageSize: React.Dispatch<React.SetStateAction<number>>;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
}

const Table: FC<TableProps> = ({
  data,
  type,
  page,
  setPage,
  setPageSize,
  setSearchText,
}) => {
  const navigate = useNavigate();

  const handleAddClick = () => {
    if (type == "country") {
      navigate("/admin/države/dodaj");
    } else if (type == "place") {
      navigate("/admin/mjesta/dodaj");
    } else if (type == "article") {
      navigate("/admin/članci/dodaj");
    }
  };

  const handleSearch = (e: { target: { value: SetStateAction<string>; }; }) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <ItemsPerPageSelector setItemsPerPage={setPageSize} />
        <div className="table-search-add-container">
          <Search green onChange={handleSearch} />
          <Button circle onClick={handleAddClick}>
            +
          </Button>
        </div>
      </div>
      {data.data && <TableContent data={data.data} type={type} />}
      <div className="table-footer">
        <PageCount total={data.total} page={page} pageSize={data.pageSize} />
        <Pagination setPage={setPage} totalPages={data.totalPages} />
      </div>
    </div>
  );
};

export default Table;
