// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState } from "react";
import "./TableContent.scss";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Button from "../../../atoms/Button";
import { CaretUpDown, PencilSimpleLine } from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

const TableContent = ({ data, type }) => {
  const [sorting, setSorting] = useState();
  const columnHelper = createColumnHelper();
  const navigate = useNavigate();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}.`;
  };

  let columns;
  if (type === "country") {
    columns = [
      columnHelper.accessor("name", {
        header: () => "Naziv",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("articleCount", {
        header: () => "Broj članaka",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.display({
        id: "actions",
        cell: (row) => (
          <Button edit onClick={() => handleEdit(row.row.original.id)}>
            <PencilSimpleLine size={16} color="#333333" />
          </Button>
        ),
      }),
    ];
  } else if (type === "place") {
    columns = [
      columnHelper.accessor("name", {
        header: () => "Naziv",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("country.name", {
        header: () => "Država",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.display({
        id: "actions",
        cell: (row) => (
          <Button edit onClick={() => handleEdit(row.row.original.id)}>
            <PencilSimpleLine size={16} color="#333333" />
          </Button>
        ),
      }),
    ];
  } else if (type === "article") {
    columns = [
      columnHelper.accessor("title", {
        header: () => "Naslov",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("article_type.name", {
        header: () => "Tip",
        cell: (info) => info.renderValue(),
      }),
      columnHelper.accessor("date_written", {
        header: () => "Datum",
        cell: (info) => formatDate(info.renderValue()),
      }),
      columnHelper.accessor("country.name", {
        header: () => "Država",
        cell: (info) => info.renderValue() || "-",
      }),
      columnHelper.display({
        id: "actions",
        cell: (row) => (
          <Button edit onClick={() => handleEdit(row.row.original.id)}>
            <PencilSimpleLine size={16} color="#333333" />
          </Button>
        ),
      }),
    ];
  }

  const handleEdit = (id: number) => {
    if (type == "country") {
      navigate(`/admin/države/uredi/${id}`);
    } else if (type == "place") {
      navigate(`/admin/mjesta/uredi/${id}`);
    } else if (type == "article") {
      navigate(`/admin/članci/uredi/${id}`);
    }
  };

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },

    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
    initialState: {
      pagination: {
        autoResetPageIndex: true,
        pageSize: 5,
      },
    },
  });

  return (
    <div className="table-content-container">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, index) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div className="header-content">
                      <p>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </p>
                      {index !== headerGroup.headers.length - 1 && (
                        <CaretUpDown
                          size={32}
                          color="#919191"
                          weight="fill"
                          onClick={header.column.getToggleSortingHandler()}
                        />
                      )}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};

export default TableContent;
