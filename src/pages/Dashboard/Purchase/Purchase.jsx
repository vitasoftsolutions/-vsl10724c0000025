import { Row } from "antd";
import { useState } from "react";
import { PurchaseCreate } from "../../../components/Purchase/PurchaseCreate";
import { PurchaseTable } from "../../../components/Purchase/PurchaseTable";
import {
  ProductFilter,
  PurchaseStatusFilter,
  SupplierFilter,
  TaxFilter,
  WarehouseFilter,
} from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { PURCHASE } from "../../../utilities/apiEndpoints/inventory.api";
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
    title: "Warehouse",
    dataIndex: "warehouse",
    key: "warehouse",
    render: (warehouse) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {warehouse ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Supplier",
    dataIndex: "supplier",
    key: "supplier",
    render: (supplier) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {supplier ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Purchase Status",
    dataIndex: "purchaseStatus",
    key: "purchaseStatus",
    align: "center",
    render: (purchaseStatus) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {purchaseStatus ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Payment Status",
    dataIndex: "paymentStatus",
    key: "paymentStatus",
    align: "center",
    render: (paymentStatus) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {paymentStatus ?? "N/A"}
      </span>
    ),
  },
  {
    title: "Grand Total",
    dataIndex: "grandTotal",
    key: "grandTotal",
    render: (grandTotal) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {grandTotal}
      </span>
    ),
  },
  {
    title: "Paid",
    dataIndex: "paid",
    key: "paid",
    render: (paid) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {paid}
      </span>
    ),
  },
  {
    title: "Due",
    dataIndex: "due",
    key: "due",
    render: (due) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {due}
      </span>
    ),
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <WarehouseFilter />
      <SupplierFilter />
      <ProductFilter name="purchase_product_ids" />
      <TaxFilter />
      <PurchaseStatusFilter />
    </Row>
  );
};

const Purchase = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Purchase"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={PURCHASE}
    >
      <PurchaseCreate />

      <PurchaseTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default Purchase;
