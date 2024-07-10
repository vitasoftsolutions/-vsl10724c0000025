import { Descriptions, Row, Spin, Tabs } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import { WarehouseFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { rowLayout } from "../../../layout/FormLayout";
import { useCurrentUser } from "../../../redux/services/auth/authSlice";
import { useGetWarehouseDetailsQuery } from "../../../redux/services/warehouse/warehouseApi";
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

const SearchFilterComponent = () => {
  return (
    <Row {...rowLayout}>
      <WarehouseFilter fullLayout={true} multiple={false} />
    </Row>
  );
};

export const WarehouseReport = () => {
  const user = useSelector(useCurrentUser);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  const { data, isFetching } = useGetWarehouseDetailsQuery(
    {
      id: user?.warehouse_id,
    },
    { skip: !user?.warehouse_id }
  );

  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(false);

  const summaryDetails = createDetailsLayout(summaryData);

  console.log(searchParams);

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
      label: "Warehouse",
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
      pageTitle="Warehouse Report"
      popoverWidth={400}
      searchFilterContent={<SearchFilterComponent />}
      debounce={debounce}
      setParams={setParams}
    >
      <div className=" w-full grid grid-cols-2 gap-4 mb-5">
        <div className="border rounded-md p-4 shadow-sm">
          {isFetching ? (
            <Spin className="w-full h-full flex justify-center items-center py-5" />
          ) : (
            <Descriptions
              title="Warehouse Details"
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
              children: <SaleTable {...props} summary={"warehouse,sale"} />,
            },
            {
              label: "Purchase",
              key: "purchase",
              children: (
                <PurchaseTable {...props} summary={"warehouse,purchase"} />
              ),
            },
            {
              label: "Quotation",
              key: "quotation",
              children: (
                <QuotationTable {...props} summary={"warehouse,quotation"} />
              ),
            },
            {
              label: "Purchase Return",
              key: "purchasereturn",
              children: (
                <PurchaseReturnTable
                  {...props}
                  summary={"warehouse,purchasereturn"}
                />
              ),
            },
            {
              label: "Sale Return",
              key: "salereturn",
              children: (
                <SaleReturnTable {...props} summary={"warehouse,salereturn"} />
              ),
            },
            {
              label: "Expense",
              key: "expense",
              children: (
                <ExpenseTable {...props} summary={"warehouse,expense"} />
              ),
            },
          ]}
        />
      ) : (
        <Spin className="w-full h-full flex justify-center items-center py-10" />
      )}
    </GlobalContainer>
  );
};
