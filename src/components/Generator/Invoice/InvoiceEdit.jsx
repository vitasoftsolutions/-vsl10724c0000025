import { Form } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeEditDrawer } from "../../../redux/services/drawer/drawerSlice";
import {
  useGetInvoiceDetailsQuery,
  useUpdateInvoiceMutation,
} from "../../../redux/services/invoice/invoiceApi";
import { appendToFormData } from "../../../utilities/lib/appendFormData";
import { errorFieldsUpdate } from "../../../utilities/lib/errorFieldsUpdate";
import { fieldsToUpdate } from "../../../utilities/lib/fieldsToUpdate";
import {
  calculateGrandTotal,
  calculateTotalPrice,
  calculateTotalTax,
} from "../../../utilities/lib/generator/generatorUtils";
import { openNotification } from "../../../utilities/lib/openToaster";
import CustomDrawer from "../../Shared/Drawer/CustomDrawer";
import { QuotationForm } from "../Quotation/QuotationForm";

const InvoiceEdit = ({ id }) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [fields, setFields] = useState([]);

  const { isEditDrawerOpen } = useSelector((state) => state.drawer);

  const { data, isFetching } = useGetInvoiceDetailsQuery(
    {
      id,
      params: {
        parent: 1,
        child: 1,
      },
    },
    { skip: !id }
  );

  const [updateInvoice, { isLoading }] = useUpdateInvoiceMutation();

  const [formValues, setFormValues] = useState({
    product_list: {
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
          qty: {},
          sale_unit_id: {},
          net_unit_price: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},
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
      data?.invoice_products?.forEach((item) => {
        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          product_list: {
            ...prevFormValues.product_list,
            qty: {
              ...prevFormValues.product_list.qty,
              [item?.product_id.toString()]: item?.qty,
            },
            sale_unit_id: {
              ...prevFormValues.product_list.sale_unit_id,
              [item?.product_id.toString()]: item?.sale_unit_id,
            },
            net_unit_price: {
              ...prevFormValues.product_list.net_unit_price,
              [item?.product_id.toString()]: item?.net_unit_price,
            },
            discount: {
              ...prevFormValues.product_list.discount,
              [item?.product_id.toString()]: item?.discount,
            },
            tax_rate: {
              ...prevFormValues.product_list.tax_rate,
              [item?.product_id.toString()]: item?.tax_rate,
            },
            tax: {
              ...prevFormValues.product_list.tax,
              [item?.product_id.toString()]: item?.tax,
            },
            total: {
              ...prevFormValues.product_list.total,
              [item?.product_id.toString()]: item?.total,
            },
          },
        }));

        setProducts((prevProducts) => [
          ...prevProducts,
          {
            id: item?.product_id,
            sku: item?.products?.sku,
            name: item?.products?.name,
            sale_unit_id: item?.sale_unit_id,
            tax_id: item?.products?.tax_id,
            taxes: item?.products?.taxes,
            sale_units: item?.products?.sale_units,
            buying_price: item?.products?.buying_price,
          },
        ]);

        setProductUnits((prevProductUnits) => ({
          ...prevProductUnits,

          sale_units: {
            ...prevProductUnits.sale_units,
            [item?.product_id.toString()]:
              item?.products?.sale_units?.operation_value ?? 1,
          },
        }));
      });

      const fieldData = fieldsToUpdate(data);

      const newFieldData = [
        ...fieldData,
        {
          name: "warehouse_id",
          value: data?.warehouse_id?.toString(),
          errors: "",
        },
        {
          name: "cashier_id",
          value: data?.cashier_id?.toString(),
          errors: "",
        },
        {
          name: "supplier_id",
          value: data?.supplier_id?.toString(),
          errors: "",
        },
        {
          name: "customer_id",
          value: data?.customer_id?.toString(),
          errors: "",
        },
      ];

      setFields(newFieldData);
    }
  }, [data, setFields, isEditDrawerOpen]);

  const handleUpdate = async (values) => {
    const formData = new FormData();

    const { product_list } = formValues;
    const { attachment, discount, shipping_cost, tax_rate } = values ?? {};

    const productListArray = product_list?.qty
      ? Object.keys(product_list.qty)
          .filter((product_id) => product_list.qty[product_id] !== undefined)
          .map((product_id) => ({
            product_id: parseInt(product_id),
            qty: product_list.qty[product_id],
            sale_unit_id: product_list.sale_unit_id[product_id],
            net_unit_price: product_list.net_unit_price[product_id],
            discount: product_list.discount[product_id],
            tax_rate: product_list.tax_rate[product_id],
            tax: product_list.tax[product_id],
            total: product_list.total[product_id],
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
        (acc, cur) => acc + parseFloat(cur),
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
      discount: Number(discount ?? 0).toFixed(2),
      shipping_cost: Number(shipping_cost ?? 0).toFixed(2),
      tax_rate: Number(tax_rate ?? 0).toFixed(2),
      item: productListArray.length,
      total_qty: totalQty,
      total_discount: Number(totalDiscount).toFixed(2),
      total_tax: Number(totalTax).toFixed(2),
      total_price: Number(totalPrice).toFixed(2),
      tax: Number(orderTax).toFixed(2),

      grand_total: calculateGrandTotal(
        totalPrice,
        values.tax_rate,
        discount,
        shipping_cost
      ),
      product_list: JSON.stringify(productListArray),
      _method: "PUT",
    };

    if (attachment?.[0].originFileObj) {
      postObj.attachment = attachment?.[0].originFileObj;
    }

    appendToFormData(postObj, formData);

    const { data, error } = await updateInvoice({
      id,
      data: formData,
    });

    if (data?.success) {
      dispatch(closeEditDrawer());

      setFormValues({
        product_list: {
          qty: {},
          sale_unit_id: {},
          net_unit_price: {},
          discount: {},
          tax_rate: {},
          tax: {},
          total: {},
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

  if (!id) return;
  return (
    <CustomDrawer
      title={"Edit Invoice"}
      open={isEditDrawerOpen}
      isLoading={isFetching}
      width={1400}
    >
      <QuotationForm
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

export default InvoiceEdit;
