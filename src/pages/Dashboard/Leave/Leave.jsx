import { Row } from "antd";
import { useState } from "react";
import { LeaveCreate } from "../../../components/Leave/LeaveCreate";
import { LeaveTable } from "../../../components/Leave/LeaveTable";
import {
  DepartmentFilter,
  EmployeeFilter,
  LeaveTypeFilter,
} from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { LEAVE } from "../../../utilities/apiEndpoints/hrm.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Employee Name",
    dataIndex: "name",
    key: "name",
    render: (name, record) => (
      <div className="flex flex-col cursor-pointer ">
        <span className="text-xs md:text-sm text-dark dark:text-white87 font-medium">
          {name}
        </span>
        <span className="text-xs dark:text-white60 primary-text">
          {record?.email}
        </span>
      </div>
    ),
  },
  {
    title: "Leave Type",
    dataIndex: "leaveType",
    key: "leaveType",
    render: (leaveType) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {leaveType}
      </span>
    ),
  },
  {
    title: "Leave Duration",
    dataIndex: "leaveDuration",
    key: "leaveDuration",
    align: "center",
    render: (leaveDuration) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {leaveDuration}
      </span>
    ),
  },
  {
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
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <DepartmentFilter />
      <EmployeeFilter />
      <LeaveTypeFilter />
    </Row>
  );
};

export const Leave = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Leave"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={LEAVE}
    >
      <LeaveCreate />

      <LeaveTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
