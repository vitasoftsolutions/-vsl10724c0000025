import { useState } from "react";
import { PettyCashTable } from "../../../components/PettyCash/PettyCashTable";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { PETTY_CASH } from "../../../utilities/apiEndpoints/account.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Reference Id",
    dataIndex: "reference_id",
    key: "reference_id",
    align: "center",
    render: (reference_id) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {reference_id}
      </span>
    ),
  },
  {
    title: "User",
    dataIndex: "user",
    key: "user",
    render: (user) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {user}
      </span>
    ),
  },
  {
    title: "Warehouse",
    dataIndex: "warehouse",
    key: "warehouse",
    render: (warehouse) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {warehouse}
      </span>
    ),
  },
  {
    title: "Cash in Hand",
    dataIndex: "cash_in_hand",
    key: "cash_in_hand",
    render: (cash_in_hand) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {cash_in_hand}
      </span>
    ),
  },
  {
    title: "Open At",
    dataIndex: "open_at",
    key: "open_at",
    align: "center",
    render: (open_at) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {open_at}
      </span>
    ),
  },
  {
    title: "Closes At",
    dataIndex: "closes_at",
    key: "closes_at",
    align: "center",
    render: (closes_at) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {closes_at}
      </span>
    ),
  },
];

export const PettyCash = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Petty Cash"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      // searchFilterContent={<SearchComponent />}
      api={PETTY_CASH}
    >
      <PettyCashTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
