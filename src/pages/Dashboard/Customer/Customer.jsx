import { Row } from "antd";
import { useState } from "react";
import CustomerCreate from "../../../components/Customer/CustomerCreate";
import CustomerTable from "../../../components/Customer/CustomerTable";
import { CustomerGroupFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { CUSTOMER } from "../../../utilities/apiEndpoints/people.api";
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
    title: "Customer Group",
    dataIndex: "customerGroup",
    key: "customerGroup",
    align: "center",
    render: (customerGroup) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {customerGroup}
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
];

const SearchComponent = () => {
  return (
    <Row {...rowLayout}>
      <CustomerGroupFilter />
    </Row>
  );
};

const Customer = () => {
  const [newColumns, setNewColumns] = useState(columns);
  const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  return (
    <GlobalContainer
      pageTitle="Customer"
      columns={columns}
      selectedRows={selectedRows}
      debounce={debounce}
      setSelectedRows={setSelectedRows}
      setNewColumns={setNewColumns}
      setParams={setParams}
      searchFilterContent={<SearchComponent />}
      api={CUSTOMER}
    >
      <CustomerCreate />

      <CustomerTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      />
    </GlobalContainer>
  );
};

export default Customer;
