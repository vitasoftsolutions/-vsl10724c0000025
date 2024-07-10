import { Spin, Table } from "antd";
import { tableProps } from "../../layout/TableLayout";
import { useGetAdjustmentDetailsQuery } from "../../redux/services/adjustment/adjustmentApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";
import { useGlobalParams } from "../../utilities/hooks/useParams";

const columns = [
  {
    title: "Product Name",
    dataIndex: "product_name",
    key: "product_name",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
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
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
  {
    title: "Action",
    dataIndex: "action",
    key: "action",
    align: "center",
    render: (text) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {text}
      </span>
    ),
  },
];

const AdjustmentDetails = ({ id, ...props }) => {
  const params = useGlobalParams({
    isRelationalParams: true,
  });

  const { data, isFetching } = useGetAdjustmentDetailsQuery(
    { id, params },
    { skip: !id }
  );

  const details = createDetailsLayout(data);

  const title = () => (
    <span className="text-black font-semibold text-base -ml-2">
      Adjustment Products
    </span>
  );

  const dataSource = data?.adjustment_products?.map((item) => {
    return {
      id: item.id,
      product_name:
        item?.products?.name ??
        "Unknown Product" +
          (item?.products?.sku ? ` (${item?.products?.sku})` : ""),
      qty: item.qty ?? "Unknown Quantity",
      action: item.action ?? "Unknown Action",
    };
  });

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pt-3 pb-5">
          <CustomDescription title="Adjustment " items={details} />
          <Table
            {...tableProps}
            title={title}
            columns={columns}
            dataSource={dataSource}
          />
        </div>
      )}
    </CustomModal>
  );
};

export default AdjustmentDetails;
