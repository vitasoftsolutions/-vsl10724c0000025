import { Spin, Table } from "antd";
import { tableProps } from "../../layout/TableLayout";
import { useGetSaleReturnDetailsQuery } from "../../redux/services/return/saleReturnApi";
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

export const SaleReturnDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetSaleReturnDetailsQuery(
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

  const benDetails = createDetailsLayout({
    warehouse: data?.warehouses,
    cashier: data?.cashiers,
    customer: data?.customers,
  });

  const saleReturnDetails = createDetailsLayout({
    item: data?.item,
    total_qty: data?.total_qty,
    total_tax: data?.total_tax,
    total_price: data?.total_price,
    tax: data?.tax,
    grand_total: data?.grand_total,

    return_amount: data?.return_amount,
    due_amount: data?.due_amount,
    return_payment_type: data?.return_payment_type,
  });

  const attachment = createDetailsLayout({
    attachments: data?.attachments,
  });

  const additionalInfo = createDetailsLayout({
    return_note: data?.return_note,
    staff_note: data?.staff_note,
  });

  const title = () => (
    <span className="text-black font-semibold text-base -ml-2">
      Sale Return Products
    </span>
  );

  const dataSource = data?.sale_return_products?.map((item) => {
    return {
      id: item?.id,
      product_name:
        item?.products?.name ??
        "Unknown Product" +
          (item?.products?.sku ? ` (${item?.products?.sku})` : ""),
      qty: item.qty ?? "Unknown Quantity",
      price: item.net_unit_price ?? "Unknown Price",
    };
  });

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pt-3 pb-5">
          <CustomDescription title="Reference" items={referenceId} />
          <CustomDescription title="Beneficiary " items={benDetails} />

          <CustomDescription title="Sale Return" items={saleReturnDetails} />
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
