import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeCreateDrawer } from "../../redux/services/drawer/drawerSlice";
import { useCreatePurchaseReturnMutation } from "../../redux/services/return/purchaseReturnApi";
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
import { PurchaseReturnForm } from "./PurchaseReturnForm";

const PurchaseReturnCreate = () => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [errorFields, setErrorFields] = useState([]);
  const { isCreateDrawerOpen } = useSelector((state) => state.drawer);

  const [createPurchaseReturn, { isLoading }] =
    useCreatePurchaseReturnMutation();

  const [formValues, setFormValues] = useState({
    product_list: {
      qty: {},
      product_id: {},
      purchase_unit_id: {},
      net_unit_cost: {},
      discount: {},
      tax_rate: {},
      tax: {},
      total: {},

      max_return: {},
    },
  });

  const [productUnits, setProductUnits] = useState({
    purchase_units: {},
  });

  const [products, setProducts] = useState([]);

  const [saleData, setSaleData] = useState();

  useEffect(() => {
    if (!isCreateDrawerOpen) {
      setFormValues({
        product_list: {
          qty: {},
          product_id: {},
          purchase_unit_id: {},
          net_unit_cost: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},

          max_return: {},
        },
      });
      setProductUnits({ purchase_units: {} });

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
            purchase_unit_id: updatedList.purchase_unit_id[product_id],
            net_unit_cost: decimalConverter(
              updatedList.net_unit_cost[product_id]
            ),
            discount: decimalConverter(updatedList.discount[product_id]),
            tax_rate: decimalConverter(updatedList.tax_rate[product_id]),
            tax: decimalConverter(updatedList.tax[product_id]),
            total: decimalConverter(updatedList.total[product_id]),
          }))
      : [];

    if (productListArray.length === 0) {
      // message.info("Please add atleast one product");
      openNotification("info", "Please add atleast one product");
      return;
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

    const postData = {
      purchase_return_at: dayjs(values?.purchase_return_at).format(
        "YYYY-MM-DD"
      ),
      purchase_id: saleData?.id,
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

    const { data, error } = await createPurchaseReturn({
      data: formData,
    });
    if (data?.success) {
      dispatch(closeCreateDrawer());
      form.resetFields();

      setFormValues({
        product_list: {
          qty: {},

          product_id: {},
          purchase_unit_id: {},
          net_unit_cost: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},
        },
      });
      setProductUnits({ purchase_units: {} });

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
      title={"Create Purchase Return"}
      open={isCreateDrawerOpen}
      width={1400}
    >
      <PurchaseReturnForm
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
      />
    </CustomDrawer>
  );
};

export default PurchaseReturnCreate;
