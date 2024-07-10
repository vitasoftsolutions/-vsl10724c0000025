import { Form } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCurrentUser } from "../../redux/services/auth/authSlice";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateSaleMutation } from "../../redux/services/sale/saleApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { openNotification } from "../../utilities/lib/openToaster";
import { decimalConverter } from "../../utilities/lib/return/decimalComverter";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { SaleForm } from "./SaleForm";

export const SaleCreate = () => {
  const dispatch = useDispatch();

  const user = useSelector(useCurrentUser);

  console.log(user);

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);

  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createSale, { isLoading }] = useCreateSaleMutation();

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

  const handleSubmit = async (values) => {
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

    const postObj = {
      ...values,
      sale_at: dayjs(sale_at).format("YYYY-MM-DD"),
      discount: decimalConverter(discount),
      shipping_cost: decimalConverter(shipping_cost),
      tax_rate: decimalConverter(tax_rate),
      item: productListArray.length,
      total_qty: totalQty,
      total_discount: decimalConverter(totalDiscount),
      total_tax: decimalConverter(totalTax),
      total_price: decimalConverter(totalPrice),
      tax: decimalConverter(orderTax),
      change: decimalConverter(
        Number(values?.recieved_amount ?? 0) - Number(values?.paid_amount ?? 0)
      ),
      grand_total: calculateGrandTotal(
        totalPrice,
        values.tax_rate,
        discount,
        shipping_cost
      ),

      product_list: JSON.stringify(productListArray),
      // petty_cash_id: user?.petty_cash_id,
      // petty_cash_id: 8,
    };

    if (paid_amount) {
      postObj.paid_amount = Number(paid_amount).toFixed(2);
    }

    if (attachment?.[0].originFileObj) {
      postObj.attachment = attachment?.[0].originFileObj;
    }

    appendToFormData(postObj, formData);

    const { data, error } = await createSale({
      data: formData,
    });
    if (data?.success) {
      dispatch(closeCreateDrawer());
      form.resetFields();

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
      const errorFields = Object.keys(error?.data?.errors).map((fieldName) => ({
        name: fieldName,

        errors: error?.data?.errors[fieldName],
      }));
      setErrorFields(errorFields);
    }
  };

  return (
    <CustomDrawer title={"Create Sale"} open={isCreateDrawerOpen} width={1400}>
      <SaleForm
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
