import { Col, Form, Row } from "antd";
import { useEffect, useState } from "react";
import {
  colLayout,
  fullColLayout,
  mdColLayout,
  rowLayout,
} from "../../layout/FormLayout";
import { useCheckReferenceMutation } from "../../redux/services/return/purchaseReturnApi";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { openNotification } from "../../utilities/lib/openToaster";
import { updateProductList } from "../../utilities/lib/return/updateProductList";
import { useSetFieldValue } from "../../utilities/lib/updateFormValues/useInitialFormField";
import { OrderTaxComponent } from "../ReusableComponent/OrderTaxComponent";
import { TotalRow } from "../ReusableComponent/TotalRow";
import CustomDatepicker from "../Shared/DatePicker/CustomDatepicker";
import CustomForm from "../Shared/Form/CustomForm";
import CustomInput from "../Shared/Input/CustomInput";
import CustomSelect from "../Shared/Select/CustomSelect";
import CustomUploader from "../Shared/Upload/CustomUploader";
import { ReturnProductTable } from "./overview/ReturnProductTable";

const options = [
  {
    value: "Cash",
    label: "Cash",
  },
  {
    value: "Card",
    label: "Card",
  },
  {
    value: "Cheque",
    label: "Cheque",
  },
];

const PaymentType = () => {
  useSetFieldValue("payment_type", options[0].value);

  return (
    <CustomSelect
      label="Payment Type"
      options={options}
      name={"payment_type"}
    />
  );
};

const ReturnComponent = ({ reference_id, ...props }) => {
  return (
    <Row {...rowLayout}>
      <div className=" text-lg font-semibold text-center w-full underline ">
        Reference ID: {reference_id}
      </div>
      <div className="text-center w-full">
        Only Selected Items will be returned
      </div>
      <ReturnProductTable {...props} />

      <Col {...colLayout}>
        <OrderTaxComponent />
      </Col>

      <Col {...colLayout}>
        <CustomDatepicker
          label="Return Date"
          required={true}
          name={"purchase_return_at"}
        />
      </Col>

      <Col {...colLayout}>
        <PaymentType />
      </Col>

      <Col {...fullColLayout}>
        <CustomUploader label={"Attach Document"} name={"attachment"} />
      </Col>

      <Col {...mdColLayout}>
        <CustomInput type={"textarea"} name="return_note" label="Return Note" />
      </Col>
      <Col {...mdColLayout}>
        <CustomInput type={"textarea"} name="staff_note" label="Staff Note" />
      </Col>
    </Row>
  );
};

export const PurchaseReturnForm = ({
  formValues,
  setFormValues,
  productUnits,
  setProductUnits,
  products,
  setProducts,
  setSaleData,
  id,
  referenceId,
  ...props
}) => {
  const { form } = props;
  // const { message } = App.useApp();
  const [checkReference, { isLoading }] = useCheckReferenceMutation();

  const [purchaseExists, setPurchaseExists] = useState(false);
  const [refId, setRefId] = useState(null);

  const tax_rate = Form.useWatch("tax_rate", form) ?? 0;
  const deleteRows = Form.useWatch("delete", form);

  const updatedProductList = updateProductList(
    {
      delete: deleteRows,
    },
    formValues.product_list
  );

  const [totalItems, setTotalItems] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    if (!updatedProductList?.qty) return;

    const calculatedTotalItems =
      Object.keys(updatedProductList?.qty).length ?? 0;

    const calculatedTotalQty = Object.values(updatedProductList?.qty).reduce(
      (acc, cur) => acc + (parseFloat(cur) || 0),
      0
    );

    const calculatedTotalPrice = calculateTotalPrice(updatedProductList);

    const orderTax = calculateTotalTax(calculatedTotalPrice, tax_rate);

    const calculatedGrandTotal = calculateGrandTotal(
      calculatedTotalPrice,
      tax_rate ?? 0,
      0,
      0
    );

    setTotalItems(calculatedTotalItems);
    setTotalQty(calculatedTotalQty);
    setTotalPrice(calculatedTotalPrice);
    setGrandTotal(calculatedGrandTotal);
    setTaxRate(orderTax);
  }, [formValues, tax_rate, products, updatedProductList]);

  const handleSubmit = async (values) => {
    const { data, error } = await checkReference({ data: values });

    if (data?.data) {
      setSaleData(data?.data);

      data?.data?.purchase_products?.map((item) => {
        setFormValues((prevFormValues) => {
          return {
            ...prevFormValues,
            product_list: {
              ...prevFormValues.product_list,
              product_id: {
                ...prevFormValues.product_list.product_id,
                [item.product_id.toString()]: item.product_id.toString(),
              },
              qty: {
                ...prevFormValues.product_list.qty,
                [item.product_id.toString()]: item?.qty.toString(),
              },
              purchase_unit_id: {
                ...prevFormValues.product_list.purchase_unit_id,
                [item.product_id.toString()]: item.purchase_unit_id.toString(),
              },
              net_unit_cost: {
                ...prevFormValues.product_list.net_unit_cost,
                [item.product_id.toString()]: item.net_unit_cost.toString(),
              },
              discount: {
                ...prevFormValues.product_list.discount,
                [item.product_id.toString()]: item.discount.toString(),
              },
              tax_rate: {
                ...prevFormValues.product_list.tax_rate,
                [item.product_id.toString()]: item.tax_rate.toString(),
              },
              tax: {
                ...prevFormValues.product_list.tax,
                [item.product_id.toString()]: item.tax.toString(),
              },
              total: {
                ...prevFormValues.product_list.total,
                [item.product_id.toString()]: item.total.toString(),
              },
              tax_id: {
                ...prevFormValues.product_list.tax_id,
                [item.product_id.toString()]: item.products?.tax_id.toString(),
              },

              max_return: {
                ...prevFormValues.product_list.max_return,
                [item.product_id.toString()]: item.qty?.toString(),
              },
            },
          };
        });
        setProducts((prevProducts) => [
          ...prevProducts,
          {
            id: item.product_id,
            name: item?.products?.name,
            sku: item?.products?.sku,
            purchase_unit_id: item?.products?.purchase_unit_id,
            buying_price: item?.products?.buying_price,
            purchase_units: item?.products?.purchase_units,
            taxes: item?.products?.taxes,
          },
        ]);

        setProductUnits((prevProductUnits) => ({
          ...prevProductUnits,
          purchase_units: {
            ...prevProductUnits.purchase_units,
            [item.product_id.toString()]:
              item.products?.purchase_units?.operation_value ?? 1,
          },
        }));
      });

      setRefId(values.reference_id);
      setPurchaseExists(true);
    }
    if (error) {
      // message.error(
      //   error?.data?.message ??
      //     "Purchase Reference doesnot exist or Purchase Return is Pending"
      // );

      openNotification(
        "error",
        error?.data?.message ??
          "Purchase Reference doesnot exist or Purchase Return is Pending"
      );
      setPurchaseExists(false);
      setRefId(null);
    }
  };

  return (
    <>
      {!purchaseExists && !id ? (
        <CustomForm
          handleSubmit={handleSubmit}
          form={props.form}
          submitBtnText={"Check Reference"}
          isLoading={isLoading}
        >
          <Row {...rowLayout}>
            <Col {...fullColLayout}>
              <CustomInput
                label="Purchase Reference"
                name={"reference_id"}
                required={true}
              />
            </Col>
          </Row>
        </CustomForm>
      ) : (
        <>
          <CustomForm {...props}>
            <ReturnComponent
              reference_id={referenceId ?? refId}
              formValues={formValues}
              setFormValues={setFormValues}
              products={products}
              setProducts={setProducts}
              productUnits={productUnits}
              setProductUnits={setProductUnits}
              form={props.form}
            />
          </CustomForm>
          <TotalRow
            totalItems={totalItems}
            totalQty={totalQty}
            totalPrice={totalPrice}
            taxRate={taxRate ?? 0}
            // discount={discount}
            // shippingCost={shipping_cost}
            grandTotal={grandTotal}
          />
        </>
      )}
    </>
  );
};
