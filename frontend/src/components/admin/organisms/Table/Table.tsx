import "./Table.scss";
import TableContent from "../../molecules/TableContent/TableContent";
import Pagination from "../../../atoms/Pagination/Pagination";
import PageCount from "../../atoms/PageCount";
import ItemsPerPageSelector from "../../molecules/ItemsPerPageSelector";
import Search from "../../../atoms/Search";
import Button from "../../../atoms/Button";
import { FC, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import { TableProps } from "../../../../common/types";


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

  const handleSearch = (e: { target: { value: SetStateAction<string> } }) => {
    console.log(e.target.value);
    setSearchText(e.target.value);
  };

  return (
    <div className="table-container">
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
      {data.data ? (
        <TableContent data={data.data} type={type} />
      ) : (
        <ThreeDots
          height="80"
          width="80"
          radius="8"
          color="#2BAC82"
          ariaLabel="three-dots-loading"
          wrapperStyle={{ justifyContent: "center" }}
          visible={true}
        />
      )}
      <div className="table-footer">
        <PageCount
          total={data.total}
          page={page}
          pageSize={data.pageSize}
          type={type}
        />
        <Pagination setPage={setPage} totalPages={data.totalPages} />
      </div>
    </div>
  );
};

export default Table;
