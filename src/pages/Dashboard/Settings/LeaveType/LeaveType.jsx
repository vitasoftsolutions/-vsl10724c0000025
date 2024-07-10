import { useState } from "react";
import { LeaveTypeCreate } from "../../../../components/LeaveType/LeaveTypeCreate";
import { LeaveTypeTable } from "../../../../components/LeaveType/LeaveTypeTable";
import GlobalContainer from "../../../../container/GlobalContainer/GlobalContainer";
import { LEAVE_TYPE } from "../../../../utilities/apiEndpoints/hrm.api";
import { useCustomDebounce } from "../../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {name}
      </span>
    ),
  },

  {
    title: "Attachmentable",
    dataIndex: "attachmentable",
    key: "attachmentable",
    align: "center",

    render: (attachmentable) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {attachmentable === 1 ? "Needed" : "Don't Needed"}
      </span>
    ),
  },
];

export const LeaveType = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Leave Type"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      // searchFilterContent={<SearchComponent />}
      api={LEAVE_TYPE}
    >
      <LeaveTypeCreate />

      <LeaveTypeTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
