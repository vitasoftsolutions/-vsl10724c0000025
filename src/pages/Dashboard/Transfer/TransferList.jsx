import { Row } from "antd";
import { useState } from "react";
import { WarehouseFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import TransferCreate from "../../../components/Transfer/TransferCreate";
import TransferTable from "../../../components/Transfer/TransferTable";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { TRANSFER } from "../../../utilities/apiEndpoints/inventory.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
    render: (date) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {date}
      </span>
    ),
  },
  {
    title: "Reference",
    dataIndex: "reference",
    key: "reference",
    align: "center",
    render: (reference) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {reference}
      </span>
    ),
  },
  {
    title: "Warehouse (From)",
    dataIndex: "warehouse_from",
    key: "warehouse_from",
    render: (warehouseFrom) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {warehouseFrom ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Warehouse (To)",
    dataIndex: "warehouse_to",
    key: "warehouse_to",
    render: (warehouseTo) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {warehouseTo ?? "N/A"}
      </span>
    ),
  },

  {
    title: "Product Cost",
    dataIndex: "product_cost",
    key: "product_cost",
    render: (productCost) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {productCost}
      </span>
    ),
  },
  {
    title: "Product Tax",
    dataIndex: "product_tax",
    key: "product_tax",
    render: (productTax) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {productTax}
      </span>
    ),
  },
  {
    title: "Grand Total",
    dataIndex: "grand_total",
    key: "grand_total",
    render: (grandTotal) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {grandTotal}
      </span>
    ),
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "100px",
    align: "center",
    render: (status) => {
      return (
        <div
          className={`p-0 ${
            status === "Completed" || status === "Sent" || status === "Send"
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-[#FEF2F2] text-[#EF4444]"
          } rounded shadow-md w-[80px]`}
        >
          <span className="font-medium text-xs px-2 w-full">{status}</span>
        </div>
      );
    },
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <WarehouseFilter />
    </Row>
  );
};

const TransferList = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle={"Transfer"}
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={TRANSFER}
    >
      <TransferCreate />

      <TransferTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default TransferList;
