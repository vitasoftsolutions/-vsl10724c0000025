import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateTransferMutation } from "../../redux/services/transfer/transferApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { openNotification } from "../../utilities/lib/openToaster";
import { decimalConverter } from "../../utilities/lib/return/decimalComverter";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import TransferForm from "./TransferForm";

const TransferCreate = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [formValues, setFormValues] = useState({
    product_list: {
      product_id: {},
      qty: {},
      purchase_unit_id: {},
      net_unit_cost: {},
      tax_rate: {},
      tax: {},
      total: {},

      tax_id: {},
    },
  });

  const [products, setProducts] = useState([]);

  const [productUnits, setProductUnits] = useState({
    purchase_units: {},
    tax_rate: {},
  });

  const warehouseId = Form.useWatch("from_warehouse_id", form);
  useEffect(() => {
    if (warehouseId) {
      setFormValues({
        product_list: {
          product_id: {},
          qty: {},
          purchase_unit_id: {},
          net_unit_cost: {},
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
  }, [warehouseId]);

  const [createTransfer, { isLoading }] = useCreateTransferMutation();

  const handleSubmit = async (values) => {
    const formData = new FormData();

    const { product_list } = formValues;

    const { shipping_cost, attachment } = values ?? {};

    const productListArray = product_list?.qty
      ? Object.keys(product_list.qty)
          .filter((product_id) => product_list.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: product_list.qty[product_id],
            purchase_unit_id: product_list.purchase_unit_id[product_id],
            net_unit_cost: decimalConverter(
              product_list.net_unit_cost[product_id]
            ),
            tax_rate: decimalConverter(product_list.tax_rate[product_id]),
            tax: decimalConverter(product_list.tax[product_id]),
            total: decimalConverter(product_list.total[product_id]),
          }))
      : [];

    if (productListArray.length === 0) {
      // message.info("Please add atleast one product");
      // return;

      return openNotification("info", "Please add atleast one product");
    }

    const totalPrice = calculateTotalPrice(product_list);
    const orderTax = calculateTotalTax(totalPrice, values.tax_rate);

    const totalQty =
      Object.values(formValues.product_list?.qty).reduce(
        (acc, cur) => acc + parseInt(cur),
        0
      ) ?? 0;

    const totalTax =
      Object.values(formValues.product_list?.tax).reduce(
        (acc, cur) => acc + parseFloat(cur),
        0
      ) ?? 0;

    const postObj = {
      ...values,
      shipping_cost: decimalConverter(shipping_cost),
      item: productListArray.length,
      total_qty: totalQty,
      total_tax: decimalConverter(totalTax),
      total_cost: decimalConverter(totalPrice),
      tax: decimalConverter(orderTax),
      change: decimalConverter(
        Number(values?.recieved_amount ?? 0) - Number(values?.paid_amount ?? 0)
      ),
      grand_total: calculateGrandTotal(totalPrice, orderTax, 0, shipping_cost),

      product_list: JSON.stringify(productListArray),
      // petty_cash_id: 8,
    };

    if (attachment?.[0].originFileObj) {
      postObj.attachment = attachment?.[0].originFileObj;
    }

    appendToFormData(postObj, formData);

    const { data, error } = await createTransfer({
      data: formData,
    });
    if (data?.success) {
      dispatch(closeCreateDrawer());
      form.resetFields();

      setFormValues({
        product_list: {
          product_id: {},
          qty: {},
          purchase_unit_id: {},
          net_unit_cost: {},
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
    if (error) {
      const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
        name: fieldName,

        errors: error?.data?.errors[fieldName],
      }));
      setErrorFields(errorFields);
    }
  };
  return (
    <CustomDrawer
      title={"Create Transfer"}
      open={isCreateDrawerOpen}
      width={1400}
    >
      <TransferForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
        formValues={formValues}
        setFormValues={setFormValues}
        products={products}
        setProducts={setProducts}
        productUnits={productUnits}
        setProductUnits={setProductUnits}
      />
    </CustomDrawer>
  );
};

export default TransferCreate;
