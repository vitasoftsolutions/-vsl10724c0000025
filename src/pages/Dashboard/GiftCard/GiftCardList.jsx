import { Row } from "antd";
import { useState } from "react";
import GiftCardCreate from "../../../components/GiftCard/GiftCardCreate";
import GiftCardTable from "../../../components/GiftCard/GiftCardTable";
import { GiftCardTypeFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { GIFT_CARD } from "../../../utilities/apiEndpoints/offer.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Card No",
    dataIndex: "cardNo",
    key: "cardNo",
    align: "center",
    render: (cardNo) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {cardNo}
      </span>
    ),
  },
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
    title: "Customer",
    dataIndex: "customer",
    key: "customer",
    render: (customer) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {customer}
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
    title: "Expense",
    dataIndex: "expense",
    key: "expense",
    render: (expense) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {expense}
      </span>
    ),
  },
  {
    title: "Balance",
    dataIndex: "balance",
    key: "balance",
    render: (balance) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {balance}
      </span>
    ),
  },

  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: "100px",
    align: "center",
    render: (status, record) => {
      return record?.handleStatusModal ? (
        <button
          className={`p-0 ${
            status == 1
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-[#FEF2F2] text-[#EF4444]"
          } rounded shadow-md w-[80px]`}
          onClick={() => record?.handleStatusModal(record.id)}
        >
          <span className="font-medium text-xs px-2 w-full">
            {status.toString() === "1" ? "Active" : "Inactive"}
          </span>
        </button>
      ) : (
        <div
          className={`p-0 ${
            status == 1
              ? "bg-[#DCFCE7] text-[#16A34A]"
              : "bg-[#FEF2F2] text-[#EF4444]"
          } rounded shadow-md w-[80px]`}
        >
          <span className="font-medium text-xs px-2 w-full">
            {status.toString() === "1" ? "Active" : "Inactive"}
          </span>
        </div>
      );
    },
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <GiftCardTypeFilter />
    </Row>
  );
};

const GiftCardList = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Gift Card"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={GIFT_CARD}
    >
      <GiftCardCreate />

      <GiftCardTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
export default GiftCardList;
