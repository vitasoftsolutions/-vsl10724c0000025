import { Row } from "antd";
import { useState } from "react";
import AdjustmentCreate from "../../../components/Adjustment/AdjustmentCreate";
import AdjustmentTable from "../../../components/Adjustment/AdjustmentTable";
import { WarehouseFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { ADJUSTMENT } from "../../../utilities/apiEndpoints/inventory.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Reference ID",
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
    title: "Note",
    dataIndex: "note",
    key: "note",
    render: (note) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {note ?? "N/A"}
      </span>
    ),
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <WarehouseFilter />
    </Row>
  );
};

const AdjustmentList = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Adjustment"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={ADJUSTMENT}
    >
      <AdjustmentCreate />

      <AdjustmentTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default AdjustmentList;
