import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import {
  colLayout,
  fullColLayout,
  largeLayout,
  rowLayout,
} from "../../layout/FormLayout";
import { getCurrentDate } from "../../utilities/lib/currentDate";
import {
  calculateGrandTotal,
  calculateTotalPrice,
} from "../../utilities/lib/generator/generatorUtils";
import { TotalRow } from "../ReusableComponent/TotalRow";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";
import CustomUploader from "../Shared/Upload/CustomUploader";
import { TransferProductTable } from "./overview/TransferProductTable";
import { WarehouseTransferComponent } from "./WarehouseTransferComponent";

const options = [
  {
    value: "Pending",
    label: "Pending",
  },
  {
    value: "Send",
    label: "Send",
  },
];

const useSetFieldValue = (field, value) => {
  const form = Form.useFormInstance();
  useEffect(() => {
    form.setFieldValue(field, value);
  }, [form, field, value]);
};

const FileStatusComponent = () => {
  useSetFieldValue("status", options[0].value);

  return (
    <CustomSelect
      label="File Status"
      placeholder={"File Status"}
      options={options}
      name={"status"}
    />
  );
};

const TransferDateComponent = () => {
  // const form = Form.useFormInstance();

  // useEffect(() => {
  //   form.setFieldValue("date", getCurrentDate);
  // }, [form]);

  useSetFieldValue("date", getCurrentDate);

  return (
    <CustomDatepicker
      label="Date"
      type={"date"}
      required={true}
      name={"date"}
    />
  );
};

const TransferForm = ({
  formValues,
  setFormValues,
  products,
  setProducts,
  productUnits,
  setProductUnits,
  ...props
}) => {
  const form = props.form;

  const shipping_cost = Form.useWatch("shipping_cost", form);

  const [totalItems, setTotalItems] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const calculatedTotalItems =
      Object.keys(formValues.product_list?.qty).length ?? 0;

    const calculatedTotalQty = Object.values(
      formValues.product_list?.qty
    ).reduce((acc, cur) => acc + (parseFloat(cur) || 0), 0);

    const calculatedTotalPrice = calculateTotalPrice(formValues.product_list);

    const calculatedGrandTotal = calculateGrandTotal(
      calculatedTotalPrice,
      0,
      0,
      shipping_cost
    );

    setTotalItems(calculatedTotalItems);
    setTotalQty(calculatedTotalQty);
    setTotalPrice(calculatedTotalPrice);
    setGrandTotal(calculatedGrandTotal);
  }, [formValues, shipping_cost, products]);

  return (
    <>
      <CustomForm {...props}>
        <Row {...rowLayout}>
          <WarehouseTransferComponent />

          <Col {...largeLayout}>
            <TransferDateComponent />
          </Col>
          <Col {...largeLayout}>
            <FileStatusComponent />
          </Col>

          <TransferProductTable
            formValues={formValues}
            setFormValues={setFormValues}
            products={products}
            setProducts={setProducts}
            productUnits={productUnits}
            setProductUnits={setProductUnits}
          />

          <Col {...colLayout}>
            <CustomInput
              label="Shipping Cost"
              type={"number"}
              name={"shipping_cost"}
            />
          </Col>

          <Col {...fullColLayout}>
            <CustomUploader label={"Attach Document"} />
          </Col>

          <Col {...fullColLayout}>
            <CustomInput label="Sale Note" type={"textarea"} name={"note"} />
          </Col>
        </Row>
      </CustomForm>

      <TotalRow
        totalItems={totalItems}
        totalQty={totalQty}
        totalPrice={totalPrice}
        // taxRate={tax_rate}
        // discount={discount}
        shippingCost={shipping_cost ?? 0}
        grandTotal={grandTotal}
      />
    </>
  );
};

export default TransferForm;
