import { Button, Col, Descriptions, Form, Row, Spin, Tabs } from "antd";
import { useState } from "react";
import { SupplierFilter } from "../../../components/ReusableComponent/SearchFormComponents/SearchFormComponent";
import CustomForm from "../../../components/Shared/Form/CustomForm";
import CustomModal from "../../../components/Shared/Modal/CustomModal";
import CustomSelect from "../../../components/Shared/Select/CustomSelect";
import GlobalContainer from "../../../container/GlobalContainer/GlobalContainer";
import { fullColLayout, rowLayout } from "../../../layout/FormLayout";
import {
  useGetAllSupplierQuery,
  useGetSupplierDetailsQuery,
} from "../../../redux/services/supplier/supplierApi";
import { useCustomDebounce } from "../../../utilities/hooks/useDebounce";
import {
  DEFAULT_SELECT_VALUES,
  useFilterParams,
  useGlobalParams,
} from "../../../utilities/hooks/useParams";
import createDetailsLayout from "../../../utilities/lib/createDetailsLayout";
import { PurchaseReturnTable } from "./components/PurchaseReturnTable";
import { PurchaseTable } from "./components/PurchaseTable";
import { QuotationTable } from "./components/QutationTable";
import { SaleReturnTable } from "./components/SaleReturnTable";

const SearchFilterComponent = () => {
  return (
    <Row {...rowLayout}>
      <SupplierFilter fullLayout={true} multiple={false} />
    </Row>
  );
};

const SupplierModal = ({ setSupplierId, open, setOpen }) => {
  const [supplierForm] = Form.useForm();

  const hideModal = () => {
    setOpen(false);
  };

  const params = useGlobalParams({
    selectValue: DEFAULT_SELECT_VALUES,
  });

  const { data, isLoading } = useGetAllSupplierQuery({ params });

  const options = data?.results?.supplier?.map((supplier) => ({
    value: supplier?.id?.toString(),
    label: supplier?.name,
  }));

  const handleSubmit = (values) => {
    console.log(values);
    setSupplierId(values?.supplier_id);
    hideModal();
  };

  return (
    <CustomModal
      title="Select Supplier"
      openModal={open}
      hideModal={hideModal}
      showCloseButton={false}
      width={600}
    >
      <CustomForm
        Form={supplierForm}
        submitBtn={false}
        handleSubmit={handleSubmit}
      >
        <Row {...rowLayout}>
          <Col {...fullColLayout}>
            <CustomSelect
              // label="Supplier"
              placeholder={"Supplier"}
              options={options}
              isLoading={isLoading}
              required={true}
              name={"supplier_id"}
            />
          </Col>

          <Col {...fullColLayout}>
            <div className={`w-full flex gap-3 justify-end items-center py-5`}>
              <Button htmlType="submit" type="primary">
                Ok
              </Button>
            </div>
          </Col>
        </Row>
      </CustomForm>
    </CustomModal>
  );
};

export const SupplierReport = () => {
  const [open, setOpen] = useState(true);
  const [supplierId, setSupplierId] = useState(undefined);

  const { searchParams, setParams } = useFilterParams();
  const { keyword, debounce } = useCustomDebounce();

  const { data, isFetching } = useGetSupplierDetailsQuery(
    {
      id: supplierId,
    },
    { skip: !supplierId }
  );

  const [summaryData, setSummaryData] = useState({});
  const [loading, setLoading] = useState(false);

  const summaryDetails = createDetailsLayout(summaryData);

  const summaryType = {
    supplier_ids: [
      searchParams?.supplier_ids ? searchParams?.supplier_ids : data?.id,
    ],
  };

  const supplierItems = [
    {
      key: "1",
      label: "Supplier",
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
      children: data?.phone_number ?? "---",
      span: 24,
    },
    {
      key: "4",
      label: "Country",
      children: data?.country ?? "---",
      span: 12,
    },
    {
      key: "6",
      label: "City",
      children: data?.city ?? "---",
      span: 12,
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
    summary: "supplier,sale",
  };

  return (
    <GlobalContainer
      pageTitle="Supplier Report"
      popoverWidth={400}
      searchFilterContent={<SearchFilterComponent />}
      debounce={debounce}
      setParams={setParams}
    >
      {!supplierId ? (
        <>
          <SupplierModal
            setSupplierId={setSupplierId}
            open={open}
            setOpen={setOpen}
          />
          <div className="w-full flex justify-center items-center py-5">
            <Button onClick={() => setOpen(true)}>Select Supplier</Button>
          </div>
        </>
      ) : (
        <>
          <div className=" w-full grid grid-cols-2 gap-4 mb-5">
            <div className="border rounded-md p-4 shadow-sm">
              {isFetching ? (
                <Spin className="w-full h-full flex justify-center items-center py-5" />
              ) : (
                <Descriptions
                  title="Customer Details"
                  layout=""
                  items={supplierItems}
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
          {!isFetching ? (
            <Tabs
              defaultActiveKey="purchase"
              items={[
                {
                  label: "Purchase",
                  key: "purchase",
                  children: <PurchaseTable {...props} />,
                },
                {
                  label: "Quotation",
                  key: "quotation",
                  children: <QuotationTable {...props} />,
                },
                {
                  label: "Purchase Return",
                  key: "purchasereturn",
                  children: <PurchaseReturnTable {...props} />,
                },
                {
                  label: "Sale Return",
                  key: "salereturn",
                  children: <SaleReturnTable {...props} />,
                },
              ]}
            />
          ) : (
            <Spin className="w-full h-full flex justify-center items-center py-10" />
          )}
        </>
      )}
    </GlobalContainer>
  );
};
