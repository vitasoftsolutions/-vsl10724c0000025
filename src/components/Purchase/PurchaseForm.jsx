import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import { paymentStatusOptions } from "../../assets/data/paymentStatus";
import { purchaseStatusOptions } from "../../assets/data/purchaseStatus";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { useSetFieldValue } from "../../utilities/lib/updateFormValues/useInitialFormField";
import { OrderTaxComponent } from "../ReusableComponent/OrderTaxComponent";
import { SupplierComponent } from "../ReusableComponent/SupplierComponent";
import { TotalRow } from "../ReusableComponent/TotalRow";
import { WarehouseComponent } from "../ReusableComponent/WarehouseComponent";
import { CurrencyFormComponent } from "../Sale/overview/CurrencyComponent";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";
import CustomUploader from "../Shared/Upload/CustomUploader";
import { PaymentTypeComponent } from "./overview/PaymentTypeComponent";
import { PurchaseProductTable } from "./overview/PurchaseProductTable";

const PurchaseStatus = () => {
  useSetFieldValue("purchase_status", purchaseStatusOptions[0].value);
  return (
    <CustomSelect
      label="Purchase Status"
      options={purchaseStatusOptions}
      name="purchase_status"
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

export const PurchaseForm = ({
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

  const paymentStatus = Form.useWatch("payment_status", form);
  const paid_amount = Form.useWatch("paid_amount", form);

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

  useEffect(() => {
    if (paymentStatus === "Paid") {
      form.setFieldValue("paid_amount", grandTotal);
    }

    if (paymentStatus === "Partial") {
      if (Number(paid_amount) > totalPrice) {
        form.setFieldValue("paid_amount", totalPrice);
      }
    }
  }, [paymentStatus, form, totalPrice, paid_amount, grandTotal]);

  // reset state
  const warehouseId = Form.useWatch("warehouse_id", props.form);

  useEffect(() => {
    if (warehouseId) {
      setFormValues({
        product_list: {
          product_id: {},
          qty: {},
          recieved: {},
          purchase_unit_id: {},
          net_unit_cost: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},

          tax_id: {},
        },
      });

      setProducts([]);

      setProductUnits({
        purchase_units: {},
        tax_rate: {},
      });
    }
  }, [setFormValues, setProductUnits, setProducts, warehouseId]);

  return (
    <>
      <CustomForm {...props}>
        <Row {...rowLayout}>
          <Col {...colLayout}>
            <WarehouseComponent />
          </Col>
          <Col {...colLayout}>
            <SupplierComponent />
          </Col>
          <Col {...colLayout}>
            <PurchaseStatus />
          </Col>
          <Col {...mdColLayout}>
            <CurrencyFormComponent />
          </Col>
          <Col {...mdColLayout}>
            <CustomDatepicker label="Date" required name="purchase_at" />
          </Col>

          <PurchaseProductTable
            formValues={formValues}
            setFormValues={setFormValues}
            products={products}
            setProducts={setProducts}
            productUnits={productUnits}
            setProductUnits={setProductUnits}
          />

          <Col {...colLayout}>
            <OrderTaxComponent />
          </Col>
          <Col {...colLayout}>
            <CustomInput label="Discount" type="number" name="discount" />
          </Col>
          <Col {...colLayout}>
            <CustomInput
              label="Shipping Cost"
              type="number"
              name="shipping_cost"
            />
          </Col>
          <Col {...colLayout}>
            <PaymentStatusComponent />
          </Col>

          {(paymentStatus === "Paid" || paymentStatus === "Partial") && (
            <PaymentTypeComponent />
          )}

          <Col {...fullColLayout}>
            <CustomUploader label="Attach Document" name="attachment" />
          </Col>
          <Col {...fullColLayout}>
            <CustomInput
              type="textarea"
              name="purchase_note"
              label="Purchase Note"
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
