import { useState } from "react";
import { AnnoucementCreate } from "../../../components/Announcement/AnnouncementCreate";
import { AnnouncementTable } from "../../../components/Announcement/AnnouncementTable";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { ANNOUNCEMENT } from "../../../utilities/apiEndpoints/hrm.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";
import { rowLayout } from "../../../layout/FormLayout";
import { Row } from "antd";
import { DepartmentFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";

const columns = [
  {
    title: "Title",
    dataIndex: "name",
    key: "name",
    render: (name) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {name}
      </span>
    ),
  },
  {
    title: "Departments",
    dataIndex: "departments",
    key: "departments",
    width: 300,
    render: (departments) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {departments?.mp((item) => item?.name)}
      </span>
    ),
  },
  {
    title: "Start Date",
    dataIndex: "startDate",
    key: "startDate",
    render: (startDate) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {startDate}
      </span>
    ),
  },
  {
    title: "End Date",
    dataIndex: "endDate",
    key: "endDate",
    render: (endDate) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {endDate}
      </span>
    ),
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 300,
    render: (description) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {description ?? "N/A"}
      </span>
    ),
  },
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <DepartmentFilter />
    </Row>
  );
};

export const Announcement = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Announcement"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={ANNOUNCEMENT}
    >
      <AnnoucementCreate />

      <AnnouncementTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
