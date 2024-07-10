import { Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  selectPagination,
  updatePage,
  updatePageSize,
} from "../../../redux/services/pagination/paginationSlice";

const CustomProductTable = ({
  columns,
  dataSource,
  isRowSelection = false,
  total,
  setSelectedRows,
  isLoading,
  showPaging = true,
  tableStyleProps = {},
}) => {
  const dispatch = useDispatch();

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const pagination = useSelector(selectPagination);

  const handlePageChange = (newPage) => {
    dispatch(updatePage({ page: newPage }));
  };

  const handlePageSizeChange = (newPageSize) => {
    dispatch(updatePageSize({ perPage: newPageSize }));
  };

  const tableProps = {
    size: "small",
    style: {
      width: "100%",
    },
    rowKey: (record) => record.id,
    rowSelection: isRowSelection
      ? {
          type: "checkbox",
          ...rowSelection,
        }
      : false,
    onRow: (record) => ({
      onClick: () => console.log(record.id),
    }),
    loading: isLoading,
    scroll: {
      x: "max-content",
      // y: 340,
    },

    ...tableStyleProps,
  };

  const paginationProps = {
    size: "default",
    total: total,
    defaultCurrent: 1,
    current: pagination.page,
    onChange: (page) => {
      handlePageChange(page);
    },
    showSizeChanger: true,
    // hideOnSinglePage: true,
    defaultPageSize: pagination.perPage,
    onShowSizeChange: (current, size) => {
      handlePageSizeChange(size);
    },
    showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
  };

  // const newColumns = [...columns];

  return (
    <Table
      {...tableProps}
      columns={columns}
      dataSource={dataSource}
      pagination={showPaging ? { ...paginationProps } : false}
      // summary={() => {
      //   return (
      //     <Table.Summary fixed="bottom">
      //       <Table.Summary.Row>
      //         <Table.Summary.Cell index={1} colSpan={3}>
      //           <Text className="font-bold" type="">
      //             Total
      //           </Text>
      //         </Table.Summary.Cell>

      //         <Table.Summary.Cell index={2} align="center">
      //           <Text type="" className="font-bold">
      //             {qty}
      //           </Text>
      //         </Table.Summary.Cell>
      //         <Table.Summary.Cell index={3} align="center">
      //           <Text type="" className="font-bold">
      //             {subTotal}
      //           </Text>
      //         </Table.Summary.Cell>
      //       </Table.Summary.Row>
      //     </Table.Summary>
      //   );
      // }}
      // sticky={{
      //   // offsetHeader: 440,
      //   offsetScroll: 400,
      // }}
    />
  );
};

export default CustomProductTable;
