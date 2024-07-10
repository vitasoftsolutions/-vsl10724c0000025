import { useState } from "react";
import { RolesCreate } from "../../../components/Roles/RolesCreate";
import { RolesTable } from "../../../components/Roles/RolesTable";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { ROLE } from "../../../utilities/apiEndpoints/auth.api";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";

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
];

export const Roles = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Role Permission"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      // searchFilterContent={<SearchComponent />}
      api={ROLE}
    >
      <RolesCreate />

      <RolesTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};
