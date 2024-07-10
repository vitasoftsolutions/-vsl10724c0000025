import { useState } from "react";
import DiscountCreate from "../../../components/Discount/DiscountCreate";
import { DiscountTable } from "../../../components/Discount/DiscountTable";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    // name
    title: "Name",
    dataIndex: "name",
    key: "name",
    align: "center",
    render: (name) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {name}
      </span>
    ),
  },
  {
    // value
    title: "Value",
    dataIndex: "value",
    key: "value",
    align: "center",
    render: (value) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {value}
      </span>
    ),
  },
  {
    // discount plan
    title: "Discount Plan",
    dataIndex: "discount_plan",
    key: "discount_plan",
    align: "center",
    render: (discountPlan) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {discountPlan}
      </span>
    ),
  },
  {
    // validity
    title: "Validity",
    dataIndex: "validity",
    key: "validity",
    align: "center",
    render: (validity) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {validity}
      </span>
    ),
  },
  {
    // days
    title: "Days",
    dataIndex: "days",
    key: "days",
    align: "center",
    render: (days) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {days}
      </span>
    ),
  },
  {
    // products
    title: "Products",
    dataIndex: "products",
    key: "products",
    align: "center",
    render: (products) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {products}
      </span>
    ),
  },
];

const Discount = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Discount"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      // api={DISCOUNT}
    >
      <DiscountCreate />

      <DiscountTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default Discount;
