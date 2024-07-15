import { Descriptions, Row, Spin, Tabs } from "antd";
import { useState } from "react";
import { ProductFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { useGetProductDetailsQuery } from "../../../redux/services/product/productApi";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import { useFilterParams } from "../../../utilities/hooks/useParams";
import createDetailsLayout from "../../../utilities/lib/createDetailsLayout";
import { ExpenseTable } from "./components/ExpenseTable";
import { PurchaseReturnTable } from "./components/PurchaseReturnTable";
import { PurchaseTable } from "./components/PurchaseTable";
import { QuotationTable } from "./components/QutationTable";
import { SaleReturnTable } from "./components/SaleReturnTable";
import { SaleTable } from "./components/SaleTable";
import { getLastWeek } from "../../../utilities/lib/getLastWeek";

// const columns = [
//   {
//     title: "Product",
//     dataIndex: "product",
//     key: "product",
//     render: (product) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {product}
//       </span>
//     ),
//   },
//   {
//     title: "Category",
//     dataIndex: "category",
//     key: "category",
//     render: (category) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {category}
//       </span>
//     ),
//   },
//   {
//     title: "Brand",
//     dataIndex: "brand",
//     key: "brand",
//     render: (brand) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {brand}
//       </span>
//     ),
//   },
//   {
//     title: "Purchased Qty",
//     dataIndex: "purchasedQty",
//     key: "purchasedQty",
//     render: (qty) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {qty}
//       </span>
//     ),
//   },
//   {
//     title: "Purchased Amount",
//     dataIndex: "purchasedAmount",
//     key: "purchasedAmount",
//     render: (amount) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {amount}
//       </span>
//     ),
//   },
//   {
//     title: "Sold Qty",
//     dataIndex: "soldQty",
//     key: "soldQty",
//     render: (qty) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {qty}
//       </span>
//     ),
//   },
//   {
//     title: "Sold Amount",
//     dataIndex: "soldAmount",
//     key: "soldAmount",
//     render: (amount) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {amount}
//       </span>
//     ),
//   },
//   {
//     title: "Sale Returned Qty",
//     dataIndex: "saleReturnedQty",
//     key: "saleReturnedQty",
//     render: (qty) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {qty}
//       </span>
//     ),
//   },
//   {
//     title: "Returned Amount",
//     dataIndex: "returnedAmount",
//     key: "returnedAmount",
//     render: (amount) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {amount}
//       </span>
//     ),
//   },
//   {
//     title: "Purchase Returned Qty",
//     dataIndex: "purchaseReturnedQty",
//     key: "purchaseReturnedQty",
//     render: (qty) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {qty}
//       </span>
//     ),
//   },
//   {
//     title: "Purchase Returned Amount",
//     dataIndex: "purchaseReturnedAmount",
//     key: "purchaseReturnedAmount",
//     render: (amount) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {amount}
//       </span>
//     ),
//   },
//   {
//     title: "Profit",
//     dataIndex: "profit",
//     key: "profit",
//     render: (profit) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {profit}
//       </span>
//     ),
//   },
//   {
//     title: "In Stock",
//     dataIndex: "inStock",
//     key: "inStock",
//     render: (stock) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {stock}
//       </span>
//     ),
//   },
//   {
//     title: "Stock Worth (Price/Cost)",
//     dataIndex: "stockWorth",
//     key: "stockWorth",
//     render: (worth) => (
//       <span className="text-xs font-medium md:text-sm text-dark dark:text-white87">
//         {worth}
//       </span>
//     ),
//   },
// ];

const SearchFilterComponent = () => {
  return (
    <Row {...rowLayout}>
      <ProductFilter fullLayout={true} multiple={false} />
    </Row>
  );
};

export const ProductReport = () => {
  // const [newColumns, setNewColumns] = useState(columns);
  // const [selectedRows, setSelectedRows] = useState([]);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  const product_id = 8;

  const { data, isFetching } = useGetProductDetailsQuery(
    {
      id: product_id,
    },
    { skip: !product_id }
  );

  console.log(data);

  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(false);

  const summaryDetails = createDetailsLayout(summaryData);

  const summaryType = {
    warehouse_ids: searchParams?.warehouse_ids
      ? searchParams?.warehouse_ids
      : data?.id,

    start_date:
      searchParams?.created_daterange?.[0] ??
      getLastWeek()[0].format("YYYY-MM-DD"),
    end_date:
      searchParams?.created_daterange?.[1] ??
      getLastWeek()[1].format("YYYY-MM-DD"),
  };

  const warehouseItems = [
    {
      key: "1",
      label: "Product",
      children: data?.name,
      span: 24,
    },
    {
      key: "2",
      label: "Email",
      children: data?.email ?? "---",
      span: 24,
    },
    {
      key: "3",
      label: "Phone Number",
      children: data?.phone ?? "---",
      span: 24,
    },
    {
      key: "5",
      label: "Address",
      children: data?.address ?? "---",
      span: 24,
    },
  ];

  const props = {
    keyword,
    summaryType,
    setSummaryData,
    setLoading,
  };

  return (
    <GlobalContainer
      pageTitle="Product Report"
      // columns={columns}
      popoverWidth={400}
      searchFilterContent={<SearchFilterComponent />}
      // selectedRows={selectedRows}
      debounce={debounce}
      // setSelectedRows={setSelectedRows}
      // setNewColumns={setNewColumns}
      setParams={setParams}
      // searchFilterContent={<SearchComponent />}
      // api={PRODUCT}
    >
      {/* <Tabs
        defaultActiveKey="sale"
        items={[
          {
            label: "Sale",
            key: "sale",
            children: <SaleTable {...props} summary={"product,sale"} />,
          },
          {
            label: "Purchase",
            key: "purchase",
            children: <PurchaseTable {...props} summary={"product,purchase"} />,
          },
          {
            label: "Quotation",
            key: "quotation",
            children: (
              <QuotationTable {...props} summary={"product,quotation"} />
            ),
          },
          {
            label: "Purchase Return",
            key: "purchasereturn",
            children: (
              <PurchaseReturnTable
                {...props}
                summary={"product,purchasereturn"}
              />
            ),
          },
          {
            label: "Sale Return",
            key: "salereturn",
            children: (
              <SaleReturnTable {...props} summary={"product,salereturn"} />
            ),
          },
          {
            label: "Expense",
            key: "expense",
            children: <ExpenseTable {...props} summary={"product,expense"} />,
          },
        ]}
      /> */}

      <div className=" w-full grid grid-cols-2 gap-4 mb-5">
        <div className="border rounded-md p-4 shadow-sm">
          {isFetching ? (
            <Spin className="w-full h-full flex justify-center items-center py-5" />
          ) : (
            <Descriptions
              title="Product Details"
              layout=""
              items={warehouseItems}
            />
          )}
        </div>
        <div className="border rounded-md p-4 shadow-sm">
          {isFetching || loading ? (
            <Spin className="w-full h-full flex justify-center items-center " />
          ) : (
            <Descriptions title="Summary" items={summaryDetails} />
          )}
        </div>
      </div>
      {data ? (
        <Tabs
          defaultActiveKey="sale"
          items={[
            {
              label: "Sale",
              key: "sale",
              children: <SaleTable {...props} summary={"product,sale"} />,
            },
            {
              label: "Purchase",
              key: "purchase",
              children: (
                <PurchaseTable {...props} summary={"product,purchase"} />
              ),
            },
            {
              label: "Quotation",
              key: "quotation",
              children: (
                <QuotationTable {...props} summary={"product,quotation"} />
              ),
            },
            {
              label: "Purchase Return",
              key: "purchasereturn",
              children: (
                <PurchaseReturnTable
                  {...props}
                  summary={"product,purchasereturn"}
                />
              ),
            },
            {
              label: "Sale Return",
              key: "salereturn",
              children: (
                <SaleReturnTable {...props} summary={"product,salereturn"} />
              ),
            },
            {
              label: "Expense",
              key: "expense",
              children: <ExpenseTable {...props} summary={"product,expense"} />,
            },
          ]}
        />
      ) : (
        <Spin className="w-full h-full flex justify-center items-center py-10" />
      )}

      {/* <ProductReportTable
        newColumns={newColumns}
        keyword={keyword}
        setSelectedRows={setSelectedRows}
        searchParams={searchParams}
      /> */}
    </GlobalContainer>
  );
};
