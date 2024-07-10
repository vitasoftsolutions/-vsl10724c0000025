import { Spin, Table } from "antd";
import { tableProps } from "../../layout/TableLayout";
import { useGetSaleDetailsQuery } from "../../redux/services/sale/saleApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";
import { useSelector } from "react-redux";
import { useCurrency } from "../../redux/services/pos/posSlice";
import { showCurrency } from "../../utilities/lib/currency";

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

export const SaleDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetSaleDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id }
  );

  //console.log(data);

  //   const details = createDetailsLayout(data);

  const currency = useSelector(useCurrency);

  const basicInfo = createDetailsLayout({
    reference_id: data?.reference_id,
    cashier: data?.cashiers?.name,
    warehouse: data?.warehouses?.name,
    supplier: data?.suppliers?.name,
  });

  const paymentInfo = createDetailsLayout({
    order_tax: data?.tax,
    order_discount: showCurrency(data?.discount, currency),
    coupon_discount: data?.coupon_discount,
    shipping_cost: data?.shipping_cost,
    grand_total: data?.grand_total,
    paid_amount: data?.paid_amount,
    due_amount: data?.due_amount,
    payment_type: data?.payment_type,
    payment_status: data?.purchase_status,
  });

  const saleStatus = createDetailsLayout({
    sale_date: data?.sale_at,
    sale_status: data?.sale_status,
    sale_note: data?.sale_note,
  });

  const additionalInfo = createDetailsLayout({
    staff_note: data?.staff_note,
  });

  const attachments = createDetailsLayout({
    attachments: data?.attachments,
  });

  const title = () => (
    <span className="text-black font-semibold text-base -ml-2">
      Purchase Products
    </span>
  );

  const dataSource = data?.sale_products?.map((item) => {
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
          {/* <CustomDescription title="Sale " items={details} /> */}
          <CustomDescription title="Basic Info" items={basicInfo} />
          <CustomDescription title="Sale Info" items={saleStatus} />
          <Table
            {...tableProps}
            title={title}
            columns={columns}
            dataSource={dataSource}
          />
          <CustomDescription title="Payment Info" items={paymentInfo} />
          <CustomDescription title="Attachments" items={attachments} />
          <CustomDescription title="Additional Info" items={additionalInfo} />
        </div>
      )}
    </CustomModal>
  );
};
