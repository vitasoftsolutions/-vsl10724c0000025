import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import {
  fullColLayout,
  largeLayout,
  rowLayout,
} from "../../../layout/FormLayout";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../../utilities/lib/generator/generatorUtils";
import { CashierComponent } from "../../ReusableComponent/CashierComponent";
import { OrderTaxComponent } from "../../ReusableComponent/OrderTaxComponent";
import { SupplierComponent } from "../../ReusableComponent/SupplierComponent";
import { WarehouseComponent } from "../../ReusableComponent/WarehouseComponent";
import CustomForm from "../../Shared/Form/CustomForm";
import CustomInput from "../../Shared/Input/CustomInput";
import CustomSelect from "../../Shared/Select/CustomSelect";
import CustomUploader from "../../Shared/Upload/CustomUploader";
import { CustomerComponent } from "../overview/CustomerComponent";
import { QuotationProductTable } from "./overview/QuotationProductTable";
import { TotalRow } from "../../ReusableComponent/TotalRow";
import { useSetFieldValue } from "../../../utilities/lib/updateFormValues/useInitialFormField";

const StatusComponent = () => {
  useSetFieldValue("status", "Pending");

  const options = [
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "Sent",
      label: "Sent",
    },
  ];

  return <CustomSelect label="Status" options={options} name={"status"} />;
};

export const QuotationForm = ({
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
  const tax_rate = Form.useWatch("tax_rate", form);

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
        inclusive_tax_rate: {},
      });
    }
  }, [setFormValues, setProductUnits, setProducts, warehouseId]);

  return (
    <>
      <CustomForm {...props}>
        <Row {...rowLayout}>
          <Col {...largeLayout}>
            <WarehouseComponent />
          </Col>
          <Col {...largeLayout}>
            <CashierComponent />
          </Col>
          <Col {...largeLayout}>
            <SupplierComponent />
          </Col>
          <Col {...largeLayout}>
            <CustomerComponent />
          </Col>

          <QuotationProductTable
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
            <CustomInput label="Discount" type={"number"} name={"discount"} />
          </Col>
          <Col {...largeLayout}>
            <CustomInput
              label="Shipping Cost"
              type={"number"}
              name={"shipping_cost"}
            />
          </Col>
          <Col {...largeLayout}>
            <StatusComponent />
          </Col>

          <Col {...fullColLayout}>
            <CustomUploader label="Attachment" name={"attachment"} />
          </Col>
          <Col {...fullColLayout}>
            <CustomInput label="Note" type={"textarea"} name={"note"} />
          </Col>
        </Row>
      </CustomForm>

      {/* <Row className="pb-20">
        <Col {...fullColLayout}>
          <Row className="rounded-md overflow-hidden">
            <Col
              span={4}
              className="border flex justify-between items-center px-2 py-5 text-lg"
            >
              <span className="font-semibold ">Items</span>
              <span>
                {totalItems} ({totalQty})
              </span>
            </Col>
            <Col
              span={4}
              className="border flex justify-between items-center px-2 py-5 text-lg"
            >
              <span className="font-semibold ">Total</span>
              <span>{Number(totalPrice).toFixed(2)}</span>
            </Col>
            <Col
              span={4}
              className="border flex justify-between items-center px-2 py-5 text-lg"
            >
              <span className="font-semibold ">Tax</span>
              <span>{Number(tax_rate ?? 0).toFixed(2)}</span>
            </Col>
            <Col
              span={4}
              className="border flex justify-between items-center px-2 py-5 text-lg"
            >
              <span className="font-semibold ">Discount</span>
              <span>{Number(discount ?? 0).toFixed(2)}</span>
            </Col>
            <Col
              span={4}
              className="border flex justify-between items-center px-2 py-5 text-lg"
            >
              <span className="font-semibold ">Shipping Cost</span>
              <span>{Number(shipping_cost ?? 0).toFixed(2)}</span>
            </Col>
            <Col
              span={4}
              className="border flex justify-between items-center px-2 py-5 text-lg"
            >
              <span className="font-semibold ">Grand Total</span>
              <span>{Number(grandTotal).toFixed(2)}</span>
            </Col>
          </Row>
        </Col>
      </Row> */}
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
