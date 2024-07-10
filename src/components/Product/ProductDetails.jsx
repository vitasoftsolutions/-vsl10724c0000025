import { Descriptions, Spin, Table } from "antd";
import parse from "html-react-parser";
import { detailsLayout } from "../../layout/DescriptionLayout";
import { useGetProductDetailsQuery } from "../../redux/services/product/productApi";
import createDetailsLayout from "../../utilities/lib/createDetailsLayout";
import { CustomDescription } from "../Shared/Description/CustomDescription";
import CustomModal from "../Shared/Modal/CustomModal";
import { tableProps } from "../../layout/TableLayout";
import { useSelector } from "react-redux";
import { useCurrency } from "../../redux/services/pos/posSlice";
import { showCurrency } from "../../utilities/lib/currency";

const productQtyColumn = [
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
    title: "Quantity",
    dataIndex: "qty",
    key: "qty",
    render: (qty) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {qty}
      </span>
    ),
  },
];

const priceQtyColumn = [
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
    title: "Quantity",
    dataIndex: "qty",
    key: "qty",
    render: (qty) => (
      <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
        {qty}
      </span>
    ),
  },
];

export const ProductDetails = ({ id, ...props }) => {
  const { data, isFetching } = useGetProductDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id }
  );

  const basicInfo = createDetailsLayout({
    name: data?.name,
    sku: data?.sku,
    type: data?.type,
    symbology: data?.symbology,
  });

  const categoryInfo = createDetailsLayout({
    brand: data?.brands?.name,
    category: data?.categories?.name,
    unit: data?.units?.name,
    purchase_unit: data?.purchase_units?.name,
    sale_unit: data?.sale_units?.name,
  });

  const pricingInfo = createDetailsLayout({
    buying_price: data?.buying_price,
    selling_price: data?.selling_price,
    profit: data?.profit,
  });

  const inventoryInfo = createDetailsLayout({
    has_stock: data?.has_stock,
    quantity: data?.qty,
    alert_qty: data?.alert_qty,
    daily_sale_qty: data?.daily_sale_qty,
    qty_list: data?.qty_list,
  });

  const qtyTitle = () => (
    <span className="text-black font-semibold text-base -ml-2">
      Warehouse Inventory List
    </span>
  );

  const qtyDataSource = data?.product_qties?.map((item) => {
    return {
      id: item?.warehouses?.id,
      name: item?.warehouses?.name ?? "Unknown Warehouse",
      qty: item?.qty ?? "Unknown Quantity",
    };
  });

  const featuresInfo = createDetailsLayout({
    has_featured: data?.has_featured,
    has_promotion: data?.has_promotion,
    promotion_price: data?.promotion_price,
    starting_date: data?.starting_date,
    last_date: data?.last_date,
    has_different_price: data?.has_different_price,
    has_expired_date: data?.has_expired_date,
    expired_date: data?.expired_date,
  });

  const variantsInfo = createDetailsLayout({
    has_variants: data?.has_variant,
    variant_list: data?.variant_list,
  });

  const taxInfo = createDetailsLayout({
    tax: data?.taxes?.rate,
    tax_method: data?.tax_method,
  });

  // const miscellaneousInfo = createDetailsLayout({
  //   ecommerce_sync: data?.ecommerce_sync,
  //   embedded_barcode: data?.embedded_barcode,
  // });

  const productAttachments = createDetailsLayout(
    {
      attachments: data?.attachments,
    },
    true
  );

  const priceTitle = () => (
    <span className="text-black font-semibold text-base -ml-2">
      Warehouse Price List
    </span>
  );

  const currency = useSelector(useCurrency);

  const priceDataSource = data?.product_prices?.map((item) => {
    console.log(item);

    return {
      id: item?.warehouses?.id,
      name: item?.warehouses?.name ?? "Unknown Warehouse",
      qty: showCurrency(item?.price, currency) ?? "Unknown Quantity",
    };
  });

  return (
    <CustomModal {...props}>
      {isFetching ? (
        <Spin className="w-full flex justify-center items-center mt-10" />
      ) : (
        <div className="space-y-5 max-h-[75vh] overflow-y-auto pt-3 pb-5">
          <CustomDescription title="Basic Info" items={basicInfo} />
          <CustomDescription title="Category & Units" items={categoryInfo} />
          <CustomDescription title="Inventory Info" items={inventoryInfo} />
          <Table
            {...tableProps}
            title={qtyTitle}
            columns={productQtyColumn}
            dataSource={qtyDataSource}
          />
          <CustomDescription title="Pricing Info" items={pricingInfo} />
          <Table
            {...tableProps}
            title={priceTitle}
            columns={priceQtyColumn}
            dataSource={priceDataSource}
          />

          <CustomDescription title="Features Info" items={featuresInfo} />
          <CustomDescription title="Variant Info" items={variantsInfo} />
          <CustomDescription title="Tax Info" items={taxInfo} />
          {/* <CustomDescription
            title="Miscellaneous Info"
            items={miscellaneousInfo}
          /> */}

          <CustomDescription
            title="Attachments"
            items={productAttachments}
            nostyle={true}
          />

          <Descriptions {...detailsLayout} title="Additional Info">
            <Descriptions.Item label="Details">
              <div>{parse(data?.details)}</div>
            </Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </CustomModal>
  );
};
