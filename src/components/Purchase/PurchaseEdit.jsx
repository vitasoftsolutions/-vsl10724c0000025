import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../redux/services/auth/authSlice";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetPurchaseDetailsQuery,
  useUpdatePurchaseMutation,
} from "../../redux/services/purchase/purchaseApi";
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
import { PurchaseForm } from "./PurchaseForm";

export const PurchaseEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const user = useSelector(useCurrentUser);

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetPurchaseDetailsQuery(
    { id, params: { child: 1, parent: 1 } },
    { skip: !id || !isEditDrawerOpen }
  );

  const [formValues, setFormValues] = useState({
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
  const [products, setProducts] = useState([]);
  const [productUnits, setProductUnits] = useState({
    purchase_units: {},
    tax_rate: {},
  });

  useEffect(() => {
    if (!isEditDrawerOpen) {
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
  }, [isEditDrawerOpen]);

  const [updatePurchase, { isLoading }] = useUpdatePurchaseMutation();

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      //console.log(data);
      data?.purchase_products?.forEach((product) => {
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
            discount: {
              ...prevFormValues.product_list.discount,
              [product.product_id.toString()]: product.discount,
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
            buying_cost: product.products?.buying_cost,
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
              product?.products?.purchase_units?.operation_value ?? 1,
          },
        }));
      });

      const fieldData = fieldsToUpdate(data);
      const newFieldData = [
        ...fieldData,
        {
          name: "warehouse_id",
          value: data?.warehouse_id.toString(),
          errors: "",
        },
        {
          name: "supplier_id",
          value: data?.supplier_id.toString(),
          errors: "",
        },
      ];
      setFields(newFieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const { product_list } = formValues;

    const productListArray = product_list?.qty
      ? Object.keys(product_list.qty)
          .filter((product_id) => product_list.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: product_list.qty[product_id],
            recieved: product_list.recieved[product_id],
            purchase_unit_id: product_list.purchase_unit_id[product_id],
            net_unit_cost: decimalConverter(
              product_list.net_unit_cost[product_id]
            ),
            discount: decimalConverter(product_list.discount[product_id]),
            tax_rate: decimalConverter(product_list.tax_rate[product_id]),
            tax: decimalConverter(product_list.tax[product_id]),
            total: decimalConverter(product_list.total[product_id]),
          }))
      : [];

    if (productListArray.length === 0) {
      // message.info("Please add atleast one product");
      openNotification("info", "Please add atleast one product");

      return;
    }

    const totalPrice = calculateTotalPrice(product_list);
    const orderTax = calculateTotalTax(totalPrice, values.tax_rate);

    const totalQty =
      Object.values(formValues.product_list?.qty).reduce(
        (acc, cur) => acc + parseInt(cur),
        0
      ) ?? 0;

    const totalDiscount =
      Object.values(formValues.product_list?.discount).reduce(
        (acc, cur) => acc + parseFloat(cur),
        0
      ) ?? 0;

    const totalTax =
      Object.values(formValues.product_list?.tax).reduce(
        (acc, cur) => acc + parseFloat(cur),
        0
      ) ?? 0;

    const {
      attachment,
      warehouse_id,
      supplier_id,
      purchase_status,
      currency,
      exchange_rate,
      purchase_note,
      payment_status,
      paid_amount,
      payment_type,
    } = values;

    const postData = {
      warehouse_id,
      supplier_id,
      purchase_status,
      currency,
      exchange_rate,
      purchase_note,
      payment_status,
      payment_type,
      paid_amount: paid_amount && decimalConverter(paid_amount),
      due_amount: paid_amount ? decimalConverter(totalPrice - paid_amount) : 0,
      purchase_at: dayjs(values?.purchase_at).format("YYYY-MM-DD"),
      discount: decimalConverter(values?.discount),
      shipping_cost: decimalConverter(values?.shipping_cost),
      tax_rate: decimalConverter(values?.tax_rate),
      item: productListArray.length,
      total_qty: totalQty,
      total_discount: decimalConverter(totalDiscount),
      total_tax: decimalConverter(totalTax),
      total_price: decimalConverter(totalPrice),
      tax: decimalConverter(orderTax),
      grand_total: calculateGrandTotal(
        totalPrice,
        values.tax_rate,
        values?.discount,
        values?.shipping_cost
      ),

      product_list: JSON.stringify(productListArray),
      petty_cash_id: user?.petty_cash_id,
      _method: "put",
    };

    if (attachment?.[0].originFileObj) {
      postData.attachment = attachment?.[0].originFileObj;
    }

    appendToFormData(postData, formData);

    //console.log(postData);

    // logo: values?.logo?.[0].originFileObj,

    if (values?.logo?.[0].originFileObj) {
      postData.logo = values?.logo?.[0].originFileObj;
    }
    appendToFormData(postData, formData);

    const { data, error } = await updatePurchase({
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

    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);

      setFields(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Edit Purchase"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
      width={1400}
    >
      <PurchaseForm
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
