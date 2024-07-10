import { Spin, Table } from "antd";
import { tableProps } from "../../layout/TableLayout";
import { useGetTransferDetailsQuery } from "../../redux/services/transfer/transferApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";

const columns = [
  {
    title: "Product Name",
    dataIndex: "product_name",
    key: "product_name",
    render: (text) => (
      <span className="text-xs md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
  {
    title: "Quantity",
    dataIndex: "qty",
    key: "qty",
    align: "center",
    render: (text) => (
      <span className="text-xs md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
  {
    // price
    title: "Price",
    dataIndex: "price",
    key: "price",
    align: "center",
    render: (text) => (
      <span className="text-xs md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
];

export const TransferDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetTransferDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id }
  );

  const referenceId = createDetailsLayout({ reference_id: data?.reference_id });

  const warehouseDetails = createDetailsLayout({
    "warehouse_(from)": data?.from_warehouses,
    "warehouse_(to)": data?.to_warehouses,
  });

  const transferDetails = createDetailsLayout({
    item: data?.item,
    total_qty: data?.total_qty,
    total_tax: data?.total_tax,
    total_cost: data?.total_cost,
    shipping_cost: data?.shipping_cost,
    grand_total: data?.grand_total,
    status: data?.status,
  });

  const attachment = createDetailsLayout({
    attachments: data?.attachments,
  });

  const additionalInfo = createDetailsLayout({ note: data?.note });

  const title = () => (
    <span className="text-black font-semibold text-base -ml-2 ">
      Transfer Products
    </span>
  );

  const dataSource = data?.transfer_products?.map((item) => {
    return {
      id: item?.id,
      product_name:
        item?.products?.name ??
        "Unknown Product" +
          (item?.products?.sku ? ` (${item?.products?.sku})` : ""),
      qty: item.qty ?? "Unknown Quantity",
      price: item.net_unit_cost ?? "Unknown Price",
    };
  });

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pt-3 pb-5">
          <CustomDescription title="Reference" items={referenceId} />
          <CustomDescription title="Warehouse" items={warehouseDetails} />
          <CustomDescription title="Transfer " items={transferDetails} />

          <Table
            {...tableProps}
            title={title}
            columns={columns}
            dataSource={dataSource}
          />
          <CustomDescription title="Attachemnt " items={attachment} />
          <CustomDescription title="Additional" items={additionalInfo} />
        </div>
      )}
    </CustomModal>
  );
};
