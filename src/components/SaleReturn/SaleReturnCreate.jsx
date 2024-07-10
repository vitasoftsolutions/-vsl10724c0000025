import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreateSaleReturnMutation } from "../../redux/services/return/saleReturnApi";
import { appendToFormData } from "../../utilities/lib/appendFormData";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../utilities/lib/generator/generatorUtils";
import { openNotification } from "../../utilities/lib/openToaster";
import { decimalConverter } from "../../utilities/lib/return/decimalComverter";
import { updateProductList } from "../../utilities/lib/return/updateProductList";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { SaleReturnForm } from "./SaleReturnForm";

const SaleReturnCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createSaleReturn, { isLoading }] = useCreateSaleReturnMutation();

  const [formValues, setFormValues] = useState({
    product_list: {
      qty: {},
      product_id: {},
      sale_unit_id: {},
      net_unit_price: {},
      discount: {},
      tax_rate: {},
      tax: {},
      total: {},

      max_return: {},
    },
  });

  const [productUnits, setProductUnits] = useState({
    sale_units: {},
  });

  const [products, setProducts] = useState([]);

  const [saleData, setSaleData] = useState();

  // const [summary, setSummary] = useState({});

  useEffect(() => {
    if (!isCreateDrawerOpen) {
      setFormValues({
        product_list: {
          qty: {},
          product_id: {},
          sale_unit_id: {},
          net_unit_price: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},
        },
      });
      setProductUnits({ sale_units: {} });

      setProducts([]);
      form.resetFields();
    }
  }, [form, isCreateDrawerOpen]);

  const handleSubmit = async (values) => {
    const updatedList = updateProductList(values, formValues.product_list);

    const formData = new FormData();

    const productListArray = updatedList?.qty
      ? Object.keys(updatedList.qty)
          .filter((product_id) => updatedList.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: updatedList.qty[product_id],
            sale_unit_id: updatedList.sale_unit_id[product_id],
            net_unit_price: decimalConverter(
              updatedList.net_unit_price[product_id]
            ),
            discount: decimalConverter(updatedList.discount[product_id]),
            tax_rate: decimalConverter(updatedList.tax_rate[product_id]),
            tax: decimalConverter(updatedList.tax[product_id]),
            total: decimalConverter(updatedList.total[product_id]),
          }))
      : [];

    if (productListArray.length === 0) {
      // message.info("Please add atleast one product");
      // return;

      return openNotification("info", "Please add atleast one product");
    }

    const totalPrice = calculateTotalPrice(updatedList);
    const orderTax = calculateTotalTax(totalPrice, values.tax_rate);

    const totalQty =
      Object.values(updatedList?.qty).reduce(
        (acc, cur) => acc + parseInt(cur),
        0
      ) ?? 0;

    const totalTax =
      Object.values(updatedList?.tax).reduce(
        (acc, cur) => acc + parseFloat(cur),
        0
      ) ?? 0;

    // setSummary({
    //   totalItems: productListArray?.length,
    //   totalQty: totalQty,
    //   totalPrice: totalPrice,
    //   grandTotal: calculateGrandTotal(totalPrice, orderTax),
    // });

    const postData = {
      sale_return_at: dayjs(values?.sale_return_at).format("YYYY-MM-DD"),
      sale_id: saleData?.id,
      petty_cash_id: saleData?.petty_cash_id,
      warehouse_id: saleData?.warehouse_id,
      cashier_id: saleData?.cashier_id,
      item: productListArray?.length,
      total_qty: decimalConverter(totalQty),
      total_tax: decimalConverter(totalTax),
      total_price: decimalConverter(totalPrice),
      tax_rate: decimalConverter(values?.tax_rate),
      tax: decimalConverter(orderTax),
      grand_total: calculateGrandTotal(totalPrice, orderTax),
      return_payment_type: values?.payment_type,
      return_amount: decimalConverter(totalPrice),
      return_note: values?.return_note,
      staff_note: values?.staff_note,
      product_list: JSON.stringify(productListArray),
    };

    const { attachment } = values;

    if (attachment?.[0].originFileObj) {
      postData.attachment = attachment?.[0].originFileObj;
    }

    appendToFormData(postData, formData);

    const { data, error } = await createSaleReturn({
      data: formData,
    });
    if (data?.success) {
      dispatch(closeCreateDrawer());
      form.resetFields();

      setFormValues({
        product_list: {
          qty: {},
          product_id: {},
          sale_unit_id: {},
          net_unit_price: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},
        },
      });
      setProductUnits({ sale_units: {} });

      setProducts([]);
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
      title={"Create Sale Return"}
      open={isCreateDrawerOpen}
      width={1400}
    >
      <SaleReturnForm
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        fields={errorFields}
        form={form}
        formValues={formValues}
        setFormValues={setFormValues}
        productUnits={productUnits}
        setProductUnits={setProductUnits}
        products={products}
        setProducts={setProducts}
        setSaleData={setSaleData}
        // summary={summary}
      />
    </CustomDrawer>
  );
};

export default SaleReturnCreate;
