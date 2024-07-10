import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetTransferDetailsQuery,
  useUpdateTransferMutation,
} from "../../redux/services/transfer/transferApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../utilities/lib/fieldsToUpdate";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { openNotification } from "../../utilities/lib/openToaster";
import { decimalConverter } from "../../utilities/lib/return/decimalComverter";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import TransferForm from "./TransferForm";

const TransferEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetTransferDetailsQuery(
    { id, params: { child: 1, parent: 1 } },
    { skip: !id }
  );
  const [updateTransfer, { isLoading }] = useUpdateTransferMutation();

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

  //console.log(data);

  useEffect(() => {
    if (!isEditDrawerOpen) {
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
  }, [isEditDrawerOpen]);

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      data?.transfer_products?.forEach((product) => {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          product_list: {
            ...prevFormValues.product_list,
            product_id: {
              ...prevFormValues.product_list.product_id,
              [product.product_id.toString()]: product.product_id,
            },
            qty: {
              ...prevFormValues.product_list.qty,
              [product.product_id.toString()]: product.qty,
            },
            purchase_unit_id: {
              ...prevFormValues.product_list.purchase_unit_id,
              [product.product_id.toString()]: product.purchase_unit_id,
            },
            net_unit_cost: {
              ...prevFormValues.product_list.net_unit_cost,
              [product.product_id.toString()]: product.net_unit_cost,
            },
            tax_rate: {
              ...prevFormValues.product_list.tax_rate,
              [product.product_id.toString()]: product.tax_rate,
            },
            tax: {
              ...prevFormValues.product_list.tax,
              [product.product_id.toString()]: product.tax,
            },
            total: {
              ...prevFormValues.product_list.total,
              [product.product_id.toString()]: product.total,
            },
            tax_id: {
              ...prevFormValues.product_list.tax_id,
              [product.product_id.toString()]: product.products?.tax_id,
            },
          },
        }));

        setProducts((prevProducts) => [
          ...prevProducts,
          {
            id: product.product_id,
            name: product.products?.name,
            sku: product.products?.sku,
            buying_price: product.products?.buying_price,
            purchase_unit_id: product.purchase_unit_id,
            purchase_units: product.products?.purchase_units,
            tax_id: product.products?.tax_id,
            taxes: product.taxes,
          },
        ]);

        setProductUnits((prevProductUnits) => ({
          ...prevProductUnits,

          purchase_units: {
            ...prevProductUnits.purchase_units,
            [product?.product_id.toString()]:
              product?.products?.sale_units?.operation_value ?? 1,
          },
        }));
      });

      const fieldData = fieldsToUpdate(data);
      const newFieldData = [
        ...fieldData,
        {
          name: "from_warehouse_id",
          value: data?.from_warehouse_id.toString(),
          errors: "",
        },
        {
          name: "to_warehouse_id",
          value: data?.to_warehouse_id.toString(),
          errors: "",
        },
      ];
      setFields(newFieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  const handleUpdate = async (values) => {
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
      total_price: decimalConverter(totalPrice),
      tax: decimalConverter(orderTax),
      change: decimalConverter(
        Number(values?.recieved_amount ?? 0) - Number(values?.paid_amount ?? 0)
      ),
      grand_total: calculateGrandTotal(totalPrice, orderTax, 0, shipping_cost),

      product_list: JSON.stringify(productListArray),
      petty_cash_id: 8,
      _method: "PUT",
    };

    if (attachment?.[0].originFileObj) {
      postObj.attachment = attachment?.[0].originFileObj;
    }

    appendToFormData(postObj, formData);

    const { data, error } = await updateTransfer({
      id,
      data: formData,
    });

    if (data?.success) {
      setId(undefined);
      dispatch(closeEditDrawer());

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
      const errorFields = errorFieldsUpdate(fields, error);

      setFields(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Edit Transfer"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
    >
      <TransferForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
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

export default TransferEdit;
