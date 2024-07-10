import { useState } from "react";
import CurrencyCreate from "../../../components/Currency/CurrencyCreate";
import CurrencyTable from "../../../components/Currency/CurrencyTable";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { CURRENCY } from "../../../utilities/apiEndpoints/helper.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
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
    title: "Code",
    dataIndex: "code",
    key: "code",
    align: "center",
    render: (code) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {code}
      </span>
    ),
  },
  {
    title: "Exchange Rate",
    dataIndex: "exchangeRate",
    key: "exchangeRate",
    align: "center",
    render: (exchangeRate) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {exchangeRate}
      </span>
    ),
  },
];

const CurrencyList = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Currency"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      // searchFilterContent={<SearchComponent />}
      api={CURRENCY}
    >
      <CurrencyCreate />

      <CurrencyTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default CurrencyList;
