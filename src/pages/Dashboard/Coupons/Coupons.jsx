import { Row } from "antd";
import { useState } from "react";
import CouponsCreate from "../../../components/Coupons/CouponsCreate";
import CouponsTable from "../../../components/Coupons/CouponsTable";
import { CouponTypeFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { COUPON } from "../../../utilities/apiEndpoints/offer.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Coupon Code",
    dataIndex: "couponCode",
    key: "couponCode",
    align: "center",
    render: (couponCode) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {couponCode}
      </span>
    ),
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    align: "center",
    render: (type) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {type}
      </span>
    ),
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
    render: (amount) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {amount}
      </span>
    ),
  },
  {
    title: "Minimum Amount",
    dataIndex: "minimumAmount",
    key: "minimumAmount",
    render: (minimumAmount) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {minimumAmount}
      </span>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "quantity",
    key: "quantity",
    align: "center",
    render: (quantity) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {quantity}
      </span>
    ),
  },
  // {
  //   title: "Available",
  //   dataIndex: "available",
  //   key: "available",
  //   align: "center",
  //   render: (available) => (
  //     <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
  //       {available}
  //     </span>
  //   ),
  // },
  {
    title: "Created By",
    dataIndex: "createdBy",
    key: "createdBy",
    render: (createdBy) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {createdBy}
      </span>
    ),
  },
  {
    title: "Coupon Issue",
    dataIndex: "createdAt",
    key: "createdAt",
    align: "center",
    render: (createdAt) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {createdAt}
      </span>
    ),
  },
  {
    title: "Coupon Expired",
    dataIndex: "expiredAt",
    key: "expiredAt",
    align: "center",
    render: (expiredAt) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {expiredAt}
      </span>
    ),
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <CouponTypeFilter />
    </Row>
  );
};

const Coupons = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Coupons"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={COUPON}
    >
      <CouponsCreate />

      <CouponsTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default Coupons;
