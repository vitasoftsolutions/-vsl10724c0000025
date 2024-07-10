import { Form } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../redux/services/drawer/drawerSlice";
import {
  useGetSaleReturnDetailsQuery,
  useUpdateSaleReturnMutation,
} from "../../redux/services/return/saleReturnApi";
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
import { updateProductList } from "../../utilities/lib/return/updateProductList";
import CustomDrawer from "../Shared/Drawer/CustomDrawer";
import { SaleReturnForm } from "./SaleReturnForm";

const SaleReturnEdit = ({ id, setId }) => {
  const dispatch = useDispatch();

  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const [formValues, setFormValues] = useState({
    product_list: {
      qty: {},
      sale_id: {},
      product_id: {},
      // recieved: {},
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
  const [referenceId, setReferenceId] = useState(null);

  // const [summary, setSummary] = useState({});

  const { data, isFetching } = useGetSaleReturnDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id }
  );

  const [updateSaleReturn, { isLoading }] = useUpdateSaleReturnMutation();

  useEffect(() => {
    if (!isEditDrawerOpen) {
      setFormValues({
        product_list: {
          qty: {},
          sale_id: {},
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

      setProducts([]);

      setProductUnits({
        sale_units: {},
      });
    }
  }, [isEditDrawerOpen]);

  useEffect(() => {
    if (data && isEditDrawerOpen) {
      data?.sale_return_products?.forEach((product) => {
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

            max_return: {
              ...prevFormValues.product_list.max_return,
              [product.product_id.toString()]: product.qty,
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

      setReferenceId(data?.reference_id);

      const fieldData = fieldsToUpdate(data);
      setFields(fieldData);
    }
  }, [data, isEditDrawerOpen, setFields]);

  const handleUpdate = async (values) => {
    const updatedList = updateProductList(values, formValues.product_list);

    const formData = new FormData();

    const productListArray = updatedList?.qty
      ? Object.keys(updatedList.qty)
          .filter((product_id) => updatedList.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: updatedList.qty[product_id],
            sale_id: updatedList.sale_id[product_id],
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
      _method: "PUT",
    };

    const { attachment } = values;

    if (attachment?.[0].originFileObj) {
      postData.attachment = attachment?.[0].originFileObj;
    }

    if (productListArray.length === 0) {
      // message.error("Please add at least one product");
      // return;

      return openNotification("info", "Please add atleast one product");
    }

    appendToFormData(postData, formData);

    const { data, error } = await updateSaleReturn({
      id,
      data: formData,
    });

    if (data?.success) {
      setId(undefined);
      dispatch(closeEditDrawer());
    }

    if (error) {
      const errorFields = errorFieldsUpdate(fields, error);

      setFields(errorFields);
    }
  };

  return (
    <CustomDrawer
      title={"Edit Sale Return"}
      open={isEditDrawerOpen}
      width={1400}
      isLoading={isFetching}
    >
      <SaleReturnForm
        handleSubmit={handleUpdate}
        isLoading={isLoading}
        fields={fields}
        id={id}
        form={form}
        formValues={formValues}
        setFormValues={setFormValues}
        productUnits={productUnits}
        setProductUnits={setProductUnits}
        products={products}
        setProducts={setProducts}
        setSaleData={setSaleData}
        referenceId={referenceId}
        // summary={summary}
      />
    </CustomDrawer>
  );
};

export default SaleReturnEdit;
