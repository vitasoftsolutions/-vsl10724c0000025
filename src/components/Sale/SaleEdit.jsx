import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetSaleDetailsQuery,
  useUpdateSaleMutation,
} from "../../redux/services/sale/saleApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../utilities/lib/errorFieldsUpdate";
import {
  fieldsToUpdate,
  updateFieldValues,
} from "../../utilities/lib/fieldsToUpdate";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { openNotification } from "../../utilities/lib/openToaster";
import { decimalConverter } from "../../utilities/lib/return/decimalComverter";
import { sanitizeObj } from "../../utilities/lib/sanitizeObj";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { SaleForm } from "./SaleForm";

export const SaleEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetSaleDetailsQuery(
    {
      id,
      params: {
        child: 1,
        parent: 1,
      },
    },
    { skip: !id || !isEditDrawerOpen }
  );

  const [updateSale, { isLoading }] = useUpdateSaleMutation();

  const [formValues, setFormValues] = useState({
    product_list: {
      product_id: {},
      qty: {},
      sale_unit_id: {},
      net_unit_price: {},
      discount: {},
      tax_rate: {},
      tax: {},
      total: {},

      tax_id: {},
    },
  });

  const [products, setProducts] = useState([]);

  const [productUnits, setProductUnits] = useState({
    sale_units: {},
    tax_rate: {},
  });

  useEffect(() => {
    if (!isEditDrawerOpen) {
      setFormValues({
        product_list: {
          product_id: {},
          qty: {},
          sale_unit_id: {},
          net_unit_price: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},

          tax_id: {},
        },
      });

      setProducts([]);

      setProductUnits({
        sale_units: {},
        tax_rate: {},
      });
    }
  }, [isEditDrawerOpen]);

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      data?.sale_products?.forEach((product) => {
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
            sale_unit_id: {
              ...prevFormValues.product_list.sale_unit_id,
              [product.product_id.toString()]: product.sale_unit_id,
            },
            net_unit_price: {
              ...prevFormValues.product_list.net_unit_price,
              [product.product_id.toString()]: product.net_unit_price,
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
            buying_price: product.products?.buying_price,
            sale_unit_id: product.sale_unit_id,
            sale_units: product.products?.sale_units,
            tax_id: product.products?.tax_id,
            taxes: product.taxes,
          },
        ]);

        setProductUnits((prevProductUnits) => ({
          ...prevProductUnits,

          sale_units: {
            ...prevProductUnits.sale_units,
            [product?.product_id.toString()]:
              product?.products?.sale_units?.operation_value ?? 1,
          },
        }));
      });

      const fieldData = fieldsToUpdate(data);
      const updatedFieldData = [
        // ...fieldData,
        {
          name: "warehouse_id",
          value: data?.warehouse_id?.toString(),
          errors: "",
        },
        {
          name: "supplier_id",
          value: data?.supplier_id?.toString(),
          errors: "",
        },
      ];

      const newFieldData = updateFieldValues(fieldData, updatedFieldData);
      setFields(newFieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const { product_list } = formValues;

    const {
      attachment,
      discount,
      shipping_cost,
      tax_rate,
      sale_at,
      paid_amount,
    } = values ?? {};

    const productListArray = product_list?.qty
      ? Object.keys(product_list.qty)
          .filter((product_id) => product_list.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: product_list.qty[product_id],
            sale_unit_id: product_list.sale_unit_id[product_id],
            net_unit_price: decimalConverter(
              product_list.net_unit_price[product_id]
            ),
            discount: decimalConverter(product_list.discount[product_id]),
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
        (acc, cur) => acc + parseInt(cur, 10),
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

    const postObj = {
      ...sanitizeObj(values),
      sale_at: dayjs(sale_at).format("YYYY-MM-DD"),
      discount: Number(discount ?? 0).toFixed(2),
      shipping_cost: Number(shipping_cost ?? 0).toFixed(2),
      tax_rate: Number(tax_rate ?? 0).toFixed(2),
      item: productListArray.length,
      total_qty: totalQty,
      total_discount: Number(totalDiscount).toFixed(2),
      total_tax: Number(totalTax).toFixed(2),
      total_price: Number(totalPrice).toFixed(2),
      tax: Number(orderTax).toFixed(2),
      change: values?.recieved_amount - values?.paid_amount,
      grand_total: calculateGrandTotal(
        totalPrice,
        values.tax_rate,
        discount,
        shipping_cost
      ),

      product_list: JSON.stringify(productListArray),
      // petty_cash_id: 8,
      _method: "PUT",
    };

    if (paid_amount) {
      postObj.paid_amount = Number(paid_amount).toFixed(2);
    }

    if (attachment?.[0].originFileObj) {
      postObj.attachment = attachment?.[0].originFileObj;
    }

    appendToFormData(postObj, formData);

    const { data, error } = await updateSale({
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
          sale_unit_id: {},
          net_unit_price: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},

          tax_id: {},
        },
      });

      setProducts([]);

      setProductUnits({
        sale_units: {},
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
      title={"Edit Sale"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
      width={1400}
    >
      <SaleForm
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
