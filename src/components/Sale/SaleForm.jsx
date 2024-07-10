import { Col, Form, Row } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { discountTypeOptions } from "../../assets/data/discountTypes";
import { paymentStatusOptions } from "../../assets/data/paymentStatus";
import { saleStatusOptions } from "../../assets/data/saleStatus";
import {
  colLayout,
  fullColLayout,
  largeLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { useSetFieldValue } from "../../utilities/lib/updateFormValues/useInitialFormField";
import { CashierComponent } from "../ReusableComponent/CashierComponent";
import { OrderTaxComponent } from "../ReusableComponent/OrderTaxComponent";
import { TotalRow } from "../ReusableComponent/TotalRow";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";
import CustomUploader from "../Shared/Upload/CustomUploader";
import { CurrencyFormComponent } from "./overview/CurrencyComponent";
import { CustomerComponent } from "./overview/CustomerComponent";
import { PaymentTypeComponent } from "./overview/PaymentFormComponent";
import { SaleProductTable } from "./overview/SaleProductTable";

const StatusComponent = () => {
  useSetFieldValue("sale_status", saleStatusOptions[0].value);

  return (
    <CustomSelect
      label="Sale Status"
      options={saleStatusOptions}
      name={"sale_status"}
    />
  );
};

const PaymentStatusComponent = () => {
  useSetFieldValue("payment_status", paymentStatusOptions[0].value);
  return (
    <CustomSelect
      label="Payment Status"
      options={paymentStatusOptions}
      name="payment_status"
    />
  );
};

// const TaxComponent = () => {
//   const params = useGlobalParams({
//     selectValue: [...DEFAULT_SELECT_VALUES, "rate"],
//   });

//   const { data, isFetching } = useGetAllTaxQuery({ params });

//   const options = data?.results?.tax?.map((item) => {
//     return {
//       value: item.rate,
//       label: item.name,
//       tax_rate: item?.rate,
//     };
//   });

//   return (
//     <CustomSelect
//       label="Order Tax"
//       options={options}
//       name={"tax_rate"}
//       isLoading={isFetching}
//     />
//   );
// };

const DiscountTypeComponent = () => {
  const form = Form.useFormInstance();
  const discount = Form.useWatch("discount", form);
  const required = !!discount;

  return (
    <CustomSelect
      options={discountTypeOptions}
      label="Discount Type"
      name={"discount_type"}
      required={required}
    />
  );
};

export const SaleForm = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  productUnits,
  setProductUnits,
  ...props
}) => {
  const form = props.form;

  const discount = Form.useWatch("discount", form);
  const shipping_cost = Form.useWatch("shipping_cost", form);
  const tax_rate = Form.useWatch("tax_rate", form) ?? 0;

  useEffect(() => {
    form.setFieldValue("sale_at", dayjs(new Date()));
  }, [form]);

  // const totalItems = Object.keys(formValues.product_list?.qty)?.length ?? 0;
  // const totalQty = Object.values(formValues.product_list?.qty).reduce(
  //   (acc, cur) => acc + (parseFloat(cur) || 0),
  //   0
  // );

  // const totalPrice = calculateTotalPrice(formValues.product_list);

  // const grandTotal = calculateGrandTotal(
  //   totalPrice,
  //   tax_rate ?? 0,
  //   discount,
  //   shipping_cost
  // );

  const [totalItems, setTotalItems] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const calculatedTotalItems =
      Object.keys(formValues.product_list?.qty).length ?? 0;

    const calculatedTotalQty = Object.values(
      formValues.product_list?.qty
    ).reduce((acc, cur) => acc + (parseFloat(cur) || 0), 0);

    const calculatedTotalPrice = calculateTotalPrice(formValues.product_list);
    const orderTax = calculateTotalTax(calculatedTotalPrice, tax_rate);

    const calculatedGrandTotal = calculateGrandTotal(
      calculatedTotalPrice,
      tax_rate ?? 0,
      discount,
      shipping_cost
    );

    setTotalItems(calculatedTotalItems);
    setTotalQty(calculatedTotalQty);
    setTotalPrice(calculatedTotalPrice);
    setGrandTotal(calculatedGrandTotal);
    setTaxRate(orderTax);
  }, [discount, formValues, shipping_cost, tax_rate, products]);

  return (
    <>
      <CustomForm {...props}>
        <Row {...rowLayout}>
          <Col {...largeLayout}>
            <CustomerComponent />
          </Col>
          {/* <Col {...largeLayout}>
            <WarehouseComponent />
          </Col> */}
          <Col {...largeLayout}>
            <CashierComponent />
          </Col>

          <Col {...largeLayout}>
            <CustomDatepicker label="Date" required={true} name={"sale_at"} />
          </Col>

          <Col {...largeLayout}>
            <CurrencyFormComponent />
          </Col>

          <SaleProductTable
            formValues={formValues}
            setFormValues={setFormValues}
            products={products}
            setProducts={setProducts}
            productUnits={productUnits}
            setProductUnits={setProductUnits}
          />
          <Col {...largeLayout}>
            <OrderTaxComponent />
          </Col>

          <Col {...largeLayout}>
            <DiscountTypeComponent />
          </Col>
          <Col {...largeLayout}>
            <CustomInput label="Discount" type={"number"} name={"discount"} />
          </Col>
          <Col {...largeLayout}>
            <CustomInput
              label="Shipping Cost"
              type={"number"}
              name={"shipping_cost"}
            />
          </Col>
          <Col {...colLayout}>
            <StatusComponent />
          </Col>

          <Col {...colLayout}>
            <PaymentStatusComponent />
          </Col>

          <PaymentTypeComponent grandTotal={grandTotal} />

          <Col {...fullColLayout}>
            <CustomUploader label={"Attach Document"} name={"attachment"} />
          </Col>

          <Col {...mdColLayout}>
            <CustomInput type={"textarea"} name="sale_note" label="Sale Note" />
          </Col>
          <Col {...mdColLayout}>
            <CustomInput
              type={"textarea"}
              name="staff_note"
              label="Staff Note"
            />
          </Col>
        </Row>
      </CustomForm>

      <TotalRow
        totalItems={totalItems}
        totalQty={totalQty}
        totalPrice={totalPrice}
        taxRate={taxRate ?? 0}
        discount={discount ?? 0}
        shippingCost={shipping_cost ?? 0}
        grandTotal={grandTotal}
      />
    </>
  );
};
