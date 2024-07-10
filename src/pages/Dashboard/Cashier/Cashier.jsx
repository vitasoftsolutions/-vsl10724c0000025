import { useState } from "react";
import CashierCreate from "../../../components/Cashier/CashierCreate";
import CashierTable from "../../../components/Cashier/CashierTable";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { CASHIER } from "../../../utilities/apiEndpoints/people.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    fixed: "left",
    render: ({ name, email }) => (
      <div className="flex flex-col cursor-pointer ">
        <span className="text-xs md:text-sm text-dark dark:text-white87 font-medium">
          {name}
        </span>
        <span className="text-xs dark:text-white60 primary-text">{email}</span>
      </div>
    ),
  },
  {
    title: "Company Name",
    dataIndex: "companyName",
    key: "companyName",
    render: (companyName) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {companyName}
      </span>
    ),
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {phone}
      </span>
    ),
  },
  {
    title: "Vat Number",
    dataIndex: "vatNumber",
    key: "vatNumber",
    render: (vatNumber) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {vatNumber ?? "N/A"}
      </span>
    ),
  },
];

const Cashier = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Cashier"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      // searchFilterContent={<SearchComponent />}
      api={CASHIER}
    >
      <CashierCreate />

      <CashierTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default Cashier;
