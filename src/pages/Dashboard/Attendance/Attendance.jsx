import { Row } from "antd";
import { useState } from "react";
import defaultUser from "../../../assets/data/defaultUserImage";
import AttendanceCreate from "../../../components/Attendance/AttendanceCreate";
import { AttendanceTable } from "../../../components/Attendance/AttendanceTable";
import {
  DepartmentFilter,
  EmployeeFilter,
} from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { ATTENDANCE } from "../../../utilities/apiEndpoints/hrm.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

const columns = [
  {
    title: "Img",
    dataIndex: "image",
    key: "image",
    fixed: "left",
    align: "center",
    width: 70,
    render: (img) => (
      <div className="w-8 h-8 rounded-full overflow-hidden mx-auto">
        <img
          src={img ?? defaultUser}
          alt="defaultUser"
          className="w-full h-full object-cover"
        />
      </div>
    ),
  },
  {
    title: "Name",
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
    //phone
    title: "Check In",
    dataIndex: "checkIn",
    key: "checkIn",
    align: "center",
    render: (checkIn) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {checkIn}
      </span>
    ),
  },
  {
    //phone
    title: "Check Out",
    dataIndex: "checkOut",
    key: "checkOut",
    align: "center",
    render: (checkOut) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {checkOut}
      </span>
    ),
  },
  {
    //phone
    title: "Attendance Date",
    dataIndex: "date",
    key: "date",
    align: "center",
    render: (date) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {date}
      </span>
    ),
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <DepartmentFilter />
      <EmployeeFilter />
    </Row>
  );
};

export const Attendance = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Attendance"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={ATTENDANCE}
    >
      <AttendanceCreate />

      <AttendanceTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
