// import { PageHeader } from "@ant-design/pro-layout";

import { PageContainer } from "@ant-design/pro-layout";
import { Button, Table } from "antd";
import { FaCirclePlus } from "react-icons/fa6";
import { MdDeleteOutline, MdEditSquare } from "react-icons/md";
import fakeData from "./fakeData";

const columns = [
  {
    title: "Staff ID",
    dataIndex: "id",
    key: "id",
    fixed: "left",
    align: "center",
    width: 80,
    render: (id) => (
      <span className="text-sm font-medium md:text-xs text-dark dark:text-white87">
        {id}
      </span>
    ),
  },
  {
    title: "Img",
    dataIndex: "image",
    key: "image",
    fixed: "left",
    align: "center",
    width: 50,
    render: (img) => (
      <div className="w-8 h-8 rounded-full overflow-hidden mx-auto">
        <img
          src={img}
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
    fixed: "left",
    render: (name) => (
      <span className="text-sm font-medium md:text-xs text-dark dark:text-white87">
        {name}
      </span>
    ),
  },
  {
    //email
    title: "Email",
    dataIndex: "email",
    key: "email",
    render: (email) => (
      <span className="text-sm font-medium md:text-xs text-dark dark:text-white87">
        {email}
      </span>
    ),
  },
  {
    //phone
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
    render: (phone) => (
      <span className="text-sm font-medium md:text-xs text-dark dark:text-white87">
        {phone}
      </span>
    ),
  },
  {
    //department
    title: "Department",
    dataIndex: "department",
    key: "department",
    align: "center",
    render: (department) => (
      <span className="text-sm font-medium md:text-xs text-dark dark:text-white87">
        {department}
      </span>
    ),
  },
  {
    //action
    title: "Action",
    dataIndex: "action",
    key: "action",
    align: "center",
    width: 50,
    fixed: "right",
    render: () => (
      <div className="flex justify-center items-center gap-3 ">
        <Button className="flex items-center justify-center text-black border-none bg-transparent hover:bg-none hover:text-posPurple p-0">
          <MdEditSquare className="text-2xl" />
        </Button>

        <Button className="flex items-center justify-center text-black border-none bg-transparent hover:bg-none hover:text-posPurple p-0">
          <MdDeleteOutline className="text-2xl" />
        </Button>
      </div>
    ),
  },
];

const Hrm = () => {
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      //console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <div className="h-full ">
      <PageContainer
        title=<div className="text-xl md:text-3xl">HRM</div>
        subTitle={
          <Button
            type="text"
            icon={<FaCirclePlus />}
            className="flex justify-center items-center text-xl md:text-3xl hover:bg-none"
          />
        }
        extra={[]}
      >
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          size="small"
          columns={columns}
          dataSource={fakeData}
          pagination={{
            showTotal: (total) => `Total ${total} items`,
            showSizeChanger: true,
          }}
        />
      </PageContainer>
    </div>
  );
};

export default Hrm;
