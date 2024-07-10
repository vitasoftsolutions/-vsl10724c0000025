import { Row } from "antd";
import { useState } from "react";
import PurchaseReturnCreate from "../../../components/PurchaseReturn/PurchaseReturnCreate";
import PurchaseReturnTable from "../../../components/PurchaseReturn/PurchaseReturnTable";
import {
  ProductFilter,
  PurchaseStatusFilter,
  SupplierFilter,
  TaxFilter,
  WarehouseFilter,
} from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { PURCHASE_RETURN } from "../../../utilities/apiEndpoints/inventory.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Return Reference",
    dataIndex: "referenceNo",
    key: "referenceNo",
    align: "center",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
  {
    title: "Purchase Reference",
    dataIndex: "purchaseReference",
    key: "purchaseReference",
    align: "center",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },

  {
    title: "Warehouse",
    dataIndex: "warehouse",
    key: "warehouse",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Supplier",
    dataIndex: "supplier",
    key: "supplier",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
    align: "center",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
  {
    title: "Grand Total",
    dataIndex: "grandTotal",
    key: "grandTotal",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <WarehouseFilter />
      <SupplierFilter />
      <ProductFilter />
      <TaxFilter />
      <PurchaseStatusFilter />
    </Row>
  );
};

const PurchaseReturn = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Purchase Return"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={PURCHASE_RETURN}
    >
      <PurchaseReturnCreate />

      <PurchaseReturnTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default PurchaseReturn;
