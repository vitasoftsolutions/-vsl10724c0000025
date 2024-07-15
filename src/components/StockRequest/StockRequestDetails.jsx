import { Spin, Table } from "antd";
import { useGetStockRequestDetailsQuery } from "../../redux/services/stockRequest/stockRequestApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import CustomModal from "../Shared/Modal/CustomModal";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import { tableProps } from "../../layout/TableLayout";

const productReqTable = [
  {
    //name
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
    //name
    title: "Sku",
    dataIndex: "sku",
    key: "sku",
    align: "center",
    render: (sku) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {sku}
      </span>
    ),
  },
  {
    //name
    title: "Alert Qty",
    dataIndex: "alertQty",
    key: "alertQty",
    render: (alertQty) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {alertQty}
      </span>
    ),
  },
  {
    title: "Request Qty",
    dataIndex: "reqQty",
    key: "reqQty",
    render: (reqQty) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {reqQty}
      </span>
    ),
  },
];

export const StockRequestDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetStockRequestDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id }
  );

  const warehouseInfo = createDetailsLayout({
    warehouse_from: data?.from_warehouses?.name,
    request_warehouse: data?.to_warehouses?.name,
  });

  const productReqTitle = () => (
    <span className="text-black font-semibold text-base -ml-2">
      Product Request List
    </span>
  );

  const requestProducts = data?.stock_request_products?.map((item) => {
    return {
      name: item?.products?.name ?? "Unknown Product",
      sku: item?.products?.sku ?? "Unknown Quantity",
      alertQty: item?.alert_qty ?? "Unknown Quantity",
      reqQty: item?.need_qty ?? "Unknown Quantity",
    };
  });

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pt-3 pb-5">
          <CustomDescription title="Basic Info" items={warehouseInfo} />
          <Table
            {...tableProps}
            title={productReqTitle}
            columns={productReqTable}
            dataSource={requestProducts}
          />
        </div>
      )}
    </CustomModal>
  );
};
